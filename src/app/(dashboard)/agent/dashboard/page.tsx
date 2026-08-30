"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { agentService } from "@/services/agent.service";
import { useTheme } from "@/providers/theme-provider";
import { useAuth } from "@/providers/auth-provider";
import {
  Users, Share2, ClipboardList, DollarSign,
  TrendingUp, Clock, HelpCircle, ArrowRight, Sparkles
} from "lucide-react";

export default function AgentDashboard() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? theme === "dark" : true;

  const [stats, setStats] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [referralCode, setReferralCode] = useState<string>("PENDING");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (!referralCode || referralCode === "PENDING") return;
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  useEffect(() => {
    async function loadData() {
      try {
        const data = await agentService.getDashboard();
        setStats(data.stats);
        setActivities(data.recentActivities);
        setReferralCode(data.referralCode || "PENDING");
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`h-28 rounded-2xl ${isDark ? "bg-[#09162c]" : "bg-slate-100"}`} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`lg:col-span-2 h-72 rounded-3xl ${isDark ? "bg-[#09162c]" : "bg-slate-100"}`} />
          <div className={`h-72 rounded-3xl ${isDark ? "bg-[#09162c]" : "bg-slate-100"}`} />
        </div>
      </div>
    );
  }

  const kpis = [
    { label: "Total Referral Leads", value: stats?.totalLeads || 0, icon: Users, desc: "Total crew registrants", gradient: "from-blue-500/10 to-cyan-500/10", iconBg: "bg-cyan-500/10", iconText: "text-cyan-500" },
    { label: "Active Referral Leads", value: stats?.activeLeads || 0, icon: Clock, desc: "Leads within 45-day validity", gradient: "from-amber-500/10 to-yellow-500/10", iconBg: "bg-amber-500/10", iconText: "text-amber-500" },
    { label: "Total Course Purchases", value: stats?.totalPurchases || 0, icon: ClipboardList, desc: "Successful checkouts", gradient: "from-indigo-500/10 to-purple-500/10", iconBg: "bg-indigo-500/10", iconText: "text-indigo-500" },
    { label: "Total Earnings", value: `₹${stats?.totalEarned?.toLocaleString() || 0}`, icon: DollarSign, desc: "Commissions earned to date", gradient: "from-cyan-500/10 to-blue-500/10", iconBg: "bg-cyan-500/10", iconText: "text-cyan-500" },
    { label: "Pending Payout", value: `₹${stats?.pendingCommission?.toLocaleString() || 0}`, icon: Clock, desc: "Awaiting admin clearance", gradient: "from-rose-500/10 to-red-500/10", iconBg: "bg-rose-500/10", iconText: "text-rose-500" },
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-[10px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full ${
              isDark ? "bg-cyan-500/10 text-cyan-400" : "bg-blue-50 text-blue-700"
            }`}>
              ⚓ Partner Workspace
            </span>
            <button
              onClick={handleCopyCode}
              title="Click to copy Referral Code"
              className="text-[10px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 transition active:scale-95 cursor-pointer outline-none"
            >
              Referral Code: <span className="font-mono text-cyan-400 font-extrabold">{referralCode}</span>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400 animate-in zoom-in duration-200" />
              ) : (
                <Copy className="w-3.5 h-3.5 opacity-60 hover:opacity-100" />
              )}
            </button>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mt-2.5">
            Welcome back, {user?.name || "Partner"}
          </h1>
          <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Track your referred seafarer leads, conversions, and commission ledgers.
          </p>
        </div>
      </div>

      {/* KPI Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {kpis.map((kpi, idx, arr) => {
          const Icon = kpi.icon;
          const isLastOdd = arr.length % 2 !== 0 && idx === arr.length - 1;
          return (
            <div
              key={idx}
              className={`rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group backdrop-blur-xl ${
                isLastOdd ? "md:col-span-2 lg:col-span-1" : ""
              } ${
                isDark 
                  ? "bg-[#0a1122]/70 border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-white" 
                  : "bg-white/80 border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-slate-900"
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${kpi.gradient} opacity-20 pointer-events-none`} />
              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-1">
                  <span className={`text-[10px] font-black tracking-widest uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    {kpi.label}
                  </span>
                  <p className="text-2xl font-black tracking-tight">{kpi.value}</p>
                </div>
                <div className={`p-2.5 rounded-2xl ${kpi.iconBg} ${kpi.iconText}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className={`text-[9px] font-bold mt-4 tracking-wide uppercase ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                {kpi.desc}
              </p>
            </div>
          );
        })}
      </section>

      {/* Bottom Layout split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Activity */}
        <section className={`lg:col-span-2 rounded-3xl border p-6 md:p-8 relative overflow-hidden flex flex-col justify-between backdrop-blur-xl ${
          isDark ? "bg-[#0a1122]/70 border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-white" : "bg-white/80 border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-slate-900"
        }`}>
          <div>
            <div className={`flex items-center justify-between border-b pb-4 mb-5 ${isDark ? "border-slate-800/40" : "border-slate-200"}`}>
              <div className="flex items-center gap-2">
                <Sparkles className={`w-4 h-4 ${isDark ? "text-cyan-400" : "text-blue-600"}`} />
                <h3 className="text-lg font-black tracking-tight">Recent Activity Feed</h3>
              </div>
            </div>

            {activities.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <p className="text-sm font-bold">No recent activities</p>
                <p className="text-xs mt-1">Activities will log here once leads register or buy courses.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {activities.map((act) => (
                  <div key={act.id} className={`flex gap-4 border-b pb-4 last:border-0 last:pb-0 ${isDark ? "border-slate-800/20" : "border-slate-200"}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-black ${
                      act.type === "lead"
                        ? isDark ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "bg-blue-50 text-blue-600 border border-blue-200"
                        : isDark ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                    }`}>
                      {act.type === "lead" ? "LD" : "CM"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black tracking-tight">{act.title}</p>
                      <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>{act.message}</p>
                      <p className={`text-[10px] mt-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                        {new Date(act.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Quick Operations */}
        <section className={`rounded-3xl border p-6 md:p-8 flex flex-col justify-between backdrop-blur-xl ${
          isDark ? "bg-[#0a1122]/70 border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-white" : "bg-white/80 border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-slate-900"
        }`}>
          <div className="space-y-6">
            <h3 className={`text-lg font-black tracking-tight border-b pb-4 ${isDark ? "border-slate-800/40" : "border-slate-200"}`}>
              Quick Operations
            </h3>

            <div className="space-y-3">
              {[
                { label: "Register New Lead", href: "/agent/referral-leads", desc: "Add prospective seafarer manually" },
                { label: "View Referral Code", href: "/agent/referral-center", desc: "Copy referral link or QR code" },
                { label: "Commissions Ledger", href: "/agent/commissions", desc: "Track earnings and payout history" },
                { label: "Support Tickets", href: "/agent/support", desc: "Raise technical/settlement queries" },
              ].map((opt, i) => (
                <Link
                  key={i}
                  href={opt.href}
                  className={`group flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 ${
                    isDark
                      ? "bg-slate-900/40 border-slate-800/80 text-white hover:border-cyan-500/20"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-500/20 hover:bg-white"
                  }`}
                >
                  <div>
                    <span className="text-xs font-black block leading-none">{opt.label}</span>
                    <span className={`text-[10px] block mt-1 ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                      {opt.desc}
                    </span>
                  </div>
                  <ArrowRight className={`w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all ${
                    isDark ? "text-cyan-400" : "text-blue-600"
                  }`} />
                </Link>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
