"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import { api } from "@/lib/axios";
import {
  LifeBuoy, Search, RefreshCw, Calendar, Send, CheckCircle2,
  User, MessageSquare, AlertCircle, X, CheckSquare
} from "lucide-react";

export default function SupportTickets() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Selected ticket for chat / details
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const card = `rounded-[16px] p-7 border-0 card-elevated transition-all duration-300 hover:-translate-y-0.5 ${
    isDark
      ? "bg-[#111827] text-white"
      : "bg-white text-[#111827]"
  }`;
  const labelText = isDark ? "text-white/50" : "text-[#6B7280]";
  const ht = isDark ? "text-white/95" : "text-[#111827]";
  const mt = isDark ? "text-white/35" : "text-[#9CA3AF]";
  const inputWrap = `flex items-center gap-2 px-3 py-2.5 rounded-[10px] border text-sm ${isDark ? "bg-white/5 border-white/10 text-white/60" : "bg-white border-[#E5E7EB] text-[#6B7280] shadow-sm"}`;
  const selectCls = `px-3 py-2.5 rounded-[10px] border text-xs font-semibold outline-none cursor-pointer ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-[#E5E7EB] text-[#111827] shadow-sm"}`;

  const mounted = true;

  const fetchTickets = async () => {
    try {
      const res = await api.get("/agent-admin/tickets");
      setTickets(res.data || []);
      // If a ticket is currently open in chat, update it from fresh data
      if (selectedTicket) {
        const fresh = (res.data || []).find((t: any) => t.id === selectedTicket.id);
        if (fresh) setSelectedTicket(fresh);
      }
    } catch (err) {
      console.error("Failed to load support tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchTickets();
  }, []);

  if (!mounted) return null;

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;

    setReplyLoading(true);
    try {
      await api.post(`/agent-admin/tickets/${selectedTicket.id}/reply`, {
        message: replyMessage.trim()
      });
      setReplyMessage("");
      await fetchTickets();
    } catch (err) {
      console.error("Failed to submit reply:", err);
    } finally {
      setReplyLoading(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedTicket) return;

    setStatusLoading(true);
    try {
      await api.patch(`/agent-admin/tickets/${selectedTicket.id}/status`, {
        status
      });
      await fetchTickets();
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setStatusLoading(false);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.subject?.toLowerCase().includes(search.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(search.toLowerCase()) ||
      ticket.User?.name?.toLowerCase().includes(search.toLowerCase()) ||
      ticket.User?.email?.toLowerCase().includes(search.toLowerCase());
    
    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && ticket.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${ht}`}>Agent Support Tickets</h1>
          <p className={`text-xs mt-1.5 ${mt}`}>Review, reply to, and resolve support requests submitted by placement agents.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <label className={inputWrap}>
          <Search className="w-4 h-4 opacity-55" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets by subject, agent or description..."
            className="bg-transparent outline-none w-72 text-xs"
          />
        </label>

        <select 
          className={selectCls} 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="replied">Replied</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        
        <button 
          onClick={fetchTickets}
          className={`p-2.5 rounded-xl border flex items-center justify-center cursor-pointer transition ${isDark ? "border-white/10 hover:bg-white/5 text-white/50" : "border-slate-200 hover:bg-slate-50 text-slate-500 shadow-sm"}`}
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Tickets List */}
      <div className={card}>
        <div className="flex items-center gap-2 border-b pb-4 mb-4 border-white/5">
          <LifeBuoy className="w-4 h-4 text-[#3D5EF6]" />
          <h3 className="text-sm font-bold">Ticket Registry</h3>
        </div>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="w-8 h-8 border-4 border-[#3D5EF6] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center py-10">
            <p className={`text-xs ${mt}`}>No support tickets match the filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b pb-3 ${isDark ? "border-white/5 text-white/30" : "border-slate-100 text-slate-400"} uppercase font-semibold tracking-wider`}>
                  <th className="py-3.5 px-4">Created At</th>
                  <th className="py-3.5 px-4">Agent Name</th>
                  <th className="py-3.5 px-4">Subject</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={isDark ? "divide-y divide-white/5" : "divide-y divide-slate-100"}>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-white/[0.01] transition-all">
                    {/* Date */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <p className="flex items-center gap-1.5 text-[10px] font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-[#3D5EF6]" />
                        {new Date(ticket.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <p className={`text-[10px] mt-0.5 ml-5 ${labelText}`}>
                        {new Date(ticket.createdAt).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>

                    {/* Submitter */}
                    <td className="py-4 px-4">
                      <p className="font-bold">{ticket.User?.name || "Unknown Agent"}</p>
                      <p className={`text-[10px] ${labelText}`}>{ticket.User?.email || ""}</p>
                    </td>

                    {/* Subject */}
                    <td className="py-4 px-4 max-w-xs truncate font-semibold">
                      {ticket.subject}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        ticket.status === "open"
                          ? "bg-[#FEF3C7] text-[#B45309]"
                          : ticket.status === "replied"
                          ? "bg-[#EEF1FE] text-[#3D5EF6]"
                          : "bg-[#DCFCE7] text-[#16A34A]"
                      }`}>
                        {ticket.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ml-auto ${
                          isDark 
                            ? "border-white/10 hover:bg-white/5 text-white/80 hover:text-white" 
                            : "border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-900 shadow-sm"
                        }`}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Manage Chat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ticket Chat Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className={`w-full max-w-2xl h-[550px] flex flex-col rounded-[16px] card-elevated border-0 relative animate-in zoom-in-95 duration-200 overflow-hidden ${
            isDark ? "bg-[#111827] text-white" : "bg-white text-[#111827]"
          }`}>
            {/* Modal Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-[#3D5EF6]" />
                <div>
                  <h3 className="text-sm font-bold">{selectedTicket.subject}</h3>
                  <p className={`text-[10px] ${labelText}`}>
                    Submitted by: {selectedTicket.User?.name} ({selectedTicket.User?.email})
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateStatus("resolved")}
                  disabled={statusLoading || selectedTicket.status === "resolved"}
                  className="px-2.5 py-1.5 bg-[#16A34A] hover:bg-[#15803D] disabled:opacity-50 text-white text-[10px] font-bold rounded-xl flex items-center gap-1"
                >
                  <CheckSquare className="w-3 h-3" />
                  Resolve
                </button>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className={`p-1.5 rounded-full transition ${isDark ? "hover:bg-white/5 text-white/40 hover:text-white" : "hover:bg-slate-100 text-[#6B7280] hover:text-[#111827]"}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className={`flex-1 p-4 overflow-y-auto space-y-4 ${isDark ? "bg-[#111827]" : "bg-[#FAFAFA]"}`}>
              {/* Initial Ticket Description */}
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-[#EEF1FE] text-[#3D5EF6] flex items-center justify-center shrink-0 text-xs font-bold uppercase">
                  {selectedTicket.User?.name?.substring(0, 2) || "AG"}
                </div>
                <div className="max-w-[75%]">
                  <div className={`p-3 rounded-2xl rounded-tl-none ${isDark ? "bg-white/[0.04] border border-white/5" : "bg-white border border-[#E5E7EB]"}`}>
                    <p className="text-xs leading-relaxed">{selectedTicket.description}</p>
                  </div>
                  <span className={`text-[9px] mt-1 block ml-1 ${labelText}`}>
                    {new Date(selectedTicket.createdAt).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>
              </div>

              {/* Chat Replies */}
              {JSON.parse(selectedTicket.replies || "[]").map((reply: any) => {
                const isAdmin = reply.senderRole === "agent_admin";
                return (
                  <div key={reply.id} className={`flex gap-2 ${isAdmin ? "justify-end" : "justify-start"}`}>
                    {!isAdmin && (
                      <div className="w-8 h-8 rounded-full bg-[#3D5EF6]/10 text-[#3D5EF6] flex items-center justify-center shrink-0 text-xs font-bold uppercase">
                        {reply.senderName?.substring(0, 2) || "AG"}
                      </div>
                    )}
                    <div className="max-w-[75%]">
                      <div className={`p-3 rounded-2xl ${
                        isAdmin 
                          ? "bg-[#3D5EF6] text-white rounded-tr-none" 
                          : isDark ? "bg-white/[0.04] border border-white/5 rounded-tl-none" : "bg-white border border-slate-200 rounded-tl-none"
                      }`}>
                        <p className="text-xs leading-relaxed">{reply.message}</p>
                      </div>
                      <span className={`text-[9px] mt-1 block ml-1 ${labelText} ${isAdmin ? "text-right mr-1" : ""}`}>
                        {reply.senderName} • {new Date(reply.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    {isAdmin && (
                      <div className="w-8 h-8 rounded-full bg-[#3D5EF6] text-white flex items-center justify-center shrink-0 text-xs font-bold">
                        AD
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Chat Footer Reply Input */}
            <form onSubmit={handleSendReply} className="p-3 border-t border-white/5 flex gap-2">
              <input
                type="text"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your support reply message here..."
                disabled={selectedTicket.status === "resolved"}
                className={`flex-1 px-4 py-2.5 rounded-xl border text-xs outline-none ${
                  isDark 
                    ? "bg-white/5 border-white/10 text-white placeholder-white/30" 
                    : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"
                }`}
              />
              <button
                type="submit"
                disabled={replyLoading || !replyMessage.trim() || selectedTicket.status === "resolved"}
                className="px-4 bg-[#3D5EF6] hover:bg-[#2E4FE0] disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
