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
    ? "bg-[#09162c]/80 border-white/5 shadow-xl"
    : "bg-white border-slate-200 shadow-md";
  const headingText = isDark ? "text-white" : "text-slate-900";
  const subText = isDark ? "text-slate-300" : "text-slate-700";
  const mutedText = isDark ? "text-slate-400" : "text-slate-600";

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto animate-pulse">
        <div className="h-8 w-48 rounded-xl bg-slate-200 dark:bg-white/5" />
        <div className="h-44 rounded-3xl bg-slate-200 dark:bg-white/5" />
        <div className="h-64 rounded-3xl bg-slate-200 dark:bg-white/5" />
      </div>
    );
  }

  if (error || !settlement) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <p className="text-sm font-semibold text-rose-500">{error || "Settlement record not found."}</p>
        <Link
          href="/partner/settlements"
          className={`mt-4 inline-flex items-center gap-2 text-xs font-bold hover:underline ${
            isDark ? "text-cyan-400" : "text-blue-600"
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Settlement History
        </Link>
      </div>
    );
  }

  const sNumber = settlement.settlement_number || settlement.settlementNumber || settlement.id;
  const isPaid = settlement.status === "Paid" || settlement.status === "Completed";
  const isRejected = settlement.status === "Rejected";

  // Stepper items
  const steps = [
    { title: "Pending", desc: "Settlement draft" },
    { title: "Submitted", desc: "Sent by Partner" },
    { title: "Under Verification", desc: "Finance checking UTR" },
    { title: isRejected ? "Rejected" : "Completed", desc: isRejected ? "Verification failed" : "Funds credited" },
  ];

  const getCurrentStepIndex = () => {
    if (isRejected) return 3;
    if (isPaid) return 3;
    if (settlement.status === "Under Verification") return 2;
    if (settlement.status === "Submitted") return 1;
    return 0;
  };
  const stepIdx = getCurrentStepIndex();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <Link
          href="/partner/settlements"
          className={`inline-flex items-center gap-1.5 text-xs font-semibold hover:text-cyan-400 transition-colors mb-2 ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Settlement History
        </Link>
        <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight mt-1.5 font-mono ${headingText}`}>
          {sNumber}
        </h1>
      </div>

      {/* Status Progress Stepper */}
      <div className={`p-6 rounded-3xl border ${cardBg}`}>
        <h2 className={`text-xs font-bold uppercase tracking-wider mb-6 ${isDark ? "text-cyan-400" : "text-blue-700"}`}>
          Settlement Lifecycle Status
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {steps.map((step, idx) => {
            const isCompletedStep = idx < stepIdx || (idx === stepIdx && isPaid);
            const isCurrentStep = idx === stepIdx && !isPaid;
            return (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isCompletedStep
                    ? isDark ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-emerald-50 border-emerald-300 text-emerald-900"
                    : isCurrentStep
                    ? isRejected
                      ? isDark ? "bg-rose-500/10 border-rose-500/30 text-rose-400" : "bg-rose-50 border-rose-300 text-rose-900"
                      : isDark ? "bg-blue-500/10 border-blue-500/30 text-blue-400" : "bg-blue-50 border-blue-300 text-blue-900"
                    : isDark ? "bg-white/[0.02] border-white/5 text-slate-500" : "bg-slate-100 border-slate-200 text-slate-500"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCompletedStep
                        ? isDark ? "bg-emerald-500 text-slate-950" : "bg-emerald-600 text-white"
                        : isCurrentStep
                        ? isRejected
                          ? "bg-rose-500 text-white"
                          : "bg-blue-600 text-white"
                        : isDark ? "bg-white/10 text-slate-400" : "bg-slate-300 text-slate-700"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <p className="text-xs font-bold">{step.title}</p>
                </div>
                <p className={`text-[10px] mt-1 pl-8 ${isDark ? "text-slate-400" : "text-slate-600"}`}>{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rejection Alert if rejected */}
      {isRejected && (
        <div className={`p-5 rounded-2xl border flex items-start gap-3 text-xs leading-relaxed ${
          isDark ? "bg-rose-500/10 border-rose-500/20 text-rose-400" : "bg-rose-50 border-rose-200 text-rose-900"
        }`}>
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Settlement Verification Rejected</p>
            <p className="mt-1">
              <strong>Reason:</strong> {settlement.rejectionReason || "UTR number could not be matched with bank remittance statement. Please verify with your bank and resubmit."}
            </p>
          </div>
        </div>
      )}

      {/* Main Details Card */}
      <div className={`p-6 md:p-8 rounded-3xl border space-y-6 ${cardBg}`}>
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b ${isDark ? "border-white/5" : "border-slate-200"}`}>
          <div>
            <p className={`text-[10px] uppercase font-bold ${mutedText}`}>Total Batch Amount</p>
            <p className={`text-2xl font-black mt-1 ${headingText}`}>
              ₹{Number(settlement.total_amount || settlement.totalAmount || settlement.amount || 0).toLocaleString("en-IN")}
            </p>
            {(settlement.payment_mode === "partial" || settlement.paymentMode === "partial") && (
              <span className="inline-block mt-1 text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Partial / Split Remittance
              </span>
            )}
          </div>
          <div>
            <p className={`text-[10px] uppercase font-bold ${mutedText}`}>Bank UTR / Reference</p>
            <p className={`text-sm font-mono font-extrabold mt-1 ${isDark ? "text-cyan-300" : "text-blue-700"}`}>
              {settlement.reference_number || settlement.referenceNumber || "N/A"}
            </p>
          </div>
          <div>
            <p className={`text-[10px] uppercase font-bold ${mutedText}`}>Payment Method</p>
            <p className={`text-sm font-semibold mt-1 ${subText}`}>
              {settlement.payment_method || settlement.paymentMethod || "Bank Transfer"}
            </p>
          </div>
        </div>

        {/* Partial Payment Highlight Box */}
        {(settlement.payment_mode === "partial" || settlement.paymentMode === "partial") && (
          <div className={`p-5 rounded-2xl border space-y-3 ${
            isDark ? "bg-amber-500/10 border-amber-500/30" : "bg-amber-50 border-amber-200"
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> Partial Payment Breakdown
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Split Remittance Mode
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className={`p-3 rounded-xl border ${isDark ? "bg-black/30 border-white/10" : "bg-white border-slate-200"}`}>
                <p className={`text-[10px] font-bold ${mutedText}`}>Amount Paid Now</p>
                <p className="text-lg font-black text-emerald-400 mt-0.5">
                  ₹{Number(settlement.paid_amount || settlement.paidAmount || settlement.netAmount || 0).toLocaleString("en-IN")}
                </p>
              </div>

              <div className={`p-3 rounded-xl border ${isDark ? "bg-black/30 border-white/10" : "bg-white border-slate-200"}`}>
                <p className={`text-[10px] font-bold ${mutedText}`}>Remaining Pending Balance</p>
                <p className="text-lg font-black text-amber-400 mt-0.5">
                  ₹{Number(settlement.remaining_amount || settlement.remainingAmount || 0).toLocaleString("en-IN")}
                </p>
              </div>

              <div className={`p-3 rounded-xl border ${isDark ? "bg-black/30 border-white/10" : "bg-white border-slate-200"}`}>
                <p className={`text-[10px] font-bold ${mutedText}`}>Expected Due Date for Balance</p>
                <p className="text-sm font-bold text-cyan-300 mt-1">
                  {(settlement.expected_due_date || settlement.expectedDueDate)
                    ? new Date(settlement.expected_due_date || settlement.expectedDueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                    : "Not Specified"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Remarks / Notes */}
        {settlement.remarks && (
          <div className={`p-4 rounded-xl border text-xs ${
            isDark ? "bg-white/[0.02] border-white/5 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-800"
          }`}>
            <span className={`text-[10px] uppercase font-bold block mb-1 ${mutedText}`}>Partner Remarks:</span>
            {settlement.remarks}
          </div>
        )}

        {/* Covered Purchases Table */}
        <div>
          <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? "text-cyan-400" : "text-blue-700"}`}>
            Covered Course Purchases ({settlement.coveredPurchases?.length || 0})
          </h3>

          {settlement.coveredPurchases && settlement.coveredPurchases.length > 0 ? (
            <div className={`overflow-x-auto rounded-xl border ${isDark ? "border-white/5" : "border-slate-200"}`}>
              <table className="w-full text-left text-xs">
                <thead className={isDark ? "bg-white/[0.03] text-slate-400 border-b border-white/5" : "bg-slate-100 text-slate-700 border-b border-slate-200 font-bold"}>
                  <tr>
                    <th className="py-3 px-3.5 font-semibold">Purchase ID</th>
                    <th className="py-3 px-3.5 font-semibold">Seafarer Name</th>
                    <th className="py-3 px-3.5 font-semibold">Course Program</th>
                    <th className="py-3 px-3.5 font-semibold text-right">Hari Om Payable</th>
                    <th className="py-3 px-3.5 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className={isDark ? "divide-y divide-white/5" : "divide-y divide-slate-200"}>
                  {settlement.coveredPurchases.map((p: any) => (
                    <tr key={p.id} className={isDark ? "hover:bg-white/[0.02]" : "hover:bg-slate-50"}>
                      <td className={`py-3 px-3.5 font-mono font-bold ${isDark ? "text-cyan-400" : "text-blue-700"}`}>{p.id}</td>
                      <td className={`py-3 px-3.5 font-bold ${headingText}`}>{p.seafarerName}</td>
                      <td className={`py-3 px-3.5 ${subText}`}>{p.courseName}</td>
                      <td className={`py-3 px-3.5 font-extrabold text-right ${isDark ? "text-cyan-300" : "text-emerald-700"}`}>
                        ₹{Number(p.payableAmount).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-3.5 text-right">
                        <Link
                          href={`/partner/purchases/${p.id}`}
                          className={`text-xs font-bold hover:underline ${isDark ? "text-cyan-400" : "text-blue-600"}`}
                        >
                          View Purchase
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={`p-6 text-center border border-dashed rounded-xl text-xs ${
              isDark ? "border-white/10 text-slate-400" : "border-slate-300 text-slate-600"
            }`}>
              No specific purchases linked.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
