"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/providers/theme-provider";
import { useAuth } from "@/providers/auth-provider";
import { 
  Bell, Sun, Moon, Search, ChevronRight,
  BookOpen, AlertCircle, Check, Users
} from "lucide-react";

const pageNames: Record<string, string> = {
  "/agent-admin/dashboard": "Dashboard",
  "/agent-admin/agents":   "Agent Management",
  "/agent-admin/pricing":      "Course Pricing",
  "/agent-admin/reports":      "Reports",
  "/agent-admin/profile":      "Profile",
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

export default function AgentAdminTopbar() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const pathname = usePathname();
  const mounted = true;

  const isDark = mounted ? theme === "dark" : true;

  const [showNotifications, setShowNotifications] = useState(false);

  const currentPage = pageNames[pathname] || "Dashboard";
  const isHome = pathname === "/agent-admin/dashboard";

  return (
    <header className={`h-16 shrink-0 border-b flex items-center justify-between px-6 gap-4 z-20 sticky top-0 transition-colors duration-200 ${isDark ? "bg-[#0B0F19] border-[#1F2937]" : "bg-[#FFFFFF] border-[#E5E7EB]"}`}>

      {/* Left */}
      <div className="flex flex-col justify-center min-w-0">
        {isHome ? (
          <>
            <p className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>{getFormattedDate()}</p>
            <p className={`text-sm font-semibold leading-tight ${isDark ? "text-white" : "text-[#111827]"}`}>{getGreeting()}, {user?.name || "Partner Admin"}</p>
          </>
        ) : (
          <div className={`flex items-center gap-1.5 text-xs ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
            <span>Partner Admin</span>
            <ChevronRight className="w-3 h-3" />
            <span className={isDark ? "text-white" : "text-[#111827]"}>{currentPage}</span>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="flex-1 max-w-sm">
        <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors duration-200 ${isDark ? "bg-[#111827] border-[#374151] text-white" : "bg-[#FAFAFA] border-[#E5E7EB] text-[#111827]"}`}>
          <Search className="w-3.5 h-3.5 shrink-0 opacity-50" />
          <input
            type="text"
            placeholder="Search agents, referrals..."
            className={`bg-transparent outline-none w-full text-[13px] ${isDark ? "placeholder:text-gray-500" : "placeholder:text-[#6B7280]"}`}
          />
        </label>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button onClick={toggleTheme} aria-label="Toggle theme"
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-200 ${mounted && isDark ? "text-amber-400 hover:bg-[#1F2937]" : "text-[#6B7280] hover:bg-[#EEF1FE] hover:text-[#3D5EF6]"}`}>
          {mounted && isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-200 cursor-pointer ${
              isDark ? "text-gray-400 hover:bg-[#1F2937] hover:text-white" : "text-[#6B7280] hover:bg-[#EEF1FE] hover:text-[#3D5EF6]"
            }`}
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>

        <div className={`w-px h-5 mx-1 ${isDark ? "bg-[#374151]" : "bg-[#E5E7EB]"}`} />

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#3D5EF6] flex items-center justify-center text-white text-[10px] font-black uppercase shrink-0">
            {user?.name ? user.name.split(" ").map((n: any) => n[0]).join("") : "PA"}
          </div>
          <div className="hidden sm:flex flex-col items-start leading-tight">
            <span className={`text-xs font-semibold ${isDark ? "text-white" : "text-[#111827]"}`}>{user?.name || "Partner Admin"}</span>
            <span className={`text-[10px] ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>Manning Operations</span>
          </div>
        </div>
      </div>
    </header>
  );
}
