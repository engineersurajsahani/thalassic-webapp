"use client";

import React from "react";
import { useTheme } from "@/providers/theme-provider";

export default function ReportsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`p-6 rounded-2xl border ${
        isDark
          ? "bg-[#0A1929] border-gray-800"
          : "bg-white border-slate-200"
      }`}
    >
      <h1
        className={`text-2xl font-bold mb-4 ${
          isDark ? "text-white" : "text-slate-900"
        }`}
      >
        Reports
      </h1>
      <p
        className={`text-sm ${
          isDark ? "text-gray-400" : "text-slate-600"
        }`}
      >
        Reports and analytics coming soon. This section will provide:
      </p>
      <ul
        className={`mt-4 space-y-2 text-sm ${
          isDark ? "text-gray-400" : "text-slate-600"
        }`}
      >
        <li>• Revenue analytics</li>
        <li>• User growth reports</li>
        <li>• Course enrollment statistics</li>
        <li>• Course completion rates</li>
        <li>• Custom report generation</li>
      </ul>
    </div>
  );
}
