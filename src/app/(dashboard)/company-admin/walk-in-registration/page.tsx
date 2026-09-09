"use client";

import React, { useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  ClipboardList, User, Phone, Mail, MapPin, FileText,
  CheckCircle2, Clock, AlertCircle, Plus, X,
  Calendar, Anchor, Search,
} from "lucide-react";
import { mockSeafarers } from "@/components/company-admin/mockData";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const WALK_INS = [
  { id: "WI-001", name: "Arun Nair",       rank: "Deck Cadet",      phone: "+91 98765 11111", email: "arun.n@email.com",    status: "Active",   date: "Aug 2, 2026",  location: "Mumbai"    },
  { id: "WI-002", name: "Seema Pillai",    rank: "Able Seaman",     phone: "+91 87654 22222", email: "seema.p@email.com",   status: "Pending",  date: "Aug 1, 2026",  location: "Kochi"     },
  { id: "WI-003", name: "Rahul Varma",     rank: "Second Officer",  phone: "+91 76543 33333", email: "rahul.v@email.com",   status: "Active",   date: "Jul 31, 2026", location: "Chennai"   },
  { id: "WI-004", name: "Divya Menon",     rank: "Engine Cadet",    phone: "+91 65432 44444", email: "divya.m@email.com",   status: "Pending",  date: "Jul 30, 2026", location: "Kochi"     },
  { id: "WI-005", name: "Sanjay Tiwari",   rank: "Bosun",           phone: "+91 54321 55555", email: "sanjay.t@email.com",  status: "Active",   date: "Jul 29, 2026", location: "Kolkata"   },
  { id: "WI-006", name: "Pooja Rao",       rank: "Chief Cook",      phone: "+91 43210 66666", email: "pooja.r@email.com",   status: "Dropped",  date: "Jul 28, 2026", location: "Hyderabad" },
  { id: "WI-007", name: "Mukesh Singh",    rank: "AB Seaman",       phone: "+91 32109 77777", email: "mukesh.s@email.com",  status: "Active",   date: "Jul 27, 2026", location: "Mumbai"    },
  { id: "WI-008", name: "Latha Krishnan",  rank: "Navigating Officer",phone:"+91 21098 88888",email: "latha.k@email.com",   status: "Active",   date: "Jul 26, 2026", location: "Trivandrum"},
];

const RANKS_LIST = [
  "Captain", "Chief Officer", "Second Officer", "Third Officer", "Deck Cadet",
  "Chief Engineer", "Second Engineer", "Third Engineer", "Engine Cadet",
  "Able Seaman", "AB Seaman", "Bosun", "Pump Man", "Motorman",
  "Chief Cook", "Steward", "Radio Officer", "Navigating Officer",
];

const AVATAR_COLORS = ["bg-indigo-500","bg-sky-500","bg-emerald-500","bg-amber-500","bg-violet-500","bg-rose-500"];
function initials(name: string) { return name.split(" ").map(n => n[0]).join("").slice(0, 2); }

const statusMeta: Record<string, { cls: [string,string]; icon: React.ReactNode }> = {
  Active:  { cls: ["bg-emerald-100 text-emerald-700","bg-emerald-500/15 text-emerald-400"], icon: <CheckCircle2 className="w-3 h-3" /> },
  Pending: { cls: ["bg-amber-100 text-amber-700",   "bg-amber-500/15 text-amber-400"],     icon: <Clock className="w-3 h-3" />        },
  Dropped: { cls: ["bg-red-100 text-red-700",        "bg-red-500/15 text-red-400"],          icon: <AlertCircle className="w-3 h-3" />  },
};

// ─── Form State ───────────────────────────────────────────────────────────────

const EMPTY_FORM = { name: "", rank: "", phone: "", email: "", location: "", cdcNo: "" };

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function WalkInRegistrationPage() {
  const { theme } = useTheme();
  const dk = theme === "dark";

  const [form,    setForm]    = useState(EMPTY_FORM);
  const [records, setRecords] = useState(WALK_INS);
  const [saved,   setSaved]   = useState(false);
  
  const [existingSeafarerId, setExistingSeafarerId] = useState<string | null>(null);
  const [searchStatus, setSearchStatus] = useState<"idle" | "searching" | "found" | "not_found">("idle");
  const [validationError, setValidationError] = useState<string | null>(null);

  const card    = `rounded-2xl overflow-hidden ${dk ? "bg-[#0d1f35] border border-white/[0.06]" : "bg-white border border-slate-200 shadow-sm"}`;
  const ht      = dk ? "text-white/80"  : "text-slate-800";
  const mt      = dk ? "text-white/35"  : "text-slate-400";
  const inputBg = dk
    ? "bg-white/5 border-white/10 text-white/80 placeholder:text-white/25 focus:border-emerald-500/60"
    : "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-emerald-400";
  const divider = dk ? "divide-white/[0.05]" : "divide-slate-100";
  const labelCls = `block text-[11px] font-semibold mb-1 ${mt}`;

  const stats = [
    { label: "Total Walk-ins", value: records.length,                                           color: dk ? "text-white/80" : "text-slate-800" },
    { label: "Active",         value: records.filter(r => r.status === "Active").length,   color: dk ? "text-emerald-400" : "text-emerald-600" },
    { label: "Pending",        value: records.filter(r => r.status === "Pending").length,  color: dk ? "text-amber-400"   : "text-amber-600"   },
    { label: "Today",          value: records.filter(r => r.date === "Aug 2, 2026").length, color: dk ? "text-indigo-400"  : "text-indigo-600"  },
  ];
  
  const handleSearchExisting = () => {
    if (!form.email && !form.phone) {
      setValidationError("Please enter an Email or Phone number to check for an existing seafarer.");
      return;
    }

    setSearchStatus("searching");
    
    // Simulate API delay
    setTimeout(() => {
      const found = mockSeafarers.find(s => 
        (form.email && s.email.toLowerCase() === form.email.toLowerCase()) || 
        (form.phone && s.phone === form.phone)
      );
      
      if (found) {
        setSearchStatus("found");
        setExistingSeafarerId(found.id);
        setForm({
          name: found.name,
          rank: found.rank,
          email: found.email,
          phone: found.phone,
          location: found.nationality || "Indian",
          cdcNo: ""
        });
        setValidationError(null);
      } else {
        setSearchStatus("not_found");
        setExistingSeafarerId(null);
        setValidationError(null);
      }
    }, 600);
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.rank || !form.phone) return;
    const newRecord = {
      id: existingSeafarerId ? existingSeafarerId : `WI-${String(records.length + 1).padStart(3,"0")}`,
      name: form.name, rank: form.rank, phone: form.phone,
      email: form.email, location: form.location,
      status: existingSeafarerId ? "Active" : "Pending", date: "Aug 2, 2026", cdcNo: form.cdcNo,
    };
    setRecords(prev => [newRecord, ...prev]);
    setForm(EMPTY_FORM);
    setExistingSeafarerId(null);
    setSearchStatus("idle");
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="space-y-5">

      {/* Page header */}
      <div>
        <h1 className={`text-xl font-bold ${ht}`}>Walk-in Registration Log</h1>
        <p className={`text-sm mt-0.5 ${mt}`}>Quickly add walk-in seafarers</p>
      </div>

      {/* Stats strip */}
      <div className={card}>
        <div className={`grid grid-cols-4 divide-x ${dk ? "divide-white/[0.05]" : "divide-slate-100"}`}>
          {stats.map(s => (
            <div key={s.label} className="px-5 py-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className={`text-[11px] mt-0.5 ${mt}`}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

        {/* ── Registration Form ──────────────────────────────────────────────── */}
        <div className={`${card} xl:col-span-2`}>
          <div className={`flex items-center justify-between px-6 py-4 border-b ${dk ? "border-white/5" : "border-slate-100"}`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${dk ? "bg-emerald-500/15" : "bg-emerald-50"}`}>
                <ClipboardList className="w-4 h-4 text-emerald-500" />
              </div>
              <p className={`text-sm font-semibold ${ht}`}>New Walk-in</p>
            </div>
            <button
              type="button"
              onClick={handleSearchExisting}
              disabled={searchStatus === "searching"}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-bold transition-colors border cursor-pointer ${
                dk 
                  ? "bg-sky-500/10 text-sky-400 border-sky-500/20 hover:bg-sky-500/20" 
                  : "bg-sky-50 text-sky-600 border-sky-200 hover:bg-sky-100"
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              {searchStatus === "searching" ? "Checking..." : "Check Existing"}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            {searchStatus === "found" && existingSeafarerId && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <div>Existing Seafarer Found! Form auto-filled.</div>
              </div>
            )}
            {searchStatus === "not_found" && (
              <div className="p-3 bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 rounded-lg text-xs font-semibold flex items-center gap-2">
                <User className="w-4 h-4 shrink-0" />
                <div>No seafarer found. You can register them as new.</div>
              </div>
            )}
            {validationError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-lg text-xs font-semibold flex items-center gap-2">
                <X className="w-3 h-3 cursor-pointer shrink-0" onClick={() => setValidationError(null)} />
                {validationError}
              </div>
            )}

            {/* Email */}
            <div>
              <label className={labelCls}>Email</label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${mt}`} />
                <input
                  type="email" value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="email@example.com"
                  className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border outline-none transition-colors ${inputBg}`}
                />
              </div>
            </div>
            
            {/* Phone */}
            <div>
              <label className={labelCls}>Phone *</label>
              <div className="relative">
                <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${mt}`} />
                <input
                  required value={form.phone}
                  onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  placeholder="+91 XXXXX XXXXX"
                  className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border outline-none transition-colors ${inputBg}`}
                />
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className={labelCls}>Full Name *</label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${mt}`} />
                <input
                  required value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Enter full name"
                  className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border outline-none transition-colors ${inputBg}`}
                />
              </div>
            </div>

            {/* Rank */}
            <div>
              <label className={labelCls}>Rank *</label>
              <div className="relative">
                <Anchor className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${mt}`} />
                <select
                  required value={form.rank}
                  onChange={e => setForm(p => ({ ...p, rank: e.target.value }))}
                  className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border outline-none transition-colors appearance-none ${inputBg}`}
                >
                  <option value="">Select rank</option>
                  {RANKS_LIST.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>

            {/* Location & CDC No side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Location</label>
                <div className="relative">
                  <MapPin className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${mt}`} />
                  <input
                    value={form.location}
                    onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                    placeholder="City"
                    className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border outline-none transition-colors ${inputBg}`}
                  />
                </div>
              </div>
              <div>
                <label className={labelCls}>CDC No.</label>
                <div className="relative">
                  <FileText className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${mt}`} />
                  <input
                    value={form.cdcNo}
                    onChange={e => setForm(p => ({ ...p, cdcNo: e.target.value }))}
                    placeholder="CDC-XX-0000"
                    className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border outline-none transition-colors ${inputBg}`}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setForm(EMPTY_FORM);
                  setSearchStatus("idle");
                  setExistingSeafarerId(null);
                }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                  dk ? "border-white/10 text-white/50 hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                Clear
              </button>
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                {existingSeafarerId ? "Link Walk-in" : "Register"}
              </button>
            </div>

            {/* Success toast */}
            {saved && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <p className="text-xs font-medium text-emerald-400">
                  {existingSeafarerId ? "Walk-in linked successfully!" : "Walk-in logged successfully!"}
                </p>
              </div>
            )}
          </form>
        </div>

        {/* ── Recent Walk-ins Table ──────────────────────────────────────────── */}
        <div className={`${card} xl:col-span-3`}>
          <div className={`flex items-center justify-between px-6 py-4 border-b ${dk ? "border-white/5" : "border-slate-100"}`}>
            <p className={`text-sm font-semibold ${ht}`}>Recent Walk-ins</p>
            <span className={`text-xs ${mt}`}>{records.length} total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={dk ? "border-b border-white/5" : "border-b border-slate-100"}>
                  {["Seafarer","Rank","Status","Date"].map(h => (
                    <th key={h} className={`text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap ${mt}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className={`divide-y ${divider}`}>
                {records.map((r, i) => {
                  const meta = statusMeta[r.status] || statusMeta["Pending"];
                  return (
                    <tr key={r.id} className={`transition-colors ${dk ? "hover:bg-white/[0.03]" : "hover:bg-slate-50"}`}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                            {initials(r.name)}
                          </div>
                          <div>
                            <p className={`text-[13px] font-medium ${ht}`}>{r.name}</p>
                            <p className={`text-[10px] font-mono ${mt}`}>{r.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className={`px-5 py-3.5 text-[12px] ${dk ? "text-white/55" : "text-slate-500"}`}>{r.rank}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${dk ? meta.cls[1] : meta.cls[0]}`}>
                          {meta.icon}{r.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className={`flex items-center gap-1.5 text-[12px] ${mt}`}>
                          <Calendar className="w-3 h-3 shrink-0" />{r.date}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className={`px-5 py-3 border-t text-xs ${dk ? "border-white/5 text-white/20" : "border-slate-100 text-slate-400"}`}>
            Showing {records.length} walk-in registrations
          </div>
        </div>
      </div>
    </div>
  );
}
