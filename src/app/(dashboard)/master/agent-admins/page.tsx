"use client";

import React, { useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  UserCog, Search, Plus, Mail, Phone,
  MapPin, CheckCircle2, Clock, XCircle,
  Eye, Edit, Trash2, Users, X, Check,
} from "lucide-react";

type AgentAdmin = { id: string; name: string; agency: string; email: string; phone: string; location: string; status: string; clients: number; commission: string; joined: string; };

const INITIAL_AGENT_ADMINS: AgentAdmin[] = [
  { id: "AG001", name: "Suresh Patel",   agency: "Global Crew Agency",        email: "suresh@globalcrew.in",    phone: "+91 98000 11111", location: "Mumbai",    status: "active",   clients: 12, commission: "8%",   joined: "05 Jan 2025" },
  { id: "AG002", name: "Deepa Iyer",     agency: "Maritime Recruitment Hub",  email: "deepa@mrh.in",            phone: "+91 97000 22222", location: "Chennai",   status: "active",   clients: 9,  commission: "7.5%", joined: "18 Feb 2025" },
  { id: "AG003", name: "Rajan Thomas",   agency: "Seafarer Connect",          email: "rajan@seafarerconnect.in", phone:"+91 96000 33333", location: "Kochi",     status: "pending",  clients: 0,  commission: "8%",   joined: "29 Jul 2025" },
  { id: "AG004", name: "Ananya Gupta",   agency: "Blue Waters Staffing",      email: "ananya@bluewaters.in",    phone: "+91 95000 44444", location: "Delhi",     status: "active",   clients: 21, commission: "9%",   joined: "07 Mar 2025" },
  { id: "AG005", name: "Mohammed Raza",  agency: "Anchor Point Crew",         email: "raza@anchorpoint.in",     phone: "+91 94000 55555", location: "Mangalore", status: "inactive", clients: 3,  commission: "7%",   joined: "14 Apr 2025" },
  { id: "AG006", name: "Lakshmi Rao",    agency: "Horizon Marine Staffing",   email: "lakshmi@horizon.in",      phone: "+91 93000 66666", location: "Vizag",     status: "active",   clients: 7,  commission: "8.5%", joined: "22 May 2025" },
  { id: "AG007", name: "Kiran Desai",    agency: "Ocean Talent Solutions",    email: "kiran@oceantalent.in",    phone: "+91 92000 77777", location: "Surat",     status: "pending",  clients: 0,  commission: "8%",   joined: "01 Aug 2025" },
];

const EMPTY_AG = { name: "", agency: "", email: "", phone: "", location: "", commission: "8", status: "pending" };

const STATUS_CONFIG = {
  active:   { label: "Active",   icon: CheckCircle2, cls: "bg-emerald-500/15 text-emerald-400" },
  pending:  { label: "Pending",  icon: Clock,        cls: "bg-amber-500/15 text-amber-400"    },
  inactive: { label: "Inactive", icon: XCircle,      cls: "bg-red-500/15 text-red-400"        },
};

export default function AgentAdminsPage() {
  const { theme } = useTheme();
  const dk = theme === "dark";
  const [agentList, setAgentList] = useState<AgentAdmin[]>(INITIAL_AGENT_ADMINS);
  const [search, setSearch]       = useState("");
  const [filter, setFilter]       = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState({ ...EMPTY_AG });
  const [saved, setSaved]         = useState(false);

  const ht      = dk ? "text-white"       : "text-slate-800";
  const mt      = dk ? "text-white/40"    : "text-slate-400";
  const card    = dk ? "bg-[#0f2035] border border-white/5 rounded-2xl" : "bg-white border border-slate-200 rounded-2xl shadow-sm";
  const inputCls = dk ? "bg-white/5 border border-white/8 text-white placeholder:text-white/25 focus:border-sky-500/50 outline-none" : "bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-sky-400 outline-none";
  const dv      = dk ? "divide-white/5"   : "divide-slate-100";
  const rh      = dk ? "hover:bg-white/3" : "hover:bg-slate-50/80";
  const thCls   = dk ? "border-b border-white/5 text-white/25" : "border-b border-slate-100 text-slate-400";
  const modalBg  = dk ? "bg-[#0f2035] border border-white/10" : "bg-white border border-slate-200";
  const labelCls = dk ? "text-white/60" : "text-slate-600";

  const filtered = agentList.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.agency.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || a.status === filter;
    return matchSearch && matchFilter;
  });

  const handleAdd = () => {
    if (!form.name.trim() || !form.agency.trim() || !form.email.trim()) return;
    const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const newAgent: AgentAdmin = {
      id:         `AG${String(agentList.length + 1).padStart(3, "0")}`,
      name:       form.name.trim(),
      agency:     form.agency.trim(),
      email:      form.email.trim(),
      phone:      form.phone.trim(),
      location:   form.location.trim(),
      commission: `${form.commission}%`,
      status:     form.status,
      clients:    0,
      joined:     today,
    };
    setAgentList(prev => [newAgent, ...prev]);
    setSaved(true);
    setTimeout(() => { setSaved(false); setShowModal(false); setForm({ ...EMPTY_AG }); }, 1200);
  };

  const stats = [
    { label: "Total Agents",  value: agentList.length,                                             color: "bg-violet-500/15", ic: "text-violet-400"  },
    { label: "Active",        value: agentList.filter(a => a.status === "active").length,   color: "bg-emerald-500/15", ic: "text-emerald-400" },
    { label: "Pending",       value: agentList.filter(a => a.status === "pending").length,  color: "bg-amber-500/15",   ic: "text-amber-400"   },
    { label: "Total Clients", value: agentList.reduce((s, a) => s + a.clients, 0),          color: "bg-sky-500/15",     ic: "text-sky-400"     },
  ];

  return (
    <div className="space-y-6">

      {/* ── Add Agent Admin Modal ───────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className={`relative w-full max-w-lg rounded-2xl shadow-2xl z-10 ${modalBg}`} onClick={e => e.stopPropagation()}>
            <div className={`flex items-center justify-between px-6 py-4 border-b ${dk ? "border-white/8" : "border-slate-100"}`}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center"><UserCog className="w-4 h-4 text-violet-400" /></div>
                <p className={`text-sm font-semibold ${ht}`}>Add Agent Admin</p>
              </div>
              <button onClick={() => setShowModal(false)} className={`p-1.5 rounded-lg transition-colors ${dk ? "hover:bg-white/8 text-white/40" : "hover:bg-slate-100 text-slate-400"}`}><X className="w-4 h-4" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>Full Name <span className="text-red-400">*</span></label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Suresh Patel" className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${inputCls}`} />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>Agency Name <span className="text-red-400">*</span></label>
                  <input value={form.agency} onChange={e => setForm(f => ({ ...f, agency: e.target.value }))} placeholder="e.g. Global Crew Agency" className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${inputCls}`} />
                </div>
              </div>
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>Email Address <span className="text-red-400">*</span></label>
                <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="e.g. agent@agency.in" className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${inputCls}`} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>Phone</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 98000 11111" className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${inputCls}`} />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>Location</label>
                  <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. Mumbai" className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${inputCls}`} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>Commission Rate (%)</label>
                  <input type="number" min="0" max="30" value={form.commission} onChange={e => setForm(f => ({ ...f, commission: e.target.value }))} placeholder="8" className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${inputCls}`} />
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
            </div>
            <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${dk ? "border-white/8" : "border-slate-100"}`}>
              <button onClick={() => setShowModal(false)} className={`px-4 py-2 text-sm font-medium rounded-xl border transition-colors ${dk ? "border-white/10 text-white/50 hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>Cancel</button>
              <button onClick={handleAdd} className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl transition-all ${saved ? "bg-emerald-500 text-white" : "bg-violet-500 hover:bg-violet-600 text-white"}`}>
                {saved ? <><Check className="w-4 h-4" /> Added!</> : <><Plus className="w-4 h-4" /> Add Agent</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-bold ${ht}`}>Agent Admins</h1>
          <p className={`text-sm mt-0.5 ${mt}`}>Manage all registered recruitment agent administrators</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-md shadow-violet-500/20">
          <Plus className="w-4 h-4" /> Add Agent Admin
        </button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className={`${card} p-4 flex items-center gap-4`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
              <UserCog className={`w-5 h-5 ${s.ic}`} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${ht}`}>{s.value}</p>
              <p className={`text-xs font-medium ${mt}`}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className={card}>
        <div className={`flex items-center gap-3 px-6 py-4 border-b ${dk ? "border-white/5" : "border-slate-100"}`}>
          <div className="relative flex-1 max-w-xs">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${mt}`} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search agent admins..."
              className={`w-full pl-9 pr-4 py-2 text-sm rounded-lg outline-none transition-colors ${inputCls}`}
            />
          </div>
          <div className="flex items-center gap-2">
            {["all","active","pending","inactive"].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                  filter === f ? "bg-sky-500 text-white"
                  : dk ? "bg-white/5 text-white/50 hover:bg-white/10" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}>{f}</button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={thCls}>
                {["Agent Admin","Agency","Contact","Location","Clients","Commission","Status","Joined",""].map(h => (
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
                        <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {a.name.split(" ").map(n => n[0]).join("").slice(0,2)}
                        </div>
                        <div>
                          <p className={`font-medium text-[13px] ${ht}`}>{a.name}</p>
                          <p className={`text-[11px] font-mono ${mt}`}>{a.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-[12px] max-w-[160px] truncate ${mt}`}>{a.agency}</td>
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <p className={`text-[11px] flex items-center gap-1.5 ${mt}`}><Mail className="w-3 h-3" />{a.email}</p>
                        <p className={`text-[11px] flex items-center gap-1.5 ${mt}`}><Phone className="w-3 h-3" />{a.phone}</p>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-[12px] ${mt}`}><span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" />{a.location}</span></td>
                    <td className={`px-6 py-4 text-[13px] font-bold ${ht}`}>{a.clients}</td>
                    <td className={`px-6 py-4 text-[13px] font-semibold text-emerald-400`}>{a.commission}</td>
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
          <p className={`text-[12px] ${mt}`}>Showing {filtered.length} of {AGENT_ADMINS.length} agent admins</p>
        </div>
      </div>
    </div>
  );
}
