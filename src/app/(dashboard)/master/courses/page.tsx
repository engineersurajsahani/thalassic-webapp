"use client";

import React, { useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  Search, Plus, BookOpen,
  Users, Clock, Star,
  Pencil, Trash2, Eye, X, Check,
} from "lucide-react";

type Course = {
  id: number; title: string; category: string; instructor: string;
  enrolled: number; duration: string; price: string; rating: number;
  status: string; updated: string;
};

const INITIAL_COURSES: Course[] = [
  { id: 1, title: "STCW Basic Safety Training",    category: "Safety",      instructor: "Capt. R. Sharma", enrolled: 412, duration: "5 days", price: "₹5,000", rating: 4.8, status: "Active",   updated: "3 days ago"  },
  { id: 2, title: "Advanced Fire Fighting",         category: "Safety",      instructor: "Capt. M. Nair",   enrolled: 289, duration: "3 days", price: "₹7,200", rating: 4.6, status: "Active",   updated: "1 week ago"  },
  { id: 3, title: "Ship Navigation & Radar",        category: "Technical",   instructor: "Capt. V. Singh",  enrolled: 194, duration: "7 days", price: "₹6,800", rating: 4.7, status: "Active",   updated: "2 days ago"  },
  { id: 4, title: "Maritime Law & Compliance",      category: "Compliance",  instructor: "Mr. A. Patel",    enrolled: 137, duration: "2 days", price: "₹3,200", rating: 4.5, status: "Active",   updated: "5 days ago"  },
  { id: 5, title: "Tanker Cargo Operations",        category: "Operations",  instructor: "Capt. D. Kumar",  enrolled: 98,  duration: "4 days", price: "₹9,400", rating: 4.9, status: "Draft",    updated: "Today"       },
  { id: 6, title: "Engine Room Operations",         category: "Technical",   instructor: "Eng. S. Verma",   enrolled: 203, duration: "6 days", price: "₹8,100", rating: 4.4, status: "Active",   updated: "1 week ago"  },
  { id: 7, title: "Medical First Aid at Sea",       category: "Safety",      instructor: "Dr. P. Rao",      enrolled: 321, duration: "3 days", price: "₹4,500", rating: 4.7, status: "Active",   updated: "4 days ago"  },
  { id: 8, title: "Crowd & Crisis Management",      category: "Compliance",  instructor: "Mr. K. Joshi",    enrolled: 76,  duration: "2 days", price: "₹3,800", rating: 4.3, status: "Inactive", updated: "2 weeks ago" },
];

const CATEGORIES   = ["All", "Safety", "Technical", "Compliance", "Operations"];
const STATUSES     = ["All", "Active", "Draft", "Inactive"];

const catColors: Record<string, string>     = { Safety: "bg-indigo-100 text-indigo-700",  Technical: "bg-amber-100 text-amber-700",  Compliance: "bg-violet-100 text-violet-700",  Operations: "bg-emerald-100 text-emerald-700"  };
const catColorsDark: Record<string, string> = { Safety: "bg-indigo-500/10 text-indigo-400", Technical: "bg-amber-500/10 text-amber-400", Compliance: "bg-violet-500/10 text-violet-400", Operations: "bg-emerald-500/10 text-emerald-400" };
const statusColors: Record<string, string>     = { Active: "bg-emerald-100 text-emerald-700", Draft: "bg-amber-100 text-amber-700",     Inactive: "bg-slate-100 text-slate-500"      };
const statusColorsDark: Record<string, string> = { Active: "bg-emerald-500/10 text-emerald-400", Draft: "bg-amber-500/10 text-amber-400", Inactive: "bg-slate-500/10 text-slate-400" };

const EMPTY_FORM = { title: "", category: "Safety", instructor: "", duration: "", price: "", status: "Draft" };

export default function CoursesPage() {
  const { theme } = useTheme();
  const dk = theme === "dark";

  const [courseList, setCourseList] = useState<Course[]>(INITIAL_COURSES);
  const [search, setSearch]         = useState("");
  const [cat, setCat]               = useState("All");
  const [status, setStatus]         = useState("All");
  const [showModal, setShowModal]   = useState(false);
  const [form, setForm]             = useState({ ...EMPTY_FORM });
  const [saved, setSaved]           = useState(false);

  // theme tokens
  const bg        = dk ? "bg-[#0d1f35] border border-white/6" : "bg-white border border-slate-200";
  const headText  = dk ? "text-white/80"  : "text-slate-800";
  const mutedText = dk ? "text-white/35"  : "text-slate-400";
  const inputBg   = dk ? "bg-white/5 border border-white/10 text-white placeholder:text-white/25 focus:border-indigo-500/50 outline-none" : "bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 outline-none";
  const divider   = dk ? "divide-white/5" : "divide-slate-100";
  const rowHover  = dk ? "hover:bg-white/[0.03]" : "hover:bg-slate-50";
  const modalBg   = dk ? "bg-[#0d1f35] border border-white/10" : "bg-white border border-slate-200";
  const labelCls  = dk ? "text-white/60"  : "text-slate-600";

  const filtered = courseList.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.instructor.toLowerCase().includes(search.toLowerCase());
    const matchCat    = cat    === "All" || c.category === cat;
    const matchStatus = status === "All" || c.status   === status;
    return matchSearch && matchCat && matchStatus;
  });

  const handleAdd = () => {
    if (!form.title.trim() || !form.instructor.trim() || !form.duration.trim() || !form.price.trim()) return;
    const newCourse: Course = {
      id:         courseList.length + 1,
      title:      form.title.trim(),
      category:   form.category,
      instructor: form.instructor.trim(),
      enrolled:   0,
      duration:   form.duration.trim(),
      price:      form.price.startsWith("₹") ? form.price.trim() : `₹${form.price.trim()}`,
      rating:     0,
      status:     form.status,
      updated:    "Just now",
    };
    setCourseList(prev => [newCourse, ...prev]);
    setSaved(true);
    setTimeout(() => { setSaved(false); setShowModal(false); setForm({ ...EMPTY_FORM }); }, 1200);
  };

  return (
    <div className="space-y-5">

      {/* ── Add Course Modal ─────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className={`relative w-full max-w-lg rounded-2xl shadow-2xl z-10 ${modalBg}`} onClick={e => e.stopPropagation()}>

            {/* Modal Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b ${dk ? "border-white/8" : "border-slate-100"}`}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                </div>
                <p className={`text-sm font-semibold ${headText}`}>Add New Course</p>
              </div>
              <button onClick={() => setShowModal(false)} className={`p-1.5 rounded-lg transition-colors ${dk ? "hover:bg-white/8 text-white/40 hover:text-white/70" : "hover:bg-slate-100 text-slate-400"}`}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-4">
              {/* Title */}
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>Course Title <span className="text-red-400">*</span></label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. STCW Basic Safety Training"
                  className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${inputBg}`} />
              </div>

              {/* Category & Status row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${inputBg}`}>
                    {["Safety","Technical","Compliance","Operations"].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                    className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${inputBg}`}>
                    {["Active","Draft","Inactive"].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Instructor */}
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>Instructor Name <span className="text-red-400">*</span></label>
                <input value={form.instructor} onChange={e => setForm(f => ({ ...f, instructor: e.target.value }))}
                  placeholder="e.g. Capt. R. Sharma"
                  className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${inputBg}`} />
              </div>

              {/* Duration & Price row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>Duration <span className="text-red-400">*</span></label>
                  <input value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                    placeholder="e.g. 5 days"
                    className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${inputBg}`} />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>Price <span className="text-red-400">*</span></label>
                  <input value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="e.g. ₹5,000"
                    className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${inputBg}`} />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${dk ? "border-white/8" : "border-slate-100"}`}>
              <button onClick={() => setShowModal(false)}
                className={`px-4 py-2 text-sm font-medium rounded-xl border transition-colors ${dk ? "border-white/10 text-white/50 hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
                Cancel
              </button>
              <button onClick={handleAdd}
                className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl transition-all ${
                  saved ? "bg-emerald-500 text-white" : "bg-indigo-500 hover:bg-indigo-600 text-white"
                }`}>
                {saved ? <><Check className="w-4 h-4" /> Added!</> : <><Plus className="w-4 h-4" /> Add Course</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-bold ${headText}`}>Course Management</h1>
          <p className={`text-sm mt-0.5 ${mutedText}`}>{courseList.length} courses total</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-md shadow-indigo-500/20">
          <Plus className="w-4 h-4" /> Add Course
        </button>
      </div>

      {/* Filters */}
      <div className={`${bg} rounded-2xl p-4`}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className={`flex items-center gap-2 flex-1 px-3 py-2 rounded-lg border text-sm ${inputBg}`}>
            <Search className="w-4 h-4 shrink-0 opacity-50" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search courses or instructors..." className="bg-transparent outline-none w-full" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCat(c)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${cat === c ? "bg-indigo-500 text-white" : dk ? "bg-white/5 text-white/40 hover:text-white/60" : "bg-slate-100 text-slate-500 hover:text-slate-700"}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUSES.map((s) => (
              <button key={s} onClick={() => setStatus(s)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${status === s ? "bg-slate-700 text-white" : dk ? "bg-white/5 text-white/40 hover:text-white/60" : "bg-slate-100 text-slate-500 hover:text-slate-700"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={`${bg} rounded-2xl overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={dk ? "border-b border-white/5" : "border-b border-slate-100"}>
                {["Course","Category","Instructor","Enrolled","Duration","Price","Rating","Status",""].map((h) => (
                  <th key={h} className={`text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap ${mutedText}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${divider}`}>
              {filtered.map((c) => (
                <tr key={c.id} className={`${rowHover} transition-colors`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${dk ? "bg-indigo-500/15" : "bg-indigo-50"}`}>
                        <BookOpen className="w-4 h-4 text-indigo-500" />
                      </div>
                      <div>
                        <p className={`text-[13px] font-medium ${headText}`}>{c.title}</p>
                        <p className={`text-[11px] ${mutedText}`}>Updated {c.updated}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${dk ? catColorsDark[c.category] : catColors[c.category]}`}>{c.category}</span>
                  </td>
                  <td className={`px-5 py-3.5 text-[13px] ${dk ? "text-white/60" : "text-slate-600"}`}>{c.instructor}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <Users className={`w-3.5 h-3.5 ${mutedText}`} />
                      <span className={`text-[13px] font-medium ${headText}`}>{c.enrolled}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <Clock className={`w-3.5 h-3.5 ${mutedText}`} />
                      <span className={`text-[13px] ${dk ? "text-white/60" : "text-slate-600"}`}>{c.duration}</span>
                    </div>
                  </td>
                  <td className={`px-5 py-3.5 text-[13px] font-semibold ${dk ? "text-emerald-400" : "text-emerald-600"}`}>{c.price}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className={`text-[13px] font-medium ${headText}`}>{c.rating || "—"}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${dk ? statusColorsDark[c.status] : statusColors[c.status]}`}>{c.status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button className={`p-1.5 rounded-lg transition-colors ${dk ? "hover:bg-white/8 text-white/30 hover:text-white/60" : "hover:bg-slate-100 text-slate-400 hover:text-slate-600"}`}><Eye    className="w-3.5 h-3.5" /></button>
                      <button className={`p-1.5 rounded-lg transition-colors ${dk ? "hover:bg-white/8 text-white/30 hover:text-white/60" : "hover:bg-slate-100 text-slate-400 hover:text-slate-600"}`}><Pencil  className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setCourseList(prev => prev.filter(x => x.id !== c.id))}
                        className={`p-1.5 rounded-lg transition-colors ${dk ? "hover:bg-red-500/10 text-white/30 hover:text-red-400" : "hover:bg-red-50 text-slate-400 hover:text-red-500"}`}><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className={`text-center py-16 ${mutedText}`}>
            <BookOpen className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No courses match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
