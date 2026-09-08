"use client";
import toast from 'react-hot-toast';

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTheme } from "@/providers/theme-provider";
import { financeService } from "@/services/finance.service";
import {
  Search, X, FileText, Download, Send, Eye, RefreshCw,
} from "lucide-react";

const TYPES   = ["all", "HOC", "HAC"];
const STATUSES = ["all", "Paid", "Pending", "Failed"];

function InvoiceTypeBadge({ type }: { type: string }) {
  if (type === "HOC")
    return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border bg-sky-500/10 text-sky-400 border-sky-500/20">HOC</span>;
  if (type === "HAC")
    return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border bg-purple-500/10 text-purple-400 border-purple-500/20">HAC</span>;
  return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border bg-slate-500/10 text-slate-400 border-slate-500/20">{type}</span>;
}

function StatusBadge({ status }: { status: string }) {
  const s = (status || "").toLowerCase();
  if (s === "paid")    return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Paid</span>;
  if (s === "pending") return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border bg-amber-500/10 text-amber-400 border-amber-500/20">Pending</span>;
  if (s === "failed")  return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border bg-rose-500/10 text-rose-400 border-rose-500/20">Failed</span>;
  return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border bg-slate-500/10 text-slate-400 border-slate-500/20">{status}</span>;
}

function generateInvoicePdfHtml(data: any): string {
  const inv  = data.invoice  || {};
  const comp = data.company  || {};
  const terms= data.terms    || [];
  const fmt  = (n: number) => `₹${(n || 0).toLocaleString("en-IN")}`;
  const fmtD = (d: string)  => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) : "—";

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${inv.invoice_number || "Invoice"}</title>
<style>body{font-family:Arial,sans-serif;margin:0;padding:32px;color:#1e293b;background:#f8fafc;}
.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;}
.logo{font-size:20px;font-weight:700;color:#0ea5e9;}.sub{font-size:11px;color:#64748b;margin-top:2px;}
.inv-badge{background:#0ea5e9;color:#fff;padding:6px 16px;border-radius:8px;font-size:12px;font-weight:700;}
.section{margin-bottom:24px;}.label{font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px;}
.value{font-size:13px;font-weight:600;}.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
table{width:100%;border-collapse:collapse;margin-top:8px;}
th{background:#f1f5f9;font-size:10px;text-transform:uppercase;letter-spacing:.06em;padding:10px 12px;text-align:left;border-bottom:2px solid #e2e8f0;}
td{padding:10px 12px;border-bottom:1px solid #f1f5f9;font-size:12px;}
.total-row{background:#0ea5e9;color:#fff;font-weight:700;}.hr{border:none;border-top:1px solid #e2e8f0;margin:20px 0;}
.terms{font-size:10px;color:#94a3b8;}.footer{margin-top:32px;text-align:center;font-size:10px;color:#94a3b8;}
</style></head><body>
<div class="header">
  <div><div class="logo">${comp.name || "Hari Om Thalassic"}</div><div class="sub">${comp.address || ""}</div>
    <div class="sub">GSTIN: ${comp.gstin || "N/A"} | DGS: ${comp.dgsAccreditationId || "N/A"}</div>
    <div class="sub">Email: ${comp.email || ""} | Phone: ${comp.phone || ""}</div></div>
  <div style="text-align:right"><div class="inv-badge">${inv.invoice_type || "HOC"} INVOICE</div>
    <div style="font-size:18px;font-weight:700;margin-top:8px;">${inv.invoice_number || "—"}</div>
    <div class="sub">Date: ${fmtD(inv.payment_date || inv.created_at)}</div></div>
</div>
<div class="grid-2">
  <div class="section"><div class="label">Bill To</div>
    <div class="value">${inv.customer_name || "—"}</div>
    <div class="sub">${inv.customer_email || ""}</div>
    <div class="sub">${inv.customer_phone || ""}</div>
  </div>
  ${inv.agent_name ? `<div class="section"><div class="label">Referred By</div>
    <div class="value">${inv.agent_name}</div>
    <div class="sub">Code: ${inv.agent_referral_code || "—"}</div></div>` : ""}
</div>
<hr class="hr"/>
<table>
  <thead><tr><th>Description</th><th>Course Fee</th><th>Discount</th><th>Amount</th></tr></thead>
  <tbody>
    <tr><td>${inv.course_name || "Course"}</td><td>${fmt(inv.course_fee)}</td><td>${fmt(inv.discount)}</td><td>${fmt(inv.final_amount)}</td></tr>
    <tr class="total-row"><td colspan="3" style="text-align:right">Total Paid</td><td>${fmt(inv.final_amount)}</td></tr>
  </tbody>
</table>
<hr class="hr"/>
<div class="grid-2">
  <div><div class="label">Transaction ID</div><div class="value" style="font-family:monospace;">${inv.transaction_id || "—"}</div></div>
  <div><div class="label">Payment Method</div><div class="value">${inv.payment_method || "—"}</div></div>
</div>
<hr class="hr"/>
<div class="terms"><strong>Terms & Conditions</strong><br/>${terms.map((t: string) => `• ${t}`).join("<br/>")}</div>
<div class="footer">This is a computer-generated invoice. No physical signature required.</div>
</body></html>`;
}

function InvoicesContent() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") || "";

  const [invoices,  setInvoices]  = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState(urlSearch);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected,  setSelected]  = useState<any>(null);
  const [resending, setResending] = useState<string | null>(null);
  const [resendMsg, setResendMsg] = useState<string>("");

  const card    = isDark ? "bg-[#0c1a2e] border-white/5" : "bg-white border-slate-200";
  const text    = isDark ? "text-white"                   : "text-slate-800";
  const subtext = isDark ? "text-white/40"                : "text-slate-500";
  const input   = isDark ? "bg-[#0a1525] border-white/8 text-white placeholder-white/20 focus:border-sky-500/40" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-sky-400";
  const row     = isDark ? "border-white/5 hover:bg-white/3" : "border-slate-100 hover:bg-slate-50";
  const th      = isDark ? "text-white/30 border-white/5"    : "text-slate-400 border-slate-100";

  // Sync search state if URL search param changes
  useEffect(() => {
    if (urlSearch) {
      setSearch(urlSearch);
    }
  }, [urlSearch]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await financeService.getInvoices({ search: search || undefined, type: typeFilter, status: statusFilter });
      setInvoices(data);

      // If arriving with a specific search query (like an HAC invoice number from Settlements),
      // automatically open that invoice in detail view if found
      if (urlSearch && data && data.length > 0) {
        const exactMatch = data.find(
          (inv: any) =>
            inv.invoice_number?.toLowerCase() === urlSearch.toLowerCase() ||
            inv.transaction_id?.toLowerCase() === urlSearch.toLowerCase()
        );
        if (exactMatch) {
          setSelected(exactMatch);
        } else if (data.length === 1) {
          setSelected(data[0]);
        }
      }
    } catch {
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter, statusFilter, urlSearch]);

  useEffect(() => { load(); }, [load]);

  const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
  const fmt     = (n: number) => `₹${(n || 0).toLocaleString("en-IN")}`;

  const handleDownloadPdf = async (inv: any) => {
    try {
      const pdfData = await financeService.getInvoicePdf(inv.id);
      const html = generateInvoicePdfHtml(pdfData);
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${inv.invoice_number || "invoice"}.html`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Could not generate invoice PDF.");
    }
  };

  const handleResend = async (inv: any) => {
    setResending(inv.id);
    try {
      await financeService.resendInvoice(inv.id);
      setResendMsg(`Invoice ${inv.invoice_number} resent successfully.`);
      setTimeout(() => setResendMsg(""), 4000);
    } catch {
      setResendMsg("Failed to resend invoice.");
      setTimeout(() => setResendMsg(""), 4000);
    } finally {
      setResending(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-bold tracking-tight ${text}`}>Invoice Management</h1>
          <p className={`text-xs mt-0.5 ${subtext}`}>HOC & HAC invoices — centralized invoice history</p>
        </div>
        <button onClick={load} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${isDark ? "border-white/10 text-white/50 hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Resend toast */}
      {resendMsg && (
        <div className={`px-4 py-3 rounded-xl border text-xs font-medium ${isDark ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-emerald-50 border-emerald-200 text-emerald-700"}`}>
          {resendMsg}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Invoices", value: invoices.length },
          { label: "HOC Invoices",   value: invoices.filter(i => i.invoice_type === "HOC").length },
          { label: "HAC Invoices",   value: invoices.filter(i => i.invoice_type === "HAC").length },
          { label: "Paid",           value: invoices.filter(i => i.status?.toLowerCase() === "paid").length },
        ].map((s) => (
          <div key={s.label} className={`p-4 rounded-xl border ${card}`}>
            <p className={`text-[10px] font-semibold uppercase tracking-wider ${subtext}`}>{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${text}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className={`p-4 rounded-xl border ${card} flex flex-wrap gap-3`}>
        <div className="flex-1 min-w-52 relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${subtext}`} />
          <input id="invoices-search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search invoice number, customer, transaction…"
            className={`w-full pl-8 pr-3 py-2 rounded-lg text-xs border outline-none transition-all ${input}`} />
        </div>
        <select id="invoices-type-filter" value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className={`px-3 py-2 rounded-lg text-xs border outline-none ${input}`}>
          {TYPES.map(t => <option key={t} value={t}>{t === "all" ? "All Types" : t}</option>)}
        </select>
        <select id="invoices-status-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={`px-3 py-2 rounded-lg text-xs border outline-none ${input}`}>
          {STATUSES.map(s => <option key={s} value={s}>{s === "all" ? "All Statuses" : s}</option>)}
        </select>
        {(typeFilter !== "all" || statusFilter !== "all" || search) && (
          <button onClick={() => { setTypeFilter("all"); setStatusFilter("all"); setSearch(""); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-rose-400 border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 transition-all">
            <X className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className={`rounded-xl border ${card} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className={`border-b ${isDark ? "border-white/5" : "border-slate-100"}`}>
                {["Invoice #", "Type", "Date", "Customer", "Course", "Amount", "Status", "Actions"].map(h => (
                  <th key={h} className={`px-4 py-3 text-left font-semibold uppercase tracking-wider ${th}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className={`border-b ${row}`}>
                    {[...Array(8)].map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className={`h-3 rounded animate-pulse ${isDark ? "bg-white/5" : "bg-slate-100"}`} /></td>
                    ))}
                  </tr>
                ))
              ) : invoices.length === 0 ? (
                <tr><td colSpan={8} className={`px-4 py-12 text-center ${subtext}`}>
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-20" />No invoices found
                </td></tr>
              ) : invoices.map((inv) => (
                <tr key={inv.id} className={`border-b ${row} transition-colors`}>
                  <td className={`px-4 py-3 font-mono text-[11px] font-semibold ${isDark ? "text-sky-400" : "text-sky-600"}`}>{inv.invoice_number}</td>
                  <td className="px-4 py-3"><InvoiceTypeBadge type={inv.invoice_type} /></td>
                  <td className={`px-4 py-3 ${subtext}`}>{fmtDate(inv.created_at)}</td>
                  <td className={`px-4 py-3 font-medium ${text}`}>{inv.customer_name}</td>
                  <td className={`px-4 py-3 max-w-36 truncate ${subtext}`}>{inv.course_name}</td>
                  <td className={`px-4 py-3 font-semibold ${text}`}>{fmt(inv.final_amount)}</td>
                  <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button id={`view-inv-${inv.id}`} onClick={() => setSelected(inv)}
                        className={`p-1.5 rounded-lg border transition-all ${isDark ? "border-white/10 text-white/40 hover:bg-sky-500/10 hover:text-sky-400" : "border-slate-200 text-slate-400 hover:bg-sky-50 hover:text-sky-600"}`}>
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button id={`download-inv-${inv.id}`} onClick={() => handleDownloadPdf(inv)}
                        className={`p-1.5 rounded-lg border transition-all ${isDark ? "border-white/10 text-white/40 hover:bg-emerald-500/10 hover:text-emerald-400" : "border-slate-200 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600"}`}>
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button id={`resend-inv-${inv.id}`} onClick={() => handleResend(inv)} disabled={resending === inv.id}
                        className={`p-1.5 rounded-lg border transition-all ${isDark ? "border-white/10 text-white/40 hover:bg-amber-500/10 hover:text-amber-400" : "border-slate-200 text-slate-400 hover:bg-amber-50 hover:text-amber-600"} disabled:opacity-40`}>
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && invoices.length > 0 && (
          <div className={`px-4 py-2.5 border-t text-xs ${isDark ? "border-white/5 text-white/25" : "border-slate-100 text-slate-400"}`}>
            Showing {invoices.length} invoices
          </div>
        )}
      </div>

      {/* Invoice Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div onClick={e => e.stopPropagation()} className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden ${isDark ? "bg-[#0c1a2e] border-white/8" : "bg-white border-slate-200"}`}>
            <div className={`px-5 py-4 border-b flex items-center justify-between ${isDark ? "border-white/8" : "border-slate-100"}`}>
              <div>
                <h2 className={`text-sm font-bold ${text}`}>Invoice Details</h2>
                <p className={`text-[11px] font-mono mt-0.5 ${isDark ? "text-sky-400" : "text-sky-600"}`}>{selected.invoice_number}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleDownloadPdf(selected)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all cursor-pointer">
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </button>
                <button onClick={() => setSelected(null)} className={`p-1.5 rounded-lg cursor-pointer ${isDark ? "hover:bg-white/5 text-white/30" : "hover:bg-slate-100 text-slate-400"}`}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {[
                  ["Invoice Number",  selected.invoice_number],
                  ["Invoice Type",    selected.invoice_type],
                  ["Invoice Date",    fmtDate(selected.created_at)],
                  ["Payment Date",    fmtDate(selected.payment_date)],
                  ["Customer / Agent", selected.customer_name],
                  ["Description / Course", selected.course_name],
                  ["Amount",          fmt(selected.final_amount)],
                  ["Transaction / Settlement ID", selected.transaction_id],
                  ["Payment Gateway", selected.payment_gateway],
                  ["Payment Method",  selected.payment_method],
                  ["Status",          selected.status],
                ].map(([label, val]) => (
                  <div key={label}>
                    <p className={`text-[10px] ${subtext}`}>{label}</p>
                    <p className={`text-xs font-medium mt-0.5 ${text}`}>{val || "—"}</p>
                  </div>
                ))}
                {selected.agent_name && (
                  <div>
                    <p className={`text-[10px] ${subtext}`}>Agent Name</p>
                    <p className={`text-xs font-medium mt-0.5 ${text}`}>{selected.agent_name}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InvoicesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading invoices...</div>}>
      <InvoicesContent />
    </Suspense>
  );
}
