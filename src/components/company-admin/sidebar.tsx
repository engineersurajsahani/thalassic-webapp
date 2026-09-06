"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/providers/theme-provider";
import { useAuth } from "@/providers/auth-provider";
import {
  LayoutDashboard, Users, UserPlus, FileCheck, BookOpen,
  CreditCard, FileText, BarChart3, Settings,
  LogOut, ChevronRight, X, Building, DollarSign
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { label: "Dashboard",            href: "/company-admin/dashboard",    icon: LayoutDashboard },
  { label: "Seafarers",            href: "/company-admin/seafarers",    icon: Users },
  { label: "Course Management",    href: "/company-admin/courses",      icon: BookOpen },
  { label: "Walk-in Registration", href: "/company-admin/registration", icon: UserPlus },
  { label: "Documents",            href: "/company-admin/documents",    icon: FileCheck },
  { label: "Finance",              href: "/company-admin/finance",      icon: DollarSign },
  { label: "Reports",              href: "/company-admin/reports",      icon: BarChart3 },
  { label: "Profile",              href: "/company-admin/profile",      icon: Settings },
];

export default function CompanyAdminSidebar({ isOpen, onClose }: SidebarProps) {
  const { theme } = useTheme();
  const { logout, user } = useAuth();
  const isDark = theme === "dark";
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/company-admin/seafarers") {
      return pathname.startsWith("/company-admin/seafarers") || pathname.startsWith("/company-admin/seafearers");
    }
    if (href === "/company-admin/finance") {
      return pathname.startsWith("/company-admin/finance") || pathname.startsWith("/company-admin/payments");
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  // ── theme tokens (Matching Master Portal) ──────────────────────────────
  const sidebarBg   = isDark ? "bg-[#0B0F19] border-r border-[#1F2937]" : "bg-[#FFFFFF] border-r border-[#E5E7EB]";
  const brandBorder = isDark ? "border-[#1F2937]" : "border-[#E5E7EB]";
  const logoText    = isDark ? "text-white" : "text-[#111827]";
  const logoSub     = isDark ? "text-[#3D5EF6]" : "text-[#3D5EF6]";
  const navLabel    = isDark ? "text-gray-400" : "text-[#6B7280]";
  const activeLink  = isDark ? "bg-[#3D5EF6] text-white" : "bg-[#3D5EF6] text-white";
  const activeIcon  = "text-white";
  const activeChev  = "text-white/80";
  const inactiveLink= isDark ? "text-gray-300 hover:bg-[#1F2937] hover:text-white transition-colors duration-200" : "text-[#6B7280] hover:bg-[#EEF1FE] hover:text-[#3D5EF6] transition-colors duration-200";
  const inactiveIcon= isDark ? "text-gray-400 group-hover:text-white" : "text-[#6B7280] group-hover:text-[#3D5EF6]";
  const footBorder  = isDark ? "border-[#1F2937]" : "border-[#E5E7EB]";
  const userName    = isDark ? "text-white" : "text-[#111827]";
  const userEmail   = isDark ? "text-gray-400" : "text-[#6B7280]";
  const signOutBtn  = isDark ? "text-gray-400 hover:bg-[#DC2626]/10 hover:text-[#DC2626] transition-colors duration-200" : "text-[#6B7280] hover:bg-red-50 hover:text-[#DC2626] transition-colors duration-200";

  const renderContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand Header */}
      <div className={`px-5 py-5 flex items-center justify-between border-b ${brandBorder}`}>
        <Link href="/company-admin/dashboard" className="flex items-center gap-3 group/logo">
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
            <Image
              src="/logo/hariom_logo.png"
              alt="Hari Om logo"
              width={32}
              height={32}
              className="w-full h-full object-contain"
            />

          <div className="w-8 h-8 rounded-md bg-[#3D5EF6] flex items-center justify-center shrink-0">
            <Anchor className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <p className={`text-sm font-semibold tracking-wide ${logoText}`}>Thalassic</p>
            <p className={`text-[11px] font-medium tracking-wider uppercase ${logoSub}`}>
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

      {/* Nav label */}
      <div className="px-5 pt-5 pb-2">
        <p className={`text-[10px] font-semibold tracking-widest uppercase ${navLabel}`}>
          Navigation
        </p>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${active ? activeLink : inactiveLink}`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 shrink-0 ${active ? activeIcon : inactiveIcon}`} />
                {item.label}
              </div>
              {active && <ChevronRight className={`w-3.5 h-3.5 ${activeChev}`} />}
            </Link>
          );
        })}
      </nav>

      {/* User profile footer */}
      <div className={`p-3 border-t ${footBorder} space-y-1`}>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
          <div className="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center text-white text-[10px] font-black uppercase shrink-0">
            {user?.name ? user.name.split(" ").map((n: any) => n[0]).join("") : "CA"}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-semibold truncate ${userName}`}>
              {user?.name || "Company Admin"}
            </p>
            <p className={`text-[11px] truncate ${userEmail}`}>
              {user?.email || "admin@shipping.com"}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 cursor-pointer ${signOutBtn}`}
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
