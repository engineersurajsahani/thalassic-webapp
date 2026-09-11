"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import { agentAdminService } from "@/services/agent-admin.service";
import { BarChart3, Users, Sparkles, RefreshCw } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell
} from "recharts";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const MONTHLY_AGENT_DATA: Record<string, Record<string, number>> = {
  January: { "Apex Maritime Solutions": 24, "Blue Ocean Crewing Ltd": 18, "Nautical Placement Services": 14, "SeaFarer Operations India": 10, "Pacific Marine Manning": 5 },
  February: { "Apex Maritime Solutions": 28, "Blue Ocean Crewing Ltd": 21, "Nautical Placement Services": 16, "SeaFarer Operations India": 11, "Pacific Marine Manning": 6 },
  March: { "Apex Maritime Solutions": 35, "Blue Ocean Crewing Ltd": 28, "Nautical Placement Services": 22, "SeaFarer Operations India": 16, "Pacific Marine Manning": 8 },
  April: { "Apex Maritime Solutions": 26, "Blue Ocean Crewing Ltd": 20, "Nautical Placement Services": 15, "SeaFarer Operations India": 12, "Pacific Marine Manning": 6 },
  May: { "Apex Maritime Solutions": 30, "Blue Ocean Crewing Ltd": 23, "Nautical Placement Services": 18, "SeaFarer Operations India": 13, "Pacific Marine Manning": 7 },
  June: { "Apex Maritime Solutions": 32, "Blue Ocean Crewing Ltd": 25, "Nautical Placement Services": 20, "SeaFarer Operations India": 14, "Pacific Marine Manning": 7 },
  July: { "Apex Maritime Solutions": 31, "Blue Ocean Crewing Ltd": 24, "Nautical Placement Services": 19, "SeaFarer Operations India": 13, "Pacific Marine Manning": 7 },
  August: { "Apex Maritime Solutions": 33, "Blue Ocean Crewing Ltd": 26, "Nautical Placement Services": 21, "SeaFarer Operations India": 15, "Pacific Marine Manning": 8 },
  September: { "Apex Maritime Solutions": 32, "Blue Ocean Crewing Ltd": 25, "Nautical Placement Services": 20, "SeaFarer Operations India": 14, "Pacific Marine Manning": 7 },
  October: { "Apex Maritime Solutions": 29, "Blue Ocean Crewing Ltd": 22, "Nautical Placement Services": 17, "SeaFarer Operations India": 12, "Pacific Marine Manning": 6 },
  November: { "Apex Maritime Solutions": 27, "Blue Ocean Crewing Ltd": 20, "Nautical Placement Services": 15, "SeaFarer Operations India": 11, "Pacific Marine Manning": 5 },
  December: { "Apex Maritime Solutions": 36, "Blue Ocean Crewing Ltd": 29, "Nautical Placement Services": 23, "SeaFarer Operations India": 17, "Pacific Marine Manning": 9 }
};

// Custom X-Axis Tick for Manning Agent Names
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
  const { theme, mounted } = useTheme();
  const isDark = theme === "dark";

  const [loading, setLoading] = useState(true);
  const [reportsData, setReportsData] = useState<any>(null);

  const [selectedAgentFilter, setSelectedAgentFilter] = useState("all");
  const [selectedRegionFilter, setSelectedRegionFilter] = useState("all");
  const [selectedMonthFilter, setSelectedMonthFilter] = useState("All Months");
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
    { agentName: "Apex Maritime Solutions", seafarers: 32, courses: 32, region: "Mumbai" },
    { agentName: "Blue Ocean Crewing Ltd", seafarers: 25, courses: 25, region: "Kochi" },
    { agentName: "Nautical Placement Services", seafarers: 20, courses: 20, region: "Chennai" },
    { agentName: "SeaFarer Operations India", seafarers: 14, courses: 14, region: "Kolkata" },
    { agentName: "Pacific Marine Manning", seafarers: 7, courses: 7, region: "Goa" }
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

  // Apply filters
  const performance = rawPerformance.filter((p: any) => {
    const matchesAgent  = selectedAgentFilter === "all" || p.agentName === selectedAgentFilter;
    const matchesRegion = selectedRegionFilter === "all" || p.region === selectedRegionFilter;
    return matchesAgent && matchesRegion;
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

  const totalSeafarersSum = performance.reduce((acc: number, p: any) => acc + Number(p.seafarers ?? p.leads ?? 0), 0);
  const totalCoursesSum = performance.reduce((acc: number, p: any) => acc + Number(p.courses ?? p.conversions ?? 0), 0);

  const filteredRegionStats = rawRegionStats.filter((r: any) => {
    return selectedRegionFilter === "all" || r.name.toLowerCase() === selectedRegionFilter.toLowerCase();
  });

  const tooltipStyle = {
    backgroundColor: isDark ? "#111827" : "#ffffff",
    borderColor: isDark ? "#1F2937" : "#E5E7EB",
    color: isDark ? "#FAFAFA" : "#111827",
  };

  const handleExportExcel = () => {
    alert("Exporting Excel report...");
  };

  const CHART_COLORS = ["#3B82F6", "#06B6D4", "#10B981", "#8B5CF6", "#F59E0B"];

  return (
    <div className="space-y-6 font-outfit">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${ht}`}>Operational Analytics</h1>
          <p className={`text-xs mt-1.5 ${mt}`}>Performance statistics and revenue reports by agent and region.</p>
        </div>
        <button
          onClick={() => fetchReports()}
          className={`p-2.5 rounded-xl border flex items-center justify-center cursor-pointer transition ${isDark ? "border-white/10 hover:bg-white/5 text-white/50" : "border-slate-200 hover:bg-slate-50 text-slate-500 shadow-sm"}`}
          aria-label="Refresh reports"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Filters & Export Card */}
      <div className={`p-4 rounded-xl border flex flex-col lg:flex-row gap-4 items-end justify-between ${
        isDark ? "bg-[#111827] border-white/5" : "bg-white border-[#E5E7EB] shadow-sm"
      }`}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto flex-1">
          {/* Manning Agent Filter */}
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
                isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-[#E5E7EB] text-[#111827] shadow-sm"
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
                isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-[#E5E7EB] text-[#111827] shadow-sm"
              }`}
            />
          </div>
        </div>

        {/* Export Excel Button */}
        <div className="flex items-center gap-2 w-full lg:w-auto shrink-0">
          <button
            onClick={handleExportExcel}
            className="w-full lg:w-auto px-5 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#008F5B] text-white text-xs font-bold shadow-sm transition cursor-pointer whitespace-nowrap"
          >
            Export Excel
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className={card}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-semibold tracking-wider uppercase ${labelText}`}>Total Registered Seafarers</span>
            <Users className="w-4 h-4 text-[#3D5EF6]" />
          </div>
          <p className={`text-4xl font-extrabold mt-4 ${ht}`}>{totalSeafarersSum || 98}</p>
        </div>

        <div className={card}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-semibold tracking-wider uppercase ${labelText}`}>Courses Booked</span>
            <Sparkles className="w-4 h-4 text-[#10B981]" />
          </div>
          <p className="text-4xl font-extrabold mt-4 text-[#10B981]">{totalCoursesSum || 98}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Referring Manning Agents (Bar Chart) */}
        <div className={`lg:col-span-7 ${card}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4 mb-4 border-white/5">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#3D5EF6]" />
              <h3 className="text-sm font-bold">Top Referring Manning Agents</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs ${mt}`}>Month:</span>
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
          </div>
          <div className="h-80 w-full text-xs">
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
                  <Bar dataKey="seafarers" fill="#3B82F6" radius={[6, 6, 0, 0]} barSize={36} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Region-Wise Seafarers (Donut Chart) */}
        <div className={`lg:col-span-5 ${card}`}>
          <div className="flex items-center gap-2 border-b pb-4 mb-4 border-white/5">
            <BarChart3 className="w-4 h-4 text-[#3D5EF6]" />
            <h3 className="text-sm font-bold">Region-Wise Seafarers</h3>
          </div>

          {filteredRegionStats.length === 0 ? (
            <p className={`text-xs py-12 text-center ${mt}`}>No regional data for selected filter.</p>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-full h-52 shrink-0 relative flex items-center justify-center">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={filteredRegionStats}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                        isAnimationActive={false}
                      >
                        {filteredRegionStats.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                      <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" fill={isDark ? "#fff" : "#111827"} fontSize="20" fontWeight="800">
                        {filteredRegionStats.reduce((sum: number, item: any) => sum + item.value, 0)}
                      </text>
                      <text x="50%" y="62%" textAnchor="middle" dominantBaseline="middle" fill="#94a3b8" fontSize="9" fontWeight="700" letterSpacing="1">
                        SEAFARERS
                      </text>
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Legend grid - 2 Columns exactly as in screenshot */}
              <div className="w-full grid grid-cols-2 gap-x-4 gap-y-2 text-xs pt-3 border-t border-slate-100 dark:border-white/5">
                {(() => {
                  const total = filteredRegionStats.reduce((sum: number, item: any) => sum + item.value, 0);
                  return filteredRegionStats.map((entry: any, index: number) => {
                    const pct = total > 0 ? Math.round((entry.value / total) * 100) : 0;
                    return (
                      <div key={entry.name} className="flex items-center justify-between gap-1 text-[11px]">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
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
    </div>
  );
}
