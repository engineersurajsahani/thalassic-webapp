"use client";

import React, { useMemo } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  mockSeafarers,
  mockNotifications,
} from "@/components/company-admin/mockData";
import StatsCard from "@/components/company-admin/StatsCard";
import StatusBadge from "@/components/company-admin/StatusBadge";
import {
  Users,
  BookOpen,
  FileCheck,
  ClipboardList,
  AlertTriangle,
  Award,
  Calendar,
} from "lucide-react";
import dynamic from "next/dynamic";
import ChartSkeleton from "@/components/ui/ChartSkeleton";

const DocumentVerificationChart = dynamic(
  () => import("@/components/company-admin/DocumentVerificationChart"),
  {
    ssr: false,
    loading: () => <ChartSkeleton height="160px" />,
  },
);

export default function DashboardPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Calculate dynamic stats from mock data
  const totalSeafarers = mockSeafarers.length;
  const activeCourses = mockSeafarers.reduce(
    (acc, sf) =>
      acc +
      sf.courses.filter(
        (c) => c.status === "Completed" || c.status === "In Progress",
      ).length,
    0,
  );
  const pendingDocs = mockSeafarers.reduce(
    (acc, sf) =>
      acc + sf.documents.filter((d) => d.status === "Pending").length,
    0,
  );
  const activeApplications = mockSeafarers.filter(
    (sf) => sf.status === "Pending",
  ).length;

  // Dynamic Upcoming Expiries List
  const upcomingExpiries = useMemo(() => {
    const list: Array<{
      seafarerName: string;
      rank: string;
      docName: string;
      expiryDate: string;
      daysLeft: number;
    }> = [];
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
    const completions: Array<{
      seafarerName: string;
      rank: string;
      courseName: string;
      code: string;
      date: string;
    }> = [];
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
    return completions.slice(0, 5); // Increased to 5 to fill space beautifully
  }, []);

  // Chart Data: Document Verification Statuses
  const docStatusCounts = mockSeafarers.reduce(
    (acc: Record<string, number>, sf) => {
      sf.documents.forEach((d) => {
        acc[d.status] = (acc[d.status] || 0) + 1;
      });
      return acc;
    },
    { Approved: 0, Pending: 0, Rejected: 0, Expiring: 0 },
  );

  const documentStatusData = Object.keys(docStatusCounts).map((key) => ({
    name: key,
    value: docStatusCounts[key],
  }));

  // Color Palette
  const COLORS = isDark
    ? ["#38bdf8", "#fbbf24", "#f43f5e", "#10b981"] // sky-400, amber-400, rose-500, emerald-500
    : ["#0284c7", "#d97706", "#e11d48", "#059669"]; // sky-600, amber-600, rose-600, emerald-600

  const cardClasses = `p-5 rounded-xl border transition-all duration-200 hover:shadow-sm ${
    isDark
      ? "bg-[#0c1a2e] border-white/5 text-white"
      : "bg-white border-slate-200 text-slate-800"
  }`;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-800"}`}
          >
            Company Dashboard
          </h1>
          <p
            className={`text-[11px] mt-0.5 ${isDark ? "text-white/40" : "text-slate-500"}`}
          >
            Monitor your shipping crew&apos;s certifications, courses, and
            compliance status.
          </p>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Seafarers"
          value={totalSeafarers}
          icon={Users}
        />
        <StatsCard
          title="Active Courses"
          value={activeCourses}
          icon={BookOpen}
        />
        <StatsCard
          title="Pending Documents"
          value={pendingDocs}
          icon={FileCheck}
        />
        <StatsCard
          title="Active Applications"
          value={activeApplications}
          icon={ClipboardList}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Verification & Notices */}
        <div className="space-y-6">
          {/* Document Status Pie Chart */}
          <div className={cardClasses}>
            <h3 className="text-xs font-bold uppercase tracking-wider opacity-60 mb-4">
              Document Verification Status
            </h3>
            <DocumentVerificationChart
              data={documentStatusData}
              colors={COLORS}
              isDark={isDark}
            />
            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 mt-4 text-[10px]">
              {documentStatusData.map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center gap-1.5 justify-start"
                >
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

          {/* Urgent Notices Panel */}
          <div className={cardClasses}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-500 mb-3">
              Urgent Safety Notices
            </h3>
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
                      <span className="text-[9px] opacity-50 block mt-1">
                        {n.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Column 2: Registrations & Expiries */}
        <div className="space-y-6">
          {/* Recent Registrations list */}
          <div className={cardClasses}>
            <h3 className="text-xs font-bold uppercase tracking-wider opacity-60 mb-3">
              Recent Registrations
            </h3>
            <div className="space-y-3">
              {recentRegistrations.map((sf) => (
                <div
                  key={sf.id}
                  className="flex items-center justify-between p-2 rounded-lg border border-slate-100 dark:border-white/3 hover:bg-slate-50 dark:hover:bg-white/3 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center text-[10px] font-black uppercase shrink-0">
                      {sf.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">{sf.name}</p>
                      <p className="text-[10px] opacity-50 truncate">
                        {sf.rank} • {sf.dept}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={sf.status} />
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Document Expiries */}
          <div className={cardClasses}>
            <h3 className="text-xs font-bold uppercase tracking-wider opacity-60 mb-3">
              Upcoming Expiries
            </h3>
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
                      <strong className="truncate font-bold leading-none">
                        {exp.seafarerName}
                      </strong>
                      <span className="text-[10px] opacity-50 shrink-0 font-medium">
                        {exp.rank}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] opacity-70">
                      <span className="truncate pr-2">{exp.docName}</span>
                      <span className="text-red-400 font-bold shrink-0">
                        In {exp.daysLeft}d
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Column 3: Completions */}
        <div className="space-y-6">
          {/* Latest Course Completions */}
          <div className={cardClasses}>
            <h3 className="text-xs font-bold uppercase tracking-wider opacity-60 mb-3">
              Latest Course Completions
            </h3>
            <div className="space-y-3">
              {latestCompletions.map((comp, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-100 dark:border-white/3 hover:bg-slate-50 dark:hover:bg-white/3 transition-colors"
                >
                  <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400 mt-0.5 shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold leading-tight truncate">
                      {comp.courseName}
                    </p>
                    <p className="text-[10px] opacity-60 mt-1 truncate">
                      Completed by: <strong>{comp.seafarerName}</strong> (
                      {comp.rank})
                    </p>
                    <p className="text-[9px] opacity-40 mt-1.5 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Expires: {comp.date}
                    </p>
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
