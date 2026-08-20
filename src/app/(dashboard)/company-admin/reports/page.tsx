"use client";

import React from "react";
import { useTheme } from "@/providers/theme-provider";
import { BarChart3, Download, Filter } from "lucide-react";

export default function ReportsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-800"}`}>
            Company Reports
          </h1>
          <p className={`text-[11px] mt-0.5 ${isDark ? "text-white/40" : "text-slate-500"}`}>
            View and download compliance and operational reports.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              isDark
                ? "bg-white/5 hover:bg-white/10 text-white"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-sky-500 hover:bg-sky-600 text-white transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Placeholder Content */}
      <div
        className={`p-10 rounded-xl border flex flex-col items-center justify-center text-center space-y-4 ${
          isDark
            ? "bg-[#0c1a2e] border-white/5 text-white/60"
            : "bg-white border-slate-200 text-slate-500"
        }`}
      >
        <div className={`p-4 rounded-full ${isDark ? "bg-white/5" : "bg-slate-50"}`}>
          <BarChart3 className="w-8 h-8 opacity-50" />
        </div>
        <div>
          <h3 className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
            Reports Module Initialization
          </h3>
          <p className="text-xs mt-1 max-w-md mx-auto">
            Advanced analytics and reporting tools are being configured. Check back soon for detailed insights on your crew's compliance and operational metrics.
          </p>
        </div>
      </div>
    </div>
  );
}
