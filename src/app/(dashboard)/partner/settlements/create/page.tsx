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

  // Partial Payment State
  const [paymentMode, setPaymentMode] = useState<"full" | "partial">("full");
  const [paidAmountInput, setPaidAmountInput] = useState<string>("");
  
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

  const filteredPurchases = purchases.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      (p.seafarerName || "").toLowerCase().includes(term) ||
      (p.id || "").toLowerCase().includes(term) ||
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

    setSubmitting(true);
    try {
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
              <span className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] ${
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
              <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full ${
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
              className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-black bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white transition-colors duration-200 shadow-sm"
            >
              View Settlement Details
            </Link>
            <Link
              href="/partner/settlements"
              className={`w-full sm:w-auto px-5 py-3 rounded-full text-xs font-bold transition-colors duration-200 ${
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
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-12">
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
          <div className={`px-3.5 py-1.5 rounded-full border text-xs font-bold flex items-center gap-2 ${
            selectedIds.length > 0
              ? isDark ? "bg-[#3D5EF6]/20 border-[#3D5EF6]/40 text-blue-300" : "bg-[#EEF1FE] border-[#3D5EF6]/30 text-[#3D5EF6]"
              : isDark ? "bg-white/5 border-white/10 text-slate-400" : "bg-[#F3F4F6] border-[#E5E7EB] text-[#6B7280]"
          }`}>
            <span className="w-5 h-5 rounded-full bg-[#3D5EF6] text-white flex items-center justify-center text-[10px] font-black">1</span>
            Select Purchases ({selectedIds.length})
          </div>
          <span className={`text-xs ${subText}`}>→</span>
          <div className={`px-3.5 py-1.5 rounded-full border text-xs font-bold flex items-center gap-2 ${
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

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Live Settlement Summary (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className={`p-6 space-y-6 sticky top-6 ${cardBg}`}>
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
                  Covered Items ({selectedPurchases.length})
                </span>
                {purchases.length > 0 && (
                  <button
                    type="button"
                    onClick={selectAll}
                    className={`text-[11px] font-extrabold cursor-pointer hover:underline transition-colors duration-200 ${
                      isDark ? "text-blue-400" : "text-[#3D5EF6]"
                    }`}
                  >
                    {selectedIds.length === purchases.length ? "Deselect All" : "Select All"}
                  </button>
                )}
              </div>

              {selectedPurchases.length === 0 ? (
                <div className={`p-4 text-center border border-dashed rounded-[16px] text-xs font-semibold ${
                  isDark ? "border-white/10 text-slate-400" : "border-[#E5E7EB] text-[#6B7280]"
                }`}>
                  No purchases selected yet. Check items from the list.
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

            {/* Trust & Policy Badge */}
            <div className={`p-4 rounded-[16px] text-xs leading-relaxed space-y-1.5 ${
              isDark ? "bg-[#3D5EF6]/10 text-blue-300" : "bg-[#EEF1FE] text-[#111827]"
            }`}>
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 shrink-0 text-[#3D5EF6]" /> Zero Commission Policy
              </div>
              <p className="text-[11px] opacity-90">
                100% Hari Om payable amount. Partner collects candidate fee directly with zero commission markup.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-select Purchases & Payment Form (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Outstanding Purchases List */}
          <div className={`p-6 md:p-8 space-y-4 ${cardBg}`}>
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b ${
              isDark ? "border-white/10" : "border-[#E5E7EB]"
            }`}>
              <div>
                <h2 className={`text-base font-extrabold flex items-center gap-2 ${headingText}`}>
                  <Receipt className={`w-5 h-5 ${isDark ? "text-blue-400" : "text-[#3D5EF6]"}`} /> 1. Select Outstanding Purchases
                </h2>
                <p className={`text-xs mt-0.5 ${subText}`}>
                  Choose course purchases covered in your current bank remittance batch
                </p>
              </div>

              {/* Quick Search */}
              <div className="w-full sm:w-64">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search seafarer / course / ID..."
                  className={`w-full px-3 py-1.5 rounded-full text-xs font-semibold outline-none ${inputStyle}`}
                />
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
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
                {filteredPurchases.map((p) => {
                  const isChecked = selectedIds.includes(p.id);
                  return (
                    <div
                      key={p.id}
                      onClick={() => toggleSelect(p.id)}
                      className={`p-4 rounded-[16px] cursor-pointer transition-all flex items-center justify-between gap-4 ${
                        isChecked
                          ? isDark
                            ? "bg-[#3D5EF6]/15 shadow-sm"
                            : "bg-[#EEF1FE] shadow-sm"
                          : isDark
                          ? "bg-white/[0.02] hover:bg-white/5"
                          : "bg-[#FAFAFA] hover:bg-[#EEF1FE]/30"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 rounded text-[#3D5EF6] focus:ring-[#3D5EF6] accent-[#3D5EF6] cursor-pointer"
                        />
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className={`font-extrabold text-xs ${headingText}`}>{p.seafarerName}</p>
                            <span className={`font-mono text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                              isDark ? "bg-white/5 text-blue-300" : "bg-[#EEF1FE] text-[#3D5EF6]"
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
                        {p.settlementStatus === "Partial" || (p.remainingAmount && p.remainingAmount > 0) ? (
                          <span className="text-[10px] font-bold text-[#B45309] bg-[#FEF3C7] px-2.5 py-0.5 rounded-full block mt-0.5">
                            Remaining Due Balance
                          </span>
                        ) : (
                          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full inline-block mt-0.5 bg-[#FEF3C7] text-[#B45309]">
                            {p.settlementStatus || "Pending"}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Card 2: Remittance Payment Mode & Partial Installments Option */}
          <div className={`p-6 md:p-8 space-y-5 ${cardBg}`}>
            <div className={`pb-3 border-b ${isDark ? "border-white/10" : "border-[#E5E7EB]"}`}>
              <h2 className={`text-base font-extrabold flex items-center gap-2 ${headingText}`}>
                <PieChart className={`w-5 h-5 ${isDark ? "text-blue-400" : "text-[#3D5EF6]"}`} /> 2. Remittance Payment Mode (Full vs Partial Split)
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
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A]">
                    Full Pay
                  </span>
                </div>
                <p className={`text-[11px] mt-2 leading-relaxed ${subText}`}>
                  Pay total batch amount <strong className="text-[#16A34A]">₹{totalAmount.toLocaleString("en-IN")}</strong> at once.
                </p>
              </div>

              <div
                onClick={() => {
                  setPaymentMode("partial");
                  if (paidAmountInput === "") {
                    setPaidAmountInput(Math.round(totalAmount / 2).toString());
                  }
                }}
                className={`p-4 rounded-[16px] cursor-pointer transition-all ${
                  paymentMode === "partial"
                    ? isDark
                      ? "bg-amber-500/15 ring-1 ring-amber-500/50 shadow-sm"
                      : "bg-[#FEF3C7]/60 ring-1 ring-amber-400 shadow-sm"
                    : isDark
                    ? "bg-white/[0.02] hover:bg-white/5"
                    : "bg-[#FAFAFA] hover:bg-[#EEF1FE]/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className={`w-5 h-5 ${paymentMode === "partial" ? "text-[#B45309]" : "text-slate-400"}`} />
                    <span className={`text-xs font-black ${headingText}`}>Partial / Split Payment</span>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#B45309]">
                    Pay in Parts
                  </span>
                </div>
                <p className={`text-[11px] mt-2 leading-relaxed ${subText}`}>
                  Pay part amount now (e.g. ₹20,000) and set an expected due date for remaining pending balance.
                </p>
              </div>
            </div>

            {/* Expanded Form Fields when Partial Payment Mode is selected */}
            {paymentMode === "partial" && (
              <div className={`p-5 rounded-[16px] space-y-4 animate-fadeIn ${
                isDark ? "bg-amber-500/[0.05]" : "bg-[#FEF3C7]/30"
              }`}>
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#B45309]">
                  <Info className="w-4 h-4 shrink-0" /> Partial Remittance & Balance Due Date Details
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Amount Paid Now */}
                  <div>
                    <label className={`block text-xs mb-1.5 ${labelText}`}>
                      Amount Paid Now (₹) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-xs text-slate-400">₹</span>
                      <input
                        type="number"
                        min="1"
                        max={totalAmount - 1}
                        required={paymentMode === "partial"}
                        value={paidAmountInput}
                        onChange={(e) => setPaidAmountInput(e.target.value)}
                        placeholder="e.g. 20000"
                        className={`w-full pl-8 pr-4 py-2.5 rounded-full text-sm font-mono font-bold outline-none transition-all ${inputStyle}`}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Enter the partial payment amount being transferred right now.
                    </p>
                  </div>

                  {/* Calculated Remaining Balance Display */}
                  <div>
                    <label className={`block text-xs mb-1.5 ${labelText}`}>
                      Calculated Pending Balance (₹)
                    </label>
                    <div className={`w-full px-4 py-2.5 rounded-[16px] text-sm font-mono font-black flex items-center justify-between ${
                      isDark ? "bg-black/30 text-amber-300" : "bg-white text-[#B45309]"
                    }`}>
                      <span>₹{remainingBalance.toLocaleString("en-IN")}</span>
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#B45309]">
                        Pending
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Auto-calculated remaining amount (₹{totalAmount.toLocaleString("en-IN")} - ₹{effectivePaidAmount.toLocaleString("en-IN")})
                    </p>
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
                      className={`w-full px-4 py-2.5 rounded-full text-xs font-bold outline-none transition-all ${inputStyle}`}
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Specify the date by which your agency will pay the remaining ₹{remainingBalance.toLocaleString("en-IN")} balance.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Card 3: Bank Remittance Reference & Submission */}
          <div className={`p-6 md:p-8 space-y-5 ${cardBg}`}>
            <div className={`pb-3 border-b ${isDark ? "border-white/10" : "border-[#E5E7EB]"}`}>
              <h2 className={`text-base font-extrabold flex items-center gap-2 ${headingText}`}>
                <CreditCard className={`w-5 h-5 ${isDark ? "text-blue-400" : "text-[#3D5EF6]"}`} /> 3. Bank Payment & Transaction Reference
              </h2>
              <p className={`text-xs mt-0.5 ${subText}`}>
                Enter your bank transfer UTR / RTGS / NEFT confirmation details for finance audit
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={`block text-xs mb-1.5 ${labelText}`}>
                  Bank UTR / Remittance Reference Number *
                </label>
                <input
                  type="text"
                  required
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="e.g. HDFC1234567890 / RTGS987654321"
                  className={`w-full px-4 py-3 rounded-full text-sm font-mono font-extrabold uppercase outline-none transition-all ${inputStyle}`}
                />
              </div>

              <div>
                <label className={`block text-xs mb-1.5 ${labelText}`}>
                  Payment Method *
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-full text-xs font-bold outline-none ${inputStyle}`}
                >
                  <option value="Bank Transfer (NEFT / RTGS)">Bank Transfer (NEFT / RTGS / IMPS)</option>
                  <option value="UPI Transfer">UPI / Corporate QR</option>
                  <option value="Cheque / DD">Cheque / Demand Draft</option>
                  <option value="Cash / Direct Branch Deposit">Direct Branch Cash Deposit</option>
                </select>
              </div>

              <div>
                <label className={`block text-xs mb-1.5 ${labelText}`}>
                  Payment Remittance Date *
                </label>
                <input
                  type="date"
                  required
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-full text-xs font-bold outline-none ${inputStyle}`}
                >
                </input>
              </div>

              <div className="md:col-span-2">
                <label className={`block text-xs mb-1.5 ${labelText}`}>
                  Payment Remarks / Batch Notes (Optional)
                </label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Partial remittance paid ₹20k now, balance ₹18k due on 22 Sep"
                  className={`w-full px-3.5 py-2.5 rounded-full text-xs font-semibold outline-none ${inputStyle}`}
                />
              </div>
            </div>

            <div className={`flex items-center justify-end gap-3 pt-4 border-t ${isDark ? "border-white/10" : "border-[#E5E7EB]"}`}>
              <Link
                href="/partner/settlements"
                className={`px-5 py-3 rounded-full text-xs font-bold transition-colors duration-200 ${
                  isDark ? "bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300" : "bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#6B7280]"
                }`}
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting || selectedIds.length === 0}
                className="px-6 py-3.5 rounded-full text-xs font-black text-white shadow-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer bg-[#3D5EF6] hover:bg-[#2E4FE0] transition-colors duration-200"
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
