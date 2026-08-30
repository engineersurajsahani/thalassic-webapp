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
    ? "bg-[#09162c]/80 border-white/5 shadow-sm"
    : "bg-white border-slate-200/80 shadow-sm";

  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full ${
                isDark ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "bg-blue-50 text-blue-600 border border-blue-200"
              }`}
            >
              Settlement Records
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1.5">
            Partner Settlement History
          </h1>
          <p className={`text-xs md:text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Track remittances sent to Hari Om for physical course purchases, UTR verification status, and completion records.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            href="/partner/financials"
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              isDark
                ? "bg-white/10 hover:bg-white/15 text-white border border-white/10"
                : "bg-slate-100 hover:bg-slate-200 text-slate-800"
            }`}
          >
            <Receipt className="w-4 h-4 text-cyan-400" />
            Financial Statement
          </Link>
          <Link
            href="/partner/settlements/create"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20 transition-all shrink-0"
          >
            <CreditCard className="w-4 h-4" />
            Submit Settlement
          </Link>
        </div>
      </div>

      {/* Filter & Search */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center gap-3 ${cardBg}`}>
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Settlement # or UTR reference..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium outline-none transition-all ${
              isDark
                ? "bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:border-cyan-500/50"
                : "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500"
            }`}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-3 py-2.5 rounded-xl text-xs font-semibold outline-none transition-all ${
              isDark ? "bg-white/5 border border-white/10 text-slate-200" : "bg-slate-50 border border-slate-200 text-slate-700"
            }`}
          >
            <option value="all">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="under verification">Under Verification</option>
            <option value="completed">Completed / Paid</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Settlement Table */}
      <div className={`rounded-2xl border overflow-hidden ${cardBg}`}>
        {loading ? (
          <div className="p-8 text-center text-slate-400 animate-pulse">Loading settlements...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FileCheck className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-300">No settlement records found.</p>
            <Link
              href="/partner/settlements/create"
              className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:underline"
            >
              Submit a new settlement batch
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className={isDark ? "bg-white/[0.03] text-slate-400 border-b border-white/5" : "bg-slate-50 text-slate-500 border-b border-slate-200"}>
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Settlement Number</th>
                  <th className="py-3.5 px-4 font-semibold">Bank UTR / Reference</th>
                  <th className="py-3.5 px-4 font-semibold">Payment Method</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Settled Amount</th>
                  <th className="py-3.5 px-4 font-semibold">Submission Date</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((s) => {
                  const sNumber = s.settlement_number || s.settlementNumber || s.id;
                  const isPaid = s.status === "Paid" || s.status === "Completed";
                  const isRejected = s.status === "Rejected";

                  return (
                    <tr key={s.id} className="hover:bg-white/[0.02]">
                      <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">
                        {sNumber}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {s.reference_number || s.referenceNumber || "N/A"}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {s.payment_method || s.paymentMethod || "Bank Transfer"}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-right text-white">
                        ₹{Number(s.total_amount || s.amount || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {new Date(s.created_at || s.submissionDate).toLocaleDateString("en-IN")}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                            isPaid
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : isRejected
                              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/partner/settlements/${s.id || sNumber}`}
                          className="px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-xs font-semibold text-cyan-400"
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
