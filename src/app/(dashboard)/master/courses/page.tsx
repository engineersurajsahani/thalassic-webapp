"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import { masterService } from "@/services/master.service";
import {
  Search, Plus, BookOpen,
  Users, Clock, Star,
  Pencil, Trash2, X
} from "lucide-react";

export default function CoursesPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    code: "",
    name: "",
    category: "basic",
    duration: "",
    fees: "",
    description: "",
  });

  const categories = ["All", "basic", "advanced", "specialized"];

  const bg = isDark ? "bg-[#0d1f35] border border-white/6" : "bg-white border border-slate-200 shadow-sm";
  const headText = isDark ? "text-white/80" : "text-slate-800";
  const mutedText = isDark ? "text-white/35" : "text-slate-400";
  const inputBg = isDark ? "bg-white/5 border-white/10 text-white/70 placeholder:text-white/25" : "bg-slate-50 border-slate-200 text-slate-700 placeholder:text-slate-400";
  const divider = isDark ? "divide-white/5" : "divide-slate-100";
  const rowHover = isDark ? "hover:bg-white/[0.03]" : "hover:bg-slate-50";

  const fetchCourses = async () => {
    try {
      const data = await masterService.getCourses();
      setCourses(data);
    } catch (err) {
      console.error("Failed to load master courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.name || !form.duration || !form.fees) {
      alert("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    try {
      await masterService.createCourse({
        code: form.code,
        name: form.name,
        category: form.category,
        duration: form.duration,
        fees: form.fees,
        description: form.description,
      });
      setForm({
        code: "",
        name: "",
        category: "basic",
        duration: "",
        fees: "",
        description: "",
      });
      setModalOpen(false);
      await fetchCourses();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create course module");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course module?")) return;
    try {
      await masterService.deleteCourse(id);
      await fetchCourses();
    } catch (err) {
      alert("Failed to delete course module");
    }
  };

  const filtered = courses.filter((c) => {
    const matchSearch =
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.code?.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCat === "All" || c.category === selectedCat;
    return matchSearch && matchCat;
  });

  const getCatBadge = (category: string) => {
    const cat = category?.toLowerCase();
    if (cat === "advanced") {
      return isDark 
        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
        : "bg-amber-50 text-amber-700 border border-amber-200";
    }
    if (cat === "specialized") {
      return isDark 
        ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" 
        : "bg-purple-50 text-purple-700 border border-purple-200";
    }
    return isDark 
      ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" 
      : "bg-indigo-50 text-indigo-700 border border-indigo-200";
  };

  return (
    <div className="space-y-5 relative min-h-screen pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-bold ${headText}`}>Course Management</h1>
          <p className={`text-sm mt-0.5 ${mutedText}`}>{courses.length} courses total</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-md hover:-translate-y-0.5"
        >
          <Plus className="w-4.5 h-4.5" /> Add Course
        </button>
      </div>

      {/* Filters */}
      <div className={`${bg} rounded-2xl p-4`}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className={`flex items-center gap-2 flex-1 px-3 py-2.5 rounded-xl border text-sm ${inputBg}`}>
            <Search className="w-4 h-4 shrink-0 opacity-50" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses by code or title..."
              className="bg-transparent outline-none w-full"
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCat(c)}
                className={`text-xs px-3 py-2 rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCat === c 
                    ? "bg-indigo-600 text-white" 
                    : isDark ? "bg-white/5 text-white/40 hover:text-white/60" : "bg-slate-100 text-slate-500 hover:text-slate-700"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Card Grid */}
      {loading ? (
        <div className="text-center py-16 animate-pulse">
          <div className="w-8 h-8 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mx-auto mb-4" />
          <p className={`text-xs ${mutedText}`}>Loading course registry...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <div
              key={c.id}
              className={`rounded-3xl overflow-hidden p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                isDark 
                  ? "bg-[#0b1b36]/60 border border-slate-800 hover:border-slate-700 text-white" 
                  : "bg-white border border-slate-200 hover:border-slate-300 text-slate-900 shadow-sm"
              }`}
            >
              {/* Card Header Info */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{c.icon || "⚓"}</span>
                  <div>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${getCatBadge(c.category)}`}>
                      {c.category || "basic"}
                    </span>
                    <h3 className={`text-sm font-black tracking-tight mt-1 line-clamp-1 ${headText}`}>
                      <span className="text-indigo-500 mr-1">[{c.code}]</span> {c.name}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(c.id)}
                  className={`p-2 rounded-xl transition-colors cursor-pointer shrink-0 ${
                    isDark ? "hover:bg-red-500/10 text-white/30 hover:text-red-400" : "hover:bg-red-50 text-slate-400 hover:text-red-500"
                  }`}
                  title="Delete Course Module"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Description */}
              <p className={`text-xs mt-3 line-clamp-2 leading-relaxed min-h-[32px] ${mutedText}`}>
                {c.description || "No course syllabus details have been provided yet."}
              </p>

              {/* Course Specs */}
              <div className={`mt-4 pt-4 border-t flex items-center justify-between gap-4 ${isDark ? "border-slate-800" : "border-slate-100"}`}>
                <div className="flex items-center gap-1 text-xs font-bold">
                  <Clock className={`w-4 h-4 ${mutedText}`} />
                  <span className={isDark ? "text-white/60" : "text-slate-650"}>{c.duration || "N/A"}</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className={headText}>{c.rating || "4.8"}</span>
                </div>
                <span className={`text-sm font-black ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                  {c.fees || "Free"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && filtered.length === 0 && (
        <div className={`text-center py-16 ${bg} rounded-2xl`}>
          <BookOpen className="w-8 h-8 mx-auto mb-3 opacity-40 animate-pulse text-slate-500" />
          <p className="text-sm font-bold text-slate-400">No courses match your filters</p>
        </div>
      )}

      {/* Elegant Add Course Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border transition-all duration-300 ${
            isDark ? "bg-[#0b1b36] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
          }`}>
            {/* Modal Header */}
            <div className={`flex items-center justify-between px-6 py-5 border-b ${isDark ? "border-slate-800" : "border-slate-100"}`}>
              <div>
                <h3 className="text-lg font-black tracking-tight">Create Course Module</h3>
                <p className={`text-xs mt-0.5 ${mutedText}`}>Accredit and release a new DGS curriculum course</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isDark ? "border-slate-800 hover:bg-slate-800 text-slate-400" : "border-slate-200 hover:bg-slate-50 text-slate-500"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddCourse} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={`text-xs font-bold uppercase tracking-wider ${mutedText}`}>Course Code *</label>
                  <input
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    placeholder="e.g. BST, AFF"
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                      isDark ? "bg-slate-900/40 border-slate-800 focus:border-indigo-500" : "bg-slate-50 border-slate-200 focus:border-indigo-500"
                    }`}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={`text-xs font-bold uppercase tracking-wider ${mutedText}`}>Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                      isDark ? "bg-[#0b1b36] border-slate-800 focus:border-indigo-500 text-white" : "bg-slate-50 border-slate-200 focus:border-indigo-500 text-slate-950"
                    }`}
                  >
                    <option value="basic">Basic</option>
                    <option value="advanced">Advanced</option>
                    <option value="specialized">Specialized</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={`text-xs font-bold uppercase tracking-wider ${mutedText}`}>Course Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Basic Safety Training"
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                    isDark ? "bg-slate-900/40 border-slate-800 focus:border-indigo-500" : "bg-slate-50 border-slate-200 focus:border-indigo-500"
                  }`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={`text-xs font-bold uppercase tracking-wider ${mutedText}`}>Duration *</label>
                  <input
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="e.g. 5 Days, 2 Weeks"
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                      isDark ? "bg-slate-900/40 border-slate-800 focus:border-indigo-500" : "bg-slate-50 border-slate-200 focus:border-indigo-500"
                    }`}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={`text-xs font-bold uppercase tracking-wider ${mutedText}`}>Fees/Price *</label>
                  <input
                    value={form.fees}
                    onChange={(e) => setForm({ ...form, fees: e.target.value })}
                    placeholder="e.g. ₹5,000, Free"
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                      isDark ? "bg-slate-900/40 border-slate-800 focus:border-indigo-500" : "bg-slate-50 border-slate-200 focus:border-indigo-500"
                    }`}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={`text-xs font-bold uppercase tracking-wider ${mutedText}`}>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Provide details about syllabus, requirements, IMO regulations..."
                  rows={3}
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all resize-none ${
                    isDark ? "bg-slate-900/40 border-slate-800 focus:border-indigo-500" : "bg-slate-50 border-slate-200 focus:border-indigo-500"
                  }`}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    isDark ? "border-slate-800 hover:bg-slate-800 text-slate-300" : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all cursor-pointer ${
                    submitting 
                      ? "bg-slate-650 text-slate-400 cursor-not-allowed" 
                      : "bg-indigo-600 hover:bg-indigo-500 text-white hover:-translate-y-0.5"
                  }`}
                >
                  {submitting ? "Releasing..." : "Release Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
