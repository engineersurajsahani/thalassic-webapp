"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
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
  ChevronRight,
  Settings,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", href: "/partner/dashboard", icon: LayoutDashboard },
  { label: "Search Seafarer", href: "/partner/seafarers/search", icon: Search },
  { label: "Seafarer Management", href: "/partner/seafarers", icon: Users },
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
    ? "bg-[#0B0F19] border-r border-[#1F2937]"
    : "bg-[#FFFFFF] border-r border-[#E5E7EB]";
  const brandBorder = isDark ? "border-[#1F2937]" : "border-[#E5E7EB]";
  const logoText = isDark ? "text-white" : "text-[#111827]";
  const logoSub = isDark ? "text-[#3D5EF6]" : "text-[#3D5EF6]";
  const navLabel = isDark ? "text-gray-400" : "text-[#6B7280]";
  const activeLink = "bg-[#3D5EF6] text-white";
  const activeIcon = "text-white";
  const activeChev = "text-white/80";
  const inactiveLink = isDark
    ? "text-gray-300 hover:bg-[#1F2937] hover:text-white border border-transparent transition-colors duration-200"
    : "text-[#6B7280] hover:bg-[#EEF1FE] hover:text-[#3D5EF6] border border-transparent transition-colors duration-200";
  const inactiveIcon = isDark ? "text-gray-400 group-hover:text-white" : "text-[#6B7280] group-hover:text-[#3D5EF6]";
  const footBorder = isDark ? "border-[#1F2937]" : "border-[#E5E7EB]";
  const userName = isDark ? "text-white" : "text-[#111827]";
  const userEmail = isDark ? "text-gray-400" : "text-[#6B7280]";
  const signOutBtn = isDark
    ? "text-gray-400 hover:bg-[#DC2626]/10 hover:text-[#DC2626] transition-colors duration-200"
    : "text-[#6B7280] hover:bg-red-50 hover:text-[#DC2626] transition-colors duration-200";

  return (
    <aside className={`w-64 h-screen flex flex-col shrink-0 ${sidebarBg}`}>
      {/* Brand */}
      <div className={`h-16 px-5 border-b ${brandBorder} flex items-center shrink-0`}>
        <Link href="/partner/dashboard" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#3D5EF6]/30 shrink-0 shadow-sm">
            <Image
              src="/logo.jpeg"
              alt="Hari Om Thalassic"
              width={36}
              height={36}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="leading-tight">
            <p className={`text-sm font-bold tracking-wide ${logoText}`}>Hari Om</p>
            <p className={`text-[11px] font-semibold tracking-wider uppercase ${logoSub}`}>Partner Portal</p>
          </div>
        </Link>
      </div>

      {/* Nav label */}
      <div className="px-5 pt-4 pb-2">
        <p className={`text-[10px] font-bold tracking-widest uppercase ${navLabel}`}>Navigation</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
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
      <div className={`p-4 border-t ${footBorder} space-y-2`}>
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5">
          <div className="w-8 h-8 rounded-full bg-[#3D5EF6] flex items-center justify-center text-white text-[11px] font-black uppercase shrink-0">
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
