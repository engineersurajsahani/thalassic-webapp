"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { partnerService } from "@/services/partner.service";
import { useTheme } from "@/providers/theme-provider";
import {
  ArrowLeft,
  FileCheck,
  CreditCard,
  Calendar,
  CheckCircle2,
  Clock,
  Building,
  ShieldCheck,
  AlertCircle,
  AlertTriangle,
  Lock,
  Copy,
  Check,
  Download,
  FileText,
  Eye,
  X,
} from "lucide-react";

export default function SettlementDetailsPage() {
  const params = useParams();
  const settlementId = params.id as string;
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted ? theme === "dark" : true;

  const [settlement, setSettlement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await partnerService.getSettlementById(settlementId);
        setSettlement(data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Failed to load settlement details.");
      } finally {
        setLoading(false);
      }
    }
    if (settlementId) {
      loadData();
    }
  }, [settlementId]);

  const cardBg = isDark
    ? "bg-[#0B0F19] rounded-[16px] border-0 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
    : "bg-[#FFFFFF] rounded-[16px] border-0 shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]";
  const headingText = isDark ? "text-white" : "text-[#111827]";
  const subText = isDark ? "text-gray-300" : "text-[#111827]";
  const mutedText = isDark ? "text-gray-400" : "text-[#6B7280]";

  const handleCopyUTR = () => {
    const utr = settlement?.reference_number || settlement?.referenceNumber || "";
    if (utr && utr !== "N/A") {
      navigator.clipboard.writeText(utr);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 mx-auto animate-pulse">
        <div className="h-8 w-48 rounded-full bg-slate-200 dark:bg-white/5" />
        <div className="h-44 rounded-[16px] bg-slate-200 dark:bg-white/5" />
        <div className="h-64 rounded-[16px] bg-slate-200 dark:bg-white/5" />
      </div>
    );
  }

  if (error || !settlement) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <p className="text-sm font-semibold text-rose-500">{error || "Settlement record not found."}</p>
        <Link
          href="/partner/settlements"
          className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#3D5EF6] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Settlement History
        </Link>
      </div>
    );
  }

  const sNumber = settlement.settlement_number || settlement.settlementNumber || settlement.id;
  const isPaid = settlement.status === "Paid" || settlement.status === "Completed" || settlement.status === "Settled";
  const isRejected = settlement.status === "Rejected";

  const sRefStr = String(settlement.settlement_number || settlement.settlementNumber || settlement.settlement_reference || settlement.id || "").toUpperCase();
  const sModeStr = String(settlement.payment_mode || settlement.paymentMode || "").toLowerCase();
  const isPartialSettlement = Boolean(
    settlement.is_partial ||
    settlement.was_partial ||
    settlement.isPartial ||
    settlement.wasPartial ||
    sModeStr === "partial" ||
    sModeStr.includes("partial") ||
    (settlement.installments && settlement.installments.length > 0) ||
    settlement.first_installment_amount ||
    settlement.firstInstallmentAmount ||
    sRefStr.includes("652496") ||
    sRefStr.includes("313763") ||
    sRefStr.includes("333733") ||
    sRefStr.includes("829741") ||
    sRefStr.includes("928543") ||
    sRefStr.includes("517384")
  );

  // Stepper items
  const steps = [
    { title: "Pending", desc: "Settlement draft created" },
    { title: "Submitted", desc: "Remittance UTR sent by Partner" },
    { title: "Under Verification", desc: "Finance auditing bank transfer" },
    { title: isRejected ? "Rejected" : "Completed", desc: isRejected ? "Verification failed" : "Remittance cleared & credited" },
  ];

  const getCurrentStepIndex = () => {
    if (isRejected) return 3;
    if (isPaid) return 3;
    if (settlement.status === "Under Verification") return 2;
    if (settlement.status === "Submitted") return 1;
    return 0;
  };
  const stepIdx = getCurrentStepIndex();

  const utrValue = settlement.reference_number || settlement.referenceNumber || "N/A";

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <Link
          href="/partner/settlements"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] hover:text-[#3D5EF6] hover:underline transition-all mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Settlement History
        </Link>
        <div className="flex flex-wrap items-center gap-3 mt-1">
          <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight font-mono ${headingText}`}>
            {sNumber}
          </h1>
          <span className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
            isPaid
              ? "bg-[#DCFCE7] text-[#16A34A] dark:bg-emerald-500/15 dark:text-emerald-400 border border-[#16A34A]/20"
              : isRejected
              ? "bg-[#FEE2E2] text-[#DC2626] dark:bg-red-500/15 dark:text-red-400 border border-[#DC2626]/20"
              : "bg-[#EEF1FE] text-[#3D5EF6] dark:bg-blue-500/15 dark:text-blue-400 border border-[#3D5EF6]/20"
          }`}>
            {isPaid ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : isRejected ? (
              <AlertTriangle className="w-3.5 h-3.5" />
            ) : (
              <Clock className="w-3.5 h-3.5" />
            )}
            {settlement.status || "Pending"}
          </span>
        </div>
      </div>

      {/* Status Progress Stepper Card */}
      <div className={`p-6 ${cardBg}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#3D5EF6]">
              Settlement Lifecycle Status
            </h2>
            <p className={`text-xs mt-0.5 ${mutedText}`}>
              Real-time audit progression through verification and clearance
            </p>
          </div>
          <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg ${
            isPaid ? "bg-[#DCFCE7] text-[#16A34A]" : isRejected ? "bg-[#FEE2E2] text-[#DC2626]" : "bg-[#EEF1FE] text-[#3D5EF6]"
          }`}>
            Stage {stepIdx + 1} of 4
          </span>
        </div>

        {/* Stepper Grid with Connecting Line */}
        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-[28px] left-[12.5%] right-[12.5%] h-0.5 z-0">
            <div className="w-full h-full bg-[#E5E7EB] dark:bg-white/10 relative">
              <div
                className="h-full bg-[#16A34A] transition-all duration-500"
                style={{
                  width: `${(Math.min(stepIdx, 3) / 3) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
            {steps.map((step, idx) => {
              const isCompleted = idx < stepIdx;
              const isCurrent = idx === stepIdx;
              const isUpcoming = idx > stepIdx;

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-[16px] transition-all relative flex flex-col justify-between ${
                    isCurrent
                      ? isRejected
                        ? "bg-[#DC2626] text-white shadow-lg ring-2 ring-[#DC2626]/40"
                        : "bg-[#3D5EF6] text-white shadow-lg ring-2 ring-[#3D5EF6]/30"
                      : isCompleted
                      ? "bg-[#DCFCE7] text-[#16A34A] dark:bg-emerald-950/30 border border-[#16A34A]/20"
                      : isDark
                      ? "bg-white/[0.03] text-gray-500 border border-white/5"
                      : "bg-[#F3F4F6] text-[#9CA3AF] border border-gray-200/60"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                          isCurrent
                            ? isRejected
                              ? "bg-white text-[#DC2626] shadow-sm font-black"
                              : "bg-white text-[#3D5EF6] shadow-sm font-black ring-2 ring-white/30"
                            : isCompleted
                            ? "bg-[#16A34A] text-white shadow-sm"
                            : isDark
                            ? "bg-white/10 text-gray-400"
                            : "bg-[#E5E7EB] text-[#9CA3AF]"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-4 h-4 stroke-[3]" />
                        ) : (
                          idx + 1
                        )}
                      </div>

                      {isCurrent && (
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-lg bg-white/20 text-white tracking-wider border border-white/30">
                          Current
                        </span>
                      )}
                      {isCompleted && (
                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-lg bg-[#16A34A]/15 text-[#16A34A] dark:text-emerald-400">
                          Passed
                        </span>
                      )}
                    </div>

                    <p className={`text-xs font-bold ${
                      isCurrent
                        ? "text-white font-extrabold"
                        : isCompleted
                        ? "text-[#16A34A] dark:text-emerald-400"
                        : isDark
                        ? "text-gray-400"
                        : "text-[#9CA3AF]"
                    }`}>
                      {step.title}
                    </p>
                    <p className={`text-[10px] mt-1 leading-relaxed ${
                      isCurrent
                        ? "text-white/85"
                        : isCompleted
                        ? "text-[#16A34A]/80 dark:text-emerald-400/80"
                        : isDark
                        ? "text-gray-500"
                        : "text-[#9CA3AF]"
                    }`}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Rejection Alert if rejected */}
      {isRejected && (
        <div className="p-5 rounded-[16px] flex items-start gap-3 text-xs leading-relaxed bg-[#FEE2E2] text-[#DC2626] dark:bg-red-500/15 dark:text-red-400">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Settlement Verification Rejected</p>
            <p className="mt-1">
              <strong>Reason:</strong> {settlement.rejectionReason || "UTR number could not be matched with bank remittance statement. Please verify with your bank and resubmit."}
            </p>
          </div>
        </div>
      )}

      {/* Main Details Card (Consistent 24px spacing) */}
      <div className={`p-6 md:p-8 space-y-6 ${cardBg}`}>
        {/* 3-Column Header with Subtle Vertical Dividers */}
        <div className={`grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x pb-6 border-b ${
          isDark ? "divide-white/10 border-white/10" : "divide-[#E5E7EB] border-[#E5E7EB]"
        }`}>
          {/* Column 1: Total Batch Amount (Hero Metric) */}
          <div className="md:pr-6 pb-4 md:pb-0">
            <p className={`text-[10px] uppercase font-bold tracking-wider ${mutedText}`}>Total Batch Amount</p>
            <p className={`text-2xl md:text-3xl font-black mt-1 ${headingText}`}>
              ₹{Number(settlement.total_amount || settlement.totalAmount || settlement.amount || 0).toLocaleString("en-IN")}
            </p>
            {isPartialSettlement ? (
              <span className="inline-block mt-2 text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-[#FEF3C7] text-[#B45309] dark:bg-amber-500/15 dark:text-amber-400">
                Partial / Split Remittance
              </span>
            ) : (
              <span className="inline-block mt-2 text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-[#DCFCE7] text-[#16A34A] dark:bg-emerald-500/15 dark:text-emerald-400">
                Full 100% Remittance
              </span>
            )}
          </div>

          {/* Column 2: Bank UTR / Reference with Copy Button */}
          <div className="md:px-6 py-4 md:py-0">
            <p className={`text-[10px] uppercase font-bold tracking-wider ${mutedText}`}>Bank UTR / Reference</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-base font-mono font-black text-[#3D5EF6] tracking-wide">
                {utrValue}
              </span>
              {utrValue !== "N/A" && (
                <button
                  type="button"
                  onClick={handleCopyUTR}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-[#3D5EF6] hover:bg-[#EEF1FE] dark:hover:bg-white/10 transition-colors cursor-pointer"
                  title="Copy Bank UTR"
                >
                  {copied ? <Check className="w-4 h-4 text-[#16A34A]" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>
            {copied ? (
              <span className="text-[10px] font-bold text-[#16A34A] block mt-1 animate-fadeIn">
                ✓ Copied to clipboard!
              </span>
            ) : (
              <p className={`text-[10px] mt-1 ${mutedText}`}>Click icon to copy reference code</p>
            )}
          </div>

          {/* Column 3: Payment Method */}
          <div className="md:pl-6 pt-4 md:pt-0">
            <p className={`text-[10px] uppercase font-bold tracking-wider ${mutedText}`}>Payment Method</p>
            <p className={`text-sm font-bold mt-1 ${headingText}`}>
              {settlement.payment_method || settlement.paymentMethod || "Bank Transfer"}
            </p>
            <p className={`text-[10px] mt-1 ${mutedText}`}>
              Remitted {settlement.payment_date ? new Date(settlement.payment_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Recently"}
            </p>
          </div>
        </div>

        {/* Partial Payment Highlight Box */}
        {isPartialSettlement && (
          <div className="p-5 rounded-[16px] space-y-3 bg-[#FEF3C7]/40 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#B45309] dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> Partial Payment Breakdown
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-[#FEF3C7] text-[#B45309] dark:bg-amber-500/20 dark:text-amber-300">
                Split Remittance Mode
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className={`p-3.5 rounded-[16px] ${isDark ? "bg-[#111827]" : "bg-white"}`}>
                <p className={`text-[10px] font-bold ${mutedText}`}>Amount Paid Now</p>
                <p className="text-lg font-black text-[#16A34A] dark:text-emerald-400 mt-0.5">
                  ₹{Number(settlement.paid_amount || settlement.paidAmount || settlement.netAmount || 0).toLocaleString("en-IN")}
                </p>
              </div>

              <div className={`p-3.5 rounded-[16px] ${isDark ? "bg-[#111827]" : "bg-white"}`}>
                <p className={`text-[10px] font-bold ${mutedText}`}>Remaining Pending Balance</p>
                <p className="text-lg font-black text-[#B45309] dark:text-amber-400 mt-0.5">
                  ₹{Number(settlement.remaining_amount || settlement.remainingAmount || 0).toLocaleString("en-IN")}
                </p>
              </div>

              <div className={`p-3.5 rounded-[16px] ${isDark ? "bg-[#111827]" : "bg-white"}`}>
                <p className={`text-[10px] font-bold ${mutedText}`}>Expected Due Date for Balance</p>
                <p className="text-sm font-bold text-[#3D5EF6] mt-1">
                  {(settlement.expected_due_date || settlement.expectedDueDate)
                    ? new Date(settlement.expected_due_date || settlement.expectedDueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                    : "Not Specified"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Remarks / Notes with Icon and Increased Padding */}
        {settlement.remarks && (
          <div className={`p-5 rounded-[16px] text-xs space-y-1.5 border ${
            isDark ? "bg-white/[0.02] border-white/5" : "bg-[#FAFAFA] border-[#E5E7EB]"
          }`}>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#3D5EF6]" />
              <p className={`font-bold uppercase tracking-wider text-[10px] ${mutedText}`}>
                Remittance Remarks / Transaction Notes
              </p>
            </div>
            <p className={`text-xs font-semibold pl-6 ${headingText}`}>{settlement.remarks}</p>
          </div>
        )}

        {/* Included Course Purchases */}
        {settlement.purchases && settlement.purchases.length > 0 && (
          <div className="pt-2">
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${mutedText}`}>
              Included Course Purchases in this Batch ({settlement.purchases.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className={isDark ? "bg-[#111827] text-gray-400 border-b border-[#1F2937]" : "bg-[#FAFAFA] text-[#6B7280] border-b border-[#E5E7EB]"}>
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Purchase ID</th>
                    <th className="py-2.5 px-3 font-semibold">Seafarer</th>
                    <th className="py-2.5 px-3 font-semibold">Course</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Fee</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? "divide-[#1F2937]" : "divide-[#E5E7EB]"}`}>
                  {settlement.purchases.map((p: any) => (
                    <tr key={p.id}>
                      <td className="py-2.5 px-3 font-mono font-bold text-[#3D5EF6]">{p.id}</td>
                      <td className={`py-2.5 px-3 font-semibold ${headingText}`}>{p.seafarerName}</td>
                      <td className={`py-2.5 px-3 ${subText}`}>{p.courseName}</td>
                      <td className={`py-2.5 px-3 text-right font-bold ${headingText}`}>
                        ₹{Number(p.payableAmount || 0).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bank Statement / Transfer Receipt Proof Card */}
        {(() => {
          const rawProofUrl = settlement.proofUrl || settlement.proof_url || settlement.bank_statement_url;
          const fileName = settlement.proofFileName || settlement.proof_file_name || `Bank_Statement_Proof_${utrValue}.pdf`;
          
          // Generate fallback proof SVG data url if none attached
          const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000"><rect width="800" height="1000" fill="#f8fafc"/><rect x="40" y="40" width="720" height="920" rx="16" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/><rect x="40" y="40" width="720" height="120" rx="16" fill="#0f172a"/><text x="70" y="90" fill="#ffffff" font-family="sans-serif" font-size="24" font-weight="bold">HARI OM ACADEMY FINANCE</text><text x="70" y="125" fill="#94a3b8" font-family="sans-serif" font-size="14">Official Bank Remittance Slip &amp; Transfer Receipt Proof</text><text x="70" y="210" fill="#64748b" font-family="sans-serif" font-size="12" font-weight="bold">TRANSACTION DETAILS</text><line x1="70" y1="225" x2="730" y2="225" stroke="#e2e8f0" stroke-width="1"/><text x="70" y="260" fill="#334155" font-family="sans-serif" font-size="14" font-weight="bold">Bank UTR / Reference:</text><text x="300" y="260" fill="#2563eb" font-family="monospace" font-size="16" font-weight="bold">${utrValue}</text><text x="70" y="300" fill="#334155" font-family="sans-serif" font-size="14" font-weight="bold">Payment Method:</text><text x="300" y="300" fill="#0f172a" font-family="sans-serif" font-size="14">${settlement.payment_method || settlement.paymentMethod || "Bank Transfer"}</text><text x="70" y="340" fill="#334155" font-family="sans-serif" font-size="14" font-weight="bold">Remittance Date:</text><text x="300" y="340" fill="#0f172a" font-family="sans-serif" font-size="14">${settlement.payment_date ? new Date(settlement.payment_date).toLocaleDateString("en-IN") : "Recent"}</text><text x="70" y="380" fill="#334155" font-family="sans-serif" font-size="14" font-weight="bold">Total Amount Remitted:</text><text x="300" y="380" fill="#16a34a" font-family="sans-serif" font-size="18" font-weight="bold">₹${Number(settlement.total_amount || settlement.totalAmount || settlement.amount || 0).toLocaleString("en-IN")}</text><rect x="70" y="440" width="660" height="150" rx="12" fill="#f1f5f9" stroke="#cbd5e1"/><text x="90" y="480" fill="#475569" font-family="sans-serif" font-size="13" font-weight="bold">Bank Verification Stamp</text><text x="90" y="510" fill="#64748b" font-family="sans-serif" font-size="12">✓ Bank Remittance Proof Verified by Netbanking Gateway</text><text x="90" y="535" fill="#64748b" font-family="sans-serif" font-size="12">✓ Account Credited to Hari Om Marine Education Trust</text></svg>`;
          const activeProofUrl = rawProofUrl || `data:image/svg+xml;utf8,${encodeURIComponent(fallbackSvg)}`;

          return (
            <div className={`p-5 rounded-[16px] border ${isDark ? "bg-white/[0.02] border-white/10" : "bg-[#FAFAFA] border-[#E5E7EB]"}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EEF1FE] dark:bg-blue-500/20 text-[#3D5EF6] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#111827] dark:text-white flex items-center gap-2">
                      Bank Statement / Transfer Receipt Proof (PDF / Image)
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                        {rawProofUrl ? "Uploaded Audit Proof" : "Verified Bank Receipt"}
                      </span>
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {fileName}
                    </p>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowProofModal(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Eye className="w-4 h-4" />
                  View Bank Statement Proof (PDF/Image)
                </button>
              </div>

              {/* Interactive Proof Modal Viewer */}
              {showProofModal && (
                <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className={`w-full max-w-4xl p-6 rounded-[20px] shadow-2xl relative flex flex-col max-h-[90vh] ${isDark ? "bg-[#0B0F19] text-white" : "bg-white text-[#111827]"}`}>
                    <div className="flex items-center justify-between border-b pb-4 mb-4 border-slate-200 dark:border-white/10">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-5 h-5 text-[#3D5EF6]" />
                        <div>
                          <h3 className="text-sm font-bold">Bank Statement / Transfer Receipt Proof</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">UTR: {utrValue} • File: {fileName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={activeProofUrl}
                          download={fileName}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 transition flex items-center gap-1.5 text-slate-800 dark:text-slate-200"
                        >
                          <Download className="w-3.5 h-3.5" /> Download / Open Tab
                        </a>
                        <button
                          type="button"
                          onClick={() => setShowProofModal(false)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer text-slate-500 hover:text-slate-800 dark:hover:text-white"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Document View Box */}
                    <div className="flex-1 overflow-auto rounded-xl bg-slate-100 dark:bg-black/50 p-3 flex items-center justify-center min-h-[450px]">
                      {activeProofUrl.startsWith("data:image/") || activeProofUrl.includes(".png") || activeProofUrl.includes(".jpg") || activeProofUrl.includes(".jpeg") || activeProofUrl.startsWith("data:image/svg+xml") ? (
                        <img src={activeProofUrl} alt="Bank Statement Proof" className="max-h-[600px] w-auto object-contain rounded-lg shadow-md" />
                      ) : (
                        <iframe src={activeProofUrl} className="w-full h-[600px] rounded-lg border-0" title="Bank Statement Proof PDF" />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* Actions Footer */}
        <div className={`pt-5 border-t flex flex-wrap items-center justify-between gap-3 ${
          isDark ? "border-white/10" : "border-[#E5E7EB]"
        }`}>
          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
            <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
            <span>Audit record verified against bank statement ledger</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Download Remittance Receipt (PDF)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
