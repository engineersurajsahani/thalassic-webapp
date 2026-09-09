"use client";

import React, { useEffect, useState } from "react";
import { agentService } from "@/services/agent.service";
import { useTheme } from "@/providers/theme-provider";
import {
  DollarSign, Clock, CheckCircle2, XCircle, Search, Filter
} from "lucide-react";

export default function CommissionsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [commissions, setCommissions] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    async function loadData() {
      try {
        const data = await agentService.getCommissions();
        setCommissions(data);

        const dash: any = await agentService.getDashboard();
        setStats(dash?.stats || dash || {});
      } catch (err) {
        console.error("Failed to load commissions ledger:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return (
          <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${isDark ? "text-emerald-400 bg-emerald-400/10 border border-emerald-500/20" : "text-emerald-700 bg-emerald-50 border border-emerald-200"}`}>
            <CheckCircle2 className="w-3 h-3" /> Paid
          </span>
        );
      case "Approved":
        return (
          <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${isDark ? "text-cyan-400 bg-cyan-400/10 border border-cyan-500/20" : "text-blue-700 bg-blue-50 border border-blue-200"}`}>
            <CheckCircle2 className="w-3 h-3" /> Approved
          </span>
        );
      case "Cancelled":
        return (
          <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${isDark ? "text-red-400 bg-red-400/10 border border-red-500/20" : "text-red-700 bg-red-50 border border-red-200"}`}>
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      default:
        return (
          <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full animate-pulse ${isDark ? "text-amber-400 bg-amber-400/10 border border-amber-500/20" : "text-amber-700 bg-amber-50 border border-amber-200"}`}>
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
    }
  };

  const filteredCommissions = commissions.filter((comm) => {
    const matchesSearch =
      comm.seafarer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.course_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      comm.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`h-24 rounded-2xl ${isDark ? "bg-[#09162c]" : "bg-slate-100"}`} />
          ))}
        </div>
        <div className={`h-96 rounded-3xl ${isDark ? "bg-[#09162c]" : "bg-slate-100"}`} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn relative pb-10">
      
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Commissions Ledger
        </h1>
        <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Review and audit calculated commission receipts. Approved commissions are settled into your bank account monthly.
        </p>
      </div>

      {/* Metrics Summary cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Commissions Earned", value: `₹${stats?.totalEarned?.toLocaleString() || 0}`, icon: DollarSign, iconBg: "bg-cyan-500/10", iconText: "text-cyan-500" },
          { label: "Pending Clearance", value: `₹${stats?.pendingCommission?.toLocaleString() || 0}`, icon: Clock, iconBg: "bg-amber-500/10", iconText: "text-amber-500" },
          { label: "Settled / Paid Earnings", value: `₹${stats?.paidCommission?.toLocaleString() || 0}`, icon: CheckCircle2, iconBg: "bg-emerald-500/10", iconText: "text-emerald-500" },
        ].map((met, idx) => {
          const Icon = met.icon;
          return (
            <div
              key={idx}
              className={`rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 backdrop-blur-xl ${
                isDark 
                  ? "bg-[#0a1122]/70 border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-white" 
                  : "bg-white/80 border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-slate-900"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className={`text-[10px] font-black tracking-widest uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    {met.label}
                  </span>
                  <p className="text-xl font-black tracking-tight">{met.value}</p>
                </div>
                <div className={`p-2 rounded-2xl ${met.iconBg} ${met.iconText}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Ledger Table Section */}
      <section className={`rounded-3xl border p-6 md:p-8 shadow-xl relative overflow-hidden ${
        isDark ? "bg-[#0a1122]/70 border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-white backdrop-blur-xl" : "bg-white/80 border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-slate-900 backdrop-blur-xl"
      }`}>
        
        {/* Search & Filters */}
        <div className={`flex flex-col md:flex-row justify-between items-center gap-4 border-b pb-5 mb-5 ${isDark ? "border-slate-800/40" : "border-slate-200"}`}>
          <div className="flex-1 w-full max-w-sm">
            <label className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm ${isDark ? "bg-[#0b182d] border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`}>
              <Search className="w-3.5 h-3.5 shrink-0 opacity-50" />
              <input
                type="text"
                placeholder="Search by seafarer name or course..."
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
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="paid">Paid</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Ledger Table */}
        {filteredCommissions.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <DollarSign className="w-10 h-10 mx-auto opacity-30 mb-3" />
            <h4 className="text-sm font-bold">No commission entries found</h4>
            <p className="text-xs mt-1">Earnings will generate here upon booking completion.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs leading-normal">
              <thead>
                <tr className={`font-black border-b uppercase tracking-widest text-[9px] ${
                  isDark ? "text-slate-500 border-slate-800" : "text-slate-400 border-slate-100"
                }`}>
                  <th className="pb-3 pr-4">Invoice Ref</th>
                  <th className="pb-3 pr-4">Referred Seafarer</th>
                  <th className="pb-3 pr-4">Course Details</th>
                  <th className="pb-3 pr-4">Course Fee</th>
                  <th className="pb-3 pr-4">Comm. Rate</th>
                  <th className="pb-3 pr-4">Earnings</th>
                  <th className="pb-3 pr-4">Purchase Date</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/10">
                {filteredCommissions.map((comm) => (
                  <tr key={comm.id} className={`hover:bg-slate-500/5 transition-colors ${
                    isDark ? "border-b border-slate-900/60" : "border-b border-slate-100"
                  }`}>
                    <td className={`py-4 pr-4 font-black tracking-wider text-[10px] ${isDark ? "text-cyan-400" : "text-blue-700"}`}>
                      INV-{comm.purchase_id?.substring(0, 8).toUpperCase() || comm.id.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="py-4 pr-4 font-extrabold">
                      {comm.seafarer_name}
                    </td>
                    <td className="py-4 pr-4 font-semibold max-w-[150px] truncate">
                      {comm.course_name}
                    </td>
                    <td className={`py-4 pr-4 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      ₹{comm.course_fee?.toLocaleString()}
                    </td>
                    <td className="py-4 pr-4 font-bold">
                      {comm.commission_rate}%
                    </td>
                    <td className={`py-4 pr-4 font-black ${isDark ? "text-cyan-400" : "text-blue-700"}`}>
                      ₹{comm.commission_amount?.toLocaleString()}
                    </td>
                    <td className={`py-4 pr-4 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      {new Date(comm.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 text-right">
                      {getStatusBadge(comm.status)}
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
