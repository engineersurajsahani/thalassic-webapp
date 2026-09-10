"use client";

import React, { useState, useMemo } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  INITIAL_COURSES,
  MOCK_INSTITUTES,
  COURSE_INSTITUTES_MAP,
  COURSE_INSTITUTE_PRICING,
  Course,
} from "@/constants/masterCourses";
import {
  BookOpen,
  Plus,
  X,
  Building2,
  Clock,
  MapPin,
  Star,
  CheckCircle,
  Calendar,
  Layers,
  ChevronRight,
  Edit3,
  Save,
  Users as UsersIcon,
} from "lucide-react";

/* ── helper: parse "5 days" → number ──────────────────────────────────────── */
function parseDurationDays(dur: string): number {
  const m = dur.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
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

export default function CourseManagementPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Local editable course list (in-memory)
  const [coursesList, setCoursesList] = useState<Course[]>(INITIAL_COURSES);

  // Category filter only (search bar removed per Req #1)
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Selected Course for Details Modal
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Edit mode state inside details modal
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<{ title: string; description: string; duration: string; price: string }>({ title: "", description: "", duration: "", price: "" });

  // Assign Course Modal State (Select Seafarer removed per Req #4)
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [targetCourseTitle, setTargetCourseTitle] = useState("");
  const [targetInstituteId, setTargetInstituteId] = useState("");
  const [assignedDate, setAssignedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [assignSuccessMessage, setAssignSuccessMessage] = useState("");

  // Category List for filter chips
  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(coursesList.map((c) => c.category)))];
  }, [coursesList]);

  // Filtered Course Catalog (no search, only category filter)
  const filteredCourses = useMemo(() => {
    return coursesList.filter((course) => {
      return selectedCategory === "All" || course.category === selectedCategory;
    });
  }, [coursesList, selectedCategory]);

  // Helper to retrieve institutes offering a course
  const getCourseInstitutes = (courseTitle: string) => {
    const instIds = COURSE_INSTITUTES_MAP[courseTitle] || ["inst_1"];
    const pricingMap = COURSE_INSTITUTE_PRICING[courseTitle] || {};

    return instIds.map((id) => {
      const institute = MOCK_INSTITUTES.find((i) => i.id === id) || {
        id,
        name: "Maritime Training Institute",
        location: "Mumbai, India",
        rating: 4.8,
      };
      const pricing = pricingMap[id] || { price: "₹5,000", seats: 20, nextBatch: "Upcoming" };

      return {
        ...institute,
        price: pricing.price,
        seats: pricing.seats,
        nextBatch: pricing.nextBatch,
      };
    });
  };

  // Handle Assign Course Submission (no seafarer required)
  const handleAssignCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCourseTitle) return;

    setAssignSuccessMessage(
      `Course "${targetCourseTitle}" assignment submitted successfully.`
    );

    setTimeout(() => {
      setShowAssignModal(false);
      setTargetCourseTitle("");
      setTargetInstituteId("");
      setAssignSuccessMessage("");
    }, 1500);
  };

  // Open Assign Modal with preselected course
  const handleQuickAssign = (course: Course, instId?: string) => {
    setTargetCourseTitle(course.title);
    if (instId) setTargetInstituteId(instId);
    setSelectedCourse(null);
    setIsEditing(false);
    setShowAssignModal(true);
  };

  // Start editing
  const startEditing = () => {
    if (!selectedCourse) return;
    setEditForm({
      title: selectedCourse.title,
      description: selectedCourse.description || "",
      duration: selectedCourse.duration,
      price: selectedCourse.price,
    });
    setIsEditing(true);
  };

  // Save edit
  const saveEdit = () => {
    if (!selectedCourse) return;
    const updated: Course = {
      ...selectedCourse,
      title: editForm.title,
      description: editForm.description,
      duration: editForm.duration,
      price: editForm.price,
    };
    setCoursesList((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setSelectedCourse(updated);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Course Management</h1>
          <p className="text-xs opacity-60 mt-1">
            Browse available DG Shipping accredited courses, per-institute pricing, and assign training to crew.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAssignModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/20 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Assign Course</span>
          </button>
        </div>
      </div>

      {/* Category Filter Toolbar (search bar removed) */}
      <div
        className={`p-4 rounded-2xl border flex items-center gap-4 ${
          isDark ? "bg-[#0B1528]/80 border-white/5" : "bg-white border-slate-200 shadow-sm"
        }`}
      >
        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-sky-500 text-white shadow-sm shadow-sky-500/30"
                  : isDark
                  ? "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Count Summary */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-medium opacity-60">
          Showing {filteredCourses.length} {filteredCourses.length === 1 ? "course" : "courses"} in Course Catalog
        </span>
      </div>

      {/* Course Catalog Grid (Cards) */}
      {filteredCourses.length === 0 ? (
        <div
          className={`p-12 text-center rounded-2xl border ${
            isDark ? "bg-[#0B1528]/40 border-white/5" : "bg-slate-50 border-slate-200"
          }`}
        >
          <BookOpen className="w-12 h-12 mx-auto opacity-20 mb-3" />
          <p className="text-sm font-semibold">No courses match your criteria</p>
          <p className="text-xs opacity-50 mt-1">Try adjusting your selected category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((course) => {
            const institutes = getCourseInstitutes(course.title);
            const prices = institutes.map((i) => parseInt(i.price.replace(/[^\d]/g, "")) || 0).filter((p) => p > 0);
            const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
            const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
            const priceDisplay =
              prices.length > 1 && minPrice !== maxPrice
                ? `₹${minPrice.toLocaleString("en-IN")} – ₹${maxPrice.toLocaleString("en-IN")}`
                : course.price;

            return (
              <div
                key={course.id}
                onClick={() => { setSelectedCourse(course); setIsEditing(false); }}
                className={`group relative rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col justify-between ${
                  isDark
                    ? "bg-[#0B1528] border-white/5 hover:border-sky-500/40 hover:shadow-sky-500/5"
                    : "bg-white border-slate-200 hover:border-sky-300 hover:shadow-slate-200"
                }`}
              >
                <div>
                  {/* Category & Status Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wide uppercase bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      <Layers className="w-3 h-3" />
                      {course.category}
                    </span>
                    {course.code && (
                      <span className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded ${
                        isDark ? "bg-white/5 text-slate-400" : "bg-slate-100 text-slate-600"
                      }`}>
                        {course.code}
                      </span>
                    )}
                  </div>

                  {/* Course Title */}
                  <h3 className="text-base font-bold leading-snug group-hover:text-sky-400 transition-colors">
                    {course.title}
                  </h3>

                  {/* Short Description */}
                  <p className="text-xs opacity-60 mt-2 line-clamp-2 leading-relaxed">
                    {course.description || "Comprehensive DG Shipping approved marine training module."}
                  </p>

                  {/* Key Metadata Badges — instructor removed per Req #3 */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/5 text-xs">
                    <div className="flex items-center gap-1.5 opacity-75">
                      <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-75">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                      <span>{course.rating} Rating</span>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-75">
                      <Building2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>{institutes.length} Institutes</span>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-75">
                      <UsersIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{course.enrolled} Enrolled</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer with Pricing & View Button */}
                <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-semibold opacity-40 block">Course Fee</span>
                    <span className="text-sm font-bold text-emerald-500">{priceDisplay}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCourse(course);
                      setIsEditing(false);
                    }}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isDark
                        ? "bg-white/5 group-hover:bg-sky-500 group-hover:text-white text-slate-300"
                        : "bg-slate-100 group-hover:bg-sky-500 group-hover:text-white text-slate-700"
                    }`}
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* COURSE DETAILS MODAL (WITH EDIT, BATCH DETAILS)                            */}
      {/* ========================================================================= */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div
            className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl flex flex-col ${
              isDark ? "bg-[#0B1528] border-white/10 text-white" : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-white/5 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    {selectedCourse.category}
                  </span>
                  {selectedCourse.code && (
                    <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                      isDark ? "bg-white/5 text-slate-400" : "bg-slate-100 text-slate-600"
                    }`}>
                      {selectedCourse.code}
                    </span>
                  )}
                </div>
                {isEditing ? (
                  <input
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className={`text-xl font-bold w-full bg-transparent border-b outline-none pb-1 ${isDark ? "border-white/20 focus:border-sky-400" : "border-slate-300 focus:border-sky-500"}`}
                  />
                ) : (
                  <h2 className="text-xl font-bold">{selectedCourse.title}</h2>
                )}
                <p className="text-xs opacity-60 mt-1">Duration: {isEditing ? editForm.duration : selectedCourse.duration}</p>
              </div>

              <div className="flex items-center gap-2">
                {!isEditing && (
                  <button
                    onClick={startEditing}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                )}
                <button
                  onClick={() => { setSelectedCourse(null); setIsEditing(false); }}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    isDark ? "border-white/10 hover:bg-white/5 text-slate-300" : "border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-2">Course Overview</h4>
                {isEditing ? (
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={3}
                    className={`w-full text-xs leading-relaxed p-2.5 rounded-xl border outline-none resize-none ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                  />
                ) : (
                  <p className="text-xs leading-relaxed opacity-80">
                    {selectedCourse.description ||
                      "This certified training course prepares maritime crew for STCW compliance, emergency response, and operational excellence as required by DG Shipping regulations."}
                  </p>
                )}
              </div>

              {/* Edit: Duration & Price */}
              {isEditing && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase opacity-60 block mb-1.5">Duration</label>
                    <input
                      value={editForm.duration}
                      onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                      className={`w-full p-2.5 rounded-xl border outline-none text-xs ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase opacity-60 block mb-1.5">Price</label>
                    <input
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      className={`w-full p-2.5 rounded-xl border outline-none text-xs ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                    />
                  </div>
                </div>
              )}

              {/* Batch Details per Institute — Req #5 */}
              {!isEditing && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-3 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-sky-400" />
                    Batch Details
                  </h4>
                  <div className="space-y-2">
                    {getCourseInstitutes(selectedCourse.title).map((inst) => {
                      const durationDays = parseDurationDays(selectedCourse.duration);
                      const startDate = new Date(inst.nextBatch);
                      const validStart = !isNaN(startDate.getTime());
                      const endDate = validStart ? addDays(startDate, durationDays) : null;

                      return (
                        <div
                          key={inst.id}
                          className={`p-3 rounded-xl border grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs ${
                            isDark ? "bg-white/[0.02] border-white/5" : "bg-slate-50 border-slate-200"
                          }`}
                        >
                          <div>
                            <span className="text-[10px] uppercase font-semibold opacity-40 block">Start Date</span>
                            <span className="font-bold">{validStart ? fmtDate(startDate) : inst.nextBatch}</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-semibold opacity-40 block">End Date</span>
                            <span className="font-bold">{endDate ? fmtDate(endDate) : "—"}</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-semibold opacity-40 block">Duration</span>
                            <span className="font-bold">{selectedCourse.duration}</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-semibold opacity-40 block">Batch Capacity</span>
                            <span className="font-bold">{inst.seats} seats</span>
                          </div>
                          <div className="col-span-2 sm:col-span-4">
                            <span className={`text-[10px] opacity-50`}>{inst.name}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Institutes & Per-Institute Pricing Section */}
              {!isEditing && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider opacity-60 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-purple-400" />
                      AVAILABLE INSTITUTES & PRICE ({getCourseInstitutes(selectedCourse.title).length})
                    </h4>
                    <span className="text-[11px] text-sky-400 font-medium">Prices vary by institute</span>
                  </div>

                  <div className="space-y-3">
                    {getCourseInstitutes(selectedCourse.title).map((inst) => (
                      <div
                        key={inst.id}
                        className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isDark ? "bg-white/[0.02] border-white/5 hover:border-white/10" : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold">{inst.name}</span>
                            {inst.rating && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-400">
                                <Star className="w-2.5 h-2.5 fill-amber-400" />
                                {inst.rating}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-[11px] opacity-60">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-rose-400" />
                              {inst.location}
                            </span>
                            <span>•</span>
                            <span>Next Batch: {inst.nextBatch}</span>
                            <span>•</span>
                            <span>{inst.seats} seats left</span>
                          </div>
                        </div>

                        <div className="flex items-center sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                          <div className="text-left sm:text-right">
                            <span className="text-[10px] uppercase font-semibold opacity-40 block">Price</span>
                            <span className="text-sm font-bold text-emerald-400">{inst.price}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className={`p-4 px-6 border-t flex items-center justify-between ${
              isDark ? "border-white/5 bg-white/[0.01]" : "border-slate-100 bg-slate-50"
            }`}>
              <span className="text-xs opacity-50">STCW 2010 Manila Amendments Accredited</span>
              <div className="flex items-center gap-2">
                {isEditing && (
                  <button
                    onClick={saveEdit}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white shadow-md cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save Changes
                  </button>
                )}
                <button
                  onClick={() => { setSelectedCourse(null); setIsEditing(false); }}
                  className={`px-4 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                    isDark ? "border-white/10 hover:bg-white/5 text-slate-300" : "border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {isEditing ? "Cancel" : "Close"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ASSIGN COURSE MODAL (Select Seafarer removed per Req #4)                   */}
      {/* ========================================================================= */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div
            className={`w-full max-w-lg rounded-2xl border shadow-2xl p-6 ${
              isDark ? "bg-[#0B1528] border-white/10 text-white" : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-sky-400" />
                <h3 className="text-base font-bold">Assign Course</h3>
              </div>
              <button
                onClick={() => setShowAssignModal(false)}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isDark ? "border-white/10 hover:bg-white/5 text-slate-300" : "border-slate-200 hover:bg-slate-100"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {assignSuccessMessage ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <p className="text-sm font-bold text-emerald-400">{assignSuccessMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleAssignCourse} className="space-y-4 pt-4 text-xs">
                {/* Select Course */}
                <div>
                  <label className="font-semibold block mb-1.5 opacity-80">Select Course *</label>
                  <select
                    required
                    value={targetCourseTitle}
                    onChange={(e) => setTargetCourseTitle(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border outline-none ${
                      isDark ? "bg-white/5 border-white/10 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                  >
                    <option value="" disabled className={isDark ? "bg-[#0B1528]" : "bg-white"}>
                      Choose a Course...
                    </option>
                    {coursesList.map((c) => (
                      <option key={c.id} value={c.title} className={isDark ? "bg-[#0B1528]" : "bg-white"}>
                        {c.title} ({c.duration})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Select Institute */}
                <div>
                  <label className="font-semibold block mb-1.5 opacity-80">Preferred Training Institute</label>
                  <select
                    value={targetInstituteId}
                    onChange={(e) => setTargetInstituteId(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border outline-none ${
                      isDark ? "bg-white/5 border-white/10 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                  >
                    <option value="" className={isDark ? "bg-[#0B1528]" : "bg-white"}>
                      Any Accredited Institute (Best Availability)
                    </option>
                    {MOCK_INSTITUTES.map((inst) => (
                      <option key={inst.id} value={inst.id} className={isDark ? "bg-[#0B1528]" : "bg-white"}>
                        {inst.name} ({inst.location})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assignment Date */}
                <div>
                  <label className="font-semibold block mb-1.5 opacity-80">Target Start Date</label>
                  <input
                    type="date"
                    value={assignedDate}
                    onChange={(e) => setAssignedDate(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border outline-none ${
                      isDark ? "bg-white/5 border-white/10 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setShowAssignModal(false)}
                    className={`px-4 py-2 rounded-xl border font-medium cursor-pointer ${
                      isDark ? "border-white/10 hover:bg-white/5 text-slate-300" : "border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl font-medium bg-sky-500 hover:bg-sky-600 text-white shadow-md shadow-sky-500/20 cursor-pointer"
                  >
                    Confirm Assignment
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
