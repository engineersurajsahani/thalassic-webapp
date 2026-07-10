"use client";

import React from "react";
import { useTheme } from "@/providers/theme-provider";

export default function CoursesPage() {
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
        Course Management
      </h1>
      <p
        className={`text-sm ${
          isDark ? "text-gray-400" : "text-slate-600"
        }`}
      >
        Course management features coming soon. This section will allow you to:
      </p>
      <ul
        className={`mt-4 space-y-2 text-sm ${
          isDark ? "text-gray-400" : "text-slate-600"
        }`}
      >
        <li>• View all courses</li>
        <li>• Add new courses</li>
        <li>• Edit existing courses</li>
        <li>• Manage course categories</li>
        <li>• Track course enrollment</li>
      </ul>
    </div>
  );
}
