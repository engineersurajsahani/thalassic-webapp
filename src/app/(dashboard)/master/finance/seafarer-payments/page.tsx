"use client";

import React, { useState, useMemo } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  Search, Download, CheckCircle2,
  Clock, XCircle, FileText, ExternalLink, Filter,
  Building2, Handshake, Globe, X,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import FinanceTabs from "@/components/master/FinanceTabs";
import {
  MOCK_SEAFARERS,
  MockSeafarer,
  MockSeafarerPurchase,
} from "@/data/master-portal-mock";

interface FlattenedSeafarerPurchase extends MockSeafarerPurchase {
  seafarerId: string;
  seafarerName: string;
  indosNumber: string;
  rank: string;
  sourceType: string;
}

export default function SeafarerPaymentsPage() {
  const { theme } = useTheme();
  const dk = theme === "dark";

  // Flatten purchases from each physical seafarer master record
  const allPurchases: FlattenedSeafarerPurchase[] = MOCK_SEAFARERS.flatMap(sf =>
    sf.purchases.map(p => ({
      ...p,
      seafarerId: sf.id,
      seafarerName: sf.name,
      indosNumber: sf.indosNumber,
      rank: sf.rank,
      sourceType: sf.sourceType,
    }))
  );

  const [purchasesList, setPurchasesList] = useState<FlattenedSeafarerPurchase[]>(allPurchases);
  const [search, setSearch]               = useState("");
  const [typeFilter, setTypeFilter]       = useState("all");
  const [statusFilter, setStatusFilter]   = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<FlattenedSeafarerPurchase | null>(null);

  const card    = dk ? "bg-[#0c1a2e] border-white/5 rounded-2xl" : "bg-white border-slate-200 rounded-2xl shadow-sm";
  const ht      = dk ? "text-white" : "text-slate-800";
  const mt      = dk ? "text-white/40" : "text-slate-400";
  const inputBg = dk ? "bg-[#0a1525] border-white/8 text-white placeholder-white/20 focus:border-sky-500/40" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-sky-400";
  const rowHover= dk ? "border-white/5 hover:bg-white/3" : "border-slate-100 hover:bg-slate-50";
  const thCls   = dk ? "text-white/30 border-white/5" : "text-slate-400 border-slate-100";
  const modalBg = dk ? "bg-[#0c1a2e] border-white/10" : "bg-white border-slate-200";

  const filtered = purchasesList.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = p.seafarerName.toLowerCase().includes(q) ||
      p.indosNumber.toLowerCase().includes(q) ||
      p.courseTitle.toLowerCase().includes(q) ||
      p.instituteName.toLowerCase().includes(q) ||
      p.invoiceNumber.toLowerCase().includes(q);
    const matchType   = typeFilter === "all" || p.purchaseType === typeFilter;
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const seafarerSourceTrendData = useMemo(() => {
    const map: Record<string, { date: string; timestamp: number; totalSeafarers: number; partner: number; direct: number }> = {};
    filtered.forEach(p => {
      const d = p.paymentDate || "N/A";
      const ts = new Date(d).getTime() || 0;
      if (!map[d]) {
        map[d] = { date: d, timestamp: ts, totalSeafarers: 0, partner: 0, direct: 0 };
      }
      map[d].totalSeafarers += 1;
      if (p.purchaseType === "Partner") {
        map[d].partner += 1;
      } else if (p.purchaseType === "Direct") {
        map[d].direct += 1;
      }
    });
    return Object.values(map).sort((a, b) => a.timestamp - b.timestamp);
  }, [filtered]);

  const seafarerSourceCounts = useMemo(() => {
    const direct = filtered.filter(p => p.purchaseType === "Direct").length;
    const partner = filtered.filter(p => p.purchaseType === "Partner").length;
    const total = filtered.length;
    return { direct, partner, total };
  }, [filtered]);

  const sourceBreakdownData = useMemo(() => {
    return [
      { name: "Direct", label: "Direct Purchases", value: seafarerSourceCounts.direct, color: "#0ea5e9" },
      { name: "Partner", label: "Partner Collections", value: seafarerSourceCounts.partner, color: "#f43f5e" },
    ];
  }, [seafarerSourceCounts]);

  const ttStyle = {
    backgroundColor: dk ? "#0a1525" : "#ffffff",
    border: dk ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
    borderRadius: "12px",
    color: dk ? "#ffffff" : "#1e293b",
    fontSize: "12px",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-xl font-bold ${ht}`}>Seafarer Payments</h1>
          <p className={`text-sm mt-0.5 ${mt}`}>
            Granular payment ledger at the seafarer level across multiple purchases and course institutes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert("Exporting seafarer payment records...")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors ${
              dk ? "border-white/10 text-white/70 hover:bg-white/5" : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Download className="w-3.5 h-3.5" /> Export Seafarer Ledger
          </button>
        </div>
      </div>

      {/* PRD 2.1 Navigation Tabs */}
      <FinanceTabs />

      {/* Filters & Search */}
      <div className={`border ${card} p-4 flex flex-wrap items-center justify-between gap-3`}>
        <div className="relative flex-1 min-w-[260px]">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${mt}`} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Seafarer name, INDOS, Course, Institute, or Invoice #..."
            className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border ${inputBg}`}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-semibold uppercase ${mt}`}>Type:</span>
          {["all", "Direct", "Partner"].map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`text-xs capitalize transition-colors ${
                typeFilter === t
                  ? "text-emerald-600 dark:text-emerald-400 font-bold underline underline-offset-4 decoration-2 decoration-emerald-500"
                  : dk ? "text-white/40 hover:text-white/80 font-medium" : "text-slate-500 hover:text-slate-800 font-medium"
              }`}
            >
              {t === "all" ? "All Sources" : t}
            </button>
          ))}
        </div>

        <div className={`h-4 w-px ${dk ? "bg-white/10" : "bg-slate-200"} mx-1 hidden sm:block`} />

        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-semibold uppercase ${mt}`}>Status:</span>
          {["all", "Completed", "Pending"].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-xs capitalize transition-colors ${
                statusFilter === s
                  ? "text-emerald-600 dark:text-emerald-400 font-bold underline underline-offset-4 decoration-2 decoration-emerald-500"
                  : dk ? "text-white/40 hover:text-white/80 font-medium" : "text-slate-500 hover:text-slate-800 font-medium"
              }`}
            >
              {s === "all" ? "All Statuses" : s}
            </button>
          ))}
        </div>
      </div>

      {/* Financial Visualizations: Payment Collection Trend & Source Breakdown */}
      {filtered.length === 0 ? (
        <div className={`p-8 text-center rounded-2xl border ${card}`}>
          <p className={`text-sm font-semibold ${ht}`}>No payment records found</p>
          <p className={`text-xs mt-1 ${mt}`}>Try adjusting your search query or status filter to see financial visualizations.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Left — Seafarer Source Trend (≈70%) */}
          <div className={`${card} xl:col-span-2 border`}>
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b gap-2 ${dk ? "border-white/5" : "border-slate-100"}`}>
              <div>
                <p className={`text-sm font-semibold ${ht}`}>Seafarer Source Trend</p>
                <p className={`text-[11px] mt-0.5 ${mt}`}>Total seafarers by direct and partner payment source</p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                {[
                  { label: "Total Seafarers", color: "#8b5cf6" },
                  { label: "Partner", color: "#f43f5e" },
                  { label: "Direct", color: "#0ea5e9" },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: item.color }} />
                    <span className={`text-[11px] ${mt}`}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-5 pt-4 pb-3">
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={seafarerSourceTrendData} barSize={12} barGap={4} barCategoryGap="25%" margin={{ top: 10, right: 15, left: 5, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke={dk ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: dk ? "rgba(255,255,255,0.4)" : "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: dk ? "rgba(255,255,255,0.4)" : "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                    width={32}
                  />
                  <Tooltip
                    cursor={{ fill: dk ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)" }}
                    contentStyle={ttStyle}
                    formatter={(v: unknown, name: unknown) => [
                      `${Number(v || 0)} Seafarer${Number(v || 0) === 1 ? "" : "s"}`,
                      String(name || "")
                    ]}
                  />
                  <Bar dataKey="totalSeafarers" name="Total Seafarers" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="partner" name="Partner" fill="#f43f5e" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="direct" name="Direct" fill="#0ea5e9" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right — Payment Source Breakdown (≈30%) */}
          <div className={`${card} border`}>
            <div className={`px-6 py-4 border-b ${dk ? "border-white/5" : "border-slate-100"}`}>
              <p className={`text-sm font-semibold ${ht}`}>Payment Source Breakdown</p>
              <p className={`text-[11px] mt-0.5 ${mt}`}>Direct seafarer purchases vs partner collections</p>
            </div>
            <div className="px-4 py-4 space-y-4">
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={sourceBreakdownData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }} barSize={16}>
                  <CartesianGrid strokeDasharray="3 3" stroke={dk ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"} horizontal={false} />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{ fontSize: 10, fill: dk ? "rgba(255,255,255,0.3)" : "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 10, fill: dk ? "rgba(255,255,255,0.5)" : "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                    width={70}
                  />
                  <Tooltip
                    contentStyle={ttStyle}
                    formatter={(v: unknown, name: unknown, item: { payload?: { label?: string } }) => [
                      `${Number(v || 0)} Seafarer${Number(v || 0) === 1 ? "" : "s"}`,
                      item.payload?.label || String(name || "")
                    ]}
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {sourceBreakdownData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              <div className={`space-y-2 pt-3 border-t ${dk ? "border-white/5" : "border-slate-100"}`}>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-violet-500 shrink-0" />
                    <span className={mt}>Total Seafarers</span>
                  </div>
                  <span className={`font-bold ${ht}`}>{seafarerSourceCounts.total}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                    <span className={mt}>Partner</span>
                  </div>
                  <span className={`font-bold ${ht}`}>{seafarerSourceCounts.partner}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0" />
                    <span className={mt}>Direct</span>
                  </div>
                  <span className={`font-bold ${ht}`}>{seafarerSourceCounts.direct}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Seafarer-wise Payment Information Table (PRD 2.6 required fields) */}
      <div className={`border ${card} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b text-[11px] font-semibold uppercase tracking-wider ${thCls}`}>
                <th className="text-left px-6 py-3.5">Seafarer (PRD §2.6)</th>
                <th className="text-left px-6 py-3.5">Course</th>
                <th className="text-left px-6 py-3.5">Institute</th>
                <th className="text-left px-6 py-3.5">Purchase Type</th>
                <th className="text-left px-6 py-3.5">Partner</th>
                <th className="text-left px-6 py-3.5">Amount Payable</th>
                <th className="text-left px-6 py-3.5">Amount Received</th>
                <th className="text-left px-6 py-3.5">Pending Amount</th>
                <th className="text-left px-6 py-3.5">Payment Status</th>
                <th className="text-left px-6 py-3.5">Payment Date</th>
                <th className="text-right px-6 py-3.5">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((p, idx) => (
                <tr key={`${p.id}-${idx}`} className={`${rowHover} transition-colors border-b`}>
                  <td className="px-6 py-4">
                    <p className={`font-semibold text-[13px] ${ht}`}>{p.seafarerName}</p>
                    <p className={`text-[10px] font-mono ${mt}`}>INDOS: {p.indosNumber} · {p.rank}</p>
                  </td>
                  <td className={`px-6 py-4 text-[12px] font-medium ${ht}`}>{p.courseTitle}</td>
                  <td className={`px-6 py-4 text-[12px] ${mt}`}>{p.instituteName}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[11px] font-semibold text-black dark:text-white`}>
                      {p.purchaseType}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-[12px] ${mt}`}>{p.partnerName || "—"}</td>
                  <td className={`px-6 py-4 text-[13px] font-bold ${ht}`}>₹{p.amountPayableToHariom.toLocaleString()}</td>
                  <td className={`px-6 py-4 text-[13px] font-bold ${p.amountReceived === p.amountPayableToHariom ? (dk ? "text-white" : "text-black") : (dk ? "text-amber-400" : "text-amber-600")}`}>
                    ₹{p.amountReceived.toLocaleString()}
                  </td>
                  <td className={`px-6 py-4 text-[13px] font-bold ${p.pendingAmount > 0 ? "text-rose-400" : "text-slate-400"}`}>
                    ₹{p.pendingAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[11px] font-semibold ${
                      p.status === "Completed"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-amber-600 dark:text-amber-400"
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-[12px] ${mt}`}>{p.paymentDate}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedInvoice(p)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-semibold rounded-lg border transition-colors ${
                        dk ? "bg-white/5 border-white/10 text-white hover:bg-white/10" : "bg-slate-100 border-slate-200 text-black hover:bg-slate-200"
                      }`}
                    >
                      <FileText className="w-3 h-3" />
                      {p.invoiceNumber}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={`px-6 py-3.5 border-t ${dk ? "border-white/5" : "border-slate-100"} flex items-center justify-between text-xs ${mt}`}>
          <span>Showing {filtered.length} seafarer payment records</span>
          <span>Compliant with PRD §2.6 (Seafarer-level Payment Tracking)</span>
        </div>
      </div>

      {/* Invoice Viewer Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4 border ${modalBg}`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-base font-bold ${ht}`}>Invoice {selectedInvoice.invoiceNumber}</h2>
                <p className={`text-xs ${mt}`}>{selectedInvoice.seafarerName} ({selectedInvoice.indosNumber})</p>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className={mt}><X className="w-5 h-5" /></button>
            </div>

            <div className={`p-4 rounded-xl border space-y-2.5 text-xs ${dk ? "bg-white/3 border-white/5" : "bg-slate-50 border-slate-100"}`}>
              <div className="flex justify-between">
                <span className={mt}>Course Enrolled</span>
                <span className={`font-semibold ${ht}`}>{selectedInvoice.courseTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className={mt}>Training Institute</span>
                <span>{selectedInvoice.instituteName}</span>
              </div>
              <div className="flex justify-between">
                <span className={mt}>Purchase Source</span>
                <span className="font-semibold">{selectedInvoice.purchaseType} {selectedInvoice.partnerName ? `(${selectedInvoice.partnerName})` : ""}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/5">
                <span className={mt}>Amount Payable to Hari Om</span>
                <span className="font-bold text-sm">₹{selectedInvoice.amountPayableToHariom.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className={mt}>Amount Received</span>
                <span className={`font-bold text-sm ${ht}`}>₹{selectedInvoice.amountReceived.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => alert(`Downloading PDF invoice ${selectedInvoice.invoiceNumber}...`)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download Invoice PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
