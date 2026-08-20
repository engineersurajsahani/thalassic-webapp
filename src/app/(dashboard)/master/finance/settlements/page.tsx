"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/providers/theme-provider";
import { financeService } from "@/services/finance.service";
import { financeService as invoiceViewer } from "@/services/finance.service";
import {
  Handshake, RefreshCw, Search, X, CheckCircle2, DollarSign,
  Clock, FileText, Download, Shield,
} from "lucide-react";

const STATUSES = ["all", "Pending", "Approved", "Paid"];

function SettlementStatusBadge({ status }: { status: string }) {
  const s = (status || "").toLowerCase();
  if (s === "paid")    return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Paid</span>;
  if (s === "approved") return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border bg-sky-500/10 text-sky-400 border-sky-500/20">Approved</span>;
  return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border bg-amber-500/10 text-amber-400 border-amber-500/20">Pending</span>;
}

export default function SettlementsPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [settlements,  setSettlements]  = useState<any[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search,       setSearch]       = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast,        setToast]        = useState<{ msg: string; ok: boolean } | null>(null);

  const card    = isDark ? "bg-[#0c1a2e] border-white/5" : "bg-white border-slate-200";
  const text    = isDark ? "text-white"                   : "text-slate-800";
  const subtext = isDark ? "text-white/40"                : "text-slate-500";
  const input   = isDark ? "bg-[#0a1525] border-white/8 text-white placeholder-white/20 focus:border-sky-500/40" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-sky-400";
  const row     = isDark ? "border-white/5 hover:bg-white/3" : "border-slate-100 hover:bg-slate-50";
  const th      = isDark ? "text-white/30 border-white/5"    : "text-slate-400 border-slate-100";

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await financeService.getSettlements();
      setSettlements(data);
    } catch {
      setSettlements([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  const filtered = settlements.filter((s) => {
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (s.settlementNumber?.toLowerCase().includes(q) || s.agentName?.toLowerCase().includes(q));
    }
    return true;
  });

  const handleApprove = async (id: string) => {
    setActionLoading(id + "-approve");
    try {
      await financeService.approveSettlement(id);
      showToast("Settlement approved successfully.", true);
      await load();
    } catch (e: any) {
      showToast(e?.response?.data?.message || "Failed to approve settlement.", false);
    } finally {
      setActionLoading(null);
    }
  };

  const handlePay = async (id: string, currentStatus: string) => {
    if (currentStatus !== "Approved") {
      showToast("Settlement must be Approved before it can be marked as Paid.", false);
      return;
    }
    setActionLoading(id + "-pay");
    try {
      await financeService.paySettlement(id);
      showToast("Settlement marked as Paid. HAC invoice generated automatically.", true);
      await load();
    } catch (e: any) {
      showToast(e?.response?.data?.message || "Failed to mark settlement as paid.", false);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDownloadSettlementInvoice = async (s: any) => {
    if (!s.hacInvoiceNumber) {
      showToast("HAC invoice not yet generated. Pay the settlement first.", false);
      return;
    }
    // Navigate to invoices page with a search for this HAC invoice
    router.push(`/master/finance/invoices?search=${encodeURIComponent(s.hacInvoiceNumber)}`);
  };

  const counts = {
    pending:  settlements.filter(s => s.status === "Pending").length,
    approved: settlements.filter(s => s.status === "Approved").length,
    paid:     settlements.filter(s => s.status === "Paid").length,
    total:    settlements.length,
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-bold tracking-tight ${text}`}>Settlement Management</h1>
          <p className={`text-xs mt-0.5 ${subtext}`}>Approve and pay agent commission settlements</p>
        </div>
        <button onClick={load} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${isDark ? "border-white/10 text-white/50 hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`px-4 py-3 rounded-xl border text-xs font-medium ${toast.ok ? (isDark ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-emerald-50 border-emerald-200 text-emerald-700") : (isDark ? "bg-rose-500/10 border-rose-500/20 text-rose-400" : "bg-rose-50 border-rose-200 text-rose-700")}`}>
          {toast.msg}
        </div>
      )}

      {/* Workflow info banner */}
      <div className={`flex items-center gap-3 p-3 rounded-xl border text-xs ${isDark ? "border-sky-500/20 bg-sky-500/5 text-sky-300" : "border-sky-200 bg-sky-50 text-sky-700"}`}>
        <Shield className="w-4 h-4 shrink-0" />
        <span>Settlement Workflow: <strong>Commission → Approved → Eligible for Settlement → Pending Approval → Approved → Paid → HAC Invoice Generated</strong></span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Pending Approval", value: counts.pending,  icon: Clock,        color: "amber"   },
          { label: "Approved",         value: counts.approved, icon: CheckCircle2, color: "sky"     },
          { label: "Paid",             value: counts.paid,     icon: DollarSign,   color: "emerald" },
          { label: "Total Settlements",value: counts.total,    icon: Handshake,    color: "purple"  },
        ].map((s) => {
          const Icon = s.icon;
          const colorMap: Record<string, string> = {
            amber:   isDark ? "bg-amber-500/10 text-amber-400 border-amber-500/20"       : "bg-amber-50 text-amber-700 border-amber-200",
            sky:     isDark ? "bg-sky-500/10 text-sky-400 border-sky-500/20"             : "bg-sky-50 text-sky-700 border-sky-200",
            emerald: isDark ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-emerald-50 text-emerald-700 border-emerald-200",
            purple:  isDark ? "bg-purple-500/10 text-purple-400 border-purple-500/20"    : "bg-purple-50 text-purple-700 border-purple-200",
          };
          return (
            <div key={s.label} className={`p-4 rounded-xl border ${card}`}>
              <div className={`w-8 h-8 rounded-lg border flex items-center justify-center mb-3 ${colorMap[s.color]}`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className={`text-[10px] font-semibold uppercase tracking-wider ${subtext}`}>{s.label}</p>
              {loading ? (
                <div className={`h-6 w-10 rounded animate-pulse mt-1.5 ${isDark ? "bg-white/5" : "bg-slate-100"}`} />
              ) : (
                <p className={`text-2xl font-bold mt-1 ${text}`}>{s.value}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className={`p-4 rounded-xl border ${card} flex flex-wrap gap-3`}>
        <div className="flex-1 min-w-52 relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${subtext}`} />
          <input id="settlements-search" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by settlement # or agent name…"
            className={`w-full pl-8 pr-3 py-2 rounded-lg text-xs border outline-none transition-all ${input}`} />
        </div>
        <select id="settlements-status-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
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

      {/* Settlement Table */}
      <div className={`rounded-xl border ${card} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className={`border-b ${isDark ? "border-white/5" : "border-slate-100"}`}>
                {["Settlement #", "Agent", "Total Commission", "HAC Invoice", "Status", "Created", "Paid At", "Actions"].map(h => (
                  <th key={h} className={`px-4 py-3 text-left font-semibold uppercase tracking-wider ${th}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className={`border-b ${row}`}>
                    {[...Array(8)].map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className={`h-3 rounded animate-pulse ${isDark ? "bg-white/5" : "bg-slate-100"}`} /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className={`px-4 py-12 text-center ${subtext}`}>
                  <Handshake className="w-8 h-8 mx-auto mb-2 opacity-20" />No settlement records found
                </td></tr>
              ) : filtered.map((s: any) => {
                const isPaid     = s.status === "Paid";
                const isApproved = s.status === "Approved";
                const isPending  = s.status === "Pending";
                return (
                  <tr key={s.id} className={`border-b ${row} transition-colors`}>
                    <td className={`px-4 py-3 font-mono text-[11px] font-semibold ${isDark ? "text-sky-400" : "text-sky-600"}`}>{s.settlementNumber}</td>
                    <td className={`px-4 py-3 font-medium ${text}`}>{s.agentName}</td>
                    <td className={`px-4 py-3 font-semibold ${isDark ? "text-emerald-400" : "text-emerald-700"}`}>{s.totalAmount}</td>
                    <td className={`px-4 py-3 font-mono text-[11px] ${isDark ? "text-purple-400" : "text-purple-600"}`}>{s.hacInvoiceNumber || "—"}</td>
                    <td className="px-4 py-3"><SettlementStatusBadge status={s.status} /></td>
                    <td className={`px-4 py-3 ${subtext}`}>{fmtDate(s.createdAt)}</td>
                    <td className={`px-4 py-3 ${subtext}`}>{s.paidAt ? fmtDate(s.paidAt) : "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {/* Approve Button — only for Pending */}
                        {!isPaid && (
                          <button
                            id={`approve-settlement-${s.id}`}
                            onClick={() => handleApprove(s.id)}
                            disabled={!isPending || actionLoading === s.id + "-approve"}
                            title={!isPending ? "Only Pending settlements can be approved" : "Approve this settlement"}
                            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-all disabled:opacity-30 disabled:cursor-not-allowed
                              ${isApproved ? "border-sky-500/20 bg-sky-500/5 text-sky-400 cursor-not-allowed" : "border-sky-500/20 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20"}`}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            {actionLoading === s.id + "-approve" ? "…" : isApproved ? "Approved" : "Approve"}
                          </button>
                        )}

                        {/* Mark Paid — only for Approved */}
                        {!isPaid && (
                          <button
                            id={`pay-settlement-${s.id}`}
                            onClick={() => handlePay(s.id, s.status)}
                            disabled={!isApproved || actionLoading === s.id + "-pay"}
                            title={!isApproved ? "Settlement must be Approved before paying" : "Mark as Paid"}
                            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-all disabled:opacity-30 disabled:cursor-not-allowed
                              ${isDark ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20" : "border-emerald-500/20 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"}`}
                          >
                            <DollarSign className="w-3 h-3" />
                            {actionLoading === s.id + "-pay" ? "…" : "Mark Paid"}
                          </button>
                        )}

                        {/* Paid settlement — download invoice */}
                        {isPaid && (
                          <button
                            id={`download-settlement-${s.id}`}
                            onClick={() => handleDownloadSettlementInvoice(s)}
                            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-all
                              ${isDark ? "border-purple-500/20 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20" : "border-purple-200 bg-purple-50 text-purple-600 hover:bg-purple-100"}`}
                          >
                            <Download className="w-3 h-3" /> Invoice
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!loading && filtered.length > 0 && (
          <div className={`px-4 py-2.5 border-t text-xs ${isDark ? "border-white/5 text-white/25" : "border-slate-100 text-slate-400"}`}>
            Showing {filtered.length} of {settlements.length} settlements — Paid settlements are immutable (PRD 7.5)
          </div>
        )}
      </div>
    </div>
  );
}
