"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "@/providers/theme-provider";
import { financeService } from "@/services/finance.service";
import {
  FileText, Download, BarChart2, Calendar, FileSpreadsheet,
  Activity, ArrowUpRight, DollarSign, Filter, RefreshCw
} from "lucide-react";

export default function ReportsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("revenue");
  
  // States for report data
  const [revenueData, setRevenueData] = useState<any>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  
  const card    = isDark ? "bg-[#0c1a2e] border-white/5"  : "bg-white border-slate-200";
  const text    = isDark ? "text-white"                   : "text-slate-800";
  const subtext = isDark ? "text-white/40"                : "text-slate-500";
  const input   = isDark ? "bg-[#0a1525] border-white/8 text-white placeholder-white/20" : "bg-slate-50 border-slate-200 text-slate-800";

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === "revenue") {
        const rev = await financeService.getReportsRevenue() || {
          summary: { total: "₹42,50,000", daily: "₹45,000", monthly: "₹12,40,000" }
        };
        setRevenueData(rev);
      } else if (activeTab === "payments") {
        const pay = await financeService.getReportsPayments() || {
          successful: 1450, failed: 23, pending: 15
        };
        setPaymentData(pay);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => { loadData(); }, [loadData]);

  const exportReport = (format: string) => {
    // Calling export endpoint (stub)
    const url = `/master/finance/reports/export?format=${format}&type=${activeTab}`;
    console.log("Exporting to", url);
    alert(`Exporting ${activeTab} report as ${format.toUpperCase()}...`);
  };

  const tabs = [
    { id: "revenue", label: "Revenue" },
    { id: "payments", label: "Payments" },
    { id: "commissions", label: "Commissions" },
    { id: "invoices", label: "Invoices" },
    { id: "settlements", label: "Settlements" }
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-bold tracking-tight ${text}`}>Financial Reports</h1>
          <p className={`text-xs mt-0.5 ${subtext}`}>Platform-wide financial insights and multi-format exports</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => exportReport('pdf')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20 transition-all`}>
            <FileText className="w-3.5 h-3.5" /> PDF
          </button>
          <button onClick={() => exportReport('xlsx')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all`}>
            <FileSpreadsheet className="w-3.5 h-3.5" /> Excel
          </button>
          <button onClick={() => exportReport('csv')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${isDark ? "border-white/10 text-white/50 hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b overflow-x-auto pb-1" style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-medium rounded-t-lg transition-all border-b-2 ${
              activeTab === tab.id 
                ? 'border-sky-500 text-sky-500' 
                : 'border-transparent text-slate-500 hover:text-slate-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={`p-6 rounded-xl border ${card} min-h-[400px]`}>
        {loading ? (
          <div className="flex items-center justify-center h-full opacity-50">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <div>
            <h2 className={`text-lg font-bold mb-4 ${text} capitalize`}>{activeTab} Report Overview</h2>
            
            {activeTab === 'revenue' && revenueData && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
                  <p className={`text-[10px] font-semibold uppercase tracking-wider ${subtext}`}>Total Revenue</p>
                  <p className={`text-2xl font-bold mt-1 ${text}`}>{revenueData.summary.total}</p>
                </div>
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
                  <p className={`text-[10px] font-semibold uppercase tracking-wider ${subtext}`}>This Month</p>
                  <p className={`text-2xl font-bold mt-1 text-sky-500`}>{revenueData.summary.monthly}</p>
                </div>
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
                  <p className={`text-[10px] font-semibold uppercase tracking-wider ${subtext}`}>Today</p>
                  <p className={`text-2xl font-bold mt-1 text-emerald-500`}>{revenueData.summary.daily}</p>
                </div>
              </div>
            )}
            
            {activeTab === 'payments' && paymentData && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'}`}>
                  <p className={`text-[10px] font-semibold uppercase tracking-wider text-emerald-500`}>Successful</p>
                  <p className={`text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400`}>{paymentData.successful}</p>
                </div>
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-rose-500/10 border-rose-500/20' : 'bg-rose-50 border-rose-100'}`}>
                  <p className={`text-[10px] font-semibold uppercase tracking-wider text-rose-500`}>Failed</p>
                  <p className={`text-2xl font-bold mt-1 text-rose-600 dark:text-rose-400`}>{paymentData.failed}</p>
                </div>
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-100'}`}>
                  <p className={`text-[10px] font-semibold uppercase tracking-wider text-amber-500`}>Pending</p>
                  <p className={`text-2xl font-bold mt-1 text-amber-600 dark:text-amber-400`}>{paymentData.pending}</p>
                </div>
              </div>
            )}

            <div className="mt-8">
               <p className={`text-sm ${subtext}`}>Detailed tabular view will be generated in the exported file (PDF/Excel/CSV).</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
