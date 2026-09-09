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

  const cardBg = `rounded-[16px] border-0 ${
    isDark
      ? "bg-[#0B0F19] shadow-[0_4px_20px_rgba(0,0,0,0.3)] text-white"
      : "bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] text-[#111827]"
  }`;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center animate-pulse text-[#6B7280] dark:text-gray-400">
        Loading purchase details...
      </div>
    );
  }

  if (!purchase) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-3">
        <p className="font-bold text-base text-[#111827] dark:text-white">{error || "Purchase not found."}</p>
        <Link
          href="/partner/purchases"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#3D5EF6] hover:text-[#2E4FE0] transition-colors duration-200"
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
            className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors duration-200 mb-2 ${
              isDark ? "text-gray-400 hover:text-white" : "text-[#6B7280] hover:text-[#3D5EF6]"
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Purchase Ledger
          </Link>
          <div className="mt-1">
            <p className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
              Purchase ID
            </p>
            <h1 className="text-xs sm:text-sm md:text-base font-bold font-mono tracking-tight text-[#111827] dark:text-white mt-0.5 select-all">
              {purchase.id}
            </h1>
          </div>
        </div>

        {purchase.settlementStatus === "Pending" && (
          <Link
            href="/partner/settlements/create"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white shadow-sm transition-colors duration-200 shrink-0"
          >
            <CreditCard className="w-4 h-4" />
            Submit Settlement for this Purchase
          </Link>
        )}
      </div>

      {/* Main Details Card */}
      <div className={`p-6 md:p-8 rounded-[16px] border-0 space-y-6 ${cardBg}`}>
        {/* Status bar */}
        <div className={`flex flex-wrap items-center justify-between gap-3 pb-6 border-b ${isDark ? "border-[#1F2937]" : "border-[#E5E7EB]"}`}>
          <div>
            <p className={`text-[10px] uppercase font-bold ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>Purchase Date</p>
            <p className="text-sm font-semibold text-[#111827] dark:text-white mt-0.5">
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
              <p className={`text-[10px] uppercase font-bold ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>Settlement Status</p>
              <span
                className={`inline-block mt-0.5 text-xs font-bold uppercase px-3 py-1 rounded-full ${
                  purchase.settlementStatus === "Completed"
                    ? "bg-[#DCFCE7] text-[#16A34A] dark:bg-emerald-500/15 dark:text-emerald-400"
                    : purchase.settlementStatus === "Rejected"
                    ? "bg-[#FEE2E2] text-[#DC2626] dark:bg-red-500/15 dark:text-red-400"
                    : "bg-[#FEF3C7] text-[#B45309] dark:bg-amber-500/15 dark:text-amber-400"
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
          <div className={`p-5 rounded-[16px] border-0 ${isDark ? "bg-[#111827]" : "bg-[#FAFAFA]"}`}>
            <p className="text-xs font-bold uppercase tracking-wider text-[#3D5EF6] mb-3 flex items-center gap-1.5">
              <User className="w-4 h-4" /> Seafarer Master Candidate
            </p>
            <div className="space-y-2 text-xs">
              <p className="font-bold text-[#111827] dark:text-white text-base">{purchase.seafarerName}</p>
              <div className="flex flex-wrap gap-2 text-[11px] font-mono pt-1">
                <span className={`px-2 py-0.5 rounded-full ${isDark ? "bg-[#3D5EF6]/15 text-[#3D5EF6]" : "bg-[#EEF1FE] text-[#3D5EF6]"}`}>
                  INDoS: {purchase.indosNumber || "N/A"}
                </span>
                <span className={`px-2 py-0.5 rounded-full ${isDark ? "bg-white/5 text-gray-300" : "bg-[#F3F4F6] text-[#6B7280]"}`}>
                  Passport: {purchase.passportNumber || "N/A"}
                </span>
              </div>
              <p className={`text-[11px] pt-1 ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
                Email: {purchase.seafarerEmail} • Phone: {purchase.seafarerPhone}
              </p>
              <Link
                href={`/partner/seafarers/${purchase.seafarerId}`}
                className="inline-block pt-2 text-xs font-semibold text-[#3D5EF6] hover:text-[#2E4FE0] transition-colors duration-200 hover:underline"
              >
                View Full Seafarer Master Profile →
              </Link>
            </div>
          </div>

          {/* Course Details */}
          <div className={`p-5 rounded-[16px] border-0 ${isDark ? "bg-[#111827]" : "bg-[#FAFAFA]"}`}>
            <p className="text-xs font-bold uppercase tracking-wider text-[#3D5EF6] mb-3 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" /> Training Program
            </p>
            <div className="space-y-2 text-xs">
              <p className="font-bold text-[#111827] dark:text-white text-base">{purchase.courseName}</p>
              <p className={`text-[11px] font-mono font-bold ${isDark ? "text-[#3D5EF6]" : "text-[#3D5EF6]"}`}>Code: {purchase.courseCode || "STCW"}</p>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A] dark:bg-emerald-500/15 dark:text-emerald-400 font-semibold">
                  In-Person Training
                </span>
                <span className={isDark ? "text-gray-400" : "text-[#6B7280]"}>Classroom & Practical</span>
              </div>
              <p className={`text-[11px] pt-1 ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
                Automatic enrollment generated in DG Shipping academy register.
              </p>
            </div>
          </div>
        </div>

        {/* Financial Calculation (NO commission, only Hari Om Payable Amount) */}
        <div className={`p-6 rounded-[16px] border-0 ${isDark ? "bg-[#111827]" : "bg-[#EEF1FE]/60"}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#3D5EF6]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#3D5EF6]">
                  Configured Hari Om Payable Amount
                </span>
              </div>
              <p className="text-3xl font-extrabold text-[#111827] dark:text-white mt-1">
                ₹{Number(purchase.payableAmount).toLocaleString("en-IN")}
              </p>
              <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
                Amount payable by Partner to Hari Om for this course purchase.
              </p>
            </div>

            <div className={`text-right text-xs space-y-1 ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
              <p className="font-semibold text-[#111827] dark:text-white">No Commission Calculations</p>
              <p className="text-[11px]">Partner collected seafarer payment directly</p>
              <p className={`text-[10px] ${isDark ? "text-gray-500" : "text-[#9CA3AF]"}`}>PRD Chapter 4 & 5 Compliance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
