"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/providers/theme-provider";
import { useAuth } from "@/providers/auth-provider";
import { mockNotifications } from "./mockData";
import { 
  Bell, Sun, Moon, Search, ChevronRight,
  AlertTriangle, Info, CheckCircle2, Check, Menu
} from "lucide-react";

interface TopbarProps {
  onMenuClick: () => void;
}

const pageNames: Record<string, string> = {
  "/company-admin/dashboard":          "Dashboard",
  "/company-admin/seafarers":          "Seafarer Management",
  "/company-admin/seafearers":         "Seafarer Management",
  "/company-admin/courses":            "Course Management",
  "/company-admin/registration":       "Walk-in Registration",
  "/company-admin/walk-in-registration":"Walk-in Registration",
  "/company-admin/documents":          "Document Verification",
  "/company-admin/finance":            "Company Finance",
  "/company-admin/finance/overview":   "Company Finance",
  "/company-admin/finance/payments":   "Company Finance",
  "/company-admin/finance/seafarer":   "Company Finance",
  "/company-admin/finance/institute":  "Company Finance",
  "/company-admin/payments":           "Company Finance",
  "/company-admin/reports":            "Reports & Analytics",
  "/company-admin/profile":            "Company Profile",
  "/company-admin/support":            "Help & Support",
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

export default function CompanyAdminTopbar({ onMenuClick }: TopbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const isDark = theme === "dark";
  const pathname = usePathname();

  const [notifications, setNotifications] = useState<any[]>(mockNotifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const currentPage = pageNames[pathname] || "Dashboard";
  const isHome = pathname === "/company-admin/dashboard";

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className={`h-16 shrink-0 border-b flex items-center justify-between px-4 md:px-6 gap-4 ${isDark ? "bg-[#0d1f35] border-white/5" : "bg-white border-slate-200"}`}>

      {/* Left Menu toggle & Breadcrumbs */}
      <div className="flex items-center min-w-0">
        <button
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className={`md:hidden p-2 rounded-lg border transition-colors mr-3 cursor-pointer ${
            isDark ? "border-white/10 hover:bg-white/5 text-slate-350" : "border-slate-200 hover:bg-slate-50 text-slate-650"
          }`}
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex flex-col justify-center min-w-0">
          {isHome ? (
            <>
              <p className={`text-[10px] font-medium tracking-wide ${isDark ? "text-white/30" : "text-slate-400"}`}>{getFormattedDate()}</p>
              <p className={`text-xs font-bold leading-tight ${isDark ? "text-white/85" : "text-slate-800"}`}>{getGreeting()}, Admin</p>
            </>
          ) : (
            <div className={`flex items-center gap-1 text-[11px] ${isDark ? "text-white/30" : "text-slate-400"}`}>
              <span>Company</span>
              <ChevronRight className="w-3 h-3" />
              <span className={isDark ? "text-white/70" : "text-slate-700"}>{currentPage}</span>
            </div>
          )}
        </div>
      </div>

      {/* Search Input Bar (Hidden on mobile for clean spacing) */}
      <div className="hidden sm:block flex-1 max-w-xs md:max-w-sm">
        <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all focus-within:ring-2 focus-within:ring-sky-500/20 focus-within:border-sky-500 ${isDark ? "bg-white/5 border-white/10 text-white/60 placeholder:text-white/25" : "bg-slate-50 border-slate-200 text-slate-650"}`}>
          <Search className="w-3.5 h-3.5 shrink-0 opacity-50" />
          <input
            type="text"
            placeholder="Search seafarers, documents..."
            className={`bg-transparent outline-none w-full text-[12px] ${isDark ? "placeholder:text-white/25" : "placeholder:text-slate-400"}`}
          />
          <kbd className={`hidden md:inline-flex text-[9px] px-1.5 py-0.5 rounded font-mono ${isDark ? "bg-white/8 text-white/25" : "bg-slate-200 text-slate-400"}`}>⌘K</kbd>
        </label>
      </div>

      {/* Right Toolbar */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Dark Mode Switcher */}
        <button onClick={toggleTheme} aria-label="Toggle theme"
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${isDark ? "text-yellow-350 hover:bg-white/8" : "text-slate-500 hover:bg-slate-100"}`}>
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Alert Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileDropdown(false);
            }}
            className={`relative w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
              isDark ? "text-white/40 hover:bg-white/8 hover:text-white/70" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            }`}
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" />
            )}
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setShowNotifications(false)}
              />
              <div
                className={`absolute right-0 mt-2 w-80 border rounded-xl shadow-xl z-30 p-2 overflow-hidden animate-fadeIn ${
                  isDark ? "bg-[#0c1a2e] border-white/5 text-white" : "bg-white border-slate-200 text-slate-900"
                }`}
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2 px-2">
                  <h4 className="font-bold text-xs">Alert Notifications</h4>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[10px] font-semibold text-sky-400 hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-[10px] text-gray-500">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2 rounded-lg text-[11px] leading-normal flex items-start gap-2.5 relative border ${
                          n.isRead
                            ? isDark
                              ? "bg-transparent border-transparent text-gray-400"
                              : "bg-transparent border-transparent text-slate-500"
                            : isDark
                            ? "bg-blue-950/20 border-blue-900/30 text-white"
                            : "bg-blue-50/50 border-blue-100 text-slate-800"
                        }`}
                      >
                        <div className="mt-0.5 flex-shrink-0">
                          {n.type === "warning" || n.type === "danger" ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                          ) : n.type === "success" ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Info className="w-3.5 h-3.5 text-cyan-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <p className={`text-[10px] leading-relaxed`}>
                            {n.message}
                          </p>
                          <span className={`text-[9px] block mt-0.5 opacity-55`}>{n.timestamp}</span>
                        </div>
                        {!n.isRead && (
                          <button
                            onClick={(e) => handleMarkAsRead(n.id, e)}
                            className="p-1 rounded hover:bg-gray-800/40 text-sky-400 self-center cursor-pointer"
                            title="Mark as read"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className={`w-px h-5 mx-1 ${isDark ? "bg-white/10" : "bg-slate-200"}`} />

        {/* Profile details details */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileDropdown(!showProfileDropdown);
              setShowNotifications(false);
            }}
            aria-label="Profile Menu"
            className="flex items-center gap-2.5 text-left shrink-0 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white text-[10px] font-black uppercase shrink-0">
              {user?.name ? user.name.split(" ").map((n: any) => n[0]).join("") : "CA"}
            </div>
            <div className="hidden sm:flex flex-col items-start leading-tight pr-1">
              <span className={`text-xs font-semibold ${isDark ? "text-white/75" : "text-slate-800"}`}>{user?.name || "Shipping Admin"}</span>
              <span className={`text-[10px] ${isDark ? "text-white/30" : "text-slate-400"}`}>Company Admin</span>
            </div>
          </button>

          {showProfileDropdown && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setShowProfileDropdown(false)} />
              <div
                className={`absolute right-0 mt-2 w-48 border rounded-xl shadow-xl z-35 p-1.5 overflow-hidden animate-fadeIn ${
                  isDark ? "bg-[#0c1a2e] border-white/5 text-white" : "bg-white border-slate-200 text-slate-900"
                }`}
              >
                <div className="px-3 py-2 border-b border-solid border-slate-105 dark:border-white/5 mb-1.5 text-left">
                  <p className="text-[9px] opacity-40 font-bold uppercase tracking-wider">Authorized Profile</p>
                  <p className="text-xs font-bold truncate mt-0.5 text-slate-700 dark:text-white">{user?.name || "Shipping Admin"}</p>
                  <p className="text-[9px] opacity-55 truncate mt-0.5">{user?.email || "admin@shipping.com"}</p>
                </div>
                <div className="space-y-0.5 text-left">
                  <a
                    href="/company-admin/dashboard"
                    onClick={() => setShowProfileDropdown(false)}
                    className={`block w-full px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isDark ? "hover:bg-white/5 text-slate-300" : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    Control Panel
                  </a>
                  <a
                    href="/company-admin/seafearers"
                    onClick={() => setShowProfileDropdown(false)}
                    className={`block w-full px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isDark ? "hover:bg-white/5 text-slate-300" : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    Vessel Directory
                  </a>
                  <div className={`h-px my-1.5 ${isDark ? "bg-white/5" : "bg-slate-100"}`} />
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      logout();
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer text-red-500 hover:bg-red-500/10`}
                  >
                    Sign Out Account
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
