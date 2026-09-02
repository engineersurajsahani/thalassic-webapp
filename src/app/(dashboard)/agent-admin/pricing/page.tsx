"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  partnerPricingService,
  CoursePricingItem,
} from "@/services/partner-pricing.service";
import {
  Tag,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Edit3,
  Send,
  X,
  Info,
  Building2,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

export default function PartnerCoursePricingPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [pricings, setPricings] = useState<CoursePricingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal State
  const [selectedCourse, setSelectedCourse] = useState<CoursePricingItem | null>(null);
  const [proposedAmount, setProposedAmount] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchPricings = async () => {
    setLoading(true);
    try {
      const data = await partnerPricingService.getCoursePricings();
      setPricings(data);
    } catch (err) {
      console.error("Failed to load course pricings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricings();
  }, []);

  const openProposeModal = (item: CoursePricingItem) => {
    setSelectedCourse(item);
    setProposedAmount(
      item.proposedPayableAmount
        ? item.proposedPayableAmount.toString()
        : item.activePayableAmount.toString()
    );
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleProposeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    const val = parseFloat(proposedAmount);
    if (isNaN(val) || val <= 0) {
      setErrorMsg("Please enter a valid positive Hari Om payable amount.");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    try {
      await partnerPricingService.submitProposedPrice(selectedCourse.id, val);
      setSuccessMsg(`Proposed price of ₹${val.toLocaleString("en-IN")} submitted for Master Admin approval.`);
      setTimeout(() => {
        setSelectedCourse(null);
        fetchPricings();
      }, 1200);
    } catch (err) {
      setErrorMsg("Failed to submit pricing change request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPricings = pricings.filter((item) => {
    const matchesSearch =
      item.courseName.toLowerCase().includes(search.toLowerCase()) ||
      item.courseCode.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());

    if (statusFilter === "all") return matchesSearch;
    if (statusFilter === "active") return matchesSearch && item.status === "Active";
    if (statusFilter === "pending") return matchesSearch && item.status === "Pending Approval";
    if (statusFilter === "rejected") return matchesSearch && item.status === "Rejected";
    return matchesSearch;
  });

  // UI Tokens
  const bgCard = isDark
    ? "bg-[#0a1122]/70 border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl"
    : "bg-white border border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl";
  const ht = isDark ? "text-white/90" : "text-slate-800";
  const mt = isDark ? "text-white/40" : "text-slate-500";
  const inputCls = isDark
    ? "bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-cyan-500"
    : "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-cyan-600";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 flex items-center justify-center text-cyan-400">
              <Tag className="w-4 h-4" />
            </div>
            <h1 className={`text-2xl font-extrabold tracking-tight ${ht}`}>
              Partner Course Pricing
            </h1>
          </div>
          <p className={`text-xs mt-1.5 ${mt}`}>
            View applicable courses and manage your proposed Hari Om payable amounts (PRD Section 4.5 & 4.6).
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
          Refresh Pricing
        </button>
      </div>



      {/* Status Summary KPI Strip (PRD Section 4.7) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`p-4 rounded-2xl ${bgCard} flex items-center justify-between`}>
          <div>
            <p className={`text-[10px] font-bold uppercase tracking-wider ${mt}`}>Active Prices</p>
            <p className={`text-2xl font-extrabold mt-1 text-emerald-400`}>
              {pricings.filter((x) => x.status === "Active").length}
            </p>
            <p className={`text-[10px] mt-0.5 ${mt}`}>Currently in effect for purchases</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className={`p-4 rounded-2xl ${bgCard} flex items-center justify-between`}>
          <div>
            <p className={`text-[10px] font-bold uppercase tracking-wider ${mt}`}>Pending Approval</p>
            <p className={`text-2xl font-extrabold mt-1 text-amber-400`}>
              {pricings.filter((x) => x.status === "Pending Approval").length}
            </p>
            <p className={`text-[10px] mt-0.5 ${mt}`}>Awaiting Master Admin review</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        <div className={`p-4 rounded-2xl ${bgCard} flex items-center justify-between`}>
          <div>
            <p className={`text-[10px] font-bold uppercase tracking-wider ${mt}`}>Rejected Proposals</p>
            <p className={`text-2xl font-extrabold mt-1 text-red-400`}>
              {pricings.filter((x) => x.status === "Rejected").length}
            </p>
            <p className={`text-[10px] mt-0.5 ${mt}`}>Active price kept unchanged</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-red-500/15 flex items-center justify-center text-red-400">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className={`p-4 rounded-2xl ${bgCard} flex flex-col sm:flex-row items-center justify-between gap-3`}>
        <div className="relative w-full sm:w-72">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${mt}`} />
          <input
            type="text"
            placeholder="Search courses by name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl outline-none border transition-all ${inputCls}`}
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All Courses" },
            { id: "active", label: "Active" },
            { id: "pending", label: "Pending Approval" },
            { id: "rejected", label: "Rejected" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20"
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

      {/* Course Cards Grid */}
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredPricings.length === 0 ? (
        <div className={`p-12 text-center rounded-3xl ${bgCard}`}>
          <Tag className={`w-10 h-10 mx-auto opacity-30 ${mt}`} />
          <p className={`text-sm font-semibold mt-3 ${ht}`}>No matching course pricing records found</p>
          <p className={`text-xs mt-1 ${mt}`}>Try resetting your search query or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPricings.map((item) => {
            const isPending = item.status === "Pending Approval";
            const isRejected = item.status === "Rejected";

            return (
              <div
                key={item.id}
                className={`p-5 rounded-3xl ${bgCard} flex flex-col justify-between transition-all duration-200 hover:-translate-y-1`}
              >
                <div>
                  {/* Top Badge & Code */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {item.courseCode}
                    </span>

                    {/* Status Badge (PRD 4.7) */}
                    {isPending ? (
                      <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/20">
                        <Clock className="w-3 h-3 animate-pulse" /> Pending Approval
                      </span>
                    ) : isRejected ? (
                      <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/20">
                        <AlertCircle className="w-3 h-3" /> Proposal Rejected
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" /> Active (In Use)
                      </span>
                    )}
                  </div>

                  {/* Course Title */}
                  <h3 className={`text-base font-extrabold leading-snug ${ht}`}>
                    {item.courseName}
                  </h3>
                  <p className={`text-[11px] mt-1 font-medium ${mt}`}>{item.category}</p>

                  {/* Pricing Details */}
                  <div className="mt-5 p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className={mt}>Public Standard Fee</span>
                      <span className="font-semibold line-through opacity-60">
                        ₹{item.standardFee.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-semibold ${ht}`}>Currently Active Payable</span>
                      <span className="text-base font-extrabold text-cyan-400">
                        ₹{item.activePayableAmount.toLocaleString("en-IN")}
                      </span>
                    </div>

                    {/* Proposed price box if pending (PRD 4.7 Distinction) */}
                    {isPending && item.proposedPayableAmount && (
                      <div className="pt-2.5 border-t border-white/10 space-y-1">
                        <div className="flex items-center justify-between text-xs text-amber-400 font-bold">
                          <span>Awaiting Master Approval:</span>
                          <span className="text-sm">
                            ₹{item.proposedPayableAmount.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <p className="text-[10px] text-amber-400/80 leading-tight">
                          Active price (₹{item.activePayableAmount.toLocaleString("en-IN")}) remains in effect until Master approves.
                        </p>
                      </div>
                    )}

                    {/* Rejection Note */}
                    {isRejected && item.rejectionReason && (
                      <div className="pt-2 border-t border-white/10 text-[11px] text-red-400 leading-tight space-y-1">
                        <p className="font-bold">Rejection Reason:</p>
                        <p className="opacity-90">{item.rejectionReason}</p>
                        <p className="text-[10px] text-slate-400 pt-0.5">
                          Active price (₹{item.activePayableAmount.toLocaleString("en-IN")}) remains in effect.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer Action */}
                <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className={`text-[10px] ${mt}`}>
                    Updated {new Date(item.lastUpdated).toLocaleDateString("en-IN")}
                  </span>

                  <button
                    onClick={() => openProposeModal(item)}
                    disabled={isPending}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isPending
                        ? "bg-amber-500/10 text-amber-400 opacity-60 cursor-not-allowed border border-amber-500/20"
                        : "bg-cyan-500 hover:bg-cyan-600 text-white shadow-md shadow-cyan-500/20 active:scale-95 cursor-pointer"
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    {isPending ? "Under Review" : isRejected ? "Re-propose Price" : "Propose Price"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Propose Price Modal */}
      {selectedCourse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          onClick={() => setSelectedCourse(null)}
        >
          <div
            className={`w-full max-w-lg rounded-3xl p-6 shadow-2xl relative ${
              isDark ? "bg-[#0b172a] border border-white/10 text-white" : "bg-white text-slate-800"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4 mb-4 border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/15 flex items-center justify-center text-cyan-400">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Propose Hari Om Payable Price</h3>
                  <p className={`text-[11px] ${mt}`}>
                    {selectedCourse.courseCode} — {selectedCourse.courseName}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCourse(null)}
                className={`p-1.5 rounded-lg ${isDark ? "hover:bg-white/10 text-white/60" : "hover:bg-slate-100 text-slate-500"}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Success / Error Alerts */}
            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {successMsg}
              </div>
            )}

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errorMsg}
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleProposeSubmit} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className={mt}>Standard Course Fee</span>
                  <span className="font-bold">₹{selectedCourse.standardFee.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={mt}>Current Active Payable Amount</span>
                  <span className="font-bold text-cyan-400">₹{selectedCourse.activePayableAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5">
                  Proposed Hari Om Payable Amount (₹) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="100"
                  value={proposedAmount}
                  onChange={(e) => setProposedAmount(e.target.value)}
                  placeholder="e.g. 11500"
                  className={`w-full px-4 py-2.5 text-sm font-semibold rounded-xl outline-none border transition-all ${inputCls}`}
                />
                <p className={`text-[10px] mt-1.5 ${mt}`}>
                  This amount represents what Hari Om is entitled to receive per seafarer booking.
                </p>
              </div>

              {/* Comparison Preview */}
              {parseFloat(proposedAmount) > 0 && (
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs flex items-center justify-between text-cyan-300">
                  <span>Price Change Comparison:</span>
                  <div className="flex items-center gap-2 font-bold">
                    <span className="line-through opacity-70">₹{selectedCourse.activePayableAmount.toLocaleString("en-IN")}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span className="text-cyan-400 text-sm">₹{parseFloat(proposedAmount).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setSelectedCourse(null)}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl ${
                    isDark ? "hover:bg-white/10 text-white/70" : "hover:bg-slate-100 text-slate-600"
                  }`}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white rounded-xl bg-cyan-500 hover:bg-cyan-600 transition-all shadow-md shadow-cyan-500/20 active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? "Submitting..." : "Submit for Approval"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
