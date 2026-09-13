"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/providers/theme-provider";
import {
  TrendingUp, ArrowUpRight, ArrowDownRight,
  Wallet, CreditCard, Clock, CheckCircle2,
  XCircle, Filter, Download, ChevronDown, Handshake,
  Calendar, Layers, ShieldCheck, Building2,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie,
} from "recharts";
import FinanceTabs from "@/components/master/FinanceTabs";
import {
  MOCK_PAYMENTS,
  MOCK_PARTNERS,
  MOCK_PARTNER_SETTLEMENTS,
  MOCK_INSTITUTE_FINANCE,
} from "@/data/master-portal-mock";

// Monthly Trend data
const REVENUE_TREND = [
  { month: "Mar", directRevenue: 120000, partnerRevenue: 190000, total: 310000 },
  { month: "Apr", directRevenue: 145000, partnerRevenue: 210000, total: 355000 },
  { month: "May", directRevenue: 130000, partnerRevenue: 240000, total: 370000 },
  { month: "Jun", directRevenue: 160000, partnerRevenue: 280000, total: 440000 },
  { month: "Jul", directRevenue: 175000, partnerRevenue: 310000, total: 485000 },
  { month: "Aug", directRevenue: 190000, partnerRevenue: 340000, total: 530000 },
  { month: "Sep", directRevenue: 155000, partnerRevenue: 233000, total: 388000 },
];

const PAYMENT_STREAMS = [
  { name: "Direct Course Sales", value: 1075000, color: "#0ea5e9" },
  { name: "Partner Collections",  value: 1800000, color: "#8b5cf6" },
  { name: "Institute Billable",   value: 580000,  color: "#10b981" },
];

export default function FinanceOverviewPage() {
  const { theme } = useTheme();
  const dk = theme === "dark";
  const [dateFilter, setDateFilter] = useState("Current Year (2026)");

  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  // Theme styling tokens
  const card   = dk ? "bg-[#0c1a2e] border border-white/5 rounded-2xl" : "bg-white border border-slate-200 rounded-2xl shadow-sm";
  const ht     = dk ? "text-white" : "text-slate-800";
  const mt     = dk ? "text-white/40" : "text-slate-400";
  const dv     = dk ? "divide-white/5" : "divide-slate-100";
  const rh     = dk ? "hover:bg-white/3" : "hover:bg-slate-50/80";
  const thCls  = dk ? "border-b border-white/5 text-white/30" : "border-b border-slate-100 text-slate-400";

  // Aggregated figures (PRD 2.2)
  const totalRevenueYear        = 3455000;
  const revenueCurrentMonth     = 388000;
  const totalReceived           = 3250000;
  const receivedFromPartners    = 1605000;
  const pendingFromPartners     = 205000;
  const totalPaymentsCount      = MOCK_PAYMENTS.length;
  const pendingPaymentsAmount   = MOCK_PAYMENTS.filter(p => p.paymentStatus === "Pending").reduce((acc, p) => acc + p.amountPayable, 0);

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
            Financial position, payment flows, partner settlements, and institute financials
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert("Downloading financial ledger snapshot...")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors ${
              dk ? "border-white/10 text-white/70 hover:bg-white/5" : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Download className="w-3.5 h-3.5" /> Export Summary
          </button>
        </div>
      </div>

      {/* PRD 2.1 Secondary Navigation Tabs */}
      <FinanceTabs />

      {/* Scope Disclaimer & Partner Settlement Mechanics */}
      {/* PRD 2.2 Finance Overview Primary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {[
          { label: "Total Revenue (Year)",    value: fmt(totalRevenueYear),       sub: "FY 2026-27",            Icon: Wallet,       c: "text-sky-400",    bg: dk ? "bg-sky-500/15" : "bg-sky-50" },
          { label: "Revenue (Current Month)", value: fmt(revenueCurrentMonth),    sub: "September 2026",        Icon: TrendingUp,   c: "text-indigo-400", bg: dk ? "bg-indigo-500/15" : "bg-indigo-50" },
          { label: "Total Amount Received",   value: fmt(totalReceived),          sub: "Settled in bank",       Icon: CheckCircle2, c: "text-emerald-400",bg: dk ? "bg-emerald-500/15" : "bg-emerald-50" },
          { label: "Received from Partners",  value: fmt(receivedFromPartners),   sub: "From RPSL agencies",    Icon: Handshake,    c: "text-violet-400", bg: dk ? "bg-violet-500/15" : "bg-violet-50" },
          { label: "Pending from Partners",   value: fmt(pendingFromPartners),    sub: "Action required",       Icon: Clock,        c: "text-amber-400",  bg: dk ? "bg-amber-500/15" : "bg-amber-50" },
          { label: "Total Transactions",      value: totalPaymentsCount,          sub: "Recorded payments",     Icon: CreditCard,   c: "text-blue-400",   bg: dk ? "bg-blue-500/15" : "bg-blue-50" },
          { label: "Pending Payments",        value: fmt(pendingPaymentsAmount),  sub: "Awaiting confirmation", Icon: ArrowDownRight, c: "text-rose-400", bg: dk ? "bg-rose-500/15" : "bg-rose-50" },
        ].map(k => (
          <div key={k.label} className={`${card} p-3.5 flex flex-col justify-between transition-all hover:scale-[1.01]`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-semibold truncate ${ht} opacity-75`}>{k.label}</span>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${k.bg}`}>
                <k.Icon className={`w-3.5 h-3.5 ${k.c}`} />
              </div>
            </div>
            <div>
              <p className={`text-base font-bold leading-tight ${ht}`}>{k.value}</p>
              <p className={`text-[10px] truncate mt-0.5 ${mt}`}>{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Revenue Trend: Direct vs Partner Collections */}
        <div className={`${card} xl:col-span-2`}>
          <div className={`flex items-center justify-between px-6 py-4 border-b ${dk ? "border-white/5" : "border-slate-100"}`}>
            <div>
              <p className={`text-sm font-semibold ${ht}`}>Revenue Collection Breakdown</p>
              <p className={`text-[11px] mt-0.5 ${mt}`}>Direct Seafarer Payments vs Partner Collections (Last 7 Months)</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                <span className={`text-[11px] ${mt}`}>Partner Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                <span className={`text-[11px] ${mt}`}>Direct Revenue</span>
              </div>
            </div>
          </div>
          <div className="px-4 py-4">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={REVENUE_TREND} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gPrt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gDir" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={dk ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: dk ? "rgba(255,255,255,0.4)" : "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => `₹${v/1000}K`} tick={{ fontSize: 11, fill: dk ? "rgba(255,255,255,0.4)" : "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={ttStyle} formatter={(v: any, name: any) => [`₹${Number(v || 0).toLocaleString()}`, String(name || "")] as any} />
                <Area type="monotone" dataKey="partnerRevenue" name="Partner Revenue" stroke="#8b5cf6" strokeWidth={2} fill="url(#gPrt)" />
                <Area type="monotone" dataKey="directRevenue"  name="Direct Revenue"  stroke="#0ea5e9" strokeWidth={2} fill="url(#gDir)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Stream Donut / Bar */}
        <div className={card}>
          <div className={`px-6 py-4 border-b ${dk ? "border-white/5" : "border-slate-100"}`}>
            <p className={`text-sm font-semibold ${ht}`}>Revenue by Stream</p>
            <p className={`text-[11px] mt-0.5 ${mt}`}>Configured Hari Om course shares</p>
          </div>
          <div className="px-4 py-4 space-y-4">
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={PAYMENT_STREAMS} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }} barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke={dk ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"} horizontal={false} />
                <XAxis type="number" tickFormatter={v => `₹${v/100000}L`} tick={{ fontSize: 10, fill: dk ? "rgba(255,255,255,0.3)" : "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: dk ? "rgba(255,255,255,0.5)" : "#64748b" }} axisLine={false} tickLine={false} width={100} />
                <Tooltip contentStyle={ttStyle} formatter={(v: any) => [`₹${Number(v || 0).toLocaleString()}`, "Volume"] as any} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {PAYMENT_STREAMS.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="space-y-2 pt-2 border-t border-white/5">
              {PAYMENT_STREAMS.map(s => (
                <div key={s.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
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
        <div className={`flex items-center justify-between px-6 py-4 border-b ${dk ? "border-white/5" : "border-slate-100"}`}>
          <div>
            <p className={`text-sm font-semibold ${ht}`}>Recent Platform Transactions (PRD §2.3)</p>
            <p className={`text-[11px] mt-0.5 ${mt}`}>Showing latest payments with purchase source identification</p>
          </div>
          <Link
            href="/master/finance/payments"
            className="flex items-center gap-1.5 text-xs font-semibold text-sky-500 hover:text-sky-400"
          >
            View All Payments <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={thCls}>
                {["Payment ID", "Seafarer", "Course", "Type", "Partner", "Amount Payable", "Amount Received", "Status", "Date"].map(h => (
                  <th key={h} className="text-left px-6 py-3.5 text-[10px] font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${dv}`}>
              {MOCK_PAYMENTS.slice(0, 5).map(t => (
                <tr key={t.id} className={`${rh} transition-colors`}>
                  <td className={`px-6 py-4 text-[12px] font-mono font-semibold ${dk ? "text-sky-400" : "text-sky-600"}`}>{t.id}</td>
                  <td className="px-6 py-4">
                    <p className={`text-[12px] font-semibold ${ht}`}>{t.seafarerName}</p>
                    <p className={`text-[10px] font-mono ${mt}`}>INDOS: {t.indosNumber}</p>
                  </td>
                  <td className={`px-6 py-4 text-[12px] ${ht}`}>{t.courseTitle}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      t.purchaseType === "Partner"
                        ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
                        : t.purchaseType === "Institute Billable"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-sky-500/10 text-sky-400 border-sky-500/20"
                    }`}>
                      {t.purchaseType}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-[12px] ${mt}`}>{t.partnerName}</td>
                  <td className={`px-6 py-4 text-[12px] font-bold ${ht}`}>₹{t.amountPayable.toLocaleString()}</td>
                  <td className={`px-6 py-4 text-[12px] font-bold ${t.amountReceived === t.amountPayable ? "text-emerald-400" : "text-amber-400"}`}>
                    ₹{t.amountReceived.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      t.paymentStatus === "Received"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}>
                      {t.paymentStatus}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-[11px] ${mt}`}>{t.paymentDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
