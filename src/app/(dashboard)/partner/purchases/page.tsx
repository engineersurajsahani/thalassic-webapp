"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { partnerService } from "@/services/partner.service";
import { useTheme } from "@/providers/theme-provider";
import {
  Receipt,
  Search,
  ShoppingCart,
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
} from "lucide-react";

export default function PurchasesPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted ? theme === "dark" : true;

  const [purchases, setPurchases] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await partnerService.getPurchases();
        setPurchases(data || []);
      } catch (err) {
        console.error("Failed to load purchases:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filtered = purchases.filter((p) => {
    const q = search.toLowerCase();
    const matchQuery =
      p.id?.toLowerCase().includes(q) ||
      p.seafarerName?.toLowerCase().includes(q) ||
      p.courseName?.toLowerCase().includes(q) ||
      p.indosNumber?.toLowerCase().includes(q);

    if (statusFilter === "all") return matchQuery;
    return matchQuery && p.settlementStatus?.toLowerCase() === statusFilter.toLowerCase();
  });

  const totalPayableSum = filtered.reduce((acc, curr) => acc + Number(curr.payableAmount || 0), 0);

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
              Course Purchase Ledger
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1.5">
            Partner Course Purchases
          </h1>
          <p className={`text-xs md:text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Track all physical course enrollments created by your partner account, with settlement statuses and configured payable fees.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            href="/partner/settlements/create"
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              isDark
                ? "bg-white/10 hover:bg-white/15 text-white border border-white/10"
                : "bg-slate-100 hover:bg-slate-200 text-slate-800"
            }`}
          >
            <CreditCard className="w-4 h-4 text-emerald-400" />
            Submit Settlement
          </Link>
          <Link
            href="/partner/purchases/create"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 transition-all shrink-0"
          >
            <ShoppingCart className="w-4 h-4" />
            New Purchase
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center gap-3 ${cardBg}`}>
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Purchase ID, Seafarer name, INDoS, or Course..."
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
            <option value="all">All Settlement Statuses</option>
            <option value="pending">Pending Settlement</option>
            <option value="submitted">Submitted</option>
            <option value="under verification">Under Verification</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Purchases Table */}
      <div className={`rounded-2xl border overflow-hidden ${cardBg}`}>
        {loading ? (
          <div className="p-8 text-center text-slate-400 animate-pulse">Loading purchases...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Receipt className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-300">No purchases found.</p>
            <Link
              href="/partner/purchases/create"
              className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:underline"
            >
              Create a new physical course purchase
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className={isDark ? "bg-white/[0.03] text-slate-400 border-b border-white/5" : "bg-slate-50 text-slate-500 border-b border-slate-200"}>
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Purchase ID</th>
                  <th className="py-3.5 px-4 font-semibold">Seafarer Master</th>
                  <th className="py-3.5 px-4 font-semibold">Course Program</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Hari Om Payable</th>
                  <th className="py-3.5 px-4 font-semibold">Purchase Date</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Settlement Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">
                      {p.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-bold text-white leading-tight">{p.seafarerName}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          INDoS: {p.indosNumber || "N/A"}
                        </p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-200">{p.courseName}</p>
                      <p className="text-[10px] text-slate-400">Physical Training</p>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-right text-cyan-300">
                      ₹{Number(p.payableAmount).toLocaleString("en-IN")}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(p.purchaseDate).toLocaleDateString("en-IN")}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                          p.settlementStatus === "Completed"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : p.settlementStatus === "Submitted"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            : p.settlementStatus === "Under Verification"
                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {p.settlementStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/partner/purchases/${p.id}`}
                        className="px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-xs font-semibold text-cyan-400"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
