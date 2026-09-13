"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { partnerService } from "@/services/partner.service";
import { useTheme } from "@/providers/theme-provider";
import {
  ArrowLeft,
  Receipt,
  User,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Building,
  ShieldCheck,
  Lock,
} from "lucide-react";

export default function PurchaseDetailsPage() {
  const params = useParams();
  const purchaseId = params.id as string;
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [purchase, setPurchase] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const data = await partnerService.getPurchaseById(purchaseId);
        setPurchase(data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Failed to load purchase details.");
      } finally {
        setLoading(false);
      }
    }
    if (purchaseId) {
      loadData();
    }
  }, [purchaseId]);

  const cardBg = isDark
    ? "bg-[#09162c]/80 border-white/5 shadow-xl"
    : "bg-white border-slate-200/80 shadow-md";

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto animate-pulse">
        <div className="h-8 w-48 rounded-xl bg-slate-200 dark:bg-white/5" />
        <div className="h-44 rounded-3xl bg-slate-200 dark:bg-white/5" />
        <div className="h-64 rounded-3xl bg-slate-200 dark:bg-white/5" />
      </div>
    );
  }

  if (error || !purchase) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <p className="text-sm font-semibold text-rose-400">{error || "Purchase not found."}</p>
        <Link
          href="/partner/purchases"
          className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Purchases
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link
            href="/partner/purchases"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Purchase Ledger
          </Link>
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full ${
                isDark ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "bg-blue-50 text-blue-600 border border-blue-200"
              }`}
            >
              Partner Purchase Record
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1.5 font-mono">
            {purchase.id}
          </h1>
        </div>

        {purchase.settlementStatus === "Pending" && (
          <Link
            href="/partner/settlements/create"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20 transition-all shrink-0"
          >
            <CreditCard className="w-4 h-4" />
            Submit Settlement for this Purchase
          </Link>
        )}
      </div>

      {/* Main Details Card */}
      <div className={`p-6 md:p-8 rounded-3xl border space-y-6 ${cardBg}`}>
        {/* Status bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-white/5">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Purchase Date</p>
            <p className="text-sm font-semibold text-white mt-0.5">
              {new Date(purchase.purchaseDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400">Settlement Status</p>
              <span
                className={`inline-block mt-0.5 text-xs font-extrabold uppercase px-3 py-1 rounded-full ${
                  purchase.settlementStatus === "Completed"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : purchase.settlementStatus === "Submitted"
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                }`}
              >
                {purchase.settlementStatus}
              </span>
            </div>
          </div>
        </div>

        {/* 2-col Grid: Seafarer Master vs Course */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Seafarer Master Identity */}
          <div className={`p-5 rounded-2xl border ${isDark ? "bg-white/[0.02] border-white/5" : "bg-slate-50 border-slate-200"}`}>
            <p className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-1.5">
              <User className="w-4 h-4" /> Seafarer Master Candidate
            </p>
            <div className="space-y-2 text-xs">
              <p className="font-bold text-white text-base">{purchase.seafarerName}</p>
              <div className="flex flex-wrap gap-2 text-[11px] font-mono pt-1">
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300">
                  INDoS: {purchase.indosNumber || "N/A"}
                </span>
                <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300">
                  Passport: {purchase.passportNumber || "N/A"}
                </span>
              </div>
              <p className="text-slate-400 text-[11px] pt-1">
                Email: {purchase.seafarerEmail} • Phone: {purchase.seafarerPhone}
              </p>
              <Link
                href={`/partner/seafarers/${purchase.seafarerId}`}
                className="inline-block pt-2 text-xs font-semibold text-cyan-400 hover:underline"
              >
                View Full Seafarer Master Profile →
              </Link>
            </div>
          </div>

          {/* Physical Course Details */}
          <div className={`p-5 rounded-2xl border ${isDark ? "bg-white/[0.02] border-white/5" : "bg-slate-50 border-slate-200"}`}>
            <p className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" /> Physical Training Program
            </p>
            <div className="space-y-2 text-xs">
              <p className="font-bold text-white text-base">{purchase.courseName}</p>
              <p className="text-[11px] font-mono text-cyan-300">Code: {purchase.courseCode || "STCW"}</p>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  Physical Training (In-Person)
                </span>
                <span className="text-slate-400">Classroom & Practical</span>
              </div>
              <p className="text-[11px] text-slate-400 pt-1">
                Automatic enrollment generated in DG Shipping physical academy register.
              </p>
            </div>
          </div>
        </div>

        {/* Financial Calculation (NO commission, only Hari Om Payable Amount) */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-transparent border border-cyan-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                  Configured Hari Om Payable Amount
                </span>
              </div>
              <p className="text-3xl font-extrabold text-white mt-1">
                ₹{Number(purchase.payableAmount).toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Amount payable by Partner to Hari Om for this course purchase.
              </p>
            </div>

            <div className="text-right text-xs text-slate-400 space-y-1">
              <p className="font-semibold text-slate-300">No Commission Calculations</p>
              <p className="text-[11px]">Partner collected seafarer payment directly</p>
              <p className="text-[10px] text-slate-500">PRD Chapter 4 & 5 Compliance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
