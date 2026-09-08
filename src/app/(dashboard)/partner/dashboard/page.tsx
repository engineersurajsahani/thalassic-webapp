"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { partnerService } from "@/services/partner.service";
import { useTheme } from "@/providers/theme-provider";
import { useAuth } from "@/providers/auth-provider";
import {
  Users,
  Search,
  ShoppingCart,
  Receipt,
  FileCheck,
  CreditCard,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building,
} from "lucide-react";

export default function PartnerDashboard() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? theme === "dark" : true;

  const [stats, setStats] = useState<any>(null);
  const [recentPurchases, setRecentPurchases] = useState<any[]>([]);
  const [recentSettlements, setRecentSettlements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await partnerService.getDashboard();
        // @ts-expect-error - backend API returns AgentDashboard shape; fix when BE contract is aligned
        setStats(data.stats);
        setRecentPurchases(data.recentPurchases || []);
        setRecentSettlements(data.recentSettlements || []);
      } catch (err) {
        console.error("Failed to load partner dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-12 w-64 rounded-xl bg-slate-200 dark:bg-white/5" />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-slate-200 dark:bg-white/5" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-72 rounded-3xl bg-slate-200 dark:bg-white/5" />
          <div className="h-72 rounded-3xl bg-slate-200 dark:bg-white/5" />
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
      gradient: "from-blue-500/15 to-cyan-500/15",
      iconBg: "bg-blue-500/10 text-blue-400",
    },
    {
      label: "Pending Purchases",
      value: stats?.pendingPurchases || 0,
      icon: Clock,
      desc: "Awaiting settlement",
      gradient: "from-amber-500/15 to-yellow-500/15",
      iconBg: "bg-amber-500/10 text-amber-400",
    },
    {
      label: "Total Payable",
      value: `₹${Number(stats?.totalPayable || 0).toLocaleString("en-IN")}`,
      icon: CreditCard,
      desc: "Hari Om course fees",
      gradient: "from-cyan-500/15 to-blue-500/15",
      iconBg: "bg-cyan-500/10 text-cyan-400",
    },
    {
      label: "Amount Settled",
      value: `₹${Number(stats?.amountSettled || 0).toLocaleString("en-IN")}`,
      icon: CheckCircle2,
      desc: "Transferred & verified",
      gradient: "from-emerald-500/15 to-teal-500/15",
      iconBg: "bg-emerald-500/10 text-emerald-400",
    },
    {
      label: "Outstanding Amount",
      value: `₹${Number(stats?.outstandingAmount || 0).toLocaleString("en-IN")}`,
      icon: AlertCircle,
      desc: "Balance payable",
      gradient: "from-rose-500/15 to-red-500/15",
      iconBg: "bg-rose-500/10 text-rose-400",
      highlight: stats?.outstandingAmount > 0,
    },
    {
      label: "Pending Settlements",
      value: stats?.pendingSettlements || 0,
      icon: FileCheck,
      desc: "Under verification",
      gradient: "from-purple-500/15 to-indigo-500/15",
      iconBg: "bg-purple-500/10 text-purple-400",
    },
  ];

  const cardBg = isDark
    ? "bg-[#09162c]/80 border-white/5 hover:border-white/10"
    : "bg-white border-slate-200/80 shadow-sm hover:shadow-md";

  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-[11px] font-bold uppercase tracking-widest px-3.5 py-1 rounded-full ${
                isDark ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "bg-blue-50 text-blue-600 border border-blue-200"
              }`}
            >
              ⚓ Authorized Partner Portal
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-2.5">
            Partner Operations Dashboard
          </h1>
          <p className={`text-xs md:text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Manage seafarer candidate registrations, physical course purchases, and financial settlements with Hari Om.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            href="/partner/purchases/create"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all"
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
              className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${cardBg}`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-semibold tracking-wide ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  {kpi.label}
                </span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${kpi.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <p className={`text-xl font-black tracking-tight ${kpi.highlight ? "text-rose-400" : ""}`}>
                  {kpi.value}
                </p>
                <p className={`text-[10px] mt-0.5 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                  {kpi.desc}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Quick Launchpad */}
      <section className={`p-5 rounded-2xl border ${cardBg}`}>
        <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400 mb-4 flex items-center gap-2">
          Quick Partner Workflows
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/partner/seafarers/search"
            className={`p-4 rounded-xl border flex items-center gap-3.5 transition-all group ${
              isDark ? "bg-white/[0.03] border-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/20" : "bg-slate-50 border-slate-200/60 hover:bg-blue-50/60 hover:border-blue-200"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
              <Search className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold leading-tight group-hover:text-cyan-400 transition-colors">Search Candidate</p>
              <p className="text-[10px] text-slate-400 mt-0.5 truncate">Lookup INDoS, Passport or CDC</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0" />
          </Link>

          <Link
            href="/partner/purchases/create"
            className={`p-4 rounded-xl border flex items-center gap-3.5 transition-all group ${
              isDark ? "bg-white/[0.03] border-white/5 hover:bg-blue-500/10 hover:border-blue-500/20" : "bg-slate-50 border-slate-200/60 hover:bg-blue-50/60 hover:border-blue-200"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold leading-tight group-hover:text-blue-400 transition-colors">Course Purchase</p>
              <p className="text-[10px] text-slate-400 mt-0.5 truncate">Physical course enrollment</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors shrink-0" />
          </Link>

          <Link
            href="/partner/settlements/create"
            className={`p-4 rounded-xl border flex items-center gap-3.5 transition-all group ${
              isDark ? "bg-white/[0.03] border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/20" : "bg-slate-50 border-slate-200/60 hover:bg-emerald-50/60 hover:border-emerald-200"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold leading-tight group-hover:text-emerald-400 transition-colors">Submit Settlement</p>
              <p className="text-[10px] text-slate-400 mt-0.5 truncate">Transfer course dues to Hari Om</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors shrink-0" />
          </Link>

          <Link
            href="/partner/financials"
            className={`p-4 rounded-xl border flex items-center gap-3.5 transition-all group ${
              isDark ? "bg-white/[0.03] border-white/5 hover:bg-purple-500/10 hover:border-purple-500/20" : "bg-slate-50 border-slate-200/60 hover:bg-purple-50/60 hover:border-purple-200"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
              <Receipt className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold leading-tight group-hover:text-purple-400 transition-colors">Financial Summary</p>
              <p className="text-[10px] text-slate-400 mt-0.5 truncate">Outstanding & settled ledger</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors shrink-0" />
          </Link>
        </div>
      </section>

      {/* Main Content Grid: Recent Purchases & Recent Settlements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Purchases (2 cols) */}
        <div className={`lg:col-span-2 p-6 rounded-2xl border ${cardBg}`}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold">Recent Course Purchases</h2>
              <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Latest physical course purchases processed for seafarers
              </p>
            </div>
            <Link
              href="/partner/purchases"
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentPurchases.length === 0 ? (
            <div className="p-8 text-center border border-dashed rounded-xl border-white/10">
              <p className="text-sm font-semibold text-slate-400">No course purchases recorded yet.</p>
              <Link
                href="/partner/purchases/create"
                className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:underline"
              >
                Create your first course purchase
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className={`border-b ${isDark ? "border-white/10 text-slate-400" : "border-slate-200 text-slate-500"}`}>
                    <th className="pb-3 font-semibold">Purchase ID</th>
                    <th className="pb-3 font-semibold">Seafarer</th>
                    <th className="pb-3 font-semibold">Course</th>
                    <th className="pb-3 font-semibold text-right">Hari Om Payable</th>
                    <th className="pb-3 font-semibold text-center">Settlement</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentPurchases.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 font-mono font-bold text-cyan-400">{p.id}</td>
                      <td className="py-3 font-semibold">{p.seafarerName}</td>
                      <td className="py-3 text-slate-300 truncate max-w-[180px]">{p.courseName}</td>
                      <td className="py-3 font-bold text-right">₹{Number(p.payableAmount).toLocaleString("en-IN")}</td>
                      <td className="py-3 text-center">
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                            p.settlementStatus === "Completed"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : p.settlementStatus === "Submitted"
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {p.settlementStatus}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/partner/purchases/${p.id}`}
                          className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Settlements (1 col) */}
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold">Settlement History</h2>
              <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Recent payments to Hari Om
              </p>
            </div>
            <Link
              href="/partner/settlements"
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentSettlements.length === 0 ? (
            <div className="p-8 text-center border border-dashed rounded-xl border-white/10">
              <p className="text-sm font-semibold text-slate-400">No settlement submissions yet.</p>
              <Link
                href="/partner/settlements/create"
                className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:underline"
              >
                Submit payment settlement
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentSettlements.map((s) => (
                <Link
                  key={s.id}
                  href={`/partner/settlements/${s.id}`}
                  className={`block p-3.5 rounded-xl border transition-all ${
                    isDark ? "bg-white/[0.02] border-white/5 hover:bg-white/5" : "bg-slate-50 border-slate-200/80 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-cyan-400">
                      {s.settlement_number || s.settlementNumber || s.id}
                    </span>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        s.status === "Paid" || s.status === "Completed"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : s.status === "Rejected"
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="text-slate-400 text-[11px]">
                      {new Date(s.created_at || s.submissionDate).toLocaleDateString("en-IN")}
                    </span>
                    <span className="font-bold text-slate-200">
                      ₹{Number(s.total_amount || s.amount || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
