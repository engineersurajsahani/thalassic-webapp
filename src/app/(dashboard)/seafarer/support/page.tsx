"use client";

import React, { useEffect, useState } from "react";
import { supportService } from "@/services/support.service";
import { useTheme } from "@/providers/theme-provider";
import {
  MessageSquare,
  Plus,
  ChevronDown,
  ChevronUp,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  Sparkles,
  CloudLightning,
  X,
} from "lucide-react";

interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  replies: { id: string; sender: string; message: string; timestamp: string }[];
}

export default function SupportPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [sendingReply, setSendingReply] = useState<string | null>(null);

  const loadTickets = async () => {
    try {
      const data = await supportService.getTickets();
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

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newDescription.trim()) return;
    setSubmitting(true);
    try {
      await supportService.createTicket(newSubject.trim(), newDescription.trim());
      setNewSubject("");
      setNewDescription("");
      setShowNewForm(false);
      await loadTickets();
    } catch (err: any) {
      console.error("Failed to create ticket:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendReply = async (ticketId: string) => {
    const msg = replyText[ticketId]?.trim();
    if (!msg) return;
    setSendingReply(ticketId);
    try {
      await supportService.addReply(ticketId, msg);
      setReplyText((prev) => ({ ...prev, [ticketId]: "" }));
      await loadTickets();
    } catch (err) {
      console.error("Failed to send reply:", err);
    } finally {
      setSendingReply(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            <CheckCircle className="w-3 h-3" /> Resolved
          </span>
        );
      case "in progress":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 animate-pulse">
            <Clock className="w-3 h-3" /> In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-blue-400 bg-blue-400/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
            <AlertCircle className="w-3 h-3" /> Open
          </span>
        );
    }
  };

  const fmtDate = (d: string) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className={`h-20 rounded-2xl ${isDark ? "bg-[#0A192F]" : "bg-slate-100"}`} />
        <div className={`h-72 rounded-3xl ${isDark ? "bg-[#0A192F]" : "bg-slate-100"}`} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn relative pb-10">
      {/* Page Title Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight">Support Center</h1>
        <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Raise a support request or track existing tickets. Our team will respond within 24 hours.
        </p>
      </div>

      {/* New Ticket Button / Form */}
      <div>
        {!showNewForm ? (
          <button
            onClick={() => setShowNewForm(true)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0 shadow-sm ${
              isDark
                ? "bg-gradient-to-r from-cyan-600 to-blue-600 hover:brightness-110 text-white"
                : "bg-[#3b71cb] hover:bg-[#2c5fb3] text-white"
            }`}
          >
            <Plus className="w-4 h-4" />
            Raise New Support Ticket
          </button>
        ) : (
          <div
            className={`rounded-2xl border p-6 shadow-xl ${
              isDark
                ? "bg-gradient-to-b from-[#09162c] to-[#040c1a] border-slate-800/80"
                : "bg-white border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-black text-base tracking-tight">New Support Request</h3>
              <button
                onClick={() => setShowNewForm(false)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isDark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  className={`text-[9px] uppercase font-black tracking-wider ${
                    isDark ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Subject *
                </label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. Certificate Verification Issue"
                  required
                  className={`w-full p-3 text-xs rounded-xl border outline-none transition-colors ${
                    isDark
                      ? "bg-[#0b182d] border-slate-800 text-white placeholder:text-slate-600 focus:border-cyan-500"
                      : "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-[#3b71cb]"
                  }`}
                />
              </div>
              <div className="space-y-1.5">
                <label
                  className={`text-[9px] uppercase font-black tracking-wider ${
                    isDark ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Description *
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe your issue in detail..."
                  required
                  rows={4}
                  className={`w-full p-3 text-xs rounded-xl border outline-none transition-colors resize-none ${
                    isDark
                      ? "bg-[#0b182d] border-slate-800 text-white placeholder:text-slate-600 focus:border-cyan-500"
                      : "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-[#3b71cb]"
                  }`}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-all disabled:opacity-60 ${
                    isDark
                      ? "bg-gradient-to-r from-cyan-600 to-blue-600 hover:brightness-110 text-white"
                      : "bg-[#3b71cb] hover:bg-[#2c5fb3] text-white"
                  }`}
                >
                  {submitting ? (
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  {submitting ? "Submitting..." : "Submit Ticket"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewForm(false)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-colors ${
                    isDark
                      ? "text-slate-400 hover:bg-slate-800"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Tickets List */}
      <section
        className={`rounded-3xl border p-6 md:p-8 shadow-xl relative overflow-hidden ${
          isDark
            ? "bg-gradient-to-b from-[#09162c] to-[#040c1a] border-slate-800/80 text-white"
            : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-800/40 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-lg font-black tracking-tight">My Support Tickets</h3>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
              isDark ? "bg-cyan-500/10 text-cyan-400" : "bg-blue-50 text-[#3b71cb]"
            }`}
          >
            Total: {tickets.length}
          </span>
        </div>

        {tickets.length === 0 ? (
          <div
            className={`text-center py-16 rounded-2xl border border-dashed flex flex-col items-center justify-center p-6 ${
              isDark ? "border-slate-800 bg-slate-900/10" : "border-slate-200 bg-slate-50/50"
            }`}
          >
            <CloudLightning className="w-10 h-10 text-slate-500 mb-3" />
            <h4 className="text-sm font-bold text-slate-400">No Tickets Yet</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-[300px] leading-relaxed">
              You have no support requests. Click &quot;Raise New Support Ticket&quot; above to get help.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => {
              const isExpanded = expandedId === ticket.id;
              return (
                <div
                  key={ticket.id}
                  className={`rounded-2xl border overflow-hidden transition-all duration-200 ${
                    isDark
                      ? "border-slate-800 bg-slate-900/20"
                      : "border-slate-200 bg-slate-50/50"
                  }`}
                >
                  {/* Ticket Header Row */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : ticket.id)}
                    className={`w-full flex items-center justify-between gap-4 p-4 text-left cursor-pointer transition-colors ${
                      isDark ? "hover:bg-slate-800/30" : "hover:bg-slate-100/60"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className={`p-2 rounded-lg shrink-0 ${isDark ? "bg-slate-800/60" : "bg-white"}`}
                      >
                        <MessageSquare
                          className={`w-4 h-4 ${isDark ? "text-cyan-400" : "text-[#3b71cb]"}`}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm truncate">{ticket.subject}</p>
                        <p
                          className={`text-[10px] mt-0.5 ${isDark ? "text-slate-500" : "text-slate-400"}`}
                        >
                          {ticket.id} · {fmtDate(ticket.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {getStatusBadge(ticket.status)}
                      {isExpanded ? (
                        <ChevronUp className={`w-4 h-4 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                      ) : (
                        <ChevronDown className={`w-4 h-4 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                      )}
                    </div>
                  </button>

                  {/* Expanded Ticket Body */}
                  {isExpanded && (
                    <div
                      className={`border-t px-4 pb-4 pt-4 space-y-4 ${
                        isDark ? "border-slate-800" : "border-slate-200"
                      }`}
                    >
                      {/* Description */}
                      <div
                        className={`p-3 rounded-xl text-xs leading-relaxed ${
                          isDark ? "bg-slate-800/40 text-slate-300" : "bg-white text-slate-700 border border-slate-200"
                        }`}
                      >
                        <p className={`text-[9px] font-black uppercase tracking-wider mb-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                          Original Message
                        </p>
                        {ticket.description}
                      </div>

                      {/* Replies */}
                      {ticket.replies && ticket.replies.length > 0 && (
                        <div className="space-y-2">
                          {ticket.replies.map((reply) => (
                            <div
                              key={reply.id}
                              className={`p-3 rounded-xl text-xs leading-relaxed ${
                                reply.sender === "Seafarer User" || reply.sender === "You"
                                  ? isDark
                                    ? "bg-cyan-900/20 border border-cyan-800/30 text-slate-200"
                                    : "bg-blue-50 border border-blue-100 text-slate-700"
                                  : isDark
                                  ? "bg-slate-800/40 text-slate-300"
                                  : "bg-white border border-slate-200 text-slate-700"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className={`font-bold text-[10px] ${
                                  reply.sender === "Seafarer User" || reply.sender === "You"
                                    ? isDark ? "text-cyan-400" : "text-[#3b71cb]"
                                    : isDark ? "text-slate-400" : "text-slate-500"
                                }`}>
                                  {reply.sender}
                                </span>
                                <span className={`text-[9px] ${isDark ? "text-slate-600" : "text-slate-400"}`}>
                                  {fmtDate(reply.timestamp)}
                                </span>
                              </div>
                              {reply.message}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Input (only for non-resolved tickets) */}
                      {ticket.status?.toLowerCase() !== "resolved" && (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={replyText[ticket.id] || ""}
                            onChange={(e) =>
                              setReplyText((prev) => ({ ...prev, [ticket.id]: e.target.value }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSendReply(ticket.id);
                            }}
                            placeholder="Add a reply..."
                            className={`flex-1 p-2.5 text-xs rounded-xl border outline-none transition-colors ${
                              isDark
                                ? "bg-[#0b182d] border-slate-800 text-white placeholder:text-slate-600 focus:border-cyan-500"
                                : "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-[#3b71cb]"
                            }`}
                          />
                          <button
                            onClick={() => handleSendReply(ticket.id)}
                            disabled={sendingReply === ticket.id || !replyText[ticket.id]?.trim()}
                            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50 ${
                              isDark
                                ? "bg-cyan-600 hover:bg-cyan-500 text-white"
                                : "bg-[#3b71cb] hover:bg-[#2c5fb3] text-white"
                            }`}
                          >
                            {sendingReply === ticket.id ? (
                              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Send className="w-3.5 h-3.5" />
                            )}
                            Reply
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
