"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import { agentAdminService } from "@/services/agent-admin.service";
import { BarChart3, RefreshCw, Sparkles, Users } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell
} from "recharts";

// Professional, readable chart palette — no neon/bright colors
const CHART_COLORS = ["#3D5EF6", "#0EA5E9", "#10B981", "#F59E0B", "#8B5CF6"];

export default function Reports() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const mounted = true;

  const [loading, setLoading] = useState(true);
  const [reportsData, setReportsData] = useState<any>(null);

  const [selectedAgentFilter, setSelectedAgentFilter] = useState("all");
  const [selectedRegionFilter, setSelectedRegionFilter] = useState("all");
  const [selectedMonthFilter, setSelectedMonthFilter] = useState("all");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

  

  const card = `rounded-[16px] p-6 border-0 card-elevated transition-all duration-300 ${
    isDark ? "bg-[#111827] text-white" : "bg-white text-[#111827]"
  }`;
  const labelText = isDark ? "text-white/50" : "text-[#6B7280]";
  const ht = isDark ? "text-white/95" : "text-[#111827]";
  const mt = isDark ? "text-white/35" : "text-[#9CA3AF]";

  const fetchReports = async (monthVal?: string) => {
    try {
      const monthToFetch = monthVal !== undefined ? monthVal : selectedMonthFilter;
      const data = await agentAdminService.getReports(monthToFetch);
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

  const defaultPerformance = [
    { agentName: "Kishan Manning Agency",  seafarers: 42, courses: 38, region: "Mumbai",  totalSales: "₹10,50,000", settledAmount: "₹8,40,000",  pendingBalance: "₹2,10,000", earnings: "₹1,26,000" },
    { agentName: "Oceanic Seamen Agency",  seafarers: 35, courses: 30, region: "Kochi",   totalSales: "₹8,75,000",  settledAmount: "₹7,00,000",  pendingBalance: "₹1,75,000", earnings: "₹1,05,000" },
    { agentName: "Maritime Crewing Corp",  seafarers: 28, courses: 24, region: "Chennai", totalSales: "₹7,00,000",  settledAmount: "₹5,60,000",  pendingBalance: "₹1,40,000", earnings: "₹84,000"   },
    { agentName: "Global Marine Services", seafarers: 15, courses: 10, region: "Kolkata", totalSales: "₹3,75,000",  settledAmount: "₹3,00,000",  pendingBalance: "₹75,000",   earnings: "₹45,000"   },
  ];

  const defaultRegionStats = [
    { name: "Mumbai",  value: 48 },
    { name: "Kochi",   value: 36 },
    { name: "Chennai", value: 28 },
    { name: "Kolkata", value: 18 },
    { name: "Goa",     value: 12 },
  ];

  const basePerformance = reportsData?.agentPerformance?.length > 0 ? reportsData.agentPerformance : defaultPerformance;
  const rawPerformance = basePerformance.map((p: any) => ({
    ...p,
    seafarers: Number(p.seafarers ?? p.conversions ?? p.leads ?? 0),
    courses: Number(p.courses ?? p.conversions ?? 0),
    region: p.region || (p.agentName?.includes("Kochi") || p.agentName?.includes("Oceanic") ? "Kochi" : p.agentName?.includes("Nautical") || p.agentName?.includes("Chennai") ? "Chennai" : p.agentName?.includes("SeaFarer") || p.agentName?.includes("Kolkata") ? "Kolkata" : "Mumbai"),
  }));
  const rawRegionStats = reportsData?.regionStats?.length > 0 ? reportsData.regionStats : defaultRegionStats;

  // Available months formatting helper
  const monthList: string[] = reportsData?.availableMonths?.length > 0
    ? reportsData.availableMonths
    : ["2026-09", "2026-08", "2026-07", "2026-06", "2026-05", "2026-04", "2026-03", "2026-02", "2026-01"];

  const monthOptions = monthList.map((m: string) => {
    const [year, month] = m.split("-");
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, 1);
    const label = dateObj.toLocaleString("en-US", { month: "long", year: "numeric" });
    return { value: m, label };
  });

  // Get unique regions for the filter
  const availableRegions = Array.from(new Set([
    ...rawRegionStats.map((r: any) => r.name),
    ...rawPerformance.map((p: any) => p.region).filter(Boolean),
  ])).sort();

  // Apply filters
  const performance = rawPerformance.filter((p: any) => {
    const matchesAgent  = selectedAgentFilter === "all" || p.agentName === selectedAgentFilter;
    const matchesRegion = selectedRegionFilter === "all" || p.region === selectedRegionFilter;
    return matchesAgent && matchesRegion;
  });

  const filteredRegionStats = selectedRegionFilter === "all"
    ? rawRegionStats
    : rawRegionStats.filter((r: any) => r.name === selectedRegionFilter);

  // Summary metrics (no conversion rate)
  const totalSeafarersSum = performance.reduce((acc: number, p: any) => acc + Number(p.seafarers ?? 0), 0);
  const totalCoursesSum   = performance.reduce((acc: number, p: any) => acc + Number(p.courses ?? 0), 0);

  // Export to Excel
  const handleExportExcel = () => {
    if (performance.length === 0) {
      alert("No data available to export.");
      return;
    }
    const headers = ["Agent Name", "Region", "Total Seafarers", "Courses Booked", "Total Revenue", "Settled Amount", "Pending Balance", "Commission Earned"];
    const rows = performance.map((p: any) => [
      `"${p.agentName || ""}"`,
      `"${p.region || ""}"`,
      p.seafarers ?? 0,
      p.courses ?? 0,
      `"${p.totalSales || "₹0"}"`,
      `"${p.settledAmount || "₹0"}"`,
      `"${p.pendingBalance || "₹0"}"`,
      `"${p.earnings || "₹0"}"`,
    ]);
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r: (string | number)[]) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `manning_agent_reports_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const tooltipStyle = {
    backgroundColor: isDark ? "#111827" : "#ffffff",
    borderColor:     isDark ? "#1F2937"  : "#E5E7EB",
    color:           isDark ? "#FAFAFA"  : "#111827",
    fontSize: "11px",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${ht}`}>Operational Analytics</h1>
          <p className={`text-xs mt-1.5 ${mt}`}>Performance statistics and revenue reports by agent and region.</p>
        </div>
        <button
          onClick={() => fetchReports()}
          className={`p-2.5 rounded-xl border flex items-center justify-center cursor-pointer transition ${isDark ? "border-white/10 hover:bg-white/5 text-white/50" : "border-slate-200 hover:bg-slate-50 text-slate-500 shadow-sm"}`}
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Filters and Export Toolbar */}
      <div className={`p-4 rounded-lg border flex flex-col md:flex-row gap-4 items-end justify-between ${
        isDark ? "bg-[#111827] border-white/5" : "bg-[#FAFAFA] border-[#E5E7EB]"
      }`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full md:w-auto">
          {/* Manning Agent Filter */}
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

          {/* Region Filter */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Region</span>
            <select
              value={selectedRegionFilter}
              onChange={(e) => setSelectedRegionFilter(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold outline-none cursor-pointer ${
                isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-[#E5E7EB] text-[#111827] shadow-sm"
              }`}
            >
              <option value="all">All Regions</option>
              {availableRegions.map((region: string) => (
                <option key={region} value={region}>{region}</option>
              ))}
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

        {/* Export */}
        <div className="flex gap-2 w-full md:w-auto shrink-0">
          <button
            onClick={handleExportExcel}
            className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition cursor-pointer"
          >
            Export Excel
          </button>
        </div>
      </div>

      {/* Summary Cards — 2 cards only (Conversion Rate removed) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className={card}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-semibold tracking-wider uppercase ${labelText}`}>Total Registered Seafarers</span>
            <Users className="w-4 h-4 text-[#3D5EF6]" />
          </div>
          <p className={`text-3xl font-bold mt-4 ${ht}`}>{totalSeafarersSum}</p>
          {selectedRegionFilter !== "all" && (
            <p className={`text-[10px] mt-1 ${mt}`}>Filtered by region: {selectedRegionFilter}</p>
          )}
        </div>

        <div className={card}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-semibold tracking-wider uppercase ${labelText}`}>Courses Booked</span>
            <Sparkles className="w-4 h-4 text-[#10B981]" />
          </div>
          <p className="text-3xl font-bold mt-4 text-[#10B981]">{totalCoursesSum}</p>
          {selectedAgentFilter !== "all" && (
            <p className={`text-[10px] mt-1 ${mt}`}>Filtered by agent: {selectedAgentFilter}</p>
          )}
        </div>
      </div>

      {/* Charts Grid — Top Referring (LARGE) vs Region-Wise (SMALLER) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 no-print">

        {/* Top Referring Agents — LARGE graph */}
        <div className={`lg:col-span-7 ${card}`}>
          <div className={`flex items-center justify-between border-b pb-3 mb-4 ${isDark ? "border-white/5" : "border-slate-100"}`}>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#3D5EF6]" />
              <h3 className="text-base font-bold">Top Referring Manning Agents</h3>
            </div>
            {/* Month Filter Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">Month:</span>
              <select
                value={selectedMonthFilter}
                onChange={(e) => {
                  setSelectedMonthFilter(e.target.value);
                  fetchReports(e.target.value);
                }}
                className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold outline-none cursor-pointer ${
                  isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-[#E5E7EB] text-[#111827] shadow-sm"
                }`}
              >
                <option value="all">All Months</option>
                {monthOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Prominent, large chart height */}
          <div className="h-80 w-full text-xs">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performance} margin={{ top: 15, right: 15, left: -15, bottom: 40 }}>
                  <XAxis
                    dataKey="agentName"
                    tickLine={false}
                    axisLine={{ stroke: isDark ? "#334155" : "#e2e8f0" }}
                    interval={0}
                    tick={({ x, y, payload }) => {
                      const text = payload.value || "";
                      const words = text.split(" ");
                      let lines: string[] = [];
                      if (words.length > 2) {
                        const mid = Math.ceil(words.length / 2);
                        lines = [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
                      } else if (words.length === 2 && text.length > 12) {
                        lines = [words[0], words[1]];
                      } else {
                        lines = [text];
                      }

                      return (
                        <g transform={`translate(${x},${y})`}>
                          {lines.map((line, index) => (
                            <text
                              key={index}
                              x={0}
                              y={index * 12}
                              dy={12}
                              textAnchor="middle"
                              fill={isDark ? "#cbd5e1" : "#111827"}
                              fontSize={10}
                              fontWeight={700}
                            >
                              {line}
                            </text>
                          ))}
                        </g>
                      );
                    }}
                  />
                  <YAxis
                    stroke={isDark ? "#cbd5e1" : "#475569"}
                    fontSize={10}
                    fontWeight={600}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar
                    dataKey="seafarers"
                    name="Total Seafarers"
                    fill="#3D5EF6"
                    barSize={36}
                    radius={[6, 6, 0, 0]}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Region-Wise Seafarers — SMALLER graph */}
        <div className={`lg:col-span-5 ${card}`}>
          <div className={`flex items-center gap-2 border-b pb-3 mb-4 ${isDark ? "border-white/5" : "border-slate-100"}`}>
            <BarChart3 className="w-4 h-4 text-[#3D5EF6]" />
            <h3 className="text-sm font-bold">
              Region-Wise Seafarers
              {selectedRegionFilter !== "all" && (
                <span className="ml-2 text-[10px] font-semibold text-[#3D5EF6] bg-[#3D5EF6]/10 px-2 py-0.5 rounded">
                  {selectedRegionFilter}
                </span>
              )}
            </h3>
          </div>

          {filteredRegionStats.length === 0 ? (
            <p className={`text-xs py-12 text-center ${mt}`}>No regional data for selected filter.</p>
          ) : (
            <div className="flex flex-col items-center gap-4">
              {/* Compact donut */}
              <div className="w-full h-48 shrink-0">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={filteredRegionStats}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={4}
                        dataKey="value"
                        isAnimationActive={false}
                      >
                        {filteredRegionStats.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                      <text x="50%" y="44%" textAnchor="middle" dominantBaseline="middle" fill={isDark ? "#fff" : "#111827"} fontSize="16" fontWeight="800">
                        {filteredRegionStats.reduce((sum: number, item: any) => sum + item.value, 0)}
                      </text>
                      <text x="50%" y="62%" textAnchor="middle" dominantBaseline="middle" fill="#94a3b8" fontSize="8" fontWeight="700" letterSpacing="1">
                        SEAFARERS
                      </text>
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Legend grid */}
              <div className="w-full grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-white/5">
                {(() => {
                  const total = filteredRegionStats.reduce((sum: number, item: any) => sum + item.value, 0);
                  return filteredRegionStats.map((entry: any, index: number) => {
                    const pct = total > 0 ? Math.round((entry.value / total) * 100) : 0;
                    return (
                      <div key={entry.name} className="flex items-center justify-between gap-1 text-[11px]">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
                          <span className={`font-semibold truncate ${ht}`}>{entry.name}</span>
                        </div>
                        <span className={`font-bold shrink-0 ${ht}`}>{entry.value} ({pct}%)</span>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Agent Performance Table */}
      <div className={card}>
        <div className={`flex items-center gap-2 border-b pb-3 mb-4 ${isDark ? "border-white/5" : "border-slate-100"}`}>
          <BarChart3 className="w-4 h-4 text-[#3D5EF6]" />
          <h3 className="text-sm font-bold">Placement Agent Performance Ledger</h3>
        </div>

        {performance.length === 0 ? (
          <div className="text-center py-10">
            <p className={`text-xs ${mt}`}>No agent reports data matching your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b ${isDark ? "border-white/5 text-white/30" : "border-slate-100 text-slate-400"} uppercase font-semibold tracking-wider`}>
                  <th className="py-3 px-2">Agent Name</th>
                  <th className="py-3 px-2">Region</th>
                  <th className="py-3 px-2 text-center">Total Seafarers</th>
                  <th className="py-3 px-2 text-center">Courses Booked</th>
                  <th className="py-3 px-2 text-right">Attributed Sales</th>
                  <th className="py-3 px-2 text-right">Settled Amount</th>
                  <th className="py-3 px-2 text-right">Pending Balance</th>
                  <th className="py-3 px-2 text-right">Agent Earnings</th>
                </tr>
              </thead>
              <tbody className={isDark ? "divide-y divide-white/5" : "divide-y divide-slate-100"}>
                {performance.map((p: any, idx: number) => (
                  <tr key={idx} className={`transition-all ${isDark ? "hover:bg-white/[0.02]" : "hover:bg-slate-50"}`}>
                    <td className="py-3.5 px-2 font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3D5EF6] shrink-0" />
                      {p.agentName}
                    </td>
                    <td className={`py-3.5 px-2 font-medium ${mt}`}>{p.region || "—"}</td>
                    <td className="py-3.5 px-2 text-center font-bold text-[#3D5EF6]">{p.seafarers ?? 0}</td>
                    <td className="py-3.5 px-2 text-center font-bold text-[#10B981]">{p.courses ?? 0}</td>
                    <td className={`py-3.5 px-2 text-right font-bold ${ht}`}>{p.totalSales}</td>
                    <td className="py-3.5 px-2 text-right font-bold text-emerald-500">{p.settledAmount || "₹0"}</td>
                    <td className="py-3.5 px-2 text-right font-bold text-amber-500">{p.pendingBalance || "₹0"}</td>
                    <td className={`py-3.5 px-2 text-right font-bold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>{p.earnings}</td>
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
