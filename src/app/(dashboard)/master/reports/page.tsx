"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import { masterService } from "@/services/master.service";
import { TrendingUp, TrendingDown, Download, BarChart3, Users, BookOpen, ShoppingCart, Star, ShieldCheck } from "lucide-react";
import dynamic from "next/dynamic";
const currencyFormatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });


// Dynamic imports for recharts components (SSR disabled)
const BarChart = dynamic(() => import("recharts").then((m) => m.BarChart), { ssr: false });
const Bar = dynamic(() => import("recharts").then((m) => m.Bar), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((m) => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((m) => m.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then((m) => m.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((m) => m.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then((m) => m.ResponsiveContainer), { ssr: false });
const AreaChart = dynamic(() => import("recharts").then((m) => m.AreaChart), { ssr: false });
const Area = dynamic(() => import("recharts").then((m) => m.Area), { ssr: false });

// Mock data used for UI preview – easy to replace with real API later
const mockReportData: Record<string, any[]> = {
  "Revenue-Daily": [
    { date: "2025-01-01", revenue: 180000, target: 200000 },
    { date: "2025-01-02", revenue: 210000, target: 200000 },
  ],
  "Revenue-Monthly": [
    { month: "Jan", revenue: 180000, target: 200000 },
    { month: "Feb", revenue: 210000, target: 200000 },
  ],
  "Revenue-Annual": [
    { year: 2025, revenue: 2_200_000, target: 2_500_000 },
  ],
  "Payments-Successful": [
    { id: "P001", amount: 1200, status: "Successful" },
  ],
  "Payments-Failed": [
    { id: "P002", amount: 500, status: "Failed" },
  ],
  "Payments-Pending": [
    { id: "P003", amount: 800, status: "Pending" },
  ],
  "Commissions-Pending": [],
  "Commissions-Paid": [],
  "Commissions-Outstanding": [],
  "Commissions-Snapshots": [
    {
      purchaseId: "PUR123",
      agentId: "A001",
      agentName: "John Doe",
      courseName: "Advanced Navigation",
      purchaseAmount: 2500,
      commissionPct: 10,
      commissionAmount: 250,
      commissionSource: "Direct",
      version: "v2",
      purchaseDate: "2025-07-15",
      status: "Settled",
      settlementDate: "2025-07-20",
      remarks: "",
    },
  ],
  "Invoices-HOC": [],
  "Invoices-HAC": [],
  "Invoices-Summary": [],
  "Settlements-Pending": [],
  "Settlements-Paid": [],
  "Settlements-History": [],
  "Audit Logs-Logs": [
    {
      timestamp: "2025-08-01 12:34:56",
      user: "admin",
      action: "UPDATE",
      module: "Reports",
      entityId: "R001",
      previousValue: "Pending",
      updatedValue: "Approved",
      ipAddress: "192.168.1.10",
    },
    {
      timestamp: "2025-08-02 09:20:10",
      user: "jane",
      action: "CREATE",
      module: "Commission",
      entityId: "C101",
      previousValue: "",
      updatedValue: "10%",
      ipAddress: "192.168.1.22",
    },
  ],
};

export default function ReportsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const bg = isDark ? "bg-[#0d1f35] border border-white/6" : "bg-white border border-slate-200";
  const mutedText = isDark ? "text-white/35" : "text-slate-400";

  // UI state
  const formatValue = (val: any) => {
    if (typeof val === 'number') {
      return currencyFormatter.format(val);
    }
    return val;
  };
  const [topCourses, setTopCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageCompletion, setAverageCompletion] = useState("94.2%");
  const [refundRate, setRefundRate] = useState("0.32%");
  const [selectedTab, setSelectedTab] = useState('Revenue');
  const [selectedSubTab, setSelectedSubTab] = useState('Daily');
  const [exportFormat, setExportFormat] = useState('csv');
  const [selectedDays, setSelectedDays] = useState("30");
  const [auditSearch, setAuditSearch] = useState('');
  const [auditPage, setAuditPage] = useState(1);
  const rowsPerPage = 10;

  // Sub‑tab definitions
  const subTabsMap: Record<string, string[]> = {
    Revenue: ['Daily', 'Monthly', 'Annual'],
    Payments: ['Successful', 'Failed', 'Pending'],
    Commissions: ['Pending', 'Paid', 'Outstanding', 'Snapshots'],
    Invoices: ['HOC', 'HAC', 'Summary'],
    Settlements: ['Pending', 'Paid', 'History'],
    'Audit Logs': ['Logs'],
  };

  const reportData = mockReportData;

  const fetchReports = async (days?: string) => {
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 300));
    } catch (err) {
      console.error('Failed to load reports data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(selectedDays);
  }, []);

  const avgRating = topCourses.length > 0
    ? (topCourses.reduce((sum, c) => sum + parseFloat(c.rating || 0), 0) / topCourses.length).toFixed(2)
    : "4.85";

  const handleExport = () => {
    const key = `${selectedTab}-${selectedSubTab}`;
    const data = reportData[key] ?? [];
    if (data.length === 0) {
      alert('No data to export for this report.');
      return;
    }
    if (exportFormat === 'csv') {
      const headers = Object.keys(data[0]);
      const rows = data.map((row) => headers.map((h) => row[h]));
      const csvContent = [
        headers.join(','),
        ...rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')),
      ].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${key}_report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (exportFormat === 'excel') {
      try {
        const XLSX = require('xlsx');
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Report');
        XLSX.writeFile(wb, `${key}_report.xlsx`);
      } catch (e) {
        alert('Excel export requires the "xlsx" package.');
      }
    } else if (exportFormat === 'pdf') {
      window.print();
    }
  };

  const renderCommissionSnapshots = () => {
    const rows = reportData["Commissions-Snapshots"] ?? [];
    if (rows.length === 0) return <p className="text-sm text-gray-500">No snapshot data.</p>;
    return (
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full border text-sm">
          <thead className="bg-slate-800 text-slate-200 border-b border-slate-700">
            <tr>
              {['Purchase ID', 'Agent ID', 'Agent Name', 'Course Name', 'Purchase Amount', 'Commission %', 'Commission Amount', 'Commission Source', 'Version', 'Purchase Date', 'Status', 'Settlement Date', 'Remarks'].map((h) => (
                <th key={h} className="px-3 py-2 border">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-3 py-2 border">{row.purchaseId}</td>
                <td className="px-3 py-2 border">{row.agentId}</td>
                <td className="px-3 py-2 border">{row.agentName}</td>
                <td className="px-3 py-2 border">{row.courseName}</td>
                <td className="px-3 py-2 border">{formatValue(row.purchaseAmount)}</td>
                <td className="px-3 py-2 border">{row.commissionPct}%</td>
                <td className="px-3 py-2 border">{formatValue(row.commissionAmount)}</td>
                <td className="px-3 py-2 border">{row.commissionSource}</td>
                <td className="px-3 py-2 border">{row.version}</td>
                <td className="px-3 py-2 border">{row.purchaseDate}</td>
                <td className="px-3 py-2 border">{row.status}</td>
                <td className="px-3 py-2 border">{row.settlementDate}</td>
                <td className="px-3 py-2 border">{row.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderAuditLogs = () => {
    const allRows = reportData["Audit Logs-Logs"] ?? [];
    const filtered = allRows.filter((row) =>
      row.user.toLowerCase().includes(auditSearch.toLowerCase()) ||
      row.entityId.toLowerCase().includes(auditSearch.toLowerCase()) ||
      row.action.toLowerCase().includes(auditSearch.toLowerCase())
    );
    const totalPages = Math.ceil(filtered.length / rowsPerPage) || 1;
    const startIdx = (auditPage - 1) * rowsPerPage;
    const pageRows = filtered.slice(startIdx, startIdx + rowsPerPage);

    return (
      <div className="mt-4">
        <div className="flex mb-2">
          <input
            type="text"
            placeholder="Search by user, action, or entity ID"
            className="flex-1 px-3 py-2 border rounded mr-2"
            value={auditSearch}
            onChange={(e) => { setAuditSearch(e.target.value); setAuditPage(1); }}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-slate-800 text-slate-200 border-b border-slate-700">
              <tr>
                {['Timestamp', 'User', 'Action', 'Module', 'Entity ID', 'Previous Value', 'Updated Value', 'IP Address'].map((h) => (
                  <th key={h} className="px-3 py-2 border">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-3 py-2 border">{row.timestamp}</td>
                  <td className="px-3 py-2 border">{row.user}</td>
                  <td className="px-3 py-2 border">{row.action}</td>
                  <td className="px-3 py-2 border">{row.module}</td>
                  <td className="px-3 py-2 border">{row.entityId}</td>
                  <td className="px-3 py-2 border">{row.previousValue}</td>
                  <td className="px-3 py-2 border">{row.updatedValue}</td>
                  <td className="px-3 py-2 border">{row.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-600">Page {auditPage} of {totalPages}</span>
          <div>
            <button className="px-2 py-1 mr-1 border rounded disabled:opacity-50" onClick={() => setAuditPage((p) => Math.max(p - 1, 1))} disabled={auditPage === 1}>Prev</button>
            <button className="px-2 py-1 border rounded disabled:opacity-50" onClick={() => setAuditPage((p) => Math.min(p + 1, totalPages))} disabled={auditPage === totalPages}>Next</button>
          </div>
        </div>
      </div>
    );
  };

  const renderReportTable = () => {
    const key = `${selectedTab}-${selectedSubTab}`;
    const rows = reportData[key] ?? [];
    if (selectedTab === 'Commissions' && selectedSubTab === 'Snapshots') return renderCommissionSnapshots();
    if (selectedTab === 'Audit Logs') return renderAuditLogs();
    if (rows.length === 0) return <p className="text-sm text-gray-500">No data available.</p>;
    const headers = Object.keys(rows[0]);
    return (
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full border text-sm">
          <thead className="bg-slate-800 text-slate-200 border-b border-slate-700">
            <tr>
              {headers.map((h) => <th key={h} className="px-3 py-2 border">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="border-t">
                {headers.map((h) => <td key={h} className="px-3 py-2 border">{formatValue(row[h])}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-4 justify-between">
        <div className="flex items-center space-x-2">
          <select value={selectedDays} onChange={(e) => { setSelectedDays(e.target.value); fetchReports(e.target.value); }} className={`text-xs font-bold uppercase tracking-wider px-3.5 py-2.5 rounded-xl border ${isDark ? "border-slate-800 bg-slate-900/40 text-white/70" : "border-slate-200 bg-white"}`}>
            <option value="30">Last 30 Days</option>
            <option value="7">Last 7 Days</option>
          </select>
          <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value)} className={`text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900/40 text-white' : 'border-slate-200 bg-white'}`}>
            <option value="pdf">Export as PDF</option>
            <option value="excel">Export as Excel</option>
            <option value="csv">Export as CSV</option>
          </select>
          <button onClick={handleExport} className="bg-sky-500 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase">Export</button>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className={`p-4 rounded ${bg}`}>
            <p className={`text-xs font-black uppercase tracking-wider ${mutedText}`}>Rating</p>
            <span className="text-3xl font-black text-amber-500">{avgRating}</span>
          </div>
          <div className={`p-4 rounded ${bg}`}>
            <p className={`text-xs font-black uppercase tracking-wider ${mutedText}`}>Completion</p>
            <span className="text-3xl font-black text-cyan-500">{averageCompletion}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {Object.keys(subTabsMap).map((cat) => (
          <button key={cat} onClick={() => { setSelectedTab(cat); setSelectedSubTab(subTabsMap[cat][0]); }} className={`px-3 py-1 rounded ${selectedTab === cat ? 'bg-sky-500 text-white' : 'bg-gray-200 text-gray-800'}`}>{cat}</button>
        ))}
      </div>
      <div className="flex space-x-2 mb-2">
        {subTabsMap[selectedTab].map((sub) => (
          <button key={sub} onClick={() => setSelectedSubTab(sub)} className={`px-2 py-0.5 rounded ${selectedSubTab === sub ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'}`}>{sub}</button>
        ))}
      </div>
      {loading ? <p className="text-center">Loading...</p> : renderReportTable()}
    </div>
  );
}
