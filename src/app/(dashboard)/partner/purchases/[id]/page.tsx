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
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted ? theme === "dark" : true;

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
    : "bg-white border-slate-200 shadow-md";
  const innerBoxBg = isDark ? "bg-white/[0.02] border-white/5" : "bg-slate-50 border-slate-200";
  const headingText = isDark ? "text-white" : "text-slate-900";
  const subText = isDark ? "text-slate-300" : "text-slate-700";
  const mutedText = isDark ? "text-slate-400" : "text-slate-600";

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
        <p className="text-sm font-semibold text-rose-500">{error || "Purchase not found."}</p>
        <Link
          href="/partner/purchases"
          className={`mt-4 inline-flex items-center gap-2 text-xs font-bold hover:underline ${
            isDark ? "text-cyan-400" : "text-blue-600"
          }`}
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
            className={`inline-flex items-center gap-1.5 text-xs font-semibold hover:text-cyan-400 transition-colors mb-2 ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Purchase Ledger
          </Link>
          <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight mt-1.5 font-mono ${headingText}`}>
            {purchase.id}
          </h1>
        </div>

        {purchase.settlementStatus === "Pending" && (
          <Link
            href="/partner/settlements/create"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20 transition-all shrink-0"
          >
            <CreditCard className="w-4 h-4" />
            Submit Settlement for this Purchase
          </Link>
        )}
      </div>

      {/* Main Details Card */}
      <div className={`p-6 md:p-8 rounded-3xl border space-y-6 ${cardBg}`}>
        {/* Status bar */}
        <div className={`flex flex-wrap items-center justify-between gap-3 pb-6 border-b ${isDark ? "border-white/5" : "border-slate-200"}`}>
          <div>
            <p className={`text-[10px] uppercase font-bold ${isDark ? "text-slate-400" : "text-slate-500"}`}>Purchase Date</p>
            <p className={`text-sm font-semibold mt-0.5 ${headingText}`}>
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
              <p className={`text-[10px] uppercase font-bold ${isDark ? "text-slate-400" : "text-slate-500"}`}>Settlement Status</p>
              <span
                className={`inline-block mt-0.5 text-xs font-extrabold uppercase px-3 py-1 rounded-full ${
                  purchase.settlementStatus === "Completed"
                    ? isDark ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : purchase.settlementStatus === "Submitted"
                    ? isDark ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-blue-100 text-blue-800 border border-blue-300"
                    : isDark ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-amber-100 text-amber-900 border border-amber-300"
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
          <div className={`p-5 rounded-2xl border ${innerBoxBg}`}>
            <p className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5 ${isDark ? "text-cyan-400" : "text-blue-700"}`}>
              <User className="w-4 h-4" /> Seafarer Master Candidate
            </p>
            <div className="space-y-2 text-xs">
              <p className={`font-extrabold text-base ${headingText}`}>{purchase.seafarerName}</p>
              <div className="flex flex-wrap gap-2 text-[11px] font-mono pt-1">
                <span className={`px-2 py-0.5 rounded font-semibold ${isDark ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20" : "bg-blue-100 text-blue-900 border border-blue-200"}`}>
                  INDoS: {purchase.indosNumber || "N/A"}
                </span>
                <span className={`px-2 py-0.5 rounded font-medium ${isDark ? "bg-white/5 text-slate-300 border border-white/10" : "bg-slate-200 text-slate-800 border border-slate-300"}`}>
                  Passport: {purchase.passportNumber || "N/A"}
                </span>
              </div>
              <p className={`text-[11px] pt-1 ${mutedText}`}>
                Email: {purchase.seafarerEmail} • Phone: {purchase.seafarerPhone}
              </p>
              <Link
                href={`/partner/seafarers/${purchase.seafarerId}`}
                className={`inline-block pt-2 text-xs font-bold hover:underline ${isDark ? "text-cyan-400" : "text-blue-700"}`}
              >
                View Full Seafarer Master Profile →
              </Link>
            </div>
          </div>

          {/* Physical Course Details */}
          <div className={`p-5 rounded-2xl border ${innerBoxBg}`}>
            <p className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5 ${isDark ? "text-cyan-400" : "text-blue-700"}`}>
              <GraduationCap className="w-4 h-4" /> Physical Training Program
            </p>
            <div className="space-y-2 text-xs">
              <p className={`font-extrabold text-base ${headingText}`}>{purchase.courseName}</p>
              <p className={`text-[11px] font-mono font-semibold ${isDark ? "text-cyan-300" : "text-blue-700"}`}>Code: {purchase.courseCode || "STCW"}</p>
              <div className="flex items-center gap-2 text-[11px]">
                <span className={`px-2 py-0.5 rounded font-bold ${isDark ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-emerald-100 text-emerald-900 border border-emerald-300"}`}>
                  Physical Training (In-Person)
                </span>
                <span className={mutedText}>Classroom & Practical</span>
              </div>
              <p className={`text-[11px] pt-1 ${mutedText}`}>
                Automatic enrollment generated in DG Shipping physical academy register.
              </p>
            </div>
          </div>
        </div>

        {/* Financial Calculation (NO commission, only Hari Om Payable Amount) */}
        <div className={`p-6 rounded-2xl border ${
          isDark 
            ? "bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-transparent border-cyan-500/20" 
            : "bg-blue-50/80 border-blue-200"
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Lock className={`w-4 h-4 ${isDark ? "text-cyan-400" : "text-blue-700"}`} />
                <span className={`text-xs font-extrabold uppercase tracking-wider ${isDark ? "text-cyan-300" : "text-blue-800"}`}>
                  Configured Hari Om Payable Amount
                </span>
              </div>
              <p className={`text-3xl font-black mt-1 ${headingText}`}>
                ₹{Number(purchase.payableAmount).toLocaleString("en-IN")}
              </p>
              <p className={`text-xs mt-1 ${mutedText}`}>
                Amount payable by Partner to Hari Om for this course purchase.
              </p>
            </div>

            <div className="text-right text-xs space-y-1">
              <p className={`font-extrabold ${isDark ? "text-slate-300" : "text-slate-800"}`}>No Commission Calculations</p>
              <p className={`text-[11px] ${mutedText}`}>Partner collected seafarer payment directly</p>
              <p className={`text-[10px] font-medium ${isDark ? "text-slate-500" : "text-slate-600"}`}>DG Shipping Remittance Compliance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
