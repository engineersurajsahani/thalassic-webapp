"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "@/providers/theme-provider";
import { useAuth } from "@/providers/auth-provider";
import { notificationService } from "@/services/notification.service";
import {
  Bell,
  Sun,
  Moon,
  Search,
  ChevronRight,
  BookOpen,
  AlertCircle,
  Check,
  Users,
} from "lucide-react";

const pageNames: Record<string, string> = {
  "/master/dashboard": "Dashboard",
  "/master/courses": "Course Management",
  "/master/users": "User Management",
  "/master/reports": "Reports",
  "/master/settings": "Settings",
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

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type: string;
}

export default function MasterTopbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const isDark = theme === "dark";
  const pathname = usePathname();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const currentPage = pageNames[pathname] || "Dashboard";
  const isHome = pathname === "/master/dashboard";

  const fetchNotifications = useCallback(async () => {
    try {
      const list = await notificationService.getNotifications();
      setNotifications(list as Notification[]);
    } catch (err) {
      console.error("Failed to load notifications: ", err);
    }
  }, []);

  // Initial load + polling — wrapped in setTimeout to satisfy set-state-in-effect rule
  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchNotifications();
    }, 0);
    const interval = setInterval(() => {
      void fetchNotifications();
    }, 30000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark all read:", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header
      className={`h-16 shrink-0 border-b flex items-center justify-between px-6 gap-4 transition-colors duration-200 ${isDark ? "bg-[#0B0F19] border-[#1F2937]" : "bg-[#FFFFFF] border-[#E5E7EB]"}`}
    >
      {/* Left */}
      <div className="flex flex-col justify-center min-w-0">
        {isHome ? (
          <>
            <p
              className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}
            >
              {getFormattedDate()}
            </p>
            <p
              className={`text-sm font-semibold leading-tight ${isDark ? "text-white" : "text-[#111827]"}`}
            >
              {getGreeting()}, Admin
            </p>
          </>
        ) : (
          <div
            className={`flex items-center gap-1.5 text-xs ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}
          >
            <span>Master</span>
            <ChevronRight className="w-3 h-3" />
            <span className={isDark ? "text-white" : "text-[#111827]"}>
              {currentPage}
            </span>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="flex-1 max-w-sm">
        <label
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors duration-200 ${isDark ? "bg-[#111827] border-[#374151] text-white" : "bg-[#FAFAFA] border-[#E5E7EB] text-[#111827]"}`}
        >
          <Search className="w-3.5 h-3.5 shrink-0 opacity-50" />
          <input
            type="text"
            placeholder="Search users, courses..."
            className={`bg-transparent outline-none w-full text-[13px] ${isDark ? "placeholder:text-gray-500" : "placeholder:text-[#6B7280]"}`}
          />
          <kbd
            className={`hidden sm:inline-flex text-[10px] px-1.5 py-0.5 rounded font-mono ${isDark ? "bg-white/8 text-white/25" : "bg-slate-200 text-slate-400"}`}
          >
            ⌘K
          </kbd>
        </label>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${isDark ? "text-yellow-300 hover:bg-white/8" : "text-slate-500 hover:bg-slate-100"}`}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
              isDark
                ? "text-white/40 hover:bg-white/8 hover:text-white/70"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
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
                  isDark
                    ? "bg-[#0c1a2e] border-white/5 text-white"
                    : "bg-white border-slate-200 text-slate-900"
                }`}
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2 px-2">
                  <h4 className="font-bold text-xs">Notifications</h4>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[10px] font-semibold text-cyan-400 hover:underline cursor-pointer"
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
                          {n.title.includes("Registration") ? (
                            <Users className="w-3.5 h-3.5 text-cyan-400" />
                          ) : n.title.includes("Booking") ? (
                            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="font-bold truncate">{n.title}</div>
                          <p
                            className={`mt-0.5 text-[10px] leading-relaxed ${isDark ? "text-gray-400" : "text-slate-500"}`}
                          >
                            {n.message}
                          </p>
                        </div>
                        {!n.isRead && (
                          <button
                            onClick={(e) => handleMarkAsRead(n.id, e)}
                            className="p-1 rounded hover:bg-gray-800/40 text-cyan-400 self-center cursor-pointer"
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

        <div
          className={`w-px h-5 mx-1 ${isDark ? "bg-white/10" : "bg-slate-200"}`}
        />

        <div className="relative">
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            aria-label="Profile"
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden border ${
                isDark
                  ? "bg-[#0a1525] border-white/10"
                  : "bg-white border-slate-200"
              }`}
            >
              <Image
                src="/logo/hariom_logo.png"
                alt="Hari Om Thalassic"
                width={32}
                height={32}
                className="object-contain w-6 h-6"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <div className="hidden sm:flex flex-col items-start leading-tight">
              <span
                className={`text-xs font-semibold ${isDark ? "text-white/75" : "text-slate-800"}`}
              >
                {user?.name || "Master Admin"}
              </span>
              <span
                className={`text-[10px] ${isDark ? "text-white/30" : "text-slate-400"}`}
              >
                Super Admin
              </span>
            </div>
          </button>

          {showProfileDropdown && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowProfileDropdown(false)}
              />
              <div
                className={`absolute right-0 mt-2 w-48 border rounded-xl shadow-xl z-35 p-1.5 overflow-hidden animate-fadeIn ${
                  isDark
                    ? "bg-[#0c1a2e] border-white/5 text-white"
                    : "bg-white border-slate-200 text-slate-900"
                }`}
              >
                <div className="px-3 py-2 border-b border-solid border-slate-100 dark:border-white/5 mb-1.5 text-left">
                  <p className="text-[9px] opacity-40 font-bold uppercase tracking-wider">
                    Authorized Role
                  </p>
                  <p className="text-xs font-bold truncate mt-0.5 text-slate-700 dark:text-white">
                    {user?.name || "Master Admin"}
                  </p>
                  <p className="text-[9px] opacity-55 truncate mt-0.5">
                    {user?.email || "admin@thalassic.in"}
                  </p>
                </div>
                <div className="space-y-0.5 text-left">
                  <a
                    href="/master/dashboard"
                    onClick={() => setShowProfileDropdown(false)}
                    className={`block w-full px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isDark
                        ? "hover:bg-white/5 text-slate-300"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    Dashboard
                  </a>
                  <a
                    href="/master/settings"
                    onClick={() => setShowProfileDropdown(false)}
                    className={`block w-full px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isDark
                        ? "hover:bg-white/5 text-slate-300"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    Platform Settings
                  </a>
                  <div
                    className={`h-px my-1.5 ${isDark ? "bg-white/5" : "bg-slate-100"}`}
                  />
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer text-red-500 hover:bg-red-500/10"
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
