"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useTheme } from "@/providers/theme-provider";
import { invoicesService } from "@/services/invoices.service";
import { InvoiceModal } from "@/components/invoices/InvoiceModal";
import { FileText, Search, Download, Eye, RefreshCw, AlertCircle, Calendar } from "lucide-react";

export default function AgentInvoicesPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const ht = isDark ? "text-white/90" : "text-slate-800";
  const mt = isDark ? "text-white/40" : "text-slate-400";
  const card = `rounded-3xl p-6 border ${isDark ? "bg-[#0d1f35]/80 border-white/[0.06]" : "bg-white border-slate-200 shadow-sm"}`;

  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [pdfData, setPdfData] = useState<any>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const data = await invoicesService.getInvoices({
        search: search || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setInvoices(data);
    } catch (err) {
      console.error("Failed to load invoices:", err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, startDate, endDate]);

  useEffect(() => { fetchInvoices(); }, [fetchInvoices]);

  const openPdf = async (inv: any) => {
    setSelectedInvoice(inv);
    setPdfLoading(true);
    setPdfData(null);
    try {
      const data = await invoicesService.getInvoicePdfData(inv.id);
      setPdfData(data);
    } catch (err) {
      console.error("Failed to load PDF:", err);
    } finally {
      setPdfLoading(false);
    }
  };

  const exportCSV = async () => {
    try {
      const rows = await invoicesService.exportInvoices({
        search: search || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      if (!rows || rows.length === 0) { alert("No records to export."); return; }
      const headers = Object.keys(rows[0]);
      const csv = [headers.join(","), ...rows.map((r: any) => headers.map((h: string) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `my-invoices-${Date.now()}.csv`; a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${ht}`}>Invoices Ledger</h1>
          <p className={`text-xs mt-1.5 ${mt}`}>View and download commission invoices for your referred seafarers. Invoices are permanently immutable records.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className={`flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors ${isDark ? "bg-white/8 hover:bg-white/12 text-white/70" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}>
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button onClick={fetchInvoices} className={`p-2.5 rounded-xl ${isDark ? "bg-white/5 hover:bg-white/10 text-white/50" : "bg-slate-100 hover:bg-slate-200 text-slate-500"}`}>
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 flex-wrap">
        <div className={`relative flex-1 min-w-[200px] flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm ${isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-sm"}`}>
          <Search className={`w-4 h-4 ${mt}`} />
          <input
            className={`bg-transparent outline-none w-full text-xs ${isDark ? "text-white" : "text-slate-800"}`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Invoice #, Seafarer name, Transaction ID..."
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "Paid", "Processing", "Cancelled"].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition ${statusFilter === s
                ? "bg-blue-600 text-white shadow"
                : isDark ? "bg-white/5 border border-white/10 text-white/50 hover:bg-white/10" : "bg-slate-100 border border-slate-200 text-slate-500 hover:bg-slate-200"}`}
            >
              {s === "all" ? "All Statuses" : s}
            </button>
          ))}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs ${isDark ? "bg-white/5 border-white/10 text-white/60" : "bg-white border-slate-200 shadow-sm text-slate-600"}`}>
            <Calendar className="w-3.5 h-3.5 opacity-60" />
            <input type="date" className="bg-transparent outline-none text-xs" value={startDate} onChange={e => setStartDate(e.target.value)} />
            <span className={mt}>–</span>
            <input type="date" className="bg-transparent outline-none text-xs" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={`${card} overflow-hidden p-0`}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className={`border-b ${isDark ? "border-white/10 bg-white/[0.02] text-white/30" : "border-slate-100 bg-slate-50 text-slate-400"} uppercase font-semibold tracking-wider`}>
                <th className="px-4 py-3.5 text-left">Invoice #</th>
                <th className="px-4 py-3.5 text-left">Type</th>
                <th className="px-4 py-3.5 text-left">Invoice Date</th>
                <th className="px-4 py-3.5 text-left">Payment Date</th>
                <th className="px-4 py-3.5 text-left">Seafarer</th>
                <th className="px-4 py-3.5 text-left">Course</th>
                <th className="px-4 py-3.5 text-right">Amount</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className={isDark ? "divide-y divide-white/5" : "divide-y divide-slate-100"}>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 9 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className={`h-3 rounded-full animate-pulse ${isDark ? "bg-white/10" : "bg-slate-200"}`} style={{ width: `${[60, 45, 75, 50, 65, 80, 55, 70, 40, 60][(i + j) % 10]}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center">
                    <FileText className={`w-10 h-10 mx-auto mb-3 ${mt}`} />
                    <div className={`text-sm font-semibold ${mt}`}>No invoices found</div>
                    <div className={`text-xs mt-1 ${mt}`}>Invoices appear automatically after referred seafarers complete a course purchase.</div>
                  </td>
                </tr>
              ) : invoices.map((inv: any) => (
                <tr key={inv.id} className={`transition-colors ${isDark ? "hover:bg-white/[0.025]" : "hover:bg-slate-50/70"}`}>
                  <td className="px-4 py-3.5 font-mono font-bold text-cyan-500 whitespace-nowrap">{inv.invoice_number}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${inv.invoice_type === "HAC" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"}`}>{inv.invoice_type}</span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">{inv.created_at ? new Date(inv.created_at).toLocaleDateString("en-IN") : "—"}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap">{inv.payment_date ? new Date(inv.payment_date).toLocaleDateString("en-IN") : "—"}</td>
                  <td className="px-4 py-3.5 font-semibold whitespace-nowrap">{inv.customer_name}</td>
                  <td className="px-4 py-3.5 max-w-[140px]"><div className={`truncate ${isDark ? "text-white/60" : "text-slate-600"}`}>{inv.course_name}</div></td>
                  <td className="px-4 py-3.5 text-right font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                    ₹{parseFloat(inv.final_amount || 0).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${inv.status === "Paid" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}`}>{inv.status}</span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <button
                      onClick={() => openPdf(inv)}
                      className={`p-1.5 rounded-lg border transition ${isDark ? "border-white/10 hover:bg-white/5 text-white/40 hover:text-white" : "border-slate-200 hover:bg-slate-50 text-slate-600"}`}
                      title="View Invoice"
                    >
                      <Eye className="w-3.5 h-3.5" />
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
              <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <div className={`text-sm ${ht}`}>Loading invoice...</div>
            </div>
          </div>
        ) : pdfData ? (
          <InvoiceModal pdfData={pdfData} onClose={() => { setSelectedInvoice(null); setPdfData(null); }} />
        ) : null
      )}
    </div>
  );
}
