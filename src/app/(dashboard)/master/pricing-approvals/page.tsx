"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  partnerPricingService,
  CoursePricingItem,
} from "@/services/partner-pricing.service";
import {
  CheckSquare,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  Building2,
  Tag,
  AlertCircle,
  X,
} from "lucide-react";

export default function MasterPricingApprovalsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [pricings, setPricings] = useState<CoursePricingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "active" | "rejected">("pending");

  // Rejection Modal state
  const [rejectCourse, setRejectCourse] = useState<CoursePricingItem | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchPricings = async () => {
    setLoading(true);
    try {
      const data = await partnerPricingService.getCoursePricings();
      setPricings(data);
    } catch (err) {
      console.error("Failed to load pricings for master approval:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricings();
  }, []);

  const handleApprove = async (item: CoursePricingItem) => {
    setProcessingId(item.id);
    try {
      await partnerPricingService.approveProposedPrice(item.id);
      setToastMsg({
        type: "success",
        text: `Approved new Hari Om payable price of ₹${item.proposedPayableAmount?.toLocaleString("en-IN")} for ${item.courseCode}.`,
      });
      await fetchPricings();
    } catch (err) {
      setToastMsg({ type: "error", text: "Failed to approve price change request." });
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectCourse) return;

    setProcessingId(rejectCourse.id);
    try {
      await partnerPricingService.rejectProposedPrice(rejectCourse.id, rejectReason);
      setToastMsg({
        type: "success",
        text: `Rejected price proposal for ${rejectCourse.courseCode}. Active price remains unchanged.`,
      });
      setRejectCourse(null);
      setRejectReason("");
      await fetchPricings();
    } catch (err) {
      setToastMsg({ type: "error", text: "Failed to reject price change request." });
    } finally {
      setProcessingId(null);
    }
  };

  const filteredPricings = pricings.filter((item) => {
    const matchesSearch =
      item.courseName.toLowerCase().includes(search.toLowerCase()) ||
      item.courseCode.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());

    if (filter === "pending") return matchesSearch && item.status === "Pending Approval";
    if (filter === "active") return matchesSearch && item.status === "Active";
    if (filter === "rejected") return matchesSearch && item.status === "Rejected";
    return matchesSearch;
  });

  const pendingCount = pricings.filter((x) => x.status === "Pending Approval").length;

  // UI Tokens
  const bgCard = isDark
    ? "bg-[#0d1f35] border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl"
    : "bg-white border border-slate-200/80 shadow-sm backdrop-blur-xl";
  const ht = isDark ? "text-white/80" : "text-slate-800";
  const mt = isDark ? "text-white/35" : "text-slate-400";
  const dv = isDark ? "divide-white/5" : "divide-slate-100";
  const inputCls = isDark
    ? "bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-sky-500"
    : "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-sky-600";

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between transition-all ${
            toastMsg.type === "success"
              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
              : "bg-red-500/15 border-red-500/30 text-red-400"
          }`}
        >
          <div className="flex items-center gap-2">
            {toastMsg.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{toastMsg.text}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/15 flex items-center justify-center text-sky-400">
              <CheckSquare className="w-4 h-4" />
            </div>
            <h1 className={`text-2xl font-bold tracking-tight ${ht}`}>
              Partner Pricing Approvals
            </h1>
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-500 text-slate-950 animate-bounce">
                {pendingCount} Pending
              </span>
            )}
          </div>
          <p className={`text-xs mt-1.5 ${mt}`}>
            Review, approve, or reject proposed Hari Om payable price changes from Partner Admins (PRD Section 4.6).
          </p>
        </div>

        <button
          onClick={fetchPricings}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
            isDark
              ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/80"
              : "bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700"
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Filter Strip */}
      <div className={`p-4 rounded-2xl ${bgCard} flex flex-col sm:flex-row items-center justify-between gap-3`}>
        <div className="relative w-full sm:w-72">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${mt}`} />
          <input
            type="text"
            placeholder="Search course name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl outline-none border transition-all ${inputCls}`}
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {[
            { id: "pending", label: `Pending Review (${pendingCount})` },
            { id: "all", label: "All Pricings" },
            { id: "active", label: "Active" },
            { id: "rejected", label: "Rejected" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filter === tab.id
                  ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
                  : isDark
                  ? "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pricing Requests Table / Cards */}
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredPricings.length === 0 ? (
        <div className={`p-12 text-center rounded-3xl ${bgCard}`}>
          <CheckSquare className={`w-10 h-10 mx-auto opacity-30 ${mt}`} />
          <p className={`text-sm font-semibold mt-3 ${ht}`}>
            No pricing requests match current filter ({filter})
          </p>
          <p className={`text-xs mt-1 ${mt}`}>Select another tab or reset search query.</p>
        </div>
      ) : (
        <div className={`rounded-3xl ${bgCard} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-[10px] font-bold uppercase tracking-wider ${isDark ? "border-white/8 text-white/40" : "border-slate-100 text-slate-400"}`}>
                  <th className="p-4 pl-6">Course & Category</th>
                  <th className="p-4">Standard Fee</th>
                  <th className="p-4">Active Payable</th>
                  <th className="p-4">Proposed Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${dv} text-xs`}>
                {filteredPricings.map((item) => {
                  const isPending = item.status === "Pending Approval";
                  const isRejected = item.status === "Rejected";

                  return (
                    <tr key={item.id} className={isDark ? "hover:bg-white/[0.02]" : "hover:bg-slate-50"}>
                      {/* Course */}
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-1 rounded text-[10px] font-mono font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                            {item.courseCode}
                          </span>
                          <div>
                            <p className={`font-bold ${ht}`}>{item.courseName}</p>
                            <p className={`text-[10px] ${mt}`}>{item.category}</p>
                          </div>
                        </div>
                      </td>

                      {/* Standard Fee */}
                      <td className="p-4">
                        <span className="font-semibold line-through opacity-60">
                          ₹{item.standardFee.toLocaleString("en-IN")}
                        </span>
                      </td>

                      {/* Active Payable */}
                      <td className="p-4">
                        <span className="font-extrabold text-cyan-400 text-sm">
                          ₹{item.activePayableAmount.toLocaleString("en-IN")}
                        </span>
                      </td>

                      {/* Proposed Price */}
                      <td className="p-4">
                        {isPending && item.proposedPayableAmount ? (
                          <div className="flex items-center gap-1.5 text-amber-400 font-extrabold text-sm">
                            <span>₹{item.proposedPayableAmount.toLocaleString("en-IN")}</span>
                            <ArrowRight className="w-3.5 h-3.5 opacity-70" />
                          </div>
                        ) : (
                          <span className={`text-[11px] ${mt}`}>—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        {isPending ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/20 inline-flex items-center gap-1">
                            <Clock className="w-3 h-3 animate-pulse" /> Pending Approval
                          </span>
                        ) : isRejected ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/20 inline-flex items-center gap-1">
                            <XCircle className="w-3 h-3" /> Rejected
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 pr-6 text-right">
                        {isPending ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApprove(item)}
                              disabled={processingId === item.id}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[11px] shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Approve
                            </button>

                            <button
                              onClick={() => {
                                setRejectCourse(item);
                                setRejectReason("");
                              }}
                              disabled={processingId === item.id}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500 text-red-400 hover:text-white font-bold text-[11px] border border-red-500/30 transition-all cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className={`text-[11px] ${mt}`}>No pending action</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectCourse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          onClick={() => setRejectCourse(null)}
        >
          <div
            className={`w-full max-w-md rounded-3xl p-6 shadow-2xl relative ${
              isDark ? "bg-[#0c1a2e] border border-white/10 text-white" : "bg-white text-slate-800"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-4 mb-4 border-white/10">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-400" />
                <h3 className="text-base font-bold">Reject Price Proposal</h3>
              </div>
              <button onClick={() => setRejectCourse(null)} className="hover:opacity-70">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-1">
                <p className="font-bold">{rejectCourse.courseCode} — {rejectCourse.courseName}</p>
                <p className={mt}>
                  Proposed Hari Om Payable: <strong className="text-amber-400">₹{rejectCourse.proposedPayableAmount?.toLocaleString("en-IN")}</strong>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5">
                  Rejection Reason (Optional)
                </label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Proposed payable amount below standard threshold..."
                  className={`w-full p-3 text-xs rounded-xl outline-none border transition-all ${inputCls}`}
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setRejectCourse(null)}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl ${
                    isDark ? "hover:bg-white/10 text-white/70" : "hover:bg-slate-100 text-slate-600"
                  }`}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={processingId === rejectCourse.id}
                  className="px-5 py-2 text-xs font-bold text-white rounded-xl bg-red-500 hover:bg-red-600 transition-all shadow-md shadow-red-500/20 cursor-pointer"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
