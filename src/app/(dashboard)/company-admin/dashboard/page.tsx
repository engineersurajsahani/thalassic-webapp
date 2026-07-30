"use client";

import React, { useMemo } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  mockSeafarers,
  mockRecentActivities,
  mockNotifications,
  ActivityLog,
} from "@/components/company-admin/mockData";
import StatsCard from "@/components/company-admin/StatsCard";
import StatusBadge from "@/components/company-admin/StatusBadge";
import {
  Users,
  BookOpen,
  FileCheck,
  AlertTriangle,
  ClipboardList,
  UserPlus,
  FileUp,
  HelpCircle,
  TrendingUp,
  Award,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function DashboardPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Calculate dynamic stats from mock data
  const totalSeafarers = mockSeafarers.length;
  const activeCourses = mockSeafarers.reduce(
    (acc, sf) =>
      acc + sf.courses.filter((c) => c.status === "Completed" || c.status === "In Progress").length,
    0
  );
  const pendingDocs = mockSeafarers.reduce(
    (acc, sf) => acc + sf.documents.filter((d) => d.status === "Pending").length,
    0
  );
  const expiringCerts = mockSeafarers.reduce(
    (acc, sf) => acc + sf.documents.filter((d) => d.status === "Expiring" || d.status === "Expired").length,
    0
  );
  const activeApplications = mockSeafarers.filter((sf) => sf.status === "Pending").length;

  // Dynamic Upcoming Expiries List
  const upcomingExpiries = useMemo(() => {
    const list: Array<{ seafarerName: string; rank: string; docName: string; expiryDate: string; daysLeft: number }> = [];
    const today = new Date();
    mockSeafarers.forEach((sf) => {
      sf.documents.forEach((d) => {
        if (d.status === "Expiring") {
          const expDate = new Date(d.expiryDate);
          const diffTime = expDate.getTime() - today.getTime();
          const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          list.push({
            seafarerName: sf.name,
            rank: sf.rank,
            docName: d.name,
            expiryDate: d.expiryDate,
            daysLeft,
          });
        }
      });
    });
    return list.sort((a, b) => a.daysLeft - b.daysLeft);
  }, []);

  // Dynamic Recent Registrations List
  const recentRegistrations = useMemo(() => {
    return mockSeafarers.slice(0, 4).map((sf) => ({
      id: sf.id,
      name: sf.name,
      rank: sf.rank,
      dept: sf.department,
      status: sf.status,
    }));
  }, []);

  // Dynamic Latest Course Completions
  const latestCompletions = useMemo(() => {
    const completions: Array<{ seafarerName: string; rank: string; courseName: string; code: string; date: string }> = [];
    mockSeafarers.forEach((sf) => {
      sf.courses.forEach((c) => {
        if (c.status === "Completed") {
          completions.push({
            seafarerName: sf.name,
            rank: sf.rank,
            courseName: c.name,
            code: c.code,
            date: c.expiryDate || c.assignedDate,
          });
        }
      });
    });
    return completions.slice(0, 3);
  }, []);

  // Dynamic Recent Document Verifications
  const recentVerifications = useMemo(() => {
    const verifications: Array<{ seafarerName: string; docName: string; status: "Pending" | "Approved" | "Rejected" | "Expiring"; date: string }> = [];
    mockSeafarers.forEach((sf) => {
      sf.documents.forEach((d) => {
        verifications.push({
          seafarerName: sf.name,
          docName: d.name,
          status: d.status,
          date: d.issueDate,
        });
      });
    });
    return verifications.slice(0, 3);
  }, []);

  // Chart Data 1: Seafarers by Department
  const deptCounts = mockSeafarers.reduce((acc: Record<string, number>, sf) => {
    acc[sf.department] = (acc[sf.department] || 0) + 1;
    return acc;
  }, {});

  const departmentData = Object.keys(deptCounts).map((key) => ({
    name: key,
    count: deptCounts[key],
  }));

  // Chart Data 2: Document Verification Statuses
  const docStatusCounts = mockSeafarers.reduce(
    (acc: Record<string, number>, sf) => {
      sf.documents.forEach((d) => {
        acc[d.status] = (acc[d.status] || 0) + 1;
      });
      return acc;
    },
    { Approved: 0, Pending: 0, Rejected: 0, Expiring: 0 }
  );

  const documentStatusData = Object.keys(docStatusCounts).map((key) => ({
    name: key,
    value: docStatusCounts[key],
  }));

  // Color Palette
  const COLORS = isDark
    ? ["#38bdf8", "#fbbf24", "#f43f5e", "#10b981"] // sky-400, amber-400, rose-500, emerald-500
    : ["#0284c7", "#d97706", "#e11d48", "#059669"]; // sky-600, amber-600, rose-600, emerald-600

  // Quick Actions
  const quickActions = [
    { label: "Register Seafarer", icon: UserPlus, href: "/company-admin/seafearers?action=add" },
    { label: "Verify Documents", icon: FileUp, href: "/company-admin/documents" },
    { label: "Request Support", icon: HelpCircle, href: "/company-admin/support" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-800"}`}>
            Company Dashboard
          </h1>
          <p className={`text-[11px] mt-0.5 ${isDark ? "text-white/40" : "text-slate-500"}`}>
            Monitor your shipping crew's certifications, courses, and compliance status.
          </p>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          title="Total Seafarers"
          value={totalSeafarers}
          icon={Users}
          change="+1"
          changeType="positive"
          description="registered seafarers"
        />
        <StatsCard
          title="Active Courses"
          value={activeCourses}
          icon={BookOpen}
          change="84%"
          changeType="positive"
          description="compliance rate"
        />
        <StatsCard
          title="Pending Documents"
          value={pendingDocs}
          icon={FileCheck}
          change={pendingDocs > 0 ? "Action required" : "All clear"}
          changeType={pendingDocs > 0 ? "negative" : "positive"}
          description="verifications waiting"
        />
        <StatsCard
          title="Expiring Certificates"
          value={expiringCerts}
          icon={AlertTriangle}
          change="Within 90 days"
          changeType="negative"
          description="renewals recommended"
        />
        <StatsCard
          title="Active Applications"
          value={activeApplications}
          icon={ClipboardList}
          changeType="neutral"
          description="candidates vetting"
        />
      </div>

      {/* Main Grid: Charts & Timelines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Department Distribution Bar Chart */}
        <div
          className={`p-5 rounded-xl border lg:col-span-2 transition-all duration-200 hover:shadow-sm ${
            isDark ? "bg-[#0c1a2e] border-white/5 text-white" : "bg-white border-slate-200 text-slate-800"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider opacity-60">Crew Allocation by Department</h3>
            <span className={`text-[10px] flex items-center gap-1 font-semibold ${isDark ? "text-emerald-400" : "text-emerald-700"}`}>
              <TrendingUp className="w-3.5 h-3.5" />
              Live Allocation
            </span>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData}>
                <XAxis
                  dataKey="name"
                  stroke={isDark ? "#ffffff30" : "#64748b"}
                  fontSize={10}
                  tickLine={false}
                />
                <YAxis
                  stroke={isDark ? "#ffffff30" : "#64748b"}
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#0c1a2e" : "#ffffff",
                    borderColor: isDark ? "rgba(255,255,255,0.1)" : "#cbd5e1",
                    color: isDark ? "#fff" : "#000",
                    fontSize: 11,
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="count" fill="#38bdf8" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Document Status Pie Chart */}
        <div
          className={`p-5 rounded-xl border transition-all duration-200 hover:shadow-sm ${
            isDark ? "bg-[#0c1a2e] border-white/5 text-white" : "bg-white border-slate-200 text-slate-800"
          }`}
        >
          <h3 className="text-xs font-bold uppercase tracking-wider opacity-60 mb-4">Document Verification Status</h3>
          <div className="h-40 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={documentStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={60}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {documentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#0c1a2e" : "#ffffff",
                    borderColor: isDark ? "rgba(255,255,255,0.1)" : "#cbd5e1",
                    color: isDark ? "#fff" : "#000",
                    fontSize: 11,
                    borderRadius: 8,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mt-4 text-[10px]">
            {documentStatusData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-1.5 justify-start">
                <span
                  className="w-2 h-2 rounded-sm shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className={isDark ? "text-white/60" : "text-slate-600"}>
                  {item.name}: <strong>{item.value}</strong>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Recent Activity Timeline & Details Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Activity & Completions */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Connected Activity Timeline */}
          <div
            className={`p-5 rounded-xl border transition-all duration-200 hover:shadow-sm ${
              isDark ? "bg-[#0c1a2e] border-white/5 text-white" : "bg-white border-slate-200 text-slate-800"
            }`}
          >
            <h3 className="text-xs font-bold uppercase tracking-wider opacity-60 mb-5">Recent Activity Timeline</h3>
            <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-white/5">
              {mockRecentActivities.map((act) => (
                <div key={act.id} className="relative flex items-start gap-4 text-xs">
                  {/* Indicator Dot */}
                  <span
                    className={`absolute left-[-20px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ${
                      isDark ? "ring-[#0c1a2e]" : "ring-white"
                    } ${
                      act.type === "course"
                        ? "bg-emerald-500"
                        : act.type === "document"
                        ? "bg-sky-500"
                        : act.type === "support"
                        ? "bg-amber-500"
                        : "bg-purple-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0 bg-slate-50 dark:bg-white/3 p-3 rounded-lg border border-slate-100 dark:border-white/5">
                    <p className={isDark ? "text-white/80" : "text-slate-700"}>
                      <strong className={isDark ? "text-white font-bold" : "text-slate-900 font-bold"}>
                        {act.seafarerName}
                      </strong>{" "}
                      — {act.activity}
                    </p>
                    <span className={`text-[10px] mt-1 flex items-center gap-1.5 opacity-40`}>
                      <Clock className="w-3 h-3" />
                      {act.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Registrations & Completions Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Recent Registrations list */}
            <div
              className={`p-5 rounded-xl border transition-all duration-200 hover:shadow-sm ${
                isDark ? "bg-[#0c1a2e] border-white/5 text-white" : "bg-white border-slate-200 text-slate-800"
              }`}
            >
              <h3 className="text-xs font-bold uppercase tracking-wider opacity-60 mb-3">Recent Registrations</h3>
              <div className="space-y-3">
                {recentRegistrations.map((sf) => (
                  <div
                    key={sf.id}
                    className="flex items-center justify-between p-2 rounded-lg border border-slate-100 dark:border-white/3 hover:bg-slate-50 dark:hover:bg-white/3 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center text-[10px] font-black uppercase shrink-0">
                        {sf.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate">{sf.name}</p>
                        <p className="text-[10px] opacity-50 truncate">{sf.rank} • {sf.dept}</p>
                      </div>
                    </div>
                    <StatusBadge status={sf.status} />
                  </div>
                ))}
              </div>
            </div>

            {/* Latest Course Completions */}
            <div
              className={`p-5 rounded-xl border transition-all duration-200 hover:shadow-sm ${
                isDark ? "bg-[#0c1a2e] border-white/5 text-white" : "bg-white border-slate-200 text-slate-800"
              }`}
            >
              <h3 className="text-xs font-bold uppercase tracking-wider opacity-60 mb-3">Latest Course Completions</h3>
              <div className="space-y-3">
                {latestCompletions.map((comp, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-2 rounded-lg border border-slate-100 dark:border-white/3 hover:bg-slate-50 dark:hover:bg-white/3 transition-colors"
                  >
                    <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-400 mt-0.5 shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold leading-tight truncate">{comp.courseName}</p>
                      <p className="text-[10px] opacity-60 mt-0.5 truncate">
                        Completed by: <strong>{comp.seafarerName}</strong> ({comp.rank})
                      </p>
                      <p className="text-[9px] opacity-40 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Expires: {comp.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Actions, Upcoming Expiries, Urgent notices */}
        <div className="space-y-6">
          
          {/* Quick Actions Panel */}
          <div
            className={`p-5 rounded-xl border transition-all duration-200 hover:shadow-sm ${
              isDark ? "bg-[#0c1a2e] border-white/5 text-white" : "bg-white border-slate-200 text-slate-800"
            }`}
          >
            <h3 className="text-xs font-bold uppercase tracking-wider opacity-60 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <a
                    key={action.label}
                    href={action.href}
                    className={`group flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-xs font-semibold border transition-all duration-150 ${
                      isDark
                        ? "border-white/5 bg-white/3 text-white hover:bg-white/8"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-colors ${isDark ? "text-sky-400 group-hover:text-sky-355" : "text-sky-600 group-hover:text-sky-750"}`} />
                      {action.label}
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Upcoming Document Expiries */}
          <div
            className={`p-5 rounded-xl border transition-all duration-200 hover:shadow-sm ${
              isDark ? "bg-[#0c1a2e] border-white/5 text-white" : "bg-white border-slate-200 text-slate-800"
            }`}
          >
            <h3 className="text-xs font-bold uppercase tracking-wider opacity-60 mb-3">Upcoming Expiries</h3>
            <div className="space-y-3">
              {upcomingExpiries.length === 0 ? (
                <div className="text-center py-6 text-[10px] text-slate-400">
                  No expiring documents in near term
                </div>
              ) : (
                upcomingExpiries.slice(0, 3).map((exp, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg border border-slate-100 dark:border-white/3 space-y-1.5 text-[11px] leading-relaxed"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <strong className="truncate font-bold leading-none">{exp.seafarerName}</strong>
                      <span className="text-[10px] opacity-50 shrink-0 font-medium">{exp.rank}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] opacity-70">
                      <span className="truncate pr-2">{exp.docName}</span>
                      <span className="text-red-400 font-bold shrink-0">In {exp.daysLeft}d</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Urgent Notices Panel */}
          <div
            className={`p-5 rounded-xl border transition-all duration-200 hover:shadow-sm ${
              isDark ? "bg-[#0c1a2e] border-white/5 text-white" : "bg-white border-slate-200 text-slate-800"
            }`}
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-500 mb-3">Urgent Safety Notices</h3>
            <div className="space-y-3">
              {mockNotifications
                .filter((n) => n.type === "warning" || n.type === "danger")
                .slice(0, 2)
                .map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 rounded-lg border text-[11px] leading-relaxed flex items-start gap-2.5 transition-all ${
                      isDark
                        ? "bg-red-500/5 border-red-500/10 text-red-200"
                        : "bg-red-50 border-red-100 text-red-800"
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{n.message}</p>
                      <span className="text-[9px] opacity-50 block mt-1">{n.timestamp}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
