"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/providers/theme-provider";
import {
  LayoutDashboard, CreditCard, Handshake,
  GraduationCap, UserCheck,
} from "lucide-react";

export const FINANCE_TABS = [
  { label: "Finance Overview",    href: "/master/finance",                   icon: LayoutDashboard, exact: true },
  { label: "Payments",            href: "/master/finance/payments",          icon: CreditCard       },
  { label: "Partner Settlements", href: "/master/finance/settlements",       icon: Handshake        },
  { label: "Institute Finance",   href: "/master/finance/institutes",        icon: GraduationCap    },
  { label: "Seafarer Payments",   href: "/master/finance/seafarer-payments", icon: UserCheck        },
];

export default function FinanceTabs() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const dk = theme === "dark";

  return (
    <div className={`flex items-center gap-1 border-b overflow-x-auto pb-px ${dk ? "border-white/8" : "border-slate-200"}`}>
      {FINANCE_TABS.map(tab => {
        const isActive = tab.exact
          ? pathname === tab.href
          : pathname === tab.href || pathname.startsWith(tab.href + "/");
        const Icon = tab.icon;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold transition-all whitespace-nowrap border-b-2 -mb-px ${
              isActive
                ? (dk
                    ? "border-sky-500 text-white"
                    : "border-sky-600 text-black")
                : (dk
                    ? "border-transparent text-white/50 hover:text-white/80"
                    : "border-transparent text-slate-500 hover:text-slate-800")
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? (dk ? "text-sky-400" : "text-sky-600") : "opacity-60"}`} />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
