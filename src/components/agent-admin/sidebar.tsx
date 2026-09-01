"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/providers/theme-provider";
import { useAuth } from "@/providers/auth-provider";
import {
  LayoutDashboard, Users, FileText, ClipboardList,
  DollarSign, BarChart3, ShieldAlert, User, LogOut,
  Anchor, ChevronRight, Receipt, Tag,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard",          href: "/agent-admin/dashboard",      icon: LayoutDashboard },
  { label: "Agents",             href: "/agent-admin/agents",         icon: Users           },
  { label: "Course Pricing",     href: "/agent-admin/pricing",        icon: Tag             },
  { label: "Invoices",           href: "/agent-admin/invoices",        icon: Receipt         },
  { label: "Reports",            href: "/agent-admin/reports",         icon: BarChart3       },
  { label: "Profile",            href: "/agent-admin/profile",         icon: User            },
];

export default function AgentAdminSidebar() {
  const { theme } = useTheme();
  const { logout, user } = useAuth();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? theme === "dark" : true;
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  // ── theme tokens ──────────────────────────────────────────────────────────
  const sidebarBg   = isDark ? "bg-[#0a1122]/60 backdrop-blur-2xl border-r border-white/5 shadow-[4px_0_24px_rgba(0,0,0,0.2)]" : "bg-white/60 backdrop-blur-2xl border-r border-slate-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)]";
  const brandBorder = isDark ? "border-white/5"                               : "border-slate-200/60";
  const logoText    = isDark ? "text-white"                                   : "text-slate-800";
  const logoSub     = isDark ? "text-cyan-400"                                 : "text-blue-600";
  const navLabel    = isDark ? "text-white/30"                                : "text-slate-500 font-bold";
  const activeLink  = isDark ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/10 shadow-inner shadow-cyan-500/20" : "bg-blue-600 shadow-md shadow-blue-500/20 text-white";
  const activeIcon  = isDark ? "text-cyan-400"                                 : "text-white";
  const activeChev  = isDark ? "text-cyan-400/60"                              : "text-white/70";
  const inactiveLink= isDark ? "text-white/50 hover:bg-white/5 hover:text-white/80 border border-transparent" : "text-slate-600 hover:bg-slate-100/50 hover:text-slate-900 border border-transparent";
  const inactiveIcon= isDark ? "text-white/40 group-hover:text-white/60"     : "text-slate-400 group-hover:text-blue-500";
  const footBorder  = isDark ? "border-white/5"                              : "border-slate-200/60";
  const userName    = isDark ? "text-white/90"                               : "text-slate-800 font-bold";
  const userEmail   = isDark ? "text-white/40"                               : "text-slate-500";
  const signOutBtn  = isDark ? "text-white/40 hover:bg-red-500/10 hover:text-red-400" : "text-slate-500 hover:bg-red-50 hover:text-red-600";

  return (
    <aside className={`w-60 h-screen flex flex-col shrink-0 ${sidebarBg}`}>

      {/* Brand */}
      <div className={`px-5 py-5 flex items-center gap-3 border-b ${brandBorder}`}>
        <div className="w-8 h-8 rounded-md bg-cyan-500 flex items-center justify-center shrink-0">
          <Anchor className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        <div className="leading-tight">
          <p className={`text-sm font-semibold tracking-wide ${logoText}`}>Thalassic</p>
          <p className={`text-[11px] font-medium tracking-wider uppercase ${logoSub}`}>Partner Admin</p>
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
          <div className="w-7 h-7 rounded-full bg-cyan-500 flex items-center justify-center text-white text-[10px] font-black uppercase shrink-0">
            {user?.name ? user.name.split(" ").map((n: any) => n[0]).join("") : "PA"}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-semibold truncate ${userName}`}>{user?.name || "Partner Admin"}</p>
            <p className={`text-[11px] truncate ${userEmail}`}>{user?.email || "ops@thalassic.in"}</p>
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
