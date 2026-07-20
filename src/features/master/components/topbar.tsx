"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/providers/theme-provider";
import { Bell, Sun, Moon, Search, ChevronRight } from "lucide-react";

const pageNames: Record<string, string> = {
  "/master/dashboard": "Dashboard",
  "/master/courses":   "Course Management",
  "/master/users":     "User Management",
  "/master/reports":   "Reports",
  "/master/settings":  "Settings",
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getFormattedDate() {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

export default function MasterTopbar() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const pathname = usePathname();
  const currentPage = pageNames[pathname] || "Dashboard";
  const isHome = pathname === "/master/dashboard";

  return (
    <header className={`h-16 shrink-0 border-b flex items-center justify-between px-6 gap-4 ${isDark ? "bg-[#0d1f35] border-white/5" : "bg-white border-slate-200"}`}>

      {/* Left */}
      <div className="flex flex-col justify-center min-w-0">
        {isHome ? (
          <>
            <p className={`text-xs font-medium ${isDark ? "text-white/30" : "text-slate-400"}`}>{getFormattedDate()}</p>
            <p className={`text-sm font-semibold leading-tight ${isDark ? "text-white/75" : "text-slate-700"}`}>{getGreeting()}, Admin</p>
          </>
        ) : (
          <div className={`flex items-center gap-1.5 text-xs ${isDark ? "text-white/30" : "text-slate-400"}`}>
            <span>Master</span>
            <ChevronRight className="w-3 h-3" />
            <span className={isDark ? "text-white/70" : "text-slate-700"}>{currentPage}</span>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="flex-1 max-w-sm">
        <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${isDark ? "bg-white/5 border-white/10 text-white/60 placeholder:text-white/25" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
          <Search className="w-3.5 h-3.5 shrink-0 opacity-50" />
          <input
            type="text"
            placeholder="Search users, courses..."
            className={`bg-transparent outline-none w-full text-[13px] ${isDark ? "placeholder:text-white/25" : "placeholder:text-slate-400"}`}
          />
          <kbd className={`hidden sm:inline-flex text-[10px] px-1.5 py-0.5 rounded font-mono ${isDark ? "bg-white/8 text-white/25" : "bg-slate-200 text-slate-400"}`}>⌘K</kbd>
        </label>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button onClick={toggleTheme} aria-label="Toggle theme"
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${isDark ? "text-yellow-300 hover:bg-white/8" : "text-slate-500 hover:bg-slate-100"}`}>
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button aria-label="Notifications"
          className={`relative w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${isDark ? "text-white/40 hover:bg-white/8 hover:text-white/70" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"}`}>
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>

        <div className={`w-px h-5 mx-1 ${isDark ? "bg-white/10" : "bg-slate-200"}`} />

        <button aria-label="Profile" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white text-xs font-bold shrink-0">MA</div>
          <div className="hidden sm:flex flex-col items-start leading-tight">
            <span className={`text-xs font-semibold ${isDark ? "text-white/75" : "text-slate-800"}`}>Master Admin</span>
            <span className={`text-[10px] ${isDark ? "text-white/30" : "text-slate-400"}`}>Super Admin</span>
          </div>
        </button>
      </div>
    </header>
  );
}
