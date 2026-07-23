"use client";

import React, { useState, useMemo } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  mockSeafarers,
  mockCoursesCatalog,
} from "@/components/company-admin/mockData";
import StatsCard from "@/components/company-admin/StatsCard";
import StatusBadge from "@/components/company-admin/StatusBadge";
import { Skeleton } from "@/components/company-admin/Skeleton";
import {
  BookOpen,
  Award,
  AlertTriangle,
  Search,
  Plus,
  X,
  CheckCircle,
  HelpCircle,
  FileCheck,
  Calendar,
  Hourglass,
  SlidersHorizontal,
} from "lucide-react";

interface FlattenedCourse {
  seafarerId: string;
  seafarerName: string;
  seafarerRank: string;
  courseId: string;
  code: string;
  name: string;
  progress: number;
  status: "Completed" | "In Progress" | "Not Started" | "Expired";
  assignedDate: string;
  expiryDate?: string;
}

export default function CourseManagementPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Flat course enrollments list
  const [enrollments, setEnrollments] = useState<FlattenedCourse[]>(() => {
    const list: FlattenedCourse[] = [];
    mockSeafarers.forEach((sf) => {
      sf.courses.forEach((c) => {
        list.push({
          seafarerId: sf.id,
          seafarerName: sf.name,
          seafarerRank: sf.rank,
          courseId: c.id,
          code: c.code,
          name: c.name,
          progress: c.progress,
          status: c.status,
          assignedDate: c.assignedDate,
          expiryDate: c.expiryDate,
        });
      });
    });
    return list;
  });

  // Assign course state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [targetSeafarerId, setTargetSeafarerId] = useState("");
  const [targetCourseCatalogId, setTargetCourseCatalogId] = useState("");
  const [assignedDate, setAssignedDate] = useState(() => new Date().toISOString().split("T")[0]);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Calculate compliance statistics
  const metrics = useMemo(() => {
    const total = enrollments.length;
    const completed = enrollments.filter((e) => e.status === "Completed").length;
    const inProgress = enrollments.filter((e) => e.status === "In Progress").length;
    const expired = enrollments.filter((e) => e.status === "Expired").length;
    const complianceRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, inProgress, expired, complianceRate };
  }, [enrollments]);

  // Dynamic Upcoming Expiries List for courses
  const upcomingCourseExpiries = useMemo(() => {
    return enrollments
      .filter((e) => e.status === "Completed" && e.expiryDate)
      .map((e) => {
        const today = new Date();
        const exp = new Date(e.expiryDate!);
        const diff = exp.getTime() - today.getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return { ...e, daysLeft: days };
      })
      .filter((e) => e.daysLeft < 365) // expiring within 1 year
      .sort((a, b) => a.daysLeft - b.daysLeft)
      .slice(0, 3);
  }, [enrollments]);

  // Filtering enrollments
  const filteredEnrollments = useMemo(() => {
    return enrollments.filter((e) => {
      const matchesSearch =
        e.seafarerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === "All" || e.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [enrollments, searchQuery, selectedStatus]);

  // Assign course handler
  const handleAssignCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetSeafarerId || !targetCourseCatalogId) {
      alert("Please select both a seafarer and a course.");
      return;
    }

    const selectedSf = mockSeafarers.find((s) => s.id === targetSeafarerId);
    const selectedCourse = mockCoursesCatalog.find((c) => c.id === targetCourseCatalogId);

    if (!selectedSf || !selectedCourse) return;

    // Check if course is already assigned
    const alreadyAssigned = enrollments.some(
      (e) => e.seafarerId === targetSeafarerId && e.code === selectedCourse.code
    );

    if (alreadyAssigned) {
      alert(`${selectedSf.name} is already enrolled/assigned to ${selectedCourse.name}.`);
      return;
    }

    const newEnrollment: FlattenedCourse = {
      seafarerId: selectedSf.id,
      seafarerName: selectedSf.name,
      seafarerRank: selectedSf.rank,
      courseId: `cp-${Date.now()}`,
      code: selectedCourse.code,
      name: selectedCourse.name,
      progress: 0,
      status: "Not Started",
      assignedDate: assignedDate,
    };

    setEnrollments((prev) => [newEnrollment, ...prev]);
    setShowAssignModal(false);
    // Reset state
    setTargetSeafarerId("");
    setTargetCourseCatalogId("");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-800"}`}>
            Course Management
          </h1>
          <p className={`text-[11px] mt-0.5 ${isDark ? "text-white/40" : "text-slate-500"}`}>
            Track training compliance and assign maritime certifications to seafarers.
          </p>
        </div>
        <button
          onClick={() => setShowAssignModal(true)}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg tracking-wider uppercase transition-all duration-300 border cursor-pointer ${
            isDark
              ? "bg-white text-black border-transparent hover:bg-gray-200"
              : "bg-black text-white border-transparent hover:bg-gray-800"
          }`}
        >
          <Plus className="w-4 h-4" />
          Assign Course
        </button>
      </div>

      {/* Compliance Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Overall Compliance"
          value={`${metrics.complianceRate}%`}
          icon={Award}
          changeType="neutral"
          description="total completed/assigned"
        />
        <StatsCard
          title="Total Assigned Courses"
          value={metrics.total}
          icon={BookOpen}
          changeType="neutral"
          description="enrolled certificates"
        />
        <StatsCard
          title="Courses in Progress"
          value={metrics.inProgress}
          icon={HelpCircle}
          changeType="neutral"
          description="currently studying"
        />
        <StatsCard
          title="Expired Credentials"
          value={metrics.expired}
          icon={AlertTriangle}
          change={metrics.expired > 0 ? "Renewal Needed" : "All Compliant"}
          changeType={metrics.expired > 0 ? "negative" : "positive"}
          description="expired credentials"
        />
      </div>

      {/* Dynamic Expiries Panel & Compliance Rate Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Compliance rate gauge */}
        <div
          className={`p-5 rounded-xl border transition-all duration-200 hover:shadow-sm lg:col-span-2 ${
            isDark ? "bg-[#0c1a2e] border-white/5 text-white" : "bg-white border-slate-200 text-slate-850"
          }`}
        >
          <h3 className="text-xs font-bold uppercase tracking-wider opacity-60 mb-4">Course Compliance Gauge</h3>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="45"
                  className="stroke-slate-100 dark:stroke-white/5 fill-transparent"
                  strokeWidth="8"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="45"
                  className="stroke-sky-500 fill-transparent transition-all duration-500"
                  strokeWidth="8"
                  strokeDasharray={282}
                  strokeDashoffset={282 - (282 * metrics.complianceRate) / 100}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-bold tracking-tight">{metrics.complianceRate}%</span>
                <span className="text-[8px] uppercase tracking-wider opacity-55">Compliant</span>
              </div>
            </div>
            <div className="space-y-2 text-xs leading-normal">
              <p className="font-semibold text-slate-800 dark:text-slate-150">Fleet Safety Standards</p>
              <p className="text-slate-500 dark:text-slate-400">
                A minimum of <strong>85% fleet compliance</strong> is required to clear harbor authority audits. Currently, you are at <strong className="text-sky-500">{metrics.complianceRate}%</strong> compliance. Enroll seafarers in refresher training to meet compliance benchmarks.
              </p>
            </div>
          </div>
        </div>

        {/* Course Expiries Panel */}
        <div
          className={`p-5 rounded-xl border transition-all duration-200 hover:shadow-sm ${
            isDark ? "bg-[#0c1a2e] border-white/5 text-white" : "bg-white border-slate-200 text-slate-850"
          }`}
        >
          <h3 className="text-xs font-bold uppercase tracking-wider opacity-60 mb-3">Expiring Certification Warnings</h3>
          <div className="space-y-3">
            {upcomingCourseExpiries.length === 0 ? (
              <div className="text-center py-6 text-[10px] text-slate-400">
                All certificates compliant and valid
              </div>
            ) : (
              upcomingCourseExpiries.map((exp, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg border border-slate-100 dark:border-white/3 flex items-start gap-2.5 text-[11px]"
                >
                  <Hourglass className="w-3.5 h-3.5 mt-0.5 text-amber-500 shrink-0" />
                  <div className="min-w-0 flex-1 leading-normal">
                    <p className="font-bold truncate">{exp.seafarerName}</p>
                    <p className="opacity-60 truncate mt-0.5">{exp.name}</p>
                    <span className="text-[9px] font-bold text-rose-500 block mt-1">Expiring in {exp.daysLeft} days</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Enrollments Data Panel */}
      <div
        className={`border rounded-xl overflow-hidden shadow-sm ${
          isDark ? "bg-[#0c1a2e] border-white/5" : "bg-white border-slate-200"
        }`}
      >
        <div className="p-4 border-b border-solid border-slate-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-white/2">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider opacity-60">
              Crew Enrollment Status
            </h3>
          </div>
          {/* Filters toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Status tab */}
            <div className="flex items-center gap-1.5 border border-solid border-slate-200 dark:border-white/10 rounded-lg p-1 bg-white dark:bg-[#0c1a2e]">
              {["All", "Completed", "In Progress", "Expired"].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${
                    selectedStatus === st
                      ? isDark
                        ? "bg-white text-black"
                        : "bg-black text-white"
                      : "text-slate-500 dark:text-slate-400 hover:text-sky-400"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Search bar */}
            <div className="relative max-w-xs w-full">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-40">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                placeholder="Search course or crew..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-9 pr-3 py-1.5 w-full rounded-lg border text-xs outline-none transition-all focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 ${
                  isDark
                    ? "bg-white/5 border-white/10 text-white"
                    : "bg-white border-slate-200 text-slate-800"
                }`}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr
                className={`border-b text-[10px] font-bold tracking-wider uppercase ${
                  isDark ? "bg-white/3 border-white/5 text-white/50" : "bg-slate-50 border-slate-100 text-slate-400"
                }`}
              >
                <th className="py-3 px-4">Seafarer</th>
                <th className="py-3 px-4">Course Name</th>
                <th className="py-3 px-4">Progress</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Dates</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-solid divide-slate-100 dark:divide-white/5">
              {filteredEnrollments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-xs text-gray-500">
                    No course assignments found.
                  </td>
                </tr>
              ) : (
                filteredEnrollments.map((enrollment) => (
                  <tr
                    key={`${enrollment.seafarerId}-${enrollment.courseId}`}
                    className="text-xs hover:bg-slate-50/50 dark:hover:bg-white/3 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800 dark:text-slate-200">{enrollment.seafarerName}</div>
                      <span className="text-[10px] opacity-55">{enrollment.seafarerRank}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold">
                      <div>{enrollment.name}</div>
                      <span className="text-[10px] opacity-40 font-mono">{enrollment.code}</span>
                    </td>
                    <td className="py-3.5 px-4 w-44">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] opacity-60">
                          <span>{enrollment.progress}%</span>
                        </div>
                        <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDark ? "bg-white/5" : "bg-slate-100"}`}>
                          <div
                            className="h-full bg-sky-500 rounded-full transition-all duration-300"
                            style={{ width: `${enrollment.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={enrollment.status} />
                    </td>
                    <td className="py-3.5 px-4 text-[10px] opacity-65 leading-relaxed">
                      <div>Assigned: {enrollment.assignedDate}</div>
                      {enrollment.expiryDate && <div>Expires: {enrollment.expiryDate}</div>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── ASSIGN COURSE DIALOG MODAL ────────────────────────────────────────── */}
      {showAssignModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setShowAssignModal(false)}
          />
          {/* Dialog Container */}
          <div
            className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md shadow-2xl z-50 rounded-xl overflow-hidden border ${
              isDark ? "bg-[#0b1625] border-white/5 text-white" : "bg-white border-slate-200 text-slate-800"
            }`}
          >
            {/* Header */}
            <div
              className={`p-4 border-b flex items-center justify-between gap-4 ${
                isDark ? "border-white/5 bg-[#09111e]" : "border-slate-100 bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold">Assign New STCW Course</h3>
              </div>
              <button
                onClick={() => setShowAssignModal(false)}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  isDark ? "hover:bg-white/5" : "hover:bg-slate-100"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAssignCourse} className="p-5 space-y-4">
              {/* Select Seafarer */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase opacity-60">Select Seafarer</label>
                <select
                  value={targetSeafarerId}
                  onChange={(e) => setTargetSeafarerId(e.target.value)}
                  className={`w-full py-2 px-3 rounded-lg border text-xs outline-none ${
                    isDark
                      ? "bg-[#0c1a2e] border-white/10 text-white focus:border-sky-500"
                      : "bg-white border-slate-200 text-slate-800 focus:border-sky-500"
                  }`}
                  required
                >
                  <option value="">Choose Seafarer...</option>
                  {mockSeafarers.map((sf) => (
                    <option key={sf.id} value={sf.id}>
                      {sf.name} ({sf.rank})
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Course */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase opacity-60">Select Certification Course</label>
                <select
                  value={targetCourseCatalogId}
                  onChange={(e) => setTargetCourseCatalogId(e.target.value)}
                  className={`w-full py-2 px-3 rounded-lg border text-xs outline-none ${
                    isDark
                      ? "bg-[#0c1a2e] border-white/10 text-white focus:border-sky-500"
                      : "bg-white border-slate-200 text-slate-800 focus:border-sky-500"
                  }`}
                  required
                >
                  <option value="">Choose Course...</option>
                  {mockCoursesCatalog.map((course) => (
                    <option key={course.id} value={course.id}>
                      [{course.code}] {course.name} ({course.duration})
                    </option>
                  ))}
                </select>
              </div>

              {/* Assignment Date */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase opacity-60">Assignment Date</label>
                <input
                  type="date"
                  value={assignedDate}
                  onChange={(e) => setAssignedDate(e.target.value)}
                  className={`w-full py-2 px-3 rounded-lg border text-xs outline-none ${
                    isDark
                      ? "bg-[#0c1a2e] border-white/10 text-white focus:border-sky-500"
                      : "bg-white border-slate-200 text-slate-800 focus:border-sky-500"
                  }`}
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold border cursor-pointer transition-colors ${
                    isDark
                      ? "border-white/10 hover:bg-white/5 text-white"
                      : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg text-xs font-bold border cursor-pointer transition-colors ${
                    isDark
                      ? "bg-white text-black border-transparent hover:bg-gray-200"
                      : "bg-black text-white border-transparent hover:bg-gray-800"
                  }`}
                >
                  Assign Course
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
