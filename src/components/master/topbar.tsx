"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/providers/theme-provider";
import { Bell, Sun, Moon, LogOut, Settings, BarChart3 } from "lucide-react";

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
  const router = useRouter();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    { id: 1, text: "Raj Kumar uploaded passport for audit verification.", time: "2 hours ago" },
    { id: 2, text: "New course booking: Deck Preparation Course by Amit.", time: "4 hours ago" },
    { id: 3, text: "Database connection pools operating normally.", time: "1 day ago" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

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
        {/* Notification Icon & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className={`relative p-2 rounded-lg transition-all cursor-pointer ${
              isDark
                ? "hover:bg-gray-800"
                : "hover:bg-slate-100"
            }`}
            aria-label="Notifications"
          >
            <Bell className={`w-5 h-5 ${isDark ? "text-gray-300" : "text-slate-600"}`} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {showNotifications && (
            <div className={`absolute right-0 mt-2 w-80 rounded-xl border p-4 shadow-xl z-50 text-xs font-semibold ${
              isDark ? "bg-[#09090b] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-800"
            }`}>
              <div className="flex items-center justify-between border-b border-zinc-800/20 pb-2 mb-3">
                <span className="font-bold">Notifications</span>
                <span className="text-[10px] text-zinc-500 uppercase font-bold">Real-time</span>
              </div>
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div key={n.id} className="border-b border-zinc-800/10 pb-2 last:border-0 last:pb-0">
                    <p className={isDark ? "text-zinc-350" : "text-zinc-650"}>{n.text}</p>
                    <span className="text-[9px] text-zinc-500 block mt-1 font-bold">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg transition-all cursor-pointer ${
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

        {/* Profile Avatar & Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-all cursor-pointer ${
              isDark ? "bg-zinc-800 hover:bg-zinc-700/80 border border-zinc-700" : "bg-zinc-900 hover:bg-zinc-850"
            }`}
            aria-label="Profile"
          >
            M
          </button>

          {showProfileMenu && (
            <div className={`absolute right-0 mt-2 w-48 rounded-xl border p-2 shadow-xl z-50 text-xs font-semibold ${
              isDark ? "bg-[#09090b] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-850"
            }`}>
              <div className="p-2 border-b border-zinc-800/10 mb-1">
                <p className="font-bold">Administrator</p>
                <p className="text-[10px] text-zinc-500">master@example.com</p>
              </div>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  router.push("/master/settings");
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                  isDark ? "hover:bg-zinc-900/60 text-zinc-300" : "hover:bg-zinc-50 text-zinc-750"
                }`}
              >
                <Settings className="w-4 h-4" /> Settings
              </button>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  router.push("/master/reports");
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                  isDark ? "hover:bg-zinc-900/60 text-zinc-300" : "hover:bg-zinc-50 text-zinc-755"
                }`}
              >
                <BarChart3 className="w-4 h-4" /> Reports
              </button>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  handleLogout();
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors cursor-pointer border-t border-zinc-800/10 mt-1 text-red-500 ${
                  isDark ? "hover:bg-red-500/10" : "hover:bg-red-50"
                }`}
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
