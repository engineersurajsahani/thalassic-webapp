"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { partnerService } from "@/services/partner.service";
import { useTheme } from "@/providers/theme-provider";
import {
  FileCheck,
  Search,
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  Receipt,
  Building,
} from "lucide-react";

export default function SettlementsHistoryPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted ? theme === "dark" : true;

  const [settlements, setSettlements] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await partnerService.getSettlements();
        setSettlements(data || []);
      } catch (err) {
        console.error("Failed to load settlements:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filtered = settlements.filter((s) => {
    const q = search.toLowerCase();
    const sNum = (s.settlement_number || s.settlementNumber || s.id || "").toLowerCase();
    const refNum = (s.reference_number || s.referenceNumber || "").toLowerCase();
    const match = sNum.includes(q) || refNum.includes(q);

    if (statusFilter === "all") return match;
    return match && (s.status || "").toLowerCase() === statusFilter.toLowerCase();
  });

  const cardBg = isDark
    ? "bg-[#0B0F19] rounded-[16px] border-0 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
    : "bg-[#FFFFFF] rounded-[16px] border-0 shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]";

  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#111827] dark:text-white">
            Partner Settlement History
          </h1>
          <p className={`text-xs md:text-sm mt-1 ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
            Track remittances sent to Hari Om for training course purchases, UTR verification status, and completion records.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            href="/partner/financials"
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold transition-colors ${
              isDark
                ? "bg-[#1F2937] hover:bg-[#374151] text-gray-200"
                : "bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#6B7280]"
            }`}
          >
            <Receipt className="w-4 h-4 text-[#3D5EF6]" />
            Financial Summary
          </Link>
          <Link
            href="/partner/settlements/create"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white shadow-sm transition-colors shrink-0"
          >
            <CreditCard className="w-4 h-4" />
            Submit Settlement
          </Link>
        </div>
      </div>

      {/* Filter & Search */}
      <div className={`p-4 flex flex-col sm:flex-row items-center gap-3 ${cardBg}`}>
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Settlement # or UTR reference..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-full text-xs font-medium outline-none transition-colors ${
              isDark
                ? "bg-[#111827] border-0 text-white placeholder:text-gray-500 focus:ring-1 focus:ring-[#3D5EF6]"
                : "bg-[#FAFAFA] border-0 text-[#111827] placeholder:text-[#9CA3AF] focus:ring-1 focus:ring-[#3D5EF6]"
            }`}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-3.5 py-2.5 rounded-full text-xs font-semibold outline-none transition-colors ${
              isDark ? "bg-[#111827] border-0 text-gray-200" : "bg-[#FAFAFA] border-0 text-[#111827]"
            }`}
          >
            <option value="all">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="partial">Partial Payment</option>
            <option value="under verification">Under Verification</option>
            <option value="completed">Completed / Paid</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Settlement Table */}
      <div className={`overflow-hidden ${cardBg}`}>
        {loading ? (
          <div className="p-8 text-center text-[#6B7280] dark:text-gray-400 animate-pulse">Loading settlements...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FileCheck className="w-10 h-10 text-[#9CA3AF] dark:text-gray-500 mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#111827] dark:text-white">No settlement records found.</p>
            <Link
              href="/partner/settlements/create"
              className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-[#3D5EF6] hover:text-[#2E4FE0] hover:underline"
            >
              Submit a new settlement batch
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className={isDark ? "bg-[#111827] text-gray-400 border-b border-[#1F2937]" : "bg-[#FAFAFA] text-[#6B7280] border-b border-[#E5E7EB] font-bold"}>
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Settlement Number</th>
                  <th className="py-3.5 px-4 font-semibold">Bank UTR / Reference</th>
                  <th className="py-3.5 px-4 font-semibold">Payment Method</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Settlement Amount</th>
                  <th className="py-3.5 px-4 font-semibold">Submission Date</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? "divide-[#1F2937]" : "divide-[#E5E7EB]"}`}>
                {filtered.map((s) => {
                  const sNumber = s.settlement_number || s.settlementNumber || s.id;
                  const isPaid = s.status === "Paid" || s.status === "Completed";
                  const isPartial = s.status === "Partial" || s.payment_mode === "partial" || s.paymentMode === "partial";
                  const isRejected = s.status === "Rejected";

                  const totalAmt = Number(s.total_amount || s.totalAmount || s.amount || 0);
                  const paidAmt = Number(s.paid_amount || s.paidAmount || s.netAmount || totalAmt);
                  const remAmt = Number(s.remaining_amount || s.remainingAmount || 0);

                  return (
                    <tr key={s.id} className={isDark ? "hover:bg-white/[0.02]" : "hover:bg-[#EEF1FE]/30 transition-colors"}>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#3D5EF6]">
                        {sNumber}
                      </td>
                      <td className={`py-3.5 px-4 font-mono ${isDark ? "text-gray-300" : "text-[#111827] font-semibold"}`}>
                        {s.reference_number || s.referenceNumber || "N/A"}
                      </td>
                      <td className={`py-3.5 px-4 ${isDark ? "text-gray-300" : "text-[#111827] font-semibold"}`}>
                        {s.payment_method || s.paymentMethod || "Bank Transfer"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className={`font-extrabold block ${isDark ? "text-white" : "text-[#111827]"}`}>
                          ₹{paidAmt.toLocaleString("en-IN")}
                        </span>
                        {isPartial && remAmt > 0 && (
                          <span className="text-[10px] font-semibold text-[#B45309] dark:text-amber-400 block">
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
                          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                            isDark
                              ? "border-[#1F2937] hover:bg-[#1F2937] text-gray-200 hover:text-white"
                              : "border-[#E5E7EB] hover:bg-[#EEF1FE] text-[#6B7280] hover:text-[#3D5EF6]"
                          }`}
                        >
                          Details
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
