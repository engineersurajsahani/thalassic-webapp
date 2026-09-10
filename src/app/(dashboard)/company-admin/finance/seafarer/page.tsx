"use client";

import React, { useState, useMemo } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  mockPayments,
  mockSeafarers,
} from "@/components/company-admin/mockData";
import {
  Users,
  Search,
  Filter,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  IndianRupee,
  Calendar,
  Eye,
  X,
} from "lucide-react";
import FinanceTabs from "@/components/company-admin/FinanceTabs";
import { PaymentRecord } from "@/components/company-admin/mockData";

function formatDDMMYY(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

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

export default function SeafarerFinancePage() {
  const { theme } = useTheme();
  const dk = theme === "dark";

  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvoicePayment, setSelectedInvoicePayment] =
    useState<PaymentRecord | null>(null);
  const itemsPerPage = 8;

  const card = `rounded-2xl overflow-hidden ${dk ? "bg-[#0d1f35] border border-white/[0.06]" : "bg-white border border-slate-200 shadow-sm"}`;
  const ht = dk ? "text-white/80" : "text-slate-800";
  const mt = dk ? "text-white/35" : "text-slate-400";
  const divider = dk ? "divide-white/[0.05]" : "divide-slate-100";
  const inputBg = dk
    ? "bg-white/5 border-white/10 text-white/70 placeholder:text-white/25 focus:border-sky-500/50"
    : "bg-slate-50 border-slate-200 text-slate-700 placeholder:text-slate-400 focus:border-sky-400";

  const statusCls = (s: string) => {
    if (s === "Paid") return dk ? "text-emerald-400" : "text-emerald-700";
    if (s === "Pending") return dk ? "text-amber-400" : "text-amber-700";
    return dk ? "text-red-400" : "text-red-700";
  };
  const statusIcon = (s: string) => {
    if (s === "Paid") return <CheckCircle2 className="w-3 h-3" />;
    if (s === "Pending") return <Clock className="w-3 h-3" />;
    return <AlertCircle className="w-3 h-3" />;
  };

  // ── Group payments by seafarerId while preserving seafarer identity ─────────
  const seafarerGroups = useMemo(() => {
    const map: Record<
      string,
      {
        seafarerId: string;
        seafarerName: string;
        seafarerRank: string;
        payments: typeof mockPayments;
        totalAmount: number;
        amountPaid: number;
        pendingAmount: number;
      }
    > = {};

    mockPayments.forEach((p) => {
      if (!map[p.seafarerId]) {
        const sf = mockSeafarers.find((s) => s.id === p.seafarerId);
        map[p.seafarerId] = {
          seafarerId: p.seafarerId,
          seafarerName: p.seafarerName,
          seafarerRank: sf?.rank ?? "—",
          payments: [],
          totalAmount: 0,
          amountPaid: 0,
          pendingAmount: 0,
        };
      }
      map[p.seafarerId].payments.push(p);
      map[p.seafarerId].totalAmount += p.amount;
      if (p.status === "Paid") {
        map[p.seafarerId].amountPaid += p.amount;
      } else {
        map[p.seafarerId].pendingAmount += p.amount;
      }
    });

    return Object.values(map);
  }, []);

  // ── Filter groups by query & payment status ────────────────────────────────
  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return seafarerGroups.filter((g) => {
      const matchQ =
        g.seafarerName.toLowerCase().includes(q) ||
        g.payments.some((p) => p.course.toLowerCase().includes(q));
      const matchS =
        filterStatus === "All" ||
        g.payments.some((p) => p.status === filterStatus);
      return matchQ && matchS;
    });
  }, [seafarerGroups, query, filterStatus]);

  const chipAct =
    "text-sky-600 dark:text-sky-400 font-bold underline underline-offset-4 decoration-2 decoration-sky-500";
  const chipIn = dk
    ? "text-white/40 hover:text-white/80 font-medium"
    : "text-slate-500 hover:text-slate-800 font-medium";

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedGroups = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-xl font-bold ${ht}`}>Company Finance</h1>
        <p className={`text-sm mt-0.5 ${mt}`}>
          Course payment records and history grouped by Seafarer
        </p>
      </div>

      {/* Internal Navigation Tabs */}
      <FinanceTabs />

      {/* Summary strip */}
      <div className={card}>
        <div
          className={`grid grid-cols-2 xl:grid-cols-4 divide-x divide-y xl:divide-y-0 ${dk ? "divide-white/[0.05]" : "divide-slate-100"}`}
        >
          {[
            {
              label: "Seafarers with Payments",
              val: seafarerGroups.length,
              cls: ht,
            },
            {
              label: "Total Revenue",
              val:
                "₹" +
                (mockPayments.reduce((s, p) => s + p.amount, 0) / 1000).toFixed(
                  1,
                ) +
                "K",
              cls: dk ? "text-indigo-400" : "text-indigo-600",
            },
            {
              label: "Amount Received",
              val:
                "₹" +
                (
                  mockPayments
                    .filter((p) => p.status === "Paid")
                    .reduce((s, p) => s + p.amount, 0) / 1000
                ).toFixed(1) +
                "K",
              cls: dk ? "text-emerald-400" : "text-emerald-600",
            },
            {
              label: "Pending Amount",
              val:
                "₹" +
                (
                  mockPayments
                    .filter((p) => p.status !== "Paid")
                    .reduce((s, p) => s + p.amount, 0) / 1000
                ).toFixed(1) +
                "K",
              cls: dk ? "text-amber-400" : "text-amber-600",
            },
          ].map((s) => (
            <div key={s.label} className="px-6 py-4 text-center">
              <p className={`text-2xl font-bold ${s.cls}`}>{s.val}</p>
              <p className={`text-[11px] mt-0.5 ${mt}`}>{s.label}</p>
            </div>
          ))}
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
              placeholder="Search seafarer or course…"
              className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border outline-none transition-colors ${inputBg}`}
            />
          </div>
          <div className="flex items-center gap-4 flex-wrap py-1">
            <Filter className={`w-3.5 h-3.5 ${mt}`} />
            {["All", "Paid", "Pending", "Overdue"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`text-xs transition-all cursor-pointer ${filterStatus === s ? chipAct : chipIn}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Seafarer Groups – accordion */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className={`${card} text-center py-16 ${mt}`}>
            <Users className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No records match your search</p>
          </div>
        )}
        {paginatedGroups.map((g, gi) => {
          const isOpen = expandedId === g.seafarerId;
          const overallStatus =
            g.pendingAmount === 0
              ? "Paid"
              : g.amountPaid === 0
                ? "Pending"
                : "Partial";
          return (
            <div key={g.seafarerId} className={card}>
              {/* Seafarer row header */}
              <button
                onClick={() => setExpandedId(isOpen ? null : g.seafarerId)}
                className={`w-full flex items-center justify-between px-5 py-4 cursor-pointer transition-colors ${dk ? "hover:bg-white/[0.03]" : "hover:bg-slate-50"}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 ${AVATAR_COLORS[gi % AVATAR_COLORS.length]}`}
                  >
                    {initials(g.seafarerName)}
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-bold ${ht}`}>
                      {g.seafarerName}
                    </p>
                    <p className={`text-[11px] ${mt}`}>
                      {g.seafarerRank} · {g.payments.length} course
                      {g.payments.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="text-right hidden sm:block">
                    <p className={`text-sm font-bold ${ht}`}>
                      ₹{g.totalAmount.toLocaleString("en-IN")}
                    </p>
                    <p className={`text-[10px] ${mt}`}>Total</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className={`text-sm font-bold text-emerald-500`}>
                      ₹{g.amountPaid.toLocaleString("en-IN")}
                    </p>
                    <p className={`text-[10px] ${mt}`}>Paid</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className={`text-sm font-bold text-amber-500`}>
                      ₹{g.pendingAmount.toLocaleString("en-IN")}
                    </p>
                    <p className={`text-[10px] ${mt}`}>Pending</p>
                  </div>
                  <span
                    className={`hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold ${statusCls(overallStatus === "Partial" ? "Pending" : overallStatus)}`}
                  >
                    {overallStatus === "Partial"
                      ? "Partial"
                      : statusIcon(overallStatus)}
                    {overallStatus === "Partial" ? "" : overallStatus}
                  </span>
                  {isOpen ? (
                    <ChevronUp className={`w-4 h-4 ${mt}`} />
                  ) : (
                    <ChevronDown className={`w-4 h-4 ${mt}`} />
                  )}
                </div>
              </button>

              {/* Expanded: per-course payment rows */}
              {isOpen && (
                <div
                  className={`border-t ${dk ? "border-white/5" : "border-slate-100"}`}
                >
                  <table className="w-full text-sm">
                    <thead>
                      <tr
                        className={
                          dk
                            ? "border-b border-white/5 bg-white/[0.02]"
                            : "border-b border-slate-100 bg-slate-50"
                        }
                      >
                        {[
                          "Pay ID",
                          "Course",
                          "Institute",
                          "Amount",
                          "Amount Paid",
                          "Pending",
                          "Status",
                          "Date",
                          "Invoice",
                        ].map((h) => (
                          <th
                            key={h}
                            className={`text-left px-5 py-3 text-[9px] font-semibold uppercase tracking-wider whitespace-nowrap ${mt}`}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${divider}`}>
                      {g.payments.map((p) => {
                        const paid = p.status === "Paid" ? p.amount : 0;
                        const pending = p.status !== "Paid" ? p.amount : 0;
                        return (
                          <tr
                            key={p.id}
                            className={`transition-colors ${dk ? "hover:bg-white/[0.02]" : "hover:bg-slate-50/60"}`}
                          >
                            <td
                              className={`px-5 py-3 text-[11px] font-mono ${mt}`}
                            >
                              {p.id}
                            </td>
                            <td
                              className={`px-5 py-3 text-[12px] max-w-[140px] truncate font-medium ${ht}`}
                            >
                              {p.course}
                            </td>
                            <td
                              className={`px-5 py-3 text-[11px] max-w-[120px] truncate ${mt}`}
                            >
                              {p.instituteName.split(" ").slice(0, 3).join(" ")}
                            </td>
                            <td
                              className={`px-5 py-3 text-[13px] font-bold ${ht}`}
                            >
                              ₹{p.amount.toLocaleString("en-IN")}
                            </td>
                            <td
                              className={`px-5 py-3 text-[13px] font-bold text-emerald-500`}
                            >
                              ₹{paid.toLocaleString("en-IN")}
                            </td>
                            <td
                              className={`px-5 py-3 text-[13px] font-bold text-amber-500`}
                            >
                              ₹{pending.toLocaleString("en-IN")}
                            </td>
                            <td className="px-5 py-3">
                              <span
                                className={`inline-flex items-center gap-1 text-[11px] font-semibold ${statusCls(p.status)}`}
                              >
                                {statusIcon(p.status)}
                                {p.status}
                              </span>
                            </td>
                            <td className={`px-5 py-3 text-[11px] ${mt}`}>
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3 h-3 shrink-0" />
                                {formatDDMMYY(p.date)}
                              </div>
                            </td>
                            <td className="px-5 py-3 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`inline-flex items-center gap-1 text-[11px] font-mono font-medium ${p.txnId !== "—" ? "text-sky-500" : mt}`}
                                >
                                  <FileText className="w-3 h-3 shrink-0 opacity-70" />
                                  {p.txnId !== "—" ? p.txnId.slice(-6) : p.id}
                                </span>
                                <button
                                  onClick={() => setSelectedInvoicePayment(p)}
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer shadow-xs ${
                                    dk
                                      ? "bg-sky-500/10 border-sky-500/30 text-sky-400 hover:bg-sky-500/20"
                                      : "bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100"
                                  }`}
                                  title="View complete invoice details"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>View Invoice</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={`text-xs ${mt} pl-1`}>
        Showing {filtered.length} of {seafarerGroups.length} seafarers
      </div>

      {/* Pagination — only when more than 1 page */}
      {totalPages > 1 && (
        <div
          className={`${card} px-5 py-3 flex items-center justify-between text-xs`}
        >
          <span className={dk ? "text-white/40" : "text-slate-400"}>
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>{" "}
            ({filtered.length} seafarers)
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`p-1.5 rounded border transition-colors cursor-pointer disabled:opacity-40 disabled:pointer-events-none ${dk ? "border-white/10 hover:bg-white/5 text-white" : "border-slate-200 hover:bg-slate-50 text-slate-700"}`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`p-1.5 rounded border transition-colors cursor-pointer disabled:opacity-40 disabled:pointer-events-none ${dk ? "border-white/10 hover:bg-white/5 text-white" : "border-slate-200 hover:bg-slate-50 text-slate-700"}`}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Complete Invoice Details Modal */}
      {selectedInvoicePayment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedInvoicePayment(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-lg rounded-2xl border shadow-2xl p-6 relative animate-fadeIn flex flex-col ${
              dk
                ? "bg-[#0B1528] border-white/10 text-white"
                : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider opacity-60">
                    Tax Invoice Receipt
                  </span>
                  <h3 className="text-base font-bold font-mono">
                    {selectedInvoicePayment.invoiceNumber ||
                      `HOC-2026-${selectedInvoicePayment.id.slice(-6)}`}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoicePayment(null)}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  dk
                    ? "border-white/10 hover:bg-white/5 text-slate-300"
                    : "border-slate-200 hover:bg-slate-100"
                }`}
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
                  <span className="font-bold">
                    {selectedInvoicePayment.seafarerName}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold opacity-40 block">
                    Transaction ID
                  </span>
                  <span className="font-mono">
                    {selectedInvoicePayment.txnId || selectedInvoicePayment.id}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold opacity-40 block">
                    Course
                  </span>
                  <span className="font-semibold">
                    {selectedInvoicePayment.course}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold opacity-40 block">
                    Training Institute
                  </span>
                  <span className="font-semibold">
                    {selectedInvoicePayment.instituteName}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold opacity-40 block">
                    Payment Date
                  </span>
                  <span>{formatDDMMYY(selectedInvoicePayment.date)}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold opacity-40 block">
                    Payment Method
                  </span>
                  <span className="font-semibold">
                    {selectedInvoicePayment.method || "Direct Bank"}
                  </span>
                </div>
              </div>

              {/* Financial Totals */}
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block">
                    Total Course Fee
                  </span>
                  <span className="text-base font-black text-emerald-400">
                    ₹{selectedInvoicePayment.amount.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold opacity-60 block">
                    Payment Status
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase ${statusCls(selectedInvoicePayment.status)}`}
                  >
                    {statusIcon(selectedInvoicePayment.status)}
                    {selectedInvoicePayment.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedInvoicePayment(null)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                  dk
                    ? "border-white/10 hover:bg-white/5 text-slate-300"
                    : "border-slate-200 hover:bg-slate-100"
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
