"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import { agentAdminService } from "@/services/agent-admin.service";
import { BarChart3, RefreshCw, Sparkles, TrendingUp, Users, ArrowUpRight, DollarSign } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell
} from "recharts";

export default function Reports() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [loading, setLoading] = useState(true);
  const [reportsData, setReportsData] = useState<any>(null);

  const [selectedAgentFilter, setSelectedAgentFilter] = useState("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

  const handleExport = (format: string) => {
    if (format === "Excel") {
      const headers = ["Agent Name", "Referral Leads", "Converted", "Conversion Rate", "Attributed Sales", "Agent Earnings"];
      const rows = performance.map((p: any) => [
        `"${p.agentName || ""}"`,
        p.leads ?? 0,
        p.conversions ?? 0,
        `"${p.conversionRate || "0%"}"`,
        `"${p.totalSales || "₹0"}"`,
        `"${p.earnings || "₹0"}"`
      ]);

      const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((e: string[]) => e.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `manning_agent_reports_${new Date().toISOString().substring(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === "PDF") {
      const style = document.createElement("style");
      style.innerHTML = `
        @media print {
          aside, header, .no-print, button {
            display: none !important;
          }
          main, body, html {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            color: black !important;
            overflow: visible !important;
          }
        }
      `;
      document.head.appendChild(style);
      window.print();
      document.head.removeChild(style);
    }
  };

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

  const performance = (reportsData?.agentPerformance || []).filter((p: any) => {
    const matchesAgent = selectedAgentFilter === "all" || p.agentName === selectedAgentFilter;
    return matchesAgent;
  });
  const conversion = reportsData?.conversionSummary || {
    totalLeads: 0,
    convertedLeads: 0,
    globalConversionRate: "0%",
  };
  const regionStats = reportsData?.regionStats || [];
  const CHART_COLORS = ["#06b6d4", "#3b82f6", "#6366f1", "#14b8a6", "#0ea5e9"];

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

      {/* Filters and Exports Toolbar */}
      <div className={`p-5 rounded-3xl border flex flex-col md:flex-row gap-4 items-end justify-between ${
        isDark ? "bg-[#0d1f35]/50 border-white/5" : "bg-slate-50/50 border-slate-200/60"
      }`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full md:w-auto">
          {/* Agent Filter */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Manning Agent</span>
            <select
              value={selectedAgentFilter}
              onChange={(e) => setSelectedAgentFilter(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold outline-none cursor-pointer ${
                isDark ? "bg-[#0b182d] border-white/10 text-white" : "bg-white border-slate-200 text-slate-700 shadow-sm"
              }`}
            >
              <option value="all">All Agents</option>
              {(reportsData?.agentPerformance || []).map((p: any, idx: number) => (
                <option key={idx} value={p.agentName}>{p.agentName}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Referral Status</span>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold outline-none cursor-pointer ${
                isDark ? "bg-[#0b182d] border-white/10 text-white" : "bg-white border-slate-200 text-slate-700 shadow-sm"
              }`}
            >
              <option value="all">All Statuses</option>
              <option value="Converted">Converted</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Expired">Expired</option>
            </select>
          </div>

          {/* Start Date */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Start Date</span>
            <input
              type="date"
              value={startDateFilter}
              onChange={(e) => setStartDateFilter(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${
                isDark ? "bg-[#0b182d] border-white/10 text-white" : "bg-white border-slate-200 text-slate-700"
              }`}
            />
          </div>

          {/* End Date */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">End Date</span>
            <input
              type="date"
              value={endDateFilter}
              onChange={(e) => setEndDateFilter(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${
                isDark ? "bg-[#0b182d] border-white/10 text-white" : "bg-white border-slate-200 text-slate-700"
              }`}
            />
          </div>
        </div>

        {/* Exports */}
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => handleExport("PDF")}
            className="flex-1 md:flex-none px-4 py-2 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/5 text-xs font-bold transition cursor-pointer"
          >
            Export PDF
          </button>
          <button
            onClick={() => handleExport("Excel")}
            className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition cursor-pointer"
          >
            Export Excel
          </button>
        </div>
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 no-print">
        {/* Top Referring Agents (Bar Chart) */}
        <div className={card}>
          <div className="flex items-center gap-2 border-b pb-4 mb-4 border-white/5">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold">Top Referring Agents</h3>
          </div>
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performance}>
                <XAxis dataKey="agentName" stroke={isDark ? "#94a3b8" : "#64748b"} fontSize={10} tickLine={false} />
                <YAxis stroke={isDark ? "#94a3b8" : "#64748b"} fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? "#0d1f35" : "#ffffff", 
                    borderColor: isDark ? "#1e293b" : "#e2e8f0",
                    color: isDark ? "#f8fafc" : "#0f172a" 
                  }} 
                />
                <Bar dataKey="leads" name="Total Referrals" fill="#06b6d4" barSize={32} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Region-wise Referrals (Pie Chart) */}
        <div className={card}>
          <div className="flex items-center gap-2 border-b pb-4 mb-4 border-white/5">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold">Region-Wise Referrals (by City)</h3>
          </div>
          <div className="h-72 w-full text-xs flex flex-col sm:flex-row items-center justify-center">
            {regionStats.length === 0 ? (
              <p className={`text-xs ${mt}`}>No regional data available</p>
            ) : (
              <>
                <div className="w-full sm:w-1/2 h-full relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={regionStats}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {regionStats.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: isDark ? "#0d1f35" : "#ffffff", 
                          borderColor: isDark ? "#1e293b" : "#e2e8f0",
                          color: isDark ? "#f8fafc" : "#0f172a" 
                        }} 
                      />
                      {/* Center Total Leads Text inside Donut hole */}
                      <text x="50%" y="47%" textAnchor="middle" dominantBaseline="middle" className="fill-slate-800 dark:fill-white font-black text-2xl">
                        {regionStats.reduce((sum: number, item: any) => sum + item.value, 0)}
                      </text>
                      <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="fill-slate-400 dark:fill-slate-500 font-black text-[9px] uppercase tracking-wider">
                        Leads
                      </text>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full sm:w-1/2 space-y-3 mt-4 sm:mt-0 px-4">
                  {(() => {
                    const totalRegionLeads = regionStats.reduce((sum: number, item: any) => sum + item.value, 0);
                    return regionStats.map((entry: any, index: number) => {
                      const percentage = totalRegionLeads > 0 ? Math.round((entry.value / totalRegionLeads) * 100) : 0;
                      return (
                        <div 
                          key={entry.name} 
                          className={`p-3 rounded-2xl border flex items-center justify-between transition-all duration-300 hover:scale-[1.02] ${
                            isDark ? "bg-white/[0.03] border-white/5 hover:bg-white/[0.06]" : "bg-slate-50 border-slate-200/60 hover:bg-slate-100/50"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
                            <div>
                              <span className="font-bold text-xs block leading-tight">{entry.name}</span>
                              {/* Horizontal mini progress bar */}
                              <div className="w-16 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                                <div 
                                  className="h-full rounded-full" 
                                  style={{ 
                                    width: `${percentage}%`, 
                                    backgroundColor: CHART_COLORS[index % CHART_COLORS.length] 
                                  }} 
                                />
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-extrabold text-xs block">{entry.value} leads</span>
                            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold block mt-0.5">{percentage}%</span>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </>
            )}
          </div>
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
