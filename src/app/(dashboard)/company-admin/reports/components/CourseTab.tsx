"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useTheme } from "@/providers/theme-provider";
import StatusBadge from "@/components/company-admin/StatusBadge";
import { ArrowUpDown, BookOpen } from "lucide-react";
import {
  mockPayments,
  mockCoursesCatalog,
  mockSeafarers,
} from "@/components/company-admin/mockData";
import { FilterState } from "./ReportFilterBar";

interface CourseTabProps {
  filters: FilterState;
  registerExportData: (data: Record<string, unknown>[]) => void;
}

export default function CourseTab({
  filters,
  registerExportData,
}: CourseTabProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [sortField, setSortField] = useState<string>("name");
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const handleSort = (field: string) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const courseAnalytics = useMemo(() => {
    let analytics = mockCoursesCatalog.map((course) => {
      // Find seafarers enrolled in this course
      const enrolledSeafarers = mockSeafarers.filter((sf) =>
        sf.courses.some((c) => c.code === course.code),
      );

      const totalEnrolled = enrolledSeafarers.length;

      const completedCount = enrolledSeafarers.filter((sf) =>
        sf.courses.some(
          (c) => c.code === course.code && c.status === "Completed",
        ),
      ).length;

      const completionRate =
        totalEnrolled > 0
          ? Math.round((completedCount / totalEnrolled) * 100)
          : 0;

      // Find unique institutes offering this course by looking at mockPayments
      // (Using loose matching since mockPayments.course is name-based)
      const relatedPayments = mockPayments.filter(
        (p) =>
          p.course
            .toLowerCase()
            .includes(course.code.replace("STCW-", "").toLowerCase()) ||
          course.name.toLowerCase().includes(p.course.toLowerCase()) ||
          p.course
            .toLowerCase()
            .includes(course.name.toLowerCase().split("(")[0].trim()),
      );

      const uniqueInstitutes = new Set(
        relatedPayments.map((p) => p.instituteId),
      );

      return {
        ...course,
        enrolledSeafarers: totalEnrolled,
        completedCount,
        completionRate,
        accreditedInstitutes: uniqueInstitutes.size,
        status: "Active", // Default status
        instituteMatchIds: uniqueInstitutes, // for filtering
      };
    });

    if (filters.course) {
      analytics = analytics.filter(
        (c) =>
          c.name.toLowerCase().includes(filters.course.toLowerCase()) ||
          c.code.toLowerCase().includes(filters.course.toLowerCase()),
      );
    }

    if (filters.institute) {
      // Only show courses that are offered by the filtered institute
      // mockPayments has instituteName which is what filters.institute matches
      const matchingInstitutes = new Set(
        mockPayments
          .filter((p) =>
            p.instituteName
              .toLowerCase()
              .includes(filters.institute.toLowerCase()),
          )
          .map((p) => p.instituteId),
      );
      analytics = analytics.filter((c) => {
        let hasMatch = false;
        c.instituteMatchIds.forEach((id) => {
          if (matchingInstitutes.has(id)) hasMatch = true;
        });
        return hasMatch;
      });
    }

    analytics.sort((a, b) => {
      let valA: string | number = a[sortField as keyof typeof a] as
        string | number;
      let valB: string | number = b[sortField as keyof typeof b] as
        string | number;
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

    return analytics;
  }, [filters, sortField, sortAsc]);

  useEffect(() => {
    registerExportData(
      courseAnalytics.map((crs) => ({
        "Course Code": crs.code,
        "Course Title": crs.name,
        Category: crs.category,
        Duration: crs.duration,
        "Enrolled Seafarers": crs.enrolledSeafarers,
        "Accredited Institutes": crs.accreditedInstitutes,
        "Completion Rate": `${crs.completionRate}%`,
        Status: crs.status,
      })),
    );
  }, [courseAnalytics, registerExportData]);

  const cardClasses = `rounded-xl border shadow-sm overflow-hidden ${
    isDark ? "bg-[#0c1a2e] border-white/5" : "bg-white border-slate-200"
  }`;

  return (
    <div className="space-y-6">
      <div className={cardClasses}>
        <div
          className={`p-5 border-b flex items-center justify-between ${isDark ? "border-white/5 bg-[#09111e]/50" : "border-slate-100 bg-slate-50/50"}`}
        >
          <div className="flex items-center gap-2">
            <BookOpen
              className={`w-4 h-4 ${isDark ? "text-sky-400" : "text-sky-600"}`}
            />
            <h3 className="text-sm font-bold tracking-tight">
              Course Analytics & Catalog
            </h3>
          </div>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${isDark ? "bg-[#0c1a2e] border-white/10 text-slate-300" : "bg-white border-slate-200 text-slate-600"}`}
          >
            Showing {courseAnalytics.length} courses
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr
                className={`border-b text-[11px] uppercase tracking-wider ${isDark ? "border-white/5 text-white/50" : "border-slate-100 text-slate-500 bg-white"}`}
              >
                <th
                  className="px-6 py-4 font-bold cursor-pointer select-none group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  onClick={() => handleSort("name")}
                >
                  Course Code & Title{" "}
                  <ArrowUpDown className="w-3 h-3 inline-block ml-1 opacity-0 group-hover:opacity-50 transition-opacity" />
                </th>
                <th
                  className="px-6 py-4 font-bold cursor-pointer select-none group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  onClick={() => handleSort("category")}
                >
                  Category{" "}
                  <ArrowUpDown className="w-3 h-3 inline-block ml-1 opacity-0 group-hover:opacity-50 transition-opacity" />
                </th>
                <th
                  className="px-6 py-4 font-bold cursor-pointer select-none group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  onClick={() => handleSort("duration")}
                >
                  Duration{" "}
                  <ArrowUpDown className="w-3 h-3 inline-block ml-1 opacity-0 group-hover:opacity-50 transition-opacity" />
                </th>
                <th
                  className="px-6 py-4 font-bold text-center cursor-pointer select-none group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  onClick={() => handleSort("enrolledSeafarers")}
                >
                  Enrolled Seafarers{" "}
                  <ArrowUpDown className="w-3 h-3 inline-block ml-1 opacity-0 group-hover:opacity-50 transition-opacity" />
                </th>
                <th
                  className="px-6 py-4 font-bold text-center cursor-pointer select-none group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  onClick={() => handleSort("accreditedInstitutes")}
                >
                  Accredited Institutes{" "}
                  <ArrowUpDown className="w-3 h-3 inline-block ml-1 opacity-0 group-hover:opacity-50 transition-opacity" />
                </th>
                <th
                  className="px-6 py-4 font-bold cursor-pointer select-none w-56 group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  onClick={() => handleSort("completionRate")}
                >
                  Completion Rate{" "}
                  <ArrowUpDown className="w-3 h-3 inline-block ml-1 opacity-0 group-hover:opacity-50 transition-opacity" />
                </th>
                <th
                  className="px-6 py-4 font-bold text-right cursor-pointer select-none group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  onClick={() => handleSort("status")}
                >
                  Catalog Status{" "}
                  <ArrowUpDown className="w-3 h-3 inline-block ml-1 opacity-0 group-hover:opacity-50 transition-opacity" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {courseAnalytics.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-sm opacity-50"
                  >
                    No courses found matching filters.
                  </td>
                </tr>
              ) : (
                courseAnalytics.map((crs) => (
                  <tr
                    key={crs.id}
                    className={`transition-colors ${isDark ? "hover:bg-white/[0.02]" : "hover:bg-slate-50/50"}`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-xs">{crs.code}</div>
                      <div
                        className="text-[11px] opacity-60 truncate max-w-[280px]"
                        title={crs.name}
                      >
                        {crs.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${
                          isDark
                            ? "bg-slate-800 border-white/10 text-slate-300"
                            : "bg-slate-100 border-slate-200 text-slate-600"
                        }`}
                      >
                        {crs.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium opacity-80">
                      {crs.duration}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-xs">
                      {crs.enrolledSeafarers}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-xs">
                      {crs.accreditedInstitutes}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              crs.completionRate >= 80
                                ? "bg-emerald-500"
                                : crs.completionRate >= 40
                                  ? "bg-amber-500"
                                  : "bg-sky-500"
                            }`}
                            style={{ width: `${crs.completionRate}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-bold w-9 text-right text-slate-700 dark:text-slate-300">
                          {crs.completionRate}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <StatusBadge status={crs.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
