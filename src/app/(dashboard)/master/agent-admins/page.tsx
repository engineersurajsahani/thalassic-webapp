"use client";

import React, { useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  Handshake, Search, Plus, Mail, Phone, MapPin,
  CheckCircle2, Clock, XCircle, Eye,
  X, Check, Key, History, Shield, Activity, Power, PowerOff,
  Building2, BookOpen, Users, Wallet, FileText, ArrowUpRight,
} from "lucide-react";
import { MOCK_PARTNERS, MockPartner, MOCK_SEAFARERS } from "@/data/master-portal-mock";

const STATUS_CONFIG = {
  active:   { label: "Active",   icon: CheckCircle2, cls: "bg-emerald-500/15 text-emerald-400" },
  pending:  { label: "Pending",  icon: Clock,        cls: "bg-amber-500/15 text-amber-400"    },
  inactive: { label: "Inactive", icon: XCircle,      cls: "bg-red-500/15 text-red-400"        },
};

const LOGIN_HISTORY = [
  { date: "Today, 8:30 AM",        ip: "103.45.12.99",  device: "Chrome · Windows",  status: "Success" },
  { date: "Yesterday, 5:15 PM",    ip: "103.45.12.99",  device: "Mobile App · Android", status: "Success" },
  { date: "24 Jul 2025, 10:45 AM", ip: "182.70.44.11",  device: "Chrome · Mac",      status: "Success" },
  { date: "21 Jul 2025, 7:30 PM",  ip: "45.115.21.77",  device: "Firefox · Windows", status: "Failed"  },
  { date: "18 Jul 2025, 2:00 PM",  ip: "103.45.12.99",  device: "Chrome · Windows",  status: "Success" },
];

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
  const [partnerList, setPartnerList] = useState<MockPartner[]>(MOCK_PARTNERS);
  const [search, setSearch]           = useState("");
  const [filter, setFilter]           = useState("all");
  const [modal, setModal]             = useState<ModalType>(null);
  const [selected, setSelected]       = useState<MockPartner | null>(null);
  const [viewTab, setViewTab]         = useState<"profile" | "seafarers" | "courses" | "settlements">("profile");

  // New partner form (optional add modal)
  const [form, setForm] = useState({
    name: "", agencyName: "", rpslNumber: "", contactPerson: "",
    email: "", phone: "", location: "",
  });
  const [saved, setSaved] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  // theme tokens
  const ht       = dk ? "text-white"       : "text-slate-800";
  const mt       = dk ? "text-white/40"    : "text-slate-400";
  const card     = dk ? "bg-[#0f2035] border border-white/5 rounded-2xl" : "bg-white border border-slate-200 rounded-2xl shadow-sm";
  const inputCls = dk ? "bg-white/5 border border-white/8 text-white placeholder:text-white/25 focus:border-violet-500/50 outline-none" : "bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-violet-400 outline-none";
  const dv       = dk ? "divide-white/5"   : "divide-slate-100";
  const rh       = dk ? "hover:bg-white/3" : "hover:bg-slate-50/80";
  const thCls    = dk ? "border-b border-white/5 text-white/25" : "border-b border-slate-100 text-slate-400";
  const modalBg  = dk ? "bg-[#0f2035] border border-white/10" : "bg-white border border-slate-200";
  const labelCls = dk ? "text-white/60" : "text-slate-600";

  const filtered = partnerList.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(q) ||
      p.agencyName.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.rpslNumber.toLowerCase().includes(q);
    const matchFilter = filter === "all" || p.status === filter;
    return matchSearch && matchFilter;
  });

  const openModal = (type: ModalType, partner?: MockPartner) => {
    setSelected(partner ?? null);
    setViewTab("profile");
    setSaved(false);
    setResetDone(false);
    setModal(type);
  };

  const closeModal = () => {
    setModal(null);
    setSelected(null);
    setSaved(false);
    setResetDone(false);
  };

  const toggleStatus = (p: MockPartner) => {
    setPartnerList(prev => prev.map(item =>
      item.id === p.id
        ? { ...item, status: item.status === "active" ? "inactive" : "active" }
        : item
    ));
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
          className="flex items-center gap-2 px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-md shadow-violet-500/20"
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
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Partner name, Agency, RPSL #, or email..."
            className={`w-full pl-9 pr-4 py-2 text-sm rounded-xl ${inputCls}`}
          />
        </div>
        <div className="flex items-center gap-2">
          {(["all", "active", "inactive", "pending"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl capitalize transition-colors ${
                filter === f
                  ? "bg-violet-500 text-white shadow-sm"
                  : dk ? "bg-white/5 text-white/50 hover:bg-white/10" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {f}
            </button>
          ))}
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
              {filtered.map(p => {
                const S = STATUS_CONFIG[p.status];
                const SIcon = S.icon;
                return (
                  <tr key={p.id} className={`${rh} transition-colors`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/30 flex items-center justify-center text-xs font-bold shrink-0">
                          {p.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <button
                            onClick={() => openModal("view", p)}
                            className={`font-semibold text-[13px] text-left hover:underline ${ht}`}
                          >
                            {p.name}
                          </button>
                          <p className={`text-[11px] ${mt}`}>{p.agencyName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[12px] font-mono font-medium ${dk ? "text-violet-300" : "text-violet-700"}`}>
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
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${S.cls}`}>
                        <SIcon className="w-3 h-3" />{S.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {/* PRD 1.8 View-only details button (NO EDIT BUTTON) */}
                        <button
                          onClick={() => openModal("view", p)}
                          title="View Partner Details (View-Only)"
                          className={`p-1.5 rounded-lg transition-colors ${dk ? "hover:bg-violet-500/20 text-violet-400" : "hover:bg-violet-50 text-violet-600"}`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleStatus(p)}
                          title={p.status === "active" ? "Deactivate Partner" : "Activate Partner"}
                          className={`p-1.5 rounded-lg transition-colors ${
                            p.status === "active"
                              ? (dk ? "hover:bg-red-500/10 text-white/40 hover:text-red-400" : "hover:bg-red-50 text-slate-400 hover:text-red-500")
                              : (dk ? "hover:bg-emerald-500/10 text-white/40 hover:text-emerald-400" : "hover:bg-emerald-50 text-slate-400 hover:text-emerald-500")
                          }`}
                        >
                          {p.status === "active" ? <PowerOff className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => openModal("reset", p)}
                          title="Reset Password"
                          className={`p-1.5 rounded-lg transition-colors ${dk ? "hover:bg-amber-500/10 text-white/40 hover:text-amber-400" : "hover:bg-amber-50 text-slate-400 hover:text-amber-500"}`}
                        >
                          <Key className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openModal("audit", p)}
                          title="Audit Trail"
                          className={`p-1.5 rounded-lg transition-colors ${dk ? "hover:bg-white/8 text-white/40 hover:text-white/70" : "hover:bg-slate-100 text-slate-400 hover:text-slate-600"}`}
                        >
                          <Activity className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className={`px-6 py-3.5 border-t ${dk ? "border-white/5" : "border-slate-100"} flex items-center justify-between`}>
          <p className={`text-[12px] ${mt}`}>Showing {filtered.length} of {partnerList.length} maritime partners</p>
          <span className={`text-[11px] ${mt}`}>Compliant with PRD §1.8 (View-Only Management)</span>
        </div>
      </div>

      {/* ── MODAL: Comprehensive View-Only Partner Detail (PRD 1.8) ── */}
      {modal === "view" && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden ${modalBg}`}>
            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b ${dk ? "border-white/8" : "border-slate-100"}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/30 flex items-center justify-center text-sm font-bold">
                  {selected.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className={`text-base font-bold ${ht}`}>{selected.name}</h2>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                      VIEW-ONLY
                    </span>
                  </div>
                  <p className={`text-xs ${mt}`}>{selected.agencyName} · RPSL: {selected.rpslNumber}</p>
                </div>
              </div>
              <button onClick={closeModal} className={`p-1.5 rounded-lg ${dk ? "hover:bg-white/8 text-white/40" : "hover:bg-slate-100 text-slate-400"}`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className={`flex items-center gap-2 px-6 pt-3 border-b ${dk ? "border-white/8" : "border-slate-100"}`}>
              {[
                { id: "profile",     label: "Partner Profile",        Icon: Building2 },
                { id: "seafarers",   label: "Associated Seafarers",   Icon: Users     },
                { id: "courses",     label: "Course Pricing & Terms", Icon: BookOpen  },
                { id: "settlements", label: "Settlement Summary",     Icon: Wallet    },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setViewTab(t.id as any)}
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold border-b-2 transition-colors -mb-px ${
                    viewTab === t.id
                      ? "border-violet-500 text-violet-400"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <t.Icon className="w-3.5 h-3.5" />
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {viewTab === "profile" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-3.5 rounded-xl border ${dk ? "bg-white/3 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                      <p className={`text-[10px] font-semibold uppercase ${mt}`}>RPSL Number</p>
                      <p className={`text-sm font-bold mt-1 ${ht}`}>{selected.rpslNumber}</p>
                    </div>
                    <div className={`p-3.5 rounded-xl border ${dk ? "bg-white/3 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                      <p className={`text-[10px] font-semibold uppercase ${mt}`}>Operational Status</p>
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full mt-1 ${STATUS_CONFIG[selected.status].cls}`}>
                        {STATUS_CONFIG[selected.status].label}
                      </span>
                    </div>
                    <div className={`p-3.5 rounded-xl border ${dk ? "bg-white/3 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                      <p className={`text-[10px] font-semibold uppercase ${mt}`}>Contact Person</p>
                      <p className={`text-sm font-bold mt-1 ${ht}`}>{selected.contactPerson}</p>
                    </div>
                    <div className={`p-3.5 rounded-xl border ${dk ? "bg-white/3 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                      <p className={`text-[10px] font-semibold uppercase ${mt}`}>Official Email</p>
                      <p className={`text-sm font-bold mt-1 ${ht}`}>{selected.email}</p>
                    </div>
                    <div className={`p-3.5 rounded-xl border ${dk ? "bg-white/3 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                      <p className={`text-[10px] font-semibold uppercase ${mt}`}>Phone / Support Hotline</p>
                      <p className={`text-sm font-bold mt-1 ${ht}`}>{selected.phone}</p>
                    </div>
                    <div className={`p-3.5 rounded-xl border ${dk ? "bg-white/3 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                      <p className={`text-[10px] font-semibold uppercase ${mt}`}>Registered Location</p>
                      <p className={`text-sm font-bold mt-1 ${ht}`}>{selected.location}</p>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border ${dk ? "bg-white/3 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                    <h3 className={`text-xs font-bold mb-2 ${ht}`}>Operational Statistics</h3>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className={`text-base font-bold ${ht}`}>{selected.totalSeafarers}</p>
                        <p className={`text-[10px] ${mt}`}>Total Seafarers</p>
                      </div>
                      <div>
                        <p className={`text-base font-bold ${ht}`}>{selected.totalCoursePurchases}</p>
                        <p className={`text-[10px] ${mt}`}>Course Purchases</p>
                      </div>
                      <div>
                        <p className={`text-base font-bold text-violet-400`}>₹{(selected.totalAmountPayable / 1000).toFixed(0)}K</p>
                        <p className={`text-[10px] ${mt}`}>Total Revenue Volume</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {viewTab === "seafarers" && (
                <div className="space-y-3">
                  <p className={`text-xs ${mt}`}>Seafarers enrolled via {selected.name}:</p>
                  {associatedSeafarers.length > 0 ? (
                    <div className={`border rounded-xl divide-y ${dk ? "border-white/5 divide-white/5" : "border-slate-100 divide-slate-100"}`}>
                      {associatedSeafarers.map(s => (
                        <div key={s.id} className="p-3 flex items-center justify-between">
                          <div>
                            <p className={`font-semibold text-xs ${ht}`}>{s.name} ({s.rank})</p>
                            <p className={`text-[11px] ${mt}`}>INDOS: {s.indosNumber} · CDC: {s.cdcNumber}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                              {s.status}
                            </span>
                            <p className={`text-[10px] ${mt} mt-1`}>{s.enrollments.length} Course Enrollments</p>
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

              {viewTab === "courses" && (
                <div className="space-y-3">
                  <p className={`text-xs ${mt}`}>Assigned course pricing schedule (Amount Payable to Hari Om):</p>
                  <div className={`border rounded-xl overflow-hidden ${dk ? "border-white/5" : "border-slate-100"}`}>
                    <table className="w-full text-left">
                      <thead className={`text-[10px] font-semibold uppercase ${dk ? "bg-white/5 text-white/40" : "bg-slate-100 text-slate-500"}`}>
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
                            <td className={`p-3 font-bold text-emerald-400`}>₹{ap.hariomPrice.toLocaleString()}</td>
                            <td className={`p-3 ${mt}`}>₹{ap.suggestedSellingPrice.toLocaleString()}</td>
                            <td className="p-3">
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 font-semibold border border-violet-500/20">
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

              {viewTab === "settlements" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className={`p-3 rounded-xl border ${dk ? "bg-white/3 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                      <p className={`text-[10px] font-semibold uppercase ${mt}`}>Total Amount Payable</p>
                      <p className={`text-base font-bold mt-1 ${ht}`}>₹{selected.totalAmountPayable.toLocaleString()}</p>
                    </div>
                    <div className={`p-3 rounded-xl border ${dk ? "bg-white/3 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                      <p className={`text-[10px] font-semibold uppercase ${mt}`}>Amount Received</p>
                      <p className="text-base font-bold mt-1 text-emerald-400">₹{selected.totalAmountReceived.toLocaleString()}</p>
                    </div>
                    <div className={`p-3 rounded-xl border ${dk ? "bg-white/3 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                      <p className={`text-[10px] font-semibold uppercase ${mt}`}>Pending Settlement</p>
                      <p className="text-base font-bold mt-1 text-rose-400">₹{selected.pendingAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  <p className={`text-[11px] ${mt}`}>
                    * Financial calculations use the amount payable to Hari Om configured for this partner and course. The partner's individual selling price is not required for platform settlement.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={`flex items-center justify-end px-6 py-3 border-t ${dk ? "border-white/8" : "border-slate-100"}`}>
              <button onClick={closeModal} className={`px-4 py-2 text-xs font-semibold rounded-xl ${dk ? "bg-white/10 text-white hover:bg-white/15" : "bg-slate-200 text-slate-700 hover:bg-slate-300"}`}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Add Partner Agency ── */}
      {modal === "add" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4 ${modalBg}`}>
            <div className="flex items-center justify-between">
              <h2 className={`text-base font-bold ${ht}`}>Add Partner Agency</h2>
              <button onClick={closeModal} className={mt}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className={`text-[11px] font-medium block mb-1 ${labelCls}`}>Partner Name / Brand *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={`w-full px-3 py-2 text-xs rounded-xl ${inputCls}`} placeholder="e.g. Ocean Maritime Recruitment" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-[11px] font-medium block mb-1 ${labelCls}`}>Legal Agency Name</label>
                  <input value={form.agencyName} onChange={e => setForm({ ...form, agencyName: e.target.value })} className={`w-full px-3 py-2 text-xs rounded-xl ${inputCls}`} placeholder="e.g. Ocean Maritime Services Pvt Ltd" />
                </div>
                <div>
                  <label className={`text-[11px] font-medium block mb-1 ${labelCls}`}>RPSL Number *</label>
                  <input value={form.rpslNumber} onChange={e => setForm({ ...form, rpslNumber: e.target.value })} className={`w-full px-3 py-2 text-xs rounded-xl ${inputCls}`} placeholder="e.g. RPSL-MUM-482" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-[11px] font-medium block mb-1 ${labelCls}`}>Contact Person</label>
                  <input value={form.contactPerson} onChange={e => setForm({ ...form, contactPerson: e.target.value })} className={`w-full px-3 py-2 text-xs rounded-xl ${inputCls}`} placeholder="Capt. Name" />
                </div>
                <div>
                  <label className={`text-[11px] font-medium block mb-1 ${labelCls}`}>Official Email *</label>
                  <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={`w-full px-3 py-2 text-xs rounded-xl ${inputCls}`} placeholder="partner@agency.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-[11px] font-medium block mb-1 ${labelCls}`}>Phone Number</label>
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={`w-full px-3 py-2 text-xs rounded-xl ${inputCls}`} placeholder="+91 98000 00000" />
                </div>
                <div>
                  <label className={`text-[11px] font-medium block mb-1 ${labelCls}`}>Location</label>
                  <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className={`w-full px-3 py-2 text-xs rounded-xl ${inputCls}`} placeholder="e.g. Mumbai, India" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={closeModal} className={`px-4 py-2 text-xs rounded-xl ${dk ? "bg-white/5 text-white/60" : "bg-slate-100 text-slate-600"}`}>Cancel</button>
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
