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
} from "lucide-react";

export default function PurchaseHistoryPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [pdfData, setPdfData] = useState<any>(null);
  const [loadingPdf, setLoadingPdf] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const data = await invoicesService.getInvoices({ status: "Paid" });
        setPurchases(data);
      } catch (err) {
        console.error("Failed to load purchase history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  const handleViewInvoice = async (invoiceId: string) => {
    setLoadingPdf(invoiceId);
    try {
      const data = await invoicesService.getInvoicePdfData(invoiceId);
      setPdfData(data);
      setSelectedInvoice(invoiceId);
    } catch (err) {
      console.error("Failed to load invoice PDF:", err);
    } finally {
      setLoadingPdf(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            <CheckCircle className="w-3 h-3" /> Paid
          </span>
        );
      case "processing":
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

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className={`h-20 rounded-2xl ${isDark ? "bg-[#0A192F]" : "bg-slate-100"}`} />
        <div className={`h-72 rounded-3xl ${isDark ? "bg-[#0A192F]" : "bg-slate-100"}`} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn relative pb-10">
      {/* Page Title Header */}
      <div className="flex flex-col gap-1">
        <span
          className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit ${
            isDark ? "bg-cyan-500/10 text-cyan-400" : "bg-blue-50 text-[#3b71cb]"
          }`}
        >
          🛒 Transaction Records
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight mt-1.5">Purchase History</h1>
        <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          View all your completed course purchases, payment statuses, and download invoices.
        </p>
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
            <h3 className="text-lg font-black tracking-tight">Purchase Ledger</h3>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
              isDark ? "bg-cyan-500/10 text-cyan-400" : "bg-blue-50 text-[#3b71cb]"
            }`}
          >
            Total: {purchases.length}
          </span>
        </div>

        {purchases.length === 0 ? (
          <div
            className={`text-center py-16 rounded-2xl border border-dashed flex flex-col items-center justify-center p-6 ${
              isDark ? "border-slate-800 bg-slate-900/10" : "border-slate-200 bg-slate-50/50"
            }`}
          >
            <CloudLightning className="w-10 h-10 text-slate-500 mb-3" />
            <h4 className="text-sm font-bold text-slate-400">No Purchases Yet</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-[300px] leading-relaxed">
              You have not made any course purchases yet. Browse available DGS courses to get
              started.
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
                  <th className="pb-3 pr-4">Invoice No.</th>
                  <th className="pb-3 pr-4">Type</th>
                  <th className="pb-3 pr-4">Purchase Date</th>
                  <th className="pb-3 pr-4">Amount Paid</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Referring Agent</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/10">
                {purchases.map((p) => (
                  <tr
                    key={p.id}
                    className={`hover:bg-slate-500/5 transition-colors ${
                      isDark ? "border-b border-slate-900/60" : "border-b border-slate-100"
                    }`}
                  >
                    <td className="py-4 pr-4 font-semibold max-w-[180px] truncate" title={p.course_name}>
                      {p.course_name || "—"}
                    </td>
                    <td
                      className={`py-4 pr-4 font-black uppercase tracking-wider text-[10px] ${
                        p.invoice_type === "HAC" ? "text-blue-400" : "text-cyan-400"
                      }`}
                    >
                      {p.invoice_number || "—"}
                    </td>
                    <td className="py-4 pr-4">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          p.invoice_type === "HAC"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                        }`}
                      >
                        {p.invoice_type || "—"}
                      </span>
                    </td>
                    <td className={`py-4 pr-4 ${isDark ? "text-slate-400" : "text-slate-550"}`}>
                      {fmtDate(p.payment_date || p.created_at)}
                    </td>
                    <td className="py-4 pr-4 font-bold">{fmt(p.final_amount)}</td>
                    <td className="py-4 pr-4">{getStatusBadge(p.status)}</td>
                    <td className="py-4 pr-4">
                      {p.invoice_type === "HAC" && p.agent_name ? (
                        <span className="flex items-center gap-1 text-[11px]">
                          <User className="w-3 h-3 text-blue-400" />
                          {p.agent_name}
                        </span>
                      ) : (
                        <span className={`text-[11px] ${isDark ? "text-slate-600" : "text-slate-300"}`}>—</span>
                      )}
                    </td>
                    <td className="py-4 text-right">
                      {p.status?.toLowerCase() === "paid" && (
                        <button
                          onClick={() => handleViewInvoice(p.id)}
                          disabled={loadingPdf === p.id}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                            isDark
                              ? "border-slate-800 bg-slate-900/40 text-gray-300 hover:bg-slate-800 hover:border-slate-700"
                              : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                          }`}
                          title="View / Download Invoice"
                        >
                          {loadingPdf === p.id ? (
                            <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Receipt className="w-3.5 h-3.5" />
                          )}
                          Invoice
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Invoice Modal */}
      {selectedInvoice && pdfData && (
        <InvoiceModal
          pdfData={pdfData}
          onClose={() => {
            setSelectedInvoice(null);
            setPdfData(null);
          }}
        />
      )}
    </div>
  );
}
