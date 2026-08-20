"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import { agentAdminService } from "@/services/agent-admin.service";
import { 
  Search, FileText, Calendar, User, Compass, RefreshCw, ClipboardList, ShieldCheck 
} from "lucide-react";

export default function ReferralsTracker() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? theme === "dark" : true;

  const [activeTab, setActiveTab] = useState<"leads" | "purchases" | "conflicts">("leads");
  const [loading, setLoading] = useState(true);

  // Data states
  const [leads, setLeads] = useState<any[]>([]);
  const [seafarers, setSeafarers] = useState<any[]>([]);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [remarksMap, setRemarksMap] = useState<Record<string, string>>({});

  // Filter states
  const [searchLeads, setSearchLeads] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchPurchases, setSearchPurchases] = useState("");

  const card = `rounded-3xl overflow-hidden p-6 ${isDark ? "bg-[#0d1f35] border border-white/[0.06]" : "bg-white border border-slate-200 shadow-sm"}`;
  const labelText = isDark ? "text-white/50" : "text-slate-500";
  const ht = isDark ? "text-white/80" : "text-slate-800";
  const mt = isDark ? "text-white/35" : "text-slate-400";
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
      alert("Referral dispute resolved successfully!");
      await loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || "Failed to resolve conflict.");
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
              ? "border-cyan-500 text-cyan-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Referral Pipeline (Leads)
        </button>
        <button
          onClick={() => setActiveTab("purchases")}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === "purchases"
              ? "border-cyan-500 text-cyan-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Referred Purchases (Bookings)
        </button>
        <button
          onClick={() => setActiveTab("conflicts")}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === "conflicts"
              ? "border-cyan-500 text-cyan-400"
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
                className={`px-3 py-2.5 rounded-xl border text-xs font-semibold outline-none cursor-pointer ${isDark ? "bg-[#0d1f35] border-white/10 text-white" : "bg-white border-slate-200 text-slate-700 shadow-sm"}`}
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
                <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
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
                      <th className="py-3.5 px-2">Remarks</th>
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
                            <User className="w-3.5 h-3.5 text-cyan-400" />
                            <span className="font-semibold">{lead.agentName}</span>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-1.5">
                            <Compass className="w-3.5 h-3.5 text-cyan-400" />
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
                              : "bg-amber-500/10 text-amber-500"
                          }`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="py-4 px-2">
                          <p className="flex items-center gap-1.5 text-[10px]">
                            <Calendar className="w-3 h-3 text-cyan-400" />
                            Created: {new Date(lead.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}
                          </p>
                          <p className={`flex items-center gap-1.5 text-[10px] mt-1 ${labelText}`}>
                            <Calendar className="w-3 h-3 text-cyan-400/50" />
                            Expires: {new Date(lead.expiryAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}
                          </p>
                        </td>
                        <td className="py-4 px-2 max-w-xs truncate" title={lead.remarks}>
                          <span className={isDark ? "text-white/60" : "text-slate-650"}>{lead.remarks || "No remarks provided"}</span>
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
                <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
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
                            <User className="w-3.5 h-3.5 text-cyan-400" />
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
                            <p>Email: <span className="font-semibold text-cyan-400">{conflict.seafarerEmail}</span></p>
                            <p>Phone: <span className="font-semibold text-cyan-400">{conflict.seafarerPhone}</span></p>
                            <p>INDOS Number: <span className="font-mono text-amber-500 font-bold">{conflict.indosNumber}</span></p>
                          </div>
                        </div>

                        <div className="md:text-right">
                          <p className="text-xs font-bold text-slate-400">Purchased Course</p>
                          <p className="text-xs font-black text-white mt-1">{conflict.courseName}</p>
                          <p className="text-xs font-black text-cyan-400 mt-1">Fee: ₹{conflict.courseFee.toLocaleString("en-IN")}</p>
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
                                  ? (isDark ? "bg-cyan-500/5 border-cyan-500/20 text-white" : "bg-cyan-50/50 border-cyan-200 text-slate-900") 
                                  : (isDark ? "bg-[#0b182d]/80 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900")
                              }`}>
                                <div className="space-y-2">
                                  <div className="flex justify-between items-start gap-2">
                                    <div>
                                      <p className="font-bold text-xs flex items-center gap-1.5">
                                        <User className="w-3.5 h-3.5 text-cyan-400" />
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
                                        : "bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer"
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
                              isDark ? "bg-[#0b182d] border-slate-800 text-white placeholder-slate-650" : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
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
    </div>
  );
}
