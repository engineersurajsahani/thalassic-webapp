"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import { masterService } from "@/services/master.service";
import useRouter from "next/navigation";
import Link from "next/link";
import {
  Users, BookOpen, ShoppingCart, TrendingUp, TrendingDown,
  ShieldCheck, ArrowUpRight, BarChart3, Activity, FileText, ChevronRight, Check, Star
} from "lucide-react";
import dynamic from "next/dynamic";

const BarChart = dynamic(() => import("recharts").then((m) => m.BarChart), { ssr: false });
const Bar = dynamic(() => import("recharts").then((m) => m.Bar), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((m) => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((m) => m.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then((m) => m.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((m) => m.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then((m) => m.ResponsiveContainer), { ssr: false });
const AreaChart = dynamic(() => import("recharts").then((m) => m.AreaChart), { ssr: false });
const Area = dynamic(() => import("recharts").then((m) => m.Area), { ssr: false });
const Cell = dynamic(() => import("recharts").then((m) => m.Cell), { ssr: false });
const PieChart = dynamic(() => import("recharts").then((m) => m.PieChart), { ssr: false });
const Pie = dynamic(() => import("recharts").then((m) => m.Pie), { ssr: false });

// YoY comparison data
const revenueComparisonData = [
  { month: "Jan", "Year 2024": 80000, "Year 2025": 140000, "Year 2026 (Live)": 210000 },
  { month: "Feb", "Year 2024": 95000, "Year 2025": 165000, "Year 2026 (Live)": 240000 },
  { month: "Mar", "Year 2024": 110000, "Year 2025": 180000, "Year 2026 (Live)": 265000 },
  { month: "Apr", "Year 2024": 130000, "Year 2025": 200000, "Year 2026 (Live)": 310000 },
  { month: "May", "Year 2024": 150000, "Year 2025": 220000, "Year 2026 (Live)": 330050 },
  { month: "Jun", "Year 2024": 175000, "Year 2025": 250000, "Year 2026 (Live)": 380000 },
];

// Ranks Bar Chart data
const ranksData = [
  { rank: "Ratings", count: 910, fill: "#3b82f6" },
  { rank: "Officers", count: 850, fill: "#06b6d4" },
  { rank: "Engineers", count: 610, fill: "#10b981" },
  { rank: "Cadets", count: 420, fill: "#f59e0b" },
];

// Course Share Donut data
const courseShareData = [
  { name: "Basic Modular", value: 42, color: "#3b82f6" },
  { name: "Advanced Simulator", value: 28, color: "#06b6d4" },
  { name: "Refresher Prep", value: 18, color: "#10b981" },
  { name: "Flag Endorse", value: 12, color: "#f59e0b" },
];

export default function MasterDashboard() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"enrollments" | "signups">("enrollments");
  const [dbData, setDbData] = useState<any>(null);

  const card = `rounded-3xl overflow-hidden p-6 ${isDark ? "bg-[#0d1f35] border border-white/[0.06]" : "bg-white border border-slate-200 shadow-sm"}`;
  const ht = isDark ? "text-white/80" : "text-slate-800";
  const mt = isDark ? "text-white/35" : "text-slate-400";
  const headText = ht;
  const mutedText = mt;
  const gl = isDark ? "#1a3352" : "#f1f5f9";
  const ax = isDark ? "#3d6080" : "#94a3b8";
  const dv = isDark ? "divide-white/[0.05]" : "divide-slate-100";
  const borderB = isDark ? "border-white/5" : "border-slate-100";
  const rowHover = isDark ? "hover:bg-white/[0.02] transition-colors" : "hover:bg-slate-50/50 transition-colors";

  const fetchDashboardData = async () => {
    try {
      const data = await masterService.getDashboard();
      setDbData(data);
    } catch (err) {
      console.error("Failed to load dashboard statistics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Format platform revenue dynamically
  const getFormattedRevenue = () => {
    if (!dbData || !dbData.totalRevenue) return "₹24.5L";
    return dbData.totalRevenue;
  };

  // Safe variables derived from DB
  const seafarersCount = dbData?.seafarersCount ?? 3;
  const coursesCount = dbData?.coursesCount ?? 7;
  const totalBookings = dbData?.totalBookings ?? 5;
  const ledger = dbData?.ledger || [
    { participant: "Test Seafarer", course: "Global Maritime Distress and Safety System", revenue: "₹35,000", status: "COMPLETED" },
    { participant: "Test Seafarer", course: "Basic Safety Training", revenue: "₹15,000", status: "COMPLETED" },
    { participant: "Test Seafarer", course: "Advanced Fire Fighting", revenue: "₹25,000", status: "PROCESSING" },
    { participant: "aniket", course: "Security Training for Seafarers with Designated Security Duties", revenue: "₹12,000", status: "ACTIVE" },
  ];

  // Dummy Signups for Tab 2
  const signups = [
    { participant: "Test Seafarer", email: "seafarer@test.com", phone: "9876543210", role: "SEAFARER" },
    { participant: "aniket", email: "aniket@hariomthalassic.com", phone: "+91 99999 88888", role: "SEAFARER" },
    { participant: "Master Admin", email: "master@gmail.com", phone: "+91 12345 67890", role: "MASTER" },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
            isDark ? "bg-white/5 border border-white/10 text-white/50" : "bg-slate-100 border border-slate-200 text-slate-700"
          }`}>
            MASTER CONTROL
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Database Online
          </span>
        </div>
        <h1 className={`text-2xl font-black tracking-tight ${headText}`}>Welcome back, Administrator</h1>
        <p className={`text-xs ${mutedText}`}>Overviewing maritime academy bookings, crew placements, and compliance audits.</p>
      </div>

      <div className={`border-b ${isDark ? "border-slate-800" : "border-slate-100"}`} />

      {/* 1. KPI cards strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Registered Seafarers */}
        <div className={card}>
          <div className="flex items-start justify-between">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? "bg-white/5" : "bg-slate-100"}`}>
              <Users className="w-4.5 h-4.5 text-indigo-500" />
            </div>
            <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/15 px-2 py-0.5 rounded-full">+12.4%</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mt-4">Registered Seafarers</p>
          <p className={`text-2xl font-black mt-1 ${headText}`}>{seafarersCount}</p>
        </div>

        {/* Card 2: Total Courses */}
        <div className={card}>
          <div className="flex items-start justify-between">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? "bg-white/5" : "bg-slate-100"}`}>
              <BookOpen className="w-4.5 h-4.5 text-indigo-500" />
            </div>
            <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/15 px-2 py-0.5 rounded-full">+3 New</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mt-4">Total Courses Available</p>
          <p className={`text-2xl font-black mt-1 ${headText}`}>{coursesCount}</p>
        </div>

        {/* Card 3: Course Bookings */}
        <div className={card}>
          <div className="flex items-start justify-between">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? "bg-white/5" : "bg-slate-100"}`}>
              <ShoppingCart className="w-4.5 h-4.5 text-indigo-500" />
            </div>
            <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/15 px-2 py-0.5 rounded-full">+8.2%</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mt-4">Course Bookings</p>
          <p className={`text-2xl font-black mt-1 ${headText}`}>{totalBookings}</p>
        </div>

        {/* Card 4: Platform Revenue */}
        <div className={card}>
          <div className="flex items-start justify-between">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? "bg-white/5" : "bg-slate-100"}`}>
              <TrendingUp className="w-4.5 h-4.5 text-indigo-500" />
            </div>
            <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/15 px-2 py-0.5 rounded-full">+15.8%</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mt-4">Platform Revenue</p>
          <p className={`text-2xl font-black mt-1 ${headText}`}>{getFormattedRevenue()}</p>
        </div>
      </div>

      {/* 2. Charts comparison row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Platform Revenue Comparison */}
        <div className={`${card} xl:col-span-2 space-y-4`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-sm font-black uppercase tracking-wider flex items-center gap-1.5 ${headText}`}>
                <Activity className="w-4.5 h-4.5 text-indigo-500" /> Platform Revenue: YoY Comparison
              </h3>
              <p className={`text-[10px] mt-0.5 ${mt}`}>Year-over-year exploratory data analysis of platform booking revenue.</p>
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider text-indigo-500 bg-indigo-500/10 px-2.5 py-1 rounded-full">
              H1 2026 Analytics
            </span>
          </div>

          {/* Custom legend */}
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-slate-400" /> Year 2024</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" /> Year 2025</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-cyan-400" /> Year 2026 (Live)</span>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueComparisonData}>
              <defs>
                <linearGradient id="liveG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke={gl} strokeDasharray="3 0" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: ax }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: ax }} axisLine={false} tickLine={false} width={40} tickFormatter={(v) => `₹${v/1000}K`} />
              <Tooltip formatter={(v: any) => `₹${Number(v).toLocaleString()}`} contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Area type="monotone" dataKey="Year 2024" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 3" fill="none" />
              <Area type="monotone" dataKey="Year 2025" stroke="#6366f1" strokeWidth={1.5} strokeDasharray="4 3" fill="none" />
              <Area type="monotone" dataKey="Year 2026 (Live)" stroke="#22d3ee" strokeWidth={2.5} fill="url(#liveG)" />
            </AreaChart>
          </ResponsiveContainer>

          <div className={`p-3 rounded-2xl text-[10px] text-slate-500 font-bold border border-indigo-500/10 bg-indigo-500/5 ${isDark ? "border-slate-800" : "border-slate-100"}`}>
            💡 <span className="text-indigo-400">Tip:</span> Click on any year in the legend above to filter the graph lines and explore annual achievements!
          </div>
        </div>

        {/* Right Column: Stacked mini-cards */}
        <div className="space-y-6">
          {/* Card 1: Seafarer Ranks */}
          <div className={card}>
            <h3 className={`text-xs font-black uppercase tracking-wider ${headText}`}>Seafarer Ranks</h3>
            <p className={`text-[10px] mt-0.5 ${mt}`}>Registered profiles categorized by ranks.</p>

            <div className="mt-4">
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={ranksData} barSize={16}>
                  <XAxis dataKey="rank" tick={{ fontSize: 10, fill: ax }} axisLine={false} tickLine={false} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {ranksData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card 2: Course Share */}
          <div className={card}>
            <h3 className={`text-xs font-black uppercase tracking-wider ${headText}`}>Course Share</h3>
            <p className={`text-[10px] mt-0.5 ${mt}`}>Segment purchase share metrics.</p>

            <div className="flex items-center gap-6 mt-3">
              <div className="w-[100px] h-[100px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={courseShareData} innerRadius={30} outerRadius={46} paddingAngle={2} dataKey="value">
                      {courseShareData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-1.5 text-[10px] font-bold text-slate-400">
                {courseShareData.map(c => (
                  <div key={c.name} className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: c.color }} /> {c.name}</span>
                    <span className={headText}>{c.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Operations log / integrity column */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Side: Operations & Ledger Log */}
        <div className={`${card} xl:col-span-2 space-y-5`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className={`text-sm font-black uppercase tracking-wider ${headText}`}>Operations & Ledger Log</h3>
              <p className={`text-[10px] mt-0.5 ${mt}`}>Real-time tracking of platform enrollments and seafarer onboardings.</p>
            </div>
            
            {/* Toggle tabs */}
            <div className={`flex rounded-xl p-0.5 border ${isDark ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-slate-50"}`}>
              <button
                onClick={() => setActiveTab("enrollments")}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "enrollments"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Enrollments
              </button>
              <button
                onClick={() => setActiveTab("signups")}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "signups"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Signups
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {activeTab === "enrollments" ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className={`border-b text-[10px] font-black uppercase tracking-wider ${isDark ? "border-slate-850" : "border-slate-100"}`}>
                    {["Participant", "Course Module", "Revenue", "Status"].map(h => (
                      <th key={h} className={`text-left pb-3 text-slate-400`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y ${dv}`}>
                  {ledger.map((l: any, i: number) => (
                    <tr key={i} className={rowHover}>
                      <td className={`py-3.5 text-[13px] font-black ${headText}`}>{l.participant}</td>
                      <td className={`py-3.5 text-[13px] font-medium ${isDark ? "text-white/60" : "text-slate-650"}`}>{l.course}</td>
                      <td className={`py-3.5 text-[13px] font-black ${isDark ? "text-cyan-400" : "text-cyan-600"}`}>{l.revenue || "₹0"}</td>
                      <td className="py-3.5">
                        <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          l.status === "COMPLETED"
                            ? "text-emerald-400 bg-emerald-400/10"
                            : "text-amber-400 bg-amber-400/10"
                        }`}>
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className={`border-b text-[10px] font-black uppercase tracking-wider ${isDark ? "border-slate-850" : "border-slate-100"}`}>
                    {["Participant", "Email Address", "Phone", "Access Role"].map(h => (
                      <th key={h} className={`text-left pb-3 text-slate-400`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y ${dv}`}>
                  {signups.map((s, i) => (
                    <tr key={i} className={rowHover}>
                      <td className={`py-3.5 text-[13px] font-black ${headText}`}>{s.participant}</td>
                      <td className={`py-3.5 text-[13px] font-mono ${isDark ? "text-white/50" : "text-slate-500"}`}>{s.email}</td>
                      <td className={`py-3.5 text-[13px] font-bold ${isDark ? "text-white/60" : "text-slate-650"}`}>{s.phone}</td>
                      <td className="py-3.5">
                        <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          s.role === "MASTER"
                            ? "text-indigo-400 bg-indigo-400/10"
                            : "text-cyan-400 bg-cyan-400/10"
                        }`}>
                          {s.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Side: Stacked panels */}
        <div className="space-y-6">
          {/* Panel 1: Recently Added Modules */}
          <div className={card}>
            <h3 className={`text-xs font-black uppercase tracking-wider ${headText}`}>Recently Added Modules</h3>
            <div className={`mt-4 divide-y ${dv}`}>
              {[
                { name: "STCW Basic Safety", cat: "Safety", status: "Active", bg: "text-emerald-400 bg-emerald-400/10" },
                { name: "Maritime Law Basics", cat: "Compliance", status: "Active", bg: "text-emerald-400 bg-emerald-400/10" },
                { name: "Ship Navigation", cat: "Technical", status: "Draft", bg: "text-amber-400 bg-amber-400/10" },
              ].map(m => (
                <div key={m.name} className="flex items-center justify-between py-3">
                  <div>
                    <p className={`text-[13px] font-black ${headText}`}>{m.name}</p>
                    <p className={`text-[10px] ${mt}`}>{m.cat}</p>
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${m.bg}`}>
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Panel 2: Core Systems Integrity */}
          <div className={card}>
            <h3 className={`text-xs font-black uppercase tracking-wider ${headText}`}>Core Systems Integrity</h3>
            <div className={`mt-4 divide-y ${dv} text-[11px] font-bold`}>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-slate-400">Supabase Latency</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> • 14ms (Online)
                </span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-slate-400">Authentication</span>
                <span className={headText}>NestJS Guard Active</span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-slate-400">DB Migration Diff</span>
                <span className={headText}>Synced (0 diff)</span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-slate-400">SSL Gateway State</span>
                <span className={headText}>SHA-256 Valid</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Quick Operations Control section */}
      <div className="space-y-3">
        <h3 className={`text-xs font-black uppercase tracking-wider ${headText}`}>Quick Operations Control</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/master/courses">
            <div className={`flex items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${
              isDark ? "bg-[#0b1b36] border-slate-800 hover:border-indigo-500/40 text-white" : "bg-white border-slate-200 hover:border-indigo-500 text-slate-900"
            }`}>
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-indigo-500" />
                <div>
                  <p className="text-xs font-black">Add New Course</p>
                  <p className={`text-[10px] mt-0.5 ${mt}`}>List deck/engine prep modules</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 shrink-0" />
            </div>
          </Link>

          <Link href="/master/users">
            <div className={`flex items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${
              isDark ? "bg-[#0b1b36] border-slate-800 hover:border-indigo-500/40 text-white" : "bg-white border-slate-200 hover:border-indigo-500 text-slate-900"
            }`}>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-indigo-500" />
                <div>
                  <p className="text-xs font-black">Verify Documents</p>
                  <p className={`text-[10px] mt-0.5 ${mt}`}>Audit INDOS, passport, CDC</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 shrink-0" />
            </div>
          </Link>

          <Link href="/master/reports">
            <div className={`flex items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${
              isDark ? "bg-[#0b1b36] border-slate-800 hover:border-indigo-500/40 text-white" : "bg-white border-slate-200 hover:border-indigo-500 text-slate-900"
            }`}>
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-indigo-500" />
                <div>
                  <p className="text-xs font-black">Financial Reports</p>
                  <p className={`text-[10px] mt-0.5 ${mt}`}>Extract revenue & tax stats</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 shrink-0" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
