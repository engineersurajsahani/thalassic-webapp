"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "@/providers/theme-provider";
import { financeService } from "@/services/finance.service";
import {
  Search, Filter, X, CreditCard, ExternalLink, Eye,
  ChevronDown, Download, RefreshCw, ArrowUpRight,
} from "lucide-react";

const STATUSES = ["all", "Successful", "Pending", "Failed", "Cancelled"];
const REG_TYPES = ["all", "Direct", "Referral"];

function StatusBadge({ status }: { status: string }) {
  const s = (status || "").toLowerCase();
  if (s === "successful" || s === "paid")
    return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">{status}</span>;
  if (s === "pending")
    return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border bg-amber-500/10 text-amber-400 border-amber-500/20">{status}</span>;
  if (s === "failed" || s === "cancelled")
    return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border bg-rose-500/10 text-rose-400 border-rose-500/20">{status}</span>;
  return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border bg-sky-500/10 text-sky-400 border-sky-500/20">{status}</span>;
}

function RegTypeBadge({ type }: { type: string }) {
  if (type === "Referral")
    return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border bg-purple-500/10 text-purple-400 border-purple-500/20">Referral</span>;
  return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border bg-sky-500/10 text-sky-400 border-sky-500/20">Direct</span>;
}

export default function PaymentsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [regTypeFilter, setRegTypeFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  const card    = isDark ? "bg-[#0c1a2e] border-white/5"  : "bg-white border-slate-200";
  const text    = isDark ? "text-white"                   : "text-slate-800";
  const subtext = isDark ? "text-white/40"                : "text-slate-500";
  const input   = isDark ? "bg-[#0a1525] border-white/8 text-white placeholder-white/20 focus:border-sky-500/40" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-sky-400";
  const row     = isDark ? "border-white/5 hover:bg-white/3" : "border-slate-100 hover:bg-slate-50";
  const th      = isDark ? "text-white/30 border-white/5"    : "text-slate-400 border-slate-100";

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await financeService.getPayments({ search: search || undefined });
      setPayments(data);
    } catch {
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const filtered = payments.filter((p) => {
    if (statusFilter !== "all" && p.paymentStatus?.toLowerCase() !== statusFilter.toLowerCase()) return false;
    if (regTypeFilter !== "all" && p.registrationType !== regTypeFilter) return false;
    return true;
  });

  const fmt = (n: number) => `₹${(n || 0).toLocaleString("en-IN")}`;
  const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-bold tracking-tight ${text}`}>Payment Management</h1>
          <p className={`text-xs mt-0.5 ${subtext}`}>All platform payment transactions — direct and referral</p>
        </div>
        <button onClick={load} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${isDark ? "border-white/10 text-white/50 hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Payments",    value: payments.length,                                             color: "sky"     },
          { label: "Successful",        value: payments.filter(p => p.paymentStatus?.toLowerCase() === "successful" || p.paymentStatus?.toLowerCase() === "paid").length, color: "emerald" },
          { label: "Direct Purchases",  value: payments.filter(p => p.registrationType === "Direct").length,   color: "blue"    },
          { label: "Referral Purchases",value: payments.filter(p => p.registrationType === "Referral").length, color: "purple"  },
        ].map((s) => (
          <div key={s.label} className={`p-4 rounded-xl border ${card} transition-all`}>
            <p className={`text-[10px] font-semibold uppercase tracking-wider ${subtext}`}>{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${text}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className={`p-4 rounded-xl border ${card} flex flex-wrap gap-3`}>
        <div className="flex-1 min-w-52 relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${subtext}`} />
          <input
            id="payments-search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, transaction ID, course…"
            className={`w-full pl-8 pr-3 py-2 rounded-lg text-xs border outline-none transition-all ${input}`}
          />
        </div>
        <select id="payments-status-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className={`px-3 py-2 rounded-lg text-xs border outline-none ${input}`}>
          {STATUSES.map(s => <option key={s} value={s}>{s === "all" ? "All Statuses" : s}</option>)}
        </select>
        <select id="payments-regtype-filter" value={regTypeFilter} onChange={e => setRegTypeFilter(e.target.value)}
          className={`px-3 py-2 rounded-lg text-xs border outline-none ${input}`}>
          {REG_TYPES.map(r => <option key={r} value={r}>{r === "all" ? "All Types" : r}</option>)}
        </select>
        {(statusFilter !== "all" || regTypeFilter !== "all") && (
          <button onClick={() => { setStatusFilter("all"); setRegTypeFilter("all"); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-rose-400 border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 transition-all">
            <X className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className={`rounded-xl border ${card} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className={`border-b ${isDark ? "border-white/5" : "border-slate-100"}`}>
                {["Transaction ID", "Date", "Seafarer", "Type", "Course", "Amount", "Gateway", "Status", "Actions"].map(h => (
                  <th key={h} className={`px-4 py-3 text-left font-semibold uppercase tracking-wider ${th}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className={`border-b ${row}`}>
                    {[...Array(9)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className={`h-3 rounded animate-pulse ${isDark ? "bg-white/5" : "bg-slate-100"}`} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className={`px-4 py-12 text-center ${subtext}`}>
                    <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    No payment records found
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className={`border-b ${row} transition-colors`}>
                    <td className={`px-4 py-3 font-mono text-[11px] ${isDark ? "text-sky-400" : "text-sky-600"}`}>{p.transactionId}</td>
                    <td className={`px-4 py-3 ${subtext}`}>{fmtDate(p.transactionDate)}</td>
                    <td className={`px-4 py-3 font-medium ${text}`}>{p.seafarerName}</td>
                    <td className="px-4 py-3"><RegTypeBadge type={p.registrationType} /></td>
                    <td className={`px-4 py-3 max-w-36 truncate ${subtext}`}>{p.courseName}</td>
                    <td className={`px-4 py-3 font-semibold ${text}`}>{fmt(p.finalAmount)}</td>
                    <td className={`px-4 py-3 ${subtext}`}>{p.paymentGateway}</td>
                    <td className="px-4 py-3"><StatusBadge status={p.paymentStatus} /></td>
                    <td className="px-4 py-3">
                      <button
                        id={`view-payment-${p.id}`}
                        onClick={() => setSelectedPayment(p)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-all ${isDark ? "border-white/10 text-white/50 hover:bg-sky-500/10 hover:text-sky-400 hover:border-sky-500/20" : "border-slate-200 text-slate-500 hover:bg-sky-50 hover:text-sky-600"}`}
                      >
                        <Eye className="w-3 h-3" /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && filtered.length > 0 && (
          <div className={`px-4 py-2.5 border-t text-xs ${isDark ? "border-white/5 text-white/25" : "border-slate-100 text-slate-400"}`}>
            Showing {filtered.length} of {payments.length} records
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPayment(null)}>
          <div onClick={e => e.stopPropagation()}
            className={`w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden ${isDark ? "bg-[#0c1a2e] border-white/8" : "bg-white border-slate-200"}`}>
            {/* Modal Header */}
            <div className={`px-5 py-4 border-b flex items-center justify-between ${isDark ? "border-white/8" : "border-slate-100"}`}>
              <div>
                <h2 className={`text-sm font-bold ${text}`}>Payment Details</h2>
                <p className={`text-[11px] font-mono mt-0.5 ${isDark ? "text-sky-400" : "text-sky-600"}`}>{selectedPayment.transactionId}</p>
              </div>
              <button onClick={() => setSelectedPayment(null)} className={`p-1.5 rounded-lg ${isDark ? "hover:bg-white/5 text-white/30" : "hover:bg-slate-100 text-slate-400"}`}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              {/* Transaction Info */}
              <div>
                <p className={`text-[10px] font-semibold uppercase tracking-wider mb-2.5 ${subtext}`}>Transaction Information</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                  {[
                    ["Transaction ID",  selectedPayment.transactionId],
                    ["Order ID",        selectedPayment.orderId],
                    ["Payment Gateway", selectedPayment.paymentGateway],
                    ["Payment Method",  selectedPayment.paymentMethod],
                    ["Transaction Date", fmtDate(selectedPayment.transactionDate)],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <p className={`text-[10px] ${subtext}`}>{label}</p>
                      <p className={`text-xs font-medium mt-0.5 ${text}`}>{val || "—"}</p>
                    </div>
                  ))}
                  <div>
                    <p className={`text-[10px] ${subtext}`}>Payment Status</p>
                    <div className="mt-0.5"><StatusBadge status={selectedPayment.paymentStatus} /></div>
                  </div>
                </div>
              </div>

              <div className={`border-t ${isDark ? "border-white/5" : "border-slate-100"}`} />

              {/* Customer Info */}
              <div>
                <p className={`text-[10px] font-semibold uppercase tracking-wider mb-2.5 ${subtext}`}>Customer Information</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                  {[
                    ["Seafarer Name",    selectedPayment.seafarerName],
                    ["Registration",     selectedPayment.registrationType],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <p className={`text-[10px] ${subtext}`}>{label}</p>
                      <p className={`text-xs font-medium mt-0.5 ${text}`}>{val || "—"}</p>
                    </div>
                  ))}
                  {selectedPayment.registrationType === "Referral" && (
                    <div>
                      <p className={`text-[10px] ${subtext}`}>Referring Agent</p>
                      <p className={`text-xs font-medium mt-0.5 ${text}`}>{selectedPayment.referringAgent || "—"}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className={`border-t ${isDark ? "border-white/5" : "border-slate-100"}`} />

              {/* Course Info */}
              <div>
                <p className={`text-[10px] font-semibold uppercase tracking-wider mb-2.5 ${subtext}`}>Course Information</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                  {[
                    ["Course Name",     selectedPayment.courseName],
                    ["Course Fee",      fmt(selectedPayment.courseFee)],
                    ["Discount Applied",fmt(selectedPayment.discountApplied)],
                    ["Final Amount",    fmt(selectedPayment.finalAmount)],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <p className={`text-[10px] ${subtext}`}>{label}</p>
                      <p className={`text-xs font-medium mt-0.5 ${text}`}>{val || "—"}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Linked Invoice */}
              {selectedPayment.invoiceNumber && (
                <>
                  <div className={`border-t ${isDark ? "border-white/5" : "border-slate-100"}`} />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-[10px] ${subtext}`}>Linked Invoice</p>
                      <p className={`text-xs font-mono font-medium mt-0.5 ${isDark ? "text-sky-400" : "text-sky-600"}`}>{selectedPayment.invoiceNumber}</p>
                    </div>
                    <a href={`/master/finance/invoices`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20 hover:bg-sky-500/20 transition-all">
                      <ArrowUpRight className="w-3.5 h-3.5" /> View Invoice
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
