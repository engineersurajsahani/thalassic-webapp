"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTheme } from "@/providers/theme-provider";
import { agentAdminService } from "@/services/agent-admin.service";
import { 
  Users, Plus, Search, Edit2, Key, ToggleLeft, ToggleRight, Check,
  QrCode, AlertCircle, RefreshCw, X, Percent, CheckSquare, Sparkles
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
  const [newGenComm, setNewGenComm] = useState(5.0);
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

  const card = `rounded-3xl overflow-hidden p-6 ${isDark ? "bg-[#0d1f35] border border-white/[0.06]" : "bg-white border border-slate-200 shadow-sm"}`;
  const inputBg = isDark ? "bg-white/5 border-white/10 text-white placeholder:text-white/20" : "bg-slate-50 border-slate-200 text-slate-700 placeholder:text-slate-400";
  const labelText = isDark ? "text-white/50" : "text-slate-500";
  const ht = isDark ? "text-white/80" : "text-slate-800";
  const mt = isDark ? "text-white/35" : "text-slate-400";

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
        generalCommission: newGenComm,
      });

      setCreateSuccess(true);
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      setNewPhone("");
      setNewGenComm(5.0);
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
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-md transition cursor-pointer self-start sm:self-center"
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
            placeholder="Search agents by name, email, or referral code..."
            className="bg-transparent outline-none w-full text-xs"
          />
        </label>
        
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-3 py-2.5 rounded-xl border text-xs font-semibold outline-none cursor-pointer ${isDark ? "bg-[#0d1f35] border-white/10 text-white" : "bg-white border-slate-200 text-slate-700 shadow-sm"}`}
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
            <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
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
                  <th className="py-3.5 px-2">Onboarding</th>
                  <th className="py-3.5 px-2">Referral Code</th>
                  <th className="py-3.5 px-2 text-center">Comm. (Gen)</th>
                  <th className="py-3.5 px-2">Status</th>
                  <th className="py-3.5 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={isDark ? "divide-y divide-white/5" : "divide-y divide-slate-100"}>
                {filteredAgents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-white/[0.01] transition-all">
                    {/* User Info */}
                    <td className="py-4 px-2">
                      <p className={`font-bold ${isDark ? "text-white/95" : "text-slate-800"}`}>{agent.name}</p>
                      <p className={`text-[10px] mt-0.5 ${labelText}`}>{agent.email}</p>
                      {agent.phone && <p className={`text-[10px] mt-0.5 ${labelText}`}>{agent.phone}</p>}
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
                            : "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                        }`}
                      >
                        <CheckSquare className="w-3.5 h-3.5" />
                        {agent.onboardingStatus}
                      </button>
                    </td>

                    {/* Referral details */}
                    <td className="py-4 px-2">
                      {agent.referralCode ? (
                        <div className="flex items-center gap-2">
                          <span className={`font-mono font-bold px-2 py-0.5 rounded ${isDark ? "bg-white/5 text-cyan-400" : "bg-slate-100 text-cyan-600"}`}>
                            {agent.referralCode}
                          </span>
                          <button
                            onClick={() => openQrModal(agent)}
                            className={`p-1 rounded hover:bg-white/5 text-cyan-400`}
                            title="View QR Code Link"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className={`text-[10px] italic ${labelText}`}>No Code Created (Pending Onboarding)</span>
                      )}
                    </td>

                    {/* Commissions */}
                    <td className="py-4 px-2 text-center font-semibold">
                      {agent.generalCommission}%
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
                          onClick={() => openEditModal(agent)}
                          className={`p-1.5 rounded-lg border transition ${isDark ? "border-white/5 hover:bg-white/5 text-white/50 hover:text-white" : "border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800"}`}
                          title="Edit Agent Info"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openCommissionModal(agent)}
                          className={`p-1.5 rounded-lg border transition ${isDark ? "border-white/5 hover:bg-white/5 text-white/50 hover:text-white" : "border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800"}`}
                          title="Manage Commissions"
                        >
                          <Percent className="w-3.5 h-3.5" />
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
          <div className={`w-full max-w-md p-6 rounded-3xl relative shadow-2xl ${isDark ? "bg-[#0d1f35] border border-white/5 text-white" : "bg-white border border-slate-200 text-slate-800"}`}>
            <button 
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/5 opacity-50 hover:opacity-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 border-b pb-4 mb-4 border-white/5">
              <Users className="w-5 h-5 text-cyan-500" />
              <h3 className="text-sm font-bold">Onboard New Agent</h3>
            </div>

            {createError && <p className="mb-4 text-xs text-red-500 bg-red-500/10 p-2 rounded-lg">{createError}</p>}
            {createSuccess && <p className="mb-4 text-xs text-emerald-500 bg-emerald-500/10 p-2 rounded-lg">Agent created successfully! Sending invite...</p>}

            <form onSubmit={handleCreateAgent} className="space-y-4">
              <div className="space-y-1">
                <label className={`text-[10px] font-bold ${labelText}`}>Full Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Pacific Ship Management"
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
                  placeholder="e.g. operations@pacificship.com"
                  className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${inputBg}`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-[10px] font-bold ${labelText}`}>Temporary Password *</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="e.g. TemporaryPass123!"
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
                  onChange={(e) => setNewGenComm(parseFloat(e.target.value) || 5.0)}
                  placeholder="e.g. 5.0"
                  className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${inputBg}`}
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold text-xs shadow-md transition cursor-pointer"
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
          <div className={`w-full max-w-sm p-6 rounded-3xl relative shadow-2xl ${isDark ? "bg-[#0d1f35] border border-white/5 text-white" : "bg-white border border-slate-200 text-slate-800"}`}>
            <button 
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/5 opacity-50 hover:opacity-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 border-b pb-4 mb-4 border-white/5">
              <Key className="w-5 h-5 text-cyan-500" />
              <h3 className="text-sm font-bold">Reset Password</h3>
            </div>
            <p className={`text-[11px] mb-4 ${labelText}`}>Reset password for {selectedAgent?.name}. The agent will use this to sign in.</p>

            {passError && <p className="mb-4 text-xs text-red-500 bg-red-500/10 p-2 rounded-lg">{passError}</p>}
            {passSuccess && <p className="mb-4 text-xs text-emerald-500 bg-emerald-500/10 p-2 rounded-lg">Password reset successfully!</p>}

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
                className="w-full mt-4 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold text-xs shadow-md transition cursor-pointer"
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
          <div className={`w-full max-w-md p-6 rounded-3xl relative shadow-2xl ${isDark ? "bg-[#0d1f35] border border-white/5 text-white" : "bg-white border border-slate-200 text-slate-800"}`}>
            <button 
              onClick={() => setShowCommissionModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/5 opacity-50 hover:opacity-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 border-b pb-4 mb-4 border-white/5">
              <Percent className="w-5 h-5 text-cyan-500" />
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
                className="w-full mt-4 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold text-xs shadow-md transition cursor-pointer"
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
          <div className={`w-full max-w-2xl p-6 rounded-3xl relative shadow-2xl overflow-y-auto max-h-[90vh] ${isDark ? "bg-[#0d1f35] border border-white/5 text-white" : "bg-white border border-slate-200 text-slate-800"}`}>
            <button 
              onClick={() => setShowOnboardingModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/5 opacity-50 hover:opacity-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 border-b pb-4 mb-4 border-white/5">
              <CheckSquare className="w-5 h-5 text-cyan-500" />
              <h3 className="text-sm font-bold">Onboarding & KYC Verification</h3>
            </div>
            
            <div className="mb-6">
              <p className={`text-xs font-bold ${isDark ? "text-white/80" : "text-slate-800"}`}>{selectedAgent?.name}</p>
              <p className={`text-[10px] ${labelText}`}>Status: {onboardingChecklist.status}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Checklist Column */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">Checklist Steps</h4>
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
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">KYC Credentials Documents</h4>
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
                              className="text-[10px] text-cyan-400 hover:underline mt-0.5 block truncate max-w-[180px]"
                            >
                              {doc.name}
                            </a>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            doc.status === 'Verified'
                              ? "bg-emerald-500/10 text-emerald-500"
                              : doc.status === 'Rejected'
                              ? "bg-red-500/10 text-red-500"
                              : "bg-amber-500/10 text-amber-500"
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
          <div className={`w-full max-w-md p-6 rounded-3xl relative shadow-2xl ${isDark ? "bg-[#0d1f35] border border-white/5 text-white" : "bg-white border border-slate-200 text-slate-800"}`}>
            <button 
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/5 opacity-50 hover:opacity-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 border-b pb-4 mb-4 border-white/5">
              <Edit2 className="w-5 h-5 text-cyan-500" />
              <h3 className="text-sm font-bold">Edit Agent Information</h3>
            </div>

            {editError && <p className="mb-4 text-xs text-red-500 bg-red-500/10 p-2 rounded-lg">{editError}</p>}
            {editSuccess && <p className="mb-4 text-xs text-emerald-500 bg-emerald-500/10 p-2 rounded-lg">Agent profile updated successfully!</p>}

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
                className="w-full mt-4 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold text-xs shadow-md transition cursor-pointer"
              >
                Save Details
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- QR CODE DISPLAY MODAL --- */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-sm p-6 rounded-3xl relative text-center shadow-2xl ${isDark ? "bg-[#0d1f35] border border-white/5 text-white" : "bg-white border border-slate-200 text-slate-800"}`}>
            <button 
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/5 opacity-50 hover:opacity-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex flex-col items-center justify-center py-4 space-y-4">
              <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-500">
                <QrCode className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-sm font-bold">{selectedAgent?.name}</h3>
                <p className={`text-[10px] mt-1 ${labelText}`}>Referral Code: <span className="font-mono font-bold text-cyan-400">{selectedAgent?.referralCode}</span></p>
              </div>

              {/* Mock QR code container */}
              <div className={`w-44 h-44 rounded-2xl p-4 flex flex-col items-center justify-center border ${isDark ? "bg-white border-white/10" : "bg-slate-50 border-slate-200 shadow-inner"}`}>
                <div className="w-36 h-36 relative flex items-center justify-center border-4 border-dashed border-cyan-500/30 rounded-xl bg-slate-900 text-white font-mono text-[10px] text-center p-2 leading-relaxed">
                  <div>
                    <Sparkles className="w-5 h-5 text-cyan-400 mx-auto mb-1 animate-pulse" />
                    QR Code Link:<br />
                    thalassic.in/?ref={selectedAgent?.referralCode}
                  </div>
                </div>
              </div>

              <div className="text-left w-full space-y-2">
                <p className={`text-[10px] font-bold ${labelText}`}>Referral Link</p>
                <input
                  type="text"
                  readOnly
                  value={`https://hariomthalassic.com/?ref=${selectedAgent?.referralCode}`}
                  className={`w-full px-3 py-2 rounded-xl border text-[10px] font-mono select-all outline-none ${inputBg}`}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
