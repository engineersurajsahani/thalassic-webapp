"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/providers/theme-provider";
import { useAuth } from "@/providers/auth-provider";
import Link from "next/link";
import { Bell, Sun, Moon, Search, ChevronRight } from "lucide-react";

const pageNames: Record<string, string> = {
  "/partner/dashboard": "Dashboard",
  "/partner/seafarers": "Seafarer Master",
  "/partner/seafarers/search": "Search Seafarer",
  "/partner/seafarers/create": "Create Seafarer Master",
  "/partner/purchases": "Purchase History",
  "/partner/purchases/create": "New Course Purchase",
  "/partner/settlements": "Settlement History",
  "/partner/settlements/create": "Submit Settlement",
  "/partner/financials": "Financial Summary",
  "/partner/documents": "Verification Documents",
  "/partner/profile": "Account Settings",
  "/partner/notifications": "Notifications Inbox",
  "/partner/support": "Support Tickets",
  // Backward compatibility
  "/agent/dashboard": "Dashboard",
  "/agent/documents": "Verification Documents",
  "/agent/profile": "Account Settings",
  "/agent/notifications": "Notifications Inbox",
  "/agent/support": "Support Tickets",
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getFormattedDate() {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
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

  let currentPage = pageNames[pathname] || "Partner Portal";
  if (!pageNames[pathname]) {
    if (pathname.startsWith("/partner/seafarers/")) currentPage = "Seafarer Profile";
    else if (pathname.startsWith("/partner/purchases/")) currentPage = "Purchase Details";
    else if (pathname.startsWith("/partner/settlements/")) currentPage = "Settlement Details";
  }

  const isHome = pathname === "/partner/dashboard" || pathname === "/agent/dashboard";

  return (
    <header
      className={`h-16 shrink-0 border-b flex items-center justify-between px-6 gap-4 z-20 sticky top-0 transition-colors duration-200 ${
        isDark ? "bg-[#0B0F19] border-[#1F2937]" : "bg-[#FFFFFF] border-[#E5E7EB]"
      }`}
    >
      {/* Left */}
      <div className="flex flex-col justify-center min-w-0">
        {isHome ? (
          <>
            <p className={`text-[11px] font-medium ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
              {getFormattedDate()}
            </p>
            <p className={`text-sm font-semibold leading-tight ${isDark ? "text-white" : "text-[#111827]"}`}>
              {getGreeting()}, {user?.name || "Authorized Partner"}
            </p>
          </>
        ) : (
          <div className={`flex items-center gap-1.5 text-xs ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
            <span>Partner Portal</span>
            <ChevronRight className="w-3 h-3" />
            <span className="font-semibold text-[#3D5EF6]">{currentPage}</span>
          </div>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-200 ${
            mounted && isDark ? "text-amber-400 hover:bg-[#1F2937]" : "text-[#6B7280] hover:bg-[#EEF1FE] hover:text-[#3D5EF6]"
          }`}
        >
          {mounted && isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="relative">
          <Link
            href="/partner/notifications"
            className={`relative w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-200 cursor-pointer ${
              isDark ? "text-white/40 hover:bg-white/8 hover:text-white/70" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            }`}
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
          </Link>
        </div>

        <div className={`w-px h-5 mx-1 ${isDark ? "bg-white/10" : "bg-slate-200"}`} />

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-[10px] font-black uppercase shrink-0 shadow-sm shadow-cyan-500/20">
            {user?.name ? user.name.split(" ").map((n: any) => n[0]).join("") : "HP"}
          </div>
          <div className="hidden sm:flex flex-col items-start leading-tight">
            <span className={`text-xs font-semibold ${isDark ? "text-white/85" : "text-slate-800"}`}>
              {user?.name || "Authorized Partner"}
            </span>
            <span className={`text-[10px] font-medium ${isDark ? "text-cyan-400/80" : "text-blue-600"}`}>
              Partner Portal
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
