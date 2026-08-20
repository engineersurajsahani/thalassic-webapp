"use client";

import React, { useState, useMemo } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  CreditCard, IndianRupee, CheckCircle2, Clock,
  AlertCircle, Search, Filter, TrendingUp, Calendar,
  Users, ArrowUpRight, ArrowDownLeft,
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const PAYMENTS = [
  { id: "PAY-001", seafarer: "Raj Kumar",       course: "STCW Basic Safety",       amount: 5000,  status: "Paid",    method: "UPI",         date: "Jul 20, 2026", txnId: "TXN20260720001" },
  { id: "PAY-002", seafarer: "Priya Sharma",    course: "Deck Watchkeeping",        amount: 5800,  status: "Pending", method: "Bank Transfer",date: "Jul 19, 2026", txnId: "—"              },
  { id: "PAY-003", seafarer: "Amit Patel",      course: "Engine Room Watch",        amount: 8100,  status: "Paid",    method: "Cash",        date: "Jul 18, 2026", txnId: "TXN20260718003" },
  { id: "PAY-004", seafarer: "Sunita Rajan",    course: "Advanced Fire Fighting",   amount: 7200,  status: "Paid",    method: "UPI",         date: "Jul 17, 2026", txnId: "TXN20260717004" },
  { id: "PAY-005", seafarer: "Karan Mehta",     course: "Ship Navigation",          amount: 6800,  status: "Overdue", method: "Bank Transfer",date: "Jul 15, 2026", txnId: "—"              },
  { id: "PAY-006", seafarer: "Deepa Nair",      course: "Maritime Catering",        amount: 3500,  status: "Paid",    method: "UPI",         date: "Jul 14, 2026", txnId: "TXN20260714006" },
  { id: "PAY-007", seafarer: "Vikram Das",      course: "Tanker Cargo Ops",         amount: 9400,  status: "Pending", method: "—",           date: "Jul 13, 2026", txnId: "—"              },
  { id: "PAY-008", seafarer: "Meena Iyer",      course: "STCW Basic Safety",        amount: 5000,  status: "Paid",    method: "Cash",        date: "Jul 12, 2026", txnId: "TXN20260712008" },
  { id: "PAY-009", seafarer: "Rohit Sharma",    course: "Tanker Cargo Ops",         amount: 9400,  status: "Paid",    method: "UPI",         date: "Jul 11, 2026", txnId: "TXN20260711009" },
  { id: "PAY-010", seafarer: "Lakshmi Devi",    course: "Maritime Law",             amount: 3200,  status: "Overdue", method: "—",           date: "Jul 10, 2026", txnId: "—"              },
  { id: "PAY-011", seafarer: "Suresh Verma",    course: "Engine Room Watch",        amount: 8100,  status: "Paid",    method: "Bank Transfer",date: "Jul 9, 2026",  txnId: "TXN20260709011" },
  { id: "PAY-012", seafarer: "Anita Pillai",    course: "Advanced Navigation",      amount: 11000, status: "Paid",    method: "UPI",         date: "Jul 8, 2026",  txnId: "TXN20260708012" },
];

const AVATAR_COLORS = ["bg-indigo-500","bg-sky-500","bg-emerald-500","bg-amber-500","bg-violet-500","bg-rose-500"];
function initials(name: string) { return name.split(" ").map(n => n[0]).join("").slice(0, 2); }

const statusMeta: Record<string, { light: string; dark: string; icon: React.ReactNode }> = {
  Paid:    { light: "bg-emerald-100 text-emerald-700", dark: "bg-emerald-500/15 text-emerald-400", icon: <CheckCircle2 className="w-3 h-3" /> },
  Pending: { light: "bg-amber-100 text-amber-700",     dark: "bg-amber-500/15 text-amber-400",     icon: <Clock className="w-3 h-3" />        },
  Overdue: { light: "bg-red-100 text-red-700",          dark: "bg-red-500/15 text-red-400",          icon: <AlertCircle className="w-3 h-3" />  },
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PaymentsPage() {
  const { theme } = useTheme();
  const dk = theme === "dark";

  const [query,      setQuery]      = useState("");
  const [filterStat, setFilterStat] = useState("All");

  const card    = `rounded-2xl overflow-hidden ${dk ? "bg-[#0d1f35] border border-white/[0.06]" : "bg-white border border-slate-200 shadow-sm"}`;
  const ht      = dk ? "text-white/80"  : "text-slate-800";
  const mt      = dk ? "text-white/35"  : "text-slate-400";
  const inputBg = dk
    ? "bg-white/5 border-white/10 text-white/70 placeholder:text-white/25 focus:border-emerald-500/50"
    : "bg-slate-50 border-slate-200 text-slate-700 placeholder:text-slate-400 focus:border-emerald-400";
  const divider = dk ? "divide-white/[0.05]" : "divide-slate-100";
  const chipAct = "bg-indigo-500 text-white";
  const chipIn  = dk ? "bg-white/5 text-white/40 hover:text-white/60" : "bg-slate-100 text-slate-500 hover:text-slate-700";

  const totalPaid    = PAYMENTS.filter(p => p.status === "Paid").reduce((s, p) => s + p.amount, 0);
  const totalPending = PAYMENTS.filter(p => p.status === "Pending").reduce((s, p) => s + p.amount, 0);
  const totalOverdue = PAYMENTS.filter(p => p.status === "Overdue").reduce((s, p) => s + p.amount, 0);

  const kpis = [
    { label: "Total Collected",  value: "₹" + (totalPaid / 1000).toFixed(0) + "K",    icon: IndianRupee, bg: dk ? "bg-emerald-500/15" : "bg-emerald-50", color: "#10b981" },
    { label: "Pending Amount",   value: "₹" + (totalPending / 1000).toFixed(0) + "K", icon: Clock,       bg: dk ? "bg-amber-500/15"   : "bg-amber-50",   color: "#f59e0b" },
    { label: "Overdue Amount",   value: "₹" + (totalOverdue / 1000).toFixed(0) + "K", icon: AlertCircle, bg: dk ? "bg-red-500/15"     : "bg-red-50",     color: "#f43f5e" },
    { label: "Total Payments",   value: String(PAYMENTS.length),                        icon: CreditCard,  bg: dk ? "bg-indigo-500/15"  : "bg-indigo-50",  color: "#6366f1" },
  ];

  const filtered = useMemo(() =>
    PAYMENTS.filter(p => {
      const q = query.toLowerCase();
      const matchQ = p.seafarer.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.course.toLowerCase().includes(q);
      const matchS = filterStat === "All" || p.status === filterStat;
      return matchQ && matchS;
    }),
    [query, filterStat]
  );

  return (
    <div className="space-y-5">

      {/* Page header */}
      <div>
        <h1 className={`text-xl font-bold ${ht}`}>Payments</h1>
        <p className={`text-sm mt-0.5 ${mt}`}>Track course fee collections and outstanding dues</p>
      </div>

      {/* KPI strip */}
      <div className={card}>
        <div className={`grid grid-cols-2 xl:grid-cols-4 divide-x divide-y xl:divide-y-0 ${dk ? "divide-white/[0.05]" : "divide-slate-100"}`}>
          {kpis.map(k => {
            const Icon = k.icon;
            return (
              <div key={k.label} className="flex items-center gap-4 px-6 py-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${k.bg}`}>
                  <Icon className="w-5 h-5" style={{ color: k.color }} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${ht}`}>{k.value}</p>
                  <p className={`text-[11px] mt-0.5 ${mt}`}>{k.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className={`${card} p-4`}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${mt}`} />
            <input
              value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search seafarer, course, ID…"
              className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border outline-none transition-colors ${inputBg}`}
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <Filter className={`w-3.5 h-3.5 ${mt}`} />
            {["All","Paid","Pending","Overdue"].map(s => (
              <button key={s} onClick={() => setFilterStat(s)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${filterStat === s ? chipAct : chipIn}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={card}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={dk ? "border-b border-white/5" : "border-b border-slate-100"}>
                {["Payment ID","Seafarer","Course","Amount","Method","Status","Date"].map(h => (
                  <th key={h} className={`text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap ${mt}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${divider}`}>
              {filtered.map((p, i) => {
                const meta = statusMeta[p.status];
                return (
                  <tr key={p.id} className={`transition-colors ${dk ? "hover:bg-white/[0.03]" : "hover:bg-slate-50"}`}>
                    <td className={`px-5 py-3.5 text-[12px] font-mono ${mt}`}>{p.id}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                          {initials(p.seafarer)}
                        </div>
                        <p className={`text-[13px] font-medium ${ht}`}>{p.seafarer}</p>
                      </div>
                    </td>
                    <td className={`px-5 py-3.5 text-[12px] max-w-[160px] truncate ${mt}`}>{p.course}</td>
                    <td className={`px-5 py-3.5 text-[13px] font-bold ${dk ? "text-white/80" : "text-slate-800"}`}>
                      ₹{p.amount.toLocaleString("en-IN")}
                    </td>
                    <td className={`px-5 py-3.5 text-[12px] ${mt}`}>{p.method}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${dk ? meta.dark : meta.light}`}>
                        {meta.icon}{p.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className={`flex items-center gap-1.5 text-[12px] ${mt}`}>
                        <Calendar className="w-3 h-3 shrink-0" />{p.date}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className={`text-center py-16 ${mt}`}>
            <CreditCard className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No payments match your filters</p>
          </div>
        )}
        <div className={`px-5 py-3 border-t text-xs ${dk ? "border-white/5 text-white/20" : "border-slate-100 text-slate-400"}`}>
          Showing {filtered.length} of {PAYMENTS.length} payments
        </div>
      </div>
    </div>
  );
}
