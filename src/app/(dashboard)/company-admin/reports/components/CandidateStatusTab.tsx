"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useTheme } from "@/providers/theme-provider";
import StatsCard from "@/components/company-admin/StatsCard";
import StatusBadge from "@/components/company-admin/StatusBadge";
import {
  PlayCircle,
  Clock,
  CheckCircle2,
  UserX,
  ArrowUpDown,
} from "lucide-react";
import { mockSeafarers } from "@/components/company-admin/mockData";
import { FilterState } from "./ReportFilterBar";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

interface CandidateStatusTabProps {
  filters: FilterState;
  registerExportData: (data: Record<string, unknown>[]) => void;
}

export default function CandidateStatusTab({
  filters,
  registerExportData,
}: CandidateStatusTabProps) {
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

  const candidates = useMemo(() => {
    let data = mockSeafarers.map((sf) => {
      let status = "Ongoing"; // Default
      if (sf.status === "Inactive") status = "Past";
      else if (sf.status === "Pending") status = "On Hold";
      else if (
        sf.courses.every((c) => c.status === "Completed") &&
        sf.courses.length > 0
      )
        status = "Completed";

      return {
        ...sf,
        candidateStatus: status,
        coursesCount: sf.courses.length,
      };
    });

    if (filters.seafarer) {
      data = data.filter((sf) =>
        sf.name.toLowerCase().includes(filters.seafarer.toLowerCase()),
      );
    }
    if (filters.status) {
      data = data.filter(
        (sf) =>
          sf.candidateStatus.toLowerCase() === filters.status.toLowerCase(),
      );
    }

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
      candidates.map((sf) => ({
        "Candidate Name": sf.name,
        Rank: sf.rank,
        Department: sf.department,
        "Courses Registered": sf.coursesCount,
        "Current Status": sf.candidateStatus,
      })),
    );
  }, [candidates, registerExportData]);

  const stats = useMemo(() => {
    return {
      ongoing: candidates.filter((c) => c.candidateStatus === "Ongoing").length,
      past: candidates.filter((c) => c.candidateStatus === "Past").length,
      onHold: candidates.filter((c) => c.candidateStatus === "On Hold").length,
      completed: candidates.filter((c) => c.candidateStatus === "Completed")
        .length,
    };
  }, [candidates]);

  const statusData = useMemo(() => {
    return [
      { name: "Ongoing", value: stats.ongoing },
      { name: "Completed", value: stats.completed },
      { name: "On Hold", value: stats.onHold },
      { name: "Past", value: stats.past },
    ].filter((s) => s.value > 0);
  }, [stats]);

  const COLORS = isDark
    ? ["#38bdf8", "#0284c7", "#475569", "#1e293b"]
    : ["#0ea5e9", "#0369a1", "#94a3b8", "#cbd5e1"];

  const cardClasses = `p-5 rounded-xl border transition-all duration-200 hover:shadow-sm ${
    isDark
      ? "bg-[#0c1a2e] border-white/5 text-white"
      : "bg-white border-slate-200 text-slate-800"
  }`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Ongoing Candidates"
          value={stats.ongoing}
          icon={PlayCircle}
        />
        <StatsCard
          title="Candidates On Hold"
          value={stats.onHold}
          icon={Clock}
        />
        <StatsCard
          title="Completed Candidates"
          value={stats.completed}
          icon={CheckCircle2}
        />
        <StatsCard title="Past Candidates" value={stats.past} icon={UserX} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={cardClasses}>
          <h3 className="text-xs font-bold uppercase tracking-wider opacity-60 mb-4">
            Candidate Status Ratio
          </h3>
          <div className="h-64 w-full">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${((percent || 0) * 100).toFixed(0)}%`
                    }
                  >
                    {statusData.map((entry, index) => (
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
            ) : (
              <div className="flex items-center justify-center h-full text-xs opacity-50">
                No status data match filters.
              </div>
            )}
          </div>
        </div>

        <div className={`lg:col-span-2 ${cardClasses}`}>
          <h3 className="text-xs font-bold uppercase tracking-wider opacity-60 mb-4">
            Candidate Status Registry
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
                    Candidate Name{" "}
                    <ArrowUpDown className="w-3 h-3 inline-block ml-1 opacity-50" />
                  </th>
                  <th
                    className="pb-3 font-semibold cursor-pointer select-none"
                    onClick={() => handleSort("rank")}
                  >
                    Rank / Dept{" "}
                    <ArrowUpDown className="w-3 h-3 inline-block ml-1 opacity-50" />
                  </th>
                  <th
                    className="pb-3 font-semibold text-center cursor-pointer select-none"
                    onClick={() => handleSort("coursesCount")}
                  >
                    Courses{" "}
                    <ArrowUpDown className="w-3 h-3 inline-block ml-1 opacity-50" />
                  </th>
                  <th
                    className="pb-3 font-semibold text-right cursor-pointer select-none"
                    onClick={() => handleSort("candidateStatus")}
                  >
                    Current Status{" "}
                    <ArrowUpDown className="w-3 h-3 inline-block ml-1 opacity-50" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {candidates.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-8 text-center text-xs opacity-50"
                    >
                      No candidates found matching filters.
                    </td>
                  </tr>
                ) : (
                  candidates.map((sf) => (
                    <tr
                      key={sf.id}
                      className={`border-b last:border-0 ${isDark ? "border-white/5" : "border-slate-100"}`}
                    >
                      <td className="py-3 font-semibold text-[12px]">
                        {sf.name}
                      </td>
                      <td className="py-3 text-[11px] opacity-80">
                        {sf.rank} ({sf.department})
                      </td>
                      <td className="py-3 text-center text-[11px] font-medium">
                        {sf.coursesCount}
                      </td>
                      <td className="py-3 text-right">
                        <StatusBadge status={sf.candidateStatus} />
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
