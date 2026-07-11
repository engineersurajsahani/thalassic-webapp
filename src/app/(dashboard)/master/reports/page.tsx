"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/providers/theme-provider";
import { fetchAPI } from "@/lib/api";
import { 
  BarChart3, 
  Download, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  BookOpen, 
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function ReportsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // State Management
  const [selectedRange, setSelectedRange] = useState("30days");
  const [salesReport, setSalesReport] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Reports list from backend
  useEffect(() => {
    setLoading(true);
    fetchAPI('/master/reports')
      .then(res => {
        setSalesReport(res);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load reports:", err);
        setLoading(false);
      });
  }, []);

  // Glassmorphic Styles
  const glassStyle = isDark
    ? "bg-slate-900/60 border-slate-800/80 backdrop-blur-xl"
    : "bg-white border-slate-200/80 shadow-md shadow-slate-100";

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 border-slate-800/40">
        <div>
          <h1 className={`text-3xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            Financial & Performance Reports
          </h1>
          <p className={`text-xs mt-0.5 font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Audit platform sales, student registrations, and course completion performance records.
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wide outline-none cursor-pointer ${
              isDark ? "bg-slate-900 border-slate-850 text-white" : "bg-white border-slate-200 text-slate-850 shadow-sm"
            }`}
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="6months">Last 6 Months</option>
          </select>
          <button
            onClick={() => alert("Downloading PDF Summary Report...")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-blue-500/20`}
          >
            <Download className="w-4.5 h-4.5" /> Export PDF
          </button>
        </div>
      </div>

      {/* Metric Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-2xl border ${glassStyle}`}>
          <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Average Course Rating</span>
          <p className="text-3xl font-black text-yellow-500 mt-1">4.85 ★</p>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 text-green-500" /> Outperforming target 4.5</p>
        </div>
        <div className={`p-6 rounded-2xl border ${glassStyle}`}>
          <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Average Course Completion</span>
          <p className="text-3xl font-black text-cyan-400 mt-1">94.2%</p>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 text-green-500" /> +2.5% increase this month</p>
        </div>
        <div className={`p-6 rounded-2xl border ${glassStyle}`}>
          <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Refund Rate</span>
          <p className="text-3xl font-black text-red-500 mt-1">0.32%</p>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1"><TrendingDown className="w-3.5 h-3.5 text-green-500" /> Reduced by 0.1%</p>
        </div>
      </div>

      {/* Sales Summary Table */}
      <div className={`p-6 rounded-3xl border space-y-4 ${glassStyle}`}>
        <h3 className={`text-base font-black flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
          <BarChart3 className="w-5 h-5 text-cyan-400" /> Course Booking Sales Performance
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-bold">
            <thead>
              <tr className={`border-b ${isDark ? "border-slate-850 bg-slate-950/20" : "border-slate-100 bg-slate-50/50"}`}>
                <th className="p-4 uppercase tracking-wider">Course Module Name</th>
                <th className="p-4 uppercase tracking-wider text-center">Total Bookings</th>
                <th className="p-4 uppercase tracking-wider text-center">Total Revenue</th>
                <th className="p-4 uppercase tracking-wider text-center">Average Rating</th>
                <th className="p-4 uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850/40">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-bold uppercase tracking-wider animate-pulse">
                    Calculating financial records and transactions...
                  </td>
                </tr>
              ) : salesReport.length > 0 ? (
                salesReport.map((row) => (
                  <tr key={row.id} className={isDark ? "hover:bg-slate-900/30" : "hover:bg-slate-50/50"}>
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <BookOpen className="w-4.5 h-4.5 text-blue-500 shrink-0" />
                        <span className={`text-sm font-black ${isDark ? "text-white" : "text-slate-800"}`}>{row.course}</span>
                      </div>
                    </td>
                    <td className={`p-4 text-center ${isDark ? "text-slate-300" : "text-slate-700"}`}>{row.bookings}</td>
                    <td className="p-4 text-center text-cyan-400 font-extrabold">{row.revenue}</td>
                    <td className="p-4 text-center text-yellow-500 font-extrabold">{row.rating} ★</td>
                    <td className="p-4 text-right">
                      <span className="text-[10px] text-green-500 flex items-center gap-1 justify-end font-extrabold uppercase">
                        <CheckCircle className="w-3.5 h-3.5" /> High Demand
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-bold uppercase tracking-wider">
                    No sales transaction records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
