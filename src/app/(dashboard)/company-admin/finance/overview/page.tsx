"use client";

import React, { useState, useMemo } from "react";
import { useTheme } from "@/providers/theme-provider";
import { mockPayments } from "@/components/company-admin/mockData";
import FinanceTabs from "@/components/company-admin/FinanceTabs";
import {
  IndianRupee,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Calendar,
  Filter,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

function formatDDMMYY(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

export default function FinanceOverviewPage() {
  const { theme } = useTheme();
  const dk = theme === "dark";

  // Institute filter states
  const [revenueInstFilter, setRevenueInstFilter] = useState("All");
  const [collectionInstFilter, setCollectionInstFilter] = useState("All");

  const card = `rounded-2xl overflow-hidden ${dk ? "bg-[#0d1f35] border border-white/[0.06]" : "bg-white border border-slate-200 shadow-sm"}`;
  const ht = dk ? "text-white" : "text-[#000000]";
  const mt = dk ? "text-white/60" : "text-[#000000]/70";
  const divider = dk ? "divide-white/[0.05]" : "divide-slate-100";
  const selectCls = `py-1.5 px-2.5 text-[11px] rounded-lg border outline-none font-semibold cursor-pointer ${dk ? "bg-white/5 border-white/10 text-white" : "bg-slate-50 border-slate-200 text-[#000000]"}`;

  // ── Unique institutes list ──────────────────────────────────────────────────
  const instituteNames = useMemo(() => {
    const names = new Set(mockPayments.map((p) => p.instituteName));
    return Array.from(names).sort();
  }, []);

  // ── Derived KPIs ────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const totalRevenue = mockPayments.reduce((s, p) => s + p.amount, 0);
    const totalReceived = mockPayments
      .filter((p) => p.status === "Paid")
      .reduce((s, p) => s + p.amount, 0);
    const pendingAmount = mockPayments
      .filter((p) => p.status === "Pending")
      .reduce((s, p) => s + p.amount, 0);
    const overdueAmount = mockPayments
      .filter((p) => p.status === "Overdue")
      .reduce((s, p) => s + p.amount, 0);
    const totalPayments = mockPayments.length;
    const pendingPayments = mockPayments.filter(
      (p) => p.status !== "Paid",
    ).length;

    // Monthly Revenue – payments dated "Aug 2026" or recent
    const monthlyRevenue = mockPayments
      .filter((p) => p.date.includes("Aug") || p.date.includes("Sep"))
      .reduce((s, p) => s + p.amount, 0);

    return {
      totalRevenue,
      totalReceived,
      pendingAmount,
      overdueAmount,
      totalPayments,
      pendingPayments,
      monthlyRevenue,
    };
  }, []);

  const kpis = [
    {
      label: "Total Revenue",
      value: stats.totalRevenue,
      fmt: "currency",
      icon: IndianRupee,
      color: "#6366f1",
      bg: dk ? "bg-indigo-500/15" : "bg-indigo-50",
    },
    {
      label: "Monthly Revenue",
      value: stats.monthlyRevenue,
      fmt: "currency",
      icon: TrendingUp,
      color: "#10b981",
      bg: dk ? "bg-emerald-500/15" : "bg-emerald-50",
    },
    {
      label: "Amount Received",
      value: stats.totalReceived,
      fmt: "currency",
      icon: CheckCircle2,
      color: "#22c55e",
      bg: dk ? "bg-green-500/15" : "bg-green-50",
    },
    {
      label: "Pending Amount",
      value: stats.pendingAmount,
      fmt: "currency",
      icon: Clock,
      color: "#f59e0b",
      bg: dk ? "bg-amber-500/15" : "bg-amber-50",
    },
    {
      label: "Total Payments",
      value: stats.totalPayments,
      fmt: "count",
      icon: CreditCard,
      color: "#3b82f6",
      bg: dk ? "bg-blue-500/15" : "bg-blue-50",
    },
    {
      label: "Pending Payments",
      value: stats.pendingPayments,
      fmt: "count",
      icon: AlertCircle,
      color: "#f43f5e",
      bg: dk ? "bg-rose-500/15" : "bg-rose-50",
    },
  ];

  const fmt = (v: number, type: string) =>
    type === "currency" ? `₹${(v / 1000).toFixed(1)}K` : String(v);

  // ── Bar chart data: Revenue by Institute (filterable) ──────────────────────
  const byInstitute = useMemo(() => {
    const filtered =
      revenueInstFilter === "All"
        ? mockPayments
        : mockPayments.filter((p) => p.instituteName === revenueInstFilter);
    const map: Record<
      string,
      { name: string; Received: number; Pending: number }
    > = {};
    filtered.forEach((p) => {
      if (!map[p.instituteId]) {
        map[p.instituteId] = {
          name:
            p.instituteName.length > 20
              ? p.instituteName.slice(0, 20) + "…"
              : p.instituteName,
          Received: 0,
          Pending: 0,
        };
      }
      if (p.status === "Paid") map[p.instituteId].Received += p.amount;
      else map[p.instituteId].Pending += p.amount;
    });
    return Object.values(map);
  }, [revenueInstFilter]);

  // ── Donut Chart Data for Collection Summary (filterable) ───────────────────
  const collectionStats = useMemo(() => {
    const filtered =
      collectionInstFilter === "All"
        ? mockPayments
        : mockPayments.filter((p) => p.instituteName === collectionInstFilter);
    const received = filtered
      .filter((p) => p.status === "Paid")
      .reduce((s, p) => s + p.amount, 0);
    const pending = filtered
      .filter((p) => p.status === "Pending")
      .reduce((s, p) => s + p.amount, 0);
    const overdue = filtered
      .filter((p) => p.status === "Overdue")
      .reduce((s, p) => s + p.amount, 0);
    const total = received + pending + overdue;
    const paidCount = filtered.filter((p) => p.status === "Paid").length;
    const pendCount = filtered.filter((p) => p.status === "Pending").length;
    const overdueCount = filtered.filter((p) => p.status === "Overdue").length;
    return {
      received,
      pending,
      overdue,
      total,
      paidCount,
      pendCount,
      overdueCount,
    };
  }, [collectionInstFilter]);

  const donutData = useMemo(() => {
    return [
      { name: "Paid", value: collectionStats.received, color: "#10b981" },
      { name: "Pending", value: collectionStats.pending, color: "#f59e0b" },
      { name: "Overdue", value: collectionStats.overdue, color: "#ef4444" },
    ].filter((d) => d.value > 0);
  }, [collectionStats]);

  // ── Filtered Recent Transactions: Strictly most recent 1 month (30 days) ────
  const recentTransactions = useMemo(() => {
    // Current reference date: Sep 2026
    const now = new Date(2026, 8, 5); // 5 Sep 2026
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return mockPayments.filter((p) => {
      const d = new Date(p.date);
      return !isNaN(d.getTime()) && d >= thirtyDaysAgo;
    });
  }, []);

  const statusCls = (s: string) => {
    if (s === "Paid") return dk ? "text-emerald-400" : "text-emerald-700";
    if (s === "Pending") return dk ? "text-amber-400" : "text-amber-700";
    if (s === "Partial") return dk ? "text-blue-400" : "text-blue-700";
    return dk ? "text-red-400" : "text-red-700";
  };

  return (
    <div className="space-y-6">
      {/* Header & Breadcrumb */}
      <div>
        <h1 className={`text-xl font-bold ${ht}`}>Company Finance</h1>
        <p className={`text-sm mt-0.5 ${mt}`}>
          Financial analytics, invoices, and payment tracking for seafarer
          training
        </p>
      </div>

      {/* Internal Navigation Tabs */}
      <FinanceTabs />

      {/* KPI Grid */}
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div
              key={k.label}
              className={`${card} flex items-center gap-4 px-6 py-5`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${k.bg}`}
              >
                <Icon className="w-5 h-5" style={{ color: k.color }} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${ht}`}>
                  {fmt(k.value, k.fmt)}
                </p>
                <p className={`text-[11px] mt-0.5 ${mt}`}>{k.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Vertical Bar Chart: Revenue by Institute — Req #7 + #10 */}
        <div className={`${card} p-6`}>
          <div className="flex items-center justify-between mb-5">
            <h2 className={`text-sm font-bold ${ht}`}>Revenue by Institute</h2>
            <div className="flex items-center gap-1.5">
              <Filter className={`w-3.5 h-3.5 ${mt}`} />
              <select
                value={revenueInstFilter}
                onChange={(e) => setRevenueInstFilter(e.target.value)}
                className={selectCls}
              >
                <option value="All">All Institutes</option>
                {instituteNames.map((name) => (
                  <option key={name} value={name}>
                    {name.length > 30 ? name.slice(0, 30) + "…" : name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {byInstitute.length === 0 ? (
            <p className={`text-sm ${mt} text-center py-8`}>
              No data available
            </p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byInstitute} barGap={4} barCategoryGap="20%">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={dk ? "rgba(255,255,255,0.05)" : "#f1f5f9"}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={(props: {
                      x?: number;
                      y?: number;
                      payload?: { value?: string };
                    }) => {
                      const { x = 0, y = 0, payload } = props;
                      const words = String(payload?.value || "").split(" ");
                      const line1 = words
                        .slice(0, Math.ceil(words.length / 2))
                        .join(" ");
                      const line2 = words
                        .slice(Math.ceil(words.length / 2))
                        .join(" ");
                      const textColor = dk ? "#f1f5f9" : "#000000";
                      return (
                        <g transform={`translate(${x},${y})`}>
                          <text
                            x={0}
                            y={10}
                            dy={0}
                            textAnchor="middle"
                            fill={textColor}
                            fontSize={10}
                            fontWeight={600}
                          >
                            {line1}
                          </text>
                          {line2 && (
                            <text
                              x={0}
                              y={10}
                              dy={12}
                              textAnchor="middle"
                              fill={textColor}
                              fontSize={10}
                              fontWeight={600}
                            >
                              {line2}
                            </text>
                          )}
                        </g>
                      );
                    }}
                    axisLine={{
                      stroke: dk ? "rgba(255,255,255,0.1)" : "#cbd5e1",
                    }}
                    tickLine={false}
                    interval={0}
                    height={50}
                  />
                  <YAxis
                    tick={{
                      fontSize: 10,
                      fontWeight: 600,
                      fill: dk ? "#f1f5f9" : "#000000",
                    }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    formatter={(val: unknown, name: unknown) => [
                      `₹${Number(val).toLocaleString("en-IN")}`,
                      String(name),
                    ]}
                    contentStyle={{
                      backgroundColor: dk ? "#0c1a2e" : "#ffffff",
                      borderColor: dk ? "rgba(255,255,255,0.1)" : "#e2e8f0",
                      borderRadius: "12px",
                      color: dk ? "#ffffff" : "#000000",
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  />
                  <Legend
                    iconType="square"
                    iconSize={10}
                    wrapperStyle={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: dk ? "#ffffff" : "#000000",
                      paddingTop: 8,
                    }}
                  />
                  <Bar
                    dataKey="Received"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar dataKey="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Collection Summary — Donut Chart + Institute Filter — Req #11 */}
        <div className={`${card} p-6 flex flex-col justify-between`}>
          <div className="flex items-center justify-between mb-2">
            <h2 className={`text-sm font-bold ${ht}`}>Collection Summary</h2>
            <div className="flex items-center gap-1.5">
              <Filter className={`w-3.5 h-3.5 ${mt}`} />
              <select
                value={collectionInstFilter}
                onChange={(e) => setCollectionInstFilter(e.target.value)}
                className={selectCls}
              >
                <option value="All">All Institutes</option>
                {instituteNames.map((name) => (
                  <option key={name} value={name}>
                    {name.length > 30 ? name.slice(0, 30) + "…" : name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-auto">
            {/* Recharts Donut Pie */}
            <div className="h-44 w-44 relative shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: unknown) => [
                      `₹${Number(val).toLocaleString("en-IN")}`,
                      "Amount",
                    ]}
                    contentStyle={{
                      backgroundColor: dk ? "#0c1a2e" : "#ffffff",
                      borderColor: dk ? "rgba(255,255,255,0.1)" : "#e2e8f0",
                      borderRadius: "12px",
                      color: dk ? "#ffffff" : "#000000",
                      fontWeight: 600,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] uppercase font-bold text-black dark:text-white opacity-70">
                  Total
                </span>
                <span className="text-xs font-black text-black dark:text-white">
                  ₹{(collectionStats.total / 1000).toFixed(0)}K
                </span>
              </div>
            </div>

            {/* Solid Black Text Metrics Breakdown */}
            <div className="flex-1 w-full space-y-3">
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-black dark:text-white">
                    Amount Received
                  </span>
                </div>
                <span className="text-xs font-bold text-black dark:text-white">
                  ₹{collectionStats.received.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-xs font-bold text-black dark:text-white">
                    Amount Pending
                  </span>
                </div>
                <span className="text-xs font-bold text-black dark:text-white">
                  ₹{collectionStats.pending.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="text-xs font-bold text-black dark:text-white">
                    Amount Overdue
                  </span>
                </div>
                <span className="text-xs font-bold text-black dark:text-white">
                  ₹{collectionStats.overdue.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          <div
            className={`grid grid-cols-3 gap-2 pt-3 border-t text-center ${dk ? "border-white/5" : "border-slate-100"}`}
          >
            <div>
              <p className="text-base font-black text-black dark:text-white">
                {collectionStats.paidCount}
              </p>
              <p className="text-[10px] font-bold text-black dark:text-white opacity-70">
                Paid
              </p>
            </div>
            <div>
              <p className="text-base font-black text-black dark:text-white">
                {collectionStats.pendCount}
              </p>
              <p className="text-[10px] font-bold text-black dark:text-white opacity-70">
                Pending
              </p>
            </div>
            <div>
              <p className="text-base font-black text-black dark:text-white">
                {collectionStats.overdueCount}
              </p>
              <p className="text-[10px] font-bold text-black dark:text-white opacity-70">
                Overdue
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions table: Filtered to Last 30 Days */}
      <div className={card}>
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${dk ? "border-white/5" : "border-slate-100"}`}
        >
          <div>
            <p className={`text-sm font-semibold ${ht}`}>Recent Transactions</p>
            <p className={`text-[11px] ${mt}`}>
              Transactions from the last 30 days ({recentTransactions.length}{" "}
              payments)
            </p>
          </div>
          <span
            className={`text-[11px] font-semibold ${dk ? "text-sky-400" : "text-sky-600"}`}
          >
            Last 30 Days
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                className={
                  dk ? "border-b border-white/5" : "border-b border-slate-100"
                }
              >
                {[
                  "ID",
                  "Seafarer",
                  "Course",
                  "Institute",
                  "Amount",
                  "Status",
                  "Date",
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
              {recentTransactions.map((p) => (
                <tr
                  key={p.id}
                  className={`transition-colors ${dk ? "hover:bg-white/[0.03]" : "hover:bg-slate-50"}`}
                >
                  <td className={`px-5 py-3.5 text-[11px] font-mono ${mt}`}>
                    {p.txnId || p.id}
                  </td>
                  <td className={`px-5 py-3.5 text-[13px] font-medium ${ht}`}>
                    {p.seafarerName}
                  </td>
                  <td
                    className={`px-5 py-3.5 text-[12px] max-w-[140px] truncate ${mt}`}
                  >
                    {p.course}
                  </td>
                  <td
                    className={`px-5 py-3.5 text-[11px] max-w-[130px] truncate ${mt}`}
                  >
                    {p.instituteName}
                  </td>
                  <td className={`px-5 py-3.5 text-[13px] font-bold ${ht}`}>
                    ₹{p.amount.toLocaleString("en-IN")}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`text-[11px] font-semibold ${statusCls(p.status)}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className={`px-5 py-3.5 text-[12px] ${mt}`}>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 shrink-0" />
                      <span>{formatDDMMYY(p.date)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {recentTransactions.length === 0 && (
          <div className={`text-center py-16 ${mt}`}>
            <CreditCard className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No transactions in the last 30 days</p>
          </div>
        )}
      </div>
    </div>
  );
}
