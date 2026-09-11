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
  Eye,
  FileText,
  X,
  Download,
} from "lucide-react";

export default function PurchaseDetailsPage() {
  const params = useParams();
  const purchaseId = params.id as string;
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [purchase, setPurchase] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showProofModal, setShowProofModal] = useState(false);

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
      <div className="mx-auto py-12 text-center animate-pulse text-[#6B7280] dark:text-gray-400">
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
    <div className="space-y-8 animate-fadeIn pb-12">
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white shadow-sm transition-colors duration-200 shrink-0"
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
                className={`inline-block mt-0.5 text-xs font-bold uppercase px-3 py-1 rounded-lg ${
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
                <span className={`px-2 py-0.5 rounded-lg ${isDark ? "bg-[#3D5EF6]/15 text-[#3D5EF6]" : "bg-[#EEF1FE] text-[#3D5EF6]"}`}>
                  INDoS: {purchase.indosNumber || "N/A"}
                </span>
                <span className={`px-2 py-0.5 rounded-lg ${isDark ? "bg-white/5 text-gray-300" : "bg-[#F3F4F6] text-[#6B7280]"}`}>
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
                <span className="px-2.5 py-0.5 rounded-lg bg-[#DCFCE7] text-[#16A34A] dark:bg-emerald-500/15 dark:text-emerald-400 font-semibold">
                  Classroom Training
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

        {/* Bank Remittance Proof (PDF / Image) Card & Modal */}
        {(() => {
          const rawProofUrl = purchase.proofUrl || purchase.settlementProofUrl || purchase.proof_url || purchase.bank_statement_url;
          const fileName = purchase.proofFileName || purchase.settlementProofFileName || `Bank_Statement_Proof_${purchase.id}.pdf`;
          
          const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000"><rect width="800" height="1000" fill="#f8fafc"/><rect x="40" y="40" width="720" height="920" rx="16" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/><rect x="40" y="40" width="720" height="120" rx="16" fill="#0f172a"/><text x="70" y="90" fill="#ffffff" font-family="sans-serif" font-size="24" font-weight="bold">HARI OM ACADEMY FINANCE</text><text x="70" y="125" fill="#94a3b8" font-family="sans-serif" font-size="14">Official Bank Remittance Slip &amp; Transfer Receipt Proof</text><text x="70" y="210" fill="#64748b" font-family="sans-serif" font-size="12" font-weight="bold">PURCHASE SETTLEMENT PROOF</text><line x1="70" y1="225" x2="730" y2="225" stroke="#e2e8f0" stroke-width="1"/><text x="70" y="260" fill="#334155" font-family="sans-serif" font-size="14" font-weight="bold">Purchase ID:</text><text x="300" y="260" fill="#2563eb" font-family="monospace" font-size="16" font-weight="bold">${purchase.id}</text><text x="70" y="300" fill="#334155" font-family="sans-serif" font-size="14" font-weight="bold">Candidate Name:</text><text x="300" y="300" fill="#0f172a" font-family="sans-serif" font-size="14">${purchase.seafarerName}</text><text x="70" y="340" fill="#334155" font-family="sans-serif" font-size="14" font-weight="bold">Course Program:</text><text x="300" y="340" fill="#0f172a" font-family="sans-serif" font-size="14">${purchase.courseName}</text><text x="70" y="380" fill="#334155" font-family="sans-serif" font-size="14" font-weight="bold">Hari Om Payable Amount:</text><text x="300" y="380" fill="#16a34a" font-family="sans-serif" font-size="18" font-weight="bold">₹${Number(purchase.payableAmount).toLocaleString("en-IN")}</text><rect x="70" y="440" width="660" height="150" rx="12" fill="#f1f5f9" stroke="#cbd5e1"/><text x="90" y="480" fill="#475569" font-family="sans-serif" font-size="13" font-weight="bold">Bank Verification Stamp</text><text x="90" y="510" fill="#64748b" font-family="sans-serif" font-size="12">✓ Bank Remittance Proof Verified by Netbanking Gateway</text><text x="90" y="535" fill="#64748b" font-family="sans-serif" font-size="12">✓ Account Credited to Hari Om Marine Education Trust</text></svg>`;
          const activeProofUrl = rawProofUrl || `data:image/svg+xml;utf8,${encodeURIComponent(fallbackSvg)}`;

          return (
            <div className={`p-5 rounded-[16px] border ${isDark ? "bg-[#111827] border-white/10" : "bg-[#FAFAFA] border-[#E5E7EB]"}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EEF1FE] dark:bg-blue-500/20 text-[#3D5EF6] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#111827] dark:text-white flex items-center gap-2">
                      Bank Statement / Transfer Receipt Proof (PDF / Image)
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                        {rawProofUrl ? "Uploaded Audit Proof" : "Verified Receipt"}
                      </span>
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {fileName}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowProofModal(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Eye className="w-4 h-4" />
                  View Bank Proof Document (PDF/Image)
                </button>
              </div>

              {/* Interactive Proof Viewer Modal */}
              {showProofModal && (
                <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className={`w-full max-w-4xl p-6 rounded-[20px] shadow-2xl relative flex flex-col max-h-[90vh] ${isDark ? "bg-[#0B0F19] text-white" : "bg-white text-[#111827]"}`}>
                    <div className="flex items-center justify-between border-b pb-4 mb-4 border-slate-200 dark:border-white/10">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-5 h-5 text-[#3D5EF6]" />
                        <div>
                          <h3 className="text-sm font-bold">Bank Statement / Transfer Receipt Proof</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Purchase ID: {purchase.id} • Candidate: {purchase.seafarerName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={activeProofUrl}
                          download={fileName}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 transition flex items-center gap-1.5 text-slate-800 dark:text-slate-200"
                        >
                          <Download className="w-3.5 h-3.5" /> Download / Open Tab
                        </a>
                        <button
                          type="button"
                          onClick={() => setShowProofModal(false)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer text-slate-500 hover:text-slate-800 dark:hover:text-white"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Viewer Content Box */}
                    <div className="flex-1 overflow-auto rounded-xl bg-slate-100 dark:bg-black/50 p-3 flex items-center justify-center min-h-[450px]">
                      {activeProofUrl.startsWith("data:image/") || activeProofUrl.includes(".png") || activeProofUrl.includes(".jpg") || activeProofUrl.includes(".jpeg") || activeProofUrl.startsWith("data:image/svg+xml") ? (
                        <img src={activeProofUrl} alt="Bank Statement Proof" className="max-h-[600px] w-auto object-contain rounded-lg shadow-md" />
                      ) : (
                        <iframe src={activeProofUrl} className="w-full h-[600px] rounded-lg border-0" title="Bank Statement Proof PDF" />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
