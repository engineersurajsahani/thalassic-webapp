"use client";

import React, { useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  FileText, Download, Calendar, RefreshCw, Filter,
  ChevronDown, CheckCircle2, Clock, TrendingUp, TrendingDown,
  Users, BookOpen, Building2, UserCog, BarChart3,
  Receipt, Wallet, CreditCard, GitMerge, Activity,
  ArrowUpRight, X, Check, FileSpreadsheet, Printer,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

// ── Dummy chart data ──────────────────────────────────────────────────────
const revenueData = [
  { month:"Jan",revenue:180000,target:200000 }, { month:"Feb",revenue:210000,target:200000 },
  { month:"Mar",revenue:195000,target:210000 }, { month:"Apr",revenue:240000,target:220000 },
  { month:"May",revenue:220000,target:230000 }, { month:"Jun",revenue:280000,target:250000 },
  { month:"Jul",revenue:310000,target:270000 }, { month:"Aug",revenue:295000,target:280000 },
];
const enrollData = [
  { month:"Feb",enroll:320,complete:210 }, { month:"Mar",enroll:410,complete:290 },
  { month:"Apr",enroll:380,complete:260 }, { month:"May",enroll:510,complete:380 },
  { month:"Jun",enroll:490,complete:340 }, { month:"Jul",enroll:620,complete:440 },
  { month:"Aug",enroll:700,complete:520 },
];
const referralData = [
  { month:"Feb",leads:18,conversions:10 }, { month:"Mar",leads:24,conversions:14 },
  { month:"Apr",leads:20,conversions:13 }, { month:"May",leads:30,conversions:19 },
  { month:"Jun",leads:28,conversions:18 }, { month:"Jul",leads:36,conversions:22 },
  { month:"Aug",leads:40,conversions:26 },
];

// ── Report definitions ────────────────────────────────────────────────────
const REPORT_CATEGORIES = [
  {
    id: "operational", label: "Operational", Icon: Activity, color: "text-sky-400", bg: "bg-sky-500/15",
    reports: [
      { id: "reg",     name: "Platform Registration Report",  desc: "Total seafarers and admins registered over time",  rows: 840  },
      { id: "enroll",  name: "Course Enrollment Report",      desc: "Enrollments and completion rates by course",        rows: 5234 },
      { id: "active",  name: "Active User Report",            desc: "Monthly active users across all portals",           rows: 312  },
    ],
  },
  {
    id: "admin", label: "Administrative", Icon: UserCog, color: "text-violet-400", bg: "bg-violet-500/15",
    reports: [
      { id: "cadmin",  name: "Company Admin Activity Report",  desc: "Actions and logins by company administrators",     rows: 8    },
      { id: "aadmin",  name: "Agent Admin Activity Report",    desc: "Actions and logins by agent administrators",      rows: 7    },
      { id: "login",   name: "Login Activity Report",         desc: "All login attempts across the platform",           rows: 1480 },
      { id: "audit",   name: "Audit Log Report",              desc: "Complete audit trail of all admin actions",        rows: 3260 },
    ],
  },
  {
    id: "financial", label: "Financial", Icon: BarChart3, color: "text-emerald-400", bg: "bg-emerald-500/15",
    reports: [
      { id: "revenue",  name: "Revenue Report",               desc: "Total revenue breakdown by month and source",      rows: 310  },
      { id: "payment",  name: "Payment Report",               desc: "All payment transactions with status",             rows: 1245 },
      { id: "invoice",  name: "Invoice Report",               desc: "All raised invoices and settlement status",        rows: 312  },
      { id: "settle",   name: "Settlement Report",            desc: "Settled and pending settlements summary",          rows: 89   },
      { id: "commout",  name: "Outstanding Commission Report",desc: "Commissions payable to agents and admins",         rows: 41   },
    ],
  },
  {
    id: "referral", label: "Referral", Icon: GitMerge, color: "text-amber-400", bg: "bg-amber-500/15",
    reports: [
      { id: "refperf", name: "Referral Performance Report",  desc: "Lead generation and conversion by agent",           rows: 128  },
      { id: "agconv",  name: "Agent Conversion Report",      desc: "Conversion rates per agent admin",                  rows: 41   },
      { id: "refsrc",  name: "Referral Source Analysis",     desc: "Breakdown of referral origin channels",             rows: 74   },
    ],
  },
];

const STATUS_FILTERS = ["All","Pending","Paid","Overdue","Settled","Failed"];
const USER_TYPES     = ["All","Company Admin","Agent Admin","Agent","Seafarer"];
const COURSES        = ["All","STCW Basic Safety","Advanced Fire Fighting","Ship Navigation & Radar","Maritime Law","Tanker Cargo Ops"];

type GenerateState = Record<string, "idle"|"generating"|"done">;
type ScheduleModal = { open: boolean; reportId: string; reportName: string; };

export default function ReportsPage() {
  const { theme } = useTheme();
  const dk = theme === "dark";

  const [activeCategory, setActiveCategory]   = useState("operational");
  const [genState, setGenState]               = useState<GenerateState>({});
  const [schedModal, setSchedModal]           = useState<ScheduleModal>({ open: false, reportId: "", reportName: "" });
  const [schedSaved, setSchedSaved]           = useState(false);

  // Filters
  const [dateFrom, setDateFrom] = useState("2025-01-01");
  const [dateTo,   setDateTo  ] = useState("2025-08-31");
  const [userType, setUserType] = useState("All");
  const [course,   setCourse  ] = useState("All");
  const [payStatus,setPayStatus]= useState("All");
  const [showFilters, setShowFilters] = useState(false);

  // theme tokens
  const bg      = dk ? "bg-[#0d1f35] border border-white/6"   : "bg-white border border-slate-200 shadow-sm";
  const ht      = dk ? "text-white/80"   : "text-slate-800";
  const mt      = dk ? "text-white/35"   : "text-slate-400";
  const grid    = dk ? "#1e3a5f"         : "#f1f5f9";
  const axis    = dk ? "#4a6d8c"         : "#94a3b8";
  const divider = dk ? "divide-white/5"  : "divide-slate-100";
  const border  = dk ? "border-white/5"  : "border-slate-100";
  const inputBg = dk ? "bg-white/5 border border-white/8 text-white placeholder:text-white/25 outline-none" : "bg-slate-50 border border-slate-200 text-slate-700 placeholder:text-slate-400 outline-none";
  const modalBg = dk ? "bg-[#0d1f35] border border-white/10" : "bg-white border border-slate-200";

  const handleGenerate = (reportId: string) => {
    setGenState(s => ({ ...s, [reportId]: "generating" }));
    setTimeout(() => setGenState(s => ({ ...s, [reportId]: "done" })), 1500);
    setTimeout(() => setGenState(s => ({ ...s, [reportId]: "idle" })), 4000);
  };

  const openSchedule = (reportId: string, reportName: string) => {
    setSchedModal({ open: true, reportId, reportName });
    setSchedSaved(false);
  };

  const currentCat = REPORT_CATEGORIES.find(c => c.id === activeCategory)!;

  // Summary KPIs
  const kpis = [
    { label: "Reports Generated",  value: "1,248", delta: "+14%", up: true,  Icon: FileText,  color: dk?"text-indigo-400":"text-indigo-500", ibg: dk?"bg-indigo-500/15":"bg-indigo-50" },
    { label: "Total Revenue",      value: "₹24.5L", delta: "+15%", up: true,  Icon: TrendingUp, color: dk?"text-emerald-400":"text-emerald-500", ibg: dk?"bg-emerald-500/15":"bg-emerald-50" },
    { label: "New Registrations",  value: "840",   delta: "+22%", up: true,  Icon: Users,     color: dk?"text-sky-400":"text-sky-500", ibg: dk?"bg-sky-500/15":"bg-sky-50" },
    { label: "Referral Leads",     value: "128",   delta: "+8%",  up: true,  Icon: GitMerge,  color: dk?"text-amber-400":"text-amber-500", ibg: dk?"bg-amber-500/15":"bg-amber-50" },
  ];

  return (
    <div className="space-y-5">

      {/* ── Schedule Modal ─────────────────────────────────────────── */}
      {schedModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSchedModal(s => ({ ...s, open: false }))}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className={`relative w-full max-w-sm rounded-2xl shadow-2xl z-10 ${modalBg}`} onClick={e => e.stopPropagation()}>
            <div className={`flex items-center justify-between px-6 py-4 border-b ${dk ? "border-white/8" : "border-slate-100"}`}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center"><Calendar className="w-4 h-4 text-indigo-400" /></div>
                <div><p className={`text-sm font-semibold ${ht}`}>Schedule Report</p>
                  <p className={`text-xs ${mt} max-w-[200px] truncate`}>{schedModal.reportName}</p></div>
              </div>
              <button onClick={() => setSchedModal(s => ({ ...s, open: false }))} className={`p-1.5 rounded-lg ${dk ? "hover:bg-white/8 text-white/40" : "hover:bg-slate-100 text-slate-400"}`}><X className="w-4 h-4" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${dk?"text-white/60":"text-slate-600"}`}>Frequency</label>
                <select className={`w-full px-3 py-2 text-sm rounded-lg ${inputBg}`}>
                  <option>Daily</option><option>Weekly</option><option>Monthly</option><option>Quarterly</option>
                </select>
              </div>
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${dk?"text-white/60":"text-slate-600"}`}>Delivery Email</label>
                <input placeholder="admin@thalassic.in" className={`w-full px-3 py-2 text-sm rounded-lg ${inputBg}`} />
              </div>
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${dk?"text-white/60":"text-slate-600"}`}>Format</label>
                <div className="flex gap-2">
                  {["PDF","Excel"].map(f => (
                    <button key={f} className={`flex-1 py-2 text-sm font-semibold rounded-lg border transition-colors ${dk?"border-white/10 text-white/60 hover:bg-white/5":"border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{f}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${dk ? "border-white/8" : "border-slate-100"}`}>
              <button onClick={() => setSchedModal(s => ({ ...s, open: false }))} className={`px-4 py-2 text-sm font-medium rounded-xl border ${dk ? "border-white/10 text-white/50 hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>Cancel</button>
              <button onClick={() => { setSchedSaved(true); setTimeout(() => setSchedModal(s => ({ ...s, open: false })), 1200); }}
                className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl transition-all ${schedSaved ? "bg-emerald-500 text-white" : "bg-indigo-500 hover:bg-indigo-600 text-white"}`}>
                {schedSaved ? <><Check className="w-4 h-4" /> Scheduled!</> : <><Calendar className="w-4 h-4" /> Schedule</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-bold ${ht}`}>Reports & Analytics</h1>
          <p className={`text-sm mt-0.5 ${mt}`}>Platform-wide operational, financial & administrative reports</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowFilters(s => !s)}
            className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border transition-colors ${dk ? "border-white/10 text-white/60 hover:bg-white/5" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
            <Filter className="w-4 h-4" /> Filters {showFilters && <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />}
          </button>
          <button className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border transition-colors ${dk ? "border-white/10 text-white/60 hover:bg-white/5" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      {/* ── Filter Bar ──────────────────────────────────────────── */}
      {showFilters && (
        <div className={`${bg} rounded-2xl p-5`}>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[140px]">
              <label className={`block text-xs font-semibold mb-1.5 ${dk?"text-white/50":"text-slate-500"}`}>Date From</label>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-lg ${inputBg}`} />
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className={`block text-xs font-semibold mb-1.5 ${dk?"text-white/50":"text-slate-500"}`}>Date To</label>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-lg ${inputBg}`} />
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className={`block text-xs font-semibold mb-1.5 ${dk?"text-white/50":"text-slate-500"}`}>User Type</label>
              <select value={userType} onChange={e => setUserType(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-lg ${inputBg}`}>
                {USER_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[160px]">
              <label className={`block text-xs font-semibold mb-1.5 ${dk?"text-white/50":"text-slate-500"}`}>Course</label>
              <select value={course} onChange={e => setCourse(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-lg ${inputBg}`}>
                {COURSES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className={`block text-xs font-semibold mb-1.5 ${dk?"text-white/50":"text-slate-500"}`}>Payment Status</label>
              <select value={payStatus} onChange={e => setPayStatus(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-lg ${inputBg}`}>
                {STATUS_FILTERS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition-colors">Apply Filters</button>
          </div>
        </div>
      )}

      {/* ── Summary KPIs ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => {
          const D = k.up ? TrendingUp : TrendingDown;
          return (
            <div key={k.label} className={`${bg} rounded-xl px-5 py-4`}>
              <div className={`w-9 h-9 rounded-lg ${k.ibg} flex items-center justify-center mb-3`}>
                <k.Icon className={`w-4 h-4 ${k.color}`} />
              </div>
              <p className={`text-xl font-bold ${ht}`}>{k.value}</p>
              <p className={`text-xs mt-0.5 ${mt}`}>{k.label}</p>
              <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${k.up ? "text-emerald-500" : "text-red-400"}`}>
                <D className="w-3 h-3" />{k.delta} vs last year
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Category Tabs + Reports ───────────────────────────────── */}
      <div className={`${bg} rounded-2xl overflow-hidden`}>
        {/* Tabs */}
        <div className={`flex border-b ${border} px-4 pt-4`}>
          {REPORT_CATEGORIES.map(cat => {
            const CatIcon = cat.Icon;
            return (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-xl mr-1 transition-colors border-b-2 -mb-px ${
                  activeCategory === cat.id
                    ? `border-indigo-500 ${ht}`
                    : `border-transparent ${mt} hover:${ht}`
                }`}>
                <CatIcon className={`w-4 h-4 ${activeCategory === cat.id ? cat.color : ""}`} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Report list */}
        <div className={`divide-y ${divider}`}>
          {currentCat.reports.map(rep => {
            const state = genState[rep.id] ?? "idle";
            return (
              <div key={rep.id} className={`flex items-center gap-4 px-6 py-4 ${dk ? "hover:bg-white/[0.02]" : "hover:bg-slate-50/70"} transition-colors`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${currentCat.bg}`}>
                  <FileText className={`w-5 h-5 ${currentCat.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[14px] font-semibold ${ht}`}>{rep.name}</p>
                  <p className={`text-[12px] mt-0.5 ${mt}`}>{rep.desc}</p>
                  <p className={`text-[11px] mt-1 ${mt} opacity-70`}>{rep.rows.toLocaleString()} records · Jan–Aug 2025</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {/* Generate */}
                  <button onClick={() => handleGenerate(rep.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 text-[12px] font-semibold rounded-lg transition-all ${
                      state === "generating" ? "bg-indigo-500/20 text-indigo-400 cursor-wait" :
                      state === "done"       ? "bg-emerald-500 text-white" :
                      "bg-indigo-500 hover:bg-indigo-600 text-white"
                    }`}>
                    {state === "generating" && <RefreshCw className="w-3 h-3 animate-spin" />}
                    {state === "done"       && <Check className="w-3 h-3" />}
                    {state === "idle"       && <BarChart3 className="w-3 h-3" />}
                    {state === "generating" ? "Generating…" : state === "done" ? "Done!" : "Generate"}
                  </button>
                  {/* Export PDF */}
                  <button className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold rounded-lg border transition-colors ${dk ? "border-white/10 text-white/50 hover:bg-white/5 hover:text-white/70" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
                    <Printer className="w-3 h-3" /> PDF
                  </button>
                  {/* Export Excel */}
                  <button className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold rounded-lg border transition-colors ${dk ? "border-white/10 text-white/50 hover:bg-white/5 hover:text-white/70" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
                    <FileSpreadsheet className="w-3 h-3" /> Excel
                  </button>
                  {/* Schedule */}
                  <button onClick={() => openSchedule(rep.id, rep.name)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold rounded-lg border transition-colors ${dk ? "border-white/10 text-white/50 hover:bg-white/5 hover:text-white/70" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
                    <Calendar className="w-3 h-3" /> Schedule
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Charts ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Revenue vs Target */}
        <div className={`${bg} rounded-2xl overflow-hidden`}>
          <div className={`flex items-center justify-between px-6 py-4 border-b ${border}`}>
            <p className={`text-sm font-semibold ${ht}`}>Revenue vs Target</p>
            <button className={`flex items-center gap-1 text-xs font-medium ${dk?"text-indigo-400":"text-indigo-600"}`}>Full report <ArrowUpRight className="w-3 h-3"/></button>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="rG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} /><stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke={grid} />
                <XAxis dataKey="month" tick={{ fontSize:11, fill:axis }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:11, fill:axis }} axisLine={false} tickLine={false} width={46} tickFormatter={(v:number) => `${v/1000}K`} />
                <Tooltip formatter={(v:number) => `₹${(v/1000).toFixed(0)}K`} contentStyle={{ fontSize:12, borderRadius:8, border:"1px solid #e2e8f0" }} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#6366f1" strokeWidth={2} fill="url(#rG)" />
                <Area type="monotone" dataKey="target"  name="Target"  stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 3" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Enrollments vs Completions */}
        <div className={`${bg} rounded-2xl overflow-hidden`}>
          <div className={`flex items-center justify-between px-6 py-4 border-b ${border}`}>
            <p className={`text-sm font-semibold ${ht}`}>Enrollments vs Completions</p>
            <button className={`flex items-center gap-1 text-xs font-medium ${dk?"text-indigo-400":"text-indigo-600"}`}>Full report <ArrowUpRight className="w-3 h-3"/></button>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={enrollData} barSize={12} barGap={4}>
                <CartesianGrid vertical={false} stroke={grid} />
                <XAxis dataKey="month" tick={{ fontSize:11, fill:axis }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:11, fill:axis }} axisLine={false} tickLine={false} width={36} />
                <Tooltip contentStyle={{ fontSize:12, borderRadius:8, border:"1px solid #e2e8f0" }} />
                <Bar dataKey="enroll"   name="Enrollments"  fill="#6366f1" radius={[3,3,0,0]} />
                <Bar dataKey="complete" name="Completions"  fill="#34d399" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Referral Performance */}
        <div className={`${bg} rounded-2xl overflow-hidden xl:col-span-2`}>
          <div className={`flex items-center justify-between px-6 py-4 border-b ${border}`}>
            <p className={`text-sm font-semibold ${ht}`}>Referral Performance — Leads vs Conversions</p>
            <button className={`flex items-center gap-1 text-xs font-medium ${dk?"text-indigo-400":"text-indigo-600"}`}>Full report <ArrowUpRight className="w-3 h-3"/></button>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={referralData} barSize={14} barGap={4}>
                <CartesianGrid vertical={false} stroke={grid} />
                <XAxis dataKey="month" tick={{ fontSize:11, fill:axis }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:11, fill:axis }} axisLine={false} tickLine={false} width={30} />
                <Tooltip contentStyle={{ fontSize:12, borderRadius:8, border:"1px solid #e2e8f0" }} />
                <Bar dataKey="leads"       name="Leads"       fill="#f59e0b" radius={[3,3,0,0]} />
                <Bar dataKey="conversions" name="Conversions" fill="#10b981" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
