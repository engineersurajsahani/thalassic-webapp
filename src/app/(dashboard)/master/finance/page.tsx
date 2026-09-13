"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/providers/theme-provider";
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  CreditCard,
  Clock,
  CheckCircle2,
  Download,
  Handshake,
  ChevronDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import FinanceTabs from "@/components/master/FinanceTabs";
import { MOCK_PAYMENTS } from "@/data/master-portal-mock";

// Monthly Trend data
const REVENUE_TREND: Array<{
  month: string;
  directRevenue: number;
  partnerRevenue: number;
  total: number;
}> = [];

const PAYMENT_STREAMS: Array<{ name: string; value: number; color: string }> =
  [];

export default function FinanceOverviewPage() {
  const { theme } = useTheme();
  const dk = theme === "dark";

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  // Theme styling tokens
  const card = dk
    ? "bg-[#0c1a2e] border border-white/5 rounded-2xl"
    : "bg-white border border-slate-200 rounded-2xl shadow-sm";
  const ht = dk ? "text-white" : "text-slate-800";
  const mt = dk ? "text-white/40" : "text-slate-400";
  const dv = dk ? "divide-white/5" : "divide-slate-100";
  const rh = dk ? "hover:bg-white/3" : "hover:bg-slate-50/80";
  const thCls = dk
    ? "border-b border-white/5 text-white/30"
    : "border-b border-slate-100 text-slate-400";

  // Aggregated figures (PRD 2.2)
  const totalRevenueYear = MOCK_PAYMENTS.reduce(
    (acc, p) => acc + (p.amountPayable || 0),
    0,
  );
  const revenueCurrentMonth = MOCK_PAYMENTS.reduce(
    (acc, p) => acc + (p.amountPayable || 0),
    0,
  );
  const totalReceived = MOCK_PAYMENTS.filter(
    (p) => p.paymentStatus === "Received",
  ).reduce((acc, p) => acc + (p.amountPayable || 0), 0);
  const receivedFromPartners = MOCK_PAYMENTS.filter(
    (p) => p.purchaseType === "Partner" && p.paymentStatus === "Received",
  ).reduce((acc, p) => acc + (p.amountPayable || 0), 0);
  const pendingFromPartners = MOCK_PAYMENTS.filter(
    (p) => p.purchaseType === "Partner" && p.paymentStatus === "Pending",
  ).reduce((acc, p) => acc + (p.amountPayable || 0), 0);
  const totalPaymentsCount = MOCK_PAYMENTS.length;
  const pendingPaymentsAmount = MOCK_PAYMENTS.filter(
    (p) => p.paymentStatus === "Pending",
  ).reduce((acc, p) => acc + (p.amountPayable || 0), 0);

  const ttStyle = {
    backgroundColor: dk ? "#0a1525" : "#ffffff",
    border: dk ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
    borderRadius: "12px",
    color: dk ? "#ffffff" : "#1e293b",
    fontSize: "12px",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-xl font-bold ${ht}`}>Master Finance</h1>
          <p className={`text-sm mt-0.5 ${mt}`}>
            Financial position, payment flows, partner settlements, and
            institute financials
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert("Downloading financial ledger snapshot...")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors ${
              dk
                ? "border-white/10 text-white/70 hover:bg-white/5"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Download className="w-3.5 h-3.5" /> Export Summary
          </button>
        </div>
      </div>

      {/* PRD 2.1 Secondary Navigation Tabs */}
      <FinanceTabs />

      {/* PRD 2.2 Finance Overview Primary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {[
          {
            label: "Total Revenue (Year)",
            value: fmt(totalRevenueYear),
            sub: "FY 2026-27",
            Icon: Wallet,
            c: "text-sky-400",
            bg: dk ? "bg-sky-500/15" : "bg-sky-50",
          },
          {
            label: "Revenue (Current Month)",
            value: fmt(revenueCurrentMonth),
            sub: "September 2026",
            Icon: TrendingUp,
            c: "text-indigo-400",
            bg: dk ? "bg-indigo-500/15" : "bg-indigo-50",
          },
          {
            label: "Total Amount Received",
            value: fmt(totalReceived),
            sub: "Settled in bank",
            Icon: CheckCircle2,
            c: "text-emerald-400",
            bg: dk ? "bg-emerald-500/15" : "bg-emerald-50",
          },
          {
            label: "Received from Partners",
            value: fmt(receivedFromPartners),
            sub: "From RPSL agencies",
            Icon: Handshake,
            c: "text-violet-400",
            bg: dk ? "bg-violet-500/15" : "bg-violet-50",
          },
          {
            label: "Pending from Partners",
            value: fmt(pendingFromPartners),
            sub: "Action required",
            Icon: Clock,
            c: "text-amber-400",
            bg: dk ? "bg-amber-500/15" : "bg-amber-50",
          },
          {
            label: "Total Transactions",
            value: totalPaymentsCount,
            sub: "Recorded payments",
            Icon: CreditCard,
            c: "text-blue-400",
            bg: dk ? "bg-blue-500/15" : "bg-blue-50",
          },
          {
            label: "Pending Payments",
            value: fmt(pendingPaymentsAmount),
            sub: "Awaiting confirmation",
            Icon: ArrowDownRight,
            c: "text-rose-400",
            bg: dk ? "bg-rose-500/15" : "bg-rose-50",
          },
        ].map((k) => (
          <div
            key={k.label}
            className={`${card} p-3.5 flex flex-col justify-between transition-all hover:scale-[1.01]`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-[10px] font-semibold truncate ${ht} opacity-75`}
              >
                {k.label}
              </span>
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${k.bg}`}
              >
                <k.Icon className={`w-3.5 h-3.5 ${k.c}`} />
              </div>
            </div>
            <div>
              <p className={`text-base font-bold leading-tight ${ht}`}>
                {k.value}
              </p>
              <p className={`text-[10px] truncate mt-0.5 ${mt}`}>{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Revenue Trend: Direct vs Partner Collections */}
        <div className={`${card} xl:col-span-2`}>
          <div
            className={`flex items-center justify-between px-6 py-4 border-b ${dk ? "border-white/5" : "border-slate-100"}`}
          >
            <div>
              <p className={`text-sm font-semibold ${ht}`}>
                Revenue Collection Breakdown
              </p>
              <p className={`text-[11px] mt-0.5 ${mt}`}>
                Direct Seafarer Payments vs Partner Collections (Last 7 Months)
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-sm inline-block"
                  style={{ background: "#8b5cf6" }}
                />
                <span className={`text-[11px] ${mt}`}>Partner Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-sm inline-block"
                  style={{ background: "#0ea5e9" }}
                />
                <span className={`text-[11px] ${mt}`}>Direct Revenue</span>
              </div>
            </div>
          </div>
          <div className="px-4 py-4">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={REVENUE_TREND}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                barSize={14}
                barGap={4}
                barCategoryGap="25%"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={dk ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"}
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{
                    fontSize: 11,
                    fill: dk ? "rgba(255,255,255,0.4)" : "#94a3b8",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v) => `₹${v / 1000}K`}
                  tick={{
                    fontSize: 11,
                    fill: dk ? "rgba(255,255,255,0.4)" : "#94a3b8",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={ttStyle}
                  formatter={(v: unknown, name: unknown) => [
                    `₹${Number(v || 0).toLocaleString("en-IN")}`,
                    String(name || ""),
                  ]}
                  cursor={{
                    fill: dk ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
                  }}
                />
                <Bar
                  dataKey="partnerRevenue"
                  name="Partner Revenue"
                  fill="#8b5cf6"
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  dataKey="directRevenue"
                  name="Direct Revenue"
                  fill="#0ea5e9"
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Stream Donut / Bar */}
        <div className={card}>
          <div
            className={`px-6 py-4 border-b ${dk ? "border-white/5" : "border-slate-100"}`}
          >
            <p className={`text-sm font-semibold ${ht}`}>Revenue by Stream</p>
            <p className={`text-[11px] mt-0.5 ${mt}`}>
              Configured Hari Om course shares
            </p>
          </div>
          <div className="px-4 py-4 space-y-4">
            <ResponsiveContainer width="100%" height={160}>
              <BarChart
                data={PAYMENT_STREAMS}
                layout="vertical"
                margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
                barSize={16}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={dk ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"}
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tickFormatter={(v) => `₹${v / 100000}L`}
                  tick={{
                    fontSize: 10,
                    fill: dk ? "rgba(255,255,255,0.3)" : "#94a3b8",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{
                    fontSize: 10,
                    fill: dk ? "rgba(255,255,255,0.5)" : "#64748b",
                  }}
                  axisLine={false}
                  tickLine={false}
                  width={100}
                />
                <Tooltip
                  contentStyle={ttStyle}
                  formatter={(v: unknown) => [
                    `₹${Number(v || 0).toLocaleString()}`,
                    "Volume",
                  ]}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {PAYMENT_STREAMS.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="space-y-2 pt-2 border-t border-white/5">
              {PAYMENT_STREAMS.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: s.color }}
                    />
                    <span className={mt}>{s.name}</span>
                  </div>
                  <span className={`font-bold ${ht}`}>{fmt(s.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Platform Transactions Table */}
      <div className={card}>
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${dk ? "border-white/5" : "border-slate-100"}`}
        >
          <div>
            <p className={`text-sm font-semibold ${ht}`}>
              Recent Platform Transactions (PRD §2.3)
            </p>
            <p className={`text-[11px] mt-0.5 ${mt}`}>
              Showing latest payments with purchase source identification
            </p>
          </div>
          <Link
            href="/master/finance/payments"
            className="flex items-center gap-1.5 text-xs font-semibold text-black dark:text-white hover:opacity-80"
          >
            View All Payments <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-fixed min-w-[960px] text-sm">
            <colgroup>
              <col className="w-[11%]" />
              <col className="w-[15%]" />
              <col className="w-[19%]" />
              <col className="w-[7%]" />
              <col className="w-[12%]" />
              <col className="w-[10%]" />
              <col className="w-[10%]" />
              <col className="w-[7%]" />
              <col className="w-[9%]" />
            </colgroup>
            <thead>
              <tr className={thCls}>
                <th className="text-left pl-6 pr-3 py-3.5 text-[10px] font-semibold uppercase tracking-wider">
                  Payment ID
                </th>
                <th className="text-left px-3 py-3.5 text-[10px] font-semibold uppercase tracking-wider">
                  Seafarer
                </th>
                <th className="text-left px-3 py-3.5 text-[10px] font-semibold uppercase tracking-wider">
                  Course
                </th>
                <th className="text-left px-3 py-3.5 text-[10px] font-semibold uppercase tracking-wider">
                  Type
                </th>
                <th className="text-left px-3 py-3.5 text-[10px] font-semibold uppercase tracking-wider">
                  Partner
                </th>
                <th className="text-right px-3 py-3.5 text-[10px] font-semibold uppercase tracking-wider">
                  Amount Payable
                </th>
                <th className="text-right px-3 py-3.5 text-[10px] font-semibold uppercase tracking-wider">
                  Amount Received
                </th>
                <th className="text-left px-3 py-3.5 text-[10px] font-semibold uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right pl-3 pr-6 py-3.5 text-[10px] font-semibold uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${dv}`}>
              {MOCK_PAYMENTS.slice(0, rowsPerPage).map((t) => (
                <tr key={t.id} className={`${rh} transition-colors`}>
                  <td
                    className={`pl-6 pr-3 py-4 text-[12px] font-mono font-semibold truncate ${dk ? "text-white" : "text-black"}`}
                  >
                    {t.id}
                  </td>
                  <td className="px-3 py-4">
                    <p className={`text-[12px] font-semibold truncate ${ht}`}>
                      {t.seafarerName}
                    </p>
                    <p className={`text-[10px] font-mono truncate ${mt}`}>
                      INDOS: {t.indosNumber}
                    </p>
                  </td>
                  <td className="px-3 py-4">
                    <p
                      className={`text-[12px] leading-snug line-clamp-2 ${ht}`}
                      title={t.courseTitle}
                    >
                      {t.courseTitle}
                    </p>
                  </td>
                  <td className="px-3 py-4">
                    <span
                      className={`text-[11px] font-semibold whitespace-nowrap ${
                        dk ? "text-white" : "text-black"
                      }`}
                    >
                      {t.purchaseType}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <p
                      className={`text-[12px] leading-snug line-clamp-2 ${mt}`}
                    >
                      {t.partnerName || "—"}
                    </p>
                  </td>
                  <td
                    className={`px-3 py-4 text-right text-[12px] font-bold ${ht}`}
                  >
                    ₹{t.amountPayable.toLocaleString()}
                  </td>
                  <td
                    className={`px-3 py-4 text-right text-[12px] font-bold ${
                      t.amountReceived === t.amountPayable
                        ? dk
                          ? "text-white"
                          : "text-black"
                        : dk
                          ? "text-amber-400"
                          : "text-amber-600"
                    }`}
                  >
                    ₹{t.amountReceived.toLocaleString()}
                  </td>
                  <td className="px-3 py-4">
                    <span
                      className={`text-[11px] font-semibold whitespace-nowrap ${
                        t.paymentStatus === "Received"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {t.paymentStatus}
                    </span>
                  </td>
                  <td
                    className={`pl-3 pr-6 py-4 text-right text-[11px] ${mt} whitespace-nowrap`}
                  >
                    {t.paymentDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          className={`px-6 py-3.5 border-t ${dk ? "border-white/5" : "border-slate-100"} flex flex-wrap items-center justify-between gap-4 text-xs ${mt}`}
        >
          <div className="flex items-center gap-2">
            <span className={`text-xs ${mt}`}>Rows per page:</span>
            <div className="relative inline-flex items-center">
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className={`appearance-none text-xs font-medium py-1 pl-2.5 pr-7 rounded-lg border cursor-pointer outline-none transition-colors ${
                  dk
                    ? "bg-[#0c1a2e] border-white/10 text-white hover:border-white/20 focus:border-sky-500"
                    : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 focus:border-sky-500 shadow-sm"
                }`}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <ChevronDown
                className={`w-3.5 h-3.5 absolute right-2 pointer-events-none ${mt}`}
              />
            </div>
          </div>
          <span>Compliant with PRD §2.3 (Direct vs Partner separation)</span>
        </div>
      </div>
    </div>
  );
}
