"use client";

import React, { useState, useMemo } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  Search, Users, Globe, Handshake, Phone, Mail,
  BookOpen, Calendar, CheckCircle2, Clock, AlertCircle,
  Filter, X, Anchor, ChevronRight, User, MapPin,
  FileText, Download, Plus,
} from "lucide-react";

// ─── Mock Data ──────────────────────────────────────────────────────────────

const SEAFARERS = [
  { id: "SF-W001", name: "Raj Kumar",       rank: "Chief Officer",     phone: "+91 98765 43210", email: "raj.kumar@email.com",   course: "STCW Basic Safety",       status: "Active",   source: "website", joined: "Jul 20, 2026", location: "Mumbai",   cdcNo: "CDC-MU-1234", agent: null },
  { id: "SF-A001", name: "Mohammed Rafiq",  rank: "Second Officer",    phone: "+91 91234 56789", email: "m.rafiq@email.com",     course: "STCW Basic Safety",       status: "Active",   source: "agent",   joined: "Jul 21, 2026", location: "Kochi",    cdcNo: "CDC-KO-5678", agent: "Capt. Nair (Mumbai)" },
  { id: "SF-W002", name: "Priya Sharma",    rank: "Deck Cadet",        phone: "+91 87654 32109", email: "priya.s@email.com",     course: "Deck Watchkeeping",       status: "Pending",  source: "website", joined: "Jul 19, 2026", location: "Chennai",  cdcNo: "CDC-CH-2345", agent: null },
  { id: "SF-A002", name: "Tara Singh",      rank: "Able Seaman",       phone: "+91 82345 67890", email: "tara.s@email.com",      course: "Ship Navigation",         status: "Active",   source: "agent",   joined: "Jul 20, 2026", location: "Goa",      cdcNo: "CDC-GO-6789", agent: "Rajan Associates (Kochi)" },
  { id: "SF-W003", name: "Amit Patel",      rank: "Second Engineer",   phone: "+91 76543 21098", email: "amit.p@email.com",      course: "Engine Room Watch",       status: "Active",   source: "website", joined: "Jul 18, 2026", location: "Kolkata",  cdcNo: "CDC-KL-3456", agent: null },
  { id: "SF-A003", name: "Arjun Dev",       rank: "Engine Cadet",      phone: "+91 73456 78901", email: "arjun.d@email.com",     course: "Engine Room Watch",       status: "Pending",  source: "agent",   joined: "Jul 19, 2026", location: "Mumbai",   cdcNo: "CDC-MU-7890", agent: "Capt. Nair (Mumbai)" },
  { id: "SF-W004", name: "Sunita Rajan",    rank: "Bosun",             phone: "+91 65432 10987", email: "sunita.r@email.com",    course: "Advanced Fire Fighting",  status: "Active",   source: "website", joined: "Jul 17, 2026", location: "Visakha", cdcNo: "CDC-VZ-4567", agent: null },
  { id: "SF-A004", name: "Kavitha Bose",    rank: "Deck Officer",      phone: "+91 64567 89012", email: "kavitha.b@email.com",   course: "Advanced Fire Fighting",  status: "Active",   source: "agent",   joined: "Jul 18, 2026", location: "Chennai",  cdcNo: "CDC-CH-8901", agent: "SeaLink Agency (Chennai)" },
  { id: "SF-W005", name: "Karan Mehta",     rank: "AB Seaman",         phone: "+91 54321 09876", email: "karan.m@email.com",     course: "Ship Navigation",         status: "Dropped",  source: "website", joined: "Jul 15, 2026", location: "Surat",    cdcNo: "CDC-SU-5678", agent: null },
  { id: "SF-A005", name: "Naresh Pillai",   rank: "Motorman",          phone: "+91 55678 90123", email: "naresh.p@email.com",    course: "Engine Room Watch",       status: "Active",   source: "agent",   joined: "Jul 17, 2026", location: "Kochi",    cdcNo: "CDC-KO-9012", agent: "Rajan Associates (Kochi)" },
  { id: "SF-W006", name: "Deepa Nair",      rank: "Chief Cook",        phone: "+91 43210 98765", email: "deepa.n@email.com",     course: "Maritime Catering",       status: "Active",   source: "website", joined: "Jul 14, 2026", location: "Kochi",    cdcNo: "CDC-KO-6789", agent: null },
  { id: "SF-A006", name: "Savitha Raj",     rank: "Chief Cook",        phone: "+91 46789 01234", email: "savitha.r@email.com",   course: "Maritime Catering",       status: "Dropped",  source: "agent",   joined: "Jul 15, 2026", location: "Madurai",  cdcNo: "CDC-MD-0123", agent: "SeaLink Agency (Chennai)" },
  { id: "SF-W007", name: "Vikram Das",      rank: "Third Officer",     phone: "+91 32109 87654", email: "vikram.d@email.com",    course: "Tanker Cargo Ops",        status: "Pending",  source: "website", joined: "Jul 13, 2026", location: "Mumbai",   cdcNo: "CDC-MU-7891", agent: null },
  { id: "SF-A007", name: "Balu Krishnan",   rank: "Third Engineer",    phone: "+91 37890 12345", email: "balu.k@email.com",      course: "Tanker Cargo Ops",        status: "Active",   source: "agent",   joined: "Jul 14, 2026", location: "Trivandrum",cdcNo:"CDC-TV-1234", agent: "Capt. Nair (Mumbai)" },
  { id: "SF-W008", name: "Meena Iyer",      rank: "Steward",           phone: "+91 21098 76543", email: "meena.i@email.com",     course: "STCW Basic Safety",       status: "Active",   source: "website", joined: "Jul 12, 2026", location: "Bangalore", cdcNo:"CDC-BN-2345", agent: null },
  { id: "SF-A008", name: "Geetha Menon",    rank: "Radio Officer",     phone: "+91 28901 23456", email: "geetha.m@email.com",    course: "Maritime Communication",  status: "Pending",  source: "agent",   joined: "Jul 13, 2026", location: "Kochi",    cdcNo: "CDC-KO-3456", agent: "SeaLink Agency (Chennai)" },
  { id: "SF-W009", name: "Rohit Sharma",    rank: "Pump Man",          phone: "+91 10987 65432", email: "rohit.s@email.com",     course: "Tanker Cargo Ops",        status: "Active",   source: "website", joined: "Jul 11, 2026", location: "Mumbai",   cdcNo: "CDC-MU-4567", agent: null },
  { id: "SF-A009", name: "Prasad Kumar",    rank: "AB Seaman",         phone: "+91 19012 34567", email: "prasad.k@email.com",    course: "STCW Basic Safety",       status: "Active",   source: "agent",   joined: "Jul 12, 2026", location: "Hyderabad",cdcNo: "CDC-HY-5678", agent: "Rajan Associates (Kochi)" },
  { id: "SF-W010", name: "Lakshmi Devi",    rank: "Deck Cadet",        phone: "+91 98760 43210", email: "lakshmi.d@email.com",   course: "Maritime Law",            status: "Pending",  source: "website", joined: "Jul 10, 2026", location: "Chennai",  cdcNo: "CDC-CH-6789", agent: null },
  { id: "SF-W011", name: "Suresh Verma",    rank: "Chief Engineer",    phone: "+91 87651 32109", email: "suresh.v@email.com",    course: "Engine Room Watch",       status: "Active",   source: "website", joined: "Jul 9, 2026",  location: "Kolkata",  cdcNo: "CDC-KL-7890", agent: null },
  { id: "SF-W012", name: "Anita Pillai",    rank: "Navigating Officer", phone: "+91 76540 21098",email: "anita.p@email.com",    course: "Advanced Navigation",     status: "Active",   source: "website", joined: "Jul 8, 2026",  location: "Visakha", cdcNo: "CDC-VZ-8901", agent: null },
];

const AVATAR_COLORS = ["bg-indigo-500","bg-sky-500","bg-emerald-500","bg-amber-500","bg-violet-500","bg-rose-500"];
function initials(name: string) { return name.split(" ").map(n => n[0]).join("").slice(0, 2); }

type Seafarer = typeof SEAFARERS[0];

// ─── Profile Drawer ─────────────────────────────────────────────────────────

function ProfileDrawer({ sf, idx, dk, onClose }: { sf: Seafarer; idx: number; dk: boolean; onClose: () => void }) {
  const bg      = dk ? "bg-[#0d1f35] border-l border-white/8"   : "bg-white border-l border-slate-200";
  const ht      = dk ? "text-white/85"  : "text-slate-800";
  const mt      = dk ? "text-white/35"  : "text-slate-400";
  const divBor  = dk ? "border-white/6" : "border-slate-100";
  const cardBg  = dk ? "bg-white/[0.04] border border-white/6" : "bg-slate-50 border border-slate-100";
  const isWeb   = sf.source === "website";
  const accentT = isWeb ? (dk ? "text-sky-400" : "text-sky-700") : (dk ? "text-emerald-400" : "text-emerald-700");
  const accentB = isWeb ? (dk ? "bg-sky-500/15" : "bg-sky-50") : (dk ? "bg-emerald-500/15" : "bg-emerald-50");

  const statusCls: Record<string, string> = {
    Active:  dk ? "bg-emerald-500/15 text-emerald-400" : "bg-emerald-100 text-emerald-700",
    Pending: dk ? "bg-amber-500/15 text-amber-400"     : "bg-amber-100 text-amber-700",
    Dropped: dk ? "bg-red-500/15 text-red-400"         : "bg-red-100 text-red-700",
  };
  const statusIcons: Record<string, React.ReactNode> = {
    Active:  <CheckCircle2 className="w-3 h-3" />,
    Pending: <Clock className="w-3 h-3" />,
    Dropped: <AlertCircle className="w-3 h-3" />,
  };

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className={`relative ml-auto w-full max-w-md h-full flex flex-col shadow-2xl ${bg}`}
        onClick={e => e.stopPropagation()}
        style={{ animation: "slideInRight 0.25s ease" }}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-4 border-b ${divBor}`}>
          <p className={`text-sm font-semibold ${ht}`}>Seafarer Profile</p>
          <button onClick={onClose} className={`p-1.5 rounded-lg transition-colors ${dk ? "hover:bg-white/8 text-white/40 hover:text-white/70" : "hover:bg-slate-100 text-slate-400 hover:text-slate-600"}`}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Profile hero */}
          <div className={`px-5 py-6 border-b ${divBor}`}>
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold text-white shrink-0 ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}>
                {initials(sf.name)}
              </div>
              <div>
                <p className={`text-base font-bold ${ht}`}>{sf.name}</p>
                <p className={`text-sm ${mt}`}>{sf.rank}</p>
                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 mt-1.5 rounded-full ${statusCls[sf.status] ?? ""}`}>
                  {statusIcons[sf.status]}{sf.status}
                </span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="px-5 py-5 space-y-4">
            {/* Contact */}
            <div>
              <p className={`text-[10px] font-semibold uppercase tracking-widest mb-2 ${mt}`}>Contact</p>
              <div className={`rounded-xl p-4 space-y-3 ${cardBg}`}>
                {[
                  { icon: Phone, label: sf.phone },
                  { icon: Mail,  label: sf.email },
                  { icon: MapPin, label: sf.location },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3">
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${mt}`} />
                    <span className={`text-[13px] ${ht}`}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Enrolment */}
            <div>
              <p className={`text-[10px] font-semibold uppercase tracking-widest mb-2 ${mt}`}>Enrolment</p>
              <div className={`rounded-xl p-4 space-y-3 ${cardBg}`}>
                {[
                  { icon: BookOpen, label: "Course",   value: sf.course },
                  { icon: Calendar, label: "Joined",   value: sf.joined },
                  { icon: FileText, label: "CDC No.",  value: sf.cdcNo  },
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

            {/* Source */}
            <div>
              <p className={`text-[10px] font-semibold uppercase tracking-widest mb-2 ${mt}`}>Source</p>
              <div className={`rounded-xl p-4 flex items-center gap-3 ${accentB}`}>
                {isWeb ? <Globe className={`w-4 h-4 ${accentT}`} /> : <Handshake className={`w-4 h-4 ${accentT}`} />}
                <div>
                  <p className={`text-[13px] font-semibold ${accentT}`}>{isWeb ? "Website (Group 1)" : "Agent (Group 2)"}</p>
                  {!isWeb && sf.agent && <p className={`text-[11px] mt-0.5 ${mt}`}>{sf.agent}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className={`px-5 py-4 border-t ${divBor} flex gap-2`}>
          <button className="flex-1 flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium py-2 rounded-lg transition-colors">
            <FileText className="w-3.5 h-3.5" /> View Documents
          </button>
          <button className={`p-2 rounded-lg transition-colors ${dk ? "bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/80" : "bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700"}`}>
            <Download className="w-4 h-4" />
          </button>
        </div>

        <style>{`@keyframes slideInRight{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function SeafarersPage() {
  const { theme } = useTheme();
  const dk = theme === "dark";

  const [query, setQuery]       = useState("");
  const [source, setSource]     = useState("All");
  const [status, setStatus]     = useState("All");
  const [selected, setSelected] = useState<Seafarer | null>(null);
  const [selIdx, setSelIdx]     = useState(0);
  const [showAdd, setShowAdd]   = useState(false);

  const card    = `rounded-2xl overflow-hidden ${dk ? "bg-[#0d1f35] border border-white/[0.06]" : "bg-white border border-slate-200 shadow-sm"}`;
  const ht      = dk ? "text-white/80"  : "text-slate-800";
  const mt      = dk ? "text-white/35"  : "text-slate-400";
  const inputBg = dk ? "bg-white/5 border-white/10 text-white/70 placeholder:text-white/25 focus:border-indigo-500/50" : "bg-slate-50 border-slate-200 text-slate-700 placeholder:text-slate-400 focus:border-indigo-400";
  const divider = dk ? "divide-white/[0.05]" : "divide-slate-100";
  const rowHov  = dk ? "hover:bg-white/[0.03] cursor-pointer" : "hover:bg-slate-50 cursor-pointer";
  const chipActive   = dk ? "bg-indigo-500 text-white" : "bg-indigo-500 text-white";
  const chipInactive = dk ? "bg-white/5 text-white/40 hover:text-white/60" : "bg-slate-100 text-slate-500 hover:text-slate-700";

  const filtered = useMemo(() =>
    SEAFARERS.filter(s => {
      const q = query.toLowerCase();
      const matchQ = s.name.toLowerCase().includes(q) || s.rank.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.course.toLowerCase().includes(q);
      const matchSource = source === "All" || s.source === source.toLowerCase();
      const matchStatus = status === "All" || s.status === status;
      return matchQ && matchSource && matchStatus;
    }),
    [query, source, status]
  );

  const statusCls: Record<string, string> = {
    Active:  dk ? "bg-emerald-500/15 text-emerald-400" : "bg-emerald-100 text-emerald-700",
    Pending: dk ? "bg-amber-500/15 text-amber-400"     : "bg-amber-100 text-amber-700",
    Dropped: dk ? "bg-red-500/15 text-red-400"         : "bg-red-100 text-red-700",
  };
  const statusIcons: Record<string, React.ReactNode> = {
    Active:  <CheckCircle2 className="w-3 h-3" />,
    Pending: <Clock className="w-3 h-3" />,
    Dropped: <AlertCircle className="w-3 h-3" />,
  };

  const stats = [
    { label: "Total",   value: SEAFARERS.length,                                         color: dk ? "text-white/80" : "text-slate-800" },
    { label: "Active",  value: SEAFARERS.filter(s => s.status === "Active").length,   color: dk ? "text-emerald-400" : "text-emerald-600" },
    { label: "Pending", value: SEAFARERS.filter(s => s.status === "Pending").length,  color: dk ? "text-amber-400"   : "text-amber-600"   },
    { label: "Website", value: SEAFARERS.filter(s => s.source === "website").length,  color: dk ? "text-sky-400"     : "text-sky-600"     },
    { label: "Agent",   value: SEAFARERS.filter(s => s.source === "agent").length,    color: dk ? "text-indigo-400"  : "text-indigo-600"  },
  ];

  return (
    <div className="space-y-5">
      {selected && (
        <ProfileDrawer
          sf={selected}
          idx={selIdx}
          dk={dk}
          onClose={() => setSelected(null)}
        />
      )}

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-bold ${ht}`}>Seafarers</h1>
          <p className={`text-sm mt-0.5 ${mt}`}>{SEAFARERS.length} registered seafarers</p>
        </div>
      </div>

      {/* Stats strip */}
      <div className={card}>
        <div className={`grid grid-cols-5 divide-x ${dk ? "divide-white/[0.05]" : "divide-slate-100"}`}>
          {stats.map(s => (
            <div key={s.label} className="px-5 py-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className={`text-[11px] mt-0.5 ${mt}`}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className={`${card} p-4`}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className={`relative flex-1`}>
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${mt}`} />
            <input
              value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search name, rank, ID, course…"
              className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border outline-none transition-colors ${inputBg}`}
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <Filter className={`w-3.5 h-3.5 ${mt}`} />
            {["All","Website","Agent"].map(s => (
              <button key={s} onClick={() => setSource(s)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${source === s ? chipActive : chipInactive}`}>
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {["All","Active","Pending","Dropped"].map(s => (
              <button key={s} onClick={() => setStatus(s)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${status === s ? "bg-slate-700 text-white" : chipInactive}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={`${card}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={dk ? "border-b border-white/5" : "border-b border-slate-100"}>
                {["Seafarer","Rank","Course","Source","Status","Joined",""].map(h => (
                  <th key={h} className={`text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap ${mt}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${divider}`}>
              {filtered.map((s, i) => (
                <tr key={s.id} onClick={() => { setSelected(s); setSelIdx(i); }}
                  className={`${rowHov} transition-colors`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                        {initials(s.name)}
                      </div>
                      <div>
                        <p className={`text-[13px] font-medium ${ht}`}>{s.name}</p>
                        <p className={`text-[10px] font-mono ${mt}`}>{s.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className={`px-5 py-3.5 text-[12px] ${dk ? "text-white/55" : "text-slate-500"}`}>{s.rank}</td>
                  <td className={`px-5 py-3.5 text-[12px] truncate max-w-[180px] ${mt}`}>{s.course}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      s.source === "website"
                        ? (dk ? "bg-sky-500/15 text-sky-400" : "bg-sky-100 text-sky-700")
                        : (dk ? "bg-indigo-500/15 text-indigo-400" : "bg-indigo-100 text-indigo-700")
                    }`}>
                      {s.source === "website" ? <Globe className="w-3 h-3" /> : <Handshake className="w-3 h-3" />}
                      {s.source === "website" ? "Website" : "Agent"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusCls[s.status] ?? ""}`}>
                      {statusIcons[s.status]}{s.status}
                    </span>
                  </td>
                  <td className={`px-5 py-3.5 text-[12px] ${mt}`}>{s.joined}</td>
                  <td className="px-5 py-3.5">
                    <ChevronRight className={`w-4 h-4 ${mt}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className={`text-center py-16 ${mt}`}>
            <Users className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No seafarers match your filters</p>
          </div>
        )}
        <div className={`px-5 py-3 border-t text-xs ${dk ? "border-white/5 text-white/20" : "border-slate-100 text-slate-400"}`}>
          Showing {filtered.length} of {SEAFARERS.length} seafarers — click a row to view profile
        </div>
      </div>

      {/* ── Floating Add Button ───────────────────────────────────────────────── */}
      <button
        id="add-seafarer-fab"
        onClick={() => setShowAdd(true)}
        className="fixed bottom-8 right-8 z-40 flex items-center gap-2 px-5 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-sm font-semibold shadow-xl shadow-indigo-500/30 transition-all duration-200"
      >
        <Plus className="w-4 h-4" />
        Add Seafarer
      </button>

      {/* ── Add Seafarer Modal ────────────────────────────────────────────────── */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowAdd(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className={`relative w-full max-w-md rounded-2xl shadow-2xl p-6 flex flex-col gap-5 ${
              dk ? "bg-[#0d1f35] border border-white/8" : "bg-white border border-slate-200"
            }`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${ dk ? "bg-indigo-500/15" : "bg-indigo-50" }`}>
                  <Users className="w-4 h-4 text-indigo-500" />
                </div>
                <p className={`text-sm font-semibold ${ dk ? "text-white/85" : "text-slate-800" }`}>Add New Seafarer</p>
              </div>
              <button onClick={() => setShowAdd(false)} className={`p-1.5 rounded-lg transition-colors ${ dk ? "hover:bg-white/8 text-white/40" : "hover:bg-slate-100 text-slate-400" }`}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Full Name", col2: true },
                { label: "Rank", col2: false },
                { label: "Phone", col2: false },
                { label: "Email", col2: true },
                { label: "Location", col2: false },
                { label: "CDC No.", col2: false },
              ].map(({ label, col2 }) => (
                <div key={label} className={col2 ? "col-span-2" : ""}>
                  <label className={`block text-[11px] font-semibold mb-1 ${ dk ? "text-white/35" : "text-slate-400" }`}>{label}</label>
                  <input
                    placeholder={`Enter ${label.toLowerCase()}`}
                    className={`w-full px-3 py-2 text-sm rounded-lg border outline-none transition-colors ${
                      dk
                        ? "bg-white/5 border-white/10 text-white/80 placeholder:text-white/25 focus:border-indigo-500/60"
                        : "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-indigo-400"
                    }`}
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowAdd(false)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                  dk ? "border-white/10 text-white/50 hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
              >
                Save Seafarer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
