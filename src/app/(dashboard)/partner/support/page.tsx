"use client";

import React, { useState, useEffect } from "react";
import { partnerService } from "@/services/partner.service";
import { useTheme } from "@/providers/theme-provider";
import {
  LifeBuoy,
  Plus,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileQuestion,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function PartnerSupportPage() {
  const { theme } = useTheme();
  const mounted = true;
  useEffect(() => setMounted(true), []);
  const isDark = mounted ? theme === "dark" : true;

  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"All" | "Open" | "Resolved">("All");

  // Create Modal State
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState("Course Inquiry");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
    if (!subject.trim() || !description.trim()) {
      toast.error("Please provide both subject and description.");
      return;
    }

    setSubmitting(true);
    try {
      await partnerService.createSupportTicket({
        category,
        subject,
        description,
      });
      toast.success("Support ticket created successfully!");
      setShowModal(false);
      setSubject("");
      setDescription("");
      await loadTickets();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to create support ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  const cardBg = isDark
    ? "bg-[#0B0F19] rounded-[16px] border-0 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
    : "bg-[#FFFFFF] rounded-[16px] border-0 shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]";

  const headingText = isDark ? "text-white font-extrabold" : "text-[#111827] font-extrabold";
  const subText = isDark ? "text-gray-400 font-medium" : "text-[#6B7280] font-medium";
  const labelText = isDark ? "text-gray-300 font-bold" : "text-[#111827] font-bold";
  const accentText = "text-[#3D5EF6] font-extrabold";
  const inputStyle = isDark
    ? "bg-[#111827] border border-[#1F2937] text-white placeholder-gray-500 focus:border-[#3D5EF6]"
    : "bg-[#FAFAFA] border border-[#E5E7EB] text-[#111827] placeholder-[#9CA3AF] focus:border-[#3D5EF6] shadow-sm";

  // Filtered tickets
  const filteredTickets = tickets.filter((t) => {
    if (activeTab === "Open") return t.status === "Open" || t.status === "Pending";
    if (activeTab === "Resolved") return t.status === "Resolved" || t.status === "Closed";
    return true;
  });

  const openCount = tickets.filter((t) => t.status === "Open" || t.status === "Pending").length;
  const resolvedCount = tickets.filter((t) => t.status === "Resolved" || t.status === "Closed").length;

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
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
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white transition-colors shadow-sm shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Support Ticket
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-4.5 ${cardBg}`}>
          <p className={`text-[10px] uppercase font-bold ${subText}`}>Total Inquiries</p>
          <p className={`text-2xl font-black mt-1 ${headingText}`}>{tickets.length}</p>
        </div>
        <div className={`p-4.5 ${cardBg}`}>
          <p className={`text-[10px] uppercase font-bold text-[#B45309] dark:text-amber-400`}>Active Open</p>
          <p className={`text-2xl font-black mt-1 ${headingText}`}>{openCount}</p>
        </div>
        <div className={`p-4.5 ${cardBg}`}>
          <p className={`text-[10px] uppercase font-bold text-[#16A34A] dark:text-emerald-400`}>Resolved</p>
          <p className={`text-2xl font-black mt-1 ${headingText}`}>{resolvedCount}</p>
        </div>
        <div className={`p-4.5 ${cardBg}`}>
          <p className={`text-[10px] uppercase font-bold ${subText}`}>Avg Response SLA</p>
          <p className={`text-2xl font-black mt-1 ${accentText}`}>&lt; 24 Hrs</p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className={`p-6 space-y-4 ${cardBg}`}>
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b ${isDark ? "border-[#1F2937]" : "border-[#E5E7EB]"}`}>
          <div className="flex items-center gap-2">
            {(["All", "Open", "Resolved"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === tab
                    ? "bg-[#3D5EF6] text-white shadow-sm"
                    : isDark
                    ? "bg-white/5 text-gray-400 hover:bg-white/10"
                    : "bg-[#FAFAFA] text-[#6B7280] hover:bg-[#EEF1FE] hover:text-[#3D5EF6]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <span className={`text-xs font-semibold ${subText}`}>
            Showing {filteredTickets.length} of {tickets.length} tickets
          </span>
        </div>

        {/* Tickets List */}
        {loading ? (
          <div className="p-8 text-center text-gray-400 animate-pulse">Loading support tickets...</div>
        ) : filteredTickets.length === 0 ? (
          <div className={`p-10 text-center border border-dashed rounded-[16px] space-y-3 ${
            isDark ? "border-white/10" : "border-[#E5E7EB]"
          }`}>
            <div className="w-12 h-12 rounded-full bg-[#EEF1FE] text-[#3D5EF6] dark:bg-[#3D5EF6]/15 flex items-center justify-center mx-auto shadow-sm">
              <LifeBuoy className="w-6 h-6" />
            </div>
            <div>
              <p className={`font-extrabold text-base ${headingText}`}>No Support Tickets Found</p>
              <p className={`text-xs mt-1 max-w-md mx-auto ${subText}`}>
                Need assistance with seafarer course enrollment, training batches, or settlement remittance? Open a new inquiry anytime.
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white shadow-sm cursor-pointer transition-colors"
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
                  className={`p-4.5 rounded-[16px] transition-all space-y-2 ${
                    isDark ? "bg-white/[0.02] hover:bg-white/5" : "bg-[#FAFAFA] hover:bg-[#EEF1FE]/30"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#EEF1FE] text-[#3D5EF6] dark:bg-[#3D5EF6]/15">
                        #{t.id.slice(0, 10)}
                      </span>
                      <h3 className={`font-extrabold text-sm ${headingText}`}>{t.subject}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-lg ${
                        isOpen
                          ? "bg-[#FEF3C7] text-[#B45309] dark:bg-amber-500/15 dark:text-amber-400"
                          : "bg-[#DCFCE7] text-[#16A34A] dark:bg-emerald-500/15 dark:text-emerald-400"
                      }`}>
                        {t.status || "Open"}
                      </span>
                    </div>
                  </div>

                  <p className={`text-xs ${subText} line-clamp-2`}>{t.description}</p>

                  <div className={`flex items-center justify-between pt-2 text-[11px] font-medium border-t ${
                    isDark ? "border-white/5 text-gray-400" : "border-[#E5E7EB] text-[#6B7280]"
                  }`}>
                    <span>Created: {new Date(t.createdAt).toLocaleDateString("en-IN")}</span>
                    <span className="font-semibold text-[#3D5EF6]">Assigned to Hari Om Ops →</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modern Ticket Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className={`w-full max-w-lg p-6 md:p-8 rounded-[16px] space-y-5 ${cardBg}`}>
            <div className={`flex items-center justify-between border-b pb-3 ${isDark ? "border-[#1F2937]" : "border-[#E5E7EB]"}`}>
              <div className="flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-[#3D5EF6]" />
                <h2 className={`text-base font-extrabold ${headingText}`}>Create Support Inquiry</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className={`text-xs font-bold ${isDark ? "text-gray-400 hover:text-white" : "text-[#6B7280] hover:text-[#111827]"}`}
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
                  <option value="Course Inquiry">Course Schedule & Batches</option>
                  <option value="Billing Dispute">Settlement & Billing Inquiry</option>
                  <option value="Candidate Verification">Candidate INDoS / Document Issue</option>
                  <option value="Technical Support">Platform Technical Issue</option>
                </select>
              </div>

              <div>
                <label className={`block mb-1.5 ${labelText}`}>Subject *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. STCW BST batch slot reservation issue..."
                  className={`w-full px-3.5 py-2.5 rounded-xl font-medium outline-none ${inputStyle}`}
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

              <div className={`flex justify-end gap-3 pt-3 border-t ${isDark ? "border-[#1F2937]" : "border-[#E5E7EB]"}`}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold ${
                    isDark ? "bg-white/10 text-white" : "bg-[#F3F4F6] text-[#6B7280]"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-lg text-xs font-bold bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white shadow-sm transition-colors cursor-pointer"
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
