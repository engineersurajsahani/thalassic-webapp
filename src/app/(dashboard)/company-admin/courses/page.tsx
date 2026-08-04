"use client";

import React, { useState, useMemo } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  Search, BookOpen, Users, Clock, Star, Filter,
  CheckCircle2, Globe, Handshake, ChevronRight, Eye,
  TrendingUp, Award, Layers, Plus, X,
} from "lucide-react";

// ─── Mock Data ──────────────────────────────────────────────────────────────

const COURSES = [
  {
    id: "CRS-001",
    title: "STCW Basic Safety Training",
    category: "Safety",
    duration: "5 days",
    price: "₹5,000",
    rating: 4.8,
    status: "Active",
    websiteEnrolled: 8,
    agentEnrolled: 5,
    completed: 7,
    pending: 6,
    updated: "3 days ago",
    description: "IMO-compliant STCW safety training covering fire prevention, sea survival, first aid, and personal safety.",
  },
  {
    id: "CRS-002",
    title: "Advanced Fire Fighting",
    category: "Safety",
    duration: "3 days",
    price: "₹7,200",
    rating: 4.6,
    status: "Active",
    websiteEnrolled: 4,
    agentEnrolled: 2,
    completed: 4,
    pending: 2,
    updated: "1 week ago",
    description: "Advanced techniques for shipboard fire fighting, including foam, CO2, and dry powder systems.",
  },
  {
    id: "CRS-003",
    title: "Ship Navigation & Radar",
    category: "Technical",
    duration: "7 days",
    price: "₹6,800",
    rating: 4.7,
    status: "Active",
    websiteEnrolled: 5,
    agentEnrolled: 2,
    completed: 4,
    pending: 3,
    updated: "2 days ago",
    description: "Practical navigation skills, ARPA radar operation, ECDIS, and collision regulations.",
  },
  {
    id: "CRS-004",
    title: "Tanker Cargo Operations",
    category: "Operations",
    duration: "4 days",
    price: "₹9,400",
    rating: 4.9,
    status: "Active",
    websiteEnrolled: 3,
    agentEnrolled: 1,
    completed: 2,
    pending: 2,
    updated: "Today",
    description: "Oil, chemical, and gas tanker cargo handling procedures, including loading, discharging, and safety measures.",
  },
  {
    id: "CRS-005",
    title: "Engine Room Watch",
    category: "Technical",
    duration: "6 days",
    price: "₹8,100",
    rating: 4.4,
    status: "Active",
    websiteEnrolled: 5,
    agentEnrolled: 2,
    completed: 3,
    pending: 4,
    updated: "1 week ago",
    description: "Engine room operations, maintenance procedures, watch-keeping duties, and emergency response.",
  },
  {
    id: "CRS-006",
    title: "Maritime Catering",
    category: "Hospitality",
    duration: "3 days",
    price: "₹3,500",
    rating: 4.3,
    status: "Active",
    websiteEnrolled: 2,
    agentEnrolled: 1,
    completed: 2,
    pending: 1,
    updated: "5 days ago",
    description: "Shipboard catering management, food safety, nutrition standards, and galley operations.",
  },
  {
    id: "CRS-007",
    title: "Maritime Law & Compliance",
    category: "Compliance",
    duration: "2 days",
    price: "₹3,200",
    rating: 4.5,
    status: "Active",
    websiteEnrolled: 3,
    agentEnrolled: 0,
    completed: 2,
    pending: 1,
    updated: "4 days ago",
    description: "International maritime conventions, flag state requirements, port state control, and MLC compliance.",
  },
  {
    id: "CRS-008",
    title: "Maritime Communication",
    category: "Technical",
    duration: "3 days",
    price: "₹4,200",
    rating: 4.6,
    status: "Active",
    websiteEnrolled: 1,
    agentEnrolled: 1,
    completed: 1,
    pending: 1,
    updated: "3 days ago",
    description: "GMDSS operations, radio communication procedures, distress signalling, and communication equipment.",
  },
  {
    id: "CRS-009",
    title: "Deck Watchkeeping",
    category: "Technical",
    duration: "5 days",
    price: "₹5,800",
    rating: 4.7,
    status: "Draft",
    websiteEnrolled: 2,
    agentEnrolled: 0,
    completed: 0,
    pending: 2,
    updated: "Today",
    description: "Bridge watchkeeping duties, lookout obligations, navigational safety, and COLREGS.",
  },
  {
    id: "CRS-010",
    title: "Advanced Navigation",
    category: "Technical",
    duration: "8 days",
    price: "₹11,000",
    rating: 4.9,
    status: "Active",
    websiteEnrolled: 1,
    agentEnrolled: 0,
    completed: 1,
    pending: 0,
    updated: "1 week ago",
    description: "Electronic chart systems, voyage planning, passage planning, and advanced meteorology.",
  },
];

const CATEGORIES = ["All", "Safety", "Technical", "Operations", "Compliance", "Hospitality"];
const STATUSES   = ["All", "Active", "Draft"];

const catCls: Record<string, [string, string]> = {
  Safety:      ["bg-indigo-100 text-indigo-700", "bg-indigo-500/10 text-indigo-400"],
  Technical:   ["bg-amber-100 text-amber-700",   "bg-amber-500/10 text-amber-400"],
  Operations:  ["bg-emerald-100 text-emerald-700","bg-emerald-500/10 text-emerald-400"],
  Compliance:  ["bg-violet-100 text-violet-700",  "bg-violet-500/10 text-violet-400"],
  Hospitality: ["bg-rose-100 text-rose-700",      "bg-rose-500/10 text-rose-400"],
};

const statusCls: Record<string, [string, string]> = {
  Active: ["bg-emerald-100 text-emerald-700", "bg-emerald-500/10 text-emerald-400"],
  Draft:  ["bg-amber-100 text-amber-700",     "bg-amber-500/10 text-amber-400"],
};

// ─── Course Detail Drawer ────────────────────────────────────────────────────

type Course = typeof COURSES[0];

function CourseDrawer({ course, dk, onClose }: { course: Course; dk: boolean; onClose: () => void }) {
  const bg     = dk ? "bg-[#0d1f35] border-l border-white/8" : "bg-white border-l border-slate-200";
  const ht     = dk ? "text-white/85"   : "text-slate-800";
  const mt     = dk ? "text-white/35"   : "text-slate-400";
  const divBor = dk ? "border-white/6"  : "border-slate-100";
  const cardBg = dk ? "bg-white/[0.04] border border-white/6" : "bg-slate-50 border border-slate-100";

  const total = course.websiteEnrolled + course.agentEnrolled;
  const pct   = total > 0 ? Math.round((course.completed / total) * 100) : 0;

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
          <p className={`text-sm font-semibold ${ht}`}>Course Details</p>
          <button onClick={onClose} className={`p-1.5 rounded-lg transition-colors ${dk ? "hover:bg-white/8 text-white/40 hover:text-white/70" : "hover:bg-slate-100 text-slate-400 hover:text-slate-600"}`}>
            <BookOpen className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Hero */}
          <div className={`px-5 py-5 border-b ${divBor}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${dk ? "bg-indigo-500/15" : "bg-indigo-50"}`}>
              <BookOpen className="w-5 h-5 text-indigo-500" />
            </div>
            <p className={`text-base font-bold leading-snug ${ht}`}>{course.title}</p>
            <p className={`text-xs mt-1.5 leading-relaxed ${mt}`}>{course.description}</p>
            <div className="flex items-center gap-3 mt-3">
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${dk ? catCls[course.category]?.[1] : catCls[course.category]?.[0]}`}>{course.category}</span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${dk ? statusCls[course.status]?.[1] : statusCls[course.status]?.[0]}`}>{course.status}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="px-5 py-5 space-y-4">
            <div className={`grid grid-cols-3 gap-3`}>
              {[
                { label: "Total",     value: total,            color: ht },
                { label: "Completed", value: course.completed, color: dk ? "text-emerald-400" : "text-emerald-600" },
                { label: "Pending",   value: course.pending,   color: dk ? "text-amber-400"   : "text-amber-600"   },
              ].map(s => (
                <div key={s.label} className={`rounded-xl p-3 text-center ${cardBg}`}>
                  <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                  <p className={`text-[11px] mt-0.5 ${mt}`}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Progress */}
            <div className={`rounded-xl p-4 ${cardBg}`}>
              <div className="flex items-center justify-between mb-2">
                <p className={`text-[12px] font-medium ${ht}`}>Completion Rate</p>
                <p className={`text-sm font-bold ${dk ? "text-indigo-400" : "text-indigo-600"}`}>{pct}%</p>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${dk ? "bg-white/8" : "bg-slate-100"}`}>
                <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>

            {/* Source breakdown */}
            <div>
              <p className={`text-[10px] font-semibold uppercase tracking-widest mb-2 ${mt}`}>Enrolment by Source</p>
              <div className={`rounded-xl p-4 space-y-3 ${cardBg}`}>
                {[
                  { icon: Globe,     label: "Website (Group 1)", value: course.websiteEnrolled, cls: dk ? "text-sky-400" : "text-sky-700" },
                  { icon: Handshake, label: "Agent (Group 2)",   value: course.agentEnrolled,   cls: dk ? "text-indigo-400" : "text-indigo-700" },
                ].map(({ icon: Icon, label, value, cls }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-3.5 h-3.5 ${cls}`} />
                      <span className={`text-[12px] ${mt}`}>{label}</span>
                    </div>
                    <span className={`text-[13px] font-bold ${cls}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Meta */}
            <div>
              <p className={`text-[10px] font-semibold uppercase tracking-widest mb-2 ${mt}`}>Course Info</p>
              <div className={`rounded-xl p-4 space-y-3 ${cardBg}`}>
                {[
                  { icon: Clock,      label: "Duration", value: course.duration },
                  { icon: Award,      label: "Price",    value: course.price },
                  { icon: Star,       label: "Rating",   value: `${course.rating} / 5.0` },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-3.5 h-3.5 ${mt}`} />
                      <span className={`text-[12px] ${mt}`}>{label}</span>
                    </div>
                    <span className={`text-[13px] font-semibold ${ht}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <style>{`@keyframes slideInRight{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function CoursesPage() {
  const { theme } = useTheme();
  const dk = theme === "dark";

  const [query,    setQuery]    = useState("");
  const [cat,      setCat]      = useState("All");
  const [status,   setStatus]   = useState("All");
  const [selected, setSelected] = useState<Course | null>(null);
  const [showAdd,  setShowAdd]  = useState(false);

  const card    = `rounded-2xl overflow-hidden ${dk ? "bg-[#0d1f35] border border-white/[0.06]" : "bg-white border border-slate-200 shadow-sm"}`;
  const ht      = dk ? "text-white/80"  : "text-slate-800";
  const mt      = dk ? "text-white/35"  : "text-slate-400";
  const inputBg = dk ? "bg-white/5 border-white/10 text-white/70 placeholder:text-white/25" : "bg-slate-50 border-slate-200 text-slate-700 placeholder:text-slate-400";
  const divider = dk ? "divide-white/[0.05]" : "divide-slate-100";
  const rowHov  = dk ? "hover:bg-white/[0.03] cursor-pointer" : "hover:bg-slate-50 cursor-pointer";
  const chipAct = "bg-indigo-500 text-white";
  const chipIn  = dk ? "bg-white/5 text-white/40 hover:text-white/60" : "bg-slate-100 text-slate-500 hover:text-slate-700";

  const filtered = useMemo(() =>
    COURSES.filter(c => {
      const q = query.toLowerCase();
      const matchQ = c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
      const matchCat    = cat    === "All" || c.category === cat;
      const matchStatus = status === "All" || c.status   === status;
      return matchQ && matchCat && matchStatus;
    }),
    [query, cat, status]
  );

  const totalEnrolled  = COURSES.reduce((s, c) => s + c.websiteEnrolled + c.agentEnrolled, 0);
  const totalCompleted = COURSES.reduce((s, c) => s + c.completed, 0);
  const avgRating      = (COURSES.reduce((s, c) => s + c.rating, 0) / COURSES.length).toFixed(1);

  const kpis = [
    { label: "Total Courses",  value: COURSES.length, icon: Layers,     color: dk ? "text-indigo-400" : "text-indigo-600", bg: dk ? "bg-indigo-500/15" : "bg-indigo-50" },
    { label: "Total Enrolled", value: totalEnrolled,  icon: Users,      color: dk ? "text-sky-400"    : "text-sky-600",    bg: dk ? "bg-sky-500/15"    : "bg-sky-50"    },
    { label: "Completed",      value: totalCompleted, icon: CheckCircle2,color: dk ? "text-emerald-400" : "text-emerald-600", bg: dk ? "bg-emerald-500/15" : "bg-emerald-50" },
    { label: "Avg Rating",     value: avgRating,      icon: Star,       color: dk ? "text-amber-400"  : "text-amber-600",  bg: dk ? "bg-amber-500/15"  : "bg-amber-50"  },
  ];

  return (
    <div className="space-y-5">
      {selected && <CourseDrawer course={selected} dk={dk} onClose={() => setSelected(null)} />}

      {/* Header */}
      <div>
        <h1 className={`text-xl font-bold ${ht}`}>Courses</h1>
        <p className={`text-sm mt-0.5 ${mt}`}>Your company's enrolled maritime training courses</p>
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
              placeholder="Search courses…"
              className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border outline-none transition-colors ${inputBg}`}
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <Filter className={`w-3.5 h-3.5 ${mt}`} />
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${cat === c ? chipAct : chipIn}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {STATUSES.map(s => (
              <button key={s} onClick={() => setStatus(s)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${status === s ? "bg-slate-700 text-white" : chipIn}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={card}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={dk ? "border-b border-white/5" : "border-b border-slate-100"}>
                {["Course","Category","Enrolled","Completed","Progress","Rating","Status",""].map(h => (
                  <th key={h} className={`text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap ${mt}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${divider}`}>
              {filtered.map(c => {
                const total = c.websiteEnrolled + c.agentEnrolled;
                const pct   = total > 0 ? Math.round((c.completed / total) * 100) : 0;
                return (
                  <tr key={c.id} onClick={() => setSelected(c)} className={`${rowHov} transition-colors`}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${dk ? "bg-indigo-500/15" : "bg-indigo-50"}`}>
                          <BookOpen className="w-4 h-4 text-indigo-500" />
                        </div>
                        <div>
                          <p className={`text-[13px] font-medium ${ht}`}>{c.title}</p>
                          <p className={`text-[10px] ${mt}`}>Updated {c.updated} · {c.duration}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${dk ? catCls[c.category]?.[1] : catCls[c.category]?.[0]}`}>
                        {c.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Users className={`w-3.5 h-3.5 ${mt}`} />
                        <span className={`text-[13px] font-medium ${ht}`}>{total}</span>
                        <span className={`text-[10px] ${mt}`}>({c.websiteEnrolled}W + {c.agentEnrolled}A)</span>
                      </div>
                    </td>
                    <td className={`px-5 py-3.5 text-[13px] font-semibold ${dk ? "text-emerald-400" : "text-emerald-600"}`}>{c.completed}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-20 h-1.5 rounded-full overflow-hidden ${dk ? "bg-white/8" : "bg-slate-100"}`}>
                          <div className="h-full rounded-full bg-indigo-500" style={{ width: `${pct}%` }} />
                        </div>
                        <span className={`text-[11px] tabular-nums ${mt}`}>{pct}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className={`text-[13px] font-medium ${ht}`}>{c.rating}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${dk ? statusCls[c.status]?.[1] : statusCls[c.status]?.[0]}`}>{c.status}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <Eye className={`w-4 h-4 ${mt}`} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className={`text-center py-16 ${mt}`}>
            <BookOpen className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No courses match your filters</p>
          </div>
        )}
        <div className={`px-5 py-3 border-t text-xs ${dk ? "border-white/5 text-white/20" : "border-slate-100 text-slate-400"}`}>
          Showing {filtered.length} of {COURSES.length} courses — click a row to view details
        </div>
      </div>

      {/* ── Floating Add Button ─────────────────────────────────────────────── */}
      <button
        id="add-course-fab"
        onClick={() => setShowAdd(true)}
        className="fixed bottom-8 right-8 z-40 flex items-center gap-2 px-5 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-sm font-semibold shadow-xl shadow-indigo-500/30 transition-all duration-200"
      >
        <Plus className="w-4 h-4" />
        Add Course
      </button>

      {/* ── Add Course Modal ──────────────────────────────────────────────── */}
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
                  <BookOpen className="w-4 h-4 text-indigo-500" />
                </div>
                <p className={`text-sm font-semibold ${ dk ? "text-white/85" : "text-slate-800" }`}>Add New Course</p>
              </div>
              <button onClick={() => setShowAdd(false)} className={`p-1.5 rounded-lg transition-colors ${ dk ? "hover:bg-white/8 text-white/40" : "hover:bg-slate-100 text-slate-400" }`}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Course Title", col2: true },
                { label: "Category", col2: false },
                { label: "Duration", col2: false },
                { label: "Price", col2: false },
                { label: "Rating", col2: false },
                { label: "Description", col2: true },
              ].map(({ label, col2 }) => (
                <div key={label} className={col2 ? "col-span-2" : ""}>
                  <label className={`block text-[11px] font-semibold mb-1 ${ dk ? "text-white/35" : "text-slate-400" }`}>{label}</label>
                  {label === "Description" ? (
                    <textarea
                      rows={3}
                      placeholder={`Enter ${label.toLowerCase()}`}
                      className={`w-full px-3 py-2 text-sm rounded-lg border outline-none transition-colors resize-none ${
                        dk
                          ? "bg-white/5 border-white/10 text-white/80 placeholder:text-white/25 focus:border-indigo-500/60"
                          : "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-indigo-400"
                      }`}
                    />
                  ) : (
                    <input
                      placeholder={`Enter ${label.toLowerCase()}`}
                      className={`w-full px-3 py-2 text-sm rounded-lg border outline-none transition-colors ${
                        dk
                          ? "bg-white/5 border-white/10 text-white/80 placeholder:text-white/25 focus:border-indigo-500/60"
                          : "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-indigo-400"
                      }`}
                    />
                  )}
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
                Save Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
