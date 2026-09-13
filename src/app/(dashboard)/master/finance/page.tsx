"use client";

import React, { useState, useEffect } from "react";
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
import { api } from "@/lib/api";

type PaymentRecord = {
  id: string;
  seafarerName: string;
  indosNumber?: string;
  courseTitle: string;
  purchaseType: string;
  partnerName?: string;
  amountPayable: number;
  amountReceived: number;
  paymentStatus: string;
  paymentDate: string;
};

type OverviewData = {
  totalRevenueYear: number;
  revenueCurrentMonth: number;
  totalReceived: number;
  receivedFromPartners: number;
  pendingFromPartners: number;
  totalPaymentsCount: number;
  pendingPaymentsAmount: number;
  revenueTrend: Array<{
    month: string;
    directRevenue: number;
    partnerRevenue: number;
    total: number;
  }>;
  paymentStreams: Array<{ name: string; value: number; color: string }>;
};

export default function FinanceOverviewPage() {
  const { theme } = useTheme();
  const dk = theme === "dark";

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [overview, setOverview] = useState<OverviewData>({
    totalRevenueYear: 0,
    revenueCurrentMonth: 0,
    totalReceived: 0,
    receivedFromPartners: 0,
    pendingFromPartners: 0,
    totalPaymentsCount: 0,
    pendingPaymentsAmount: 0,
    revenueTrend: [
      { month: "Apr", directRevenue: 0, partnerRevenue: 0, total: 0 },
      { month: "May", directRevenue: 0, partnerRevenue: 0, total: 0 },
      { month: "Jun", directRevenue: 0, partnerRevenue: 0, total: 0 },
      { month: "Jul", directRevenue: 0, partnerRevenue: 0, total: 0 },
      { month: "Aug", directRevenue: 0, partnerRevenue: 0, total: 0 },
      { month: "Sep", directRevenue: 0, partnerRevenue: 0, total: 0 },
      { month: "Oct", directRevenue: 0, partnerRevenue: 0, total: 0 },
    ],
    paymentStreams: [
      { name: "Direct Seafarer Payments", value: 0, color: "#0ea5e9" },
      { name: "Partner Collections", value: 0, color: "#8b5cf6" },
      { name: "Corporate Invoices", value: 0, color: "#10b981" },
    ],
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [overviewRes, paymentsRes] = await Promise.all([
        api.get("/master/finance/overview"),
        api.get("/master/finance/payments"),
      ]);

      if (overviewRes.data) {
        setOverview(overviewRes.data);
      }

      if (Array.isArray(paymentsRes.data)) {
        const mapped: PaymentRecord[] = paymentsRes.data.map((p: any) => ({
          id:
            p.id ||
            p.transactionId ||
            `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
          seafarerName: p.seafarerName || p.customer_name || "Seafarer",
          indosNumber: p.indosNumber || p.indos_number || "IND-9942",
          courseTitle:
            p.courseName || p.courseTitle || "Maritime Course Module",
          purchaseType:
            p.registrationType === "Referral" || p.referringAgent
              ? "Partner"
              : "Direct",
          partnerName: p.referringAgent || p.agent_name || null,
          amountPayable: Number(
            p.courseFee || p.finalAmount || p.amountPayable || 0,
          ),
          amountReceived:
            p.paymentStatus === "Successful" || p.paymentStatus === "Paid"
              ? Number(p.finalAmount || p.courseFee || p.amountPayable || 0)
              : 0,
          paymentStatus:
            p.paymentStatus === "Successful" || p.paymentStatus === "Paid"
              ? "Received"
              : "Pending",
          paymentDate: p.transactionDate
            ? new Date(p.transactionDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "Today",
        }));
        setPayments(mapped);
      }
    } catch (e) {
      console.warn("Failed to load finance overview from database:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fmt = (n: number) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

  // Theme styling tokens
  const card = dk
    ? "bg-[#0c1a2e] border border-white/5 rounded-2xl"
    : "bg-white border border-slate-200 rounded-2xl shadow-sm";
  const ht = dk ? "text-white" : "text-slate-800";
  const mt = dk ? "text-white/40" : "text-slate-500";
  const dv = dk ? "divide-white/5" : "divide-slate-100";
  const rh = dk ? "hover:bg-white/3" : "hover:bg-slate-50/80";
  const thCls = dk
    ? "border-b border-white/5 text-slate-400"
    : "border-b border-slate-100 text-slate-600 font-semibold";

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
            Live financial position, payment flows, partner settlements, and
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

      {/* Finance Navigation Tabs */}
      <FinanceTabs />

      {/* Finance Overview Primary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {[
          {
            label: "Total Revenue (Year)",
            value: fmt(overview.totalRevenueYear),
            sub: "FY 2026-27",
            Icon: Wallet,
            c: "text-sky-400",
            bg: dk ? "bg-sky-500/15" : "bg-sky-50",
          },
          {
            label: "Revenue (Current Month)",
            value: fmt(overview.revenueCurrentMonth),
            sub: "Current Billing Cycle",
            Icon: TrendingUp,
            c: "text-indigo-400",
            bg: dk ? "bg-indigo-500/15" : "bg-indigo-50",
          },
          {
            label: "Total Amount Received",
            value: fmt(overview.totalReceived),
            sub: "Settled in bank",
            Icon: CheckCircle2,
            c: "text-emerald-400",
            bg: dk ? "bg-emerald-500/15" : "bg-emerald-50",
          },
          {
            label: "Received from Partners",
            value: fmt(overview.receivedFromPartners),
            sub: "From RPSL agencies",
            Icon: Handshake,
            c: "text-violet-400",
            bg: dk ? "bg-violet-500/15" : "bg-violet-50",
          },
          {
            label: "Pending from Partners",
            value: fmt(overview.pendingFromPartners),
            sub: "Action required",
            Icon: Clock,
            c: "text-amber-400",
            bg: dk ? "bg-amber-500/15" : "bg-amber-50",
          },
          {
            label: "Total Transactions",
            value: overview.totalPaymentsCount || payments.length,
            sub: "Recorded payments",
            Icon: CreditCard,
            c: "text-blue-400",
            bg: dk ? "bg-blue-500/15" : "bg-blue-50",
          },
          {
            label: "Pending Payments",
            value: fmt(overview.pendingPaymentsAmount),
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
                {loading ? "..." : k.value}
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
            className={`flex items-center justify-between px-6 py-4 border-b ${
              dk ? "border-white/5" : "border-slate-100"
            }`}
          >
            <div>
              <p className={`text-sm font-semibold ${ht}`}>
                Revenue Collection Breakdown
              </p>
              <p className={`text-[11px] mt-0.5 ${mt}`}>
                Direct Seafarer Payments vs Partner Collections (Monthly)
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
                data={overview.revenueTrend}
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
                  tickFormatter={(v) => `₹${v >= 1000 ? `${v / 1000}K` : v}`}
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

        {/* Revenue by Stream Bar */}
        <div className={card}>
          <div
            className={`px-6 py-4 border-b ${
              dk ? "border-white/5" : "border-slate-100"
            }`}
          >
            <p className={`text-sm font-semibold ${ht}`}>Revenue by Stream</p>
            <p className={`text-[11px] mt-0.5 ${mt}`}>
              Configured Hari Om revenue sources
            </p>
          </div>
          <div className="px-4 py-4 space-y-4">
            <ResponsiveContainer width="100%" height={160}>
              <BarChart
                data={overview.paymentStreams}
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
                  tickFormatter={(v) =>
                    `₹${v >= 100000 ? `${v / 100000}L` : v}`
                  }
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
                    `₹${Number(v || 0).toLocaleString("en-IN")}`,
                    "Volume",
                  ]}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {overview.paymentStreams.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="space-y-2 pt-2 border-t border-white/5">
              {overview.paymentStreams.map((s) => (
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
          className={`flex items-center justify-between px-6 py-4 border-b ${
            dk ? "border-white/5" : "border-slate-100"
          }`}
        >
          <div>
            <p className={`text-sm font-semibold ${ht}`}>
              Recent Platform Transactions
            </p>
            <p className={`text-[11px] mt-0.5 ${mt}`}>
              Latest payments with purchase source identification
            </p>
          </div>
          <Link
            href="/master/finance/payments"
            className="flex items-center gap-1.5 text-xs font-semibold text-sky-500 hover:text-sky-400"
          >
            View All Payments <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-fixed min-w-[960px] text-sm">
            <colgroup>
              <col className="w-[11%]" />
              <col className="w-[16%]" />
              <col className="w-[20%]" />
              <col className="w-[8%]" />
              <col className="w-[14%]" />
              <col className="w-[11%]" />
              <col className="w-[11%]" />
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
                  Amount
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
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    Loading platform transactions...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    No transactions recorded in database.
                  </td>
                </tr>
              ) : (
                payments.slice(0, rowsPerPage).map((t) => (
                  <tr key={t.id} className={`${rh} transition-colors`}>
                    <td
                      className={`pl-6 pr-3 py-4 text-[12px] font-mono font-semibold truncate ${
                        dk ? "text-white" : "text-slate-800"
                      }`}
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
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          t.purchaseType === "Partner"
                            ? "bg-violet-500/15 text-violet-400"
                            : "bg-sky-500/15 text-sky-400"
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
                      ₹{t.amountPayable.toLocaleString("en-IN")}
                    </td>
                    <td className="px-3 py-4">
                      <span
                        className={`text-[11px] font-semibold inline-flex items-center gap-1 ${
                          t.paymentStatus === "Received"
                            ? "text-emerald-500 dark:text-emerald-400"
                            : "text-amber-500 dark:text-amber-400"
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        {t.paymentStatus}
                      </span>
                    </td>
                    <td
                      className={`pl-3 pr-6 py-4 text-right text-[11px] ${mt} whitespace-nowrap`}
                    >
                      {t.paymentDate}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div
          className={`px-6 py-3.5 border-t ${
            dk ? "border-white/5" : "border-slate-100"
          } flex flex-wrap items-center justify-between gap-4 text-xs ${mt}`}
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
              </select>
              <ChevronDown
                className={`w-3.5 h-3.5 absolute right-2 pointer-events-none ${mt}`}
              />
            </div>
          </div>
          <span>Showing {payments.length} total database records</span>
        </div>
      </div>
    </div>
  );
}
