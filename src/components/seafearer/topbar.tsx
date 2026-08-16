"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/providers/theme-provider";
import { useAuth } from "@/providers/auth-provider";
import { notificationService } from "@/services/notification.service";
import { Bell, Sun, Moon, Check, MessageSquare, BookOpen, AlertCircle } from "lucide-react";
import Link from "next/link";

const pageNames: { [key: string]: string } = {
  "/seafearer/dashboard": "Dashboard",
  "/seafearer/my-courses": "My Enrolled Courses",
  "/seafearer/browse-courses": "Browse DGS Courses",
  "/seafearer/documents": "Document Repository",
  "/seafearer/profile": "Seafarer Profile Settings",
  "/seafearer/purchase-history": "Purchase History",
  "/seafearer/invoices": "Invoices",
  "/seafearer/referral-dashboard": "Referral Dashboard",
  "/seafearer/support": "Support Center",
};

export default function SeafearerTopbar() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === "dark";
  const pathname = usePathname();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const currentPageName = pageNames[pathname] || "Dashboard";

  const fetchNotifications = async () => {
    try {
      const list = await notificationService.getNotifications();
      setNotifications(list);
    } catch (err) {
      console.error("Failed to load notifications: ", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
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
      className={`h-20 border-b flex items-center justify-between px-6 z-20 transition-colors duration-300 relative ${
        isDark
          ? "bg-[#0A1929] border-gray-800"
          : "bg-white border-slate-200"
      }`}
    >
      {/* Left side: Breadcrumb & Title */}
      <div>
        <div className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-slate-500"}`}>
          <span>Seafarer</span>
          <span className="mx-2">/</span>
          <span className={isDark ? "text-white" : "text-slate-900"}>{currentPageName}</span>
        </div>
        <h2 className={`text-xl font-bold mt-0.5 ${isDark ? "text-white" : "text-slate-900"}`}>
          {currentPageName}
        </h2>
      </div>

      {/* Right side: Operations panel */}
      <div className="flex items-center gap-4">
        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-lg transition-all cursor-pointer ${
              isDark ? "hover:bg-gray-800" : "hover:bg-slate-100"
            }`}
            aria-label="Notifications"
          >
            <Bell className={`w-5 h-5 ${isDark ? "text-gray-300" : "text-slate-600"}`} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-bounce flex items-center justify-center text-[7px] text-white font-bold">
                {unreadCount}
              </span>
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
                  isDark ? "bg-[#0A2540] border-gray-800 text-white" : "bg-white border-slate-200 text-slate-900"
                }`}
              >
                <div className="flex items-center justify-between border-b border-gray-800/40 pb-2 mb-2 px-2">
                  <h4 className="font-bold text-sm">Notifications</h4>
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
                    <div className="text-center py-6 text-xs text-gray-500">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2 rounded-lg text-xs leading-normal flex items-start gap-2.5 relative border ${
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
                          {n.title.toLowerCase().includes("course") ? (
                            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                          ) : n.title.toLowerCase().includes("document") ? (
                            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                          ) : (
                            <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold truncate">{n.title}</div>
                          <p className="mt-0.5 text-[10px] leading-relaxed text-gray-400">
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

        {/* Theme Switcher Toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg transition-all cursor-pointer ${
            isDark ? "hover:bg-gray-800 text-yellow-300" : "hover:bg-slate-100 text-slate-600"
          }`}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Vertical Separator */}
        <div className={`w-px h-5 ${isDark ? "bg-gray-800" : "bg-slate-200"}`} />

        {/* Profile Avatar Triggering Profile Page */}
        <Link
          href="/seafearer/profile"
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-md transition-transform hover:scale-105 ${
            isDark ? "bg-cyan-600 hover:bg-cyan-500" : "bg-[#3b71cb] hover:bg-[#2c5fb3]"
          }`}
        >
          {user?.name?.charAt(0) || "S"}
        </Link>
      </div>
    </header>
  );
}
