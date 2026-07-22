"use client";

import React, { useEffect, useState } from "react";
import { agentService } from "@/services/agent.service";
import { useTheme } from "@/providers/theme-provider";
import {
  ClipboardList, Search, Filter, Calendar, CheckCircle2, XCircle
} from "lucide-react";

export default function ReferredPurchasesPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    async function loadData() {
      try {
        const data = await agentService.getPurchases();
        setPurchases(data);
      } catch (err) {
        console.error("Failed to load referred purchases:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getStatusBadge = (status: string) => {
    if (status === "Completed") {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" /> Completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-red-400 bg-red-400/10 px-2.5 py-0.5 rounded-full border border-red-500/20">
        <XCircle className="w-3 h-3" /> Cancelled
      </span>
    );
  };

  const filteredPurchases = purchases.filter((pur) => {
    const matchesSearch =
      pur.seafarerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pur.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pur.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      pur.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-16 rounded-2xl ${isDark ? 'bg-[#09162c]' : 'bg-slate-100'}" />
        <div className="h-96 rounded-3xl ${isDark ? 'bg-[#09162c]' : 'bg-slate-100'}" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn relative pb-10">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit ${
          isDark ? "bg-cyan-500/10 text-cyan-400" : "bg-blue-50 text-[#3b71cb]"
        }`}>
          🛒 Conversion Records
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight mt-1.5">
          Referred Course Purchases
        </h1>
        <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Monitor bookings completed using your referral code. Purchases populate automatically once billing is verified.
        </p>
      </div>

      {/* Main ledger card */}
      <section className={`rounded-3xl border p-6 md:p-8 shadow-xl relative overflow-hidden ${
        isDark ? "bg-[#0a1122]/70 border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-white backdrop-blur-xl" : "bg-white/80 border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-slate-900 backdrop-blur-xl"
      }`}>
        
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-800/40 pb-5 mb-5">
          <div className="flex-1 w-full max-w-sm">
            <label className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm ${isDark ? "bg-[#0b182d] border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-850"}`}>
              <Search className="w-3.5 h-3.5 shrink-0 opacity-50" />
              <input
                type="text"
                placeholder="Search by invoice, course, or crew name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent outline-none w-full text-[13px]"
              />
            </label>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end">
            <Filter className="w-4 h-4 opacity-50" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`p-2.5 text-xs rounded-lg border outline-none cursor-pointer ${
                isDark ? "bg-[#0b182d] border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
              }`}
            >
              <option value="all">All Purchases</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Directory Table */}
        {filteredPurchases.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <ClipboardList className="w-10 h-10 mx-auto opacity-30 mb-3" />
            <h4 className="text-sm font-bold">No purchase records found</h4>
            <p className="text-xs mt-1">Referred checkouts will display here automatically.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs leading-normal">
              <thead>
                <tr className={`font-black border-b uppercase tracking-widest text-[9px] ${
                  isDark ? "text-slate-500 border-slate-800" : "text-slate-400 border-slate-100"
                }`}>
                  <th className="pb-3 pr-4">Invoice Number</th>
                  <th className="pb-3 pr-4">Seafarer Name</th>
                  <th className="pb-3 pr-4">Course Name</th>
                  <th className="pb-3 pr-4">Purchase Date</th>
                  <th className="pb-3 pr-4">Course Fee</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/10">
                {filteredPurchases.map((pur, i) => (
                  <tr key={i} className={`hover:bg-slate-500/5 transition-colors ${
                    isDark ? "border-b border-slate-900/60" : "border-b border-slate-100"
                  }`}>
                    <td className="py-4 pr-4 font-black tracking-wider text-cyan-400 text-[10px]">
                      {pur.invoiceNumber}
                    </td>
                    <td className="py-4 pr-4 font-extrabold">
                      {pur.seafarerName}
                    </td>
                    <td className="py-4 pr-4 font-semibold max-w-[250px] truncate">
                      {pur.courseName}
                    </td>
                    <td className={`py-4 pr-4 ${isDark ? "text-slate-400" : "text-slate-550"}`}>
                      {new Date(pur.purchaseDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 pr-4 font-black">
                      ₹{pur.courseFee?.toLocaleString()}
                    </td>
                    <td className="py-4 text-right">
                      {getStatusBadge(pur.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
