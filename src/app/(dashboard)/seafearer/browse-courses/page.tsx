"use client";

import React, { useEffect, useState } from "react";
import { courseService } from "@/services/course.service";
import { useTheme } from "@/providers/theme-provider";
import { 
  Compass, 
  GraduationCap, 
  Search, 
  Check, 
  Clock, 
  Award, 
  Star, 
  ListFilter, 
  AlertCircle,
  Tag,
  BookOpen,
  ArrowRight,
  TrendingUp,
  X
} from "lucide-react";
import Link from "next/link";

export default function BrowseCoursesPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [courses, setCourses] = useState<any[]>([]);
  const [myEnrollments, setMyEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [detailCourseId, setDetailCourseId] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const loadData = async () => {
    try {
      const courseList = await courseService.getAllCourses();
      setCourses(courseList);
      
      const enrollList = await courseService.getMyEnrollments();
      setMyEnrollments(enrollList);
    } catch (err) {
      console.error("Failed to load course list details: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEnroll = async (courseId: string) => {
    setBookingLoading(true);
    try {
      await courseService.enrollInCourse(courseId);
      alert("Booking request submitted! Your course has been added to My Courses.");
      setDetailCourseId(null);
      await loadData();
    } catch (err: any) {
      alert(err.message || "Failed to book course. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="flex gap-4">
          <div className="flex-1 h-12 rounded-xl bg-gray-800" />
          <div className="w-48 h-12 rounded-xl bg-gray-800" />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`h-64 rounded-2xl ${isDark ? "bg-[#0A192F]" : "bg-slate-100"}`} />
          ))}
        </div>
      </div>
    );
  }

  // Filter Categories
  const categories = [
    { value: "all", label: "All Curriculums" },
    { value: "basic", label: "Basic Safety" },
    { value: "advanced", label: "Advanced SIMs" },
  ];

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const activeDetailCourse = courses.find((c) => c.id === detailCourseId);
  const isEnrolled = (courseId: string) => myEnrollments.some((e) => e.courseId === courseId);

  return (
    <div className="space-y-8 animate-fadeIn relative pb-10">
      
      {/* Background Decorative Glow */}
      {isDark && (
        <div className="absolute top-[200px] left-[50%] w-[400px] h-[400px] rounded-full bg-cyan-600/5 blur-[150px] pointer-events-none -z-10" />
      )}

      {/* Page Title */}
      <div className="flex flex-col gap-1">
        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit ${
          isDark ? "bg-cyan-500/10 text-cyan-400" : "bg-blue-50 text-[#3b71cb]"
        }`}>
          📖 DGS Approved Training
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight mt-1.5">
          Maritime Courses Curriculum
        </h1>
        <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Book certified basic training and advanced simulators directly linked with your seafarer profile.
        </p>
      </div>

      {/* Search & Category Filter Section */}
      <section className="flex flex-col md:flex-row items-center gap-4 border-b border-slate-800/20 pb-5">
        {/* Search Input */}
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-3.5 w-4.5 h-4.5 text-slate-500 transition-colors group-focus-within:text-cyan-400" />
          <input
            type="text"
            placeholder="Search DGS course name or codes (e.g. BST, STSDSD)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-11 pr-4 py-3 text-xs rounded-xl border outline-none transition-all ${
              isDark
                ? "bg-[#09162c] border-slate-800/80 text-white placeholder-slate-500 focus:border-cyan-500"
                : "bg-white border-slate-200 text-slate-850 placeholder-slate-400 focus:border-[#3b71cb]"
            }`}
          />
        </div>

        {/* Category Selector */}
        <div className="flex gap-2.5 w-full md:w-auto overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-5 py-3 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer hover:scale-[1.01] active:scale-95 ${
                selectedCategory === cat.value
                  ? isDark
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/10"
                    : "bg-[#3b71cb] text-white shadow-md"
                  : isDark
                  ? "bg-[#09162c] border border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-700"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Detail Drawer Modal Backdrop */}
      {detailCourseId && activeDetailCourse && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fadeIn"
            onClick={() => setDetailCourseId(null)}
          />
          <div
            className={`fixed inset-y-0 right-0 z-50 w-full max-w-md border-l shadow-2xl p-8 overflow-y-auto animate-slideIn ${
              isDark 
                ? "bg-gradient-to-b from-[#09162c] to-[#040c1a] border-slate-800 text-white" 
                : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                  isDark ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "bg-blue-50 text-[#3b71cb] border border-blue-100"
                }`}>
                  {activeDetailCourse.code}
                </span>
                <h2 className="text-xl font-extrabold tracking-tight mt-3">
                  {activeDetailCourse.name}
                </h2>
              </div>
              <button
                onClick={() => setDetailCourseId(null)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center border font-bold text-sm cursor-pointer hover:scale-105 active:scale-95 ${
                  isDark 
                    ? "border-slate-800 hover:bg-slate-900 text-white" 
                    : "border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Rating */}
              <div className="flex items-center gap-1.5">
                <div className="flex text-yellow-400 text-xs">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 fill-yellow-450 text-yellow-450" />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-400">
                  {activeDetailCourse.rating} ({activeDetailCourse.ratingCount} reviews)
                </span>
              </div>

              {/* Course Specs Grid */}
              <div className={`p-4 rounded-xl border grid grid-cols-2 gap-4 ${
                isDark ? "bg-[#0b182d] border-slate-800" : "bg-slate-50 border-slate-200"
              }`}>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Duration</span>
                  <span className="text-sm font-black">{activeDetailCourse.duration}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Course Fees</span>
                  <span className="text-sm font-black text-emerald-400">{activeDetailCourse.fees}</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <BookOpen className="w-4.5 h-4.5 text-cyan-400" /> Prerequisite Description
                </h4>
                <p className={`text-xs leading-relaxed ${isDark ? "text-slate-350" : "text-slate-600"}`}>
                  {activeDetailCourse.description}
                </p>
              </div>

              {/* Required Documents Checklist */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Tag className="w-4.5 h-4.5 text-indigo-400" /> Required Documents for verification
                </h4>
                <div className="space-y-2.5">
                  {(activeDetailCourse.documentsRequired || "").split(",").map((doc: string, idx: number) => (
                    <div key={idx} className={`flex items-center gap-2.5 text-xs p-2.5 rounded-xl border ${
                      isDark ? "bg-slate-900/40 border-slate-800 text-slate-300" : "bg-slate-50/50 border-slate-200 text-slate-700"
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isDark ? "bg-cyan-400 animate-pulse" : "bg-[#3b71cb]"}`} />
                      <span>{doc.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Checkout / Booking Action */}
              <div className="pt-6 border-t border-slate-800/40">
                {isEnrolled(activeDetailCourse.id) ? (
                  <div className="text-center p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 font-extrabold text-xs flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" /> Already Enrolled in Course
                  </div>
                ) : (
                  <button
                    onClick={() => handleEnroll(activeDetailCourse.id)}
                    disabled={bookingLoading}
                    className={`w-full py-4 rounded-xl font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 ${
                      isDark 
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-white" 
                        : "bg-[#3b71cb] hover:bg-[#2c5fb3] text-white"
                    }`}
                  >
                    {bookingLoading ? (
                      <div className="w-4.5 h-4.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Book Training Seat <GraduationCap className="w-4.5 h-4.5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Courses List Grid */}
      {filteredCourses.length === 0 ? (
        <div className={`text-center py-20 border border-dashed rounded-3xl flex flex-col items-center justify-center p-6 ${
          isDark ? "border-slate-800 bg-slate-900/10" : "border-slate-200 bg-slate-50/50"
        }`}>
          <AlertCircle className="w-10 h-10 text-slate-500 mb-3" />
          <h3 className="font-extrabold text-sm mb-1">No courses matched your query</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            Try adjusting your search keywords or checking other curriculum category filters.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const enrolled = isEnrolled(course.id);
            return (
              <div
                key={course.id}
                onClick={() => setDetailCourseId(course.id)}
                className={`rounded-3xl p-5 border shadow-lg flex flex-col justify-between cursor-pointer group hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 relative overflow-hidden ${
                  isDark
                    ? "bg-gradient-to-b from-[#09162c] to-[#040c1a] border-slate-800/80 text-white hover:border-cyan-500/20"
                    : "bg-white border-slate-200 hover:border-[#3b71cb]/30 text-slate-900"
                }`}
              >
                <div className="space-y-4">
                  {/* Category Ribbon */}
                  <div className="flex justify-between items-start gap-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                      isDark ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "bg-blue-50 text-[#3b71cb] border border-blue-100"
                    }`}>
                      {course.code}
                    </span>
                    <div className="text-2xl group-hover:scale-110 transition-transform">{course.icon}</div>
                  </div>

                  <h3 className="font-extrabold text-base leading-snug group-hover:text-cyan-400 transition-colors truncate max-w-[240px]" title={course.name}>
                    {course.name}
                  </h3>

                  <p className={`text-xs line-clamp-2 leading-relaxed ${isDark ? "text-slate-400" : "text-slate-550"}`}>
                    {course.description}
                  </p>

                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-bold">{course.rating}</span>
                    <span className="text-[10px] text-slate-400">({course.ratingCount} reviews)</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/40 flex justify-between items-center">
                  <div>
                    <span className="text-[8px] text-slate-400 uppercase font-semibold block">Course Fee</span>
                    <span className="text-xs font-black text-emerald-400">{course.fees}</span>
                  </div>
                  {enrolled ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-500 bg-green-500/10 px-2.5 py-1.5 rounded-xl border border-green-500/20">
                      <Check className="w-3 h-3 stroke-[3px]" /> Enrolled
                    </span>
                  ) : (
                    <span className={`px-4 py-2 rounded-xl font-bold text-[10px] uppercase shadow-sm transition-all duration-300 inline-flex items-center gap-1 group-hover:translate-x-0.5 ${
                      isDark 
                        ? "bg-slate-900 border border-slate-850 group-hover:bg-cyan-600 group-hover:border-cyan-600" 
                        : "bg-slate-100 border border-slate-200 group-hover:bg-[#3b71cb] group-hover:text-white"
                    }`}>
                      Check details <ArrowRight className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
