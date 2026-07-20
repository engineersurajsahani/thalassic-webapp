"use client";

import React from "react";
import { useTheme } from "@/providers/theme-provider";

export default function SettingsPage() {
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
        Settings
      </h1>
      <p
        className={`text-sm ${
          isDark ? "text-gray-400" : "text-slate-600"
        }`}
      >
        Settings and configuration options coming soon. This section will allow you to:
      </p>
      <ul
        className={`mt-4 space-y-2 text-sm ${
          isDark ? "text-gray-400" : "text-slate-600"
        }`}
      >
        <li>• Configure platform settings</li>
        <li>• Manage email templates</li>
        <li>• Set pricing and fees</li>
        <li>• Configure payment methods</li>
        <li>• Manage API keys and integrations</li>
      </ul>
    </div>
  );
}
