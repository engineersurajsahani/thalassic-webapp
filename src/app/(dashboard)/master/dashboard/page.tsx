"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/providers/theme-provider";
import { fetchAPI } from "@/lib/api";
import {
  Users,
  BookOpen,
  ShoppingCart,
  TrendingUp,
  ArrowRight,
  Calendar,
  PieChart as PieIcon,
  BarChart2 as BarIcon,
  LineChart as LineIcon,
  Zap,
  Activity,
  Award
} from "lucide-react";

// Premium Stats Config
const statistics = [
  {
    title: "Registered Seafarers",
    value: "2,847",
    change: "+12.4%",
    icon: Users,
    color: "blue",
    grad: "from-blue-500 to-cyan-400",
    shadow: "shadow-blue-500/10",
  },
  {
    title: "Total Courses Available",
    value: "48",
    change: "+3 New",
    icon: BookOpen,
    color: "green",
    grad: "from-emerald-500 to-teal-400",
    shadow: "shadow-emerald-500/10",
  },
  {
    title: "Course Bookings",
    value: "5,234",
    change: "+8.2%",
    icon: ShoppingCart,
    color: "purple",
    grad: "from-purple-500 to-indigo-400",
    shadow: "shadow-purple-500/10",
  },
  {
    title: "Platform Revenue",
    value: "₹24.5L",
    change: "+15.8%",
    icon: TrendingUp,
    color: "orange",
    grad: "from-orange-500 to-amber-400",
    shadow: "shadow-orange-500/10",
  },
];

// Mock EDA data
const revenueTrend = [
  { month: "Jan", revenue: 4.2, bookings: 120 },
  { month: "Feb", revenue: 6.8, bookings: 180 },
  { month: "Mar", revenue: 9.5, bookings: 240 },
  { month: "Apr", revenue: 12.0, bookings: 310 },
  { month: "May", revenue: 18.5, bookings: 420 },
  { month: "Jun", revenue: 24.5, bookings: 580 },
];

const ranksData = [
  { rank: "Ratings", count: 947, color: "url(#blueBarGrad)" },
  { rank: "Officers", count: 850, color: "url(#cyanBarGrad)" },
  { rank: "Engineers", count: 620, color: "url(#emeraldBarGrad)" },
  { rank: "Cadets", count: 430, color: "url(#orangeBarGrad)" },
];

const courseDist = [
  { label: "Basic Modular", pct: 0.42, color: "#3b82f6" },
  { label: "Advanced Simulator", pct: 0.28, color: "#06b6d4" },
  { label: "Refresher Prep", pct: 0.18, color: "#10b981" },
  { label: "Flag Endorse", pct: 0.12, color: "#f59e0b" },
];

const recentRegistrations = [
  { id: 1, name: "Raj Kumar", email: "raj@example.com", date: "Today", initial: "R", color: "bg-blue-500/20 text-blue-400" },
  { id: 2, name: "Priya Singh", email: "priya@example.com", date: "Yesterday", initial: "P", color: "bg-emerald-500/20 text-emerald-400" },
  { id: 3, name: "Amit Patel", email: "amit@example.com", date: "2 days ago", initial: "A", color: "bg-purple-500/20 text-purple-400" },
];

const recentPurchases = [
  { id: 1, user: "Raj Kumar", course: "STCW Safety Training", amount: "₹5,000", status: "Completed" },
  { id: 2, user: "Priya Singh", course: "Basic Safety Training", amount: "₹3,500", status: "Completed" },
  { id: 3, user: "Amit Patel", course: "Advanced Fire Fighting", amount: "₹7,200", status: "Processing" },
];

const recentCourses = [
  { id: 1, title: "STCW Basic Safety", category: "Safety", status: "Active" },
  { id: 2, title: "Maritime Law Basics", category: "Compliance", status: "Active" },
  { id: 3, title: "Ship Navigation", category: "Technical", status: "Draft" },
];

const quickActions = [
  { label: "Add New Course", icon: "+", desc: "List deck/engine prep modules" },
  { label: "Verify Documents", icon: "👥", desc: "Audit INDOS, passport, CDC" },
  { label: "Financial Reports", icon: "📊", desc: "Extract revenue & tax stats" },
];

// --- 1. Custom SVG Line Chart with Glow Effects ---
function CustomLineChart({ isDark }: { isDark: boolean }) {
  const width = 600;
  const height = 240;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 35;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const maxVal = 30;

  const points = revenueTrend.map((d, index) => {
    const x = paddingLeft + (index / (revenueTrend.length - 1)) * chartWidth;
    const y = height - paddingBottom - (d.revenue / maxVal) * chartHeight;
    return { x, y, val: d.revenue, label: d.month };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  const fillD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`
    : "";

  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
        <defs>
          {/* Neon Glow Filter */}
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>

          <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0, 10, 20, 30].map((val) => {
          const y = height - paddingBottom - (val / maxVal) * chartHeight;
          return (
            <g key={val}>
              <line 
                x1={paddingLeft} 
                y1={y} 
                x2={width - paddingRight} 
                y2={y} 
                stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"} 
                strokeWidth={1.5}
              />
              <text 
                x={paddingLeft - 12} 
                y={y + 3.5} 
                textAnchor="end" 
                className={`text-[10px] font-extrabold ${isDark ? "fill-gray-500" : "fill-slate-400"}`}
              >
                ₹{val}L
              </text>
            </g>
          );
        })}

        {/* X Axis Labels */}
        {points.map((p, index) => (
          <text
            key={index}
            x={p.x}
            y={height - 12}
            textAnchor="middle"
            className={`text-[11px] font-extrabold ${isDark ? "fill-gray-400" : "fill-slate-500"}`}
          >
            {p.label}
          </text>
        ))}

        {/* Path Fill & Stroke */}
        <path d={fillD} fill="url(#fillGrad)" />
        <path d={pathD} fill="none" stroke="url(#lineGrad)" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" filter="url(#neonGlow)" />

        {/* Interactive hover guides */}
        {points.map((p, index) => (
          <g 
            key={index} 
            onMouseEnter={() => setHoverIdx(index)} 
            onMouseLeave={() => setHoverIdx(null)}
            className="cursor-pointer"
          >
            <circle cx={p.x} cy={p.y} r={20} fill="transparent" />
            <circle 
              cx={p.x} 
              cy={p.y} 
              r={hoverIdx === index ? 7 : 5} 
              fill={isDark ? "#081325" : "#ffffff"} 
              stroke={hoverIdx === index ? "#22d3ee" : "#3b82f6"} 
              strokeWidth={3.5} 
              className="transition-all duration-150"
            />
          </g>
        ))}

        {/* Guide line */}
        {hoverIdx !== null && points[hoverIdx] && (
          <line
            x1={points[hoverIdx].x}
            y1={paddingTop}
            x2={points[hoverIdx].x}
            y2={height - paddingBottom}
            stroke="#22d3ee"
            strokeWidth={1.5}
            strokeDasharray="4 2"
            className="pointer-events-none"
          />
        )}
      </svg>

      {/* Glossy Tooltip Card */}
      {hoverIdx !== null && points[hoverIdx] && (
        <div 
          style={{ 
            left: `${(points[hoverIdx].x / width) * 100}%`,
            top: `${(points[hoverIdx].y / height) * 100 - 24}%` 
          }}
          className={`absolute transform -translate-x-1/2 -translate-y-full p-3.5 rounded-2xl border text-xs font-black shadow-2xl pointer-events-none transition-all duration-150 z-20 backdrop-blur-xl ${
            isDark ? "bg-[#091b30]/90 border-cyan-500/30 text-white" : "bg-white/95 border-slate-200 text-slate-800"
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">{points[hoverIdx].label} stats</p>
          </div>
          <p className="text-base font-black text-cyan-400">₹{points[hoverIdx].val} Lakhs</p>
          <p className="text-[10px] text-slate-400 mt-0.5 font-bold">Total Bookings: {revenueTrend[hoverIdx].bookings}</p>
        </div>
      )}
    </div>
  );
}

// --- 2. Custom SVG Bar Chart with Glow Gradients ---
function CustomBarChart({ isDark }: { isDark: boolean }) {
  const width = 300;
  const height = 180;
  const paddingLeft = 35;
  const paddingBottom = 25;
  
  const chartWidth = width - paddingLeft - 10;
  const chartHeight = height - 10 - paddingBottom;
  const maxCount = 1000;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
      <defs>
        <linearGradient id="blueBarGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="cyanBarGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
        <linearGradient id="emeraldBarGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="orangeBarGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>

      {/* Grid Lines */}
      {[0, 250, 500, 750, 1000].map((val) => {
        const y = 10 + chartHeight - (val / maxCount) * chartHeight;
        return (
          <g key={val}>
            <line 
              x1={paddingLeft} 
              y1={y} 
              x2={width - 10} 
              y2={y} 
              stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"} 
              strokeWidth={1} 
            />
            <text 
              x={paddingLeft - 8} 
              y={y + 3.5} 
              textAnchor="end" 
              className={`text-[10px] font-black ${isDark ? "fill-gray-500" : "fill-slate-400"}`}
            >
              {val}
            </text>
          </g>
        );
      })}

      {/* Rounded Bars */}
      {ranksData.map((d, index) => {
        const barWidth = 30;
        const gap = (chartWidth - barWidth * ranksData.length) / (ranksData.length + 1);
        const x = paddingLeft + gap + index * (barWidth + gap);
        const barHeight = (d.count / maxCount) * chartHeight;
        const y = 10 + chartHeight - barHeight;

        return (
          <g key={index} className="group cursor-pointer">
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={d.color}
              rx={6}
              ry={6}
              className="transition-all duration-300 group-hover:brightness-110 shadow-lg"
            />
            
            {/* Value pop indicator */}
            <text
              x={x + barWidth / 2}
              y={y - 6}
              textAnchor="middle"
              className={`text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                isDark ? "fill-white" : "fill-slate-800"
              }`}
            >
              {d.count}
            </text>

            <text
              x={x + barWidth / 2}
              y={height - 8}
              textAnchor="middle"
              className={`text-[10px] font-extrabold ${isDark ? "fill-gray-400" : "fill-slate-550"}`}
            >
              {d.rank}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// --- 3. Custom SVG Donut Chart Component ---
function CustomDonutChart() {
  const radius = 32;
  const strokeWidth = 10;
  const circ = 2 * Math.PI * radius; // ~201
  let accumulatedPct = 0;

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-28 h-28 shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
          {courseDist.map((item, index) => {
            const strokeDasharray = `${circ * item.pct} ${circ * (1 - item.pct)}`;
            const strokeDashoffset = -circ * accumulatedPct;
            accumulatedPct += item.pct;

            return (
              <circle
                key={index}
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300 hover:stroke-[12px] cursor-pointer"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
          <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">Total</span>
          <span className="text-sm font-black">5.2K+</span>
        </div>
      </div>
      
      {/* Legend list */}
      <div className="space-y-2 flex-1">
        {courseDist.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-[11px] font-black">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-slate-400">{item.label}</span>
            </div>
            <span>{Math.round(item.pct * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- MAIN MASTER DASHBOARD COMPONENT ---
export default function MasterDashboard() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAPI('/master/dashboard')
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load dashboard data:", err);
        setLoading(false);
      });
  }, []);

  // Glassmorphic background and borders styles
  const glassCardStyle = isDark
    ? "bg-slate-900/60 border-slate-800/80 backdrop-blur-xl hover:border-slate-700/60"
    : "bg-white border-slate-200/80 shadow-md shadow-slate-100 hover:shadow-lg";

  const stats = [
    {
      title: "Registered Seafarers",
      value: loading ? "..." : (data?.totalSeafarers ?? 0).toLocaleString(),
      change: "+12.4%",
      icon: Users,
      color: "blue",
      grad: "from-blue-500 to-cyan-400",
      shadow: "shadow-blue-500/10",
    },
    {
      title: "Total Courses Available",
      value: loading ? "..." : (data?.totalCourses ?? 0).toString(),
      change: "+3 New",
      icon: BookOpen,
      color: "green",
      grad: "from-emerald-500 to-teal-400",
      shadow: "shadow-emerald-500/10",
    },
    {
      title: "Course Bookings",
      value: loading ? "..." : (data?.totalPurchases ?? 0).toLocaleString(),
      change: "+8.2%",
      icon: ShoppingCart,
      color: "purple",
      grad: "from-purple-500 to-indigo-400",
      shadow: "shadow-purple-500/10",
    },
    {
      title: "Platform Revenue",
      value: loading ? "..." : (data?.totalRevenue ?? "₹24.5L"),
      change: "+15.8%",
      icon: TrendingUp,
      color: "orange",
      grad: "from-orange-500 to-amber-400",
      shadow: "shadow-orange-500/10",
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 border-slate-800/40">
        <div>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
              isDark ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "bg-blue-50 text-blue-600 border border-blue-100"
            }`}>
              Master Control
            </span>
            <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-green-500" /> Database Online
            </span>
          </div>
          <h1 className={`text-3xl font-black tracking-tight mt-1.5 ${isDark ? "text-white" : "text-slate-850"}`}>
            Welcome back, Administrator
          </h1>
          <p className={`text-xs mt-0.5 font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Overviewing maritime academy bookings, crew placements, and compliance audits.
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${glassCardStyle} ${stat.shadow}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.grad} text-white shadow-md`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${
                  isDark ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-green-50 text-green-600 border border-green-100"
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-450" : "text-slate-500"}`}>
                {stat.title}
              </p>
              <p className={`text-3xl font-black mt-2 tracking-tight bg-gradient-to-r ${stat.grad} bg-clip-text text-transparent`}>
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Exploratory Data Analysis & EDA Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Line Chart: Revenue Trend */}
        <div className={`lg:col-span-2 p-6 rounded-3xl border transition-all duration-300 ${glassCardStyle}`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                <LineIcon className="w-5 h-5 text-cyan-400" /> Platform Revenue & Booking Growth
              </h3>
              <p className={`text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                Exploratory data analysis of modular course purchase conversions.
              </p>
            </div>
            <div className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold ${
              isDark ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "bg-blue-50 text-blue-600 border border-blue-100"
            }`}>
              <Calendar className="w-3.5 h-3.5" /> H1 2026 Analytics
            </div>
          </div>
          <CustomLineChart isDark={isDark} />
        </div>

        {/* Bar & Donut Grid Column */}
        <div className="space-y-6">
          
          {/* Seafarer Ranks Bar Chart */}
          <div className={`p-6 rounded-3xl border transition-all duration-300 ${glassCardStyle}`}>
            <h3 className={`text-base font-bold mb-1 flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
              <BarIcon className="w-4.5 h-4.5 text-blue-500" /> Seafarer Ranks
            </h3>
            <p className={`text-[11px] mb-4 ${isDark ? "text-gray-400" : "text-slate-550"}`}>
              Registered profiles categorized by ranks.
            </p>
            <CustomBarChart isDark={isDark} />
          </div>

          {/* Course Categories Donut Chart */}
          <div className={`p-6 rounded-3xl border transition-all duration-300 ${glassCardStyle}`}>
            <h3 className={`text-base font-bold mb-1 flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
              <PieIcon className="w-4.5 h-4.5 text-teal-500" /> Course Share
            </h3>
            <p className={`text-[11px] mb-4 ${isDark ? "text-gray-400" : "text-slate-555"}`}>
              Segment purchase share metrics.
            </p>
            <CustomDonutChart />
          </div>

        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Latest Registrations */}
        <div className={`p-6 rounded-3xl border transition-all duration-300 ${glassCardStyle}`}>
          <h3 className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
            Recent Registrations
          </h3>
          <div className="space-y-4.5">
            {loading ? (
              <div className="text-xs text-slate-500">Loading registrations...</div>
            ) : (data?.recentRegistrations || []).length === 0 ? (
              <div className="text-xs text-slate-500">No recent registrations</div>
            ) : (data.recentRegistrations || []).map((reg: any, idx: number) => {
              const colors = [
                "bg-blue-500/20 text-blue-400",
                "bg-emerald-500/20 text-emerald-400",
                "bg-purple-500/20 text-purple-400",
                "bg-amber-500/20 text-amber-400"
              ];
              const colorClass = colors[idx % colors.length];
              const initial = reg.name ? reg.name.charAt(0).toUpperCase() : "?";
              return (
                <div key={reg.id || idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${colorClass}`}>
                      {initial}
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-800"}`}>{reg.name}</p>
                      <p className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-550"}`}>{reg.email}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold ${isDark ? "text-slate-550" : "text-slate-400"}`}>{reg.date}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Purchases */}
        <div className={`p-6 rounded-3xl border transition-all duration-300 ${glassCardStyle}`}>
          <h3 className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
            Recent Purchases
          </h3>
          <div className="space-y-4.5">
            {loading ? (
              <div className="text-xs text-slate-500">Loading purchases...</div>
            ) : (data?.recentPurchases || []).length === 0 ? (
              <div className="text-xs text-slate-500">No recent purchases</div>
            ) : (data.recentPurchases || []).map((purchase: any, idx: number) => (
              <div key={purchase.id || idx} className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-bold truncate max-w-[180px] ${isDark ? "text-white" : "text-slate-800"}`}>
                    {purchase.course}
                  </p>
                  <p className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-550"}`}>{purchase.user}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-black ${isDark ? "text-green-400" : "text-green-600"}`}>{purchase.amount}</p>
                  <span className={`text-[9px] font-black uppercase ${
                    purchase.status === "Completed" ? "text-green-500" : "text-yellow-500 animate-pulse"
                  }`}>{purchase.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Added Courses */}
        <div className={`p-6 rounded-3xl border transition-all duration-300 ${glassCardStyle}`}>
          <h3 className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
            Recently Added Modules
          </h3>
          <div className="space-y-4.5">
            {recentCourses.map((course) => (
              <div key={course.id} className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
                    {course.title}
                  </p>
                  <p className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>{course.category}</p>
                </div>
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-lg border ${
                  course.status === "Active"
                    ? isDark
                      ? "bg-green-500/10 border-green-500/20 text-green-400"
                      : "bg-green-50 border-green-200 text-green-600"
                    : isDark
                    ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                    : "bg-yellow-50 border-yellow-200 text-yellow-600"
                }`}>
                  {course.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
          Quick Operations Control
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              className={`p-5 rounded-2xl border-2 border-dashed transition-all hover:border-solid cursor-pointer text-left ${
                isDark
                  ? "border-slate-800 hover:bg-slate-900/40 hover:border-cyan-500/40"
                  : "border-slate-350 hover:bg-slate-100 hover:border-blue-500 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-xl ${
                    isDark ? "bg-slate-800/80 text-cyan-400" : "bg-slate-200/80 text-blue-600"
                  }`}>
                    {action.icon}
                  </div>
                  <div>
                    <span className={`block font-bold text-sm ${isDark ? "text-white" : "text-slate-800"}`}>
                      {action.label}
                    </span>
                    <span className={`block text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      {action.desc}
                    </span>
                  </div>
                </div>
                <ArrowRight className={`w-4.5 h-4.5 ${isDark ? "text-gray-500" : "text-slate-400"}`} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
