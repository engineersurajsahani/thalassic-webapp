"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/providers/theme-provider";
import { courseData } from "@/constants/courseData";
import { Search, Filter, BookOpen, Clock, Award, SlidersHorizontal, ArrowUpDown } from "lucide-react";

// --- SCROLL REVEAL COMPONENT ---
function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    const current = ref.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 transform will-change-transform ${isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-12 scale-[0.98]"
        }`}
      style={{
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)"
      }}
    >
      {children}
    </div>
  );
}

export default function CourseCatalogPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // State Management
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "duration">("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Available unique levels for filters
  const uniqueLevels = useMemo(() => {
    const levels = courseData.map((c) => c.level);
    return Array.from(new Set(levels));
  }, []);

  // Category labels helper
  const categoryLabels = {
    basic: "Basic Courses",
    advanced: "Advanced Courses",
    refresher: "Refresher Courses",
    additional: "Additional Courses",
  };

  // Helper to convert price string "₹15,000" to number 15000
  const parsePrice = (priceStr: string): number => {
    return parseInt(priceStr.replace(/[^0-9]/g, ""), 10) || 0;
  };

  // Helper to parse duration string "12 Days" to number 12
  const parseDuration = (durStr: string): number => {
    return parseInt(durStr.split(" ")[0], 10) || 0;
  };

  // Filter and Sort Logic
  const filteredCourses = useMemo(() => {
    return courseData
      .filter((course) => {
        // Search filter (name, code, description)
        const matchSearch =
          course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description.toLowerCase().includes(searchQuery.toLowerCase());

        // Category filter
        const matchCategory =
          selectedCategories.length === 0 || selectedCategories.includes(course.category);

        // Level filter
        const matchLevel =
          selectedLevels.length === 0 || selectedLevels.includes(course.level);

        return matchSearch && matchCategory && matchLevel;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") {
          return parsePrice(a.fees) - parsePrice(b.fees);
        }
        if (sortBy === "price-desc") {
          return parsePrice(b.fees) - parsePrice(a.fees);
        }
        if (sortBy === "duration") {
          return parseDuration(a.duration) - parseDuration(b.duration);
        }
        return (b.rating || 0) - (a.rating || 0);
      });
  }, [searchQuery, selectedCategories, selectedLevels, sortBy]);

  // Handler for category filter toggle
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  // Handler for level filter toggle
  const handleLevelToggle = (level: string) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedLevels([]);
    setSearchQuery("");
  };

  return (
    <div className={`min-h-screen font-outfit transition-colors duration-500 ${isDark ? "bg-[#050a14] text-slate-100" : "bg-white text-slate-900"
      }`}>

      {/* ================= HERO ================= */}
      <section className={`relative pt-[88px] md:pt-[96px] pb-8 border-b ${isDark ? "bg-[#050a14] border-slate-900" : "bg-white border-slate-200"
        }`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <ScrollReveal>
            {/* Breadcrumb */}
            <div className="flex items-center text-xs text-slate-500 mb-4 font-black uppercase tracking-widest">
              <Link href="/" className="hover:text-blue-500 transition">Home</Link>
              <span className="mx-2 text-slate-600">/</span>
              <span className="text-blue-400 font-bold">Courses</span>
            </div>

            {/* Heading */}
            <h1 className={`text-4xl md:text-5xl font-black mb-3 bg-clip-text text-transparent bg-gradient-to-r ${isDark ? "from-white via-slate-100 to-slate-350" : "from-slate-900 via-blue-950 to-slate-800"
              }`}>
              Professional Maritime Courses
            </h1>

            <p className={`max-w-3xl text-sm leading-relaxed font-light ${isDark ? "text-slate-400" : "text-slate-650"
              }`}>
              Learn industry-recognized maritime skills with DGS-approved certifications, simulator training, safety programs and refresher courses taught by experienced instructors.
            </p>

            {/* Search */}
            <div className="mt-8 relative max-w-3xl">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search courses, certifications or course code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-14 pr-5 py-4 rounded-2xl border text-sm transition-all shadow-lg font-medium focus:outline-none focus:ring-1 focus:ring-blue-500/20 ${isDark
                    ? "bg-[#0a1122]/70 border-slate-800 text-white placeholder:text-slate-600 focus:border-blue-500/55"
                    : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500"
                  }`}
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2.5 mt-6">
              {Object.entries(categoryLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => handleCategoryToggle(key)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${selectedCategories.includes(key)
                      ? "bg-gradient-to-r from-blue-600 to-slate-600 text-white border-blue-500/20 shadow-md"
                      : isDark
                        ? "bg-[#0a1122]/70 border-slate-800 hover:border-slate-700 text-slate-400"
                        : "bg-slate-100 hover:bg-slate-200 border-transparent text-slate-600"
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="flex gap-10 mt-10 pt-6 border-t border-slate-800/10 dark:border-slate-800/50">
              {[
                { value: filteredCourses.length, label: "Courses" },
                { value: "100%", label: "Certified" },
                { value: "4.8★", label: "Average Rating" }
              ].map((stat, i) => (
                <div key={i}>
                  <div className={`text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r ${isDark ? "from-blue-400 to-slate-400" : "from-blue-600 to-indigo-650"
                    }`}>
                    {stat.value}
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-4 gap-8">

          {/* Left Panel: Desktop Filter Panel */}
          <aside className="hidden lg:block space-y-7 h-fit sticky top-28">
            <ScrollReveal>
              <div className={`p-6 border rounded-3xl space-y-6 ${isDark ? "bg-[#0a1122]/70 border-slate-800" : "bg-white border-slate-200 shadow-sm"
                }`}>
                <div className="flex justify-between items-center pb-4 border-b border-slate-800/10 dark:border-slate-800/60">
                  <h3 className="font-black text-xs uppercase tracking-widest flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-blue-400" />
                    Filters
                  </h3>
                  {(selectedCategories.length > 0 || selectedLevels.length > 0 || searchQuery !== "") && (
                    <button
                      onClick={handleClearFilters}
                      className="text-[10px] text-blue-400 hover:text-blue-300 font-black uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Category Filter Group */}
                <div className="space-y-3.5">
                  <h4 className="font-black text-[10px] uppercase tracking-widest text-slate-500">
                    Course Category
                  </h4>
                  <div className="space-y-2.5">
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <label key={key} className="flex items-center gap-2.5 text-xs font-semibold cursor-pointer select-none group text-slate-400 hover:text-slate-200">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(key)}
                          onChange={() => handleCategoryToggle(key)}
                          className="rounded border-slate-350 dark:border-slate-800 text-blue-600 focus:ring-blue-500/20 w-4 h-4 cursor-pointer"
                        />
                        <span className={`transition-colors text-xs font-medium ${selectedCategories.includes(key) ? "text-blue-400 font-black" : ""
                          }`}>
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Level Filter Group */}
                <div className="space-y-3.5 pt-5 border-t border-slate-800/10 dark:border-slate-800/60">
                  <h4 className="font-black text-[10px] uppercase tracking-widest text-slate-500">
                    Difficulty Level
                  </h4>
                  <div className="space-y-2.5">
                    {uniqueLevels.map((level) => (
                      <label key={level} className="flex items-center gap-2.5 text-xs font-semibold cursor-pointer select-none group text-slate-400 hover:text-slate-200">
                        <input
                          type="checkbox"
                          checked={selectedLevels.includes(level)}
                          onChange={() => handleLevelToggle(level)}
                          className="rounded border-slate-350 dark:border-slate-800 text-blue-600 focus:ring-blue-500/20 w-4 h-4 cursor-pointer"
                        />
                        <span className={`transition-colors text-xs font-medium ${selectedLevels.includes(level) ? "text-blue-400 font-black" : ""
                          }`}>
                          {level}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </aside>

          {/* Right Panel: Course Grid & Sort Menu */}
          <div className="lg:col-span-3 space-y-6">

            {/* Sort Bar / Status */}
            <ScrollReveal>
              <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-2xl gap-4 ${isDark ? "bg-[#0a1122]/70 border-slate-800" : "bg-white border-slate-200 shadow-sm"
                }`}>
                <div className="text-[10px] font-black tracking-widest uppercase text-slate-400">
                  Showing <span className="text-blue-400 font-black">{filteredCourses.length}</span> Courses
                </div>

                {/* Sorting and Mobile Filters button */}
                <div className="flex items-center gap-3.5 w-full sm:w-auto justify-between sm:justify-end">

                  {/* Mobile Filters Toggle Button */}
                  <button
                    onClick={() => setMobileFiltersOpen(true)}
                    className={`lg:hidden flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${isDark ? "bg-white/5 border-slate-800 hover:bg-white/10" : "bg-slate-55 border-slate-200 hover:bg-slate-100"
                      }`}
                  >
                    <Filter className="w-3.5 h-3.5" /> Filters
                  </button>

                  {/* Sort dropdown */}
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded-xl border focus:outline-none cursor-pointer ${isDark ? "bg-[#050a14] border-slate-850 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-850"
                        }`}
                    >
                      <option value="featured">Popularity</option>
                      <option value="price-asc">Price: Low-High</option>
                      <option value="price-desc">Price: High-Low</option>
                      <option value="duration">Duration</option>
                    </select>
                  </div>

                </div>
              </div>
            </ScrollReveal>

            {/* Empty State */}
            {filteredCourses.length === 0 && (
              <ScrollReveal>
                <div className={`text-center py-20 border border-dashed rounded-3xl ${isDark ? "border-slate-800" : "border-slate-250"
                  }`}>
                  <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-lg font-black mb-2">No Courses Found</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
                    We couldn&apos;t find any courses matching your search query or filter combination.
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              </ScrollReveal>
            )}

            {/* Courses Cards Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {filteredCourses.map((course, idx) => (
                <ScrollReveal key={course.id} delay={(idx % 2) * 150}>
                  <div
                    className={`group border rounded-3xl overflow-hidden transition-all duration-500 flex flex-col justify-between h-full hover:-translate-y-1.5 ${isDark
                        ? "bg-[#0a1122]/70 border-slate-800/80 hover:border-blue-500/20 hover:shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
                        : "bg-white border-slate-200 hover:border-blue-500/20 hover:shadow-md"
                      }`}
                  >
                    <div className="relative w-full h-44 z-0">
                      <Image
                        src={course.image}
                        alt={course.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 350px"
                        priority
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

                      {/* Category tag on image */}
                      <span className={`absolute top-4 left-4 px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest shadow-sm ${course.category === "basic" ? "bg-blue-650 text-white" :
                          course.category === "advanced" ? "bg-indigo-650 text-white" :
                            course.category === "refresher" ? "bg-slate-700 text-white" : "bg-sky-650 text-white"
                        }`}>
                        {course.category}
                      </span>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                            {course.code}
                          </span>
                          <span className={`text-[9px] px-2 py-0.5 border rounded-lg font-black uppercase tracking-wider ${isDark ? "bg-white/5 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-650"
                            }`}>
                            {course.level}
                          </span>
                        </div>
                        <h3 className={`font-black text-base leading-tight transition-colors ${isDark ? "group-hover:text-blue-300" : "group-hover:text-blue-600"
                          }`}>
                          {course.name}
                        </h3>
                        <p className={`text-xs leading-relaxed font-light line-clamp-2 ${isDark ? "text-slate-400" : "text-slate-500"
                          }`}>
                          {course.description}
                        </p>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-slate-800/10 dark:border-slate-800/60">
                        {/* Rating and Duration details */}
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-1">
                            <span className="text-amber-400 font-bold">★ {course.rating?.toFixed(1) || "4.8"}</span>
                            <span className="text-[9px] text-slate-500">({course.ratingCount || "100"}+ reviews)</span>
                          </div>
                          <div className="flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider text-slate-500">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{course.duration}</span>
                          </div>
                        </div>

                        {/* Pricing and Action */}
                        <div className="flex justify-between items-center pt-2">
                          <div>
                            <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">Course Fee</div>
                            <div className={`text-base font-black ${isDark ? "text-blue-300" : "text-blue-600"}`}>
                              {course.fees}
                            </div>
                          </div>
                          <Link
                            href={`/courses/${course.id}`}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white text-xs font-black rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer"
                          >
                            VIEW DETAILS
                          </Link>
                        </div>
                      </div>
                    </div>

                  </div>
                </ScrollReveal>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* Mobile Drawer Filter Panel (Overlayed) */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className={`w-80 max-w-[85vw] h-full p-6 overflow-y-auto space-y-6 flex flex-col justify-between ${isDark ? "bg-[#0a1122]" : "bg-white"
            }`}>
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <h3 className="font-black text-xs uppercase tracking-widest flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-blue-400" />
                  Filters
                </h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="text-[10px] font-black uppercase tracking-wider text-slate-500 hover:text-white"
                >
                  ✕ Close
                </button>
              </div>

              {/* Category Filter Group */}
              <div className="space-y-3.5">
                <h4 className="font-black text-[10px] uppercase tracking-widest text-slate-500">
                  Course Category
                </h4>
                <div className="space-y-2.5">
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2.5 text-xs font-semibold cursor-pointer select-none group text-slate-400">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(key)}
                        onChange={() => handleCategoryToggle(key)}
                        className="rounded border-slate-800 text-blue-600 focus:ring-blue-500 w-4.5 h-4.5 cursor-pointer"
                      />
                      <span className={`transition-colors text-xs font-medium ${selectedCategories.includes(key) ? "text-blue-450 font-black" : ""
                        }`}>
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Level Filter Group */}
              <div className="space-y-3.5 pt-4 border-t border-slate-800">
                <h4 className="font-black text-[10px] uppercase tracking-widest text-slate-500">
                  Difficulty Level
                </h4>
                <div className="space-y-2.5">
                  {uniqueLevels.map((level) => (
                    <label key={level} className="flex items-center gap-2.5 text-xs font-semibold cursor-pointer select-none group text-slate-400">
                      <input
                        type="checkbox"
                        checked={selectedLevels.includes(level)}
                        onChange={() => handleLevelToggle(level)}
                        className="rounded border-slate-800 text-blue-600 focus:ring-blue-500 w-4.5 h-4.5 cursor-pointer"
                      />
                      <span className={`transition-colors text-xs font-medium ${selectedLevels.includes(level) ? "text-blue-405 font-black" : ""
                        }`}>
                        {level}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-850 flex gap-4">
              <button
                onClick={handleClearFilters}
                className={`w-full py-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl border ${isDark ? "bg-white/5 border-slate-800 hover:bg-white/10" : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                  }`}
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-md"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
