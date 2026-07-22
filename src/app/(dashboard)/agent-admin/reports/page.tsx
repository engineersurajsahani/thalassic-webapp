"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import { agentAdminService } from "@/services/agent-admin.service";
import { BarChart3, RefreshCw, Sparkles, TrendingUp, Users, ArrowUpRight, DollarSign } from "lucide-react";

export default function Reports() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [loading, setLoading] = useState(true);
  const [reportsData, setReportsData] = useState<any>(null);

  const card = `rounded-3xl overflow-hidden p-6 ${isDark ? "bg-[#0d1f35] border border-white/[0.06]" : "bg-white border border-slate-200 shadow-sm"}`;
  const labelText = isDark ? "text-white/50" : "text-slate-500";
  const ht = isDark ? "text-white/95" : "text-slate-800";
  const mt = isDark ? "text-white/35" : "text-slate-400";
  const borderB = isDark ? "border-white/5" : "border-slate-100";

  const fetchReports = async () => {
    try {
      const data = await agentAdminService.getReports();
      setReportsData(data);
    } catch (err) {
      console.error("Failed to load reports data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const performance = reportsData?.agentPerformance || [];
  const conversion = reportsData?.conversionSummary || {
    totalLeads: 0,
    convertedLeads: 0,
    globalConversionRate: "0%",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${ht}`}>Operational Analytics</h1>
          <p className={`text-xs mt-1.5 ${mt}`}>Performance statistics, conversion rates, and revenue reports.</p>
        </div>
        <button 
          onClick={fetchReports}
          className={`p-2.5 rounded-xl border flex items-center justify-center cursor-pointer transition ${isDark ? "border-white/10 hover:bg-white/5 text-white/50" : "border-slate-200 hover:bg-slate-50 text-slate-500 shadow-sm"}`}
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Total leads card */}
        <div className={card}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-semibold tracking-wider uppercase ${labelText}`}>Total Pipeline Leads</span>
            <Users className="w-4 h-4 text-cyan-500" />
          </div>
          <p className={`text-3xl font-bold mt-4 ${ht}`}>{conversion.totalLeads}</p>
        </div>

        {/* Converted leads card */}
        <div className={card}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-semibold tracking-wider uppercase ${labelText}`}>Converted Referrals</span>
            <Sparkles className="w-4 h-4 text-cyan-500" />
          </div>
          <p className={`text-3xl font-bold mt-4 text-emerald-500`}>{conversion.convertedLeads}</p>
        </div>

        {/* Conversion rate card */}
        <div className={card}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-semibold tracking-wider uppercase ${labelText}`}>Global Conversion Rate</span>
            <TrendingUp className="w-4 h-4 text-cyan-500" />
          </div>
          <p className={`text-3xl font-bold mt-4 text-cyan-400`}>{conversion.globalConversionRate}</p>
        </div>

      </div>

      {/* Agent Performance List Table */}
      <div className={card}>
        <div className="flex items-center gap-2 border-b pb-4 mb-4 border-white/5">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold">Placement Agent Performance Ledger</h3>
        </div>

        {performance.length === 0 ? (
          <div className="text-center py-10">
            <p className={`text-xs ${mt}`}>No agent reports data available.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b pb-3 ${isDark ? "border-white/5 text-white/30" : "border-slate-100 text-slate-400"} uppercase font-semibold tracking-wider`}>
                  <th className="py-3.5 px-2">Agent Name</th>
                  <th className="py-3.5 px-2 text-center">Referral Leads</th>
                  <th className="py-3.5 px-2 text-center">Converted</th>
                  <th className="py-3.5 px-2 text-center">Conversion Rate</th>
                  <th className="py-3.5 px-2 text-right">Attributed Sales</th>
                  <th className="py-3.5 px-2 text-right">Agent Earnings</th>
                </tr>
              </thead>
              <tbody className={isDark ? "divide-y divide-white/5" : "divide-y divide-slate-100"}>
                {performance.map((p: any, idx: number) => (
                  <tr key={idx} className="hover:bg-white/[0.01] transition-all">
                    {/* Agent Name */}
                    <td className="py-4 px-2 font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                      {p.agentName}
                    </td>

                    {/* Leads */}
                    <td className="py-4 px-2 text-center font-semibold">
                      {p.leads}
                    </td>

                    {/* Converted */}
                    <td className="py-4 px-2 text-center font-bold text-emerald-500">
                      {p.conversions}
                    </td>

                    {/* Rate */}
                    <td className="py-4 px-2 text-center font-bold text-cyan-400">
                      {p.conversionRate}
                    </td>

                    {/* Sales */}
                    <td className="py-4 px-2 text-right font-bold">
                      {p.totalSales}
                    </td>

                    {/* Earnings */}
                    <td className="py-4 px-2 text-right font-bold text-emerald-500">
                      {p.earnings}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
