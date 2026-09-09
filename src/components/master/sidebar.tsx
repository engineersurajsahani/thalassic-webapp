"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "@/providers/theme-provider";
import { useAuth } from "@/providers/auth-provider";
import {
  LayoutDashboard, BookOpen, Users, BarChart3,
  Settings, LogOut, Anchor, ChevronRight, CheckSquare,
  Building2, Handshake, GraduationCap, Wallet,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard",           href: "/master/dashboard",        icon: LayoutDashboard },
  { label: "Course Management",   href: "/master/courses",          icon: BookOpen        },
  { label: "Pricing Approvals",   href: "/master/pricing-approvals",icon: CheckSquare     },
  { label: "Seafarer Management", href: "/master/seafarers",        icon: Users           },
  { label: "Admin Management",    href: "/master/company-admins",   icon: Building2       },
  { label: "Partner Management",  href: "/master/agent-admins",     icon: Handshake       },
  { label: "Institute Management",href: "/master/institutes",       icon: GraduationCap   },
  { label: "Finance",             href: "/master/finance",          icon: Wallet          },
  { label: "Reports",             href: "/master/reports",          icon: BarChart3       },
  { label: "Settings",            href: "/master/settings",         icon: Settings        },
];

export default function MasterSidebar() {
  const { theme } = useTheme();
  const { logout, user } = useAuth();
  const isDark = theme === "dark";
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  // ── theme tokens ──────────────────────────────────────────────────────────
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

  return (
    <aside className={`w-60 h-screen flex flex-col shrink-0 ${sidebarBg}`}>

      {/* Brand */}
      <div className={`px-5 py-5 flex items-center gap-3 border-b ${brandBorder}`}>
        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#3D5EF6]/30 shrink-0 shadow-sm">
          <Image
            src="/logo.jpeg"
            alt="Hari Om Maritime Logo"
            width={32}
            height={32}
            className="object-cover w-full h-full"
          />
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
