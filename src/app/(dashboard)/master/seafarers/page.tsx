"use client";
import toast from "react-hot-toast";

import React, { useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import { useGlobalStatus, STATUS_ICON_MAP } from "@/providers/status-provider";
import {
  Users,
  Search,
  Eye,
  Edit,
  CheckCircle2,
  AlertCircle,
  Building2,
  Handshake,
  Download,
  X,
  Check,
  FileText,
  CreditCard,
  ArrowUpDown,
  Globe,
  Ship,
  Anchor,
  Calendar,
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

export type VesselHistoryRecord = {
  id: string;
  vesselName: string;
  vesselType: string;
  imoNumber?: string;
  flag?: string;
  rank: string;
  companyName: string;
  signOn: string;
  signOff: string;
  durationDays: number;
  verified?: boolean;
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
  vesselHistory: VesselHistoryRecord[];
};

const INITIAL_SEAFARERS: Seafarer[] = [];

const SOURCE_BADGES: Record<string, { cls: string; icon: React.ElementType }> =
  {
    Company: { cls: "text-black dark:text-white", icon: Building2 },
    Partner: { cls: "text-black dark:text-white", icon: Handshake },
    Direct: { cls: "text-black dark:text-white", icon: Globe },
  };

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function SeafarerManagementPage() {
  const { theme } = useTheme();
  const dk = theme === "dark";
  const { getStatusesForModule, getStatus } = useGlobalStatus();
  const seafarerStatuses = getStatusesForModule("seafarer");

  const [seafarers, setSeafarers] = useState<Seafarer[]>(INITIAL_SEAFARERS);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedSeafarer, setSelectedSeafarer] = useState<Seafarer | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<
    "overview" | "history" | "documents" | "vessel"
  >("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Seafarer>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [sortField, setSortField] = useState<"name" | "rank" | "joined">(
    "name",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Theme tokens
  const ht = dk ? "text-white" : "text-slate-800";
  const mt = dk ? "text-white/40" : "text-slate-400";
  const card = dk
    ? "bg-[#0f2035] border border-white/5 rounded-2xl"
    : "bg-white border border-slate-200 rounded-2xl shadow-sm";
  const inputCls = dk
    ? "bg-white/5 border border-white/8 text-white placeholder:text-white/25 focus:border-sky-500/50 outline-none"
    : "bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-sky-400 outline-none";
  const dv = dk ? "divide-white/5" : "divide-slate-100";
  const rh = dk ? "hover:bg-white/3" : "hover:bg-slate-50/80";
  const thCls = dk
    ? "border-b border-white/5 text-white/25"
    : "border-b border-slate-100 text-slate-400";
  const modalBg = dk
    ? "bg-[#0c1a2e] border border-white/10"
    : "bg-white border border-slate-200";

  // Filter and Sort
  const filtered = seafarers
    .filter((s) => {
      const q = search.toLowerCase();
      const matchSearch =
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.cdcNumber.toLowerCase().includes(q) ||
        s.sourceName.toLowerCase().includes(q) ||
        s.rank.toLowerCase().includes(q);
      const matchSource =
        sourceFilter === "all" || s.sourceType === sourceFilter;
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      return matchSearch && matchSource && matchStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === "name") comparison = a.name.localeCompare(b.name);
      if (sortField === "rank") comparison = a.rank.localeCompare(b.rank);
      if (sortField === "joined")
        comparison =
          new Date(a.joined).getTime() - new Date(b.joined).getTime();
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const toggleSort = (field: "name" | "rank" | "joined") => {
    if (sortField === field) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
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
    setSeafarers((prev) =>
      prev.map((s) =>
        s.id === selectedSeafarer.id ? ({ ...s, ...editForm } as Seafarer) : s,
      ),
    );
    setSelectedSeafarer((prev) => ({ ...prev, ...editForm }) as Seafarer);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditing(false);
    }, 1000);
  };

  // KPIs
  const totalCount = seafarers.length;
  const companyCount = seafarers.filter(
    (s) => s.sourceType === "Company",
  ).length;
  const partnerCount = seafarers.filter(
    (s) => s.sourceType === "Partner",
  ).length;
  const onHoldCount = seafarers.filter((s) => s.status === "on_hold").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-xl font-bold ${ht}`}>Seafarer Management</h1>
          <p className={`text-sm mt-0.5 ${mt}`}>
            Unified Seafarer Master Records across Company-side and Partner-side
            enrollments
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => toast("Exporting Seafarer Master records as CSV...")}
            className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-xl border transition-colors ${
              dk
                ? "border-white/10 text-white/70 hover:bg-white/5"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Seafarers",
            value: totalCount,
            sub: "Unified master records",
            Icon: Users,
            color: "bg-sky-500/15",
            ic: "text-sky-400",
          },
          {
            label: "Company Seafarers",
            value: companyCount,
            sub: "Direct / Shipping Lines",
            Icon: Building2,
            color: "bg-blue-500/15",
            ic: "text-blue-400",
          },
          {
            label: "Partner Seafarers",
            value: partnerCount,
            sub: "Recruitment network",
            Icon: Handshake,
            color: "bg-violet-500/15",
            ic: "text-violet-400",
          },
          {
            label: "Candidates on Hold",
            value: onHoldCount,
            sub: "Pending document verify",
            Icon: AlertCircle,
            color: "bg-amber-500/15",
            ic: "text-amber-400",
          },
        ].map((k) => (
          <div key={k.label} className={`${card} p-4 flex items-center gap-4`}>
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${k.color}`}
            >
              <k.Icon className={`w-5 h-5 ${k.ic}`} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${ht}`}>{k.value}</p>
              <p className={`text-xs font-semibold ${ht} opacity-80`}>
                {k.label}
              </p>
              <p className={`text-[10px] ${mt}`}>{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Card */}
      <div className={card}>
        {/* Toolbar */}
        <div
          className={`flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b ${dk ? "border-white/5" : "border-slate-100"}`}
        >
          {/* Search */}
          <div className="relative flex-1 min-w-[240px] max-w-sm">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${mt}`}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, CDC, rank, or source..."
              className={`w-full pl-9 pr-4 py-2 text-sm rounded-lg ${inputCls}`}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Source Type Filter */}
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-semibold uppercase tracking-wider ${mt}`}
              >
                Source:
              </span>
              <div className="flex items-center gap-2">
                {["all", "Company", "Partner", "Direct"].map((src) => {
                  const isSel = sourceFilter === src;
                  return (
                    <button
                      key={src}
                      onClick={() => setSourceFilter(src)}
                      className={`text-xs transition-colors ${
                        isSel
                          ? "text-black dark:text-white font-bold underline underline-offset-4 decoration-2 decoration-sky-500"
                          : dk
                            ? "text-white/40 hover:text-white/80 font-medium"
                            : "text-slate-500 hover:text-slate-800 font-medium"
                      }`}
                    >
                      {src === "all" ? "All Sources" : src}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-semibold uppercase tracking-wider ${mt}`}
              >
                Status:
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`text-xs capitalize transition-colors ${
                    statusFilter === "all"
                      ? "text-black dark:text-white font-bold underline underline-offset-4 decoration-2 decoration-sky-500"
                      : dk
                        ? "text-white/40 hover:text-white/80 font-medium"
                        : "text-slate-500 hover:text-slate-800 font-medium"
                  }`}
                >
                  All
                </button>
                {seafarerStatuses.map((st) => {
                  const isSel = statusFilter === st.id;
                  return (
                    <button
                      key={st.id}
                      onClick={() => setStatusFilter(st.id)}
                      className={`text-xs capitalize transition-colors ${
                        isSel
                          ? "text-black dark:text-white font-bold underline underline-offset-4 decoration-2 decoration-sky-500"
                          : dk
                            ? "text-white/40 hover:text-white/80 font-medium"
                            : "text-slate-500 hover:text-slate-800 font-medium"
                      }`}
                    >
                      {st.label}
                    </button>
                  );
                })}
              </div>
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
                <th className="text-left px-4 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-black dark:text-white">
                  Contact
                </th>
                <th className="text-left px-4 py-3.5 text-[10px] font-semibold uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${dv}`}>
              {filtered.map((s) => {
                const statusItem = getStatus(s.status);
                const statusLabel = statusItem?.label || s.status;
                const statusColor = statusItem?.color || "text-slate-400";
                const SIcon =
                  (statusItem &&
                    STATUS_ICON_MAP[
                      statusItem.iconName as keyof typeof STATUS_ICON_MAP
                    ]) ||
                  CheckCircle2;
                const SourceBadge =
                  SOURCE_BADGES[s.sourceType] || SOURCE_BADGES.Direct;
                const SourceIcon = SourceBadge.icon;

                return (
                  <tr
                    key={s.id}
                    onClick={() => openProfile(s)}
                    className={`${rh} transition-colors cursor-pointer`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#0284c7] text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {s.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <div>
                          <p className={`font-semibold text-xs ${ht}`}>
                            {s.name}
                          </p>
                          <p className={`text-[10px] font-mono ${mt}`}>
                            {s.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className={`px-4 py-4 text-xs font-medium ${ht}`}>
                      {s.rank}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-medium ${SourceBadge.cls}`}
                      >
                        <SourceIcon className="w-3 h-3" />
                        {s.sourceName}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className={`text-[12px] font-mono ${ht}`}>
                        {s.cdcNumber}
                      </p>
                      <p className={`text-[10px] font-mono ${mt}`}>
                        {s.indosNumber}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-[11px] text-black dark:text-white truncate max-w-[160px]">
                        {s.email}
                      </p>
                      <p className="text-[11px] text-black dark:text-white">
                        {s.phone}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-semibold ${statusColor}`}
                      >
                        <SIcon className="w-3 h-3" />
                        {statusLabel}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <Users className={`w-10 h-10 mx-auto mb-3 ${mt}`} />
              <p className={`text-sm font-medium ${mt}`}>
                No seafarers match your search criteria
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`px-6 py-3 border-t flex items-center justify-between text-xs ${mt} ${dk ? "border-white/5" : "border-slate-100"}`}
        >
          <span>
            Showing {filtered.length} of {seafarers.length} Seafarer Master
            Records
          </span>
          <span>
            Click any row to open the complete Seafarer Master Profile
          </span>
        </div>
      </div>

      {/*  SEAFARER MASTER RECORD MODAL / DRAWER (Section 1.4 & 1.5)  */}
      {selectedSeafarer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedSeafarer(null)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <div
            className={`relative w-full max-w-4xl h-[560px] max-h-[90vh] flex flex-col rounded-2xl shadow-2xl z-10 overflow-hidden ${modalBg}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className={`px-6 py-4 flex items-center justify-between border-b shrink-0 ${dk ? "border-white/8" : "border-slate-100"}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold text-sm">
                  {selectedSeafarer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className={`text-base font-bold ${ht}`}>
                      {selectedSeafarer.name}
                    </h2>
                    <span className="text-xs font-mono font-semibold text-black dark:text-white">
                      {selectedSeafarer.id}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                        SOURCE_BADGES[selectedSeafarer.sourceType]?.cls ||
                        SOURCE_BADGES.Direct.cls
                      }`}
                    >
                      {selectedSeafarer.sourceType} -{" "}
                      {selectedSeafarer.sourceName}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5 text-slate-600 dark:text-slate-400 font-medium">
                    Seafarer Master Record · Registered on{" "}
                    {selectedSeafarer.joined}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 transition-colors cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit Information
                  </button>
                ) : (
                  <button
                    onClick={handleSaveEdit}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    {saveSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Saved!
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                )}
                <button
                  onClick={() => setSelectedSeafarer(null)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    dk
                      ? "hover:bg-white/10 text-white/40"
                      : "hover:bg-slate-100 text-slate-400"
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Tabs */}
            <div
              className={`flex items-center gap-6 px-6 border-b text-xs font-semibold shrink-0 ${dk ? "border-white/8" : "border-slate-100"}`}
            >
              {[
                { id: "overview", label: "Personal Profile", Icon: Users },
                {
                  id: "history",
                  label: "Purchases & Enrollments",
                  Icon: CreditCard,
                },
                {
                  id: "documents",
                  label: "Certificates & Documents",
                  Icon: FileText,
                },
                {
                  id: "vessel",
                  label: "Vessel History / Services",
                  Icon: Anchor,
                },
              ].map((tab) => {
                const Icon = tab.Icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() =>
                      setActiveTab(
                        tab.id as
                          "overview" | "history" | "documents" | "vessel",
                      )
                    }
                    className={`flex items-center gap-2 py-3 border-b-2 transition-all ${
                      active
                        ? dk
                          ? "border-sky-500 text-white"
                          : "border-sky-600 text-slate-900"
                        : dk
                          ? "border-transparent text-slate-400 hover:text-white"
                          : "border-transparent text-slate-600 hover:text-slate-900"
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Basic details */}
                  <div
                    className={`p-4 rounded-xl border ${dk ? "bg-white/[0.02] border-white/5" : "bg-slate-50 border-slate-200"}`}
                  >
                    <p className="text-xs font-bold uppercase tracking-wider mb-3 text-slate-700 dark:text-slate-300">
                      Identification
                    </p>
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between items-center min-h-[34px]">
                        <span className="text-slate-600 dark:text-slate-300 font-medium">
                          CDC Number:
                        </span>
                        {isEditing ? (
                          <input
                            value={editForm.cdcNumber || ""}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                cdcNumber: e.target.value,
                              }))
                            }
                            className="w-48 sm:w-52 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-900/90 text-slate-900 dark:text-white font-mono font-semibold text-xs shadow-sm hover:border-slate-400 dark:hover:border-white/40 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all"
                            placeholder="Enter CDC Number"
                          />
                        ) : (
                          <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                            {selectedSeafarer.cdcNumber}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center min-h-[34px]">
                        <span className="text-slate-600 dark:text-slate-300 font-medium">
                          INDoS Number:
                        </span>
                        <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                          {selectedSeafarer.indosNumber}
                        </span>
                      </div>
                      <div className="flex justify-between items-center min-h-[34px]">
                        <span className="text-slate-600 dark:text-slate-300 font-medium">
                          Passport Number:
                        </span>
                        <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                          {selectedSeafarer.passportNumber}
                        </span>
                      </div>
                      <div className="flex justify-between items-center min-h-[34px]">
                        <span className="text-slate-600 dark:text-slate-300 font-medium">
                          Nationality:
                        </span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {selectedSeafarer.nationality}
                        </span>
                      </div>
                      <div className="flex justify-between items-center min-h-[34px]">
                        <span className="text-slate-600 dark:text-slate-300 font-medium">
                          Date of Birth:
                        </span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {selectedSeafarer.dob}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact & Status */}
                  <div
                    className={`p-4 rounded-xl border ${dk ? "bg-white/[0.02] border-white/5" : "bg-slate-50 border-slate-200"}`}
                  >
                    <p className="text-xs font-bold uppercase tracking-wider mb-3 text-slate-700 dark:text-slate-300">
                      Contact & Role
                    </p>
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between items-center min-h-[34px]">
                        <span className="text-slate-600 dark:text-slate-300 font-medium">
                          Rank:
                        </span>
                        {isEditing ? (
                          <input
                            value={editForm.rank || ""}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                rank: e.target.value,
                              }))
                            }
                            className="w-48 sm:w-52 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-900/90 text-slate-900 dark:text-white font-semibold text-xs shadow-sm hover:border-slate-400 dark:hover:border-white/40 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all"
                            placeholder="Enter Rank"
                          />
                        ) : (
                          <span className="font-semibold text-slate-900 dark:text-slate-100">
                            {selectedSeafarer.rank}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center min-h-[34px]">
                        <span className="text-slate-600 dark:text-slate-300 font-medium">
                          Email:
                        </span>
                        {isEditing ? (
                          <input
                            value={editForm.email || ""}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                email: e.target.value,
                              }))
                            }
                            className="w-48 sm:w-52 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-900/90 text-slate-900 dark:text-white font-medium text-xs shadow-sm hover:border-slate-400 dark:hover:border-white/40 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all"
                            placeholder="Enter Email"
                          />
                        ) : (
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            {selectedSeafarer.email}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center min-h-[34px]">
                        <span className="text-slate-600 dark:text-slate-300 font-medium">
                          Mobile:
                        </span>
                        {isEditing ? (
                          <input
                            value={editForm.phone || ""}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                phone: e.target.value,
                              }))
                            }
                            className="w-48 sm:w-52 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-900/90 text-slate-900 dark:text-white font-medium text-xs shadow-sm hover:border-slate-400 dark:hover:border-white/40 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all"
                            placeholder="Enter Mobile"
                          />
                        ) : (
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            {selectedSeafarer.phone}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center min-h-[34px]">
                        <span className="text-slate-600 dark:text-slate-300 font-medium">
                          Status:
                        </span>
                        {isEditing ? (
                          <select
                            value={editForm.status || "active"}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                status: e.target.value as Seafarer["status"],
                              }))
                            }
                            className="w-48 sm:w-52 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-900/90 text-slate-900 dark:text-white font-medium text-xs shadow-sm hover:border-slate-400 dark:hover:border-white/40 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all cursor-pointer"
                          >
                            {seafarerStatuses.map((st) => (
                              <option key={st.id} value={st.id}>
                                {st.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1 font-semibold ${getStatus(selectedSeafarer.status)?.color || "text-slate-700 dark:text-slate-300"}`}
                          >
                            {getStatus(selectedSeafarer.status)?.label ||
                              selectedSeafarer.status}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center min-h-[34px]">
                        <span className="text-slate-600 dark:text-slate-300 font-medium">
                          Primary Attribution:
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {selectedSeafarer.sourceType} -{" "}
                          {selectedSeafarer.sourceName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MULTI-SOURCE PURCHASES & ENROLLMENTS */}
              {activeTab === "history" && (
                <div className="space-y-6">
                  {/* Purchases */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3
                        className={`text-xs font-semibold uppercase tracking-wider ${ht}`}
                      >
                        Purchase History (Source Recorded Per Transaction)
                      </h3>
                      <span className={`text-[11px] ${mt}`}>
                        Total Purchases: {selectedSeafarer.purchases.length}
                      </span>
                    </div>
                    <div
                      className={`rounded-xl border overflow-hidden ${dk ? "border-white/5" : "border-slate-200"}`}
                    >
                      <table className="w-full text-xs">
                        <thead>
                          <tr className={thCls}>
                            <th className="px-4 py-2.5 text-left">
                              Invoice ID
                            </th>
                            <th className="px-4 py-2.5 text-left">
                              Course Name
                            </th>
                            <th className="px-4 py-2.5 text-left">
                              Purchase Source
                            </th>
                            <th className="px-4 py-2.5 text-left">Amount</th>
                            <th className="px-4 py-2.5 text-left">Date</th>
                            <th className="px-4 py-2.5 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${dv}`}>
                          {selectedSeafarer.purchases.map((p) => (
                            <tr key={p.id} className={rh}>
                              <td className="px-4 py-3 font-mono text-black dark:text-white font-semibold">
                                {p.id}
                              </td>
                              <td className={`px-4 py-3 font-medium ${ht}`}>
                                {p.courseName}
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-[11px] font-medium text-black dark:text-white">
                                  {p.source}
                                </span>
                              </td>
                              <td className={`px-4 py-3 font-semibold ${ht}`}>
                                {fmt(p.amount)}
                              </td>
                              <td className={`px-4 py-3 ${mt}`}>{p.date}</td>
                              <td className="px-4 py-3 text-right">
                                <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                                  <CheckCircle2 className="w-3 h-3" />{" "}
                                  {p.status}
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
                      <h3
                        className={`text-xs font-semibold uppercase tracking-wider ${ht}`}
                      >
                        Course Enrollments & Batches
                      </h3>
                      <span className={`text-[11px] ${mt}`}>
                        Total Batches: {selectedSeafarer.enrollments.length}
                      </span>
                    </div>
                    <div
                      className={`rounded-xl border overflow-hidden ${dk ? "border-white/5" : "border-slate-200"}`}
                    >
                      <table className="w-full text-xs">
                        <thead>
                          <tr className={thCls}>
                            <th className="px-4 py-2.5 text-left">
                              Enrollment ID
                            </th>
                            <th className="px-4 py-2.5 text-left">Course</th>
                            <th className="px-4 py-2.5 text-left">Institute</th>
                            <th className="px-4 py-2.5 text-left">Batch</th>
                            <th className="px-4 py-2.5 text-left">Progress</th>
                            <th className="px-4 py-2.5 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${dv}`}>
                          {selectedSeafarer.enrollments.map((e) => (
                            <tr key={e.id} className={rh}>
                              <td className="px-4 py-3 font-mono text-black dark:text-white font-semibold">
                                {e.id}
                              </td>
                              <td className={`px-4 py-3 font-medium ${ht}`}>
                                {e.courseName}
                              </td>
                              <td className={`px-4 py-3 ${mt}`}>
                                {e.institute}
                              </td>
                              <td
                                className={`px-4 py-3 font-mono text-[11px] ${mt}`}
                              >
                                {e.batch}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                                    <div
                                      className="h-full bg-sky-500 rounded-full"
                                      style={{ width: `${e.progress}%` }}
                                    />
                                  </div>
                                  <span className={`text-[11px] ${mt}`}>
                                    {e.progress}%
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <span
                                  className={`text-[11px] font-semibold ${
                                    e.status === "Completed"
                                      ? "text-emerald-600 dark:text-emerald-400"
                                      : e.status === "On Hold"
                                        ? "text-amber-600 dark:text-amber-400"
                                        : "text-sky-600 dark:text-sky-400"
                                  }`}
                                >
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
                    <p
                      className={`text-xs font-semibold uppercase tracking-wider ${mt}`}
                    >
                      Verified Maritime Credentials
                    </p>
                    <button
                      onClick={() => toast("Upload Document feature")}
                      className="text-xs font-semibold text-black dark:text-white hover:underline"
                    >
                      + Add New Document
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedSeafarer.documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl border flex items-center justify-between ${
                          dk
                            ? "bg-white/[0.02] border-white/8"
                            : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <div className="space-y-1">
                          <p className={`text-xs font-semibold ${ht}`}>
                            {doc.name}
                          </p>
                          <p className={`text-[11px] font-mono ${mt}`}>
                            Doc #: {doc.number}
                          </p>
                          <p className={`text-[10px] ${mt}`}>
                            Expires: {doc.expiry}
                          </p>
                        </div>
                        <div className="text-right">
                          {doc.verified ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                              <AlertCircle className="w-3.5 h-3.5" /> Pending
                              Review
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: VESSEL HISTORY / SERVICES */}
              {activeTab === "vessel" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3
                        className={`text-xs font-semibold uppercase tracking-wider ${ht}`}
                      >
                        Recorded Sea Service & Vessel Deployments
                      </h3>
                      <p className={`text-[11px] mt-0.5 ${mt}`}>
                        Verified sea-time, vessel assignments, and operational
                        ranks on file
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${
                          dk
                            ? "bg-white/5 text-white/70 border border-white/10"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {selectedSeafarer.vesselHistory?.length || 0}{" "}
                        {(selectedSeafarer.vesselHistory?.length || 0) === 1
                          ? "Deployment"
                          : "Deployments"}
                      </span>
                      {selectedSeafarer.vesselHistory &&
                        selectedSeafarer.vesselHistory.length > 0 && (
                          <span className="text-[11px] px-2.5 py-1 rounded-full font-medium bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                            {selectedSeafarer.vesselHistory.reduce(
                              (acc, v) => acc + (v.durationDays || 0),
                              0,
                            )}{" "}
                            Total Sea Days
                          </span>
                        )}
                    </div>
                  </div>

                  {!selectedSeafarer.vesselHistory ||
                  selectedSeafarer.vesselHistory.length === 0 ? (
                    <div
                      className={`p-8 rounded-xl border text-center ${dk ? "bg-white/[0.02] border-white/5" : "bg-slate-50 border-slate-200"}`}
                    >
                      <Ship
                        className={`w-8 h-8 mx-auto mb-2 opacity-30 ${mt}`}
                      />
                      <p className={`text-xs font-semibold ${ht}`}>
                        No vessel service history available
                      </p>
                      <p className={`text-[11px] mt-1 ${mt}`}>
                        No sea service or vessel deployment records have been
                        filed for this seafarer yet.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedSeafarer.vesselHistory.map((service, idx) => (
                        <div
                          key={service.id || idx}
                          className={`p-4 rounded-xl border space-y-3 transition-all ${
                            dk
                              ? "bg-white/[0.02] border-white/8 hover:border-white/15"
                              : "bg-slate-50 border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          {/* Top row: Vessel name + IMO/Flag + Sea Days Badge */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`p-2 rounded-lg ${dk ? "bg-sky-500/10 text-sky-400" : "bg-sky-50 text-sky-600 border border-sky-200"}`}
                              >
                                <Ship className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs font-bold ${ht}`}>
                                    {service.vesselName}
                                  </span>
                                  {service.verified && (
                                    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                      <CheckCircle2 className="w-3 h-3" />{" "}
                                      Verified Sea-Time
                                    </span>
                                  )}
                                </div>
                                {(service.imoNumber || service.flag) && (
                                  <span
                                    className={`text-[11px] font-mono ${mt}`}
                                  >
                                    {service.imoNumber
                                      ? `IMO: ${service.imoNumber}`
                                      : ""}
                                    {service.imoNumber && service.flag
                                      ? " · "
                                      : ""}
                                    {service.flag
                                      ? `Flag: ${service.flag}`
                                      : ""}
                                  </span>
                                )}
                              </div>
                            </div>

                            <span
                              className={`self-start sm:self-auto text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                                dk
                                  ? "bg-sky-500/15 text-sky-400 border border-sky-500/30"
                                  : "bg-sky-50 text-sky-700 border border-sky-200"
                              }`}
                            >
                              {service.durationDays} Days at Sea
                            </span>
                          </div>

                          {/* Middle Grid: Vessel Type, Served Rank, Managing Company */}
                          <div
                            className={`grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs border-t ${dk ? "border-white/5" : "border-slate-200/60"}`}
                          >
                            <div>
                              <span
                                className={`text-[10px] uppercase font-semibold block mb-0.5 ${mt}`}
                              >
                                Vessel Type
                              </span>
                              <span className={`font-medium ${ht}`}>
                                {service.vesselType}
                              </span>
                            </div>
                            <div>
                              <span
                                className={`text-[10px] uppercase font-semibold block mb-0.5 ${mt}`}
                              >
                                Served Rank
                              </span>
                              <span className={`font-semibold ${ht}`}>
                                {service.rank}
                              </span>
                            </div>
                            <div>
                              <span
                                className={`text-[10px] uppercase font-semibold block mb-0.5 ${mt}`}
                              >
                                Managing Company
                              </span>
                              <span className="font-medium text-black dark:text-white">
                                {service.companyName || "—"}
                              </span>
                            </div>
                          </div>

                          {/* Bottom Row: Sign-On / Sign-Off dates */}
                          <div
                            className={`text-[11px] pt-2 border-t flex items-center justify-between ${dk ? "border-white/5" : "border-slate-200/60"}`}
                          >
                            <div className={`flex items-center gap-1.5 ${mt}`}>
                              <Calendar className="w-3.5 h-3.5" />
                              <span>
                                Sign-on:{" "}
                                <strong className={ht}>{service.signOn}</strong>
                              </span>
                              <span className="mx-1">→</span>
                              <span>
                                Sign-off:{" "}
                                <strong className={ht}>
                                  {service.signOff}
                                </strong>
                              </span>
                            </div>
                            <span className={`text-[10px] font-mono ${mt}`}>
                              Record ID: {service.id}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div
              className={`px-6 py-3 border-t flex items-center justify-between shrink-0 ${dk ? "border-white/8" : "border-slate-100"}`}
            >
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                CDC: {selectedSeafarer.cdcNumber} · INDoS:{" "}
                {selectedSeafarer.indosNumber}
              </span>
              <button
                onClick={() => setSelectedSeafarer(null)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                  dk
                    ? "border-white/10 text-white/70 hover:bg-white/5"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
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
