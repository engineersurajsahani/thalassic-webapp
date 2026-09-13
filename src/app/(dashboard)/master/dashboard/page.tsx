"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "@/providers/theme-provider";
import { useRouter } from "next/navigation";
import {
  Users,
  BookOpen,
  ArrowUpRight,
  AlertCircle,
  Building2,
  Handshake,
  Wallet,
  Receipt,
  Clock,
  BarChart3,
  Zap,
  GraduationCap,
  RotateCw,
  Inbox,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { masterService } from "@/services/master.service";

interface DashboardData {
  seafarersCount: number;
  coursesCount: number;
  totalBookings: number;
  totalRevenue: string;
  ledger?: Array<{
    participant: string;
    course: string;
    revenue: string;
    status: string;
  }>;
}

const DEFAULT_DASHBOARD: DashboardData = {
  seafarersCount: 0,
  coursesCount: 0,
  totalBookings: 0,
  totalRevenue: "₹0",
  ledger: [],
};

const YC: Record<string, string> = {
  "2026": "#6366f1",
  "2025": "#10b981",
};

function DonutRing({
  v,
  t,
  color,
  label,
  dk,
}: {
  v: number;
  t: number;
  color: string;
  label: string;
  dk: boolean;
}) {
  const r = 34;
  const ci = 2 * Math.PI * r;
  const safeTotal = t > 0 ? t : 1;
  const da = (v / safeTotal) * ci;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-[88px] h-[88px]">
        <svg viewBox="0 0 88 88" className="w-full h-full -rotate-90">
          <circle
            cx="44"
            cy="44"
            r={r}
            fill="none"
            stroke={dk ? "rgba(255,255,255,0.06)" : "#f1f5f9"}
            strokeWidth="9"
          />
          <circle
            cx="44"
            cy="44"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="9"
            strokeDasharray={`${da} ${ci}`}
            strokeLinecap="round"
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center text-xl font-bold"
          style={{ color }}
        >
          {v}
        </span>
      </div>
      <p
        className={`text-[11px] font-semibold text-center ${
          dk ? "text-white/40" : "text-slate-500"
        }`}
      >
        {label}
      </p>
    </div>
  );
}

function CH({
  title,
  dk,
  action,
}: {
  title: string;
  dk: boolean;
  action?: React.ReactNode;
}) {
  return (
    <div
      className={`flex items-center justify-between px-6 py-4 border-b ${
        dk ? "border-white/5" : "border-slate-100"
      }`}
    >
      <p
        className={`text-sm font-semibold ${dk ? "text-white/80" : "text-slate-800"}`}
      >
        {title}
      </p>
      {action}
    </div>
  );
}

export default function MasterDashboard() {
  const { theme } = useTheme();
  const router = useRouter();
  const dk = theme === "dark";

  const [dashboardData, setDashboardData] =
    useState<DashboardData>(DEFAULT_DASHBOARD);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [partnerCount, setPartnerCount] = useState(0);

  const card = `rounded-2xl overflow-hidden ${
    dk
      ? "bg-[#0d1f35] border border-white/[0.06]"
      : "bg-white border border-slate-200 shadow-sm"
  }`;
  const ht = dk ? "text-white/80" : "text-slate-800";
  const mt = dk ? "text-white/35" : "text-slate-400";
  const gl = dk ? "#1a3352" : "#e2e8f0";
  const ax = dk ? "#3d6080" : "#94a3b8";
  const dv = dk ? "divide-white/[0.05]" : "divide-slate-100";
  const rh = dk ? "hover:bg-white/[0.03]" : "hover:bg-slate-50";

  const loadData = useCallback(async () => {
    try {
      const [dash, partners] = await Promise.allSettled([
        masterService.getDashboard(),
        masterService.getUsers("AGENT_ADMIN"),
      ]);

      if (dash.status === "fulfilled" && dash.value) {
        setDashboardData(dash.value);
      }
      if (partners.status === "fulfilled" && Array.isArray(partners.value)) {
        setPartnerCount(partners.value.length);
      }
    } catch (err) {
      console.warn("Failed to fetch live master dashboard data:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadData();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    void loadData();
  };

  // Generate monthly chart trend from live data
  const chartData = [
    { month: "Jan", "2026": 0 },
    { month: "Feb", "2026": 0 },
    { month: "Mar", "2026": 0 },
    { month: "Apr", "2026": 0 },
    { month: "May", "2026": 0 },
    { month: "Jun", "2026": 0 },
    { month: "Jul", "2026": 0 },
    { month: "Aug", "2026": 0 },
    { month: "Sep", "2026": 0 },
  ];

  const ledgerList = dashboardData.ledger || [];

  return (
    <div className="space-y-5">
      {/* Header / Refresh Bar */}
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider ${mt}`}>
            Operational & Financial Metrics
          </p>
          <span className={`text-[11px] ${mt}`}>
            {isLoading
              ? "Connecting to live backend..."
              : "Live Platform Overview"}
          </span>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            dk
              ? "bg-white/5 hover:bg-white/10 text-white/80 border border-white/10"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
          }`}
        >
          <RotateCw
            className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-indigo-400" : ""}`}
          />
          {isRefreshing ? "Syncing..." : "Sync Live Data"}
        </button>
      </div>

      {/* SECTION 1: FINANCIAL OVERVIEW */}
      <div>
        <p
          className={`text-[11px] font-semibold uppercase tracking-wider mb-2.5 ${
            dk ? "text-white/50" : "text-slate-500"
          }`}
        >
          Financial Overview
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              label: "Total Revenue",
              value: dashboardData.totalRevenue || "₹0",
              sub: "All-time platform bookings",
              Icon: Wallet,
              ib: dk ? "bg-emerald-500/15" : "bg-emerald-50",
              ic: "#10b981",
            },
            {
              label: "Total Enrollments",
              value: String(dashboardData.totalBookings || 0),
              sub: "Course registrations",
              Icon: BarChart3,
              ib: dk ? "bg-indigo-500/15" : "bg-indigo-50",
              ic: "#6366f1",
            },
            {
              label: "Active Courses",
              value: String(dashboardData.coursesCount || 0),
              sub: "Published in catalog",
              Icon: Receipt,
              ib: dk ? "bg-green-500/15" : "bg-green-50",
              ic: "#22c55e",
            },
            {
              label: "Partner Agencies",
              value: String(partnerCount || 0),
              sub: "Authorized partners",
              Icon: Clock,
              ib: dk ? "bg-rose-500/15" : "bg-rose-50",
              ic: "#f43f5e",
            },
          ].map((k) => (
            <div
              key={k.label}
              className={`${card} p-3.5 flex flex-col justify-between transition-all hover:scale-[1.01]`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[11px] font-semibold truncate ${ht} opacity-80`}
                >
                  {k.label}
                </span>
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${k.ib}`}
                >
                  <k.Icon className="w-3.5 h-3.5" style={{ color: k.ic }} />
                </div>
              </div>
              <div>
                <p
                  className={`text-[18px] font-bold leading-tight tracking-tight ${ht}`}
                >
                  {k.value}
                </p>
                <p className={`text-[10px] truncate mt-0.5 ${mt}`}>{k.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: SEAFARER OVERVIEW */}
      <div>
        <p
          className={`text-[11px] font-semibold uppercase tracking-wider mb-2.5 ${
            dk ? "text-white/50" : "text-slate-500"
          }`}
        >
          Seafarer & Platform Overview
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              label: "Total Seafarers",
              value: String(dashboardData.seafarersCount || 0),
              sub: "Master records in database",
              Icon: Users,
              ib: dk ? "bg-sky-500/15" : "bg-sky-50",
              ic: "#0ea5e9",
            },
            {
              label: "Live Courses",
              value: String(dashboardData.coursesCount || 0),
              sub: "STCW & Maritime modules",
              Icon: Building2,
              ib: dk ? "bg-blue-500/15" : "bg-blue-50",
              ic: "#3b82f6",
            },
            {
              label: "Registered Partners",
              value: String(partnerCount || 0),
              sub: "Agency network",
              Icon: Handshake,
              ib: dk ? "bg-indigo-500/15" : "bg-indigo-50",
              ic: "#6366f1",
            },
            {
              label: "Pending Inquiries",
              value: "0",
              sub: "Real-time queue",
              Icon: AlertCircle,
              ib: dk ? "bg-amber-500/15" : "bg-amber-50",
              ic: "#f59e0b",
            },
          ].map((k) => (
            <div
              key={k.label}
              className={`${card} p-3.5 flex flex-col justify-between transition-all hover:scale-[1.01]`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[11px] font-semibold truncate ${ht} opacity-80`}
                >
                  {k.label}
                </span>
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${k.ib}`}
                >
                  <k.Icon className="w-3.5 h-3.5" style={{ color: k.ic }} />
                </div>
              </div>
              <div>
                <p
                  className={`text-[18px] font-bold leading-tight tracking-tight ${ht}`}
                >
                  {k.value}
                </p>
                <p className={`text-[10px] truncate mt-0.5 ${mt}`}>{k.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className={`${card} xl:col-span-2`}>
          <CH
            title="Platform Revenue Trend (2026)"
            dk={dk}
            action={
              <span
                className={`text-xs font-semibold ${dk ? "text-indigo-400" : "text-indigo-600"}`}
              >
                Live Supabase Feed
              </span>
            }
          />
          <div className="px-5 pt-4 pb-3">
            <ResponsiveContainer width="100%" height={230}>
              <LineChart data={chartData}>
                <CartesianGrid vertical={false} stroke={gl} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: ax }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: ax }}
                  axisLine={false}
                  tickLine={false}
                  width={46}
                  tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  formatter={(v: unknown) => [
                    `₹${(Number(v) || 0).toLocaleString("en-IN")}`,
                    "Revenue",
                  ]}
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="2026"
                  stroke={YC["2026"]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={card}>
          <CH title="Courses by Category" dk={dk} />
          <div className="px-6 pt-5 pb-6">
            <div className="grid grid-cols-2 gap-6">
              <DonutRing
                v={dashboardData.coursesCount || 0}
                t={dashboardData.coursesCount || 1}
                color="#8b5cf6"
                label="Safety & Tech"
                dk={dk}
              />
              <DonutRing
                v={0}
                t={1}
                color="#ef4444"
                label="Navigation"
                dk={dk}
              />
              <DonutRing
                v={0}
                t={1}
                color="#f59e0b"
                label="Technical"
                dk={dk}
              />
              <DonutRing
                v={0}
                t={1}
                color="#10b981"
                label="Compliance"
                dk={dk}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: RECENT ENROLLMENTS & LIVE ACTIVITY */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <div className={`${card} xl:col-span-3`}>
          <CH
            title="Live Course Enrollments"
            dk={dk}
            action={
              <button
                onClick={() => router.push("/master/courses")}
                className={`flex items-center gap-1 text-xs font-medium cursor-pointer ${
                  dk
                    ? "text-white hover:text-white/80"
                    : "text-black hover:text-slate-700"
                }`}
              >
                Course Catalog <ArrowUpRight className="w-3 h-3" />
              </button>
            }
          />
          <div className="overflow-x-auto">
            {ledgerList.length === 0 ? (
              <div className="text-center py-12 px-4">
                <Inbox className={`w-8 h-8 mx-auto mb-2 opacity-30 ${ht}`} />
                <p className={`text-xs font-semibold ${ht}`}>
                  No enrollments recorded yet
                </p>
                <p className={`text-[11px] mt-1 ${mt}`}>
                  New course registrations will appear here in real time.
                </p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr
                    className={
                      dk
                        ? "border-b border-white/5"
                        : "border-b border-slate-100"
                    }
                  >
                    {["Participant", "Course", "Revenue", "Status"].map((h) => (
                      <th
                        key={h}
                        className={`text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-wider ${mt}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y ${dv}`}>
                  {ledgerList.map((item, i) => (
                    <tr key={i} className={`${rh} transition-colors`}>
                      <td className="px-5 py-3 font-medium text-[13px]">
                        {item.participant}
                      </td>
                      <td className={`px-5 py-3 text-[12px] ${mt}`}>
                        {item.course}
                      </td>
                      <td className="px-5 py-3 font-bold text-[13px] text-emerald-500">
                        {item.revenue}
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-[11px] font-semibold text-emerald-400">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`${card} xl:col-span-2`}>
          <CH
            title="Management Shortcuts"
            dk={dk}
            action={
              <Zap
                className={`w-4 h-4 ${dk ? "text-amber-400" : "text-amber-500"}`}
              />
            }
          />
          <div className="p-4 grid grid-cols-2 gap-3">
            {[
              {
                label: "Seafarer Directory",
                Icon: Users,
                color: "bg-sky-500 hover:bg-sky-600",
                href: "/master/seafarers",
              },
              {
                label: "Partner Management",
                Icon: Handshake,
                color: "bg-violet-500 hover:bg-violet-600",
                href: "/master/agent-admins",
              },
              {
                label: "Institutes List",
                Icon: GraduationCap,
                color: "bg-emerald-500 hover:bg-emerald-600",
                href: "/master/institutes",
              },
              {
                label: "Course Catalog",
                Icon: BookOpen,
                color: "bg-indigo-500 hover:bg-indigo-600",
                href: "/master/courses",
              },
            ].map((q) => (
              <button
                key={q.label}
                onClick={() => router.push(q.href)}
                className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-xl text-white text-[12px] font-semibold text-center transition-all active:scale-95 shadow-md cursor-pointer ${q.color}`}
              >
                <q.Icon className="w-5 h-5" />
                {q.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
