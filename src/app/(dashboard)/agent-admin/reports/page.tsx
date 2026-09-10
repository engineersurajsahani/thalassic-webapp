"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import { agentAdminService } from "@/services/agent-admin.service";
import { BarChart3, RefreshCw, Sparkles, TrendingUp, Users, ArrowUpRight, DollarSign } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell
} from "recharts";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const MONTHLY_AGENT_DATA: Record<string, Record<string, number>> = {
  January: { "Kishan Manning Agency": 28, "Oceanic Seamen Agency": 22, "Maritime Crewing Corp": 18, "Global Marine Services": 10, "Apex Maritime Solutions": 8 },
  February: { "Kishan Manning Agency": 32, "Oceanic Seamen Agency": 26, "Maritime Crewing Corp": 20, "Global Marine Services": 12, "Apex Maritime Solutions": 9 },
  March: { "Kishan Manning Agency": 45, "Oceanic Seamen Agency": 38, "Maritime Crewing Corp": 30, "Global Marine Services": 18, "Apex Maritime Solutions": 14 },
  April: { "Kishan Manning Agency": 30, "Oceanic Seamen Agency": 25, "Maritime Crewing Corp": 22, "Global Marine Services": 11, "Apex Maritime Solutions": 8 },
  May: { "Kishan Manning Agency": 36, "Oceanic Seamen Agency": 29, "Maritime Crewing Corp": 25, "Global Marine Services": 14, "Apex Maritime Solutions": 10 },
  June: { "Kishan Manning Agency": 40, "Oceanic Seamen Agency": 32, "Maritime Crewing Corp": 26, "Global Marine Services": 16, "Apex Maritime Solutions": 12 },
  July: { "Kishan Manning Agency": 38, "Oceanic Seamen Agency": 30, "Maritime Crewing Corp": 24, "Global Marine Services": 15, "Apex Maritime Solutions": 11 },
  August: { "Kishan Manning Agency": 44, "Oceanic Seamen Agency": 36, "Maritime Crewing Corp": 29, "Global Marine Services": 17, "Apex Maritime Solutions": 13 },
  September: { "Kishan Manning Agency": 42, "Oceanic Seamen Agency": 35, "Maritime Crewing Corp": 28, "Global Marine Services": 15, "Apex Maritime Solutions": 12 },
  October: { "Kishan Manning Agency": 39, "Oceanic Seamen Agency": 31, "Maritime Crewing Corp": 25, "Global Marine Services": 13, "Apex Maritime Solutions": 10 },
  November: { "Kishan Manning Agency": 34, "Oceanic Seamen Agency": 27, "Maritime Crewing Corp": 21, "Global Marine Services": 12, "Apex Maritime Solutions": 9 },
  December: { "Kishan Manning Agency": 48, "Oceanic Seamen Agency": 40, "Maritime Crewing Corp": 32, "Global Marine Services": 20, "Apex Maritime Solutions": 15 }
};

// Custom X-Axis Tick for Manning Agent Names (Horizontal, Black color, clean 2-line wrapping for long names)
const CustomAgentAxisTick = (props: any) => {
  const { x, y, payload } = props;
  const rawText: string = payload?.value || "";

  const words = rawText.split(" ");
  let line1 = rawText;
  let line2 = "";

  if (words.length >= 4) {
    line1 = words.slice(0, 2).join(" ");
    line2 = words.slice(2).join(" ");
  } else if (words.length === 3) {
    line1 = words.slice(0, 2).join(" ");
    line2 = words[2];
  } else if (words.length === 2) {
    line1 = words[0];
    line2 = words[1];
  } else if (rawText.length > 12) {
    line1 = rawText.slice(0, 10);
    line2 = rawText.slice(10);
  }

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={4}
        textAnchor="middle"
        fill="#000000"
        fontSize={9}
        fontWeight={700}
      >
        <tspan x={0} dy="10">{line1}</tspan>
        {line2 && <tspan x={0} dy="12">{line2}</tspan>}
      </text>
    </g>
  );
};

export default function Reports() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [mounted, setMounted] = useState(false);

  const [loading, setLoading] = useState(true);
  const [reportsData, setReportsData] = useState<any>(null);

  const [selectedAgentFilter, setSelectedAgentFilter] = useState("all");
  const [selectedRegionFilter, setSelectedRegionFilter] = useState("all");
  const [selectedMonthFilter, setSelectedMonthFilter] = useState("All Months");
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
    { agentName: "Global Marine Services", seafarers: 15, courses: 10, leads: 15, conversions: 10, totalSales: "₹3,75,000", settledAmount: "₹3,00,000", pendingBalance: "₹75,000", earnings: "₹45,000" },
    { agentName: "Apex Maritime Solutions", seafarers: 12, courses: 8, leads: 12, conversions: 8, totalSales: "₹3,00,000", settledAmount: "₹2,40,000", pendingBalance: "₹60,000", earnings: "₹36,000" }
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

  const chartPerformance = performance.map((p: any) => {
    if (selectedMonthFilter !== "All Months" && MONTHLY_AGENT_DATA[selectedMonthFilter]) {
      const monthVal = MONTHLY_AGENT_DATA[selectedMonthFilter][p.agentName];
      if (monthVal !== undefined) {
        return {
          ...p,
          seafarers: monthVal
        };
      }
    }
    return p;
  });

  // Calculate dynamic numbers based on selected manning agent filter
  const totalSeafarersSum = performance.reduce((acc: number, p: any) => acc + Number(p.seafarers ?? p.leads ?? 0), 0);
  const totalCoursesSum = performance.reduce((acc: number, p: any) => acc + Number(p.courses ?? p.conversions ?? 0), 0);
  const calculatedConversionRate = totalSeafarersSum > 0 ? `${((totalCoursesSum / totalSeafarersSum) * 100).toFixed(1)}%` : "0.0%";

  const rawRegionStats = reportsData?.regionStats?.length > 0 ? reportsData.regionStats : defaultRegionStats;
  const regionStats = rawRegionStats.filter((r: any) => {
    return selectedRegionFilter === "all" || r.name.toLowerCase() === selectedRegionFilter.toLowerCase();
  });
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
      <div className={`p-4 rounded-xl border flex flex-col lg:flex-row gap-4 items-end justify-between ${
        isDark ? "bg-[#111827] border-white/5" : "bg-[#FAFAFA] border-[#E5E7EB]"
      }`}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto flex-1">
          {/* Agent Filter */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Manning Agent</span>
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

          {/* Region Filter */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Region</span>
            <select
              value={selectedRegionFilter}
              onChange={(e) => setSelectedRegionFilter(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold outline-none cursor-pointer ${
                isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-[#E5E7EB] text-[#111827] shadow-sm"
              }`}
            >
              <option value="all">All Regions</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Kochi">Kochi</option>
              <option value="Chennai">Chennai</option>
              <option value="Kolkata">Kolkata</option>
              <option value="Goa">Goa</option>
            </select>
          </div>

          {/* Start Date */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Start Date</span>
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
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">End Date</span>
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
        <div className="flex items-center gap-2 w-full lg:w-auto shrink-0">
          <button
            onClick={() => handleExport("PDF")}
            className="flex-1 lg:flex-none px-4 py-2 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/5 text-xs font-bold transition cursor-pointer whitespace-nowrap"
          >
            Export PDF
          </button>
          <button
            onClick={() => handleExport("Excel")}
            className="flex-1 lg:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition cursor-pointer whitespace-nowrap"
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 no-print">
        {/* Top Referring Agents (Bar Chart) - Slightly Wider (7 cols out of 12) */}
        <div className={`lg:col-span-7 ${card}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4 mb-4 border-white/5">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#3D5EF6]" />
              <h3 className="text-sm font-bold">Top Referring Manning Agents</h3>
            </div>
            {/* Month Filter Dropdown - Only month names (NO year) */}
            <select
              value={selectedMonthFilter}
              onChange={(e) => setSelectedMonthFilter(e.target.value)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold outline-none cursor-pointer ${
                isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-[#E5E7EB] text-[#111827] shadow-sm"
              }`}
            >
              <option value="All Months">All Months</option>
              {MONTHS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="h-72 w-full text-xs">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 45 }}>
                  <XAxis dataKey="agentName" tick={<CustomAgentAxisTick />} interval={0} tickLine={false} />
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

        {/* Region-wise Referrals (Pie Chart) - Slightly Narrower (5 cols out of 12) */}
        <div className={`lg:col-span-5 ${card}`}>
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
