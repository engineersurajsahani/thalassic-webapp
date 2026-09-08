"use client";

import React, { useState, useMemo } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  CreditCard, IndianRupee, CheckCircle2, Clock,
  AlertCircle, Search, Calendar, FileText, X, Eye,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { mockPayments } from "@/components/company-admin/mockData";
import FinanceTabs from "@/components/company-admin/FinanceTabs";

const statusMeta: Record<string, { light: string; dark: string; icon: React.ReactNode }> = {
  Paid:    { light: "bg-emerald-100 text-emerald-700", dark: "bg-emerald-500/15 text-emerald-400", icon: <CheckCircle2 className="w-3 h-3" /> },
  Partial: { light: "bg-blue-100 text-blue-700",       dark: "bg-blue-500/15 text-blue-400",       icon: <Clock className="w-3 h-3" /> },
  Pending: { light: "bg-amber-100 text-amber-700",     dark: "bg-amber-500/15 text-amber-400",     icon: <Clock className="w-3 h-3" /> },
  Overdue: { light: "bg-red-100 text-red-700",          dark: "bg-red-500/15 text-red-400",          icon: <AlertCircle className="w-3 h-3" /> },
};

function formatDDMMYY(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

export default function PaymentsPage() {
  const { theme } = useTheme();
  const dk = theme === "dark";

  const [query, setQuery] = useState("");
  const [filterStat, setFilterStat] = useState("All");
  const [selectedInvoicePayment, setSelectedInvoicePayment] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const card    = `rounded-2xl overflow-hidden ${dk ? "bg-[#0d1f35] border border-white/[0.06]" : "bg-white border border-slate-200 shadow-sm"}`;
  const ht      = dk ? "text-white/80"  : "text-slate-800";
  const mt      = dk ? "text-white/35"  : "text-slate-400";
  const inputBg = dk
    ? "bg-white/5 border-white/10 text-white/70 placeholder:text-white/25 focus:border-sky-500/50"
    : "bg-slate-50 border-slate-200 text-slate-700 placeholder:text-slate-400 focus:border-sky-400";
  const divider = dk ? "divide-white/[0.05]" : "divide-slate-100";

  const totalPaid     = mockPayments.filter(p => p.status === "Paid").reduce((s, p) => s + p.amount, 0);
  const totalReceived = mockPayments.reduce((s, p) => s + (p.amountReceived ?? (p.status === "Paid" ? p.amount : 0)), 0);
  const totalPending  = mockPayments.filter(p => p.status === "Pending" || p.status === "Partial").reduce((s, p) => s + (p.amount - (p.amountReceived || 0)), 0);
  const totalOverdue  = mockPayments.filter(p => p.status === "Overdue").reduce((s, p) => s + p.amount, 0);

  const kpis = [
    { label: "Total Received",   value: "₹" + (totalReceived / 1000).toFixed(0) + "K", icon: IndianRupee, bg: dk ? "bg-emerald-500/15" : "bg-emerald-50", color: "#10b981" },
    { label: "Pending Amount",   value: "₹" + (totalPending / 1000).toFixed(0) + "K",  icon: Clock,       bg: dk ? "bg-amber-500/15"   : "bg-amber-50",   color: "#f59e0b" },
    { label: "Overdue Amount",   value: "₹" + (totalOverdue / 1000).toFixed(0) + "K",  icon: AlertCircle, bg: dk ? "bg-red-500/15"     : "bg-red-50",     color: "#f43f5e" },
    { label: "Total Payments",   value: String(mockPayments.length),                         icon: CreditCard,  bg: dk ? "bg-indigo-500/15"  : "bg-indigo-50",  color: "#6366f1" },
  ];

  const filtered = useMemo(() =>
    mockPayments.filter(p => {
      const q = query.toLowerCase();
      const matchQ =
        p.seafarerName.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        (p.txnId && p.txnId.toLowerCase().includes(q)) ||
        (p.invoiceNumber && p.invoiceNumber.toLowerCase().includes(q)) ||
        p.course.toLowerCase().includes(q) ||
        p.instituteName.toLowerCase().includes(q);
      const matchS = filterStat === "All" || p.status === filterStat;
      return matchQ && matchS;
    }),
    [query, filterStat]
  );

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  // Reset to page 1 when filters change
  useMemo(() => { setCurrentPage(1); }, [query, filterStat]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className={`text-xl font-bold ${ht}`}>Company Finance</h1>
        <p className={`text-sm mt-0.5 ${mt}`}>Track course fee collections, invoice records, and payment receipts</p>
      </div>

      {/* Internal Navigation Tabs */}
      <FinanceTabs />

      {/* KPI Strip */}
      <div className={card}>
        <div className={`grid grid-cols-2 xl:grid-cols-4 divide-x divide-y xl:divide-y-0 ${dk ? "divide-white/[0.05]" : "divide-slate-100"}`}>
          {kpis.map(k => {
            const Icon = k.icon;
            return (
              <div key={k.label} className="flex items-center gap-4 px-6 py-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${k.bg}`}>
                  <Icon className="w-5 h-5" style={{ color: k.color }} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${ht}`}>{k.value}</p>
                  <p className={`text-[11px] mt-0.5 ${mt}`}>{k.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className={`${card} p-4`}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${mt}`} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search seafarer, course, institute, txn or invoice ID…"
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border outline-none transition-colors ${inputBg}`}
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {["All", "Paid", "Partial", "Pending", "Overdue"].map(s => (
              <button
                key={s}
                onClick={() => setFilterStat(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  filterStat === s
                    ? "bg-sky-500 text-white shadow-sm"
                    : dk ? "bg-white/5 text-white/40 hover:text-white/70" : "bg-slate-100 text-slate-500 hover:text-slate-800"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className={card}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className={dk ? "border-b border-white/5" : "border-b border-slate-100"}>
                {["Transaction ID", "Seafarer", "Course", "Institute", "Amount", "Amount Received", "Status", "Payment Date", "Invoice"].map(h => (
                  <th key={h} className={`text-left px-5 py-3.5 text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap ${mt}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${divider}`}>
              {paginatedPayments.map(p => {
                const received = p.amountReceived ?? (p.status === "Paid" ? p.amount : 0);
                const sm = statusMeta[p.status] || statusMeta.Pending;

                return (
                  <tr key={p.id} className={`transition-colors ${dk ? "hover:bg-white/[0.03]" : "hover:bg-slate-50"}`}>
                    <td className={`px-5 py-3.5 font-mono text-[11px] ${mt}`}>{p.txnId || p.id}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-sky-500/15 text-sky-400 flex items-center justify-center font-bold text-[10px]">
                          {p.seafarerName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <span className={`font-semibold ${ht}`}>{p.seafarerName}</span>
                      </div>
                    </td>
                    <td className={`px-5 py-3.5 max-w-[150px] truncate ${mt}`}>{p.course}</td>
                    <td className={`px-5 py-3.5 max-w-[150px] truncate font-medium ${ht}`}>{p.instituteName}</td>
                    <td className={`px-5 py-3.5 font-bold ${ht}`}>₹{p.amount.toLocaleString("en-IN")}</td>
                    <td className={`px-5 py-3.5 font-bold text-emerald-500`}>
                      ₹{received.toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${dk ? sm.dark : sm.light}`}>
                        {sm.icon}
                        {p.status}
                      </span>
                    </td>
                    <td className={`px-5 py-3.5 font-mono text-[11px] ${mt}`}>
                      {formatDDMMYY(p.date)}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => setSelectedInvoicePayment(p)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                          dk ? "border-white/10 hover:bg-white/10 text-sky-400" : "border-slate-200 hover:bg-slate-100 text-sky-600"
                        }`}
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className={`text-center py-16 ${mt}`}>
            <CreditCard className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No payments match your search</p>
          </div>
        )}

        {/* Pagination — only when more than 1 page */}
        {totalPages > 1 && (
          <div className={`px-5 py-3 border-t flex items-center justify-between text-xs ${dk ? "border-white/5" : "border-slate-100"}`}>
            <span className={dk ? "text-white/40" : "text-slate-400"}>
              Showing page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filtered.length} results)
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`p-1.5 rounded border transition-colors cursor-pointer disabled:opacity-40 disabled:pointer-events-none ${dk ? "border-white/10 hover:bg-white/5 text-white" : "border-slate-200 hover:bg-slate-50 text-slate-700"}`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`p-1.5 rounded border transition-colors cursor-pointer disabled:opacity-40 disabled:pointer-events-none ${dk ? "border-white/10 hover:bg-white/5 text-white" : "border-slate-200 hover:bg-slate-50 text-slate-700"}`}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Invoice Details Modal */}
      {selectedInvoicePayment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedInvoicePayment(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className={`w-full max-w-lg rounded-2xl border shadow-2xl p-6 relative animate-fadeIn flex flex-col ${
              dk ? "bg-[#0B1528] border-white/10 text-white" : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider opacity-60">Tax Invoice Receipt</span>
                  <h3 className="text-base font-bold font-mono">
                    {selectedInvoicePayment.invoiceNumber || `HOC-2026-${selectedInvoicePayment.id.slice(-6)}`}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoicePayment(null)}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  dk ? "border-white/10 hover:bg-white/5 text-slate-300" : "border-slate-200 hover:bg-slate-100"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Invoice Breakdown */}
            <div className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div>
                  <span className="text-[10px] uppercase font-semibold opacity-40 block">Seafarer</span>
                  <span className="font-bold">{selectedInvoicePayment.seafarerName}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold opacity-40 block">Transaction ID</span>
                  <span className="font-mono">{selectedInvoicePayment.txnId || selectedInvoicePayment.id}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold opacity-40 block">Course</span>
                  <span className="font-semibold">{selectedInvoicePayment.course}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold opacity-40 block">Training Institute</span>
                  <span className="font-semibold">{selectedInvoicePayment.instituteName}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold opacity-40 block">Payment Date</span>
                  <span>{formatDDMMYY(selectedInvoicePayment.date)}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold opacity-40 block">Invoice Type</span>
                  <span className="font-semibold text-sky-400">{selectedInvoicePayment.purchaseType || "HOC"} (Direct)</span>
                </div>
              </div>

              {/* Financial Totals */}
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block">Total Course Fee</span>
                  <span className="text-base font-black text-emerald-400">
                    ₹{selectedInvoicePayment.amount.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold opacity-60 block">Status</span>
                  <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500 text-white">
                    {selectedInvoicePayment.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedInvoicePayment(null)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                  dk ? "border-white/10 hover:bg-white/5 text-slate-300" : "border-slate-200 hover:bg-slate-100"
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
