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
        const dash: any = await agentService.getDashboard();
        setMetadata(meta);
        setStats(dash?.stats || dash || {});
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
            <div key={i} className={`h-24 rounded-[16px] ${isDark ? "bg-[#09162c]" : "bg-slate-100"}`} />
          ))}
        </div>
        <div className={`h-44 rounded-[16px] ${isDark ? 'bg-[#09162c]' : 'bg-slate-100'}`} />
      </div>
    );
  }

  const leads = stats?.totalLeads || 0;
  const purchases = stats?.totalPurchases || 0;

  const cardStyle = `rounded-[16px] border-0 p-6 ${
    isDark 
      ? "bg-[#0B0F19] shadow-[0_4px_20px_rgba(0,0,0,0.3)] text-white" 
      : "bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] text-[#111827]"
  }`;

  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      
      {/* Title Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Referral Center
        </h1>
        <p className={`text-xs ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
          Distribute your unique referral code. Seafarers must enter this code during checkout to attribute the booking to your agency.
        </p>
      </div>

      {/* Metrics Center (Brought to the top) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          { label: "Total Referral Codes Used", value: leads, icon: Users, desc: "Candidates applying your code" },
          { label: "Successful Conversions", value: purchases, icon: ClipboardList, desc: "Completed enrollments" },
          { label: "Pending Commissions", value: `₹${stats?.pendingCommission?.toLocaleString() || 0}`, icon: TrendingUp, desc: "Awaiting clearance" },
          { label: "Approved Commissions", value: `₹${stats?.paidCommission?.toLocaleString() || 0}`, icon: Check, desc: "Cleared for payout" },
          { label: "Total Earnings", value: `₹${stats?.totalEarned?.toLocaleString() || 0}`, icon: TrendingUp, desc: "Lifetime earnings" },
        ].map((met, idx, arr) => {
          const Icon = met.icon;
          const isLastOdd = arr.length % 2 !== 0 && idx === arr.length - 1;
          return (
            <div
              key={idx}
              className={`rounded-[16px] p-5 border-0 flex flex-col justify-between transition-colors duration-200 ${
                isLastOdd ? "md:col-span-2 lg:col-span-1" : ""
              } ${
                isDark 
                  ? "bg-[#0B0F19] shadow-[0_4px_20px_rgba(0,0,0,0.3)] text-white" 
                  : "bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] text-[#111827]"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className={`text-[10px] font-black tracking-widest uppercase ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
                    {met.label}
                  </span>
                  <p className="text-xl font-black tracking-tight">{met.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isDark ? "bg-[#3D5EF6]/15 text-[#3D5EF6]" : "bg-[#EEF1FE] text-[#3D5EF6]"}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className={`text-[9px] font-semibold mt-4 tracking-wide uppercase ${isDark ? "text-gray-500" : "text-[#6B7280]"}`}>
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
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isDark ? "bg-[#3D5EF6]/15 text-[#3D5EF6]" : "bg-[#EEF1FE] text-[#3D5EF6]"}`}>
              <Share2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold tracking-tight">Agent Referral Code</h3>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
                Provide this code to your candidates. They will need to enter it during checkouts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className={`px-6 py-2.5 rounded-full text-2xl font-black tracking-widest border font-mono select-all ${
              isDark ? "bg-[#111827] border-[#1F2937] text-[#3D5EF6]" : "bg-[#EEF1FE] border-[#3D5EF6]/20 text-[#3D5EF6]"
            }`}>
              {referralCode}
            </div>
            <button
              onClick={handleCopyCode}
              className={`px-5 py-3.5 rounded-full border transition-colors duration-200 cursor-pointer font-bold text-xs flex items-center gap-2 shadow-sm ${
                isDark ? "border-[#1F2937] bg-[#111827] text-white hover:bg-white/10" : "border-[#E5E7EB] bg-[#F3F4F6] text-[#6B7280] hover:text-[#111827] hover:bg-[#E5E7EB]"
              }`}
            >
              {copiedCode ? <><Check className="w-4 h-4 text-[#16A34A]" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Code</>}
            </button>
          </div>
        </div>

        <div className={`mt-5 pt-5 border-t ${isDark ? "border-[#1F2937]" : "border-[#E5E7EB]"} flex gap-3 text-[11px] leading-relaxed ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
          <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5 text-[#3D5EF6]" />
          <div>
            <span className="font-bold text-[#111827] dark:text-gray-200 mr-1.5">Important Notice:</span>
            Automatic link tracking is deprecated. The candidate must explicitly type or paste this code in checkout to qualify.
          </div>
        </div>
      </section>

      {/* Guide Section */}
      <section className={cardStyle}>
        <h3 className={`text-lg font-black tracking-tight border-b ${isDark ? "border-[#1F2937]" : "border-[#E5E7EB]"} pb-4 flex items-center gap-2 mb-5`}>
          <HelpCircle className="w-5 h-5 text-[#3D5EF6]" />
          Referral Code Usage Guide
        </h3>
        <div className={`space-y-4 text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
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
