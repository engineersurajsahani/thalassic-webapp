"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { partnerService } from "@/services/partner.service";
import { useTheme } from "@/providers/theme-provider";
import {
  Users,
  ShoppingCart,
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Receipt,
  FileCheck,
  AlertCircle,
  Search,
  UserPlus,
  Compass,
} from "lucide-react";

export default function PartnerDashboard() {
  const { theme } = useTheme();
  const mounted = true;
  useEffect(() => setMounted(true), []);
  const isDark = mounted ? theme === "dark" : true;

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await partnerService.getDashboard();
        setDashboardData(data);
      } catch (err) {
        console.error("Failed to load partner dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const stats = dashboardData?.stats;
  const recentPurchases = dashboardData?.recentPurchases || [];
  const recentSettlements = dashboardData?.recentSettlements || [];

  const cardBg = isDark
    ? "bg-[#0B0F19] rounded-[16px] border-0 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
    : "bg-[#FFFFFF] rounded-[16px] border-0 shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]";

  const headingText = isDark ? "text-white font-extrabold" : "text-[#111827] font-extrabold";
  const subText = isDark ? "text-gray-400 font-medium" : "text-[#6B7280] font-medium";
  const accentText = "text-[#3D5EF6] font-extrabold";

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 rounded-full bg-slate-200 dark:bg-white/5" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 rounded-[16px] bg-slate-200 dark:bg-white/5" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-72 rounded-[16px] bg-slate-200 dark:bg-white/5 lg:col-span-2" />
          <div className="h-72 rounded-[16px] bg-slate-200 dark:bg-white/5" />
        </div>
      </div>
    );
  }

  const kpis = [
    {
      label: "Total Purchases",
      value: stats?.totalPurchases || 0,
      icon: ShoppingCart,
      desc: "Courses processed",
      iconBg: isDark ? "bg-[#3D5EF6]/15 text-[#3D5EF6]" : "bg-[#EEF1FE] text-[#3D5EF6]",
    },
    {
      label: "Pending Purchases",
      value: stats?.pendingPurchases || 0,
      icon: Clock,
      desc: "Awaiting settlement",
      iconBg: isDark ? "bg-amber-500/15 text-amber-400" : "bg-[#FEF3C7] text-[#B45309]",
    },
    {
      label: "Total Payable",
      value: `₹${Number(stats?.totalPayable || 0).toLocaleString("en-IN")}`,
      icon: CreditCard,
      desc: "Hari Om course fees",
      iconBg: isDark ? "bg-[#3D5EF6]/15 text-[#3D5EF6]" : "bg-[#EEF1FE] text-[#3D5EF6]",
    },
    {
      label: "Amount Settled",
      value: `₹${Number(stats?.amountSettled || 0).toLocaleString("en-IN")}`,
      icon: CheckCircle2,
      desc: "Transferred & verified",
      iconBg: isDark ? "bg-emerald-500/15 text-emerald-400" : "bg-[#DCFCE7] text-[#16A34A]",
    },
    {
      label: "Outstanding Amount",
      value: `₹${Number(stats?.outstandingAmount || 0).toLocaleString("en-IN")}`,
      icon: AlertCircle,
      desc: "Balance payable",
      iconBg: stats?.outstandingAmount > 0
        ? isDark ? "bg-rose-500/15 text-rose-400" : "bg-[#FEE2E2] text-[#DC2626]"
        : isDark ? "bg-emerald-500/15 text-emerald-400" : "bg-[#DCFCE7] text-[#16A34A]",
      highlight: stats?.outstandingAmount > 0,
    },
    {
      label: "Pending Settlements",
      value: stats?.pendingSettlements || 0,
      icon: FileCheck,
      desc: "Under verification",
      iconBg: isDark ? "bg-purple-500/15 text-purple-400" : "bg-purple-100 text-purple-700",
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${headingText}`}>
            Partner Operations Dashboard
          </h1>
          <p className={`text-xs md:text-sm mt-1 ${subText}`}>
            Manage seafarer candidate registrations, training course purchases, and financial settlements with Hari Om.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            href="/partner/purchases/create"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white shadow-sm transition-colors cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            New Purchase
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-[16px] transition-all duration-200 flex flex-col justify-between ${cardBg}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${subText}`}>
                  {kpi.label}
                </span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${kpi.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <p className={`text-xl font-black ${kpi.highlight ? "text-[#DC2626] dark:text-rose-400" : headingText}`}>
                  {kpi.value}
                </p>
                <p className={`text-[10px] mt-0.5 ${subText}`}>{kpi.desc}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Quick Launchpad */}
      <section className={`p-5 space-y-4 ${cardBg}`}>
        <h2 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-[#3D5EF6]">
          Quick Partner Workflows
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/partner/seafarers"
            className={`p-4 rounded-[16px] flex items-center gap-3.5 transition-all group ${
              isDark ? "bg-white/[0.02] hover:bg-white/5" : "bg-[#FAFAFA] hover:bg-[#EEF1FE]/40"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#EEF1FE] text-[#3D5EF6] dark:bg-[#3D5EF6]/15 flex items-center justify-center shrink-0">
              <Search className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-xs font-bold leading-tight group-hover:text-[#3D5EF6] transition-colors ${headingText}`}>Search Candidate</p>
              <p className={`text-[10px] mt-0.5 truncate ${subText}`}>Lookup INDoS, Passport or CDC</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#3D5EF6] transition-colors shrink-0" />
          </Link>

          <Link
            href="/partner/purchases/create"
            className={`p-4 rounded-[16px] flex items-center gap-3.5 transition-all group ${
              isDark ? "bg-white/[0.02] hover:bg-white/5" : "bg-[#FAFAFA] hover:bg-[#EEF1FE]/40"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#EEF1FE] text-[#3D5EF6] dark:bg-[#3D5EF6]/15 flex items-center justify-center shrink-0">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-xs font-bold leading-tight group-hover:text-[#3D5EF6] transition-colors ${headingText}`}>Course Purchase</p>
              <p className={`text-[10px] mt-0.5 truncate ${subText}`}>Candidate course enrollment</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#3D5EF6] transition-colors shrink-0" />
          </Link>

          <Link
            href="/partner/settlements/create"
            className={`p-4 rounded-[16px] flex items-center gap-3.5 transition-all group ${
              isDark ? "bg-white/[0.02] hover:bg-white/5" : "bg-[#FAFAFA] hover:bg-[#EEF1FE]/40"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-[#16A34A] dark:bg-emerald-500/15 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-xs font-bold leading-tight group-hover:text-[#16A34A] transition-colors ${headingText}`}>Submit Settlement</p>
              <p className={`text-[10px] mt-0.5 truncate ${subText}`}>Transfer course dues to Hari Om</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#16A34A] transition-colors shrink-0" />
          </Link>

          <Link
            href="/partner/financials"
            className={`p-4 rounded-[16px] flex items-center gap-3.5 transition-all group ${
              isDark ? "bg-white/[0.02] hover:bg-white/5" : "bg-[#FAFAFA] hover:bg-[#EEF1FE]/40"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Receipt className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-xs font-bold leading-tight group-hover:text-purple-600 transition-colors ${headingText}`}>Financial Reconciliation</p>
              <p className={`text-[10px] mt-0.5 truncate ${subText}`}>Audit fees & ledger</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors shrink-0" />
          </Link>
        </div>
      </section>

      {/* Main Content Grid: Recent Purchases & Recent Settlements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Purchases (2 cols) */}
        <div className={`lg:col-span-2 p-6 rounded-[16px] ${cardBg}`}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className={`text-base font-extrabold ${headingText}`}>Recent Course Purchases</h2>
              <p className={`text-xs ${subText}`}>
                Latest course purchases processed for seafarers
              </p>
            </div>
            <Link
              href="/partner/purchases"
              className="text-xs font-bold text-[#3D5EF6] hover:text-[#2E4FE0] hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentPurchases.length === 0 ? (
            <div className={`p-8 text-center border border-dashed rounded-[16px] ${isDark ? "border-white/10 text-gray-400" : "border-[#E5E7EB] text-[#6B7280]"}`}>
              <p className="text-sm font-semibold">No course purchases recorded yet.</p>
              <Link
                href="/partner/purchases/create"
                className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-[#3D5EF6] hover:text-[#2E4FE0] hover:underline"
              >
                Create your first course purchase
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className={`border-b ${isDark ? "border-[#1F2937] text-gray-400" : "border-[#E5E7EB] text-[#6B7280]"} uppercase text-[10px] font-bold tracking-wider`}>
                    <th className="py-3 px-3 font-bold">Purchase ID</th>
                    <th className="py-3 px-3 font-bold">Seafarer</th>
                    <th className="py-3 px-3 font-bold">Course</th>
                    <th className="py-3 px-3 font-bold text-right">Hari Om Payable</th>
                    <th className="py-3 px-3 font-bold text-center">Settlement Status</th>
                    <th className="py-3 px-3 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className={isDark ? "divide-y divide-[#1F2937]" : "divide-y divide-[#E5E7EB]"}>
                  {recentPurchases.map((p: any) => {
                    const isSettled = p.settlementStatus === "Completed" || p.settlementStatus === "Settled" || p.settlementStatus === "Paid";
                    const isSubmitted = p.settlementStatus === "Submitted";
                    const displayId = p.id?.includes("-") ? `PUR-${p.id.substring(0, 6).toUpperCase()}` : p.id;

                    return (
                      <tr key={p.id} className={isDark ? "hover:bg-white/[0.02]" : "hover:bg-[#EEF1FE]/30 transition-colors"}>
                        <td className="py-3.5 px-3 font-mono font-bold text-[#3D5EF6]" title={p.id}>
                          {displayId}
                        </td>
                        <td className={`py-3.5 px-3 font-bold ${headingText}`}>{p.seafarerName}</td>
                        <td className={`py-3.5 px-3 truncate max-w-[180px] ${isDark ? "text-gray-300" : "text-[#111827] font-medium"}`}>{p.courseName}</td>
                        <td className={`py-3.5 px-3 font-black text-right ${headingText}`}>₹{Number(p.payableAmount).toLocaleString("en-IN")}</td>
                        <td className="py-3.5 px-3 text-center">
                          <span
                            className={`text-[10px] font-bold uppercase px-3 py-1 rounded-lg inline-flex items-center justify-center gap-1 ${
                              isSettled
                                ? "bg-[#DCFCE7] text-[#16A34A] dark:bg-emerald-500/15 dark:text-emerald-400"
                                : isSubmitted
                                ? "bg-[#EEF1FE] text-[#3D5EF6] dark:bg-blue-500/15 dark:text-blue-400"
                                : "bg-[#FEF3C7] text-[#B45309] dark:bg-amber-500/15 dark:text-amber-400"
                            }`}
                          >
                            {isSettled ? "SETTLED" : (p.settlementStatus || "PENDING").toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <Link
                            href={`/partner/purchases/${p.id}`}
                            className="text-xs font-bold text-[#3D5EF6] hover:text-[#2E4FE0] hover:underline"
                          >
                            Details
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Settlements (1 col) */}
        <div className={`p-6 rounded-[16px] ${cardBg}`}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className={`text-base font-extrabold ${headingText}`}>Settlement History</h2>
              <p className={`text-xs ${subText}`}>Bank remittances</p>
            </div>
            <Link
              href="/partner/settlements"
              className="text-xs font-bold text-[#3D5EF6] hover:text-[#2E4FE0] hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentSettlements.length === 0 ? (
            <div className={`p-8 text-center border border-dashed rounded-[16px] ${isDark ? "border-white/10 text-gray-400" : "border-[#E5E7EB] text-[#6B7280]"}`}>
              <p className="text-sm font-semibold">No settlements recorded yet.</p>
              <Link
                href="/partner/settlements/create"
                className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-[#3D5EF6] hover:text-[#2E4FE0] hover:underline"
              >
                Submit your first remittance
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentSettlements.map((s: any) => {
                const sNumber = s.settlement_number || s.settlementNumber || s.id;
                const isPaid = s.status === "Paid" || s.status === "Completed";
                const isPartial = s.status === "Partial" || s.payment_mode === "partial";
                const isRejected = s.status === "Rejected";

                return (
                  <div
                    key={s.id}
                    className={`p-3.5 rounded-[16px] flex items-center justify-between gap-3 ${
                      isDark ? "bg-white/[0.02]" : "bg-[#FAFAFA]"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-mono font-bold text-[#3D5EF6] truncate">
                        {sNumber}
                      </p>
                      <p className={`text-[10px] mt-0.5 ${subText}`}>
                        {new Date(s.created_at || s.submissionDate).toLocaleDateString("en-IN")}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className={`text-xs font-extrabold ${headingText}`}>
                        ₹{Number(s.paid_amount || s.amount || 0).toLocaleString("en-IN")}
                      </p>
                      <span
                        className={`inline-block mt-0.5 text-[9px] font-bold uppercase px-2 py-0.5 rounded-lg ${
                          isPaid
                            ? "bg-[#DCFCE7] text-[#16A34A] dark:bg-emerald-500/15 dark:text-emerald-400"
                            : isPartial
                            ? "bg-[#FEF3C7] text-[#B45309] dark:bg-amber-500/15 dark:text-amber-400"
                            : isRejected
                            ? "bg-[#FEE2E2] text-[#DC2626] dark:bg-red-500/15 dark:text-red-400"
                            : "bg-[#EEF1FE] text-[#3D5EF6] dark:bg-blue-500/15 dark:text-blue-400"
                        }`}
                      >
                        {s.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
