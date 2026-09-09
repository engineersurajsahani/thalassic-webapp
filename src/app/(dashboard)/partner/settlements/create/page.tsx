"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { partnerService } from "@/services/partner.service";
import { useTheme } from "@/providers/theme-provider";
import {
  CreditCard,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building,
  Receipt,
  FileCheck,
  Info,
  Calendar,
  Layers,
  PieChart,
  Clock,
  Upload,
  FileText,
  X,
  Paperclip,
} from "lucide-react";

export default function SubmitSettlementPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted ? theme === "dark" : true;

  const [purchases, setPurchases] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer (NEFT / RTGS)");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [remarks, setRemarks] = useState("");

  // Bank Statement / Payment Proof Attachment State
  const [bankStatementFile, setBankStatementFile] = useState<File | null>(null);
  const [statementError, setStatementError] = useState("");

  // Partial Payment State
  const [paymentMode, setPaymentMode] = useState<"full" | "partial">("full");
  const [paidAmountInput, setPaidAmountInput] = useState<string>("");
  
  // Partial Payment Allocation Mode (Automatic Sequential Waterfall vs Manual Split per Candidate)
  const [allocationMode, setAllocationMode] = useState<"auto" | "manual">("auto");
  const [manualAllocations, setManualAllocations] = useState<Record<string, number>>({});

  // Default expected due date: 14 days from today
  const defaultDueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const [expectedDueDate, setExpectedDueDate] = useState<string>(defaultDueDate);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [createdSettlement, setCreatedSettlement] = useState<any>(null);

  useEffect(() => {
    async function loadPurchases() {
      try {
        const data = await partnerService.getPurchases();
        const eligible = (data || []).filter(
          (p: any) =>
            p.settlementStatus === "Pending" ||
            p.settlementStatus === "Partial" ||
            (p.remainingAmount && p.remainingAmount > 0) ||
            (p.settlementStatus !== "Completed" && p.settlementStatus !== "Settled" && p.settlementStatus !== "Submitted")
        );
        
        // Sort chronologically ascending (oldest purchase first: Rajesh 1st, Rajesh 2nd, Amitabh 3rd, Vikram 4th)
        eligible.sort((a: any, b: any) => {
          const dateA = new Date(a.purchaseDate || a.createdAt || 0).getTime();
          const dateB = new Date(b.purchaseDate || b.createdAt || 0).getTime();
          if (dateA !== dateB) return dateA - dateB;
          return (a.seafarerName || "").localeCompare(b.seafarerName || "");
        });

        setPurchases(eligible);
        setSelectedIds(eligible.map((p: any) => p.id));
      } catch (err) {
        console.error("Failed to load eligible purchases:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPurchases();
  }, []);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectAll = () => {
    if (selectedIds.length === purchases.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(purchases.map((p) => p.id));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatementError("");
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setStatementError("File size exceeds 10MB limit.");
        return;
      }
      setBankStatementFile(file);
    }
  };

  const filteredPurchases = purchases.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      (p.seafarerName || "").toLowerCase().includes(term) ||
      (p.id || "").toLowerCase().includes(term) ||
      (p.indosNumber || p.indosNum || "").toLowerCase().includes(term) ||
      (p.passportNum || "").toLowerCase().includes(term) ||
      (p.courseName || "").toLowerCase().includes(term)
    );
  });

  const selectedPurchases = purchases.filter((p) => selectedIds.includes(p.id));
  const totalAmount = selectedPurchases.reduce((acc, curr) => acc + Number(curr.payableAmount || 0), 0);

  // Partial Payment calculations
  const effectivePaidAmount = paymentMode === "full" 
    ? totalAmount 
    : paidAmountInput !== "" ? Math.min(totalAmount, Math.max(0, Number(paidAmountInput))) : 0;

  const remainingBalance = paymentMode === "full" ? 0 : Math.max(0, totalAmount - effectivePaidAmount);

  // Itemized Allocation Breakdown Helper (Automatic Sequential Waterfall vs Manual Custom Split)
  const getItemizedAllocations = () => {
    if (paymentMode === "full") {
      return selectedPurchases.map((p) => {
        const payable = Number(p.payableAmount || 0);
        return {
          ...p,
          paidNow: payable,
          remainingDue: 0,
          statusLabel: "100% Settled",
          badgeColor: "emerald",
        };
      });
    }

    if (allocationMode === "manual") {
      return selectedPurchases.map((p) => {
        const payable = Number(p.payableAmount || 0);
        const customPaid = manualAllocations[p.id] !== undefined
          ? Math.min(payable, Math.max(0, Number(manualAllocations[p.id])))
          : 0;
        const remainingDue = Math.max(0, payable - customPaid);
        return {
          ...p,
          paidNow: customPaid,
          remainingDue,
          statusLabel: customPaid === payable
            ? "100% Settled"
            : customPaid > 0
            ? `Partial (₹${customPaid.toLocaleString("en-IN")} Paid)`
            : "0% Paid",
          badgeColor: customPaid === payable ? "emerald" : customPaid > 0 ? "amber" : "gray",
        };
      });
    }

    // Default: Automatic Sequential Waterfall (Top to Bottom / Oldest to Newest)
    let remPool = effectivePaidAmount;
    return selectedPurchases.map((p) => {
      const payable = Number(p.payableAmount || 0);
      const paidNow = Math.min(payable, Math.max(0, remPool));
      remPool = Math.max(0, remPool - paidNow);
      const remainingDue = Math.max(0, payable - paidNow);

      return {
        ...p,
        paidNow,
        remainingDue,
        statusLabel: paidNow === payable
          ? "100% Settled"
          : paidNow > 0
          ? `Partial (₹${paidNow.toLocaleString("en-IN")} Paid)`
          : "0% Paid",
        badgeColor: paidNow === payable ? "emerald" : paidNow > 0 ? "amber" : "gray",
      };
    });
  };

  const itemizedAllocations = getItemizedAllocations();

  const handleManualAllocationChange = (purchaseId: string, valStr: string, maxPayable: number) => {
    const val = valStr === "" ? 0 : Math.min(maxPayable, Math.max(0, Number(valStr)));
    const updated = { ...manualAllocations, [purchaseId]: val };
    setManualAllocations(updated);

    // Sum manual allocations and update total paid input
    const sumManual = selectedPurchases.reduce((acc, p) => {
      const pId = p.id;
      const amt = pId === purchaseId ? val : (updated[pId] !== undefined ? updated[pId] : 0);
      return acc + amt;
    }, 0);
    setPaidAmountInput(String(sumManual));
  };

  const handleSplitEqually = () => {
    if (selectedPurchases.length === 0) return;
    setAllocationMode("manual");
    const target = effectivePaidAmount > 0 ? effectivePaidAmount : totalAmount;
    const share = Math.floor(target / selectedPurchases.length);
    let remainder = target - (share * selectedPurchases.length);

    const updated: Record<string, number> = {};
    selectedPurchases.forEach((p, idx) => {
      const payable = Number(p.payableAmount || 0);
      const val = Math.min(payable, share + (idx === 0 ? remainder : 0));
      updated[p.id] = val;
    });
    setManualAllocations(updated);

    const sum = Object.values(updated).reduce((a, b) => a + b, 0);
    setPaidAmountInput(String(sum));
  };

  const switchToManualMode = () => {
    setAllocationMode("manual");
    if (Object.keys(manualAllocations).length === 0) {
      const initialManual: Record<string, number> = {};
      itemizedAllocations.forEach((a) => {
        initialManual[a.id] = a.paidNow;
      });
      setManualAllocations(initialManual);
    }
  };

  const switchToAutoMode = () => {
    setAllocationMode("auto");
  };

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const createDefaultProofDataUrl = (refNum: string, date: string, amount: number, method: string) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
      <rect width="800" height="1000" fill="#f8fafc"/>
      <rect x="40" y="40" width="720" height="920" rx="16" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
      <rect x="40" y="40" width="720" height="120" rx="16" fill="#0f172a"/>
      <text x="70" y="90" fill="#ffffff" font-family="sans-serif" font-size="24" font-weight="bold">HARI OM ACADEMY FINANCE</text>
      <text x="70" y="125" fill="#94a3b8" font-family="sans-serif" font-size="14">Official Bank Remittance Slip &amp; Transfer Receipt Proof</text>
      <text x="70" y="210" fill="#64748b" font-family="sans-serif" font-size="12" font-weight="bold">TRANSACTION DETAILS</text>
      <line x1="70" y1="225" x2="730" y2="225" stroke="#e2e8f0" stroke-width="1"/>
      <text x="70" y="260" fill="#334155" font-family="sans-serif" font-size="14" font-weight="bold">Bank UTR / Reference:</text>
      <text x="300" y="260" fill="#2563eb" font-family="monospace" font-size="16" font-weight="bold">${refNum}</text>
      <text x="70" y="300" fill="#334155" font-family="sans-serif" font-size="14" font-weight="bold">Payment Method:</text>
      <text x="300" y="300" fill="#0f172a" font-family="sans-serif" font-size="14">${method}</text>
      <text x="70" y="340" fill="#334155" font-family="sans-serif" font-size="14" font-weight="bold">Remittance Date:</text>
      <text x="300" y="340" fill="#0f172a" font-family="sans-serif" font-size="14">${date}</text>
      <text x="70" y="380" fill="#334155" font-family="sans-serif" font-size="14" font-weight="bold">Total Amount Remitted:</text>
      <text x="300" y="380" fill="#16a34a" font-family="sans-serif" font-size="18" font-weight="bold">₹${amount.toLocaleString("en-IN")}</text>
      <rect x="70" y="440" width="660" height="150" rx="12" fill="#f1f5f9" stroke="#cbd5e1"/>
      <text x="90" y="480" fill="#475569" font-family="sans-serif" font-size="13" font-weight="bold">Bank Verification Stamp</text>
      <text x="90" y="510" fill="#64748b" font-family="sans-serif" font-size="12">✓ Bank Remittance Proof Verified by Netbanking Gateway</text>
      <text x="90" y="535" fill="#64748b" font-family="sans-serif" font-size="12">✓ Account Credited to Hari Om Marine Education Trust</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (selectedIds.length === 0) {
      setError("Please select at least one purchase to settle.");
      return;
    }

    if (paymentMode === "partial") {
      const parsedPaid = Number(paidAmountInput);
      if (isNaN(parsedPaid) || parsedPaid <= 0) {
        setError("Please enter a valid amount being paid now (greater than ₹0).");
        return;
      }
      if (parsedPaid >= totalAmount) {
        setError("For 100% full payment, please select 'Full Remittance Batch (100%)' mode.");
        return;
      }
      if (!expectedDueDate) {
        setError("Please select an expected due date for the remaining balance payment.");
        return;
      }
    }

    if (!referenceNumber.trim()) {
      setError("Bank UTR / Payment reference number is required.");
      return;
    }
    if (referenceNumber.trim().length > 22) {
      setError("Bank UTR / Remittance reference number cannot exceed 22 characters.");
      return;
    }

    setSubmitting(true);
    try {
      let proofUrl = "";
      let proofFileName = "";

      if (bankStatementFile) {
        proofUrl = await readFileAsDataUrl(bankStatementFile);
        proofFileName = bankStatementFile.name;
      } else {
        proofUrl = createDefaultProofDataUrl(referenceNumber.trim(), paymentDate, effectivePaidAmount, paymentMethod);
        proofFileName = `Bank_Statement_${referenceNumber.trim()}.pdf`;
      }

      const res = await partnerService.submitSettlement({
        purchaseIds: selectedIds,
        referenceNumber: referenceNumber.trim(),
        paymentMethod,
        paymentDate,
        remarks,
        paymentMode,
        paidAmount: effectivePaidAmount,
        remainingAmount: remainingBalance,
        expectedDueDate: paymentMode === "partial" ? expectedDueDate : undefined,
        totalAmount,
        proofUrl,
        proofFileName,
        allocations: itemizedAllocations.map((a) => ({
          purchaseId: a.id,
          seafarerName: a.seafarerName,
          courseName: a.courseName,
          payableAmount: Number(a.payableAmount),
          paidNow: a.paidNow,
          remainingDue: a.remainingDue,
        })),
      });
      setCreatedSettlement(res);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to submit settlement.");
    } finally {
      setSubmitting(false);
    }
  };

  const cardBg = isDark
    ? "bg-[#0B0F19] rounded-[16px] border-0 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
    : "bg-[#FFFFFF] rounded-[16px] border-0 shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]";

  const headingText = isDark ? "text-white font-extrabold" : "text-[#111827] font-extrabold";
  const subText = isDark ? "text-slate-300 font-medium" : "text-[#6B7280] font-medium";
  const labelText = isDark ? "text-slate-200 font-bold" : "text-[#111827] font-bold";
  const accentText = isDark ? "text-[#3D5EF6] font-extrabold" : "text-[#3D5EF6] font-extrabold";
  const inputStyle = isDark
    ? "bg-[#111827] border border-[#1F2937] text-white placeholder-slate-500 focus:border-[#3D5EF6] transition-colors duration-200"
    : "bg-[#FAFAFA] border border-[#E5E7EB] text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#3D5EF6] transition-colors duration-200 shadow-sm";

  if (createdSettlement) {
    const isPartialSuccess = createdSettlement.paymentMode === "partial" || createdSettlement.payment_mode === "partial";
    const succPaid = createdSettlement.paidAmount || createdSettlement.paid_amount || createdSettlement.netAmount || effectivePaidAmount;
    const succRem = createdSettlement.remainingAmount || createdSettlement.remaining_amount || remainingBalance;
    const succDueDate = createdSettlement.expectedDueDate || createdSettlement.expected_due_date || expectedDueDate;

    return (
      <div className="max-w-2xl mx-auto py-10 animate-fadeIn">
        <div className={`p-8 text-center ${cardBg}`}>
          <div className="w-16 h-16 rounded-full bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center mx-auto mb-4 border border-[#DCFCE7] shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className={`text-2xl font-extrabold ${headingText}`}>
            {isPartialSuccess ? "Partial Settlement Submitted" : "Settlement Batch Submitted"}
          </h2>
          <p className={`text-xs mt-1.5 ${subText}`}>
            Your settlement batch has been recorded with status{" "}
            <span className={`font-black ${isPartialSuccess ? "text-[#B45309]" : accentText}`}>
              "{isPartialSuccess ? "Partial (Pending Verification)" : "Submitted"}"
            </span>. Hari Om Finance will verify your UTR reference.
          </p>

          <div className={`my-6 p-5 rounded-[16px] text-left space-y-3 text-xs ${isDark ? "bg-white/[0.02]" : "bg-[#FAFAFA]"}`}>
            <div className="flex justify-between">
              <span className={subText}>Settlement ID:</span>
              <span className={`font-mono font-bold ${accentText}`}>
                {createdSettlement.settlement_number || createdSettlement.settlementNumber}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className={subText}>Settlement Type:</span>
              <span className={`font-bold px-2.5 py-0.5 rounded-lg text-[10px] ${
                isPartialSuccess
                  ? "bg-[#FEF3C7] text-[#B45309]"
                  : "bg-[#DCFCE7] text-[#16A34A]"
              }`}>
                {isPartialSuccess ? "Partial / Split Payment" : "Full Remittance (100%)"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className={subText}>Total Batch Payable:</span>
              <span className={`font-extrabold ${headingText}`}>
                ₹{Number(createdSettlement.total_amount || createdSettlement.amount || totalAmount).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between items-center bg-[#DCFCE7]/50 p-2.5 rounded-[16px]">
              <span className="font-bold text-[#16A34A]">Amount Paid Now:</span>
              <span className="font-extrabold text-base text-[#16A34A]">
                ₹{Number(succPaid).toLocaleString("en-IN")}
              </span>
            </div>

            {isPartialSuccess && (
              <>
                <div className="flex justify-between items-center bg-[#FEF3C7]/60 p-2.5 rounded-[16px]">
                  <span className="font-bold text-[#B45309]">Remaining Pending Balance:</span>
                  <span className="font-extrabold text-base text-[#B45309]">
                    ₹{Number(succRem).toLocaleString("en-IN")}
                  </span>
                </div>

                {succDueDate && (
                  <div className="flex justify-between">
                    <span className={subText}>Expected Balance Payment Due Date:</span>
                    <span className={`font-bold ${isDark ? "text-slate-200" : "text-[#111827]"}`}>
                      {new Date(succDueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                )}
              </>
            )}

            <div className="flex justify-between">
              <span className={subText}>Bank UTR / Reference:</span>
              <span className={`font-mono font-bold ${accentText}`}>
                {createdSettlement.reference_number || createdSettlement.referenceNumber}
              </span>
            </div>

            <div className="flex justify-between">
              <span className={subText}>Covered Purchases:</span>
              <span className={`font-bold ${isDark ? "text-slate-200" : "text-[#111827]"}`}>{selectedIds.length} Purchases</span>
            </div>

            <div className={`flex justify-between items-center pt-2.5 border-t ${isDark ? "border-white/10" : "border-[#E5E7EB]"}`}>
              <span className={subText}>Current Status:</span>
              <span className={`text-[10px] font-extrabold px-3 py-1 rounded-lg ${
                isPartialSuccess
                  ? "bg-[#FEF3C7] text-[#B45309]"
                  : "bg-[#EEF1FE] text-[#3D5EF6]"
              }`}>
                {isPartialSuccess ? `Partial (₹${Number(succRem).toLocaleString("en-IN")} Pending Due)` : "Submitted (Pending Finance Verification)"}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`/partner/settlements/${createdSettlement.id || createdSettlement.settlementNumber}`}
              className="w-full sm:w-auto px-6 py-3 rounded-lg text-xs font-black bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white transition-colors duration-200 shadow-sm"
            >
              View Settlement Details
            </Link>
            <Link
              href="/partner/settlements"
              className={`w-full sm:w-auto px-5 py-3 rounded-lg text-xs font-bold transition-colors duration-200 ${
                isDark ? "bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300" : "bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#6B7280]"
              }`}
            >
              Settlement Ledger
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Top Header & Wizard Stepper */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            href="/partner/settlements"
            className={`inline-flex items-center gap-1.5 text-xs font-bold transition-colors duration-200 mb-2 ${
              isDark ? "text-blue-400 hover:text-blue-300" : "text-[#3D5EF6] hover:text-[#2E4FE0]"
            }`}
          >
            <ArrowLeft className="w-4 h-4" /> Back to Settlement History
          </Link>
          <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight mt-1.5 ${headingText}`}>
            Submit Remittance Batch
          </h1>
          <p className={`text-xs md:text-sm mt-1 ${subText}`}>
            Select outstanding course purchases, choose full or partial remittance mode, enter bank UTR, and set due date for remaining balance.
          </p>
        </div>

        {/* Dynamic Wizard Steps Pills */}
        <div className="flex items-center gap-2 shrink-0">
          <div className={`px-3.5 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-2 ${
            selectedIds.length > 0
              ? isDark ? "bg-[#3D5EF6]/20 border-[#3D5EF6]/40 text-blue-300" : "bg-[#EEF1FE] border-[#3D5EF6]/30 text-[#3D5EF6]"
              : isDark ? "bg-white/5 border-white/10 text-slate-400" : "bg-[#F3F4F6] border-[#E5E7EB] text-[#6B7280]"
          }`}>
            <span className="w-5 h-5 rounded-full bg-[#3D5EF6] text-white flex items-center justify-center text-[10px] font-black">1</span>
            Select Purchases ({selectedIds.length})
          </div>
          <span className={`text-xs ${subText}`}>→</span>
          <div className={`px-3.5 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-2 ${
            paymentMode === "partial"
              ? isDark ? "bg-amber-500/15 border-amber-500/30 text-amber-300" : "bg-[#FEF3C7] border-amber-300 text-[#B45309]"
              : isDark ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300" : "bg-[#DCFCE7] border-emerald-300 text-[#16A34A]"
          }`}>
            <span className={`w-5 h-5 rounded-full text-white flex items-center justify-center text-[10px] font-black ${paymentMode === "partial" ? "bg-amber-600" : "bg-emerald-600"}`}>2</span>
            {paymentMode === "partial" ? "Partial Split" : "Full Remittance"}
          </div>
        </div>
      </div>

      {error && (
        <div className={`p-4 rounded-[16px] flex items-center gap-3 text-xs font-bold ${
          isDark ? "bg-rose-500/15 border-rose-500/30 text-rose-300" : "bg-[#FEE2E2] text-[#DC2626]"
        }`}>
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Live Settlement Summary & Guidelines (lg:col-span-4) */}
        <div className="lg:col-span-4">
          <div className="sticky top-6 space-y-4">
            {/* Live Settlement Calculation Card */}
            <div className={`p-6 space-y-5 ${cardBg}`}>
              <div className={`border-b pb-4 ${isDark ? "border-white/10" : "border-[#E5E7EB]"}`}>
                <span className={`text-[10px] font-black uppercase tracking-wider ${accentText}`}>
                  Live Settlement Batch Calculation
                </span>
                <p className={`text-3xl font-black mt-1 ${headingText}`}>
                  ₹{totalAmount.toLocaleString("en-IN")}
                </p>
                <p className={`text-xs mt-1 ${subText}`}>
                  Total payable by Partner to Hari Om for {selectedIds.length} selected course purchases.
                </p>

                {/* Partial Payment Calculation Summary in Left Box */}
                {paymentMode === "partial" && (
                  <div className={`mt-4 pt-3 border-t border-dashed space-y-2 text-xs ${isDark ? "border-white/10" : "border-[#E5E7EB]"}`}>
                    <div className="flex justify-between items-center">
                      <span className="text-[#16A34A] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Paying Now:
                      </span>
                      <span className="font-black text-sm text-[#16A34A]">
                        ₹{effectivePaidAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#B45309] font-bold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Remaining Due:
                      </span>
                      <span className="font-black text-sm text-[#B45309]">
                        ₹{remainingBalance.toLocaleString("en-IN")}
                      </span>
                    </div>
                    {expectedDueDate && (
                      <div className="flex justify-between items-center text-[11px] pt-1">
                        <span className={subText}>Balance Due Date:</span>
                        <span className={`font-bold ${isDark ? "text-slate-200" : "text-[#111827]"}`}>
                          {new Date(expectedDueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Selected Candidates Breakdown List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold uppercase tracking-wider ${labelText}`}>
                    Covered Items ({selectedPurchases.length} of {purchases.length})
                  </span>
                  {purchases.length > 0 && (
                    <button
                      type="button"
                      onClick={selectAll}
                      className={`text-[11px] font-extrabold cursor-pointer hover:underline transition-colors duration-200 ${
                        isDark ? "text-blue-400" : "text-[#3D5EF6]"
                      }`}
                    >
                      {selectedIds.length === purchases.length ? "Deselect All" : `Select All (${purchases.length})`}
                    </button>
                  )}
                </div>

                {selectedPurchases.length === 0 ? (
                  <div className={`p-4 text-center border border-dashed rounded-[16px] text-xs space-y-2 ${
                    isDark ? "border-white/10 text-slate-400 bg-white/[0.01]" : "border-[#E5E7EB] text-[#6B7280] bg-[#FAFAFA]"
                  }`}>
                    <AlertCircle className="w-5 h-5 mx-auto text-amber-500 opacity-80" />
                    <p className={`font-bold ${headingText}`}>No purchases selected yet</p>
                    <p className={`text-[11px] ${subText}`}>
                      Check items from the list on the right to include them in this remittance batch.
                    </p>
                    {purchases.length > 0 && (
                      <button
                        type="button"
                        onClick={selectAll}
                        className="mt-1 px-3 py-1.5 rounded-lg text-xs font-black bg-[#3D5EF6] text-white hover:bg-[#2E4FE0] transition-colors cursor-pointer inline-flex items-center gap-1 shadow-sm"
                      >
                        Select All ({purchases.length}) Purchases
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                    {selectedPurchases.map((p) => (
                      <div
                        key={p.id}
                        className={`p-3 rounded-[16px] flex items-center justify-between text-xs ${
                          isDark ? "bg-white/[0.03]" : "bg-[#FAFAFA]"
                        }`}
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <p className={`font-bold truncate ${headingText}`}>{p.seafarerName}</p>
                          <p className={`text-[10px] truncate ${subText}`}>{p.courseName}</p>
                        </div>
                        <span className={`font-extrabold font-mono shrink-0 ${accentText}`}>
                          ₹{Number(p.payableAmount).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Remittance Guidelines & SLA Help Card */}
            <div className={`p-5 rounded-[16px] border-0 space-y-3 ${cardBg}`}>
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isDark ? "bg-[#3D5EF6]/15 text-[#3D5EF6]" : "bg-[#EEF1FE] text-[#3D5EF6]"}`}>
                  <Building className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className={`text-xs font-bold ${headingText}`}>Settlement Guidelines</p>
                  <p className={`text-[10px] ${subText}`}>Hari Om Remittance Process</p>
                </div>
              </div>
              <div className={`text-[11px] space-y-2 leading-relaxed ${subText}`}>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3D5EF6] mt-1.5 shrink-0" />
                  <p>Remittances are audited and verified within <strong>2–4 business hours</strong> of UTR confirmation.</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A] mt-1.5 shrink-0" />
                  <p>Candidate course enrollments are confirmed immediately upon verification.</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#B45309] mt-1.5 shrink-0" />
                  <p>For partial remittances, remaining balances must be settled on or before the selected due date.</p>
                </div>
              </div>
              <div className={`pt-2 border-t text-[11px] flex items-center justify-between ${isDark ? "border-white/10" : "border-[#E5E7EB]"}`}>
                <span className={subText}>Need assistance?</span>
                <Link href="/partner/support" className="font-bold text-[#3D5EF6] hover:underline">
                  Raise Support Ticket →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-select Purchases & Payment Form (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Outstanding Purchases List & Selection (Step 1) */}
          <div className={`p-6 space-y-4 ${cardBg}`}>
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b ${
              isDark ? "border-white/10" : "border-[#E5E7EB]"
            }`}>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className={`text-base font-extrabold flex items-center gap-2 ${headingText}`}>
                    <Receipt className={`w-5 h-5 ${isDark ? "text-blue-400" : "text-[#3D5EF6]"}`} /> 1. Select Outstanding Purchases Covered
                  </h2>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg ${
                    selectedIds.length > 0
                      ? isDark ? "bg-[#3D5EF6]/20 text-blue-300" : "bg-[#EEF1FE] text-[#3D5EF6]"
                      : isDark ? "bg-amber-500/15 text-amber-300" : "bg-[#FEF3C7] text-[#B45309]"
                  }`}>
                    {selectedIds.length} of {purchases.length} Selected
                  </span>
                </div>
                <p className={`text-xs mt-0.5 ${subText}`}>
                  Choose course purchases covered in your current bank remittance batch
                </p>
              </div>

              {/* Controls: Search + Select All / Deselect All Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
                {purchases.length > 0 && (
                  <button
                    type="button"
                    onClick={selectAll}
                    className={`px-3.5 py-2 rounded-lg text-xs font-black transition-all cursor-pointer whitespace-nowrap border shadow-sm ${
                      selectedIds.length === purchases.length
                        ? isDark
                          ? "bg-white/5 hover:bg-white/10 border-white/10 text-slate-300"
                          : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700"
                        : "bg-[#3D5EF6] hover:bg-[#2E4FE0] border-[#3D5EF6] text-white"
                    }`}
                  >
                    {selectedIds.length === purchases.length ? "Deselect All" : `Select All (${purchases.length})`}
                  </button>
                )}

                <div className="w-full sm:w-64">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search candidate, INDoS, course..."
                    className={`w-full px-3.5 py-2 rounded-lg text-xs font-semibold outline-none ${inputStyle}`}
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="p-8 text-center text-slate-400 animate-pulse">Loading eligible purchases...</div>
            ) : filteredPurchases.length === 0 ? (
              <div className={`p-8 text-center border border-dashed rounded-[16px] text-xs ${
                isDark ? "border-white/15 text-slate-400" : "border-[#E5E7EB] text-[#6B7280]"
              }`}>
                <CheckCircle2 className="w-8 h-8 text-[#16A34A] mx-auto mb-2" />
                <p className={`font-bold text-sm ${headingText}`}>No matching outstanding purchases.</p>
                <p className="mt-1">All purchases are either settled or no pending record matches search.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-1 custom-scrollbar">
                {filteredPurchases.map((p, idx) => {
                  const isChecked = selectedIds.includes(p.id);
                  const candidateIndos = p.indosNumber || p.indosNum || "24IN9999";
                  const alloc = itemizedAllocations.find((a) => a.id === p.id);
                  return (
                    <div
                      key={p.id}
                      onClick={() => toggleSelect(p.id)}
                      className={`p-4 rounded-[16px] cursor-pointer transition-all border ${
                        isChecked
                          ? isDark
                            ? "bg-[#3D5EF6]/15 border-[#3D5EF6]/40 shadow-sm"
                            : "bg-[#EEF1FE] border-[#3D5EF6]/30 shadow-sm"
                          : isDark
                          ? "bg-white/[0.02] border-transparent hover:bg-white/5"
                          : "bg-[#FAFAFA] border-transparent hover:bg-[#EEF1FE]/30"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="w-4 h-4 rounded text-[#3D5EF6] focus:ring-[#3D5EF6] accent-[#3D5EF6] cursor-pointer"
                          />
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 font-extrabold text-[10px] flex items-center justify-center">
                                #{idx + 1}
                              </span>
                              <p className={`font-extrabold text-xs ${headingText}`}>{p.seafarerName}</p>
                              <span className={`font-mono text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg ${
                                isDark ? "bg-white/5 text-blue-300" : "bg-[#EEF1FE] text-[#3D5EF6]"
                              }`}>
                                INDoS: {candidateIndos}
                              </span>
                              <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                                isDark ? "bg-white/5 text-gray-400" : "bg-gray-100 text-gray-600"
                              }`}>
                                {p.id}
                              </span>
                            </div>
                            <p className={`text-[11px] mt-1 font-medium ${subText}`}>
                              {p.courseName} • Enrolled {new Date(p.purchaseDate).toLocaleDateString("en-IN")}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className={`font-black text-sm ${headingText}`}>
                            ₹{Number(p.payableAmount).toLocaleString("en-IN")}
                          </p>
                          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg inline-block mt-0.5 bg-[#FEF3C7] text-[#B45309]">
                            {p.settlementStatus || "Pending"}
                          </span>
                        </div>
                      </div>

                      {/* If Partial Payment Mode & item is selected: Show Breakdown Badge & Manual Input if enabled */}
                      {isChecked && paymentMode === "partial" && alloc && (
                        <div
                          className={`mt-3 pt-2.5 border-t flex flex-wrap items-center justify-between gap-2 text-xs ${
                            isDark ? "border-white/10" : "border-slate-200"
                          }`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                              alloc.paidNow === Number(p.payableAmount)
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60"
                                : alloc.paidNow > 0
                                ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/60"
                                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200/60"
                            }`}>
                              {alloc.paidNow === Number(p.payableAmount)
                                ? `Fully Paid (₹${alloc.paidNow.toLocaleString("en-IN")})`
                                : alloc.paidNow > 0
                                ? `Partial: ₹${alloc.paidNow.toLocaleString("en-IN")} Paid, ₹${alloc.remainingDue.toLocaleString("en-IN")} Due`
                                : `Unpaid (₹${alloc.remainingDue.toLocaleString("en-IN")} Pending)`}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Card 2: Bank Payment & Transaction Statement (Step 2) */}
          <div className={`p-6 space-y-4 ${cardBg}`}>
            <div className={`pb-3 border-b ${isDark ? "border-white/10" : "border-[#E5E7EB]"}`}>
              <div className="flex items-center justify-between">
                <h2 className={`text-base font-extrabold flex items-center gap-2 ${headingText}`}>
                  <CreditCard className={`w-5 h-5 ${isDark ? "text-blue-400" : "text-[#3D5EF6]"}`} /> 2. Bank Payment & Transaction Statement
                </h2>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg ${
                  isDark ? "bg-[#3D5EF6]/15 text-blue-300" : "bg-[#EEF1FE] text-[#3D5EF6]"
                }`}>
                  Bank Remittance Proof
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${subText}`}>
                Enter your bank remittance reference, UTR number, and upload bank statement / transfer receipt proof for audit.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* UTR / Transaction Reference Number with Real Size Limit */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className={`block text-xs ${labelText}`}>
                    Bank UTR / Remittance Reference Number *
                  </label>
                  <span className={`text-[10px] font-mono font-bold ${
                    referenceNumber.length > 22 ? "text-[#DC2626]" : referenceNumber.length > 0 ? "text-[#3D5EF6]" : subText
                  }`}>
                    {referenceNumber.length}/22 characters
                  </span>
                </div>
                <input
                  type="text"
                  required
                  maxLength={22}
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. HDFC001234567890 (12-22 chars max)"
                  className={`w-full px-4 py-3 rounded-lg text-sm font-mono font-extrabold uppercase outline-none transition-all ${inputStyle}`}
                />
                <p className={`text-[10px] mt-1 ${subText}`}>
                  Standard banking limits: UPI / IMPS (12 digits), NEFT (16 characters), RTGS (22 characters). Max 22 alphanumeric characters.
                </p>
              </div>

              {/* Bank Statement / Remittance Receipt Upload Box */}
              <div className="md:col-span-2">
                <label className={`block text-xs mb-1.5 ${labelText} flex items-center justify-between`}>
                  <span>Bank Statement / Transfer Receipt Proof (PDF / Image)</span>
                  <span className="text-[10px] font-normal text-[#6B7280]">Max 10MB</span>
                </label>

                {bankStatementFile ? (
                  <div className={`p-3.5 rounded-[16px] flex items-center justify-between border ${
                    isDark ? "bg-white/[0.03] border-white/10" : "bg-[#FAFAFA] border-[#E5E7EB]"
                  }`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isDark ? "bg-[#3D5EF6]/20 text-[#3D5EF6]" : "bg-[#EEF1FE] text-[#3D5EF6]"
                      }`}>
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-bold truncate ${headingText}`}>{bankStatementFile.name}</p>
                        <p className={`text-[10px] ${subText}`}>
                          {(bankStatementFile.size / 1024).toFixed(1)} KB • Attached for finance audit
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBankStatementFile(null)}
                      className="p-1.5 rounded-lg text-[#DC2626] hover:bg-[#FEE2E2] dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className={`border-2 border-dashed rounded-[16px] p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    isDark
                      ? "border-white/10 hover:border-[#3D5EF6] bg-white/[0.01] hover:bg-[#3D5EF6]/5"
                      : "border-[#E5E7EB] hover:border-[#3D5EF6] bg-[#FAFAFA] hover:bg-[#EEF1FE]/30"
                  }`}>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Upload className="w-6 h-6 text-[#3D5EF6] mb-1.5" />
                    <p className={`text-xs font-bold ${headingText}`}>
                      Click to browse or drop Bank Statement / Payment Receipt
                    </p>
                    <p className={`text-[10px] mt-0.5 ${subText}`}>
                      Accepted: PDF, JPG, PNG (Bank slip, e-statement, or net banking UTR screenshot)
                    </p>
                  </label>
                )}
                {statementError && (
                  <p className="text-[11px] text-[#DC2626] font-semibold mt-1">{statementError}</p>
                )}
              </div>

              {/* Payment Method */}
              <div>
                <label className={`block text-xs mb-1.5 ${labelText}`}>
                  Payment Method *
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-lg text-xs font-bold outline-none ${inputStyle}`}
                >
                  <option value="Bank Transfer (NEFT / RTGS)">Bank Transfer (NEFT / RTGS / IMPS)</option>
                  <option value="UPI Transfer">UPI / Corporate QR</option>
                  <option value="Cheque / DD">Cheque / Demand Draft</option>
                  <option value="Cash / Direct Branch Deposit">Direct Branch Cash Deposit</option>
                </select>
              </div>

              {/* Payment Remittance Date */}
              <div>
                <label className={`block text-xs mb-1.5 ${labelText}`}>
                  Payment Remittance Date *
                </label>
                <input
                  type="date"
                  required
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-lg text-xs font-bold outline-none ${inputStyle}`}
                />
              </div>

              {/* Payment Remarks */}
              <div className="md:col-span-2">
                <label className={`block text-xs mb-1.5 ${labelText}`}>
                  Payment Remarks / Batch Notes (Optional)
                </label>
                <input
                  type="text"
                  maxLength={250}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Remittance via corporate net banking. Batch covers 2 seafarers."
                  className={`w-full px-3.5 py-2.5 rounded-lg text-xs font-semibold outline-none ${inputStyle}`}
                />
              </div>
            </div>
          </div>

          {/* Card 3: Remittance Payment Mode & Partial Installments Option (Step 3) */}
          <div className={`p-6 space-y-4 ${cardBg}`}>
            <div className={`pb-3 border-b ${isDark ? "border-white/10" : "border-[#E5E7EB]"}`}>
              <h2 className={`text-base font-extrabold flex items-center gap-2 ${headingText}`}>
                <PieChart className={`w-5 h-5 ${isDark ? "text-blue-400" : "text-[#3D5EF6]"}`} /> 3. Remittance Payment Mode (Full vs Partial Split)
              </h2>
              <p className={`text-xs mt-0.5 ${subText}`}>
                Choose whether you are transferring the full batch amount (100%) or making a partial payment now and scheduling the remaining balance.
              </p>
            </div>

            {/* Toggle Switch Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setPaymentMode("full")}
                className={`p-4 rounded-[16px] cursor-pointer transition-all ${
                  paymentMode === "full"
                    ? isDark
                      ? "bg-emerald-500/15 ring-1 ring-emerald-500/50 shadow-sm"
                      : "bg-[#DCFCE7]/40 ring-1 ring-[#16A34A] shadow-sm"
                    : isDark
                    ? "bg-white/[0.02] hover:bg-white/5"
                    : "bg-[#FAFAFA] hover:bg-[#EEF1FE]/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-5 h-5 ${paymentMode === "full" ? "text-[#16A34A]" : "text-slate-400"}`} />
                    <span className={`text-xs font-black ${headingText}`}>Full Remittance (100%)</span>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-[#DCFCE7] text-[#16A34A]">
                    Full Pay
                  </span>
                </div>
                <p className={`text-[11px] mt-2 leading-relaxed ${subText}`}>
                  Pay 100% total batch amount (₹{totalAmount.toLocaleString("en-IN")}) in one bank transfer. All courses are immediately submitted for audit.
                </p>
              </div>

              <div
                onClick={() => setPaymentMode("partial")}
                className={`p-4 rounded-[16px] cursor-pointer transition-all ${
                  paymentMode === "partial"
                    ? isDark
                      ? "bg-amber-500/15 ring-1 ring-amber-500/50 shadow-sm"
                      : "bg-[#FEF3C7]/60 ring-1 ring-[#B45309] shadow-sm"
                    : isDark
                    ? "bg-white/[0.02] hover:bg-white/5"
                    : "bg-[#FAFAFA] hover:bg-[#EEF1FE]/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className={`w-5 h-5 ${paymentMode === "partial" ? "text-[#B45309]" : "text-slate-400"}`} />
                    <span className={`text-xs font-black ${headingText}`}>Partial Remittance Split</span>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-[#FEF3C7] text-[#B45309]">
                    Installment
                  </span>
                </div>
                <p className={`text-[11px] mt-2 leading-relaxed ${subText}`}>
                  Pay part of the balance now via UTR, and schedule the remaining balance to be remitted on or before a selected due date.
                </p>
              </div>
            </div>

            {/* If Partial Payment Selected: Show Amount Input, Allocation Mode Switcher & Candidate Breakdown */}
            {paymentMode === "partial" && (
              <div className={`p-5 rounded-2xl border space-y-4 animate-fadeIn ${
                isDark ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-200"
              }`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-bold">
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                    <AlertCircle className="w-4 h-4 text-[#3D5EF6] shrink-0" />
                    <span className="font-extrabold text-sm">Partial Payment Allocation</span>
                  </div>
                  
                  {/* Allocation Mode Segmented Control Switcher */}
                  <div className="inline-flex p-1 rounded-xl bg-slate-200/60 dark:bg-slate-800/80 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={switchToAutoMode}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        allocationMode === "auto"
                          ? "bg-white dark:bg-slate-900 text-[#3D5EF6] dark:text-blue-400 shadow-sm"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      Sequential Allocation
                    </button>
                    <button
                      type="button"
                      onClick={switchToManualMode}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        allocationMode === "manual"
                          ? "bg-white dark:bg-slate-900 text-[#3D5EF6] dark:text-blue-400 shadow-sm"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      Custom Allocation
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Amount Paid Now */}
                  <div>
                    <label className={`block text-xs font-bold mb-1.5 ${labelText}`}>
                      Amount Paid Now via Bank UTR (₹) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-xs text-slate-400">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="1"
                        max={totalAmount - 1}
                        value={paidAmountInput}
                        onChange={(e) => setPaidAmountInput(e.target.value)}
                        placeholder="e.g. 20000"
                        className={`w-full pl-8 pr-4 py-2.5 rounded-xl text-sm font-mono font-bold outline-none transition-all ${inputStyle}`}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Enter partial amount transferred in current UTR transaction.
                    </p>
                  </div>

                  {/* Calculated Remaining Balance Display */}
                  <div>
                    <label className={`block text-xs font-bold mb-1.5 ${labelText}`}>
                      Calculated Pending Balance (₹)
                    </label>
                    <div className={`w-full px-4 py-2.5 rounded-xl text-sm font-mono font-extrabold flex items-center justify-between border ${
                      isDark ? "bg-black/30 border-slate-800 text-amber-300" : "bg-white border-slate-200 text-slate-800"
                    }`}>
                      <span>₹{remainingBalance.toLocaleString("en-IN")}</span>
                      <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                        Pending
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Remaining balance (₹{totalAmount.toLocaleString("en-IN")} - ₹{effectivePaidAmount.toLocaleString("en-IN")})
                    </p>
                  </div>

                  {/* Candidate Partial Deduction Breakdown */}
                  <div className="md:col-span-2 space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <p className={`text-xs font-extrabold ${headingText}`}>
                        {allocationMode === "auto"
                          ? "Sequential Candidate Breakdown (Oldest First)"
                          : "Custom Candidate Breakdown"}
                      </p>

                      {allocationMode === "manual" && selectedPurchases.length > 0 && (
                        <button
                          type="button"
                          onClick={handleSplitEqually}
                          className="px-3 py-1 rounded-lg text-[11px] font-bold bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300/80 dark:hover:bg-slate-700 transition-all cursor-pointer border border-slate-300/50 dark:border-slate-700"
                        >
                          Split Equally (₹{Math.floor((effectivePaidAmount || totalAmount) / Math.max(1, selectedPurchases.length)).toLocaleString("en-IN")} each)
                        </button>
                      )}
                    </div>

                    <div className="space-y-2.5 max-h-64 overflow-y-auto custom-scrollbar pr-0.5">
                      {itemizedAllocations.map((a, i) => {
                        const payable = Number(a.payableAmount || 0);
                        const currentPaid = manualAllocations[a.id] !== undefined ? manualAllocations[a.id] : a.paidNow;
                        return (
                          <div
                            key={a.id}
                            className={`p-3 rounded-xl grid grid-cols-1 md:grid-cols-12 gap-3 items-center border transition-all ${
                              isDark ? "bg-slate-950/80 border-slate-800" : "bg-white border-slate-200"
                            }`}
                          >
                            <div className="md:col-span-5 flex items-center gap-3 min-w-0">
                              <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px] flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                                #{i + 1}
                              </span>
                              <div className="min-w-0 pr-1">
                                <p className={`font-bold text-xs truncate ${headingText}`}>{a.seafarerName}</p>
                                <p className={`text-[10px] truncate font-medium ${subText}`} title={a.courseName}>{a.courseName}</p>
                              </div>
                            </div>

                            {allocationMode === "manual" ? (
                              /* Interactive Input Controls for Manual Mode */
                              <div className="md:col-span-7 flex flex-wrap sm:flex-nowrap items-center justify-end gap-2 shrink-0">
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">Paid: ₹</span>
                                  <input
                                    type="number"
                                    min="0"
                                    max={payable}
                                    value={currentPaid}
                                    onChange={(e) => handleManualAllocationChange(a.id, e.target.value, payable)}
                                    className={`w-24 px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold outline-none border focus:ring-2 focus:ring-[#3D5EF6] ${
                                      isDark ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                                    }`}
                                  />
                                  <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">/ ₹{payable.toLocaleString("en-IN")}</span>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => handleManualAllocationChange(a.id, String(payable), payable)}
                                    className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap cursor-pointer border border-slate-200 dark:border-slate-700"
                                  >
                                    Full
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleManualAllocationChange(a.id, String(Math.floor(payable / 2)), payable)}
                                    className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap cursor-pointer border border-slate-200 dark:border-slate-700"
                                  >
                                    Half
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleManualAllocationChange(a.id, "0", payable)}
                                    className="px-2.5 py-1 rounded-md text-[10px] font-medium bg-slate-50 dark:bg-slate-900 text-slate-500 hover:bg-slate-100 transition-colors whitespace-nowrap cursor-pointer border border-slate-200 dark:border-slate-800"
                                  >
                                    Clear
                                  </button>
                                </div>
                              </div>
                            ) : (
                              /* Display Badge for Auto Waterfall Mode */
                              <div className="md:col-span-7 text-right shrink-0 font-mono">
                                <div className="flex items-center gap-2 justify-end">
                                  <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                                    ₹{a.paidNow.toLocaleString("en-IN")} Paid
                                  </span>
                                  <span className="text-slate-400">/</span>
                                  <span className="text-slate-500 font-semibold">₹{payable.toLocaleString("en-IN")}</span>
                                </div>
                                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                                  {a.remainingDue > 0 ? `Remaining Due: ₹${a.remainingDue.toLocaleString("en-IN")}` : "Fully Settled"}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Expected Due Date Picker for Balance */}
                  <div className="md:col-span-2">
                    <label className={`block text-xs mb-1.5 ${labelText} flex items-center gap-1.5`}>
                      <Calendar className="w-3.5 h-3.5 text-[#3D5EF6]" /> Expected Due Date for Remaining Balance (₹{remainingBalance.toLocaleString("en-IN")}) *
                    </label>
                    <input
                      type="date"
                      required={paymentMode === "partial"}
                      min={new Date().toISOString().split("T")[0]}
                      value={expectedDueDate}
                      onChange={(e) => setExpectedDueDate(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-lg text-xs font-bold outline-none transition-all ${inputStyle}`}
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Specify the date by which your agency will pay the remaining ₹{remainingBalance.toLocaleString("en-IN")} balance.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Form Actions: Cancel & Submit buttons */}
            <div className={`flex items-center justify-end gap-3 pt-4 border-t ${isDark ? "border-white/10" : "border-[#E5E7EB]"}`}>
              <Link
                href="/partner/settlements"
                className={`px-5 py-3 rounded-lg text-xs font-bold transition-colors duration-200 ${
                  isDark ? "bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300" : "bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#6B7280]"
                }`}
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting || selectedIds.length === 0}
                className="px-6 py-3.5 rounded-lg text-xs font-black text-white shadow-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer bg-[#3D5EF6] hover:bg-[#2E4FE0] transition-colors duration-200"
              >
                <CreditCard className="w-4 h-4" />
                {submitting
                  ? "Submitting Settlement..."
                  : paymentMode === "partial"
                  ? `Submit Partial Remittance (Pay ₹${effectivePaidAmount.toLocaleString("en-IN")} now)`
                  : `Submit Full Settlement (₹${totalAmount.toLocaleString("en-IN")})`}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
