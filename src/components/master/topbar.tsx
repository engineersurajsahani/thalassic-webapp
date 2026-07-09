"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/providers/theme-provider";
import { Bell, Sun, Moon } from "lucide-react";

const pageNames: { [key: string]: string } = {
  "/master/dashboard": "Dashboard",
  "/master/courses": "Course Management",
  "/master/users": "User Management",
  "/master/reports": "Reports",
  "/master/settings": "Settings",
};

export default function MasterTopbar() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const pathname = usePathname();

  const currentPageName = pageNames[pathname] || "Dashboard";

  // Generate breadcrumb
  const breadcrumbItems = [
    { label: "Master", href: "/master" },
    { label: currentPageName, href: pathname },
  ];

  return (
    <header
      className={`h-20 border-b flex items-center justify-between px-6 ${
        isDark
          ? "bg-[#0A1929] border-gray-800"
          : "bg-white border-slate-200"
      }`}
    >
      {/* Left: Breadcrumb & Title */}
      <div className="flex items-center gap-4">
        <div>
          <div className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-slate-500"}`}>
            {breadcrumbItems.map((item, idx) => {
              const isLastItem = idx === breadcrumbItems.length - 1;
              const itemClass = isLastItem
                ? isDark
                  ? "text-white"
                  : "text-slate-900"
                : "";

              return (
                <span key={idx}>
                  {idx > 0 && <span className="mx-2">/</span>}
                  <span className={itemClass}>
                    {item.label}
                  </span>
                </span>
              );
            })}
          </div>
          <h2
            className={`text-2xl font-bold mt-1 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {currentPageName}
          </h2>
        </div>
      </div>

      {/* Right: Notification, Theme Toggle, Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Icon */}
        <button
          className={`relative p-2 rounded-lg transition-all ${
            isDark
              ? "hover:bg-gray-800"
              : "hover:bg-slate-100"
          }`}
          aria-label="Notifications"
        >
          <Bell className={`w-5 h-5 ${isDark ? "text-gray-300" : "text-slate-600"}`} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg transition-all ${
            isDark
              ? "hover:bg-gray-800 text-yellow-300"
              : "hover:bg-slate-100 text-slate-600"
          }`}
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Profile Avatar */}
        <button
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-all ${
            isDark ? "bg-blue-600 hover:bg-blue-500" : "bg-blue-500 hover:bg-blue-600"
          }`}
          aria-label="Profile"
        >
          M
        </button>
      </div>
    </header>
  );
}
