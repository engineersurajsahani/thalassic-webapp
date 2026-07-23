"use client";

import React from "react";
import { useTheme } from "@/providers/theme-provider";

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const getStyle = () => {
    const s = status.toLowerCase();

    // Green colors (Success)
    if (["active", "approved", "completed", "high", "success"].includes(s)) {
      return isDark
        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
        : "bg-emerald-50 text-emerald-750 border-emerald-250";
    }

    // Yellow/Amber colors (Warning)
    if (["pending", "in progress", "medium", "warning", "expiring"].includes(s)) {
      return isDark
        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
        : "bg-amber-50 text-amber-850 border-amber-250";
    }

    // Red/Rose colors (Danger)
    if (["inactive", "rejected", "expired", "low", "danger", "closed"].includes(s)) {
      return isDark
        ? "bg-rose-500/10 text-rose-450 border-rose-500/20"
        : "bg-rose-50 text-rose-750 border-rose-250";
    }

    // Blue/Cyan colors (Info / Default)
    return isDark
      ? "bg-sky-500/10 text-sky-400 border-sky-500/20"
      : "bg-sky-50 text-sky-750 border-sky-250";
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${getStyle()}`}
    >
      {status}
    </span>
  );
}
