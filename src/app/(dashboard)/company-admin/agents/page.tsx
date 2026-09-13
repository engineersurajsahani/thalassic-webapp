"use client";

import React, { useState, useMemo } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  Search, Users, Phone, Mail, MapPin, CheckCircle2, Clock,
  AlertCircle, ChevronRight, X, Handshake, TrendingUp,
  DollarSign, UserCheck, UserPlus, Filter, Building2,
  Calendar, Star, ArrowUpRight, Check, XCircle, Eye,
  IndianRupee, BadgeCheck, MoreHorizontal, Wallet,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Agent {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  location: string;
  status: "Active" | "Inactive" | "Suspended";
  joinedDate: string;
  totalSeafarers: number;
  activeSeafarers: number;
  commissionRate: number;          // %
  totalDisbursed: number;          // INR
  pendingCommission: number;       // INR
  rating: number;
  specialization: string;
}

interface Seafarer {
  id: string;
  name: string;
  rank: string;
  course: string;
  joined: string;
  status: "Active" | "Pending" | "Dropped";
  feeCollected: number;
  commissionAmount: number;
  commissionPaid: boolean;
}

interface AgentRequest {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  location: string;
  specialization: string;
  experience: string;
  requestDate: string;
  message: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const AGENTS: Agent[] = [
  {
    id: "AG-001", name: "Capt. Suresh Nair", company: "Nair Maritime Services",
    phone: "+91 98765 43210", email: "suresh.nair@nairmsv.com", location: "Mumbai",
    status: "Active", joinedDate: "Jan 12, 2025", totalSeafarers: 18, activeSeafarers: 14,
    commissionRate: 8, totalDisbursed: 142000, pendingCommission: 24000, rating: 4.8,
    specialization: "Deck Officers",
  },
  {
    id: "AG-002", name: "Rajan Associates", company: "Rajan Maritime Associates",
    phone: "+91 91234 56789", email: "contact@rajanassoc.in", location: "Kochi",
    status: "Active", joinedDate: "Mar 5, 2025", totalSeafarers: 12, activeSeafarers: 10,
    commissionRate: 7.5, totalDisbursed: 98500, pendingCommission: 16200, rating: 4.6,
    specialization: "Engine Crew",
  },
  {
    id: "AG-003", name: "SeaLink Agency", company: "SeaLink Placement Pvt. Ltd.",
    phone: "+91 82345 67890", email: "info@sealinkagency.com", location: "Chennai",
    status: "Active", joinedDate: "Feb 18, 2025", totalSeafarers: 9, activeSeafarers: 7,
    commissionRate: 9, totalDisbursed: 76400, pendingCommission: 12800, rating: 4.4,
    specialization: "Catering Crew",
  },
  {
    id: "AG-004", name: "Blue Ocean Recruiters", company: "Blue Ocean HR Solutions",
    phone: "+91 73456 78901", email: "hr@blueoceanrecruit.com", location: "Kolkata",
    status: "Inactive", joinedDate: "Jun 22, 2024", totalSeafarers: 5, activeSeafarers: 0,
    commissionRate: 7, totalDisbursed: 31000, pendingCommission: 0, rating: 3.9,
    specialization: "General Crew",
  },
  {
    id: "AG-005", name: "Anchor Point Agency", company: "Anchor Point Maritime",
    phone: "+91 64567 89012", email: "ops@anchorpoint.in", location: "Visakhapatnam",
    status: "Active", joinedDate: "Apr 10, 2025", totalSeafarers: 7, activeSeafarers: 6,
    commissionRate: 8.5, totalDisbursed: 54200, pendingCommission: 9600, rating: 4.7,
    specialization: "Tanker Crew",
  },
  {
    id: "AG-006", name: "Maritime Star Agency", company: "Star Maritime Services",
    phone: "+91 55678 90123", email: "star@maritime-star.in", location: "Goa",
    status: "Suspended", joinedDate: "Aug 3, 2024", totalSeafarers: 3, activeSeafarers: 0,
    commissionRate: 6, totalDisbursed: 18000, pendingCommission: 0, rating: 3.2,
    specialization: "General Crew",
  },
];

const AGENT_SEAFARERS: Record<string, Seafarer[]> = {
  "AG-001": [
    { id: "SF-A001", name: "Mohammed Rafiq",  rank: "Second Officer",  course: "STCW Basic Safety",      joined: "Jul 21, 2026", status: "Active",  feeCollected: 18000, commissionAmount: 1440, commissionPaid: true },
    { id: "SF-A002", name: "Arjun Dev",        rank: "Engine Cadet",    course: "Engine Room Watch",      joined: "Jul 19, 2026", status: "Pending", feeCollected: 14000, commissionAmount: 1120, commissionPaid: false },
    { id: "SF-A003", name: "Balu Krishnan",    rank: "Third Engineer",  course: "Tanker Cargo Ops",       joined: "Jul 14, 2026", status: "Active",  feeCollected: 22000, commissionAmount: 1760, commissionPaid: true },
    { id: "SF-A004", name: "Ravi Menon",       rank: "Chief Officer",   course: "Advanced Navigation",    joined: "Jul 10, 2026", status: "Active",  feeCollected: 28000, commissionAmount: 2240, commissionPaid: true },
    { id: "SF-A005", name: "Sajan Thomas",     rank: "Deck Cadet",      course: "Deck Watchkeeping",      joined: "Jul 8, 2026",  status: "Active",  feeCollected: 12000, commissionAmount: 960,  commissionPaid: false },
  ],
  "AG-002": [
    { id: "SF-A006", name: "Tara Singh",       rank: "Able Seaman",     course: "Ship Navigation",        joined: "Jul 20, 2026", status: "Active",  feeCollected: 15000, commissionAmount: 1125, commissionPaid: true },
    { id: "SF-A007", name: "Naresh Pillai",    rank: "Motorman",        course: "Engine Room Watch",      joined: "Jul 17, 2026", status: "Active",  feeCollected: 16000, commissionAmount: 1200, commissionPaid: true },
    { id: "SF-A008", name: "Prasad Kumar",     rank: "AB Seaman",       course: "STCW Basic Safety",      joined: "Jul 12, 2026", status: "Active",  feeCollected: 13000, commissionAmount: 975,  commissionPaid: false },
    { id: "SF-A009", name: "Vimal Raj",        rank: "Second Engineer", course: "Advanced Fire Fighting", joined: "Jul 5, 2026",  status: "Pending", feeCollected: 19000, commissionAmount: 1425, commissionPaid: false },
  ],
  "AG-003": [
    { id: "SF-A010", name: "Kavitha Bose",     rank: "Deck Officer",    course: "Advanced Fire Fighting", joined: "Jul 18, 2026", status: "Active",  feeCollected: 17000, commissionAmount: 1530, commissionPaid: true },
    { id: "SF-A011", name: "Geetha Menon",     rank: "Radio Officer",   course: "Maritime Communication", joined: "Jul 13, 2026", status: "Pending", feeCollected: 20000, commissionAmount: 1800, commissionPaid: false },
    { id: "SF-A012", name: "Savitha Raj",      rank: "Chief Cook",      course: "Maritime Catering",      joined: "Jul 15, 2026", status: "Dropped", feeCollected: 11000, commissionAmount: 990,  commissionPaid: false },
  ],
  "AG-004": [
    { id: "SF-A013", name: "Dilip Kumar",      rank: "Bosun",           course: "Advanced Navigation",    joined: "Mar 10, 2026", status: "Active",  feeCollected: 16500, commissionAmount: 1155, commissionPaid: true },
  ],
  "AG-005": [
    { id: "SF-A014", name: "Sunil Vyas",       rank: "Pump Man",        course: "Tanker Cargo Ops",       joined: "Jun 28, 2026", status: "Active",  feeCollected: 21000, commissionAmount: 1785, commissionPaid: true },
    { id: "SF-A015", name: "Anand Kumar",      rank: "Third Officer",   course: "Ship Navigation",        joined: "Jun 20, 2026", status: "Active",  feeCollected: 17000, commissionAmount: 1445, commissionPaid: false },
  ],
  "AG-006": [
    { id: "SF-A016", name: "Rohan Das",        rank: "Deck Cadet",      course: "Deck Watchkeeping",      joined: "Jan 5, 2026",  status: "Dropped", feeCollected: 12000, commissionAmount: 720,  commissionPaid: true },
  ],
};

const AGENT_REQUESTS: AgentRequest[] = [
  {
    id: "REQ-001", name: "Capt. Prakash Rao", company: "Prakash Maritime Services",
    phone: "+91 78901 23456", email: "prakash.rao@pmaritime.com", location: "Mangalore",
    specialization: "Deck Officers & Engine Crew", experience: "12 years",
    requestDate: "Jul 28, 2026",
    message: "We have been operating as a seafarer placement agency for over 12 years in the Mangalore and Udupi coastal belt. We have a strong network of experienced deck officers ready for certification programs.",
  },
  {
    id: "REQ-002", name: "Sea Horizon Agency", company: "Sea Horizon Pvt. Ltd.",
    phone: "+91 67890 12345", email: "admin@seahorizon.in", location: "Tuticorin",
    specialization: "Fishing Vessel Crew", experience: "8 years",
    requestDate: "Jul 27, 2026",
    message: "Sea Horizon has been placing fishing vessel crew across Tamil Nadu and Kerala for 8 years. We are looking to enroll our candidates in your STCW Basic Safety and Maritime Law programs.",
  },
  {
    id: "REQ-003", name: "Horizon Blue Crew", company: "Horizon Blue Crew Solutions",
    phone: "+91 56789 01234", email: "operations@hbcrew.com", location: "Bhavnagar",
    specialization: "Tanker & Bulk Carrier Crew", experience: "5 years",
    requestDate: "Jul 26, 2026",
    message: "Our agency specialises in tanker and bulk carrier crew recruitment along the Gujarat coast. We want to partner with Thalassic Maritime Academy to provide our crew with the best certification options.",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const AVATAR_COLORS = ["bg-indigo-500", "bg-sky-500", "bg-emerald-500", "bg-amber-500", "bg-violet-500", "bg-rose-500"];
function initials(name: string) { return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase(); }
function formatINR(n: number) { return "₹" + n.toLocaleString("en-IN"); }

// ─── Agent Detail Drawer ──────────────────────────────────────────────────────

function AgentDetailDrawer({
  agent, idx, dk, onClose,
}: { agent: Agent; idx: number; dk: boolean; onClose: () => void }) {
  const seafarers = AGENT_SEAFARERS[agent.id] ?? [];
  const [activeTab, setActiveTab] = useState<"overview" | "seafarers" | "commission">("overview");

  const bg       = dk ? "bg-[#0d1f35] border-l border-white/8"   : "bg-white border-l border-slate-200";
  const ht       = dk ? "text-white/85"  : "text-slate-800";
  const mt       = dk ? "text-white/35"  : "text-slate-400";
  const divBor   = dk ? "border-white/6" : "border-slate-100";
  const cardBg   = dk ? "bg-white/[0.04] border border-white/6"  : "bg-slate-50 border border-slate-100";
  const tabBg    = dk ? "bg-white/5"     : "bg-slate-100";
  const tabActive= dk ? "bg-[#0d1f35] text-white shadow-sm border border-white/8" : "bg-white text-slate-800 shadow-sm";
  const tabIn    = dk ? "text-white/40 hover:text-white/60" : "text-slate-400 hover:text-slate-600";

  const statusCls: Record<string, string> = {
    Active:    dk ? "bg-emerald-500/15 text-emerald-400" : "bg-emerald-100 text-emerald-700",
    Inactive:  dk ? "bg-slate-500/15 text-slate-400"     : "bg-slate-100 text-slate-500",
    Suspended: dk ? "bg-red-500/15 text-red-400"         : "bg-red-100 text-red-600",
  };
  const sfStatusCls: Record<string, string> = {
    Active:  dk ? "bg-emerald-500/15 text-emerald-400" : "bg-emerald-100 text-emerald-700",
    Pending: dk ? "bg-amber-500/15 text-amber-400"     : "bg-amber-100 text-amber-700",
    Dropped: dk ? "bg-red-500/15 text-red-400"         : "bg-red-100 text-red-700",
  };

  const paidSeafarers   = seafarers.filter(s => s.commissionPaid);
  const unpaidSeafarers = seafarers.filter(s => !s.commissionPaid);
  const totalCommission = seafarers.reduce((a, s) => a + s.commissionAmount, 0);
  const paidCommission  = paidSeafarers.reduce((a, s) => a + s.commissionAmount, 0);
  const pendingComm     = unpaidSeafarers.reduce((a, s) => a + s.commissionAmount, 0);

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className={`relative ml-auto w-full max-w-xl h-full flex flex-col shadow-2xl ${bg}`}
        onClick={e => e.stopPropagation()}
        style={{ animation: "slideInRight 0.25s ease" }}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-4 border-b ${divBor}`}>
          <p className={`text-sm font-semibold ${ht}`}>Agent Profile</p>
          <button onClick={onClose} className={`p-1.5 rounded-lg transition-colors ${dk ? "hover:bg-white/8 text-white/40 hover:text-white/70" : "hover:bg-slate-100 text-slate-400 hover:text-slate-600"}`}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hero */}
        <div className={`px-5 py-5 border-b ${divBor}`}>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold text-white shrink-0 ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}>
              {initials(agent.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-base font-bold ${ht}`}>{agent.name}</p>
              <p className={`text-sm ${mt}`}>{agent.company}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusCls[agent.status]}`}>
                  {agent.status === "Active" ? <CheckCircle2 className="w-3 h-3" /> : agent.status === "Suspended" ? <AlertCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  {agent.status}
                </span>
                <span className={`flex items-center gap-1 text-[11px] font-medium ${mt}`}>
                  <Star className={`w-3 h-3 ${dk ? "text-amber-400" : "text-amber-500"} fill-current`} />
                  {agent.rating}
                </span>
              </div>
            </div>
          </div>

          {/* Mini stats */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: "Seafarers", value: agent.totalSeafarers, color: dk ? "text-indigo-400" : "text-indigo-600" },
              { label: "Commission", value: agent.commissionRate + "%", color: dk ? "text-emerald-400" : "text-emerald-600" },
              { label: "Disbursed", value: formatINR(agent.totalDisbursed), color: dk ? "text-sky-400" : "text-sky-600" },
            ].map(stat => (
              <div key={stat.label} className={`rounded-xl p-3 text-center ${cardBg}`}>
                <p className={`text-sm font-bold ${stat.color}`}>{stat.value}</p>
                <p className={`text-[10px] mt-0.5 ${mt}`}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="px-5 pt-4">
          <div className={`flex gap-1 p-1 rounded-xl ${tabBg}`}>
            {(["overview", "seafarers", "commission"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 text-xs font-medium py-1.5 rounded-lg capitalize transition-all ${activeTab === tab ? tabActive : tabIn}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

          {/* ── OVERVIEW TAB ── */}
          {activeTab === "overview" && (
            <>
              {/* Contact */}
              <div>
                <p className={`text-[10px] font-semibold uppercase tracking-widest mb-2 ${mt}`}>Contact Details</p>
                <div className={`rounded-xl p-4 space-y-3 ${cardBg}`}>
                  {[
                    { icon: Phone,    label: agent.phone },
                    { icon: Mail,     label: agent.email },
                    { icon: MapPin,   label: agent.location },
                    { icon: Building2, label: agent.company },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-3">
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${mt}`} />
                      <span className={`text-[13px] ${ht}`}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agency Info */}
              <div>
                <p className={`text-[10px] font-semibold uppercase tracking-widest mb-2 ${mt}`}>Agency Info</p>
                <div className={`rounded-xl p-4 space-y-3 ${cardBg}`}>
                  {[
                    { icon: BadgeCheck, label: "ID",             value: agent.id },
                    { icon: Calendar,   label: "Joined",         value: agent.joinedDate },
                    { icon: Handshake,  label: "Specialization", value: agent.specialization },
                    { icon: UserCheck,  label: "Active Seafarers", value: `${agent.activeSeafarers} / ${agent.totalSeafarers}` },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3">
                      <Icon className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${mt}`} />
                      <div>
                        <p className={`text-[10px] uppercase tracking-wide font-medium ${mt}`}>{label}</p>
                        <p className={`text-[13px] font-medium mt-0.5 ${ht}`}>{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── SEAFARERS TAB ── */}
          {activeTab === "seafarers" && (
            <div>
              <p className={`text-[10px] font-semibold uppercase tracking-widest mb-2 ${mt}`}>
                Enrolled Through This Agent ({seafarers.length})
              </p>
              {seafarers.length === 0 ? (
                <div className={`flex flex-col items-center justify-center py-12 ${mt}`}>
                  <Users className="w-8 h-8 mb-3 opacity-40" />
                  <p className="text-sm">No seafarers enrolled through this agent</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {seafarers.map((sf, i) => (
                    <div key={sf.id} className={`rounded-xl p-3.5 ${cardBg}`}>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                            {initials(sf.name)}
                          </div>
                          <div className="min-w-0">
                            <p className={`text-[13px] font-medium truncate ${ht}`}>{sf.name}</p>
                            <p className={`text-[11px] ${mt}`}>{sf.rank}</p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${sfStatusCls[sf.status]}`}>
                          {sf.status}
                        </span>
                      </div>
                      <div className={`mt-2.5 pt-2.5 border-t ${divBor} grid grid-cols-2 gap-2`}>
                        <div>
                          <p className={`text-[10px] ${mt}`}>Course</p>
                          <p className={`text-[11px] font-medium mt-0.5 ${ht}`}>{sf.course}</p>
                        </div>
                        <div>
                          <p className={`text-[10px] ${mt}`}>Joined</p>
                          <p className={`text-[11px] font-medium mt-0.5 ${ht}`}>{sf.joined}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── COMMISSION TAB ── */}
          {activeTab === "commission" && (
            <>
              {/* Summary cards */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Total Commission", value: formatINR(totalCommission), color: dk ? "text-white/80" : "text-slate-800", icon: Wallet },
                  { label: "Disbursed",         value: formatINR(paidCommission),  color: dk ? "text-emerald-400" : "text-emerald-600", icon: CheckCircle2 },
                  { label: "Pending",            value: formatINR(pendingComm),     color: dk ? "text-amber-400"   : "text-amber-600",   icon: Clock },
                  { label: "Rate",               value: agent.commissionRate + "%", color: dk ? "text-sky-400"     : "text-sky-600",     icon: TrendingUp },
                ].map(({ label, value, color, icon: Icon }) => (
                  <div key={label} className={`rounded-xl p-3.5 ${cardBg}`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Icon className={`w-3.5 h-3.5 ${mt}`} />
                      <p className={`text-[10px] font-medium uppercase tracking-wide ${mt}`}>{label}</p>
                    </div>
                    <p className={`text-sm font-bold ${color}`}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Per-seafarer breakdown */}
              <div>
                <p className={`text-[10px] font-semibold uppercase tracking-widest mb-2 ${mt}`}>Per Seafarer Breakdown</p>
                <div className="space-y-2">
                  {seafarers.map((sf, i) => (
                    <div key={sf.id} className={`rounded-xl p-3.5 ${cardBg}`}>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                            {initials(sf.name)}
                          </div>
                          <div className="min-w-0">
                            <p className={`text-[12px] font-medium truncate ${ht}`}>{sf.name}</p>
                            <p className={`text-[10px] ${mt}`}>Fee: {formatINR(sf.feeCollected)}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={`text-[12px] font-bold ${sf.commissionPaid ? (dk ? "text-emerald-400" : "text-emerald-600") : (dk ? "text-amber-400" : "text-amber-600")}`}>
                            {formatINR(sf.commissionAmount)}
                          </p>
                          <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full mt-0.5 ${sf.commissionPaid ? (dk ? "bg-emerald-500/15 text-emerald-400" : "bg-emerald-100 text-emerald-700") : (dk ? "bg-amber-500/15 text-amber-400" : "bg-amber-100 text-amber-700")}`}>
                            {sf.commissionPaid ? <CheckCircle2 className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                            {sf.commissionPaid ? "Paid" : "Pending"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <style>{`@keyframes slideInRight{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>
      </div>
    </div>
  );
}

// ─── Request Review Modal ─────────────────────────────────────────────────────

function RequestReviewModal({
  req, dk, onClose, onApprove, onReject,
}: { req: AgentRequest; dk: boolean; onClose: () => void; onApprove: (id: string) => void; onReject: (id: string) => void }) {
  const bg    = dk ? "bg-[#0c1a2e] border border-white/10"  : "bg-white border border-slate-200";
  const ht    = dk ? "text-white/85"  : "text-slate-800";
  const mt    = dk ? "text-white/35"  : "text-slate-400";
  const cardBg= dk ? "bg-white/[0.04] border border-white/6" : "bg-slate-50 border border-slate-100";
  const divBor= dk ? "border-white/6" : "border-slate-100";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className={`relative w-full max-w-md rounded-2xl shadow-2xl ${bg}`} onClick={e => e.stopPropagation()}
        style={{ animation: "fadeScaleIn 0.2s ease" }}>

        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-4 border-b ${divBor}`}>
          <p className={`text-sm font-semibold ${ht}`}>Review Agent Request</p>
          <button onClick={onClose} className={`p-1.5 rounded-lg transition-colors ${dk ? "hover:bg-white/8 text-white/40 hover:text-white/70" : "hover:bg-slate-100 text-slate-400 hover:text-slate-600"}`}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-5 space-y-4">
          {/* Applicant */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-bold shrink-0">
              {initials(req.name)}
            </div>
            <div>
              <p className={`text-base font-bold ${ht}`}>{req.name}</p>
              <p className={`text-sm ${mt}`}>{req.company}</p>
              <p className={`text-[11px] ${mt} mt-0.5`}>Applied: {req.requestDate}</p>
            </div>
          </div>

          {/* Info grid */}
          <div className={`rounded-xl p-4 space-y-3 ${cardBg}`}>
            {[
              { icon: Phone,    label: req.phone },
              { icon: Mail,     label: req.email },
              { icon: MapPin,   label: req.location },
              { icon: Handshake, label: req.specialization },
              { icon: Star,     label: `${req.experience} of experience` },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon className={`w-3.5 h-3.5 shrink-0 ${mt}`} />
                <span className={`text-[13px] ${ht}`}>{label}</span>
              </div>
            ))}
          </div>

          {/* Message */}
          <div>
            <p className={`text-[10px] font-semibold uppercase tracking-widest mb-1.5 ${mt}`}>Message from Applicant</p>
            <p className={`text-[13px] leading-relaxed p-3 rounded-xl ${cardBg} ${ht}`}>{req.message}</p>
          </div>
        </div>

        {/* Actions */}
        <div className={`px-5 pb-5 flex gap-3`}>
          <button
            onClick={() => { onReject(req.id); onClose(); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${dk ? "bg-red-500/15 text-red-400 hover:bg-red-500/25" : "bg-red-50 text-red-600 hover:bg-red-100"}`}
          >
            <XCircle className="w-4 h-4" /> Reject
          </button>
          <button
            onClick={() => { onApprove(req.id); onClose(); }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-emerald-500 hover:bg-emerald-600 text-white transition-all"
          >
            <Check className="w-4 h-4" /> Approve
          </button>
        </div>

        <style>{`@keyframes fadeScaleIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}`}</style>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AgentsPage() {
  const { theme } = useTheme();
  const dk = theme === "dark";

  const [query, setQuery]           = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [selectedAgentIdx, setSelectedAgentIdx] = useState(0);
  const [activeView, setActiveView] = useState<"agents" | "requests">("agents");
  const [reviewReq, setReviewReq]   = useState<AgentRequest | null>(null);
  const [requests, setRequests]     = useState<AgentRequest[]>(AGENT_REQUESTS);
  const [toastMsg, setToastMsg]     = useState<string | null>(null);

  const card    = `rounded-2xl overflow-hidden ${dk ? "bg-[#0d1f35] border border-white/[0.06]" : "bg-white border border-slate-200 shadow-sm"}`;
  const ht      = dk ? "text-white/80"  : "text-slate-800";
  const mt      = dk ? "text-white/35"  : "text-slate-400";
  const inputBg = dk ? "bg-white/5 border-white/10 text-white/70 placeholder:text-white/25 focus:border-indigo-500/50" : "bg-slate-50 border-slate-200 text-slate-700 placeholder:text-slate-400 focus:border-indigo-400";
  const divider = dk ? "divide-white/[0.05]" : "divide-slate-100";
  const rowHov  = dk ? "hover:bg-white/[0.03] cursor-pointer" : "hover:bg-slate-50 cursor-pointer";
  const chipActive   = dk ? "bg-indigo-500 text-white" : "bg-indigo-500 text-white";
  const chipInactive = dk ? "bg-white/5 text-white/40 hover:text-white/60" : "bg-slate-100 text-slate-500 hover:text-slate-700";

  const statusCls: Record<string, string> = {
    Active:    dk ? "bg-emerald-500/15 text-emerald-400" : "bg-emerald-100 text-emerald-700",
    Inactive:  dk ? "bg-slate-500/15 text-slate-400"     : "bg-slate-100 text-slate-500",
    Suspended: dk ? "bg-red-500/15 text-red-400"         : "bg-red-100 text-red-600",
  };

  const filtered = useMemo(() =>
    AGENTS.filter(a => {
      const q = query.toLowerCase();
      const matchQ = a.name.toLowerCase().includes(q) || a.company.toLowerCase().includes(q) || a.location.toLowerCase().includes(q);
      const matchS = statusFilter === "All" || a.status === statusFilter;
      return matchQ && matchS;
    }),
    [query, statusFilter]
  );

  const totalDisbursed   = AGENTS.reduce((s, a) => s + a.totalDisbursed, 0);
  const totalPending     = AGENTS.reduce((s, a) => s + a.pendingCommission, 0);
  const totalSeafarers   = AGENTS.reduce((s, a) => s + a.totalSeafarers, 0);
  const activeAgentCount = AGENTS.filter(a => a.status === "Active").length;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleApprove = (id: string) => {
    setRequests(prev => prev.filter(r => r.id !== id));
    showToast("Agent request approved! Welcome email sent.");
  };
  const handleReject = (id: string) => {
    setRequests(prev => prev.filter(r => r.id !== id));
    showToast("Request rejected and applicant notified.");
  };

  return (
    <div className="space-y-5">

      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white text-sm font-medium shadow-xl"
          style={{ animation: "fadeScaleIn 0.2s ease" }}>
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toastMsg}
        </div>
      )}

      {/* Drawers / Modals */}
      {selectedAgent && (
        <AgentDetailDrawer
          agent={selectedAgent} idx={selectedAgentIdx} dk={dk}
          onClose={() => setSelectedAgent(null)}
        />
      )}
      {reviewReq && (
        <RequestReviewModal
          req={reviewReq} dk={dk}
          onClose={() => setReviewReq(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-bold ${ht}`}>Agents</h1>
          <p className={`text-sm mt-0.5 ${mt}`}>Manage your referral agents and partnerships</p>
        </div>
        {requests.length > 0 && (
          <button
            onClick={() => setActiveView("requests")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-indigo-500 hover:bg-indigo-600 text-white transition-all relative"
          >
            <UserPlus className="w-4 h-4" />
            New Requests
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
              {requests.length}
            </span>
          </button>
        )}
      </div>

      {/* Stats strip */}
      <div className={card}>
        <div className={`grid grid-cols-4 divide-x ${dk ? "divide-white/[0.05]" : "divide-slate-100"}`}>
          {[
            { label: "Active Agents",    value: activeAgentCount,      color: dk ? "text-emerald-400" : "text-emerald-600" },
            { label: "Total Seafarers",  value: totalSeafarers,        color: dk ? "text-indigo-400"  : "text-indigo-600"  },
            { label: "Total Disbursed",  value: formatINR(totalDisbursed), color: dk ? "text-sky-400" : "text-sky-600"     },
            { label: "Pending Payout",   value: formatINR(totalPending),   color: dk ? "text-amber-400" : "text-amber-600" },
          ].map(s => (
            <div key={s.label} className="px-5 py-4 text-center">
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className={`text-[11px] mt-0.5 ${mt}`}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* View toggle */}
      <div className="flex gap-2">
        {(["agents", "requests"] as const).map(v => (
          <button
            key={v}
            onClick={() => setActiveView(v)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${activeView === v ? chipActive : chipInactive}`}
          >
            {v === "agents" ? <Handshake className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
            {v === "agents" ? "Active Agents" : `New Requests`}
            {v === "requests" && requests.length > 0 && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeView === "requests" ? "bg-white/20 text-white" : "bg-red-500/20 text-red-500"}`}>
                {requests.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── AGENTS VIEW ── */}
      {activeView === "agents" && (
        <>
          {/* Filters */}
          <div className={`${card} p-4`}>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${mt}`} />
                <input
                  value={query} onChange={e => setQuery(e.target.value)}
                  placeholder="Search agent name, company, location…"
                  className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border outline-none transition-colors ${inputBg}`}
                />
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Filter className={`w-3.5 h-3.5 ${mt}`} />
                {["All", "Active", "Inactive", "Suspended"].map(s => (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${statusFilter === s ? chipActive : chipInactive}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Agent Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((agent, i) => {
              const seafarers = AGENT_SEAFARERS[agent.id] ?? [];
              return (
                <div
                  key={agent.id}
                  onClick={() => { setSelectedAgent(agent); setSelectedAgentIdx(i); }}
                  className={`${card} p-5 cursor-pointer transition-all duration-200 hover:scale-[1.01] hover:shadow-lg group`}
                >
                  {/* Card header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold text-white ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                        {initials(agent.name)}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-semibold truncate ${ht}`}>{agent.name}</p>
                        <p className={`text-[11px] truncate ${mt}`}>{agent.company}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${statusCls[agent.status]}`}>
                      {agent.status}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className={`grid grid-cols-2 gap-2 mb-4 p-3 rounded-xl ${dk ? "bg-white/[0.03] border border-white/5" : "bg-slate-50 border border-slate-100"}`}>
                    <div className="text-center">
                      <p className={`text-base font-bold ${dk ? "text-indigo-400" : "text-indigo-600"}`}>{agent.totalSeafarers}</p>
                      <p className={`text-[10px] ${mt}`}>Seafarers</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-base font-bold ${dk ? "text-emerald-400" : "text-emerald-600"}`}>{formatINR(agent.totalDisbursed)}</p>
                      <p className={`text-[10px] ${mt}`}>Disbursed</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`flex items-center gap-1 text-[11px] ${mt}`}>
                        <MapPin className="w-3 h-3" />{agent.location}
                      </span>
                      <span className={`flex items-center gap-1 text-[11px] ${dk ? "text-amber-400" : "text-amber-500"}`}>
                        <Star className="w-3 h-3 fill-current" />{agent.rating}
                      </span>
                    </div>
                    <span className={`flex items-center gap-1 text-[11px] font-medium ${dk ? "text-sky-400 group-hover:text-sky-300" : "text-sky-600 group-hover:text-sky-700"} transition-colors`}>
                      View details <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  {/* Pending commission badge */}
                  {agent.pendingCommission > 0 && (
                    <div className={`mt-3 pt-3 border-t ${dk ? "border-white/5" : "border-slate-100"} flex items-center justify-between`}>
                      <span className={`text-[11px] font-medium flex items-center gap-1 ${dk ? "text-amber-400" : "text-amber-600"}`}>
                        <IndianRupee className="w-3 h-3" />
                        Pending commission
                      </span>
                      <span className={`text-[12px] font-bold ${dk ? "text-amber-400" : "text-amber-600"}`}>{formatINR(agent.pendingCommission)}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className={`${card} py-16 text-center ${mt}`}>
              <Handshake className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No agents match your filters</p>
            </div>
          )}
        </>
      )}

      {/* ── REQUESTS VIEW ── */}
      {activeView === "requests" && (
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className={`${card} py-20 text-center ${mt}`}>
              <UserCheck className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm font-medium">No pending agent requests</p>
              <p className="text-xs mt-1 opacity-60">All requests have been reviewed</p>
            </div>
          ) : (
            requests.map((req, i) => (
              <div key={req.id} className={`${card} p-5`}>
                <div className="flex items-start justify-between gap-4">
                  {/* Left: info */}
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                      {initials(req.name)}
                    </div>
                    <div>
                      <p className={`text-[14px] font-semibold ${ht}`}>{req.name}</p>
                      <p className={`text-[12px] ${mt}`}>{req.company}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className={`flex items-center gap-1 text-[11px] ${mt}`}><MapPin className="w-3 h-3" />{req.location}</span>
                        <span className={`flex items-center gap-1 text-[11px] ${mt}`}><Calendar className="w-3 h-3" />{req.requestDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setReviewReq(req)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${dk ? "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                    >
                      <Eye className="w-3.5 h-3.5" /> Review
                    </button>
                    <button
                      onClick={() => handleReject(req.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${dk ? "bg-red-500/15 text-red-400 hover:bg-red-500/25" : "bg-red-50 text-red-600 hover:bg-red-100"}`}
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                    <button
                      onClick={() => handleApprove(req.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500 hover:bg-emerald-600 text-white transition-all"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                  </div>
                </div>

                {/* Specialization & experience tags */}
                <div className={`mt-3 pt-3 border-t ${dk ? "border-white/5" : "border-slate-100"} flex items-center gap-2 flex-wrap`}>
                  <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg ${dk ? "bg-indigo-500/15 text-indigo-400" : "bg-indigo-50 text-indigo-700"}`}>
                    <Handshake className="w-3 h-3" />{req.specialization}
                  </span>
                  <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg ${dk ? "bg-white/5 text-white/50" : "bg-slate-100 text-slate-500"}`}>
                    <Star className="w-3 h-3" />{req.experience}
                  </span>
                  <span className={`text-[11px] ${mt} ml-auto`}>{req.email}</span>
                </div>

                {/* Message preview */}
                <div className={`mt-3 p-3 rounded-xl text-[12px] leading-relaxed ${dk ? "bg-white/[0.03] text-white/50 border border-white/5" : "bg-slate-50 text-slate-500 border border-slate-100"}`}>
                  {req.message}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <style>{`@keyframes fadeScaleIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );
}
