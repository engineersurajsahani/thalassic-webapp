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
  const [mounted, setMounted] = useState(false);

  const [loading, setLoading] = useState(true);
  const [reportsData, setReportsData] = useState<any>(null);

  const [selectedAgentFilter, setSelectedAgentFilter] = useState("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleExport = (format: string) => {
    if (format === "Excel") {
      const headers = ["Agent Name", "Total Seafarers", "Courses Booked", "Total Revenue", "Settled Amount", "Pending Balance", "Commission Earned"];
      const rows = performance.map((p: any) => [
        `"${p.agentName || ""}"`,
        p.seafarers ?? p.leads ?? 0,
        p.courses ?? p.conversions ?? 0,
        `"${p.totalSales || "₹0"}"`,
        `"${p.settledAmount || "₹0"}"`,
        `"${p.pendingBalance || "₹0"}"`,
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

  const card = `rounded-[16px] p-7 border-0 card-elevated transition-all duration-300 hover:-translate-y-0.5 ${
    isDark
      ? "bg-[#111827] text-white"
      : "bg-white text-[#111827]"
  }`;
  const labelText = isDark ? "text-white/50" : "text-[#6B7280]";
  const ht = isDark ? "text-white/95" : "text-[#111827]";
  const mt = isDark ? "text-white/35" : "text-[#9CA3AF]";
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
        <div className="w-8 h-8 border-4 border-[#3D5EF6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Aligned with the actual Manning Agents in /agent-admin/agents
  const defaultPerformance = [
    { agentName: "Kishan Manning Agency", seafarers: 42, courses: 38, leads: 42, conversions: 38, totalSales: "₹10,50,000", settledAmount: "₹8,40,000", pendingBalance: "₹2,10,000", earnings: "₹1,26,000" },
    { agentName: "Oceanic Seamen Agency", seafarers: 35, courses: 30, leads: 35, conversions: 30, totalSales: "₹8,75,000", settledAmount: "₹7,00,000", pendingBalance: "₹1,75,000", earnings: "₹1,05,000" },
    { agentName: "Maritime Crewing Corp", seafarers: 28, courses: 24, leads: 28, conversions: 24, totalSales: "₹7,00,000", settledAmount: "₹5,60,000", pendingBalance: "₹1,40,000", earnings: "₹84,000" },
    { agentName: "Global Marine Services", seafarers: 15, courses: 10, leads: 15, conversions: 10, totalSales: "₹3,75,000", settledAmount: "₹3,00,000", pendingBalance: "₹75,000", earnings: "₹45,000" }
  ];

  const defaultRegionStats = [
    { name: "Mumbai", value: 48 },
    { name: "Kochi", value: 36 },
    { name: "Chennai", value: 28 },
    { name: "Kolkata", value: 18 },
    { name: "Goa", value: 12 }
  ];

  const rawPerformance = reportsData?.agentPerformance?.length > 0 ? reportsData.agentPerformance : defaultPerformance;
  const performance = rawPerformance.filter((p: any) => {
    const matchesAgent = selectedAgentFilter === "all" || p.agentName === selectedAgentFilter;
    return matchesAgent;
  });

  // Calculate dynamic numbers based on selected manning agent filter
  const totalSeafarersSum = performance.reduce((acc: number, p: any) => acc + Number(p.seafarers ?? p.leads ?? 0), 0);
  const totalCoursesSum = performance.reduce((acc: number, p: any) => acc + Number(p.courses ?? p.conversions ?? 0), 0);
  const calculatedConversionRate = totalSeafarersSum > 0 ? `${((totalCoursesSum / totalSeafarersSum) * 100).toFixed(1)}%` : "0.0%";

  const regionStats = reportsData?.regionStats?.length > 0 ? reportsData.regionStats : defaultRegionStats;
  const CHART_COLORS = ["#3D5EF6", "#2E4FE0", "#6366f1", "#14b8a6", "#3B82F6"];

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
      <div className={`p-5 rounded-lg border flex flex-col md:flex-row gap-4 items-end justify-between ${
        isDark ? "bg-[#111827] border-white/5" : "bg-[#FAFAFA] border-[#E5E7EB]"
      }`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full md:w-auto">
          {/* Agent Filter */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Manning Agent</span>
            <select
              value={selectedAgentFilter}
              onChange={(e) => setSelectedAgentFilter(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold outline-none cursor-pointer ${
                isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-[#E5E7EB] text-[#111827] shadow-sm"
              }`}
            >
              <option value="all">All Manning Agents</option>
              {rawPerformance.map((p: any, idx: number) => (
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
                isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-[#E5E7EB] text-[#111827] shadow-sm"
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
                isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-[#E5E7EB] text-[#111827]"
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
                isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-[#E5E7EB] text-[#111827]"
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

      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Total Seafarers card */}
        <div className={card}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-semibold tracking-wider uppercase ${labelText}`}>Total Registered Seafarers</span>
            <Users className="w-4 h-4 text-[#3D5EF6]" />
          </div>
          <p className={`text-3xl font-bold mt-4 ${ht}`}>{totalSeafarersSum}</p>
        </div>

        {/* Courses Booked card */}
        <div className={card}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-semibold tracking-wider uppercase ${labelText}`}>Courses Booked</span>
            <Sparkles className="w-4 h-4 text-[#3D5EF6]" />
          </div>
          <p className={`text-3xl font-bold mt-4 text-emerald-500`}>{totalCoursesSum}</p>
        </div>

        {/* Conversion rate card */}
        <div className={card}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-semibold tracking-wider uppercase ${labelText}`}>Conversion Rate</span>
            <TrendingUp className="w-4 h-4 text-[#3D5EF6]" />
          </div>
          <p className={`text-3xl font-bold mt-4 text-[#3D5EF6]`}>{calculatedConversionRate}</p>
        </div>

      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 no-print">
        {/* Top Referring Agents (Bar Chart) */}
        <div className={card}>
          <div className="flex items-center gap-2 border-b pb-4 mb-4 border-white/5">
            <BarChart3 className="w-4 h-4 text-[#3D5EF6]" />
            <h3 className="text-sm font-bold">Top Referring Manning Agents</h3>
          </div>
          <div className="h-72 w-full text-xs">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performance} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                  <XAxis dataKey="agentName" stroke={isDark ? "#94a3b8" : "#64748b"} fontSize={9} tickLine={false} interval={0} angle={-15} textAnchor="end" />
                  <YAxis stroke={isDark ? "#94a3b8" : "#64748b"} fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? "#111827" : "#ffffff", 
                      borderColor: isDark ? "#1F2937" : "#E5E7EB",
                      color: isDark ? "#FAFAFA" : "#111827" 
                    }} 
                  />
                  <Bar dataKey="seafarers" name="Total Seafarers" fill="#3D5EF6" barSize={32} radius={[6, 6, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Region-wise Referrals (Pie Chart) */}
        <div className={card}>
          <div className="flex items-center gap-2 border-b pb-4 mb-4 border-white/5">
            <BarChart3 className="w-4 h-4 text-[#3D5EF6]" />
            <h3 className="text-sm font-bold">Region-Wise Seafarers (by City)</h3>
          </div>
          <div className="h-72 w-full text-xs flex flex-col sm:flex-row items-center justify-center">
            {regionStats.length === 0 ? (
              <p className={`text-xs ${mt}`}>No regional data available</p>
            ) : (
              <>
                <div className="w-full sm:w-1/2 h-full relative flex items-center justify-center">
                  {mounted && (
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
                          isAnimationActive={false}
                        >
                          {regionStats.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: isDark ? "#111827" : "#ffffff", 
                            borderColor: isDark ? "#1F2937" : "#E5E7EB",
                            color: isDark ? "#FAFAFA" : "#111827" 
                          }} 
                        />
                        <text x="50%" y="47%" textAnchor="middle" dominantBaseline="middle" className="fill-slate-800 dark:fill-white font-black text-2xl">
                          {regionStats.reduce((sum: number, item: any) => sum + item.value, 0)}
                        </text>
                        <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="fill-slate-400 dark:fill-slate-500 font-black text-[9px] uppercase tracking-wider">
                          Seafarers
                        </text>
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
                <div className="w-full sm:w-1/2 space-y-3 mt-4 sm:mt-0 px-4" style={{ maxHeight: "288px", overflowY: "auto" }}>
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
                            <span className="font-extrabold text-xs block">{entry.value} seafarers</span>
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
          <BarChart3 className="w-4 h-4 text-[#3D5EF6]" />
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
                  <th className="py-3.5 px-2 text-center">Total Seafarers</th>
                  <th className="py-3.5 px-2 text-center">Courses Booked</th>
                  <th className="py-3.5 px-2 text-right">Attributed Sales</th>
                  <th className="py-3.5 px-2 text-right">Settled Amount</th>
                  <th className="py-3.5 px-2 text-right">Pending Balance</th>
                  <th className="py-3.5 px-2 text-right">Agent Earnings</th>
                </tr>
              </thead>
              <tbody className={isDark ? "divide-y divide-white/5" : "divide-y divide-slate-100"}>
                {performance.map((p: any, idx: number) => (
                  <tr key={idx} className="hover:bg-white/[0.01] transition-all">
                    {/* Agent Name */}
                    <td className="py-4 px-2 font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3D5EF6]" />
                      {p.agentName}
                    </td>

                    {/* Total Seafarers */}
                    <td className="py-4 px-2 text-center font-bold text-[#3D5EF6]">
                      {p.seafarers ?? p.leads ?? 0}
                    </td>

                    {/* Courses Booked */}
                    <td className="py-4 px-2 text-center font-bold text-teal-500">
                      {p.courses ?? p.conversions ?? 0}
                    </td>

                    {/* Attributed Sales */}
                    <td className="py-4 px-2 text-right font-bold">
                      {p.totalSales}
                    </td>

                    {/* Settled Amount */}
                    <td className="py-4 px-2 text-right font-bold text-emerald-500">
                      {p.settledAmount || "₹0"}
                    </td>

                    {/* Pending Balance */}
                    <td className="py-4 px-2 text-right font-bold text-amber-500">
                      {p.pendingBalance || "₹0"}
                    </td>

                    {/* Earnings */}
                    <td className="py-4 px-2 text-right font-bold text-emerald-600 dark:text-emerald-400">
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
