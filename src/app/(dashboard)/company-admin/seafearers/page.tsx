"use client";

import React, { useState, useMemo } from "react";
import { useTheme } from "@/providers/theme-provider";
import { mockSeafarers, Seafarer } from "@/components/company-admin/mockData";
import StatusBadge from "@/components/company-admin/StatusBadge";
import { Skeleton } from "@/components/company-admin/Skeleton";
import {
  Search,
  Filter,
  Edit2,
  FileText,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Calendar,
  Anchor,
  Mail,
  Phone,
  MoreVertical,
  ArrowUpDown,
  Info,
  ShoppingBag,
  Ship,
} from "lucide-react";

export default function SeafarerManagementPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Stateful list of seafarers for in-memory updates
  const [seafarersList, setSeafarersList] = useState<Seafarer[]>(mockSeafarers);

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRank, setSelectedRank] = useState("All");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Sorting state
  const [sortField, setSortField] = useState<
    "name" | "indosNumber" | "rank" | "status" | null
  >(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Selected seafarer for Details Drawer
  const [selectedSeafarer, setSelectedSeafarer] = useState<Seafarer | null>(
    null,
  );
  const [drawerTab, setDrawerTab] = useState<
    "profile" | "documents" | "vesselHistory" | "purchases"
  >("profile");
  const [isDrawerLoading, setIsDrawerLoading] = useState(false);

  // Edit modal states
  const [editingSeafarer, setEditingSeafarer] = useState<Seafarer | null>(null);
  const [editFormData, setEditFormData] = useState<Seafarer | null>(null);

  // Active action modal seafarer for centered popup
  const [actionModalSeafarer, setActionModalSeafarer] =
    useState<Seafarer | null>(null);

  // Extract unique filters from state for dropdowns
  const ranks = useMemo(
    () => Array.from(new Set(mockSeafarers.map((s) => s.rank))),
    [],
  );
  const departments = useMemo(
    () => Array.from(new Set(mockSeafarers.map((s) => s.department))),
    [],
  );
  const statuses = [
    "All",
    ...Array.from(new Set(seafarersList.map((sf) => sf.status))),
  ];

  // Sorting Handler
  const handleSort = (field: "name" | "indosNumber" | "rank" | "status") => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filtering & Sorting Logic
  const filteredSeafarers = useMemo(() => {
    const result = seafarersList.filter((sf) => {
      const matchesSearch =
        sf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sf.indosNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sf.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRank = selectedRank === "All" || sf.rank === selectedRank;
      const matchesDept =
        selectedDept === "All" || sf.department === selectedDept;
      const matchesStatus =
        selectedStatus === "All" || sf.status === selectedStatus;

      return matchesSearch && matchesRank && matchesDept && matchesStatus;
    });

    if (sortField) {
      result.sort((a, b) => {
        const valA = a[sortField] || "";
        const valB = b[sortField] || "";
        if (valA < valB) return sortDirection === "asc" ? -1 : 1;
        if (valA > valB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [
    seafarersList,
    searchQuery,
    selectedRank,
    selectedDept,
    selectedStatus,
    sortField,
    sortDirection,
  ]);

  // Pagination Logic
  const totalPages = Math.max(
    1,
    Math.ceil(filteredSeafarers.length / itemsPerPage),
  );
  const paginatedSeafarers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSeafarers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSeafarers, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (newCount: number) => {
    setItemsPerPage(newCount);
    setCurrentPage(1);
  };

  // Drawer Handlers
  const openDetails = (
    sf: Seafarer,
    tab: "profile" | "documents" | "vesselHistory" | "purchases" = "profile",
  ) => {
    setIsDrawerLoading(true);
    setSelectedSeafarer(sf);
    setDrawerTab(tab);
    setTimeout(() => {
      setIsDrawerLoading(false);
    }, 200);
  };

  const handleDrawerTabChange = (
    tab:
      | "profile"
      | "documents"
      | "courses"
      | "seaService"
      | "info"
      | "docPurchases"
      | "purchases"
      | "vesselHistory",
  ) => {
    setIsDrawerLoading(true);
    setDrawerTab(tab);
    setTimeout(() => {
      setIsDrawerLoading(false);
    }, 250);
  };

  const closeDetails = () => {
    setSelectedSeafarer(null);
  };

  const handleOpenEdit = (sf: Seafarer) => {
    setEditingSeafarer(sf);
    setEditFormData(sf);
  };

  // Edit Submission Handler
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData) return;

    setSeafarersList((prev) =>
      prev.map((s) => (s.id === editFormData.id ? editFormData : s)),
    );

    // If selected in drawer, update the view details too
    if (selectedSeafarer?.id === editFormData.id) {
      setSelectedSeafarer(editFormData);
    }

    setEditingSeafarer(null);
  };

  return (
    <div className="space-y-6 relative min-h-[calc(100vh-80px)]">
      {/* Header */}
      <div>
        <h1
          className={`text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-800"}`}
        >
          Seafarer Management
        </h1>
        <p
          className={`text-[11px] mt-0.5 ${isDark ? "text-white/40" : "text-slate-500"}`}
        >
          View personal files, track certifications, and check vessel service
          logs.
        </p>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative md:col-span-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-40">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search name, INDOS..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className={`pl-9 pr-3 py-2 w-full rounded-lg border text-xs outline-none transition-all focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 ${
              isDark
                ? "bg-white/5 border-white/10 text-white placeholder:text-white/20"
                : "bg-white border-slate-200 text-slate-850 placeholder:text-slate-400"
            }`}
          />
        </div>

        {/* Rank Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 opacity-40 shrink-0" />
          <select
            value={selectedRank}
            onChange={(e) => {
              setSelectedRank(e.target.value);
              setCurrentPage(1);
            }}
            className={`py-2 px-3 rounded-lg border text-xs outline-none w-full ${
              isDark
                ? "bg-[#0c1a2e] border-white/10 text-white"
                : "bg-white border-slate-200 text-slate-800"
            }`}
          >
            <option value="All">All Ranks</option>
            {ranks
              .filter((r) => r !== "All")
              .map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
          </select>
        </div>

        {/* Department Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 opacity-40 shrink-0" />
          <select
            value={selectedDept}
            onChange={(e) => {
              setSelectedDept(e.target.value);
              setCurrentPage(1);
            }}
            className={`py-2 px-3 rounded-lg border text-xs outline-none w-full ${
              isDark
                ? "bg-[#0c1a2e] border-white/10 text-white"
                : "bg-white border-slate-200 text-slate-800"
            }`}
          >
            <option value="All">All Departments</option>
            {departments
              .filter((d) => d !== "All")
              .map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 opacity-40 shrink-0" />
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className={`py-2 px-3 rounded-lg border text-xs outline-none w-full ${
              isDark
                ? "bg-[#0c1a2e] border-white/10 text-white"
                : "bg-white border-slate-200 text-slate-800"
            }`}
          >
            <option value="All">All Statuses</option>
            {statuses
              .filter((s) => s !== "All")
              .map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Seafarer Table */}
      <div
        className={`border rounded-xl overflow-hidden shadow-sm ${
          isDark ? "bg-[#0c1a2e] border-white/5" : "bg-white border-slate-200"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr
                className={`border-b text-[10px] font-bold tracking-wider uppercase select-none ${
                  isDark
                    ? "bg-white/3 border-white/5 text-white/50"
                    : "bg-slate-50 border-slate-100 text-slate-400"
                }`}
              >
                <th
                  onClick={() => handleSort("name")}
                  className="py-3 px-4 cursor-pointer hover:text-sky-400 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    Seafarer Name
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("indosNumber")}
                  className="py-3 px-4 cursor-pointer hover:text-sky-400 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    INDOS Number
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("rank")}
                  className="py-3 px-4 cursor-pointer hover:text-sky-400 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    Rank & Dept
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th className="py-3 px-4">Email</th>
                <th
                  onClick={() => handleSort("status")}
                  className="py-3 px-4 cursor-pointer hover:text-sky-400 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    Status
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-solid divide-slate-100 dark:divide-white/5">
              {paginatedSeafarers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-xs text-gray-500"
                  >
                    No seafarers match your search criteria.
                  </td>
                </tr>
              ) : (
                paginatedSeafarers.map((sf) => (
                  <tr
                    key={sf.id}
                    className={`text-xs hover:bg-slate-50/50 dark:hover:bg-white/3 transition-colors`}
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                      {sf.name}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] opacity-75">
                      {sf.indosNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold">{sf.rank}</div>
                      <span className={`text-[10px] opacity-50`}>
                        {sf.department}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 opacity-75">{sf.email}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={sf.status} />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetails(sf, "profile");
                        }}
                        className={`p-1.5 rounded-lg border transition-all hover:scale-105 cursor-pointer ${
                          actionModalSeafarer?.id === sf.id
                            ? isDark
                              ? "bg-sky-500/20 border-sky-500/40 text-sky-400"
                              : "bg-sky-50 border-sky-300 text-sky-600"
                            : isDark
                              ? "border-white/10 hover:bg-white/5 text-slate-300"
                              : "border-slate-200 hover:bg-slate-50 text-slate-600"
                        }`}
                        title="Actions Menu"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Panel */}
        {filteredSeafarers.length > 0 && (
          <div
            className={`px-4 py-3 border-t flex flex-wrap items-center justify-between gap-4 text-xs ${
              isDark ? "border-white/5" : "border-slate-100"
            }`}
          >
            <div className="flex items-center gap-4">
              <span className={isDark ? "text-white/60" : "text-slate-500"}>
                Showing{" "}
                <strong>
                  {Math.min(
                    (currentPage - 1) * itemsPerPage + 1,
                    filteredSeafarers.length,
                  )}
                  –
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredSeafarers.length,
                  )}
                </strong>{" "}
                of <strong>{filteredSeafarers.length}</strong>
              </span>

              <div className="flex items-center gap-2">
                <span className={isDark ? "text-white/40" : "text-slate-400"}>
                  Rows per page:
                </span>
                <select
                  value={itemsPerPage}
                  onChange={(e) =>
                    handleItemsPerPageChange(Number(e.target.value))
                  }
                  className={`px-2 py-1 rounded border text-xs outline-none cursor-pointer ${
                    isDark
                      ? "bg-[#0b1625] border-white/10 text-white"
                      : "bg-white border-slate-200 text-slate-700"
                  }`}
                >
                  {[5, 10, 15, 20, 25].map((size) => (
                    <option
                      key={size}
                      value={size}
                      className={isDark ? "bg-[#0b1625]" : "bg-white"}
                    >
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-1.5 rounded border transition-colors cursor-pointer disabled:opacity-40 disabled:pointer-events-none ${
                  isDark
                    ? "border-white/10 hover:bg-white/5 text-white"
                    : "border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-1.5 rounded border transition-colors cursor-pointer disabled:opacity-40 disabled:pointer-events-none ${
                  isDark
                    ? "border-white/10 hover:bg-white/5 text-white"
                    : "border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── SEAFARER DETAIL CENTERED POPUP MODAL ────────────────────────────────── */}
      {selectedSeafarer && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity animate-fadeIn"
            onClick={closeDetails}
          />
          {/* Centered Modal Container */}
          <div
            className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[85vh] shadow-2xl z-50 flex flex-col rounded-2xl border overflow-hidden animate-fadeIn ${
              isDark
                ? "bg-[#0b1625] text-white border-white/10"
                : "bg-white text-slate-800 border-slate-200"
            }`}
          >
            {/* Drawer Header */}
            <div
              className={`p-5 border-b flex items-center justify-between gap-4 ${
                isDark
                  ? "border-white/5 bg-[#09111e]"
                  : "border-slate-100 bg-slate-50"
              }`}
            >
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-base font-bold tracking-tight">
                    {selectedSeafarer.name}
                  </h2>
                  <StatusBadge status={selectedSeafarer.status} />
                </div>
                <p
                  className={`text-[10px] uppercase font-bold tracking-widest mt-0.5 ${isDark ? "text-sky-400" : "text-sky-600"}`}
                >
                  {selectedSeafarer.rank} • {selectedSeafarer.department}{" "}
                  Department
                </p>
              </div>
              <button
                onClick={closeDetails}
                className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                  isDark
                    ? "border-white/10 hover:bg-white/5"
                    : "border-slate-200 hover:bg-slate-100"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tab Links */}
            <div
              className={`flex border-b text-[11px] font-bold px-4 gap-5 overflow-x-auto ${
                isDark
                  ? "border-white/5 bg-[#09111e]/50"
                  : "border-slate-100 bg-slate-50/50"
              }`}
            >
              {[
                { id: "profile", label: "Overview Details" },
                { id: "documents", label: "Certificates & CDC" },
                { id: "vesselHistory", label: "Vessel History" },
                { id: "purchases", label: "Purchase History" },
              ].map((tab) => {
                const active = drawerTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() =>
                      handleDrawerTabChange(
                        tab.id as
                          | "profile"
                          | "documents"
                          | "vesselHistory"
                          | "purchases",
                      )
                    }
                    className={`py-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                      active
                        ? "border-sky-500 text-sky-400 font-bold"
                        : "border-transparent text-gray-500 hover:text-sky-400"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {isDrawerLoading ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                  <Skeleton className="h-px w-full" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-1/4" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-1/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                  <Skeleton className="h-28 w-full rounded-xl" />
                </div>
              ) : (
                <>
                  {/* Tab 1: Overview Details (Merged Overview + Seafarer Info) */}
                  {drawerTab === "profile" && (
                    <div className="space-y-6 animate-fadeIn">
                      {/* Seafarer Identification & Info */}
                      <div
                        className={`p-4 rounded-xl border ${isDark ? "bg-[#0f1f35] border-white/5" : "bg-slate-50 border-slate-200"}`}
                      >
                        <div className="flex items-center justify-between gap-4 mb-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400">
                            Seafarer Identification & Info
                          </h4>
                          <button
                            onClick={() => handleOpenEdit(selectedSeafarer)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-[11px] font-semibold cursor-pointer transition-colors shadow-sm"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit Details</span>
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3.5 text-xs">
                          <div>
                            <span className="text-[10px] opacity-40 uppercase block font-semibold">
                              Full Legal Name
                            </span>
                            <span className="font-bold">
                              {selectedSeafarer.name}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] opacity-40 uppercase block font-semibold">
                              INDOS Number
                            </span>
                            <span className="font-mono font-bold text-sky-400">
                              {selectedSeafarer.indosNumber}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] opacity-40 uppercase block font-semibold">
                              Assigned Rank
                            </span>
                            <span className="font-semibold">
                              {selectedSeafarer.rank}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] opacity-40 uppercase block font-semibold">
                              Operational Department
                            </span>
                            <span className="font-semibold">
                              {selectedSeafarer.department}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] opacity-40 uppercase block font-semibold">
                              Current Status
                            </span>
                            <span className="inline-block mt-0.5">
                              <StatusBadge status={selectedSeafarer.status} />
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] opacity-40 uppercase block font-semibold">
                              Nationality
                            </span>
                            <span className="font-semibold">
                              {selectedSeafarer.nationality}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] opacity-40 uppercase block font-semibold">
                              Date of Birth
                            </span>
                            <span className="font-semibold">
                              {selectedSeafarer.dob}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] opacity-40 uppercase block font-semibold">
                              Primary Contact
                            </span>
                            <span className="font-semibold">
                              {selectedSeafarer.phone}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Contact Credentials & Registered Address */}
                      <div
                        className={`p-4 rounded-xl border ${isDark ? "bg-[#0f1f35] border-white/5" : "bg-slate-50 border-slate-200"}`}
                      >
                        <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2">
                          Registered Address & Contact Credentials
                        </h4>
                        <p className="text-xs leading-relaxed opacity-80">
                          {selectedSeafarer.address}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-xs opacity-75 mt-3 pt-3 border-t border-white/5">
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-sky-400" />
                            <span>{selectedSeafarer.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-sky-400" />
                            <span>{selectedSeafarer.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Documents list */}
                  {drawerTab === "documents" && (
                    <div className="space-y-4 animate-fadeIn">
                      {selectedSeafarer.documents.length === 0 ? (
                        <div className="text-center py-8 text-xs text-gray-500">
                          No files uploaded.
                        </div>
                      ) : (
                        selectedSeafarer.documents.map((doc) => (
                          <div
                            key={doc.id}
                            className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition-all hover:shadow-sm ${
                              isDark
                                ? "bg-[#0f1f35] border-white/5"
                                : "bg-slate-50 border-slate-150"
                            }`}
                          >
                            <div className="space-y-1">
                              <p className="text-xs font-bold leading-none">
                                {doc.name}
                              </p>
                              <div
                                className={`text-[10px] opacity-50 flex items-center gap-3 mt-1`}
                              >
                                <span>Type: {doc.type}</span>
                                <span>Exp: {doc.expiryDate}</span>
                              </div>
                              {doc.rejectionReason && (
                                <div className="flex items-start gap-1 text-[10px] text-red-400 mt-2 bg-red-500/5 p-1.5 rounded">
                                  <ShieldAlert className="w-3 h-3 mt-0.5 shrink-0" />
                                  <p>{doc.rejectionReason}</p>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <StatusBadge status={doc.status} />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Tab 3: Courses progress */}
                  {drawerTab === "courses" && (
                    <div className="space-y-4 animate-fadeIn">
                      {selectedSeafarer.courses.length === 0 ? (
                        <div className="text-center py-8 text-xs text-gray-550">
                          No courses assigned.
                        </div>
                      ) : (
                        selectedSeafarer.courses.map((course) => (
                          <div
                            key={course.id}
                            className={`p-4 rounded-xl border space-y-3 ${
                              isDark
                                ? "bg-[#0f1f35] border-white/5"
                                : "bg-slate-50 border-slate-150"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="text-xs font-bold">
                                  {course.name}
                                </p>
                                <span className="text-[10px] opacity-40 font-mono">
                                  {course.code}
                                </span>
                              </div>
                              <StatusBadge status={course.status} />
                            </div>

                            {/* Progress Bar */}
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="opacity-60">Completeness</span>
                                <span className="font-bold">
                                  {course.progress}%
                                </span>
                              </div>
                              <div
                                className={`h-1.5 w-full rounded-full overflow-hidden ${isDark ? "bg-white/5" : "bg-slate-200"}`}
                              >
                                <div
                                  className="h-full bg-sky-500 rounded-full transition-all duration-300"
                                  style={{ width: `${course.progress}%` }}
                                />
                              </div>
                            </div>

                            <div className="flex justify-between items-center text-[10px] opacity-55 border-t border-white/5 pt-2 mt-2">
                              <span>Assigned: {course.assignedDate}</span>
                              {course.expiryDate && (
                                <span>Expires: {course.expiryDate}</span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Tab 4: Sea Service logs */}
                  {drawerTab === "seaService" && (
                    <div className="space-y-4 animate-fadeIn">
                      {selectedSeafarer.seaService.length === 0 ? (
                        <div className="text-center py-8 text-xs text-gray-500">
                          No sea service logs found.
                        </div>
                      ) : (
                        selectedSeafarer.seaService.map((service) => (
                          <div
                            key={service.id}
                            className={`p-4 rounded-xl border space-y-3 transition-all hover:shadow-sm ${
                              isDark
                                ? "bg-[#0f1f35] border-white/5"
                                : "bg-slate-50 border-slate-150"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-4 border-b border-solid border-slate-200 dark:border-white/5 pb-2">
                              <div className="flex items-center gap-2">
                                <Anchor className="w-3.5 h-3.5 text-sky-400" />
                                <p className="text-xs font-bold">
                                  {service.vesselName}
                                </p>
                              </div>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  isDark
                                    ? "bg-white/5 text-white/70"
                                    : "bg-slate-250 text-slate-800"
                                }`}
                              >
                                {service.duration} Days
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-xs leading-normal">
                              <div>
                                <span className="text-[10px] opacity-40 uppercase block leading-none mb-0.5">
                                  Vessel Type
                                </span>
                                <span className="font-semibold">
                                  {service.vesselType}
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] opacity-40 uppercase block leading-none mb-0.5">
                                  Rank on Board
                                </span>
                                <span className="font-semibold">
                                  {service.rank}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 text-[10px] opacity-60">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>
                                {service.signOn} to {service.signOff}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                  {/* Tab 5: Seafarer Info */}
                  {drawerTab === "info" && (
                    <div className="space-y-5 animate-fadeIn">
                      <div
                        className={`p-4 rounded-xl border ${isDark ? "bg-[#0f1f35] border-white/5" : "bg-slate-50 border-slate-200"}`}
                      >
                        <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-3">
                          Seafarer Identification & Info
                        </h4>
                        <div className="grid grid-cols-2 gap-3.5 text-xs">
                          <div>
                            <span className="text-[10px] opacity-40 uppercase block font-semibold">
                              Full Legal Name
                            </span>
                            <span className="font-bold">
                              {selectedSeafarer.name}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] opacity-40 uppercase block font-semibold">
                              INDOS Number
                            </span>
                            <span className="font-mono font-bold text-sky-400">
                              {selectedSeafarer.indosNumber}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] opacity-40 uppercase block font-semibold">
                              Assigned Rank
                            </span>
                            <span className="font-semibold">
                              {selectedSeafarer.rank}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] opacity-40 uppercase block font-semibold">
                              Operational Department
                            </span>
                            <span className="font-semibold">
                              {selectedSeafarer.department}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] opacity-40 uppercase block font-semibold">
                              Current Status
                            </span>
                            <span className="inline-block mt-0.5">
                              <StatusBadge status={selectedSeafarer.status} />
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] opacity-40 uppercase block font-semibold">
                              Nationality
                            </span>
                            <span className="font-semibold">
                              {selectedSeafarer.nationality}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] opacity-40 uppercase block font-semibold">
                              Date of Birth
                            </span>
                            <span className="font-semibold">
                              {selectedSeafarer.dob}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] opacity-40 uppercase block font-semibold">
                              Primary Contact
                            </span>
                            <span className="font-semibold">
                              {selectedSeafarer.phone}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${isDark ? "bg-[#0f1f35] border-white/5" : "bg-slate-50 border-slate-200"}`}
                      >
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-1">
                            Manage Profile
                          </h4>
                          <p className="text-[11px] opacity-70">
                            Update rank, department, contact information &
                            status
                          </p>
                        </div>
                        <button
                          onClick={() => handleOpenEdit(selectedSeafarer)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold cursor-pointer transition-colors shadow-sm"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit Details</span>
                        </button>
                      </div>

                      <div
                        className={`p-4 rounded-xl border ${isDark ? "bg-[#0f1f35] border-white/5" : "bg-slate-50 border-slate-200"}`}
                      >
                        <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2">
                          Registered Address
                        </h4>
                        <p className="text-xs leading-relaxed opacity-80">
                          {selectedSeafarer.address}
                        </p>
                        <p className="text-xs opacity-60 mt-2">
                          Email: {selectedSeafarer.email}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Vessel History (Merged Vessel Sea Service + Vessel History) */}
                  {drawerTab === "vesselHistory" && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="flex items-center justify-between pb-2 border-b border-white/5">
                        <span className="text-xs font-bold">
                          Recorded Vessel Deployments & Sea Service
                        </span>
                        <span className="text-[11px] opacity-60">
                          {selectedSeafarer.seaService.length} voyages
                        </span>
                      </div>
                      {selectedSeafarer.seaService.length === 0 ? (
                        <div className="text-center py-8 text-xs text-gray-500">
                          No vessel history or sea service logs on file.
                        </div>
                      ) : (
                        selectedSeafarer.seaService.map((service, idx) => (
                          <div
                            key={service.id || idx}
                            className={`p-4 rounded-xl border space-y-3 transition-all hover:shadow-sm ${
                              isDark
                                ? "bg-[#0f1f35] border-white/5"
                                : "bg-slate-50 border-slate-200"
                            }`}
                          >
                            <div className="flex items-center justify-between border-b border-solid border-slate-200 dark:border-white/5 pb-2">
                              <div className="flex items-center gap-2">
                                <Anchor className="w-3.5 h-3.5 text-sky-400" />
                                <span className="text-xs font-bold">
                                  {service.vesselName}
                                </span>
                              </div>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  isDark
                                    ? "bg-sky-500/15 text-sky-400"
                                    : "bg-sky-100 text-sky-700"
                                }`}
                              >
                                {service.duration} Days at Sea
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-[10px] opacity-40 uppercase block mb-0.5">
                                  Vessel Type
                                </span>
                                <span className="font-semibold">
                                  {service.vesselType}
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] opacity-40 uppercase block mb-0.5">
                                  Served Rank
                                </span>
                                <span className="font-semibold">
                                  {service.rank}
                                </span>
                              </div>
                            </div>
                            <div className="text-[10px] opacity-60 pt-2 border-t border-white/5 flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>
                                Sign-on: {service.signOn} • Sign-off:{" "}
                                {service.signOff}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Tab 4: Purchase History (Merged Doc Purchases + Course Purchases) */}
                  {drawerTab === "purchases" && (
                    <div className="space-y-5 animate-fadeIn">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-1 border-b border-white/5">
                          <span className="text-xs font-bold">
                            Document Purchase Orders
                          </span>
                          <span className="text-[10px] font-mono opacity-50 font-bold">
                            VERIFIED CDC & STCW
                          </span>
                        </div>
                        {[
                          {
                            orderId: `DOC-${selectedSeafarer.indosNumber.slice(-4)}-01`,
                            docName:
                              "STCW Advanced Safety & Firefighting Package",
                            amount: "₹4,500",
                            date: "14/08/26",
                            status: "Completed",
                            inv: `INV-${selectedSeafarer.indosNumber.slice(-4)}-A`,
                          },
                          {
                            orderId: `DOC-${selectedSeafarer.indosNumber.slice(-4)}-02`,
                            docName:
                              "Continuous Discharge Certificate (CDC) Endorsement",
                            amount: "₹2,200",
                            date: "28/07/26",
                            status: "Completed",
                            inv: `INV-${selectedSeafarer.indosNumber.slice(-4)}-B`,
                          },
                        ].map((rec) => (
                          <div
                            key={rec.orderId}
                            className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                              isDark
                                ? "bg-[#0f1f35] border-white/5"
                                : "bg-slate-50 border-slate-200"
                            }`}
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-xs font-bold">
                                  {rec.docName}
                                </span>
                              </div>
                              <div className="text-[10px] opacity-50 flex items-center gap-2">
                                <span>Order: {rec.orderId}</span>
                                <span>•</span>
                                <span>Purchased: {rec.date}</span>
                                <span>•</span>
                                <span className="font-mono">{rec.inv}</span>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-xs font-bold text-emerald-400 block">
                                {rec.amount}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold">
                                {rec.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between pb-1 border-b border-white/5">
                          <span className="text-xs font-bold">
                            Course & Training Transactions
                          </span>
                          <span className="text-[10px] font-mono opacity-50 font-bold">
                            ALL TRANSACTIONS
                          </span>
                        </div>
                        {[
                          {
                            item: "Shipboard Medical Care Training Enrollment",
                            type: "Course Booking",
                            amount: "₹8,500",
                            date: "02/08/26",
                            status: "Paid",
                            method: "Company Credit Card",
                          },
                          {
                            item: "Bridge Resource Management (BRM) Module",
                            type: "Simulation Training",
                            amount: "₹12,000",
                            date: "15/07/26",
                            status: "Paid",
                            method: "Bank Transfer",
                          },
                        ].map((p, idx) => (
                          <div
                            key={idx}
                            className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                              isDark
                                ? "bg-[#0f1f35] border-white/5"
                                : "bg-slate-50 border-slate-200"
                            }`}
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <ShoppingBag className="w-3.5 h-3.5 text-indigo-400" />
                                <span className="text-xs font-bold">
                                  {p.item}
                                </span>
                              </div>
                              <div className="text-[10px] opacity-50 flex items-center gap-2">
                                <span>Type: {p.type}</span>
                                <span>•</span>
                                <span>Date: {p.date}</span>
                                <span>•</span>
                                <span>Paid via {p.method}</span>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-xs font-bold text-indigo-400 block">
                                {p.amount}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold">
                                {p.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── EDIT PROFILE MODAL (STATE SAVE) ──────────────────────────────────── */}
      {editingSeafarer && editFormData && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
            onClick={() => setEditingSeafarer(null)}
          />
          {/* Dialog Container */}
          <div
            className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg shadow-2xl z-55 rounded-xl overflow-hidden border ${
              isDark
                ? "bg-[#0b1625] border-white/5 text-white"
                : "bg-white border-slate-200 text-slate-850"
            }`}
          >
            {/* Header */}
            <div
              className={`p-4 border-b flex items-center justify-between gap-4 ${
                isDark
                  ? "border-white/5 bg-[#09111e]"
                  : "border-slate-100 bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold">Edit Seafarer Profile</h3>
              </div>
              <button
                onClick={() => setEditingSeafarer(null)}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  isDark ? "hover:bg-white/5" : "hover:bg-slate-100"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSaveEdit}
              className="p-5 space-y-4 max-h-[75vh] overflow-y-auto"
            >
              <div className="grid grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5 col-span-2">
                  <label className="text-[10px] font-bold uppercase opacity-60">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, name: e.target.value })
                    }
                    className={`w-full py-2 px-3 rounded-lg border text-xs outline-none ${
                      isDark
                        ? "bg-[#0c1a2e] border-white/10 text-white focus:border-sky-500"
                        : "bg-white border-slate-200 text-slate-850 focus:border-sky-500"
                    }`}
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase opacity-60">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        email: e.target.value,
                      })
                    }
                    className={`w-full py-2 px-3 rounded-lg border text-xs outline-none ${
                      isDark
                        ? "bg-[#0c1a2e] border-white/10 text-white focus:border-sky-500"
                        : "bg-white border-slate-200 text-slate-850 focus:border-sky-500"
                    }`}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase opacity-60">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={editFormData.phone}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        phone: e.target.value,
                      })
                    }
                    className={`w-full py-2 px-3 rounded-lg border text-xs outline-none ${
                      isDark
                        ? "bg-[#0c1a2e] border-white/10 text-white focus:border-sky-500"
                        : "bg-white border-slate-200 text-slate-850 focus:border-sky-500"
                    }`}
                    required
                  />
                </div>

                {/* INDOS Number */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase opacity-60">
                    INDOS Number
                  </label>
                  <input
                    type="text"
                    value={editFormData.indosNumber}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        indosNumber: e.target.value,
                      })
                    }
                    className={`w-full py-2 px-3 rounded-lg border text-xs outline-none ${
                      isDark
                        ? "bg-[#0c1a2e] border-white/10 text-white focus:border-sky-500"
                        : "bg-white border-slate-200 text-slate-850 focus:border-sky-500"
                    }`}
                    required
                  />
                </div>

                {/* Rank */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase opacity-60">
                    Rank
                  </label>
                  <input
                    type="text"
                    value={editFormData.rank}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, rank: e.target.value })
                    }
                    className={`w-full py-2 px-3 rounded-lg border text-xs outline-none ${
                      isDark
                        ? "bg-[#0c1a2e] border-white/10 text-white focus:border-sky-500"
                        : "bg-white border-slate-200 text-slate-850 focus:border-sky-500"
                    }`}
                    required
                  />
                </div>

                {/* Department */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase opacity-60">
                    Department
                  </label>
                  <select
                    value={editFormData.department}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        department: e.target.value as
                          "Deck" | "Engine" | "Catering" | "Other",
                      })
                    }
                    className={`w-full py-2 px-3 rounded-lg border text-xs outline-none ${
                      isDark
                        ? "bg-[#0c1a2e] border-white/10 text-white focus:border-sky-500"
                        : "bg-white border-slate-200 text-slate-850 focus:border-sky-500"
                    }`}
                    required
                  >
                    <option value="Deck">Deck</option>
                    <option value="Engine">Engine</option>
                    <option value="Galley">Galley</option>
                    <option value="Safety">Safety</option>
                  </select>
                </div>

                {/* Nationality */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase opacity-60">
                    Nationality
                  </label>
                  <input
                    type="text"
                    value={editFormData.nationality}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        nationality: e.target.value,
                      })
                    }
                    className={`w-full py-2 px-3 rounded-lg border text-xs outline-none ${
                      isDark
                        ? "bg-[#0c1a2e] border-white/10 text-white focus:border-sky-500"
                        : "bg-white border-slate-200 text-slate-850 focus:border-sky-500"
                    }`}
                    required
                  />
                </div>

                {/* Date of Birth */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase opacity-60">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={editFormData.dob}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, dob: e.target.value })
                    }
                    className={`w-full py-2 px-3 rounded-lg border text-xs outline-none ${
                      isDark
                        ? "bg-[#0c1a2e] border-white/10 text-white focus:border-sky-500"
                        : "bg-white border-slate-200 text-slate-850 focus:border-sky-500"
                    }`}
                    required
                  />
                </div>

                {/* Address */}
                <div className="space-y-1.5 col-span-2">
                  <label className="text-[10px] font-bold uppercase opacity-60">
                    Address
                  </label>
                  <textarea
                    value={editFormData.address}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        address: e.target.value,
                      })
                    }
                    className={`w-full py-2 px-3 rounded-lg border text-xs outline-none h-16 ${
                      isDark
                        ? "bg-[#0c1a2e] border-white/10 text-white focus:border-sky-500"
                        : "bg-white border-slate-200 text-slate-850 focus:border-sky-500"
                    }`}
                    required
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-solid border-slate-100 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => setEditingSeafarer(null)}
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
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </>
      )}
      {/* ========================================================================= */}
      {/* SEAFARER 3-DOT ACTION MODAL (COMPACT CENTERED POPUP OVERLAY — 4 OPTIONS) */}
      {/* ========================================================================= */}
      {actionModalSeafarer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setActionModalSeafarer(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-md rounded-2xl border shadow-2xl p-5 relative animate-fadeIn flex flex-col ${
              isDark
                ? "bg-[#0B1528] border-white/10 text-white"
                : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-white/5 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md shrink-0">
                  {actionModalSeafarer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-tight">
                    {actionModalSeafarer.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[11px] opacity-60">
                    <span>{actionModalSeafarer.rank}</span>
                    <span>•</span>
                    <span className="font-mono text-[10px]">
                      {actionModalSeafarer.indosNumber}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActionModalSeafarer(null)}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isDark
                    ? "border-white/10 hover:bg-white/5 text-slate-300"
                    : "border-slate-200 hover:bg-slate-100"
                }`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Exactly 4 Clean Compact Options */}
            <div className="py-3 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-40 px-1 block">
                Seafarer Actions
              </span>

              {/* 1. INFO */}
              <button
                onClick={() => {
                  const target = actionModalSeafarer;
                  setActionModalSeafarer(null);
                  openDetails(target, "info");
                }}
                className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition-all group cursor-pointer ${
                  isDark
                    ? "bg-white/[0.02] border-white/5 hover:bg-sky-500/10 hover:border-sky-500/30"
                    : "bg-slate-50 border-slate-200 hover:bg-sky-50 hover:border-sky-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 group-hover:scale-105 transition-transform">
                    <Info className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold block">INFO</span>
                    <span className="text-[10px] opacity-60">
                      Profile, contact, documents & edit details
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-40 group-hover:translate-x-0.5 group-hover:opacity-100 transition-all" />
              </button>

              {/* 2. DOCUMENT PURCHASE HISTORY */}
              <button
                onClick={() => {
                  const target = actionModalSeafarer;
                  setActionModalSeafarer(null);
                  openDetails(target, "docPurchases");
                }}
                className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition-all group cursor-pointer ${
                  isDark
                    ? "bg-white/[0.02] border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/30"
                    : "bg-slate-50 border-slate-200 hover:bg-emerald-50 hover:border-emerald-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition-transform">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold block">
                      DOCUMENT PURCHASE HISTORY
                    </span>
                    <span className="text-[10px] opacity-60">
                      Purchased documents, invoices & CDC orders
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-40 group-hover:translate-x-0.5 group-hover:opacity-100 transition-all" />
              </button>

              {/* 3. PURCHASE HISTORY */}
              <button
                onClick={() => {
                  const target = actionModalSeafarer;
                  setActionModalSeafarer(null);
                  openDetails(target, "purchases");
                }}
                className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition-all group cursor-pointer ${
                  isDark
                    ? "bg-white/[0.02] border-white/5 hover:bg-indigo-500/10 hover:border-indigo-500/30"
                    : "bg-slate-50 border-slate-200 hover:bg-indigo-50 hover:border-indigo-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:scale-105 transition-transform">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold block">
                      PURCHASE HISTORY
                    </span>
                    <span className="text-[10px] opacity-60">
                      Course bookings, STCW training & payments
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-40 group-hover:translate-x-0.5 group-hover:opacity-100 transition-all" />
              </button>

              {/* 4. VESSEL HISTORY */}
              <button
                onClick={() => {
                  const target = actionModalSeafarer;
                  setActionModalSeafarer(null);
                  openDetails(target, "vesselHistory");
                }}
                className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition-all group cursor-pointer ${
                  isDark
                    ? "bg-white/[0.02] border-white/5 hover:bg-amber-500/10 hover:border-amber-500/30"
                    : "bg-slate-50 border-slate-200 hover:bg-amber-50 hover:border-amber-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:scale-105 transition-transform">
                    <Ship className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold block">
                      VESSEL HISTORY
                    </span>
                    <span className="text-[10px] opacity-60">
                      Sea service logs, voyages & sign-on/off
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-40 group-hover:translate-x-0.5 group-hover:opacity-100 transition-all" />
              </button>
            </div>

            {/* Modal Footer */}
            <div className="pt-2.5 border-t border-white/5 flex items-center justify-end shrink-0">
              <button
                onClick={() => setActionModalSeafarer(null)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  isDark
                    ? "border-white/10 hover:bg-white/5 text-slate-300"
                    : "border-slate-200 hover:bg-slate-100"
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
