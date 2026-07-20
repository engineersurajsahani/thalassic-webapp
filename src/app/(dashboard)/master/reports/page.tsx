"use client";

import React from "react";
import { useTheme } from "@/providers/theme-provider";
import { TrendingUp, TrendingDown, Download, BarChart3, Users, BookOpen, ShoppingCart } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const monthlyRevenue = [
  { month: "Jan", revenue: 180000, target: 200000 },
  { month: "Feb", revenue: 210000, target: 200000 },
  { month: "Mar", revenue: 195000, target: 210000 },
  { month: "Apr", revenue: 240000, target: 220000 },
  { month: "May", revenue: 220000, target: 230000 },
  { month: "Jun", revenue: 280000, target: 250000 },
  { month: "Jul", revenue: 310000, target: 270000 },
  { month: "Aug", revenue: 295000, target: 280000 },
  { month: "Sep", revenue: 340000, target: 300000 },
  { month: "Oct", revenue: 320000, target: 310000 },
];

const userGrowth = [
  { month: "Jan", seafarers: 210 }, { month: "Feb", seafarers: 280 },
  { month: "Mar", seafarers: 320 }, { month: "Apr", seafarers: 390 },
  { month: "May", seafarers: 450 }, { month: "Jun", seafarers: 520 },
  { month: "Jul", seafarers: 610 }, { month: "Aug", seafarers: 680 },
  { month: "Sep", seafarers: 750 }, { month: "Oct", seafarers: 840 },
];

const topCourses = [
  { name: "STCW Basic Safety", completions: 387, revenue: "₹19.3L" },
  { name: "Medical First Aid", completions: 298, revenue: "₹13.4L" },
  { name: "Advanced Fire Fighting", completions: 241, revenue: "₹17.3L" },
  { name: "Ship Navigation & Radar", completions: 178, revenue: "₹12.1L" },
  { name: "Tanker Cargo Ops", completions: 91, revenue: "₹8.5L" },
];

export default function ReportsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const bg = isDark ? "bg-[#0d1f35] border border-white/6" : "bg-white border border-slate-200";
  const headText = isDark ? "text-white/80" : "text-slate-800";
  const mutedText = isDark ? "text-white/35" : "text-slate-400";
  const grid = isDark ? "#1e3a5f" : "#f1f5f9";
  const axis = isDark ? "#4a6d8c" : "#94a3b8";
  const divider = isDark ? "divide-white/5" : "divide-slate-100";
  const border = isDark ? "border-white/5" : "border-slate-100";

  const kpis = [
    { label: "Total Revenue", value: "₹24.5L", delta: "+15%", up: true, icon: TrendingUp, color: "text-emerald-500", bg: isDark ? "bg-emerald-500/10" : "bg-emerald-50" },
    { label: "New Seafarers", value: "840", delta: "+22%", up: true, icon: Users, color: "text-indigo-500", bg: isDark ? "bg-indigo-500/10" : "bg-indigo-50" },
    { label: "Course Enrolments", value: "5,234", delta: "+8%", up: true, icon: BookOpen, color: "text-amber-500", bg: isDark ? "bg-amber-500/10" : "bg-amber-50" },
    { label: "Avg. Order Value", value: "₹4,680", delta: "-3%", up: false, icon: ShoppingCart, color: "text-red-400", bg: isDark ? "bg-red-500/10" : "bg-red-50" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-bold ${headText}`}>Reports & Analytics</h1>
          <p className={`text-sm mt-0.5 ${mutedText}`}>Jan – Oct 2025</p>
        </div>
        <button className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border transition-colors ${isDark ? "border-white/10 text-white/60 hover:bg-white/5" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          const D = k.up ? TrendingUp : TrendingDown;
          return (
            <div key={k.label} className={`${bg} rounded-xl px-5 py-4`}>
              <div className={`w-9 h-9 rounded-lg ${k.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-4 h-4 ${k.color}`} />
              </div>
              <p className={`text-xl font-bold ${headText}`}>{k.value}</p>
              <p className={`text-xs mt-0.5 ${mutedText}`}>{k.label}</p>
              <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${k.up ? "text-emerald-500" : "text-red-400"}`}>
                <D className="w-3 h-3" />{k.delta} vs last year
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className={`${bg} rounded-2xl overflow-hidden`}>
          <div className={`flex items-center justify-between px-6 py-4 border-b ${border}`}>
            <p className={`text-sm font-semibold ${headText}`}>Revenue vs Target</p>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={monthlyRevenue}>
                <defs>
                  <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="tgtG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke={grid} strokeDasharray="4 0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: axis }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: axis }} axisLine={false} tickLine={false} width={46} tickFormatter={(v) => `${v / 1000}K`} />
                <Tooltip formatter={(v: number) => `₹${(v / 1000).toFixed(0)}K`} contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#6366f1" strokeWidth={2} fill="url(#revG)" />
                <Area type="monotone" dataKey="target" name="Target" stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 3" fill="url(#tgtG)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${bg} rounded-2xl overflow-hidden`}>
          <div className={`flex items-center justify-between px-6 py-4 border-b ${border}`}>
            <p className={`text-sm font-semibold ${headText}`}>Seafarer Growth</p>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={userGrowth} barSize={14}>
                <CartesianGrid vertical={false} stroke={grid} strokeDasharray="4 0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: axis }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: axis }} axisLine={false} tickLine={false} width={36} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                <Bar dataKey="seafarers" name="New Seafarers" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top courses table */}
      <div className={`${bg} rounded-2xl overflow-hidden`}>
        <div className={`px-6 py-4 border-b ${border}`}>
          <p className={`text-sm font-semibold ${headText}`}>Top Performing Courses</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className={`border-b ${border}`}>
              {["Course", "Completions", "Revenue"].map(h => (
                <th key={h} className={`text-left px-6 py-3 text-[11px] font-semibold uppercase tracking-wider ${mutedText}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${divider}`}>
            {topCourses.map((c, i) => (
              <tr key={c.name} className={isDark ? "hover:bg-white/[0.03]" : "hover:bg-slate-50"}>
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${i === 0 ? "bg-amber-400 text-white" : isDark ? "bg-white/8 text-white/40" : "bg-slate-100 text-slate-500"}`}>{i + 1}</span>
                    <span className={`text-[13px] font-medium ${headText}`}>{c.name}</span>
                  </div>
                </td>
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`h-1.5 rounded-full overflow-hidden w-24 ${isDark ? "bg-white/8" : "bg-slate-100"}`}>
                      <div className="h-full rounded-full bg-indigo-500" style={{ width: `${(c.completions / 400) * 100}%` }} />
                    </div>
                    <span className={`text-[13px] font-semibold ${headText}`}>{c.completions}</span>
                  </div>
                </td>
                <td className={`px-6 py-3.5 text-[13px] font-semibold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>{c.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
