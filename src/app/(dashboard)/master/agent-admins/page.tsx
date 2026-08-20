"use client";

import React, { useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  UserCog, Search, Plus, Mail, Phone, MapPin,
  CheckCircle2, Clock, XCircle, Edit, Trash2,
  X, Check, Key, History, Shield, Activity, Power, PowerOff,
} from "lucide-react";

type AgentAdmin = { id: string; name: string; agency: string; email: string; phone: string; location: string; status: string; clients: number; commission: string; joined: string; lastLogin: string; department?: string; };

const INITIAL_AGENT_ADMINS: AgentAdmin[] = [
  { id: "AG001", name: "Suresh Patel",   agency: "Global Crew Agency",        email: "suresh@globalcrew.in",    phone: "+91 98000 11111", location: "Mumbai",    status: "active",   clients: 12, commission: "8%",   joined: "05 Jan 2025", lastLogin: "Today",       department: "Recruitment"   },
  { id: "AG002", name: "Deepa Iyer",     agency: "Maritime Recruitment Hub",  email: "deepa@mrh.in",            phone: "+91 97000 22222", location: "Chennai",   status: "active",   clients: 9,  commission: "7.5%", joined: "18 Feb 2025", lastLogin: "Yesterday",   department: "Placement"     },
  { id: "AG003", name: "Rajan Thomas",   agency: "Seafarer Connect",          email: "rajan@seafarerconnect.in", phone:"+91 96000 33333", location: "Kochi",     status: "pending",  clients: 0,  commission: "8%",   joined: "29 Jul 2025", lastLogin: "Never",       department: ""              },
  { id: "AG004", name: "Ananya Gupta",   agency: "Blue Waters Staffing",      email: "ananya@bluewaters.in",    phone: "+91 95000 44444", location: "Delhi",     status: "active",   clients: 21, commission: "9%",   joined: "07 Mar 2025", lastLogin: "3 days ago",  department: "Operations"    },
  { id: "AG005", name: "Mohammed Raza",  agency: "Anchor Point Crew",         email: "raza@anchorpoint.in",     phone: "+91 94000 55555", location: "Mangalore", status: "inactive", clients: 3,  commission: "7%",   joined: "14 Apr 2025", lastLogin: "3 weeks ago", department: "Recruitment"   },
  { id: "AG006", name: "Lakshmi Rao",    agency: "Horizon Marine Staffing",   email: "lakshmi@horizon.in",      phone: "+91 93000 66666", location: "Vizag",     status: "active",   clients: 7,  commission: "8.5%", joined: "22 May 2025", lastLogin: "Today",       department: "Placement"     },
  { id: "AG007", name: "Kiran Desai",    agency: "Ocean Talent Solutions",    email: "kiran@oceantalent.in",    phone: "+91 92000 77777", location: "Surat",     status: "pending",  clients: 0,  commission: "8%",   joined: "01 Aug 2025", lastLogin: "Never",       department: ""              },
];

const EMPTY_AG = { name: "", agency: "", email: "", phone: "", location: "", commission: "8", status: "pending", department: "" };

const STATUS_CONFIG = {
  active:   { label: "Active",   icon: CheckCircle2, cls: "bg-emerald-500/15 text-emerald-400" },
  pending:  { label: "Pending",  icon: Clock,        cls: "bg-amber-500/15 text-amber-400"    },
  inactive: { label: "Inactive", icon: XCircle,      cls: "bg-red-500/15 text-red-400"        },
};

const PERMISSIONS = ["View Dashboard","Manage Agents","View Referrals","View Commissions","Export Reports","Manage Leads","Billing Access"];

const LOGIN_HISTORY = [
  { date: "Today, 8:30 AM",        ip: "103.45.12.99",  device: "Chrome · Windows",  status: "Success" },
  { date: "Yesterday, 5:15 PM",    ip: "103.45.12.99",  device: "Mobile App · Android", status: "Success" },
  { date: "24 Jul 2025, 10:45 AM", ip: "182.70.44.11",  device: "Chrome · Mac",      status: "Success" },
  { date: "21 Jul 2025, 7:30 PM",  ip: "45.115.21.77",  device: "Firefox · Windows", status: "Failed"  },
  { date: "18 Jul 2025, 2:00 PM",  ip: "103.45.12.99",  device: "Chrome · Windows",  status: "Success" },
];

const AUDIT_LOG = [
  { action: "Account Created",       by: "Master Admin", date: "05 Jan 2025", detail: "Initial setup" },
  { action: "Commission Updated",    by: "Master Admin", date: "10 Feb 2025", detail: "7% → 8%" },
  { action: "Status → Active",      by: "Master Admin", date: "05 Jan 2025", detail: "After verification" },
  { action: "Permissions Updated",   by: "Master Admin", date: "20 Mar 2025", detail: "Added View Commissions" },
  { action: "Password Reset Sent",   by: "Master Admin", date: "15 Apr 2025", detail: "Admin requested reset" },
];

type ModalType = "add" | "edit" | "reset" | "login" | "permissions" | "audit" | null;

export default function AgentAdminsPage() {
  const { theme } = useTheme();
  const dk = theme === "dark";
  const [agentList, setAgentList] = useState<AgentAdmin[]>(INITIAL_AGENT_ADMINS);
  const [search, setSearch]       = useState("");
  const [filter, setFilter]       = useState("all");
  const [modal, setModal]         = useState<ModalType>(null);
  const [selected, setSelected]   = useState<AgentAdmin | null>(null);
  const [form, setForm]           = useState({ ...EMPTY_AG });
  const [saved, setSaved]         = useState(false);
  const [perms, setPerms]         = useState<string[]>(["View Dashboard","Manage Agents"]);
  const [resetDone, setResetDone] = useState(false);

  // ── theme tokens ─────────────────────────────────────────────────────────
  const ht       = dk ? "text-white"       : "text-slate-800";
  const mt       = dk ? "text-white/40"    : "text-slate-400";
  const card     = dk ? "bg-[#0f2035] border border-white/5 rounded-2xl" : "bg-white border border-slate-200 rounded-2xl shadow-sm";
  const inputCls = dk ? "bg-white/5 border border-white/8 text-white placeholder:text-white/25 focus:border-violet-500/50 outline-none" : "bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-violet-400 outline-none";
  const dv       = dk ? "divide-white/5"   : "divide-slate-100";
  const rh       = dk ? "hover:bg-white/3" : "hover:bg-slate-50/80";
  const thCls    = dk ? "border-b border-white/5 text-white/25" : "border-b border-slate-100 text-slate-400";
  const modalBg  = dk ? "bg-[#0f2035] border border-white/10" : "bg-white border border-slate-200";
  const labelCls = dk ? "text-white/60" : "text-slate-600";

  const filtered = agentList.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.agency.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || a.status === filter;
    return matchSearch && matchFilter;
  });

  const openModal = (type: ModalType, agent?: AgentAdmin) => {
    setSelected(agent ?? null);
    if (type === "edit" && agent) setForm({ name: agent.name, agency: agent.agency, email: agent.email, phone: agent.phone, location: agent.location, commission: agent.commission.replace("%",""), status: agent.status, department: agent.department ?? "" });
    if (type === "add") setForm({ ...EMPTY_AG });
    setSaved(false); setResetDone(false);
    setModal(type);
  };

  const closeModal = () => { setModal(null); setSelected(null); setSaved(false); setResetDone(false); };

  const handleAddOrEdit = () => {
    if (!form.name.trim() || !form.agency.trim() || !form.email.trim()) return;
    if (modal === "add") {
      const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
      const newAgent: AgentAdmin = { id: `AG${String(agentList.length + 1).padStart(3, "0")}`, name: form.name.trim(), agency: form.agency.trim(), email: form.email.trim(), phone: form.phone.trim(), location: form.location.trim(), commission: `${form.commission}%`, status: form.status, department: form.department.trim(), clients: 0, joined: today, lastLogin: "Never" };
      setAgentList(prev => [newAgent, ...prev]);
    } else if (modal === "edit" && selected) {
      setAgentList(prev => prev.map(a => a.id === selected.id ? { ...a, name: form.name, agency: form.agency, email: form.email, phone: form.phone, location: form.location, commission: `${form.commission}%`, status: form.status, department: form.department } : a));
    }
    setSaved(true);
    setTimeout(closeModal, 1200);
  };

  const toggleStatus = (agent: AgentAdmin) => {
    const next = agent.status === "active" ? "inactive" : "active";
    setAgentList(prev => prev.map(a => a.id === agent.id ? { ...a, status: next } : a));
  };

  const stats = [
    { label: "Total",         value: agentList.length,                                             color: "bg-violet-500/15", ic: "text-violet-400"  },
    { label: "Active",        value: agentList.filter(a => a.status === "active").length,   color: "bg-emerald-500/15", ic: "text-emerald-400" },
    { label: "Pending",       value: agentList.filter(a => a.status === "pending").length,  color: "bg-amber-500/15",   ic: "text-amber-400"   },
    { label: "Total Clients", value: agentList.reduce((s, a) => s + a.clients, 0),          color: "bg-sky-500/15",     ic: "text-sky-400"     },
  ];

  const renderModal = () => {
    if (!modal) return null;

    if (modal === "add" || modal === "edit") {
      const isEdit = modal === "edit";
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className={`relative w-full max-w-lg rounded-2xl shadow-2xl z-10 ${modalBg}`} onClick={e => e.stopPropagation()}>
            <div className={`flex items-center justify-between px-6 py-4 border-b ${dk ? "border-white/8" : "border-slate-100"}`}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center"><UserCog className="w-4 h-4 text-violet-400" /></div>
                <p className={`text-sm font-semibold ${ht}`}>{isEdit ? "Edit Agent Admin" : "Add Agent Admin"}</p>
              </div>
              <button onClick={closeModal} className={`p-1.5 rounded-lg ${dk ? "hover:bg-white/8 text-white/40" : "hover:bg-slate-100 text-slate-400"}`}><X className="w-4 h-4" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>Full Name <span className="text-red-400">*</span></label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Suresh Patel" className={`w-full px-3 py-2 text-sm rounded-lg border ${inputCls}`} /></div>
                <div><label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>Agency Name <span className="text-red-400">*</span></label>
                  <input value={form.agency} onChange={e => setForm(f => ({ ...f, agency: e.target.value }))} placeholder="e.g. Global Crew Agency" className={`w-full px-3 py-2 text-sm rounded-lg border ${inputCls}`} /></div>
              </div>
              <div><label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>Email Address <span className="text-red-400">*</span></label>
                <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="agent@agency.in" className={`w-full px-3 py-2 text-sm rounded-lg border ${inputCls}`} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>Mobile Number</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 98000 11111" className={`w-full px-3 py-2 text-sm rounded-lg border ${inputCls}`} /></div>
                <div><label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>Location</label>
                  <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. Mumbai" className={`w-full px-3 py-2 text-sm rounded-lg border ${inputCls}`} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>Department (Optional)</label>
                  <input value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} placeholder="e.g. Recruitment" className={`w-full px-3 py-2 text-sm rounded-lg border ${inputCls}`} /></div>
                <div><label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>Commission Rate (%)</label>
                  <input type="number" min="0" max="30" value={form.commission} onChange={e => setForm(f => ({ ...f, commission: e.target.value }))} placeholder="8" className={`w-full px-3 py-2 text-sm rounded-lg border ${inputCls}`} /></div>
              </div>
              <div><label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={`w-full px-3 py-2 text-sm rounded-lg border ${inputCls}`}>
                  <option value="pending">Pending</option><option value="active">Active</option><option value="inactive">Inactive</option>
                </select></div>
            </div>
            <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${dk ? "border-white/8" : "border-slate-100"}`}>
              <button onClick={closeModal} className={`px-4 py-2 text-sm font-medium rounded-xl border ${dk ? "border-white/10 text-white/50 hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>Cancel</button>
              <button onClick={handleAddOrEdit} className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl transition-all ${saved ? "bg-emerald-500 text-white" : "bg-violet-500 hover:bg-violet-600 text-white"}`}>
                {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Plus className="w-4 h-4" /> {isEdit ? "Save Changes" : "Add Agent"}</>}
              </button>
            </div>
          </div>
        </div>
      );
    }

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
            <p className={`text-xs mt-3 ${mt}`}>The admin will receive an email with instructions to set a new password.</p>
          </div>
          <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${dk ? "border-white/8" : "border-slate-100"}`}>
            <button onClick={closeModal} className={`px-4 py-2 text-sm font-medium rounded-xl border ${dk ? "border-white/10 text-white/50 hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>Cancel</button>
            <button onClick={() => { setResetDone(true); setTimeout(closeModal, 1400); }} className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl transition-all ${resetDone ? "bg-emerald-500 text-white" : "bg-amber-500 hover:bg-amber-600 text-white"}`}>
              {resetDone ? <><Check className="w-4 h-4" /> Sent!</> : <><Key className="w-4 h-4" /> Send Reset Link</>}
            </button>
          </div>
        </div>
      </div>
    );

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
                <div><p className={`text-[13px] font-medium ${ht}`}>{l.date}</p><p className={`text-[11px] mt-0.5 ${mt}`}>{l.device} · {l.ip}</p></div>
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

    if (modal === "permissions" && selected) return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModal}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className={`relative w-full max-w-sm rounded-2xl shadow-2xl z-10 ${modalBg}`} onClick={e => e.stopPropagation()}>
          <div className={`flex items-center justify-between px-6 py-4 border-b ${dk ? "border-white/8" : "border-slate-100"}`}>
            <div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center"><Shield className="w-4 h-4 text-violet-400" /></div>
              <div><p className={`text-sm font-semibold ${ht}`}>Assign Permissions</p><p className={`text-xs ${mt}`}>{selected.name}</p></div></div>
            <button onClick={closeModal} className={`p-1.5 rounded-lg ${dk ? "hover:bg-white/8 text-white/40" : "hover:bg-slate-100 text-slate-400"}`}><X className="w-4 h-4" /></button>
          </div>
          <div className="px-6 py-4 space-y-2.5">
            {PERMISSIONS.map(p => (
              <label key={p} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${dk ? "hover:bg-white/5" : "hover:bg-slate-50"}`}>
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${perms.includes(p) ? "bg-violet-500 border-violet-500" : dk ? "border-white/20" : "border-slate-300"}`}
                  onClick={() => setPerms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])}>
                  {perms.includes(p) && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
                <span className={`text-sm ${ht}`}>{p}</span>
              </label>
            ))}
          </div>
          <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${dk ? "border-white/8" : "border-slate-100"}`}>
            <button onClick={closeModal} className={`px-4 py-2 text-sm font-medium rounded-xl border ${dk ? "border-white/10 text-white/50 hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>Cancel</button>
            <button onClick={() => { setSaved(true); setTimeout(closeModal, 1000); }} className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl transition-all ${saved ? "bg-emerald-500 text-white" : "bg-violet-500 hover:bg-violet-600 text-white"}`}>
              {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Shield className="w-4 h-4" /> Save Permissions</>}
            </button>
          </div>
        </div>
      </div>
    );

    if (modal === "audit" && selected) return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModal}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className={`relative w-full max-w-lg rounded-2xl shadow-2xl z-10 ${modalBg}`} onClick={e => e.stopPropagation()}>
          <div className={`flex items-center justify-between px-6 py-4 border-b ${dk ? "border-white/8" : "border-slate-100"}`}>
            <div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-lg bg-slate-500/15 flex items-center justify-center"><Activity className="w-4 h-4 text-slate-400" /></div>
              <div><p className={`text-sm font-semibold ${ht}`}>Audit History</p><p className={`text-xs ${mt}`}>{selected.name} · {selected.id}</p></div></div>
            <button onClick={closeModal} className={`p-1.5 rounded-lg ${dk ? "hover:bg-white/8 text-white/40" : "hover:bg-slate-100 text-slate-400"}`}><X className="w-4 h-4" /></button>
          </div>
          <div className={`divide-y ${dv} max-h-80 overflow-y-auto`}>
            {AUDIT_LOG.map((l, i) => (
              <div key={i} className="flex items-start gap-4 px-6 py-3.5">
                <div className="w-7 h-7 rounded-full bg-violet-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5">{l.by[0]}</div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] font-semibold ${ht}`}>{l.action}</p>
                  <p className={`text-[11px] mt-0.5 ${mt}`}>{l.detail} · by {l.by}</p>
                </div>
                <span className={`text-[11px] shrink-0 ${mt}`}>{l.date}</span>
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
          <h1 className={`text-xl font-bold ${ht}`}>Agent Admins</h1>
          <p className={`text-sm mt-0.5 ${mt}`}>Manage all registered recruitment agent administrators</p>
        </div>
        <button onClick={() => openModal("add")} className="flex items-center gap-2 px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-md shadow-violet-500/20">
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
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search agent admins..."
              className={`w-full pl-9 pr-4 py-2 text-sm rounded-lg outline-none ${inputCls}`} />
          </div>
          <div className="flex items-center gap-2">
            {["all","active","pending","inactive"].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${filter === f ? "bg-violet-500 text-white" : dk ? "bg-white/5 text-white/50 hover:bg-white/10" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={thCls}>
                {["Agent Admin","Agency","Contact","Location","Clients","Commission","Status","Last Login","Actions"].map(h => (
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
                    <td className={`px-6 py-4 text-[12px] max-w-[140px] truncate ${mt}`}>{a.agency}</td>
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <p className={`text-[11px] flex items-center gap-1.5 ${mt}`}><Mail className="w-3 h-3" />{a.email}</p>
                        <p className={`text-[11px] flex items-center gap-1.5 ${mt}`}><Phone className="w-3 h-3" />{a.phone}</p>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-[12px] ${mt}`}><span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" />{a.location}</span></td>
                    <td className={`px-6 py-4 text-[13px] font-bold ${ht}`}>{a.clients}</td>
                    <td className={`px-6 py-4 text-[12px] font-semibold ${dk ? "text-emerald-400" : "text-emerald-600"}`}>{a.commission}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${S.cls}`}>
                        <SIcon className="w-3 h-3" />{S.label}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-[12px] ${mt}`}>{a.lastLogin}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openModal("edit", a)} title="Edit" className={`p-1.5 rounded-lg transition-colors ${dk ? "hover:bg-white/8 text-white/40 hover:text-violet-400" : "hover:bg-slate-100 text-slate-400 hover:text-violet-500"}`}><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => toggleStatus(a)} title={a.status === "active" ? "Deactivate" : "Activate"}
                          className={`p-1.5 rounded-lg transition-colors ${a.status === "active" ? (dk ? "hover:bg-red-500/10 text-white/40 hover:text-red-400" : "hover:bg-red-50 text-slate-400 hover:text-red-500") : (dk ? "hover:bg-emerald-500/10 text-white/40 hover:text-emerald-400" : "hover:bg-emerald-50 text-slate-400 hover:text-emerald-500")}`}>
                          {a.status === "active" ? <PowerOff className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => openModal("reset", a)} title="Reset Password" className={`p-1.5 rounded-lg transition-colors ${dk ? "hover:bg-amber-500/10 text-white/40 hover:text-amber-400" : "hover:bg-amber-50 text-slate-400 hover:text-amber-500"}`}><Key className="w-3.5 h-3.5" /></button>
                        <button onClick={() => openModal("login", a)} title="Login History" className={`p-1.5 rounded-lg transition-colors ${dk ? "hover:bg-indigo-500/10 text-white/40 hover:text-indigo-400" : "hover:bg-indigo-50 text-slate-400 hover:text-indigo-500"}`}><History className="w-3.5 h-3.5" /></button>
                        <button onClick={() => openModal("permissions", a)} title="Assign Permissions" className={`p-1.5 rounded-lg transition-colors ${dk ? "hover:bg-violet-500/10 text-white/40 hover:text-violet-400" : "hover:bg-violet-50 text-slate-400 hover:text-violet-500"}`}><Shield className="w-3.5 h-3.5" /></button>
                        <button onClick={() => openModal("audit", a)} title="Audit History" className={`p-1.5 rounded-lg transition-colors ${dk ? "hover:bg-white/8 text-white/40 hover:text-white/70" : "hover:bg-slate-100 text-slate-400 hover:text-slate-600"}`}><Activity className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className={`px-6 py-3 border-t ${dk ? "border-white/5" : "border-slate-100"}`}>
          <p className={`text-[12px] ${mt}`}>Showing {filtered.length} of {agentList.length} agent admins</p>
        </div>
      </div>
    </div>
  );
}
