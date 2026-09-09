"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Lock, CheckCircle2, XCircle } from "lucide-react";
import { useTheme } from "@/providers/theme-provider";

interface AccessRestrictedProps {
  featureName?: string;
  restrictedItems?: string[];
}

export default function AccessRestricted({
  featureName = "Restricted Function",
  restrictedItems = [
    "Master Portal functions",
    "Company Admin functions",
    "Master-level reports",
    "Other Partners' information & Seafarers",
    "Other Partners' invoices & settlements",
    "Audit Logs",
    "Referral Tracker",
    "Commission information",
  ],
}: AccessRestrictedProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div
        className={`max-w-2xl w-full rounded-[16px] card-elevated border-0 p-8 transition-all duration-300 ${
          isDark
            ? "bg-[#111827] text-white"
            : "bg-white text-[#111827]"
        }`}
      >
        {/* Header Badge */}
        <div className="flex items-center gap-3 border-b pb-5 mb-6 border-red-500/10">
          <div className="w-12 h-12 rounded-[12px] bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FEE2E2] text-[#DC2626]">
                PRD 4.13 COMPLIANT
              </span>
              <span className="text-xs font-bold text-[#9CA3AF]">HTTP 403 Forbidden</span>
            </div>
            <h1 className="text-xl font-bold mt-1">Access Restricted: {featureName}</h1>
          </div>
        </div>

        {/* Notice Description */}
        <p className={`text-xs leading-relaxed mb-6 ${isDark ? "text-white/70" : "text-[#6B7280]"}`}>
          In accordance with <strong>PRD Section 4.13 (Partner Access Restrictions)</strong>, Partner Admin users are restricted from accessing system-level administrative features, master reports, audit trails, commission calculations, or information belonging to other Partner organizations.
        </p>

        {/* Restricted List Box */}
        <div className={`p-4 rounded-[12px] mb-6 border ${isDark ? "bg-[#FEE2E2]/10 border-red-500/20" : "bg-[#FEE2E2]/30 border-red-100"}`}>
          <h3 className="text-xs font-bold text-[#DC2626] uppercase tracking-wider mb-3 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5" /> Restricted Partner Admin Scope
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {restrictedItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <XCircle className="w-3.5 h-3.5 text-[#DC2626] shrink-0" />
                <span className={isDark ? "text-white/80" : "text-[#111827]"}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Permitted Scope */}
        <div className={`p-4 rounded-[12px] mb-6 border ${isDark ? "bg-[#EEF1FE]/10 border-[#3D5EF6]/20" : "bg-[#EEF1FE]/40 border-blue-100"}`}>
          <h3 className="text-xs font-bold text-[#3D5EF6] uppercase tracking-wider mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#3D5EF6]" /> Permitted Role Access
          </h3>
          <p className={`text-xs ${isDark ? "text-white/70" : "text-[#6B7280]"}`}>
            Partner Admin users shall only access information belonging to their own Partner organization: <strong>Dashboard, Agents, Invoices, Settlements, Reports, and Profile</strong>.
          </p>
        </div>

        {/* Return Button */}
        <div className="flex justify-end pt-2">
          <Link
            href="/agent-admin/dashboard"
            className="px-5 py-2.5 rounded-xl bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-[#3D5EF6]/20 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Partner Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
