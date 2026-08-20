"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/providers/theme-provider";
import { useAuth } from "@/providers/auth-provider";
import {
  LayoutDashboard, BookOpen, Users, BarChart3,
  Settings, LogOut, Anchor, ChevronRight, ChevronDown,
  CreditCard, FileText, TrendingUp, Handshake, DollarSign,
} from "lucide-react";

const financeSubItems = [
  { label: "Payments",    href: "/master/finance/payments",    icon: CreditCard  },
  { label: "Invoices",    href: "/master/finance/invoices",    icon: FileText    },
  { label: "Commissions", href: "/master/finance/commissions", icon: TrendingUp  },
  { label: "Settlements", href: "/master/finance/settlements", icon: Handshake   },
  { label: "Audit Logs", href: "/master/finance/audit-logs", icon: FileText },
];

const menuItems = [
  { label: "Dashboard",         href: "/master/dashboard", icon: LayoutDashboard },
  { label: "Course Management", href: "/master/courses",   icon: BookOpen        },
  { label: "User Management",   href: "/master/users",     icon: Users           },
  { label: "Reports",           href: "/master/reports",   icon: BarChart3       },
  { label: "Settings",          href: "/master/settings",  icon: Settings        },
];

export default function MasterSidebar() {
  const { theme } = useTheme();
  const { logout, user } = useAuth();
  const isDark = theme === "dark";
  const pathname = usePathname();

  const isFinanceActive = pathname.startsWith("/master/finance");
  const [financeOpen, setFinanceOpen] = useState(isFinanceActive);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  // ── theme tokens ──────────────────────────────────────────────────────────
  const sidebarBg    = isDark ? "bg-[#0c1a2e] border-r border-white/5"                           : "bg-white border-r border-slate-200";
  const brandBorder  = isDark ? "border-white/8"                                                  : "border-slate-100";
  const logoText     = isDark ? "text-white"                                                      : "text-slate-800";
  const logoSub      = isDark ? "text-sky-400"                                                    : "text-sky-500";
  const navLabel     = isDark ? "text-white/25"                                                   : "text-slate-400";
  const activeLink   = isDark ? "bg-sky-500/15 text-sky-400"                                     : "bg-sky-50 text-sky-600";
  const activeIcon   = isDark ? "text-sky-400"                                                    : "text-sky-600";
  const activeChev   = isDark ? "text-sky-400/60"                                                 : "text-sky-400";
  const inactiveLink = isDark ? "text-white/50 hover:bg-white/5 hover:text-white/80"             : "text-slate-500 hover:bg-slate-50 hover:text-slate-700";
  const inactiveIcon = isDark ? "text-white/40 group-hover:text-white/60"                        : "text-slate-400 group-hover:text-slate-600";
  const footBorder   = isDark ? "border-white/8"                                                  : "border-slate-100";
  const userName     = isDark ? "text-white/80"                                                   : "text-slate-700";
  const userEmail    = isDark ? "text-white/30"                                                   : "text-slate-400";
  const signOutBtn   = isDark ? "text-white/40 hover:bg-red-500/10 hover:text-red-400"           : "text-slate-400 hover:bg-red-50 hover:text-red-500";
  const subLinkBg    = isDark ? "text-white/45 hover:bg-sky-500/10 hover:text-sky-400"           : "text-slate-500 hover:bg-sky-50 hover:text-sky-600";
  const subActiveBg  = isDark ? "bg-sky-500/15 text-sky-400"                                     : "bg-sky-50 text-sky-600";
  const financeParentActive = isDark ? "bg-sky-500/10 text-sky-400" : "bg-sky-50/60 text-sky-600";
  const financeParentInactive = isDark ? "text-white/50 hover:bg-white/5 hover:text-white/80" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700";

  return (
    <aside className={`w-60 h-screen flex flex-col shrink-0 ${sidebarBg}`}>

      {/* Brand */}
      <div className={`px-5 py-5 flex items-center gap-3 border-b ${brandBorder}`}>
        <div className="w-8 h-8 rounded-md bg-sky-500 flex items-center justify-center shrink-0">
          <Anchor className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        <div className="leading-tight">
          <p className={`text-sm font-semibold tracking-wide ${logoText}`}>Thalassic</p>
          <p className={`text-[11px] font-medium tracking-wider uppercase ${logoSub}`}>Master Portal</p>
        </div>
      </div>

      {/* Nav label */}
      <div className="px-5 pt-5 pb-2">
        <p className={`text-[10px] font-semibold tracking-widest uppercase ${navLabel}`}>
          Navigation
        </p>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {/* Dashboard, Courses, Users */}
        {menuItems.slice(0, 3).map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href}
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

        {/* Finance Accordion */}
        <div>
          <button
            onClick={() => setFinanceOpen(!financeOpen)}
            className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${isFinanceActive ? financeParentActive : financeParentInactive}`}
          >
            <div className="flex items-center gap-3">
              <DollarSign className={`w-4 h-4 shrink-0 ${isFinanceActive ? activeIcon : inactiveIcon}`} />
              Finance
            </div>
            <div className={`transition-transform duration-200 ${financeOpen ? "rotate-0" : "-rotate-90"}`}>
              <ChevronDown className={`w-3.5 h-3.5 ${isFinanceActive ? activeChev : (isDark ? "text-white/25" : "text-slate-400")}`} />
            </div>
          </button>

          {/* Submenu */}
          <div
            className={`overflow-hidden transition-all duration-200 ease-in-out ${financeOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
          >
            <div className="mt-0.5 ml-3 pl-3 border-l border-white/8 space-y-0.5 py-1">
              {financeSubItems.map((sub) => {
                const SubIcon = sub.icon;
                const subActive = isActive(sub.href);
                return (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    className={`group flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${subActive ? subActiveBg : subLinkBg}`}
                  >
                    <SubIcon className={`w-3.5 h-3.5 shrink-0 ${subActive ? activeIcon : ""}`} />
                    {sub.label}
                    {subActive && <ChevronRight className={`w-3 h-3 ml-auto ${activeChev}`} />}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Reports, Settings */}
        {menuItems.slice(3).map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href}
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

      {/* User + logout */}
      <div className={`p-3 border-t ${footBorder} space-y-1`}>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
          <div className="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center text-white text-[10px] font-black uppercase shrink-0">
            {user?.name ? user.name.split(" ").map((n: any) => n[0]).join("") : "MA"}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-semibold truncate ${userName}`}>{user?.name || "Master Admin"}</p>
            <p className={`text-[11px] truncate ${userEmail}`}>{user?.email || "admin@thalassic.in"}</p>
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

    </aside>
  );
}
