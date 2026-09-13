"use client";

import React, { useMemo, useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import StatsCard from "@/components/company-admin/StatsCard";
import StatusBadge from "@/components/company-admin/StatusBadge";
import {
  FileCheck,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowUpDown,
} from "lucide-react";
import { mockSeafarers } from "@/components/company-admin/mockData";
import { FilterState } from "./ReportFilterBar";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
interface ApprovalItem {
  id: string;
  seafarer: string;
  document: string;
  category: string;
  status: string;
  date: string;
}

interface ApprovalTabProps {
  filters: FilterState;
  registerExportData: (data: Record<string, unknown>[]) => void;
}

export default function ApprovalTab({
  filters,
  registerExportData,
}: ApprovalTabProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [sortField, setSortField] = useState<string>("seafarer");
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const handleSort = (field: string) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const processedData = useMemo(() => {
    let approvals: ApprovalItem[] = [];

    mockSeafarers.forEach((sf) => {
      sf.documents.forEach((doc) => {
        approvals.push({
          id: `${sf.id}-${doc.id}`,
          seafarer: sf.name,
          document: doc.name,
          category: doc.type,
          status: doc.status,
          date: doc.issueDate,
        });
      });
    });

    if (filters.seafarer) {
      approvals = approvals.filter((a) =>
        a.seafarer.toLowerCase().includes(filters.seafarer.toLowerCase()),
      );
    }
    if (filters.status) {
      approvals = approvals.filter(
        (a) => a.status.toLowerCase() === filters.status.toLowerCase(),
      );
    }

    approvals.sort((a, b) => {
      let valA = (a as unknown as Record<string, unknown>)[sortField];
      let valB = (b as unknown as Record<string, unknown>)[sortField];
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if ((valA ?? "") < (valB ?? "")) return sortAsc ? -1 : 1;
      if ((valA ?? "") > (valB ?? "")) return sortAsc ? 1 : -1;
      return 0;
    });

    return approvals;
  }, [filters, sortField, sortAsc]);

  // Register the data for export whenever it changes
  React.useEffect(() => {
    registerExportData(
      processedData.map((a) => ({
        "Seafarer Name": a.seafarer,
        "Document Name": a.document,
        Category: a.category,
        "Approval Status": a.status,
        "Submission Date": a.date,
      })),
    );
  }, [processedData, registerExportData]);

  const stats = useMemo(() => {
    return {
      total: processedData.length,
      approved: processedData.filter((a) => a.status === "Approved").length,
      pending: processedData.filter((a) => a.status === "Pending").length,
      rejected: processedData.filter((a) => a.status === "Rejected").length,
    };
  }, [processedData]);

  const statusData = useMemo(() => {
    return [
      { name: "Approved", value: stats.approved },
      { name: "Pending", value: stats.pending },
      { name: "Rejected", value: stats.rejected },
    ].filter((s) => s.value > 0);
  }, [stats]);

  const COLORS = {
    Approved: isDark ? "#10b981" : "#059669",
    Pending: isDark ? "#f59e0b" : "#d97706",
    Rejected: isDark ? "#f43f5e" : "#e11d48",
  };

  const cardClasses = `p-5 rounded-xl border transition-all duration-200 hover:shadow-sm ${
    isDark
      ? "bg-[#0c1a2e] border-white/5 text-white"
      : "bg-white border-slate-200 text-slate-800"
  }`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Approvals"
          value={stats.total}
          icon={FileCheck}
        />
        <StatsCard title="Pending" value={stats.pending} icon={Clock} />
        <StatsCard
          title="Approved"
          value={stats.approved}
          icon={CheckCircle2}
        />
        <StatsCard title="Rejected" value={stats.rejected} icon={XCircle} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={cardClasses}>
          <h3 className="text-xs font-bold uppercase tracking-wider opacity-60 mb-4">
            Approval Status
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
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[entry.name as keyof typeof COLORS]}
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
                No approval data available.
              </div>
            )}
          </div>
        </div>

        <div className={`lg:col-span-2 ${cardClasses}`}>
          <h3 className="text-xs font-bold uppercase tracking-wider opacity-60 mb-4">
            Detailed Approvals Ledger
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr
                  className={`border-b ${isDark ? "border-white/5" : "border-slate-200"}`}
                >
                  <th
                    className="pb-3 font-semibold cursor-pointer select-none"
                    onClick={() => handleSort("seafarer")}
                  >
                    Seafarer{" "}
                    <ArrowUpDown className="w-3 h-3 inline-block ml-1 opacity-50" />
                  </th>
                  <th
                    className="pb-3 font-semibold cursor-pointer select-none"
                    onClick={() => handleSort("document")}
                  >
                    Document{" "}
                    <ArrowUpDown className="w-3 h-3 inline-block ml-1 opacity-50" />
                  </th>
                  <th
                    className="pb-3 font-semibold cursor-pointer select-none"
                    onClick={() => handleSort("category")}
                  >
                    Category{" "}
                    <ArrowUpDown className="w-3 h-3 inline-block ml-1 opacity-50" />
                  </th>
                  <th
                    className="pb-3 font-semibold text-right cursor-pointer select-none"
                    onClick={() => handleSort("status")}
                  >
                    Status{" "}
                    <ArrowUpDown className="w-3 h-3 inline-block ml-1 opacity-50" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {processedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-8 text-center text-xs opacity-50"
                    >
                      No records found matching filters.
                    </td>
                  </tr>
                ) : (
                  processedData.map((a) => (
                    <tr
                      key={a.id}
                      className={`border-b last:border-0 ${isDark ? "border-white/5" : "border-slate-100"}`}
                    >
                      <td className="py-3 font-semibold text-[12px]">
                        {a.seafarer}
                      </td>
                      <td className="py-3 text-[11px] opacity-80">
                        {a.document}
                      </td>
                      <td className="py-3 text-[11px] opacity-80">
                        {a.category}
                      </td>
                      <td className="py-3 text-right">
                        <StatusBadge status={a.status} />
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
