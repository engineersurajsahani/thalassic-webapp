"use client";

import React, { useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  Building2, Search, Plus, Mail, Phone, MapPin,
  CheckCircle2, Clock, XCircle, Eye, EyeOff, Edit, Trash2,
  X, Check, Key, History, Shield, Power,
  PowerOff, ChevronDown, UserCog,
} from "lucide-react";

type AdminType = "Company admin" | "Agent admin";

type CompanyAdmin = {
  id: string;
  name: string;
  adminType: AdminType;
  email: string;
  phone: string;
  location: string;
  status: string;
  seafarers: number;
  joined: string;
  lastLogin: string;
  branch?: string;
  password?: string;
};

const INITIAL_COMPANY_ADMINS: CompanyAdmin[] = [
  { id: "CA001", name: "Rajesh Kumar",  adminType: "Company admin", email: "rajesh@maritime.in",    phone: "+91 98765 43210", location: "Mumbai",    status: "active",   seafarers: 24, joined: "12 Jan 2025", lastLogin: "Today",       branch: "HQ"       },
  { id: "CA002", name: "Priya Sharma",  adminType: "Agent admin",   email: "priya@oceanfreight.in", phone: "+91 87654 32109", location: "Chennai",   status: "active",   seafarers: 18, joined: "03 Feb 2025", lastLogin: "Yesterday",   branch: "South"    },
  { id: "CA003", name: "Anil Mehta",    adminType: "Company admin", email: "anil@bluehorizon.in",   phone: "+91 76543 21098", location: "Kochi",     status: "pending",  seafarers: 0,  joined: "28 Jul 2025", lastLogin: "Never",       branch: ""         },
  { id: "CA004", name: "Sunita Nair",   adminType: "Agent admin",   email: "sunita@seatech.in",     phone: "+91 65432 10987", location: "Goa",       status: "active",   seafarers: 31, joined: "15 Mar 2025", lastLogin: "2 days ago",  branch: "West"     },
  { id: "CA005", name: "Vikram Singh",  adminType: "Company admin", email: "vikram@coastal.in",     phone: "+91 54321 09876", location: "Kolkata",   status: "inactive", seafarers: 7,  joined: "22 Apr 2025", lastLogin: "1 month ago", branch: "East"     },
  { id: "CA006", name: "Meera Pillai",  adminType: "Agent admin",   email: "meera@pacific.in",      phone: "+91 43210 98765", location: "Mangalore", status: "active",   seafarers: 15, joined: "01 May 2025", lastLogin: "Today",       branch: "South"    },
  { id: "CA007", name: "Arjun Reddy",   adminType: "Company admin", email: "arjun@harbour.in",      phone: "+91 32109 87654", location: "Vizag",     status: "pending",  seafarers: 0,  joined: "30 Jul 2025", lastLogin: "Never",       branch: ""         },
  { id: "CA008", name: "Kavitha Bose",  adminType: "Agent admin",   email: "kavitha@tidal.in",      phone: "+91 21098 76543", location: "Paradip",   status: "active",   seafarers: 9,  joined: "10 Jun 2025", lastLogin: "3 days ago",  branch: "East"     },
];

const EMPTY_CA: {
  name: string;
  adminType: AdminType;
  email: string;
  password: string;
  phone: string;
  location: string;
  branch: string;
} = {
  name: "",
  adminType: "Company admin",
  email: "",
  password: "",
  phone: "",
  location: "",
  branch: "",
};

const STATUS_CONFIG = {
  active:   { label: "Active",   icon: CheckCircle2, cls: "bg-emerald-500/15 text-emerald-400" },
  pending:  { label: "Pending",  icon: Clock,        cls: "bg-amber-500/15 text-amber-400"    },
  inactive: { label: "Inactive", icon: XCircle,      cls: "bg-red-500/15 text-red-400"        },
};

const PERMISSIONS = ["View Dashboard","Manage Seafarers","View Finance","Export Reports","Manage Courses","Manage Agents","Billing Access"];

const LOGIN_HISTORY = [
  { date: "Today, 9:14 AM",       ip: "103.45.12.88",  device: "Chrome · Windows",  status: "Success" },
  { date: "Yesterday, 6:42 PM",   ip: "103.45.12.88",  device: "Mobile App · iOS",  status: "Success" },
  { date: "25 Jul 2025, 11:02 AM",ip: "182.70.33.21",  device: "Chrome · Mac",      status: "Success" },
  { date: "22 Jul 2025, 8:30 PM", ip: "45.115.20.99",  device: "Firefox · Windows", status: "Failed"  },
  { date: "20 Jul 2025, 3:15 PM", ip: "103.45.12.88",  device: "Chrome · Windows",  status: "Success" },
];

const AUDIT_LOG = [
  { action: "Account Created",         by: "Master Admin", date: "12 Jan 2025", detail: "Initial setup" },
  { action: "Permissions Updated",     by: "Master Admin", date: "15 Jan 2025", detail: "Added Billing Access" },
  { action: "Status → Active",         by: "Master Admin", date: "12 Jan 2025", detail: "After email verification" },
  { action: "Password Reset Sent",     by: "Master Admin", date: "03 Mar 2025", detail: "Admin requested reset" },
  { action: "Branch Updated",          by: "Master Admin", date: "20 Apr 2025", detail: "HQ → South" },
];

type ModalType = "add" | "edit" | "reset" | "login" | null;

export default function CompanyAdminsPage() {
  const { theme } = useTheme();
  const dk = theme === "dark";
  const [adminList, setAdminList] = useState<CompanyAdmin[]>(INITIAL_COMPANY_ADMINS);
  const [search, setSearch]       = useState("");
  const [filter, setFilter]       = useState("all");
  const [modal, setModal]         = useState<ModalType>(null);
  const [selected, setSelected]   = useState<CompanyAdmin | null>(null);
  const [form, setForm]           = useState({ ...EMPTY_CA });
  const [saved, setSaved]         = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // theme tokens
  const ht       = dk ? "text-white"       : "text-slate-800";
  const mt       = dk ? "text-white/40"    : "text-slate-400";
  const card     = dk ? "bg-[#0f2035] border border-white/5 rounded-2xl" : "bg-white border border-slate-200 rounded-2xl shadow-sm";
  const inputCls = dk ? "bg-white/5 border border-white/8 text-white placeholder:text-white/25 focus:border-sky-500/50 outline-none" : "bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-sky-400 outline-none";
  const dv       = dk ? "divide-white/5"   : "divide-slate-100";
  const rh       = dk ? "hover:bg-white/3" : "hover:bg-slate-50/80";
  const thCls    = dk ? "border-b border-white/5 text-white/25" : "border-b border-slate-100 text-slate-400";
  const modalBg  = dk ? "bg-[#0f2035] border border-white/10" : "bg-white border border-slate-200";
  const labelCls = dk ? "text-white/60" : "text-slate-600";

  const filtered = adminList.filter(a => {
    const q = search.toLowerCase();
    const matchSearch = a.name.toLowerCase().includes(q) ||
      a.adminType.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.location.toLowerCase().includes(q);
    const matchFilter = filter === "all" || a.status === filter;
    return matchSearch && matchFilter;
  });

  const openModal = (type: ModalType, admin?: CompanyAdmin) => {
    setSelected(admin ?? null);
    setShowPassword(false);
    if (type === "edit" && admin) {
      setForm({
        name: admin.name,
        adminType: admin.adminType,
        email: admin.email,
        password: admin.password || "",
        phone: admin.phone,
        location: admin.location,
        branch: admin.branch ?? "",
      });
    }
    if (type === "add") {
      setForm({ ...EMPTY_CA });
    }
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

  const handleAddOrEdit = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    if (modal === "add") {
      const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
      const newAdmin: CompanyAdmin = {
        id: `CA${String(adminList.length + 1).padStart(3, "0")}`,
        ...form,
        status: "active",
        seafarers: 0,
        joined: today,
        lastLogin: "Never",
      };
      setAdminList(prev => [newAdmin, ...prev]);
    } else if (modal === "edit" && selected) {
      setAdminList(prev => prev.map(a => a.id === selected.id ? { ...a, ...form } : a));
    }
    setSaved(true);
    setTimeout(closeModal, 1000);
  };

  const toggleStatus = (admin: CompanyAdmin) => {
    const next = admin.status === "active" ? "inactive" : "active";
    setAdminList(prev => prev.map(a => a.id === admin.id ? { ...a, status: next } : a));
  };

  const handleResetPassword = () => { setResetDone(true); setTimeout(closeModal, 1400); };

  const stats = [
    { label: "Total Admins",     value: adminList.length,                                             color: "bg-sky-500/15",     iconColor: "text-sky-400"     },
    { label: "Active Admins",    value: adminList.filter(a => a.status === "active").length,   color: "bg-emerald-500/15", iconColor: "text-emerald-400" },
    { label: "Company Admins",   value: adminList.filter(a => a.adminType === "Company admin").length, color: "bg-blue-500/15",   iconColor: "text-blue-400"    },
    { label: "Agent Admins",     value: adminList.filter(a => a.adminType === "Agent admin").length,   color: "bg-violet-500/15", iconColor: "text-violet-400"  },
  ];

  // Modal inner content
  const renderModal = () => {
    if (!modal) return null;

    // ADD / EDIT form
    if (modal === "add" || modal === "edit") {
      const isEdit = modal === "edit";
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className={`relative w-full max-w-lg rounded-2xl shadow-2xl z-10 ${modalBg}`} onClick={e => e.stopPropagation()}>
            <div className={`flex items-center justify-between px-6 py-4 border-b ${dk ? "border-white/8" : "border-slate-100"}`}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500/15 flex items-center justify-center">
                  <UserCog className="w-4 h-4 text-sky-400" />
                </div>
                <p className={`text-sm font-semibold ${ht}`}>{isEdit ? "Edit Administrator" : "Add Administrator"}</p>
              </div>
              <button onClick={closeModal} className={`p-1.5 rounded-lg transition-colors ${dk ? "hover:bg-white/8 text-white/40" : "hover:bg-slate-100 text-slate-400"}`}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {/* Admin Type Selection */}
              <div>
                <label className={`block text-xs font-semibold mb-2 ${labelCls}`}>
                  Admin Type <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, adminType: "Company admin" }))}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      form.adminType === "Company admin"
                        ? "bg-sky-500 text-white border-sky-500 shadow-sm"
                        : dk ? "bg-white/5 border-white/10 text-white/60 hover:bg-white/10" : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" /> Company admin
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, adminType: "Agent admin" }))}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      form.adminType === "Agent admin"
                        ? "bg-violet-500 text-white border-violet-500 shadow-sm"
                        : dk ? "bg-white/5 border-white/10 text-white/60 hover:bg-white/10" : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <UserCog className="w-3.5 h-3.5" /> Agent admin
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Rajesh Kumar"
                  className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${inputCls}`}
                />
              </div>

              {/* Email Address */}
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="admin@thalassic.in"
                  className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${inputCls}`}
                />
              </div>

              {/* Add Password Field */}
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>
                  {isEdit ? "Update Password (Optional)" : "Add Password"} <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="••••••••••••"
                    className={`w-full pl-3 pr-10 py-2 text-sm rounded-lg border transition-colors ${inputCls}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 text-xs ${mt} hover:${ht}`}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Phone & Location */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>Mobile Number</label>
                  <input
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                    className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${inputCls}`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>Location</label>
                  <input
                    value={form.location}
                    onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    placeholder="e.g. Mumbai"
                    className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${inputCls}`}
                  />
                </div>
              </div>

              {/* Branch */}
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>Branch / Department (Optional)</label>
                <input
                  value={form.branch}
                  onChange={e => setForm(f => ({ ...f, branch: e.target.value }))}
                  placeholder="e.g. Headquarters / Regional"
                  className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${inputCls}`}
                />
              </div>
            </div>
            <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${dk ? "border-white/8" : "border-slate-100"}`}>
              <button onClick={closeModal} className={`px-4 py-2 text-sm font-medium rounded-xl border transition-colors ${dk ? "border-white/10 text-white/50 hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>Cancel</button>
              <button onClick={handleAddOrEdit} className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl transition-all ${saved ? "bg-emerald-500 text-white" : "bg-sky-500 hover:bg-sky-600 text-white"}`}>
                {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Plus className="w-4 h-4" /> {isEdit ? "Save Changes" : "Add Administrator"}</>}
              </button>
            </div>
          </div>
        </div>
      );
    }

    // RESET PASSWORD
    if (modal === "reset" && selected) return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModal}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className={`relative w-full max-w-sm rounded-2xl shadow-2xl z-10 ${modalBg}`} onClick={e => e.stopPropagation()}>
          <div className={`flex items-center justify-between px-6 py-4 border-b ${dk ? "border-white/8" : "border-slate-100"}`}>
            <div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center"><Key className="w-4 h-4 text-amber-400" /></div>
              <p className={`text-sm font-semibold ${ht}`}>Reset Password</p></div>
            <button onClick={closeModal} className={`p-1.5 rounded-lg ${dk ? "hover:bg-white/8 text-white/40" : "hover:bg-slate-100 text-slate-400"}`}><X className="w-4 h-4" /></button>
          </div>
          <div className="px-6 py-6 text-center">
            <p className={`text-sm ${mt}`}>A password reset link will be sent to</p>
            <p className={`text-sm font-semibold mt-1 ${ht}`}>{selected.email}</p>
            <p className={`text-xs mt-3 ${mt}`}>The administrator will receive an email with instructions to set a new password.</p>
          </div>
          <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${dk ? "border-white/8" : "border-slate-100"}`}>
            <button onClick={closeModal} className={`px-4 py-2 text-sm font-medium rounded-xl border ${dk ? "border-white/10 text-white/50 hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>Cancel</button>
            <button onClick={handleResetPassword} className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl transition-all ${resetDone ? "bg-emerald-500 text-white" : "bg-amber-500 hover:bg-amber-600 text-white"}`}>
              {resetDone ? <><Check className="w-4 h-4" /> Sent!</> : <><Key className="w-4 h-4" /> Send Reset Link</>}
            </button>
          </div>
        </div>
      </div>
    );

    // LOGIN HISTORY
    if (modal === "login" && selected) return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModal}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className={`relative w-full max-w-lg rounded-2xl shadow-2xl z-10 ${modalBg}`} onClick={e => e.stopPropagation()}>
          <div className={`flex items-center justify-between px-6 py-4 border-b ${dk ? "border-white/8" : "border-slate-100"}`}>
            <div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center"><History className="w-4 h-4 text-indigo-400" /></div>
              <div><p className={`text-sm font-semibold ${ht}`}>Login History</p><p className={`text-xs ${mt}`}>{selected.name}</p></div></div>
            <button onClick={closeModal} className={`p-1.5 rounded-lg ${dk ? "hover:bg-white/8 text-white/40" : "hover:bg-slate-100 text-slate-400"}`}><X className="w-4 h-4" /></button>
          </div>
          <div className={`divide-y ${dv} max-h-80 overflow-y-auto`}>
            {LOGIN_HISTORY.map((l, i) => (
              <div key={i} className="flex items-center justify-between px-6 py-3.5">
                <div>
                  <p className={`text-[13px] font-medium ${ht}`}>{l.date}</p>
                  <p className={`text-[11px] mt-0.5 ${mt}`}>{l.device} · {l.ip}</p>
                </div>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${l.status === "Success" ? (dk ? "bg-emerald-500/15 text-emerald-400" : "bg-emerald-50 text-emerald-700") : (dk ? "bg-red-500/15 text-red-400" : "bg-red-50 text-red-700")}`}>{l.status}</span>
              </div>
            ))}
          </div>
          <div className={`px-6 py-3 border-t ${dk ? "border-white/8" : "border-slate-100"} text-right`}>
            <button onClick={closeModal} className={`px-4 py-2 text-sm font-medium rounded-xl border ${dk ? "border-white/10 text-white/50 hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>Close</button>
          </div>
        </div>
      </div>
    );

    return null;
  };

  return (
    <div className="space-y-6">
      {renderModal()}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-bold ${ht}`}>Admin Management</h1>
          <p className={`text-sm mt-0.5 ${mt}`}>Manage company administrators and agent administrators across the platform</p>
        </div>
        <button onClick={() => openModal("add")} className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-md shadow-sky-500/20">
          <Plus className="w-4 h-4" /> Add Administrator
        </button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className={`${card} p-4 flex items-center gap-4`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
              <Building2 className={`w-5 h-5 ${s.iconColor}`} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${ht}`}>{s.value}</p>
              <p className={`text-xs font-medium ${mt}`}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className={card}>
        {/* Toolbar */}
        <div className={`flex items-center gap-3 px-6 py-4 border-b ${dk ? "border-white/5" : "border-slate-100"}`}>
          <div className="relative flex-1 max-w-xs">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${mt}`} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search administrators..."
              className={`w-full pl-9 pr-4 py-2 text-sm rounded-lg outline-none transition-colors ${inputCls}`} />
          </div>
          <div className="flex items-center gap-2">
            {["all","active","pending","inactive"].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${filter === f ? "bg-sky-500 text-white" : dk ? "bg-white/5 text-white/50 hover:bg-white/10" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={thCls}>
                {["Administrator","Admin Type","Contact","Location","Seafarers","Status","Last Login","Actions"].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-[10px] font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${dv}`}>
              {filtered.map(a => {
                const S = STATUS_CONFIG[a.status as keyof typeof STATUS_CONFIG];
                const SIcon = S.icon;
                return (
                  <tr key={a.id} className={`${rh} transition-colors`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {a.name.split(" ").map(n => n[0]).join("").slice(0,2)}
                        </div>
                        <div>
                          <p className={`font-medium text-[13px] ${ht}`}>{a.name}</p>
                          <p className={`text-[11px] font-mono ${mt}`}>{a.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                        a.adminType === "Company admin"
                          ? (dk ? "bg-sky-500/15 text-sky-400 border border-sky-500/20" : "bg-sky-50 text-sky-700 border border-sky-200")
                          : (dk ? "bg-violet-500/15 text-violet-400 border border-violet-500/20" : "bg-violet-50 text-violet-700 border border-violet-200")
                      }`}>
                        {a.adminType === "Company admin" ? <Building2 className="w-3 h-3" /> : <UserCog className="w-3 h-3" />}
                        {a.adminType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <p className={`text-[11px] flex items-center gap-1.5 ${mt}`}><Mail className="w-3 h-3" />{a.email}</p>
                        <p className={`text-[11px] flex items-center gap-1.5 ${mt}`}><Phone className="w-3 h-3" />{a.phone}</p>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-[12px] ${mt}`}>
                      <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" />{a.location}</span>
                    </td>
                    <td className={`px-6 py-4 text-[13px] font-bold ${ht}`}>{a.seafarers}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${S.cls}`}>
                        <SIcon className="w-3 h-3" />{S.label}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-[12px] ${mt}`}>{a.lastLogin}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {/* 1. Edit */}
                        <button onClick={() => openModal("edit", a)} title="Edit" className={`p-1.5 rounded-lg transition-colors ${dk ? "hover:bg-white/8 text-white/40 hover:text-sky-400" : "hover:bg-slate-100 text-slate-400 hover:text-sky-500"}`}><Edit className="w-3.5 h-3.5" /></button>
                        {/* 2. Activate / Deactivate */}
                        <button onClick={() => toggleStatus(a)} title={a.status === "active" ? "Deactivate" : "Activate"}
                          className={`p-1.5 rounded-lg transition-colors ${a.status === "active" ? (dk ? "hover:bg-red-500/10 text-white/40 hover:text-red-400" : "hover:bg-red-50 text-slate-400 hover:text-red-500") : (dk ? "hover:bg-emerald-500/10 text-white/40 hover:text-emerald-400" : "hover:bg-emerald-50 text-slate-400 hover:text-emerald-500")}`}>
                          {a.status === "active" ? <PowerOff className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" />}
                        </button>
                        {/* 3. Reset Password */}
                        <button onClick={() => openModal("reset", a)} title="Reset Password" className={`p-1.5 rounded-lg transition-colors ${dk ? "hover:bg-amber-500/10 text-white/40 hover:text-amber-400" : "hover:bg-amber-50 text-slate-400 hover:text-amber-500"}`}><Key className="w-3.5 h-3.5" /></button>
                        {/* 4. Login History (Last 2 actions Permissions and Audit removed) */}
                        <button onClick={() => openModal("login", a)} title="Login History" className={`p-1.5 rounded-lg transition-colors ${dk ? "hover:bg-indigo-500/10 text-white/40 hover:text-indigo-400" : "hover:bg-indigo-50 text-slate-400 hover:text-indigo-500"}`}><History className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className={`px-6 py-3 border-t ${dk ? "border-white/5" : "border-slate-100"}`}>
          <p className={`text-[12px] ${mt}`}>Showing {filtered.length} of {adminList.length} company admins</p>
        </div>
      </div>
    </div>
  );
}
