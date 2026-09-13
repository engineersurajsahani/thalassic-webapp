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
  const isDark = theme === "dark";

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
    : "bg-white border-slate-200/80 shadow-md";

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
        <p className="text-sm font-semibold text-rose-400">{error || "Settlement record not found."}</p>
        <Link
          href="/partner/settlements"
          className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:underline"
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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Settlement History
        </Link>
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full ${
              isDark ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "bg-blue-50 text-blue-600 border border-blue-200"
            }`}
          >
            Settlement Audit Record
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1.5 font-mono">
          {sNumber}
        </h1>
      </div>

      {/* Status Progress Stepper */}
      <div className={`p-6 rounded-3xl border ${cardBg}`}>
        <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-6">
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
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : isCurrentStep
                    ? isRejected
                      ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                      : "bg-blue-500/10 border-blue-500/30 text-blue-400"
                    : "bg-white/[0.02] border-white/5 text-slate-500"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCompletedStep
                        ? "bg-emerald-500 text-slate-950"
                        : isCurrentStep
                        ? isRejected
                          ? "bg-rose-500 text-white"
                          : "bg-blue-500 text-white"
                        : "bg-white/10 text-slate-400"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <p className="text-xs font-bold">{step.title}</p>
                </div>
                <p className="text-[10px] mt-1 text-slate-400 pl-8">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rejection Alert if rejected */}
      {isRejected && (
        <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-start gap-3 text-xs leading-relaxed">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-rose-300">Settlement Verification Rejected</p>
            <p className="mt-1">
              <strong>Reason:</strong> {settlement.rejectionReason || "UTR number could not be matched with bank remittance statement. Please verify with your bank and resubmit."}
            </p>
          </div>
        </div>
      )}

      {/* Main Details Card */}
      <div className={`p-6 md:p-8 rounded-3xl border space-y-6 ${cardBg}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-white/5">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Total Settled Amount</p>
            <p className="text-2xl font-black text-white mt-1">
              ₹{Number(settlement.total_amount || settlement.amount || 0).toLocaleString("en-IN")}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Bank UTR / Reference</p>
            <p className="text-sm font-mono font-bold text-cyan-300 mt-1">
              {settlement.reference_number || settlement.referenceNumber || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Payment Method</p>
            <p className="text-sm font-semibold text-slate-200 mt-1">
              {settlement.payment_method || settlement.paymentMethod || "Bank Transfer"}
            </p>
          </div>
        </div>

        {/* Remarks / Notes */}
        {settlement.remarks && (
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-300">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Partner Remarks:</span>
            {settlement.remarks}
          </div>
        )}

        {/* Covered Purchases Table */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3">
            Covered Course Purchases ({settlement.coveredPurchases?.length || 0})
          </h3>

          {settlement.coveredPurchases && settlement.coveredPurchases.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-white/5">
              <table className="w-full text-left text-xs">
                <thead className={isDark ? "bg-white/[0.03] text-slate-400 border-b border-white/5" : "bg-slate-50 text-slate-500 border-b border-slate-200"}>
                  <tr>
                    <th className="py-3 px-3.5 font-semibold">Purchase ID</th>
                    <th className="py-3 px-3.5 font-semibold">Seafarer Name</th>
                    <th className="py-3 px-3.5 font-semibold">Course Program</th>
                    <th className="py-3 px-3.5 font-semibold text-right">Hari Om Payable</th>
                    <th className="py-3 px-3.5 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {settlement.coveredPurchases.map((p: any) => (
                    <tr key={p.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-3.5 font-mono font-bold text-cyan-400">{p.id}</td>
                      <td className="py-3 px-3.5 font-semibold text-white">{p.seafarerName}</td>
                      <td className="py-3 px-3.5 text-slate-300">{p.courseName}</td>
                      <td className="py-3 px-3.5 font-bold text-right text-cyan-300">
                        ₹{Number(p.payableAmount).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-3.5 text-right">
                        <Link
                          href={`/partner/purchases/${p.id}`}
                          className="text-xs font-semibold text-cyan-400 hover:underline"
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
            <div className="p-6 text-center border border-dashed rounded-xl border-white/10 text-slate-400 text-xs">
              No specific purchases linked.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
