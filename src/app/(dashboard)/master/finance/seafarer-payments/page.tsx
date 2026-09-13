"use client";

import React, { useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  UserCheck, Search, Download, CheckCircle2,
  Clock, XCircle, FileText, ExternalLink, Filter,
  Building2, Handshake, Globe, X,
} from "lucide-react";
import FinanceTabs from "@/components/master/FinanceTabs";
import {
  MOCK_SEAFARERS,
  MockSeafarer,
  MockSeafarerPurchase,
} from "@/data/master-portal-mock";

interface FlattenedSeafarerPurchase extends MockSeafarerPurchase {
  seafarerId: string;
  seafarerName: string;
  indosNumber: string;
  rank: string;
  sourceType: string;
}

export default function SeafarerPaymentsPage() {
  const { theme } = useTheme();
  const dk = theme === "dark";

  // Flatten purchases from each physical seafarer master record
  const allPurchases: FlattenedSeafarerPurchase[] = MOCK_SEAFARERS.flatMap(sf =>
    sf.purchases.map(p => ({
      ...p,
      seafarerId: sf.id,
      seafarerName: sf.name,
      indosNumber: sf.indosNumber,
      rank: sf.rank,
      sourceType: sf.sourceType,
    }))
  );

  const [purchasesList, setPurchasesList] = useState<FlattenedSeafarerPurchase[]>(allPurchases);
  const [search, setSearch]               = useState("");
  const [typeFilter, setTypeFilter]       = useState("all");
  const [statusFilter, setStatusFilter]   = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<FlattenedSeafarerPurchase | null>(null);

  const card    = dk ? "bg-[#0c1a2e] border-white/5 rounded-2xl" : "bg-white border-slate-200 rounded-2xl shadow-sm";
  const ht      = dk ? "text-white" : "text-slate-800";
  const mt      = dk ? "text-white/40" : "text-slate-400";
  const inputBg = dk ? "bg-[#0a1525] border-white/8 text-white placeholder-white/20 focus:border-sky-500/40" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-sky-400";
  const rowHover= dk ? "border-white/5 hover:bg-white/3" : "border-slate-100 hover:bg-slate-50";
  const thCls   = dk ? "text-white/30 border-white/5" : "text-slate-400 border-slate-100";
  const modalBg = dk ? "bg-[#0c1a2e] border-white/10" : "bg-white border-slate-200";

  const filtered = purchasesList.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = p.seafarerName.toLowerCase().includes(q) ||
      p.indosNumber.toLowerCase().includes(q) ||
      p.courseTitle.toLowerCase().includes(q) ||
      p.instituteName.toLowerCase().includes(q) ||
      p.invoiceNumber.toLowerCase().includes(q);
    const matchType   = typeFilter === "all" || p.purchaseType === typeFilter;
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-xl font-bold ${ht}`}>Seafarer Payments</h1>
          <p className={`text-sm mt-0.5 ${mt}`}>
            Granular payment ledger at the seafarer level across multiple purchases and course institutes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert("Exporting seafarer payment records...")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors ${
              dk ? "border-white/10 text-white/70 hover:bg-white/5" : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Download className="w-3.5 h-3.5" /> Export Seafarer Ledger
          </button>
        </div>
      </div>

      {/* PRD 2.1 Navigation Tabs */}
      <FinanceTabs />

      {/* PRD 2.6 Master Record Rule Note */}
      <div className={`p-4 rounded-xl border flex items-center justify-between text-xs ${
        dk ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" : "bg-emerald-50 border-emerald-200 text-emerald-800"
      }`}>
        <div className="flex items-center gap-2.5">
          <UserCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>
            <strong>Single Master Record Preservation (PRD §2.6):</strong> A Seafarer may have multiple purchases across different partners and institutes. Each transaction retains its own financial audit trail without duplicating the seafarer's master identity.
          </span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className={`border ${card} p-4 flex flex-wrap items-center justify-between gap-3`}>
        <div className="relative flex-1 min-w-[260px]">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${mt}`} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Seafarer name, INDOS, Course, Institute, or Invoice #..."
            className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border ${inputBg}`}
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`text-[11px] font-semibold uppercase ${mt}`}>Type:</span>
          {["all", "Direct", "Partner"].map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl capitalize transition-colors ${
                typeFilter === t
                  ? "bg-emerald-500 text-white shadow-sm"
                  : dk ? "bg-white/5 text-white/50 hover:bg-white/10" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {t === "all" ? "All Sources" : t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`text-[11px] font-semibold uppercase ${mt}`}>Status:</span>
          {["all", "Completed", "Pending"].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl capitalize transition-colors ${
                statusFilter === s
                  ? "bg-emerald-500 text-white shadow-sm"
                  : dk ? "bg-white/5 text-white/50 hover:bg-white/10" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Seafarer-wise Payment Information Table (PRD 2.6 required fields) */}
      <div className={`border ${card} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b text-[11px] font-semibold uppercase tracking-wider ${thCls}`}>
                <th className="text-left px-6 py-3.5">Seafarer (PRD §2.6)</th>
                <th className="text-left px-6 py-3.5">Course</th>
                <th className="text-left px-6 py-3.5">Institute</th>
                <th className="text-left px-6 py-3.5">Purchase Type</th>
                <th className="text-left px-6 py-3.5">Partner</th>
                <th className="text-left px-6 py-3.5">Amount Payable</th>
                <th className="text-left px-6 py-3.5">Amount Received</th>
                <th className="text-left px-6 py-3.5">Pending Amount</th>
                <th className="text-left px-6 py-3.5">Payment Status</th>
                <th className="text-left px-6 py-3.5">Payment Date</th>
                <th className="text-right px-6 py-3.5">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((p, idx) => (
                <tr key={`${p.id}-${idx}`} className={`${rowHover} transition-colors border-b`}>
                  <td className="px-6 py-4">
                    <p className={`font-semibold text-[13px] ${ht}`}>{p.seafarerName}</p>
                    <p className={`text-[10px] font-mono ${mt}`}>INDOS: {p.indosNumber} · {p.rank}</p>
                  </td>
                  <td className={`px-6 py-4 text-[12px] font-medium ${ht}`}>{p.courseTitle}</td>
                  <td className={`px-6 py-4 text-[12px] ${mt}`}>{p.instituteName}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      p.purchaseType === "Partner"
                        ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
                        : "bg-sky-500/10 text-sky-400 border-sky-500/20"
                    }`}>
                      {p.purchaseType}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-[12px] ${mt}`}>{p.partnerName || "—"}</td>
                  <td className={`px-6 py-4 text-[13px] font-bold ${ht}`}>₹{p.amountPayableToHariom.toLocaleString()}</td>
                  <td className={`px-6 py-4 text-[13px] font-bold ${p.amountReceived === p.amountPayableToHariom ? "text-emerald-400" : "text-amber-400"}`}>
                    ₹{p.amountReceived.toLocaleString()}
                  </td>
                  <td className={`px-6 py-4 text-[13px] font-bold ${p.pendingAmount > 0 ? "text-rose-400" : "text-slate-400"}`}>
                    ₹{p.pendingAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      p.status === "Completed"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-[12px] ${mt}`}>{p.paymentDate}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedInvoice(p)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-semibold rounded-lg border transition-colors ${
                        dk ? "bg-white/5 border-white/10 text-emerald-400 hover:bg-white/10" : "bg-slate-100 border-slate-200 text-emerald-600 hover:bg-slate-200"
                      }`}
                    >
                      <FileText className="w-3 h-3" />
                      {p.invoiceNumber}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={`px-6 py-3.5 border-t ${dk ? "border-white/5" : "border-slate-100"} flex items-center justify-between text-xs ${mt}`}>
          <span>Showing {filtered.length} seafarer payment records</span>
          <span>Compliant with PRD §2.6 (Seafarer-level Payment Tracking)</span>
        </div>
      </div>

      {/* Invoice Viewer Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4 border ${modalBg}`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-base font-bold ${ht}`}>Invoice {selectedInvoice.invoiceNumber}</h2>
                <p className={`text-xs ${mt}`}>{selectedInvoice.seafarerName} ({selectedInvoice.indosNumber})</p>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className={mt}><X className="w-5 h-5" /></button>
            </div>

            <div className={`p-4 rounded-xl border space-y-2.5 text-xs ${dk ? "bg-white/3 border-white/5" : "bg-slate-50 border-slate-100"}`}>
              <div className="flex justify-between">
                <span className={mt}>Course Enrolled</span>
                <span className={`font-semibold ${ht}`}>{selectedInvoice.courseTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className={mt}>Training Institute</span>
                <span>{selectedInvoice.instituteName}</span>
              </div>
              <div className="flex justify-between">
                <span className={mt}>Purchase Source</span>
                <span className="font-semibold">{selectedInvoice.purchaseType} {selectedInvoice.partnerName ? `(${selectedInvoice.partnerName})` : ""}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/5">
                <span className={mt}>Amount Payable to Hari Om</span>
                <span className="font-bold text-sm">₹{selectedInvoice.amountPayableToHariom.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className={mt}>Amount Received</span>
                <span className="font-bold text-sm text-emerald-400">₹{selectedInvoice.amountReceived.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => alert(`Downloading PDF invoice ${selectedInvoice.invoiceNumber}...`)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download Invoice PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
