"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/providers/theme-provider";
import { BarChart3, CreditCard, Users, Building2 } from "lucide-react";

interface FinanceTabItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  matches: (pathname: string) => boolean;
}

const FINANCE_TABS: FinanceTabItem[] = [
  {
    label: "Finance Overview",
    href: "/company-admin/finance/overview",
    icon: BarChart3,
    matches: (pathname: string) =>
      pathname === "/company-admin/finance" ||
      pathname === "/company-admin/finance/" ||
      pathname.startsWith("/company-admin/finance/overview"),
  },
  {
    label: "Payments",
    href: "/company-admin/finance/payments",
    icon: CreditCard,
    matches: (pathname: string) =>
      pathname.startsWith("/company-admin/finance/payments") ||
      pathname.startsWith("/company-admin/payments"),
  },
  {
    label: "Seafarer Payments",
    href: "/company-admin/finance/seafarer",
    icon: Users,
    matches: (pathname: string) => pathname.startsWith("/company-admin/finance/seafarer"),
  },
  {
    label: "Institute Finance",
    href: "/company-admin/finance/institute",
    icon: Building2,
    matches: (pathname: string) => pathname.startsWith("/company-admin/finance/institute"),
  },
];

export default function FinanceTabs() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`border-b pb-1 mb-6 ${
        isDark ? "border-white/10" : "border-slate-200"
      }`}
    >
      <nav className="flex items-center gap-2 overflow-x-auto scrollbar-none">
        {FINANCE_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.matches(pathname);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                isActive
                  ? isDark
                    ? "bg-sky-500/15 text-sky-400 border border-sky-500/30 shadow-sm"
                    : "bg-sky-50 text-sky-600 border border-sky-200 shadow-sm"
                  : isDark
                  ? "text-white/60 hover:text-white hover:bg-white/5"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
