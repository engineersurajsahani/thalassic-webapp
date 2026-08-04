"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/providers/theme-provider";
import {
  LayoutDashboard, Users, ClipboardList, FileText,
  CreditCard, Receipt, BarChart2, UserCircle,
  LogOut, Anchor, ChevronRight, BookOpen,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard",           href: "/company-admin/dashboard",          icon: LayoutDashboard },
  { label: "Seafarers",           href: "/company-admin/seafearers",          icon: Users           },
  { label: "Courses",             href: "/company-admin/courses",             icon: BookOpen        },
  { label: "Walk-in Registration",href: "/company-admin/walk-in-registration",icon: ClipboardList   },
  { label: "Documents",           href: "/company-admin/documents",           icon: FileText        },
  { label: "Payments",            href: "/company-admin/payments",            icon: CreditCard      },
  { label: "Invoices",            href: "/company-admin/invoices",            icon: Receipt         },
  { label: "Reports",             href: "/company-admin/reports",             icon: BarChart2       },
  { label: "Profile",             href: "/company-admin/profile",             icon: UserCircle      },
];

export default function CompanyAdminSidebar() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  // ── theme tokens ──────────────────────────────────────────────────────────
  const sidebarBg    = isDark ? "bg-[#0c1a2e] border-r border-white/5"          : "bg-white border-r border-slate-200";
  const brandBorder  = isDark ? "border-white/8"                                 : "border-slate-100";
  const logoText     = isDark ? "text-white"                                     : "text-slate-800";
  const logoSub      = isDark ? "text-emerald-400"                               : "text-emerald-600";
  const navLabel     = isDark ? "text-white/25"                                  : "text-slate-400";
  const activeLink   = isDark ? "bg-emerald-500/15 text-emerald-400"             : "bg-emerald-50 text-emerald-700";
  const activeIcon   = isDark ? "text-emerald-400"                               : "text-emerald-700";
  const activeChev   = isDark ? "text-emerald-400/60"                            : "text-emerald-500";
  const inactiveLink = isDark ? "text-white/50 hover:bg-white/5 hover:text-white/80" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700";
  const inactiveIcon = isDark ? "text-white/40 group-hover:text-white/60"        : "text-slate-400 group-hover:text-slate-600";
  const footBorder   = isDark ? "border-white/8"                                 : "border-slate-100";
  const userName     = isDark ? "text-white/80"                                  : "text-slate-700";
  const userEmail    = isDark ? "text-white/30"                                  : "text-slate-400";
  const signOutBtn   = isDark ? "text-white/40 hover:bg-red-500/10 hover:text-red-400" : "text-slate-400 hover:bg-red-50 hover:text-red-500";

  return (
    <aside className={`w-60 h-screen flex flex-col shrink-0 ${sidebarBg}`}>

      {/* Brand */}
      <div className={`px-5 py-5 flex items-center gap-3 border-b ${brandBorder}`}>
        <div className="w-8 h-8 rounded-md bg-emerald-500 flex items-center justify-center shrink-0">
          <Anchor className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        <div className="leading-tight">
          <p className={`text-sm font-semibold tracking-wide ${logoText}`}>Thalassic</p>
          <p className={`text-[11px] font-medium tracking-wider uppercase ${logoSub}`}>Company Admin</p>
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
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
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
          <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            CA
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-semibold truncate ${userName}`}>Company Admin</p>
            <p className={`text-[11px] truncate ${userEmail}`}>admin@company.in</p>
          </div>
        </div>
        <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${signOutBtn}`}>
          <LogOut className="w-4 h-4 shrink-0" />
          Sign out
        </button>
      </div>

    </aside>
  );
}
