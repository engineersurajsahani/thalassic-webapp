"use client";

import React, { useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  Search, Plus, BookOpen,
  Users, Clock, Star,
  Pencil, Trash2, Eye, X, Check,
  GraduationCap, Building2, ChevronDown, Filter,
} from "lucide-react";
import { MOCK_COURSES, MOCK_INSTITUTES, MockCourse, MockInstitute } from "@/data/master-portal-mock";

const CATEGORIES = ["All", "Safety", "Technical", "Compliance", "Operations"];
const STATUSES   = ["All", "Active", "Draft", "Inactive"];

const catColors: Record<string, string>     = { Safety: "bg-indigo-100 text-indigo-700",  Technical: "bg-amber-100 text-amber-700",  Compliance: "bg-violet-100 text-violet-700",  Operations: "bg-emerald-100 text-emerald-700"  };
const catColorsDark: Record<string, string> = { Safety: "bg-indigo-500/10 text-indigo-400", Technical: "bg-amber-500/10 text-amber-400", Compliance: "bg-violet-500/10 text-violet-400", Operations: "bg-emerald-500/10 text-emerald-400" };
const statusColors: Record<string, string>     = { Active: "bg-emerald-100 text-emerald-700", Draft: "bg-amber-100 text-amber-700",     Inactive: "bg-slate-100 text-slate-500"      };
const statusColorsDark: Record<string, string> = { Active: "bg-emerald-500/10 text-emerald-400", Draft: "bg-amber-500/10 text-amber-400", Inactive: "bg-slate-500/10 text-slate-400" };

const EMPTY_FORM: {
  title: string;
  code: string;
  category: "Safety" | "Technical" | "Compliance" | "Operations";
  duration: string;
  price: number;
  status: "Active" | "Draft" | "Inactive";
  associatedInstituteIds: string[];
} = {
  title: "",
  code: "",
  category: "Safety",
  duration: "",
  price: 5000,
  status: "Active",
  associatedInstituteIds: [],
};

export default function CoursesPage() {
  const { theme } = useTheme();
  const dk = theme === "dark";

  const [courseList, setCourseList]   = useState<MockCourse[]>(MOCK_COURSES);
  const [search, setSearch]           = useState("");
  const [cat, setCat]                 = useState("All");
  const [status, setStatus]           = useState("All");
  const [selectedInst, setSelectedInst] = useState("All");
  const [modalMode, setModalMode]     = useState<"add" | "edit" | "view" | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<MockCourse | null>(null);
  const [form, setForm]               = useState({ ...EMPTY_FORM });
  const [saved, setSaved]             = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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
    const q = search.toLowerCase();
    const matchSearch = c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q);
    const matchCat    = cat === "All" || c.category === cat;
    const matchStatus = status === "All" || c.status === status;
    const matchInst   = selectedInst === "All" || c.associatedInstituteIds.includes(selectedInst);
    return matchSearch && matchCat && matchStatus && matchInst;
  });

  const openModal = (mode: "add" | "edit" | "view", course?: MockCourse) => {
    setSelectedCourse(course ?? null);
    if (course && (mode === "edit" || mode === "view")) {
      setForm({
        title: course.title,
        code: course.code,
        category: course.category,
        duration: course.duration,
        price: course.price,
        status: course.status,
        associatedInstituteIds: [...course.associatedInstituteIds],
      });
    } else {
      setForm({ ...EMPTY_FORM, associatedInstituteIds: [MOCK_INSTITUTES[0].id] });
    }
    setSaved(false);
    setModalMode(mode);
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedCourse(null);
    setSaved(false);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.duration.trim()) return;
    if (modalMode === "add") {
      const newCourse: MockCourse = {
        id: `CRS-0${courseList.length + 1}`,
        code: form.code.trim() || `CRS-${courseList.length + 1}`,
        title: form.title.trim(),
        category: form.category,
        duration: form.duration.trim(),
        price: Number(form.price) || 5000,
        status: form.status,
        rating: 4.8,
        enrolledCount: 0,
        associatedInstituteIds: form.associatedInstituteIds,
      };
      setCourseList(prev => [newCourse, ...prev]);
    } else if (modalMode === "edit" && selectedCourse) {
      setCourseList(prev => prev.map(c =>
        c.id === selectedCourse.id
          ? {
              ...c,
              title: form.title.trim(),
              code: form.code.trim() || c.code,
              category: form.category,
              duration: form.duration.trim(),
              price: Number(form.price) || c.price,
              status: form.status,
              associatedInstituteIds: form.associatedInstituteIds,
            }
          : c
      ));
    }
    setSaved(true);
    setTimeout(closeModal, 600);
  };

  const toggleInstituteAssociation = (instId: string) => {
    setForm(prev => {
      const exists = prev.associatedInstituteIds.includes(instId);
      if (exists) {
        return { ...prev, associatedInstituteIds: prev.associatedInstituteIds.filter(id => id !== instId) };
      } else {
        return { ...prev, associatedInstituteIds: [...prev.associatedInstituteIds, instId] };
      }
    });
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-bold ${headText}`}>Course Management</h1>
          <p className={`text-sm mt-0.5 ${mutedText}`}>Manage maritime curriculum, DGS-approved modules, and multi-institute associations</p>
        </div>
        <button
          onClick={() => openModal("add")}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-md shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" /> Add New Course
        </button>
      </div>

      {/* Filters & Search */}
      <div className={`p-4 rounded-2xl ${bg} flex flex-wrap items-center justify-between gap-3`}>
        <div className="flex flex-1 items-center gap-3 min-w-[280px]">
          <div className="relative flex-1">
            <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${mutedText}`} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search courses by title, code..."
              className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl ${inputBg}`}
            />
          </div>

          {/* Filter by Associated Institute (PRD 1.10) */}
          <div className="relative min-w-[200px]">
            <select
              value={selectedInst}
              onChange={e => setSelectedInst(e.target.value)}
              className={`w-full px-3 py-2 text-xs rounded-xl appearance-none pr-8 cursor-pointer ${inputBg}`}
            >
              <option value="All">All Institutes ({MOCK_INSTITUTES.length})</option>
              {MOCK_INSTITUTES.map(inst => (
                <option key={inst.id} value={inst.id}>{inst.name}</option>
              ))}
            </select>
            <ChevronDown className={`w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${mutedText}`} />
          </div>
        </div>

        {/* Category & Status Filter Tabs */}
        <div className="flex items-center gap-2">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors ${
                cat === c
                  ? "bg-indigo-600 text-white shadow-sm"
                  : dk ? "bg-white/5 text-white/50 hover:bg-white/10" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Course List Table */}
      <div className={`rounded-2xl overflow-hidden ${bg}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b text-[11px] font-semibold uppercase tracking-wider ${dk ? "border-white/5 text-white/30" : "border-slate-100 text-slate-400"}`}>
                <th className="text-left px-6 py-3.5">Course Title & Code</th>
                <th className="text-left px-6 py-3.5">Category</th>
                <th className="text-left px-6 py-3.5">Associated Institutes</th>
                <th className="text-left px-6 py-3.5">Duration</th>
                <th className="text-left px-6 py-3.5">Price</th>
                <th className="text-left px-6 py-3.5">Enrolled</th>
                <th className="text-left px-6 py-3.5">Status</th>
                <th className="text-right px-6 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${divider}`}>
              {filtered.map(c => {
                const associatedInsts = MOCK_INSTITUTES.filter(i => c.associatedInstituteIds.includes(i.id));
                return (
                  <tr key={c.id} className={`${rowHover} transition-colors`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <p className={`font-semibold text-[13px] ${headText}`}>{c.title}</p>
                          <p className={`text-[11px] font-mono ${mutedText}`}>{c.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${dk ? catColorsDark[c.category] : catColors[c.category]}`}>
                        {c.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {associatedInsts.map(inst => (
                          <span
                            key={inst.id}
                            title={`${inst.name} (${inst.location})`}
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                              dk ? "bg-white/5 border-white/10 text-white/70" : "bg-slate-100 border-slate-200 text-slate-700"
                            }`}
                          >
                            <GraduationCap className="w-2.5 h-2.5 text-indigo-400" />
                            {inst.code}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-[12px] ${mutedText}`}>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{c.duration}</span>
                    </td>
                    <td className={`px-6 py-4 text-[13px] font-bold ${headText}`}>
                      ₹{c.price.toLocaleString()}
                    </td>
                    <td className={`px-6 py-4 text-[12px] font-medium ${headText}`}>
                      {c.enrolledCount} seafarers
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${dk ? statusColorsDark[c.status] : statusColors[c.status]}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end">
                        <div className="relative">
                          <button
                            onClick={() => setOpenDropdown(openDropdown === c.id ? null : c.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${dk ? "bg-white/5 border-white/10 text-white/70 hover:bg-white/10" : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"}`}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                            <ChevronDown className="w-3 h-3 opacity-50" />
                          </button>
                          {openDropdown === c.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />
                              <div className={`absolute right-0 mt-1 w-44 rounded-xl shadow-xl border z-20 py-1 ${dk ? "bg-[#0c1a2e] border-white/10" : "bg-white border-slate-200"}`}>
                                <button
                                  onClick={() => { setOpenDropdown(null); openModal("view", c); }}
                                  className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold transition-colors ${dk ? "text-white/70 hover:bg-white/8 hover:text-white" : "text-slate-700 hover:bg-slate-50"}`}
                                >
                                  <Eye className="w-3.5 h-3.5 text-indigo-400" /> View Details
                                </button>
                                <button
                                  onClick={() => { setOpenDropdown(null); openModal("edit", c); }}
                                  className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold transition-colors ${dk ? "text-white/70 hover:bg-white/8 hover:text-white" : "text-slate-700 hover:bg-slate-50"}`}
                                >
                                  <Pencil className="w-3.5 h-3.5 text-amber-400" /> Edit Course
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className={`px-6 py-3.5 border-t ${dk ? "border-white/5" : "border-slate-100"} flex items-center justify-between text-xs ${mutedText}`}>
          <span>Showing {filtered.length} of {courseList.length} courses</span>
          <span>Configured with dynamic Institute Associations</span>
        </div>
      </div>

      {/* ── MODAL: Add / Edit / View Course & Institute Associations ── */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden ${modalBg}`}>
            {/* Modal Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b ${dk ? "border-white/8" : "border-slate-100"}`}>
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <h2 className={`text-base font-bold ${headText}`}>
                  {modalMode === "view" ? "Course Details & Institutes" : modalMode === "edit" ? "Edit Course & Institute Associations" : "Add New Course"}
                </h2>
              </div>
              <button onClick={closeModal} className={mutedText}><X className="w-5 h-5" /></button>
            </div>

            {/* Modal Form Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className={`text-[11px] font-medium block mb-1 ${labelCls}`}>Course Title *</label>
                <input
                  disabled={modalMode === "view"}
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className={`w-full px-3 py-2 text-xs rounded-xl ${inputBg}`}
                  placeholder="e.g. Advanced Fire Fighting (AFF)"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-[11px] font-medium block mb-1 ${labelCls}`}>Course Code / ID</label>
                  <input
                    disabled={modalMode === "view"}
                    value={form.code}
                    onChange={e => setForm({ ...form, code: e.target.value })}
                    className={`w-full px-3 py-2 text-xs rounded-xl ${inputBg}`}
                    placeholder="e.g. STCW-AFF-02"
                  />
                </div>
                <div>
                  <label className={`text-[11px] font-medium block mb-1 ${labelCls}`}>Category</label>
                  <select
                    disabled={modalMode === "view"}
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value as any })}
                    className={`w-full px-3 py-2 text-xs rounded-xl ${inputBg}`}
                  >
                    {CATEGORIES.filter(c => c !== "All").map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={`text-[11px] font-medium block mb-1 ${labelCls}`}>Duration</label>
                  <input
                    disabled={modalMode === "view"}
                    value={form.duration}
                    onChange={e => setForm({ ...form, duration: e.target.value })}
                    className={`w-full px-3 py-2 text-xs rounded-xl ${inputBg}`}
                    placeholder="e.g. 5 days"
                  />
                </div>
                <div>
                  <label className={`text-[11px] font-medium block mb-1 ${labelCls}`}>Hari Om Price (₹)</label>
                  <input
                    disabled={modalMode === "view"}
                    type="number"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                    className={`w-full px-3 py-2 text-xs rounded-xl ${inputBg}`}
                  />
                </div>
                <div>
                  <label className={`text-[11px] font-medium block mb-1 ${labelCls}`}>Status</label>
                  <select
                    disabled={modalMode === "view"}
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value as any })}
                    className={`w-full px-3 py-2 text-xs rounded-xl ${inputBg}`}
                  >
                    {STATUSES.filter(s => s !== "All").map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* PRD 1.10 Associated Institutes Multi-Select */}
              <div className="pt-2">
                <label className={`text-[11px] font-bold block mb-1.5 ${headText}`}>
                  Associated Institutes Offering This Course
                </label>
                <p className={`text-[10px] mb-2 ${mutedText}`}>
                  Select which physical training institutions are accredited to conduct this course:
                </p>

                <div className={`p-3 rounded-xl border max-h-48 overflow-y-auto space-y-2 ${dk ? "bg-white/3 border-white/8" : "bg-slate-50 border-slate-100"}`}>
                  {MOCK_INSTITUTES.map(inst => {
                    const isChecked = form.associatedInstituteIds.includes(inst.id);
                    return (
                      <label
                        key={inst.id}
                        className={`flex items-start gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                          isChecked
                            ? (dk ? "bg-indigo-500/15 text-white" : "bg-indigo-50 text-indigo-900")
                            : (dk ? "hover:bg-white/5" : "hover:bg-slate-100")
                        } ${modalMode === "view" ? "pointer-events-none" : ""}`}
                      >
                        <input
                          type="checkbox"
                          disabled={modalMode === "view"}
                          checked={isChecked}
                          onChange={() => toggleInstituteAssociation(inst.id)}
                          className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-xs leading-tight">{inst.name}</p>
                          <p className={`text-[10px] mt-0.5 ${mutedText}`}>
                            IDT: {inst.idtNumber} · {inst.location} · {inst.activeBatches} active batches
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`flex items-center justify-end gap-2 px-6 py-3 border-t ${dk ? "border-white/8" : "border-slate-100"}`}>
              <button onClick={closeModal} className={`px-4 py-2 text-xs rounded-xl ${dk ? "bg-white/5 text-white/60" : "bg-slate-100 text-slate-600"}`}>
                {modalMode === "view" ? "Close" : "Cancel"}
              </button>
              {modalMode !== "view" && (
                <button
                  onClick={handleSave}
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                >
                  {saved ? "Saved!" : modalMode === "edit" ? "Save Changes" : "Create Course"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
