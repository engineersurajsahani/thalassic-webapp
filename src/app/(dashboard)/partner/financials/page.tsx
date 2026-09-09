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
    ? "bg-[#0B0F19] rounded-[16px] border-0 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
    : "bg-[#FFFFFF] rounded-[16px] border-0 shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]";

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto animate-pulse">
        <div className="h-8 w-48 rounded-full bg-slate-200 dark:bg-white/5" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="h-32 rounded-[16px] bg-slate-200 dark:bg-white/5" />
          <div className="h-32 rounded-[16px] bg-slate-200 dark:bg-white/5" />
          <div className="h-32 rounded-[16px] bg-slate-200 dark:bg-white/5" />
          <div className="h-32 rounded-[16px] bg-slate-200 dark:bg-white/5" />
        </div>
        <div className="h-64 rounded-[16px] bg-slate-200 dark:bg-white/5" />
      </div>
    );
  }

  const totalPayable = financials?.totalPayable || 0;
  const amountSettled = financials?.amountSettled || 0;
  const outstandingAmount = financials?.outstandingAmount || 0;
  const settlementHistory = financials?.settlementHistory || [];
  const purchases = financials?.purchases || [];

  const headingText = isDark ? "text-white font-extrabold" : "text-[#111827] font-extrabold";
  const subText = isDark ? "text-gray-400 font-medium" : "text-[#6B7280] font-medium";
  const accentText = "text-[#3D5EF6] font-extrabold";

  return (
    <div className="space-y-8 animate-fadeIn pb-12 max-w-5xl">
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white shadow-sm transition-colors shrink-0 cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            Settle Outstanding Balance
          </Link>
        )}
      </div>

      {/* 4 Pillars of PRD Section 4.12 Financial Separation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pillar 1: Total Amount Payable to Hari Om */}
        <div className={`p-5 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-extrabold uppercase tracking-wider ${subText}`}>
              1. Total Amount Payable to Hari Om
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isDark ? "bg-[#3D5EF6]/15 text-[#3D5EF6]" : "bg-[#EEF1FE] text-[#3D5EF6]"}`}>
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
        <div className={`p-5 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-extrabold uppercase tracking-wider ${subText}`}>
              2. Amount Received by Hari Om
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isDark ? "bg-emerald-500/15 text-emerald-400" : "bg-[#DCFCE7] text-[#16A34A]"}`}>
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#16A34A] dark:text-emerald-400 mt-2.5">
            ₹{Number(amountSettled).toLocaleString("en-IN")}
          </p>
          <p className={`text-[10px] mt-1 ${subText}`}>
            Verified bank remittances received & cleared by Hari Om
          </p>
        </div>

        {/* Pillar 3: Amount Pending from Partner */}
        <div className={`p-5 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-extrabold uppercase tracking-wider ${subText}`}>
              3. Amount Pending from Partner
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              outstandingAmount > 0
                ? isDark ? "bg-rose-500/15 text-rose-400" : "bg-[#FEE2E2] text-[#DC2626]"
                : isDark ? "bg-emerald-500/15 text-emerald-400" : "bg-[#DCFCE7] text-[#16A34A]"
            }`}>
              {outstandingAmount > 0 ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            </div>
          </div>
          <p className={`text-2xl font-black mt-2.5 ${
            outstandingAmount > 0 ? "text-[#DC2626] dark:text-rose-400" : "text-[#16A34A] dark:text-emerald-400"
          }`}>
            ₹{Number(outstandingAmount).toLocaleString("en-IN")}
          </p>
          <p className={`text-[10px] mt-1 ${subText}`}>
            Net outstanding balance (Payable - Received)
          </p>
        </div>

        {/* Pillar 4: Settlement Status Overview */}
        <div className={`p-5 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-extrabold uppercase tracking-wider ${subText}`}>
              4. Settlement Status
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isDark ? "bg-[#3D5EF6]/15 text-[#3D5EF6]" : "bg-[#EEF1FE] text-[#3D5EF6]"}`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-black mt-2.5 ${headingText}`}>
            {settlementHistory.filter((s: any) => (s.status || "").toLowerCase() === "completed" || (s.status || "").toLowerCase() === "paid").length} / {settlementHistory.length}
          </p>
          <p className={`text-[10px] mt-1 ${subText}`}>
            Verified settlement batches completed
          </p>
        </div>
      </div>

      {/* Settlement History Ledger */}
      <div className={`p-6 md:p-8 space-y-4 ${cardBg}`}>
        <div className={`flex justify-between items-center pb-4 border-b ${isDark ? "border-[#1F2937]" : "border-[#E5E7EB]"}`}>
          <div>
            <h2 className={`text-base font-extrabold ${headingText}`}>Settlement History</h2>
            <p className={`text-xs ${subText}`}>
              Audit log of all remittances submitted to Hari Om Finance
            </p>
          </div>
          <Link
            href="/partner/settlements/create"
            className="text-xs font-bold text-[#3D5EF6] hover:text-[#2E4FE0] transition-colors flex items-center gap-1"
          >
            + Submit New Settlement
          </Link>
        </div>

        {settlementHistory.length === 0 ? (
          <div className={`p-8 text-center border border-dashed rounded-[16px] text-xs ${
            isDark ? "border-white/10 text-gray-400" : "border-[#E5E7EB] text-[#6B7280]"
          }`}>
            No settlements recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className={isDark ? "bg-[#111827] text-gray-400 border-b border-[#1F2937]" : "bg-[#FAFAFA] text-[#6B7280] border-b border-[#E5E7EB] font-bold"}>
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Settlement #</th>
                  <th className="py-3.5 px-4 font-semibold">Bank UTR / Ref</th>
                  <th className="py-3.5 px-4 font-semibold">Method</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Amount</th>
                  <th className="py-3.5 px-4 font-semibold">Submission Date</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Details</th>
                </tr>
              </thead>
              <tbody className={isDark ? "divide-y divide-[#1F2937]" : "divide-y divide-[#E5E7EB]"}>
                {settlementHistory.map((s: any) => {
                  const sNumber = s.settlement_number || s.settlementNumber || s.id;
                  const isPaid = s.status === "Paid" || s.status === "Completed";
                  const isPartial = s.status === "Partial" || s.payment_mode === "partial" || s.paymentMode === "partial";
                  const isRejected = s.status === "Rejected";

                  const totalAmt = Number(s.total_amount || s.totalAmount || s.amount || 0);
                  const paidAmt = Number(s.paid_amount || s.paidAmount || s.netAmount || totalAmt);
                  const remAmt = Number(s.remaining_amount || s.remainingAmount || 0);

                  return (
                    <tr key={s.id} className={isDark ? "hover:bg-white/[0.02]" : "hover:bg-[#EEF1FE]/30 transition-colors"}>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#3D5EF6]">{sNumber}</td>
                      <td className={`py-3.5 px-4 font-mono ${isDark ? "text-gray-300" : "text-[#111827] font-semibold"}`}>
                        {s.reference_number || s.referenceNumber || "N/A"}
                      </td>
                      <td className={`py-3.5 px-4 ${isDark ? "text-gray-300" : "text-[#111827] font-semibold"}`}>
                        {s.payment_method || s.paymentMethod || "Bank Transfer"}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold">
                        <span className={isDark ? "text-white" : "text-[#111827]"}>
                          ₹{paidAmt.toLocaleString("en-IN")}
                        </span>
                        {isPartial && remAmt > 0 && (
                          <span className="text-[10px] text-[#B45309] dark:text-amber-400 block font-semibold">
                            (₹{remAmt.toLocaleString("en-IN")} Pending)
                          </span>
                        )}
                      </td>
                      <td className={`py-3.5 px-4 ${isDark ? "text-gray-400" : "text-[#6B7280] font-medium"}`}>
                        {new Date(s.created_at || s.submissionDate).toLocaleDateString("en-IN")}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                            isPaid
                              ? "bg-[#DCFCE7] text-[#16A34A] dark:bg-emerald-500/15 dark:text-emerald-400"
                              : isPartial
                              ? "bg-[#FEF3C7] text-[#B45309] dark:bg-amber-500/15 dark:text-amber-400"
                              : isRejected
                              ? "bg-[#FEE2E2] text-[#DC2626] dark:bg-red-500/15 dark:text-red-400"
                              : "bg-[#EEF1FE] text-[#3D5EF6] dark:bg-blue-500/15 dark:text-blue-400"
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/partner/settlements/${s.id || sNumber}`}
                          className="text-xs font-bold text-[#3D5EF6] hover:text-[#2E4FE0] hover:underline"
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
