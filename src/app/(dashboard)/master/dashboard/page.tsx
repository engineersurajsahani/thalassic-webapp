"use client";

import React, { useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  Users, BookOpen, ShoppingCart, TrendingUp, TrendingDown,
  MoreHorizontal, ShieldCheck, Anchor, GraduationCap, Globe, ArrowUpRight,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area,
} from "recharts";

// ── Data ──────────────────────────────────────────────────────────────────────

const enrolmentTrend = [
  { month: "Feb", enrolments: 320, completions: 210 },
  { month: "Mar", enrolments: 410, completions: 290 },
  { month: "Apr", enrolments: 380, completions: 260 },
  { month: "May", enrolments: 510, completions: 380 },
  { month: "Jun", enrolments: 490, completions: 340 },
  { month: "Jul", enrolments: 620, completions: 440 },
  { month: "Aug", enrolments: 700, completions: 520 },
  { month: "Sep", enrolments: 660, completions: 490 },
  { month: "Oct", enrolments: 810, completions: 600 },
];

const revenueData = [
  { month: "Jan", revenue: 180000 },
  { month: "Feb", revenue: 210000 },
  { month: "Mar", revenue: 195000 },
  { month: "Apr", revenue: 240000 },
  { month: "May", revenue: 220000 },
  { month: "Jun", revenue: 280000 },
  { month: "Jul", revenue: 310000 },
  { month: "Aug", revenue: 295000 },
  { month: "Sep", revenue: 340000 },
  { month: "Oct", revenue: 320000 },
];

const divisions = [
  { name: "Safety Training",  icon: ShieldCheck,    color: "#6366f1", count: 412 },
  { name: "Navigation",       icon: Anchor,          color: "#10b981", count: 289 },
  { name: "Technical Ops",    icon: GraduationCap,   color: "#f59e0b", count: 194 },
  { name: "Maritime Law",     icon: Globe,           color: "#ef4444", count: 137 },
  { name: "Deck Operations",  icon: BookOpen,        color: "#8b5cf6", count: 98  },
];

const registrations = [
  { id: "SEA-4821", name: "Raj Kumar",    rank: "Chief Officer",    date: "Today, 9:14 AM",  status: "Active"   },
  { id: "SEA-4820", name: "Priya Singh",  rank: "Deck Cadet",       date: "Today, 7:02 AM",  status: "Pending"  },
  { id: "SEA-4819", name: "Amit Patel",   rank: "Second Engineer",  date: "Yesterday",        status: "Active"   },
  { id: "SEA-4818", name: "Suresh Verma", rank: "AB Seaman",        date: "Yesterday",        status: "Active"   },
  { id: "SEA-4817", name: "Deepa Nair",   rank: "Bosun",            date: "2 days ago",       status: "Inactive" },
];

const purchases = [
  { user: "Raj Kumar",    course: "STCW Basic Safety",      amount: "₹5,000", date: "Today",       method: "UPI"        },
  { user: "Priya Singh",  course: "Basic Safety Training",  amount: "₹3,500", date: "Today",       method: "Card"       },
  { user: "Amit Patel",   course: "Advanced Fire Fighting", amount: "₹7,200", date: "Yesterday",   method: "Net Banking" },
  { user: "Karan Mehta",  course: "Ship Navigation",        amount: "₹6,800", date: "Yesterday",   method: "UPI"        },
  { user: "Suresh Verma", course: "Tanker Cargo Ops",       amount: "₹9,400", date: "2 days ago",  method: "Card"       },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function DonutRing({
  value, total, color, label, isDark,
}: { value: number; total: number; color: string; label: string; isDark: boolean }) {
  const r = 34;
  const circ = 2 * Math.PI * r;
  const dash = (value / total) * circ;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-[88px] h-[88px]">
        <svg viewBox="0 0 88 88" className="w-full h-full -rotate-90">
          <circle cx="44" cy="44" r={r} fill="none"
            stroke={isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9"} strokeWidth="9" />
          <circle cx="44" cy="44" r={r} fill="none"
            stroke={color} strokeWidth="9"
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xl font-bold"
          style={{ color }}>
          {value}
        </span>
      </div>
      <p className={`text-[11px] font-semibold text-center ${isDark ? "text-white/40" : "text-slate-500"}`}>{label}</p>
    </div>
  );
}

function CardHeader({ title, isDark, action }: { title: string; isDark: boolean; action?: React.ReactNode }) {
  return (
    <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? "border-white/5" : "border-slate-100"}`}>
      <p className={`text-sm font-semibold ${isDark ? "text-white/80" : "text-slate-800"}`}>{title}</p>
      {action ?? <MoreHorizontal className={`w-4 h-4 ${isDark ? "text-white/20" : "text-slate-300"}`} />}
    </div>
  );
}

const statusLight: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Inactive: "bg-slate-100 text-slate-500",
};
const statusDark: Record<string, string> = {
  Active: "bg-emerald-500/10 text-emerald-400",
  Pending: "bg-amber-500/10 text-amber-400",
  Inactive: "bg-white/5 text-white/30",
};

const avatarBg = ["bg-indigo-500","bg-sky-500","bg-amber-500","bg-emerald-500","bg-violet-500"];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MasterDashboard() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [range, setRange] = useState<"monthly" | "weekly">("monthly");

  const card = `rounded-2xl overflow-hidden ${isDark ? "bg-[#0d1f35] border border-white/[0.06]" : "bg-white border border-slate-200 shadow-sm"}`;
  const ht = isDark ? "text-white/80" : "text-slate-800";
  const mt = isDark ? "text-white/35" : "text-slate-400";
  const gl = isDark ? "#1a3352" : "#e2e8f0";
  const ax = isDark ? "#3d6080" : "#94a3b8";
  const dv = isDark ? "divide-white/[0.05]" : "divide-slate-100";
  const rh = isDark ? "hover:bg-white/[0.03]" : "hover:bg-slate-50";
  const borderB = isDark ? "border-white/5" : "border-slate-100";

  return (
    <div className="space-y-5">

      {/* ── 1. KPI strip ──────────────────────────────────────────────── */}
      <div className={card}>
        <div className={`grid grid-cols-2 xl:grid-cols-4 divide-x divide-y xl:divide-y-0 ${isDark ? "divide-white/[0.05]" : "divide-slate-100"}`}>
          {[
            { label: "Registered Seafarers", value: "2,847", delta: "+12%",   up: true,  icon: Users,        iconBg: isDark ? "bg-indigo-500/15" : "bg-indigo-50",  iconColor: "#6366f1" },
            { label: "Active Courses",        value: "48",    delta: "+3 new", up: true,  icon: BookOpen,     iconBg: isDark ? "bg-emerald-500/15" : "bg-emerald-50", iconColor: "#10b981" },
            { label: "Course Purchases",      value: "5,234", delta: "+8%",   up: true,  icon: ShoppingCart, iconBg: isDark ? "bg-amber-500/15" : "bg-amber-50",    iconColor: "#f59e0b" },
            { label: "Total Revenue",         value: "₹24.5L",delta: "−3%",   up: false, icon: TrendingUp,   iconBg: isDark ? "bg-red-500/15" : "bg-red-50",        iconColor: "#ef4444" },
          ].map((s, i) => {
            const Icon = s.icon;
            const D = s.up ? TrendingUp : TrendingDown;
            return (
              <div key={i} className="flex items-center gap-4 px-6 py-5">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${s.iconBg}`}>
                  <Icon className="w-5 h-5" style={{ color: s.iconColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[22px] font-bold leading-tight tracking-tight ${ht}`}>{s.value}</p>
                  <p className={`text-xs mt-0.5 truncate ${mt}`}>{s.label}</p>
                </div>
                <div className="text-right shrink-0 hidden sm:block">
                  <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${s.up ? "text-emerald-500" : "text-red-500"}`}>
                    <D className="w-3 h-3" />{s.delta}
                  </span>
                  <p className={`text-[10px] mt-0.5 ${mt}`}>vs last month</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 2. Bar chart (2/3) + Donut grid (1/3) ─────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Bar chart */}
        <div className={`${card} xl:col-span-2`}>
          <CardHeader title="Enrolments vs. Completions" isDark={isDark} action={
            <div className={`flex rounded-lg overflow-hidden border text-[11px] font-medium ${isDark ? "border-white/8" : "border-slate-200"}`}>
              {(["monthly","weekly"] as const).map((r) => (
                <button key={r} onClick={() => setRange(r)}
                  className={`px-3 py-1 transition-colors capitalize ${range === r
                    ? "bg-indigo-500 text-white"
                    : isDark ? "text-white/35 hover:text-white/60" : "text-slate-400 hover:text-slate-600"}`}>
                  {r}
                </button>
              ))}
            </div>
          } />
          <div className="px-5 pt-4 pb-3">
            <div className="flex items-center gap-5 mb-4">
              {[["#6366f1","Enrolments"],["#34d399","Completions"]].map(([c,l]) => (
                <span key={l} className="flex items-center gap-1.5 text-[11px]" style={{ color: isDark ? "#6b7f93" : "#94a3b8" }}>
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} />{l}
                </span>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={enrolmentTrend} barSize={11} barGap={4} barCategoryGap="30%">
                <CartesianGrid vertical={false} stroke={gl} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: ax }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: ax }} axisLine={false} tickLine={false} width={34} />
                <Tooltip
                  cursor={{ fill: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)" }}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                />
                <Bar dataKey="enrolments" name="Enrolments" fill="#6366f1" radius={[3,3,0,0]} />
                <Bar dataKey="completions" name="Completions" fill="#34d399" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut grid */}
        <div className={card}>
          <CardHeader title="Courses by Category" isDark={isDark} />
          <div className="px-6 pt-5 pb-6">
            <div className="grid grid-cols-2 gap-6">
              <DonutRing value={117} total={200} color="#8b5cf6" label="Bed Availability" isDark={isDark} />
              <DonutRing value={86}  total={160} color="#ef4444" label="Male Seafarers"   isDark={isDark} />
              <DonutRing value={70}  total={140} color="#f59e0b" label="Female Seafarers" isDark={isDark} />
              <DonutRing value={38}  total={80}  color="#10b981" label="Completions"      isDark={isDark} />
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Area chart (3/5) + Division table (2/5) ────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

        {/* Area chart */}
        <div className={`${card} xl:col-span-3`}>
          <CardHeader title="Revenue Over Time" isDark={isDark} action={
            <p className={`text-xs ${mt}`}>Jan – Oct 2025</p>
          } />
          <div className="px-5 pt-4 pb-3">
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke={gl} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: ax }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: ax }} axisLine={false} tickLine={false} width={46}
                  tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
                <Tooltip
                  formatter={(v: number) => [`₹${(v/1000).toFixed(0)}K`, "Revenue"]}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2.5} fill="url(#rg)" dot={false} activeDot={{ r: 4, fill: "#f59e0b" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Division table */}
        <div className={`${card} xl:col-span-2`}>
          <CardHeader title="Enrolments by Division" isDark={isDark} />
          <div className="px-2 py-2">
            <div className={`grid grid-cols-[1fr_auto] px-4 pb-2 mb-1 border-b text-[10px] font-semibold uppercase tracking-wider ${isDark ? "border-white/5 text-white/20" : "border-slate-100 text-slate-400"}`}>
              <span>Division</span><span>Enrolled</span>
            </div>
            <div className={`divide-y ${dv}`}>
              {divisions.map((d) => {
                const Icon = d.icon;
                const max = divisions[0].count;
                return (
                  <div key={d.name} className={`grid grid-cols-[1fr_auto] items-center px-4 py-3 gap-3 ${rh} transition-colors`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: `${d.color}18` }}>
                        <Icon className="w-3.5 h-3.5" style={{ color: d.color }} />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-[13px] font-medium truncate ${isDark ? "text-white/70" : "text-slate-700"}`}>{d.name}</p>
                        <div className={`mt-1.5 h-1 rounded-full overflow-hidden w-16 ${isDark ? "bg-white/8" : "bg-slate-100"}`}>
                          <div className="h-full rounded-full transition-all"
                            style={{ width: `${(d.count / max) * 100}%`, background: d.color }} />
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-bold tabular-nums" style={{ color: d.color }}>{d.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. Registrations (3/5) + Purchases (2/5) ──────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

        {/* Recent registrations */}
        <div className={`${card} xl:col-span-3`}>
          <CardHeader title="Recent Registrations" isDark={isDark} action={
            <button className={`flex items-center gap-1 text-xs font-medium transition-colors ${isDark ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-700"}`}>
              View all <ArrowUpRight className="w-3 h-3" />
            </button>
          } />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={isDark ? "border-b border-white/5" : "border-b border-slate-100"}>
                  {["Name", "Rank", "Registered", "Status"].map(h => (
                    <th key={h} className={`text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-wider ${mt}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className={`divide-y ${dv}`}>
                {registrations.map((r, i) => (
                  <tr key={r.id} className={`${rh} transition-colors`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 ${avatarBg[i % avatarBg.length]}`}>
                          {r.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className={`text-[13px] font-medium ${ht}`}>{r.name}</p>
                          <p className={`text-[10px] font-mono ${mt}`}>{r.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className={`px-5 py-3 text-[12px] ${isDark ? "text-white/55" : "text-slate-500"}`}>{r.rank}</td>
                    <td className={`px-5 py-3 text-[12px] ${mt}`}>{r.date}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${isDark ? statusDark[r.status] : statusLight[r.status]}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent purchases */}
        <div className={`${card} xl:col-span-2`}>
          <CardHeader title="Recent Purchases" isDark={isDark} action={
            <button className={`flex items-center gap-1 text-xs font-medium transition-colors ${isDark ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-700"}`}>
              View all <ArrowUpRight className="w-3 h-3" />
            </button>
          } />
          <div className={`divide-y ${dv}`}>
            {purchases.map((p, i) => (
              <div key={i} className={`flex items-start justify-between px-5 py-3.5 ${rh} transition-colors`}>
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 mt-0.5 ${avatarBg[i % avatarBg.length]}`}>
                    {p.user.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-[13px] font-medium truncate ${ht}`}>{p.course}</p>
                    <p className={`text-[11px] mt-0.5 ${mt}`}>{p.user} · {p.date}</p>
                    <p className={`text-[10px] mt-0.5 ${mt} opacity-60`}>{p.method}</p>
                  </div>
                </div>
                <span className={`text-[13px] font-bold shrink-0 ml-2 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                  {p.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
