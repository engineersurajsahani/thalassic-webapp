"use client";

import React, { useState, useMemo } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  Users, Globe, BookOpen, ArrowUpRight, X,
  Search, Phone, Mail,
  ChevronRight, Calendar, CheckCircle2,
  Clock, AlertCircle, Handshake, Filter,
  FileText, IndianRupee, Receipt,
  CalendarCheck, Wallet, TrendingUp,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const WEBSITE_APPLICANTS = [
  { id: "APP-W001", name: "Raj Kumar",      rank: "Chief Officer",     phone: "+91 98765 43210", email: "raj.kumar@email.com",   course: "STCW Basic Safety",       status: "Active",   joined: "Jul 20, 2026", source: "thalassic.in/register" },
  { id: "APP-W002", name: "Priya Sharma",   rank: "Deck Cadet",        phone: "+91 87654 32109", email: "priya.s@email.com",     course: "Deck Watchkeeping",       status: "Pending",  joined: "Jul 19, 2026", source: "thalassic.in/courses"  },
  { id: "APP-W003", name: "Amit Patel",     rank: "Second Engineer",   phone: "+91 76543 21098", email: "amit.p@email.com",      course: "Engine Room Watch",       status: "Active",   joined: "Jul 18, 2026", source: "thalassic.in/register" },
  { id: "APP-W004", name: "Sunita Rajan",   rank: "Bosun",             phone: "+91 65432 10987", email: "sunita.r@email.com",    course: "Advanced Fire Fighting",  status: "Active",   joined: "Jul 17, 2026", source: "thalassic.in/register" },
  { id: "APP-W005", name: "Karan Mehta",    rank: "AB Seaman",         phone: "+91 54321 09876", email: "karan.m@email.com",     course: "Ship Navigation",         status: "Dropped",  joined: "Jul 15, 2026", source: "thalassic.in/courses"  },
  { id: "APP-W006", name: "Deepa Nair",     rank: "Chief Cook",        phone: "+91 43210 98765", email: "deepa.n@email.com",     course: "Maritime Catering",       status: "Active",   joined: "Jul 14, 2026", source: "thalassic.in/register" },
  { id: "APP-W007", name: "Vikram Das",     rank: "Third Officer",     phone: "+91 32109 87654", email: "vikram.d@email.com",    course: "Tanker Cargo Ops",        status: "Pending",  joined: "Jul 13, 2026", source: "thalassic.in/register" },
  { id: "APP-W008", name: "Meena Iyer",     rank: "Steward",           phone: "+91 21098 76543", email: "meena.i@email.com",     course: "STCW Basic Safety",       status: "Active",   joined: "Jul 12, 2026", source: "thalassic.in/courses"  },
  { id: "APP-W009", name: "Rohit Sharma",   rank: "Pump Man",          phone: "+91 10987 65432", email: "rohit.s@email.com",     course: "Tanker Cargo Ops",        status: "Active",   joined: "Jul 11, 2026", source: "thalassic.in/register" },
  { id: "APP-W010", name: "Lakshmi Devi",   rank: "Deck Cadet",        phone: "+91 98760 43210", email: "lakshmi.d@email.com",   course: "Maritime Law",            status: "Pending",  joined: "Jul 10, 2026", source: "thalassic.in/register" },
  { id: "APP-W011", name: "Suresh Verma",   rank: "Chief Engineer",    phone: "+91 87651 32109", email: "suresh.v@email.com",    course: "Engine Room Watch",       status: "Active",   joined: "Jul 9, 2026",  source: "thalassic.in/courses"  },
  { id: "APP-W012", name: "Anita Pillai",   rank: "Navigating Officer", phone: "+91 76540 21098", email: "anita.p@email.com",   course: "Advanced Navigation",     status: "Active",   joined: "Jul 8, 2026",  source: "thalassic.in/register" },
];

const AGENT_APPLICANTS = [
  { id: "APP-A001", name: "Mohammed Rafiq", rank: "Second Officer",    phone: "+91 91234 56789", email: "m.rafiq@email.com",     course: "STCW Basic Safety",       status: "Active",   joined: "Jul 21, 2026", agent: "Capt. Nair (Mumbai)"     },
  { id: "APP-A002", name: "Tara Singh",     rank: "Able Seaman",       phone: "+91 82345 67890", email: "tara.s@email.com",      course: "Ship Navigation",         status: "Active",   joined: "Jul 20, 2026", agent: "Rajan Associates (Kochi)" },
  { id: "APP-A003", name: "Arjun Dev",      rank: "Engine Cadet",      phone: "+91 73456 78901", email: "arjun.d@email.com",     course: "Engine Room Watch",       status: "Pending",  joined: "Jul 19, 2026", agent: "Capt. Nair (Mumbai)"     },
  { id: "APP-A004", name: "Kavitha Bose",   rank: "Deck Officer",      phone: "+91 64567 89012", email: "kavitha.b@email.com",   course: "Advanced Fire Fighting",  status: "Active",   joined: "Jul 18, 2026", agent: "SeaLink Agency (Chennai)" },
  { id: "APP-A005", name: "Naresh Pillai",  rank: "Motorman",          phone: "+91 55678 90123", email: "naresh.p@email.com",    course: "Engine Room Watch",       status: "Active",   joined: "Jul 17, 2026", agent: "Rajan Associates (Kochi)" },
  { id: "APP-A006", name: "Savitha Raj",    rank: "Chief Cook",        phone: "+91 46789 01234", email: "savitha.r@email.com",   course: "Maritime Catering",       status: "Dropped",  joined: "Jul 15, 2026", agent: "SeaLink Agency (Chennai)" },
  { id: "APP-A007", name: "Balu Krishnan",  rank: "Third Engineer",    phone: "+91 37890 12345", email: "balu.k@email.com",      course: "Tanker Cargo Ops",        status: "Active",   joined: "Jul 14, 2026", agent: "Capt. Nair (Mumbai)"     },
  { id: "APP-A008", name: "Geetha Menon",   rank: "Radio Officer",     phone: "+91 28901 23456", email: "geetha.m@email.com",    course: "Maritime Communication",  status: "Pending",  joined: "Jul 13, 2026", agent: "SeaLink Agency (Chennai)" },
  { id: "APP-A009", name: "Prasad Kumar",   rank: "AB Seaman",         phone: "+91 19012 34567", email: "prasad.k@email.com",    course: "STCW Basic Safety",       status: "Active",   joined: "Jul 12, 2026", agent: "Rajan Associates (Kochi)" },
];

const RECENT_COURSES = [
  { name: "STCW Basic Safety",      enrolled: 8,  completed: 5, pending: 3 },
  { name: "Ship Navigation",        enrolled: 5,  completed: 3, pending: 2 },
  { name: "Engine Room Watch",      enrolled: 5,  completed: 2, pending: 3 },
  { name: "Advanced Fire Fighting", enrolled: 3,  completed: 1, pending: 2 },
  { name: "Tanker Cargo Ops",       enrolled: 4,  completed: 3, pending: 1 },
];

// ─── Chart Data ────────────────────────────────────────────────────────────────

const MONTHLY_TREND = [
  { month: "Feb", enrollments: 4,  revenue: 72   },
  { month: "Mar", enrollments: 6,  revenue: 108  },
  { month: "Apr", enrollments: 5,  revenue: 90   },
  { month: "May", enrollments: 9,  revenue: 162  },
  { month: "Jun", enrollments: 12, revenue: 216  },
  { month: "Jul", enrollments: 21, revenue: 388  },
];

const COURSE_BAR_DATA = [
  { name: "STCW",     enrolled: 13 },
  { name: "Nav",      enrolled: 7  },
  { name: "Engine",   enrolled: 7  },
  { name: "Fire",     enrolled: 6  },
  { name: "Tanker",   enrolled: 4  },
  { name: "Catering", enrolled: 3  },
  { name: "Adv Nav",  enrolled: 1  },
];

const STATUS_DONUT = [
  { name: "Active",  value: 16, color: "#10b981" },
  { name: "Pending", value: 5,  color: "#f59e0b" },
  { name: "Dropped", value: 2,  color: "#f43f5e" },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

const AVATAR_COLORS = ["bg-indigo-500","bg-sky-500","bg-emerald-500","bg-amber-500","bg-violet-500","bg-rose-500"];

function initials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2);
}

function StatusBadge({ status, dk }: { status: string; dk: boolean }) {
  const cls: Record<string, string> = {
    Active:  dk ? "bg-emerald-500/15 text-emerald-400" : "bg-emerald-100 text-emerald-700",
    Pending: dk ? "bg-amber-500/15 text-amber-400"     : "bg-amber-100 text-amber-700",
    Dropped: dk ? "bg-red-500/15 text-red-400"         : "bg-red-100 text-red-700",
  };
  const icons: Record<string, React.ReactNode> = {
    Active:  <CheckCircle2 className="w-3 h-3" />,
    Pending: <Clock className="w-3 h-3" />,
    Dropped: <AlertCircle className="w-3 h-3" />,
  };
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${cls[status] ?? ""}`}>
      {icons[status]}
      {status}
    </span>
  );
}

// ─── Applicant Drawer ──────────────────────────────────────────────────────────

type WebsiteApplicant = typeof WEBSITE_APPLICANTS[0];
type AgentApplicant   = typeof AGENT_APPLICANTS[0];
type AnyApplicant     = WebsiteApplicant | AgentApplicant;

function isAgentApplicant(a: AnyApplicant): a is AgentApplicant {
  return "agent" in a;
}

function ApplicantDrawer({
  group, applicants, dk, onClose,
}: {
  group: 1 | 2;
  applicants: AnyApplicant[];
  dk: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const filtered = useMemo(() =>
    applicants.filter(a => {
      const q = query.toLowerCase();
      const matchSearch =
        a.name.toLowerCase().includes(q) ||
        a.rank.toLowerCase().includes(q) ||
        a.course.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q);
      const matchStatus = filterStatus === "All" || a.status === filterStatus;
      return matchSearch && matchStatus;
    }),
    [applicants, query, filterStatus]
  );

  const totals = {
    all:     applicants.length,
    active:  applicants.filter(a => a.status === "Active").length,
    pending: applicants.filter(a => a.status === "Pending").length,
    dropped: applicants.filter(a => a.status === "Dropped").length,
  };

  const bg      = dk ? "bg-[#0d1f35] border-l border-white/8"  : "bg-white border-l border-slate-200";
  const ht      = dk ? "text-white/85"   : "text-slate-800";
  const mt      = dk ? "text-white/35"   : "text-slate-400";
  const inputBg = dk ? "bg-white/5 border-white/10 text-white/70 placeholder:text-white/25 focus:border-emerald-500/50" : "bg-slate-50 border-slate-200 text-slate-700 placeholder:text-slate-400 focus:border-emerald-400";
  const divider = dk ? "divide-white/5"  : "divide-slate-100";
  const rowHov  = dk ? "hover:bg-white/[0.03]" : "hover:bg-slate-50";
  const cardBg  = dk ? "bg-white/[0.04] border border-white/6" : "bg-slate-50 border border-slate-200";
  const filterBtn = (active: boolean) =>
    active
      ? dk ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-emerald-100 text-emerald-700 border-emerald-300"
      : dk ? "bg-white/5 text-white/40 border-white/8 hover:text-white/60" : "bg-white text-slate-500 border-slate-200 hover:text-slate-700";

  const isGroup1   = group === 1;
  const accentBg   = isGroup1 ? (dk ? "bg-indigo-500/15" : "bg-indigo-50")   : (dk ? "bg-emerald-500/15" : "bg-emerald-50");
  const accentText = isGroup1 ? (dk ? "text-indigo-400"  : "text-indigo-700") : (dk ? "text-emerald-400"  : "text-emerald-700");

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className={`relative ml-auto w-full max-w-2xl h-full flex flex-col shadow-2xl ${bg}`}
        onClick={e => e.stopPropagation()}
        style={{ animation: "slideInRight 0.25s ease" }}
      >
        <div className={`flex items-center justify-between px-6 py-4 border-b ${dk ? "border-white/8" : "border-slate-200"}`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accentBg}`}>
              {isGroup1 ? <Globe className={`w-[18px] h-[18px] ${accentText}`} /> : <Handshake className={`w-[18px] h-[18px] ${accentText}`} />}
            </div>
            <div>
              <p className={`text-sm font-semibold ${ht}`}>{isGroup1 ? "Group 1 — Website Applicants" : "Group 2 — Agent Applicants"}</p>
              <p className={`text-xs ${mt}`}>{isGroup1 ? "Seafarers who joined via the public website" : "Seafarers enrolled through a human agent"}</p>
            </div>
          </div>
          <button onClick={onClose} className={`p-1.5 rounded-lg transition-colors ${dk ? "hover:bg-white/8 text-white/40 hover:text-white/70" : "hover:bg-slate-100 text-slate-400 hover:text-slate-600"}`}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-4 grid grid-cols-4 gap-3">
          {[
            { label: "Total",   value: totals.all,     color: accentText },
            { label: "Active",  value: totals.active,  color: dk ? "text-emerald-400" : "text-emerald-700" },
            { label: "Pending", value: totals.pending, color: dk ? "text-amber-400"   : "text-amber-700"   },
            { label: "Dropped", value: totals.dropped, color: dk ? "text-red-400"     : "text-red-600"     },
          ].map(s => (
            <div key={s.label} className={`rounded-xl p-3 text-center ${cardBg}`}>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className={`text-[11px] mt-0.5 ${mt}`}>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="px-6 pb-4 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${mt}`} />
            <input
              type="text"
              placeholder="Search name, rank, course, ID…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className={`w-full pl-8 pr-3 py-2 text-xs rounded-lg border outline-none transition-colors ${inputBg}`}
            />
          </div>
          <div className="flex items-center gap-1.5">
            <Filter className={`w-3.5 h-3.5 ${mt}`} />
            {["All","Active","Pending","Dropped"].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-colors ${filterBtn(filterStatus === s)}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className={`flex-1 overflow-y-auto divide-y ${divider}`}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-2">
              <Users className={`w-8 h-8 ${mt} opacity-40`} />
              <p className={`text-sm ${mt}`}>No applicants match your search</p>
            </div>
          ) : (
            filtered.map((a, i) => (
              <div key={a.id} className={`px-6 py-4 transition-colors ${rowHov}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                    {initials(a.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className={`text-sm font-semibold truncate ${ht}`}>{a.name}</p>
                        <p className={`text-[11px] ${mt}`}>{a.rank}</p>
                      </div>
                      <StatusBadge status={a.status} dk={dk} />
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <BookOpen className={`w-3 h-3 shrink-0 ${mt}`} />
                        <span className={`text-[11px] truncate ${mt}`}>{a.course}</span>
                      </div>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Calendar className={`w-3 h-3 shrink-0 ${mt}`} />
                        <span className={`text-[11px] truncate ${mt}`}>{a.joined}</span>
                      </div>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Phone className={`w-3 h-3 shrink-0 ${mt}`} />
                        <span className={`text-[11px] truncate ${mt}`}>{a.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Mail className={`w-3 h-3 shrink-0 ${mt}`} />
                        <span className={`text-[11px] truncate ${mt}`}>{a.email}</span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5">
                      {isGroup1 ? <Globe className={`w-3 h-3 ${accentText}`} /> : <Handshake className={`w-3 h-3 ${accentText}`} />}
                      <span className={`text-[11px] font-medium ${accentText}`}>
                        {isAgentApplicant(a) ? a.agent : (a as WebsiteApplicant).source}
                      </span>
                      <span className={`text-[10px] font-mono ${mt} opacity-60 ml-1`}>{a.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className={`px-6 py-3 border-t ${dk ? "border-white/8" : "border-slate-200"}`}>
          <p className={`text-xs ${mt}`}>Showing {filtered.length} of {applicants.length} applicants</p>
        </div>
      </div>
      <style>{`@keyframes slideInRight{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>
    </div>
  );
}

// ─── Card Header ───────────────────────────────────────────────────────────────

function CardHeader({ title, dk, action }: { title: string; dk: boolean; action?: React.ReactNode }) {
  return (
    <div className={`flex items-center justify-between px-6 py-4 border-b ${dk ? "border-white/5" : "border-slate-100"}`}>
      <p className={`text-sm font-semibold ${dk ? "text-white/80" : "text-slate-800"}`}>{title}</p>
      {action ?? null}
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────

export default function CompanyAdminDashboard() {
  const { theme } = useTheme();
  const dk = theme === "dark";

  const [drawer, setDrawer] = useState<1 | 2 | null>(null);

  // theme tokens
  const card = `rounded-2xl overflow-hidden ${dk ? "bg-[#0d1f35] border border-white/[0.06]" : "bg-white border border-slate-200 shadow-sm"}`;
  const ht   = dk ? "text-white/80"  : "text-slate-800";
  const mt   = dk ? "text-white/35"  : "text-slate-400";
  const dv   = dk ? "divide-white/[0.05]" : "divide-slate-100";
  const rh   = dk ? "hover:bg-white/[0.03]" : "hover:bg-slate-50";

  // ── Derived metrics ──────────────────────────────────────────────────────────
  const allApplicants  = [...WEBSITE_APPLICANTS, ...AGENT_APPLICANTS];
  const directSeafarers      = WEBSITE_APPLICANTS.length;                                         // direct = website
  const activeCourseEnrolments = allApplicants.filter(a => a.status === "Active").length;
  const totalRevenueDirect   = directSeafarers * 18500;                                           // ₹18,500 avg fee
  const pendingDocVerif      = allApplicants.filter(a => a.status === "Pending").length;
  const pendingPayments       = Math.floor(allApplicants.length * 0.3);                            // 30% mock pending
  const totalInvoices         = allApplicants.length;
  const todaysRegistrations   = 3;                                                                 // mock
  const todaysRevenue         = todaysRegistrations * 18500;

  const kpis = [
    {
      label: "Total Direct Seafarers",
      value: directSeafarers,
      display: String(directSeafarers),
      icon: Users,
      ib: dk ? "bg-indigo-500/15" : "bg-indigo-50",
      ic: "#6366f1",
      clickable: true, group: 1 as const,
      sub: "Website registrations",
    },
    {
      label: "Active Course Enrollments",
      value: activeCourseEnrolments,
      display: String(activeCourseEnrolments),
      icon: BookOpen,
      ib: dk ? "bg-sky-500/15" : "bg-sky-50",
      ic: "#0ea5e9",
      clickable: false,
      sub: "Currently in training",
    },
    {
      label: "Total Revenue (Direct)",
      value: totalRevenueDirect,
      display: "₹" + (totalRevenueDirect / 100000).toFixed(1) + "L",
      icon: IndianRupee,
      ib: dk ? "bg-emerald-500/15" : "bg-emerald-50",
      ic: "#10b981",
      clickable: false,
      sub: "From website seafarers",
    },
    {
      label: "Pending Doc Verifications",
      value: pendingDocVerif,
      display: String(pendingDocVerif),
      icon: FileText,
      ib: dk ? "bg-amber-500/15" : "bg-amber-50",
      ic: "#f59e0b",
      clickable: false,
      sub: "Awaiting review",
    },
    {
      label: "Pending Payments",
      value: pendingPayments,
      display: String(pendingPayments),
      icon: Wallet,
      ib: dk ? "bg-rose-500/15" : "bg-rose-50",
      ic: "#f43f5e",
      clickable: false,
      sub: "Overdue invoices",
    },
    {
      label: "Total Invoices Generated",
      value: totalInvoices,
      display: String(totalInvoices),
      icon: Receipt,
      ib: dk ? "bg-violet-500/15" : "bg-violet-50",
      ic: "#8b5cf6",
      clickable: false,
      sub: "This billing cycle",
    },
    {
      label: "Today's Registrations",
      value: todaysRegistrations,
      display: String(todaysRegistrations),
      icon: CalendarCheck,
      ib: dk ? "bg-teal-500/15" : "bg-teal-50",
      ic: "#14b8a6",
      clickable: false,
      sub: "Registered today",
    },
    {
      label: "Today's Revenue",
      value: todaysRevenue,
      display: "₹" + todaysRevenue.toLocaleString("en-IN"),
      icon: TrendingUp,
      ib: dk ? "bg-cyan-500/15" : "bg-cyan-50",
      ic: "#06b6d4",
      clickable: false,
      sub: "Revenue collected today",
    },
  ];

  const recentAll = [...WEBSITE_APPLICANTS, ...AGENT_APPLICANTS]
    .sort((a, b) => b.id.localeCompare(a.id))
    .slice(0, 8);

  return (
    <div className="space-y-5">

      {/* Applicant Drawer */}
      {drawer !== null && (
        <ApplicantDrawer
          group={drawer}
          applicants={drawer === 1 ? WEBSITE_APPLICANTS : AGENT_APPLICANTS}
          dk={dk}
          onClose={() => setDrawer(null)}
        />
      )}

      {/* Page header */}
      <div>
        <h1 className={`text-xl font-bold ${ht}`}>Dashboard</h1>
        <p className={`text-sm mt-0.5 ${mt}`}>Company admin overview</p>
      </div>

      {/* ── KPI Grid (8 cards, 4 per row) ────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((s) => (
          <div
            key={s.label}
            onClick={() => s.clickable && s.group && setDrawer(s.group)}
            className={`${card} p-5 flex items-start gap-4 transition-all duration-150 ${s.clickable ? "cursor-pointer group hover:scale-[1.01] hover:shadow-md" : ""}`}
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${s.ib} ${s.clickable ? "group-hover:scale-110 transition-transform duration-150" : ""}`}>
              <s.icon className="w-5 h-5" style={{ color: s.ic }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <p className={`text-[22px] font-bold leading-tight tracking-tight ${ht}`}>{s.display}</p>
                {s.clickable && <ChevronRight className={`w-4 h-4 shrink-0 ${dk ? "text-white/20 group-hover:text-white/50" : "text-slate-300 group-hover:text-slate-500"} transition-colors`} />}
              </div>
              <p className={`text-xs font-semibold mt-0.5 ${ht} opacity-80`}>{s.label}</p>
              <p className={`text-[11px] truncate mt-1.5 ${mt}`}>{s.sub}</p>
            </div>
          </div>
        ))}
      </div>


      {/* ── Recent Registrations + Courses Overview ──────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

        {/* Recent Registrations */}
        <div className={`${card} xl:col-span-3`}>
          <CardHeader
            title="Recent Registrations"
            dk={dk}
            action={
              <button
                onClick={() => setDrawer(1)}
                className={`flex items-center gap-1 text-xs font-medium ${dk ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-700"}`}
              >
                View all <ArrowUpRight className="w-3 h-3" />
              </button>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={dk ? "border-b border-white/5" : "border-b border-slate-100"}>
                  {["Name","Rank","Course","Source","Status","Joined"].map(h => (
                    <th key={h} className={`text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-wider ${mt}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className={`divide-y ${dv}`}>
                {recentAll.map((a, i) => {
                  const isAgent = isAgentApplicant(a);
                  return (
                    <tr key={a.id} className={`${rh} transition-colors`}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                            {initials(a.name)}
                          </div>
                          <div>
                            <p className={`text-[13px] font-medium ${ht}`}>{a.name}</p>
                            <p className={`text-[10px] font-mono ${mt}`}>{a.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className={`px-5 py-3 text-[12px] ${dk ? "text-white/55" : "text-slate-500"}`}>{a.rank}</td>
                      <td className={`px-5 py-3 text-[12px] max-w-[150px] truncate ${mt}`}>{a.course}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${isAgent ? (dk ? "bg-emerald-500/15 text-emerald-400" : "bg-emerald-100 text-emerald-700") : (dk ? "bg-sky-500/15 text-sky-400" : "bg-sky-100 text-sky-700")}`}>
                          {isAgent ? <Handshake className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                          {isAgent ? "Agent" : "Website"}
                        </span>
                      </td>
                      <td className="px-5 py-3"><StatusBadge status={a.status} dk={dk} /></td>
                      <td className={`px-5 py-3 text-[12px] ${mt}`}>{a.joined}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Courses Overview */}
        <div className={`${card} xl:col-span-2`}>
          <CardHeader title="Courses Overview" dk={dk} />
          <div className="px-2 py-2">
            <div className={`grid grid-cols-[1fr_auto_auto_auto] px-4 pb-2 mb-1 border-b text-[10px] font-semibold uppercase tracking-wider ${dk ? "border-white/5 text-white/20" : "border-slate-100 text-slate-400"}`}>
              <span>Course</span>
              <span className="text-center w-14">Enrolled</span>
              <span className="text-center w-12">Done</span>
              <span className="text-center w-14">Pending</span>
            </div>
            <div className={`divide-y ${dv}`}>
              {RECENT_COURSES.map((c) => (
                <div key={c.name} className={`grid grid-cols-[1fr_auto_auto_auto] items-center px-4 py-3 gap-3 ${rh} transition-colors`}>
                  <div className="min-w-0">
                    <p className={`text-[12px] font-medium truncate ${dk ? "text-white/70" : "text-slate-700"}`}>{c.name}</p>
                    <div className={`mt-1.5 h-1 rounded-full overflow-hidden w-20 ${dk ? "bg-white/8" : "bg-slate-100"}`}>
                      <div className="h-full rounded-full bg-indigo-500" style={{ width: `${(c.completed / c.enrolled) * 100}%` }} />
                    </div>
                  </div>
                  <span className={`w-14 text-center text-[13px] font-bold tabular-nums ${dk ? "text-white/60" : "text-slate-600"}`}>{c.enrolled}</span>
                  <span className="w-12 text-center text-[13px] font-bold tabular-nums text-emerald-500">{c.completed}</span>
                  <span className="w-14 text-center text-[13px] font-bold tabular-nums text-amber-500">{c.pending}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Charts Row ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Area Chart — Enrollment & Revenue Trend */}
        <div className={`${card} xl:col-span-2`}>
          <div className={`flex items-center justify-between px-6 py-4 border-b ${ dk ? "border-white/5" : "border-slate-100"}`}>
            <div>
              <p className={`text-sm font-semibold ${ht}`}>Enrollment &amp; Revenue Trend</p>
              <p className={`text-[11px] mt-0.5 ${mt}`}>Last 6 months</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span className={`text-[11px] ${mt}`}>Enrollments</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className={`text-[11px] ${mt}`}>Revenue (₹K)</span>
              </div>
            </div>
          </div>
          <div className="px-4 py-4">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={MONTHLY_TREND} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradEnroll" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}    />
                  </linearGradient>
                  <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={dk ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: dk ? "rgba(255,255,255,0.3)" : "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: dk ? "rgba(255,255,255,0.3)" : "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: dk ? "#0d1f35" : "#fff",
                    border: dk ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e2e8f0",
                    borderRadius: "12px",
                    fontSize: "12px",
                    color: dk ? "rgba(255,255,255,0.8)" : "#1e293b",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                  }}
                  cursor={{ stroke: dk ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)", strokeWidth: 1 }}
                />
                <Area type="monotone" dataKey="enrollments" name="Enrollments"  stroke="#6366f1" strokeWidth={2} fill="url(#gradEnroll)"  dot={{ r: 3, fill: "#6366f1", strokeWidth: 0 }} activeDot={{ r: 5, fill: "#6366f1" }} />
                <Area type="monotone" dataKey="revenue"     name="Revenue (₹K)" stroke="#10b981" strokeWidth={2} fill="url(#gradRevenue)" dot={{ r: 3, fill: "#10b981", strokeWidth: 0 }} activeDot={{ r: 5, fill: "#10b981" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart — Seafarer Status */}
        <div className={card}>
          <div className={`px-6 py-4 border-b ${ dk ? "border-white/5" : "border-slate-100"}`}>
            <p className={`text-sm font-semibold ${ht}`}>Seafarer Status</p>
            <p className={`text-[11px] mt-0.5 ${mt}`}>Overall breakdown</p>
          </div>
          <div className="flex flex-col items-center px-4 py-4 gap-4">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={STATUS_DONUT} cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={3} dataKey="value" strokeWidth={0}>
                  {STATUS_DONUT.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: dk ? "#0d1f35" : "#fff",
                    border: dk ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e2e8f0",
                    borderRadius: "10px",
                    fontSize: "12px",
                    color: dk ? "rgba(255,255,255,0.8)" : "#1e293b",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full space-y-2">
              {STATUS_DONUT.map(s => (
                <div key={s.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                    <span className={`text-[12px] font-medium ${ht}`}>{s.name}</span>
                  </div>
                  <span className={`text-[13px] font-bold ${ht}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Course Enrollment Bar Chart ───────────────────────────────────────── */}
      <div className={card}>
        <div className={`flex items-center justify-between px-6 py-4 border-b ${ dk ? "border-white/5" : "border-slate-100"}`}>
          <p className={`text-sm font-semibold ${ht}`}>Enrollments by Course</p>
          <span className={`text-[11px] ${mt}`}>All time</span>
        </div>
        <div className="px-4 py-4">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={COURSE_BAR_DATA} margin={{ top: 0, right: 10, left: -10, bottom: 0 }} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke={dk ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: dk ? "rgba(255,255,255,0.3)" : "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: dk ? "rgba(255,255,255,0.3)" : "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: dk ? "#0d1f35" : "#fff",
                  border: dk ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e2e8f0",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: dk ? "rgba(255,255,255,0.8)" : "#1e293b",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                }}
                cursor={{ fill: dk ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)" }}
              />
              <Bar dataKey="enrolled" name="Enrolled" radius={[6, 6, 0, 0]}>
                {COURSE_BAR_DATA.map((_, index) => (
                  <Cell key={`bar-${index}`} fill={["#6366f1","#0ea5e9","#10b981","#f59e0b","#8b5cf6","#f43f5e","#14b8a6"][index % 7]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
