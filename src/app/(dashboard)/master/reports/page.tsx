"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import { masterService } from "@/services/master.service";
import { TrendingUp, TrendingDown, Download, BarChart3, Users, BookOpen, ShoppingCart, Star, ShieldCheck } from "lucide-react";
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

  const [topCourses, setTopCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageCompletion, setAverageCompletion] = useState("94.2%");
  const [refundRate, setRefundRate] = useState("0.32%");
  const [selectedDays, setSelectedDays] = useState("30");

  const fetchReports = async (days?: string) => {
    setLoading(true);
    try {
      const data = await masterService.getReports(days);
      if (data && data.courses) {
        setTopCourses(data.courses);
        setAverageCompletion(data.averageCompletion);
        setRefundRate(data.refundRate);
      } else {
        setTopCourses(data || []);
      }
    } catch (err) {
      console.error("Failed to load reports data:", err);
      setTopCourses([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchReports(selectedDays);
  }, []);

  // Calculate dynamic average rating from top courses data
  const avgRating = topCourses.length > 0 
    ? (topCourses.reduce((sum, c) => sum + parseFloat(c.rating || 0), 0) / topCourses.length).toFixed(2)
    : "4.85";

  // CSV Exporter Handler
  const handleExport = () => {
    if (topCourses.length === 0) {
      alert("No data available to export");
      return;
    }

    // Build CSV Content
    const headers = ["Course", "Completions/Bookings", "Accrued Revenue", "Rating"];
    const rows = topCourses.map(c => [
      c.course ?? c.name ?? "N/A",
      c.bookings ?? c.completions ?? 0,
      c.revenue ?? "N/A",
      c.rating ?? "4.8"
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    // Trigger Client-Side Download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `hari_om_thalassic_courses_report_last_${selectedDays}_days_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-bold ${headText}`}>Reports & Analytics</h1>
          <p className={`text-sm mt-0.5 ${mutedText}`}>Jan – Oct 2025</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedDays}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedDays(val);
              fetchReports(val);
            }}
            className={`text-xs font-bold uppercase tracking-wider px-3.5 py-2.5 rounded-xl border outline-none transition-all cursor-pointer shadow-sm ${
              isDark 
                ? "border-slate-800 bg-slate-900/40 text-white/70 hover:bg-slate-800/80" 
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <option value="30">Last 30 Days</option>
            <option value="7">Last 7 Days</option>
            <option value="2">Last 2 Days</option>
          </select>

          <button
            onClick={handleExport}
            className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl border transition-all cursor-pointer shadow-sm hover:-translate-y-0.5 ${
              isDark ? "border-slate-800 bg-slate-900/40 hover:bg-slate-800/80 text-white" : "border-slate-200 bg-white hover:bg-slate-50 text-slate-750"
            }`}
          >
            <Download className="w-4 h-4" /> Export Report (CSV)
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Average Course Rating */}
        <div className={`${bg} rounded-3xl p-6`}>
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Average Course Rating</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-3xl font-black text-amber-500">{avgRating}</span>
            <Star className="w-6 h-6 fill-amber-400 text-amber-400 shrink-0" />
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-xs font-bold text-emerald-400">
            <TrendingUp className="w-4 h-4" /> Outperforming target 4.5
          </div>
        </div>

        {/* Card 2: Average Course Completion */}
        <div className={`${bg} rounded-3xl p-6`}>
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Average Course Completion</p>
          <div className="flex items-center mt-2">
            <span className="text-3xl font-black text-cyan-500">{averageCompletion}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-xs font-bold text-emerald-400">
            <TrendingUp className="w-4 h-4" /> +2.5% increase this month
          </div>
        </div>

        {/* Card 3: Refund Rate */}
        <div className={`${bg} rounded-3xl p-6`}>
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Refund Rate</p>
          <div className="flex items-center mt-2">
            <span className="text-3xl font-black text-red-500">{refundRate}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-xs font-bold text-emerald-400">
            <TrendingDown className="w-4 h-4" /> Reduced by 0.1%
          </div>
        </div>
      </div>

      {/* Course Booking Sales Performance */}
      <div className={`${bg} rounded-3xl overflow-hidden`}>
        <div className={`px-6 py-5 border-b flex items-center gap-2 ${border}`}>
          <BarChart3 className="w-5 h-5 text-indigo-500" />
          <p className={`text-sm font-black uppercase tracking-wider ${headText}`}>Course Booking Sales Performance</p>
        </div>
        {loading ? (
          <div className="text-center py-16 animate-pulse">
            <div className="w-8 h-8 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mx-auto mb-4" />
            <p className={`text-xs ${mutedText}`}>Loading sales records...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b ${border}`}>
                  {["Course Module Name", "Total Bookings", "Total Revenue", "Average Rating", "Status"].map(h => (
                    <th key={h} className={`text-left px-6 py-4.5 text-[10px] font-black uppercase tracking-wider whitespace-nowrap ${mutedText}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className={`divide-y ${divider}`}>
                {topCourses.map((c) => (
                  <tr key={c.course ?? c.name} className={isDark ? "hover:bg-white/[0.02]" : "hover:bg-slate-50/50"}>
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-4.5 h-4.5 text-indigo-500 shrink-0" />
                        <span className={`text-[13px] font-black ${headText}`}>{c.course ?? c.name}</span>
                      </div>
                    </td>
                    <td className={`px-6 py-4.5 text-[13px] font-bold tabular-nums ${isDark ? "text-white/70" : "text-slate-700"}`}>
                      {c.bookings ?? c.completions ?? 0}
                    </td>
                    <td className={`px-6 py-4.5 text-[13px] font-black tabular-nums ${isDark ? "text-cyan-400" : "text-cyan-600"}`}>
                      {c.revenue || "₹0"}
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <div className="flex items-center gap-1 font-bold">
                        <span className="text-[13px] text-amber-500">{c.rating || "4.8"}</span>
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      </div>
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        <ShieldCheck className="w-3.5 h-3.5" /> High Demand
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
