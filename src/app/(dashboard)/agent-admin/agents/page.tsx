"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTheme } from "@/providers/theme-provider";
import { agentAdminService } from "@/services/agent-admin.service";
import { partnerPricingService, CoursePricingItem } from "@/services/partner-pricing.service";
import { 
  Users, Plus, Search, Edit2, Key, ToggleLeft, ToggleRight, Check,
  QrCode, AlertCircle, RefreshCw, X, Percent, CheckSquare, Sparkles,
  Tag, Send, DollarSign, Clock, CheckCircle2, XCircle, ArrowLeft, ChevronLeft,
  Eye, FileText, Building, Phone, Mail, MapPin, ShieldCheck, ExternalLink, Download
} from "lucide-react";

export default function AgentManagement() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAgentForPricing, setSelectedAgentForPricing] = useState<any>(null);
  const [activeAgentTab, setActiveAgentTab] = useState<"pricing" | "details">("details");
  const [coursePricings, setCoursePricings] = useState<CoursePricingItem[]>([]);
  const [pricingInputMap, setPricingInputMap] = useState<Record<string, string>>({});
  const [pricingSubmittingId, setPricingSubmittingId] = useState<string | null>(null);
  const [pricingFeedback, setPricingFeedback] = useState<{ courseId: string; msg: string; type: "success" | "error" } | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAgencyName, setEditAgencyName] = useState("");
  const [editOfficeAddress, setEditOfficeAddress] = useState("");
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState(false);

  const [verifyingDocId, setVerifyingDocId] = useState<string | null>(null);
  const [verificationRemarks, setVerificationRemarks] = useState("");

  // Selected agent for modals
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [onboardingChecklist, setOnboardingChecklist] = useState<any>(null);

  // Create Form State
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newGenComm, setNewGenComm] = useState("5.0");
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState(false);

  // Password reset state
  const [resetPass, setResetPass] = useState("");
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState(false);

  // Commission Edit state
  const [generalComm, setGeneralComm] = useState(5.0);
  const [courseComm, setCourseComm] = useState<Record<string, number>>({});
  const [commError, setCommError] = useState("");
  const [commSuccess, setCommSuccess] = useState(false);

  const card = `rounded-[16px] p-7 border-0 card-elevated transition-all duration-300 hover:-translate-y-0.5 ${
    isDark
      ? "bg-[#111827] text-white"
      : "bg-white text-[#111827]"
  }`;
  const inputBg = isDark ? "bg-white/5 border-white/10 text-white placeholder:text-white/20" : "bg-[#FAFAFA] border-[#E5E7EB] text-[#111827] placeholder:text-[#9CA3AF]";
  const labelText = isDark ? "text-slate-300 font-medium" : "text-[#111827] font-semibold";
  const valueText = isDark ? "text-white font-bold" : "text-[#111827] font-bold";
  const ht = isDark ? "text-white font-extrabold" : "text-[#111827] font-extrabold";
  const mt = isDark ? "text-slate-400 font-medium" : "text-[#6B7280] font-medium";

  const fetchAgents = async () => {
    try {
      const list = await agentAdminService.getAgents();
      setAgents(list);
    } catch (err) {
      console.error("Failed to load agents list: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
    if (searchParams.get("action") === "create") {
      setShowCreateModal(true);
    }
  }, [searchParams]);

  // Handle agent creation
  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    setCreateSuccess(false);

    try {
      await agentAdminService.createAgent({
        name: newName,
        email: newEmail,
        password: newPassword,
        phone: newPhone,
        generalCommission: parseFloat(newGenComm) || 5.0,
      });

      setCreateSuccess(true);
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      setNewPhone("");
      setNewGenComm("5.0");
      fetchAgents();
      setTimeout(() => {
        setShowCreateModal(false);
        setCreateSuccess(false);
      }, 1500);
    } catch (err: any) {
      setCreateError(err.message || "Failed to create agent account.");
    }
  };

  // Toggle status
  const handleToggleStatus = async (agent: any) => {
    const nextStatus = agent.status === "Active" ? "Deactivated" : "Active";
    try {
      await agentAdminService.updateAgentStatus(agent.id, nextStatus);
      setAgents(prev =>
        prev.map(a => (a.id === agent.id ? { ...a, status: nextStatus, onboardingStatus: nextStatus === "Active" ? "Active" : "Inactive" } : a))
      );
    } catch (err) {
      console.error("Failed to update status: ", err);
    }
  };

  // Handle password reset
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError("");
    setPassSuccess(false);

    try {
      await agentAdminService.resetAgentPassword(selectedAgent.id, { password: resetPass });
      setPassSuccess(true);
      setResetPass("");
      setTimeout(() => {
        setShowPasswordModal(false);
        setPassSuccess(false);
      }, 1500);
    } catch (err: any) {
      setPassError(err.message || "Failed to reset password.");
    }
  };

  // Handle commission update
  const handleUpdateCommission = async (e: React.FormEvent) => {
    e.preventDefault();
    setCommError("");
    setCommSuccess(false);

    try {
      await agentAdminService.updateAgentCommission(selectedAgent.id, generalComm, courseComm);
      setCommSuccess(true);
      fetchAgents();
      setTimeout(() => {
        setShowCommissionModal(false);
        setCommSuccess(false);
      }, 1500);
    } catch (err: any) {
      setCommError(err.message || "Failed to update commission rates.");
    }
  };

  // Handle onboarding status view
  const handleViewOnboarding = async (agent: any) => {
    setSelectedAgent(agent);
    try {
      const data = await agentAdminService.getAgentOnboarding(agent.id);
      setOnboardingChecklist(data);
      setShowOnboardingModal(true);
    } catch (err) {
      console.error("Failed to get onboarding details:", err);
    }
  };

  const openCommissionModal = (agent: any) => {
    setSelectedAgent(agent);
    setGeneralComm(agent.generalCommission);
    setCourseComm(agent.courseCommissions || {});
    setShowCommissionModal(true);
  };

  const openPasswordModal = (agent: any) => {
    setSelectedAgent(agent);
    setShowPasswordModal(true);
  };

  const openAgentView = async (agent: any, initialTab: "pricing" | "details" = "details") => {
    setSelectedAgentForPricing(agent);
    setSelectedAgent(agent);
    setActiveAgentTab(initialTab);
    setPricingFeedback(null);
    try {
      const pricings = await partnerPricingService.getCoursePricings();
      setCoursePricings(pricings);
      const initialMap: Record<string, string> = {};
      pricings.forEach((item) => {
        initialMap[item.id] = (item.proposedPayableAmount ?? item.activePayableAmount).toString();
      });
      setPricingInputMap(initialMap);
    } catch (e) {
      console.error("Failed to load course pricings for agent:", e);
    }
  };

  const openCoursePricing = (agent: any) => openAgentView(agent, "pricing");
  const openAgentDetails = (agent: any) => openAgentView(agent, "details");

  const closeCoursePricing = () => {
    setSelectedAgentForPricing(null);
  };

  const handleProposePrice = async (courseId: string) => {
    const rawVal = pricingInputMap[courseId];
    const proposedNum = parseFloat(rawVal);
    if (isNaN(proposedNum) || proposedNum <= 0) {
      setPricingFeedback({ courseId, msg: "Please enter a valid positive amount", type: "error" });
      return;
    }

    setPricingSubmittingId(courseId);
    setPricingFeedback(null);
    try {
      const updatedItem = await partnerPricingService.submitProposedPrice(courseId, proposedNum);
      setCoursePricings((prev) => prev.map((item) => (item.id === courseId ? updatedItem : item)));
      setPricingFeedback({
        courseId,
        msg: `Proposed Hari Om payable price of ₹${proposedNum.toLocaleString("en-IN")} submitted for Master approval.`,
        type: "success",
      });
    } catch (err: any) {
      setPricingFeedback({ courseId, msg: err.message || "Failed to submit proposed price", type: "error" });
    } finally {
      setPricingSubmittingId(null);
    }
  };

  const openQrModal = (agent: any) => {
    setSelectedAgent(agent);
    setShowQrModal(true);
  };

  const openEditModal = (agent: any) => {
    setSelectedAgent(agent);
    setEditName(agent.name || "");
    setEditEmail(agent.email || "");
    setEditPhone(agent.phone || "");
    setEditAgencyName(agent.agencyName || "");
    setEditOfficeAddress(agent.officeAddress || "");
    setEditError("");
    setEditSuccess(false);
    setShowEditModal(true);
  };

  const handleEditAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError("");
    setEditSuccess(false);
    try {
      await agentAdminService.updateAgentDetails(selectedAgent.id, {
        name: editName,
        email: editEmail,
        phone: editPhone,
        agencyName: editAgencyName,
        officeAddress: editOfficeAddress
      });
      setEditSuccess(true);
      fetchAgents();
      setTimeout(() => {
        setShowEditModal(false);
      }, 1500);
    } catch (err: any) {
      setEditError(err.message || "Failed to update agent details.");
    }
  };

  const handleVerifyDocument = async (agentId: string, docId: string, status: string) => {
    try {
      await agentAdminService.verifyAgentDocument(agentId, docId, status, verificationRemarks);
      const updatedChecklist = await agentAdminService.getAgentOnboarding(agentId);
      setOnboardingChecklist(updatedChecklist);
      setVerificationRemarks("");
      setVerifyingDocId(null);
      fetchAgents();
    } catch (err) {
      console.error("Failed to verify document:", err);
    }
  };

  // Filters mapping
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = 
      agent.name?.toLowerCase().includes(search.toLowerCase()) ||
      agent.email?.toLowerCase().includes(search.toLowerCase()) ||
      (agent.referralCode && agent.referralCode.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = 
      statusFilter === "all" ||
      (statusFilter === "active" && agent.status === "Active") ||
      (statusFilter === "deactivated" && agent.status === "Deactivated") ||
      (statusFilter === "onboarding" && ["Invited", "Profile Pending", "Referral Pending"].includes(agent.onboardingStatus));

    return matchesSearch && matchesStatus;
  });

  if (selectedAgentForPricing) {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Top Breadcrumb & Back Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={closeCoursePricing}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                isDark
                  ? "bg-white/5 border-white/10 text-white hover:bg-white/10"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm"
              }`}
            >
              <ArrowLeft className="w-4 h-4 text-[#3D5EF6]" />
              Back to Agent Directory
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs font-medium opacity-60">
              <span>Agent Directory</span>
              <ChevronLeft className="w-3.5 h-3.5 rotate-180 opacity-40" />
              <span className="text-[#3D5EF6] font-bold">
                {activeAgentTab === "details" ? "Agent Profile & Documents" : "Course Pricing & Proposals"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#3D5EF6] px-3 py-1 rounded-full bg-[#3D5EF6]/10 border border-[#3D5EF6]/20">
              Agent Selected: {selectedAgentForPricing.name}
            </span>
          </div>
        </div>

        {/* Agent Overview Banner */}
        <div className={card}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#3D5EF6]/15 border border-[#3D5EF6]/30 flex items-center justify-center text-[#3D5EF6] text-sm font-black uppercase shrink-0">
                {selectedAgentForPricing.name?.slice(0, 2) || "AG"}
              </div>
              <div>
                <h1 className={`text-xl font-bold tracking-tight ${ht}`}>
                  {selectedAgentForPricing.name}
                </h1>
                <p className={`text-xs mt-1 ${mt}`}>
                  {selectedAgentForPricing.email} • {selectedAgentForPricing.phone || "+91 99999 88888"} • Agency: <span className={`font-bold ${valueText}`}>{selectedAgentForPricing.agencyName || selectedAgentForPricing.name}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                selectedAgentForPricing.status === "Active" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
              }`}>
                {selectedAgentForPricing.status}
              </span>
              <button
                onClick={() => openEditModal(selectedAgentForPricing)}
                className="px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Sub-Navigation Tabs */}
          <div className={`flex items-center gap-3 mt-6 pt-4 border-t ${isDark ? "border-white/10" : "border-slate-200"}`}>
            <button
              onClick={() => setActiveAgentTab("details")}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                activeAgentTab === "details"
                  ? "bg-[#3D5EF6] text-white shadow-md"
                  : isDark
                  ? "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              <FileText className="w-4 h-4" />
              Agent Profile & Verification Documents
            </button>

            <button
              onClick={() => setActiveAgentTab("pricing")}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                activeAgentTab === "pricing"
                  ? "bg-[#3D5EF6] text-white shadow-md"
                  : isDark
                  ? "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              <Tag className="w-4 h-4" />
              Course Pricing & Payable Proposals
            </button>
          </div>
        </div>

        {/* TAB 1: AGENT PROFILE & VERIFICATION DOCUMENTS */}
        {activeAgentTab === "details" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Grid 1: Operations & Summary KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className={`p-4 rounded-[16px] border-0 card-elevated flex items-center gap-3.5 ${isDark ? "bg-[#111827]" : "bg-white"}`}>
                <div className="p-2.5 rounded-[12px] bg-[#EEF1FE] text-[#3D5EF6] shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className={`text-[10px] font-bold uppercase ${labelText}`}>Seafarers Managed</p>
                  <p className="text-base font-bold text-[#3D5EF6] mt-0.5">142 Seafarers</p>
                </div>
              </div>

              <div className={`p-4 rounded-[16px] border-0 card-elevated flex items-center gap-3.5 ${isDark ? "bg-[#111827]" : "bg-white"}`}>
                <div className="p-2.5 rounded-[12px] bg-[#DCFCE7] text-[#16A34A] shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className={`text-[10px] font-bold uppercase ${labelText}`}>Course Purchases</p>
                  <p className="text-base font-bold text-[#16A34A] mt-0.5">38 Completed</p>
                </div>
              </div>

              <div className={`p-4 rounded-[16px] border-0 card-elevated flex items-center gap-3.5 ${isDark ? "bg-[#111827]" : "bg-white"}`}>
                <div className="p-2.5 rounded-[12px] bg-[#FEF3C7] text-[#B45309] shrink-0">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <p className={`text-[10px] font-bold uppercase ${labelText}`}>Total Settled Revenue</p>
                  <p className="text-base font-bold text-[#B45309] mt-0.5">₹14,50,000</p>
                </div>
              </div>
            </div>

            {/* Grid 2: Business Profile & Registered Office */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Business Profile */}
              <div className={card}>
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                  <div className="flex items-center gap-2.5">
                    <Building className="w-4.5 h-4.5 text-[#3D5EF6]" />
                    <h2 className="text-sm font-bold">Agency & Business Profile</h2>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Active Partner
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className={`flex justify-between py-1.5 border-b ${isDark ? "border-white/5" : "border-slate-100"}`}>
                    <span className={labelText}>Agency Name</span>
                    <span className={`font-bold ${valueText}`}>{selectedAgentForPricing.agencyName || selectedAgentForPricing.name}</span>
                  </div>
                  <div className={`flex justify-between py-1.5 border-b ${isDark ? "border-white/5" : "border-slate-100"}`}>
                    <span className={labelText}>Manning Registration / License</span>
                    <span className="font-mono font-bold text-[#3D5EF6]">ML-REG-2026-8890</span>
                  </div>
                  <div className={`flex justify-between py-1.5 border-b ${isDark ? "border-white/5" : "border-slate-100"}`}>
                    <span className={labelText}>Primary Contact Person</span>
                    <span className={`font-semibold ${valueText}`}>{selectedAgentForPricing.name}</span>
                  </div>
                  <div className={`flex justify-between py-1.5 border-b ${isDark ? "border-white/5" : "border-slate-100"}`}>
                    <span className={labelText}>Official Email</span>
                    <span className={`font-semibold ${valueText}`}>{selectedAgentForPricing.email}</span>
                  </div>
                  <div className={`flex justify-between py-1.5 border-b ${isDark ? "border-white/5" : "border-slate-100"}`}>
                    <span className={labelText}>Primary Contact Phone</span>
                    <span className={`font-semibold ${valueText}`}>{selectedAgentForPricing.phone || "+91 99999 88888"}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className={labelText}>Onboarding Progress</span>
                    <span className="font-bold text-emerald-500 dark:text-emerald-400">{selectedAgentForPricing.onboardingStatus || "Active"}</span>
                  </div>
                </div>
              </div>

              {/* Office Premises & Location */}
              <div className={card}>
                <div className={`flex items-center justify-between pb-3 border-b ${isDark ? "border-white/10" : "border-slate-100"} mb-4`}>
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4.5 h-4.5 text-[#3D5EF6]" />
                    <h2 className="text-sm font-bold">Registered Office Premises & Bank Account</h2>
                  </div>
                  <span className={`text-[10px] font-bold ${mt}`}>Verified Premises</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className={`py-1.5 border-b ${isDark ? "border-white/5" : "border-slate-100"}`}>
                    <span className={labelText}>Office Address</span>
                    <p className={`font-semibold ${valueText} mt-1 leading-relaxed`}>
                      {selectedAgentForPricing.officeAddress || "102 Maritime Towers, Off S.V. Road, Nariman Point, Mumbai, Maharashtra 400021"}
                    </p>
                  </div>
                  <div className={`flex justify-between py-1.5 border-b ${isDark ? "border-white/5" : "border-slate-100"}`}>
                    <span className={labelText}>City & State</span>
                    <span className={`font-semibold ${valueText}`}>Mumbai, Maharashtra</span>
                  </div>
                  <div className={`flex justify-between py-1.5 border-b ${isDark ? "border-white/5" : "border-slate-100"}`}>
                    <span className={labelText}>Bank Name & Account</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">HDFC Bank • A/C **** 4892</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className={labelText}>IFSC Code & Branch</span>
                    <span className={`font-mono font-semibold ${valueText}`}>HDFC0000123 (Nariman Pt)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid 2: Mandatory Verification Documents & Compliance */}
            <div className={card}>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-[#3D5EF6]" />
                    <h2 className="text-sm font-bold">Mandatory Verification Documents & Compliance</h2>
                  </div>
                  <p className={`text-xs mt-1 ${mt}`}>
                    Review and verify mandatory onboarding documents uploaded by the partner agency.
                  </p>
                </div>
                <button
                  onClick={() => handleViewOnboarding(selectedAgentForPricing)}
                  className="px-3 py-1.5 rounded-xl bg-[#3D5EF6]/10 hover:bg-[#3D5EF6]/20 text-[#3D5EF6] font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  Full KYC Checklist
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Document 1 */}
                <div className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#3D5EF6]">Manning License</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        Verified
                      </span>
                    </div>
                    <h3 className="font-bold text-xs mt-2">Company Manning License PDF</h3>
                    <p className={`text-[10px] mt-1 ${labelText}`}>Reg: ML-REG-2026-8890</p>
                  </div>
                  <button
                    onClick={() => window.open("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", "_blank")}
                    className="w-full py-2 rounded-xl bg-[#3D5EF6]/10 hover:bg-[#3D5EF6]/20 text-[#3D5EF6] font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View PDF
                  </button>
                </div>

                {/* Document 2 */}
                <div className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#3D5EF6]">Identity / GST</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        Verified
                      </span>
                    </div>
                    <h3 className="font-bold text-xs mt-2">GST & PAN Registration</h3>
                    <p className={`text-[10px] mt-1 ${labelText}`}>GSTIN: 27AAAAA0000A1Z5</p>
                  </div>
                  <button
                    onClick={() => window.open("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", "_blank")}
                    className="w-full py-2 rounded-xl bg-[#3D5EF6]/10 hover:bg-[#3D5EF6]/20 text-[#3D5EF6] font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View PDF
                  </button>
                </div>

                {/* Document 3 */}
                <div className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#3D5EF6]">Bank Mandate</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        Verified
                      </span>
                    </div>
                    <h3 className="font-bold text-xs mt-2">Cancelled Cheque & Mandate</h3>
                    <p className={`text-[10px] mt-1 ${labelText}`}>HDFC Bank • IFSC: HDFC0000123</p>
                  </div>
                  <button
                    onClick={() => window.open("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", "_blank")}
                    className="w-full py-2 rounded-xl bg-[#3D5EF6]/10 hover:bg-[#3D5EF6]/20 text-[#3D5EF6] font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View Cheque
                  </button>
                </div>

                {/* Document 4 */}
                <div className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#3D5EF6]">Empanlement</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        Verified
                      </span>
                    </div>
                    <h3 className="font-bold text-xs mt-2">Partner MoU Agreement</h3>
                    <p className={`text-[10px] mt-1 ${labelText}`}>Ref: MoU-THAL-2026-09</p>
                  </div>
                  <button
                    onClick={() => window.open("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", "_blank")}
                    className="w-full py-2 rounded-xl bg-[#3D5EF6]/10 hover:bg-[#3D5EF6]/20 text-[#3D5EF6] font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View MoU PDF
                  </button>
              </div>
            </div>
          </div>
        </div>
      )}

        {/* TAB 2: COURSE PRICING & PROPOSALS */}
        {activeAgentTab === "pricing" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Status KPI Summary Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className={`p-4 rounded-[16px] border-0 card-elevated flex items-center gap-3.5 ${isDark ? "bg-[#111827]" : "bg-white"}`}>
                <div className="p-2.5 rounded-[12px] bg-[#DCFCE7] text-[#16A34A] shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className={`text-[10px] font-bold uppercase ${labelText}`}>Active In-Use Prices</p>
                  <p className="text-base font-bold text-[#16A34A] mt-0.5">
                    {coursePricings.filter(c => c.status === "Active").length} Courses Active
                  </p>
                </div>
              </div>

              <div className={`p-4 rounded-[16px] border-0 card-elevated flex items-center gap-3.5 ${isDark ? "bg-[#111827]" : "bg-white"}`}>
                <div className="p-2.5 rounded-[12px] bg-[#FEF3C7] text-[#B45309] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className={`text-[10px] font-bold uppercase ${labelText}`}>Pending Master Review</p>
                  <p className="text-base font-bold text-[#B45309] mt-0.5">
                    {coursePricings.filter(c => c.status === "Pending Approval").length} Proposals Pending
                  </p>
                </div>
              </div>

              <div className={`p-4 rounded-[16px] border-0 card-elevated flex items-center gap-3.5 ${isDark ? "bg-[#111827]" : "bg-white"}`}>
                <div className="p-2.5 rounded-[12px] bg-[#FEE2E2] text-[#DC2626] shrink-0">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className={`text-[10px] font-bold uppercase ${labelText}`}>Rejected Proposals</p>
                  <p className="text-base font-bold text-[#DC2626] mt-0.5">
                    {coursePricings.filter(c => c.status === "Rejected").length} Proposals Rejected
                  </p>
                </div>
              </div>
            </div>

            {/* Full Width Course Pricing Management Card */}
            <div className={card}>
              <div className="flex items-center justify-between pb-4 border-b mb-4 border-white/10">
                <div>
                  <h2 className="text-sm font-bold tracking-tight">Applicable Course Fees & Proposed Hari Om Payable</h2>
                  <p className={`text-xs mt-0.5 ${mt}`}>
                    Enter or update proposed Hari Om payable price for any course and submit for Master Admin review.
                  </p>
                </div>
              </div>


              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className={`border-b pb-3 ${isDark ? "border-white/10 text-white/40" : "border-slate-200 text-slate-400"} uppercase text-[10px] font-bold tracking-wider`}>
                      <th className="py-3 px-3">Course Name & Code</th>
                      <th className="py-3 px-3 text-right">Standard Fee</th>
                      <th className="py-3 px-3 text-right">Active Hari Om Payable</th>
                      <th className="py-3 px-3 text-center">Proposed Hari Om Payable</th>
                      <th className="py-3 px-3 text-center">Status</th>
                      <th className="py-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className={isDark ? "divide-y divide-white/5" : "divide-y divide-slate-100"}>
                    {coursePricings.map((item) => {
                      const inputVal = pricingInputMap[item.id] ?? (item.proposedPayableAmount ?? item.activePayableAmount).toString();
                      const isPending = item.status === "Pending Approval";
                      const isRejected = item.status === "Rejected";
                      const feedback = pricingFeedback?.courseId === item.id ? pricingFeedback : null;

                      return (
                        <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                          {/* Course Details */}
                          <td className="py-4 px-3">
                            <p className="font-bold text-sm">{item.courseName}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#3D5EF6]/10 text-[#3D5EF6]">
                                {item.courseCode}
                              </span>
                              <span className={`text-[10px] ${labelText}`}>{item.category}</span>
                            </div>
                          </td>

                          {/* Standard Fee */}
                          <td className="py-4 px-3 text-right font-medium opacity-70">
                            ₹{item.standardFee.toLocaleString("en-IN")}
                          </td>

                          {/* Active Hari Om Payable */}
                          <td className="py-4 px-3 text-right">
                            <span className="font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-xl text-xs border border-emerald-500/20">
                              ₹{item.activePayableAmount.toLocaleString("en-IN")}
                            </span>
                          </td>

                          {/* Proposed Price Input */}
                          <td className="py-4 px-3 text-center">
                            <div className="flex flex-col items-center gap-1 max-w-[160px] mx-auto">
                              <div className="relative w-full">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold opacity-60">₹</span>
                                <input
                                  type="number"
                                  value={inputVal}
                                  onChange={(e) =>
                                    setPricingInputMap({ ...pricingInputMap, [item.id]: e.target.value })
                                  }
                                  placeholder="Amount"
                                  className={`w-full pl-8 pr-3 py-2 rounded-xl border text-xs font-bold outline-none transition ${inputBg}`}
                                />
                              </div>
                              {item.proposedPayableAmount && (
                                <span className="text-[10px] font-semibold text-amber-500">
                                  Proposed: ₹{item.proposedPayableAmount.toLocaleString("en-IN")}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Status Badge */}
                          <td className="py-4 px-3 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span
                                className={`px-3 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 ${
                                  isPending
                                    ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                    : isRejected
                                    ? "bg-red-500/10 text-red-500 border border-red-500/20"
                                    : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                }`}
                              >
                                {isPending && <Clock className="w-3.5 h-3.5 animate-spin" />}
                                {isRejected && <XCircle className="w-3.5 h-3.5" />}
                                {!isPending && !isRejected && <CheckCircle2 className="w-3.5 h-3.5" />}
                                {item.status}
                              </span>
                              {isRejected && item.rejectionReason && (
                                <span className="text-[10px] text-red-400 max-w-[140px] truncate" title={item.rejectionReason}>
                                  {item.rejectionReason}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Submit Action */}
                          <td className="py-4 px-3 text-right">
                            <button
                              onClick={() => handleProposePrice(item.id)}
                              disabled={pricingSubmittingId === item.id}
                              className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 ml-auto transition cursor-pointer ${
                                isPending
                                  ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                                  : "bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white shadow-md"
                              }`}
                            >
                              {pricingSubmittingId === item.id ? (
                                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Send className="w-3.5 h-3.5" />
                              )}
                              {isPending ? "Update Proposal" : "Submit Price"}
                            </button>

                            {feedback && (
                              <p className={`text-[10px] mt-1.5 font-semibold ${feedback.type === "success" ? "text-emerald-400" : "text-red-400"}`}>
                                {feedback.msg}
                              </p>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${ht}`}>Agent Directory</h1>
          <p className={`text-xs mt-1.5 ${mt}`}>Manage placement agent accounts, commissions, and onboarding checklist progress.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white font-semibold text-xs shadow-md transition cursor-pointer self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          Add Manning Agent
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <label className={`flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm ${isDark ? "bg-white/5 border-white/10 text-white/60" : "bg-white border-slate-200 text-slate-600 shadow-sm"}`}>
          <Search className="w-4 h-4 opacity-55" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search agents by name or email..."
            className="bg-transparent outline-none w-full text-xs"
          />
        </label>
        
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-3 py-2.5 rounded-[10px] border text-xs font-semibold outline-none cursor-pointer ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-[#E5E7EB] text-[#111827] shadow-sm"}`}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Accounts</option>
            <option value="deactivated">Deactivated</option>
            <option value="onboarding">In Onboarding</option>
          </select>

          <button 
            onClick={fetchAgents}
            className={`p-2.5 rounded-xl border flex items-center justify-center cursor-pointer transition ${isDark ? "border-white/10 hover:bg-white/5 text-white/50" : "border-slate-200 hover:bg-slate-50 text-slate-500 shadow-sm"}`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Agents Table List */}
      <div className={card}>
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="w-8 h-8 border-4 border-[#3D5EF6] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredAgents.length === 0 ? (
          <div className="text-center py-10">
            <p className={`text-xs ${mt}`}>No manning agents found matching your query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b pb-3 ${isDark ? "border-white/5 text-white/30" : "border-slate-100 text-slate-400"} uppercase font-semibold tracking-wider`}>
                  <th className="py-3.5 px-2">Name & Info</th>
                  <th className="py-3.5 px-2 text-center">Agent Profile & Docs</th>
                  <th className="py-3.5 px-2 text-center">Course Pricing</th>
                  <th className="py-3.5 px-2">Onboarding</th>
                  <th className="py-3.5 px-2">Status</th>
                  <th className="py-3.5 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={isDark ? "divide-y divide-white/5" : "divide-y divide-slate-100"}>
                {filteredAgents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-white/[0.03] transition-all cursor-pointer group">
                    {/* User Info - Click opens Agent Profile & Documents */}
                    <td className="py-4 px-2" onClick={() => openAgentDetails(agent)}>
                      <p className={`font-bold group-hover:text-[#3D5EF6] transition ${isDark ? "text-white/95" : "text-slate-800"}`}>{agent.name}</p>
                      <p className={`text-[10px] mt-0.5 ${labelText}`}>{agent.email}</p>
                      {agent.phone && <p className={`text-[10px] mt-0.5 ${labelText}`}>{agent.phone}</p>}
                    </td>

                    {/* Agent Profile & Verification Documents Action Button */}
                    <td className="py-4 px-2 text-center">
                      <button
                        onClick={() => openAgentDetails(agent)}
                        className="px-3 py-1.5 rounded-full text-[10px] font-bold bg-[#3D5EF6]/10 text-[#3D5EF6] hover:bg-[#3D5EF6]/20 transition flex items-center gap-1.5 mx-auto cursor-pointer border border-[#3D5EF6]/20"
                        title="View Agent Profile, Address, Manning License & Documents"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Profile & Docs
                      </button>
                    </td>

                    {/* Course Pricing Action Button */}
                    <td className="py-4 px-2 text-center">
                      <button
                        onClick={() => openCoursePricing(agent)}
                        className="px-3 py-1.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition flex items-center gap-1.5 mx-auto cursor-pointer border border-amber-500/20"
                        title="Click to manage Hari Om course pricing and price proposals"
                      >
                        <Tag className="w-3.5 h-3.5" />
                        Course Pricing
                      </button>
                    </td>

                    {/* Onboarding Checklist Status */}
                    <td className="py-4 px-2">
                      <button
                        onClick={() => handleViewOnboarding(agent)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition ${
                          agent.onboardingStatus === "Active" 
                            ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" 
                            : agent.onboardingStatus === "Inactive"
                            ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                            : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10"
                        }`}
                      >
                        <CheckSquare className="w-3.5 h-3.5" />
                        {agent.onboardingStatus}
                      </button>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        agent.status === "Active" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                      }`}>
                        {agent.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-2 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openAgentDetails(agent)}
                          className={`p-1.5 rounded-lg border transition ${isDark ? "border-[#3D5EF6]/20 bg-[#3D5EF6]/10 text-[#3D5EF6] hover:bg-[#3D5EF6]/20" : "border-[#3D5EF6]/30 bg-[#3D5EF6]/10 text-[#3D5EF6] hover:bg-[#3D5EF6]/20"}`}
                          title="View Agent Profile & Verification Documents"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openCoursePricing(agent)}
                          className={`p-1.5 rounded-lg border transition ${isDark ? "border-amber-500/20 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20" : "border-amber-500/30 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"}`}
                          title="Manage Course Pricing & Proposals"
                        >
                          <Tag className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(agent)}
                          className={`p-1.5 rounded-lg border transition ${isDark ? "border-white/5 hover:bg-white/5 text-white/50 hover:text-white" : "border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800"}`}
                          title="Edit Agent Info"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openPasswordModal(agent)}
                          className={`p-1.5 rounded-lg border transition ${isDark ? "border-white/5 hover:bg-white/5 text-white/50 hover:text-white" : "border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800"}`}
                          title="Reset Password"
                        >
                          <Key className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(agent)}
                          className={`p-1.5 rounded-lg border transition ${isDark ? "border-white/5 hover:bg-white/5 text-white/50 hover:text-white" : "border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800"}`}
                          title={agent.status === "Active" ? "Deactivate Account" : "Activate Account"}
                        >
                          {agent.status === "Active" ? <ToggleRight className="w-3.5 h-3.5 text-emerald-500" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- CREATE AGENT MODAL --- */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-6 rounded-[16px] card-elevated border-0 relative shadow-2xl ${isDark ? "bg-[#111827] text-white" : "bg-white text-[#111827]"}`}>
            <button 
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/5 opacity-50 hover:opacity-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 border-b pb-4 mb-4 border-white/5">
              <Users className="w-5 h-5 text-[#3D5EF6]" />
              <h3 className="text-sm font-bold">Onboard New Manning Placement Agent</h3>
            </div>

            {createError && <p className="mb-4 text-xs text-[#DC2626] bg-[#FEE2E2] p-2 rounded-[10px] font-semibold">{createError}</p>}
            {createSuccess && <p className="mb-4 text-xs text-[#16A34A] bg-[#DCFCE7] p-2 rounded-[10px] font-semibold">Agent created successfully! Sending invite...</p>}

            <form onSubmit={handleCreateAgent} className="space-y-4">
              <div className="space-y-1">
                <label className={`text-[10px] font-bold ${labelText}`}>Full Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Suraj Sahani"
                  className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${inputBg}`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-[10px] font-bold ${labelText}`}>Email Address *</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. agent@manning.com"
                  className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${inputBg}`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-[10px] font-bold ${labelText}`}>Initial Account Password *</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${inputBg}`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-[10px] font-bold ${labelText}`}>Mobile Number (Optional)</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="e.g. +91 9988776655"
                  className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${inputBg}`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-[10px] font-bold ${labelText}`}>General Commission Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newGenComm}
                  onChange={(e) => setNewGenComm(e.target.value)}
                  placeholder="e.g. 5.0"
                  className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${inputBg}`}
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white rounded-xl font-bold text-xs shadow-md transition cursor-pointer"
              >
                Onboard Agent
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- RESET PASSWORD MODAL --- */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-sm p-6 rounded-[16px] card-elevated border-0 relative shadow-2xl ${isDark ? "bg-[#111827] text-white" : "bg-white text-[#111827]"}`}>
            <button 
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/5 opacity-50 hover:opacity-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 border-b pb-4 mb-4 border-white/5">
              <Key className="w-5 h-5 text-[#3D5EF6]" />
              <h3 className="text-sm font-bold">Reset Password</h3>
            </div>
            <p className={`text-[11px] mb-4 ${labelText}`}>Reset password for {selectedAgent?.name}. The agent will use this to sign in.</p>

            {passError && <p className="mb-4 text-xs text-[#DC2626] bg-[#FEE2E2] p-2 rounded-[10px] font-semibold">{passError}</p>}
            {passSuccess && <p className="mb-4 text-xs text-[#16A34A] bg-[#DCFCE7] p-2 rounded-[10px] font-semibold">Password reset successfully!</p>}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1">
                <label className={`text-[10px] font-bold ${labelText}`}>New Password</label>
                <input
                  type="password"
                  required
                  value={resetPass}
                  onChange={(e) => setResetPass(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${inputBg}`}
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white rounded-xl font-bold text-xs shadow-md transition cursor-pointer"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT COMMISSIONS MODAL --- */}
      {showCommissionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-6 rounded-[16px] card-elevated border-0 relative shadow-2xl ${isDark ? "bg-[#111827] text-white" : "bg-white text-[#111827]"}`}>
            <button 
              onClick={() => setShowCommissionModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/5 opacity-50 hover:opacity-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 border-b pb-4 mb-4 border-white/5">
              <Percent className="w-5 h-5 text-[#3D5EF6]" />
              <h3 className="text-sm font-bold">Commission overrides</h3>
            </div>
            <p className={`text-[11px] mb-4 ${labelText}`}>Edit commission percentages for {selectedAgent?.name}.</p>

            {commError && <p className="mb-4 text-xs text-red-500 bg-red-500/10 p-2 rounded-lg">{commError}</p>}
            {commSuccess && <p className="mb-4 text-xs text-emerald-500 bg-emerald-500/10 p-2 rounded-lg">Commissions updated successfully!</p>}

            <form onSubmit={handleUpdateCommission} className="space-y-4">
              <div className="space-y-1">
                <label className={`text-[10px] font-bold ${labelText}`}>General Commission (%)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={generalComm}
                  onChange={(e) => setGeneralComm(parseFloat(e.target.value) || 5.0)}
                  placeholder="e.g. 5.0"
                  className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${inputBg}`}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className={`text-[10px] font-bold ${labelText}`}>Course Override (STCW BST Override)</label>
                </div>
                <input
                  type="number"
                  step="0.1"
                  value={courseComm["STCW BST"] || ""}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setCourseComm(prev => ({
                      ...prev,
                      "STCW BST": isNaN(val) ? 0 : val
                    }));
                  }}
                  placeholder="e.g. 8.0 (Override general commission for BST)"
                  className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${inputBg}`}
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white rounded-xl font-bold text-xs shadow-md transition cursor-pointer"
              >
                Save Commissions
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- ONBOARDING DETAILS MODAL --- */}
      {showOnboardingModal && onboardingChecklist && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-2xl p-6 rounded-[16px] card-elevated border-0 relative shadow-2xl overflow-y-auto max-h-[90vh] ${isDark ? "bg-[#111827] text-white" : "bg-white text-[#111827]"}`}>
            <button 
              onClick={() => setShowOnboardingModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/5 opacity-50 hover:opacity-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 border-b pb-4 mb-4 border-white/5">
              <CheckSquare className="w-5 h-5 text-[#3D5EF6]" />
              <h3 className="text-sm font-bold">Onboarding & KYC Verification</h3>
            </div>
            
            <div className="mb-6">
              <p className={`text-xs font-bold ${isDark ? "text-white/80" : "text-slate-800"}`}>{selectedAgent?.name}</p>
              <p className={`text-[10px] ${labelText}`}>Status: {onboardingChecklist.status}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Checklist Column */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#3D5EF6] mb-2">Checklist Steps</h4>
                {onboardingChecklist.checklist.map((step: any) => (
                  <div key={step.step} className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                      step.status === 'completed'
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-white/5 border border-white/10 text-white/30"
                    }`}>
                      {step.status === 'completed' ? <Check className="w-3.5 h-3.5" /> : step.step}
                    </div>
                    <div>
                      <p className={`text-xs font-semibold ${step.status === 'completed' ? (isDark ? "text-white" : "text-slate-850") : (isDark ? "text-white/30" : "text-slate-400")}`}>{step.label}</p>
                      <p className={`text-[10px] mt-0.5 ${step.status === 'completed' ? "text-emerald-500/80" : labelText}`}>
                        {step.status === 'completed' ? 'Completed' : 'Pending'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Documents Verification Column */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#3D5EF6] mb-2">KYC Credentials Documents</h4>
                {(!onboardingChecklist.documents || onboardingChecklist.documents.length === 0) ? (
                  <p className={`text-xs italic ${mt}`}>No verification credentials uploaded yet.</p>
                ) : (
                  <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                    {onboardingChecklist.documents.map((doc: any) => (
                      <div key={doc.id} className={`p-3 rounded-2xl border ${isDark ? "bg-slate-900/40 border-white/5" : "bg-slate-50 border-slate-200"}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs font-bold capitalize">{doc.type.replace(/([A-Z])/g, ' $1')}</p>
                            <a
                              href={`http://localhost:4000${doc.url}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-[#3D5EF6] hover:underline mt-0.5 block truncate max-w-[180px]"
                            >
                              {(doc.name || "").split("|||")[0]}
                            </a>
                            {(() => {
                              const rawName = doc.name || "";
                              if (rawName.includes("|||")) {
                                try {
                                  const meta = JSON.parse(rawName.split("|||")[1]);
                                  return (
                                    <div className={`mt-2 space-y-0.5 text-[9px] border-l pl-2 font-semibold ${isDark ? "border-white/10 text-white/50" : "border-slate-200 text-slate-500"}`}>
                                      {meta.number && <p><span className="opacity-60">Number:</span> {meta.number}</p>}
                                      {meta.issueDate && <p><span className="opacity-60">Issued:</span> {new Date(meta.issueDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}</p>}
                                      {doc.expiryDate && <p><span className="opacity-60">Expires:</span> {new Date(doc.expiryDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}</p>}
                                      {meta.issuePlace && <p><span className="opacity-60">Place:</span> {meta.issuePlace}</p>}
                                    </div>
                                  );
                                } catch (e) {
                                  console.warn("Failed to parse document metadata JSON:", e);
                                }
                              } else if (doc.expiryDate) {
                                return (
                                  <div className={`mt-2 space-y-0.5 text-[9px] border-l pl-2 font-semibold ${isDark ? "border-white/10 text-white/50" : "border-slate-200 text-slate-500"}`}>
                                    <p><span className="opacity-60">Expires:</span> {new Date(doc.expiryDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                  </div>
                                );
                              }
                              return null;
                            })()}
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            doc.status === 'Verified'
                              ? "bg-emerald-500/10 text-emerald-500"
                              : doc.status === 'Rejected'
                              ? "bg-red-500/10 text-red-500"
                              : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10"
                          }`}>
                            {doc.status}
                          </span>
                        </div>

                        {/* Verification Actions */}
                        {doc.status !== 'Verified' && (
                          <div className="mt-3 pt-3 border-t border-white/5 flex flex-col gap-2">
                            {verifyingDocId === doc.id ? (
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  placeholder="Reason / Remarks (mandatory for reject)"
                                  value={verificationRemarks}
                                  onChange={(e) => setVerificationRemarks(e.target.value)}
                                  className={`w-full px-2.5 py-1.5 rounded-lg border text-[10px] outline-none ${inputBg}`}
                                />
                                <div className="flex gap-2 justify-end">
                                  <button
                                    onClick={() => setVerifyingDocId(null)}
                                    className="px-2.5 py-1 rounded bg-slate-800 text-[9px] hover:bg-slate-700 text-white"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handleVerifyDocument(selectedAgent.id, doc.id, 'Rejected')}
                                    disabled={!verificationRemarks.trim()}
                                    className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 text-[9px] text-white disabled:opacity-50"
                                  >
                                    Reject
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex gap-2 justify-end">
                                <button
                                  onClick={() => setVerifyingDocId(doc.id)}
                                  className="px-2.5 py-1 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 text-[9px]"
                                >
                                  Reject
                                </button>
                                <button
                                  onClick={() => handleVerifyDocument(selectedAgent.id, doc.id, 'Verified')}
                                  className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-[9px] text-white"
                                >
                                  Verify
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT AGENT MODAL --- */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-6 rounded-[16px] card-elevated border-0 relative shadow-2xl ${isDark ? "bg-[#111827] text-white" : "bg-white text-[#111827]"}`}>
            <button 
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/5 opacity-50 hover:opacity-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 border-b pb-4 mb-4 border-white/5">
              <Edit2 className="w-5 h-5 text-[#3D5EF6]" />
              <h3 className="text-sm font-bold">Edit Agent Information</h3>
            </div>

            {editError && <p className="mb-4 text-xs text-[#DC2626] bg-[#FEE2E2] p-2 rounded-[10px] font-semibold">{editError}</p>}
            {editSuccess && <p className="mb-4 text-xs text-[#16A34A] bg-[#DCFCE7] p-2 rounded-[10px] font-semibold">Agent profile updated successfully!</p>}

            <form onSubmit={handleEditAgent} className="space-y-4">
              <div className="space-y-1">
                <label className={`text-[10px] font-bold ${labelText}`}>Full Name *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${inputBg}`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-[10px] font-bold ${labelText}`}>Email Address *</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${inputBg}`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-[10px] font-bold ${labelText}`}>Mobile Number</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${inputBg}`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-[10px] font-bold ${labelText}`}>Agency Company Name</label>
                <input
                  type="text"
                  value={editAgencyName}
                  onChange={(e) => setEditAgencyName(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${inputBg}`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-[10px] font-bold ${labelText}`}>Office Premises Address</label>
                <input
                  type="text"
                  value={editOfficeAddress}
                  onChange={(e) => setEditOfficeAddress(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${inputBg}`}
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white rounded-xl font-bold text-xs shadow-md transition cursor-pointer"
              >
                Save Details
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
