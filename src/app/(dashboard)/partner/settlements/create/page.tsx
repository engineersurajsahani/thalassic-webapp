"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { partnerService } from "@/services/partner.service";
import { useTheme } from "@/providers/theme-provider";
import {
  CreditCard,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building,
  Receipt,
  FileCheck,
  Info,
} from "lucide-react";

export default function SubmitSettlementPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [purchases, setPurchases] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer (NEFT / RTGS)");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [remarks, setRemarks] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [createdSettlement, setCreatedSettlement] = useState<any>(null);

  useEffect(() => {
    async function loadPurchases() {
      try {
        const data = await partnerService.getPurchases();
        // Eligible purchases are those with settlementStatus === 'Pending' or not yet completed
        const eligible = (data || []).filter((p: any) => p.settlementStatus !== "Completed");
        setPurchases(eligible);
        // By default select all pending purchases
        setSelectedIds(eligible.map((p: any) => p.id));
      } catch (err) {
        console.error("Failed to load eligible purchases:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPurchases();
  }, []);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectAll = () => {
    if (selectedIds.length === purchases.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(purchases.map((p) => p.id));
    }
  };

  // Calculate settlement total based on selected purchases
  const selectedPurchases = purchases.filter((p) => selectedIds.includes(p.id));
  const totalAmount = selectedPurchases.reduce((acc, curr) => acc + Number(curr.payableAmount || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (selectedIds.length === 0) {
      setError("Please select at least one purchase to settle.");
      return;
    }
    if (!referenceNumber.trim()) {
      setError("Bank UTR / Payment reference number is required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await partnerService.submitSettlement({
        purchaseIds: selectedIds,
        referenceNumber: referenceNumber.trim(),
        paymentMethod,
        paymentDate,
        remarks,
      });
      setCreatedSettlement(res);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to submit settlement.");
    } finally {
      setSubmitting(false);
    }
  };

  const cardBg = isDark
    ? "bg-[#09162c]/80 border-white/5 shadow-xl"
    : "bg-white border-slate-200/80 shadow-md";

  if (createdSettlement) {
    return (
      <div className="max-w-2xl mx-auto py-10 animate-fadeIn">
        <div className={`p-8 rounded-3xl border text-center ${cardBg}`}>
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Settlement Submitted</h2>
          <p className={`text-xs mt-1.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Your settlement batch has been submitted with status{" "}
            <span className="font-bold text-cyan-400">"Submitted"</span>. Hari Om Finance will verify your UTR reference and finalize the completion.
          </p>

          <div className={`my-6 p-5 rounded-2xl border text-left space-y-2.5 text-xs ${isDark ? "bg-white/[0.02] border-white/5" : "bg-slate-50 border-slate-200"}`}>
            <div className="flex justify-between">
              <span className="text-slate-400">Settlement ID:</span>
              <span className="font-mono font-bold text-cyan-400">
                {createdSettlement.settlement_number || createdSettlement.settlementNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Settlement Amount:</span>
              <span className="font-extrabold text-base text-white">
                ₹{Number(createdSettlement.total_amount || createdSettlement.amount).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Bank UTR / Reference:</span>
              <span className="font-mono font-bold text-cyan-300">
                {createdSettlement.reference_number || createdSettlement.referenceNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Covered Purchases:</span>
              <span className="font-semibold text-slate-200">{selectedIds.length} Purchases</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-white/5">
              <span className="text-slate-400">Current Status:</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Submitted (Pending Finance Verification)
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`/partner/settlements/${createdSettlement.id || createdSettlement.settlementNumber}`}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-lg shadow-cyan-500/20"
            >
              View Settlement Details
            </Link>
            <Link
              href="/partner/settlements"
              className={`w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-semibold border transition-all ${
                isDark ? "bg-white/5 hover:bg-white/10 border-white/10 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              Settlement Ledger
            </Link>
            <Link
              href="/partner/financials"
              className={`w-full sm:w-auto px-4 py-3 rounded-xl text-xs font-semibold border transition-all ${
                isDark ? "bg-white/5 hover:bg-white/10 border-white/10 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              Financial Statement
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <Link
          href="/partner/settlements"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Settlement History
        </Link>
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full ${
              isDark ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "bg-blue-50 text-blue-600 border border-blue-200"
            }`}
          >
            Partner Financial Settlement
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1.5">
          Submit Settlement Batch
        </h1>
        <p className={`text-xs md:text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Select outstanding course purchases, enter your bank transfer UTR reference, and submit payment confirmation to Hari Om Finance.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center gap-3 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Select Purchases */}
        <div className={`p-6 md:p-8 rounded-3xl border space-y-4 ${cardBg}`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-white/5">
            <div>
              <h2 className="text-sm font-bold text-white">1. Select Outstanding Purchases to Settle</h2>
              <p className="text-xs text-slate-400">
                Choose the course purchases covered by this bank remittance
              </p>
            </div>
            {purchases.length > 0 && (
              <button
                type="button"
                onClick={selectAll}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300"
              >
                {selectedIds.length === purchases.length ? "Deselect All" : "Select All Purchases"}
              </button>
            )}
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400 animate-pulse">Loading eligible purchases...</div>
          ) : purchases.length === 0 ? (
            <div className="p-8 text-center border border-dashed rounded-2xl border-white/10 text-slate-400 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="font-semibold text-slate-200">No outstanding purchases requiring settlement.</p>
              <p className="mt-1">All your course purchases are up to date or already settled.</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
              {purchases.map((p) => {
                const isChecked = selectedIds.includes(p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => toggleSelect(p.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isChecked
                        ? "bg-cyan-500/10 border-cyan-500/30"
                        : isDark
                        ? "bg-white/[0.02] border-white/5 hover:bg-white/5"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-white text-xs">{p.seafarerName}</p>
                          <span className="font-mono text-[10px] text-cyan-400">({p.id})</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {p.courseName} • Enrolled {new Date(p.purchaseDate).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-white text-xs">
                        ₹{Number(p.payableAmount).toLocaleString("en-IN")}
                      </p>
                      <span className="text-[10px] font-semibold text-amber-400">
                        {p.settlementStatus}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Amount Calculation Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/15 to-blue-600/15 border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                Selected Settlement Total ({selectedIds.length} purchases)
              </p>
              <p className="text-2xl font-black text-white mt-0.5">
                ₹{totalAmount.toLocaleString("en-IN")}
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-300">
              Zero commission deductions • 100% Hari Om payable
            </span>
          </div>
        </div>

        {/* Step 2: Payment Details */}
        <div className={`p-6 md:p-8 rounded-3xl border space-y-4 ${cardBg}`}>
          <div className="pb-4 border-b border-white/5">
            <h2 className="text-sm font-bold text-white">2. Bank Payment & Transaction Reference</h2>
            <p className="text-xs text-slate-400">
              Provide bank transfer UTR or transaction ID for verification by Hari Om Finance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                Bank UTR / Transaction Reference Number *
              </label>
              <input
                type="text"
                required
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="e.g. HDFC1234567890 / RTGS987654"
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase outline-none transition-all ${
                  isDark ? "bg-white/5 border border-white/10 text-cyan-300 focus:border-cyan-500/50" : "bg-slate-50 border border-slate-200 text-blue-600 focus:border-blue-500"
                }`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                Payment Method *
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium outline-none transition-all ${
                  isDark ? "bg-white/5 border border-white/10 text-white focus:border-cyan-500/50" : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-500"
                }`}
              >
                <option value="Bank Transfer (NEFT / RTGS)">Bank Transfer (NEFT / RTGS / IMPS)</option>
                <option value="UPI Transfer">UPI / Corporate QR</option>
                <option value="Cheque / DD">Cheque / Demand Draft</option>
                <option value="Cash / Direct Branch Deposit">Direct Branch Cash Deposit</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                Payment Date *
              </label>
              <input
                type="date"
                required
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium outline-none transition-all ${
                  isDark ? "bg-white/5 border border-white/10 text-white focus:border-cyan-500/50" : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-500"
                }`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                Remarks / Payment Notes
              </label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="e.g. Settled for candidate batch of August 2026"
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium outline-none transition-all ${
                  isDark ? "bg-white/5 border border-white/10 text-white focus:border-cyan-500/50" : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-500"
                }`}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 flex items-start gap-2.5 mt-2">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <p>
              <strong>Status Lifecycle Notice:</strong> Your submission will enter status <code>Submitted</code>. Hari Om Finance team verifies transactions before updating to <code>Completed</code>. Partners cannot mark settlements Completed directly.
            </p>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/partner/settlements"
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
              isDark ? "bg-white/5 hover:bg-white/10 border-white/10 text-slate-400" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting || selectedIds.length === 0}
            className="px-6 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 flex items-center gap-2 disabled:opacity-50"
          >
            <CreditCard className="w-4 h-4" />
            {submitting ? "Submitting Settlement..." : `Submit Settlement (₹${totalAmount.toLocaleString("en-IN")})`}
          </button>
        </div>
      </form>
    </div>
  );
}
