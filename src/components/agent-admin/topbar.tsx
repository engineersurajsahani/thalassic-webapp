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
  "/agent-admin/referral-leads": "Referrals Tracker",
  "/agent-admin/commissions":  "Commissions",
  "/agent-admin/reports":      "Reports",
  "/agent-admin/audit-logs":   "Audit Logs",
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
  const isDark = theme === "dark";
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const [showNotifications, setShowNotifications] = useState(false);

  const currentPage = pageNames[pathname] || "Dashboard";
  const isHome = pathname === "/agent-admin/dashboard";

  return (
    <header className={`h-16 shrink-0 border-b flex items-center justify-between px-6 gap-4 z-20 sticky top-0 ${isDark ? "bg-[#0a1122]/60 backdrop-blur-2xl border-white/5" : "bg-white/60 backdrop-blur-2xl border-slate-200/60"}`}>

      {/* Left */}
      <div className="flex flex-col justify-center min-w-0">
        {isHome ? (
          <>
            <p className={`text-xs font-medium ${isDark ? "text-white/30" : "text-slate-400"}`}>{getFormattedDate()}</p>
            <p className={`text-sm font-semibold leading-tight ${isDark ? "text-white/75" : "text-slate-700"}`}>{getGreeting()}, {user?.name || "Agent Admin"}</p>
          </>
        ) : (
          <div className={`flex items-center gap-1.5 text-xs ${isDark ? "text-white/30" : "text-slate-400"}`}>
            <span>Agent Admin</span>
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
            placeholder="Search agents, referrals..."
            className={`bg-transparent outline-none w-full text-[13px] ${isDark ? "placeholder:text-white/25" : "placeholder:text-slate-400"}`}
          />
        </label>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button onClick={toggleTheme} aria-label="Toggle theme"
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${mounted && isDark ? "text-yellow-300 hover:bg-white/8" : "text-slate-500 hover:bg-slate-100"}`}>
          {mounted && isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
              isDark ? "text-white/40 hover:bg-white/8 hover:text-white/70" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            }`}
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>

        <div className={`w-px h-5 mx-1 ${isDark ? "bg-white/10" : "bg-slate-200"}`} />

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white text-[10px] font-black uppercase shrink-0">
            {user?.name ? user.name.split(" ").map((n: any) => n[0]).join("") : "AA"}
          </div>
          <div className="hidden sm:flex flex-col items-start leading-tight">
            <span className={`text-xs font-semibold ${isDark ? "text-white/75" : "text-slate-800"}`}>{user?.name || "Agent Admin"}</span>
            <span className={`text-[10px] ${isDark ? "text-white/30" : "text-slate-400"}`}>Manning Operations</span>
          </div>
        </div>
      </div>
    </header>
  );
}
