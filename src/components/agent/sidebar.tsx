"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/providers/theme-provider";
import { useAuth } from "@/providers/auth-provider";
import {
  LayoutDashboard,
  Search,
  Users,
  ShoppingCart,
  Receipt,
  FileCheck,
  CreditCard,
  Files,
  LifeBuoy,
  LogOut,
  Anchor,
  ChevronRight,
  Settings,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", href: "/partner/dashboard", icon: LayoutDashboard },
  { label: "Search Seafarer", href: "/partner/seafarers/search", icon: Search },
  { label: "Seafarer Master", href: "/partner/seafarers", icon: Users },
  { label: "New Purchase", href: "/partner/purchases/create", icon: ShoppingCart },
  { label: "Purchase History", href: "/partner/purchases", icon: Receipt },
  { label: "Submit Settlement", href: "/partner/settlements/create", icon: CreditCard },
  { label: "Settlement History", href: "/partner/settlements", icon: FileCheck },
  { label: "Financial Summary", href: "/partner/financials", icon: CreditCard },
  { label: "Verification Docs", href: "/partner/documents", icon: Files },
  { label: "Support Tickets", href: "/partner/support", icon: LifeBuoy },
  { label: "Account Settings", href: "/partner/profile", icon: Settings },
];

export default function AgentSidebar() {
  const { theme } = useTheme();
  const { logout, user } = useAuth();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? theme === "dark" : true;
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (pathname === href) return true;
    if (pathname.startsWith(href + "/") && href !== "/partner/seafarers" && href !== "/partner/purchases" && href !== "/partner/settlements") {
      return true;
    }
    if (pathname === "/partner/seafarers" && href === "/partner/seafarers") return true;
    if (pathname === "/partner/purchases" && href === "/partner/purchases") return true;
    if (pathname === "/partner/settlements" && href === "/partner/settlements") return true;
    return false;
  };

  const sidebarBg = isDark
    ? "bg-[#0a1122]/70 backdrop-blur-2xl border-r border-white/5 shadow-[4px_0_24px_rgba(0,0,0,0.2)]"
    : "bg-white/70 backdrop-blur-2xl border-r border-slate-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)]";
  const brandBorder = isDark ? "border-white/5" : "border-slate-200/60";
  const logoText = isDark ? "text-white" : "text-slate-800";
  const logoSub = isDark ? "text-cyan-400" : "text-blue-600";
  const navLabel = isDark ? "text-white/30" : "text-slate-500 font-bold";
  const activeLink = isDark
    ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/15 shadow-inner shadow-cyan-500/20"
    : "bg-blue-600 shadow-md shadow-blue-500/20 text-white";
  const activeIcon = isDark ? "text-cyan-400" : "text-white";
  const activeChev = isDark ? "text-cyan-400/60" : "text-white/70";
  const inactiveLink = isDark
    ? "text-white/60 hover:bg-white/5 hover:text-white border border-transparent"
    : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 border border-transparent";
  const inactiveIcon = isDark ? "text-white/40 group-hover:text-cyan-400" : "text-slate-400 group-hover:text-blue-600";
  const footBorder = isDark ? "border-white/5" : "border-slate-200/60";
  const userName = isDark ? "text-white/90" : "text-slate-800 font-bold";
  const userEmail = isDark ? "text-white/40" : "text-slate-500";
  const signOutBtn = isDark
    ? "text-white/50 hover:bg-red-500/10 hover:text-red-400"
    : "text-slate-500 hover:bg-red-50 hover:text-red-600";

  return (
    <aside className={`w-64 h-screen flex flex-col shrink-0 ${sidebarBg}`}>
      {/* Brand */}
      <div className={`px-5 py-5 flex items-center gap-3 border-b ${brandBorder}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20">
          <Anchor className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
        <div className="leading-tight">
          <p className={`text-sm font-bold tracking-wide ${logoText}`}>Hari Om</p>
          <p className={`text-[11px] font-semibold tracking-wider uppercase ${logoSub}`}>Partner Portal</p>
        </div>
      </div>

      {/* Nav label */}
      <div className="px-5 pt-4 pb-1.5">
        <p className={`text-[10px] font-bold tracking-widest uppercase ${navLabel}`}>Navigation</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                active ? activeLink : inactiveLink
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${active ? activeIcon : inactiveIcon}`} />
                <span>{item.label}</span>
              </div>
              {active && <ChevronRight className={`w-3.5 h-3.5 ${activeChev}`} />}
            </Link>
          );
        })}
      </nav>

      {/* User info & Signout */}
      <div className={`p-3 border-t ${footBorder} space-y-1`}>
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-[11px] font-black uppercase shrink-0">
            {user?.name ? user.name.split(" ").map((n: any) => n[0]).join("") : "HP"}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-semibold truncate ${userName}`}>{user?.name || "Authorized Partner"}</p>
            <p className={`text-[10px] truncate ${userEmail}`}>{user?.email || "partner@hariom.in"}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${signOutBtn}`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
