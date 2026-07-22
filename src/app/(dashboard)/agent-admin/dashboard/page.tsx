"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import { agentAdminService } from "@/services/agent-admin.service";
import Link from "next/link";
import {
  Users, BookOpen, DollarSign, BarChart3, ShieldAlert,
  ArrowUpRight, Activity, FileText, ChevronRight, Briefcase
} from "lucide-react";

export default function AgentAdminDashboard() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const card = `rounded-3xl overflow-hidden p-6 backdrop-blur-xl relative transition-all duration-300 hover:-translate-y-1 ${isDark ? "bg-[#0a1122]/70 border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)]" : "bg-white/80 border border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"}`;
  const ht = isDark ? "text-white/80" : "text-slate-800";
  const mt = isDark ? "text-white/35" : "text-slate-400";
  const headText = ht;
  const mutedText = mt;
  const dv = isDark ? "divide-white/[0.05]" : "divide-slate-100";
  const borderB = isDark ? "border-white/5" : "border-slate-100";
  const rowHover = isDark ? "hover:bg-white/[0.02] transition-colors" : "hover:bg-slate-50/50 transition-colors";

  const fetchDashboardData = async () => {
    try {
      const dbData = await agentAdminService.getDashboardData();
      setData(dbData);
    } catch (err) {
      console.error("Failed to load agent admin dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const kpis = data?.kpis || {
    totalAgents: 0,
    activeAgents: 0,
    pendingOnboarding: 0,
    totalLeads: 0,
    activeLeads: 0,
    expiredLeads: 0,
    totalReferredSeafarers: 0,
    totalRevenueEarned: "₹0",
    commissionPayable: "₹0",
    commissionPaid: "₹0",
    pendingPartnerApps: 0,
  };

  const activities = data?.recentActivities || [];
  const partnerApps = data?.partnerApplications || [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className={`text-2xl font-bold tracking-tight ${headText}`}>Operations Overview</h1>
        <p className={`text-xs mt-1.5 ${mutedText}`}>Monitor agent performance, onboarding progress, and commissions.</p>
      </div>

      {/* KPI Sections - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Referral Metrics */}
        <div className="space-y-4">
          <h2 className={`text-sm font-bold border-b pb-2 ${borderB} ${headText}`}>Referral Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Card 1: Total Agents */}
            <div className={card}>
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-semibold tracking-wider uppercase ${mutedText}`}>Total Agents</span>
                <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-500">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className={`text-3xl font-bold tracking-tight ${headText}`}>{kpis.totalAgents}</span>
                <span className="text-[10px] text-emerald-500 font-semibold flex items-center bg-emerald-500/10 px-1.5 py-0.5 rounded-md">Active: {kpis.activeAgents}</span>
              </div>
            </div>

            {/* Card 2: Referral Leads */}
            <div className={card}>
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-semibold tracking-wider uppercase ${mutedText}`}>Referral Leads</span>
                <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-500">
                  <FileText className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className={`text-3xl font-bold tracking-tight ${headText}`}>{kpis.totalLeads}</span>
                <span className="text-[10px] text-amber-500 font-semibold flex items-center bg-amber-500/10 px-1.5 py-0.5 rounded-md">Active: {kpis.activeLeads}</span>
              </div>
            </div>

            {/* Card 3: Referred Seafarers */}
            <div className={card}>
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-semibold tracking-wider uppercase ${mutedText}`}>Referred Seafarers</span>
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className={`text-3xl font-bold tracking-tight ${headText}`}>{kpis.totalReferredSeafarers}</span>
                <p className={`text-[10px] mt-1 ${mutedText}`}>Via agent referral link</p>
              </div>
            </div>

            {/* Card 4: Partner Applications */}
            <div className={card}>
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-semibold tracking-wider uppercase ${mutedText}`}>Partner Apps</span>
                <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-500">
                  <Briefcase className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className={`text-3xl font-bold tracking-tight ${headText}`}>{kpis.pendingPartnerApps}</span>
                <p className={`text-[10px] mt-1 ${mutedText}`}>Pending review</p>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Financial Metrics */}
        <div className="space-y-4">
          <h2 className={`text-sm font-bold border-b pb-2 ${borderB} ${headText}`}>Financial Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Card 5: Total Revenue Earned */}
            <div className={`${card} sm:col-span-2`}>
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-semibold tracking-wider uppercase ${mutedText}`}>Total Revenue Earned</span>
                <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-500">
                  <BarChart3 className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className={`text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500`}>
                  {kpis.totalRevenueEarned}
                </span>
                <p className={`text-[11px] mt-1.5 ${mutedText}`}>Generated from successful course bookings</p>
              </div>
            </div>

            {/* Card 6: Commission Payable */}
            <div className={card}>
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-semibold tracking-wider uppercase ${mutedText}`}>Commission Payable</span>
                <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-500">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className={`text-2xl font-bold tracking-tight ${headText}`}>{kpis.commissionPayable}</span>
                <p className={`text-[10px] mt-1 ${mutedText}`}>Pending & approved payouts</p>
              </div>
            </div>

            {/* Card 7: Commission Paid */}
            <div className={card}>
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-semibold tracking-wider uppercase ${mutedText}`}>Commission Paid</span>
                <div className="p-2.5 rounded-2xl bg-sky-500/10 text-sky-500">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className={`text-2xl font-bold tracking-tight ${headText}`}>{kpis.commissionPaid}</span>
                <p className={`text-[10px] mt-1 ${mutedText}`}>Settled disbursements</p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Quick Actions & Recent Activity Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Activity Logs */}
        <div className={`${card} lg:col-span-2 flex flex-col`}>
          <div className={`flex items-center justify-between border-b pb-4 mb-4 ${borderB}`}>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              <h3 className={`text-sm font-bold ${headText}`}>Recent Administrative Activity</h3>
            </div>
            <Link href="/agent-admin/audit-logs" className="text-xs text-cyan-400 font-semibold hover:underline flex items-center gap-1">
              View all logs <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className={`flex-1 divide-y ${dv} overflow-y-auto max-h-[350px]`}>
            {activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10">
                <p className={`text-xs ${mutedText}`}>No recent activities recorded.</p>
              </div>
            ) : (
              activities.map((act: any) => (
                <div key={act.id} className="py-3.5 flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 shrink-0 animate-pulse" />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold ${isDark ? "text-white/80" : "text-slate-700"}`}>
                      {act.action.replace(/_/g, " ")}
                    </p>
                    <p className={`text-[11px] mt-0.5 leading-relaxed ${mutedText}`}>{act.details}</p>
                  </div>
                  <span className={`text-[10px] whitespace-nowrap ${mutedText}`}>
                    {new Date(act.timestamp).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className={card}>
          <h3 className={`text-sm font-bold border-b pb-4 mb-4 ${borderB} ${headText}`}>Quick Operations</h3>
          <div className="space-y-3">
            <Link href="/agent-admin/agents?action=create" className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-xs font-semibold transition-all ${isDark ? "bg-white/5 border-white/5 hover:bg-white/10 text-white" : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"}`}>
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-cyan-500" />
                <span>Onboard New Agent</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </Link>
            
            <Link href="/agent-admin/referral-leads" className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-xs font-semibold transition-all ${isDark ? "bg-white/5 border-white/5 hover:bg-white/10 text-white" : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"}`}>
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-cyan-500" />
                <span>Review Referral Leads</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </Link>

            <Link href="/agent-admin/reports" className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-xs font-semibold transition-all ${isDark ? "bg-white/5 border-white/5 hover:bg-white/10 text-white" : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"}`}>
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-4 h-4 text-cyan-500" />
                <span>Operational Reports</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </Link>
          </div>
        </div>
      </div>

      {/* Partner Applications List */}
      <div className={`${card} mt-8`}>
        <div className={`flex items-center justify-between border-b pb-4 mb-4 ${borderB}`}>
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-500" />
            <h3 className={`text-sm font-bold ${headText}`}>Recent Partner Applications</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b ${isDark ? "border-white/5 text-white/50" : "border-slate-100 text-slate-500"}`}>
                <th className="pb-3 font-semibold">Applicant</th>
                <th className="pb-3 font-semibold">Company</th>
                <th className="pb-3 font-semibold">Location</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Date</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? "divide-white/5" : "divide-slate-50"}`}>
              {partnerApps.length === 0 ? (
                <tr>
                  <td colSpan={5} className={`py-8 text-center ${mutedText}`}>No partner applications found.</td>
                </tr>
              ) : (
                partnerApps.map((app: any) => (
                  <tr key={app.id} className={rowHover}>
                    <td className="py-3">
                      <div className={`font-semibold ${headText}`}>{app.fullName}</div>
                      <div className={`text-[10px] ${mutedText}`}>{app.email}</div>
                    </td>
                    <td className="py-3 font-medium">{app.companyName}</td>
                    <td className={`py-3 ${mutedText}`}>{app.city}, {app.state}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        app.status === 'Pending Review' ? 'bg-amber-500/10 text-amber-500' :
                        app.status === 'Contacted' ? 'bg-blue-500/10 text-blue-500' :
                        app.status === 'Approved' ? 'bg-green-500/10 text-green-500' :
                        'bg-slate-500/10 text-slate-500'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className={`py-3 text-right ${mutedText}`}>
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
