"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/providers/theme-provider";
import { courseData } from "@/constants/courseData";
import { Course } from "@/types/course";
import { Search, Filter, BookOpen, Clock, Award, SlidersHorizontal, ArrowUpDown } from "lucide-react";

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
        // "featured": sort by rating desc or just keep original
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
    <div className={`min-h-screen font-sans transition-colors duration-500 ${
      isDark ? "bg-[#031525] text-white" : "bg-slate-50 text-slate-900"
    }`}>
      
     {/* ================= HERO ================= */}

<section
  className={`relative pt-6 lg:pt-10 border-b ${
    isDark
      ? "bg-[#041827] border-gray-800"
      : "bg-white border-slate-200"
  }`}
>
  <div className="max-w-7xl mx-auto px-6 py-10">

    {/* Breadcrumb */}

    <div className="flex items-center text-sm text-slate-400 mb-5">

      <Link
        href="/"
        className="hover:text-blue-500 transition"
      >
        Home
      </Link>

      <span className="mx-2">/</span>

      <span className="text-blue-500 font-medium">
        Courses
      </span>

    </div>

    {/* Heading */}

    <h1
      className={`text-4xl font-black mb-3 ${
        isDark ? "text-white" : "text-slate-900"
      }`}
    >
      Professional Maritime Courses
    </h1>

    <p
      className={`max-w-3xl text-base leading-7 ${
        isDark ? "text-slate-400" : "text-slate-600"
      }`}
    >
      Learn industry-recognized maritime skills with
      DGS-approved certifications, simulator training,
      safety programs and refresher courses taught by
      experienced instructors.
    </p>

    {/* Search */}

    <div className="mt-8 relative max-w-3xl">

      <Search
        className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5"
      />

      <input
        type="text"
        placeholder="Search courses, certifications or course code..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={`w-full pl-14 pr-5 py-4 rounded-2xl border text-sm transition-all shadow-lg ${
          isDark
            ? "bg-[#071f33] border-gray-700 text-white placeholder:text-slate-500 focus:border-blue-500"
            : "bg-white border-slate-200 text-slate-900 focus:border-blue-500"
        }`}
      />

    </div>

    {/* Category Pills */}

    <div className="flex flex-wrap gap-3 mt-7">

      {Object.entries(categoryLabels).map(([key, label]) => (

        <button
          key={key}
          onClick={() => handleCategoryToggle(key)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            selectedCategories.includes(key)
              ? "bg-blue-600 text-white"
              : isDark
              ? "bg-[#0A2338] border border-gray-700 hover:border-blue-500"
              : "bg-slate-100 hover:bg-slate-200"
          }`}
        >
          {label}
        </button>

      ))}

    </div>

    {/* Stats */}

    <div className="flex gap-8 mt-8">

      <div>

        <div className="text-3xl font-black text-blue-500">
          {filteredCourses.length}
        </div>

        <div className="text-sm text-slate-400">
          Courses
        </div>

      </div>

      <div>

        <div className="text-3xl font-black text-blue-500">
          100%
        </div>

        <div className="text-sm text-slate-400">
          Certified
        </div>

      </div>

      <div>

        <div className="text-3xl font-black text-blue-500">
          4.8★
        </div>

        <div className="text-sm text-slate-400">
          Average Rating
        </div>

      </div>

    </div>

  </div>
</section>

      {/* Main Catalog Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-4 gap-8">

          {/* Left Panel: Desktop Filter Panel */}
          <aside className="hidden lg:block space-y-7 h-fit sticky top-24">
            
            {/* Filter Panel Card */}
            <div className={`p-6 border rounded-2xl space-y-6 ${
              isDark ? "bg-[#071f33] border-gray-800" : "bg-white border-slate-200 shadow-sm"
            }`}>
              
              <div className="flex justify-between items-center pb-4 border-b border-gray-800/10 dark:border-gray-800/60">
                <h3 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
                  <SlidersHorizontal className="w-4.5 h-4.5 text-blue-500" />
                  Filters
                </h3>
                {(selectedCategories.length > 0 || selectedLevels.length > 0 || searchQuery !== "") && (
                  <button
                    onClick={handleClearFilters}
                    className="text-xs text-blue-500 hover:text-blue-400 font-bold tracking-wide transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Category Filter Group */}
              <div className="space-y-3.5">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">
                  Course Category
                </h4>
                <div className="space-y-2">
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2.5 text-xs font-semibold cursor-pointer select-none group">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(key)}
                        onChange={() => handleCategoryToggle(key)}
                        className="rounded border-slate-350 dark:border-gray-700 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      />
                      <span className={`transition-colors group-hover:text-blue-500 ${
                        selectedCategories.includes(key) ? "text-blue-500 dark:text-blue-400 font-bold" : ""
                      }`}>
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Level Filter Group */}
              <div className="space-y-3.5 pt-4 border-t border-gray-800/10 dark:border-gray-800/60">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">
                  Difficulty Level
                </h4>
                <div className="space-y-2">
                  {uniqueLevels.map((level) => (
                    <label key={level} className="flex items-center gap-2.5 text-xs font-semibold cursor-pointer select-none group">
                      <input
                        type="checkbox"
                        checked={selectedLevels.includes(level)}
                        onChange={() => handleLevelToggle(level)}
                        className="rounded border-slate-350 dark:border-gray-700 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      />
                      <span className={`transition-colors group-hover:text-blue-500 ${
                        selectedLevels.includes(level) ? "text-blue-500 dark:text-blue-400 font-bold" : ""
                      }`}>
                        {level}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </aside>

          {/* Right Panel: Course Grid & Sort Menu */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Sort Bar / Status */}
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-2xl gap-4 ${
              isDark ? "bg-[#071f33] border-gray-800" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <div className="text-xs font-bold tracking-wide uppercase">
                Showing <span className="text-blue-500 dark:text-blue-400">{filteredCourses.length}</span> Courses
              </div>

              {/* Sorting and Mobile Filters button */}
              <div className="flex items-center gap-3.5 w-full sm:w-auto justify-between sm:justify-end">
                
                {/* Mobile Filters Toggle Button */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className={`lg:hidden flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isDark ? "bg-white/5 border-gray-800 hover:bg-white/10" : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <Filter className="w-4 h-4" /> Filters
                </button>

                {/* Sort dropdown */}
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-slate-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl border focus:outline-none cursor-pointer ${
                      isDark ? "bg-[#031525] border-gray-800 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  >
                    <option value="featured">Sort by: Popularity</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="duration">Duration: Shortest</option>
                  </select>
                </div>

              </div>
            </div>

            {/* Empty State */}
            {filteredCourses.length === 0 && (
              <div className={`text-center py-20 border border-dashed rounded-3xl ${
                isDark ? "border-gray-800" : "border-slate-250"
              }`}>
                <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-black mb-2">No Courses Found</h3>
                <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6">
                  We couldn't find any courses matching your search query or filter combination.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Courses Cards Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className={`group border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between ${
                    isDark 
                      ? "bg-[#071f33] border-gray-800/80 hover:border-blue-500/40 hover:shadow-[0_0_20px_rgba(59,113,203,0.08)]" 
                      : "bg-white border-slate-200 hover:border-blue-500/40 hover:shadow-md"
                  }`}
                >
                  <div className="relative w-full h-44 z-0">
                    <Image
                      src={course.image}
                      alt={course.name}
                      fill
                      sizes="(max-w-768px) 100vw, 350px"
                      priority
                      className="object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                    
                    {/* Category tag on image */}
                    <span className={`absolute top-4 left-4 px-2.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide shadow-sm ${
                      course.category === "basic" ? "bg-cyan-500 text-white" :
                      course.category === "advanced" ? "bg-blue-600 text-white" :
                      course.category === "refresher" ? "bg-green-600 text-white" : "bg-amber-600 text-white"
                    }`}>
                      {course.category}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest">
                          {course.code}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 border rounded-lg font-bold ${
                          isDark ? "bg-white/5 border-gray-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-600"
                        }`}>
                          {course.level}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-base leading-tight group-hover:text-blue-500 transition-colors">
                        {course.name}
                      </h3>
                      <p className={`text-xs line-clamp-2 leading-relaxed ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}>
                        {course.description}
                      </p>
                    </div>

                    <div className="space-y-4 pt-3 border-t border-gray-800/10 dark:border-gray-800/60">
                      {/* Rating and Duration details */}
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500 font-bold">★ {course.rating?.toFixed(1) || "4.8"}</span>
                          <span className="text-[10px] text-slate-400">({course.ratingCount || "100"}+ reviews)</span>
                        </div>
                        <div className="flex items-center gap-1 font-semibold text-slate-500 dark:text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{course.duration}</span>
                        </div>
                      </div>

                      {/* Pricing and Action */}
                      <div className="flex justify-between items-center pt-1.5">
                        <div>
                          <div className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Course Fee</div>
                          <div className="text-lg font-black text-blue-500 dark:text-blue-400">
                            {course.fees}
                          </div>
                        </div>
                        <Link
                          href={`/courses/${course.id}`}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* Mobile Drawer Filter Panel (Overlayed) */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className={`w-80 max-w-[85vw] h-full p-6 overflow-y-auto space-y-6 flex flex-col justify-between ${
            isDark ? "bg-[#071f33]" : "bg-white"
          }`}>
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-850">
                <h3 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
                  <SlidersHorizontal className="w-4.5 h-4.5 text-blue-500" />
                  Filters
                </h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="text-xs font-bold text-slate-400 hover:text-white"
                >
                  ✕ Close
                </button>
              </div>

              {/* Category Filter Group */}
              <div className="space-y-3.5">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">
                  Course Category
                </h4>
                <div className="space-y-2.5">
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2.5 text-xs font-semibold cursor-pointer select-none group">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(key)}
                        onChange={() => handleCategoryToggle(key)}
                        className="rounded border-slate-350 dark:border-gray-700 text-blue-600 focus:ring-blue-500 w-4.5 h-4.5 cursor-pointer"
                      />
                      <span className={`transition-colors group-hover:text-blue-500 ${
                        selectedCategories.includes(key) ? "text-blue-500 dark:text-blue-400 font-bold" : ""
                      }`}>
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Level Filter Group */}
              <div className="space-y-3.5 pt-4 border-t border-gray-850">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">
                  Difficulty Level
                </h4>
                <div className="space-y-2.5">
                  {uniqueLevels.map((level) => (
                    <label key={level} className="flex items-center gap-2.5 text-xs font-semibold cursor-pointer select-none group">
                      <input
                        type="checkbox"
                        checked={selectedLevels.includes(level)}
                        onChange={() => handleLevelToggle(level)}
                        className="rounded border-slate-350 dark:border-gray-700 text-blue-600 focus:ring-blue-500 w-4.5 h-4.5 cursor-pointer"
                      />
                      <span className={`transition-colors group-hover:text-blue-500 ${
                        selectedLevels.includes(level) ? "text-blue-500 dark:text-blue-400 font-bold" : ""
                      }`}>
                        {level}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-850 flex gap-4">
              <button
                onClick={handleClearFilters}
                className={`w-full py-2.5 text-xs font-bold rounded-xl border ${
                  isDark ? "bg-white/5 border-gray-800 hover:bg-white/10" : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md"
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
