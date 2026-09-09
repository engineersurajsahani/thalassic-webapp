"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useTheme } from "@/providers/theme-provider";
import { useGlobalStatus, STATUS_ICON_MAP } from "@/providers/status-provider";
import {
  Handshake, Search, Plus, Mail, Phone, MapPin,
  CheckCircle2, X, Check, Key,
  Building2, BookOpen, Users, Wallet, FileText,
  ChevronDown, ChevronLeft, ChevronRight,
} from "lucide-react";
import { MOCK_PARTNERS, MockPartner, MOCK_SEAFARERS, MOCK_PARTNER_SETTLEMENTS } from "@/data/master-portal-mock";

const AUDIT_LOG = [
  { action: "Account Registered",    by: "Master Admin", date: "15 Jan 2024", detail: "Partner agency onboarded" },
  { action: "RPSL License Verified", by: "Compliance Officer", date: "16 Jan 2024", detail: "DGS validation passed" },
  { action: "Pricing Schedule Assigned", by: "Finance Admin", date: "20 Jan 2024", detail: "Standard Tier-A Hari Om pricing" },
  { action: "Status → Active",      by: "Master Admin", date: "22 Jan 2024", detail: "Approved for seafarer enrollments" },
  { action: "Settlement Reconciled", by: "Finance Admin", date: "28 Aug 2026", detail: "UTR-HDFC-9918237190 processed" },
];

type ModalType = "view" | "add" | "reset" | "login" | "permissions" | "audit" | null;

export default function PartnerAdminsPage() {
  const { theme } = useTheme();
  const dk = theme === "dark";
  const { getStatusesForModule, getStatus } = useGlobalStatus();
  const partnerStatuses = getStatusesForModule("partner");

  const [partnerList, setPartnerList] = useState<MockPartner[]>(MOCK_PARTNERS);
  const [search, setSearch]           = useState("");
  const [filter, setFilter]           = useState<string>("all");
  const [modal, setModal]             = useState<ModalType>(null);
  const [selected, setSelected]       = useState<MockPartner | null>(null);
  const [viewTab, setViewTab]         = useState<"profile" | "seafarers" | "courses" | "settlements">("profile");
  const [saved, setSaved]             = useState(false);
  const [resetDone, setResetDone]     = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // New partner form (optional add modal)
  const [form, setForm] = useState({
    name: "", agencyName: "", rpslNumber: "", contactPerson: "",
    email: "", phone: "", location: "",
  });
  const [showPurchases, setShowPurchases] = useState(false);

  // theme tokens
  const ht       = dk ? "text-white"       : "text-slate-800";
  const mt       = dk ? "text-slate-400"   : "text-black";
  const card     = dk ? "bg-[#0f2035] border border-white/5 rounded-2xl" : "bg-white border border-slate-200 rounded-2xl shadow-sm";
  const inputCls = dk ? "bg-white/5 border border-white/8 text-white placeholder:text-slate-400 focus:border-violet-500/50 outline-none" : "bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-black focus:border-violet-400 outline-none";
  const dv       = dk ? "divide-white/5"   : "divide-slate-100";
  const rh       = dk ? "hover:bg-white/3" : "hover:bg-slate-50/80";
  const thCls    = dk ? "border-b border-white/5 text-slate-300" : "border-b border-slate-100 text-black font-semibold";
  const modalBg  = dk ? "bg-[#0f2035] border border-white/10" : "bg-white border border-slate-200";
  const labelCls = dk ? "text-slate-300 font-semibold" : "text-black font-semibold";

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    if (modal) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modal]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return partnerList.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(q) ||
        p.agencyName.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.rpslNumber.toLowerCase().includes(q);
      const matchFilter = filter === "all" || p.status === filter;
      return matchSearch && matchFilter;
    });
  }, [partnerList, search, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedPartners = useMemo(() => {
    const start = (safePage - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, safePage, rowsPerPage]);

  const openModal = (type: ModalType, partner?: MockPartner) => {
    setSelected(partner ?? null);
    setViewTab("profile");
    setSaved(false);
    setResetDone(false);
    setShowPurchases(false);
    setModal(type);
  };

  const closeModal = () => {
    setModal(null);
    setSelected(null);
    setSaved(false);
    setResetDone(false);
    setShowPurchases(false);
  };

  const handleAddPartner = () => {
    if (!form.name.trim() || !form.email.trim() || !form.rpslNumber.trim()) return;
    const newPartner: MockPartner = {
      id: `PRT-00${partnerList.length + 1}`,
      name: form.name.trim(),
      agencyName: form.agencyName.trim() || form.name.trim(),
      rpslNumber: form.rpslNumber.trim(),
      contactPerson: form.contactPerson.trim() || form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      location: form.location.trim() || "India",
      status: "active",
      joinedDate: "Today",
      lastActive: "Just now",
      totalSeafarers: 0,
      totalCoursePurchases: 0,
      totalAmountPayable: 0,
      totalAmountReceived: 0,
      pendingAmount: 0,
      assignedPricing: [],
    };
    setPartnerList(prev => [newPartner, ...prev]);
    setSaved(true);
    setTimeout(closeModal, 800);
  };

  // Associated seafarers for selected partner
  const associatedSeafarers = selected
    ? MOCK_SEAFARERS.filter(s => s.sourceType === "Partner" && s.sourceName.toLowerCase().includes(selected.name.toLowerCase()))
    : [];

  return (
    <div className="space-y-6">

      {/* Header (PRD 1.8 Partner Management) */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-bold ${ht}`}>Partner Management</h1>
          <p className={`text-sm mt-0.5 ${mt}`}>Manage registered maritime recruitment partners, RPSL agencies, and course assignments</p>
        </div>
        <button
          onClick={() => { setForm({ name: "", agencyName: "", rpslNumber: "", contactPerson: "", email: "", phone: "", location: "" }); openModal("add"); }}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border transition-colors shadow-sm ${
            dk ? "bg-white/5 border-white/10 text-white hover:bg-white/10" : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50"
          }`}
        >
          <Plus className="w-4 h-4" /> Add Partner Agency
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Partners",      val: partnerList.length,                                      sub: "Registered agencies", Icon: Handshake,    c: "text-violet-400", bg: dk ? "bg-violet-500/10" : "bg-violet-50" },
          { label: "Active Partners",     val: partnerList.filter(p => p.status === "active").length,   sub: "Operational",        Icon: CheckCircle2, c: "text-emerald-400",bg: dk ? "bg-emerald-500/10": "bg-emerald-50"},
          { label: "Partner Seafarers",   val: partnerList.reduce((acc, p) => acc + p.totalSeafarers, 0), sub: "Associated crew", Icon: Users,        c: "text-sky-400",    bg: dk ? "bg-sky-500/10"    : "bg-sky-50"    },
          { label: "Pending Settlements", val: `₹${(partnerList.reduce((acc, p) => acc + p.pendingAmount, 0) / 1000).toFixed(0)}K`, sub: "To be received", Icon: Wallet, c: "text-rose-400", bg: dk ? "bg-rose-500/10" : "bg-rose-50" },
        ].map(k => (
          <div key={k.label} className={`${card} p-4 flex items-center gap-3`}>
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

      {/* Filters & Search */}
      <div className={`${card} p-4 flex flex-wrap items-center justify-between gap-3`}>
        <div className="relative flex-1 min-w-[240px]">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${mt}`} />
          <input
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by Partner name, Agency, RPSL #, or email..."
            className={`w-full pl-9 pr-4 py-2 text-sm rounded-xl ${inputCls}`}
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setFilter("all");
              setCurrentPage(1);
            }}
            className={`text-xs capitalize transition-colors ${
              filter === "all"
                ? "text-black dark:text-white font-bold underline underline-offset-4 decoration-2 decoration-violet-500"
                : dk ? "text-slate-400 hover:text-white font-medium" : "text-black hover:text-black font-medium"
            }`}
          >
            All
          </button>
          {partnerStatuses.map(s => {
            const isSel = filter === s.id;
            return (
              <button
                key={s.id}
                onClick={() => {
                  setFilter(s.id);
                  setCurrentPage(1);
                }}
                className={`text-xs capitalize transition-colors ${
                  isSel
                    ? "text-black dark:text-white font-bold underline underline-offset-4 decoration-2 decoration-violet-500"
                    : dk ? "text-slate-400 hover:text-white font-medium" : "text-black hover:text-black font-medium"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Partners Table */}
      <div className={card}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={thCls}>
                {["Partner / Agency", "RPSL License", "Contact Details", "Location", "Associated Seafarers", "Total Payable", "Settled / Pending", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${dv}`}>
              {paginatedPartners.map(p => {
                const statusItem = getStatus(p.status);
                const statusLabel = statusItem?.label || p.status;
                const statusColor = statusItem?.color || "text-slate-400";
                const SIcon = (statusItem && STATUS_ICON_MAP[statusItem.iconName]) || CheckCircle2;
                return (
                  <tr
                    key={p.id}
                    onClick={() => openModal("view", p)}
                    className={`${rh} transition-colors cursor-pointer`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {p.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className={`font-semibold text-[13px] ${ht}`}>
                            {p.name}
                          </p>
                          <p className={`text-[11px] ${mt}`}>{p.agencyName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[12px] font-mono font-medium text-black dark:text-white`}>
                        {p.rpslNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <p className={`text-[12px] font-medium ${ht}`}>{p.contactPerson}</p>
                        <p className={`text-[11px] flex items-center gap-1 ${mt}`}><Mail className="w-3 h-3" />{p.email}</p>
                        <p className={`text-[11px] flex items-center gap-1 ${mt}`}><Phone className="w-3 h-3" />{p.phone}</p>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-[12px] ${mt}`}>
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{p.location}</span>
                    </td>
                    <td className={`px-6 py-4 text-[13px] font-bold ${ht}`}>{p.totalSeafarers}</td>
                    <td className={`px-6 py-4 text-[12px] font-semibold ${ht}`}>
                      ₹{p.totalAmountPayable.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-[11px]">
                      <span className="text-emerald-500 font-semibold">₹{(p.totalAmountReceived / 1000).toFixed(0)}K</span>
                      <span className={`mx-1 ${mt}`}>/</span>
                      <span className="text-rose-500 font-semibold">₹{(p.pendingAmount / 1000).toFixed(0)}K</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold ${statusColor}`}>
                        <SIcon className="w-3 h-3" />{statusLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal("reset", p);
                          }}
                          title="Reset Password"
                          className={`p-1.5 rounded-lg transition-colors ${dk ? "hover:bg-amber-500/10 text-white/40 hover:text-amber-400" : "hover:bg-amber-50 text-slate-400 hover:text-amber-500"}`}
                        >
                          <Key className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className={`px-6 py-3.5 border-t ${dk ? "border-white/5" : "border-slate-100"} flex flex-wrap items-center justify-between gap-4 text-xs ${mt}`}>
          <div className="flex items-center gap-2">
            <span className={`text-xs ${mt}`}>Rows per page:</span>
            <div className="relative inline-flex items-center">
              <select
                value={rowsPerPage}
                onChange={e => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className={`appearance-none text-xs font-medium py-1 pl-2.5 pr-7 rounded-lg border cursor-pointer outline-none transition-colors ${
                  dk
                    ? "bg-[#0f2035] border-white/10 text-white hover:border-white/20 focus:border-violet-500"
                    : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 focus:border-violet-500 shadow-sm"
                }`}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <ChevronDown className={`w-3.5 h-3.5 absolute right-2 pointer-events-none ${mt}`} />
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className={`p-1.5 rounded-lg border transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer ${
                  dk ? "border-white/10 hover:bg-white/5 text-white" : "border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
                title="Previous page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-xs font-medium">
                Page {safePage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className={`p-1.5 rounded-lg border transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer ${
                  dk ? "border-white/10 hover:bg-white/5 text-white" : "border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
                title="Next page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <span className={`text-[11px] ${mt}`}>Compliant with PRD §1.8 (View-Only Management)</span>
        </div>
      </div>

      {/* ── MODAL: Comprehensive View-Only Partner Detail (Matches Seafarer Profile Layout & Sizing) ── */}
      {modal === "view" && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <div
            className={`relative w-full max-w-4xl h-[560px] max-h-[90vh] flex flex-col rounded-2xl shadow-2xl z-10 overflow-hidden ${modalBg}`}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`px-6 py-4 flex items-center justify-between border-b shrink-0 ${dk ? "border-white/8" : "border-slate-100"}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {selected.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className={`text-base font-bold ${ht}`}>{selected.name}</h2>
                    <span className="text-xs font-mono font-semibold text-black dark:text-white">
                      {selected.id} • {selected.rpslNumber}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${getStatus(selected.status)?.color || "text-emerald-500"}`}>
                      <CheckCircle2 className="w-3 h-3" />
                      {getStatus(selected.status)?.label || (selected.status.charAt(0).toUpperCase() + selected.status.slice(1))}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5 text-slate-600 dark:text-slate-400 font-medium">
                    {selected.agencyName} · Registered on {selected.joinedDate}
                  </p>
                </div>
              </div>

              <button
                onClick={closeModal}
                className={`p-1.5 rounded-lg transition-colors ${dk ? "hover:bg-white/10 text-white/40" : "hover:bg-slate-100 text-slate-400"}`}
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className={`flex items-center gap-6 px-6 border-b text-xs font-semibold shrink-0 ${dk ? "border-white/8" : "border-slate-100"}`}>
              {[
                { id: "profile",     label: "Partner Profile",        Icon: Building2 },
                { id: "seafarers",   label: "Associated Seafarers",   Icon: Users     },
                { id: "courses",     label: "Course Pricing & Terms", Icon: BookOpen  },
                { id: "settlements", label: "Settlement",             Icon: Wallet    },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setViewTab(t.id as "profile" | "seafarers" | "courses" | "settlements")}
                  className={`flex items-center gap-2 py-3 border-b-2 transition-all ${
                    viewTab === t.id
                      ? (dk ? "border-violet-500 text-white" : "border-violet-600 text-slate-900")
                      : (dk ? "border-transparent text-slate-400 hover:text-white" : "border-transparent text-slate-600 hover:text-slate-900")
                  }`}
                >
                  <t.Icon className="w-3.5 h-3.5" />
                  {t.label}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {/* TAB 1: PARTNER PROFILE */}
              {viewTab === "profile" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Agency Identification */}
                    <div className={`p-4 rounded-xl border ${dk ? "bg-white/[0.02] border-white/5" : "bg-slate-50 border-slate-200"}`}>
                      <p className="text-xs font-bold uppercase tracking-wider mb-3 text-slate-700 dark:text-slate-300">Agency Identification & Legal</p>
                      <div className="space-y-3 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 dark:text-slate-300 font-medium">Partner Name:</span>
                          <span className="font-semibold text-slate-900 dark:text-slate-100">{selected.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 dark:text-slate-300 font-medium">Legal / Company Name:</span>
                          <span className="font-semibold text-slate-900 dark:text-slate-100">{selected.agencyName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 dark:text-slate-300 font-medium">Partner ID:</span>
                          <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">{selected.id}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 dark:text-slate-300 font-medium">RPSL License Number:</span>
                          <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">{selected.rpslNumber}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 dark:text-slate-300 font-medium">Operational Status:</span>
                          <span className={`inline-flex items-center gap-1 font-semibold ${getStatus(selected.status)?.color || "text-emerald-500"}`}>
                            {getStatus(selected.status)?.label || selected.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 dark:text-slate-300 font-medium">Registration Date:</span>
                          <span className="font-medium text-slate-900 dark:text-slate-100">{selected.joinedDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Contact & Location Details */}
                    <div className={`p-4 rounded-xl border ${dk ? "bg-white/[0.02] border-white/5" : "bg-slate-50 border-slate-200"}`}>
                      <p className="text-xs font-bold uppercase tracking-wider mb-3 text-slate-700 dark:text-slate-300">Contact & Location Details</p>
                      <div className="space-y-3 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 dark:text-slate-300 font-medium">Contact Person:</span>
                          <span className="font-semibold text-slate-900 dark:text-slate-100">{selected.contactPerson}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 dark:text-slate-300 font-medium">Official Email:</span>
                          <span className="font-medium text-slate-900 dark:text-slate-100">{selected.email}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 dark:text-slate-300 font-medium">Phone / Hotline:</span>
                          <span className="font-medium text-slate-900 dark:text-slate-100">{selected.phone}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 dark:text-slate-300 font-medium">Registered Location:</span>
                          <span className="font-medium text-slate-900 dark:text-slate-100">{selected.location}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 dark:text-slate-300 font-medium">Country:</span>
                          <span className="font-medium text-slate-900 dark:text-slate-100">India</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 dark:text-slate-300 font-medium">Last Active:</span>
                          <span className="font-medium text-slate-900 dark:text-slate-100">{selected.lastActive}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Financial & Settlement Overview */}
                  <div className={`p-4 rounded-xl border ${dk ? "bg-white/[0.02] border-white/5" : "bg-slate-50 border-slate-200"}`}>
                    <h3 className="text-xs font-bold uppercase tracking-wider mb-3 text-slate-700 dark:text-slate-300">Financial & Settlement Overview</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <p className="text-[10px] font-semibold uppercase text-slate-600 dark:text-slate-400">Total Amount Payable</p>
                        <p className="text-lg font-bold mt-1 text-slate-900 dark:text-slate-100">₹{selected.totalAmountPayable.toLocaleString()}</p>
                        <p className="text-[11px] mt-0.5 text-slate-600 dark:text-slate-400 font-medium">Configured Hari Om Pricing</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase text-slate-600 dark:text-slate-400">Total Settled / Received</p>
                        <p className="text-lg font-bold mt-1 text-emerald-600 dark:text-emerald-400">₹{selected.totalAmountReceived.toLocaleString()}</p>
                        <p className="text-[11px] mt-0.5 text-slate-600 dark:text-slate-400 font-medium">Verified Bank Credits</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase text-slate-600 dark:text-slate-400">Pending Settlement</p>
                        <p className="text-lg font-bold mt-1 text-rose-500 dark:text-rose-400">₹{selected.pendingAmount.toLocaleString()}</p>
                        <p className="text-[11px] mt-0.5 text-slate-600 dark:text-slate-400 font-medium">Action Required</p>
                      </div>
                    </div>
                  </div>

                  {/* Operational Crew Statistics */}
                  <div className={`p-4 rounded-xl border ${dk ? "bg-white/[0.02] border-white/5" : "bg-slate-50 border-slate-200"}`}>
                    <h3 className="text-xs font-bold uppercase tracking-wider mb-3 text-slate-700 dark:text-slate-300">Operational Statistics</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{selected.totalSeafarers}</p>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-0.5">Associated Seafarers</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{selected.totalCoursePurchases}</p>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-0.5">Course Purchases</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-slate-900 dark:text-slate-100">₹{(selected.totalAmountPayable / 1000).toFixed(0)}K</p>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-0.5">Total Revenue Volume</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ASSOCIATED SEAFARERS */}
              {viewTab === "seafarers" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Associated Seafarers ({associatedSeafarers.length})</p>
                    <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Registered via {selected.name}</span>
                  </div>
                  {associatedSeafarers.length > 0 ? (
                    <div className={`border rounded-xl divide-y ${dk ? "border-white/5 divide-white/5" : "border-slate-200 divide-slate-100"}`}>
                      {associatedSeafarers.map(s => (
                        <div key={s.id} className="p-3.5 flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-xs text-slate-900 dark:text-slate-100">{s.name} ({s.rank})</p>
                            <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400 mt-0.5">INDOS: {s.indosNumber} · CDC: {s.cdcNumber}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-[11px] font-semibold text-sky-600 dark:text-sky-400">
                              {s.status}
                            </span>
                            <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">{s.enrollments.length} Course Enrollments</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center opacity-60">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      <p>No seafarers registered under this partner yet.</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: COURSE PRICING & TERMS */}
              {viewTab === "courses" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Assigned Course Pricing Schedule</p>
                    <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Amount Payable to Hari Om</span>
                  </div>
                  <div className={`border rounded-xl overflow-hidden ${dk ? "border-white/5" : "border-slate-200"}`}>
                    <table className="w-full text-left">
                      <thead className={`text-[10px] font-semibold uppercase ${dk ? "bg-white/5 text-slate-400" : "bg-slate-100 text-slate-600"}`}>
                        <tr>
                          <th className="p-3">Course Title</th>
                          <th className="p-3">Payable to Hari Om</th>
                          <th className="p-3">Suggested Selling</th>
                          <th className="p-3">Pricing Tier</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${dk ? "divide-white/5" : "divide-slate-100"}`}>
                        {selected.assignedPricing.map(ap => (
                          <tr key={ap.courseId}>
                            <td className={`p-3 font-medium ${ht}`}>{ap.courseTitle}</td>
                            <td className="p-3 font-bold text-emerald-500">₹{ap.hariomPrice.toLocaleString()}</td>
                            <td className="p-3 text-slate-700 dark:text-slate-300 font-medium">₹{ap.suggestedSellingPrice.toLocaleString()}</td>
                            <td className="p-3">
                              <span className="text-[10px] font-semibold text-black dark:text-white">
                                {ap.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: SETTLEMENTS & TRANSACTIONS */}
              {viewTab === "settlements" && (() => {
                const s = MOCK_PARTNER_SETTLEMENTS.find(item => item.partnerId === selected.id) || {
                  id: `SET-2026-${selected.id.replace(/\D/g, "") || "001"}`,
                  partnerId: selected.id,
                  partnerName: selected.agencyName || selected.name,
                  totalPayable: selected.totalAmountPayable,
                  totalReceived: selected.totalAmountReceived,
                  pendingAmount: selected.pendingAmount,
                  settlementStatus: selected.pendingAmount === 0 ? "Settled" : selected.totalAmountReceived > 0 ? "Partially Settled" : "Pending",
                  settlementDate: "28 Aug 2026",
                  settlementReference: "UTR-HDFC-9918237190",
                  relatedPurchasesCount: selected.totalCoursePurchases || 142,
                  purchases: [],
                };

                const statusColor = (s.settlementStatus === "Settled" || s.settlementStatus === "Partially Settled")
                  ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                  : "text-rose-500 dark:text-rose-400 font-semibold";

                return (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-xl border ${dk ? "bg-white/[0.02] border-white/5" : "bg-slate-50 border-slate-200"}`}>
                      <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-slate-700 dark:text-slate-300">Settlement Details</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div>
                          <p className="text-[10px] font-semibold uppercase text-slate-600 dark:text-slate-400">Settlement ID</p>
                          <p className="text-sm font-bold font-mono mt-1 text-black dark:text-white">
                            {s.id}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-semibold uppercase text-slate-600 dark:text-slate-400">Partner Agency</p>
                          <p className={`text-sm font-semibold mt-1 ${ht}`}>{s.partnerName}</p>
                          <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400">ID: {s.partnerId}</p>
                        </div>

                        <div>
                          <p className="text-[10px] font-semibold uppercase text-slate-600 dark:text-slate-400">Total Amount Payable</p>
                          <p className={`text-sm font-bold mt-1 ${ht}`}>
                            ₹{s.totalPayable.toLocaleString()}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-semibold uppercase text-slate-600 dark:text-slate-400">Total Amount Received</p>
                          <p className="text-sm font-bold mt-1 text-emerald-600 dark:text-emerald-400">
                            ₹{s.totalReceived.toLocaleString()}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-semibold uppercase text-slate-600 dark:text-slate-400">Pending Amount</p>
                          <p className="text-sm font-bold mt-1 text-rose-500 dark:text-rose-400">
                            ₹{s.pendingAmount.toLocaleString()}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-semibold uppercase text-slate-600 dark:text-slate-400">Settlement Status</p>
                          <p className={`text-sm mt-1 ${statusColor}`}>
                            {s.settlementStatus}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-semibold uppercase text-slate-600 dark:text-slate-400">Settlement Date</p>
                          <p className={`text-sm font-medium mt-1 ${ht}`}>
                            {s.settlementDate}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-semibold uppercase text-slate-600 dark:text-slate-400">UTR / Bank Reference</p>
                          <p className={`text-sm font-mono font-medium mt-1 ${dk ? "text-white/80" : "text-slate-700"}`}>
                            {s.settlementReference}
                          </p>
                        </div>

                        <div className="md:col-span-2 pt-3 border-t border-slate-200/50 dark:border-white/5">
                          <p className="text-[10px] font-semibold uppercase text-slate-600 dark:text-slate-400">Related Purchases</p>
                          <button
                            type="button"
                            onClick={() => setShowPurchases(prev => !prev)}
                            className="inline-flex items-center gap-1.5 mt-1 text-sm font-semibold text-black dark:text-white hover:underline cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            {s.relatedPurchasesCount} Purchases {s.purchases && s.purchases.length > 0 && <span className="text-xs opacity-75">({showPurchases ? "Hide details" : "View purchases"})</span>}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Purchases Breakdown */}
                    {showPurchases && s.purchases && s.purchases.length > 0 && (
                      <div className={`p-4 rounded-xl border ${dk ? "bg-white/[0.02] border-white/5" : "bg-slate-50 border-slate-200"}`}>
                        <h4 className="text-xs font-bold uppercase tracking-wider mb-3 text-slate-700 dark:text-slate-300">Purchases in Settlement ({s.id})</h4>
                        <div className={`border rounded-lg overflow-hidden ${dk ? "border-white/5" : "border-slate-200"}`}>
                          <table className="w-full text-left text-xs">
                            <thead className={`text-[10px] font-semibold uppercase ${dk ? "bg-white/5 text-slate-400" : "bg-slate-100 text-slate-600"}`}>
                              <tr>
                                <th className="p-2.5">Seafarer</th>
                                <th className="p-2.5">Course Title</th>
                                <th className="p-2.5">Amount</th>
                                <th className="p-2.5">Date</th>
                              </tr>
                            </thead>
                            <tbody className={`divide-y ${dk ? "divide-white/5" : "divide-slate-100"}`}>
                              {s.purchases.map((p, idx) => (
                                <tr key={idx}>
                                  <td className={`p-2.5 font-medium ${ht}`}>{p.seafarerName}</td>
                                  <td className="p-2.5 text-slate-600 dark:text-slate-400">{p.courseTitle}</td>
                                  <td className="p-2.5 font-bold text-emerald-600 dark:text-emerald-400">₹{p.amount.toLocaleString()}</td>
                                  <td className="p-2.5 text-slate-600 dark:text-slate-400">{p.date}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className={`px-6 py-3 border-t flex items-center justify-between shrink-0 ${dk ? "border-white/8" : "border-slate-100"}`}>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                RPSL: {selected.rpslNumber} · Partner ID: {selected.id} · Location: {selected.location}
              </span>
              <button
                onClick={closeModal}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                  dk ? "border-white/10 text-white/70 hover:bg-white/5" : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Add Partner Agency ── */}
      {modal === "add" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={closeModal}>
          <div className={`w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4 ${modalBg}`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className={`text-base font-bold ${ht}`}>Add Partner Agency</h2>
              <button onClick={closeModal} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className={`text-[11px] block mb-1 ${labelCls}`}>Partner Name / Brand *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={`w-full px-3 py-2 text-xs rounded-xl ${inputCls}`} placeholder="e.g. Ocean Maritime Recruitment" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-[11px] block mb-1 ${labelCls}`}>Legal Agency Name</label>
                  <input value={form.agencyName} onChange={e => setForm({ ...form, agencyName: e.target.value })} className={`w-full px-3 py-2 text-xs rounded-xl ${inputCls}`} placeholder="e.g. Ocean Maritime Services Pvt Ltd" />
                </div>
                <div>
                  <label className={`text-[11px] block mb-1 ${labelCls}`}>RPSL Number *</label>
                  <input value={form.rpslNumber} onChange={e => setForm({ ...form, rpslNumber: e.target.value })} className={`w-full px-3 py-2 text-xs rounded-xl ${inputCls}`} placeholder="e.g. RPSL-MUM-482" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-[11px] block mb-1 ${labelCls}`}>Contact Person</label>
                  <input value={form.contactPerson} onChange={e => setForm({ ...form, contactPerson: e.target.value })} className={`w-full px-3 py-2 text-xs rounded-xl ${inputCls}`} placeholder="Capt. Name" />
                </div>
                <div>
                  <label className={`text-[11px] block mb-1 ${labelCls}`}>Official Email *</label>
                  <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={`w-full px-3 py-2 text-xs rounded-xl ${inputCls}`} placeholder="partner@agency.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-[11px] block mb-1 ${labelCls}`}>Phone Number</label>
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={`w-full px-3 py-2 text-xs rounded-xl ${inputCls}`} placeholder="+91 98000 00000" />
                </div>
                <div>
                  <label className={`text-[11px] block mb-1 ${labelCls}`}>Location</label>
                  <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className={`w-full px-3 py-2 text-xs rounded-xl ${inputCls}`} placeholder="e.g. Mumbai, India" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={closeModal} className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-colors ${dk ? "bg-white/5 border-white/10 text-white/80 hover:bg-white/10" : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"}`}>Cancel</button>
              <button onClick={handleAddPartner} className="px-5 py-2 text-xs font-semibold rounded-xl bg-violet-500 hover:bg-violet-600 text-white transition-colors">
                {saved ? "Partner Added!" : "Register Partner"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Reset Password ── */}
      {modal === "reset" && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center space-y-4 ${modalBg}`}>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h2 className={`text-sm font-bold ${ht}`}>Reset Partner Password</h2>
              <p className={`text-xs mt-1 ${mt}`}>Send temporary credentials to <span className="font-semibold text-white/80">{selected.email}</span>?</p>
            </div>
            {resetDone ? (
              <p className="text-xs text-emerald-400 font-semibold py-2">Reset link sent successfully!</p>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <button onClick={closeModal} className={`px-4 py-2 text-xs rounded-xl ${dk ? "bg-white/5 text-white/60" : "bg-slate-100 text-slate-600"}`}>Cancel</button>
                <button onClick={() => { setResetDone(true); setTimeout(closeModal, 1200); }} className="px-4 py-2 text-xs font-semibold rounded-xl bg-amber-500 hover:bg-amber-600 text-white">Send Reset Email</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MODAL: Audit Trail ── */}
      {modal === "audit" && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4 ${modalBg}`}>
            <div className="flex items-center justify-between">
              <h2 className={`text-sm font-bold ${ht}`}>Partner Audit Log · {selected.name}</h2>
              <button onClick={closeModal} className={mt}><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-2.5 max-h-64 overflow-y-auto">
              {AUDIT_LOG.map((al, idx) => (
                <div key={idx} className={`p-2.5 rounded-xl border text-xs ${dk ? "bg-white/3 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold ${ht}`}>{al.action}</span>
                    <span className={`text-[10px] ${mt}`}>{al.date}</span>
                  </div>
                  <p className={`text-[11px] mt-0.5 ${mt}`}>{al.detail} · By {al.by}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button onClick={closeModal} className={`px-4 py-1.5 text-xs rounded-xl ${dk ? "bg-white/10 text-white" : "bg-slate-200 text-slate-700"}`}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
