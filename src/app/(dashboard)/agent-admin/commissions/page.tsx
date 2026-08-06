"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import { agentAdminService } from "@/services/agent-admin.service";
import { Search, DollarSign, RefreshCw, ArrowUpRight, CheckSquare } from "lucide-react";

export default function Commissions() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [loading, setLoading] = useState(true);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const card = `rounded-3xl overflow-hidden p-6 ${isDark ? "bg-[#0d1f35] border border-white/[0.06]" : "bg-white border border-slate-200 shadow-sm"}`;
  const labelText = isDark ? "text-white/50" : "text-slate-500";
  const ht = isDark ? "text-white/80" : "text-slate-800";
  const mt = isDark ? "text-white/35" : "text-slate-400";

  const fetchCommissions = async () => {
    try {
      const list = await agentAdminService.getCommissions();
      setCommissions(list);
    } catch (err) {
      console.error("Failed to load commissions ledger: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissions();
  }, []);

  const filteredCommissions = commissions.filter(c => {
    const matchesSearch = 
      c.seafarerName?.toLowerCase().includes(search.toLowerCase()) ||
      c.courseName?.toLowerCase().includes(search.toLowerCase()) ||
      c.agentName?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = 
      statusFilter === "all" ||
      c.status.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${ht}`}>Agent Commissions</h1>
          <p className={`text-xs mt-1.5 ${mt}`}>View, track, and manage referral commission calculations and payments.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <label className={`flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm ${isDark ? "bg-white/5 border-white/10 text-white/60" : "bg-white border-slate-200 text-slate-600 shadow-sm"}`}>
          <Search className="w-4 h-4 opacity-55" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search commissions by seafarer, course, or agent..."
            className="bg-transparent outline-none w-full text-xs"
          />
        </label>
        
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-3 py-2.5 rounded-xl border text-xs font-semibold outline-none cursor-pointer ${isDark ? "bg-[#0d1f35] border-white/10 text-white" : "bg-white border-slate-200 text-slate-700 shadow-sm"}`}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="paid">Paid / Settled</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button 
            onClick={fetchCommissions}
            className={`p-2.5 rounded-xl border flex items-center justify-center cursor-pointer transition ${isDark ? "border-white/10 hover:bg-white/5 text-white/50" : "border-slate-200 hover:bg-slate-50 text-slate-500 shadow-sm"}`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Commissions Table List */}
      <div className={card}>
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredCommissions.length === 0 ? (
          <div className="text-center py-10">
            <p className={`text-xs ${mt}`}>No commission records found matching your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b pb-3 ${isDark ? "border-white/5 text-white/30" : "border-slate-100 text-slate-400"} uppercase font-semibold tracking-wider`}>
                  <th className="py-3.5 px-2">Invoice / Ref</th>
                  <th className="py-3.5 px-2">Referring Agent</th>
                  <th className="py-3.5 px-2">Details</th>
                  <th className="py-3.5 px-2">Fee</th>
                  <th className="py-3.5 px-2">Rate</th>
                  <th className="py-3.5 px-2">Earnings</th>
                  <th className="py-3.5 px-2">Status</th>
                  <th className="py-3.5 px-2 text-right">Settled Date</th>
                </tr>
              </thead>
              <tbody className={isDark ? "divide-y divide-white/5" : "divide-y divide-slate-100"}>
                {filteredCommissions.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.01] transition-all">
                    {/* Invoice Number */}
                    <td className="py-4 px-2">
                      <p className="font-bold text-cyan-400 font-mono flex items-center gap-1">
                        {c.invoiceNumber}
                        <ArrowUpRight className="w-3 h-3 opacity-50" />
                      </p>
                      <p className={`text-[10px] mt-0.5 ${labelText}`}>Date: {new Date(c.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}</p>
                    </td>

                    {/* Agent Name */}
                    <td className="py-4 px-2 font-bold">
                      {c.agentName}
                    </td>

                    {/* Details */}
                    <td className="py-4 px-2">
                      <p className={`font-semibold ${isDark ? "text-white/80" : "text-slate-700"}`}>{c.seafarerName}</p>
                      <p className={`text-[10px] mt-0.5 ${labelText}`}>{c.courseName}</p>
                    </td>

                    {/* Fee */}
                    <td className="py-4 px-2 font-semibold">
                      {c.courseFee}
                    </td>

                    {/* Rate */}
                    <td className="py-4 px-2 font-bold text-cyan-400">
                      {c.commissionRate}
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-2 font-bold text-emerald-500">
                      {c.commissionAmount}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        c.status === "Paid" 
                          ? "bg-emerald-500/10 text-emerald-500" 
                          : c.status === "Approved" 
                          ? "bg-cyan-500/10 text-cyan-500" 
                          : c.status === "Cancelled"
                          ? "bg-red-500/10 text-red-500"
                          : "bg-amber-500/10 text-amber-500"
                      }`}>
                        {c.status}
                      </span>
                    </td>

                    {/* Settled Date */}
                    <td className="py-4 px-2 text-right">
                      {c.settledAt ? (
                        <span className="font-semibold">{new Date(c.settledAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      ) : (
                        <span className={`text-[10px] italic ${labelText}`}>-</span>
                      )}
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
