"use client";

import React, { useState, useMemo } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  Search, Filter, X, CreditCard, ExternalLink, Eye,
  ChevronDown, ChevronLeft, ChevronRight, Download, RefreshCw, ArrowUpRight,
  FileText, CheckCircle2, Clock, XCircle, ShieldCheck,
} from "lucide-react";
import FinanceTabs from "@/components/master/FinanceTabs";
import { MOCK_PAYMENTS, MockPaymentRecord } from "@/data/master-portal-mock";

const STATUS_CONFIG: Record<string, { label: string; cls: string; icon: React.ElementType }> = {
  Received: { label: "Received", cls: "text-emerald-600 dark:text-emerald-400", icon: CheckCircle2 },
  Pending:  { label: "Pending",  cls: "text-amber-600 dark:text-amber-400",    icon: Clock },
  Failed:   { label: "Failed",   cls: "text-rose-600 dark:text-rose-400",       icon: XCircle },
  Refunded: { label: "Refunded", cls: "text-purple-600 dark:text-purple-400", icon: RefreshCw },
};

export default function MasterPaymentsPage() {
  const { theme } = useTheme();
  const dk = theme === "dark";

  const [paymentsList, setPaymentsList] = useState<MockPaymentRecord[]>(MOCK_PAYMENTS);
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter]     = useState("all");
  const [selectedPayment, setSelectedPayment] = useState<MockPaymentRecord | null>(null);
  const [rowsPerPage, setRowsPerPage]   = useState(10);
  const [currentPage, setCurrentPage]   = useState(1);

  const card    = dk ? "bg-[#0c1a2e] border-white/5 rounded-2xl" : "bg-white border-slate-200 rounded-2xl shadow-sm";
  const ht      = dk ? "text-white" : "text-slate-800";
  const mt      = dk ? "text-white/40" : "text-slate-400";
  const inputBg = dk ? "bg-[#0a1525] border-white/8 text-white placeholder-white/20 focus:border-sky-500/40" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-sky-400";
  const rowHover= dk ? "border-white/5 hover:bg-white/3" : "border-slate-100 hover:bg-slate-50";
  const thCls   = dk ? "text-white/30 border-white/5" : "text-slate-400 border-slate-100";
  const modalBg = dk ? "bg-[#0c1a2e] border-white/10" : "bg-white border-slate-200";

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return paymentsList.filter(p => {
      const matchSearch = p.id.toLowerCase().includes(q) ||
        p.seafarerName.toLowerCase().includes(q) ||
        p.courseTitle.toLowerCase().includes(q) ||
        p.partnerName.toLowerCase().includes(q) ||
        p.invoiceNumber.toLowerCase().includes(q) ||
        p.indosNumber.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || p.paymentStatus === statusFilter;
      const matchType   = typeFilter === "all" || p.purchaseType === typeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [paymentsList, search, statusFilter, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedPayments = useMemo(() => {
    const start = (safePage - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, safePage, rowsPerPage]);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-xl font-bold ${ht}`}>Platform Payments</h1>
          <p className={`text-sm mt-0.5 ${mt}`}>
            Detailed transaction records distinguishing Direct vs Partner course enrollments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert("Exporting payments CSV...")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors ${
              dk ? "border-white/10 text-white/70 hover:bg-white/5" : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Download className="w-3.5 h-3.5" /> Export Payments
          </button>
        </div>
      </div>

      {/* PRD 2.1 Navigation Tabs */}
      <FinanceTabs />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Transactions",     val: paymentsList.length,                                                             sub: "All platform payments", Icon: CreditCard,   c: "text-sky-400",    bg: dk ? "bg-sky-500/10" : "bg-sky-50" },
          { label: "Direct Payments",        val: paymentsList.filter(p => p.purchaseType === "Direct").length,                     sub: "Direct seafarer orders",Icon: CheckCircle2, c: "text-emerald-400",bg: dk ? "bg-emerald-500/10" : "bg-emerald-50" },
          { label: "Partner-related Orders", val: paymentsList.filter(p => p.purchaseType === "Partner").length,                    sub: "Agency routed",         Icon: ExternalLink, c: "text-violet-400", bg: dk ? "bg-violet-500/10" : "bg-violet-50" },
          { label: "Pending Payments",       val: `₹${(paymentsList.filter(p => p.paymentStatus === "Pending").reduce((acc, p) => acc + p.amountPayable, 0) / 1000).toFixed(0)}K`, sub: "Awaiting settlement", Icon: Clock, c: "text-amber-400", bg: dk ? "bg-amber-500/10" : "bg-amber-50" },
        ].map(k => (
          <div key={k.label} className={`border ${card} p-4 flex items-center gap-3`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${k.bg}`}>
              <k.Icon className={`w-5 h-5 ${k.c}`} />
            </div>
            <div>
              <p className={`text-xl font-bold leading-tight ${ht}`}>{k.val}</p>
              <p className={`text-xs font-semibold mt-0.5 ${ht} opacity-75`}>{k.label}</p>
              <p className={`text-[11px] mt-0.5 ${mt}`}>{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search (PRD 2.3) */}
      <div className={`border ${card} p-4 flex flex-wrap items-center justify-between gap-3`}>
        <div className="relative flex-1 min-w-[260px]">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${mt}`} />
          <input
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by Payment ID, Seafarer, INDOS, Course, or Partner..."
            className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border ${inputBg}`}
          />
        </div>

        {/* Purchase Type Filter (Direct vs Partner) */}
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-semibold uppercase ${mt}`}>Type:</span>
          {["all", "Direct", "Partner"].map(t => (
            <button
              key={t}
              onClick={() => {
                setTypeFilter(t);
                setCurrentPage(1);
              }}
              className={`text-xs capitalize transition-colors ${
                typeFilter === t
                  ? (dk ? "text-white font-bold underline underline-offset-4 decoration-2 decoration-sky-500" : "text-black font-bold underline underline-offset-4 decoration-2 decoration-sky-500")
                  : dk ? "text-white/40 hover:text-white/80 font-medium" : "text-slate-500 hover:text-slate-800 font-medium"
              }`}
            >
              {t === "all" ? "All Types" : t}
            </button>
          ))}
        </div>

        <div className={`h-4 w-px ${dk ? "bg-white/10" : "bg-slate-200"} mx-1 hidden sm:block`} />

        {/* Payment Status Filter */}
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-semibold uppercase ${mt}`}>Status:</span>
          {["all", "Received", "Pending"].map(s => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setCurrentPage(1);
              }}
              className={`text-xs capitalize transition-colors ${
                statusFilter === s
                  ? (dk ? "text-white font-bold underline underline-offset-4 decoration-2 decoration-sky-500" : "text-black font-bold underline underline-offset-4 decoration-2 decoration-sky-500")
                  : dk ? "text-white/40 hover:text-white/80 font-medium" : "text-slate-500 hover:text-slate-800 font-medium"
              }`}
            >
              {s === "all" ? "All Statuses" : s}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table (PRD 2.3 required fields) */}
      <div className={`border ${card} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b text-[11px] font-semibold uppercase tracking-wider ${thCls}`}>
                <th className="text-left px-6 py-3.5">Payment ID</th>
                <th className="text-left px-6 py-3.5">Seafarer (PRD §2.3)</th>
                <th className="text-left px-6 py-3.5">Course</th>
                <th className="text-left px-6 py-3.5">Purchase Type</th>
                <th className="text-left px-6 py-3.5">Partner</th>
                <th className="text-left px-6 py-3.5">Payable to Hari Om</th>
                <th className="text-left px-6 py-3.5">Amount Received</th>
                <th className="text-left px-6 py-3.5">Payment Status</th>
                <th className="text-left px-6 py-3.5">Payment Date</th>
                <th className="text-right px-6 py-3.5">Related Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedPayments.map(p => {
                const S = STATUS_CONFIG[p.paymentStatus] || STATUS_CONFIG.Pending;
                const SIcon = S.icon;
                return (
                  <tr key={p.id} className={`${rowHover} transition-colors border-b`}>
                    <td className={`px-6 py-4 text-[12px] font-mono font-bold ${dk ? "text-white" : "text-black"}`}>
                      {p.id}
                    </td>
                    <td className="px-6 py-4">
                      <p className={`font-semibold text-[13px] ${ht}`}>{p.seafarerName}</p>
                      <p className={`text-[10px] font-mono ${mt}`}>INDOS: {p.indosNumber}</p>
                    </td>
                    <td className={`px-6 py-4 text-[12px] max-w-[200px] truncate ${ht}`}>{p.courseTitle}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[11px] font-semibold ${
                        dk ? "text-white" : "text-black"
                      }`}>
                        {p.purchaseType}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-[12px] ${mt}`}>{p.partnerName}</td>
                    <td className={`px-6 py-4 text-[13px] font-bold ${ht}`}>
                      ₹{p.amountPayable.toLocaleString()}
                    </td>
                    <td className={`px-6 py-4 text-[13px] font-bold ${
                      p.amountReceived === p.amountPayable ? (dk ? "text-white" : "text-black") : (dk ? "text-amber-400" : "text-amber-600")
                    }`}>
                      ₹{p.amountReceived.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${S.cls}`}>
                        <SIcon className="w-3.5 h-3.5" />
                        {p.paymentStatus}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-[12px] ${mt}`}>{p.paymentDate}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedPayment(p)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-semibold rounded-lg border transition-colors ${
                          dk ? "bg-white/5 border-white/10 text-white hover:bg-white/10" : "bg-slate-100 border-slate-200 text-black hover:bg-slate-200"
                        }`}
                      >
                        <FileText className="w-3 h-3" />
                        {p.invoiceNumber}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className={`px-6 py-3.5 border-t ${dk ? "border-white/5" : "border-slate-100"} flex flex-wrap items-center justify-between gap-4 text-xs ${mt}`}>
          <div className="flex items-center gap-2">
            <span className={`text-xs ${mt}`}>Rows per page:</span>
            <div className="relative inline-flex items-center">
              <select
                value={rowsPerPage}
                onChange={e => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className={`appearance-none text-xs font-medium py-1 pl-2.5 pr-7 rounded-lg border cursor-pointer outline-none transition-colors ${
                  dk
                    ? "bg-[#09162c] border-white/10 text-white hover:border-white/20 focus:border-sky-500"
                    : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 focus:border-sky-500 shadow-sm"
                }`}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <ChevronDown className={`w-3.5 h-3.5 absolute right-2 pointer-events-none ${mt}`} />
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className={`p-1.5 rounded-lg border transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer ${
                  dk ? "border-white/10 hover:bg-white/5 text-white" : "border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
                title="Previous page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-xs font-medium">
                Page {safePage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className={`p-1.5 rounded-lg border transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer ${
                  dk ? "border-white/10 hover:bg-white/5 text-white" : "border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
                title="Next page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <span>Compliant with PRD §2.3 (Direct vs Partner separation)</span>
        </div>
      </div>

      {/* Invoice Details Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4 border ${modalBg}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-400" />
                <h2 className={`text-base font-bold ${ht}`}>Invoice {selectedPayment.invoiceNumber}</h2>
              </div>
              <button onClick={() => setSelectedPayment(null)} className={mt}><X className="w-5 h-5" /></button>
            </div>

            <div className={`p-4 rounded-xl border space-y-3 text-xs ${dk ? "bg-white/3 border-white/5" : "bg-slate-50 border-slate-100"}`}>
              <div className="flex justify-between">
                <span className={mt}>Payment ID</span>
                <span className="font-mono font-bold text-black dark:text-white">{selectedPayment.id}</span>
              </div>
              <div className="flex justify-between">
                <span className={mt}>Seafarer</span>
                <span className={`font-semibold ${ht}`}>{selectedPayment.seafarerName}</span>
              </div>
              <div className="flex justify-between">
                <span className={mt}>INDOS Number</span>
                <span className="font-mono">{selectedPayment.indosNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className={mt}>Course</span>
                <span className={`font-semibold text-right max-w-[200px] truncate ${ht}`}>{selectedPayment.courseTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className={mt}>Purchase Type</span>
                <span className="font-semibold">{selectedPayment.purchaseType}</span>
              </div>
              {selectedPayment.purchaseType === "Partner" && (
                <div className="flex justify-between">
                  <span className={mt}>Partner Agency</span>
                  <span className="font-semibold text-black dark:text-white">{selectedPayment.partnerName}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className={mt}>Payment Method</span>
                <span>{selectedPayment.paymentMethod}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/5">
                <span className={mt}>Amount Payable to Hari Om</span>
                <span className="font-bold text-sm">₹{selectedPayment.amountPayable.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className={mt}>Amount Received</span>
                <span className={`font-bold text-sm ${ht}`}>₹{selectedPayment.amountReceived.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => alert(`Downloading PDF for invoice ${selectedPayment.invoiceNumber}...`)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-sky-500 hover:bg-sky-600 text-white"
              >
                <Download className="w-3.5 h-3.5" /> Download Tax Invoice (PDF)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
