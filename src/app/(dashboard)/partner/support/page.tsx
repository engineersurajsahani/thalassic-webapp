"use client";

import React, { useEffect, useState } from "react";
import { partnerService } from "@/services/partner.service";
import { useTheme } from "@/providers/theme-provider";
import {
  LifeBuoy,
  Plus,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function PartnerPartnerSupportPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted ? theme === "dark" : true;

  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState("Course Scheduling");
  const [priority, setPriority] = useState("Normal");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("All");

  const loadTickets = async () => {
    try {
      const data = await partnerService.getSupportTickets();
      setTickets(data || []);
    } catch (err) {
      console.error("Failed to load tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await partnerService.createSupportTicket({
        subject,
        description: `[Category: ${category} | Priority: ${priority}] ${description}`,
      });
      setSubject("");
      setDescription("");
      setShowModal(false);
      await loadTickets();
    } catch (err) {
      console.error("Ticket creation error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const cardBg = isDark
    ? "bg-[#09162c]/90 border-white/10 shadow-xl"
    : "bg-white border-slate-200 shadow-md";

  const headingText = isDark ? "text-white font-extrabold" : "text-slate-900 font-extrabold";
  const subText = isDark ? "text-slate-300 font-medium" : "text-slate-600 font-medium";
  const labelText = isDark ? "text-slate-200 font-bold" : "text-slate-800 font-bold";
  const accentText = isDark ? "text-cyan-300 font-extrabold" : "text-blue-700 font-extrabold";
  const inputStyle = isDark
    ? "bg-[#080F1E] border border-white/15 text-white placeholder-slate-500 focus:border-cyan-400"
    : "bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-600 shadow-sm";

  // Filtered tickets
  const filteredTickets = tickets.filter((t) => {
    if (activeTab === "Open") return t.status === "Open" || t.status === "Pending";
    if (activeTab === "Resolved") return t.status === "Resolved" || t.status === "Closed";
    return true;
  });

  const openCount = tickets.filter((t) => t.status === "Open" || t.status === "Pending").length;
  const resolvedCount = tickets.filter((t) => t.status === "Resolved" || t.status === "Closed").length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${headingText}`}>
            Partner Support Tickets
          </h1>
          <p className={`text-xs md:text-sm mt-1 ${subText}`}>
            Direct channel to Hari Om Operations for course schedule inquiries, billing disputes, and candidate verification.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white transition-all shadow-lg shadow-blue-500/25 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Support Ticket
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-2xl border ${cardBg}`}>
          <p className={`text-[10px] uppercase font-bold ${subText}`}>Total Inquiries</p>
          <p className={`text-2xl font-black mt-1 ${headingText}`}>{tickets.length}</p>
        </div>
        <div className={`p-4 rounded-2xl border ${cardBg}`}>
          <p className={`text-[10px] uppercase font-bold ${isDark ? "text-amber-300" : "text-amber-700"}`}>Active Open</p>
          <p className={`text-2xl font-black mt-1 ${headingText}`}>{openCount}</p>
        </div>
        <div className={`p-4 rounded-2xl border ${cardBg}`}>
          <p className={`text-[10px] uppercase font-bold ${isDark ? "text-emerald-300" : "text-emerald-700"}`}>Resolved</p>
          <p className={`text-2xl font-black mt-1 ${headingText}`}>{resolvedCount}</p>
        </div>
        <div className={`p-4 rounded-2xl border ${cardBg}`}>
          <p className={`text-[10px] uppercase font-bold ${subText}`}>Avg Response SLA</p>
          <p className={`text-2xl font-black mt-1 ${accentText}`}>&lt; 24 Hrs</p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className={`p-6 rounded-3xl border space-y-4 ${cardBg}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-2">
            {["All", "Open", "Resolved"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeTab === tab
                    ? isDark
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                      : "bg-blue-600 text-white shadow-sm"
                    : isDark
                    ? "bg-white/5 text-slate-400 hover:bg-white/10"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {tab} Tickets {tab === "Open" && openCount > 0 ? `(${openCount})` : ""}
              </button>
            ))}
          </div>

          <span className={`text-xs font-semibold ${subText}`}>
            Showing {filteredTickets.length} of {tickets.length} tickets
          </span>
        </div>

        {/* Tickets List */}
        {loading ? (
          <div className="p-8 text-center text-slate-400 animate-pulse">Loading support tickets...</div>
        ) : filteredTickets.length === 0 ? (
          <div className={`p-10 text-center border border-dashed rounded-2xl space-y-3 ${
            isDark ? "border-white/10" : "border-slate-300"
          }`}>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
              <LifeBuoy className="w-7 h-7" />
            </div>
            <div>
              <p className={`font-extrabold text-base ${headingText}`}>No Support Tickets Found</p>
              <p className={`text-xs mt-1 max-w-md mx-auto ${subText}`}>
                Need assistance with seafarer course enrollment, DG Shipping physical batches, or settlement remittance? Open a new inquiry anytime.
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Open New Ticket
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTickets.map((t) => {
              const isOpen = t.status === "Open" || t.status === "Pending";
              return (
                <div
                  key={t.id}
                  className={`p-4.5 rounded-2xl border transition-all space-y-2 ${
                    isDark ? "bg-white/[0.02] border-white/10 hover:bg-white/5" : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className={`text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded ${
                        isDark ? "bg-white/10 text-cyan-300 border border-white/15" : "bg-blue-100 text-blue-900 border border-blue-300"
                      }`}>
                        #{t.id.slice(0, 10)}
                      </span>
                      <h3 className={`font-extrabold text-sm ${headingText}`}>{t.subject}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        isOpen
                          ? isDark
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-amber-100 text-amber-900 border border-amber-300"
                          : isDark
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                      }`}>
                        {t.status || "Open"}
                      </span>
                    </div>
                  </div>

                  <p className={`text-xs ${subText} line-clamp-2`}>{t.description}</p>

                  <div className={`flex items-center justify-between pt-2 text-[11px] font-medium border-t ${
                    isDark ? "border-white/5 text-slate-400" : "border-slate-200 text-slate-600"
                  }`}>
                    <span>Created: {new Date(t.createdAt).toLocaleDateString("en-IN")}</span>
                    <span className="font-semibold text-cyan-400">Assigned to Hari Om Ops →</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modern Ticket Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className={`w-full max-w-lg p-6 md:p-8 rounded-3xl border space-y-5 ${cardBg}`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2">
                <LifeBuoy className={`w-5 h-5 ${isDark ? "text-cyan-400" : "text-blue-600"}`} />
                <h2 className={`text-base font-extrabold ${headingText}`}>Create Support Inquiry</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className={`text-xs font-bold ${isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"}`}
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs font-medium">
              <div>
                <label className={`block mb-1.5 ${labelText}`}>Inquiry Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl font-semibold outline-none ${inputStyle}`}
                >
                  <option value="Course Scheduling">Course Scheduling & Physical Batches</option>
                  <option value="Candidate Verification">Candidate INDoS / Document Verification</option>
                  <option value="Settlement & Financials">Settlement Remittance & UTR Check</option>
                  <option value="RPSL Licensing">RPSL / Agency Account Inquiry</option>
                  <option value="Other Operations">Other Technical Inquiry</option>
                </select>
              </div>

              <div>
                <label className={`block mb-1.5 ${labelText}`}>Inquiry Priority</label>
                <div className="grid grid-cols-2 gap-3">
                  {["Normal", "Urgent"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`py-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                        priority === p
                          ? p === "Urgent"
                            ? "bg-rose-500 text-white border-rose-600"
                            : "bg-blue-600 text-white border-blue-700"
                          : isDark
                          ? "bg-white/5 border-white/10 text-slate-300"
                          : "bg-slate-100 border-slate-300 text-slate-700"
                      }`}
                    >
                      {p} Priority
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={`block mb-1.5 ${labelText}`}>Inquiry Subject *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Schedule inquiry for STCW BST August Batch"
                  className={`w-full px-3.5 py-2.5 rounded-xl font-bold outline-none ${inputStyle}`}
                />
              </div>

              <div>
                <label className={`block mb-1.5 ${labelText}`}>Detailed Description *</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide complete details including purchase ID or candidate INDoS number if applicable..."
                  className={`w-full px-3.5 py-2.5 rounded-xl font-medium outline-none ${inputStyle}`}
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold ${
                    isDark ? "bg-white/10 text-white" : "bg-slate-200 text-slate-800"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-md cursor-pointer"
                >
                  {submitting ? "Submitting..." : "Submit Ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
