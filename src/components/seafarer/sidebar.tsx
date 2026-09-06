"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
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
  ShoppingBag,
  Receipt,
  GitFork,
  LifeBuoy,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", href: "/seafarer/dashboard", icon: LayoutDashboard },
  { label: "My Courses", href: "/seafarer/my-courses", icon: BookOpen },
  { label: "Browse Courses", href: "/seafarer/browse-courses", icon: Compass },
  { label: "Documents", href: "/seafarer/documents", icon: FileText },
  { label: "Purchase History", href: "/seafarer/purchase-history", icon: ShoppingBag },
  { label: "Referral Dashboard", href: "/seafarer/referral-dashboard", icon: GitFork },
  { label: "Profile", href: "/seafarer/profile", icon: User },
  { label: "Support", href: "/seafarer/support", icon: LifeBuoy },
];

export default function SeafarerSidebar() {
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
        <div className="h-16 flex items-center px-5 border-b border-transparent">
          <Link href="/seafarer/dashboard" className="flex items-center gap-2.5 min-w-0 group">
            <Image
              src="/logo.jpeg"
              alt="Hari Om Thalassic"
              width={34}
              height={34}
              className="w-[34px] h-[34px] rounded-full object-contain shrink-0 border border-slate-200 dark:border-white/10 shadow-xs"
              priority
            />
            <span
              className={`font-bold tracking-tight text-[15px] whitespace-nowrap ${
                isDark ? "text-slate-100" : "text-slate-900"
              }`}
            >
              Hari Om Thalassic
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
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold tracking-normal transition-colors duration-200 ${
                  active
                    ? "bg-[#3D5EF6] text-white font-bold"
                    : isDark
                    ? "text-gray-300 hover:text-white hover:bg-[#1F2937]"
                    : "text-[#6B7280] hover:text-[#3D5EF6] hover:bg-[#EEF1FE]"
                }`}
              >
                <Icon className={`w-4.5 h-4.5 shrink-0 ${
                  active ? "text-white" : "text-gray-400"
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
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 select-none overflow-hidden ${
            isDark ? "bg-slate-800 text-slate-100" : "bg-slate-200 text-slate-800"
          }`}>
            {(user?.profile?.profilePicture || user?.profilePicture) ? (
              <img
                src={user?.profile?.profilePicture || user?.profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              user?.name?.charAt(0) || "S"
            )}
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
