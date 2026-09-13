"use client";

import React, { useMemo, useEffect } from "react";
import { useTheme } from "@/providers/theme-provider";
import StatsCard from "@/components/company-admin/StatsCard";
import { Users, BookOpen, Building2, ShieldCheck } from "lucide-react";
import {
  mockSeafarers,
  mockPayments,
} from "@/components/company-admin/mockData";
import { FilterState } from "./ReportFilterBar";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface OverviewTabProps {
  filters: FilterState;
  registerExportData: (data: Record<string, unknown>[]) => void;
}

export default function OverviewTab({
  filters,
  registerExportData,
}: OverviewTabProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Filter Seafarers based on global state
  const filteredSeafarers = useMemo(() => {
    return mockSeafarers.filter((sf) => {
      let matches = true;
      if (
        filters.seafarer &&
        !sf.name.toLowerCase().includes(filters.seafarer.toLowerCase())
      )
        matches = false;

      // Filter by institute/course via courses
      if (filters.institute || filters.course) {
        const hasMatchingCourse = sf.courses.some((c) => {
          let cMatch = true;
          if (
            filters.course &&
            !c.name.toLowerCase().includes(filters.course.toLowerCase())
          )
            cMatch = false;
          // Note: Seafarer mock data doesn't directly link institute to course progress easily,
          // but we can approximate or ignore institute filter for seafarer records if needed.
          return cMatch;
        });
        if (!hasMatchingCourse) matches = false;
      }
      return matches;
    });
  }, [filters]);

  const stats = useMemo(() => {
    const totalSeafarers = filteredSeafarers.length;
    const activeSeafarers = filteredSeafarers.filter(
      (sf) => sf.status === "Active",
    ).length;

    let totalCourses = 0;
    let ongoingCourses = 0;
    filteredSeafarers.forEach((sf) => {
      totalCourses += sf.courses.length;
      ongoingCourses += sf.courses.filter(
        (c) => c.status === "In Progress",
      ).length;
    });

    const uniqueInstitutes = new Set(mockPayments.map((p) => p.instituteId))
      .size;

    return {
      totalSeafarers,
      activeSeafarers,
      totalCourses,
      ongoingCourses,
      uniqueInstitutes,
    };
  }, [filteredSeafarers]);

  const departmentData = useMemo(() => {
    const counts = filteredSeafarers.reduce(
      (acc: Record<string, number>, sf) => {
        acc[sf.department] = (acc[sf.department] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    return Object.keys(counts).map((key) => ({
      name: key,
      value: counts[key],
    }));
  }, [filteredSeafarers]);

  const courseStatusData = useMemo(() => {
    const counts = {
      Completed: 0,
      "In Progress": 0,
      "Not Started": 0,
      Expired: 0,
    };
    filteredSeafarers.forEach((sf) => {
      sf.courses.forEach((c) => {
        if (counts[c.status as keyof typeof counts] !== undefined) {
          counts[c.status as keyof typeof counts]++;
        }
      });
    });
    return Object.keys(counts).map((key) => ({
      name: key,
      value: counts[key as keyof typeof counts],
    }));
  }, [filteredSeafarers]);

  useEffect(() => {
    registerExportData([
      { Metric: "Total Candidates", Value: stats.totalSeafarers },
      { Metric: "Active Crew", Value: stats.activeSeafarers },
      { Metric: "Total Course Bookings", Value: stats.totalCourses },
      { Metric: "Ongoing Courses", Value: stats.ongoingCourses },
      { Metric: "Partner Institutes", Value: stats.uniqueInstitutes },
    ]);
  }, [stats, registerExportData]);

  const COLORS = isDark
    ? ["#38bdf8", "#0284c7", "#818cf8", "#475569", "#1e293b"]
    : ["#0ea5e9", "#0369a1", "#4f46e5", "#94a3b8", "#cbd5e1"];

  const cardClasses = `p-5 rounded-xl border transition-all duration-200 hover:shadow-sm ${
    isDark
      ? "bg-[#0c1a2e] border-white/5 text-white"
      : "bg-white border-slate-200 text-slate-800"
  }`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Candidates"
          value={stats.totalSeafarers}
          icon={Users}
        />
        <StatsCard
          title="Active Crew"
          value={stats.activeSeafarers}
          icon={ShieldCheck}
        />
        <StatsCard
          title="Total Course Bookings"
          value={stats.totalCourses}
          icon={BookOpen}
        />
        <StatsCard
          title="Partner Institutes"
          value={stats.uniqueInstitutes}
          icon={Building2}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={cardClasses}>
          <h3 className="text-xs font-bold uppercase tracking-wider opacity-60 mb-4">
            Seafarer Distribution by Department
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${((percent || 0) * 100).toFixed(0)}%`
                  }
                >
                  {departmentData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#0c1a2e" : "#ffffff",
                    borderColor: isDark ? "rgba(255,255,255,0.1)" : "#cbd5e1",
                    color: isDark ? "#fff" : "#000",
                    fontSize: 12,
                    borderRadius: 8,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={cardClasses}>
          <h3 className="text-xs font-bold uppercase tracking-wider opacity-60 mb-4">
            Global Course Progress
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={courseStatusData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke={isDark ? "rgba(255,255,255,0.5)" : "#64748b"}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke={isDark ? "rgba(255,255,255,0.5)" : "#64748b"}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{
                    fill: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.05)",
                  }}
                  contentStyle={{
                    backgroundColor: isDark ? "#0c1a2e" : "#ffffff",
                    borderColor: isDark ? "rgba(255,255,255,0.1)" : "#cbd5e1",
                    color: isDark ? "#fff" : "#000",
                    fontSize: 12,
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {courseStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
