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
    ? "bg-[#0c1629] border-0 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.4)]"
    : "bg-white border-0 shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]";
  const ht = isDark ? "text-white/90" : "text-slate-800";
  const mt = isDark ? "text-white/40" : "text-slate-500";
  const inputCls = isDark
    ? "bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-[#3D5EF6]"
    : "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-[#3D5EF6]";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#3D5EF6]/15 flex items-center justify-center text-[#3D5EF6]">
              <Tag className="w-4 h-4" />
            </div>
            <h1 className={`text-2xl font-extrabold tracking-tight ${ht}`}>
              Partner Course Pricing
            </h1>
          </div>
          <p className={`text-xs mt-1.5 ${mt}`}>
            View applicable courses and manage your proposed Hari Om payable amounts.
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className={`p-6 rounded-[16px] ${bgCard} flex items-center justify-between`}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Active Prices</p>
            <p className={`text-3xl font-black mt-2 text-emerald-500 leading-none`}>
              {pricings.filter((x) => x.status === "Active").length}
            </p>
            <p className={`text-[10px] mt-2 font-medium ${mt}`}>Currently in effect for purchases</p>
          </div>
          <div className="w-11 h-11 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className={`p-6 rounded-[16px] ${bgCard} flex items-center justify-between`}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Pending Approval</p>
            <p className={`text-3xl font-black mt-2 ${ht} leading-none`}>
              {pricings.filter((x) => x.status === "Pending Approval").length}
            </p>
            <p className={`text-[10px] mt-2 font-medium ${mt}`}>Awaiting Master Admin review</p>
          </div>
          <div className="w-11 h-11 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className={`p-6 rounded-[16px] ${bgCard} flex items-center justify-between`}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Rejected Proposals</p>
            <p className={`text-3xl font-black mt-2 text-red-500 leading-none`}>
              {pricings.filter((x) => x.status === "Rejected").length}
            </p>
            <p className={`text-[10px] mt-2 font-medium ${mt}`}>Active price kept unchanged</p>
          </div>
          <div className="w-11 h-11 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className={`p-4 rounded-lg ${bgCard} flex flex-col sm:flex-row items-center justify-between gap-3`}>
        <div className="relative w-full sm:w-72">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${mt}`} />
          <input
            type="text"
            placeholder="Search courses by name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 text-xs rounded-lg outline-none border transition-all ${inputCls}`}
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
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? "bg-[#3D5EF6] text-white shadow-md"
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
          <div className="w-8 h-8 border-4 border-[#3D5EF6] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredPricings.length === 0 ? (
        <div className={`p-12 text-center rounded-lg ${bgCard}`}>
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
                className={`p-6 rounded-[16px] ${bgCard} flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5`}
              >
                <div>
                  {/* Top Badge & Code */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#3D5EF6]/10 text-[#3D5EF6]">
                      {item.courseCode}
                    </span>

                    {/* Status Badge (PRD 4.7) */}
                    {isPending ? (
                      <span className="flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20">
                        <Clock className="w-3 h-3 text-amber-500 dark:text-amber-400" /> Pending Approval
                      </span>
                    ) : isRejected ? (
                      <span className="flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-500">
                        <AlertCircle className="w-3 h-3" /> Proposal Rejected
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
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
                  <div className="mt-5 p-4 rounded-[12px] bg-slate-50/70 dark:bg-white/[0.03] space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className={mt}>Public Standard Fee</span>
                      <span className="font-semibold line-through opacity-60">
                        ₹{item.standardFee.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-semibold ${ht}`}>Currently Active Payable</span>
                      <span className="text-base font-extrabold text-[#3D5EF6]">
                        ₹{item.activePayableAmount.toLocaleString("en-IN")}
                      </span>
                    </div>

                    {/* Proposed price box if pending (PRD 4.7 Distinction) */}
                    {isPending && item.proposedPayableAmount && (
                      <div className="pt-2.5 border-t border-slate-200/50 dark:border-white/10 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF] dark:bg-slate-500 shrink-0" />
                            <span className={`font-medium ${ht}`}>
                              Awaiting Master Approval:
                            </span>
                          </div>
                          <span className={`text-sm font-bold ${ht}`}>
                            ₹{item.proposedPayableAmount.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <p className={`text-[10px] leading-tight ${mt}`}>
                          Active price (₹{item.activePayableAmount.toLocaleString("en-IN")}) remains in effect until Master approves.
                        </p>
                      </div>
                    )}

                    {/* Rejection Note */}
                    {isRejected && item.rejectionReason && (
                      <div className="pt-2 border-t border-slate-200/50 dark:border-white/10 text-[11px] text-red-400 leading-tight space-y-1">
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
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <span className={`text-[10px] ${mt}`}>
                    Updated {new Date(item.lastUpdated).toLocaleDateString("en-IN")}
                  </span>

                  <button
                    onClick={() => openProposeModal(item)}
                    disabled={isPending}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                      isPending
                        ? "bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 opacity-80 cursor-not-allowed"
                        : "bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white shadow-md active:scale-95 cursor-pointer"
                    }`}
                  >
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
            className={`w-full max-w-lg rounded-[16px] p-7 shadow-2xl relative ${
              isDark ? "bg-[#0b172a] border border-white/10 text-white" : "bg-white text-slate-800"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4 mb-4 border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#3D5EF6]/15 flex items-center justify-center text-[#3D5EF6]">
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
                className={`p-1.5 rounded-full ${isDark ? "hover:bg-white/10 text-white/60" : "hover:bg-slate-100 text-slate-500"}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Success / Error Alerts */}
            {successMsg && (
              <div className="mb-4 p-3 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 px-4">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {successMsg}
              </div>
            )}

            {errorMsg && (
              <div className="mb-4 p-3 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2 px-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errorMsg}
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleProposeSubmit} className="space-y-4">
              <div className="p-4 rounded-[12px] bg-slate-50 dark:bg-white/5 border-0 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className={mt}>Standard Course Fee</span>
                  <span className="font-bold">₹{selectedCourse.standardFee.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={mt}>Current Active Payable Amount</span>
                  <span className="font-bold text-[#3D5EF6]">₹{selectedCourse.activePayableAmount.toLocaleString("en-IN")}</span>
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
                  className={`w-full px-4 py-2.5 text-sm font-semibold rounded-full outline-none border-0 bg-slate-100 dark:bg-white/5 transition-all ${inputCls}`}
                />
                <p className={`text-[10px] mt-1.5 ${mt}`}>
                  This amount represents what Hari Om is entitled to receive per seafarer booking.
                </p>
              </div>

              {/* Comparison Preview */}
              {parseFloat(proposedAmount) > 0 && (
                <div className="p-3 px-4 rounded-full bg-[#3D5EF6]/10 text-xs flex items-center justify-between text-[#3D5EF6]">
                  <span>Price Change Comparison:</span>
                  <div className="flex items-center gap-2 font-bold">
                    <span className="line-through opacity-70">₹{selectedCourse.activePayableAmount.toLocaleString("en-IN")}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span className="text-[#3D5EF6] text-sm">₹{parseFloat(proposedAmount).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setSelectedCourse(null)}
                  className={`px-5 py-2 text-xs font-semibold rounded-full ${
                    isDark ? "hover:bg-white/10 text-white/70" : "hover:bg-slate-100 text-slate-600"
                  }`}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 text-xs font-bold text-white rounded-full bg-[#3D5EF6] hover:bg-[#2E4FE0] transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                >
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
