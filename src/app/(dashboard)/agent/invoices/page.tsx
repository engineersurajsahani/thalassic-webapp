"use client";
import toast from 'react-hot-toast';

import React, { useEffect, useState, useCallback } from "react";
import { useTheme } from "@/providers/theme-provider";
import { invoicesService } from "@/services/invoices.service";
import { InvoiceModal } from "@/components/invoices/InvoiceModal";
import { FileText, Search, Download, Eye, RefreshCw, AlertCircle, Calendar } from "lucide-react";

export default function AgentInvoicesPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const ht = isDark ? "text-white" : "text-[#111827]";
  const mt = isDark ? "text-gray-400" : "text-[#6B7280]";
  const card = `rounded-[16px] border-0 ${isDark ? "bg-[#0B0F19]" : "bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]"}`;

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
      if (!rows || rows.length === 0) { toast("No records to export."); return; }
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
          <button onClick={exportCSV} className={`flex items-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-full transition-colors duration-200 ${isDark ? "bg-[#111827] hover:bg-white/10 text-white/80 border border-[#1F2937]" : "bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#6B7280] border border-[#E5E7EB]"}`}>
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button onClick={fetchInvoices} className={`p-2.5 rounded-full transition-colors duration-200 ${isDark ? "bg-[#111827] hover:bg-white/10 text-white/60 border border-[#1F2937]" : "bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#6B7280] border border-[#E5E7EB]"}`}>
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 flex-wrap">
        <div className={`relative flex-1 min-w-[200px] flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm ${isDark ? "bg-[#111827] border-[#1F2937]" : "bg-white border-[#E5E7EB] shadow-sm"}`}>
          <Search className={`w-4 h-4 ${mt}`} />
          <input
            className={`bg-transparent outline-none w-full text-xs ${isDark ? "text-white placeholder:text-gray-500" : "text-[#111827] placeholder:text-[#9CA3AF]"}`}
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
              className={`px-4 py-2 rounded-full text-xs font-semibold capitalize transition-colors duration-200 ${statusFilter === s
                ? "bg-[#3D5EF6] text-white shadow-sm"
                : isDark ? "bg-[#111827] border border-[#1F2937] text-white/60 hover:bg-white/10" : "bg-[#F3F4F6] border border-[#E5E7EB] text-[#6B7280] hover:bg-[#E5E7EB]"}`}
            >
              {s === "all" ? "All Statuses" : s}
            </button>
          ))}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs ${isDark ? "bg-[#111827] border-[#1F2937] text-white/60" : "bg-white border-[#E5E7EB] shadow-sm text-[#6B7280]"}`}>
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
              <tr className={`border-b ${isDark ? "border-[#1F2937] bg-white/[0.02] text-gray-400" : "border-[#E5E7EB] bg-[#FAFAFA] text-[#6B7280]"} uppercase font-semibold tracking-wider`}>
                <th className="px-4 py-3.5 text-left">Invoice #</th>
                <th className="px-4 py-3.5 text-left">Converted Date</th>
                <th className="px-4 py-3.5 text-left">Payment Date</th>
                <th className="px-4 py-3.5 text-left">Seafarer</th>
                <th className="px-4 py-3.5 text-left">Course</th>
                <th className="px-4 py-3.5 text-right">Amount</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className={isDark ? "divide-y divide-[#1F2937]" : "divide-y divide-[#E5E7EB]"}>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className={`h-3 rounded-full animate-pulse ${isDark ? "bg-white/10" : "bg-slate-200"}`} style={{ width: `${[60, 45, 75, 50, 65, 80, 55, 70, 40, 60][(i + j) % 10]}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <FileText className={`w-10 h-10 mx-auto mb-3 ${mt}`} />
                    <div className={`text-sm font-semibold ${mt}`}>No invoices found</div>
                    <div className={`text-xs mt-1 ${mt}`}>Invoices appear automatically after referred seafarers complete a course purchase.</div>
                  </td>
                </tr>
              ) : invoices.map((inv: any) => (
                <tr key={inv.id} className={`transition-colors duration-200 ${isDark ? "hover:bg-white/[0.025]" : "hover:bg-slate-50/70"}`}>
                  <td className="px-4 py-3.5 font-mono font-bold text-[#3D5EF6] whitespace-nowrap">{inv.invoice_number}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap">{inv.converted_at ? new Date(inv.converted_at).toLocaleDateString("en-IN") : "—"}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap">{inv.payment_date ? new Date(inv.payment_date).toLocaleDateString("en-IN") : "—"}</td>
                  <td className="px-4 py-3.5 font-semibold whitespace-nowrap">{inv.customer_name}</td>
                  <td className="px-4 py-3.5 max-w-[140px]"><div className={`truncate ${isDark ? "text-white/60" : "text-[#6B7280]"}`}>{inv.course_name}</div></td>
                  <td className="px-4 py-3.5 text-right font-bold text-[#111827] dark:text-white whitespace-nowrap">
                    ₹{parseFloat(inv.final_amount || 0).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      inv.status === "Paid"
                        ? "bg-[#DCFCE7] text-[#16A34A]"
                        : inv.status === "Processing"
                        ? "bg-[#FEF3C7] text-[#B45309]"
                        : "bg-[#FEE2E2] text-[#DC2626]"
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <button
                      onClick={() => openPdf(inv)}
                      className={`p-2 rounded-full border flex items-center justify-center transition-colors duration-200 cursor-pointer ${
                        isDark 
                          ? "bg-[#111827] border-[#1F2937] text-white/70 hover:text-white hover:bg-white/10" 
                          : "bg-[#F3F4F6] border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] hover:bg-[#E5E7EB]"
                      }`}
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
            <div className="bg-white dark:bg-[#0B0F19] rounded-[16px] p-8 text-center shadow-2xl border-0">
              <div className="w-8 h-8 border-4 border-[#3D5EF6] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
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
