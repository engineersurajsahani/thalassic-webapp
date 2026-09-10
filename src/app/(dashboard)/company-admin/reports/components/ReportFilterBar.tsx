"use client";

import React from "react";
import { useTheme } from "@/providers/theme-provider";
import { X, Search } from "lucide-react";

export type FilterConfig = {
  seafarer?: boolean;
  institute?: boolean;
  course?: boolean;
  status?: boolean;
  statusOptions?: string[]; // e.g. ["Active", "Pending"]
};

export type FilterState = {
  seafarer: string;
  institute: string;
  course: string;
  status: string;
};

interface ReportFilterBarProps {
  config: FilterConfig;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onApply?: () => void;
  onReset: () => void;
}

export default function ReportFilterBar({
  config,
  filters,
  setFilters,
  onReset,
}: ReportFilterBarProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const hasAnyFilterEnabled =
    config.seafarer || config.institute || config.course || config.status;

  if (!hasAnyFilterEnabled) return null;

  return (
    <div
      className={`p-4 rounded-xl border mb-6 flex flex-col md:flex-row md:items-end gap-4 transition-colors ${
        isDark
          ? "bg-[#0c1a2e] border-white/5 text-white"
          : "bg-white border-slate-200 text-slate-800"
      }`}
    >
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {config.seafarer && (
          <div className="space-y-1">
            <label
              className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-white/50" : "text-slate-500"}`}
            >
              Seafarer Name
            </label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-50" />
              <input
                type="text"
                name="seafarer"
                value={filters.seafarer}
                onChange={handleChange}
                placeholder="Search name..."
                className={`w-full pl-8 pr-3 py-2 text-xs rounded-lg border outline-none transition-colors ${
                  isDark
                    ? "bg-white/5 border-white/10 focus:border-sky-500 placeholder:text-white/30"
                    : "bg-slate-50 border-slate-200 focus:border-sky-500 placeholder:text-slate-400"
                }`}
              />
            </div>
          </div>
        )}

        {config.institute && (
          <div className="space-y-1">
            <label
              className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-white/50" : "text-slate-500"}`}
            >
              Institute
            </label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-50" />
              <input
                type="text"
                name="institute"
                value={filters.institute}
                onChange={handleChange}
                placeholder="Search institute..."
                className={`w-full pl-8 pr-3 py-2 text-xs rounded-lg border outline-none transition-colors ${
                  isDark
                    ? "bg-white/5 border-white/10 focus:border-sky-500 placeholder:text-white/30"
                    : "bg-slate-50 border-slate-200 focus:border-sky-500 placeholder:text-slate-400"
                }`}
              />
            </div>
          </div>
        )}

        {config.course && (
          <div className="space-y-1">
            <label
              className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-white/50" : "text-slate-500"}`}
            >
              Course
            </label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-50" />
              <input
                type="text"
                name="course"
                value={filters.course}
                onChange={handleChange}
                placeholder="Search course..."
                className={`w-full pl-8 pr-3 py-2 text-xs rounded-lg border outline-none transition-colors ${
                  isDark
                    ? "bg-white/5 border-white/10 focus:border-sky-500 placeholder:text-white/30"
                    : "bg-slate-50 border-slate-200 focus:border-sky-500 placeholder:text-slate-400"
                }`}
              />
            </div>
          </div>
        )}

        {config.status && (
          <div className="space-y-1">
            <label
              className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-white/50" : "text-slate-500"}`}
            >
              Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-xs rounded-lg border outline-none transition-colors appearance-none ${
                isDark
                  ? "bg-white/5 border-white/10 focus:border-sky-500"
                  : "bg-slate-50 border-slate-200 focus:border-sky-500"
              }`}
            >
              <option value="">All Statuses</option>
              {config.statusOptions?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onReset}
          className={`flex items-center justify-center p-2 rounded-lg transition-colors border ${
            isDark
              ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70"
              : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"
          }`}
          title="Reset Filters"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
