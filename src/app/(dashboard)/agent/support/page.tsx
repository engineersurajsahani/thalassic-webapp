"use client";

import React, { useEffect, useState } from "react";
import { agentService } from "@/services/agent.service";
import { useTheme } from "@/providers/theme-provider";
import {
  LifeBuoy, Plus, Search, Filter, Calendar, MessageSquare, AlertCircle,
  CheckCircle2, Clock, ChevronRight, X
} from "lucide-react";

export default function AgentSupportPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const [newTicket, setNewTicket] = useState({
    subject: "",
    description: ""
  });

  const loadTickets = async () => {
    try {
      const data = await agentService.getSupportTickets();
      setTickets(data);
    } catch (err) {
      console.error("Failed to load support tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewTicket({
      ...newTicket,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!newTicket.subject || !newTicket.description) {
      setErrorMsg("Subject and description are required.");
      return;
    }

    try {
      await agentService.createSupportTicket(newTicket);
      setShowAddModal(false);
      setNewTicket({ subject: "", description: "" });
      await loadTickets();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Failed to submit support ticket.");
    }
  };

  const viewTicketDetails = async (ticket: any) => {
    try {
      const fullTicket = await agentService.getSupportTicketById(ticket.id);
      setSelectedTicket(fullTicket);
      setShowDetailsModal(true);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to load ticket details.");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "resolved":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Resolved
          </span>
        );
      case "closed":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-400/10 px-2.5 py-0.5 rounded-full border border-slate-500/20">
            <X className="w-3 h-3" /> Closed
          </span>
        );
      case "open":
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 animate-pulse">
            <Clock className="w-3 h-3" /> Open
          </span>
        );
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      ticket.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-16 rounded-2xl ${isDark ? 'bg-[#09162c]' : 'bg-slate-100'}" />
        <div className="h-96 rounded-3xl ${isDark ? 'bg-[#09162c]' : 'bg-slate-100'}" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn relative pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit ${
            isDark ? "bg-cyan-500/10 text-cyan-400" : "bg-blue-50 text-[#3b71cb]"
          }`}>
            🎫 Helpdesk
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1.5">
            Support Tickets
          </h1>
          <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Track and resolve queries regarding payments, seafarer credentials, or general platform errors.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className={`px-5 py-3 rounded-xl font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer transition-all ${
            isDark ? "bg-cyan-600 hover:bg-cyan-505 text-white" : "bg-[#3b71cb] hover:bg-[#2c5fb3] text-white"
          }`}
        >
          <Plus className="w-4 h-4" /> Create Support Ticket
        </button>
      </div>

      {/* Directory Operations Card */}
      <section className={`rounded-3xl border p-6 md:p-8 shadow-xl relative overflow-hidden ${
        isDark ? "bg-[#0a1122]/70 border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-white backdrop-blur-xl" : "bg-white/80 border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-slate-900 backdrop-blur-xl"
      }`}>
        
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-800/40 pb-5 mb-5">
          <div className="flex-1 w-full max-w-sm">
            <label className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm ${isDark ? "bg-[#0b182d] border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-850"}`}>
              <Search className="w-3.5 h-3.5 shrink-0 opacity-50" />
              <input
                type="text"
                placeholder="Search tickets by subject or details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent outline-none w-full text-[13px]"
              />
            </label>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end">
            <Filter className="w-4 h-4 opacity-50" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`p-2.5 text-xs rounded-lg border outline-none cursor-pointer ${
                isDark ? "bg-[#0b182d] border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
              }`}
            >
              <option value="all">All Tickets</option>
              <option value="open">Open</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Directory Table */}
        {filteredTickets.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <LifeBuoy className="w-10 h-10 mx-auto opacity-30 mb-3" />
            <h4 className="text-sm font-bold">No support tickets found</h4>
            <p className="text-xs mt-1">Raise support tickets to contact administration.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs leading-normal">
              <thead>
                <tr className={`font-black border-b uppercase tracking-widest text-[9px] ${
                  isDark ? "text-slate-500 border-slate-800" : "text-slate-400 border-slate-100"
                }`}>
                  <th className="pb-3 pr-4">Ticket Ref</th>
                  <th className="pb-3 pr-4">Subject</th>
                  <th className="pb-3 pr-4">Description</th>
                  <th className="pb-3 pr-4">Created Date</th>
                  <th className="pb-3 pr-4">Replies count</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/10">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className={`hover:bg-slate-500/5 transition-colors ${
                    isDark ? "border-b border-slate-900/60" : "border-b border-slate-100"
                  }`}>
                    <td className="py-4 pr-4 font-black tracking-wider text-cyan-400 text-[10px]">
                      TCK-{ticket.id.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="py-4 pr-4 font-extrabold max-w-[200px] truncate">
                      {ticket.subject}
                    </td>
                    <td className={`py-4 pr-4 max-w-[250px] truncate ${isDark ? "text-slate-400" : "text-slate-550"}`}>
                      {ticket.description}
                    </td>
                    <td className="py-4 pr-4">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 pr-4 font-bold text-center">
                      {Array.isArray(ticket.replies) ? ticket.replies.length : 0}
                    </td>
                    <td className="py-4 pr-4">
                      {getStatusBadge(ticket.status)}
                    </td>
                    <td className="py-4 text-right flex justify-end">
                      <button
                        onClick={() => viewTicketDetails(ticket)}
                        className={`p-2.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                          isDark 
                            ? "border-slate-800 bg-slate-900/40 text-gray-300 hover:bg-slate-800 hover:border-slate-700" 
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                        }`}
                        title="View Conversation"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* CREATE TICKET MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className={`w-full max-w-lg rounded-3xl border shadow-2xl p-6 md:p-8 animate-zoomIn relative ${
            isDark ? "bg-[#0a1122]/90 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-white backdrop-blur-2xl" : "bg-white border-slate-200/80 shadow-2xl text-slate-900 backdrop-blur-2xl"
          }`}>
            
            <h3 className="text-xl font-black tracking-tight border-b border-slate-800/40 pb-4 mb-6">
              Raise Support Ticket
            </h3>

            {errorMsg && (
              <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-3 text-xs animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold">Submission Error</p>
                  <p className="mt-0.5 opacity-90">{errorMsg}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Subject / Category *</label>
                <input
                  type="text"
                  name="subject"
                  value={newTicket.subject}
                  onChange={handleInputChange}
                  placeholder="E.g. Delayed commission payment validation"
                  required
                  className={`w-full px-3 py-2.5 text-xs rounded-xl border outline-none ${
                    isDark ? "bg-slate-950 border-slate-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Issue Details / Description *</label>
                <textarea
                  name="description"
                  value={newTicket.description}
                  onChange={handleInputChange}
                  placeholder="Provide precise details to help us investigate the issue..."
                  rows={4}
                  required
                  className={`w-full px-3 py-2.5 text-xs rounded-xl border outline-none ${
                    isDark ? "bg-slate-950 border-slate-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                  }`}
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800/40 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    isDark ? "border-slate-800 hover:bg-white/5" : "border-slate-300 hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-xs font-bold shadow-md transition-all ${
                    isDark ? "bg-cyan-600 hover:bg-cyan-505 text-white" : "bg-[#3b71cb] hover:bg-[#2c5fb3] text-white"
                  }`}
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TICKET DETAILS & REPLY HISTORY MODAL */}
      {showDetailsModal && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className={`w-full max-w-2xl rounded-3xl border shadow-2xl p-6 md:p-8 animate-zoomIn relative max-h-[85vh] flex flex-col ${
            isDark ? "bg-[#0a1122]/90 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-white backdrop-blur-2xl" : "bg-white border-slate-200/80 shadow-2xl text-slate-900 backdrop-blur-2xl"
          }`}>
            
            <button
              onClick={() => setShowDetailsModal(false)}
              className="absolute top-5 right-5 p-2 rounded-lg hover:bg-slate-800/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-800/40 pb-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                {getStatusBadge(selectedTicket.status)}
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                  TCK-{selectedTicket.id.substring(0, 8).toUpperCase()}
                </span>
              </div>
              <h3 className="text-lg font-black tracking-tight">{selectedTicket.subject}</h3>
            </div>

            {/* Scrollable conversation history */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
              {/* Original post */}
              <div className={`p-4 rounded-2xl border ${isDark ? "bg-slate-950/40 border-slate-850" : "bg-slate-50 border-slate-200"}`}>
                <p className="text-[10px] font-bold text-slate-400 mb-1.5">Original Request</p>
                <p className="text-xs leading-relaxed">{selectedTicket.description}</p>
                <p className="text-[9px] text-slate-500 mt-2">{new Date(selectedTicket.createdAt).toLocaleString()}</p>
              </div>

              {/* Replies */}
              {(!selectedTicket.replies || selectedTicket.replies.length === 0) ? (
                <div className="text-center py-6 text-slate-500 italic text-xs">
                  No replies logged yet. Administrative operators will respond shortly.
                </div>
              ) : (
                selectedTicket.replies.map((rep: any, idx: number) => {
                  const isAdmin = rep.sender === "admin" || rep.role === "admin";
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border max-w-[85%] ${
                        isAdmin
                          ? isDark
                            ? "bg-[#0b182d] border-slate-800/80 ml-0 mr-auto text-left"
                            : "bg-cyan-50/50 border-cyan-100 ml-0 mr-auto text-left"
                          : isDark
                          ? "bg-slate-950/60 border-slate-900/60 ml-auto mr-0 text-right"
                          : "bg-slate-100/50 border-slate-200 ml-auto mr-0 text-right"
                      }`}
                    >
                      <p className="text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1">
                        {isAdmin ? "👨‍💼 Support Staff" : "👤 You"}
                      </p>
                      <p className="text-xs leading-relaxed">{rep.message}</p>
                      <p className="text-[9px] text-slate-500 mt-1.5">{new Date(rep.timestamp).toLocaleString()}</p>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-4 border-t border-slate-800/40 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className={`px-5 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                  isDark ? "bg-slate-850 hover:bg-slate-800 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
