"use client";

import React, { useEffect, useState } from "react";
import { agentService } from "@/services/agent.service";
import { useTheme } from "@/providers/theme-provider";
import {
  Share2, Copy, Check, Download, AlertCircle,
  HelpCircle, Users, ClipboardList, TrendingUp
} from "lucide-react";

export default function ReferralCenter() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [metadata, setMetadata] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const meta = await agentService.getMetadata();
        const dash = await agentService.getDashboard();
        setMetadata(meta);
        setStats(dash.stats);
      } catch (err) {
        console.error("Failed to load referral details:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const referralCode = metadata?.referral_code || "PENDING";

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-64 rounded-3xl ${isDark ? 'bg-[#09162c]' : 'bg-slate-100'}" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`h-24 rounded-2xl ${isDark ? "bg-[#09162c]" : "bg-slate-100"}`} />
          ))}
        </div>
      </div>
    );
  }

  const leads = stats?.totalLeads || 0;
  const purchases = stats?.totalPurchases || 0;
  const convRate = leads > 0 ? ((stats?.convertedLeads || 0) / leads) * 100 : 0;

  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      
      {/* Title Header */}
      <div className="flex flex-col gap-1">
        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit ${
          isDark ? "bg-cyan-500/10 text-cyan-400" : "bg-blue-50 text-[#3b71cb]"
        }`}>
          📢 Marketing Hub
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight mt-1.5">
          Referral Center
        </h1>
        <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Distribute your unique referral code. Seafarers must enter this code during checkout to attribute the booking to your agency.
        </p>
      </div>

      {/* Code Display */}
      <div>
        {/* Referral code details */}
        <section className={`rounded-3xl border p-6 md:p-10 shadow-xl flex flex-col justify-between items-center text-center max-w-3xl mx-auto ${
          isDark ? "bg-[#0a1122]/70 border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-white backdrop-blur-xl" : "bg-white/80 border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-slate-900 backdrop-blur-xl"
        }`}>
          <div className="space-y-6 w-full flex flex-col items-center">
            <h3 className="text-xl font-black tracking-tight flex items-center justify-center gap-2">
              <Share2 className="w-6 h-6 text-cyan-400" />
              Agent Referral Code
            </h3>

            <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Provide this code to your candidates. They will need it during the checkout process.
            </p>

            {/* Code */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
              <div className={`px-10 py-5 rounded-2xl text-4xl font-black tracking-widest border font-mono select-all ${
                isDark ? "bg-[#0b182d] border-slate-850 text-cyan-400 shadow-inner" : "bg-slate-50 border-slate-200 text-cyan-700 shadow-inner"
              }`}>
                {referralCode}
              </div>
              <button
                onClick={handleCopyCode}
                className={`px-8 py-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-center font-bold gap-2 ${
                  isDark ? "border-slate-800 bg-slate-900/80 hover:bg-white/10" : "border-slate-200 bg-white hover:bg-slate-100 shadow-sm"
                }`}
                title="Copy Code"
              >
                {copiedCode ? <><Check className="w-5 h-5 text-emerald-500" /> Copied!</> : <><Copy className="w-5 h-5" /> Copy Code</>}
              </button>
            </div>
          </div>

          <div className="mt-10 p-4 w-full rounded-2xl bg-cyan-500/5 border border-cyan-500/10 flex gap-3 text-xs leading-relaxed text-slate-400 text-left">
            <AlertCircle className="w-5 h-5 shrink-0 text-cyan-400 mt-0.5" />
            <div>
              <p className="font-bold text-slate-350">Important Notice</p>
              <p className="mt-1">Link and QR-based automatic tracking have been deprecated. The candidate must explicitly type or paste your referral code in the &quot;Referral Code&quot; box at checkout to qualify for commission.</p>
            </div>
          </div>
        </section>
      </div>

      {/* Metrics Center */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Referral Codes Used", value: leads, icon: Users, desc: "Candidates applying your code", iconBg: "bg-cyan-500/10", iconText: "text-cyan-500" },
          { label: "Successful Conversions", value: purchases, icon: ClipboardList, desc: "Completed enrollments", iconBg: "bg-indigo-500/10", iconText: "text-indigo-500" },
          { label: "Pending Commissions", value: `₹${stats?.pendingCommission?.toLocaleString() || 0}`, icon: TrendingUp, desc: "Awaiting clearance", iconBg: "bg-amber-500/10", iconText: "text-amber-500" },
          { label: "Approved Commissions", value: `₹${stats?.paidCommission?.toLocaleString() || 0}`, icon: Check, desc: "Cleared for payout", iconBg: "bg-blue-500/10", iconText: "text-blue-500" },
          { label: "Paid Commissions", value: `₹${stats?.paidCommission?.toLocaleString() || 0}`, icon: Check, desc: "Settled disbursements", iconBg: "bg-emerald-500/10", iconText: "text-emerald-500" },
          { label: "Total Earnings", value: `₹${stats?.totalEarned?.toLocaleString() || 0}`, icon: TrendingUp, desc: "Lifetime earnings", iconBg: "bg-emerald-500/10", iconText: "text-emerald-500" },
        ].map((met, idx) => {
          const Icon = met.icon;
          return (
            <div
              key={idx}
              className={`rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 backdrop-blur-xl ${
                isDark 
                  ? "bg-[#0a1122]/70 border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-white" 
                  : "bg-white/80 border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-slate-900"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className={`text-[10px] font-black tracking-widest uppercase ${isDark ? "text-slate-450" : "text-slate-400"}`}>
                    {met.label}
                  </span>
                  <p className="text-xl font-black tracking-tight">{met.value}</p>
                </div>
                <div className={`p-2 rounded-2xl ${met.iconBg} ${met.iconText}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className={`text-[9px] font-semibold mt-4 tracking-wide uppercase ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                {met.desc}
              </p>
            </div>
          );
        })}
      </section>

      {/* Guide Section */}
      <section className={`rounded-3xl border p-6 md:p-8 shadow-xl relative overflow-hidden ${
        isDark ? "bg-[#0a1122]/70 border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-white backdrop-blur-xl" : "bg-white/80 border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-slate-900 backdrop-blur-xl"
      }`}>
        <h3 className="text-lg font-black tracking-tight border-b border-slate-800/40 pb-4 flex items-center gap-2 mb-5">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          Referral Code Usage Guide
        </h3>
        <div className={`space-y-4 text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-550"}`}>
          <p>
            1. **Provide Your Code**: Copy your Agent Referral Code from the box above and send it to your candidates via WhatsApp, Email, or SMS.
          </p>
          <p>
            2. **Candidate Enters Code**: Instruct your candidates to enter this code in the &quot;Referral Code (Optional)&quot; field when they are booking a course in the Seafarer Portal.
          </p>
          <p>
            3. **Automatic Attribution**: Once the booking is completed with a valid referral code, the sale is automatically attributed to you, and the commission is calculated and added to your pending balance.
          </p>
        </div>
      </section>

    </div>
  );
}
