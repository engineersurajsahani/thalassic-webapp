"use client";

import React, { useEffect, useState } from "react";
import { agentService } from "@/services/agent.service";
import { useTheme } from "@/providers/theme-provider";
import {
  Share2, Copy, Check, AlertCircle,
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
        // @ts-expect-error - backend API returns AgentDashboard shape; fix when BE contract is aligned
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`h-24 rounded-2xl ${isDark ? "bg-[#09162c]" : "bg-slate-100"}`} />
          ))}
        </div>
        <div className={`h-44 rounded-3xl ${isDark ? 'bg-[#09162c]' : 'bg-slate-100'}`} />
      </div>
    );
  }

  const leads = stats?.totalLeads || 0;
  const purchases = stats?.totalPurchases || 0;

  const cardStyle = `rounded-3xl border p-6 shadow-xl backdrop-blur-xl ${
    isDark 
      ? "bg-[#0a1122]/70 border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-white" 
      : "bg-white/80 border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-slate-900"
  }`;

  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      
      {/* Title Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Referral Center
        </h1>
        <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Distribute your unique referral code. Seafarers must enter this code during checkout to attribute the booking to your agency.
        </p>
      </div>

      {/* Metrics Center (Brought to the top) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          { label: "Total Referral Codes Used", value: leads, icon: Users, desc: "Candidates applying your code", iconBg: "bg-cyan-500/10", iconText: "text-cyan-500" },
          { label: "Successful Conversions", value: purchases, icon: ClipboardList, desc: "Completed enrollments", iconBg: "bg-indigo-500/10", iconText: "text-indigo-500" },
          { label: "Pending Commissions", value: `₹${stats?.pendingCommission?.toLocaleString() || 0}`, icon: TrendingUp, desc: "Awaiting clearance", iconBg: "bg-amber-500/10", iconText: "text-amber-500" },
          { label: "Approved Commissions", value: `₹${stats?.paidCommission?.toLocaleString() || 0}`, icon: Check, desc: "Cleared for payout", iconBg: "bg-blue-500/10", iconText: "text-blue-500" },
          { label: "Total Earnings", value: `₹${stats?.totalEarned?.toLocaleString() || 0}`, icon: TrendingUp, desc: "Lifetime earnings", iconBg: "bg-emerald-500/10", iconText: "text-emerald-500" },
        ].map((met, idx, arr) => {
          const Icon = met.icon;
          const isLastOdd = arr.length % 2 !== 0 && idx === arr.length - 1;
          return (
            <div
              key={idx}
              className={`rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 backdrop-blur-xl ${
                isLastOdd ? "md:col-span-2 lg:col-span-1" : ""
              } ${
                isDark 
                  ? "bg-[#0a1122]/70 border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-white" 
                  : "bg-white/80 border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-slate-900"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className={`text-[10px] font-black tracking-widest uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    {met.label}
                  </span>
                  <p className="text-xl font-black tracking-tight">{met.value}</p>
                </div>
                <div className={`p-2 rounded-2xl ${met.iconBg} ${met.iconText}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className={`text-[9px] font-semibold mt-4 tracking-wide uppercase ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                {met.desc}
              </p>
            </div>
          );
        })}
      </section>

      {/* Code Display (Made compact and side-by-side) */}
      <section className={cardStyle}>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${isDark ? "bg-cyan-500/10 text-cyan-400" : "bg-cyan-50 text-cyan-600"}`}>
              <Share2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold tracking-tight">Agent Referral Code</h3>
              <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Provide this code to your candidates. They will need to enter it during checkouts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className={`px-6 py-2.5 rounded-xl text-2xl font-black tracking-widest border font-mono select-all ${
              isDark ? "bg-[#0b182d] border-slate-800 text-cyan-400 shadow-inner" : "bg-slate-50 border-slate-200 text-cyan-700 shadow-inner"
            }`}>
              {referralCode}
            </div>
            <button
              onClick={handleCopyCode}
              className={`px-5 py-3.5 rounded-xl border transition-all cursor-pointer font-bold text-xs flex items-center gap-2 shadow-sm ${
                isDark ? "border-slate-800 bg-slate-900/80 hover:bg-white/10" : "border-slate-200 bg-white hover:bg-slate-100"
              }`}
            >
              {copiedCode ? <><Check className="w-4 h-4 text-emerald-500" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Code</>}
            </button>
          </div>
        </div>

        <div className={`mt-5 pt-5 border-t ${isDark ? "border-slate-800/10" : "border-slate-200"} flex gap-3 text-[11px] leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          <AlertCircle className={`w-4.5 h-4.5 shrink-0 mt-0.5 ${isDark ? "text-cyan-400" : "text-blue-600"}`} />
          <div>
            <span className="font-bold text-slate-300 mr-1.5">Important Notice:</span>
            Automatic link tracking is deprecated. The candidate must explicitly type or paste this code in checkout to qualify.
          </div>
        </div>
      </section>

      {/* Guide Section */}
      <section className={cardStyle}>
        <h3 className={`text-lg font-black tracking-tight border-b ${isDark ? "border-slate-800/40" : "border-slate-200"} pb-4 flex items-center gap-2 mb-5`}>
          <HelpCircle className={`w-5 h-5 ${isDark ? "text-cyan-400" : "text-blue-600"}`} />
          Referral Code Usage Guide
        </h3>
        <div className={`space-y-4 text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}>
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
