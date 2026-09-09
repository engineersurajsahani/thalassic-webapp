"use client";
import toast from 'react-hot-toast';

import React, { useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  Users, Search, Eye, Edit,
  CheckCircle2, Clock, XCircle, AlertCircle,
  Building2, Handshake,
  Download, X, Check, FileText,
  CreditCard, ShieldCheck,
  ArrowUpDown, Globe,
} from "lucide-react";

export type PurchaseRecord = {
  id: string;
  courseName: string;
  source: string; // e.g., "Company - ABC Shipping", "Partner - Ocean Maritime", "Direct - Hari Om"
  amount: number;
  date: string;
  paymentMethod: string;
  status: "Completed" | "Pending" | "Refunded";
};

export type EnrollmentRecord = {
  id: string;
  courseName: string;
  institute: string;
  batch: string;
  source: string;
  progress: number;
  status: "Ongoing" | "Completed" | "On Hold";
};

export type DocumentRecord = {
  name: string;
  number: string;
  expiry: string;
  verified: boolean;
};

export type Seafarer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  rank: string;
  sourceType: "Company" | "Partner" | "Direct";
  sourceName: string; // e.g. "ABC Shipping", "Ocean Maritime", "Hari Om"
  status: "active" | "pending" | "on_hold" | "inactive";
  cdcNumber: string;
  indosNumber: string;
  passportNumber: string;
  nationality: string;
  dob: string;
  joined: string;
  documents: DocumentRecord[];
  purchases: PurchaseRecord[];
  enrollments: EnrollmentRecord[];
};

const INITIAL_SEAFARERS: Seafarer[] = [
  {
    id: "SEA-4821",
    name: "Raj Kumar",
    email: "raj.kumar@marinecrew.in",
    phone: "+91 98201 12345",
    rank: "Chief Officer",
    sourceType: "Company",
    sourceName: "ABC Shipping",
    status: "active",
    cdcNumber: "MUM-104928",
    indosNumber: "08ZL2931",
    passportNumber: "Z5928104",
    nationality: "Indian",
    dob: "14 Apr 1989",
    joined: "12 Jan 2024",
    documents: [
      { name: "Continuous Discharge Certificate (CDC)", number: "MUM-104928", expiry: "2029-08-14", verified: true },
      { name: "Passport", number: "Z5928104", expiry: "2031-03-20", verified: true },
      { name: "DG Shipping Medical Fitness", number: "MED-2024-918", expiry: "2026-01-10", verified: true },
      { name: "STCW Basic Safety Training", number: "BST-99410", expiry: "2028-11-05", verified: true },
    ],
    purchases: [
      { id: "TXN-9921", courseName: "STCW Basic Safety", source: "Company - ABC Shipping", amount: 5000, date: "14 Jul 2025", paymentMethod: "Corporate Billing", status: "Completed" },
      { id: "TXN-8812", courseName: "Advanced Fire Fighting", source: "Partner - Ocean Maritime", amount: 7200, date: "22 Oct 2024", paymentMethod: "Partner Direct", status: "Completed" },
      { id: "TXN-7601", courseName: "Ship Security Officer (SSO)", source: "Direct - Hari Om", amount: 6500, date: "05 Mar 2024", paymentMethod: "UPI", status: "Completed" },
    ],
    enrollments: [
      { id: "ENR-401", courseName: "STCW Basic Safety", institute: "Anglo-Eastern Maritime Academy", batch: "BST-2025-07", source: "Company - ABC Shipping", progress: 100, status: "Completed" },
      { id: "ENR-388", courseName: "Bridge Resource Management", institute: "HIMT Chennai", batch: "BRM-2025-10", source: "Partner - Ocean Maritime", progress: 65, status: "Ongoing" },
    ],
  },
  {
    id: "SEA-4820",
    name: "Priya Singh",
    email: "priya.singh@merchantnavy.com",
    phone: "+91 97112 34567",
    rank: "Deck Cadet",
    sourceType: "Partner",
    sourceName: "Ocean Maritime",
    status: "on_hold",
    cdcNumber: "KOL-293841",
    indosNumber: "15EL8832",
    passportNumber: "V4819201",
    nationality: "Indian",
    dob: "08 Sep 1999",
    joined: "18 Feb 2024",
    documents: [
      { name: "Continuous Discharge Certificate (CDC)", number: "KOL-293841", expiry: "2030-05-19", verified: true },
      { name: "Passport", number: "V4819201", expiry: "2032-11-12", verified: true },
      { name: "DG Shipping Medical Fitness", number: "MED-2024-102", expiry: "2025-09-15", verified: false },
    ],
    purchases: [
      { id: "TXN-9920", courseName: "Basic Safety Training", source: "Partner - Ocean Maritime", amount: 3500, date: "13 Jul 2025", paymentMethod: "Card", status: "Completed" },
      { id: "TXN-9110", courseName: "Medical First Aid (MFA)", source: "Partner - XYZ Marine", amount: 4500, date: "10 Jan 2025", paymentMethod: "UPI", status: "Completed" },
    ],
    enrollments: [
      { id: "ENR-402", courseName: "Basic Safety Training", institute: "Great Eastern Institute", batch: "BST-2025-08", source: "Partner - Ocean Maritime", progress: 30, status: "On Hold" },
    ],
  },
  {
    id: "SEA-4819",
    name: "Amit Patel",
    email: "amit.patel@maritimecorp.in",
    phone: "+91 98450 88219",
    rank: "Second Engineer",
    sourceType: "Company",
    sourceName: "Fleet Maritime Solutions",
    status: "active",
    cdcNumber: "CHE-849201",
    indosNumber: "04ML1920",
    passportNumber: "W8392011",
    nationality: "Indian",
    dob: "25 Dec 1985",
    joined: "03 Mar 2024",
    documents: [
      { name: "Continuous Discharge Certificate (CDC)", number: "CHE-849201", expiry: "2028-12-31", verified: true },
      { name: "Passport", number: "W8392011", expiry: "2030-08-09", verified: true },
      { name: "DG Shipping Medical Fitness", number: "MED-2024-551", expiry: "2026-06-20", verified: true },
    ],
    purchases: [
      { id: "TXN-9919", courseName: "Advanced Fire Fighting", source: "Company - Fleet Maritime Solutions", amount: 7200, date: "12 Jul 2025", paymentMethod: "Corporate Billing", status: "Completed" },
      { id: "TXN-8500", courseName: "High Voltage Safety", source: "Direct - Hari Om", amount: 8500, date: "15 Apr 2024", paymentMethod: "Net Banking", status: "Completed" },
    ],
    enrollments: [
      { id: "ENR-403", courseName: "Advanced Fire Fighting", institute: "Tolani Maritime Institute", batch: "AFF-2025-05", source: "Company - Fleet Maritime Solutions", progress: 100, status: "Completed" },
    ],
  },
  {
    id: "SEA-4818",
    name: "Suresh Verma",
    email: "suresh.v@pacificwaves.in",
    phone: "+91 99123 44556",
    rank: "AB Seaman",
    sourceType: "Partner",
    sourceName: "XYZ Marine",
    status: "active",
    cdcNumber: "GOA-739102",
    indosNumber: "12GL4019",
    passportNumber: "P9301928",
    nationality: "Indian",
    dob: "19 Nov 1993",
    joined: "15 Apr 2024",
    documents: [
      { name: "Continuous Discharge Certificate (CDC)", number: "GOA-739102", expiry: "2029-04-10", verified: true },
      { name: "Passport", number: "P9301928", expiry: "2031-01-18", verified: true },
    ],
    purchases: [
      { id: "TXN-9918", courseName: "Tanker Cargo Ops", source: "Partner - XYZ Marine", amount: 9400, date: "11 Jul 2025", paymentMethod: "UPI", status: "Completed" },
    ],
    enrollments: [
      { id: "ENR-404", courseName: "Tanker Cargo Ops", institute: "Euro Tech Maritime", batch: "TCO-2025-09", source: "Partner - XYZ Marine", progress: 50, status: "Ongoing" },
    ],
  },
  {
    id: "SEA-4817",
    name: "Deepa Nair",
    email: "deepa.nair@coastalnavy.in",
    phone: "+91 98980 12121",
    rank: "Bosun",
    sourceType: "Company",
    sourceName: "Coastal Cargo Lines",
    status: "inactive",
    cdcNumber: "MUM-592810",
    indosNumber: "10ZL4820",
    passportNumber: "R4920194",
    nationality: "Indian",
    dob: "03 Feb 1990",
    joined: "22 May 2024",
    documents: [
      { name: "Continuous Discharge Certificate (CDC)", number: "MUM-592810", expiry: "2027-02-14", verified: true },
    ],
    purchases: [
      { id: "TXN-9917", courseName: "Maritime Law & Safety", source: "Company - Coastal Cargo Lines", amount: 3200, date: "10 Jul 2025", paymentMethod: "Corporate Billing", status: "Completed" },
    ],
    enrollments: [
      { id: "ENR-405", courseName: "Maritime Law & Safety", institute: "HIMT Chennai", batch: "MLS-2025-04", source: "Company - Coastal Cargo Lines", progress: 100, status: "Completed" },
    ],
  },
  {
    id: "SEA-4816",
    name: "Karan Mehta",
    email: "karan.mehta@seastaffing.in",
    phone: "+91 98765 11223",
    rank: "Master Mariner",
    sourceType: "Direct",
    sourceName: "Hari Om",
    status: "active",
    cdcNumber: "CHE-194029",
    indosNumber: "02ML0948",
    passportNumber: "Y9401928",
    nationality: "Indian",
    dob: "30 Jun 1980",
    joined: "10 Jun 2024",
    documents: [
      { name: "Continuous Discharge Certificate (CDC)", number: "CHE-194029", expiry: "2030-10-01", verified: true },
      { name: "Master FG Certificate of Competency", number: "COC-FG-9402", expiry: "2029-06-15", verified: true },
    ],
    purchases: [
      { id: "TXN-9916", courseName: "Ship Navigation & ECDIS", source: "Direct - Hari Om", amount: 6800, date: "09 Jul 2025", paymentMethod: "Card", status: "Completed" },
      { id: "TXN-9401", courseName: "DP Induction Course", source: "Partner - Ocean Maritime", amount: 14000, date: "15 Jan 2025", paymentMethod: "UPI", status: "Completed" },
    ],
    enrollments: [
      { id: "ENR-406", courseName: "Ship Navigation & ECDIS", institute: "Anglo-Eastern Maritime Academy", batch: "ECDIS-2025-06", source: "Direct - Hari Om", progress: 80, status: "Ongoing" },
    ],
  },
];

const STATUS_CONFIG = {
  active:    { label: "Active",    icon: CheckCircle2, cls: "bg-emerald-500/15 text-emerald-400" },
  ongoing:   { label: "Ongoing",   icon: Clock,        cls: "bg-indigo-500/15 text-indigo-400"  },
  on_hold:   { label: "On Hold",   icon: AlertCircle,  cls: "bg-amber-500/15 text-amber-400"    },
  completed: { label: "Completed", icon: CheckCircle2, cls: "bg-teal-500/15 text-teal-400"      },
  pending:   { label: "Pending",   icon: Clock,        cls: "bg-sky-500/15 text-sky-400"        },
  inactive:  { label: "Inactive",  icon: XCircle,      cls: "bg-red-500/15 text-red-400"        },
};

const SOURCE_BADGES: Record<string, { cls: string; icon: React.ElementType }> = {
  Company: { cls: "bg-sky-500/15 text-sky-400 border border-sky-500/20",   icon: Building2 },
  Partner: { cls: "bg-violet-500/15 text-violet-400 border border-violet-500/20", icon: Handshake },
  Direct:  { cls: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20", icon: Globe },
};

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function SeafarerManagementPage() {
  const { theme } = useTheme();
  const dk = theme === "dark";

  const [seafarers, setSeafarers] = useState<Seafarer[]>(INITIAL_SEAFARERS);
  const [search, setSearch]       = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedSeafarer, setSelectedSeafarer] = useState<Seafarer | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "documents">("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm]   = useState<Partial<Seafarer>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [sortField, setSortField] = useState<"name" | "rank" | "joined">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Theme tokens
  const ht       = dk ? "text-white"       : "text-slate-800";
  const mt       = dk ? "text-white/40"    : "text-slate-400";
  const card     = dk ? "bg-[#0f2035] border border-white/5 rounded-2xl" : "bg-white border border-slate-200 rounded-2xl shadow-sm";
  const inputCls = dk
    ? "bg-white/5 border border-white/8 text-white placeholder:text-white/25 focus:border-sky-500/50 outline-none"
    : "bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-sky-400 outline-none";
  const dv       = dk ? "divide-white/5"   : "divide-slate-100";
  const rh       = dk ? "hover:bg-white/3" : "hover:bg-slate-50/80";
  const thCls    = dk ? "border-b border-white/5 text-white/25" : "border-b border-slate-100 text-slate-400";
  const modalBg  = dk ? "bg-[#0c1a2e] border border-white/10" : "bg-white border border-slate-200";

  // Filter and Sort
  const filtered = seafarers.filter(s => {
    const q = search.toLowerCase();
    const matchSearch =
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      s.cdcNumber.toLowerCase().includes(q) ||
      s.sourceName.toLowerCase().includes(q) ||
      s.rank.toLowerCase().includes(q);
    const matchSource = sourceFilter === "all" || s.sourceType === sourceFilter;
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    return matchSearch && matchSource && matchStatus;
  }).sort((a, b) => {
    let comparison = 0;
    if (sortField === "name") comparison = a.name.localeCompare(b.name);
    if (sortField === "rank") comparison = a.rank.localeCompare(b.rank);
    if (sortField === "joined") comparison = new Date(a.joined).getTime() - new Date(b.joined).getTime();
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const toggleSort = (field: "name" | "rank" | "joined") => {
    if (sortField === field) {
      setSortOrder(o => o === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const openProfile = (seafarer: Seafarer) => {
    setSelectedSeafarer(seafarer);
    setEditForm({ ...seafarer });
    setIsEditing(false);
    setActiveTab("overview");
    setSaveSuccess(false);
  };

  const openDocuments = (seafarer: Seafarer) => {
    setSelectedSeafarer(seafarer);
    setEditForm({ ...seafarer });
    setIsEditing(false);
    setActiveTab("documents");
    setSaveSuccess(false);
  };

  const handleSaveEdit = () => {
    if (!selectedSeafarer) return;
    setSeafarers(prev => prev.map(s => s.id === selectedSeafarer.id ? { ...s, ...editForm } as Seafarer : s));
    setSelectedSeafarer(prev => ({ ...prev, ...editForm } as Seafarer));
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditing(false);
    }, 1000);
  };

  // KPIs
  const totalCount   = seafarers.length;
  const companyCount = seafarers.filter(s => s.sourceType === "Company").length;
  const partnerCount = seafarers.filter(s => s.sourceType === "Partner").length;
  const onHoldCount  = seafarers.filter(s => s.status === "on_hold").length;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-xl font-bold ${ht}`}>Seafarer Management</h1>
          <p className={`text-sm mt-0.5 ${mt}`}>
            Unified Seafarer Master Records across Company-side and Partner-side enrollments
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => toast("Exporting Seafarer Master records as CSV...")}
            className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-xl border transition-colors ${
              dk ? "border-white/10 text-white/70 hover:bg-white/5" : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Scope Banner (Section 1.4 requirement) */}
      <div className={`p-4 rounded-xl border flex items-start gap-3 text-sm ${
        dk ? "bg-sky-500/10 border-sky-500/20 text-sky-300" : "bg-sky-50 border-sky-200 text-sky-800"
      }`}>
        <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-sky-400" />
        <div>
          <span className="font-semibold">Single Master Record Policy (Section 1.4 & 1.5):</span>
          {" "}Displays all registered Seafarers with clearly identifiable source attribution. Administrative users are excluded.
          When a Seafarer purchases courses across multiple Partners, Companies, or directly through Hari Om, all activity is linked to their single master profile.
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Seafarers",     value: totalCount,   sub: "Unified master records", Icon: Users,       color: "bg-sky-500/15",     ic: "text-sky-400"     },
          { label: "Company Seafarers",   value: companyCount, sub: "Direct / Shipping Lines",Icon: Building2,   color: "bg-blue-500/15",    ic: "text-blue-400"    },
          { label: "Partner Seafarers",   value: partnerCount, sub: "Recruitment network",   Icon: Handshake,   color: "bg-violet-500/15",  ic: "text-violet-400"  },
          { label: "Candidates on Hold",  value: onHoldCount,  sub: "Pending document verify",Icon: AlertCircle, color: "bg-amber-500/15",   ic: "text-amber-400"   },
        ].map(k => (
          <div key={k.label} className={`${card} p-4 flex items-center gap-4`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${k.color}`}>
              <k.Icon className={`w-5 h-5 ${k.ic}`} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${ht}`}>{k.value}</p>
              <p className={`text-xs font-semibold ${ht} opacity-80`}>{k.label}</p>
              <p className={`text-[10px] ${mt}`}>{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Card */}
      <div className={card}>

        {/* Toolbar */}
        <div className={`flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b ${dk ? "border-white/5" : "border-slate-100"}`}>
          {/* Search */}
          <div className="relative flex-1 min-w-[240px] max-w-sm">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${mt}`} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, CDC, rank, or source..."
              className={`w-full pl-9 pr-4 py-2 text-sm rounded-lg ${inputCls}`}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Source Type Filter */}
            <div className="flex items-center gap-1.5">
              <span className={`text-[11px] font-semibold uppercase tracking-wider ${mt}`}>Source:</span>
              {["all", "Company", "Partner", "Direct"].map(src => (
                <button
                  key={src}
                  onClick={() => setSourceFilter(src)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    sourceFilter === src
                      ? "bg-sky-500 text-white"
                      : dk ? "bg-white/5 text-white/50 hover:bg-white/10" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {src === "all" ? "All Sources" : src}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <span className={`text-[11px] font-semibold uppercase tracking-wider ${mt}`}>Status:</span>
              {["all", "active", "ongoing", "on_hold", "completed", "inactive"].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                    statusFilter === st
                      ? "bg-sky-500 text-white"
                      : dk ? "bg-white/5 text-white/50 hover:bg-white/10" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {st.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={thCls}>
                <th
                  onClick={() => toggleSort("name")}
                  className="text-left px-6 py-3.5 text-[10px] font-semibold uppercase tracking-wider cursor-pointer select-none"
                >
                  <div className="flex items-center gap-1.5">
                    Seafarer & ID
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort("rank")}
                  className="text-left px-4 py-3.5 text-[10px] font-semibold uppercase tracking-wider cursor-pointer select-none"
                >
                  <div className="flex items-center gap-1.5">
                    Rank
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-left px-4 py-3.5 text-[10px] font-semibold uppercase tracking-wider">
                  Source / Type
                </th>
                <th className="text-left px-4 py-3.5 text-[10px] font-semibold uppercase tracking-wider">
                  CDC & INDoS
                </th>
                <th className="text-left px-4 py-3.5 text-[10px] font-semibold uppercase tracking-wider">
                  Contact
                </th>
                <th className="text-left px-4 py-3.5 text-[10px] font-semibold uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-6 py-3.5 text-[10px] font-semibold uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${dv}`}>
              {filtered.map(s => {
                const S = STATUS_CONFIG[s.status];
                const SIcon = S.icon;
                const SourceBadge = SOURCE_BADGES[s.sourceType] || SOURCE_BADGES.Direct;
                const SourceIcon = SourceBadge.icon;

                return (
                  <tr
                    key={s.id}
                    onClick={() => openProfile(s)}
                    className={`${rh} transition-colors cursor-pointer`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center text-xs shrink-0">
                          {s.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className={`font-semibold text-[13px] ${ht}`}>{s.name}</p>
                          <p className={`text-[11px] font-mono ${mt}`}>{s.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className={`px-4 py-4 text-[13px] font-medium ${ht}`}>
                      {s.rank}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full ${SourceBadge.cls}`}>
                        <SourceIcon className="w-3 h-3" />
                        {s.sourceType} - {s.sourceName}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className={`text-[12px] font-mono ${ht}`}>{s.cdcNumber}</p>
                      <p className={`text-[10px] font-mono ${mt}`}>{s.indosNumber}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className={`text-[11px] ${mt} truncate max-w-[160px]`}>{s.email}</p>
                      <p className={`text-[11px] ${mt}`}>{s.phone}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${S.cls}`}>
                        <SIcon className="w-3 h-3" />
                        {S.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            openDocuments(s);
                          }}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            dk
                              ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                              : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
                          }`}
                          title="View Certificates & Documents"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Documents</span>
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            openProfile(s);
                          }}
                          className={`p-1.5 rounded-lg transition-colors ${
                            dk ? "hover:bg-white/10 text-sky-400" : "hover:bg-sky-50 text-sky-600"
                          }`}
                          title="View Master Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <Users className={`w-10 h-10 mx-auto mb-3 ${mt}`} />
              <p className={`text-sm font-medium ${mt}`}>No seafarers match your search criteria</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-3 border-t flex items-center justify-between text-xs ${mt} ${dk ? "border-white/5" : "border-slate-100"}`}>
          <span>
            Showing {filtered.length} of {seafarers.length} Seafarer Master Records
          </span>
          <span>Click any row to open the complete Seafarer Master Profile</span>
        </div>
      </div>

      {/*  SEAFARER MASTER RECORD MODAL / DRAWER (Section 1.4 & 1.5)  */}
      {selectedSeafarer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedSeafarer(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <div
            className={`relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl z-10 ${modalBg}`}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`px-6 py-4 flex items-center justify-between border-b ${dk ? "border-white/8" : "border-slate-100"}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center text-white font-bold text-sm">
                  {selectedSeafarer.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className={`text-base font-bold ${ht}`}>{selectedSeafarer.name}</h2>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400">
                      {selectedSeafarer.id}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                      SOURCE_BADGES[selectedSeafarer.sourceType]?.cls || SOURCE_BADGES.Direct.cls
                    }`}>
                      {selectedSeafarer.sourceType} - {selectedSeafarer.sourceName}
                    </span>
                  </div>
                  <p className={`text-xs mt-0.5 ${mt}`}>
                    Seafarer Master Record · Registered on {selectedSeafarer.joined}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 text-xs font-semibold rounded-lg transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit Information
                  </button>
                ) : (
                  <button
                    onClick={handleSaveEdit}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    {saveSuccess ? <><Check className="w-3.5 h-3.5" /> Saved!</> : "Save Changes"}
                  </button>
                )}
                <button
                  onClick={() => setSelectedSeafarer(null)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    dk ? "hover:bg-white/10 text-white/40" : "hover:bg-slate-100 text-slate-400"
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Tabs */}
            <div className={`flex items-center gap-6 px-6 border-b text-xs font-semibold ${dk ? "border-white/8" : "border-slate-100"}`}>
              {[
                { id: "overview",  label: "Personal Profile", Icon: Users },
                { id: "history",   label: "Purchases & Enrollments (Multi-Source)", Icon: CreditCard },
                { id: "documents", label: "Certificates & Documents", Icon: FileText },
              ].map(tab => {
                const Icon = tab.Icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 py-3 border-b-2 transition-all ${
                      active
                        ? "border-sky-500 text-sky-400"
                        : `border-transparent ${mt} hover:${ht}`
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Basic details */}
                    <div className={`p-4 rounded-xl border ${dk ? "bg-white/[0.02] border-white/5" : "bg-slate-50 border-slate-200"}`}>
                      <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${mt}`}>Identification</p>
                      <div className="space-y-3 text-xs">
                        <div className="flex justify-between">
                          <span className={mt}>CDC Number:</span>
                          {isEditing ? (
                            <input
                              value={editForm.cdcNumber || ""}
                              onChange={e => setEditForm(f => ({ ...f, cdcNumber: e.target.value }))}
                              className={`px-2 py-1 rounded border text-xs ${inputCls}`}
                            />
                          ) : (
                            <span className={`font-mono font-semibold ${ht}`}>{selectedSeafarer.cdcNumber}</span>
                          )}
                        </div>
                        <div className="flex justify-between">
                          <span className={mt}>INDoS Number:</span>
                          <span className={`font-mono font-semibold ${ht}`}>{selectedSeafarer.indosNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={mt}>Passport Number:</span>
                          <span className={`font-mono font-semibold ${ht}`}>{selectedSeafarer.passportNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={mt}>Nationality:</span>
                          <span className={ht}>{selectedSeafarer.nationality}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={mt}>Date of Birth:</span>
                          <span className={ht}>{selectedSeafarer.dob}</span>
                        </div>
                      </div>
                    </div>

                    {/* Contact & Status */}
                    <div className={`p-4 rounded-xl border ${dk ? "bg-white/[0.02] border-white/5" : "bg-slate-50 border-slate-200"}`}>
                      <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${mt}`}>Contact & Role</p>
                      <div className="space-y-3 text-xs">
                        <div className="flex justify-between items-center">
                          <span className={mt}>Rank:</span>
                          {isEditing ? (
                            <input
                              value={editForm.rank || ""}
                              onChange={e => setEditForm(f => ({ ...f, rank: e.target.value }))}
                              className={`px-2 py-1 rounded border text-xs ${inputCls}`}
                            />
                          ) : (
                            <span className={`font-semibold ${ht}`}>{selectedSeafarer.rank}</span>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={mt}>Email:</span>
                          {isEditing ? (
                            <input
                              value={editForm.email || ""}
                              onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                              className={`px-2 py-1 rounded border text-xs ${inputCls}`}
                            />
                          ) : (
                            <span className={ht}>{selectedSeafarer.email}</span>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={mt}>Mobile:</span>
                          {isEditing ? (
                            <input
                              value={editForm.phone || ""}
                              onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                              className={`px-2 py-1 rounded border text-xs ${inputCls}`}
                            />
                          ) : (
                            <span className={ht}>{selectedSeafarer.phone}</span>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={mt}>Status:</span>
                          {isEditing ? (
                            <select
                              value={editForm.status || "active"}
                              onChange={e => setEditForm(f => ({ ...f, status: e.target.value as any }))}
                              className={`px-2 py-1 rounded border text-xs ${inputCls}`}
                            >
                              <option value="active">Active</option>
                              <option value="on_hold">On Hold</option>
                              <option value="pending">Pending</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          ) : (
                            <span className={`inline-flex items-center gap-1 font-semibold ${STATUS_CONFIG[selectedSeafarer.status].cls} px-2 py-0.5 rounded-full`}>
                              {STATUS_CONFIG[selectedSeafarer.status].label}
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={mt}>Primary Attribution:</span>
                          <span className="text-sky-400 font-medium">
                            {selectedSeafarer.sourceType} - {selectedSeafarer.sourceName}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 1.5 Master Record Note */}
                  <div className={`p-4 rounded-xl border text-xs ${dk ? "bg-white/5 border-white/8 text-white/70" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
                    <p className="font-semibold mb-1 text-sky-400">Master Record Integrity Rule (Section 1.5)</p>
                    <p>
                      This record serves as the single source of truth for physical Seafarer <span className="font-semibold text-white">{selectedSeafarer.name}</span>.
                      Subsequent course enrollments through different maritime partners or direct channels automatically append to this profile without creating duplicate seafarer accounts.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: MULTI-SOURCE PURCHASES & ENROLLMENTS */}
              {activeTab === "history" && (
                <div className="space-y-6">
                  {/* Purchases */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`text-xs font-semibold uppercase tracking-wider ${ht}`}>
                        Purchase History (Source Recorded Per Transaction)
                      </h3>
                      <span className={`text-[11px] ${mt}`}>
                        Total Purchases: {selectedSeafarer.purchases.length}
                      </span>
                    </div>
                    <div className={`rounded-xl border overflow-hidden ${dk ? "border-white/5" : "border-slate-200"}`}>
                      <table className="w-full text-xs">
                        <thead>
                          <tr className={thCls}>
                            <th className="px-4 py-2.5 text-left">Invoice ID</th>
                            <th className="px-4 py-2.5 text-left">Course Name</th>
                            <th className="px-4 py-2.5 text-left">Purchase Source</th>
                            <th className="px-4 py-2.5 text-left">Amount</th>
                            <th className="px-4 py-2.5 text-left">Date</th>
                            <th className="px-4 py-2.5 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${dv}`}>
                          {selectedSeafarer.purchases.map(p => (
                            <tr key={p.id} className={rh}>
                              <td className="px-4 py-3 font-mono text-sky-400 font-semibold">{p.id}</td>
                              <td className={`px-4 py-3 font-medium ${ht}`}>{p.courseName}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                                  p.source.startsWith("Company")
                                    ? "bg-sky-500/15 text-sky-400"
                                    : p.source.startsWith("Partner")
                                    ? "bg-violet-500/15 text-violet-400"
                                    : "bg-emerald-500/15 text-emerald-400"
                                }`}>
                                  {p.source}
                                </span>
                              </td>
                              <td className={`px-4 py-3 font-semibold ${ht}`}>{fmt(p.amount)}</td>
                              <td className={`px-4 py-3 ${mt}`}>{p.date}</td>
                              <td className="px-4 py-3 text-right">
                                <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                                  <CheckCircle2 className="w-3 h-3" /> {p.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Enrollments */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`text-xs font-semibold uppercase tracking-wider ${ht}`}>
                        Course Enrollments & Batches
                      </h3>
                      <span className={`text-[11px] ${mt}`}>
                        Total Batches: {selectedSeafarer.enrollments.length}
                      </span>
                    </div>
                    <div className={`rounded-xl border overflow-hidden ${dk ? "border-white/5" : "border-slate-200"}`}>
                      <table className="w-full text-xs">
                        <thead>
                          <tr className={thCls}>
                            <th className="px-4 py-2.5 text-left">Enrollment ID</th>
                            <th className="px-4 py-2.5 text-left">Course</th>
                            <th className="px-4 py-2.5 text-left">Institute</th>
                            <th className="px-4 py-2.5 text-left">Batch</th>
                            <th className="px-4 py-2.5 text-left">Progress</th>
                            <th className="px-4 py-2.5 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${dv}`}>
                          {selectedSeafarer.enrollments.map(e => (
                            <tr key={e.id} className={rh}>
                              <td className="px-4 py-3 font-mono text-sky-400 font-semibold">{e.id}</td>
                              <td className={`px-4 py-3 font-medium ${ht}`}>{e.courseName}</td>
                              <td className={`px-4 py-3 ${mt}`}>{e.institute}</td>
                              <td className={`px-4 py-3 font-mono text-[11px] ${mt}`}>{e.batch}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                                    <div className="h-full bg-sky-500 rounded-full" style={{ width: `${e.progress}%` }} />
                                  </div>
                                  <span className={`text-[11px] ${mt}`}>{e.progress}%</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                  e.status === "Completed"
                                    ? "bg-emerald-500/15 text-emerald-400"
                                    : e.status === "On Hold"
                                    ? "bg-amber-500/15 text-amber-400"
                                    : "bg-sky-500/15 text-sky-400"
                                }`}>
                                  {e.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: DOCUMENTS */}
              {activeTab === "documents" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className={`text-xs font-semibold uppercase tracking-wider ${mt}`}>Verified Maritime Credentials</p>
                    <button
                      onClick={() => toast("Upload Document feature")}
                      className="text-xs font-semibold text-sky-400 hover:text-sky-300"
                    >
                      + Add New Document
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedSeafarer.documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl border flex items-center justify-between ${
                          dk ? "bg-white/[0.02] border-white/8" : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <div className="space-y-1">
                          <p className={`text-xs font-semibold ${ht}`}>{doc.name}</p>
                          <p className={`text-[11px] font-mono ${mt}`}>Doc #: {doc.number}</p>
                          <p className={`text-[10px] ${mt}`}>Expires: {doc.expiry}</p>
                        </div>
                        <div className="text-right">
                          {doc.verified ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-md">
                              <AlertCircle className="w-3.5 h-3.5" /> Pending Review
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className={`px-6 py-3 border-t flex items-center justify-between ${dk ? "border-white/8" : "border-slate-100"}`}>
              <span className={`text-xs ${mt}`}>
                CDC: {selectedSeafarer.cdcNumber} · INDoS: {selectedSeafarer.indosNumber}
              </span>
              <button
                onClick={() => setSelectedSeafarer(null)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                  dk ? "border-white/10 text-white/60 hover:bg-white/5" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
