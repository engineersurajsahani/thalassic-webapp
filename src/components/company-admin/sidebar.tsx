"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/providers/theme-provider";
import { useAuth } from "@/providers/auth-provider";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  FileCheck,
  LifeBuoy,
  LogOut,
  Anchor,
  ChevronRight,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigationGroups = [
  {
    title: "Operations",
    items: [
      { label: "Dashboard", href: "/company-admin/dashboard", icon: LayoutDashboard },
      { label: "Seafarer Management", href: "/company-admin/seafearers", icon: Users },
      { label: "Course Management", href: "/company-admin/courses", icon: BookOpen },
    ],
  },
  {
    title: "Compliance",
    items: [
      { label: "Document Verification", href: "/company-admin/documents", icon: FileCheck },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Help & Support", href: "/company-admin/support", icon: LifeBuoy },
    ],
  },
];

export default function CompanyAdminSidebar({ isOpen, onClose }: SidebarProps) {
  const { theme } = useTheme();
  const { logout, user } = useAuth();
  const isDark = theme === "dark";
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  // Premium design tokens
  const sidebarBg = isDark
    ? "bg-[#0b1329] border-r border-white/5 text-slate-200"
    : "bg-white border-r border-slate-200 text-slate-800";
  const brandBorder = isDark ? "border-white/5" : "border-slate-100";
  const logoText = isDark ? "text-white" : "text-slate-800";
  const logoSub = isDark ? "text-sky-400" : "text-sky-600";
  const groupTitle = isDark ? "text-white/25" : "text-slate-400";
  const activeLink = isDark
    ? "bg-sky-500/10 text-sky-400"
    : "bg-sky-50 text-sky-700";
  const activeIcon = isDark ? "text-sky-400" : "text-sky-600";
  const inactiveLink = isDark
    ? "text-slate-400 hover:bg-white/5 hover:text-white hover:translate-x-1"
    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:translate-x-1";
  const inactiveIcon = isDark ? "text-slate-500 group-hover:text-slate-300" : "text-slate-400 group-hover:text-slate-600";
  const footBorder = isDark ? "border-t border-white/5 bg-[#090f20]" : "border-t border-slate-150 bg-slate-50/50";
  const userName = isDark ? "text-white" : "text-slate-800";
  const userEmail = isDark ? "text-white/30" : "text-slate-400";
  const signOutBtn = isDark
    ? "text-slate-400 hover:bg-red-500/10 hover:text-red-400"
    : "text-slate-600 hover:bg-red-50 hover:text-red-650";

  const renderContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand Header */}
      <div className={`px-6 py-5 flex items-center justify-between border-b ${brandBorder}`}>
        <Link href="/company-admin/dashboard" className="flex items-center gap-3 group/logo">
          <div className="w-8.5 h-8.5 rounded-lg bg-sky-500 flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover/logo:rotate-12 group-hover/logo:scale-110">
            <Anchor className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <p className={`text-xs font-black tracking-wider ${logoText}`}>Thalassic</p>
            <p className={`text-[9px] font-bold tracking-widest uppercase ${logoSub}`}>
              Company Portal
            </p>
          </div>
        </Link>
        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
        {navigationGroups.map((group) => (
          <div key={group.title} className="space-y-1.5">
            <p className={`px-3 text-[9px] font-bold uppercase tracking-wider ${groupTitle}`}>
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`group relative flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold tracking-normal transition-all duration-150 ${
                      active ? activeLink : inactiveLink
                    }`}
                  >
                    {/* Left Border Active Indicator */}
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r bg-sky-500" />
                    )}
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          active ? activeIcon : inactiveIcon
                        }`}
                      />
                      {item.label}
                    </div>
                    {active && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User profile footer */}
      <div className={`p-4 border-t ${footBorder} space-y-2`}>
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white text-[11px] font-black uppercase shrink-0">
            {user?.name ? user.name.split(" ").map((n: any) => n[0]).join("") : "CA"}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-bold truncate leading-none ${userName}`}>
              {user?.name || "Company Admin"}
            </p>
            <p className={`text-[10px] truncate mt-1 ${userEmail}`}>
              {user?.email || "admin@shipping.com"}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${signOutBtn}`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col w-60 h-screen shrink-0 ${sidebarBg}`}>
        {renderContent()}
      </aside>

      {/* Mobile Drawer Overlay Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-60 h-screen z-50 md:hidden transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${sidebarBg}`}
      >
        {renderContent()}
      </aside>
    </>
  );
}
