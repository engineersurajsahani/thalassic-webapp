"use client";

import React from "react";
import { useTheme } from "@/providers/theme-provider";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  description?: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  change,
  changeType = "neutral",
  description,
}: StatsCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const changeColors = {
    positive: isDark ? "text-emerald-400 bg-emerald-500/10" : "text-emerald-750 bg-emerald-50",
    negative: isDark ? "text-rose-450 bg-rose-500/10" : "text-rose-700 bg-rose-50",
    neutral: isDark ? "text-slate-400 bg-slate-500/10" : "text-slate-550 bg-slate-100",
  };

  return (
    <div
      className={`p-5 rounded-xl border transition-all duration-200 hover:shadow-md ${
        isDark
          ? "bg-[#0c1a2e] border-white/5 text-white"
          : "bg-white border-slate-200 text-slate-800"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className={`text-[11px] font-semibold tracking-wider uppercase ${isDark ? "text-white/40" : "text-slate-400"}`}>
            {title}
          </p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
        </div>
        <div
          className={`p-2.5 rounded-lg ${
            isDark ? "bg-white/5 text-sky-400" : "bg-sky-50 text-sky-600"
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(change || description) && (
        <div className="flex items-center gap-2 mt-4 text-[11px]">
          {change && (
            <span className={`px-2 py-0.5 rounded font-bold ${changeColors[changeType]}`}>
              {change}
            </span>
          )}
          {description && (
            <span className={isDark ? "text-white/30" : "text-slate-400"}>
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
