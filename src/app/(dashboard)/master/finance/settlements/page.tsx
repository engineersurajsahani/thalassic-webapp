"use client";

import React, { useState, useMemo } from "react";
import { useTheme } from "@/providers/theme-provider";
import { useGlobalStatus } from "@/providers/status-provider";
import {
  Search, X,
  FileText, Download,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import FinanceTabs from "@/components/master/FinanceTabs";
import {
  MOCK_PARTNER_SETTLEMENTS,
  MockPartnerSettlement,
} from "@/data/master-portal-mock";

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  Settled:            { label: "Settled",           cls: "text-emerald-600 dark:text-emerald-400" },
  "Partially Settled":{ label: "Partially Settled", cls: "text-emerald-600 dark:text-emerald-400" },
  Pending:            { label: "Pending",           cls: "text-rose-500 dark:text-rose-400" },
};

export default function PartnerSettlementsPage() {
  const { theme } = useTheme();
  const dk = theme === "dark";
  const { getStatusesForModule, getStatus } = useGlobalStatus();
  const financeStatuses = getStatusesForModule("finance");

  const [settlements] = useState<MockPartnerSettlement[]>(MOCK_PARTNER_SETTLEMENTS);
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSettlement, setSelectedSettlement] = useState<MockPartnerSettlement | null>(null);

  const card    = dk ? "bg-[#0c1a2e] border-white/5 rounded-2xl" : "bg-white border-slate-200 rounded-2xl shadow-sm";
  const ht      = dk ? "text-white" : "text-slate-800";
  const mt      = dk ? "text-white/40" : "text-slate-400";
  const inputBg = dk ? "bg-[#0a1525] border-white/8 text-white placeholder-white/20 focus:border-sky-500/40" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-sky-400";
  const rowHover= dk ? "border-white/5 hover:bg-white/3" : "border-slate-100 hover:bg-slate-50";
  const thCls   = dk ? "text-white/30 border-white/5" : "text-slate-400 border-slate-100";
  const modalBg = dk ? "bg-[#0c1a2e] border-white/10" : "bg-white border-slate-200";

  const filtered = settlements.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = s.partnerName.toLowerCase().includes(q) ||
      s.settlementReference.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || s.settlementStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const timelineData = useMemo(() => {
    const map: Record<string, { date: string; timestamp: number; payable: number; received: number; pending: number }> = {};
    filtered.forEach(s => {
      const d = s.settlementDate || "N/A";
      const ts = new Date(d).getTime() || 0;
      if (!map[d]) {
        map[d] = { date: d, timestamp: ts, payable: 0, received: 0, pending: 0 };
      }
      map[d].payable += s.totalPayable;
      map[d].received += s.totalReceived;
      map[d].pending += s.pendingAmount;
    });
    return Object.values(map).sort((a, b) => a.timestamp - b.timestamp);
  }, [filtered]);

  const statusBreakdown = useMemo(() => {
    const counts: Record<string, number> = {
      Settled: 0,
      "Partially Settled": 0,
      Pending: 0,
    };
    filtered.forEach(s => {
      if (counts[s.settlementStatus] !== undefined) {
        counts[s.settlementStatus] += s.totalPayable;
      }
    });
    return [
      { name: "Settled", value: counts["Settled"], color: "#8b5cf6" },
      { name: "Partially Settled", value: counts["Partially Settled"], color: "#10b981" },
      { name: "Pending", value: counts["Pending"], color: "#f43f5e" },
    ];
  }, [filtered]);

  const totalPayable = useMemo(() => filtered.reduce((acc, s) => acc + s.totalPayable, 0), [filtered]);
  const totalReceived = useMemo(() => filtered.reduce((acc, s) => acc + s.totalReceived, 0), [filtered]);
  const totalPending = useMemo(() => filtered.reduce((acc, s) => acc + s.pendingAmount, 0), [filtered]);

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
          <h1 className={`text-xl font-bold ${ht}`}>Partner Settlements</h1>
          <p className={`text-sm mt-0.5 ${mt}`}>
            Manage and reconcile bulk payments collected by maritime recruitment partners
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert("Exporting partner settlements ledger...")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors ${
              dk ? "border-white/10 text-white/70 hover:bg-white/5" : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Download className="w-3.5 h-3.5" /> Export Settlements
          </button>
        </div>
      </div>

      {/* PRD 2.1 Secondary Tabs */}
      <FinanceTabs />

      {/* Filters & Search */}
      <div className={`border ${card} p-4 flex flex-wrap items-center justify-between gap-3`}>
        <div className="relative flex-1 min-w-[260px]">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${mt}`} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Partner agency, Settlement ID, or UTR / Bank reference..."
            className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border ${inputBg}`}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-semibold uppercase ${mt}`}>Status:</span>
          <button
            onClick={() => setStatusFilter("all")}
            className={`text-xs capitalize transition-colors ${
              statusFilter === "all"
                ? "text-black dark:text-white font-bold underline underline-offset-4 decoration-2 decoration-violet-500"
                : dk ? "text-white/40 hover:text-white/80 font-medium" : "text-slate-500 hover:text-slate-800 font-medium"
            }`}
          >
            All Statuses
          </button>
          {financeStatuses.map(st => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.label)}
              className={`text-xs capitalize transition-colors ${
                statusFilter === st.label
                  ? "text-black dark:text-white font-bold underline underline-offset-4 decoration-2 decoration-violet-500"
                  : dk ? "text-white/40 hover:text-white/80 font-medium" : "text-slate-500 hover:text-slate-800 font-medium"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Financial Visualizations: Settlement Collection Trend & Status Breakdown */}
      {filtered.length === 0 ? (
        <div className={`p-8 text-center rounded-2xl border ${card}`}>
          <p className={`text-sm font-semibold ${ht}`}>No settlement records found</p>
          <p className={`text-xs mt-1 ${mt}`}>Try adjusting your search query or status filter to see financial visualizations.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Left — Settlement Collection Trend (≈70%) */}
          <div className={`${card} xl:col-span-2 border`}>
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b gap-2 ${dk ? "border-white/5" : "border-slate-100"}`}>
              <div>
                <p className={`text-sm font-semibold ${ht}`}>Settlement Collection Trend</p>
                <p className={`text-[11px] mt-0.5 ${mt}`}>Payable, received, and pending balances over settlement timeline</p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                {[
                  { label: "Amount Payable", color: "#8b5cf6" },
                  { label: "Amount Received", color: "#10b981" },
                  { label: "Pending Amount", color: "#f43f5e" },
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
                <BarChart data={timelineData} barSize={12} barGap={4} barCategoryGap="25%" margin={{ top: 10, right: 15, left: 5, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke={dk ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: dk ? "rgba(255,255,255,0.4)" : "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={v => v >= 100000 ? `₹${(v/100000).toFixed(1)}L` : `₹${v/1000}K`}
                    tick={{ fontSize: 11, fill: dk ? "rgba(255,255,255,0.4)" : "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                    width={48}
                  />
                  <Tooltip
                    cursor={{ fill: dk ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)" }}
                    contentStyle={ttStyle}
                    formatter={(v: unknown, name: unknown) => [
                      `₹${Number(v || 0).toLocaleString("en-IN")}`,
                      String(name || "")
                    ]}
                  />
                  <Bar dataKey="payable" name="Amount Payable" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="received" name="Amount Received" fill="#10b981" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="pending" name="Pending Amount" fill="#f43f5e" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right — Settlement Status Breakdown (≈30%) */}
          <div className={`${card} border`}>
            <div className={`px-6 py-4 border-b ${dk ? "border-white/5" : "border-slate-100"}`}>
              <p className={`text-sm font-semibold ${ht}`}>Settlement Status Breakdown</p>
              <p className={`text-[11px] mt-0.5 ${mt}`}>Volume grouped by fulfillment status</p>
            </div>
            <div className="px-4 py-4 space-y-4">
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={statusBreakdown} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }} barSize={16}>
                  <CartesianGrid strokeDasharray="3 3" stroke={dk ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"} horizontal={false} />
                  <XAxis
                    type="number"
                    tickFormatter={v => v >= 100000 ? `₹${(v/100000).toFixed(1)}L` : `₹${v/1000}K`}
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
                    width={95}
                  />
                  <Tooltip
                    contentStyle={ttStyle}
                    formatter={(v: unknown) => [`₹${Number(v || 0).toLocaleString("en-IN")}`, "Payable Volume"]}
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {statusBreakdown.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              <div className={`space-y-2 pt-3 border-t ${dk ? "border-white/5" : "border-slate-100"}`}>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-violet-500 shrink-0" />
                    <span className={mt}>Total Payable</span>
                  </div>
                  <span className={`font-bold ${ht}`}>₹{totalPayable.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className={mt}>Total Received</span>
                  </div>
                  <span className={`font-bold text-emerald-500`}>₹{totalReceived.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                    <span className={mt}>Total Pending</span>
                  </div>
                  <span className={`font-bold ${totalPending > 0 ? "text-rose-500" : ht}`}>
                    ₹{totalPending.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settlements Table (PRD 2.4 required columns) */}
      <div className={`border ${card} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b text-[11px] font-semibold uppercase tracking-wider ${thCls}`}>
                <th className="text-left px-6 py-3.5">Settlement ID</th>
                <th className="text-left px-6 py-3.5">Partner Agency</th>
                <th className="text-left px-6 py-3.5">Total Amount Payable</th>
                <th className="text-left px-6 py-3.5">Total Amount Received</th>
                <th className="text-left px-6 py-3.5">Pending Amount</th>
                <th className="text-left px-6 py-3.5">Settlement Status</th>
                <th className="text-left px-6 py-3.5">Settlement Date</th>
                <th className="text-left px-6 py-3.5">UTR / Bank Reference</th>
                <th className="text-right px-6 py-3.5">Related Purchases</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(s => {
                const badge = STATUS_CONFIG[s.settlementStatus] || STATUS_CONFIG.Pending;
                return (
                  <tr key={s.id} className={`${rowHover} transition-colors border-b`}>
                    <td className={`px-6 py-4 text-[12px] font-mono font-bold ${dk ? "text-white" : "text-black"}`}>
                      {s.id}
                    </td>
                    <td className="px-6 py-4">
                      <p className={`font-semibold text-[13px] ${ht}`}>{s.partnerName}</p>
                      <p className={`text-[10px] font-mono ${mt}`}>ID: {s.partnerId}</p>
                    </td>
                    <td className={`px-6 py-4 text-[13px] font-bold ${ht}`}>
                      ₹{s.totalPayable.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-[13px] font-bold text-emerald-400">
                      ₹{s.totalReceived.toLocaleString()}
                    </td>
                    <td className={`px-6 py-4 text-[13px] font-bold ${s.pendingAmount > 0 ? "text-rose-400" : "text-slate-400"}`}>
                      ₹{s.pendingAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[11px] font-semibold ${getStatus(s.settlementStatus)?.color || (badge ? badge.cls : "text-slate-400")}`}>
                        {getStatus(s.settlementStatus)?.label || s.settlementStatus}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-[12px] ${mt}`}>{s.settlementDate}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[11px] font-mono ${dk ? "text-white/70" : "text-slate-600"}`}>
                        {s.settlementReference}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedSettlement(s)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                          dk ? "bg-white/5 border-white/10 text-white hover:bg-white/10" : "bg-slate-100 border-slate-200 text-black hover:bg-slate-200"
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        {s.relatedPurchasesCount} Purchases
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Related Purchases Modal (PRD 2.4) */}
      {selectedSettlement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-xl rounded-2xl shadow-2xl p-6 space-y-4 border ${modalBg}`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-base font-bold ${ht}`}>Related Purchases · {selectedSettlement.partnerName}</h2>
                <p className={`text-xs mt-0.5 ${mt}`}>Settlement Ref: {selectedSettlement.settlementReference}</p>
              </div>
              <button onClick={() => setSelectedSettlement(null)} className={mt}><X className="w-5 h-5" /></button>
            </div>

            <div className={`border rounded-xl overflow-hidden ${dk ? "border-white/5" : "border-slate-100"}`}>
              <table className="w-full text-left text-xs">
                <thead className={`text-[10px] font-semibold uppercase ${dk ? "bg-white/5 text-white/40" : "bg-slate-100 text-slate-500"}`}>
                  <tr>
                    <th className="p-3">Seafarer</th>
                    <th className="p-3">Course</th>
                    <th className="p-3">Hari Om Share</th>
                    <th className="p-3">Enrollment Date</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${dk ? "divide-white/5" : "divide-slate-100"}`}>
                  {selectedSettlement.purchases.map((p, idx) => (
                    <tr key={idx}>
                      <td className={`p-3 font-semibold ${ht}`}>{p.seafarerName}</td>
                      <td className={`p-3 ${ht}`}>{p.courseTitle}</td>
                      <td className="p-3 font-bold text-emerald-400">₹{p.amount.toLocaleString()}</td>
                      <td className={`p-3 ${mt}`}>{p.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className={`text-xs ${mt}`}>Total: {selectedSettlement.relatedPurchasesCount} verified course transactions</span>
              <button
                onClick={() => setSelectedSettlement(null)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-xl ${dk ? "bg-white/10 text-white" : "bg-slate-200 text-slate-700"}`}
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
