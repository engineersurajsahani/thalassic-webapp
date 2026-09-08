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
    ? "bg-[#09162c]/80 border-white/5 shadow-lg"
    : "bg-white border-slate-200/80 shadow-sm";

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto animate-pulse">
        <div className="h-8 w-48 rounded-xl bg-slate-200 dark:bg-white/5" />
        <div className="h-44 rounded-3xl bg-slate-200 dark:bg-white/5" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 rounded-3xl bg-slate-200 dark:bg-white/5" />
          <div className="h-64 rounded-3xl bg-slate-200 dark:bg-white/5" />
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
          className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Seafarer Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Back button & Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link
            href="/partner/seafarers"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Seafarer Directory
          </Link>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1.5">
            {seafarer.name}
          </h1>
        </div>

        <Link
          href={`/partner/purchases/create?seafarerId=${seafarer.id}`}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all shrink-0"
        >
          <ShoppingCart className="w-4 h-4" />
          Enroll in Physical Course
        </Link>
      </div>

      {/* Identity Overview Banner */}
      <div className={`p-6 rounded-3xl border ${cardBg}`}>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center text-xl font-black uppercase shrink-0 shadow-lg shadow-cyan-500/25">
            {seafarer.name ? seafarer.name.split(" ").map((n: any) => n[0]).join("") : "SM"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-lg font-bold text-white">{seafarer.name}</h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                Master ID: {seafarer.id}
              </span>
            </div>

            {/* Maritime Identity Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-3 border-t border-white/5 text-xs">
              <div>
                <p className="text-[10px] text-slate-400">INDoS Number</p>
                <p className="font-mono font-bold text-cyan-300 mt-0.5">{seafarer.indosNum || "N/A"}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Passport Number</p>
                <p className="font-mono font-bold text-white mt-0.5">{seafarer.passportNum || "N/A"}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">CDC Number</p>
                <p className="font-mono font-bold text-white mt-0.5">{seafarer.cdcNum || "N/A"}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Nationality</p>
                <p className="font-bold text-white mt-0.5">{seafarer.nationality || "Indian"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Contact & Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className={`p-6 rounded-3xl border ${cardBg}`}>
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-4 flex items-center gap-2">
            <Mail className="w-3.5 h-3.5" /> Contact Information
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-slate-400">Email Address</span>
              <span className="font-semibold text-slate-200">{seafarer.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-slate-400">Mobile Phone</span>
              <span className="font-semibold text-slate-200">{seafarer.phone}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-slate-400">Date of Birth</span>
              <span className="font-semibold text-slate-200">{seafarer.dob || "Not Provided"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-slate-400">Residential Address</span>
              <span className="font-semibold text-slate-200 text-right max-w-[220px]">
                {seafarer.address || "Not Provided"}
              </span>
            </div>
          </div>
        </div>

        {/* Physical Course Enrollments */}
        <div className={`p-6 rounded-3xl border ${cardBg}`}>
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-4 flex items-center gap-2">
            <GraduationCap className="w-3.5 h-3.5" /> Physical Course Enrollments ({seafarer.enrollments?.length || 0})
          </h3>
          {seafarer.enrollments && seafarer.enrollments.length > 0 ? (
            <div className="space-y-3">
              {seafarer.enrollments.map((enr: any) => (
                <div
                  key={enr.id}
                  className={`p-3 rounded-xl border text-xs ${isDark ? "bg-white/[0.02] border-white/5" : "bg-slate-50 border-slate-200"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{enr.courseName}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {enr.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1.5 text-[11px] text-slate-400">
                    <span>{enr.trainingType}</span>
                    <span>Enrolled: {new Date(enr.enrollmentDate).toLocaleDateString("en-IN")}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center border border-dashed rounded-xl border-white/10 text-slate-400 text-xs">
              No physical enrollments yet.
            </div>
          )}
        </div>
      </div>

      {/* Unified Multi-source Purchase History (Direct vs Partner) */}
      <div className={`p-6 rounded-3xl border ${cardBg}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold">Unified Course Purchase History</h3>
            <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Courses purchased across all sources (Direct Hari Om and authorized partners)
            </p>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-white/5 text-slate-300">
            Total Courses: {seafarer.purchases?.length || 0}
          </span>
        </div>

        {seafarer.purchases && seafarer.purchases.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className={isDark ? "bg-white/[0.03] text-slate-400 border-b border-white/5" : "bg-slate-50 text-slate-500 border-b border-slate-200"}>
                <tr>
                  <th className="py-3 px-3 font-semibold">Purchase ID</th>
                  <th className="py-3 px-3 font-semibold">Course Program</th>
                  <th className="py-3 px-3 font-semibold">Training Type</th>
                  <th className="py-3 px-3 font-semibold">Purchase Source</th>
                  <th className="py-3 px-3 font-semibold">Date</th>
                  <th className="py-3 px-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {seafarer.purchases.map((p: any) => (
                  <tr key={p.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3 font-mono font-bold text-cyan-400">{p.id}</td>
                    <td className="py-3 px-3 font-semibold">{p.courseName}</td>
                    <td className="py-3 px-3 text-slate-300">Physical Training</td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.purchaseSource === "Direct"
                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                            : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        }`}
                      >
                        {p.purchaseSource === "Direct" ? "Direct Hari Om" : "Partner Channel"}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {new Date(p.purchaseDate).toLocaleDateString("en-IN")}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {p.purchaseStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs">
            No course purchases recorded for this Seafarer Master yet.
          </div>
        )}
      </div>
    </div>
  );
}
