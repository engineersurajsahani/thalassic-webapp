"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useTheme } from "@/providers/theme-provider";
import StatsCard from "@/components/company-admin/StatsCard";
import StatusBadge from "@/components/company-admin/StatusBadge";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  UserPlus,
  PlayCircle,
  ArrowUpDown,
} from "lucide-react";
import { mockSeafarers } from "@/components/company-admin/mockData";
import { FilterState } from "./ReportFilterBar";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

interface SeafarerTabProps {
  filters: FilterState;
  registerExportData: (data: Record<string, unknown>[]) => void;
}

export default function SeafarerTab({
  filters,
  registerExportData,
}: SeafarerTabProps) {
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

  const seafarersWithCandidateStatus = useMemo(() => {
    let data = mockSeafarers.map((sf) => {
      let candidateStatus = "Ongoing"; // Default
      if (sf.status === "Inactive") candidateStatus = "Past";
      else if (sf.status === "Pending") candidateStatus = "On Hold";
      else if (
        sf.courses.every((c) => c.status === "Completed") &&
        sf.courses.length > 0
      )
        candidateStatus = "Completed";

      return { ...sf, candidateStatus, coursesCount: sf.courses.length };
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
      seafarersWithCandidateStatus.map((sf) => ({
        Name: sf.name,
        Rank: sf.rank,
        Department: sf.department,
        "Courses Booked": sf.coursesCount,
        "Candidate Status": sf.candidateStatus,
      })),
    );
  }, [seafarersWithCandidateStatus, registerExportData]);

  const stats = useMemo(() => {
    return {
      total: seafarersWithCandidateStatus.length,
      active: seafarersWithCandidateStatus.filter(
        (sf) => sf.status === "Active",
      ).length,
      ongoing: seafarersWithCandidateStatus.filter(
        (sf) => sf.candidateStatus === "Ongoing",
      ).length,
      past: seafarersWithCandidateStatus.filter(
        (sf) => sf.candidateStatus === "Past",
      ).length,
      onHold: seafarersWithCandidateStatus.filter(
        (sf) => sf.candidateStatus === "On Hold",
      ).length,
      completed: seafarersWithCandidateStatus.filter(
        (sf) => sf.candidateStatus === "Completed",
      ).length,
      newRegistrations: 2, // Synthetic mock value
    };
  }, [seafarersWithCandidateStatus]);

  const statusData = useMemo(() => {
    return [
      { name: "Ongoing", value: stats.ongoing },
      { name: "Completed", value: stats.completed },
      { name: "On Hold", value: stats.onHold },
      { name: "Past", value: stats.past },
    ].filter((s) => s.value > 0);
  }, [stats]);

  const COLORS = isDark
    ? ["#38bdf8", "#10b981", "#8b5cf6", "#64748b"] // sky, emerald, violet, slate
    : ["#0284c7", "#059669", "#7c3aed", "#475569"];

  const cardClasses = `p-5 rounded-xl border transition-all duration-200 hover:shadow-sm ${
    isDark
      ? "bg-[#0c1a2e] border-white/5 text-white"
      : "bg-white border-slate-200 text-slate-800"
  }`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <StatsCard title="Total" value={stats.total} icon={Users} />
        <StatsCard title="Active" value={stats.active} icon={UserCheck} />
        <StatsCard title="Ongoing" value={stats.ongoing} icon={PlayCircle} />
        <StatsCard title="Past" value={stats.past} icon={UserX} />
        <StatsCard title="On Hold" value={stats.onHold} icon={Clock} />
        <StatsCard title="Completed" value={stats.completed} icon={UserCheck} />
        <StatsCard title="New" value={stats.newRegistrations} icon={UserPlus} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={cardClasses}>
          <h3 className="text-xs font-bold uppercase tracking-wider opacity-60 mb-4">
            Candidate Status Distribution
          </h3>
          <div className="h-64 w-full">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
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
                No status data available.
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4 text-[10px]">
            {statusData.map((item, index) => (
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

        <div className={`lg:col-span-2 ${cardClasses}`}>
          <h3 className="text-xs font-bold uppercase tracking-wider opacity-60 mb-4">
            Seafarer Operations Log
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
                    Name / Rank{" "}
                    <ArrowUpDown className="w-3 h-3 inline-block ml-1 opacity-50" />
                  </th>
                  <th
                    className="pb-3 font-semibold cursor-pointer select-none"
                    onClick={() => handleSort("department")}
                  >
                    Department{" "}
                    <ArrowUpDown className="w-3 h-3 inline-block ml-1 opacity-50" />
                  </th>
                  <th
                    className="pb-3 font-semibold cursor-pointer select-none"
                    onClick={() => handleSort("coursesCount")}
                  >
                    Courses{" "}
                    <ArrowUpDown className="w-3 h-3 inline-block ml-1 opacity-50" />
                  </th>
                  <th
                    className="pb-3 font-semibold text-right cursor-pointer select-none"
                    onClick={() => handleSort("candidateStatus")}
                  >
                    Candidate Status{" "}
                    <ArrowUpDown className="w-3 h-3 inline-block ml-1 opacity-50" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {seafarersWithCandidateStatus.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-8 text-center text-xs opacity-50"
                    >
                      No seafarer records found matching filters.
                    </td>
                  </tr>
                ) : (
                  seafarersWithCandidateStatus.map((sf) => (
                    <tr
                      key={sf.id}
                      className={`border-b last:border-0 ${isDark ? "border-white/5" : "border-slate-100"}`}
                    >
                      <td className="py-3">
                        <div className="font-semibold">{sf.name}</div>
                        <div className="text-[10px] opacity-60">{sf.rank}</div>
                      </td>
                      <td className="py-3">{sf.department}</td>
                      <td className="py-3 text-[11px] opacity-80">
                        {sf.coursesCount} Booked
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
