"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useTheme } from "@/providers/theme-provider";
import StatsCard from "@/components/company-admin/StatsCard";
import { Building2, BookOpen, ArrowUpDown } from "lucide-react";
import { mockPayments } from "@/components/company-admin/mockData";
import { FilterState } from "./ReportFilterBar";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface InstituteTabProps {
  filters: FilterState;
  registerExportData: (data: Record<string, unknown>[]) => void;
}

export default function InstituteTab({
  filters,
  registerExportData,
}: InstituteTabProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [sortField, setSortField] = useState<string>("name");
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const handleSort = (field: string) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const instituteMetrics = useMemo(() => {
    const map = new Map();

    mockPayments.forEach((p) => {
      if (
        filters.institute &&
        !p.instituteName.toLowerCase().includes(filters.institute.toLowerCase())
      ) {
        return;
      }

      if (!map.has(p.instituteId)) {
        map.set(p.instituteId, {
          id: p.instituteId,
          name: p.instituteName,
          coursesBooked: 0,
          uniqueCandidates: new Set(),
          ongoingCandidates: 0,
          completedCandidates: 0,
          onHoldCandidates: 0,
        });
      }

      const inst = map.get(p.instituteId);
      inst.coursesBooked += 1;
      inst.uniqueCandidates.add(p.seafarerId);

      if (p.status === "Pending") inst.onHoldCandidates += 1;
      else if (p.status === "Paid") inst.completedCandidates += 1;
      else inst.ongoingCandidates += 1;
    });

    const data = Array.from(map.values()).map((inst) => ({
      ...inst,
      uniqueCandidateCount: inst.uniqueCandidates.size,
    }));

    data.sort((a, b) => {
      let valA: string | number = a[sortField as keyof typeof a] as
        string | number;
      let valB: string | number = b[sortField as keyof typeof b] as
        string | number;
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

    return data;
  }, [filters, sortField, sortAsc]);

  useEffect(() => {
    registerExportData(
      instituteMetrics.map((inst) => ({
        "Institute ID": inst.id,
        "Institute Name": inst.name,
        "Courses Booked": inst.coursesBooked,
        "Total Candidates": inst.uniqueCandidateCount,
        "Ongoing Candidates": inst.ongoingCandidates,
        "Completed Candidates": inst.completedCandidates,
        "On Hold Candidates": inst.onHoldCandidates,
      })),
    );
  }, [instituteMetrics, registerExportData]);

  const totalInstitutes = instituteMetrics.length;
  const totalBookings = instituteMetrics.reduce(
    (acc, curr) => acc + curr.coursesBooked,
    0,
  );

  const chartData = useMemo(() => {
    return instituteMetrics.map((inst) => ({
      name:
        inst.name.length > 15 ? inst.name.substring(0, 15) + "..." : inst.name,
      Ongoing: inst.ongoingCandidates,
      Completed: inst.completedCandidates,
      "On Hold": inst.onHoldCandidates,
    }));
  }, [instituteMetrics]);

  const COLORS = {
    Ongoing: isDark ? "#38bdf8" : "#0ea5e9",
    Completed: isDark ? "#0284c7" : "#0369a1",
    "On Hold": isDark ? "#475569" : "#94a3b8",
  };

  const cardClasses = `p-5 rounded-xl border transition-all duration-200 hover:shadow-sm ${
    isDark
      ? "bg-[#0c1a2e] border-white/5 text-white"
      : "bg-white border-slate-200 text-slate-800"
  }`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Partner Institutes"
          value={totalInstitutes}
          icon={Building2}
        />
        <StatsCard
          title="Total Institute Bookings"
          value={totalBookings}
          icon={BookOpen}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={cardClasses}>
          <h3 className="text-xs font-bold uppercase tracking-wider opacity-60 mb-4">
            Institute Performance & Activity
          </h3>
          <div className="h-64 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
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
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ fontSize: "11px" }}
                  />
                  <Bar
                    dataKey="Completed"
                    stackId="a"
                    fill={COLORS.Completed}
                  />
                  <Bar dataKey="Ongoing" stackId="a" fill={COLORS.Ongoing} />
                  <Bar dataKey="On Hold" stackId="a" fill={COLORS["On Hold"]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-xs opacity-50">
                No activity data to display.
              </div>
            )}
          </div>
        </div>

        <div className={cardClasses}>
          <h3 className="text-xs font-bold uppercase tracking-wider opacity-60 mb-4">
            Institute Operational Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr
                  className={`border-b ${isDark ? "border-white/5" : "border-slate-200"}`}
                >
                  <th
                    className="pb-3 font-semibold cursor-pointer select-none"
                    onClick={() => handleSort("name")}
                  >
                    Institute Name{" "}
                    <ArrowUpDown className="w-3 h-3 inline-block ml-1 opacity-50" />
                  </th>
                  <th
                    className="pb-3 font-semibold text-right cursor-pointer select-none"
                    onClick={() => handleSort("coursesBooked")}
                  >
                    Bookings{" "}
                    <ArrowUpDown className="w-3 h-3 inline-block ml-1 opacity-50" />
                  </th>
                  <th
                    className="pb-3 font-semibold text-right cursor-pointer select-none"
                    onClick={() => handleSort("uniqueCandidateCount")}
                  >
                    Candidates{" "}
                    <ArrowUpDown className="w-3 h-3 inline-block ml-1 opacity-50" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {instituteMetrics.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-8 text-center text-xs opacity-50"
                    >
                      No institutes found matching filters.
                    </td>
                  </tr>
                ) : (
                  instituteMetrics.map((inst) => (
                    <tr
                      key={inst.id}
                      className={`border-b last:border-0 ${isDark ? "border-white/5" : "border-slate-100"}`}
                    >
                      <td className="py-3">
                        <div
                          className="font-semibold text-[11px] truncate w-48"
                          title={inst.name}
                        >
                          {inst.name}
                        </div>
                      </td>
                      <td className="py-3 text-right">{inst.coursesBooked}</td>
                      <td className="py-3 text-right">
                        {inst.uniqueCandidateCount}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
