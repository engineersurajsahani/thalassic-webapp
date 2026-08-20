"use client";

import React, { useEffect, useState } from "react";
import { invoicesService } from "@/services/invoices.service";
import { InvoiceModal } from "@/components/invoices/InvoiceModal";
import { useTheme } from "@/providers/theme-provider";
import {
  ShoppingBag,
  Receipt,
  Eye,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  Sparkles,
  CloudLightning,
  User,
  CreditCard,
  Search,
} from "lucide-react";

export default function PurchaseHistoryPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [pdfData, setPdfData] = useState<any>(null);
  const [loadingPdf, setLoadingPdf] = useState<string | null>(null);

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const data = await invoicesService.getInvoices({
        search: search || undefined,
        type: typeFilter !== "all" ? typeFilter : undefined,
      });
      setPurchases(data);
    } catch (err) {
      console.error("Failed to load purchase history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPurchases();
  };

  const handleViewInvoice = async (invoiceId: string) => {
    setLoadingPdf(invoiceId);
    try {
      const data = await invoicesService.getInvoicePdfData(invoiceId);
      setPdfData(data);
      setSelectedInvoiceId(invoiceId);
    } catch (err) {
      console.error("Failed to load invoice PDF:", err);
    } finally {
      setLoadingPdf(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            <CheckCircle className="w-3 h-3" /> Paid
          </span>
        );
      case "processing":
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 animate-pulse">
            <Clock className="w-3 h-3" /> Processing
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-red-400 bg-red-400/10 px-2.5 py-0.5 rounded-full border border-red-500/20">
            <XCircle className="w-3 h-3" /> {status || "Unknown"}
          </span>
        );
    }
  };

  const fmtDate = (d: string) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  const fmt = (val: number) =>
    `₹${Number(val || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

  return (
    <div className="space-y-8 animate-fadeIn relative pb-10">
      {/* Page Title Header */}
      <div className="flex flex-col gap-1">
        <span
          className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit ${
            isDark ? "bg-cyan-500/10 text-cyan-400" : "bg-blue-50 text-[#3b71cb]"
          }`}
        >
          🛒 Purchase & Invoice Ledger
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight mt-1.5">Purchase History</h1>
        <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          View all your course purchases, payment details, transaction records, and manage HOC & HAC invoices.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <div
            className={`flex items-center gap-2 flex-1 rounded-xl border px-3 py-2.5 text-sm ${
              isDark
                ? "bg-[#09162c] border-slate-800 text-white"
                : "bg-white border-slate-200 text-slate-800"
            }`}
          >
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by course name, invoice no., or transaction ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none flex-1 text-xs placeholder:text-slate-400"
            />
          </div>
          <button
            type="submit"
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              isDark
                ? "bg-cyan-600 hover:bg-cyan-500 text-white"
                : "bg-[#3b71cb] hover:bg-[#2c5fb3] text-white"
            }`}
          >
            Search
          </button>
        </form>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className={`px-3 py-2.5 rounded-xl border text-xs font-semibold outline-none cursor-pointer transition-colors ${
            isDark
              ? "bg-[#09162c] border-slate-800 text-white"
              : "bg-white border-slate-200 text-slate-800"
          }`}
        >
          <option value="all">All Purchase Types</option>
          <option value="HOC">HOC – Direct Purchase</option>
          <option value="HAC">HAC – Agent Referred</option>
        </select>
      </div>

      {/* Purchases Table */}
      <section
        className={`rounded-3xl border p-6 md:p-8 shadow-xl relative overflow-hidden ${
          isDark
            ? "bg-gradient-to-b from-[#09162c] to-[#040c1a] border-slate-800/80 text-white"
            : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-800/40 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-lg font-black tracking-tight">Completed Purchases & Invoices</h3>
          </div>
          {!loading && (
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                isDark ? "bg-cyan-500/10 text-cyan-400" : "bg-blue-50 text-[#3b71cb]"
              }`}
            >
              Total: {purchases.length}
            </span>
          )}
        </div>

        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`h-12 rounded-xl ${isDark ? "bg-slate-800/40" : "bg-slate-100"}`} />
            ))}
          </div>
        ) : purchases.length === 0 ? (
          <div
            className={`text-center py-16 rounded-2xl border border-dashed flex flex-col items-center justify-center p-6 ${
              isDark ? "border-slate-800 bg-slate-900/10" : "border-slate-200 bg-slate-50/50"
            }`}
          >
            <CloudLightning className="w-10 h-10 text-slate-500 mb-3" />
            <h4 className="text-sm font-bold text-slate-400">No Purchases Found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-[300px] leading-relaxed">
              You have no course purchases recorded yet. Browse available DGS courses to enroll.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs leading-normal">
              <thead>
                <tr
                  className={`font-black border-b uppercase tracking-widest text-[9px] ${
                    isDark ? "text-slate-500 border-slate-800" : "text-slate-400 border-slate-100"
                  }`}
                >
                  <th className="pb-3 pr-4">Course Name</th>
                  <th className="pb-3 pr-4">Purchase Date</th>
                  <th className="pb-3 pr-4">Amount Paid</th>
                  <th className="pb-3 pr-4">Payment Method</th>
                  <th className="pb-3 pr-4">Transaction ID</th>
                  <th className="pb-3 pr-4">Invoice No.</th>
                  <th className="pb-3 pr-4">Type</th>
                  <th className="pb-3 pr-4">Referring Agent</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 text-right">Invoice Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/10">
                {purchases.map((p) => {
                  const isPaid = p.status?.toLowerCase() === "paid" || p.status?.toLowerCase() === "completed";
                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-slate-500/5 transition-colors ${
                        isDark ? "border-b border-slate-900/60" : "border-b border-slate-100"
                      }`}
                    >
                      <td className="py-4 pr-4 font-bold max-w-[170px] truncate" title={p.course_name}>
                        {p.course_name || "—"}
                      </td>
                      <td className={`py-4 pr-4 ${isDark ? "text-slate-400" : "text-slate-550"}`}>
                        {fmtDate(p.payment_date || p.created_at)}
                      </td>
                      <td className="py-4 pr-4 font-extrabold">{fmt(p.final_amount)}</td>
                      <td className={`py-4 pr-4 ${isDark ? "text-slate-400" : "text-slate-550"}`}>
                        <span className="flex items-center gap-1">
                          <CreditCard className="w-3 h-3 text-slate-400" />
                          {p.payment_method || "Online"}
                        </span>
                      </td>
                      <td
                        className={`py-4 pr-4 font-mono text-[10px] max-w-[110px] truncate ${
                          isDark ? "text-slate-400" : "text-slate-500"
                        }`}
                        title={p.transaction_id}
                      >
                        {p.transaction_id || "—"}
                      </td>
                      <td
                        className={`py-4 pr-4 font-black uppercase tracking-wider text-[10px] ${
                          p.invoice_type === "HAC" ? "text-blue-400" : "text-cyan-400"
                        }`}
                      >
                        {p.invoice_number || "—"}
                      </td>
                      <td className="py-4 pr-4">
                        {p.invoice_type ? (
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              p.invoice_type === "HAC"
                                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                            }`}
                          >
                            {p.invoice_type}
                          </span>
                        ) : (
                          <span className={isDark ? "text-slate-600" : "text-slate-300"}>—</span>
                        )}
                      </td>
                      <td className="py-4 pr-4">
                        {p.invoice_type === "HAC" && p.agent_name ? (
                          <div>
                            <div className="font-semibold flex items-center gap-1">
                              <User className="w-3 h-3 text-blue-400" />
                              {p.agent_name}
                            </div>
                            {p.agent_referral_code && (
                              <div className={`text-[10px] font-mono ${isDark ? "text-slate-600" : "text-slate-400"}`}>
                                Code: {p.agent_referral_code}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className={isDark ? "text-slate-600" : "text-slate-300"}>—</span>
                        )}
                      </td>
                      <td className="py-4 pr-4">{getStatusBadge(p.status)}</td>
                      <td className="py-4 text-right">
                        {isPaid && p.invoice_number ? (
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => handleViewInvoice(p.id)}
                              disabled={loadingPdf === p.id}
                              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-[10px] font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                                isDark
                                  ? "border-slate-800 bg-slate-900/40 text-gray-300 hover:bg-slate-800 hover:border-slate-700"
                                  : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                              }`}
                              title="View Invoice"
                            >
                              {loadingPdf === p.id ? (
                                <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                              )}
                              View
                            </button>
                            <button
                              onClick={() => handleViewInvoice(p.id)}
                              disabled={loadingPdf === p.id}
                              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-[10px] font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                                isDark
                                  ? "border-slate-800 bg-slate-900/40 text-cyan-400 hover:bg-slate-800 hover:border-slate-700"
                                  : "border-slate-200 bg-slate-50 text-[#3b71cb] hover:bg-slate-100"
                              }`}
                              title="Download Invoice PDF"
                            >
                              <Download className="w-3.5 h-3.5" />
                              PDF
                            </button>
                          </div>
                        ) : (
                          <span className={`text-[10px] italic ${isDark ? "text-slate-600" : "text-slate-400"}`}>
                            Invoice: Not Available
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Invoice Modal */}
      {selectedInvoiceId && pdfData && (
        <InvoiceModal
          pdfData={pdfData}
          onClose={() => {
            setSelectedInvoiceId(null);
            setPdfData(null);
          }}
        />
      )}
    </div>
  );
}
