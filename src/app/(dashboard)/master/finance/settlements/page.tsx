"use client";

import React, { useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  Handshake, Search, X, CheckCircle2, Clock,
  FileText, Download, ShieldCheck, ArrowUpRight,
  ChevronDown, ExternalLink,
} from "lucide-react";
import FinanceTabs from "@/components/master/FinanceTabs";
import {
  MOCK_PARTNER_SETTLEMENTS,
  MockPartnerSettlement,
} from "@/data/master-portal-mock";

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  Settled:            { label: "Settled",           cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  "Partially Settled":{ label: "Partially Settled", cls: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  Pending:            { label: "Pending",           cls: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
};

export default function PartnerSettlementsPage() {
  const { theme } = useTheme();
  const dk = theme === "dark";

  const [settlements, setSettlements] = useState<MockPartnerSettlement[]>(MOCK_PARTNER_SETTLEMENTS);
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSettlement, setSelectedSettlement] = useState<MockPartnerSettlement | null>(null);

  const card    = dk ? "bg-[#0c1a2e] border-white/5 rounded-2xl" : "bg-white border-slate-200 rounded-2xl shadow-sm";
  const ht      = dk ? "text-white" : "text-slate-800";
  const mt      = dk ? "text-white/40" : "text-slate-400";
  const inputBg = dk ? "bg-[#0a1525] border-white/8 text-white placeholder-white/20 focus:border-sky-500/40" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-sky-400";
  const rowHover= dk ? "border-white/5 hover:bg-white/3" : "border-slate-100 hover:bg-slate-50";
  const thCls   = dk ? "text-white/30 border-white/5" : "text-slate-400 border-slate-100";
  const modalBg = dk ? "bg-[#0c1a2e] border-white/10" : "bg-white border-slate-200";

  const filtered = settlements.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = s.partnerName.toLowerCase().includes(q) ||
      s.settlementReference.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || s.settlementStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-xl font-bold ${ht}`}>Partner Settlements</h1>
          <p className={`text-sm mt-0.5 ${mt}`}>
            Manage and reconcile bulk payments collected by maritime recruitment partners
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert("Exporting partner settlements ledger...")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors ${
              dk ? "border-white/10 text-white/70 hover:bg-white/5" : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Download className="w-3.5 h-3.5" /> Export Settlements
          </button>
        </div>
      </div>

      {/* PRD 2.1 Secondary Tabs */}
      <FinanceTabs />

      {/* PRD 2.4 Workflow Explanation Card */}
      <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs ${
        dk ? "bg-violet-500/10 border-violet-500/20 text-violet-300" : "bg-violet-50 border-violet-200 text-violet-800"
      }`}>
        <Handshake className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-sm">PRD §2.4 Partner Settlement Workflow & Calculations:</p>
          <p className="opacity-90">
            For Partner-based course purchases: (1) Partner collects payment from seafarer; (2) System records amount payable to Hari Om; (3) Partner transfers applicable Hari Om amount; (4) Verified receipts are credited.
            The partner's own retail selling price is <strong>not required</strong> for Hari Om financial records; settlements strictly use configured Hari Om course pricing.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className={`border ${card} p-4 flex flex-wrap items-center justify-between gap-3`}>
        <div className="relative flex-1 min-w-[260px]">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${mt}`} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Partner agency, Settlement ID, or UTR / Bank reference..."
            className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border ${inputBg}`}
          />
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`text-[11px] font-semibold uppercase ${mt}`}>Status:</span>
          {["all", "Settled", "Partially Settled", "Pending"].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl capitalize transition-colors ${
                statusFilter === st
                  ? "bg-violet-500 text-white shadow-sm"
                  : dk ? "bg-white/5 text-white/50 hover:bg-white/10" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {st === "all" ? "All Statuses" : st}
            </button>
          ))}
        </div>
      </div>

      {/* Settlements Table (PRD 2.4 required columns) */}
      <div className={`border ${card} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b text-[11px] font-semibold uppercase tracking-wider ${thCls}`}>
                <th className="text-left px-6 py-3.5">Settlement ID</th>
                <th className="text-left px-6 py-3.5">Partner Agency</th>
                <th className="text-left px-6 py-3.5">Total Amount Payable</th>
                <th className="text-left px-6 py-3.5">Total Amount Received</th>
                <th className="text-left px-6 py-3.5">Pending Amount</th>
                <th className="text-left px-6 py-3.5">Settlement Status</th>
                <th className="text-left px-6 py-3.5">Settlement Date</th>
                <th className="text-left px-6 py-3.5">UTR / Bank Reference</th>
                <th className="text-right px-6 py-3.5">Related Purchases</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(s => {
                const badge = STATUS_CONFIG[s.settlementStatus] || STATUS_CONFIG.Pending;
                return (
                  <tr key={s.id} className={`${rowHover} transition-colors border-b`}>
                    <td className={`px-6 py-4 text-[12px] font-mono font-bold ${dk ? "text-violet-400" : "text-violet-600"}`}>
                      {s.id}
                    </td>
                    <td className="px-6 py-4">
                      <p className={`font-semibold text-[13px] ${ht}`}>{s.partnerName}</p>
                      <p className={`text-[10px] font-mono ${mt}`}>ID: {s.partnerId}</p>
                    </td>
                    <td className={`px-6 py-4 text-[13px] font-bold ${ht}`}>
                      ₹{s.totalPayable.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-[13px] font-bold text-emerald-400">
                      ₹{s.totalReceived.toLocaleString()}
                    </td>
                    <td className={`px-6 py-4 text-[13px] font-bold ${s.pendingAmount > 0 ? "text-rose-400" : "text-slate-400"}`}>
                      ₹{s.pendingAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${badge.cls}`}>
                        {s.settlementStatus}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-[12px] ${mt}`}>{s.settlementDate}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[11px] font-mono ${dk ? "text-white/70" : "text-slate-600"}`}>
                        {s.settlementReference}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedSettlement(s)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                          dk ? "bg-white/5 border-white/10 text-violet-400 hover:bg-white/10" : "bg-slate-100 border-slate-200 text-violet-600 hover:bg-slate-200"
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        {s.relatedPurchasesCount} Purchases
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Related Purchases Modal (PRD 2.4) */}
      {selectedSettlement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-xl rounded-2xl shadow-2xl p-6 space-y-4 border ${modalBg}`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-base font-bold ${ht}`}>Related Purchases · {selectedSettlement.partnerName}</h2>
                <p className={`text-xs mt-0.5 ${mt}`}>Settlement Ref: {selectedSettlement.settlementReference}</p>
              </div>
              <button onClick={() => setSelectedSettlement(null)} className={mt}><X className="w-5 h-5" /></button>
            </div>

            <div className={`border rounded-xl overflow-hidden ${dk ? "border-white/5" : "border-slate-100"}`}>
              <table className="w-full text-left text-xs">
                <thead className={`text-[10px] font-semibold uppercase ${dk ? "bg-white/5 text-white/40" : "bg-slate-100 text-slate-500"}`}>
                  <tr>
                    <th className="p-3">Seafarer</th>
                    <th className="p-3">Course</th>
                    <th className="p-3">Hari Om Share</th>
                    <th className="p-3">Enrollment Date</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${dk ? "divide-white/5" : "divide-slate-100"}`}>
                  {selectedSettlement.purchases.map((p, idx) => (
                    <tr key={idx}>
                      <td className={`p-3 font-semibold ${ht}`}>{p.seafarerName}</td>
                      <td className={`p-3 ${ht}`}>{p.courseTitle}</td>
                      <td className="p-3 font-bold text-emerald-400">₹{p.hariOmPayable.toLocaleString()}</td>
                      <td className={`p-3 ${mt}`}>{p.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className={`text-xs ${mt}`}>Total: {selectedSettlement.relatedPurchasesCount} verified course transactions</span>
              <button
                onClick={() => setSelectedSettlement(null)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-xl ${dk ? "bg-white/10 text-white" : "bg-slate-200 text-slate-700"}`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
