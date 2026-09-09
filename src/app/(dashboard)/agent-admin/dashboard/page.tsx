"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import { agentAdminService } from "@/services/agent-admin.service";
import Link from "next/link";
import {
  Users, UserCheck, LifeBuoy, BookOpen, DollarSign, BarChart3, ShieldAlert,
  ArrowUpRight, Activity, FileText, ChevronRight, Briefcase, Anchor, CheckCircle2, Clock,
  ShoppingBag, X, ExternalLink, FileCheck, CreditCard, Calendar, User, Check, AlertCircle, Download
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function AgentAdminDashboard() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  // Interactive Modal State
  const [selectedSeafarerAct, setSelectedSeafarerAct] = useState<any>(null);
  const [selectedPartnerAct, setSelectedPartnerAct] = useState<any>(null);

  const card = `rounded-[16px] p-7 border-0 card-elevated transition-all duration-300 hover:-translate-y-0.5 ${
    isDark
      ? "bg-[#111827] text-white"
      : "bg-white text-[#111827]"
  }`;
  const ht = isDark ? "text-white" : "text-[#111827]";
  const mt = isDark ? "text-white/40" : "text-[#6B7280]";
  const headText = ht;
  const mutedText = mt;

  const fetchDashboardData = async () => {
    try {
      const dbData = await agentAdminService.getDashboardData();
      setData(dbData);
    } catch (err) {
      console.error("Failed to load agent admin dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleVerifyDocument = async (act: any) => {
    // 1. Open the real document file in a new browser tab for review
    const targetUrl = act?.documentUrl || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
    window.open(targetUrl, "_blank", "noopener,noreferrer");

    // 2. Execute actual document verification API call
    try {
      const docId = act?.id || "doc-1";
      const agentId = act?.agentId || "agt-1";
      await agentAdminService.verifyAgentDocument(agentId, docId, "Verified", "Verified by Partner Admin from Operations Dashboard");
    } catch (err) {
      // ISSUE-003: Removed console.log - use proper error handling
      toast.error("Document verification failed. Please try again.");
    }

    // 3. Update dashboard activity feed in real time
    if (data) {
      setData((prev: any) => ({
        ...prev,
        seafarerActivities: (prev?.seafarerActivities || []).map((item: any) =>
          item.id === act.id
            ? { ...item, details: `Document (${act.documentType || 'CDC Certificate'}) verified for ${act.seafarerName}` }
            : item
        ),
      }));
    }

    setSelectedSeafarerAct(null);
  };

  const handleDownloadCertificate = (act: any) => {
    const targetUrl = act?.certificateUrl || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
    window.open(targetUrl, "_blank", "noopener,noreferrer");
    setSelectedSeafarerAct(null);
  };

  // Dismiss modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedSeafarerAct(null);
        setSelectedPartnerAct(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#3D5EF6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const kpis = data?.kpis || {
    totalAgents: 0,
    activeAgents: 0,
    pendingOnboarding: 0,
    totalLeads: 0,
    activeLeads: 0,
    expiredLeads: 0,
    totalReferredSeafarers: 0,
    totalSeafarers: 0,
    activeSeafarers: 0,
    totalRevenueEarned: "₹0",
    commissionPayable: "₹0",
    commissionPaid: "₹0",
    pendingPartnerApps: 0,
  };

  const seafarerActivities = data?.seafarerActivities || data?.recentActivities || [];
  const partnerActivities = data?.partnerActivities || [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className={`text-2xl font-bold tracking-tight ${headText}`}>Operations Overview</h1>
        <p className={`text-xs mt-1.5 ${mutedText}`}>Monitor partner agents, course pricing, invoices, and settlements.</p>
      </div>

      {/* KPI Floating Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        
        {/* Card 1: Total Agents */}
        <div className={card}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Total Agents</span>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isDark ? "bg-[#3D5EF6]/15 text-[#3D5EF6]" : "bg-[#3D5EF6]/10 text-[#3D5EF6]"}`}>
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2.5">
            <span className="text-3xl font-black tracking-tight text-[#111827] dark:text-white leading-none">{kpis.totalAgents}</span>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-200/40 dark:border-emerald-500/20">
              {kpis.activeAgents} Active
            </span>
          </div>
        </div>

        {/* Card 2: Active Agents */}
        <div className={card}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Active Agents</span>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isDark ? "bg-emerald-500/15 text-emerald-400" : "bg-emerald-500/10 text-emerald-600"}`}>
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black tracking-tight text-[#111827] dark:text-white leading-none">{kpis.activeAgents}</span>
            <p className={`text-[10px] mt-2 font-medium ${mutedText}`}>Currently active</p>
          </div>
        </div>

        {/* Card 3: Total Seafarers */}
        <div className={card}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Total Seafarers</span>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isDark ? "bg-teal-500/15 text-teal-400" : "bg-teal-500/10 text-teal-600"}`}>
              <Anchor className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black tracking-tight text-[#111827] dark:text-white leading-none">{kpis.totalSeafarers || kpis.totalReferredSeafarers || 0}</span>
            <p className={`text-[10px] mt-2 font-medium ${mutedText}`}>Registered on platform</p>
          </div>
        </div>

        {/* Card 4: Total Active Seafarers */}
        <div className={card}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Total Active Seafarers</span>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isDark ? "bg-amber-500/15 text-amber-400" : "bg-amber-500/10 text-amber-600"}`}>
              <LifeBuoy className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black tracking-tight text-[#111827] dark:text-white leading-none">{kpis.activeSeafarers || kpis.totalSeafarers || 0}</span>
          </div>
        </div>

        {/* Card 5: Pending Settlement */}
        <div className={card}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Pending Settlement</span>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isDark ? "bg-purple-500/15 text-purple-400" : "bg-purple-500/10 text-purple-600"}`}>
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black tracking-tight text-[#111827] dark:text-white leading-none">{kpis.commissionPayable || kpis.pendingSettlementAmount || "₹48,250"}</span>
            <p className={`text-[10px] mt-2 font-medium ${mutedText}`}>Awaiting settlement</p>
          </div>
        </div>

      </div>

      {/* Quick Actions & Recent Activity Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Seafarer Activity */}
        <div className={`${card} lg:col-span-2 flex flex-col`}>
          <div className="flex items-center justify-between pb-4 mb-2 border-b border-slate-100/60 dark:border-white/[0.04]">
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-[#3D5EF6]" />
              <h3 className={`text-sm font-bold ${headText}`}>Recent Seafarer Activity</h3>
            </div>
            <span className={`text-[10px] font-medium ${mutedText}`}>Click item to view details</span>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar max-h-[350px]">
            {seafarerActivities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10">
                <p className={`text-xs ${mutedText}`}>No recent seafarer activity recorded.</p>
              </div>
            ) : (
              seafarerActivities.map((act: any, idx: number) => {
                const isDoc = act.type === 'document_pending' || act.title?.toLowerCase().includes('doc');
                const isCompleted = act.type === 'course_completed' || act.title?.toLowerCase().includes('course');

                return (
                  <div
                    key={act.id || idx}
                    onClick={() => setSelectedSeafarerAct(act)}
                    className={`p-3.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-all cursor-pointer flex items-start gap-3.5 ${
                      idx !== seafarerActivities.length - 1 ? "border-b border-slate-100/50 dark:border-white/[0.03]" : ""
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isDoc ? (
                        <div className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
                          <Clock className="w-3.5 h-3.5" />
                        </div>
                      ) : isCompleted ? (
                        <div className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-[#3D5EF6]/10 text-[#3D5EF6] flex items-center justify-center">
                          <Users className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold ${isDark ? "text-white/90" : "text-[#111827]"}`}>
                        {act.title || act.action?.replace(/_/g, " ") || "Seafarer Event"}
                      </p>
                      <p className={`text-[11px] mt-0.5 leading-relaxed ${mutedText}`}>{act.details}</p>
                    </div>

                    <span className={`text-[10px] whitespace-nowrap ${mutedText}`}>
                      {new Date(act.timestamp).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Operations Panel */}
        <div className={`${card} self-start`}>
          <h3 className="text-sm font-bold pb-4 mb-3 border-b border-slate-100/60 dark:border-white/[0.04]">Quick Operations</h3>
          <div className="space-y-2.5">
            <Link
              href="/agent-admin/agents?action=create"
              className={`w-full flex items-center justify-between py-3.5 px-4 rounded-full border-0 transition-all duration-200 text-xs font-semibold ${
                isDark
                  ? "bg-white/[0.03] hover:bg-white/[0.07] text-white"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${isDark ? "bg-[#3D5EF6]/20 text-[#3D5EF6]" : "bg-[#3D5EF6]/10 text-[#3D5EF6]"}`}>
                  <Users className="w-4 h-4" />
                </div>
                <span>Onboard New Agent</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-40" />
            </Link>

            <Link
              href="/agent-admin/reports"
              className={`w-full flex items-center justify-between py-3.5 px-4 rounded-full border-0 transition-all duration-200 text-xs font-semibold ${
                isDark
                  ? "bg-white/[0.03] hover:bg-white/[0.07] text-white"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${isDark ? "bg-[#3D5EF6]/20 text-[#3D5EF6]" : "bg-[#3D5EF6]/10 text-[#3D5EF6]"}`}>
                  <BarChart3 className="w-4 h-4" />
                </div>
                <span>Operational Reports</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-40" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Partner Activity Panel */}
      <div className={`${card} mt-8 flex flex-col`}>
        <div className="flex items-center justify-between pb-4 mb-3 border-b border-slate-100/60 dark:border-white/[0.04]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-4 h-4 text-[#3D5EF6]" />
            <h3 className={`text-sm font-bold ${headText}`}>Recent Partner Activity</h3>
          </div>
          <span className={`text-[11px] font-medium ${mutedText}`}>Click purchase row to view transaction breakdown</span>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar max-h-[380px]">
          {partnerActivities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <p className={`text-xs ${mutedText}`}>No recent partner course purchases recorded.</p>
            </div>
          ) : (
            partnerActivities.map((act: any, idx: number) => (
              <div
                key={act.id || idx}
                onClick={() => setSelectedPartnerAct(act)}
                className={`p-3.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-all cursor-pointer flex items-start justify-between gap-4 ${
                  idx !== partnerActivities.length - 1 ? "border-b border-slate-100/50 dark:border-white/[0.03]" : ""
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#3D5EF6]/10 text-[#3D5EF6] flex items-center justify-center shrink-0 mt-0.5">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-xs font-bold ${isDark ? "text-white/90" : "text-[#111827]"}`}>
                        {act.partnerName}
                      </p>
                      <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A]">
                        {act.amountPaid}
                      </span>
                    </div>
                    <p className={`text-[11px] mt-0.5 leading-relaxed ${mutedText}`}>
                      Purchased <span className="font-semibold text-slate-700 dark:text-slate-300">{act.courseName}</span> for {act.seafarerName}
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] whitespace-nowrap ${mutedText} pt-1`}>
                  {new Date(act.timestamp).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- SEAFARER ACTIVITY DETAIL MODAL --- */}
      {selectedSeafarerAct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedSeafarerAct(null)}
        >
          <div
            className={`w-full max-w-lg rounded-[16px] p-7 card-elevated border-0 relative transition-all ${
              isDark ? "bg-[#111827] text-white" : "bg-white text-[#111827]"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4 mb-4 border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  selectedSeafarerAct.type === 'document_pending'
                    ? "bg-amber-500/15 text-amber-500"
                    : "bg-emerald-500/15 text-emerald-500"
                }`}>
                  {selectedSeafarerAct.type === 'document_pending' ? <Clock className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold">
                    {selectedSeafarerAct.type === 'document_pending' ? "Document Verification Details" : "Course Completion Details"}
                  </h3>
                  <p className={`text-xs ${mutedText}`}>{selectedSeafarerAct.seafarerName || "Seafarer Event Details"}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedSeafarerAct(null)}
                className={`p-2 rounded-full transition-colors ${isDark ? "hover:bg-white/10 text-white/60" : "hover:bg-slate-100 text-slate-500"}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Info Strip */}
            <div className="p-4 rounded-[12px] bg-slate-50 dark:bg-white/5 space-y-2 text-xs mb-5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-400 uppercase text-[10px] tracking-wider">Seafarer Name</span>
                <span className="font-bold text-sm">{selectedSeafarerAct.seafarerName || "Rajesh Kumar"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-400 uppercase text-[10px] tracking-wider">Seafarer ID</span>
                <span className="font-mono font-semibold">{selectedSeafarerAct.seafarerId || "SF-8842"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-400 uppercase text-[10px] tracking-wider">Contact</span>
                <span className="font-semibold">{selectedSeafarerAct.contact || "+91 98765 43210"}</span>
              </div>
            </div>

            {/* Specific Event Breakdown */}
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-white/5">
                <span className={mutedText}>
                  {selectedSeafarerAct.type === 'document_pending' ? "Document Pending" : "Course Completed"}
                </span>
                <span className="font-bold">{selectedSeafarerAct.documentType || selectedSeafarerAct.courseName || "STCW BST"}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-white/5">
                <span className={mutedText}>Recorded Timestamp</span>
                <span className="font-semibold">
                  {new Date(selectedSeafarerAct.timestamp).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedSeafarerAct(null)}
                className={`px-5 py-2.5 text-xs font-semibold rounded-full ${
                  isDark ? "hover:bg-white/10 text-white/70" : "hover:bg-slate-100 text-slate-600"
                }`}
              >
                Close
              </button>

              {selectedSeafarerAct.type === 'document_pending' ? (
                <button
                  type="button"
                  onClick={() => handleVerifyDocument(selectedSeafarerAct)}
                  className="px-6 py-2.5 text-xs font-bold text-white rounded-full bg-[#3D5EF6] hover:bg-[#2E4FE0] transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Review & Verify Document
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleDownloadCertificate(selectedSeafarerAct)}
                  className="px-6 py-2.5 text-xs font-bold text-white rounded-full bg-emerald-600 hover:bg-emerald-700 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Download Certificate
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- PARTNER ACTIVITY DETAIL MODAL --- */}
      {selectedPartnerAct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedPartnerAct(null)}
        >
          <div
            className={`w-full max-w-lg rounded-[16px] p-7 card-elevated border-0 relative transition-all ${
              isDark ? "bg-[#111827] text-white" : "bg-white text-[#111827]"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4 mb-4 border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#3D5EF6]/15 text-[#3D5EF6] flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Partner Purchase Breakdown</h3>
                  <p className={`text-xs ${mutedText}`}>{selectedPartnerAct.transactionId || "Transaction Record"}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPartnerAct(null)}
                className={`p-2 rounded-full transition-colors ${isDark ? "hover:bg-white/10 text-white/60" : "hover:bg-slate-100 text-slate-500"}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Partner Info Strip */}
            <div className="p-4 rounded-[12px] bg-slate-50 dark:bg-white/5 space-y-2 text-xs mb-5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-400 uppercase text-[10px] tracking-wider">Partner Agency</span>
                <span className="font-bold text-sm">{selectedPartnerAct.partnerName || "Apex Maritime Agency"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-400 uppercase text-[10px] tracking-wider">Agent ID</span>
                <span className="font-mono font-semibold">{selectedPartnerAct.agentId || "AGT-4091"}</span>
              </div>
            </div>

            {/* Purchase Itemized Details */}
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-white/5">
                <span className={mutedText}>Course Purchased</span>
                <span className="font-bold text-right max-w-[240px] truncate">{selectedPartnerAct.courseName}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-white/5">
                <div>
                  <span className={mutedText}>Beneficiary Seafarer</span>
                  <p className={`font-bold mt-0.5 ${headText}`}>{selectedPartnerAct.seafarerName || "Rajesh Kumar"}</p>
                </div>
                <span className="font-mono text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-md border border-slate-200/50 dark:border-white/10">
                  {selectedPartnerAct.seafarerId || "SF-8842"}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-white/5">
                <span className={mutedText}>Amount Paid</span>
                <span className="font-black text-base text-[#3D5EF6]">{selectedPartnerAct.amountPaid}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-white/5">
                <span className={mutedText}>Transaction On</span>
                <span className="font-semibold">
                  {new Date(selectedPartnerAct.timestamp).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedPartnerAct(null)}
                className={`px-5 py-2.5 text-xs font-semibold rounded-full ${
                  isDark ? "hover:bg-white/10 text-white/70" : "hover:bg-slate-100 text-slate-600"
                }`}
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  toast(`Viewing invoice for transaction ${selectedPartnerAct.transactionId}`);
                  setSelectedPartnerAct(null);
                }}
                className="px-6 py-2.5 text-xs font-bold text-white rounded-full bg-[#3D5EF6] hover:bg-[#2E4FE0] transition-all shadow-md active:scale-95 cursor-pointer"
              >
                View Full Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
