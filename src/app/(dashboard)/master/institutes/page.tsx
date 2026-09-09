"use client";
import toast from 'react-hot-toast';

import React, { useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  GraduationCap, Search, Plus, MapPin,
  CheckCircle2, Clock, XCircle, Eye, Edit,
  X, Check, Award, BookOpen, Users, Download,
} from "lucide-react";

export type Institute = {
  id: string;
  name: string;
  code: string;
  approvalNumber: string;
  location: string;
  contactPerson: string;
  email: string;
  phone: string;
  coursesOffered: number;
  activeBatches: number;
  totalCandidatesTrained: number;
  status: "active" | "pending" | "inactive";
  rating: number;
  accreditedSince: string;
};

const INITIAL_INSTITUTES: Institute[] = [
  {
    id: "INST-001",
    name: "Anglo-Eastern Maritime Academy",
    code: "AEMA-KARJAT",
    approvalNumber: "DGS-MTI-101/2021",
    location: "Karjat, Maharashtra",
    contactPerson: "Capt. K. S. Bhandari",
    email: "admissions@angloeasternacademy.com",
    phone: "+91 2148 226850",
    coursesOffered: 18,
    activeBatches: 6,
    totalCandidatesTrained: 4820,
    status: "active",
    rating: 4.9,
    accreditedSince: "2009",
  },
  {
    id: "INST-002",
    name: "Hindustan Institute of Maritime Training (HIMT)",
    code: "HIMT-CHN",
    approvalNumber: "DGS-MTI-204/2019",
    location: "Chennai, Tamil Nadu",
    contactPerson: "Dr. Sanjeev S. Vakil",
    email: "training@himtmarine.com",
    phone: "+91 44 3010 3010",
    coursesOffered: 32,
    activeBatches: 8,
    totalCandidatesTrained: 9400,
    status: "active",
    rating: 4.8,
    accreditedSince: "1998",
  },
  {
    id: "INST-003",
    name: "Great Eastern Institute of Maritime Studies",
    code: "GEIMS-LON",
    approvalNumber: "DGS-MTI-309/2020",
    location: "Lonavala, Maharashtra",
    contactPerson: "Capt. A. K. Saxena",
    email: "academy@geims.in",
    phone: "+91 2114 261100",
    coursesOffered: 14,
    activeBatches: 4,
    totalCandidatesTrained: 3200,
    status: "active",
    rating: 4.9,
    accreditedSince: "2005",
  },
  {
    id: "INST-004",
    name: "Tolani Maritime Institute",
    code: "TMI-PUNE",
    approvalNumber: "DGS-MTI-412/2018",
    location: "Induri, Pune",
    contactPerson: "Prof. R. Deshmukh",
    email: "info@tmi.tolani.edu",
    phone: "+91 2114 669600",
    coursesOffered: 24,
    activeBatches: 5,
    totalCandidatesTrained: 6100,
    status: "active",
    rating: 4.8,
    accreditedSince: "1995",
  },
  {
    id: "INST-005",
    name: "Euro Tech Maritime Academy",
    code: "ETMA-KOC",
    approvalNumber: "DGS-MTI-508/2022",
    location: "Kochi, Kerala",
    contactPerson: "Capt. George Mathew",
    email: "admin@eurotechmaritime.org",
    phone: "+91 484 278 3511",
    coursesOffered: 12,
    activeBatches: 3,
    totalCandidatesTrained: 1850,
    status: "active",
    rating: 4.6,
    accreditedSince: "2014",
  },
  {
    id: "INST-006",
    name: "International Maritime Institute (IMI)",
    code: "IMI-DEL",
    approvalNumber: "DGS-MTI-610/2023",
    location: "Greater Noida, UP",
    contactPerson: "Capt. Rohit Srivastava",
    email: "registrar@imi.edu.in",
    phone: "+91 120 232 6311",
    coursesOffered: 16,
    activeBatches: 2,
    totalCandidatesTrained: 2900,
    status: "pending",
    rating: 4.5,
    accreditedSince: "2011",
  },
];

const EMPTY_INST: Omit<Institute, "id"> = {
  name: "",
  code: "",
  approvalNumber: "",
  location: "",
  contactPerson: "",
  email: "",
  phone: "",
  coursesOffered: 1,
  activeBatches: 1,
  totalCandidatesTrained: 0,
  status: "active",
  rating: 4.8,
  accreditedSince: new Date().getFullYear().toString(),
};

const STATUS_CONFIG = {
  active:   { label: "Accredited",   icon: CheckCircle2, cls: "text-emerald-500 dark:text-emerald-400" },
  pending:  { label: "Under Audit",  icon: Clock,        cls: "text-amber-500 dark:text-amber-400" },
  inactive: { label: "Suspended",    icon: XCircle,      cls: "text-red-500 dark:text-red-400" },
};

export default function InstitutesManagementPage() {
  const { theme } = useTheme();
  const dk = theme === "dark";

  const [institutes, setInstitutes] = useState<Institute[]>(INITIAL_INSTITUTES);
  const [search, setSearch]         = useState("");
  const [filter, setFilter]         = useState("all");
  const [selected, setSelected]     = useState<Institute | null>(null);
  const [modalMode, setModalMode]   = useState<"add" | "edit" | "view" | null>(null);
  const [form, setForm]             = useState({ ...EMPTY_INST });
  const [saved, setSaved]           = useState(false);

  // Theme tokens
  const ht       = dk ? "text-white"       : "text-slate-800";
  const mt       = dk ? "text-slate-400"   : "text-black";
  const card     = dk ? "bg-[#0f2035] border border-white/5 rounded-2xl" : "bg-white border border-slate-200 rounded-2xl shadow-sm";
  const inputCls = dk
    ? "bg-white/5 border border-white/8 text-white placeholder:text-slate-400 focus:border-sky-500/50 outline-none"
    : "bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-black focus:border-sky-400 outline-none";
  const dv       = dk ? "divide-white/5"   : "divide-slate-100";
  const rh       = dk ? "hover:bg-white/3" : "hover:bg-slate-50/80";
  const thCls    = dk ? "border-b border-white/5 text-slate-300" : "border-b border-slate-100 text-black font-semibold";
  const modalBg  = dk ? "bg-[#0c1a2e] border border-white/10" : "bg-white border border-slate-200";

  const filtered = institutes.filter(i => {
    const q = search.toLowerCase();
    const matchSearch =
      i.name.toLowerCase().includes(q) ||
      i.code.toLowerCase().includes(q) ||
      i.location.toLowerCase().includes(q) ||
      i.approvalNumber.toLowerCase().includes(q);
    const matchFilter = filter === "all" || i.status === filter;
    return matchSearch && matchFilter;
  });

  const openModal = (mode: "add" | "edit" | "view", inst?: Institute) => {
    setModalMode(mode);
    setSelected(inst || null);
    if (inst) {
      setForm({ ...inst });
    } else {
      setForm({ ...EMPTY_INST });
    }
    setSaved(false);
  };

  const closeModal = () => {
    setModalMode(null);
    setSelected(null);
    setSaved(false);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.code.trim()) return;
    if (modalMode === "add") {
      const newInst: Institute = {
        id: `INST-${String(institutes.length + 1).padStart(3, "0")}`,
        ...form,
      };
      setInstitutes(prev => [newInst, ...prev]);
    } else if (modalMode === "edit" && selected) {
      setInstitutes(prev => prev.map(i => i.id === selected.id ? { ...i, ...form } : i));
    }
    setSaved(true);
    setTimeout(closeModal, 1000);
  };

  const stats = [
    { label: "Total Institutes",      value: institutes.length,                                     Icon: GraduationCap, color: "bg-emerald-500/15", ic: "text-emerald-400" },
    { label: "Active Batches",        value: institutes.reduce((acc, i) => acc + i.activeBatches, 0),Icon: BookOpen,      color: "bg-sky-500/15",     ic: "text-sky-400" },
    { label: "Candidates Trained",    value: institutes.reduce((acc, i) => acc + i.totalCandidatesTrained, 0).toLocaleString(), Icon: Users, color: "bg-violet-500/15",  ic: "text-violet-400" },
    { label: "DG Shipping Approved",  value: institutes.filter(i => i.status === "active").length,  Icon: Award,         color: "bg-indigo-500/15",  ic: "text-indigo-400" },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-xl font-bold ${ht}`}>Institute Management</h1>
          <p className={`text-sm mt-0.5 ${mt}`}>
            Manage DG Shipping approved maritime training institutes, academies, and course centers
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => toast("Exporting Institute directory...")}
            className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-xl border transition-colors ${
              dk ? "border-white/10 text-white/70 hover:bg-white/5" : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Download className="w-4 h-4" /> Export Directory
          </button>
          <button
            onClick={() => openModal("add")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border transition-all shadow-sm ${
              dk ? "border-white/10 bg-white/5 text-white hover:bg-white/10" : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
            }`}
          >
            <Plus className="w-4 h-4" /> Add Institute
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className={`${card} p-4 flex items-center gap-4`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}>
              <s.Icon className={`w-5 h-5 ${s.ic}`} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${ht}`}>{s.value}</p>
              <p className={`text-xs font-semibold ${ht} opacity-80`}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className={card}>

        {/* Toolbar */}
        <div className={`flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b ${dk ? "border-white/5" : "border-slate-100"}`}>
          <div className="relative flex-1 min-w-[240px] max-w-sm">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${mt}`} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search institutes by name, code, or city..."
              className={`w-full pl-9 pr-4 py-2 text-sm rounded-lg ${inputCls}`}
            />
          </div>

          <div className="flex items-center gap-3">
            {["all", "active", "pending", "inactive"].map(f => {
              const isSel = filter === f;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-xs capitalize transition-colors ${
                    isSel
                      ? "text-emerald-500 dark:text-emerald-400 font-bold underline underline-offset-4 decoration-2 decoration-emerald-500"
                      : dk ? "text-slate-400 hover:text-white font-medium" : "text-black hover:text-black font-medium"
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={thCls}>
                <th className="text-left px-6 py-3.5 text-[10px] font-semibold uppercase tracking-wider">Institute</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-semibold uppercase tracking-wider">Approval & Code</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-semibold uppercase tracking-wider">Location</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-semibold uppercase tracking-wider">Contact</th>
                <th className="text-center px-4 py-3.5 text-[10px] font-semibold uppercase tracking-wider">Batches</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-semibold uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-3.5 text-[10px] font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${dv}`}>
              {filtered.map(i => {
                const S = STATUS_CONFIG[i.status];
                const SIcon = S.icon;
                return (
                  <tr key={i.id} className={`${rh} transition-colors`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400 font-bold shrink-0">
                          <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                          <p className={`font-semibold text-[13px] ${ht}`}>{i.name}</p>
                          <p className={`text-[11px] ${mt}`}>Rating: ★ {i.rating} · Since {i.accreditedSince}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className={`text-xs font-mono font-semibold ${ht}`}>{i.code}</p>
                      <p className={`text-[10px] font-mono ${mt}`}>{i.approvalNumber}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className={`text-xs flex items-center gap-1.5 ${mt}`}>
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-sky-400" />
                        {i.location}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className={`text-xs font-medium ${ht}`}>{i.contactPerson}</p>
                      <p className={`text-[11px] ${mt}`}>{i.email}</p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-block text-black dark:text-white text-xs font-semibold">
                        {i.activeBatches} active ({i.coursesOffered} courses)
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold ${S.cls}`}>
                        <SIcon className="w-3.5 h-3.5" />
                        {S.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openModal("view", i)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            dk ? "hover:bg-white/10 text-white/40 hover:text-white" : "hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                          }`}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openModal("edit", i)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            dk ? "hover:bg-white/10 text-white/40 hover:text-emerald-400" : "hover:bg-slate-100 text-slate-400 hover:text-emerald-600"
                          }`}
                          title="Edit Institute"
                        >
                          <Edit className="w-4 h-4" />
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
              <GraduationCap className={`w-10 h-10 mx-auto mb-3 ${mt}`} />
              <p className={`text-sm font-medium ${mt}`}>No institutes found</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-3 border-t text-xs ${mt} ${dk ? "border-white/5" : "border-slate-100"}`}>
          Showing {filtered.length} of {institutes.length} accredited institutes
        </div>
      </div>

      {/*  MODAL: ADD / EDIT / VIEW INSTITUTE  */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <div
            className={`relative w-full max-w-lg rounded-2xl shadow-2xl z-10 ${modalBg}`}
            onClick={e => e.stopPropagation()}
          >
            <div className={`px-6 py-4 flex items-center justify-between border-b ${dk ? "border-white/8" : "border-slate-100"}`}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h2 className={`text-sm font-semibold ${ht}`}>
                  {modalMode === "add" ? "Add New Institute" : modalMode === "edit" ? "Edit Institute" : "Institute Details"}
                </h2>
              </div>
              <button onClick={closeModal} className={`p-1.5 rounded-lg ${dk ? "hover:bg-white/10 text-white/40" : "hover:bg-slate-100 text-slate-400"}`}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${dk ? "text-white/70" : "text-slate-600"}`}>Institute Name</label>
                <input
                  disabled={modalMode === "view"}
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Anglo-Eastern Maritime Academy"
                  className={`w-full px-3 py-2 text-sm rounded-lg border ${inputCls}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${dk ? "text-white/70" : "text-slate-600"}`}>Institute Code</label>
                  <input
                    disabled={modalMode === "view"}
                    value={form.code}
                    onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
                    placeholder="e.g. AEMA-KARJAT"
                    className={`w-full px-3 py-2 text-sm rounded-lg border ${inputCls}`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${dk ? "text-white/70" : "text-slate-600"}`}>DG Approval Number</label>
                  <input
                    disabled={modalMode === "view"}
                    value={form.approvalNumber}
                    onChange={e => setForm(f => ({ ...f, approvalNumber: e.target.value }))}
                    placeholder="e.g. DGS-MTI-101/2021"
                    className={`w-full px-3 py-2 text-sm rounded-lg border ${inputCls}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${dk ? "text-white/70" : "text-slate-600"}`}>Location</label>
                  <input
                    disabled={modalMode === "view"}
                    value={form.location}
                    onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    placeholder="e.g. Mumbai, Maharashtra"
                    className={`w-full px-3 py-2 text-sm rounded-lg border ${inputCls}`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${dk ? "text-white/70" : "text-slate-600"}`}>Contact Person</label>
                  <input
                    disabled={modalMode === "view"}
                    value={form.contactPerson}
                    onChange={e => setForm(f => ({ ...f, contactPerson: e.target.value }))}
                    placeholder="e.g. Capt. Sharma"
                    className={`w-full px-3 py-2 text-sm rounded-lg border ${inputCls}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${dk ? "text-white/70" : "text-slate-600"}`}>Email</label>
                  <input
                    disabled={modalMode === "view"}
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="info@academy.edu"
                    className={`w-full px-3 py-2 text-sm rounded-lg border ${inputCls}`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${dk ? "text-white/70" : "text-slate-600"}`}>Phone</label>
                  <input
                    disabled={modalMode === "view"}
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+91 22 1234 5678"
                    className={`w-full px-3 py-2 text-sm rounded-lg border ${inputCls}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${dk ? "text-white/70" : "text-slate-600"}`}>Status</label>
                  <select
                    disabled={modalMode === "view"}
                    value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value as Institute["status"] }))}
                    className={`w-full px-3 py-2 text-sm rounded-lg border ${inputCls}`}
                  >
                    <option value="active">Accredited</option>
                    <option value="pending">Under Audit</option>
                    <option value="inactive">Suspended</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${dk ? "text-white/70" : "text-slate-600"}`}>Active Batches</label>
                  <input
                    type="number"
                    disabled={modalMode === "view"}
                    value={form.activeBatches}
                    onChange={e => setForm(f => ({ ...f, activeBatches: parseInt(e.target.value) || 0 }))}
                    className={`w-full px-3 py-2 text-sm rounded-lg border ${inputCls}`}
                  />
                </div>
              </div>
            </div>

            <div className={`px-6 py-4 border-t flex items-center justify-end gap-3 ${dk ? "border-white/8" : "border-slate-100"}`}>
              <button
                onClick={closeModal}
                className={`px-4 py-2 text-xs font-semibold rounded-lg border ${
                  dk ? "border-white/10 text-white/60 hover:bg-white/5" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {modalMode === "view" ? "Close" : "Cancel"}
              </button>
              {modalMode !== "view" && (
                <button
                  onClick={handleSave}
                  className={`flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-lg transition-all ${
                    saved ? "bg-emerald-600 text-white" : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                  }`}
                >
                  {saved ? <><Check className="w-4 h-4" /> Saved!</> : modalMode === "add" ? "Add Institute" : "Save Changes"}
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
