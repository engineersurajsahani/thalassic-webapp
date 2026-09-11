"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "@/providers/theme-provider";
import { financeService } from "@/services/finance.service";
import {
  TrendingUp, RefreshCw, Search, X, ChevronDown, History,
  DollarSign, Clock, CheckCircle2, BanknoteIcon, AlertCircle,
} from "lucide-react";

const STATUSES = ["all", "Pending", "Approved", "Paid", "Settled", "Rejected", "Under Review"];

function CommissionStatusBadge({ status }: { status: string }) {
  const s = (status || "").toLowerCase();
  if (s === "paid" || s === "settled")
    return <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">{status}</span>;
  if (s === "approved")
    return <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400">Approved</span>;
  if (s === "pending" || s === "under review")
    return <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">{status}</span>;
  if (s === "rejected")
    return <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">Rejected</span>;
  return <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">{status}</span>;
}

export default function CommissionsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [data,          setData]         = useState<any>({ summary: {}, commissions: [] });
  const [loading,       setLoading]      = useState(true);
  const [search,        setSearch]       = useState("");
  const [statusFilter,  setStatusFilter] = useState("all");

  const card    = isDark ? "bg-[#0c1a2e] border-white/5" : "bg-white border-slate-200";
  const text    = isDark ? "text-white"                   : "text-slate-800";
  const subtext = isDark ? "text-white/40"                : "text-slate-500";
  const input   = isDark ? "bg-[#0a1525] border-white/8 text-white placeholder-white/20 focus:border-sky-500/40" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-sky-400";
  const row     = isDark ? "border-white/5 hover:bg-white/3" : "border-slate-100 hover:bg-slate-50";
  const th      = isDark ? "text-white/30 border-white/5"    : "text-slate-400 border-slate-100";

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await financeService.getCommissions();
      setData(result);
    } catch {
      setData({ summary: {}, commissions: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const fmt = (n: number) => n != null ? `₹${(n || 0).toLocaleString("en-IN")}` : "₹0";
  const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  const { summary = {}, commissions = [] } = data;

  const filtered = commissions.filter((c: any) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (c.seafarerName?.toLowerCase().includes(q) || c.courseName?.toLowerCase().includes(q) || c.agentName?.toLowerCase().includes(q));
    }
    return true;
  });

  const summaryCards = [
    { label: "Pending Commission",     value: summary.pendingCommission,     icon: Clock,        color: "amber"   },
    { label: "Approved Commission",    value: summary.approvedCommission,    icon: CheckCircle2, color: "sky"     },
    { label: "Paid Commission",        value: summary.paidCommission,        icon: DollarSign,   color: "emerald" },
    { label: "Outstanding Commission", value: summary.outstandingCommission, icon: AlertCircle,  color: "rose"    },
    { label: "Total Commission Expense",value: summary.totalCommissionExpense,icon: TrendingUp,  color: "purple"  },
  ];

  const colorMap: Record<string, string> = {
    amber:   isDark ? "bg-amber-500/10 text-amber-400 border-amber-500/20"   : "bg-amber-50 text-amber-700 border-amber-200",
    sky:     isDark ? "bg-sky-500/10 text-sky-400 border-sky-500/20"         : "bg-sky-50 text-sky-700 border-sky-200",
    emerald: isDark ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-emerald-50 text-emerald-700 border-emerald-200",
    rose:    isDark ? "bg-rose-500/10 text-rose-400 border-rose-500/20"      : "bg-rose-50 text-rose-700 border-rose-200",
    purple:  isDark ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : "bg-purple-50 text-purple-700 border-purple-200",
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-bold tracking-tight ${text}`}>Commission Overview</h1>
          <p className={`text-xs mt-0.5 ${subtext}`}>Platform-wide agent commission snapshot (read-only, immutable)</p>
        </div>
        <button onClick={load} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${isDark ? "border-white/10 text-white/50 hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {summaryCards.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`p-4 rounded-xl border ${card} transition-all`}>
              <div className={`w-8 h-8 rounded-lg border flex items-center justify-center mb-3 ${colorMap[s.color]}`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className={`text-[10px] font-semibold uppercase tracking-wider ${subtext}`}>{s.label}</p>
              {loading ? (
                <div className={`h-6 w-24 rounded animate-pulse mt-1.5 ${isDark ? "bg-white/5" : "bg-slate-100"}`} />
              ) : (
                <p className={`text-xl font-bold mt-1 ${text}`}>{fmt(s.value || 0)}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className={`p-4 rounded-xl border ${card} flex flex-wrap gap-3`}>
        <div className="flex-1 min-w-52 relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${subtext}`} />
          <input id="commissions-search" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by seafarer, agent, or course…"
            className={`w-full pl-8 pr-3 py-2 rounded-lg text-xs border outline-none transition-all ${input}`} />
        </div>
        <select id="commissions-status-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className={`px-3 py-2 rounded-lg text-xs border outline-none ${input}`}>
          {STATUSES.map(s => <option key={s} value={s}>{s === "all" ? "All Statuses" : s}</option>)}
        </select>
        {statusFilter !== "all" && (
          <button onClick={() => setStatusFilter("all")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-rose-400 border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 transition-all">
            <X className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      {/* Commission Table */}
      <div className={`rounded-xl border ${card} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className={`border-b ${isDark ? "border-white/5" : "border-slate-100"}`}>
                {["Seafarer", "Agent", "Course", "Fee", "Rate", "Commission", "Source", "Status", "Date"].map(h => (
                  <th key={h} className={`px-4 py-3 text-left font-semibold uppercase tracking-wider ${th}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className={`border-b ${row}`}>
                    {[...Array(9)].map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className={`h-3 rounded animate-pulse ${isDark ? "bg-white/5" : "bg-slate-100"}`} /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={9} className={`px-4 py-12 text-center ${subtext}`}>
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-20" />No commission records found
                </td></tr>
              ) : filtered.map((c: any) => (
                <tr key={c.id} className={`border-b ${row} transition-colors`}>
                  <td className={`px-4 py-3 font-medium ${text}`}>{c.seafarerName}</td>
                  <td className={`px-4 py-3 ${subtext}`}>{c.agentName}</td>
                  <td className={`px-4 py-3 max-w-36 truncate ${subtext}`}>{c.courseName}</td>
                  <td className={`px-4 py-3 ${text}`}>{c.courseFee}</td>
                  <td className={`px-4 py-3 ${subtext}`}>{c.commissionRate}</td>
                  <td className={`px-4 py-3 font-semibold ${isDark ? "text-emerald-400" : "text-emerald-700"}`}>{c.commissionAmount}</td>
                  <td className={`px-4 py-3 text-[11px] ${subtext}`}>{c.commissionSource}</td>
                  <td className="px-4 py-3"><CommissionStatusBadge status={c.status} /></td>
                  <td className={`px-4 py-3 ${subtext}`}>{fmtDate(c.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && filtered.length > 0 && (
          <div className={`px-4 py-2.5 border-t text-xs ${isDark ? "border-white/5 text-white/25" : "border-slate-100 text-slate-400"}`}>
            Showing {filtered.length} of {commissions.length} commission records — Historical values are immutable (PRD 7.4)
          </div>
        )}
      </div>
    </div>
  );
}
