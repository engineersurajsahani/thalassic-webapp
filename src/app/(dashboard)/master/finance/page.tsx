"use client";

import React, { useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  Wallet, TrendingUp, ArrowUpRight, ArrowDownRight,
  IndianRupee, Download, Filter, Calendar,
  CheckCircle2, Clock, XCircle, CreditCard,
  Receipt, Building2,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const REVENUE_TREND = [
  { month: "Feb", revenue: 142000, expenses: 38000 },
  { month: "Mar", revenue: 198000, expenses: 42000 },
  { month: "Apr", revenue: 175000, expenses: 39000 },
  { month: "May", revenue: 234000, expenses: 51000 },
  { month: "Jun", revenue: 289000, expenses: 58000 },
  { month: "Jul", revenue: 388000, expenses: 67000 },
];

const REVENUE_BY_SOURCE = [
  { name: "Company Fees", value: 218000, color: "#0ea5e9" },
  { name: "Agent Comm",   value: 96000,  color: "#8b5cf6" },
  { name: "Course Fees",  value: 74000,  color: "#10b981" },
];

const TRANSACTIONS = [
  { id: "TXN001", from: "Maritime Solutions Pvt Ltd", type: "Course Fee",     amount: 24500, status: "completed", date: "02 Aug 2025" },
  { id: "TXN002", from: "Global Crew Agency",          type: "Agent Commission",amount: 8200, status: "completed", date: "01 Aug 2025" },
  { id: "TXN003", from: "Ocean Freight Carriers",       type: "Course Fee",     amount: 18900, status: "pending",   date: "01 Aug 2025" },
  { id: "TXN004", from: "Blue Waters Staffing",         type: "Agent Commission",amount: 11400, status: "completed", date: "31 Jul 2025" },
  { id: "TXN005", from: "SeaTech Maritime Corp",        type: "Course Fee",     amount: 31200, status: "completed", date: "30 Jul 2025" },
  { id: "TXN006", from: "Harbour Point Logistics",      type: "Registration",   amount: 5000,  status: "failed",    date: "29 Jul 2025" },
  { id: "TXN007", from: "Pacific Navigators",           type: "Course Fee",     amount: 14700, status: "pending",   date: "28 Jul 2025" },
  { id: "TXN008", from: "Tidal Maritime Services",      type: "Agent Commission",amount: 6800, status: "completed", date: "27 Jul 2025" },
];

const STATUS_CONFIG = {
  completed: { label: "Completed", icon: CheckCircle2, cls: "bg-emerald-500/15 text-emerald-400" },
  pending:   { label: "Pending",   icon: Clock,        cls: "bg-amber-500/15 text-amber-400"    },
  failed:    { label: "Failed",    icon: XCircle,      cls: "bg-red-500/15 text-red-400"        },
};

const fmt = (n: number) => `₹${(n/1000).toFixed(0)}K`;

export default function FinancePage() {
  const { theme } = useTheme();
  const dk = theme === "dark";
  const [tab, setTab] = useState<"all"|"completed"|"pending"|"failed">("all");

  const ht = dk ? "text-white" : "text-slate-800";
  const mt = dk ? "text-white/40" : "text-slate-400";
  const card = dk ? "bg-[#0f2035] border border-white/5 rounded-2xl" : "bg-white border border-slate-200 rounded-2xl shadow-sm";
  const dv = dk ? "divide-white/5" : "divide-slate-100";
  const rh = dk ? "hover:bg-white/3" : "hover:bg-slate-50/80";
  const thCls = dk ? "border-b border-white/5 text-white/25" : "border-b border-slate-100 text-slate-400";
  const ttStyle = {
    background: dk ? "#0d1f35" : "#fff",
    border: dk ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e2e8f0",
    borderRadius: "12px", fontSize: "12px",
    color: dk ? "rgba(255,255,255,0.8)" : "#1e293b",
  };

  const kpis = [
    { label: "Total Revenue",  value: "₹3.88L", sub: "This month",      color: "bg-sky-500/15",     ic: "text-sky-400",     Icon: IndianRupee  },
    { label: "Gross Profit",   value: "₹3.21L", sub: "After expenses",  color: "bg-emerald-500/15", ic: "text-emerald-400", Icon: TrendingUp   },
    { label: "Pending",        value: "₹33.6K", sub: "Awaiting payment",color: "bg-amber-500/15",   ic: "text-amber-400",   Icon: Clock        },
    { label: "Transactions",   value: TRANSACTIONS.length.toString(), sub: "This month", color: "bg-violet-500/15",  ic: "text-violet-400",  Icon: Receipt      },
  ];

  const filtered = tab === "all" ? TRANSACTIONS : TRANSACTIONS.filter(t => t.status === tab);
  const totalRevenue = REVENUE_TREND.reduce((s, r) => s + r.revenue, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-bold ${ht}`}>Finance</h1>
          <p className={`text-sm mt-0.5 ${mt}`}>Revenue, transactions &amp; financial overview</p>
        </div>
        <button className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border transition-colors ${dk ? "border-white/10 text-white/60 hover:bg-white/5" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className={`${card} p-5 flex items-center gap-4`}>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${k.color}`}>
              <k.Icon className={`w-5 h-5 ${k.ic}`} />
            </div>
            <div>
              <p className={`text-[22px] font-bold leading-tight ${ht}`}>{k.value}</p>
              <p className={`text-xs font-semibold mt-0.5 ${ht} opacity-75`}>{k.label}</p>
              <p className={`text-[11px] mt-1 ${mt}`}>{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Revenue vs Expenses Area Chart */}
        <div className={`${card} xl:col-span-2`}>
          <div className={`flex items-center justify-between px-6 py-4 border-b ${dk ? "border-white/5" : "border-slate-100"}`}>
            <div>
              <p className={`text-sm font-semibold ${ht}`}>Revenue vs Expenses</p>
              <p className={`text-[11px] mt-0.5 ${mt}`}>Last 6 months</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sky-500" /><span className={`text-[11px] ${mt}`}>Revenue</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-400" /><span className={`text-[11px] ${mt}`}>Expenses</span></div>
            </div>
          </div>
          <div className="px-4 py-4">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={REVENUE_TREND} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#0ea5e9" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}    />
                  </linearGradient>
                  <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#f87171" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={dk ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: dk ? "rgba(255,255,255,0.3)" : "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => `₹${v/1000}K`} tick={{ fontSize: 11, fill: dk ? "rgba(255,255,255,0.3)" : "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={ttStyle} formatter={(v: number) => [`₹${v.toLocaleString()}`, ""]} />
                <Area type="monotone" dataKey="revenue"  name="Revenue"  stroke="#0ea5e9" strokeWidth={2} fill="url(#gRev)" dot={{ r: 3, fill: "#0ea5e9", strokeWidth: 0 }} activeDot={{ r: 5 }} />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f87171" strokeWidth={2} fill="url(#gExp)" dot={{ r: 3, fill: "#f87171", strokeWidth: 0 }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Source */}
        <div className={card}>
          <div className={`px-6 py-4 border-b ${dk ? "border-white/5" : "border-slate-100"}`}>
            <p className={`text-sm font-semibold ${ht}`}>Revenue by Source</p>
            <p className={`text-[11px] mt-0.5 ${mt}`}>All time breakdown</p>
          </div>
          <div className="px-4 py-4">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={REVENUE_BY_SOURCE} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke={dk ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"} horizontal={false} />
                <XAxis type="number" tickFormatter={v => `₹${v/1000}K`} tick={{ fontSize: 10, fill: dk ? "rgba(255,255,255,0.3)" : "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: dk ? "rgba(255,255,255,0.4)" : "#64748b" }} axisLine={false} tickLine={false} width={90} />
                <Tooltip contentStyle={ttStyle} formatter={(v: number) => [`₹${v.toLocaleString()}`, "Revenue"]} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {REVENUE_BY_SOURCE.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 space-y-2">
              {REVENUE_BY_SOURCE.map(s => (
                <div key={s.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                    <span className={`text-[12px] ${mt}`}>{s.name}</span>
                  </div>
                  <span className={`text-[12px] font-bold ${ht}`}>{fmt(s.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className={card}>
        <div className={`flex items-center justify-between px-6 py-4 border-b ${dk ? "border-white/5" : "border-slate-100"}`}>
          <p className={`text-sm font-semibold ${ht}`}>Recent Transactions</p>
          <div className="flex items-center gap-2">
            {(["all","completed","pending","failed"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                  tab === t ? "bg-sky-500 text-white"
                  : dk ? "bg-white/5 text-white/50 hover:bg-white/10" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}>{t}</button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={thCls}>
                {["Transaction ID","From","Type","Amount","Status","Date"].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-[10px] font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${dv}`}>
              {filtered.map(t => {
                const S = STATUS_CONFIG[t.status as keyof typeof STATUS_CONFIG];
                const SIcon = S.icon;
                return (
                  <tr key={t.id} className={`${rh} transition-colors`}>
                    <td className={`px-6 py-4 text-[12px] font-mono font-semibold ${dk ? "text-sky-400" : "text-sky-600"}`}>{t.id}</td>
                    <td className={`px-6 py-4 text-[12px] font-medium ${ht}`}>{t.from}</td>
                    <td className={`px-6 py-4 text-[12px] ${mt}`}>{t.type}</td>
                    <td className={`px-6 py-4 text-[13px] font-bold ${ht}`}>₹{t.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${S.cls}`}>
                        <SIcon className="w-3 h-3" />{S.label}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-[12px] ${mt}`}>{t.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className={`px-6 py-3 border-t ${dk ? "border-white/5" : "border-slate-100"}`}>
          <p className={`text-[12px] ${mt}`}>Showing {filtered.length} of {TRANSACTIONS.length} transactions</p>
        </div>
      </div>
    </div>
  );
}
