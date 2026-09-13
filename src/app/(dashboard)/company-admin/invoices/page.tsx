"use client";

import React, { useState, useMemo } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  Receipt,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Calendar,
  Download,
  IndianRupee,
  FileText,
  Eye,
  X,
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

export interface CompanyInvoice {
  id: string;
  seafarer: string;
  course: string;
  amount: number;
  status: string;
  issued: string;
  due: string;
}

const INVOICES: CompanyInvoice[] = [];

const AVATAR_COLORS = [
  "bg-indigo-500",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-violet-500",
  "bg-rose-500",
];
function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
}

const statusMeta: Record<
  string,
  { light: string; dark: string; icon: React.ReactNode }
> = {
  Paid: {
    light: "text-emerald-700",
    dark: "text-emerald-400",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  Unpaid: {
    light: "text-amber-700",
    dark: "text-amber-400",
    icon: <Clock className="w-3 h-3" />,
  },
  Overdue: {
    light: "text-red-700",
    dark: "text-red-400",
    icon: <AlertCircle className="w-3 h-3" />,
  },
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function InvoicesPage() {
  const { theme } = useTheme();
  const dk = theme === "dark";

  const [query, setQuery] = useState("");
  const [filterStat, setFilterStat] = useState("All");
  const [selectedInvoice, setSelectedInvoice] = useState<
    (typeof INVOICES)[0] | null
  >(null);

  const card = `rounded-2xl overflow-hidden ${dk ? "bg-[#0d1f35] border border-white/[0.06]" : "bg-white border border-slate-200 shadow-sm"}`;
  const ht = dk ? "text-white/80" : "text-slate-800";
  const mt = dk ? "text-white/35" : "text-slate-400";
  const inputBg = dk
    ? "bg-white/5 border-white/10 text-white/70 placeholder:text-white/25 focus:border-indigo-500/50"
    : "bg-slate-50 border-slate-200 text-slate-700 placeholder:text-slate-400 focus:border-indigo-400";
  const divider = dk ? "divide-white/[0.05]" : "divide-slate-100";
  const chipAct =
    "text-indigo-600 dark:text-indigo-400 font-bold underline underline-offset-4 decoration-2 decoration-indigo-500";
  const chipIn = dk
    ? "text-white/40 hover:text-white/80 font-medium"
    : "text-slate-500 hover:text-slate-800 font-medium";

  const totalValue = INVOICES.reduce((s, i) => s + i.amount, 0);
  const paidValue = INVOICES.filter((i) => i.status === "Paid").reduce(
    (s, i) => s + i.amount,
    0,
  );
  const unpaidValue = INVOICES.filter((i) => i.status !== "Paid").reduce(
    (s, i) => s + i.amount,
    0,
  );

  const kpis = [
    {
      label: "Total Invoices",
      value: String(INVOICES.length),
      icon: Receipt,
      bg: dk ? "bg-indigo-500/15" : "bg-indigo-50",
      color: "#6366f1",
    },
    {
      label: "Total Value",
      value: "₹" + (totalValue / 1000).toFixed(0) + "K",
      icon: IndianRupee,
      bg: dk ? "bg-sky-500/15" : "bg-sky-50",
      color: "#0ea5e9",
    },
    {
      label: "Collected",
      value: "₹" + (paidValue / 1000).toFixed(0) + "K",
      icon: CheckCircle2,
      bg: dk ? "bg-emerald-500/15" : "bg-emerald-50",
      color: "#10b981",
    },
    {
      label: "Outstanding",
      value: "₹" + (unpaidValue / 1000).toFixed(0) + "K",
      icon: AlertCircle,
      bg: dk ? "bg-rose-500/15" : "bg-rose-50",
      color: "#f43f5e",
    },
  ];

  const filtered = useMemo(
    () =>
      INVOICES.filter((inv) => {
        const q =
          inv.seafarer.toLowerCase() +
          inv.id.toLowerCase() +
          inv.course.toLowerCase();
        const matchQ = q.includes(query.toLowerCase());
        const matchS = filterStat === "All" || inv.status === filterStat;
        return matchQ && matchS;
      }),
    [query, filterStat],
  );

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div>
        <h1 className={`text-xl font-bold ${ht}`}>Invoices</h1>
        <p className={`text-sm mt-0.5 ${mt}`}>
          Manage and track all course fee invoices
        </p>
      </div>

      {/* KPI strip */}
      <div className={card}>
        <div
          className={`grid grid-cols-2 xl:grid-cols-4 divide-x divide-y xl:divide-y-0 ${dk ? "divide-white/[0.05]" : "divide-slate-100"}`}
        >
          {kpis.map((k) => {
            const Icon = k.icon;
            return (
              <div key={k.label} className="flex items-center gap-4 px-6 py-5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${k.bg}`}
                >
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
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${mt}`}
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search invoice, seafarer, course…"
              className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border outline-none transition-colors ${inputBg}`}
            />
          </div>
          <div className="flex items-center gap-4 flex-wrap py-1">
            <Filter className={`w-3.5 h-3.5 ${mt}`} />
            {["All", "Paid", "Unpaid", "Overdue"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStat(s)}
                className={`text-xs transition-all cursor-pointer ${filterStat === s ? chipAct : chipIn}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={card}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                className={
                  dk ? "border-b border-white/5" : "border-b border-slate-100"
                }
              >
                {[
                  "Invoice #",
                  "Seafarer",
                  "Course",
                  "Amount",
                  "Status",
                  "Issued",
                  "Due",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className={`text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap ${mt}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${divider}`}>
              {filtered.map((inv, i) => {
                const meta = statusMeta[inv.status];
                return (
                  <tr
                    key={inv.id}
                    className={`transition-colors ${dk ? "hover:bg-white/[0.03]" : "hover:bg-slate-50"}`}
                  >
                    <td
                      className={`px-5 py-3.5 text-[12px] font-mono font-semibold ${dk ? "text-indigo-400" : "text-indigo-600"}`}
                    >
                      {inv.id}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
                        >
                          {initials(inv.seafarer)}
                        </div>
                        <p className={`text-[13px] font-medium ${ht}`}>
                          {inv.seafarer}
                        </p>
                      </div>
                    </td>
                    <td
                      className={`px-5 py-3.5 text-[12px] max-w-[150px] truncate ${mt}`}
                    >
                      {inv.course}
                    </td>
                    <td className={`px-5 py-3.5 text-[13px] font-bold ${ht}`}>
                      ₹{inv.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold ${dk ? meta.dark : meta.light}`}
                      >
                        {meta.icon}
                        {inv.status}
                      </span>
                    </td>
                    <td className={`px-5 py-3.5 text-[12px] ${mt}`}>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 shrink-0" />
                        {inv.issued}
                      </div>
                    </td>
                    <td
                      className={`px-5 py-3.5 text-[12px] ${inv.status === "Overdue" ? (dk ? "text-red-400" : "text-red-600") : mt}`}
                    >
                      {inv.due}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${dk ? "border-white/10 hover:bg-white/10 text-sky-400" : "border-slate-200 hover:bg-slate-100 text-sky-600"}`}
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </button>
                        <button
                          className={`p-1.5 rounded-lg transition-colors ${dk ? "hover:bg-white/8 text-white/30 hover:text-white/60" : "hover:bg-slate-100 text-slate-300 hover:text-slate-600"}`}
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className={`text-center py-16 ${mt}`}>
            <FileText className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No invoices match your filters</p>
          </div>
        )}
        <div
          className={`px-5 py-3 border-t text-xs ${dk ? "border-white/5 text-white/20" : "border-slate-100 text-slate-400"}`}
        >
          Showing {filtered.length} of {INVOICES.length} invoices
        </div>
      </div>

      {/* Invoice Details Modal */}
      {selectedInvoice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedInvoice(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-lg rounded-2xl border shadow-2xl p-6 relative flex flex-col ${dk ? "bg-[#0B1528] border-white/10 text-white" : "bg-white border-slate-200 text-slate-900"}`}
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider opacity-60">
                    Tax Invoice
                  </span>
                  <h3 className="text-base font-bold font-mono">
                    {selectedInvoice.id}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${dk ? "border-white/10 hover:bg-white/5 text-slate-300" : "border-slate-200 hover:bg-slate-100"}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Invoice Breakdown */}
            <div className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div>
                  <span className="text-[10px] uppercase font-semibold opacity-40 block">
                    Seafarer
                  </span>
                  <span className="font-bold">{selectedInvoice.seafarer}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold opacity-40 block">
                    Course
                  </span>
                  <span className="font-semibold">
                    {selectedInvoice.course}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold opacity-40 block">
                    Issued Date
                  </span>
                  <span>{selectedInvoice.issued}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold opacity-40 block">
                    Due Date
                  </span>
                  <span
                    className={
                      selectedInvoice.status === "Overdue"
                        ? dk
                          ? "text-red-400"
                          : "text-red-600"
                        : ""
                    }
                  >
                    {selectedInvoice.due}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-400 block">
                    Invoice Amount
                  </span>
                  <span className="text-base font-black text-indigo-400">
                    ₹{selectedInvoice.amount.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold opacity-60 block">
                    Status
                  </span>
                  {(() => {
                    const meta = statusMeta[selectedInvoice.status];
                    return (
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase ${dk ? meta.dark : meta.light}`}
                      >
                        {meta.icon}
                        {selectedInvoice.status}
                      </span>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedInvoice(null)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${dk ? "border-white/10 hover:bg-white/5 text-slate-300" : "border-slate-200 hover:bg-slate-100"}`}
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
