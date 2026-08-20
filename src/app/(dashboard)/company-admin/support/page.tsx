"use client";

import React, { useState, useMemo } from "react";
import { useTheme } from "@/providers/theme-provider";
import { mockTickets, SupportTicket, SupportMessage } from "@/components/company-admin/mockData";
import StatusBadge from "@/components/company-admin/StatusBadge";
import {
  LifeBuoy,
  Plus,
  Send,
  MessageSquare,
  User,
  Clock,
  ChevronRight,
  Sparkles,
  X,
  ShieldQuestion,
} from "lucide-react";

export default function SupportPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // State containing all support tickets
  const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets);
  
  // Selected/Active ticket id
  const [activeTicketId, setActiveTicketId] = useState<string>(mockTickets[0]?.id || "");

  // Text message composer state
  const [messageText, setMessageText] = useState("");

  // Agent typing indicator simulation state
  const [isAgentTyping, setIsAgentTyping] = useState(false);

  // Ticket creation modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newCategory, setNewCategory] = useState("General");
  const [newDescription, setNewDescription] = useState("");

  // Retrieve active ticket object
  const activeTicket = useMemo(() => {
    return tickets.find((t) => t.id === activeTicketId) || null;
  }, [tickets, activeTicketId]);

  // Send message simulator
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeTicketId) return;

    const currentTicketId = activeTicketId;
    const currentSubject = activeTicket?.subject || "";
    const currentAgent = activeTicket?.assignedTo || "Support Agent";

    const newMessage: SupportMessage = {
      id: `msg-${Date.now()}`,
      sender: "Company Administrator",
      text: messageText.trim(),
      timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      isAgent: false,
    };

    // Append message to active ticket's messages array
    setTickets((prev) =>
      prev.map((t) =>
        t.id === currentTicketId ? { ...t, messages: [...t.messages, newMessage] } : t
      )
    );
    setMessageText("");

    // Simulate an agent reply typing and adding after 2 seconds
    setTimeout(() => {
      setIsAgentTyping(true);
    }, 450);

    setTimeout(() => {
      setIsAgentTyping(false);
      const agentReply: SupportMessage = {
        id: `msg-reply-${Date.now()}`,
        sender: currentAgent,
        text: `Thank you for your update regarding "${currentSubject}". We have cataloged this and our support team is actively reviewing your request. We will update this ticket once the action completes.`,
        timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        isAgent: true,
      };

      setTickets((prev) =>
        prev.map((t) =>
          t.id === currentTicketId ? { ...t, messages: [...t.messages, agentReply] } : t
        )
      );
    }, 2000);
  };

  // Submit new ticket creation
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newDescription.trim()) return;

    const newTicket: SupportTicket = {
      id: `TCK-${Math.floor(100 + Math.random() * 900)}`,
      subject: newSubject.trim(),
      status: "Open",
      priority: newPriority as any,
      category: newCategory,
      assignedTo: "Support Helpdesk Agent",
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: "m-init",
          sender: "Company Administrator",
          text: newDescription.trim(),
          timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
          isAgent: false,
        },
      ],
    };

    setTickets((prev) => [newTicket, ...prev]);
    setActiveTicketId(newTicket.id);
    setShowCreateModal(false);

    // Reset Form fields
    setNewSubject("");
    setNewDescription("");
    setNewPriority("Medium");
    setNewCategory("General");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-800"}`}>
            Help & Support
          </h1>
          <p className={`text-[11px] mt-0.5 ${isDark ? "text-white/40" : "text-slate-500"}`}>
            Open support tickets and consult verification assistants directly.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg tracking-wider uppercase transition-all duration-300 border cursor-pointer ${
            isDark
              ? "bg-white text-black border-transparent hover:bg-gray-200"
              : "bg-black text-white border-transparent hover:bg-gray-800"
          }`}
        >
          <Plus className="w-4 h-4" />
          Create Ticket
        </button>
      </div>

      {/* Main Support Panel Workspace */}
      <div
        className={`border rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[500px] ${
          isDark ? "bg-[#0c1a2e] border-white/5" : "bg-white border-slate-200"
        }`}
      >
        {/* Ticket list left sidebar */}
        <div
          className={`w-full md:w-80 border-r border-solid shrink-0 flex flex-col ${
            isDark ? "border-white/5 bg-[#09111e]/30" : "border-slate-100 bg-slate-50/50"
          }`}
        >
          <div className="p-4 border-b border-solid border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
            <h3 className="text-xs font-bold uppercase tracking-wider opacity-60">
              Active Support Tickets
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-solid divide-slate-105 dark:divide-white/3">
            {tickets.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-500">
                No tickets open.
              </div>
            ) : (
              tickets.map((ticket) => {
                const isActive = ticket.id === activeTicketId;
                const lastMsg = ticket.messages[ticket.messages.length - 1];
                return (
                  <button
                    key={ticket.id}
                    onClick={() => setActiveTicketId(ticket.id)}
                    className={`w-full p-4 flex flex-col gap-2 text-left transition-colors cursor-pointer ${
                      isActive
                        ? isDark
                          ? "bg-sky-500/10"
                          : "bg-sky-50/70"
                        : "hover:bg-slate-50 dark:hover:bg-white/3"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] font-bold opacity-60">{ticket.id}</span>
                      <StatusBadge status={ticket.status} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold leading-snug line-clamp-1">{ticket.subject}</h4>
                      <p className="text-[10px] opacity-50 line-clamp-1 mt-0.5">{lastMsg?.text}</p>
                    </div>
                    <div className="flex justify-between items-center text-[9px] opacity-45 border-t border-dashed border-slate-200 dark:border-white/5 pt-1.5 mt-1">
                      <span className="font-bold uppercase tracking-wider">Priority: {ticket.priority}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {ticket.createdAt.split("T")[0]}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Thread Panel right workspace */}
        <div className="flex-1 flex flex-col bg-[#061121]/5 dark:bg-[#030912]/20">
          {activeTicket ? (
            <>
              {/* Chat Thread Header */}
              <div
                className={`p-4 border-b flex items-center justify-between gap-4 ${
                  isDark ? "border-white/5 bg-[#09111e]/40" : "border-slate-100 bg-slate-50/20"
                }`}
              >
                <div>
                  <h3 className="text-xs font-bold leading-normal">{activeTicket.subject}</h3>
                  <div className="flex items-center gap-3 text-[10px] opacity-60 mt-1">
                    <span>Category: {activeTicket.category}</span>
                    <span>Assigned: {activeTicket.assignedTo}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <StatusBadge status={activeTicket.priority} />
                </div>
              </div>

              {/* Chat Log Window */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[380px] min-h-[300px]">
                {activeTicket.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 max-w-lg ${
                      msg.isAgent ? "" : "ml-auto flex-row-reverse"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white text-[10px] font-black uppercase shadow-sm ${
                        msg.isAgent ? "bg-sky-500" : "bg-purple-500"
                      }`}
                    >
                      {msg.isAgent ? "SA" : "CA"}
                    </div>
                    <div className="space-y-1">
                      <div className={`flex items-center gap-2 text-[9px] opacity-55 ${msg.isAgent ? "" : "justify-end"}`}>
                        <span className="font-bold">{msg.sender}</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <div
                        className={`p-3 rounded-2xl text-xs leading-relaxed ${
                          msg.isAgent
                            ? isDark
                              ? "bg-slate-800 text-white rounded-tl-none border border-white/5 shadow-sm"
                              : "bg-slate-100 text-slate-850 rounded-tl-none border border-slate-200 shadow-sm"
                            : isDark
                            ? "bg-sky-500/20 text-white rounded-tr-none border border-sky-500/20 shadow-sm"
                            : "bg-sky-50 text-sky-900 rounded-tr-none border border-sky-100 shadow-sm"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Animated Typing Indicator */}
                {isAgentTyping && (
                  <div className="flex items-start gap-2.5 max-w-lg">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white text-[10px] font-bold bg-sky-500 shadow-sm animate-pulse">
                      SA
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] opacity-55 font-semibold">Agent is typing...</span>
                      <div className={`p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-850 rounded-tl-none border border-slate-200 dark:border-white/5 flex items-center gap-1`}>
                        <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat message composer form */}
              <form
                onSubmit={handleSendMessage}
                className={`p-4 border-t flex items-center gap-2.5 bg-slate-50/50 dark:bg-white/2 ${
                  isDark ? "border-white/5" : "border-slate-150"
                }`}
              >
                <input
                  type="text"
                  placeholder="Type your message reply..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className={`flex-1 py-2 px-3 rounded-lg border text-xs outline-none transition-all focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 ${
                    isDark
                      ? "bg-white/5 border-white/10 text-white placeholder:text-white/20"
                      : "bg-white border-slate-200 text-slate-800 placeholder:text-slate-400"
                  }`}
                />
                <button
                  type="submit"
                  disabled={!messageText.trim() || isAgentTyping}
                  className={`p-2 rounded-lg bg-sky-500 hover:bg-sky-650 text-white disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-xs text-gray-500">
              <MessageSquare className="w-8 h-8 opacity-30 mb-2 animate-pulse" />
              <p>Select a ticket from the list or create a new one to start messaging.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── CREATE SUPPORT TICKET DIALOG MODAL ─────────────────────────────────── */}
      {showCreateModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setShowCreateModal(false)}
          />
          {/* Dialog Container */}
          <div
            className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md shadow-2xl z-50 rounded-xl overflow-hidden border ${
              isDark ? "bg-[#0b1625] border-white/5 text-white" : "bg-white border-slate-200 text-slate-850"
            }`}
          >
            {/* Header */}
            <div
              className={`p-4 border-b flex items-center justify-between gap-4 ${
                isDark ? "border-white/5 bg-[#09111e]" : "border-slate-100 bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <ShieldQuestion className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold">Open New Support Ticket</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  isDark ? "hover:bg-white/5" : "hover:bg-slate-100"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateSubmit} className="p-5 space-y-4">
              {/* Category */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase opacity-60">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className={`w-full py-2 px-3 rounded-lg border text-xs outline-none ${
                      isDark
                        ? "bg-[#0c1a2e] border-white/10 text-white focus:border-sky-500"
                        : "bg-white border-slate-200 text-slate-850 focus:border-sky-500"
                    }`}
                    required
                  >
                    <option value="Course Management">Course Management</option>
                    <option value="Verification">Verification</option>
                    <option value="Profile Setup">Profile Setup</option>
                    <option value="General">General Support</option>
                  </select>
                </div>

                {/* Priority */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase opacity-60">Priority Level</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className={`w-full py-2 px-3 rounded-lg border text-xs outline-none ${
                      isDark
                        ? "bg-[#0c1a2e] border-white/10 text-white focus:border-sky-500"
                        : "bg-white border-slate-200 text-slate-850 focus:border-sky-500"
                    }`}
                    required
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase opacity-60">Subject / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Course enrollment issue or CDC verification delayed..."
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className={`w-full py-2 px-3 rounded-lg border text-xs outline-none ${
                    isDark
                      ? "bg-[#0c1a2e] border-white/10 text-white focus:border-sky-500"
                      : "bg-white border-slate-200 text-slate-850 focus:border-sky-500"
                  }`}
                  required
                />
              </div>

              {/* Message Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase opacity-60">Message Description</label>
                <textarea
                  placeholder="Describe your request in detail so our agents can review details..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className={`w-full py-2 px-3 rounded-lg border text-xs outline-none h-24 ${
                    isDark
                      ? "bg-[#0c1a2e] border-white/10 text-white focus:border-sky-500 placeholder:text-white/20"
                      : "bg-white border-slate-200 text-slate-800 focus:border-sky-500 placeholder:text-slate-400"
                  }`}
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold border cursor-pointer transition-colors ${
                    isDark
                      ? "border-white/10 hover:bg-white/5 text-white"
                      : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg text-xs font-bold border cursor-pointer transition-colors ${
                    isDark
                      ? "bg-white text-black border-transparent hover:bg-gray-200"
                      : "bg-black text-white border-transparent hover:bg-gray-800"
                  }`}
                >
                  Create Support Ticket
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
