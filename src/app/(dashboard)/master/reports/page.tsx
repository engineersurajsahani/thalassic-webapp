"use client";

import React, { useState, useMemo } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  FileText, Calendar, RefreshCw, Filter,
  TrendingUp, Users, UserCog, BarChart3,
  Activity, ArrowUpRight, X, Check, FileSpreadsheet,
  Printer, Download, Search, ShieldCheck, ClipboardList,
  GraduationCap, BookOpen, Building2, Handshake,
  Clock, AlertCircle, CheckCircle2, ChevronDown, ArrowUpDown,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie,
} from "recharts";
import * as XLSX from "xlsx";
import {
  MOCK_INSTITUTES,
  MOCK_COURSES,
  MOCK_PARTNERS,
  MOCK_SEAFARERS,
} from "@/data/master-portal-mock";

// Secondary report categories (PRD 2.7)
type ReportTab =
  | "overview"
  | "seafarers"
  | "partners"
  | "institutes"
  | "courses"
  | "admins"
  | "progress";

const REPORT_TABS: { id: ReportTab; label: string; icon: React.ElementType }[] = [
  { id: "overview",   label: "Reports Overview",        icon: BarChart3      },
  { id: "seafarers",  label: "Seafarer Reports",        icon: Users          },
  { id: "partners",   label: "Partner Reports",         icon: Handshake      },
  { id: "institutes", label: "Institute Reports",       icon: GraduationCap  },
  { id: "courses",    label: "Course Reports",          icon: BookOpen       },
  { id: "admins",     label: "Admin Reports",           icon: UserCog        },
  { id: "progress",   label: "Course Progress Reports", icon: ClipboardList  },
];

// Admin mock records for 2.12
const ADMIN_RECORDS = [
  { id: "ADM-01", name: "Suraj Sahani",     role: "Master Super Admin", company: "Hari Om Corporate", status: "Active",   lastActive: "10 mins ago" },
  { id: "ADM-02", name: "Kirthish Shetty",  role: "Master Admin",       company: "Hari Om Corporate", status: "Active",   lastActive: "Just now"    },
  { id: "ADM-03", name: "Capt. M. Rao",     role: "Company Admin",      company: "ABC Shipping Ltd",  status: "Active",   lastActive: "2 hours ago" },
  { id: "ADM-04", name: "Rajeshwar Sen",    role: "Company Admin",      company: "Anglo-Eastern Group",status: "Active",  lastActive: "1 day ago"   },
  { id: "ADM-05", name: "Capt. Rajiv Mehta",role: "Partner Admin",      company: "Ocean Maritime Services", status: "Active", lastActive: "15 mins ago" },
  { id: "ADM-06", name: "Ms. Ananya Roy",   role: "Partner Admin",      company: "SeaStar Crewing",   status: "Active",   lastActive: "3 hours ago" },
  { id: "ADM-07", name: "T. Sundar",        role: "Partner Admin",      company: "Pacific Nautical",  status: "Inactive", lastActive: "2 weeks ago" },
];

export default function MasterReportsPage() {
  const { theme } = useTheme();
  const dk = theme === "dark";

  // Navigation tab
  const [activeTab, setActiveTab] = useState<ReportTab>("overview");

  // Universal Filters (PRD 2.14)
  const [search, setSearch]             = useState("");
  const [dateRange, setDateRange]       = useState("All Time");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [instFilter, setInstFilter]     = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");

  // Sorting
  const [sortField, setSortField] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Theme styling tokens
  const card    = dk ? "bg-[#0c1a2e] border-white/5 rounded-2xl" : "bg-white border-slate-200 rounded-2xl shadow-sm";
  const ht      = dk ? "text-white" : "text-slate-800";
  const mt      = dk ? "text-white/40" : "text-slate-400";
  const inputBg = dk ? "bg-[#0a1525] border-white/8 text-white placeholder-white/20 focus:border-sky-500/40" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-sky-400";
  const rowHover= dk ? "border-white/5 hover:bg-white/3" : "border-slate-100 hover:bg-slate-50";
  const thCls   = dk ? "text-white/30 border-white/5" : "text-slate-400 border-slate-100";

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // Universal Export to XLSX / CSV (PRD 2.15)
  // ───────────────────────────────────────────────────────────────────────────
  const handleExport = (format: "xlsx" | "csv") => {
    let exportData: any[] = [];
    let filename = `hariom_${activeTab}_report`;

    if (activeTab === "seafarers" || activeTab === "overview") {
      exportData = filteredSeafarers.map(s => ({
        "Seafarer ID": s.id,
        "Full Name": s.name,
        "INDOS": s.indosNumber,
        "CDC": s.cdcNumber,
        "Rank": s.rank,
        "Source Type": s.sourceType,
        "Source Name": s.sourceName,
        "Operational Status": s.status,
        "Joined Date": s.createdDate,
      }));
    } else if (activeTab === "partners") {
      exportData = filteredPartners.map(p => ({
        "Partner ID": p.id,
        "Agency Name": p.agencyName,
        "RPSL License": p.rpslNumber,
        "Contact Person": p.contactPerson,
        "Associated Seafarers": p.totalSeafarers,
        "Course Purchases": p.totalCoursePurchases,
        "Status": p.status,
      }));
    } else if (activeTab === "institutes") {
      exportData = filteredInstitutes.map(i => ({
        "Institute ID": i.id,
        "Institute Name": i.name,
        "IDT Number": i.idtNumber,
        "Location": i.location,
        "Courses Conducted": i.coursesOffered.length,
        "Total Candidates Trained": i.totalCandidatesTrained,
        "Active Batches": i.activeBatches,
        "Status": i.status,
      }));
    } else if (activeTab === "courses") {
      exportData = filteredCourses.map(c => ({
        "Course Code": c.code,
        "Title": c.title,
        "Category": c.category,
        "Duration": c.duration,
        "Enrolled Seafarers": c.enrolledCount,
        "Associated Institutes Count": c.associatedInstituteIds.length,
        "Status": c.status,
      }));
    } else if (activeTab === "admins") {
      exportData = filteredAdmins.map(a => ({
        "Admin ID": a.id,
        "Name": a.name,
        "Role": a.role,
        "Organization": a.company,
        "Status": a.status,
        "Last Active": a.lastActive,
      }));
    } else if (activeTab === "progress") {
      exportData = allEnrollmentProgress.map(e => ({
        "Enrollment ID": e.id,
        "Seafarer Name": e.seafarerName,
        "Course Title": e.courseTitle,
        "Training Institute": e.instituteName,
        "Batch": e.batch,
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
  const filteredSeafarers = useMemo(() => {
    return MOCK_SEAFARERS.filter(s => {
      const q = search.toLowerCase();
      const matchQ = s.name.toLowerCase().includes(q) || s.indosNumber.toLowerCase().includes(q) || s.cdcNumber.toLowerCase().includes(q);
      const matchSource = sourceFilter === "all" || s.sourceType === sourceFilter;
      const matchStatus = statusFilter === "all" || s.status.toLowerCase() === statusFilter.toLowerCase();
      return matchQ && matchSource && matchStatus;
    }).sort((a, b) => {
      const vA = (a as any)[sortField] || a.name;
      const vB = (b as any)[sortField] || b.name;
      return sortOrder === "asc" ? String(vA).localeCompare(String(vB)) : String(vB).localeCompare(String(vA));
    });
  }, [search, sourceFilter, statusFilter, sortField, sortOrder]);

  // 2.9 Partners
  const filteredPartners = useMemo(() => {
    return MOCK_PARTNERS.filter(p => {
      const q = search.toLowerCase();
      const matchQ = p.name.toLowerCase().includes(q) || p.agencyName.toLowerCase().includes(q) || p.rpslNumber.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      return matchQ && matchStatus;
    });
  }, [search, statusFilter]);

  // 2.10 Institutes
  const filteredInstitutes = useMemo(() => {
    return MOCK_INSTITUTES.filter(i => {
      const q = search.toLowerCase();
      const matchQ = i.name.toLowerCase().includes(q) || i.idtNumber.toLowerCase().includes(q) || i.location.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || i.status === statusFilter;
      return matchQ && matchStatus;
    });
  }, [search, statusFilter]);

  // 2.11 Courses
  const filteredCourses = useMemo(() => {
    return MOCK_COURSES.filter(c => {
      const q = search.toLowerCase();
      const matchQ = c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q);
      const matchInst = instFilter === "all" || c.associatedInstituteIds.includes(instFilter);
      return matchQ && matchInst;
    });
  }, [search, instFilter]);

  // 2.12 Admins
  const filteredAdmins = useMemo(() => {
    return ADMIN_RECORDS.filter(a => {
      const q = search.toLowerCase();
      return a.name.toLowerCase().includes(q) || a.role.toLowerCase().includes(q) || a.company.toLowerCase().includes(q);
    });
  }, [search]);

  // 2.13 Course Progress Data
  const allEnrollmentProgress = useMemo(() => {
    return MOCK_SEAFARERS.flatMap(sf =>
      sf.enrollments.map(e => ({
        ...e,
        seafarerId: sf.id,
        seafarerName: sf.name,
        seafarerRank: sf.rank,
        seafarerStatus: sf.status,
      }))
    ).filter(e => {
      const q = search.toLowerCase();
      const matchQ = e.seafarerName.toLowerCase().includes(q) || e.courseTitle.toLowerCase().includes(q) || e.instituteName.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || e.status.toLowerCase() === statusFilter.toLowerCase();
      const matchInst = instFilter === "all" || e.instituteId === instFilter;
      const matchCourse = courseFilter === "all" || e.courseId === courseFilter;
      return matchQ && matchStatus && matchInst && matchCourse;
    });
  }, [search, statusFilter, instFilter, courseFilter]);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-xl font-bold ${ht}`}>Operational & Analytical Reports</h1>
          <p className={`text-sm mt-0.5 ${mt}`}>
            Platform analytics, candidate progress tracking, institute performance, and partner reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport("xlsx")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors ${
              dk ? "border-white/10 text-white/70 hover:bg-white/5" : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" /> Export Excel
          </button>
          <button
            onClick={() => handleExport("csv")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors ${
              dk ? "border-white/10 text-white/70 hover:bg-white/5" : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Download className="w-3.5 h-3.5 text-sky-500" /> Export CSV
          </button>
          <button
            onClick={() => window.print()}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors ${
              dk ? "border-white/10 text-white/70 hover:bg-white/5" : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
        </div>
      </div>

      {/* PRD 2.16 Separation of Finance and Reports Note */}
      <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
        dk ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-300" : "bg-indigo-50 border-indigo-200 text-indigo-800"
      }`}>
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>
            <strong>Separation of Finance & Reports (PRD §2.16):</strong> Reports contain operational performance, seafarer course completions, institute throughput, and partner activity. Financial ledger transactions remain strictly in <strong>Finance</strong>.
          </span>
        </div>
      </div>

      {/* Secondary Navigation Tabs (PRD 2.7) */}
      <div className={`flex items-center gap-1 border-b overflow-x-auto pb-px ${dk ? "border-white/8" : "border-slate-200"}`}>
        {REPORT_TABS.map(tab => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSearch(""); setStatusFilter("all"); }}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all whitespace-nowrap border-b-2 -mb-px ${
                isActive
                  ? (dk ? "border-indigo-500 text-indigo-400 bg-indigo-500/10" : "border-indigo-600 text-indigo-700 bg-indigo-50")
                  : (dk ? "border-transparent text-white/50 hover:text-white/80 hover:bg-white/5" : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100")
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? (dk ? "text-indigo-400" : "text-indigo-600") : "opacity-60"}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Universal Filters Bar (PRD 2.14) */}
      <div className={`border ${card} p-4 flex flex-wrap items-center justify-between gap-3`}>
        <div className="relative flex-1 min-w-[240px]">
          <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${mt}`} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={`Search across ${activeTab} data...`}
            className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border ${inputBg}`}
          />
        </div>

        {/* Dynamic Contextual Filters */}
        {(activeTab === "seafarers" || activeTab === "overview") && (
          <div className="flex items-center gap-1.5">
            <span className={`text-[11px] font-semibold uppercase ${mt}`}>Source:</span>
            {["all", "Company", "Partner", "Direct"].map(src => (
              <button
                key={src}
                onClick={() => setSourceFilter(src)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl capitalize transition-colors ${
                  sourceFilter === src
                    ? "bg-indigo-600 text-white shadow-sm"
                    : dk ? "bg-white/5 text-white/50 hover:bg-white/10" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {src === "all" ? "All" : src}
              </button>
            ))}
          </div>
        )}

        {(activeTab === "seafarers" || activeTab === "progress") && (
          <div className="flex items-center gap-1.5">
            <span className={`text-[11px] font-semibold uppercase ${mt}`}>Status:</span>
            {["all", "Active", "Ongoing", "On Hold", "Completed", "Inactive"].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-xl capitalize transition-colors ${
                  statusFilter.toLowerCase() === st.toLowerCase()
                    ? "bg-indigo-600 text-white shadow-sm"
                    : dk ? "bg-white/5 text-white/50 hover:bg-white/10" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
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
              onChange={e => setInstFilter(e.target.value)}
              className={`w-full px-3 py-2 text-xs rounded-xl appearance-none pr-8 cursor-pointer border ${inputBg}`}
            >
              <option value="all">All Institutes ({MOCK_INSTITUTES.length})</option>
              {MOCK_INSTITUTES.map(i => (
                <option key={i.id} value={i.id}>{i.name}</option>
              ))}
            </select>
            <ChevronDown className={`w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${mt}`} />
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
              { label: "Total Seafarers",      val: MOCK_SEAFARERS.length,                                      sub: "Master records registered", Icon: Users,        c: "text-sky-400",    bg: dk ? "bg-sky-500/10" : "bg-sky-50" },
              { label: "Active Partners",      val: MOCK_PARTNERS.filter(p => p.status === "active").length,    sub: "RPSL agencies active",      Icon: Handshake,    c: "text-violet-400", bg: dk ? "bg-violet-500/10" : "bg-violet-50" },
              { label: "Training Institutes",  val: MOCK_INSTITUTES.length,                                     sub: "Accredited academies",      Icon: GraduationCap,c: "text-emerald-400",bg: dk ? "bg-emerald-500/10" : "bg-emerald-50" },
              { label: "Candidates on Hold",   val: MOCK_SEAFARERS.filter(s => s.status === "On Hold").length,  sub: "Require documentation",     Icon: AlertCircle,  c: "text-amber-400",  bg: dk ? "bg-amber-500/10" : "bg-amber-50" },
            ].map(k => (
              <div key={k.label} className={`border ${card} p-4 flex items-center gap-3`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${k.bg}`}>
                  <k.Icon className={`w-5 h-5 ${k.c}`} />
                </div>
                <div>
                  <p className={`text-xl font-bold leading-tight ${ht}`}>{k.val}</p>
                  <p className={`text-xs font-semibold mt-0.5 ${ht} opacity-75`}>{k.label}</p>
                  <p className={`text-[11px] mt-0.5 ${mt}`}>{k.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Seafarer Distribution & Source Breakdown */}
          <div className={`border ${card} p-6 space-y-4`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-base font-bold ${ht}`}>Seafarer Source & Enrollment Distribution</h3>
                <p className={`text-xs ${mt}`}>Comparative breakdown of Company vs Partner seafarers</p>
              </div>
              <span className={`text-xs ${mt}`}>Live Platform Analytics</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className={`p-4 rounded-xl border ${dk ? "bg-white/3 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                <p className={`text-xs font-semibold uppercase ${mt}`}>Company Seafarers</p>
                <p className="text-2xl font-bold mt-1 text-sky-400">
                  {MOCK_SEAFARERS.filter(s => s.sourceType === "Company").length}
                </p>
                <p className={`text-[11px] mt-1 ${mt}`}>Direct shipping corporate employees</p>
              </div>
              <div className={`p-4 rounded-xl border ${dk ? "bg-white/3 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                <p className={`text-xs font-semibold uppercase ${mt}`}>Partner Seafarers</p>
                <p className="text-2xl font-bold mt-1 text-violet-400">
                  {MOCK_SEAFARERS.filter(s => s.sourceType === "Partner").length}
                </p>
                <p className={`text-[11px] mt-1 ${mt}`}>Enrolled via RPSL crewing agencies</p>
              </div>
              <div className={`p-4 rounded-xl border ${dk ? "bg-white/3 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                <p className={`text-xs font-semibold uppercase ${mt}`}>Direct Registrations</p>
                <p className="text-2xl font-bold mt-1 text-emerald-400">
                  {MOCK_SEAFARERS.filter(s => s.sourceType === "Direct").length}
                </p>
                <p className={`text-[11px] mt-1 ${mt}`}>Independent merchant navy officers</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────
          TAB 2: Seafarer Reports (PRD 2.8)
          ───────────────────────────────────────────────────────────────────── */}
      {activeTab === "seafarers" && (
        <div className={`border ${card} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b text-[11px] font-semibold uppercase tracking-wider ${thCls}`}>
                  <th onClick={() => toggleSort("name")} className="text-left px-6 py-3.5 cursor-pointer hover:underline">
                    Seafarer Name <ArrowUpDown className="w-3 h-3 inline ml-1" />
                  </th>
                  <th className="text-left px-6 py-3.5">INDOS / CDC</th>
                  <th className="text-left px-6 py-3.5">Rank</th>
                  <th className="text-left px-6 py-3.5">Source Type (PRD §2.8)</th>
                  <th className="text-left px-6 py-3.5">Source Attribution</th>
                  <th className="text-left px-6 py-3.5">Course Enrollments</th>
                  <th className="text-left px-6 py-3.5">Operational Status</th>
                  <th className="text-left px-6 py-3.5">Registration Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredSeafarers.map(s => (
                  <tr key={s.id} className={`${rowHover} transition-colors border-b`}>
                    <td className="px-6 py-4">
                      <p className={`font-semibold text-[13px] ${ht}`}>{s.name}</p>
                      <p className={`text-[11px] ${mt}`}>{s.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`text-[12px] font-mono ${ht}`}>{s.indosNumber}</p>
                      <p className={`text-[10px] font-mono ${mt}`}>CDC: {s.cdcNumber}</p>
                    </td>
                    <td className={`px-6 py-4 text-[12px] ${ht}`}>{s.rank}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        s.sourceType === "Partner"
                          ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
                          : s.sourceType === "Company"
                          ? "bg-sky-500/10 text-sky-400 border-sky-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}>
                        {s.sourceType}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-[12px] ${ht}`}>{s.sourceName}</td>
                    <td className={`px-6 py-4 text-[12px] font-semibold ${ht}`}>{s.enrollments.length} Courses</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        s.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                        s.status === "Ongoing" ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" :
                        s.status === "On Hold" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                        s.status === "Completed" ? "bg-teal-500/10 text-teal-400 border-teal-500/20" :
                        "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-[12px] ${mt}`}>{s.createdDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={`px-6 py-3.5 border-t ${dk ? "border-white/5" : "border-slate-100"} flex items-center justify-between text-xs ${mt}`}>
            <span>Showing {filteredSeafarers.length} seafarer analytics records</span>
            <span>Compliant with PRD §2.8</span>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────
          TAB 3: Partner Reports (PRD 2.9)
          ───────────────────────────────────────────────────────────────────── */}
      {activeTab === "partners" && (
        <div className={`border ${card} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b text-[11px] font-semibold uppercase tracking-wider ${thCls}`}>
                  <th className="text-left px-6 py-3.5">Partner / Agency</th>
                  <th className="text-left px-6 py-3.5">RPSL License</th>
                  <th className="text-left px-6 py-3.5">Contact Person</th>
                  <th className="text-left px-6 py-3.5">Associated Seafarers (PRD §2.9)</th>
                  <th className="text-left px-6 py-3.5">Course Purchases Processed</th>
                  <th className="text-left px-6 py-3.5">Operational Status</th>
                  <th className="text-left px-6 py-3.5">Last Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPartners.map(p => (
                  <tr key={p.id} className={`${rowHover} transition-colors border-b`}>
                    <td className="px-6 py-4">
                      <p className={`font-semibold text-[13px] ${ht}`}>{p.name}</p>
                      <p className={`text-[11px] ${mt}`}>{p.agencyName}</p>
                    </td>
                    <td className={`px-6 py-4 text-[12px] font-mono ${dk ? "text-violet-300" : "text-violet-700"}`}>{p.rpslNumber}</td>
                    <td className={`px-6 py-4 text-[12px] ${ht}`}>{p.contactPerson}</td>
                    <td className={`px-6 py-4 text-[13px] font-bold ${ht}`}>{p.totalSeafarers}</td>
                    <td className={`px-6 py-4 text-[13px] font-semibold ${ht}`}>{p.totalCoursePurchases} purchases</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        p.status === "active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-[12px] ${mt}`}>{p.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={`px-6 py-3.5 border-t ${dk ? "border-white/5" : "border-slate-100"} flex items-center justify-between text-xs ${mt}`}>
            <span>Showing {filteredPartners.length} partner operational records</span>
            <span>Financial settlement information is separated under Finance (PRD §2.9 & §2.16)</span>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────
          TAB 4: Institute Reports (PRD 2.10)
          ───────────────────────────────────────────────────────────────────── */}
      {activeTab === "institutes" && (
        <div className={`border ${card} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b text-[11px] font-semibold uppercase tracking-wider ${thCls}`}>
                  <th className="text-left px-6 py-3.5">Institute Name (PRD §2.10)</th>
                  <th className="text-left px-6 py-3.5">IDT Number</th>
                  <th className="text-left px-6 py-3.5">Location</th>
                  <th className="text-left px-6 py-3.5">Courses Offered</th>
                  <th className="text-left px-6 py-3.5">Active Batches</th>
                  <th className="text-left px-6 py-3.5">Total Candidates Trained</th>
                  <th className="text-left px-6 py-3.5">Rating</th>
                  <th className="text-left px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredInstitutes.map(i => (
                  <tr key={i.id} className={`${rowHover} transition-colors border-b`}>
                    <td className="px-6 py-4">
                      <p className={`font-semibold text-[13px] ${ht}`}>{i.name}</p>
                      <p className={`text-[10px] ${mt}`}>Approval: {i.approvalNumber}</p>
                    </td>
                    <td className={`px-6 py-4 text-[12px] font-mono ${dk ? "text-sky-300" : "text-sky-700"}`}>{i.idtNumber}</td>
                    <td className={`px-6 py-4 text-[12px] ${mt}`}>{i.location}</td>
                    <td className={`px-6 py-4 text-[12px] font-semibold ${ht}`}>{i.coursesOffered.length} Courses</td>
                    <td className={`px-6 py-4 text-[12px] font-bold ${ht}`}>{i.activeBatches}</td>
                    <td className={`px-6 py-4 text-[13px] font-bold text-emerald-400`}>{i.totalCandidatesTrained.toLocaleString()}</td>
                    <td className={`px-6 py-4 text-[12px] font-medium ${ht}`}>⭐ {i.rating}</td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {i.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={`px-6 py-3.5 border-t ${dk ? "border-white/5" : "border-slate-100"} flex items-center justify-between text-xs ${mt}`}>
            <span>Showing {filteredInstitutes.length} training academies</span>
            <span>Comparative operational throughput (PRD §2.10)</span>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────
          TAB 5: Course Reports (PRD 2.11)
          ───────────────────────────────────────────────────────────────────── */}
      {activeTab === "courses" && (
        <div className={`border ${card} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b text-[11px] font-semibold uppercase tracking-wider ${thCls}`}>
                  <th className="text-left px-6 py-3.5">Course Code & Title</th>
                  <th className="text-left px-6 py-3.5">Category</th>
                  <th className="text-left px-6 py-3.5">Duration</th>
                  <th className="text-left px-6 py-3.5">Enrolled Seafarers</th>
                  <th className="text-left px-6 py-3.5">Accredited Institutes (PRD §2.11)</th>
                  <th className="text-left px-6 py-3.5">Completion Rate</th>
                  <th className="text-left px-6 py-3.5">Catalog Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredCourses.map(c => (
                  <tr key={c.id} className={`${rowHover} transition-colors border-b`}>
                    <td className="px-6 py-4">
                      <p className={`font-semibold text-[13px] ${ht}`}>{c.title}</p>
                      <p className={`text-[10px] font-mono ${mt}`}>{c.code}</p>
                    </td>
                    <td className={`px-6 py-4 text-[12px] ${ht}`}>{c.category}</td>
                    <td className={`px-6 py-4 text-[12px] ${mt}`}>{c.duration}</td>
                    <td className={`px-6 py-4 text-[13px] font-bold ${ht}`}>{c.enrolledCount}</td>
                    <td className="px-6 py-4">
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-white/5 border border-white/10">
                        {c.associatedInstituteIds.length} Institutes
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full bg-emerald-400" style={{ width: `${Math.min(100, Math.round((c.rating / 5) * 100))}%` }} />
                        </div>
                        <span className="text-xs font-semibold">{Math.round((c.rating / 5) * 100)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        c.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                      }`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={`px-6 py-3.5 border-t ${dk ? "border-white/5" : "border-slate-100"} flex items-center justify-between text-xs ${mt}`}>
            <span>Showing {filteredCourses.length} courses</span>
            <span>Multi-institute course activity (PRD §2.11)</span>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────
          TAB 6: Admin Reports (PRD 2.12)
          ───────────────────────────────────────────────────────────────────── */}
      {activeTab === "admins" && (
        <div className={`border ${card} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b text-[11px] font-semibold uppercase tracking-wider ${thCls}`}>
                  <th className="text-left px-6 py-3.5">Admin ID & Name</th>
                  <th className="text-left px-6 py-3.5">Administrative Role (PRD §2.12)</th>
                  <th className="text-left px-6 py-3.5">Organization / Association</th>
                  <th className="text-left px-6 py-3.5">Status</th>
                  <th className="text-left px-6 py-3.5">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredAdmins.map(a => (
                  <tr key={a.id} className={`${rowHover} transition-colors border-b`}>
                    <td className="px-6 py-4">
                      <p className={`font-semibold text-[13px] ${ht}`}>{a.name}</p>
                      <p className={`text-[10px] font-mono ${mt}`}>{a.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        a.role.includes("Master") ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" :
                        a.role.includes("Company") ? "bg-sky-500/10 text-sky-400 border-sky-500/20" :
                        "bg-violet-500/10 text-violet-400 border-violet-500/20"
                      }`}>
                        {a.role}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-[12px] ${ht}`}>{a.company}</td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {a.status}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-[12px] ${mt}`}>{a.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={`px-6 py-3.5 border-t ${dk ? "border-white/5" : "border-slate-100"} flex items-center justify-between text-xs ${mt}`}>
            <span>Showing {filteredAdmins.length} administrative users</span>
            <span>Seafarers are strictly excluded from Admin Management reports (PRD §2.12)</span>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────
          TAB 7: Course Progress Reports (PRD 2.13)
          ───────────────────────────────────────────────────────────────────── */}
      {activeTab === "progress" && (
        <div className={`border ${card} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b text-[11px] font-semibold uppercase tracking-wider ${thCls}`}>
                  <th className="text-left px-6 py-3.5">Seafarer Trainee</th>
                  <th className="text-left px-6 py-3.5">Course Title</th>
                  <th className="text-left px-6 py-3.5">Conducting Institute</th>
                  <th className="text-left px-6 py-3.5">Batch</th>
                  <th className="text-left px-6 py-3.5">Course Progress (PRD §2.13)</th>
                  <th className="text-left px-6 py-3.5">Operational Status</th>
                  <th className="text-left px-6 py-3.5">Start Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {allEnrollmentProgress.map(e => (
                  <tr key={e.id} className={`${rowHover} transition-colors border-b`}>
                    <td className="px-6 py-4">
                      <p className={`font-semibold text-[13px] ${ht}`}>{e.seafarerName}</p>
                      <p className={`text-[10px] font-mono ${mt}`}>{e.seafarerRank} · ID: {e.seafarerId}</p>
                    </td>
                    <td className={`px-6 py-4 text-[12px] font-medium ${ht}`}>{e.courseTitle}</td>
                    <td className={`px-6 py-4 text-[12px] ${mt}`}>{e.instituteName}</td>
                    <td className={`px-6 py-4 text-[12px] font-mono ${ht}`}>{e.batch}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className={`h-full ${e.progressPercent === 100 ? "bg-teal-400" : e.status === "On Hold" ? "bg-amber-400" : "bg-sky-400"}`}
                            style={{ width: `${e.progressPercent}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold">{e.progressPercent}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        e.status === "Completed" ? "bg-teal-500/10 text-teal-400 border-teal-500/20" :
                        e.status === "Ongoing" ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" :
                        "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}>
                        {e.status}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-[12px] ${mt}`}>{e.startDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={`px-6 py-3.5 border-t ${dk ? "border-white/5" : "border-slate-100"} flex items-center justify-between text-xs ${mt}`}>
            <span>Showing {allEnrollmentProgress.length} active course enrollments</span>
            <span>Compliant with PRD §2.13 (Course Progress and Candidate Status)</span>
          </div>
        </div>
      )}

    </div>
  );
}
