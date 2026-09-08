"use client";
import toast from 'react-hot-toast';

import React, { useEffect, useState, useCallback } from "react";
import { useTheme } from "@/providers/theme-provider";
import { invoicesService } from "@/services/invoices.service";
import { InvoiceModal } from "@/components/invoices/InvoiceModal";
import {
  Search, Receipt, Filter, Download, RefreshCw,
  Eye, FileText, AlertCircle, Calendar
} from "lucide-react";

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  HOC: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400" },
  HAC: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400" },
};

function TypeBadge({ type }: { type: string }) {
  const s = TYPE_COLORS[type] || TYPE_COLORS["HOC"];
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.bg} ${s.text}`}>{type}</span>;
}

export default function InvoicesPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const card = `rounded-[16px] p-7 border-0 transition-all duration-300 hover:-translate-y-0.5 ${
    isDark
      ? "bg-[#0c1629] shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.4)] text-white"
      : "bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] text-[#111827]"
  }`;
  const ht = isDark ? "text-white/90" : "text-slate-800";
  const mt = isDark ? "text-white/40" : "text-slate-400";
  const inputCls = `bg-transparent outline-none w-full text-xs ${isDark ? "text-white" : "text-slate-800"}`;
  const inputWrap = `flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm ${isDark ? "bg-white/5 border-white/10 text-white/60" : "bg-white border-slate-200 text-slate-600 shadow-sm"}`;
  const selectCls = `px-3 py-2.5 rounded-lg border text-xs font-semibold outline-none cursor-pointer ${isDark ? "bg-[#0d1f35] border-white/10 text-white" : "bg-white border-slate-200 text-slate-700 shadow-sm"}`;

  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [pdfData, setPdfData] = useState<any>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const activeParams = {
    search: search || undefined,
    type: typeFilter !== "all" ? typeFilter : undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  };

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const data = await invoicesService.getInvoices(activeParams);
      setInvoices(data);
    } catch (err) {
      console.error("Failed to load invoices:", err);
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter, statusFilter, startDate, endDate]);

  useEffect(() => { fetchInvoices(); }, [fetchInvoices]);

  const openPdf = async (inv: any) => {
    setSelectedInvoice(inv);
    setPdfLoading(true);
    try {
      const data = await invoicesService.getInvoicePdfData(inv.id);
      setPdfData(data);
    } catch (err) {
      console.error("Failed to load invoice PDF data:", err);
      setPdfData(null);
    } finally {
      setPdfLoading(false);
    }
  };

  const exportCSV = async () => {
    try {
      const rows = await invoicesService.exportInvoices(activeParams);
      if (!rows || rows.length === 0) { toast("No records to export."); return; }
      const headers = Object.keys(rows[0]);
      const csv = [
        headers.join(","),
        ...rows.map((r: any) => headers.map(h => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(","))
      ].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `invoices-export-${Date.now()}.csv`; a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  const stats = {
    total: invoices.length,
    hoc: invoices.filter(i => i.invoice_type === "HOC").length,
    hac: invoices.filter(i => i.invoice_type === "HAC").length,
    totalAmount: invoices.reduce((sum, i) => sum + (parseFloat(i.final_amount) || 0), 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${ht}`}>Invoice Management</h1>
          <p className={`text-xs mt-1.5 ${mt}`}>View and manage all HOC & HAC invoices. Read-only access.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${isDark ? "bg-white/8 hover:bg-white/12 text-white/70" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}>
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button onClick={fetchInvoices} className={`p-2.5 rounded-xl transition-colors ${isDark ? "bg-white/5 hover:bg-white/10 text-white/50" : "bg-slate-100 hover:bg-slate-200 text-slate-500"}`}>
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Invoices", value: stats.total, icon: Receipt, color: "text-blue-500" },
          { label: "HOC (Direct)", value: stats.hoc, icon: FileText, color: "text-emerald-500" },
          { label: "HAC (Agent Referred)", value: stats.hac, icon: FileText, color: "text-indigo-500" },
          { label: "Total Revenue", value: `₹${stats.totalAmount.toLocaleString("en-IN")}`, icon: Receipt, color: "text-purple-500" },
        ].map((s, i) => (
          <div key={i} className={`${card} flex items-center gap-4`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <div className={`text-xs ${mt}`}>{s.label}</div>
              <div className={`text-xl font-bold ${ht}`}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-3 flex-wrap">
        <label className={`${inputWrap} flex-1 min-w-[200px]`}>
          <Search className="w-4 h-4 opacity-55" />
          <input className={inputCls} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by Invoice #, Seafarer Name, or Transaction ID..." />
        </label>
        <select className={selectCls} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="all">All Types</option>
          <option value="HOC">HOC (Direct)</option>
          <option value="HAC">HAC (Agent Referred)</option>
        </select>
        <select className={selectCls} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Processing">Processing</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <div className={`${inputWrap} gap-2`}>
          <Calendar className="w-4 h-4 opacity-55 flex-shrink-0" />
          <input type="date" className={inputCls} value={startDate} onChange={e => setStartDate(e.target.value)} />
          <span className={`text-xs ${mt}`}>to</span>
          <input type="date" className={inputCls} value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
      </div>

      {/* Invoice Table */}
      <div className={`${card} overflow-hidden p-0`}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className={`border-b text-[11px] ${isDark ? "border-white/10 bg-white/[0.02]" : "border-slate-100 bg-slate-50"}`}>
                {[
                  "Invoice Number",
                  "Invoice Date",
                  "Seafarer",
                  "Course",
                  "Institute",
                  "Hari Om Payable",
                  "Payment Status",
                  "Invoice Status",
                  "Actions",
                ].map((h, i) => (
                  <th
                    key={h}
                    className={`py-3 font-semibold ${mt} whitespace-nowrap ${
                      i === 0 ? "pl-5 pr-2.5 text-left" : i === 8 ? "pl-2.5 pr-5 text-right" : "px-2.5 text-left"
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className={`border-b ${isDark ? "border-white/5" : "border-slate-50"}`}>
                    {Array.from({ length: 9 }).map((_, j) => (
                      <td key={j} className={`py-3 ${j === 0 ? "pl-5 pr-2.5" : j === 8 ? "pl-2.5 pr-5" : "px-2.5"}`}>
                        <div className={`h-3 rounded-full animate-pulse ${isDark ? "bg-white/10" : "bg-slate-200"}`} style={{ width: `${[60, 45, 75, 50, 65, 80, 55, 70, 40, 60][(i + j) % 10]}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center">
                    <AlertCircle className={`w-8 h-8 mx-auto mb-2 ${mt}`} />
                    <div className={`text-sm font-semibold ${mt}`}>No partner invoices found</div>
                    <div className={`text-xs mt-1 ${mt}`}>Invoices associated with Seafarers handled through this Partner will appear here.</div>
                  </td>
                </tr>
              ) : invoices.map((inv: any) => (
                <tr key={inv.id} className={`border-b ${isDark ? "border-white/5 hover:bg-white/[0.025]" : "border-slate-50 hover:bg-slate-50/60"} transition-colors`}>
                  {/* Invoice Number */}
                  <td className="pl-5 pr-2.5 py-3.5 font-mono font-bold text-blue-500 text-xs whitespace-nowrap">
                    {inv.invoice_number}
                  </td>

                  {/* Invoice Date */}
                  <td className="px-2.5 py-3.5 whitespace-nowrap text-[11px] font-medium">
                    {inv.payment_date ? new Date(inv.payment_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                  </td>

                  {/* Seafarer */}
                  <td className="px-2.5 py-3.5 max-w-[150px]">
                    <div className={`font-bold text-xs truncate ${ht}`}>{inv.customer_name}</div>
                    <div className={`text-[10px] truncate ${mt}`}>{inv.customer_email}</div>
                  </td>

                  {/* Course */}
                  <td className="px-2.5 py-3.5 max-w-[160px]">
                    <div className={`truncate font-semibold text-xs ${isDark ? "text-white/80" : "text-slate-700"}`} title={inv.course_name}>
                      {inv.course_name}
                    </div>
                  </td>

                  {/* Institute */}
                  <td className="px-2.5 py-3.5 max-w-[150px]">
                    <div className={`truncate text-xs ${mt}`} title={inv.institute_name || "Hari Om Maritime Institute, Mumbai"}>
                      {inv.institute_name || "Hari Om Maritime Institute"}
                    </div>
                  </td>

                  {/* Amount Applicable to Hari Om */}
                  <td className="px-2.5 py-3.5 font-mono font-bold text-xs text-emerald-500 whitespace-nowrap">
                    ₹{(inv.hariom_payable_amount ?? inv.final_amount ?? 0).toLocaleString("en-IN")}
                  </td>

                  {/* Payment Status */}
                  <td className="px-2.5 py-3.5 whitespace-nowrap">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      (inv.payment_status || inv.status) === "Paid"
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                    }`}>
                      {inv.payment_status || inv.status || "Paid"}
                    </span>
                  </td>

                  {/* Invoice Status */}
                  <td className="px-2.5 py-3.5 whitespace-nowrap">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      (inv.invoice_status || "Issued") === "Issued"
                        ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                        : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                    }`}>
                      {inv.invoice_status || "Issued"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="pl-2.5 pr-5 py-3.5 text-right whitespace-nowrap">
                    <button
                      onClick={() => openPdf(inv)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white transition-colors cursor-pointer flex items-center gap-1.5 ml-auto shadow-sm"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      View Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PDF Modal */}
      {selectedInvoice && (
        pdfLoading ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#0d1f35] rounded-2xl p-8 text-center shadow-2xl">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <div className={`text-sm ${ht}`}>Loading invoice...</div>
            </div>
          </div>
        ) : pdfData ? (
          <InvoiceModal pdfData={pdfData} onClose={() => { setSelectedInvoice(null); setPdfData(null); }} />
        ) : (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#0d1f35] rounded-2xl p-8 text-center shadow-2xl max-w-sm w-full">
              <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
              <div className={`text-sm font-semibold mb-1 ${ht}`}>Failed to load invoice</div>
              <div className={`text-xs ${mt} mb-4`}>Could not retrieve invoice PDF data. Please try again.</div>
              <button onClick={() => setSelectedInvoice(null)} className="text-xs font-semibold px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 text-slate-700 dark:text-white/70">Close</button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
