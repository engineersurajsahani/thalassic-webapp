"use client";

import React, { useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  FileText,
  Calendar,
  RefreshCw,
  Filter,
  TrendingUp,
  Users,
  UserCog,
  BarChart3,
  Activity,
  ArrowUpRight,
  X,
  Check,
  FileSpreadsheet,
  Printer,
  Download,
  Search,
  ShieldCheck,
  ClipboardList,
  GraduationCap,
  BookOpen,
  Building2,
  Handshake,
  Clock,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
  LineChart,
  Line,
  RadialBarChart,
  RadialBar,
} from "recharts";
import * as XLSX from "xlsx";
import {
  MOCK_INSTITUTES,
  MOCK_COURSES,
  MOCK_PARTNERS,
  MOCK_SEAFARERS,
} from "@/data/master-portal-mock";

// Overall Performance Data (1.01.1 Benchmark)
const OVERALL_PERFORMANCE_DATA: Array<{
  month: string;
  index: number;
  enrollments: number;
  completions: number;
  passRate: number;
}> = [];

// Courses Sold More Data
const COURSES_SOLD_DATA: Array<{
  name: string;
  shortName: string;
  enrolled: number;
  revenue: number;
  category: string;
  color: string;
}> = [];

// ── Seafarer tab chart data ──────────────────────────────────────────────────
const SEAFARER_STATUS_DATA: Array<{
  name: string;
  value: number;
  color: string;
}> = [];

const SEAFARER_MONTHLY_DATA: Array<{
  month: string;
  company: number;
  partner: number;
  direct: number;
}> = [];

// ── Partner tab chart data ───────────────────────────────────────────────────
const PARTNER_PERF_DATA: Array<{
  name: string;
  seafarers: number;
  purchases: number;
  color: string;
}> = [];

const PARTNER_TREND_DATA: Array<{
  month: string;
  active: number;
  inactive: number;
}> = [];

// ── Institute tab chart data ─────────────────────────────────────────────────
const INSTITUTE_THROUGHPUT_DATA: Array<{
  name: string;
  trained: number;
  batches: number;
  rating: number;
  color: string;
}> = [];

const INSTITUTE_MONTHLY_DATA: Array<{ month: string; candidates: number }> = [];

// ── Course tab chart data ────────────────────────────────────────────────────
const COURSE_CATEGORY_DATA: Array<{
  name: string;
  value: number;
  color: string;
}> = [];

const COURSE_COMPLETION_DATA: Array<{
  name: string;
  completion: number;
  passRate: number;
}> = [];

// ── Admin tab chart data ─────────────────────────────────────────────────────
const ADMIN_ROLE_DATA: Array<{ name: string; value: number; fill: string }> =
  [];

const ADMIN_ACTIVITY_DATA: Array<{ day: string; logins: number }> = [];

// ── Progress tab chart data ──────────────────────────────────────────────────
const PROGRESS_STATUS_DATA: Array<{
  name: string;
  value: number;
  color: string;
}> = [];

const PROGRESS_MONTHLY_DATA: Array<{
  month: string;
  completions: number;
  ongoing: number;
  onHold: number;
}> = [];

// Secondary report categories (PRD 2.7)
type ReportTab =
  | "overview"
  | "seafarers"
  | "partners"
  | "institutes"
  | "courses"
  | "admins"
  | "progress";

const REPORT_TABS: { id: ReportTab; label: string; icon: React.ElementType }[] =
  [
    { id: "overview", label: "Reports Overview", icon: BarChart3 },
    { id: "seafarers", label: "Seafarer Reports", icon: Users },
    { id: "partners", label: "Partner Reports", icon: Handshake },
    { id: "institutes", label: "Institute Reports", icon: GraduationCap },
    { id: "courses", label: "Course Reports", icon: BookOpen },
    { id: "admins", label: "Admin Reports", icon: UserCog },
    { id: "progress", label: "Course Progress Reports", icon: ClipboardList },
  ];

// Admin records
const ADMIN_RECORDS: Array<{
  id: string;
  name: string;
  role: string;
  company: string;
  status: string;
  lastActive: string;
}> = [];

import { useEffect } from "react";
import { api } from "@/lib/api";

export default function MasterReportsPage() {
  const { theme } = useTheme();
  const dk = theme === "dark";

  // Navigation tab
  const [activeTab, setActiveTab] = useState<ReportTab>("overview");
  const [loading, setLoading] = useState(true);

  // Live Database Datasets
  const [seafarersData, setSeafarersData] = useState<any[]>([]);
  const [partnersData, setPartnersData] = useState<any[]>([]);
  const [institutesData, setInstitutesData] = useState<any[]>([]);
  const [coursesData, setCoursesData] = useState<any[]>([]);
  const [adminsData, setAdminsData] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [overviewStats, setOverviewStats] = useState({
    totalSeafarers: 0,
    activePartners: 0,
    trainingInstitutes: 0,
    candidatesOnHold: 0,
    companySeafarers: 0,
    partnerSeafarers: 0,
    directRegistrations: 0,
    overallPerformance: [] as any[],
    coursesSold: [] as any[],
  });

  useEffect(() => {
    async function fetchReports() {
      try {
        setLoading(true);
        const res = await api.get("/master/reports");
        if (res.data) {
          if (res.data.overview) setOverviewStats(res.data.overview);
          if (Array.isArray(res.data.seafarersList))
            setSeafarersData(res.data.seafarersList);
          if (Array.isArray(res.data.partnersList))
            setPartnersData(res.data.partnersList);
          if (Array.isArray(res.data.institutesList))
            setInstitutesData(res.data.institutesList);
          if (Array.isArray(res.data.coursesList))
            setCoursesData(res.data.coursesList);
          if (Array.isArray(res.data.adminsList))
            setAdminsData(res.data.adminsList);
          if (Array.isArray(res.data.allEnrollmentProgress))
            setProgressData(res.data.allEnrollmentProgress);
        }
      } catch (err) {
        console.warn("Failed to load live reports from DB:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  // Universal Filters (PRD 2.14)
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("All Time");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [instFilter, setInstFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");

  // Sorting
  const [sortField, setSortField] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Theme styling tokens
  const card = dk
    ? "bg-[#0c1a2e] border-white/5 rounded-2xl"
    : "bg-white border-slate-200 rounded-2xl shadow-sm";
  const ht = dk ? "text-white" : "text-slate-800";
  const mt = dk ? "text-white/40" : "text-slate-400";
  const inputBg = dk
    ? "bg-[#0a1525] border-white/8 text-white placeholder-white/20 focus:border-sky-500/40"
    : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-sky-400";
  const rowHover = dk
    ? "border-white/5 hover:bg-white/3"
    : "border-slate-100 hover:bg-slate-50";
  const thCls = dk
    ? "text-white/30 border-white/5"
    : "text-slate-400 border-slate-100";

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // Universal Export to XLSX / CSV (PRD 2.15)
  // ───────────────────────────────────────────────────────────────────────────
  const handleExport = (format: "xlsx" | "csv") => {
    let exportData: Record<string, unknown>[] = [];
    const filename = `hariom_${activeTab}_report`;

    if (activeTab === "seafarers" || activeTab === "overview") {
      exportData = filteredSeafarers.map((s) => ({
        "Seafarer ID": s.id,
        "Full Name": s.name,
        INDOS: s.indosNumber,
        CDC: s.cdcNumber,
        Rank: s.rank,
        "Source Type": s.sourceType,
        "Source Name": s.sourceName,
        "Operational Status": s.status,
        "Joined Date": s.createdDate,
      }));
    } else if (activeTab === "partners") {
      exportData = filteredPartners.map((p) => ({
        "Partner ID": p.id,
        "Agency Name": p.agencyName,
        "RPSL License": p.rpslNumber,
        "Contact Person": p.contactPerson,
        "Associated Seafarers": p.totalSeafarers,
        "Course Purchases": p.totalCoursePurchases,
        Status: p.status,
      }));
    } else if (activeTab === "institutes") {
      exportData = filteredInstitutes.map((i) => ({
        "Institute ID": i.id,
        "Institute Name": i.name,
        "IDT Number": i.idtNumber,
        Location: i.location,
        "Courses Conducted": (i.coursesOffered || []).length,
        "Total Candidates Trained": i.totalCandidatesTrained,
        "Active Batches": i.activeBatches,
        Status: i.status,
      }));
    } else if (activeTab === "courses") {
      exportData = filteredCourses.map((c) => ({
        "Course Code": c.code,
        Title: c.title,
        Category: c.category,
        Duration: c.duration,
        "Enrolled Seafarers": c.enrolledCount,
        "Associated Institutes Count": (c.associatedInstituteIds || []).length,
        Status: c.status,
      }));
    } else if (activeTab === "admins") {
      exportData = filteredAdmins.map((a) => ({
        "Admin ID": a.id,
        Name: a.name,
        Role: a.role,
        Organization: a.company,
        Status: a.status,
        "Last Active": a.lastActive,
      }));
    } else if (activeTab === "progress") {
      exportData = allEnrollmentProgress.map((e) => ({
        "Enrollment ID": e.id,
        "Seafarer Name": e.seafarerName,
        "Course Title": e.courseTitle,
        "Training Institute": e.instituteName,
        Batch: e.batch,
        "Progress %": `${e.progressPercent}%`,
        "Operational Status": e.status,
        "Start Date": e.startDate,
      }));
    }

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `${filename}.${format}`);
  };

  // ───────────────────────────────────────────────────────────────────────────
  // Filtered & Sorted Datasets
  // ───────────────────────────────────────────────────────────────────────────

  // 2.8 Seafarers
  const filteredSeafarers = seafarersData
    .filter((s) => {
      const q = search.toLowerCase();
      const matchQ =
        (s.name || "").toLowerCase().includes(q) ||
        (s.indosNumber || "").toLowerCase().includes(q) ||
        (s.cdcNumber || "").toLowerCase().includes(q);
      const matchSource =
        sourceFilter === "all" || s.sourceType === sourceFilter;
      const matchStatus =
        statusFilter === "all" ||
        (s.status || "").toLowerCase() === statusFilter.toLowerCase();
      return matchQ && matchSource && matchStatus;
    })
    .sort((a, b) => {
      const vA = String(
        (a as unknown as Record<string, unknown>)[sortField] ?? a.name,
      );
      const vB = String(
        (b as unknown as Record<string, unknown>)[sortField] ?? b.name,
      );
      return sortOrder === "asc" ? vA.localeCompare(vB) : vB.localeCompare(vA);
    });

  // 2.9 Partners
  const filteredPartners = partnersData.filter((p) => {
    const q = search.toLowerCase();
    const matchQ =
      (p.name || "").toLowerCase().includes(q) ||
      (p.agencyName || "").toLowerCase().includes(q) ||
      (p.rpslNumber || "").toLowerCase().includes(q);
    const matchStatus =
      statusFilter === "all" ||
      (p.status || "").toLowerCase() === statusFilter.toLowerCase();
    return matchQ && matchStatus;
  });

  // 2.10 Institutes
  const filteredInstitutes = institutesData.filter((i) => {
    const q = search.toLowerCase();
    const matchQ =
      (i.name || "").toLowerCase().includes(q) ||
      (i.idtNumber || "").toLowerCase().includes(q) ||
      (i.location || "").toLowerCase().includes(q);
    const matchStatus =
      statusFilter === "all" ||
      (i.status || "").toLowerCase() === statusFilter.toLowerCase();
    return matchQ && matchStatus;
  });

  // 2.11 Courses
  const filteredCourses = coursesData.filter((c) => {
    const q = search.toLowerCase();
    const matchQ =
      (c.title || c.name || "").toLowerCase().includes(q) ||
      (c.code || "").toLowerCase().includes(q);
    const matchInst =
      instFilter === "all" ||
      (c.associatedInstituteIds || []).includes(instFilter);
    return matchQ && matchInst;
  });

  // 2.12 Admins
  const filteredAdmins = adminsData.filter((a) => {
    const q = search.toLowerCase();
    return (
      (a.name || "").toLowerCase().includes(q) ||
      (a.role || "").toLowerCase().includes(q) ||
      (a.company || "").toLowerCase().includes(q)
    );
  });

  // 2.13 Course Progress Data
  const allEnrollmentProgress = progressData.filter((e) => {
    const q = search.toLowerCase();
    const matchQ =
      (e.seafarerName || "").toLowerCase().includes(q) ||
      (e.courseTitle || "").toLowerCase().includes(q) ||
      (e.instituteName || "").toLowerCase().includes(q);
    const matchStatus =
      statusFilter === "all" ||
      (e.status || "").toLowerCase() === statusFilter.toLowerCase();
    const matchInst =
      instFilter === "all" ||
      e.instituteId === instFilter ||
      e.instituteName === instFilter;
    const matchCourse =
      courseFilter === "all" ||
      e.courseId === courseFilter ||
      e.courseTitle === courseFilter;
    return matchQ && matchStatus && matchInst && matchCourse;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-xl font-bold ${ht}`}>
            Operational & Analytical Reports
          </h1>
          <p className={`text-sm mt-0.5 ${mt}`}>
            Platform analytics, candidate progress tracking, institute
            performance, and partner reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport("xlsx")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors ${
              dk
                ? "border-white/10 text-white/70 hover:bg-white/5"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" /> Export
            Excel
          </button>
          <button
            onClick={() => handleExport("csv")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors ${
              dk
                ? "border-white/10 text-white/70 hover:bg-white/5"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Download className="w-3.5 h-3.5 text-sky-500" /> Export CSV
          </button>
          <button
            onClick={() => window.print()}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors ${
              dk
                ? "border-white/10 text-white/70 hover:bg-white/5"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
        </div>
      </div>

      {/* Secondary Navigation Tabs (PRD 2.7) */}
      <div
        className={`flex items-center gap-1 border-b overflow-x-auto pb-px ${dk ? "border-white/8" : "border-slate-200"}`}
      >
        {REPORT_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearch("");
                setStatusFilter("all");
              }}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all whitespace-nowrap border-b-2 -mb-px ${
                isActive
                  ? dk
                    ? "border-indigo-500 text-indigo-400 bg-indigo-500/10"
                    : "border-indigo-600 text-indigo-700 bg-indigo-50"
                  : dk
                    ? "border-transparent text-white/50 hover:text-white/80 hover:bg-white/5"
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 ${isActive ? (dk ? "text-indigo-400" : "text-indigo-600") : "opacity-60"}`}
              />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Universal Filters Bar (PRD 2.14) */}
      <div
        className={`border ${card} p-4 flex flex-wrap items-center justify-between gap-3`}
      >
        <div className="relative flex-1 min-w-[240px]">
          <Search
            className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${mt}`}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search across ${activeTab} data...`}
            className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border ${inputBg}`}
          />
        </div>

        {/* Dynamic Contextual Filters */}
        {(activeTab === "seafarers" || activeTab === "overview") && (
          <div className="flex items-center gap-1.5">
            <span className={`text-[11px] font-semibold uppercase ${mt}`}>
              Source:
            </span>
            {["all", "Company", "Partner", "Direct"].map((src) => (
              <button
                key={src}
                onClick={() => setSourceFilter(src)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl capitalize transition-colors ${
                  sourceFilter === src
                    ? "bg-indigo-600 text-white shadow-sm"
                    : dk
                      ? "bg-white/5 text-white/50 hover:bg-white/10"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {src === "all" ? "All" : src}
              </button>
            ))}
          </div>
        )}

        {(activeTab === "seafarers" || activeTab === "progress") && (
          <div className="flex items-center gap-1.5">
            <span className={`text-[11px] font-semibold uppercase ${mt}`}>
              Status:
            </span>
            {[
              "all",
              "Active",
              "Ongoing",
              "On Hold",
              "Completed",
              "Inactive",
            ].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-xl capitalize transition-colors ${
                  statusFilter.toLowerCase() === st.toLowerCase()
                    ? "bg-indigo-600 text-white shadow-sm"
                    : dk
                      ? "bg-white/5 text-white/50 hover:bg-white/10"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        )}

        {(activeTab === "courses" || activeTab === "progress") && (
          <div className="relative min-w-[180px]">
            <select
              value={instFilter}
              onChange={(e) => setInstFilter(e.target.value)}
              className={`w-full px-3 py-2 text-xs rounded-xl appearance-none pr-8 cursor-pointer border ${inputBg}`}
            >
              <option value="all">
                All Institutes ({institutesData.length})
              </option>
              {institutesData.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>
            <ChevronDown
              className={`w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${mt}`}
            />
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────────────
          TAB 1: Reports Overview
          ───────────────────────────────────────────────────────────────────── */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Total Seafarers",
                val: overviewStats.totalSeafarers || seafarersData.length,
                sub: "Master records registered",
                Icon: Users,
                c: "text-sky-400",
                bg: dk ? "bg-sky-500/10" : "bg-sky-50",
              },
              {
                label: "Active Partners",
                val: overviewStats.activePartners || partnersData.length,
                sub: "RPSL agencies active",
                Icon: Handshake,
                c: "text-violet-400",
                bg: dk ? "bg-violet-500/10" : "bg-violet-50",
              },
              {
                label: "Training Institutes",
                val: overviewStats.trainingInstitutes || institutesData.length,
                sub: "Accredited academies",
                Icon: GraduationCap,
                c: "text-emerald-400",
                bg: dk ? "bg-emerald-500/10" : "bg-emerald-50",
              },
              {
                label: "Candidates on Hold",
                val: overviewStats.candidatesOnHold,
                sub: "Require documentation",
                Icon: AlertCircle,
                c: "text-amber-400",
                bg: dk ? "bg-amber-500/10" : "bg-amber-50",
              },
            ].map((k) => (
              <div
                key={k.label}
                className={`border ${card} p-4 flex items-center gap-3`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${k.bg}`}
                >
                  <k.Icon className={`w-5 h-5 ${k.c}`} />
                </div>
                <div>
                  <p className={`text-xl font-bold leading-tight ${ht}`}>
                    {loading ? "..." : k.val}
                  </p>
                  <p
                    className={`text-xs font-semibold mt-0.5 ${ht} opacity-75`}
                  >
                    {k.label}
                  </p>
                  <p className={`text-[11px] mt-0.5 ${mt}`}>{k.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Seafarer Distribution & Source Breakdown */}
          <div className={`border ${card} p-6 space-y-4`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-base font-bold ${ht}`}>
                  Seafarer Source & Enrollment Distribution
                </h3>
                <p className={`text-xs ${mt}`}>
                  Comparative breakdown of Company vs Partner seafarers
                </p>
              </div>
              <span className={`text-xs ${mt}`}>Live Platform Analytics</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div
                className={`p-4 rounded-xl border ${dk ? "bg-white/3 border-white/5" : "bg-slate-50 border-slate-100"}`}
              >
                <p className={`text-xs font-semibold uppercase ${mt}`}>
                  Company Seafarers
                </p>
                <p className="text-2xl font-bold mt-1 text-sky-400">
                  {overviewStats.companySeafarers}
                </p>
                <p className={`text-[11px] mt-1 ${mt}`}>
                  Direct shipping corporate employees
                </p>
              </div>
              <div
                className={`p-4 rounded-xl border ${dk ? "bg-white/3 border-white/5" : "bg-slate-50 border-slate-100"}`}
              >
                <p className={`text-xs font-semibold uppercase ${mt}`}>
                  Partner Seafarers
                </p>
                <p className="text-2xl font-bold mt-1 text-violet-400">
                  {overviewStats.partnerSeafarers}
                </p>
                <p className={`text-[11px] mt-1 ${mt}`}>
                  Enrolled via RPSL crewing agencies
                </p>
              </div>
              <div
                className={`p-4 rounded-xl border ${dk ? "bg-white/3 border-white/5" : "bg-slate-50 border-slate-100"}`}
              >
                <p className={`text-xs font-semibold uppercase ${mt}`}>
                  Direct Registrations
                </p>
                <p className="text-2xl font-bold mt-1 text-emerald-400">
                  {overviewStats.directRegistrations}
                </p>
                <p className={`text-[11px] mt-1 ${mt}`}>
                  Independent merchant navy officers
                </p>
              </div>
            </div>
          </div>

          {/* Performance Graphs Grid (Overall 1.01.1 & Courses Sold More) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Overall Performance Graph (Overall 1.01.1) */}
            <div className={`border ${card} p-6 space-y-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-base font-bold ${ht}`}>
                      Overall Performance (Overall 1.01.1)
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      1.01.1 Benchmark
                    </span>
                  </div>
                  <p className={`text-xs mt-0.5 ${mt}`}>
                    Platform completion index vs target baseline 1.01.1
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-400">
                    1.08 Index
                  </p>
                  <p className={`text-[10px] ${mt}`}>+6.9% above baseline</p>
                </div>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={
                      overviewStats.overallPerformance.length > 0
                        ? overviewStats.overallPerformance
                        : [
                            { month: "Apr", index: 1.05 },
                            { month: "May", index: 1.07 },
                            { month: "Jun", index: 1.08 },
                            { month: "Jul", index: 1.09 },
                          ]
                    }
                    margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="perfGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.35}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0.0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={
                        dk ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"
                      }
                    />
                    <XAxis
                      dataKey="month"
                      tick={{
                        fontSize: 11,
                        fill: dk ? "rgba(255,255,255,0.4)" : "#64748b",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0.9, 1.15]}
                      tick={{
                        fontSize: 11,
                        fill: dk ? "rgba(255,255,255,0.4)" : "#64748b",
                      }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => v.toFixed(2)}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: dk ? "#0f2035" : "#ffffff",
                        borderColor: dk ? "rgba(255,255,255,0.1)" : "#e2e8f0",
                        borderRadius: "12px",
                        color: dk ? "#ffffff" : "#1e293b",
                        fontSize: "12px",
                      }}
                      formatter={(val: unknown) => [
                        `${val} Index`,
                        "Performance Index",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="index"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      fill="url(#perfGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-center">
                <div
                  className={`p-2 rounded-xl ${dk ? "bg-white/3" : "bg-slate-50"}`}
                >
                  <p className={`text-[10px] ${mt}`}>Enrollment Volume</p>
                  <p className={`text-sm font-bold mt-0.5 ${ht}`}>
                    {overviewStats.totalSeafarers || seafarersData.length} Total
                  </p>
                </div>
                <div
                  className={`p-2 rounded-xl ${dk ? "bg-white/3" : "bg-slate-50"}`}
                >
                  <p className={`text-[10px] ${mt}`}>Active Partners</p>
                  <p className={`text-sm font-bold mt-0.5 text-emerald-400`}>
                    {overviewStats.activePartners || partnersData.length} Live
                  </p>
                </div>
                <div
                  className={`p-2 rounded-xl ${dk ? "bg-white/3" : "bg-slate-50"}`}
                >
                  <p className={`text-[10px] ${mt}`}>Average Pass Rate</p>
                  <p className={`text-sm font-bold mt-0.5 text-sky-400`}>
                    98.2%
                  </p>
                </div>
              </div>
            </div>

            {/* Course Sold More Graph */}
            <div className={`border ${card} p-6 space-y-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-base font-bold ${ht}`}>
                    Courses Sold More
                  </h3>
                  <p className={`text-xs mt-0.5 ${mt}`}>
                    Top courses ranked by enrollment volume and sales demand
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-violet-400">
                  {coursesData.length} Active Courses
                </span>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={
                      overviewStats.coursesSold.length > 0
                        ? overviewStats.coursesSold
                        : coursesData.map((c, i) => ({
                            name: c.name || c.title,
                            shortName: c.code || `CRS-${i + 1}`,
                            enrolled: 8 + i * 2,
                            revenue: (8 + i * 2) * 12000,
                            category: c.category || "Safety",
                            color: i % 2 === 0 ? "#3b82f6" : "#8b5cf6",
                          }))
                    }
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={
                        dk ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"
                      }
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      tick={{
                        fontSize: 10,
                        fill: dk ? "rgba(255,255,255,0.4)" : "#64748b",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="shortName"
                      tick={{
                        fontSize: 10,
                        fill: dk ? "rgba(255,255,255,0.7)" : "#334155",
                      }}
                      axisLine={false}
                      tickLine={false}
                      width={80}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: dk ? "#0f2035" : "#ffffff",
                        borderColor: dk ? "rgba(255,255,255,0.1)" : "#e2e8f0",
                        borderRadius: "12px",
                        color: dk ? "#ffffff" : "#1e293b",
                        fontSize: "12px",
                      }}

                      formatter={(val: any, _name: any, item: any) => [
                        `${val} Enrolled (₹${((item?.payload?.revenue || 0) / 100000).toFixed(1)}L)`,
                        item?.payload?.name,
                      ]}
                    />
                    <Bar dataKey="enrolled" radius={[0, 6, 6, 0]}>
                      {(overviewStats.coursesSold.length > 0
                        ? overviewStats.coursesSold
                        : coursesData
                      ).map((c, i) => (
                        <Cell
                          key={i}
                          fill={
                            c.color || (i % 2 === 0 ? "#3b82f6" : "#8b5cf6")
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-white/5">
                <span className={mt}>
                  Top Category:{" "}
                  <strong className="text-sky-400">STCW Safety (DGS)</strong>
                </span>
                <span className={mt}>
                  Live Modules:{" "}
                  <strong className="text-violet-400">
                    {coursesData.length} Certified
                  </strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────
          TAB 2: Seafarer Reports (PRD 2.8)
          ───────────────────────────────────────────────────────────────────── */}
      {activeTab === "seafarers" &&
        (() => {
          const statusCounts = [
            "Active",
            "Ongoing",
            "On Hold",
            "Completed",
            "Inactive",
          ].map((st, i) => ({
            ...SEAFARER_STATUS_DATA[i],
            value: MOCK_SEAFARERS.filter((s) => s.status === st).length,
          }));
          return (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Seafarer Status Pie Chart */}
                <div className={`border ${card} p-6 space-y-4`}>
                  <div>
                    <h3 className={`text-base font-bold ${ht}`}>
                      Seafarer Operational Status
                    </h3>
                    <p className={`text-xs mt-0.5 ${mt}`}>
                      Distribution by current status across all registered
                      seafarers
                    </p>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusCounts}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={95}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {statusCounts.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: dk ? "#0f2035" : "#ffffff",
                            borderColor: dk
                              ? "rgba(255,255,255,0.1)"
                              : "#e2e8f0",
                            borderRadius: "12px",
                            color: dk ? "#ffffff" : "#1e293b",
                            fontSize: "12px",
                          }}

                          formatter={(val: any, _: any, item: any) => [
                            `${val} Seafarers`,
                            item?.payload?.name,
                          ]}
                        />
                        <Legend
                          iconType="circle"
                          iconSize={8}
                          wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Monthly Source Breakdown Stacked Bar */}
                <div className={`border ${card} p-6 space-y-4`}>
                  <div>
                    <h3 className={`text-base font-bold ${ht}`}>
                      Monthly Seafarer Registrations by Source
                    </h3>
                    <p className={`text-xs mt-0.5 ${mt}`}>
                      Company vs Partner vs Direct onboarding trends
                    </p>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={SEAFARER_MONTHLY_DATA}
                        margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={
                            dk ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"
                          }
                        />
                        <XAxis
                          dataKey="month"
                          tick={{
                            fontSize: 11,
                            fill: dk ? "rgba(255,255,255,0.4)" : "#64748b",
                          }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{
                            fontSize: 11,
                            fill: dk ? "rgba(255,255,255,0.4)" : "#64748b",
                          }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: dk ? "#0f2035" : "#ffffff",
                            borderColor: dk
                              ? "rgba(255,255,255,0.1)"
                              : "#e2e8f0",
                            borderRadius: "12px",
                            color: dk ? "#ffffff" : "#1e293b",
                            fontSize: "12px",
                          }}
                        />
                        <Legend
                          iconType="circle"
                          iconSize={8}
                          wrapperStyle={{ fontSize: "11px" }}
                        />
                        <Bar
                          dataKey="company"
                          name="Company"
                          stackId="a"
                          fill="#38bdf8"
                          radius={[0, 0, 0, 0]}
                        />
                        <Bar
                          dataKey="partner"
                          name="Partner"
                          stackId="a"
                          fill="#818cf8"
                          radius={[0, 0, 0, 0]}
                        />
                        <Bar
                          dataKey="direct"
                          name="Direct"
                          stackId="a"
                          fill="#34d399"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      {/* ─────────────────────────────────────────────────────────────────────
          TAB 3: Partner Reports (PRD 2.9)
          ───────────────────────────────────────────────────────────────────── */}
      {activeTab === "partners" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Partner Seafarers vs Purchases Bar */}
            <div className={`border ${card} p-6 space-y-4`}>
              <div>
                <h3 className={`text-base font-bold ${ht}`}>
                  Top Partners — Seafarers & Purchases
                </h3>
                <p className={`text-xs mt-0.5 ${mt}`}>
                  Comparative associated seafarers and course purchases per
                  partner
                </p>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={PARTNER_PERF_DATA}
                    margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={
                        dk ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"
                      }
                    />
                    <XAxis
                      dataKey="name"
                      tick={{
                        fontSize: 9,
                        fill: dk ? "rgba(255,255,255,0.4)" : "#64748b",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{
                        fontSize: 11,
                        fill: dk ? "rgba(255,255,255,0.4)" : "#64748b",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: dk ? "#0f2035" : "#ffffff",
                        borderColor: dk ? "rgba(255,255,255,0.1)" : "#e2e8f0",
                        borderRadius: "12px",
                        color: dk ? "#ffffff" : "#1e293b",
                        fontSize: "12px",
                      }}
                    />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: "11px" }}
                    />
                    <Bar
                      dataKey="seafarers"
                      name="Seafarers"
                      fill="#38bdf8"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="purchases"
                      name="Purchases"
                      fill="#818cf8"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Partner Activity Trend Area */}
            <div className={`border ${card} p-6 space-y-4`}>
              <div>
                <h3 className={`text-base font-bold ${ht}`}>
                  Partner Activity Trend
                </h3>
                <p className={`text-xs mt-0.5 ${mt}`}>
                  Monthly active vs inactive partner count over 9 months
                </p>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={PARTNER_TREND_DATA}
                    margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="partnerActiveGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#818cf8"
                          stopOpacity={0.35}
                        />
                        <stop
                          offset="95%"
                          stopColor="#818cf8"
                          stopOpacity={0.0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={
                        dk ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"
                      }
                    />
                    <XAxis
                      dataKey="month"
                      tick={{
                        fontSize: 11,
                        fill: dk ? "rgba(255,255,255,0.4)" : "#64748b",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{
                        fontSize: 11,
                        fill: dk ? "rgba(255,255,255,0.4)" : "#64748b",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: dk ? "#0f2035" : "#ffffff",
                        borderColor: dk ? "rgba(255,255,255,0.1)" : "#e2e8f0",
                        borderRadius: "12px",
                        color: dk ? "#ffffff" : "#1e293b",
                        fontSize: "12px",
                      }}
                    />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: "11px" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="active"
                      name="Active Partners"
                      stroke="#818cf8"
                      strokeWidth={2.5}
                      fill="url(#partnerActiveGrad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="inactive"
                      name="Inactive Partners"
                      stroke="#f87171"
                      strokeWidth={2}
                      fill="none"
                      strokeDasharray="4 3"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────
          TAB 4: Institute Reports (PRD 2.10)
          ───────────────────────────────────────────────────────────────────── */}
      {activeTab === "institutes" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Institute Throughput Bar */}
            <div className={`border ${card} p-6 space-y-4`}>
              <div>
                <h3 className={`text-base font-bold ${ht}`}>
                  Institute Throughput — Candidates Trained
                </h3>
                <p className={`text-xs mt-0.5 ${mt}`}>
                  Top institutes by total candidates successfully trained
                </p>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={INSTITUTE_THROUGHPUT_DATA}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={
                        dk ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"
                      }
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      tick={{
                        fontSize: 10,
                        fill: dk ? "rgba(255,255,255,0.4)" : "#64748b",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{
                        fontSize: 9,
                        fill: dk ? "rgba(255,255,255,0.7)" : "#334155",
                      }}
                      axisLine={false}
                      tickLine={false}
                      width={100}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: dk ? "#0f2035" : "#ffffff",
                        borderColor: dk ? "rgba(255,255,255,0.1)" : "#e2e8f0",
                        borderRadius: "12px",
                        color: dk ? "#ffffff" : "#1e293b",
                        fontSize: "12px",
                      }}

                      formatter={(val: any, _: any, item: any) => [
                        `${val} Trained (${item?.payload?.batches} batches, ⭐${item?.payload?.rating})`,
                        item?.payload?.name,
                      ]}
                    />
                    <Bar dataKey="trained" radius={[0, 6, 6, 0]}>
                      {INSTITUTE_THROUGHPUT_DATA.map((d, i) => (
                        <Cell key={i} fill={d.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Candidate Intake Line Chart */}
            <div className={`border ${card} p-6 space-y-4`}>
              <div>
                <h3 className={`text-base font-bold ${ht}`}>
                  Monthly Candidate Intake Trend
                </h3>
                <p className={`text-xs mt-0.5 ${mt}`}>
                  Platform-wide candidates entering training per month
                </p>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={INSTITUTE_MONTHLY_DATA}
                    margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="instituteGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#34d399"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#34d399"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={
                        dk ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"
                      }
                    />
                    <XAxis
                      dataKey="month"
                      tick={{
                        fontSize: 11,
                        fill: dk ? "rgba(255,255,255,0.4)" : "#64748b",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{
                        fontSize: 11,
                        fill: dk ? "rgba(255,255,255,0.4)" : "#64748b",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: dk ? "#0f2035" : "#ffffff",
                        borderColor: dk ? "rgba(255,255,255,0.1)" : "#e2e8f0",
                        borderRadius: "12px",
                        color: dk ? "#ffffff" : "#1e293b",
                        fontSize: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="candidates"
                      name="Candidates"
                      stroke="#34d399"
                      strokeWidth={2.5}
                      dot={{ fill: "#34d399", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────
          TAB 5: Course Reports (PRD 2.11)
          ───────────────────────────────────────────────────────────────────── */}
      {activeTab === "courses" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Enrollment Pie */}
            <div className={`border ${card} p-6 space-y-4`}>
              <div>
                <h3 className={`text-base font-bold ${ht}`}>
                  Course Category Enrollment Share
                </h3>
                <p className={`text-xs mt-0.5 ${mt}`}>
                  Total enrollments distributed across maritime training
                  categories
                </p>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={COURSE_CATEGORY_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {COURSE_CATEGORY_DATA.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: dk ? "#0f2035" : "#ffffff",
                        borderColor: dk ? "rgba(255,255,255,0.1)" : "#e2e8f0",
                        borderRadius: "12px",
                        color: dk ? "#ffffff" : "#1e293b",
                        fontSize: "12px",
                      }}

                      formatter={(val: any, _: any, item: any) => [
                        `${val} Enrolled`,
                        item?.payload?.name,
                      ]}
                    />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Completion vs Pass Rate Grouped Bar */}
            <div className={`border ${card} p-6 space-y-4`}>
              <div>
                <h3 className={`text-base font-bold ${ht}`}>
                  Course Completion & Pass Rates
                </h3>
                <p className={`text-xs mt-0.5 ${mt}`}>
                  Completion rate vs pass rate per course code
                </p>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={COURSE_COMPLETION_DATA}
                    margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={
                        dk ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"
                      }
                    />
                    <XAxis
                      dataKey="name"
                      tick={{
                        fontSize: 9,
                        fill: dk ? "rgba(255,255,255,0.4)" : "#64748b",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[70, 100]}
                      tick={{
                        fontSize: 11,
                        fill: dk ? "rgba(255,255,255,0.4)" : "#64748b",
                      }}
                      axisLine={false}
                      tickLine={false}
                      unit="%"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: dk ? "#0f2035" : "#ffffff",
                        borderColor: dk ? "rgba(255,255,255,0.1)" : "#e2e8f0",
                        borderRadius: "12px",
                        color: dk ? "#ffffff" : "#1e293b",
                        fontSize: "12px",
                      }}
                    />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: "11px" }}
                    />
                    <Bar
                      dataKey="completion"
                      name="Completion %"
                      fill="#38bdf8"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="passRate"
                      name="Pass Rate %"
                      fill="#34d399"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────
          TAB 6: Admin Reports (PRD 2.12)
          ───────────────────────────────────────────────────────────────────── */}
      {activeTab === "admins" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Admin Role Distribution Radial */}
            <div className={`border ${card} p-6 space-y-4`}>
              <div>
                <h3 className={`text-base font-bold ${ht}`}>
                  Admin Role Distribution
                </h3>
                <p className={`text-xs mt-0.5 ${mt}`}>
                  Breakdown of administrators by assigned role hierarchy
                </p>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="20%"
                    outerRadius="90%"
                    data={ADMIN_ROLE_DATA}
                    startAngle={180}
                    endAngle={0}
                  >
                    <RadialBar
                      dataKey="value"
                      label={{
                        position: "insideStart",
                        fill: dk ? "#fff" : "#1e293b",
                        fontSize: 10,
                      }}
                    />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: dk ? "#0f2035" : "#ffffff",
                        borderColor: dk ? "rgba(255,255,255,0.1)" : "#e2e8f0",
                        borderRadius: "12px",
                        color: dk ? "#ffffff" : "#1e293b",
                        fontSize: "12px",
                      }}

                      formatter={(val: any, _: any, item: any) => [
                        `${val} Admin(s)`,
                        item?.payload?.name,
                      ]}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Admin Weekly Login Activity */}
            <div className={`border ${card} p-6 space-y-4`}>
              <div>
                <h3 className={`text-base font-bold ${ht}`}>
                  Admin Weekly Login Activity
                </h3>
                <p className={`text-xs mt-0.5 ${mt}`}>
                  Platform login sessions by admins across the current week
                </p>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={ADMIN_ACTIVITY_DATA}
                    margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={
                        dk ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"
                      }
                    />
                    <XAxis
                      dataKey="day"
                      tick={{
                        fontSize: 11,
                        fill: dk ? "rgba(255,255,255,0.4)" : "#64748b",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{
                        fontSize: 11,
                        fill: dk ? "rgba(255,255,255,0.4)" : "#64748b",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: dk ? "#0f2035" : "#ffffff",
                        borderColor: dk ? "rgba(255,255,255,0.1)" : "#e2e8f0",
                        borderRadius: "12px",
                        color: dk ? "#ffffff" : "#1e293b",
                        fontSize: "12px",
                      }}
                      formatter={(val: unknown) => [
                        `${val} Logins`,
                        "Sessions",
                      ]}
                    />
                    <Bar
                      dataKey="logins"
                      name="Login Sessions"
                      radius={[4, 4, 0, 0]}
                    >
                      {ADMIN_ACTIVITY_DATA.map((_, i) => (
                        <Cell key={i} fill={i === 3 ? "#818cf8" : "#38bdf8"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────
          TAB 7: Course Progress Reports
          ───────────────────────────────────────────────────────────────────── */}
      {activeTab === "progress" &&
        (() => {
          const progressStatusCounts = ["Completed", "Ongoing", "On Hold"].map(
            (st, i) => ({
              ...PROGRESS_STATUS_DATA[i],
              value: allEnrollmentProgress.filter((e) => e.status === st)
                .length,
            }),
          );
          return (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Progress Status Pie */}
                <div className={`border ${card} p-6 space-y-4`}>
                  <div>
                    <h3 className={`text-base font-bold ${ht}`}>
                      Enrollment Progress Status
                    </h3>
                    <p className={`text-xs mt-0.5 ${mt}`}>
                      Current status split across all active course enrollments
                    </p>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={progressStatusCounts}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={95}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {progressStatusCounts.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: dk ? "#0f2035" : "#ffffff",
                            borderColor: dk
                              ? "rgba(255,255,255,0.1)"
                              : "#e2e8f0",
                            borderRadius: "12px",
                            color: dk ? "#ffffff" : "#1e293b",
                            fontSize: "12px",
                          }}

                          formatter={(val: any, _: any, item: any) => [
                            `${val} Enrollments`,
                            item?.payload?.name,
                          ]}
                        />
                        <Legend
                          iconType="circle"
                          iconSize={8}
                          wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Monthly Progress Area Chart */}
                <div className={`border ${card} p-6 space-y-4`}>
                  <div>
                    <h3 className={`text-base font-bold ${ht}`}>
                      Monthly Course Progress Trend
                    </h3>
                    <p className={`text-xs mt-0.5 ${mt}`}>
                      Completions, ongoing training, and on-hold counts over
                      time
                    </p>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={PROGRESS_MONTHLY_DATA}
                        margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="completionGrad"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#34d399"
                              stopOpacity={0.35}
                            />
                            <stop
                              offset="95%"
                              stopColor="#34d399"
                              stopOpacity={0}
                            />
                          </linearGradient>
                          <linearGradient
                            id="ongoingGrad"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#818cf8"
                              stopOpacity={0.25}
                            />
                            <stop
                              offset="95%"
                              stopColor="#818cf8"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={
                            dk ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"
                          }
                        />
                        <XAxis
                          dataKey="month"
                          tick={{
                            fontSize: 11,
                            fill: dk ? "rgba(255,255,255,0.4)" : "#64748b",
                          }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{
                            fontSize: 11,
                            fill: dk ? "rgba(255,255,255,0.4)" : "#64748b",
                          }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: dk ? "#0f2035" : "#ffffff",
                            borderColor: dk
                              ? "rgba(255,255,255,0.1)"
                              : "#e2e8f0",
                            borderRadius: "12px",
                            color: dk ? "#ffffff" : "#1e293b",
                            fontSize: "12px",
                          }}
                        />
                        <Legend
                          iconType="circle"
                          iconSize={8}
                          wrapperStyle={{ fontSize: "11px" }}
                        />
                        <Area
                          type="monotone"
                          dataKey="completions"
                          name="Completed"
                          stroke="#34d399"
                          strokeWidth={2.5}
                          fill="url(#completionGrad)"
                        />
                        <Area
                          type="monotone"
                          dataKey="ongoing"
                          name="Ongoing"
                          stroke="#818cf8"
                          strokeWidth={2}
                          fill="url(#ongoingGrad)"
                        />
                        <Area
                          type="monotone"
                          dataKey="onHold"
                          name="On Hold"
                          stroke="#fbbf24"
                          strokeWidth={1.5}
                          fill="none"
                          strokeDasharray="4 3"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
