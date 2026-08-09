"use client";

import React, { useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  Building2, Search, Plus,
  Mail, Phone, MapPin, CheckCircle2, Clock,
  XCircle, Eye, Edit, Trash2, X, Check,
} from "lucide-react";

type CompanyAdmin = { id: string; name: string; company: string; email: string; phone: string; location: string; status: string; seafarers: number; joined: string; };

const INITIAL_COMPANY_ADMINS: CompanyAdmin[] = [
  { id: "CA001", name: "Rajesh Kumar",  company: "Maritime Solutions Pvt Ltd", email: "rajesh@maritime.in",    phone: "+91 98765 43210", location: "Mumbai",    status: "active",   seafarers: 24, joined: "12 Jan 2025" },
  { id: "CA002", name: "Priya Sharma",  company: "Ocean Freight Carriers",     email: "priya@oceanfreight.in", phone: "+91 87654 32109", location: "Chennai",   status: "active",   seafarers: 18, joined: "03 Feb 2025" },
  { id: "CA003", name: "Anil Mehta",    company: "Blue Horizon Shipping",      email: "anil@bluehorizon.in",   phone: "+91 76543 21098", location: "Kochi",     status: "pending",  seafarers: 0,  joined: "28 Jul 2025" },
  { id: "CA004", name: "Sunita Nair",   company: "SeaTech Maritime Corp",      email: "sunita@seatech.in",     phone: "+91 65432 10987", location: "Goa",       status: "active",   seafarers: 31, joined: "15 Mar 2025" },
  { id: "CA005", name: "Vikram Singh",  company: "Coastal Cargo Lines",        email: "vikram@coastal.in",     phone: "+91 54321 09876", location: "Kolkata",   status: "inactive", seafarers: 7,  joined: "22 Apr 2025" },
  { id: "CA006", name: "Meera Pillai",  company: "Pacific Navigators",         email: "meera@pacific.in",      phone: "+91 43210 98765", location: "Mangalore", status: "active",   seafarers: 15, joined: "01 May 2025" },
  { id: "CA007", name: "Arjun Reddy",   company: "Harbour Point Logistics",    email: "arjun@harbour.in",      phone: "+91 32109 87654", location: "Vizag",     status: "pending",  seafarers: 0,  joined: "30 Jul 2025" },
  { id: "CA008", name: "Kavitha Bose",  company: "Tidal Maritime Services",    email: "kavitha@tidal.in",      phone: "+91 21098 76543", location: "Paradip",   status: "active",   seafarers: 9,  joined: "10 Jun 2025" },
];

const EMPTY_CA = { name: "", company: "", email: "", phone: "", location: "", status: "pending" };

const STATUS_CONFIG = {
  active:   { label: "Active",   icon: CheckCircle2, cls: "bg-emerald-500/15 text-emerald-400" },
  pending:  { label: "Pending",  icon: Clock,        cls: "bg-amber-500/15 text-amber-400"    },
  inactive: { label: "Inactive", icon: XCircle,      cls: "bg-red-500/15 text-red-400"        },
};

export default function CompanyAdminsPage() {
  const { theme } = useTheme();
  const dk = theme === "dark";
  const [adminList, setAdminList] = useState<CompanyAdmin[]>(INITIAL_COMPANY_ADMINS);
  const [search, setSearch]       = useState("");
  const [filter, setFilter]       = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState({ ...EMPTY_CA });
  const [saved, setSaved]         = useState(false);

  const ht     = dk ? "text-white"       : "text-slate-800";
  const mt     = dk ? "text-white/40"    : "text-slate-400";
  const card   = dk ? "bg-[#0f2035] border border-white/5 rounded-2xl" : "bg-white border border-slate-200 rounded-2xl shadow-sm";
  const inputCls = dk ? "bg-white/5 border border-white/8 text-white placeholder:text-white/25 focus:border-sky-500/50 outline-none" : "bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-sky-400 outline-none";
  const dv     = dk ? "divide-white/5"   : "divide-slate-100";
  const rh     = dk ? "hover:bg-white/3" : "hover:bg-slate-50/80";
  const thCls  = dk ? "border-b border-white/5 text-white/25" : "border-b border-slate-100 text-slate-400";
  const modalBg = dk ? "bg-[#0f2035] border border-white/10" : "bg-white border border-slate-200";
  const labelCls = dk ? "text-white/60" : "text-slate-600";

  const filtered = adminList.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.company.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || a.status === filter;
    return matchSearch && matchFilter;
  });

  const handleAdd = () => {
    if (!form.name.trim() || !form.company.trim() || !form.email.trim()) return;
    const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const newAdmin: CompanyAdmin = {
      id:        `CA${String(adminList.length + 1).padStart(3, "0")}`,
      name:      form.name.trim(),
      company:   form.company.trim(),
      email:     form.email.trim(),
      phone:     form.phone.trim(),
      location:  form.location.trim(),
      status:    form.status,
      seafarers: 0,
      joined:    today,
    };
    setAdminList(prev => [newAdmin, ...prev]);
    setSaved(true);
    setTimeout(() => { setSaved(false); setShowModal(false); setForm({ ...EMPTY_CA }); }, 1200);
  };

  const stats = [
    { label: "Total Companies", value: adminList.length,                                             color: "bg-sky-500/15",     iconColor: "text-sky-400"     },
    { label: "Active",          value: adminList.filter(a => a.status === "active").length,   color: "bg-emerald-500/15", iconColor: "text-emerald-400" },
    { label: "Pending",         value: adminList.filter(a => a.status === "pending").length,  color: "bg-amber-500/15",   iconColor: "text-amber-400"   },
    { label: "Inactive",        value: adminList.filter(a => a.status === "inactive").length, color: "bg-red-500/15",     iconColor: "text-red-400"     },
  ];

  return (
    <div className="space-y-6">

      {/* ── Add Company Admin Modal ──────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className={`relative w-full max-w-lg rounded-2xl shadow-2xl z-10 ${modalBg}`} onClick={e => e.stopPropagation()}>
            <div className={`flex items-center justify-between px-6 py-4 border-b ${dk ? "border-white/8" : "border-slate-100"}`}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500/15 flex items-center justify-center"><Building2 className="w-4 h-4 text-sky-400" /></div>
                <p className={`text-sm font-semibold ${ht}`}>Add Company Admin</p>
              </div>
              <button onClick={() => setShowModal(false)} className={`p-1.5 rounded-lg transition-colors ${dk ? "hover:bg-white/8 text-white/40" : "hover:bg-slate-100 text-slate-400"}`}><X className="w-4 h-4" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>Full Name <span className="text-red-400">*</span></label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Rajesh Kumar" className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${inputCls}`} />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>Company Name <span className="text-red-400">*</span></label>
                  <input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="e.g. Maritime Solutions" className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${inputCls}`} />
                </div>
              </div>
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>Email Address <span className="text-red-400">*</span></label>
                <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="e.g. admin@company.in" className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${inputCls}`} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>Phone</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${inputCls}`} />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>Location</label>
                  <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. Mumbai" className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${inputCls}`} />
                </div>
              </div>
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${inputCls}`}>
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${dk ? "border-white/8" : "border-slate-100"}`}>
              <button onClick={() => setShowModal(false)} className={`px-4 py-2 text-sm font-medium rounded-xl border transition-colors ${dk ? "border-white/10 text-white/50 hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>Cancel</button>
              <button onClick={handleAdd} className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl transition-all ${saved ? "bg-emerald-500 text-white" : "bg-sky-500 hover:bg-sky-600 text-white"}`}>
                {saved ? <><Check className="w-4 h-4" /> Added!</> : <><Plus className="w-4 h-4" /> Add Admin</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-bold ${ht}`}>Company Admins</h1>
          <p className={`text-sm mt-0.5 ${mt}`}>Manage all registered company administrators</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-md shadow-sky-500/20">
          <Plus className="w-4 h-4" /> Add Company Admin
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
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search company admins..."
              className={`w-full pl-9 pr-4 py-2 text-sm rounded-lg outline-none transition-colors ${inputCls}`}
            />
          </div>
          <div className="flex items-center gap-2">
            {["all","active","pending","inactive"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                  filter === f
                    ? "bg-sky-500 text-white"
                    : dk ? "bg-white/5 text-white/50 hover:bg-white/10" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >{f}</button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={thCls}>
                {["Company Admin","Company","Contact","Location","Seafarers","Status","Joined",""].map(h => (
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
                    <td className={`px-6 py-4 text-[12px] max-w-[180px] truncate ${mt}`}>{a.company}</td>
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
                    <td className={`px-6 py-4 text-[12px] ${mt}`}>{a.joined}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button className={`p-1.5 rounded-lg transition-colors ${dk ? "hover:bg-white/8 text-white/40 hover:text-white/70" : "hover:bg-slate-100 text-slate-400 hover:text-slate-600"}`}><Eye className="w-3.5 h-3.5" /></button>
                        <button className={`p-1.5 rounded-lg transition-colors ${dk ? "hover:bg-white/8 text-white/40 hover:text-sky-400" : "hover:bg-slate-100 text-slate-400 hover:text-sky-500"}`}><Edit className="w-3.5 h-3.5" /></button>
                        <button className={`p-1.5 rounded-lg transition-colors ${dk ? "hover:bg-red-500/10 text-white/40 hover:text-red-400" : "hover:bg-red-50 text-slate-400 hover:text-red-500"}`}><Trash2 className="w-3.5 h-3.5" /></button>
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
