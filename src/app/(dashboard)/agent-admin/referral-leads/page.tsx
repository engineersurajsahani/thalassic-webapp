"use client";
import toast from 'react-hot-toast';

import React, { useEffect, useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import { agentAdminService } from "@/services/agent-admin.service";
import { 
  Search, FileText, Calendar, User, Compass, RefreshCw, ClipboardList, ShieldCheck, Info, X 
} from "lucide-react";

export default function ReferralsTracker() {
  const { theme, mounted } = useTheme();

  const isDark = mounted ? theme === "dark" : true;

  const [activeTab, setActiveTab] = useState<"leads" | "purchases" | "conflicts">("leads");
  const [loading, setLoading] = useState(true);

  // Data states
  const [leads, setLeads] = useState<any[]>([]);
  const [seafarers, setSeafarers] = useState<any[]>([]);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [remarksMap, setRemarksMap] = useState<Record<string, string>>({});
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  // Filter states
  const [searchLeads, setSearchLeads] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchPurchases, setSearchPurchases] = useState("");

  const card = `rounded-[16px] p-7 border-0 card-elevated transition-all duration-300 hover:-translate-y-0.5 ${
    isDark
      ? "bg-[#111827] text-white"
      : "bg-white text-[#111827]"
  }`;
  const labelText = isDark ? "text-white/50" : "text-[#6B7280]";
  const ht = isDark ? "text-white/80" : "text-[#111827]";
  const mt = isDark ? "text-white/35" : "text-[#9CA3AF]";
  const borderB = isDark ? "border-white/5" : "border-slate-100";

  const loadData = async () => {
    setLoading(true);
    try {
      const [leadsList, seafarersList, conflictsList] = await Promise.all([
        agentAdminService.getReferralLeads(),
        agentAdminService.getReferredSeafarers(),
        agentAdminService.getReferralConflicts()
      ]);
      setLeads(leadsList);
      setSeafarers(seafarersList);
      setConflicts(conflictsList);
    } catch (err) {
      console.error("Failed to load referral data: ", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveConflict = async (purchaseId: string, approvedAgentId: string) => {
    const remarks = remarksMap[purchaseId] || "First valid registration matching seafarer.";
    setResolvingId(purchaseId);
    try {
      await agentAdminService.resolveConflict(purchaseId, approvedAgentId, remarks);
      toast.success("Referral dispute resolved successfully!");
      await loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to resolve conflict.");
    } finally {
      setResolvingId(null);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter logic for Leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name?.toLowerCase().includes(searchLeads.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchLeads.toLowerCase()) ||
      lead.agentName?.toLowerCase().includes(searchLeads.toLowerCase());

    const matchesStatus = 
      statusFilter === "all" ||
      lead.status.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Filter logic for Purchases
  const filteredSeafarers = seafarers.filter(sf => {
    return (
      sf.seafarerName?.toLowerCase().includes(searchPurchases.toLowerCase()) ||
      sf.courseName?.toLowerCase().includes(searchPurchases.toLowerCase()) ||
      sf.agentName?.toLowerCase().includes(searchPurchases.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${ht}`}>Referrals Tracker</h1>
          <p className={`text-xs mt-1.5 ${mt}`}>
            Monitor referral pipeline leads and course bookings referred by agents.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex border-b ${borderB}`}>
        <button
          onClick={() => setActiveTab("leads")}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === "leads"
              ? "border-[#3D5EF6] text-[#3D5EF6]"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Referral Pipeline (Leads)
        </button>
        <button
          onClick={() => setActiveTab("purchases")}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === "purchases"
              ? "border-[#3D5EF6] text-[#3D5EF6]"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Referred Purchases (Bookings)
        </button>
        <button
          onClick={() => setActiveTab("conflicts")}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === "conflicts"
              ? "border-[#3D5EF6] text-[#3D5EF6]"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Conflicting Referrals (Manual Review)
        </button>
      </div>

      {activeTab === "leads" ? (
        <>
          {/* Leads Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <label className={`flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm ${isDark ? "bg-white/5 border-white/10 text-white/60" : "bg-white border-slate-200 text-slate-600 shadow-sm"}`}>
              <Search className="w-4 h-4 opacity-55" />
              <input
                type="text"
                value={searchLeads}
                onChange={(e) => setSearchLeads(e.target.value)}
                placeholder="Search leads by name, email, or agent..."
                className="bg-transparent outline-none w-full text-xs"
              />
            </label>
            
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`px-3 py-2.5 rounded-xl border text-xs font-semibold outline-none cursor-pointer ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-[#E5E7EB] text-[#111827] shadow-sm"}`}
              >
                <option value="all">All Statuses</option>
                <option value="new">New Leads</option>
                <option value="contacted">Contacted</option>
                <option value="registered">Registered</option>
                <option value="converted">Converted</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <button 
                onClick={loadData}
                className={`p-2.5 rounded-xl border flex items-center justify-center cursor-pointer transition ${isDark ? "border-white/10 hover:bg-white/5 text-white/50" : "border-slate-200 hover:bg-slate-50 text-slate-500 shadow-sm"}`}
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Leads Table */}
          <div className={card}>
            {loading ? (
              <div className="flex h-40 items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#3D5EF6] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="text-center py-10">
                <p className={`text-xs ${mt}`}>No referral leads found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className={`border-b pb-3 ${isDark ? "border-white/5 text-white/30" : "border-slate-100 text-slate-400"} uppercase font-semibold tracking-wider`}>
                      <th className="py-3.5 px-2">Seafarer</th>
                      <th className="py-3.5 px-2">Referring Agent</th>
                      <th className="py-3.5 px-2">Course / Location</th>
                      <th className="py-3.5 px-2">Status</th>
                      <th className="py-3.5 px-2">Timeline</th>
                      <th className="py-3.5 px-2 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className={isDark ? "divide-y divide-white/5" : "divide-y divide-slate-100"}>
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-white/[0.01] transition-all">
                        <td className="py-4 px-2">
                          <p className={`font-bold ${isDark ? "text-white/95" : "text-slate-800"}`}>{lead.name}</p>
                          <p className={`text-[10px] mt-0.5 ${labelText}`}>{lead.email}</p>
                          <p className={`text-[10px] mt-0.5 ${labelText}`}>{lead.phone}</p>
                        </td>
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-[#3D5EF6]" />
                            <span className="font-semibold">{lead.agentName}</span>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-1.5">
                            <Compass className="w-3.5 h-3.5 text-[#3D5EF6]" />
                            <span className="font-semibold">{lead.remarks ? lead.remarks.replace("Interested in ", "") : "STCW course"}</span>
                          </div>
                          {lead.city && <p className={`text-[10px] mt-0.5 ${labelText}`}>{lead.city}</p>}
                        </td>
                        <td className="py-4 px-2">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            lead.status === "Converted" 
                              ? "bg-emerald-500/10 text-emerald-500" 
                              : lead.status === "Expired" 
                              ? "bg-slate-500/10 text-slate-500" 
                              : lead.status === "Cancelled"
                              ? "bg-red-500/10 text-red-500"
                              : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10"
                          }`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="py-4 px-2">
                          <p className="flex items-center gap-1.5 text-[10px]">
                            <Calendar className="w-3 h-3 text-[#3D5EF6]" />
                            Created: {new Date(lead.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}
                          </p>
                          <p className={`flex items-center gap-1.5 text-[10px] mt-1 ${labelText}`}>
                            <Calendar className="w-3 h-3 text-[#3D5EF6]/50" />
                            Expires: {new Date(lead.expiryAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}
                          </p>
                        </td>
                        {/* Details Action Button */}
                        <td className="py-4 px-2 text-right">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className={`p-1.5 rounded-xl border flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm cursor-pointer ml-auto ${
                              isDark 
                                ? "bg-white/[0.02] border-white/10 text-[#3D5EF6] hover:text-[#3D5EF6] hover:bg-[#3D5EF6]/10 hover:border-[#3D5EF6]/30" 
                                : "bg-slate-50 border-slate-200 text-[#3D5EF6] hover:text-[#2E4FE0] hover:bg-[#EEF1FE] hover:border-slate-300"
                            }`}
                            title="View Details"
                          >
                            <Info className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : activeTab === "purchases" ? (
        <>
          {/* Purchases Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <label className={`flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm ${isDark ? "bg-white/5 border-white/10 text-white/60" : "bg-white border-slate-200 text-slate-600 shadow-sm"}`}>
              <Search className="w-4 h-4 opacity-55" />
              <input
                type="text"
                value={searchPurchases}
                onChange={(e) => setSearchPurchases(e.target.value)}
                placeholder="Search by seafarer name, course, or agent..."
                className="bg-transparent outline-none w-full text-xs"
              />
            </label>
            
            <button 
              onClick={loadData}
              className={`p-2.5 rounded-xl border flex items-center justify-center cursor-pointer transition ${isDark ? "border-white/10 hover:bg-white/5 text-white/50" : "border-slate-200 hover:bg-slate-50 text-slate-500 shadow-sm"}`}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Purchases Table */}
          <div className={card}>
            {loading ? (
              <div className="flex h-40 items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#3D5EF6] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredSeafarers.length === 0 ? (
              <div className="text-center py-10">
                <p className={`text-xs ${mt}`}>No referred purchases found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className={`border-b pb-3 ${isDark ? "border-white/5 text-white/30" : "border-slate-100 text-slate-400"} uppercase font-semibold tracking-wider`}>
                      <th className="py-3.5 px-2">Seafarer Info</th>
                      <th className="py-3.5 px-2">Referring Agent</th>
                      <th className="py-3.5 px-2">Course Purchased</th>
                      <th className="py-3.5 px-2">Purchase Amount</th>
                      <th className="py-3.5 px-2">Purchase Date</th>
                      <th className="py-3.5 px-2 text-right">Referral Status</th>
                    </tr>
                  </thead>
                  <tbody className={isDark ? "divide-y divide-white/5" : "divide-y divide-slate-100"}>
                    {filteredSeafarers.map((sf) => (
                      <tr key={sf.id} className="hover:bg-white/[0.01] transition-all">
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-[#3D5EF6]" />
                            <span className="font-bold">{sf.seafarerName}</span>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <p className={`font-semibold ${isDark ? "text-white/80" : "text-slate-700"}`}>{sf.agentName}</p>
                          <p className={`text-[10px] ${labelText}`}>{sf.agentEmail}</p>
                        </td>
                        <td className="py-4 px-2">
                          <span className="font-semibold">{sf.courseName}</span>
                        </td>
                        <td className="py-4 px-2 font-bold">
                          {sf.purchaseAmount}
                        </td>
                        <td className="py-4 px-2">
                          {new Date(sf.purchaseDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="py-4 px-2 text-right">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 justify-end bg-emerald-500/10 text-emerald-500`}>
                            <ShieldCheck className="w-3.5 h-3.5" />
                            {sf.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Conflicts Panel (Manual Review) */}
          <div className="space-y-6">
            {conflicts.length === 0 ? (
              <div className={card}>
                <div className="text-center py-10">
                  <p className={`text-xs ${mt}`}>No conflicting referral disputes requiring manual review.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {conflicts.map((conflict) => {
                  // Find the winner based on earliest leadSubmittedAt
                  let earliestAgentId = "";
                  let earliestTime = Infinity;
                  conflict.agents.forEach((ag: any) => {
                    const t = new Date(ag.leadSubmittedAt).getTime();
                    if (t < earliestTime) {
                      earliestTime = t;
                      earliestAgentId = ag.agentId;
                    }
                  });

                  return (
                    <div key={conflict.purchaseId} className={card}>
                      {/* Conflict Header */}
                      <div className="flex flex-col md:flex-row justify-between border-b pb-4 mb-4 border-white/5 gap-4">
                        <div>
                          <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-500 font-extrabold text-[9px] uppercase tracking-wider animate-pulse">
                            ⚠️ Duplicate Lead Conflict
                          </span>
                          <h3 className="text-sm font-bold mt-2">Seafarer: {conflict.seafarerName}</h3>
                          <div className={`text-[10px] mt-1.5 space-y-1 ${labelText}`}>
                            <p>Email: <span className="font-semibold text-[#3D5EF6]">{conflict.seafarerEmail}</span></p>
                            <p>Phone: <span className="font-semibold text-[#3D5EF6]">{conflict.seafarerPhone}</span></p>
                            <p>INDOS Number: <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">{conflict.indosNumber}</span></p>
                          </div>
                        </div>

                        <div className="md:text-right">
                          <p className="text-xs font-bold text-slate-400">Purchased Course</p>
                          <p className="text-xs font-black text-white mt-1">{conflict.courseName}</p>
                          <p className="text-xs font-black text-[#3D5EF6] mt-1">Fee: ₹{conflict.courseFee.toLocaleString("en-IN")}</p>
                          <p className={`text-[9px] mt-1.5 ${mt}`}>Purchase Date: {new Date(conflict.createdAt).toLocaleDateString("en-IN")}</p>
                        </div>
                      </div>

                      {/* Conflicting Agents list */}
                      <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Conflicting Referral Claims</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {conflict.agents.map((agent: any) => {
                            const isEarliest = agent.agentId === earliestAgentId;
                            return (
                              <div key={agent.agentId} className={`p-4 rounded-2xl border flex flex-col justify-between ${
                                isEarliest 
                                  ? (isDark ? "bg-[#3D5EF6]/5 border-[#3D5EF6]/20 text-white" : "bg-[#EEF1FE] border-slate-300 text-slate-900") 
                                  : (isDark ? "bg-white/5 border-white/10 text-white" : "bg-[#FAFAFA] border-[#E5E7EB] text-[#111827]")
                              }`}>
                                <div className="space-y-2">
                                  <div className="flex justify-between items-start gap-2">
                                    <div>
                                      <p className="font-bold text-xs flex items-center gap-1.5">
                                        <User className="w-3.5 h-3.5 text-[#3D5EF6]" />
                                        {agent.agentName}
                                      </p>
                                      <p className={`text-[10px] mt-0.5 ${labelText}`}>{agent.agentEmail}</p>
                                      <p className={`text-[10px] mt-0.5 ${labelText}`}>{agent.agentPhone}</p>
                                    </div>
                                    {isEarliest && (
                                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-extrabold text-[9px] uppercase tracking-wider">
                                        🏆 Registered First
                                      </span>
                                    )}
                                  </div>

                                  <div className={`text-[10px] p-2 rounded-lg ${isDark ? "bg-slate-950/40 text-slate-350" : "bg-white text-slate-700"} space-y-1`}>
                                    <p className={labelText}>Lead Registered Time:</p>
                                    <p className="font-semibold">
                                      {new Date(agent.leadSubmittedAt).toLocaleString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                      })}
                                    </p>
                                    <p className={`mt-1.5 ${labelText}`}>Commission Quote: <span className="font-bold text-emerald-500">₹{agent.commissionAmount.toLocaleString("en-IN")} ({agent.commissionRate}%)</span></p>
                                  </div>
                                </div>

                                <div className="mt-4 pt-3 border-t border-white/5">
                                  <button
                                    onClick={() => handleResolveConflict(conflict.purchaseId, agent.agentId)}
                                    disabled={resolvingId === conflict.purchaseId}
                                    className={`w-full py-2 rounded-xl font-bold text-[10px] uppercase tracking-wider shadow-sm transition ${
                                      resolvingId === conflict.purchaseId
                                        ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                                        : "bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white cursor-pointer"
                                    }`}
                                  >
                                    {resolvingId === conflict.purchaseId ? "Resolving..." : `Assign Commission to ${agent.agentName}`}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Dispute Remarks */}
                        <div className="pt-2">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Resolution Remarks *</label>
                          <textarea
                            placeholder="Add reason/remarks for the dispute resolution (e.g. First lead registered has authentic seafarer details)"
                            value={remarksMap[conflict.purchaseId] || ""}
                            onChange={(e) => setRemarksMap({ ...remarksMap, [conflict.purchaseId]: e.target.value })}
                            rows={2}
                            className={`w-full px-3 py-2 text-xs rounded-xl border outline-none mt-1.5 ${
                              isDark ? "bg-white/5 border-white/10 text-white placeholder-white/30" : "bg-[#FAFAFA] border-[#E5E7EB] text-[#111827] placeholder-[#9CA3AF]"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
      {/* Referral Lead Details Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className={`w-full max-w-lg p-6 rounded-[16px] card-elevated border-0 relative animate-in zoom-in-95 duration-200 ${
            isDark ? "bg-[#111827] text-white" : "bg-white text-[#111827]"
          }`}>
            <button
              onClick={() => setSelectedLead(null)}
              className={`absolute top-4 right-4 p-1.5 rounded-full transition ${isDark ? "hover:bg-white/5 text-white/40 hover:text-white" : "hover:bg-slate-100 text-slate-400 hover:text-slate-700"}`}
            >
              <X className="w-4 h-4" />
            </button>
            
            <h3 className="text-base font-bold mb-5 flex items-center gap-2 border-b pb-3 border-white/5">
              <ClipboardList className="w-4 h-4 text-[#3D5EF6]" />
              Referral Lead Details
            </h3>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/5">
                <span className={labelText}>Full Name</span>
                <span className="col-span-2 font-bold">{selectedLead.name}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/5">
                <span className={labelText}>Email</span>
                <span className="col-span-2 font-semibold font-mono">{selectedLead.email}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/5">
                <span className={labelText}>Phone</span>
                <span className="col-span-2 font-semibold font-mono">{selectedLead.phone}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/5">
                <span className={labelText}>City / Location</span>
                <span className="col-span-2 font-semibold">{selectedLead.city || "Unknown"}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/5">
                <span className={labelText}>Referring Agent</span>
                <span className="col-span-2 font-bold">{selectedLead.agentName}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/5">
                <span className={labelText}>Interested Course</span>
                <span className="col-span-2 font-semibold">{selectedLead.remarks ? selectedLead.remarks.replace("Interested in ", "") : "STCW course"}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/5">
                <span className={labelText}>Status</span>
                <span className="col-span-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedLead.status === "Converted" 
                      ? "bg-emerald-500/10 text-emerald-500" 
                      : selectedLead.status === "Expired" 
                      ? "bg-slate-500/10 text-slate-500" 
                      : selectedLead.status === "Cancelled"
                      ? "bg-red-500/10 text-red-500"
                      : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10"
                  }`}>
                    {selectedLead.status}
                  </span>
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/5">
                <span className={labelText}>Timeline</span>
                <span className="col-span-2 font-semibold space-y-1 block">
                  <span className="block">Created: {new Date(selectedLead.createdAt).toLocaleString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span className="block opacity-60">Expires: {new Date(selectedLead.expiryAt).toLocaleString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </span>
              </div>
              <div className="pt-2">
                <span className={`${labelText} block mb-1.5`}>Dispute / Remarks</span>
                <div className={`p-4 rounded-xl leading-relaxed text-xs break-words ${isDark ? "bg-white/5 text-white/80 border border-white/5" : "bg-[#FAFAFA] text-[#111827] border border-[#E5E7EB]"}`}>
                  {selectedLead.remarks || "No remarks provided"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
