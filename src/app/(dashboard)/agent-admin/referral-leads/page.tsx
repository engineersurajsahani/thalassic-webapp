"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import { agentAdminService } from "@/services/agent-admin.service";
import { Search, FileText, Calendar, User, Compass, RefreshCw } from "lucide-react";

export default function ReferralLeads() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const card = `rounded-3xl overflow-hidden p-6 ${isDark ? "bg-[#0d1f35] border border-white/[0.06]" : "bg-white border border-slate-200 shadow-sm"}`;
  const labelText = isDark ? "text-white/50" : "text-slate-500";
  const ht = isDark ? "text-white/80" : "text-slate-800";
  const mt = isDark ? "text-white/35" : "text-slate-400";

  const fetchLeads = async () => {
    try {
      const list = await agentAdminService.getReferralLeads();
      setLeads(list);
    } catch (err) {
      console.error("Failed to load referral leads: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name?.toLowerCase().includes(search.toLowerCase()) ||
      lead.email?.toLowerCase().includes(search.toLowerCase()) ||
      lead.agentName?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = 
      statusFilter === "all" ||
      lead.status.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${ht}`}>Referral Leads</h1>
          <p className={`text-xs mt-1.5 ${mt}`}>Monitor seafarers referred by agents before they purchase a course.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <label className={`flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm ${isDark ? "bg-white/5 border-white/10 text-white/60" : "bg-white border-slate-200 text-slate-600 shadow-sm"}`}>
          <Search className="w-4 h-4 opacity-55" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
            onClick={fetchLeads}
            className={`p-2.5 rounded-xl border flex items-center justify-center cursor-pointer transition ${isDark ? "border-white/10 hover:bg-white/5 text-white/50" : "border-slate-200 hover:bg-slate-50 text-slate-500 shadow-sm"}`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Leads Table List */}
      <div className={card}>
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-10">
            <p className={`text-xs ${mt}`}>No referral leads found matching your filters.</p>
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
                    {/* Seafarer Details */}
                    <td className="py-4 px-2">
                      <p className={`font-bold ${isDark ? "text-white/95" : "text-slate-800"}`}>{lead.name}</p>
                      <p className={`text-[10px] mt-0.5 ${labelText}`}>{lead.email}</p>
                      <p className={`text-[10px] mt-0.5 ${labelText}`}>{lead.phone}</p>
                    </td>

                    {/* Agent Details */}
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="font-semibold">{lead.agentName}</span>
                      </div>
                    </td>

                    {/* Course */}
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="font-semibold">{lead.remarks ? lead.remarks.replace("Interested in ", "") : "STCW course"}</span>
                      </div>
                      {lead.city && <p className={`text-[10px] mt-0.5 ${labelText}`}>{lead.city}</p>}
                    </td>

                    {/* Status badge */}
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

                    {/* Timeline */}
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

                    {/* Remarks */}
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
    </div>
  );
}
