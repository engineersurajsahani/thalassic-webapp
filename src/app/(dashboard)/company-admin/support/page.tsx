"use client";

import React, { useState, useMemo } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  Headphones, Search, MessageCircle, Clock, CheckCircle2,
  AlertCircle, ArrowUpRight, X, Send, User, Calendar,
  ChevronRight, Tag, Zap, Globe, Handshake, Filter, CircleDot,
} from "lucide-react";

// ─── Mock Data ──────────────────────────────────────────────────────────────

const TICKETS = [
  {
    id: "TKT-0041", subject: "CDC document not accepted",      seafarer: "Raj Kumar",      source: "website", priority: "High",   status: "Open",       date: "Jul 30, 2026", category: "Documents",
    messages: [
      { from: "Raj Kumar",      time: "Jul 30, 9:12 AM", text: "My CDC copy was rejected. I uploaded a clear scan but it still says rejected." },
      { from: "Support Team",   time: "Jul 30, 10:45 AM",text: "Hi Raj, we are checking with the verification team. Please allow 24 hours." },
    ],
  },
  {
    id: "TKT-0040", subject: "Agent enrolment not reflecting",  seafarer: "Arjun Dev",      source: "agent",   priority: "High",   status: "Open",       date: "Jul 29, 2026", category: "Enrolment",
    messages: [
      { from: "Capt. Nair",     time: "Jul 29, 3:00 PM", text: "Arjun Dev was enrolled by our agency 3 days ago but his profile is still pending." },
    ],
  },
  {
    id: "TKT-0039", subject: "Course schedule change request",  seafarer: "Priya Sharma",   source: "website", priority: "Medium", status: "In Progress",date: "Jul 28, 2026", category: "Courses",
    messages: [
      { from: "Priya Sharma",   time: "Jul 28, 11:00 AM",text: "I need to shift my Deck Watchkeeping course by one week due to personal reasons." },
      { from: "Support Team",   time: "Jul 28, 2:30 PM", text: "Noted, Priya. We will process the reschedule request within 2 business days." },
      { from: "Priya Sharma",   time: "Jul 29, 9:00 AM", text: "Any update? My joining date is coming up soon." },
    ],
  },
  {
    id: "TKT-0038", subject: "Login OTP not received",          seafarer: "Naresh Pillai",  source: "agent",   priority: "Medium", status: "Resolved",   date: "Jul 27, 2026", category: "Account",
    messages: [
      { from: "Rajan Associates",time:"Jul 27, 8:00 AM",  text: "Our seafarer Naresh is not getting OTP on his registered mobile." },
      { from: "Support Team",   time: "Jul 27, 8:45 AM", text: "We have resent the OTP and updated the phone number. Please try again." },
    ],
  },
  {
    id: "TKT-0037", subject: "Invoice not generated",           seafarer: "Kavitha Bose",   source: "agent",   priority: "Low",    status: "Resolved",   date: "Jul 25, 2026", category: "Billing",
    messages: [
      { from: "SeaLink Agency", time: "Jul 25, 4:00 PM", text: "Invoice for Kavitha Bose's course has not been generated after payment." },
      { from: "Support Team",   time: "Jul 25, 4:50 PM", text: "Invoice generated and emailed to your registered email. Please check your inbox." },
    ],
  },
  {
    id: "TKT-0036", subject: "Medical certificate mismatch",    seafarer: "Geetha Menon",   source: "agent",   priority: "High",   status: "In Progress",date: "Jul 24, 2026", category: "Documents",
    messages: [
      { from: "SeaLink Agency", time: "Jul 24, 10:00 AM",text: "Geetha's medical certificate name doesn't match her CDC. She goes by two names." },
      { from: "Support Team",   time: "Jul 24, 11:30 AM",text: "We have escalated this to the compliance team. Expect an update in 48 hours." },
    ],
  },
  {
    id: "TKT-0035", subject: "Fee refund for dropped course",   seafarer: "Karan Mehta",    source: "website", priority: "Medium", status: "Open",       date: "Jul 22, 2026", category: "Billing",
    messages: [
      { from: "Karan Mehta",    time: "Jul 22, 6:00 PM", text: "I dropped out of Ship Navigation due to a medical emergency. Please refund the fee." },
    ],
  },
  {
    id: "TKT-0034", subject: "Certificate not downloadable",    seafarer: "Suresh Verma",   source: "website", priority: "Low",    status: "Resolved",   date: "Jul 21, 2026", category: "Certificate",
    messages: [
      { from: "Suresh Verma",   time: "Jul 21, 2:00 PM", text: "The download button for my Engine Room certificate shows an error." },
      { from: "Support Team",   time: "Jul 21, 3:15 PM", text: "Fixed! The PDF link was broken. You can now download from your profile." },
    ],
  },
];

const CATEGORIES = ["All", "Documents", "Enrolment", "Courses", "Account", "Billing", "Certificate"];
const STATUSES   = ["All", "Open", "In Progress", "Resolved"];
const PRIORITIES = ["All", "High", "Medium", "Low"];

const priorityCls: Record<string, [string, string]> = {
  High:   ["bg-red-100 text-red-700",    "bg-red-500/10 text-red-400"],
  Medium: ["bg-amber-100 text-amber-700","bg-amber-500/10 text-amber-400"],
  Low:    ["bg-slate-100 text-slate-600","bg-white/5 text-white/40"],
};
const priorityIcons: Record<string, React.ReactNode> = {
  High:   <Zap         className="w-3 h-3" />,
  Medium: <CircleDot   className="w-3 h-3" />,
  Low:    <Tag         className="w-3 h-3" />,
};
const statusCls: Record<string, [string, string]> = {
  "Open":        ["bg-indigo-100 text-indigo-700",  "bg-indigo-500/10 text-indigo-400"],
  "In Progress": ["bg-amber-100 text-amber-700",    "bg-amber-500/10 text-amber-400"],
  "Resolved":    ["bg-emerald-100 text-emerald-700","bg-emerald-500/10 text-emerald-400"],
};
const statusIcons: Record<string, React.ReactNode> = {
  "Open":        <MessageCircle className="w-3 h-3" />,
  "In Progress": <Clock         className="w-3 h-3" />,
  "Resolved":    <CheckCircle2  className="w-3 h-3" />,
};

type Ticket = typeof TICKETS[0];

// ─── Ticket Detail Drawer ────────────────────────────────────────────────────

function TicketDrawer({ ticket, dk, onClose }: { ticket: Ticket; dk: boolean; onClose: () => void }) {
  const [reply, setReply] = useState("");

  const bg       = dk ? "bg-[#0d1f35] border-l border-white/8"  : "bg-white border-l border-slate-200";
  const ht       = dk ? "text-white/85"   : "text-slate-800";
  const mt       = dk ? "text-white/35"   : "text-slate-400";
  const divBor   = dk ? "border-white/6"  : "border-slate-100";
  const cardBg   = dk ? "bg-white/[0.04] border border-white/6" : "bg-slate-50 border border-slate-100";
  const inputBg  = dk ? "bg-white/5 border-white/10 text-white/70 placeholder:text-white/25 focus:border-indigo-500/50" : "bg-white border-slate-200 text-slate-700 placeholder:text-slate-400 focus:border-indigo-400";
  const selfMsg  = dk ? "bg-indigo-500/20 text-indigo-100 ml-auto" : "bg-indigo-500 text-white ml-auto";
  const otherMsg = dk ? "bg-white/6 text-white/75"                  : "bg-slate-100 text-slate-700";

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className={`relative ml-auto w-full max-w-lg h-full flex flex-col shadow-2xl ${bg}`}
        onClick={e => e.stopPropagation()}
        style={{ animation: "slideInRight 0.25s ease" }}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-4 border-b ${divBor}`}>
          <div>
            <p className={`text-sm font-semibold ${ht}`}>{ticket.subject}</p>
            <p className={`text-[11px] font-mono mt-0.5 ${mt}`}>{ticket.id}</p>
          </div>
          <button onClick={onClose} className={`p-1.5 rounded-lg transition-colors ${dk ? "hover:bg-white/8 text-white/40 hover:text-white/70" : "hover:bg-slate-100 text-slate-400 hover:text-slate-600"}`}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Meta */}
        <div className={`px-5 py-3 border-b ${divBor} flex items-center gap-3 flex-wrap`}>
          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${dk ? statusCls[ticket.status]?.[1] : statusCls[ticket.status]?.[0]}`}>
            {statusIcons[ticket.status]}{ticket.status}
          </span>
          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${dk ? priorityCls[ticket.priority]?.[1] : priorityCls[ticket.priority]?.[0]}`}>
            {priorityIcons[ticket.priority]}{ticket.priority}
          </span>
          <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full ${dk ? "bg-white/5 text-white/40" : "bg-slate-100 text-slate-500"}`}>
            <Tag className="w-3 h-3" />{ticket.category}
          </span>
          <span className={`inline-flex items-center gap-1 text-[11px] ${mt}`}>
            <Calendar className="w-3 h-3" />{ticket.date}
          </span>
        </div>

        {/* Seafarer info */}
        <div className={`px-5 py-3 border-b ${divBor}`}>
          <div className={`flex items-center gap-3 rounded-xl p-3 ${cardBg}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${ticket.source === "website" ? "bg-sky-500" : "bg-indigo-500"}`}>
              {ticket.seafarer.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-[13px] font-semibold ${ht}`}>{ticket.seafarer}</p>
              <div className="flex items-center gap-1 mt-0.5">
                {ticket.source === "website"
                  ? <Globe className={`w-3 h-3 ${dk ? "text-sky-400" : "text-sky-600"}`} />
                  : <Handshake className={`w-3 h-3 ${dk ? "text-indigo-400" : "text-indigo-600"}`} />}
                <span className={`text-[11px] ${mt}`}>{ticket.source === "website" ? "Website (Group 1)" : "Agent (Group 2)"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {ticket.messages.map((m, i) => {
            const isSupport = m.from === "Support Team";
            return (
              <div key={i} className={`flex flex-col max-w-[85%] ${isSupport ? "ml-auto items-end" : "items-start"}`}>
                <p className={`text-[10px] mb-1 ${mt}`}>{m.from} · {m.time}</p>
                <div className={`rounded-xl px-3 py-2.5 text-[12px] leading-relaxed ${isSupport ? selfMsg : otherMsg}`}>
                  {m.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Reply box */}
        {ticket.status !== "Resolved" && (
          <div className={`px-5 py-4 border-t ${divBor}`}>
            <div className={`flex items-end gap-2 rounded-xl border p-3 ${inputBg}`}>
              <textarea
                value={reply}
                onChange={e => setReply(e.target.value)}
                placeholder="Type a reply…"
                rows={2}
                className="flex-1 bg-transparent outline-none text-sm resize-none"
              />
              <button
                disabled={!reply.trim()}
                className="shrink-0 w-8 h-8 rounded-lg bg-indigo-500 hover:bg-indigo-600 disabled:opacity-30 flex items-center justify-center transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        )}

        <style>{`@keyframes slideInRight{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function SupportPage() {
  const { theme } = useTheme();
  const dk = theme === "dark";

  const [query,    setQuery]    = useState("");
  const [status,   setStatus]   = useState("All");
  const [priority, setPriority] = useState("All");
  const [selected, setSelected] = useState<Ticket | null>(null);

  const card   = `rounded-2xl overflow-hidden ${dk ? "bg-[#0d1f35] border border-white/[0.06]" : "bg-white border border-slate-200 shadow-sm"}`;
  const ht     = dk ? "text-white/80"  : "text-slate-800";
  const mt     = dk ? "text-white/35"  : "text-slate-400";
  const inputBg= dk ? "bg-white/5 border-white/10 text-white/70 placeholder:text-white/25" : "bg-slate-50 border-slate-200 text-slate-700 placeholder:text-slate-400";
  const divider= dk ? "divide-white/[0.05]" : "divide-slate-100";
  const rowHov = dk ? "hover:bg-white/[0.03] cursor-pointer" : "hover:bg-slate-50 cursor-pointer";
  const chipAct= "bg-indigo-500 text-white";
  const chipIn = dk ? "bg-white/5 text-white/40 hover:text-white/60" : "bg-slate-100 text-slate-500 hover:text-slate-700";

  const filtered = useMemo(() =>
    TICKETS.filter(t => {
      const q = query.toLowerCase();
      const matchQ = t.subject.toLowerCase().includes(q) || t.seafarer.toLowerCase().includes(q) || t.id.toLowerCase().includes(q);
      const matchStatus   = status   === "All" || t.status   === status;
      const matchPriority = priority === "All" || t.priority === priority;
      return matchQ && matchStatus && matchPriority;
    }),
    [query, status, priority]
  );

  const kpis = [
    { label: "Total Tickets",  value: TICKETS.length,                                                  color: dk ? "text-indigo-400"  : "text-indigo-600",  bg: dk ? "bg-indigo-500/15"  : "bg-indigo-50",  icon: Headphones },
    { label: "Open",           value: TICKETS.filter(t => t.status === "Open").length,              color: dk ? "text-sky-400"     : "text-sky-600",     bg: dk ? "bg-sky-500/15"     : "bg-sky-50",     icon: MessageCircle },
    { label: "In Progress",    value: TICKETS.filter(t => t.status === "In Progress").length,       color: dk ? "text-amber-400"   : "text-amber-600",   bg: dk ? "bg-amber-500/15"   : "bg-amber-50",   icon: Clock },
    { label: "Resolved",       value: TICKETS.filter(t => t.status === "Resolved").length,         color: dk ? "text-emerald-400" : "text-emerald-600", bg: dk ? "bg-emerald-500/15" : "bg-emerald-50", icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-5">
      {selected && <TicketDrawer ticket={selected} dk={dk} onClose={() => setSelected(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-bold ${ht}`}>Support</h1>
          <p className={`text-sm mt-0.5 ${mt}`}>Tickets raised by seafarers and agents</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <MessageCircle className="w-4 h-4" /> New Ticket
        </button>
      </div>

      {/* KPI strip */}
      <div className={card}>
        <div className={`grid grid-cols-2 xl:grid-cols-4 divide-x divide-y xl:divide-y-0 ${dk ? "divide-white/[0.05]" : "divide-slate-100"}`}>
          {kpis.map(k => {
            const Icon = k.icon;
            return (
              <div key={k.label} className="flex items-center gap-4 px-6 py-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${k.bg}`}>
                  <Icon className={`w-5 h-5 ${k.color}`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${ht}`}>{k.value}</p>
                  <p className={`text-[11px] mt-0.5 ${mt}`}>{k.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className={`${card} p-4`}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${mt}`} />
            <input
              value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search tickets or seafarer…"
              className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border outline-none transition-colors ${inputBg}`}
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <Filter className={`w-3.5 h-3.5 ${mt}`} />
            {STATUSES.map(s => (
              <button key={s} onClick={() => setStatus(s)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${status === s ? chipAct : chipIn}`}>
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {PRIORITIES.map(p => (
              <button key={p} onClick={() => setPriority(p)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${priority === p ? "bg-slate-700 text-white" : chipIn}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tickets list */}
      <div className={`${card}`}>
        <div className={`divide-y ${divider}`}>
          {filtered.map(t => (
            <div key={t.id} onClick={() => setSelected(t)}
              className={`px-5 py-4 transition-colors ${rowHov}`}>
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  t.status === "Resolved"    ? (dk ? "bg-emerald-500/15" : "bg-emerald-50") :
                  t.status === "In Progress" ? (dk ? "bg-amber-500/15"   : "bg-amber-50")   :
                                               (dk ? "bg-indigo-500/15"  : "bg-indigo-50")
                }`}>
                  {t.status === "Resolved"    ? <CheckCircle2  className={`w-4.5 h-4.5 ${dk ? "text-emerald-400" : "text-emerald-600"}`} style={{width:18,height:18}} /> :
                   t.status === "In Progress" ? <Clock         className={`w-4.5 h-4.5 ${dk ? "text-amber-400"   : "text-amber-600"}`}   style={{width:18,height:18}} /> :
                                                <MessageCircle className={`w-4.5 h-4.5 ${dk ? "text-indigo-400"  : "text-indigo-600"}`}  style={{width:18,height:18}} />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className={`text-[13px] font-semibold ${ht}`}>{t.subject}</p>
                      <p className={`text-[11px] mt-0.5 ${mt}`}>
                        {t.seafarer} · {t.date} · <span className={`font-mono`}>{t.id}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${dk ? priorityCls[t.priority]?.[1] : priorityCls[t.priority]?.[0]}`}>
                        {priorityIcons[t.priority]}{t.priority}
                      </span>
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${dk ? statusCls[t.status]?.[1] : statusCls[t.status]?.[0]}`}>
                        {statusIcons[t.status]}{t.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`inline-flex items-center gap-1 text-[11px] ${mt}`}>
                      <Tag className="w-3 h-3" />{t.category}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[11px] ${mt}`}>
                      <MessageCircle className="w-3 h-3" />{t.messages.length} message{t.messages.length !== 1 ? "s" : ""}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[11px] ${mt}`}>
                      {t.source === "website" ? <Globe className="w-3 h-3" /> : <Handshake className="w-3 h-3" />}
                      {t.source === "website" ? "Website" : "Agent"}
                    </span>
                    <span className={`ml-auto inline-flex items-center gap-1 text-[11px] font-medium ${dk ? "text-indigo-400" : "text-indigo-600"}`}>
                      View thread <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className={`text-center py-16 ${mt}`}>
            <Headphones className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No tickets match your filters</p>
          </div>
        )}
        <div className={`px-5 py-3 border-t text-xs ${dk ? "border-white/5 text-white/20" : "border-slate-100 text-slate-400"}`}>
          Showing {filtered.length} of {TICKETS.length} tickets — click a ticket to view the thread
        </div>
      </div>
    </div>
  );
}
