"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/providers/theme-provider";
import { fetchAPI } from "@/lib/api";
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Archive, 
  X, 
  Clock, 
  CheckCircle, 
  Eye, 
  AlertCircle 
} from "lucide-react";

// Initial mock courses based on PRD & details page
const initialCourses = [
  { id: "1", code: "BST", name: "Basic Safety Training", category: "basic", duration: "12 Days", fees: "₹12,000", status: "Active", description: "Mandatory safety modules including Personal Survival Techniques and Firefighting." },
  { id: "2", code: "AFF", name: "Advanced Fire Fighting", category: "advanced", duration: "5 Days", fees: "₹7,200", status: "Active", description: "Advanced training in organization and control of fire fighting operations." },
  { id: "3", code: "OCTCO", name: "Oil and Chemical Tanker Cargo Operations", category: "basic", duration: "6 Days", fees: "₹6,000", status: "Active", description: "Basic training for oil and chemical tanker cargo operations." },
  { id: "4", code: "MEDICARE", name: "Medical Care on Board Ships", category: "advanced", duration: "5 Days", fees: "₹25,000", status: "Active", description: "Advanced clinical diagnosis, injection procedures and ship hospital sanitation." },
  { id: "5", code: "RPST", name: "Refresher PST", category: "refresher", duration: "1 Day", fees: "₹3,500", status: "Active", description: "Refresher safety training for Personal Survival Techniques." },
  { id: "6", code: "TASCO", name: "Specialized Training for Oil Tanker Cargo Operations", category: "advanced", duration: "10 Days", fees: "₹15,000", status: "Draft", description: "Management level cargo training for oil tankers." },
];

export default function CoursesPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // State Management
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add Form State
  const [newCourse, setNewCourse] = useState({
    code: "",
    name: "",
    category: "basic",
    duration: "",
    fees: "",
    description: "",
    status: "Active"
  });

  // Fetch Courses list
  const loadCourses = () => {
    setLoading(true);
    fetchAPI('/master/courses')
      .then(res => {
        setCourses(res);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load courses:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadCourses();
  }, []);

  // Filter & Search Logic
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = 
      (course.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.code || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handlers
  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.code || !newCourse.name || !newCourse.fees) {
      alert("Please fill in all required fields!");
      return;
    }
    const payload = {
      ...newCourse,
      fees: newCourse.fees.startsWith("₹") ? newCourse.fees : `₹${newCourse.fees}`
    };

    fetchAPI('/master/courses', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
      .then(() => {
        loadCourses();
        setIsAddModalOpen(false);
        setNewCourse({
          code: "",
          name: "",
          category: "basic",
          duration: "",
          fees: "",
          description: "",
          status: "Active"
        });
      })
      .catch(err => {
        alert("Failed to create course: " + err.message);
      });
  };

  const handleDeleteCourse = (id: string) => {
    if (confirm("Are you sure you want to delete this course module?")) {
      fetchAPI(`/master/courses/${id}`, {
        method: 'DELETE'
      })
        .then(() => {
          loadCourses();
        })
        .catch(err => {
          alert("Failed to delete course: " + err.message);
        });
    }
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "Active" ? "Draft" : "Active";
    fetchAPI(`/master/courses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus })
    })
      .then(() => {
        loadCourses();
      })
      .catch(err => {
        alert("Failed to toggle status: " + err.message);
      });
  };

  // Glassmorphic Style classes
  const glassStyle = isDark
    ? "bg-slate-900/60 border-slate-800/80 backdrop-blur-xl"
    : "bg-white border-slate-200/80 shadow-md shadow-slate-100";

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 border-slate-800/40">
        <div>
          <h1 className={`text-3xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            Course Management
          </h1>
          <p className={`text-xs mt-0.5 font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Create, edit, publish, or remove STCW modular and preparatory courses.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-blue-500/20`}
        >
          <Plus className="w-4.5 h-4.5" /> Add Course
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row gap-4 items-center justify-between ${glassStyle}`}>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search by code or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-11 pr-4 py-2.5 rounded-xl border text-xs font-semibold outline-none transition-all ${
              isDark 
                ? "bg-slate-950/40 border-slate-800 text-white focus:border-cyan-500/50" 
                : "bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500/50"
            }`}
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          {["all", "basic", "advanced", "refresher"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wide transition-all border cursor-pointer ${
                selectedCategory === cat
                  ? isDark
                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                    : "bg-blue-50 border-blue-200 text-blue-600"
                  : isDark
                  ? "bg-transparent border-slate-800 text-slate-400 hover:bg-slate-900/30"
                  : "bg-transparent border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Courses List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div
              key={course.id}
              className={`p-6 rounded-3xl border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${glassStyle}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-lg border font-black uppercase tracking-wider ${
                    course.category === "basic" 
                      ? isDark ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "bg-blue-50 border-blue-100 text-blue-600"
                      : course.category === "advanced"
                      ? isDark ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" : "bg-cyan-50 border-cyan-100 text-cyan-600"
                      : isDark ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-green-50 border-green-100 text-green-600"
                  }`}>
                    {course.category}
                  </span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                    course.status === "Active"
                      ? isDark ? "bg-green-500/15 text-green-400" : "bg-green-50 text-green-600"
                      : isDark ? "bg-yellow-500/15 text-yellow-400" : "bg-yellow-50 text-yellow-600"
                  }`}>
                    {course.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-black text-cyan-400 tracking-wider uppercase">{course.code}</p>
                  <h3 className={`text-base font-black tracking-tight leading-snug line-clamp-1 ${isDark ? "text-white" : "text-slate-800"}`}>
                    {course.name}
                  </h3>
                  <p className={`text-xs mt-2 line-clamp-2 leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    {course.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Cost</span>
                  <span className="text-base font-black text-blue-500">{course.fees}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(course.id, course.status)}
                    title={course.status === "Active" ? "Set to Draft" : "Publish"}
                    className={`p-2 rounded-lg border transition-all ${
                      isDark 
                        ? "border-slate-800 hover:bg-slate-800 hover:text-cyan-400 text-slate-400" 
                        : "border-slate-200 hover:bg-slate-50 hover:text-blue-600 text-slate-500"
                    }`}
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    title="Delete Course"
                    className={`p-2 rounded-lg border transition-all ${
                      isDark 
                        ? "border-slate-850 hover:bg-red-950/20 hover:text-red-400 text-slate-400" 
                        : "border-slate-200 hover:bg-red-50 hover:text-red-600 text-slate-550"
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center space-y-3">
            <AlertCircle className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className={`text-base font-black ${isDark ? "text-white" : "text-slate-800"}`}>No Courses Found</h3>
            <p className="text-xs text-slate-400">Try modifying your category filters or search queries.</p>
          </div>
        )}
      </div>

      {/* Slide-over or Modal for Adding Course */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-3xl border p-6 space-y-5 animate-scaleUp ${
            isDark ? "bg-[#0b1d30] border-gray-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-2xl"
          }`}>
            
            <div className="flex items-center justify-between border-b pb-4 border-slate-800/40">
              <h3 className="text-lg font-black flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" /> Create New Course
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className={`p-1.5 rounded-lg border cursor-pointer hover:bg-slate-800/40 ${isDark ? "border-slate-800" : "border-slate-200"}`}
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleAddCourse} className="space-y-4 text-xs font-bold uppercase tracking-wide">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-400">Course Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BST"
                    value={newCourse.code}
                    onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                    className={`w-full p-3 rounded-xl border font-bold uppercase tracking-wider outline-none ${
                      isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-250 text-slate-850"
                    }`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-400">Category *</label>
                  <select
                    value={newCourse.category}
                    onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                    className={`w-full p-3 rounded-xl border font-bold outline-none cursor-pointer ${
                      isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-250 text-slate-850"
                    }`}
                  >
                    <option value="basic">Basic Modular</option>
                    <option value="advanced">Advanced Simulator</option>
                    <option value="refresher">Refresher Prep</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400">Course Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Basic Safety Training"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                  className={`w-full p-3 rounded-xl border font-bold outline-none ${
                    isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-250 text-slate-850"
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-400">Duration *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 12 Days"
                    value={newCourse.duration}
                    onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                    className={`w-full p-3 rounded-xl border font-bold outline-none ${
                      isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-250 text-slate-850"
                    }`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-400">Enrollment Fee (₹) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 12000"
                    value={newCourse.fees}
                    onChange={(e) => setNewCourse({ ...newCourse, fees: e.target.value })}
                    className={`w-full p-3 rounded-xl border font-bold outline-none ${
                      isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-250 text-slate-850"
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400">Course Description</label>
                <textarea
                  placeholder="Briefly summarize what seafarers learn..."
                  rows={3}
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  className={`w-full p-3 rounded-xl border font-semibold normal-case outline-none resize-none ${
                    isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-250 text-slate-850"
                  }`}
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-800/40">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className={`flex-1 py-3.5 rounded-xl font-bold uppercase cursor-pointer text-center border transition-all ${
                    isDark ? "border-slate-800 hover:bg-slate-800/60" : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-xl font-black uppercase text-center text-white cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-md shadow-blue-500/20"
                >
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
