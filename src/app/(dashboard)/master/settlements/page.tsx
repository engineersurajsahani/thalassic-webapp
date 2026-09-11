"use client";

import React, { useState, useMemo } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  Banknote,
  Search,
  RefreshCw,
  X,
  ChevronDown,
  FileText,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  CreditCard,
  Building2,
  CalendarDays,
  Receipt,
  ShieldCheck,
  FileCheck2,
} from "lucide-react";
import {
  MOCK_PARTNER_SETTLEMENTS,
  MockPartnerSettlement,
} from "@/data/master-portal-mock";

// ─── Status config ──────────────────────────────────────────────────────────
const STATUS_CFG: Record<
  string,
  { label: string; pill: string; dot: string }
> = {
  Completed: {
    label: "Completed",
    pill: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25",
    dot: "bg-emerald-400",
  },
  "Partially Settled": {
    label: "Partially Settled",
    pill: "bg-amber-500/10 text-amber-400 border border-amber-500/25",
    dot: "bg-amber-400",
  },
  "Under Verification": {
    label: "Under Verification",
    pill: "bg-blue-500/10 text-blue-400 border border-blue-500/25",
    dot: "bg-blue-400",
  },
  Pending: {
    label: "Pending",
    pill: "bg-rose-500/10 text-rose-400 border border-rose-500/25",
    dot: "bg-rose-400",
  },
};

function statusCfg(s: string) {
  return STATUS_CFG[s] ?? STATUS_CFG.Pending;
}

// ─── Detail Modal ────────────────────────────────────────────────────────────
function SettlementDetailModal({
  s,
  onClose,
  dk,
}: {
  s: MockPartnerSettlement;
  onClose: () => void;
  dk: boolean;
}) {
  const cfg = statusCfg(s.settlementStatus);
  const modalBg = dk
    ? "bg-[#0c1a2e] border-white/10"
    : "bg-white border-slate-200";
  const subBg = dk ? "bg-white/[0.03] border-white/8" : "bg-slate-50 border-slate-200";
  const ht = dk ? "text-white" : "text-slate-800";
  const mt = dk ? "text-white/40" : "text-slate-400";
  const thCls = dk
    ? "bg-white/[0.04] text-white/40 border-b border-white/8"
    : "bg-slate-100 text-slate-500 border-b border-slate-200";
  const tdCls = dk ? "border-white/5" : "border-slate-100";

  const totalSettled = s.installments
    .filter((i) => i.status === "PAID")
    .reduce((a, b) => a + b.amount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border ${modalBg}`}
      >
        {/* Modal header */}
        <div className="flex items-start justify-between p-5 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 flex items-center justify-center shrink-0">
              <CreditCard className="w-4.5 h-4.5 text-indigo-400" />
            </div>
            <div>
              <p className={`text-base font-bold ${ht}`}>
                Settlement Reference: {s.id}
              </p>
              <p className={`text-xs mt-0.5 ${mt}`}>
                UTR:&nbsp;
                <span className="font-mono font-semibold">
                  {s.settlementReference}
                </span>
                {s.paymentMethod !== "—" && (
                  <>
                    &nbsp;·&nbsp;Method:&nbsp;
                    <span className="text-indigo-400 font-semibold">
                      {s.paymentMethod}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${dk ? "hover:bg-white/10 text-white/50" : "hover:bg-slate-100 text-slate-400"}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Top info row */}
          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl border ${subBg}`}>
            {[
              { label: "PARTNER AGENT", value: s.partnerName },
              {
                label: "PAYMENT DATE",
                value: s.settlementDate !== "—" ? s.settlementDate : "Pending",
              },
              { label: "TRANSFER METHOD", value: s.paymentMethod !== "—" ? s.paymentMethod : "—" },
              {
                label: "REMITTANCE MODE",
                value: s.remittanceMode,
                highlight: true,
              },
            ].map((item) => (
              <div key={item.label}>
                <p className={`text-[10px] font-semibold uppercase tracking-wider ${mt}`}>
                  {item.label}
                </p>
                <p
                  className={`text-xs font-semibold mt-0.5 ${
                    item.highlight
                      ? "text-emerald-400"
                      : ht
                  }`}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Amounts row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: "AMOUNT PAYABLE",
                value: `₹${s.totalPayable.toLocaleString("en-IN")}`,
                cls: ht,
              },
              {
                label: "AMOUNT SETTLED",
                value: `₹${s.totalReceived.toLocaleString("en-IN")}`,
                cls: "text-emerald-400",
              },
              {
                label: "PENDING AMOUNT",
                value: `₹${s.pendingAmount.toLocaleString("en-IN")}`,
                cls:
                  s.pendingAmount > 0
                    ? "text-amber-400"
                    : "text-slate-400",
              },
            ].map((item) => (
              <div
                key={item.label}
                className={`p-3.5 rounded-xl border ${subBg}`}
              >
                <p className={`text-[10px] font-semibold uppercase tracking-wider ${mt}`}>
                  {item.label}
                </p>
                <p className={`text-lg font-black mt-0.5 ${item.cls}`}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Partial Payment Breakdown */}
          {s.installments.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${dk ? "text-indigo-300" : "text-indigo-600"}`}>
                  <CreditCard className="w-3.5 h-3.5" />
                  Partial Payment Breakdown
                </p>
                <p className={`text-[11px] ${mt}`}>
                  Total Settled:{" "}
                  <span className="font-bold text-emerald-400">
                    ₹{totalSettled.toLocaleString("en-IN")}
                  </span>
                  &nbsp; Balance Due:{" "}
                  <span
                    className={`font-bold ${s.pendingAmount > 0 ? "text-amber-400" : "text-slate-400"}`}
                  >
                    ₹{s.pendingAmount.toLocaleString("en-IN")}
                  </span>
                </p>
              </div>
              <div className={`rounded-xl border overflow-hidden`}>
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className={`text-[10px] font-semibold uppercase ${thCls}`}>
                      <th className="px-4 py-2.5">Installment</th>
                      <th className="px-4 py-2.5">Payment / Due Date</th>
                      <th className="px-4 py-2.5">Amount</th>
                      <th className="px-4 py-2.5">Bank UTR</th>
                      <th className="px-4 py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${dk ? "divide-white/5" : "divide-slate-100"}`}>
                    {s.installments.map((inst, idx) => (
                      <tr key={idx}>
                        <td className={`px-4 py-3 font-semibold ${ht}`}>
                          {inst.label}
                        </td>
                        <td className={`px-4 py-3 ${mt}`}>{inst.date}</td>
                        <td className="px-4 py-3 font-bold text-emerald-400">
                          ₹{inst.amount.toLocaleString("en-IN")}
                        </td>
                        <td className={`px-4 py-3 font-mono text-[11px] ${dk ? "text-white/60" : "text-slate-600"}`}>
                          {inst.bankUtr}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              inst.status === "PAID"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            }`}
                          >
                            {inst.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Included Purchases & Course Invoices */}
          <div>
            <p className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2 ${dk ? "text-indigo-300" : "text-indigo-600"}`}>
              <Receipt className="w-3.5 h-3.5" />
              Included Purchases &amp; Course Invoices
            </p>
            <div className={`rounded-xl border overflow-hidden`}>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className={`text-[10px] font-semibold uppercase ${thCls}`}>
                    <th className="px-4 py-2.5">Invoice Number</th>
                    <th className="px-4 py-2.5">Seafarer Name</th>
                    <th className="px-4 py-2.5">Course Purchased</th>
                    <th className="px-4 py-2.5">Hari Om Payable</th>
                    <th className="px-4 py-2.5">Pending Amount</th>
                    <th className="px-4 py-2.5">Date</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${dk ? "divide-white/5" : "divide-slate-100"}`}>
                  {s.purchases.map((p, idx) => (
                    <tr key={idx}>
                      <td className={`px-4 py-3 font-mono font-semibold text-[11px] ${dk ? "text-indigo-400" : "text-indigo-600"}`}>
                        {p.invoiceNumber}
                      </td>
                      <td className={`px-4 py-3 font-semibold ${ht}`}>
                        {p.seafarerName}
                      </td>
                      <td className={`px-4 py-3 ${mt}`}>{p.courseTitle}</td>
                      <td className="px-4 py-3 font-bold text-emerald-400">
                        ₹{p.hariOmPayable.toLocaleString("en-IN")}
                      </td>
                      <td className={`px-4 py-3 font-bold ${p.pendingAmount > 0 ? "text-amber-400" : "text-slate-400"}`}>
                        ₹{p.pendingAmount.toLocaleString("en-IN")}
                      </td>
                      <td className={`px-4 py-3 text-[11px] ${mt}`}>{p.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bank Proof */}
          {s.bankProofFile && (
            <div className={`flex items-center justify-between p-3.5 rounded-xl border ${subBg}`}>
              <div className="flex items-center gap-3">
                <FileCheck2 className={`w-5 h-5 ${dk ? "text-indigo-400" : "text-indigo-500"}`} />
                <div>
                  <p className={`text-xs font-semibold ${ht}`}>
                    Bank Statement / Transfer Receipt Proof (PDF / Image)
                  </p>
                  <p className={`text-[10px] ${mt}`}>{s.bankProofFile}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ml-1 ${dk ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20" : "bg-indigo-50 text-indigo-600 border border-indigo-200"}`}>
                  Partner Uploaded Proof
                </span>
              </div>
              <button
                onClick={() => alert(`Viewing ${s.bankProofFile}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500 hover:bg-indigo-400 text-white transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                View Bank Proof Document
              </button>
            </div>
          )}

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${dk ? "border-white/10 text-white/60 hover:bg-white/5" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function MasterSettlementsPage() {
  const { theme } = useTheme();
  const dk = theme === "dark";

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [selected, setSelected] = useState<MockPartnerSettlement | null>(null);

  // Derived summary totals
  const totalPayable = MOCK_PARTNER_SETTLEMENTS.reduce(
    (a, s) => a + s.totalPayable,
    0
  );
  const totalTransferred = MOCK_PARTNER_SETTLEMENTS.reduce(
    (a, s) => a + s.totalReceived,
    0
  );
  const totalPending = MOCK_PARTNER_SETTLEMENTS.reduce(
    (a, s) => a + s.pendingAmount,
    0
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_PARTNER_SETTLEMENTS.filter((s) => {
      const matchSearch =
        s.id.toLowerCase().includes(q) ||
        s.settlementReference.toLowerCase().includes(q) ||
        s.partnerName.toLowerCase().includes(q);
      const matchStatus =
        statusFilter === "All Statuses" ||
        s.settlementStatus === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  // Theme tokens
  const pageBg  = dk ? "bg-[#031525]"       : "bg-slate-50";
  const card    = dk ? "bg-[#0c1a2e] border-white/5"  : "bg-white border-slate-200";
  const ht      = dk ? "text-white"          : "text-slate-800";
  const mt      = dk ? "text-white/40"       : "text-slate-400";
  const inputBg = dk
    ? "bg-[#0a1525] border-white/8 text-white placeholder-white/20 focus:border-indigo-500/40"
    : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-400";
  const thCls   = dk
    ? "text-white/30 border-b border-white/5 bg-white/[0.02]"
    : "text-slate-400 border-b border-slate-100 bg-slate-50";
  const rowHover = dk ? "hover:bg-white/[0.03] border-b border-white/5" : "hover:bg-slate-50 border-b border-slate-100";

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-xl font-bold ${ht}`}>Partner Settlements</h1>
          <p className={`text-sm mt-0.5 ${mt}`}>
            Monitor amounts required to be transferred to Hari Om, track settled remittances, and view pending balances.
          </p>
        </div>
        <button
          onClick={() => alert("Submit Settlement Remittance — coming soon")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-lg shadow-indigo-600/20 shrink-0"
        >
          <Banknote className="w-4 h-4" />
          + Submit Settlement Remittance
        </button>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Payable */}
        <div className={`rounded-2xl border p-5 flex items-start justify-between ${card}`}>
          <div>
            <p className={`text-[11px] font-semibold uppercase tracking-wider ${mt}`}>
              Total Amount Payable to Hari Om
            </p>
            <p className={`text-2xl font-black mt-1 ${ht}`}>
              ₹{totalPayable.toLocaleString("en-IN")}
            </p>
            <p className={`text-[11px] mt-1 ${mt}`}>
              Cumulative Hari Om payable for handled courses
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-500/15 flex items-center justify-center shrink-0">
            <Banknote className="w-4.5 h-4.5 text-indigo-400" />
          </div>
        </div>

        {/* Amount Transferred */}
        <div className={`rounded-2xl border p-5 flex items-start justify-between ${card}`}>
          <div>
            <p className={`text-[11px] font-semibold uppercase tracking-wider ${mt}`}>
              Amount Transferred / Settled
            </p>
            <p className="text-2xl font-black mt-1 text-emerald-400">
              ₹{totalTransferred.toLocaleString("en-IN")}
            </p>
            <p className={`text-[11px] mt-1 ${mt}`}>
              Verified bank remittances received by Hari Om
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
          </div>
        </div>

        {/* Outstanding Pending */}
        <div className={`rounded-2xl border p-5 flex items-start justify-between ${card}`}>
          <div>
            <p className={`text-[11px] font-semibold uppercase tracking-wider ${mt}`}>
              Outstanding Pending Balance
            </p>
            <p className="text-2xl font-black mt-1 text-amber-400">
              ₹{totalPending.toLocaleString("en-IN")}
            </p>
            <p className={`text-[11px] mt-1 ${mt}`}>
              Net outstanding amount payable to Hari Om
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0">
            <Clock className="w-4.5 h-4.5 text-amber-400" />
          </div>
        </div>
      </div>

      {/* ── Search & Filter Bar ── */}
      <div className={`rounded-2xl border p-4 flex flex-col sm:flex-row items-center gap-3 ${card}`}>
        <div className="relative flex-1 w-full">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${mt}`} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Settlement Reference, UTR, or Partner Agency..."
            className={`w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border outline-none transition-all ${inputBg}`}
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`appearance-none pl-3 pr-8 py-2.5 text-xs font-semibold rounded-xl border outline-none transition-all ${inputBg}`}
            >
              {["All Statuses", "Completed", "Partially Settled", "Under Verification", "Pending"].map(
                (st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                )
              )}
            </select>
            <ChevronDown className={`w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${mt}`} />
          </div>
          <button
            onClick={() => { setSearch(""); setStatusFilter("All Statuses"); }}
            className={`p-2.5 rounded-xl border transition-colors ${dk ? "border-white/8 text-white/40 hover:bg-white/5" : "border-slate-200 text-slate-400 hover:bg-slate-50"}`}
            title="Reset filters"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Settlements Table ── */}
      <div className={`rounded-2xl border overflow-hidden ${card}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`text-[11px] font-semibold uppercase tracking-wider ${thCls}`}>
                <th className="text-left px-5 py-3.5">Settlement Reference</th>
                <th className="text-left px-5 py-3.5">Settlement Date</th>
                <th className="text-left px-5 py-3.5">Amount Payable</th>
                <th className="text-left px-5 py-3.5">Amount Settled</th>
                <th className="text-left px-5 py-3.5">Pending Amount</th>
                <th className="text-left px-5 py-3.5">Pending Due Date</th>
                <th className="text-left px-5 py-3.5">Settlement Status</th>
                <th className="text-left px-5 py-3.5">Related Purchases</th>
                <th className="text-right px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-14 text-center">
                    <Banknote className={`w-8 h-8 mx-auto mb-2 ${mt}`} />
                    <p className={`text-sm font-semibold ${mt}`}>
                      No settlements found
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((s) => {
                  const cfg = statusCfg(s.settlementStatus);
                  return (
                    <tr key={s.id} className={`transition-colors ${rowHover}`}>
                      {/* Settlement Ref */}
                      <td className="px-5 py-4">
                        <p className={`font-bold text-[13px] font-mono ${dk ? "text-indigo-400" : "text-indigo-600"}`}>
                          {s.id}
                        </p>
                        {s.settlementReference !== "—" && (
                          <p className={`text-[10px] font-mono mt-0.5 ${mt}`}>
                            UTR: {s.settlementReference}
                          </p>
                        )}
                      </td>
                      {/* Date */}
                      <td className={`px-5 py-4 text-[12px] ${mt}`}>
                        {s.settlementDate}
                      </td>
                      {/* Amount Payable */}
                      <td className={`px-5 py-4 text-[13px] font-bold ${ht}`}>
                        ₹{s.totalPayable.toLocaleString("en-IN")}
                      </td>
                      {/* Amount Settled */}
                      <td className="px-5 py-4 text-[13px] font-bold text-emerald-400">
                        ₹{s.totalReceived.toLocaleString("en-IN")}
                      </td>
                      {/* Pending */}
                      <td className={`px-5 py-4 text-[13px] font-bold ${s.pendingAmount > 0 ? "text-amber-400" : "text-slate-500"}`}>
                        ₹{s.pendingAmount.toLocaleString("en-IN")}
                      </td>
                      {/* Due Date */}
                      <td className={`px-5 py-4 text-[12px] ${mt}`}>
                        —
                      </td>
                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full ${cfg.pill}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                      </td>
                      {/* Related Purchases */}
                      <td className="px-5 py-4">
                        <button
                          onClick={() => setSelected(s)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                            dk
                              ? "bg-white/5 border-white/10 text-indigo-400 hover:bg-white/10"
                              : "bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100"
                          }`}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          {s.relatedPurchasesCount}{" "}
                          {s.relatedPurchasesCount === 1 ? "Purchase" : "Purchases"}
                        </button>
                      </td>
                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setSelected(s)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                            dk
                              ? "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                              : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Detail Modal ── */}
      {selected && (
        <SettlementDetailModal
          s={selected}
          onClose={() => setSelected(null)}
          dk={dk}
        />
      )}
    </div>
  );
}
