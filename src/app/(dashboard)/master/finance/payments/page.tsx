"use client";

import React, { useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  Search, Filter, X, CreditCard, ExternalLink, Eye,
  ChevronDown, Download, RefreshCw, ArrowUpRight,
  FileText, CheckCircle2, Clock, XCircle, ShieldCheck,
} from "lucide-react";
import FinanceTabs from "@/components/master/FinanceTabs";
import { MOCK_PAYMENTS, MockPaymentRecord } from "@/data/master-portal-mock";

const STATUS_CONFIG: Record<string, { label: string; cls: string; icon: React.ElementType }> = {
  Received: { label: "Received", cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: CheckCircle2 },
  Pending:  { label: "Pending",  cls: "bg-amber-500/10 text-amber-400 border-amber-500/20",    icon: Clock },
  Failed:   { label: "Failed",   cls: "bg-rose-500/10 text-rose-400 border-rose-500/20",       icon: XCircle },
  Refunded: { label: "Refunded", cls: "bg-purple-500/10 text-purple-400 border-purple-500/20", icon: RefreshCw },
};

export default function MasterPaymentsPage() {
  const { theme } = useTheme();
  const dk = theme === "dark";

  const [paymentsList, setPaymentsList] = useState<MockPaymentRecord[]>(MOCK_PAYMENTS);
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter]     = useState("all");
  const [selectedPayment, setSelectedPayment] = useState<MockPaymentRecord | null>(null);

  const card    = dk ? "bg-[#0c1a2e] border-white/5 rounded-2xl" : "bg-white border-slate-200 rounded-2xl shadow-sm";
  const ht      = dk ? "text-white" : "text-slate-800";
  const mt      = dk ? "text-white/40" : "text-slate-400";
  const inputBg = dk ? "bg-[#0a1525] border-white/8 text-white placeholder-white/20 focus:border-sky-500/40" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-sky-400";
  const rowHover= dk ? "border-white/5 hover:bg-white/3" : "border-slate-100 hover:bg-slate-50";
  const thCls   = dk ? "text-white/30 border-white/5" : "text-slate-400 border-slate-100";
  const modalBg = dk ? "bg-[#0c1a2e] border-white/10" : "bg-white border-slate-200";

  const filtered = paymentsList.filter(p => {
    const q = search.toLowerCase();
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
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Payment ID, Seafarer, INDOS, Course, or Partner..."
            className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border ${inputBg}`}
          />
        </div>

        {/* Purchase Type Filter (Direct vs Partner) */}
        <div className="flex items-center gap-1.5">
          <span className={`text-[11px] font-semibold uppercase ${mt}`}>Type:</span>
          {["all", "Direct", "Partner"].map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl capitalize transition-colors ${
                typeFilter === t
                  ? "bg-sky-500 text-white shadow-sm"
                  : dk ? "bg-white/5 text-white/50 hover:bg-white/10" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {t === "all" ? "All Types" : t}
            </button>
          ))}
        </div>

        {/* Payment Status Filter */}
        <div className="flex items-center gap-1.5">
          <span className={`text-[11px] font-semibold uppercase ${mt}`}>Status:</span>
          {["all", "Received", "Pending"].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl capitalize transition-colors ${
                statusFilter === s
                  ? "bg-sky-500 text-white shadow-sm"
                  : dk ? "bg-white/5 text-white/50 hover:bg-white/10" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {s}
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
              {filtered.map(p => {
                const S = STATUS_CONFIG[p.paymentStatus] || STATUS_CONFIG.Pending;
                const SIcon = S.icon;
                return (
                  <tr key={p.id} className={`${rowHover} transition-colors border-b`}>
                    <td className={`px-6 py-4 text-[12px] font-mono font-bold ${dk ? "text-sky-400" : "text-sky-600"}`}>
                      {p.id}
                    </td>
                    <td className="px-6 py-4">
                      <p className={`font-semibold text-[13px] ${ht}`}>{p.seafarerName}</p>
                      <p className={`text-[10px] font-mono ${mt}`}>INDOS: {p.indosNumber}</p>
                    </td>
                    <td className={`px-6 py-4 text-[12px] max-w-[200px] truncate ${ht}`}>{p.courseTitle}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        p.purchaseType === "Partner"
                          ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
                          : "bg-sky-500/10 text-sky-400 border-sky-500/20"
                      }`}>
                        {p.purchaseType}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-[12px] ${mt}`}>{p.partnerName}</td>
                    <td className={`px-6 py-4 text-[13px] font-bold ${ht}`}>
                      ₹{p.amountPayable.toLocaleString()}
                    </td>
                    <td className={`px-6 py-4 text-[13px] font-bold ${
                      p.amountReceived === p.amountPayable ? "text-emerald-400" : "text-amber-400"
                    }`}>
                      ₹{p.amountReceived.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${S.cls}`}>
                        <SIcon className="w-3 h-3" />
                        {p.paymentStatus}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-[12px] ${mt}`}>{p.paymentDate}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedPayment(p)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-semibold rounded-lg border transition-colors ${
                          dk ? "bg-white/5 border-white/10 text-sky-400 hover:bg-white/10" : "bg-slate-100 border-slate-200 text-sky-600 hover:bg-slate-200"
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
        <div className={`px-6 py-3.5 border-t ${dk ? "border-white/5" : "border-slate-100"} flex items-center justify-between text-xs ${mt}`}>
          <span>Showing {filtered.length} of {paymentsList.length} transactions</span>
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
                <span className="font-mono font-bold text-sky-400">{selectedPayment.id}</span>
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
                  <span className="font-semibold text-violet-400">{selectedPayment.partnerName}</span>
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
                <span className="font-bold text-sm text-emerald-400">₹{selectedPayment.amountReceived.toLocaleString()}</span>
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
