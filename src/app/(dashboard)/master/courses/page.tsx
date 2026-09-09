"use client";

import React, { useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import { useGlobalStatus } from "@/providers/status-provider";
import {
  Search, Plus, BookOpen,
  Clock, X, Edit, Save, Calendar,
  Building2, MapPin, Star, Check, Eye
} from "lucide-react";
import { MOCK_COURSES, MockCourse } from "@/data/master-portal-mock";
import {
  MOCK_INSTITUTES,
  COURSE_INSTITUTES_MAP,
  COURSE_INSTITUTE_PRICING,
} from "@/constants/masterCourses";

const CATEGORIES = ["All", "Safety", "Technical", "Compliance", "Operations"];

const catColors: Record<string, string>     = { Safety: "text-indigo-700",  Technical: "text-amber-700",  Compliance: "text-violet-700",  Operations: "text-emerald-700"  };
const catColorsDark: Record<string, string> = { Safety: "text-indigo-400", Technical: "text-amber-400", Compliance: "text-violet-400", Operations: "text-emerald-400" };
const statusColors: Record<string, string>     = { Active: "text-emerald-700", Draft: "text-amber-700",     Inactive: "text-slate-500"      };
const statusColorsDark: Record<string, string> = { Active: "text-emerald-400", Draft: "text-amber-400", Inactive: "text-slate-400" };

const COURSE_DESCRIPTIONS: Record<string, string> = {
  "CRS-01": "Mandatory safety training covering Personal Survival Techniques, Firefighting, First Aid, and PSSR under STCW 2010 guidelines.",
  "STCW-BST": "Mandatory safety training covering Personal Survival Techniques, Firefighting, First Aid, and PSSR under STCW 2010 guidelines.",
  "CRS-02": "Advanced training in organizing, tactics, command, and control of onboard firefighting operations.",
  "STCW-AFF": "Advanced training in organizing, tactics, command, and control of onboard firefighting operations.",
  "CRS-03": "Comprehensive bridge watchkeeping, radar plotting, ARPA operations, and electronic navigation systems.",
  "NAV-RADAR": "Comprehensive bridge watchkeeping, radar plotting, ARPA operations, and electronic navigation systems.",
  "CRS-04": "International maritime conventions including SOLAS, MARPOL, MLC 2006, and Port State Control compliance.",
  "LAW-MAR": "International maritime conventions including SOLAS, MARPOL, MLC 2006, and Port State Control compliance.",
  "CRS-05": "Advanced safety procedures, cargo handling, inert gas systems, and pollution prevention on oil/chemical tankers.",
  "OPS-TANK": "Advanced safety procedures, cargo handling, inert gas systems, and pollution prevention on oil/chemical tankers.",
  "CRS-06": "Marine propulsion systems, auxiliary machinery maintenance, power generation, and emergency preparedness.",
  "ENG-SIM": "Marine propulsion systems, auxiliary machinery maintenance, power generation, and emergency preparedness.",
  "CRS-07": "Immediate first aid application, trauma care, telemedicine coordination, and medical kit administration at sea.",
  "MED-FIRST": "Immediate first aid application, trauma care, telemedicine coordination, and medical kit administration at sea.",
  "CRS-08": "Passenger vessel safety, crowd psychology, emergency muster procedures, and life-saving appliance deployment.",
  "CMP-CRISIS": "Passenger ship crowd management, human behaviour in emergencies, crisis communications, and muster station organization.",
};

function getCourseDescription(course: MockCourse): string {
  return (
    course.description ||
    COURSE_DESCRIPTIONS[course.id] ||
    COURSE_DESCRIPTIONS[course.code] ||
    "This certified training course prepares maritime crew for STCW compliance, emergency response, and operational excellence as required by DG Shipping regulations."
  );
}

/* ── helper: parse "5 days" → number ──────────────────────────────────────── */
function parseDurationDays(dur: string): number {
  const m = dur.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 5;
}

/* ── helper: add days to a Date ───────────────────────────────────────────── */
function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

/* ── helper: DD/MM/YYYY ───────────────────────────────────────────────────── */
function fmtDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

interface CourseInstituteDetail {
  id: string;
  name: string;
  location: string;
  rating?: number;
  price: string;
  seats: number;
  nextBatch: string;
}

function getInstitutesForCourse(course: MockCourse): CourseInstituteDetail[] {
  const keys = Object.keys(COURSE_INSTITUTES_MAP);
  const matchedKey = keys.find(k =>
    course.title.toLowerCase().includes(k.toLowerCase()) ||
    k.toLowerCase().includes(course.title.toLowerCase())
  );

  if (matchedKey && COURSE_INSTITUTES_MAP[matchedKey]) {
    const instIds = COURSE_INSTITUTES_MAP[matchedKey];
    const pricingMap = COURSE_INSTITUTE_PRICING[matchedKey] || {};

    return instIds.map((id) => {
      const institute = MOCK_INSTITUTES.find((i) => i.id === id) || {
        id,
        name: "Hari Om Thalassic Maritime Training Institute",
        location: "Mumbai, Maharashtra",
        rating: 4.9,
      };
      const pricing = pricingMap[id] || { price: `₹${course.price.toLocaleString()}`, seats: 20, nextBatch: "15 Sep 2026" };

      return {
        id: institute.id,
        name: institute.name,
        location: institute.location,
        rating: institute.rating,
        price: pricing.price,
        seats: pricing.seats,
        nextBatch: pricing.nextBatch,
      };
    });
  }

  // Dynamic fallback for newly added / custom courses
  return [
    {
      id: "inst_1",
      name: "Hari Om Thalassic Maritime Training Institute",
      location: "Mumbai, Maharashtra",
      rating: 4.9,
      price: `₹${course.price.toLocaleString()}`,
      seats: 24,
      nextBatch: "15 Sep 2026",
    },
    {
      id: "inst_2",
      name: "Global Seafarers Academy",
      location: "Kochi, Kerala",
      rating: 4.8,
      price: `₹${(course.price + 500).toLocaleString()}`,
      seats: 18,
      nextBatch: "20 Sep 2026",
    },
    {
      id: "inst_3",
      name: "Oceanic Maritime Center",
      location: "Chennai, Tamil Nadu",
      rating: 4.7,
      price: `₹${(course.price > 500 ? course.price - 200 : course.price).toLocaleString()}`,
      seats: 30,
      nextBatch: "18 Sep 2026",
    },
  ];
}

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
  const { getStatusesForModule, getStatus } = useGlobalStatus();
  const courseStatuses = getStatusesForModule("course");

  const [courseList, setCourseList]   = useState<MockCourse[]>(MOCK_COURSES);
  const [search, setSearch]           = useState("");
  const [cat, setCat]                 = useState("All");
  const [status, setStatus]           = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [form, setForm]               = useState({ ...EMPTY_FORM });
  const [saved, setSaved]             = useState(false);

  // Selected Course for Details Modal
  const [selectedCourse, setSelectedCourse] = useState<MockCourse | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    duration: "",
    price: "",
  });

  // Assign Crew Modal State
  const [assignModal, setAssignModal] = useState<{
    courseTitle: string;
    instituteName: string;
    nextBatch: string;
  } | null>(null);
  const [assignSuccess, setAssignSuccess] = useState<string | null>(null);

  // theme tokens
  const bg        = dk ? "bg-[#0d1f35] border border-white/6" : "bg-white border border-slate-200";
  const headText  = dk ? "text-white/80"  : "text-slate-800";
  const mutedText = dk ? "text-slate-400"  : "text-slate-600";
  const inputBg   = dk ? "bg-white/5 border border-white/10 text-white placeholder:text-slate-400 focus:border-indigo-500/50 outline-none" : "bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-500 focus:border-indigo-400 outline-none";
  const divider   = dk ? "divide-white/5" : "divide-slate-100";
  const rowHover  = dk ? "hover:bg-white/[0.03]" : "hover:bg-slate-50";
  const modalBg   = dk ? "bg-[#0d1f35] border border-white/10" : "bg-white border border-slate-200";
  const labelCls  = dk ? "text-slate-300 font-semibold"  : "text-slate-700 font-semibold";

  const filtered = courseList.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q);
    const matchCat    = cat === "All" || c.category === cat;
    const matchStatus = status === "All" || c.status === status;
    return matchSearch && matchCat && matchStatus;
  });

  const openAddModal = () => {
    setEditingCourseId(null);
    setForm({ ...EMPTY_FORM });
    setSaved(false);
    setIsAddModalOpen(true);
  };

  const toggleInstituteAssociation = (instId: string) => {
    setForm(prev => {
      const exists = prev.associatedInstituteIds.includes(instId);
      return {
        ...prev,
        associatedInstituteIds: exists
          ? prev.associatedInstituteIds.filter(id => id !== instId)
          : [...prev.associatedInstituteIds, instId],
      };
    });
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setEditingCourseId(null);
    setSaved(false);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.duration.trim()) return;

    if (editingCourseId) {
      setCourseList(prev =>
        prev.map(c =>
          c.id === editingCourseId
            ? {
                ...c,
                title: form.title.trim(),
                code: form.code.trim() || c.code,
                category: form.category,
                duration: form.duration.trim(),
                price: Number(form.price) || c.price,
                status: form.status,
              }
            : c
        )
      );
      if (selectedCourse && selectedCourse.id === editingCourseId) {
        setSelectedCourse(prev =>
          prev
            ? {
                ...prev,
                title: form.title.trim(),
                code: form.code.trim() || prev.code,
                category: form.category,
                duration: form.duration.trim(),
                price: Number(form.price) || prev.price,
                status: form.status,
              }
            : null
        );
      }
    } else {
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
        associatedInstituteIds: [],
      };
      setCourseList(prev => [newCourse, ...prev]);
    }

    setSaved(true);
    setTimeout(closeModal, 600);
  };

  const startEditing = () => {
    if (!selectedCourse) return;
    setEditForm({
      title: selectedCourse.title,
      description: selectedCourse.description || getCourseDescription(selectedCourse),
      duration: selectedCourse.duration,
      price: String(selectedCourse.price),
    });
    setIsEditing(true);
  };

  const saveEdit = () => {
    if (!selectedCourse) return;
    const newPrice = Number(editForm.price) || selectedCourse.price;
    const updated: MockCourse = {
      ...selectedCourse,
      title: editForm.title.trim() || selectedCourse.title,
      duration: editForm.duration.trim() || selectedCourse.duration,
      price: newPrice,
      description: editForm.description.trim(),
    };

    setCourseList(prev => prev.map(c => (c.id === selectedCourse.id ? updated : c)));
    setSelectedCourse(updated);
    setIsEditing(false);
  };

  const handleAssignCrew = (course: MockCourse, inst: CourseInstituteDetail) => {
    setAssignModal({
      courseTitle: course.title,
      instituteName: inst.name,
      nextBatch: inst.nextBatch,
    });
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-bold ${headText}`}>Course Management</h1>
          <p className={`text-sm mt-0.5 ${mutedText}`}>Manage maritime curriculum and DGS-approved modules</p>
        </div>
        <button
          onClick={openAddModal}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border transition-colors shadow-sm ${
            dk ? "bg-white/5 border-white/10 text-white hover:bg-white/10" : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50"
          }`}
        >
          <Plus className="w-4 h-4" /> Add New Course
        </button>
      </div>

      {/* Filters & Search */}
      <div className={`p-4 rounded-2xl ${bg} flex flex-wrap items-center justify-between gap-3`}>
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${dk ? "text-slate-400" : "text-slate-500"}`} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search courses by title, code..."
              className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl ${inputBg}`}
            />
          </div>
        </div>

        {/* Category & Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`text-xs capitalize transition-colors ${
                  cat === c
                    ? "text-black dark:text-white font-bold underline underline-offset-4 decoration-2 decoration-indigo-500"
                    : dk ? "text-slate-400 hover:text-white font-medium" : "text-slate-600 hover:text-slate-900 font-medium"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className={`h-4 w-px ${dk ? "bg-white/10" : "bg-slate-200"} mx-1`} />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStatus("All")}
              className={`text-xs capitalize transition-colors ${
                status === "All"
                  ? "text-black dark:text-white font-bold underline underline-offset-4 decoration-2 decoration-violet-500"
                  : dk ? "text-slate-400 hover:text-white font-medium" : "text-slate-600 hover:text-slate-900 font-medium"
              }`}
            >
              All Statuses
            </button>
            {courseStatuses.map(s => (
              <button
                key={s.id}
                onClick={() => setStatus(s.label)}
                className={`text-xs capitalize transition-colors ${
                  status === s.label
                    ? "text-black dark:text-white font-bold underline underline-offset-4 decoration-2 decoration-violet-500"
                    : dk ? "text-slate-400 hover:text-white font-medium" : "text-slate-600 hover:text-slate-900 font-medium"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Course List Table */}
      <div className={`rounded-2xl overflow-hidden ${bg}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b text-[11px] font-semibold uppercase tracking-wider ${dk ? "border-white/5 text-slate-300" : "border-slate-100 text-slate-700"}`}>
                <th className="text-left px-6 py-3.5">Course Title & Code</th>
                <th className="text-left px-6 py-3.5">Category</th>
                <th className="text-left px-6 py-3.5">Associated Institutes</th>
                <th className="text-left px-6 py-3.5">Duration</th>
                <th className="text-left px-6 py-3.5">Hari Om Price</th>
                <th className="text-left px-6 py-3.5">Enrolled</th>
                <th className="text-left px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${divider}`}>
              {filtered.map(c => {
                const institutesCount = getInstitutesForCourse(c).length;
                return (
                  <tr
                    key={c.id}
                    onClick={() => {
                      setSelectedCourse(c);
                      setIsEditing(false);
                    }}
                    className={`${rowHover} transition-colors cursor-pointer`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <p className={`font-semibold text-[13px] ${headText}`}>{c.title}</p>
                          <p className={`text-[11px] font-mono font-medium ${mutedText}`}>{c.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[12px] font-semibold ${dk ? catColorsDark[c.category] : catColors[c.category]}`}>
                        {c.category}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-[12px] font-medium ${mutedText}`}>
                      <span className="flex items-center gap-1.5">
                        <Building2 className={`w-3.5 h-3.5 ${dk ? "text-slate-400" : "text-slate-500"}`} />
                        {institutesCount} {institutesCount === 1 ? "Institute" : "Institutes"}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-[12px] font-medium ${mutedText}`}>
                      <span className="flex items-center gap-1"><Clock className={`w-3 h-3 ${dk ? "text-slate-400" : "text-slate-500"}`} />{c.duration}</span>
                    </td>
                    <td className={`px-6 py-4 text-[13px] font-bold ${headText}`}>
                      ₹{c.price.toLocaleString()}
                    </td>
                    <td className={`px-6 py-4 text-[12px] font-medium ${headText}`}>
                      {c.enrolledCount} seafarers
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[12px] font-semibold ${getStatus(c.status)?.color || (dk ? statusColorsDark[c.status] : statusColors[c.status])}`}>
                        {getStatus(c.status)?.label || c.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className={`px-6 py-3.5 border-t ${dk ? "border-white/5" : "border-slate-100"} flex items-center justify-between text-xs font-medium ${mutedText}`}>
          <span>Showing {filtered.length} of {courseList.length} courses</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* COURSE DETAILS MODAL (WITH EDIT, BATCH DETAILS, INSTITUTES & PRICE)       */}
      {/* ========================================================================= */}
      {selectedCourse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => {
            setSelectedCourse(null);
            setIsEditing(false);
          }}
        >
          <div
            className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl flex flex-col ${modalBg}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`p-6 border-b flex items-start justify-between gap-4 ${dk ? "border-white/8" : "border-slate-100"}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1.5">
                  <span className={`text-xs font-bold uppercase tracking-wider ${dk ? catColorsDark[selectedCourse.category] || "text-indigo-400" : catColors[selectedCourse.category] || "text-indigo-700"}`}>
                    {selectedCourse.category}
                  </span>
                  {selectedCourse.code && (
                    <span className={`text-xs font-mono font-medium ${mutedText}`}>
                      {selectedCourse.code}
                    </span>
                  )}
                </div>
                {isEditing ? (
                  <input
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className={`text-xl font-bold w-full bg-transparent border-b outline-none pb-1 ${
                      dk ? "border-white/20 focus:border-indigo-400 text-white" : "border-slate-300 focus:border-indigo-500 text-slate-900"
                    }`}
                  />
                ) : (
                  <h2 className={`text-xl font-bold ${headText}`}>{selectedCourse.title}</h2>
                )}
                <p className={`text-xs mt-1 ${mutedText}`}>
                  Duration: {isEditing ? editForm.duration : selectedCourse.duration}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!isEditing && (
                  <button
                    onClick={startEditing}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 transition-colors cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedCourse(null);
                    setIsEditing(false);
                  }}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    dk ? "border-white/10 hover:bg-white/5 text-slate-300" : "border-slate-200 hover:bg-slate-100 text-slate-600"
                  }`}
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Course Overview */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-white/40 mb-2">
                  COURSE OVERVIEW
                </h4>
                {isEditing ? (
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={3}
                    className={`w-full text-xs leading-relaxed p-2.5 rounded-xl border outline-none resize-none ${
                      dk ? "bg-white/5 border-white/10 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                  />
                ) : (
                  <p className={`text-xs leading-relaxed ${dk ? "text-white/80" : "text-slate-600"}`}>
                    {selectedCourse.description || getCourseDescription(selectedCourse)}
                  </p>
                )}
              </div>

              {/* Edit: Duration & Price inputs */}
              {isEditing && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-white/40 block mb-1.5">
                      Duration
                    </label>
                    <input
                      value={editForm.duration}
                      onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                      className={`w-full p-2.5 rounded-xl border outline-none text-xs ${
                        dk ? "bg-white/5 border-white/10 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                      }`}
                      placeholder="e.g. 5 days"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-white/40 block mb-1.5">
                      Hari Om Price (₹)
                    </label>
                    <input
                      type="number"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      className={`w-full p-2.5 rounded-xl border outline-none text-xs ${
                        dk ? "bg-white/5 border-white/10 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                      }`}
                      placeholder="e.g. 5000"
                    />
                  </div>
                </div>
              )}

              {/* Batch Details Section */}
              {!isEditing && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-white/40 mb-3 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-sky-500" />
                    BATCH DETAILS
                  </h4>
                  <div className="space-y-2.5">
                    {getInstitutesForCourse(selectedCourse).map((inst) => {
                      const durationDays = parseDurationDays(selectedCourse.duration);
                      const startDate = new Date(inst.nextBatch);
                      const validStart = !isNaN(startDate.getTime());
                      const endDate = validStart ? addDays(startDate, durationDays) : null;

                      return (
                        <div
                          key={inst.id}
                          className={`p-3.5 rounded-xl border grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs ${
                            dk ? "bg-white/[0.02] border-white/5" : "bg-slate-50 border-slate-200"
                          }`}
                        >
                          <div>
                            <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-white/40 block mb-0.5">
                              START DATE
                            </span>
                            <span className={`font-bold ${headText}`}>
                              {validStart ? fmtDate(startDate) : inst.nextBatch}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-white/40 block mb-0.5">
                              END DATE
                            </span>
                            <span className={`font-bold ${headText}`}>
                              {endDate ? fmtDate(endDate) : "—"}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-white/40 block mb-0.5">
                              DURATION
                            </span>
                            <span className={`font-bold ${headText}`}>{selectedCourse.duration}</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-white/40 block mb-0.5">
                              BATCH CAPACITY
                            </span>
                            <span className={`font-bold ${headText}`}>{inst.seats} seats</span>
                          </div>
                          <div className="col-span-2 sm:col-span-4 mt-0.5">
                            <span className="text-[11px] text-slate-500 dark:text-white/40 font-medium">
                              {inst.name}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Available Institutes & Price Section */}
              {!isEditing && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-white/40 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                      AVAILABLE INSTITUTES & PRICE ({getInstitutesForCourse(selectedCourse).length})
                    </h4>
                    <span className="text-[11px] text-black dark:text-white font-medium">
                      Prices vary by institute
                    </span>
                  </div>

                  <div className="space-y-3">
                    {getInstitutesForCourse(selectedCourse).map((inst) => (
                      <div
                        key={inst.id}
                        className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          dk ? "bg-white/[0.02] border-white/5 hover:border-white/10" : "bg-slate-50 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold ${headText}`}>{inst.name}</span>
                            {inst.rating && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-500">
                                <Star className="w-2.5 h-2.5 fill-amber-500" />
                                {inst.rating}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-white/50">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-rose-500" />
                              {inst.location}
                            </span>
                            <span>•</span>
                            <span>Next Batch: {inst.nextBatch}</span>
                            <span>•</span>
                            <span>{inst.seats} seats left</span>
                          </div>
                        </div>

                        <div className="flex items-center sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-white/5">
                          <div className="text-left sm:text-right">
                            <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-white/40 block">Price</span>
                            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{inst.price}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div
              className={`p-4 px-6 border-t flex items-center justify-between ${
                dk ? "border-white/5 bg-white/[0.01]" : "border-slate-100 bg-slate-50/50"
              }`}
            >
              <span className="text-xs text-slate-400 dark:text-white/40">
                STCW 2010 Manila Amendments Accredited
              </span>
              <div className="flex items-center gap-2">
                {isEditing && (
                  <button
                    onClick={saveEdit}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-colors cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save Changes
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedCourse(null);
                    setIsEditing(false);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                    dk ? "border-white/10 hover:bg-white/5 text-slate-300" : "border-slate-200 hover:bg-slate-100 text-slate-600"
                  }`}
                >
                  {isEditing ? "Cancel" : "Close"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ASSIGN CREW MODAL ── */}
      {assignModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setAssignModal(null)}
        >
          <div
            className={`w-full max-w-md rounded-2xl shadow-2xl p-6 border ${modalBg}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`flex items-center justify-between pb-4 border-b ${dk ? "border-white/8" : "border-slate-100"}`}>
              <div>
                <h3 className={`text-sm font-bold ${headText}`}>Assign Crew</h3>
                <p className={`text-xs ${mutedText}`}>{assignModal.courseTitle}</p>
              </div>
              <button onClick={() => setAssignModal(null)} className={mutedText}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div>
                <label className={`text-[11px] font-medium block mb-1 ${labelCls}`}>Training Institute</label>
                <input
                  readOnly
                  value={assignModal.instituteName}
                  className={`w-full px-3 py-2 text-xs rounded-xl ${inputBg} opacity-80`}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-[11px] font-medium block mb-1 ${labelCls}`}>Batch Date</label>
                  <input
                    readOnly
                    value={assignModal.nextBatch}
                    className={`w-full px-3 py-2 text-xs rounded-xl ${inputBg} opacity-80`}
                  />
                </div>
                <div>
                  <label className={`text-[11px] font-medium block mb-1 ${labelCls}`}>Seats Required</label>
                  <input
                    type="number"
                    min={1}
                    max={24}
                    defaultValue={1}
                    className={`w-full px-3 py-2 text-xs rounded-xl ${inputBg}`}
                  />
                </div>
              </div>
            </div>

            <div className={`flex items-center justify-end gap-2 pt-4 border-t ${dk ? "border-white/8" : "border-slate-100"}`}>
              <button
                onClick={() => setAssignModal(null)}
                className={`px-4 py-2 text-xs rounded-xl ${dk ? "bg-white/5 text-white/60" : "bg-slate-100 text-slate-600"}`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setAssignSuccess(`Crew assigned to ${assignModal.courseTitle} at ${assignModal.instituteName}`);
                  setAssignModal(null);
                  setTimeout(() => setAssignSuccess(null), 3500);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-sky-600 hover:bg-sky-700 text-white transition-colors"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Success Toast */}
      {assignSuccess && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-xl text-xs font-medium animate-fadeIn">
          <Check className="w-4 h-4" />
          {assignSuccess}
        </div>
      )}

      {/* ── MODAL: Add / Edit Course ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden ${modalBg}`}>
            {/* Modal Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b ${dk ? "border-white/8" : "border-slate-100"}`}>
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <h2 className={`text-base font-bold ${headText}`}>
                  {editingCourseId ? "Edit Course" : "Add New Course"}
                </h2>
              </div>
              <button onClick={closeModal} className={mutedText}><X className="w-5 h-5" /></button>
            </div>

            {/* Modal Form Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className={`text-[11px] font-medium block mb-1 ${labelCls}`}>Course Title *</label>
                <input
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
                    value={form.code}
                    onChange={e => setForm({ ...form, code: e.target.value })}
                    className={`w-full px-3 py-2 text-xs rounded-xl ${inputBg}`}
                    placeholder="e.g. STCW-AFF-02"
                  />
                </div>
                <div>
                  <label className={`text-[11px] font-medium block mb-1 ${labelCls}`}>Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value as typeof form.category })}
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
                    value={form.duration}
                    onChange={e => setForm({ ...form, duration: e.target.value })}
                    className={`w-full px-3 py-2 text-xs rounded-xl ${inputBg}`}
                    placeholder="e.g. 5 days"
                  />
                </div>
                <div>
                  <label className={`text-[11px] font-medium block mb-1 ${labelCls}`}>Hari Om Price (₹)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                    className={`w-full px-3 py-2 text-xs rounded-xl ${inputBg}`}
                  />
                </div>
                <div>
                  <label className={`text-[11px] font-medium block mb-1 ${labelCls}`}>Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value as typeof form.status })}
                    className={`w-full px-3 py-2 text-xs rounded-xl ${inputBg}`}
                  >
                    {courseStatuses.map(s => (
                      <option key={s.id} value={s.label}>{s.label}</option>
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
                    const isChecked = form.associatedInstituteIds?.includes(inst.id) || false;
                    return (
                      <label
                        key={inst.id}
                        className={`flex items-start gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                          isChecked
                            ? (dk ? "bg-indigo-500/15 text-white" : "bg-indigo-50 text-indigo-900")
                            : (dk ? "hover:bg-white/5" : "hover:bg-slate-100")
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleInstituteAssociation(inst.id)}
                          className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-xs leading-tight">{inst.name}</p>
                          <p className={`text-[10px] mt-0.5 ${mutedText}`}>
                            {inst.location} · {inst.contact || "Accredited Training Center"}
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
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
              >
                {saved ? "Saved!" : editingCourseId ? "Save Changes" : "Create Course"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
