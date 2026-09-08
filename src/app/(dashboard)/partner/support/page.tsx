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

export default function PartnerSupportPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
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
    setSubmitting(true);
    try {
      await partnerService.createSupportTicket({ subject, description });
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
    ? "bg-[#09162c]/80 border-white/5 shadow-sm"
    : "bg-white border-slate-200/80 shadow-sm";

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Partner Support Tickets
          </h1>
          <p className={`text-xs md:text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Contact Hari Om Operations for course schedule inquiries, billing disputes, and candidate verification help.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Support Ticket
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-6 rounded-3xl border ${cardBg}`}>
            <h2 className="text-sm font-bold text-white mb-4">New Support Inquiry</h2>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Schedule inquiry for BST Batch"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs outline-none ${
                    isDark ? "bg-white/5 border border-white/10 text-white" : "bg-slate-50 border border-slate-200"
                  }`}
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide detailed information regarding your inquiry..."
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs outline-none ${
                    isDark ? "bg-white/5 border border-white/10 text-white" : "bg-slate-50 border border-slate-200"
                  }`}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-white/10 text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950"
                >
                  {submitting ? "Submitting..." : "Submit Ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={`p-6 rounded-3xl border ${cardBg}`}>
        {loading ? (
          <div className="p-8 text-center text-slate-400 animate-pulse">Loading support tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="p-8 text-center border border-dashed rounded-2xl border-white/10 text-slate-400 text-xs">
            <LifeBuoy className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="font-semibold text-slate-200">No support tickets created.</p>
            <p className="mt-1">Need help? Open a new ticket anytime.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((t) => (
              <div key={t.id} className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-white text-xs">{t.subject}</p>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400">
                      {t.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{t.description}</p>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">
                  {new Date(t.createdAt).toLocaleDateString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
