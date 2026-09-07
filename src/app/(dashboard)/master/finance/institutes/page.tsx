"use client";

import React, { useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  GraduationCap, Search, Download, CheckCircle2,
  Clock, XCircle, FileText, ChevronRight, X,
  Building2, Users, BookOpen, Wallet,
} from "lucide-react";
import FinanceTabs from "@/components/master/FinanceTabs";
import {
  MOCK_INSTITUTE_FINANCE,
  MockInstituteFinance,
  MOCK_COURSES,
} from "@/data/master-portal-mock";

const STATUS_BADGES: Record<string, { cls: string; label: string }> = {
  Settled:             { label: "Settled",           cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  "Partially Settled": { label: "Partially Settled", cls: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  Pending:             { label: "Pending",           cls: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
};

export default function InstituteFinancePage() {
  const { theme } = useTheme();
  const dk = theme === "dark";

  const [institutesList, setInstitutesList] = useState<MockInstituteFinance[]>(MOCK_INSTITUTE_FINANCE);
  const [search, setSearch]                 = useState("");
  const [statusFilter, setStatusFilter]     = useState("all");
  const [selectedInst, setSelectedInst]     = useState<MockInstituteFinance | null>(null);

  const card    = dk ? "bg-[#0c1a2e] border-white/5 rounded-2xl" : "bg-white border-slate-200 rounded-2xl shadow-sm";
  const ht      = dk ? "text-white" : "text-slate-800";
  const mt      = dk ? "text-white/40" : "text-slate-400";
  const inputBg = dk ? "bg-[#0a1525] border-white/8 text-white placeholder-white/20 focus:border-sky-500/40" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-sky-400";
  const rowHover= dk ? "border-white/5 hover:bg-white/3" : "border-slate-100 hover:bg-slate-50";
  const thCls   = dk ? "text-white/30 border-white/5" : "text-slate-400 border-slate-100";
  const modalBg = dk ? "bg-[#0c1a2e] border-white/10" : "bg-white border-slate-200";

  const filtered = institutesList.filter(i => {
    const q = search.toLowerCase();
    const matchSearch = i.instituteName.toLowerCase().includes(q) ||
      i.idtNumber.toLowerCase().includes(q) ||
      i.location.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || i.paymentStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-xl font-bold ${ht}`}>Institute-wise Finance</h1>
          <p className={`text-sm mt-0.5 ${mt}`}>
            Financial records grouped by accredited maritime training institutions conducting Hari Om courses
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert("Exporting institute finance report...")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors ${
              dk ? "border-white/10 text-white/70 hover:bg-white/5" : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Download className="w-3.5 h-3.5" /> Export Institute Ledger
          </button>
        </div>
      </div>

      {/* PRD 2.1 Navigation Tabs */}
      <FinanceTabs />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Institutes",      val: institutesList.length,                                                                   sub: "Training centers",      Icon: GraduationCap, c: "text-sky-400",    bg: dk ? "bg-sky-500/10" : "bg-sky-50" },
          { label: "Total Candidates",      val: institutesList.reduce((acc, i) => acc + i.seafarerCount, 0),                            sub: "Assigned seafarers",    Icon: Users,         c: "text-indigo-400", bg: dk ? "bg-indigo-500/10" : "bg-indigo-50" },
          { label: "Total Volume Payable",  val: `₹${(institutesList.reduce((acc, i) => acc + i.amountPayable, 0) / 100000).toFixed(2)}L`,sub: "Total course tuition", Icon: Wallet,        c: "text-emerald-400",bg: dk ? "bg-emerald-500/10" : "bg-emerald-50" },
          { label: "Pending Settlements",   val: `₹${(institutesList.reduce((acc, i) => acc + i.pendingAmount, 0) / 1000).toFixed(0)}K`,  sub: "Balance to clear",      Icon: Clock,         c: "text-amber-400",  bg: dk ? "bg-amber-500/10" : "bg-amber-50" },
        ].map(k => (
          <div key={k.label} className={`border ${card} p-4 flex items-center gap-3`}>
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
      <div className={`border ${card} p-4 flex flex-wrap items-center justify-between gap-3`}>
        <div className="relative flex-1 min-w-[260px]">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${mt}`} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by institute name, IDT number, or location..."
            className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border ${inputBg}`}
          />
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`text-[11px] font-semibold uppercase ${mt}`}>Status:</span>
          {["all", "Settled", "Partially Settled", "Pending"].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl capitalize transition-colors ${
                statusFilter === st
                  ? "bg-sky-500 text-white shadow-sm"
                  : dk ? "bg-white/5 text-white/50 hover:bg-white/10" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {st === "all" ? "All" : st}
            </button>
          ))}
        </div>
      </div>

      {/* Institute-wise Finance Table (PRD 2.5) */}
      <div className={`border ${card} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b text-[11px] font-semibold uppercase tracking-wider ${thCls}`}>
                <th className="text-left px-6 py-3.5">Institute Name (PRD §2.5)</th>
                <th className="text-left px-6 py-3.5">IDT Number</th>
                <th className="text-left px-6 py-3.5">Seafarers Associated</th>
                <th className="text-left px-6 py-3.5">Course Purchases</th>
                <th className="text-left px-6 py-3.5">Courses Conducted</th>
                <th className="text-left px-6 py-3.5">Amount Payable</th>
                <th className="text-left px-6 py-3.5">Amount Received</th>
                <th className="text-left px-6 py-3.5">Pending Amount</th>
                <th className="text-left px-6 py-3.5">Payment Status</th>
                <th className="text-right px-6 py-3.5">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(i => {
                const b = STATUS_BADGES[i.paymentStatus] || STATUS_BADGES.Pending;
                return (
                  <tr key={i.instituteId} className={`${rowHover} transition-colors border-b`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center shrink-0">
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        <div>
                          <p className={`font-semibold text-[13px] ${ht}`}>{i.instituteName}</p>
                          <p className={`text-[11px] ${mt}`}>{i.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[12px] font-mono font-medium ${dk ? "text-sky-300" : "text-sky-700"}`}>
                        {i.idtNumber}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-[13px] font-bold ${ht}`}>{i.seafarerCount}</td>
                    <td className={`px-6 py-4 text-[13px] font-medium ${ht}`}>{i.coursePurchasesCount}</td>
                    <td className="px-6 py-4">
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 font-semibold">
                        {i.coursesOfferedCount} Courses
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-[13px] font-bold ${ht}`}>
                      ₹{i.amountPayable.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-[13px] font-bold text-emerald-400">
                      ₹{i.amountReceived.toLocaleString()}
                    </td>
                    <td className={`px-6 py-4 text-[13px] font-bold ${i.pendingAmount > 0 ? "text-rose-400" : "text-slate-400"}`}>
                      ₹{i.pendingAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${b.cls}`}>
                        {i.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedInst(i)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          dk ? "bg-white/5 border-white/10 text-sky-400 hover:bg-white/10" : "bg-slate-100 border-slate-200 text-sky-600 hover:bg-slate-200"
                        }`}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className={`px-6 py-3.5 border-t ${dk ? "border-white/5" : "border-slate-100"} flex items-center justify-between text-xs ${mt}`}>
          <span>Showing {filtered.length} of {institutesList.length} institute financial records</span>
          <span>Compliant with PRD §2.5 (Institute-wise Financial Grouping)</span>
        </div>
      </div>

      {/* Institute Financial Breakdown Drawer */}
      {selectedInst && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-4 border ${modalBg}`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-base font-bold ${ht}`}>{selectedInst.instituteName}</h2>
                <p className={`text-xs mt-0.5 ${mt}`}>IDT: {selectedInst.idtNumber} · {selectedInst.location}</p>
              </div>
              <button onClick={() => setSelectedInst(null)} className={mt}><X className="w-5 h-5" /></button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className={`p-3 rounded-xl border ${dk ? "bg-white/3 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                <p className={`text-[10px] uppercase font-semibold ${mt}`}>Total Payable</p>
                <p className={`text-sm font-bold mt-1 ${ht}`}>₹{selectedInst.amountPayable.toLocaleString()}</p>
              </div>
              <div className={`p-3 rounded-xl border ${dk ? "bg-white/3 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                <p className={`text-[10px] uppercase font-semibold ${mt}`}>Total Received</p>
                <p className="text-sm font-bold mt-1 text-emerald-400">₹{selectedInst.amountReceived.toLocaleString()}</p>
              </div>
              <div className={`p-3 rounded-xl border ${dk ? "bg-white/3 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                <p className={`text-[10px] uppercase font-semibold ${mt}`}>Pending Balance</p>
                <p className="text-sm font-bold mt-1 text-rose-400">₹{selectedInst.pendingAmount.toLocaleString()}</p>
              </div>
            </div>

            <div className={`p-4 rounded-xl border space-y-2.5 text-xs ${dk ? "bg-white/3 border-white/5" : "bg-slate-50 border-slate-100"}`}>
              <div className="flex justify-between">
                <span className={mt}>Active Seafarer Trainees</span>
                <span className="font-bold">{selectedInst.seafarerCount} candidates</span>
              </div>
              <div className="flex justify-between">
                <span className={mt}>Total Course Bookings</span>
                <span className="font-bold">{selectedInst.coursePurchasesCount} enrollments</span>
              </div>
              <div className="flex justify-between">
                <span className={mt}>Settlement Status</span>
                <span className="font-semibold text-emerald-400">{selectedInst.paymentStatus}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedInst(null)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-xl ${dk ? "bg-white/10 text-white" : "bg-slate-200 text-slate-700"}`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
