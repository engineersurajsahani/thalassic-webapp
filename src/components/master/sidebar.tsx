"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/providers/theme-provider";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", href: "/master/dashboard", icon: LayoutDashboard },
  { label: "Course Management", href: "/master/courses", icon: BookOpen },
  { label: "User Management", href: "/master/users", icon: Users },
  { label: "Reports", href: "/master/reports", icon: BarChart3 },
  { label: "Settings", href: "/master/settings", icon: Settings },
];

export default function MasterSidebar() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  return (
    <aside
      className={`w-64 h-screen flex flex-col ${
        isDark
          ? "bg-[#0A1929] border-r border-gray-800"
          : "bg-white border-r border-slate-200"
      }`}
    >
      {/* Logo */}
      <div className="p-6 border-b border-gray-800/40">
        <Link href="/master/dashboard" className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white ${
              isDark ? "bg-blue-600" : "bg-blue-500"
            }`}
          >
            M
          </div>
          <div>
            <h1
              className={`font-bold text-sm ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Master
            </h1>
            <p className={`text-xs ${isDark ? "text-gray-400" : "text-slate-500"}`}>
              Portal
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                active
                  ? isDark
                    ? "bg-blue-600/20 text-blue-400 border-l-4 border-blue-500"
                    : "bg-blue-50 text-blue-600 border-l-4 border-blue-500"
                  : isDark
                  ? "text-gray-300 hover:bg-gray-800/50"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-800/40">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            isDark
              ? "text-gray-300 hover:bg-red-600/10 hover:text-red-400"
              : "text-slate-600 hover:bg-red-50 hover:text-red-600"
          }`}
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
