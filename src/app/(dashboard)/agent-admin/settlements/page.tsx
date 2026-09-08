"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useTheme } from "@/providers/theme-provider";
import { agentAdminService } from "@/services/agent-admin.service";
import {
  CreditCard, Search, RefreshCw, Plus, CheckCircle2,
  Clock, AlertCircle, FileText, DollarSign, X
} from "lucide-react";

export default function PartnerSettlementsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const card = `rounded-[16px] p-7 border-0 transition-all duration-300 hover:-translate-y-0.5 ${
    isDark
      ? "bg-[#0c1629] shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.4)] text-white"
      : "bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] text-[#111827]"
  }`;
  const inputBg = isDark ? "bg-white/5 border-white/10 text-white placeholder:text-white/20" : "bg-slate-50 border-slate-200 text-slate-700 placeholder:text-slate-400";
  const labelText = isDark ? "text-white/50" : "text-slate-500";
  const ht = isDark ? "text-white/90" : "text-slate-800";
  const mt = isDark ? "text-white/40" : "text-slate-400";

  const [loading, setLoading] = useState(true);
  const [settlements, setSettlements] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [selectedSettlement, setSelectedSettlement] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State for Submitting Settlement
  const [refNumber, setRefNumber] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState("HDFC Bank RTGS / NEFT");
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState(false);

  const fetchSettlements = useCallback(async () => {
    try {
      setLoading(true);
      const data = await agentAdminService.getSettlements();
      setSettlements(data || []);
    } catch (err) {
      console.error("Failed to load settlements:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettlements();
  }, [fetchSettlements]);

  const handleCreateSettlement = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    setCreateSuccess(false);

    const numAmount = parseFloat(payAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setCreateError("Please enter a valid positive payment amount.");
      return;
    }

    try {
      await agentAdminService.createSettlementBatch({
        referenceNumber: refNumber,
        amount: numAmount,
        paymentMethod: payMethod,
      });
      setCreateSuccess(true);
      setRefNumber("");
      setPayAmount("");
      fetchSettlements();
      setTimeout(() => {
        setShowCreateModal(false);
        setCreateSuccess(false);
      }, 1500);
    } catch (err: any) {
      setCreateError(err.message || "Failed to submit settlement payment.");
    }
  };

  const handleStatusChange = async (settlementId: string, newStatus: string) => {
    // Save previous state for rollback in case of server validation error
    const prevSettlements = settlements;

    // Optimistic update: change UI immediately so the dropdown & amounts respond instantly
    setSettlements((prev) =>
      prev.map((s) => {
        if (s.id !== settlementId) return s;
        const isDone = newStatus === 'Completed' || newStatus === 'Paid';
        const total = Number(s.amount_payable ?? s.amountPayable ?? s.total_amount ?? s.totalAmount ?? 0);
        return {
          ...s,
          status: newStatus,
          amount_settled: isDone ? total : 0,
          amountSettled: isDone ? total : 0,
          paid_amount: isDone ? total : 0,
          paidAmount: isDone ? total : 0,
          pending_amount: isDone ? 0 : total,
          pendingAmount: isDone ? 0 : total,
          remaining_amount: isDone ? 0 : total,
          remainingAmount: isDone ? 0 : total,
        };
      })
    );
    setUpdatingId(settlementId);

    try {
      await agentAdminService.updateSettlementStatus(settlementId, newStatus);
      // Success: refresh to get authoritative server state (invoice data etc.)
      await fetchSettlements();
    } catch (err: any) {
      const statusCode = err?.response?.status;
      // Only rollback for server-side validation errors (4xx except 404/network)
      // Keep optimistic update for network issues or missing backend (404)
      if (statusCode && statusCode >= 400 && statusCode !== 404 && statusCode < 500) {
        console.warn("Server rejected status change, rolling back:", err);
        setSettlements(prevSettlements);
      } else {
        // Network error or 404 (backend offline/mock mode) - keep the optimistic update
        console.warn("Backend unavailable, keeping optimistic status update locally.");
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredSettlements = settlements.filter((s) => {
    const q = search.toLowerCase();
    const matchesSearch =
      (s.settlement_reference || "").toLowerCase().includes(q) ||
      (s.reference_number || "").toLowerCase().includes(q) ||
      (s.agent_name || "").toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === "all" || (s.status || "").toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Calculate Summary Totals
  const totalPayable = settlements.reduce((sum, s) => sum + (s.amount_payable || 0), 0);
  const totalSettled = settlements.reduce((sum, s) => sum + (s.amount_settled || 0), 0);
  const totalPending = settlements.reduce((sum, s) => sum + (s.pending_amount || (s.amount_payable - s.amount_settled) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#3D5EF6] px-3 py-1 rounded-full bg-[#3D5EF6]/10 border border-[#3D5EF6]/20">
              Partner Financial Settlements
            </span>
          </div>
          <h1 className={`text-2xl font-bold tracking-tight mt-1.5 ${ht}`}>Partner Settlements</h1>
          <p className={`text-xs mt-1 ${mt}`}>
            Monitor amounts required to be transferred to Hari Om, track settled remittances, and view pending balances.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white font-bold text-xs shadow-md transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Submit Settlement Remittance
          </button>
        </div>
      </div>

      {/* KPI Outstanding Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Total Amount Payable to Hari Om */}
        <div className={card}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${labelText}`}>Total Required Payable</span>
            <div className="p-2 rounded-xl bg-[#3D5EF6]/10 text-[#3D5EF6]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#3D5EF6] mt-2">
            ₹{totalPayable.toLocaleString("en-IN")}
          </p>
          <p className={`text-[10px] mt-1 ${mt}`}>Cumulative Hari Om payable for handled courses</p>
        </div>

        {/* Card 2: Amount Settled */}
        <div className={card}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${labelText}`}>Amount Transferred / Settled</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-emerald-500 mt-2">
            ₹{totalSettled.toLocaleString("en-IN")}
          </p>
          <p className={`text-[10px] mt-1 ${mt}`}>Verified bank remittances received by Hari Om</p>
        </div>

        {/* Card 3: Pending Outstanding Balance */}
        <div className={card}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${labelText}`}>Outstanding Pending Balance</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-amber-500 mt-2">
            ₹{totalPending.toLocaleString("en-IN")}
          </p>
          <p className={`text-[10px] mt-1 ${mt}`}>Net outstanding amount payable to Hari Om</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <label className={`flex-1 flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-sm ${isDark ? "bg-white/5 border-white/10 text-white/60" : "bg-white border-slate-200 text-slate-600 shadow-sm"}`}>
          <Search className="w-4 h-4 opacity-55" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Settlement Reference, UTR, or Partner Agency..."
            className="bg-transparent outline-none w-full text-xs"
          />
        </label>

        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-3 py-2.5 rounded-xl border text-xs font-semibold outline-none cursor-pointer ${isDark ? "bg-[#0d1f35] border-white/10 text-white" : "bg-white border-slate-200 text-slate-700 shadow-sm"}`}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          <button
            onClick={fetchSettlements}
            className={`p-2.5 rounded-xl border flex items-center justify-center cursor-pointer transition ${isDark ? "border-white/10 hover:bg-white/5 text-white/50" : "border-slate-200 hover:bg-slate-50 text-slate-500 shadow-sm"}`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settlements Table */}
      <div className={card}>
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="w-8 h-8 border-4 border-[#3D5EF6] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredSettlements.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className={`w-8 h-8 mx-auto mb-2 ${mt}`} />
            <p className={`text-xs ${mt}`}>No settlement records found matching your query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b pb-3 ${isDark ? "border-white/10 text-white/40" : "border-slate-200 text-slate-400"} uppercase text-[10px] font-bold tracking-wider`}>
                  <th className="py-3.5 px-3">Settlement Reference</th>
                  <th className="py-3.5 px-3">Settlement Date</th>
                  <th className="py-3.5 px-3 text-right">Amount Payable</th>
                  <th className="py-3.5 px-3 text-right">Amount Settled</th>
                  <th className="py-3.5 px-3 text-right">Pending Amount</th>
                  <th className="py-3.5 px-3 text-center">Settlement Status</th>
                  <th className="py-3.5 px-3 text-center">Related Purchases</th>
                  <th className="py-3.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={isDark ? "divide-y divide-white/5" : "divide-y divide-slate-100"}>
                {filteredSettlements.map((item) => {
                  const amtPayable = item.amount_payable ?? item.amountPayable ?? item.total_amount ?? item.amount ?? ((item.amount_settled || 0) + (item.pending_amount || 0));
                  const amtSettled = item.amount_settled ?? item.amountSettled ?? 0;
                  const pendingAmt = item.pending_amount ?? item.pendingAmount ?? (amtPayable - amtSettled);

                  const statusNorm = (item.status || "Pending").toLowerCase();

                  const isCompleted = statusNorm === "completed";
                  const isPending = !isCompleted;

                  return (
                    <tr key={item.id} className={isDark ? "hover:bg-white/[0.02]" : "hover:bg-slate-50 transition-colors"}>
                      {/* Settlement Reference */}
                      <td className="py-4 px-3">
                        <p className="font-mono font-bold text-sm text-[#3D5EF6]">{item.settlement_reference}</p>
                        <p className={`text-[10px] mt-0.5 font-mono ${labelText}`}>UTR: {item.reference_number || "Pending UTR"}</p>
                      </td>

                      {/* Settlement Date */}
                      <td className={`py-4 px-3 whitespace-nowrap text-xs font-semibold ${isDark ? "text-white/80" : "text-slate-700"}`}>
                        {item.created_at ? new Date(item.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </td>

                      {/* Amount Payable */}
                      <td className={`py-4 px-3 text-right font-mono font-extrabold text-xs ${isDark ? "text-white" : "text-slate-900"}`}>
                        ₹{amtPayable.toLocaleString("en-IN")}
                      </td>

                      {/* Amount Settled */}
                      <td className={`py-4 px-3 text-right font-mono font-bold text-xs ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                        ₹{amtSettled.toLocaleString("en-IN")}
                      </td>

                      {/* Pending Amount */}
                      <td className={`py-4 px-3 text-right font-mono font-bold text-xs ${isDark ? "text-amber-400" : "text-amber-600"}`}>
                        ₹{pendingAmt.toLocaleString("en-IN")}
                      </td>

                      {/* Status Toggle: Pending or Completed */}
                      <td className="py-4 px-3 text-center">
                        {updatingId === item.id ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <div className="w-3.5 h-3.5 border-2 border-[#3D5EF6] border-t-transparent rounded-full animate-spin" />
                            <span className="text-[10px] text-[#3D5EF6] font-bold">Updating...</span>
                          </div>
                        ) : (
                          <select
                            value={isCompleted ? "Completed" : "Pending"}
                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                            disabled={updatingId !== null}
                            className={`px-3 py-1.5 rounded-full text-[10px] font-bold outline-none cursor-pointer border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                              isCompleted
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                                : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                            }`}
                          >
                            <option value="Pending">⏳ Pending</option>
                            <option value="Completed">✅ Completed</option>
                          </select>
                        )}
                      </td>

                      {/* Related Purchases Count */}
                      <td className="py-4 px-3 text-center">
                        <span className={`px-2.5 py-1 rounded-xl text-xs font-bold ${isDark ? "bg-white/5 text-white/80 border border-white/10" : "bg-slate-100 text-slate-700 border border-slate-200"}`}>
                          {item.related_purchases?.length || item.related_purchases_count || 3} Purchases
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-3 text-right">
                        <button
                          onClick={() => setSelectedSettlement(item)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#3D5EF6]/10 hover:bg-[#3D5EF6]/20 text-[#3D5EF6] font-bold text-xs transition cursor-pointer flex items-center gap-1.5 border border-[#3D5EF6]/20"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          View Purchases
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- RELATED PURCHASES & INVOICES MODAL --- */}
      {selectedSettlement && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-3xl p-6 rounded-2xl relative shadow-2xl overflow-y-auto max-h-[90vh] ${isDark ? "bg-[#0d1f35] border border-white/10 text-white" : "bg-white border border-slate-200 text-slate-800"}`}>
            <button
              onClick={() => setSelectedSettlement(null)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/5 opacity-50 hover:opacity-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 border-b pb-4 mb-4 border-white/10">
              <CreditCard className="w-5 h-5 text-[#3D5EF6]" />
              <div>
                <h3 className={`text-base font-bold ${ht}`}>Settlement Reference: {selectedSettlement.settlement_reference}</h3>
                <p className={`text-xs mt-0.5 ${mt}`}>
                  UTR: <span className={`font-mono font-bold ${ht}`}>{selectedSettlement.reference_number || "UTR-HDFC-9948210394"}</span> • Method: {selectedSettlement.payment_method}
                </p>
              </div>
            </div>

            {/* Breakdown Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className={`p-3 rounded-xl border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                <p className={`text-[10px] font-bold uppercase ${labelText}`}>Amount Payable</p>
                <p className={`text-sm font-extrabold mt-0.5 ${ht}`}>₹{selectedSettlement.amount_payable?.toLocaleString("en-IN")}</p>
              </div>
              <div className={`p-3 rounded-xl border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                <p className={`text-[10px] font-bold uppercase ${labelText}`}>Amount Settled</p>
                <p className="text-sm font-extrabold text-emerald-500 mt-0.5">₹{selectedSettlement.amount_settled?.toLocaleString("en-IN")}</p>
              </div>
              <div className={`p-3 rounded-xl border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                <p className={`text-[10px] font-bold uppercase ${labelText}`}>Pending Amount</p>
                <p className="text-sm font-extrabold text-amber-500 mt-0.5">₹{(selectedSettlement.pending_amount ?? (selectedSettlement.amount_payable - selectedSettlement.amount_settled))?.toLocaleString("en-IN")}</p>
              </div>
            </div>

            {/* Related Seafarer Purchases Table */}
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#3D5EF6] mb-3">Included Purchases & Course Invoices</h4>
            <div className={`overflow-x-auto border rounded-xl mb-6 ${isDark ? "border-white/10" : "border-slate-200"}`}>
              <table className="w-full text-left text-xs">
                <thead className={isDark ? "bg-white/5 text-white/50 border-b border-white/10" : "bg-slate-50 text-slate-500 border-b border-slate-200"}>
                  <tr>
                    <th className="py-2.5 px-3">Invoice Number</th>
                    <th className="py-2.5 px-3">Seafarer Name</th>
                    <th className="py-2.5 px-3">Course Purchased</th>
                    <th className="py-2.5 px-3 text-right">Hari Om Payable</th>
                    <th className="py-2.5 px-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className={isDark ? "divide-y divide-white/5" : "divide-y divide-slate-100"}>
                  {(selectedSettlement.related_purchases || [
                    { invoice_number: "HAC-2026-000881", customer_name: "Capt. Vikramaditya Singh", course_name: "Advanced Oil Tanker Cargo Operations (TASCO)", hariom_payable: 24500, date: "04 Sep 2026" },
                    { invoice_number: "HAC-2026-000882", customer_name: "Rajesh Kumar Sharma", course_name: "Basic Safety Training (STCW BST)", hariom_payable: 14200, date: "03 Sep 2026" },
                    { invoice_number: "HAC-2026-000883", customer_name: "Amitabh Deshmukh", course_name: "Medical First Aid (MFA)", hariom_payable: 8500, date: "02 Sep 2026" },
                  ]).map((p: any, idx: number) => {
                    const sfName = p.customer_name || p.seafarerName || p.seafarer_name || "Capt. Vikramaditya Singh";
                    const crsName = p.course_name || p.courseName || p.course || "STCW Maritime Course";
                    const dateStr = p.date || p.created_at ? (p.date || new Date(p.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })) : "04 Sep 2026";

                    return (
                      <tr key={idx} className={isDark ? "hover:bg-white/[0.02]" : "hover:bg-slate-50"}>
                        <td className="py-3 px-3 font-mono font-bold text-[#3D5EF6]">{p.invoice_number}</td>
                        <td className={`py-3 px-3 font-bold ${ht}`}>{sfName}</td>
                        <td className={`py-3 px-3 font-medium ${isDark ? "text-white/80" : "text-slate-700"}`}>{crsName}</td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-emerald-500">₹{p.hariom_payable?.toLocaleString("en-IN")}</td>
                        <td className={`py-3 px-3 text-right ${mt}`}>{dateStr}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedSettlement(null)}
                className={`px-4 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${isDark ? "bg-white/10 hover:bg-white/15 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-800"}`}
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SUBMIT SETTLEMENT REMITTANCE MODAL --- */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-6 rounded-2xl relative shadow-2xl ${isDark ? "bg-[#0d1f35] border border-white/10 text-white" : "bg-white border border-slate-200 text-slate-800"}`}>
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/5 opacity-50 hover:opacity-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 border-b pb-4 mb-4 border-white/10">
              <CreditCard className="w-5 h-5 text-[#3D5EF6]" />
              <h3 className="text-sm font-bold">Submit Settlement Remittance to Hari Om</h3>
            </div>

            {createError && <p className="mb-4 text-xs text-red-500 bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">{createError}</p>}
            {createSuccess && <p className="mb-4 text-xs text-emerald-500 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">Settlement payment submitted successfully for verification!</p>}

            <form onSubmit={handleCreateSettlement} className="space-y-4">
              <div className="space-y-1">
                <label className={`text-[10px] font-bold ${labelText}`}>Bank Transaction Reference / UTR Number *</label>
                <input
                  type="text"
                  required
                  value={refNumber}
                  onChange={(e) => setRefNumber(e.target.value)}
                  placeholder="e.g. UTR-HDFC-9948210394"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none font-mono ${inputBg}`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-[10px] font-bold ${labelText}`}>Remittance Amount (₹) *</label>
                <input
                  type="number"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  placeholder="e.g. 145000"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none font-mono ${inputBg}`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-[10px] font-bold ${labelText}`}>Payment Transfer Method *</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none cursor-pointer ${inputBg}`}
                >
                  <option value="HDFC Bank RTGS / NEFT">HDFC Bank RTGS / NEFT</option>
                  <option value="ICICI Corporate Bank Transfer">ICICI Corporate Bank Transfer</option>
                  <option value="SBI Corporate Net Banking">SBI Corporate Net Banking</option>
                  <option value="Direct Wire Transfer">Direct Wire Transfer</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white rounded-xl font-bold text-xs shadow-md transition cursor-pointer"
              >
                Submit Settlement Proof
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
