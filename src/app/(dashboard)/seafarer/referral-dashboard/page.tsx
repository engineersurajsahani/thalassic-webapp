"use client";

import React, { useEffect, useState } from "react";
import { referralService } from "@/services/referral.service";
import { useTheme } from "@/providers/theme-provider";
import {
  Copy,
  CheckCircle,
  Clock,
  Sparkles,
  CloudLightning,
  Star,
} from "lucide-react";

export default function ReferralDashboardPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [referralData, setReferralData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const data = await referralService.getReferrals();
        setReferralData(data);
      } catch (err) {
        console.error("Failed to load referral data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReferrals();
  }, []);

  const handleCopyCode = () => {
    if (!referralData?.referralCode) return;
    navigator.clipboard.writeText(referralData.referralCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const fmtDate = (d: string) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className={`h-20 rounded-2xl ${isDark ? "bg-[#0A192F]" : "bg-slate-100"}`} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`h-20 rounded-2xl ${isDark ? "bg-[#0A192F]" : "bg-slate-100"}`} />
          ))}
        </div>
        <div className={`h-72 rounded-3xl ${isDark ? "bg-[#0A192F]" : "bg-slate-100"}`} />
      </div>
    );
  }

  const stats = [
    {
      label: "Total Referrals",
      value: referralData?.totalReferrals ?? 0,
      color: isDark ? "text-cyan-400" : "text-[#3b71cb]",
    },
    {
      label: "Successful Registrations",
      value: referralData?.successfulRegistrations ?? 0,
      color: "text-emerald-400",
    },
    {
      label: "Earned Credits",
      value: `₹${Number(referralData?.earnedCredits ?? 0).toLocaleString("en-IN")}`,
      color: "text-amber-400",
    },
    {
      label: "Referral History",
      value: referralData?.history?.length ?? 0,
      color: "text-purple-400",
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn relative pb-10">
      {/* Page Title Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight mt-1.5">Referral Dashboard</h1>
        <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Share your personal INDoS referral code with fellow seafarers and earn credits when they
          register.
        </p>
      </div>

      {/* Referral Code Card */}
      <div
        className={`rounded-2xl border p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg ${
          isDark
            ? "bg-gradient-to-br from-[#09162c] to-[#040c1a] border-slate-800/80"
            : "bg-white border-slate-200"
        }`}
      >
        <div className="space-y-1">
          <p
            className={`text-[10px] font-black uppercase tracking-widest ${
              isDark ? "text-slate-500" : "text-slate-400"
            }`}
          >
            Your Personal Referral Code (INDoS Number)
          </p>
          <div className="flex items-center gap-3">
            <span
              className={`text-2xl font-extrabold tracking-widest font-mono ${
                isDark ? "text-cyan-400" : "text-[#3b71cb]"
              }`}
            >
              {referralData?.referralCode || "—"}
            </span>
            <button
              onClick={handleCopyCode}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                copied
                  ? isDark
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : "border-emerald-300 bg-emerald-50 text-emerald-600"
                  : isDark
                  ? "border-slate-800 bg-slate-900/40 text-gray-300 hover:bg-slate-800"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Code
                </>
              )}
            </button>
          </div>
        </div>
        <div
          className={`text-xs rounded-xl px-4 py-3 border ${
            isDark
              ? "bg-slate-800/40 border-slate-700 text-slate-400"
              : "bg-slate-50 border-slate-200 text-slate-500"
          }`}
        >
          <p className="font-bold mb-1">How it works</p>
          <p className="leading-relaxed max-w-xs">
            Share your INDoS code with fellow seafarers. When they register using your code, you
            earn ₹500 credit per successful registration.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-2xl py-3.5 px-5 border shadow-lg flex flex-col justify-center transition-all duration-300 hover:shadow-xl ${
              isDark
                ? "bg-gradient-to-b from-[#09162c] to-[#040c1a] border-slate-800/80 text-white hover:border-cyan-500/20"
                : "bg-white border-slate-200 text-slate-900 hover:border-[#3b71cb]/20"
            }`}
          >
            <p
              className={`text-[10px] font-black uppercase tracking-wider ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              {stat.label}
            </p>
            <p className={`text-2xl font-black tracking-tight mt-1 ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      {/* Referral History Table */}
      <section
        className={`rounded-3xl border p-6 md:p-8 shadow-xl relative overflow-hidden ${
          isDark
            ? "bg-gradient-to-b from-[#09162c] to-[#040c1a] border-slate-800/80 text-white"
            : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-800/40 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-lg font-black tracking-tight">Referral History</h3>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
              isDark ? "bg-cyan-500/10 text-cyan-400" : "bg-blue-50 text-[#3b71cb]"
            }`}
          >
            Total: {referralData?.history?.length ?? 0}
          </span>
        </div>

        {!referralData?.history || referralData.history.length === 0 ? (
          <div
            className={`text-center py-16 rounded-2xl border border-dashed flex flex-col items-center justify-center p-6 ${
              isDark ? "border-slate-800 bg-slate-900/10" : "border-slate-200 bg-slate-50/50"
            }`}
          >
            <CloudLightning className="w-10 h-10 text-slate-500 mb-3" />
            <h4 className="text-sm font-bold text-slate-400">No Referrals Yet</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-[300px] leading-relaxed">
              Share your INDoS referral code with fellow seafarers to start earning credits.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs leading-normal">
              <thead>
                <tr
                  className={`font-black border-b uppercase tracking-widest text-[9px] ${
                    isDark ? "text-slate-500 border-slate-800" : "text-slate-400 border-slate-100"
                  }`}
                >
                  <th className="pb-3 pr-4">Referred Seafarer</th>
                  <th className="pb-3 pr-4">Email</th>
                  <th className="pb-3 pr-4">Registration Date</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 text-right">Credits Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/10">
                {referralData.history.map((ref: any) => (
                  <tr
                    key={ref.id}
                    className={`hover:bg-slate-500/5 transition-colors ${
                      isDark ? "border-b border-slate-900/60" : "border-b border-slate-100"
                    }`}
                  >
                    <td className="py-4 pr-4 font-semibold">{ref.name || "—"}</td>
                    <td className={`py-4 pr-4 ${isDark ? "text-slate-400" : "text-slate-550"}`}>
                      {ref.email || "—"}
                    </td>
                    <td className={`py-4 pr-4 ${isDark ? "text-slate-400" : "text-slate-550"}`}>
                      {fmtDate(ref.registrationDate)}
                    </td>
                    <td className="py-4 pr-4">
                      {ref.status === "Registered" ? (
                        <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider ${
                          isDark ? "text-emerald-400" : "text-emerald-500"
                        }`}>
                          <CheckCircle className="w-3 h-3" /> {ref.status}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                          <Clock className="w-3 h-3" /> {ref.status}
                        </span>
                      )}
                    </td>
                    <td className="py-4 text-right">
                      {ref.creditsEarned > 0 ? (
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
                          <Star className="w-3 h-3" />₹{ref.creditsEarned.toLocaleString("en-IN")}
                        </span>
                      ) : (
                        <span className={isDark ? "text-slate-600" : "text-slate-300"}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
