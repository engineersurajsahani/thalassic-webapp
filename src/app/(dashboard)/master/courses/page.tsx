"use client";

import React, { useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  Search, Plus, MoreHorizontal, BookOpen,
  Users, Clock, Star, Filter, ChevronDown,
  Pencil, Trash2, Eye
} from "lucide-react";

const courses = [
  { id: 1, title: "STCW Basic Safety Training", category: "Safety", instructor: "Capt. R. Sharma", enrolled: 412, duration: "5 days", price: "₹5,000", rating: 4.8, status: "Active", updated: "3 days ago" },
  { id: 2, title: "Advanced Fire Fighting", category: "Safety", instructor: "Capt. M. Nair", enrolled: 289, duration: "3 days", price: "₹7,200", rating: 4.6, status: "Active", updated: "1 week ago" },
  { id: 3, title: "Ship Navigation & Radar", category: "Technical", instructor: "Capt. V. Singh", enrolled: 194, duration: "7 days", price: "₹6,800", rating: 4.7, status: "Active", updated: "2 days ago" },
  { id: 4, title: "Maritime Law & Compliance", category: "Compliance", instructor: "Mr. A. Patel", enrolled: 137, duration: "2 days", price: "₹3,200", rating: 4.5, status: "Active", updated: "5 days ago" },
  { id: 5, title: "Tanker Cargo Operations", category: "Operations", instructor: "Capt. D. Kumar", enrolled: 98, duration: "4 days", price: "₹9,400", rating: 4.9, status: "Draft", updated: "Today" },
  { id: 6, title: "Engine Room Operations", category: "Technical", instructor: "Eng. S. Verma", enrolled: 203, duration: "6 days", price: "₹8,100", rating: 4.4, status: "Active", updated: "1 week ago" },
  { id: 7, title: "Medical First Aid at Sea", category: "Safety", instructor: "Dr. P. Rao", enrolled: 321, duration: "3 days", price: "₹4,500", rating: 4.7, status: "Active", updated: "4 days ago" },
  { id: 8, title: "Crowd & Crisis Management", category: "Compliance", instructor: "Mr. K. Joshi", enrolled: 76, duration: "2 days", price: "₹3,800", rating: 4.3, status: "Inactive", updated: "2 weeks ago" },
];

const categories = ["All", "Safety", "Technical", "Compliance", "Operations"];
const statuses = ["All", "Active", "Draft", "Inactive"];

const catColors: Record<string, string> = {
  Safety: "bg-indigo-100 text-indigo-700",
  Technical: "bg-amber-100 text-amber-700",
  Compliance: "bg-violet-100 text-violet-700",
  Operations: "bg-emerald-100 text-emerald-700",
};
const catColorsDark: Record<string, string> = {
  Safety: "bg-indigo-500/10 text-indigo-400",
  Technical: "bg-amber-500/10 text-amber-400",
  Compliance: "bg-violet-500/10 text-violet-400",
  Operations: "bg-emerald-500/10 text-emerald-400",
};
const statusColors: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700",
  Draft: "bg-amber-100 text-amber-700",
  Inactive: "bg-slate-100 text-slate-500",
};
const statusColorsDark: Record<string, string> = {
  Active: "bg-emerald-500/10 text-emerald-400",
  Draft: "bg-amber-500/10 text-amber-400",
  Inactive: "bg-slate-500/10 text-slate-400",
};

export default function CoursesPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [status, setStatus] = useState("All");

  const bg = isDark ? "bg-[#0d1f35] border border-white/6" : "bg-white border border-slate-200";
  const headText = isDark ? "text-white/80" : "text-slate-800";
  const mutedText = isDark ? "text-white/35" : "text-slate-400";
  const inputBg = isDark ? "bg-white/5 border-white/10 text-white/70 placeholder:text-white/25" : "bg-slate-50 border-slate-200 text-slate-700 placeholder:text-slate-400";
  const divider = isDark ? "divide-white/5" : "divide-slate-100";
  const rowHover = isDark ? "hover:bg-white/[0.03]" : "hover:bg-slate-50";

  const filtered = courses.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.instructor.toLowerCase().includes(search.toLowerCase());
    const matchCat = cat === "All" || c.category === cat;
    const matchStatus = status === "All" || c.status === status;
    return matchSearch && matchCat && matchStatus;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-bold ${headText}`}>Course Management</h1>
          <p className={`text-sm mt-0.5 ${mutedText}`}>{courses.length} courses total</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Add Course
        </button>
      </div>

      {/* Filters */}
      <div className={`${bg} rounded-2xl p-4`}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className={`flex items-center gap-2 flex-1 px-3 py-2 rounded-lg border text-sm ${inputBg}`}>
            <Search className="w-4 h-4 shrink-0 opacity-50" />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses or instructors..."
              className="bg-transparent outline-none w-full"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button key={c} onClick={() => setCat(c)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${cat === c ? "bg-indigo-500 text-white" : isDark ? "bg-white/5 text-white/40 hover:text-white/60" : "bg-slate-100 text-slate-500 hover:text-slate-700"}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            {statuses.map((s) => (
              <button key={s} onClick={() => setStatus(s)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${status === s ? "bg-slate-700 text-white" : isDark ? "bg-white/5 text-white/40 hover:text-white/60" : "bg-slate-100 text-slate-500 hover:text-slate-700"}`}>
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
              <tr className={isDark ? "border-b border-white/5" : "border-b border-slate-100"}>
                {["Course", "Category", "Instructor", "Enrolled", "Duration", "Price", "Rating", "Status", ""].map((h) => (
                  <th key={h} className={`text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap ${mutedText}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${divider}`}>
              {filtered.map((c) => (
                <tr key={c.id} className={`${rowHover} transition-colors`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isDark ? "bg-indigo-500/15" : "bg-indigo-50"}`}>
                        <BookOpen className="w-4 h-4 text-indigo-500" />
                      </div>
                      <div>
                        <p className={`text-[13px] font-medium ${headText}`}>{c.title}</p>
                        <p className={`text-[11px] ${mutedText}`}>Updated {c.updated}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${isDark ? catColorsDark[c.category] : catColors[c.category]}`}>{c.category}</span>
                  </td>
                  <td className={`px-5 py-3.5 text-[13px] ${isDark ? "text-white/60" : "text-slate-600"}`}>{c.instructor}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <Users className={`w-3.5 h-3.5 ${mutedText}`} />
                      <span className={`text-[13px] font-medium ${headText}`}>{c.enrolled}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <Clock className={`w-3.5 h-3.5 ${mutedText}`} />
                      <span className={`text-[13px] ${isDark ? "text-white/60" : "text-slate-600"}`}>{c.duration}</span>
                    </div>
                  </td>
                  <td className={`px-5 py-3.5 text-[13px] font-semibold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>{c.price}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className={`text-[13px] font-medium ${headText}`}>{c.rating}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${isDark ? statusColorsDark[c.status] : statusColors[c.status]}`}>{c.status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button className={`p-1.5 rounded-lg transition-colors ${isDark ? "hover:bg-white/8 text-white/30 hover:text-white/60" : "hover:bg-slate-100 text-slate-400 hover:text-slate-600"}`}><Eye className="w-3.5 h-3.5" /></button>
                      <button className={`p-1.5 rounded-lg transition-colors ${isDark ? "hover:bg-white/8 text-white/30 hover:text-white/60" : "hover:bg-slate-100 text-slate-400 hover:text-slate-600"}`}><Pencil className="w-3.5 h-3.5" /></button>
                      <button className={`p-1.5 rounded-lg transition-colors ${isDark ? "hover:bg-red-500/10 text-white/30 hover:text-red-400" : "hover:bg-red-50 text-slate-400 hover:text-red-500"}`}><Trash2 className="w-3.5 h-3.5" /></button>
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
