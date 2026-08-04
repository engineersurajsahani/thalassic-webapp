"use client";

import React, { useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  BarChart2, Users, IndianRupee, BookOpen,
  TrendingUp, CheckCircle2, Calendar, Download,
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MONTHLY_DATA = [
  { month: "Feb", enrollments: 4,  revenue: 72000  },
  { month: "Mar", enrollments: 6,  revenue: 108000 },
  { month: "Apr", enrollments: 5,  revenue: 90000  },
  { month: "May", enrollments: 9,  revenue: 162000 },
  { month: "Jun", enrollments: 12, revenue: 216000 },
  { month: "Jul", enrollments: 21, revenue: 388500 },
];

const COURSE_STATS = [
  { name: "STCW Basic Safety",      enrolled: 13, completed: 10, revenue: 65000  },
  { name: "Ship Navigation",         enrolled: 7,  completed: 5,  revenue: 47600  },
  { name: "Engine Room Watch",       enrolled: 7,  completed: 4,  revenue: 56700  },
  { name: "Advanced Fire Fighting",  enrolled: 6,  completed: 4,  revenue: 43200  },
  { name: "Tanker Cargo Ops",        enrolled: 4,  completed: 3,  revenue: 37600  },
  { name: "Maritime Catering",       enrolled: 3,  completed: 2,  revenue: 10500  },
  { name: "Advanced Navigation",     enrolled: 1,  completed: 1,  revenue: 11000  },
];

const SOURCE_DATA = [
  { label: "Website (Direct)", value: 12, color: "bg-sky-500",     pct: 57 },
  { label: "Walk-in",          value: 9,  color: "bg-emerald-500", pct: 43 },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const { theme } = useTheme();
  const dk = theme === "dark";
  const [range, setRange] = useState("6M");

  const card  = `rounded-2xl overflow-hidden ${dk ? "bg-[#0d1f35] border border-white/[0.06]" : "bg-white border border-slate-200 shadow-sm"}`;
  const ht    = dk ? "text-white/80"  : "text-slate-800";
  const mt    = dk ? "text-white/35"  : "text-slate-400";
  const dv    = dk ? "divide-white/[0.05]" : "divide-slate-100";

  const totalEnrolled  = MONTHLY_DATA.reduce((s, m) => s + m.enrollments, 0);
  const totalRevenue   = MONTHLY_DATA.reduce((s, m) => s + m.revenue, 0);
  const totalCompleted = COURSE_STATS.reduce((s, c) => s + c.completed, 0);
  const avgCompletion  = Math.round((totalCompleted / totalEnrolled) * 100);

  const kpis = [
    { label: "Total Enrollments", value: String(totalEnrolled),  icon: Users,       bg: dk ? "bg-indigo-500/15"  : "bg-indigo-50",  color: "#6366f1" },
    { label: "Total Revenue",     value: "₹" + (totalRevenue / 100000).toFixed(1) + "L", icon: IndianRupee, bg: dk ? "bg-emerald-500/15" : "bg-emerald-50", color: "#10b981" },
    { label: "Courses Completed", value: String(totalCompleted), icon: CheckCircle2, bg: dk ? "bg-sky-500/15"    : "bg-sky-50",     color: "#0ea5e9" },
    { label: "Completion Rate",   value: avgCompletion + "%",    icon: TrendingUp,  bg: dk ? "bg-amber-500/15"  : "bg-amber-50",   color: "#f59e0b" },
  ];

  const maxEnrollments = Math.max(...MONTHLY_DATA.map(m => m.enrollments));
  const maxRevenue     = Math.max(...MONTHLY_DATA.map(m => m.revenue));

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-bold ${ht}`}>Reports</h1>
          <p className={`text-sm mt-0.5 ${mt}`}>Analytics overview for your maritime training operations</p>
        </div>
        <div className="flex items-center gap-2">
          {["3M","6M","1Y"].map(r => (
            <button key={r} onClick={() => setRange(r)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${range === r ? "bg-indigo-500 text-white" : dk ? "bg-white/5 text-white/40 hover:text-white/60" : "bg-slate-100 text-slate-500 hover:text-slate-700"}`}>
              {r}
            </button>
          ))}
          <button className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium border transition-colors ${dk ? "border-white/10 text-white/50 hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      {/* KPI strip */}
      <div className={card}>
        <div className={`grid grid-cols-2 xl:grid-cols-4 divide-x divide-y xl:divide-y-0 ${dk ? "divide-white/[0.05]" : "divide-slate-100"}`}>
          {kpis.map(k => {
            const Icon = k.icon;
            return (
              <div key={k.label} className="flex items-center gap-4 px-6 py-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${k.bg}`}>
                  <Icon className="w-5 h-5" style={{ color: k.color }} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${ht}`}>{k.value}</p>
                  <p className={`text-[11px] mt-0.5 ${mt}`}>{k.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

        {/* ── Enrollment Trend Chart ──────────────────────────────────────────── */}
        <div className={`${card} xl:col-span-3`}>
          <div className={`flex items-center justify-between px-6 py-4 border-b ${dk ? "border-white/5" : "border-slate-100"}`}>
            <div className="flex items-center gap-2">
              <BarChart2 className={`w-4 h-4 ${dk ? "text-indigo-400" : "text-indigo-500"}`} />
              <p className={`text-sm font-semibold ${ht}`}>Monthly Enrollments</p>
            </div>
            <span className={`text-[11px] ${mt}`}>Last 6 months</span>
          </div>
          <div className="px-6 py-5">
            <div className="flex items-end gap-3 h-40">
              {MONTHLY_DATA.map(m => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                  <span className={`text-[11px] font-semibold ${ht}`}>{m.enrollments}</span>
                  <div className="w-full flex items-end justify-center">
                    <div
                      className="w-full rounded-t-md bg-indigo-500 transition-all duration-500"
                      style={{ height: `${(m.enrollments / maxEnrollments) * 120}px` }}
                    />
                  </div>
                  <span className={`text-[10px] ${mt}`}>{m.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Source Breakdown ────────────────────────────────────────────────── */}
        <div className={`${card} xl:col-span-2`}>
          <div className={`flex items-center gap-2 px-6 py-4 border-b ${dk ? "border-white/5" : "border-slate-100"}`}>
            <Users className={`w-4 h-4 ${dk ? "text-sky-400" : "text-sky-500"}`} />
            <p className={`text-sm font-semibold ${ht}`}>Registrations by Source</p>
          </div>
          <div className="px-6 py-5 space-y-4">
            {SOURCE_DATA.map(s => (
              <div key={s.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                    <span className={`text-[13px] font-medium ${ht}`}>{s.label}</span>
                  </div>
                  <span className={`text-[13px] font-bold ${ht}`}>{s.value} <span className={`text-[11px] font-normal ${mt}`}>({s.pct}%)</span></span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${dk ? "bg-white/8" : "bg-slate-100"}`}>
                  <div className={`h-full rounded-full ${s.color} transition-all duration-700`} style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}

            {/* Revenue trend mini bars */}
            <div className={`mt-6 pt-4 border-t ${dk ? "border-white/5" : "border-slate-100"}`}>
              <p className={`text-[10px] font-semibold uppercase tracking-widest mb-3 ${mt}`}>Monthly Revenue (₹)</p>
              <div className="flex items-end gap-2 h-20">
                {MONTHLY_DATA.map(m => (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-sm bg-emerald-500/70 transition-all duration-500"
                      style={{ height: `${(m.revenue / maxRevenue) * 64}px` }}
                    />
                    <span className={`text-[9px] ${mt}`}>{m.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Course Performance Table ──────────────────────────────────────────── */}
      <div className={card}>
        <div className={`flex items-center gap-2 px-6 py-4 border-b ${dk ? "border-white/5" : "border-slate-100"}`}>
          <BookOpen className={`w-4 h-4 ${dk ? "text-amber-400" : "text-amber-500"}`} />
          <p className={`text-sm font-semibold ${ht}`}>Course Performance</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={dk ? "border-b border-white/5" : "border-b border-slate-100"}>
                {["Course","Enrolled","Completed","Completion %","Revenue"].map(h => (
                  <th key={h} className={`text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap ${mt}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${dv}`}>
              {COURSE_STATS.map(c => {
                const pct = Math.round((c.completed / c.enrolled) * 100);
                return (
                  <tr key={c.name} className={`transition-colors ${dk ? "hover:bg-white/[0.03]" : "hover:bg-slate-50"}`}>
                    <td className={`px-5 py-3.5 text-[13px] font-medium ${ht}`}>{c.name}</td>
                    <td className={`px-5 py-3.5 text-[13px] font-semibold ${dk ? "text-white/60" : "text-slate-600"}`}>{c.enrolled}</td>
                    <td className={`px-5 py-3.5 text-[13px] font-semibold ${dk ? "text-emerald-400" : "text-emerald-600"}`}>{c.completed}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-20 h-1.5 rounded-full overflow-hidden ${dk ? "bg-white/8" : "bg-slate-100"}`}>
                          <div className="h-full rounded-full bg-indigo-500" style={{ width: `${pct}%` }} />
                        </div>
                        <span className={`text-[12px] tabular-nums font-semibold ${ht}`}>{pct}%</span>
                      </div>
                    </td>
                    <td className={`px-5 py-3.5 text-[13px] font-bold ${dk ? "text-white/80" : "text-slate-800"}`}>
                      ₹{c.revenue.toLocaleString("en-IN")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
