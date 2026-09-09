"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { partnerService } from "@/services/partner.service";
import { useTheme } from "@/providers/theme-provider";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Globe,
  MapPin,
  FileText,
  ShoppingCart,
  GraduationCap,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building,
} from "lucide-react";

export default function SeafarerProfilePage() {
  const params = useParams();
  const seafarerId = params.id as string;
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [seafarer, setSeafarer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const data = await partnerService.getSeafarerById(seafarerId);
        setSeafarer(data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Failed to load seafarer profile.");
      } finally {
        setLoading(false);
      }
    }
    if (seafarerId) {
      loadData();
    }
  }, [seafarerId]);

  const cardBg = isDark
    ? "bg-[#111827] rounded-[16px] border-0 card-elevated"
    : "bg-[#FFFFFF] rounded-[16px] border-0 card-elevated";

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto animate-pulse">
        <div className="h-8 w-48 rounded-full bg-slate-200 dark:bg-white/5" />
        <div className="h-44 rounded-[16px] bg-slate-200 dark:bg-white/5" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 rounded-[16px] bg-slate-200 dark:bg-white/5" />
          <div className="h-64 rounded-[16px] bg-slate-200 dark:bg-white/5" />
        </div>
      </div>
    );
  }

  if (error || !seafarer) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <p className="text-sm font-semibold text-rose-400">{error || "Seafarer not found."}</p>
        <Link
          href="/partner/seafarers"
          className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#3D5EF6] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Seafarer Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-8 animate-fadeIn pb-12">
      {/* Back button & Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link
            href="/partner/seafarers"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] hover:text-[#3D5EF6] transition-colors duration-200 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Seafarer Directory
          </Link>
          <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight mt-1.5 ${isDark ? "text-white" : "text-[#111827]"}`}>
            {seafarer.name}
          </h1>
        </div>

        <Link
          href={`/partner/purchases/create?seafarerId=${seafarer.id}`}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white shadow-sm transition-colors duration-200 shrink-0"
        >
          <ShoppingCart className="w-4 h-4" />
          Enroll in Course
        </Link>
      </div>

      {/* Identity Overview Banner */}
      <div className={`p-6 ${cardBg}`}>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-[#3D5EF6] text-white flex items-center justify-center text-xl font-black uppercase shrink-0 shadow-sm">
            {seafarer.name ? seafarer.name.split(" ").map((n: any) => n[0]).join("") : "SM"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className={`text-lg font-bold ${isDark ? "text-white" : "text-[#111827]"}`}>{seafarer.name}</h2>
              <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${isDark ? "bg-white/5 text-slate-300 border-white/10" : "bg-[#FAFAFA] text-[#6B7280] border-[#E5E7EB]"}`}>
                Master ID: {seafarer.id}
              </span>
            </div>

            {/* Maritime Identity Badges */}
            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-3 border-t text-xs ${isDark ? "border-white/5" : "border-[#E5E7EB]"}`}>
              <div>
                <p className={`text-[10px] ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}>INDoS Number</p>
                <p className="font-mono font-bold text-[#3D5EF6] mt-0.5">{seafarer.indosNum || "N/A"}</p>
              </div>
              <div>
                <p className={`text-[10px] ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}>Passport Number</p>
                <p className={`font-mono font-bold mt-0.5 ${isDark ? "text-white" : "text-[#111827]"}`}>{seafarer.passportNum || "N/A"}</p>
              </div>
              <div>
                <p className={`text-[10px] ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}>CDC Number</p>
                <p className={`font-mono font-bold mt-0.5 ${isDark ? "text-white" : "text-[#111827]"}`}>{seafarer.cdcNum || "N/A"}</p>
              </div>
              <div>
                <p className={`text-[10px] ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}>Nationality</p>
                <p className={`font-bold mt-0.5 ${isDark ? "text-white" : "text-[#111827]"}`}>{seafarer.nationality || "Indian"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Contact & Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className={`p-6 ${cardBg}`}>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#3D5EF6] mb-4 flex items-center gap-2">
            <Mail className="w-3.5 h-3.5" /> Contact Information
          </h3>
          <div className="space-y-3 text-xs">
            <div className={`flex justify-between py-2 border-b ${isDark ? "border-white/5" : "border-[#E5E7EB]"}`}>
              <span className={isDark ? "text-slate-400" : "text-[#6B7280]"}>Email Address</span>
              <span className={`font-semibold ${isDark ? "text-slate-200" : "text-[#111827]"}`}>{seafarer.email}</span>
            </div>
            <div className={`flex justify-between py-2 border-b ${isDark ? "border-white/5" : "border-[#E5E7EB]"}`}>
              <span className={isDark ? "text-slate-400" : "text-[#6B7280]"}>Mobile Phone</span>
              <span className={`font-semibold ${isDark ? "text-slate-200" : "text-[#111827]"}`}>{seafarer.phone}</span>
            </div>
            <div className={`flex justify-between py-2 border-b ${isDark ? "border-white/5" : "border-[#E5E7EB]"}`}>
              <span className={isDark ? "text-slate-400" : "text-[#6B7280]"}>Date of Birth</span>
              <span className={`font-semibold ${isDark ? "text-slate-200" : "text-[#111827]"}`}>{seafarer.dob || "Not Provided"}</span>
            </div>
            <div className={`flex justify-between py-2 border-b ${isDark ? "border-white/5" : "border-[#E5E7EB]"}`}>
              <span className={isDark ? "text-slate-400" : "text-[#6B7280]"}>Residential Address</span>
              <span className={`font-semibold text-right max-w-[220px] ${isDark ? "text-slate-200" : "text-[#111827]"}`}>
                {seafarer.address || "Not Provided"}
              </span>
            </div>
          </div>
        </div>

        {/* Course Enrollments */}
        <div className={`p-6 ${cardBg}`}>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#3D5EF6] mb-4 flex items-center gap-2">
            <GraduationCap className="w-3.5 h-3.5" /> Course Enrollments ({seafarer.enrollments?.length || 0})
          </h3>
          {seafarer.enrollments && seafarer.enrollments.length > 0 ? (
            <div className="space-y-3">
              {seafarer.enrollments.map((enr: any) => (
                <div
                  key={enr.id}
                  className={`p-3 rounded-[16px] text-xs ${isDark ? "bg-white/[0.02]" : "bg-[#FAFAFA]"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-bold ${isDark ? "text-white" : "text-[#111827]"}`}>{enr.courseName}</span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A]">
                      {enr.status}
                    </span>
                  </div>
                  <div className={`flex items-center justify-between mt-1.5 text-[11px] ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}>
                    <span>{enr.trainingType}</span>
                    <span>Enrolled: {new Date(enr.enrollmentDate).toLocaleDateString("en-IN")}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`p-6 text-center border border-dashed rounded-[16px] text-xs ${isDark ? "border-white/10 text-slate-400" : "border-[#E5E7EB] text-[#6B7280]"}`}>
              No course enrollments yet.
            </div>
          )}
        </div>
      </div>

      {/* Unified Multi-source Purchase History (Direct vs Partner) */}
      <div className={`p-6 ${cardBg}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`text-sm font-bold ${isDark ? "text-white" : "text-[#111827]"}`}>Unified Course Purchase History</h3>
            <p className={`text-xs ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}>
              Courses purchased across all sources (Direct Hari Om and authorized partners)
            </p>
          </div>
          <span className={`text-[11px] font-mono px-2.5 py-1 rounded-full border ${isDark ? "bg-white/5 text-slate-300 border-white/10" : "bg-[#FAFAFA] text-[#6B7280] border-[#E5E7EB]"}`}>
            Total Courses: {seafarer.purchases?.length || 0}
          </span>
        </div>

        {seafarer.purchases && seafarer.purchases.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className={isDark ? "bg-white/[0.03] text-slate-400 border-b border-white/5" : "bg-[#FAFAFA] text-[#6B7280] border-b border-[#E5E7EB]"}>
                <tr>
                  <th className="py-3 px-3 font-semibold">Purchase ID</th>
                  <th className="py-3 px-3 font-semibold">Course Program</th>
                  <th className="py-3 px-3 font-semibold">Training Type</th>
                  <th className="py-3 px-3 font-semibold">Purchase Source</th>
                  <th className="py-3 px-3 font-semibold">Date</th>
                  <th className="py-3 px-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className={isDark ? "divide-y divide-white/5" : "divide-y divide-[#E5E7EB]"}>
                {seafarer.purchases.map((p: any) => (
                  <tr key={p.id} className={isDark ? "hover:bg-white/[0.02] transition-colors duration-200" : "hover:bg-[#EEF1FE]/30 transition-colors duration-200"}>
                    <td className="py-3 px-3 font-mono font-bold text-[#3D5EF6]">{p.id}</td>
                    <td className={`py-3 px-3 font-semibold ${isDark ? "text-white" : "text-[#111827]"}`}>{p.courseName}</td>
                    <td className={`py-3 px-3 ${isDark ? "text-slate-300" : "text-[#6B7280]"}`}>
                      {p.trainingType || "Classroom Training"}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          p.purchaseSource === "Direct"
                            ? "bg-[#EEF1FE] text-[#3D5EF6]"
                            : "bg-[#F3F4F6] text-[#6B7280]"
                        }`}
                      >
                        {p.purchaseSource === "Direct" ? "Direct Hari Om" : "Partner Channel"}
                      </span>
                    </td>
                    <td className={`py-3 px-3 ${isDark ? "text-slate-400" : "text-[#9CA3AF]"}`}>
                      {new Date(p.purchaseDate).toLocaleDateString("en-IN")}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A]">
                        {p.purchaseStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={`p-8 text-center text-xs ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}>
            No course purchases recorded for this Seafarer Master yet.
          </div>
        )}
      </div>
    </div>
  );
}
