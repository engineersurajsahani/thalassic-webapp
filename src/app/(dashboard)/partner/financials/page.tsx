"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { partnerService } from "@/services/partner.service";
import { useTheme } from "@/providers/theme-provider";
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Receipt,
  FileCheck,
  Building,
  ArrowRight,
  ShieldCheck,
  Lock,
} from "lucide-react";

export default function FinancialSummaryPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted ? theme === "dark" : true;

  const [financials, setFinancials] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await partnerService.getFinancials();
        setFinancials(data);
      } catch (err) {
        console.error("Failed to load financials:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const cardBg = isDark
    ? "bg-[#09162c]/80 border-white/5 shadow-sm"
    : "bg-white border-slate-200/80 shadow-sm";

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto animate-pulse">
        <div className="h-8 w-48 rounded-xl bg-slate-200 dark:bg-white/5" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-32 rounded-3xl bg-slate-200 dark:bg-white/5" />
          <div className="h-32 rounded-3xl bg-slate-200 dark:bg-white/5" />
          <div className="h-32 rounded-3xl bg-slate-200 dark:bg-white/5" />
        </div>
        <div className="h-64 rounded-3xl bg-slate-200 dark:bg-white/5" />
      </div>
    );
  }

  const totalPayable = financials?.totalPayable || 0;
  const amountSettled = financials?.amountSettled || 0;
  const outstandingAmount = financials?.outstandingAmount || 0;
  const settlementHistory = financials?.settlementHistory || [];
  const purchases = financials?.purchases || [];

  const headingText = isDark ? "text-white font-extrabold" : "text-slate-900 font-extrabold";
  const subText = isDark ? "text-slate-300 font-medium" : "text-slate-600 font-medium";
  const accentText = isDark ? "text-cyan-300 font-extrabold" : "text-blue-700 font-extrabold";

  return (
    <div className="space-y-8 animate-fadeIn pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${headingText}`}>
            Financial Summary
          </h1>
          <p className={`text-xs md:text-sm mt-1 ${subText}`}>
            Reconciliation of configured Hari Om course fees, bank remittances, and outstanding payable balance.
          </p>
        </div>

        {outstandingAmount > 0 && (
          <Link
            href="/partner/settlements/create"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20 transition-all shrink-0 cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            Settle Outstanding Balance
          </Link>
        )}
      </div>

      {/* 4 Pillars of PRD Section 4.12 Financial Separation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pillar 1: Amount Payable to Hari Om */}
        <div className={`p-5 rounded-3xl border ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-extrabold uppercase tracking-wider ${subText}`}>
              1. Amount Payable to Hari Om
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isDark ? "bg-cyan-500/10 text-cyan-400" : "bg-blue-100 text-blue-800"}`}>
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-black mt-2.5 ${headingText}`}>
            ₹{Number(totalPayable).toLocaleString("en-IN")}
          </p>
          <p className={`text-[10px] mt-1 ${subText}`}>
            Total Hari Om fee for {purchases.length} handled enrollments
          </p>
        </div>

        {/* Pillar 2: Amount Received by Hari Om */}
        <div className={`p-5 rounded-3xl border ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-extrabold uppercase tracking-wider ${subText}`}>
              2. Amount Received by Hari Om
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-100 text-emerald-800"}`}>
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2.5">
            ₹{Number(amountSettled).toLocaleString("en-IN")}
          </p>
          <p className={`text-[10px] mt-1 ${subText}`}>
            Verified bank remittances received & cleared by Hari Om
          </p>
        </div>

        {/* Pillar 3: Amount Pending from Partner */}
        <div className={`p-5 rounded-3xl border ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-extrabold uppercase tracking-wider ${subText}`}>
              3. Amount Pending from Partner
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              outstandingAmount > 0
                ? isDark ? "bg-rose-500/10 text-rose-400" : "bg-rose-100 text-rose-800"
                : isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-100 text-emerald-800"
            }`}>
              {outstandingAmount > 0 ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            </div>
          </div>
          <p className={`text-2xl font-black mt-2.5 ${
            outstandingAmount > 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"
          }`}>
            ₹{Number(outstandingAmount).toLocaleString("en-IN")}
          </p>
          <p className={`text-[10px] mt-1 ${subText}`}>
            Net outstanding balance (Payable - Received)
          </p>
        </div>

        {/* Pillar 4: Settlement Status Overview */}
        <div className={`p-5 rounded-3xl border ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-extrabold uppercase tracking-wider ${subText}`}>
              4. Settlement Status
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isDark ? "bg-purple-500/10 text-purple-400" : "bg-purple-100 text-purple-800"}`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-black mt-2.5 ${isDark ? "text-purple-300" : "text-purple-900"}`}>
            {settlementHistory.filter((s: any) => (s.status || "").toLowerCase() === "completed" || (s.status || "").toLowerCase() === "paid").length} / {settlementHistory.length}
          </p>
          <p className={`text-[10px] mt-1 ${subText}`}>
            Verified settlement batches completed
          </p>
        </div>
      </div>

      {/* Settlement History Ledger */}
      <div className={`p-6 md:p-8 rounded-3xl border space-y-4 ${cardBg}`}>
        <div className={`flex justify-between items-center pb-4 border-b ${isDark ? "border-white/10" : "border-slate-200"}`}>
          <div>
            <h2 className={`text-base font-extrabold ${headingText}`}>Settlement History</h2>
            <p className={`text-xs ${subText}`}>
              Audit log of all remittances submitted to Hari Om Finance
            </p>
          </div>
          <Link
            href="/partner/settlements/create"
            className={`text-xs font-extrabold flex items-center gap-1 ${
              isDark ? "text-cyan-300 hover:text-cyan-200" : "text-blue-700 hover:text-blue-800"
            }`}
          >
            + Submit New Settlement
          </Link>
        </div>

        {settlementHistory.length === 0 ? (
          <div className={`p-8 text-center border border-dashed rounded-2xl text-xs ${
            isDark ? "border-white/15 text-slate-400" : "border-slate-300 text-slate-600"
          }`}>
            No settlements recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className={isDark ? "bg-white/[0.03] text-slate-400 border-b border-white/5" : "bg-slate-50 text-slate-700 border-b border-slate-200 font-bold"}>
                <tr>
                  <th className="py-3 px-3.5 font-semibold">Settlement #</th>
                  <th className="py-3 px-3.5 font-semibold">Bank UTR / Ref</th>
                  <th className="py-3 px-3.5 font-semibold">Method</th>
                  <th className="py-3 px-3.5 font-semibold text-right">Amount</th>
                  <th className="py-3 px-3.5 font-semibold">Submission Date</th>
                  <th className="py-3 px-3.5 font-semibold text-center">Status</th>
                  <th className="py-3 px-3.5 font-semibold text-right">Details</th>
                </tr>
              </thead>
              <tbody className={isDark ? "divide-y divide-white/5" : "divide-y divide-slate-200"}>
                {settlementHistory.map((s: any) => {
                  const sNumber = s.settlement_number || s.settlementNumber || s.id;
                  const isPaid = s.status === "Paid" || s.status === "Completed";
                  const isPartial = s.status === "Partial" || s.payment_mode === "partial" || s.paymentMode === "partial";
                  const isRejected = s.status === "Rejected";

                  const totalAmt = Number(s.total_amount || s.totalAmount || s.amount || 0);
                  const paidAmt = Number(s.paid_amount || s.paidAmount || s.netAmount || totalAmt);
                  const remAmt = Number(s.remaining_amount || s.remainingAmount || 0);

                  return (
                    <tr key={s.id} className={isDark ? "hover:bg-white/[0.02]" : "hover:bg-slate-50"}>
                      <td className={`py-3 px-3.5 font-mono font-bold ${isDark ? "text-cyan-400" : "text-blue-700"}`}>{sNumber}</td>
                      <td className={`py-3 px-3.5 font-mono ${isDark ? "text-slate-300" : "text-slate-800 font-semibold"}`}>
                        {s.reference_number || s.referenceNumber || "N/A"}
                      </td>
                      <td className={`py-3 px-3.5 ${isDark ? "text-slate-300" : "text-slate-800 font-semibold"}`}>
                        {s.payment_method || s.paymentMethod || "Bank Transfer"}
                      </td>
                      <td className="py-3 px-3.5 text-right font-bold">
                        <span className={isDark ? "text-white" : "text-slate-900"}>
                          ₹{paidAmt.toLocaleString("en-IN")}
                        </span>
                        {isPartial && remAmt > 0 && (
                          <span className="text-[10px] text-amber-400 block font-semibold">
                            (₹{remAmt.toLocaleString("en-IN")} Pending)
                          </span>
                        )}
                      </td>
                      <td className={`py-3 px-3.5 ${isDark ? "text-slate-400" : "text-slate-700 font-medium"}`}>
                        {new Date(s.created_at || s.submissionDate).toLocaleDateString("en-IN")}
                      </td>
                      <td className="py-3 px-3.5 text-center">
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                            isPaid
                              ? isDark
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : "bg-emerald-100 text-emerald-900 border-emerald-300"
                              : isPartial
                              ? isDark
                                ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                                : "bg-amber-100 text-amber-900 border-amber-300"
                              : isRejected
                              ? isDark
                                ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                : "bg-rose-100 text-rose-900 border-rose-300"
                              : isDark
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                              : "bg-blue-100 text-blue-900 border-blue-300"
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-right">
                        <Link
                          href={`/partner/settlements/${s.id || sNumber}`}
                          className={`text-xs font-bold hover:underline ${isDark ? "text-cyan-400" : "text-blue-700"}`}
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
