"use client";

import React, { useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  Users, Search, Plus, Eye, Edit, Trash2,
  CheckCircle2, Clock, XCircle,
  Mail, Phone, Building2, UserCog,
  Download, UserCheck, UserX, Info, X, Check,
} from "lucide-react";

type Account = { id: string; name: string; email: string; phone: string; role: string; org: string; status: string; joined: string; lastLogin: string; };

// Master manages ONLY Company Admins and Agent Admins
const INITIAL_ACCOUNTS: Account[] = [
  // Company Admins
  { id: "CA001", name: "Rajesh Kumar",  email: "rajesh@maritime.in",     phone: "+91 98765 43210", role: "company_admin", org: "Maritime Solutions Pvt Ltd", status: "active",   joined: "12 Jan 2025", lastLogin: "Today"       },
  { id: "CA002", name: "Priya Sharma",  email: "priya@oceanfreight.in",  phone: "+91 87654 32109", role: "company_admin", org: "Ocean Freight Carriers",      status: "active",   joined: "03 Feb 2025", lastLogin: "Yesterday"   },
  { id: "CA003", name: "Anil Mehta",    email: "anil@bluehorizon.in",    phone: "+91 76543 21098", role: "company_admin", org: "Blue Horizon Shipping",        status: "pending",  joined: "28 Jul 2025", lastLogin: "Never"       },
  { id: "CA004", name: "Sunita Nair",   email: "sunita@seatech.in",      phone: "+91 65432 10987", role: "company_admin", org: "SeaTech Maritime Corp",        status: "active",   joined: "15 Mar 2025", lastLogin: "2 days ago"  },
  { id: "CA005", name: "Vikram Singh",  email: "vikram@coastal.in",      phone: "+91 54321 09876", role: "company_admin", org: "Coastal Cargo Lines",          status: "inactive", joined: "22 Apr 2025", lastLogin: "1 month ago" },
  { id: "CA006", name: "Meera Pillai",  email: "meera@pacific.in",       phone: "+91 43210 98765", role: "company_admin", org: "Pacific Navigators",           status: "active",   joined: "01 May 2025", lastLogin: "Today"       },
  { id: "CA007", name: "Arjun Reddy",   email: "arjun@harbour.in",       phone: "+91 32109 87654", role: "company_admin", org: "Harbour Point Logistics",      status: "pending",  joined: "30 Jul 2025", lastLogin: "Never"       },
  { id: "CA008", name: "Kavitha Bose",  email: "kavitha@tidal.in",       phone: "+91 21098 76543", role: "company_admin", org: "Tidal Maritime Services",      status: "active",   joined: "10 Jun 2025", lastLogin: "3 days ago"  },
  // Agent Admins
  { id: "AG001", name: "Suresh Patel",  email: "suresh@globalcrew.in",   phone: "+91 98000 11111", role: "agent_admin",   org: "Global Crew Agency",           status: "active",   joined: "05 Jan 2025", lastLogin: "Today"       },
  { id: "AG002", name: "Deepa Iyer",    email: "deepa@mrh.in",           phone: "+91 97000 22222", role: "agent_admin",   org: "Maritime Recruitment Hub",     status: "active",   joined: "18 Feb 2025", lastLogin: "Yesterday"   },
  { id: "AG003", name: "Rajan Thomas",  email: "rajan@seafarerconnect.in",phone: "+91 96000 33333", role: "agent_admin",  org: "Seafarer Connect",             status: "pending",  joined: "29 Jul 2025", lastLogin: "Never"       },
  { id: "AG004", name: "Ananya Gupta",  email: "ananya@bluewaters.in",   phone: "+91 95000 44444", role: "agent_admin",   org: "Blue Waters Staffing",         status: "active",   joined: "07 Mar 2025", lastLogin: "3 days ago"  },
  { id: "AG005", name: "Mohammed Raza", email: "raza@anchorpoint.in",    phone: "+91 94000 55555", role: "agent_admin",   org: "Anchor Point Crew",            status: "inactive", joined: "14 Apr 2025", lastLogin: "3 weeks ago" },
  { id: "AG006", name: "Lakshmi Rao",   email: "lakshmi@horizon.in",     phone: "+91 93000 66666", role: "agent_admin",   org: "Horizon Marine Staffing",      status: "active",   joined: "22 May 2025", lastLogin: "Today"       },
  { id: "AG007", name: "Kiran Desai",   email: "kiran@oceantalent.in",   phone: "+91 92000 77777", role: "agent_admin",   org: "Ocean Talent Solutions",       status: "pending",  joined: "01 Aug 2025", lastLogin: "Never"       },
];

const EMPTY_ACC = { name: "", email: "", phone: "", role: "company_admin", org: "", status: "pending" };

const ROLE_CONFIG: Record<string, { label: string; cls: string; Icon: React.ElementType }> = {
  company_admin: { label: "Company Admin", cls: "bg-sky-500/15 text-sky-400",       Icon: Building2 },
  agent_admin:   { label: "Agent Admin",   cls: "bg-violet-500/15 text-violet-400", Icon: UserCog   },
};

const STATUS_CONFIG: Record<string, { label: string; icon: React.ElementType; cls: string }> = {
  active:   { label: "Active",   icon: CheckCircle2, cls: "bg-emerald-500/15 text-emerald-400" },
  pending:  { label: "Pending",  icon: Clock,        cls: "bg-amber-500/15 text-amber-400"    },
  inactive: { label: "Inactive", icon: XCircle,      cls: "bg-red-500/15 text-red-400"        },
};

const AVATAR_COLORS = ["bg-sky-500","bg-violet-500","bg-emerald-500","bg-amber-500","bg-rose-500","bg-indigo-500","bg-teal-500","bg-orange-500"];

export default function UsersPage() {
  const { theme } = useTheme();
  const dk = theme === "dark";
  const [accountList, setAccountList]     = useState<Account[]>(INITIAL_ACCOUNTS);
  const [search, setSearch]               = useState("");
  const [roleFilter, setRoleFilter]       = useState("all");
  const [statusFilter, setStatusFilter]   = useState("all");
  const [selected, setSelected]           = useState<string[]>([]);
  const [showModal, setShowModal]         = useState(false);
  const [form, setForm]                   = useState({ ...EMPTY_ACC });
  const [saved, setSaved]                 = useState(false);

  const ht    = dk ? "text-white"       : "text-slate-800";
  const mt    = dk ? "text-white/40"    : "text-slate-400";
  const card  = dk ? "bg-[#0f2035] border border-white/5 rounded-2xl" : "bg-white border border-slate-200 rounded-2xl shadow-sm";
  const inputCls = dk
    ? "bg-white/5 border border-white/8 text-white placeholder:text-white/25 focus:border-sky-500/50"
    : "bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-sky-400";
  const dv    = dk ? "divide-white/5"   : "divide-slate-100";
  const rh    = dk ? "hover:bg-white/3" : "hover:bg-slate-50/80";
  const thCls = dk ? "border-b border-white/5 text-white/25" : "border-b border-slate-100 text-slate-400";
  const selRow = dk ? "bg-sky-500/8"    : "bg-sky-50";
  const infoBanner = dk ? "bg-sky-500/8 border border-sky-500/15 text-sky-300" : "bg-sky-50 border border-sky-200 text-sky-700";

  const filtered = accountList.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.org.toLowerCase().includes(q) ||
      u.id.toLowerCase().includes(q);
    const matchRole   = roleFilter   === "all" || u.role   === roleFilter;
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const toggleSelect = (id: string) =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () =>
    setSelected(s => s.length === filtered.length ? [] : filtered.map(u => u.id));

  const handleAdd = () => {
    if (!form.name.trim() || !form.email.trim() || !form.org.trim()) return;
    const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const prefix = form.role === "company_admin" ? "CA" : "AG";
    const count  = accountList.filter(a => a.role === form.role).length + 1;
    const newAcc: Account = {
      id:        `${prefix}${String(count).padStart(3, "0")}`,
      name:      form.name.trim(),
      email:     form.email.trim(),
      phone:     form.phone.trim(),
      role:      form.role,
      org:       form.org.trim(),
      status:    form.status,
      joined:    today,
      lastLogin: "Never",
    };
    setAccountList(prev => [newAcc, ...prev]);
    setSaved(true);
    setTimeout(() => { setSaved(false); setShowModal(false); setForm({ ...EMPTY_ACC }); }, 1200);
  };

  const companyCount = accountList.filter(u => u.role === "company_admin").length;
  const agentCount   = accountList.filter(u => u.role === "agent_admin").length;
  const activeCount  = accountList.filter(u => u.status === "active").length;
  const pendingCount = accountList.filter(u => u.status === "pending").length;

  const kpis = [
    { label: "Company Admins", value: companyCount, color: "bg-sky-500/15",     ic: "text-sky-400",     Icon: Building2   },
    { label: "Agent Admins",   value: agentCount,   color: "bg-violet-500/15",  ic: "text-violet-400",  Icon: UserCog     },
    { label: "Active",         value: activeCount,  color: "bg-emerald-500/15", ic: "text-emerald-400", Icon: CheckCircle2 },
    { label: "Pending Review", value: pendingCount, color: "bg-amber-500/15",   ic: "text-amber-400",   Icon: Clock       },
  ];

  return (
    <div className="space-y-6">

      {/* ── Add Account Modal ──────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className={`relative w-full max-w-lg rounded-2xl shadow-2xl z-10 ${dk ? "bg-[#0f2035] border border-white/10" : "bg-white border border-slate-200"}`} onClick={e => e.stopPropagation()}>
            <div className={`flex items-center justify-between px-6 py-4 border-b ${dk ? "border-white/8" : "border-slate-100"}`}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500/15 flex items-center justify-center"><Users className="w-4 h-4 text-sky-400" /></div>
                <p className={`text-sm font-semibold ${ht}`}>Add New Account</p>
              </div>
              <button onClick={() => setShowModal(false)} className={`p-1.5 rounded-lg transition-colors ${dk ? "hover:bg-white/8 text-white/40" : "hover:bg-slate-100 text-slate-400"}`}><X className="w-4 h-4" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${dk ? "text-white/60" : "text-slate-600"}`}>Full Name <span className="text-red-400">*</span></label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Rajesh Kumar" className={`w-full px-3 py-2 text-sm rounded-lg border outline-none transition-colors ${inputCls}`} />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${dk ? "text-white/60" : "text-slate-600"}`}>Account Type</label>
                  <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className={`w-full px-3 py-2 text-sm rounded-lg border outline-none transition-colors ${inputCls}`}>
                    <option value="company_admin">Company Admin</option>
                    <option value="agent_admin">Agent Admin</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${dk ? "text-white/60" : "text-slate-600"}`}>Organisation <span className="text-red-400">*</span></label>
                <input value={form.org} onChange={e => setForm(f => ({ ...f, org: e.target.value }))} placeholder="e.g. Maritime Solutions Pvt Ltd" className={`w-full px-3 py-2 text-sm rounded-lg border outline-none transition-colors ${inputCls}`} />
              </div>
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${dk ? "text-white/60" : "text-slate-600"}`}>Email Address <span className="text-red-400">*</span></label>
                <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="e.g. admin@company.in" className={`w-full px-3 py-2 text-sm rounded-lg border outline-none transition-colors ${inputCls}`} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${dk ? "text-white/60" : "text-slate-600"}`}>Phone</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" className={`w-full px-3 py-2 text-sm rounded-lg border outline-none transition-colors ${inputCls}`} />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${dk ? "text-white/60" : "text-slate-600"}`}>Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={`w-full px-3 py-2 text-sm rounded-lg border outline-none transition-colors ${inputCls}`}>
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${dk ? "border-white/8" : "border-slate-100"}`}>
              <button onClick={() => setShowModal(false)} className={`px-4 py-2 text-sm font-medium rounded-xl border transition-colors ${dk ? "border-white/10 text-white/50 hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>Cancel</button>
              <button onClick={handleAdd} className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl transition-all ${saved ? "bg-emerald-500 text-white" : "bg-sky-500 hover:bg-sky-600 text-white"}`}>
                {saved ? <><Check className="w-4 h-4" /> Added!</> : <><Plus className="w-4 h-4" /> Add Account</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-bold ${ht}`}>User Management</h1>
          <p className={`text-sm mt-0.5 ${mt}`}>Manage Company Admin and Agent Admin accounts across the platform</p>
        </div>
        <div className="flex items-center gap-2">
          <button className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-xl border transition-colors ${dk ? "border-white/10 text-white/60 hover:bg-white/5" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-md shadow-sky-500/20">
            <Plus className="w-4 h-4" /> Add Account
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className={`flex items-start gap-3 px-4 py-3 rounded-xl text-sm ${infoBanner}`}>
        <Info className="w-4 h-4 mt-0.5 shrink-0" />
        <p>
          <span className="font-semibold">Scope of management:</span> The Master portal manages Company Admin and Agent Admin accounts only.
          Seafarer accounts are managed within each Company Admin or Agent Admin's own portal.
        </p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className={`${card} p-4 flex items-center gap-4`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${k.color}`}>
              <k.Icon className={`w-5 h-5 ${k.ic}`} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${ht}`}>{k.value}</p>
              <p className={`text-xs font-medium ${mt}`}>{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className={card}>

        {/* Toolbar */}
        <div className={`flex flex-wrap items-center gap-3 px-6 py-4 border-b ${dk ? "border-white/5" : "border-slate-100"}`}>
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${mt}`} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search name, email, org..."
              className={`w-full pl-9 pr-4 py-2 text-sm rounded-lg outline-none transition-colors ${inputCls}`}
            />
          </div>

          {/* Role */}
          <div className="flex items-center gap-1.5">
            <span className={`text-[11px] font-semibold uppercase tracking-wider ${mt}`}>Type:</span>
            {[
              { key: "all",           label: "All"     },
              { key: "company_admin", label: "Company" },
              { key: "agent_admin",   label: "Agent"   },
            ].map(f => (
              <button key={f.key} onClick={() => setRoleFilter(f.key)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  roleFilter === f.key ? "bg-sky-500 text-white"
                  : dk ? "bg-white/5 text-white/50 hover:bg-white/10" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}>{f.label}</button>
            ))}
          </div>

          {/* Status */}
          <div className="flex items-center gap-1.5">
            <span className={`text-[11px] font-semibold uppercase tracking-wider ${mt}`}>Status:</span>
            {["all","active","pending","inactive"].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                  statusFilter === s ? "bg-sky-500 text-white"
                  : dk ? "bg-white/5 text-white/50 hover:bg-white/10" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}>{s}</button>
            ))}
          </div>

          {/* Bulk actions */}
          {selected.length > 0 && (
            <div className="flex items-center gap-2 ml-auto">
              <span className={`text-xs font-medium ${mt}`}>{selected.length} selected</span>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-colors">
                <UserCheck className="w-3.5 h-3.5" /> Activate
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors">
                <UserX className="w-3.5 h-3.5" /> Deactivate
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={thCls}>
                <th className="px-6 py-3 w-10">
                  <input type="checkbox"
                    checked={selected.length === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                    className="rounded accent-sky-500 cursor-pointer"
                  />
                </th>
                {["Account","Type","Organisation","Contact","Status","Last Login","Joined",""].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${dv}`}>
              {filtered.map((u, i) => {
                const R  = ROLE_CONFIG[u.role];
                const S  = STATUS_CONFIG[u.status];
                const SI = S.icon;
                const isSel = selected.includes(u.id);
                return (
                  <tr key={u.id} className={`transition-colors ${isSel ? selRow : rh}`}>
                    <td className="px-6 py-4">
                      <input type="checkbox" checked={isSel} onChange={() => toggleSelect(u.id)}
                        className="rounded accent-sky-500 cursor-pointer" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                          {u.name.split(" ").map(n => n[0]).join("").slice(0,2)}
                        </div>
                        <div>
                          <p className={`font-medium text-[13px] ${ht}`}>{u.name}</p>
                          <p className={`text-[11px] font-mono ${mt}`}>{u.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${R.cls}`}>
                        <R.Icon className="w-3 h-3" />{R.label}
                      </span>
                    </td>
                    <td className={`px-4 py-4 text-[12px] max-w-[160px] truncate ${mt}`}>{u.org}</td>
                    <td className="px-4 py-4">
                      <div className="space-y-0.5">
                        <p className={`text-[11px] flex items-center gap-1.5 ${mt}`}><Mail className="w-3 h-3 shrink-0" /><span className="truncate max-w-[140px]">{u.email}</span></p>
                        <p className={`text-[11px] flex items-center gap-1.5 ${mt}`}><Phone className="w-3 h-3 shrink-0" />{u.phone}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${S.cls}`}>
                        <SI className="w-3 h-3" />{S.label}
                      </span>
                    </td>
                    <td className={`px-4 py-4 text-[12px] ${mt}`}>{u.lastLogin}</td>
                    <td className={`px-4 py-4 text-[12px] ${mt}`}>{u.joined}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <button className={`p-1.5 rounded-lg transition-colors ${dk ? "hover:bg-white/8 text-white/40 hover:text-white/70"   : "hover:bg-slate-100 text-slate-400 hover:text-slate-600"}`}><Eye    className="w-3.5 h-3.5" /></button>
                        <button className={`p-1.5 rounded-lg transition-colors ${dk ? "hover:bg-white/8 text-white/40 hover:text-sky-400"    : "hover:bg-slate-100 text-slate-400 hover:text-sky-500"  }`}><Edit   className="w-3.5 h-3.5" /></button>
                        <button className={`p-1.5 rounded-lg transition-colors ${dk ? "hover:bg-red-500/10 text-white/40 hover:text-red-400" : "hover:bg-red-50 text-slate-400 hover:text-red-500"    }`}><Trash2 className="w-3.5 h-3.5" /></button>
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
              <p className={`text-sm font-medium ${mt}`}>No accounts match your filters</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between px-6 py-3 border-t ${dk ? "border-white/5" : "border-slate-100"}`}>
          <p className={`text-[12px] ${mt}`}>
            Showing {filtered.length} of {accountList.length} accounts
            &nbsp;·&nbsp; {companyCount} company admins &nbsp;·&nbsp; {agentCount} agent admins
          </p>
          <div className="flex items-center gap-1">
            {[1,2].map(p => (
              <button key={p} className={`w-7 h-7 text-xs font-semibold rounded-lg transition-colors ${
                p === 1 ? "bg-sky-500 text-white" : dk ? "text-white/40 hover:bg-white/8" : "text-slate-400 hover:bg-slate-100"
              }`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
