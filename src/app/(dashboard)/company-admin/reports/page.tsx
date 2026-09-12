"use client";

import React, { useState, useCallback } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  Download,
  FileText,
  Users,
  Building2,
  BookOpen,
  UserCircle,
  FileCheck,
} from "lucide-react";
import OverviewTab from "./components/OverviewTab";
import SeafarerTab from "./components/SeafarerTab";
import InstituteTab from "./components/InstituteTab";
import CourseTab from "./components/CourseTab";
import CandidateStatusTab from "./components/CandidateStatusTab";
import ApprovalTab from "./components/ApprovalTab";
import ReportFilterBar, {
  FilterState,
  FilterConfig,
} from "./components/ReportFilterBar";
import { exportToExcel } from "@/lib/exportUtils";

const tabs = [
  {
    id: "overview",
    label: "Overview",
    icon: FileText,
    config: { seafarer: true, institute: true, course: true },
  },
  {
    id: "seafarer",
    label: "Seafarer Reports",
    icon: Users,
    config: {
      seafarer: true,
      status: true,
      statusOptions: ["Ongoing", "Completed", "On Hold", "Past"],
    },
  },
  {
    id: "institute",
    label: "Institute Reports",
    icon: Building2,
    config: { institute: true },
  },
  {
    id: "course",
    label: "Course Reports",
    icon: BookOpen,
    config: { course: true, institute: true },
  },
  {
    id: "candidate",
    label: "Candidate Status",
    icon: UserCircle,
    config: {
      seafarer: true,
      status: true,
      statusOptions: ["Ongoing", "Completed", "On Hold", "Past"],
    },
  },
  {
    id: "approval",
    label: "Approval Reports",
    icon: FileCheck,
    config: {
      seafarer: true,
      status: true,
      statusOptions: ["Pending", "Approved", "Rejected"],
    },
  },
];

export default function ReportsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeTab, setActiveTab] = useState("overview");

  // Global filter state managed here and passed down
  const [filters, setFilters] = useState<FilterState>({
    seafarer: "",
    institute: "",
    course: "",
    status: "",
  });

  const handleResetFilters = useCallback(() => {
    setFilters({ seafarer: "", institute: "", course: "", status: "" });
  }, []);

  // Data to be exported
  const [exportData, setExportData] = useState<Record<string, unknown>[]>([]);

  const handleExport = useCallback(() => {
    exportToExcel(exportData, `company-admin-${activeTab}-report`);
  }, [exportData, activeTab]);

  const activeConfig = tabs.find((t) => t.id === activeTab)
    ?.config as FilterConfig;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-800"}`}
          >
            Company Reports
          </h1>
          <p
            className={`text-[11px] mt-0.5 ${isDark ? "text-white/40" : "text-slate-500"}`}
          >
            Operational Performance & Management Analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-sky-500 hover:bg-sky-600 text-white transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <ReportFilterBar
        config={activeConfig}
        filters={filters}
        setFilters={setFilters}
        onApply={() => {}}
        onReset={handleResetFilters}
      />

      {/* Tabs Navigation */}
      <div
        className={`flex flex-nowrap overflow-x-auto gap-2 border-b ${isDark ? "border-white/10" : "border-slate-200"}`}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                handleResetFilters();
              }}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
                isActive
                  ? isDark
                    ? "border-sky-400 text-sky-400"
                    : "border-sky-600 text-sky-600"
                  : isDark
                    ? "border-transparent text-slate-400 hover:text-white"
                    : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {activeTab === "overview" && (
          <OverviewTab filters={filters} registerExportData={setExportData} />
        )}
        {activeTab === "seafarer" && (
          <SeafarerTab filters={filters} registerExportData={setExportData} />
        )}
        {activeTab === "institute" && (
          <InstituteTab filters={filters} registerExportData={setExportData} />
        )}
        {activeTab === "course" && (
          <CourseTab filters={filters} registerExportData={setExportData} />
        )}
        {activeTab === "candidate" && (
          <CandidateStatusTab
            filters={filters}
            registerExportData={setExportData}
          />
        )}
        {activeTab === "approval" && (
          <ApprovalTab filters={filters} registerExportData={setExportData} />
        )}
      </div>
    </div>
  );
}
