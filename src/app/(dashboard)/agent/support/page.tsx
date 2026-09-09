"use client";
import toast from 'react-hot-toast';

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
      toast.error(err.response?.data?.message || "Failed to load ticket details.");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "resolved":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A]">
            <CheckCircle2 className="w-3 h-3" /> Resolved
          </span>
        );
      case "closed":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FEE2E2] text-[#DC2626]">
            <X className="w-3 h-3" /> Closed
          </span>
        );
      case "open":
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#B45309]">
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
        <div className={`h-16 rounded-[16px] ${isDark ? 'bg-[#0B0F19] border border-[#1F2937]' : 'bg-slate-100'}`} />
        <div className={`h-96 rounded-[16px] ${isDark ? 'bg-[#0B0F19] border border-[#1F2937]' : 'bg-slate-100'}`} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn relative pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Support Tickets
          </h1>
          <p className={`text-xs ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
            Track and resolve queries regarding payments, seafarer credentials, or general platform errors.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 rounded-full font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer transition-colors duration-200 bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white"
        >
          <Plus className="w-4 h-4" /> Create Support Ticket
        </button>
      </div>

      {/* Directory Operations Card */}
      <section className={`rounded-[16px] border-0 p-6 md:p-8 relative overflow-hidden ${
        isDark ? "bg-[#0B0F19] shadow-[0_4px_20px_rgba(0,0,0,0.3)] text-white" : "bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] text-[#111827]"
      }`}>
        
        {/* Search & Filters */}
        <div className={`flex flex-col md:flex-row justify-between items-center gap-4 border-b pb-5 mb-5 ${isDark ? "border-[#1F2937]" : "border-[#E5E7EB]"}`}>
          <div className="flex-1 w-full max-w-sm">
            <label className={`flex items-center gap-2 px-3 py-2.5 rounded-full border text-sm ${isDark ? "bg-[#111827] border-[#1F2937] text-white" : "bg-[#FAFAFA] border-[#E5E7EB] text-[#111827]"}`}>
              <Search className="w-3.5 h-3.5 shrink-0 opacity-50" />
              <input
                type="text"
                placeholder="Search tickets by subject or details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`bg-transparent outline-none w-full text-[13px] ${isDark ? "placeholder:text-gray-500" : "placeholder:text-[#9CA3AF]"}`}
              />
            </label>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end">
            <Filter className="w-4 h-4 opacity-50" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`p-2.5 text-xs rounded-full border outline-none cursor-pointer ${
                isDark ? "bg-[#111827] border-[#1F2937] text-white" : "bg-[#FAFAFA] border-[#E5E7EB] text-[#111827]"
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
          <div className="text-center py-16 text-[#6B7280]">
            <LifeBuoy className="w-10 h-10 mx-auto opacity-30 mb-3" />
            <h4 className="text-sm font-bold">No support tickets found</h4>
            <p className="text-xs mt-1">Raise support tickets to contact administration.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs leading-normal">
              <thead>
                <tr className={`font-semibold border-b uppercase tracking-wider text-[10px] ${
                  isDark ? "text-gray-400 border-[#1F2937]" : "text-[#6B7280] border-[#E5E7EB]"
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
              <tbody className={isDark ? "divide-y divide-[#1F2937]" : "divide-y divide-[#E5E7EB]"}>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className={`transition-colors duration-200 ${
                    isDark ? "hover:bg-white/[0.02]" : "hover:bg-slate-50/70"
                  }`}>
                    <td className="py-4 pr-4 font-mono font-bold tracking-wider text-[#3D5EF6] text-[10px]">
                      TCK-{ticket.id.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="py-4 pr-4 font-extrabold max-w-[200px] truncate">
                      {ticket.subject}
                    </td>
                    <td className={`py-4 pr-4 max-w-[250px] truncate ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
                      {ticket.description}
                    </td>
                    <td className={`py-4 pr-4 ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
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
                        className={`p-2.5 rounded-full border flex items-center justify-center transition-colors duration-200 cursor-pointer ${
                          isDark 
                            ? "border-[#1F2937] bg-[#111827] text-white/70 hover:text-white hover:bg-white/10" 
                            : "border-[#E5E7EB] bg-[#F3F4F6] text-[#6B7280] hover:text-[#111827] hover:bg-[#E5E7EB]"
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
          <div className={`w-full max-w-lg rounded-[16px] border-0 shadow-2xl p-6 md:p-8 animate-zoomIn relative ${
            isDark ? "bg-[#0B0F19] text-white" : "bg-white text-[#111827]"
          }`}>
            
            <h3 className={`text-xl font-extrabold tracking-tight border-b pb-4 mb-6 ${isDark ? "border-[#1F2937]" : "border-[#E5E7EB]"}`}>
              Raise Support Ticket
            </h3>

            {errorMsg && (
              <div className="mb-5 p-4 rounded-[16px] bg-[#FEE2E2] border border-[#FEE2E2] text-[#DC2626] flex items-start gap-3 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold">Submission Error</p>
                  <p className="mt-0.5 opacity-90">{errorMsg}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div className="space-y-1">
                <label className={`text-[10px] font-black uppercase tracking-wider ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>Subject / Category *</label>
                <input
                  type="text"
                  name="subject"
                  value={newTicket.subject}
                  onChange={handleInputChange}
                  placeholder="E.g. Delayed commission payment validation"
                  required
                  className={`w-full px-3 py-2.5 text-xs rounded-full border outline-none transition-colors duration-200 ${
                    isDark ? "bg-[#111827] border-[#1F2937] text-white focus:border-[#3D5EF6] placeholder:text-gray-500" : "bg-[#FAFAFA] border-[#E5E7EB] text-[#111827] focus:border-[#3D5EF6] placeholder:text-[#9CA3AF]"
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-[10px] font-black uppercase tracking-wider ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>Issue Details / Description *</label>
                <textarea
                  name="description"
                  value={newTicket.description}
                  onChange={handleInputChange}
                  placeholder="Provide precise details to help us investigate the issue..."
                  rows={4}
                  required
                  className={`w-full px-3 py-2.5 text-xs rounded-[16px] border outline-none transition-colors duration-200 ${
                    isDark ? "bg-[#111827] border-[#1F2937] text-white focus:border-[#3D5EF6] placeholder:text-gray-500" : "bg-[#FAFAFA] border-[#E5E7EB] text-[#111827] focus:border-[#3D5EF6] placeholder:text-[#9CA3AF]"
                  }`}
                />
              </div>

              {/* Submit Buttons */}
              <div className={`pt-4 flex justify-end gap-3 border-t mt-4 ${isDark ? "border-[#1F2937]" : "border-[#E5E7EB]"}`}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors duration-200 cursor-pointer ${
                    isDark ? "border-[#1F2937] bg-[#111827] text-white hover:bg-white/10" : "border-[#E5E7EB] bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full text-xs font-bold shadow-sm transition-colors duration-200 cursor-pointer bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white"
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
          <div className={`w-full max-w-2xl rounded-[16px] border-0 shadow-2xl p-6 md:p-8 animate-zoomIn relative max-h-[85vh] flex flex-col ${
            isDark ? "bg-[#0B0F19] text-white" : "bg-white text-[#111827]"
          }`}>
            
            <button
              onClick={() => setShowDetailsModal(false)}
              className={`absolute top-5 right-5 p-2 rounded-full cursor-pointer transition-colors duration-200 ${isDark ? "hover:bg-white/10 text-white/60" : "hover:bg-slate-100 text-[#6B7280]"}`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className={`border-b pb-4 mb-4 ${isDark ? "border-[#1F2937]" : "border-[#E5E7EB]"}`}>
              <div className="flex items-center gap-2 mb-2">
                {getStatusBadge(selectedTicket.status)}
                <span className={`text-[10px] font-black uppercase font-mono tracking-wider text-[#3D5EF6]`}>
                  TCK-{selectedTicket.id.substring(0, 8).toUpperCase()}
                </span>
              </div>
              <h3 className="text-lg font-black tracking-tight">{selectedTicket.subject}</h3>
            </div>

            {/* Scrollable conversation history */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
              {/* Original post */}
              <div className={`p-4 rounded-[16px] border ${isDark ? "bg-[#111827] border-[#1F2937]" : "bg-[#FAFAFA] border-[#E5E7EB]"}`}>
                <p className={`text-[10px] font-bold mb-1.5 ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>Original Request</p>
                <p className="text-xs leading-relaxed">{selectedTicket.description}</p>
                <p className={`text-[9px] mt-2 ${isDark ? "text-gray-500" : "text-[#9CA3AF]"}`}>{new Date(selectedTicket.createdAt).toLocaleString()}</p>
              </div>

              {/* Replies */}
              {(!selectedTicket.replies || selectedTicket.replies.length === 0) ? (
                <div className={`text-center py-6 italic text-xs ${isDark ? "text-gray-500" : "text-[#9CA3AF]"}`}>
                  No replies logged yet. Administrative operators will respond shortly.
                </div>
              ) : (
                selectedTicket.replies.map((rep: any, idx: number) => {
                  const isAdmin = rep.sender === "admin" || rep.role === "admin";
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-[16px] border max-w-[85%] ${
                        isAdmin
                          ? isDark
                            ? "bg-[#111827] border-[#1F2937] ml-0 mr-auto text-left"
                            : "bg-[#EEF1FE] border-[#3D5EF6]/20 ml-0 mr-auto text-left"
                          : isDark
                          ? "bg-[#111827]/60 border-[#1F2937] ml-auto mr-0 text-right"
                          : "bg-[#FAFAFA] border-[#E5E7EB] ml-auto mr-0 text-right"
                      }`}
                    >
                      <p className={`text-[9px] font-black uppercase tracking-wider mb-1 ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
                        {isAdmin ? "👨‍💼 Support Staff" : "👤 You"}
                      </p>
                      <p className="text-xs leading-relaxed">{rep.message}</p>
                      <p className={`text-[9px] mt-1.5 ${isDark ? "text-gray-500" : "text-[#9CA3AF]"}`}>{new Date(rep.timestamp).toLocaleString()}</p>
                    </div>
                  );
                })
              )}
            </div>

            <div className={`pt-4 border-t flex justify-end ${isDark ? "border-[#1F2937]" : "border-[#E5E7EB]"}`}>
              <button
                onClick={() => setShowDetailsModal(false)}
                className={`px-5 py-2 rounded-full text-xs font-bold cursor-pointer transition-colors duration-200 ${
                  isDark ? "bg-[#111827] border border-[#1F2937] hover:bg-white/10 text-white" : "bg-[#F3F4F6] border border-[#E5E7EB] hover:bg-[#E5E7EB] text-[#6B7280]"
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
