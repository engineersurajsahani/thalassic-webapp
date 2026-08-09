"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/providers/theme-provider";
import { useAuth } from "@/providers/auth-provider";
import Link from "next/link";
import { 
  Bell, Sun, Moon, Search, ChevronRight
} from "lucide-react";

const pageNames: Record<string, string> = {
  "/agent/dashboard": "Dashboard",
  "/agent/referral-center": "Referral Center",
  "/agent/referral-leads": "Referrals Tracker",
  "/agent/commissions": "Commissions",
  "/agent/invoices": "Invoices Ledger",
  "/agent/documents": "Documents",
  "/agent/profile": "Account Settings",
  "/agent/notifications": "Notifications Inbox",
  "/agent/support": "Support Tickets",
  "/agent/onboarding": "Onboarding Wizard",
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

export default function AgentTopbar() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? theme === "dark" : true;

  const [showNotifications, setShowNotifications] = useState(false);

  const currentPage = pageNames[pathname] || "Dashboard";
  const isHome = pathname === "/agent/dashboard";

  return (
    <header className={`h-16 shrink-0 border-b flex items-center justify-between px-6 gap-4 z-20 sticky top-0 ${isDark ? "bg-[#0a1122]/60 backdrop-blur-2xl border-white/5" : "bg-white/60 backdrop-blur-2xl border-slate-200/60"}`}>

      {/* Left */}
      <div className="flex flex-col justify-center min-w-0">
        {isHome ? (
          <>
            <p className={`text-xs font-medium ${isDark ? "text-white/30" : "text-slate-400"}`}>{getFormattedDate()}</p>
            <p className={`text-sm font-semibold leading-tight ${isDark ? "text-white/75" : "text-slate-700"}`}>{getGreeting()}, {user?.name || "Agent Partner"}</p>
          </>
        ) : (
          <div className={`flex items-center gap-1.5 text-xs ${isDark ? "text-white/30" : "text-slate-400"}`}>
            <span>Agent Portal</span>
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
            placeholder="Search leads, purchases..."
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
          <Link
            href="/agent/notifications"
            className={`relative w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
              isDark ? "text-white/40 hover:bg-white/8 hover:text-white/70" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            }`}
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
          </Link>
        </div>

        <div className={`w-px h-5 mx-1 ${isDark ? "bg-white/10" : "bg-slate-200"}`} />

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white text-[10px] font-black uppercase shrink-0">
            {user?.name ? user.name.split(" ").map((n: any) => n[0]).join("") : "MA"}
          </div>
          <div className="hidden sm:flex flex-col items-start leading-tight">
            <span className={`text-xs font-semibold ${isDark ? "text-white/75" : "text-slate-800"}`}>{user?.name || "Manning Agent"}</span>
            <span className={`text-[10px] ${isDark ? "text-white/30" : "text-slate-400"}`}>Manning Partner</span>
          </div>
        </div>
      </div>
    </header>
  );
}
