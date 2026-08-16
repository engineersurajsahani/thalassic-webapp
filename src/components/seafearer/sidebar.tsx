"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/providers/theme-provider";
import { useAuth } from "@/providers/auth-provider";
import {
  LayoutDashboard,
  BookOpen,
  Compass,
  FileText,
  User,
  LogOut,
  Anchor,
  ShoppingBag,
  Receipt,
  GitFork,
  LifeBuoy,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", href: "/seafearer/dashboard", icon: LayoutDashboard },
  { label: "My Courses", href: "/seafearer/my-courses", icon: BookOpen },
  { label: "Browse Courses", href: "/seafearer/browse-courses", icon: Compass },
  { label: "Documents", href: "/seafearer/documents", icon: FileText },
  { label: "Profile", href: "/seafearer/profile", icon: User },
  { label: "Purchase History", href: "/seafearer/purchase-history", icon: ShoppingBag },
  { label: "Invoices", href: "/seafearer/invoices", icon: Receipt },
  { label: "Referral Dashboard", href: "/seafearer/referral-dashboard", icon: GitFork },
  { label: "Support", href: "/seafearer/support", icon: LifeBuoy },
];

export default function SeafearerSidebar() {
  const { theme } = useTheme();
  const { logout, user } = useAuth();
  const isDark = theme === "dark";
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside
      className={`w-64 h-screen flex flex-col justify-between transition-colors duration-205 border-r shrink-0 ${
        isDark
          ? "bg-[#090b0f] border-[#1e293b] text-slate-200"
          : "bg-slate-50 border-slate-200 text-slate-800"
      }`}
    >
      {/* Top Part */}
      <div className="flex flex-col flex-1">
        
        {/* Brand / Logo */}
        <div className="h-16 flex items-center px-6 border-b border-transparent">
          <Link href="/seafearer/dashboard" className="flex items-center gap-3">
            <Anchor className={`w-5.5 h-5.5 ${isDark ? "text-cyan-400" : "text-blue-600"}`} />
            <span className={`font-bold tracking-tight text-base ${isDark ? "text-slate-100" : "text-slate-900"}`}>
              Thalassic
            </span>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="px-4 py-4 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold tracking-normal transition-all duration-150 ${
                  active
                    ? isDark
                      ? "bg-slate-800/80 text-white font-bold"
                      : "bg-slate-200 text-slate-950 font-bold"
                    : isDark
                    ? "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className={`w-4.5 h-4.5 shrink-0 ${
                  active ? (isDark ? "text-cyan-400" : "text-blue-600") : "text-slate-400"
                }`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Part (Profile & Logout) */}
      <div className={`p-4 border-t ${isDark ? "border-[#1e293b]" : "border-slate-200"}`}>
        
        {/* Flat Profile Panel */}
        <div className="flex items-center gap-3.5 px-2 py-2 mb-3">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 select-none ${
            isDark ? "bg-slate-800 text-slate-100" : "bg-slate-200 text-slate-800"
          }`}>
            {user?.name?.charAt(0) || "S"}
          </div>
          <div className="overflow-hidden min-w-0">
            <h4 className={`font-semibold text-sm truncate ${isDark ? "text-slate-200" : "text-slate-800"}`}>
              {user?.name || "Seafarer"}
            </h4>
            <p className={`text-xs truncate ${isDark ? "text-slate-550" : "text-slate-500"}`}>
              INDoS: {user?.profile?.indosNumber || "Not Set"}
            </p>
          </div>
        </div>

        {/* Flat Actions */}
        <button
          onClick={logout}
          className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
            isDark
              ? "text-slate-400 hover:bg-red-500/10 hover:text-red-400"
              : "text-slate-600 hover:bg-red-50 hover:text-red-600"
          }`}
        >
          <LogOut className="w-4.5 h-4.5" />
          <span>Logout</span>
        </button>
      </div>

    </aside>
  );
}
