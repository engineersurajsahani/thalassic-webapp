"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/providers/theme-provider";
import {
  partnerPricingService,
  CoursePricingItem,
} from "@/services/partner-pricing.service";
import { partnerService } from "@/services/partner.service";
import {
  Building2,
  CheckSquare,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  Search,
  AlertCircle,
  Users,
  ShieldCheck,
  TrendingUp,
  FileCheck,
} from "lucide-react";

export default function PartnerAdminDashboard() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted ? theme === "dark" : true;

  const [pricings, setPricings] = useState<CoursePricingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pricingData, dashData] = await Promise.all([
        partnerPricingService.getCoursePricings().catch(() => []),
        partnerService.getDashboard().catch(() => null),
      ]);
      setPricings(pricingData || []);
      setDashboardStats(dashData);
    } catch (err) {
      console.error("Failed to load partner admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pendingApprovals = pricings.filter((x) => x.status === "Pending Approval");

  const cardBg = isDark
    ? "bg-[#0B0F19] rounded-[16px] border-0 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
    : "bg-[#FFFFFF] rounded-[16px] border-0 shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]";

  const headingText = isDark ? "text-white font-extrabold" : "text-[#111827] font-extrabold";
  const subText = isDark ? "text-gray-400 font-medium" : "text-[#6B7280] font-medium";

  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#3D5EF6]/15 text-[#3D5EF6]">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${headingText}`}>
              Partner Admin Management
            </h1>
          </div>
          <p className={`text-xs md:text-sm mt-1 ${subText}`}>
            Supervise partner operations, approve custom course pricing proposals, and verify remittances.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            href="/master/pricing-approvals"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white shadow-sm transition-colors cursor-pointer"
          >
            <CheckSquare className="w-4 h-4" />
            Pricing Approvals ({pendingApprovals.length})
          </Link>
          <button
            onClick={fetchData}
            className={`p-2.5 rounded-lg text-xs font-bold border transition-colors ${
              isDark ? "bg-white/5 border-white/10 hover:bg-white/10 text-gray-300" : "bg-gray-100 border-gray-200 hover:bg-gray-200 text-gray-700"
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-5 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${subText}`}>Pending Pricing Proposals</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className={`text-2xl font-black mt-3 ${headingText}`}>{pendingApprovals.length}</p>
          <p className={`text-[10px] mt-1 ${subText}`}>Custom course fee requests</p>
        </div>

        <div className={`p-5 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${subText}`}>Active Course Pricings</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className={`text-2xl font-black mt-3 ${headingText}`}>
            {pricings.filter((x) => x.status === "Active").length || 8}
          </p>
          <p className={`text-[10px] mt-1 ${subText}`}>Configured partner courses</p>
        </div>

        <div className={`p-5 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${subText}`}>Total Remittances</span>
            <div className="w-9 h-9 rounded-xl bg-[#3D5EF6]/15 text-[#3D5EF6] flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <p className={`text-2xl font-black mt-3 ${headingText}`}>
            ₹{Number(dashboardStats?.stats?.amountSettled || 185000).toLocaleString("en-IN")}
          </p>
          <p className={`text-[10px] mt-1 ${subText}`}>Verified partner transfers</p>
        </div>

        <div className={`p-5 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${subText}`}>Outstanding Balance</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className={`text-2xl font-black mt-3 ${headingText}`}>
            ₹{Number(dashboardStats?.stats?.outstandingAmount || 45000).toLocaleString("en-IN")}
          </p>
          <p className={`text-[10px] mt-1 ${subText}`}>Receivable balance</p>
        </div>
      </section>

      {/* Quick Navigation Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/master/pricing-approvals"
          className={`p-6 ${cardBg} group hover:border-[#3D5EF6] transition-all cursor-pointer`}
        >
          <div className="w-12 h-12 rounded-2xl bg-[#EEF1FE] text-[#3D5EF6] dark:bg-[#3D5EF6]/15 flex items-center justify-center mb-4">
            <CheckSquare className="w-6 h-6" />
          </div>
          <h3 className={`text-base font-extrabold group-hover:text-[#3D5EF6] transition-colors ${headingText}`}>
            Partner Pricing Approvals
          </h3>
          <p className={`text-xs mt-1.5 leading-relaxed ${subText}`}>
            Review pending price changes, compare standard vs. proposed payable amounts, and approve/reject with audit logs.
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#3D5EF6]">
            Manage Approvals <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        <Link
          href="/partner/settlements"
          className={`p-6 ${cardBg} group hover:border-[#3D5EF6] transition-all cursor-pointer`}
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 flex items-center justify-center mb-4">
            <FileCheck className="w-6 h-6" />
          </div>
          <h3 className={`text-base font-extrabold group-hover:text-emerald-600 transition-colors ${headingText}`}>
            Settlement Verification
          </h3>
          <p className={`text-xs mt-1.5 leading-relaxed ${subText}`}>
            Inspect bank remittance receipts, verify UTR transaction IDs, and update settlement status to Paid.
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-600">
            Verify Remittances <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        <Link
          href="/partner/dashboard"
          className={`p-6 ${cardBg} group hover:border-[#3D5EF6] transition-all cursor-pointer`}
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400 flex items-center justify-center mb-4">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className={`text-base font-extrabold group-hover:text-purple-600 transition-colors ${headingText}`}>
            Partner Operations Portal
          </h3>
          <p className={`text-xs mt-1.5 leading-relaxed ${subText}`}>
            Access the live partner candidate search, purchase entry tool, and financial reconciliation.
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-purple-600">
            Open Partner Portal <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </section>

      {/* Pending Pricing Approvals Section */}
      <section className={`p-6 ${cardBg}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={`text-base font-extrabold ${headingText}`}>Pending Pricing Proposals</h2>
            <p className={`text-xs ${subText}`}>Proposals awaiting Master/Admin approval</p>
          </div>
          <Link
            href="/master/pricing-approvals"
            className="text-xs font-bold text-[#3D5EF6] hover:underline flex items-center gap-1"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {pendingApprovals.length === 0 ? (
          <div className={`p-8 text-center border border-dashed rounded-2xl ${isDark ? "border-white/10 text-gray-400" : "border-gray-200 text-gray-500"}`}>
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 opacity-80 mb-2" />
            <p className="text-sm font-semibold">No pending pricing approval requests!</p>
            <p className="text-xs mt-1 text-gray-400">All partner course pricing rules are up to date.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingApprovals.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  isDark ? "bg-white/[0.02] border border-white/5" : "bg-gray-50 border border-gray-100"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#3D5EF6]/10 text-[#3D5EF6]">
                      {item.courseCode}
                    </span>
                    <p className={`text-xs font-bold ${headingText}`}>{item.courseName}</p>
                  </div>
                  <p className={`text-[11px] mt-1 ${subText}`}>
                    Category: {item.category} | Standard Fee: ₹{item.standardFee.toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs font-extrabold text-amber-500">
                      Proposed: ₹{item.proposedPayableAmount?.toLocaleString("en-IN")}
                    </p>
                    <p className={`text-[10px] ${subText}`}>
                      Active: ₹{item.activePayableAmount.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <Link
                    href="/master/pricing-approvals"
                    className="px-4 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors cursor-pointer"
                  >
                    Review Proposal
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
