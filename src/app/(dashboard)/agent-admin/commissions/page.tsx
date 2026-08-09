"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useTheme } from "@/providers/theme-provider";
import { agentAdminService } from "@/services/agent-admin.service";
import { api } from "@/lib/axios";
import {
  Search, CheckCircle, XCircle, Clock, DollarSign, RefreshCw,
  History, ChevronDown, Filter, Layers, AlertCircle, Download, Info, X
} from "lucide-react";

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  Pending: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400", dot: "bg-amber-400" },
  Approved: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-400" },
  Rejected: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400", dot: "bg-red-400" },
  Settled: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400", dot: "bg-blue-400" },
  Paid: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-400", dot: "bg-purple-400" },
  "Under Review": { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400", dot: "bg-orange-400" },
  Cancelled: { bg: "bg-slate-100 dark:bg-slate-800/60", text: "text-slate-500 dark:text-slate-400", dot: "bg-slate-400" },
};

const VALID_TRANSITIONS: Record<string, string[]> = {
  Pending: ["Pending", "Approved", "Rejected", "Cancelled"],
  Approved: ["Approved", "Settled", "Cancelled"],
  "Under Review": ["Under Review", "Pending", "Approved", "Rejected", "Cancelled"],
  Rejected: ["Rejected"],
  Settled: ["Settled", "Paid", "Cancelled"],
  Paid: ["Paid"],
  Cancelled: ["Cancelled"],
};

function StatusSelectDropdown({
  comm,
  isDark,
  onChange
}: {
  comm: any;
  isDark: boolean;
  onChange: (targetStatus: string) => void;
}) {
  const currentStatus = comm.status;
  const options = VALID_TRANSITIONS[currentStatus] || [currentStatus];
  const s = STATUS_COLORS[currentStatus] || STATUS_COLORS["Pending"];

  if (options.length <= 1) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${s.bg} ${s.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
        {currentStatus}
      </span>
    );
  }

  return (
    <div className="relative inline-block">
      <select
        value={currentStatus}
        onChange={(e) => {
          if (e.target.value !== currentStatus) {
            onChange(e.target.value);
          }
        }}
        className={`appearance-none inline-flex items-center gap-1.5 px-2.5 py-1 pr-6 rounded-full text-[10px] font-bold cursor-pointer outline-none transition border border-transparent hover:border-current ${s.bg} ${s.text}`}
      >
        {options.map(opt => (
          <option key={opt} value={opt} className={isDark ? "bg-[#0d1f35] text-white" : "bg-white text-slate-800"}>
            {opt}
          </option>
        ))}
      </select>
      <span className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60 text-[7px] ${s.text}`}>▼</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_COLORS[status] || STATUS_COLORS["Pending"];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

function SourceBadge({ source }: { source: string }) {
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${source === "Course Override"
      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
      : "bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-400"}`}>
      {source}
    </span>
  );
}

export default function Commissions() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const card = `rounded-2xl p-5 ${isDark ? "bg-[#0d1f35] border border-white/[0.06]" : "bg-white border border-slate-200 shadow-sm"}`;
  const ht = isDark ? "text-white/90" : "text-slate-800";
  const mt = isDark ? "text-white/40" : "text-slate-400";
  const inputCls = `bg-transparent outline-none w-full text-xs ${isDark ? "text-white" : "text-slate-800"}`;
  const inputWrap = `flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm ${isDark ? "bg-white/5 border-white/10 text-white/60" : "bg-white border-slate-200 text-slate-600 shadow-sm"}`;
  const selectCls = `px-3 py-2.5 rounded-xl border text-xs font-semibold outline-none cursor-pointer ${isDark ? "bg-[#0d1f35] border-white/10 text-white" : "bg-white border-slate-200 text-slate-700 shadow-sm"}`;

  const [loading, setLoading] = useState(true);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [settlements, setSettlements] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"ledger" | "settlements">("ledger");

  // Lifecycle modal
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedComm, setSelectedComm] = useState<any>(null);
  const [selectedCommDetails, setSelectedCommDetails] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [reason, setReason] = useState("");
  const [statusActionLoading, setStatusActionLoading] = useState(false);
  const [statusError, setStatusError] = useState("");

  // History modal
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyComm, setHistoryComm] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Settlement batch modal
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [selectedForSettlement, setSelectedForSettlement] = useState<string[]>([]);
  const [settleAgentId, setSettleAgentId] = useState("");
  const [settleLoading, setSettleLoading] = useState(false);
  const [settleError, setSettleError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [c, s] = await Promise.all([
        agentAdminService.getCommissions(),
        api.get("/agent-admin/settlements").then(r => r.data).catch(() => []),
      ]);
      setCommissions(c);
      setSettlements(s);
    } catch (err) {
      console.error("Failed to load commissions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = commissions.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = c.seafarerName?.toLowerCase().includes(q) ||
      c.courseName?.toLowerCase().includes(q) ||
      c.agentName?.toLowerCase().includes(q) ||
      c.invoiceNumber?.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || c.status?.toLowerCase() === statusFilter;
    return matchSearch && matchStatus;
  });

  const approvedComms = commissions.filter(c => c.status === "Approved");

  // Stats
  const totalPending = commissions.filter(c => c.status === "Pending").length;
  const totalApproved = commissions.filter(c => c.status === "Approved").length;
  const totalEarnings = commissions
    .filter(c => ["Approved", "Settled", "Paid"].includes(c.status))
    .reduce((sum, c) => sum + (c.rawAmount || 0), 0);
  const totalPaid = commissions.filter(c => c.status === "Paid").length;

  const openStatusModal = (comm: any, target: string) => {
    setSelectedComm(comm);
    setNewStatus(target);
    setReason("");
    setStatusError("");
    setShowStatusModal(true);
  };

  const submitStatusChange = async () => {
    if (!selectedComm) return;
    setStatusActionLoading(true);
    setStatusError("");
    try {
      await api.patch(`/agent-admin/commissions/${selectedComm.id}/status`, {
        status: newStatus,
        reason,
      });
      setShowStatusModal(false);
      await fetchData();
    } catch (err: any) {
      setStatusError(err?.response?.data?.message || "Failed to update status.");
    } finally {
      setStatusActionLoading(false);
    }
  };

  const openHistory = async (comm: any) => {
    setHistoryComm(comm);
    setHistoryLoading(true);
    setShowHistoryModal(true);
    try {
      const res = await api.get(`/agent-admin/commissions/${comm.id}/history`);
      setHistory(res.data);
    } catch {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const toggleSettlementSelect = (id: string, agentId: string) => {
    setSettleAgentId(agentId);
    setSelectedForSettlement(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const submitSettlement = async () => {
    if (selectedForSettlement.length === 0) return;
    setSettleLoading(true);
    setSettleError("");
    try {
      await api.post("/agent-admin/settlements", {
        agentId: settleAgentId,
        commissionIds: selectedForSettlement,
      });
      setShowSettleModal(false);
      setSelectedForSettlement([]);
      await fetchData();
    } catch (err: any) {
      setSettleError(err?.response?.data?.message || "Failed to create settlement batch.");
    } finally {
      setSettleLoading(false);
    }
  };

  const paySettlement = async (id: string) => {
    try {
      await api.patch(`/agent-admin/settlements/${id}/pay`);
      await fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to process payment.");
    }
  };

  const exportCSV = () => {
    const rows = [
      ["Invoice Number", "Seafarer Name", "Course", "Course Fee", "Commission Rate", "Commission Amount", "Commission Source", "Version", "Status", "Agent", "Date"],
      ...filtered.map(c => [
        c.invoiceNumber, c.seafarerName, c.courseName, c.courseFee, c.commissionRate, c.commissionAmount,
        c.commissionSource, c.commissionVersion, c.status, c.agentName, new Date(c.createdAt).toLocaleDateString("en-IN"),
      ])
    ];
    const csv = rows.map(r => r.map((v: any) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `commissions-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const tabBtn = (id: "ledger" | "settlements", label: string, count?: number) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 ${activeTab === id
        ? "bg-blue-600 text-white shadow"
        : isDark ? "text-white/50 hover:text-white/80 hover:bg-white/5" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"}`}
    >
      {label}
      {count !== undefined && (
        <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === id ? "bg-white/25 text-white" : "bg-amber-500/20 text-amber-600"}`}>
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${ht}`}>Commission Management</h1>
          <p className={`text-xs mt-1.5 ${mt}`}>Track, approve, reject, and settle agent commissions (PRD Chapter 9).</p>
        </div>
        <div className="flex gap-2">
          {approvedComms.length > 0 && (
            <button
              onClick={() => { setSelectedForSettlement([]); setSettleError(""); setShowSettleModal(true); }}
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
            >
              <Layers className="w-4 h-4" />
              Create Settlement Batch
              <span className="text-xs bg-white/25 px-1.5 py-0.5 rounded-full">{approvedComms.length}</span>
            </button>
          )}
          <button
            onClick={exportCSV}
            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${isDark ? "bg-white/8 hover:bg-white/12 text-white/70" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button onClick={fetchData} className={`p-2.5 rounded-xl transition-colors ${isDark ? "bg-white/5 hover:bg-white/10 text-white/50" : "bg-slate-100 hover:bg-slate-200 text-slate-500"}`}>
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Pending Approval", value: totalPending, icon: Clock, color: "text-amber-500" },
          { label: "Approved", value: totalApproved, icon: CheckCircle, color: "text-emerald-500" },
          { label: "Total Earnings", value: `₹${totalEarnings.toLocaleString("en-IN")}`, icon: DollarSign, color: "text-blue-500" },
          { label: "Paid", value: totalPaid, icon: CheckCircle, color: "text-purple-500" },
        ].map((s, i) => (
          <div key={i} className={`${card} flex items-center gap-4`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-current/10 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <div className={`text-xs ${mt}`}>{s.label}</div>
              <div className={`text-xl font-bold ${ht}`}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabBtn("ledger", "Commission Ledger", filtered.length)}
        {tabBtn("settlements", "Settlement Batches", settlements.length)}
      </div>

      {/* Commission Ledger Tab */}
      {activeTab === "ledger" && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3">
            <label className={`${inputWrap} flex-1`}>
              <Search className="w-4 h-4 opacity-55" />
              <input className={inputCls} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by seafarer, course, agent, invoice..." />
            </label>
            <select className={selectCls} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="settled">Settled</option>
              <option value="paid">Paid</option>
              <option value="under review">Under Review</option>
            </select>
          </div>

          {/* Commission Table */}
          <div className={`${card} overflow-hidden p-0`}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className={`border-b ${isDark ? "border-white/10 bg-white/[0.02]" : "border-slate-100 bg-slate-50"}`}>
                    {["Invoice #", "Seafarer", "Course", "Fee", "Rate", "Commission", "Source", "Status", "Agent", "Actions"].map(h => (
                      <th key={h} className={`px-4 py-3 text-left font-semibold ${mt} whitespace-nowrap`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className={`border-b ${isDark ? "border-white/5" : "border-slate-50"}`}>
                        {Array.from({ length: 10 }).map((_, j) => (
                          <td key={j} className="px-4 py-3">
                            <div className={`h-3 rounded-full animate-pulse ${isDark ? "bg-white/10" : "bg-slate-200"}`} style={{ width: `${[60, 45, 75, 50, 65, 80, 55, 70, 40, 60][(i + j) % 10]}%` }} />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-4 py-12 text-center">
                        <AlertCircle className={`w-8 h-8 mx-auto mb-2 ${mt}`} />
                        <div className={`text-sm font-semibold ${mt}`}>No commissions found</div>
                      </td>
                    </tr>
                  ) : filtered.map(c => (
                    <tr key={c.id} className={`border-b ${isDark ? "border-white/5 hover:bg-white/[0.025]" : "border-slate-50 hover:bg-slate-50/60"} transition-colors`}>
                      <td className="px-4 py-3 font-mono text-blue-500 text-xs font-semibold whitespace-nowrap">{c.invoiceNumber}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className={`font-semibold ${ht}`}>{c.seafarerName}</div>
                      </td>
                      <td className="px-4 py-3 max-w-[140px]">
                        <div className={`truncate ${isDark ? "text-white/60" : "text-slate-600"}`}>{c.courseName}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-semibold">{c.courseFee}</td>
                      <td className="px-4 py-3 whitespace-nowrap font-semibold text-blue-500">{c.commissionRate}</td>
                      <td className="px-4 py-3 whitespace-nowrap font-bold text-emerald-600 dark:text-emerald-400">{c.commissionAmount}</td>
                      <td className="px-4 py-3 whitespace-nowrap"><SourceBadge source={c.commissionSource || "General Commission"} /></td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusSelectDropdown comm={c} isDark={isDark} onChange={(targetStatus) => openStatusModal(c, targetStatus)} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className={isDark ? "text-white/60" : "text-slate-650"}>{c.agentName}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          {/* Status History */}
                          <button
                            onClick={() => openHistory(c)}
                            title="View Status History"
                            className={`p-1.5 rounded-xl border flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm hover:shadow-indigo-500/10 cursor-pointer ${
                              isDark 
                                ? "bg-white/[0.02] border-white/10 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 hover:border-indigo-500/30" 
                                : "bg-slate-50 border-slate-200 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 hover:border-indigo-200"
                            }`}
                          >
                            <History className="w-3.5 h-3.5" />
                          </button>
                          {/* Info Details Button */}
                          <button
                            onClick={() => setSelectedCommDetails(c)}
                            title="View Details"
                            className={`p-1.5 rounded-xl border flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm hover:shadow-cyan-500/10 cursor-pointer ${
                              isDark 
                                ? "bg-white/[0.02] border-white/10 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-500/30" 
                                : "bg-slate-50 border-slate-200 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 hover:border-cyan-200"
                            }`}
                          >
                            <Info className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Settlements Tab */}
      {activeTab === "settlements" && (
        <div className={`${card} overflow-hidden p-0`}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className={`border-b ${isDark ? "border-white/10 bg-white/[0.02]" : "border-slate-100 bg-slate-50"}`}>
                  {["Settlement #", "Agent", "HAC Invoice", "Total Amount", "Status", "Created", "Paid At", "Actions"].map(h => (
                    <th key={h} className={`px-4 py-3 text-left font-semibold ${mt} whitespace-nowrap`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className={`px-4 py-12 text-center ${mt}`}>Loading settlements...</td>
                  </tr>
                ) : settlements.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center">
                      <Layers className={`w-8 h-8 mx-auto mb-2 ${mt}`} />
                      <div className={`text-sm font-semibold ${mt}`}>No settlement batches yet</div>
                      <div className={`text-xs mt-1 ${mt}`}>Approve commissions first, then create a settlement batch.</div>
                    </td>
                  </tr>
                ) : settlements.map((s: any) => (
                  <tr key={s.id} className={`border-b ${isDark ? "border-white/5 hover:bg-white/[0.025]" : "border-slate-50 hover:bg-slate-50/60"}`}>
                    <td className="px-4 py-3 font-mono font-semibold text-blue-500">{s.settlementNumber}</td>
                    <td className="px-4 py-3 font-semibold">{s.agentName}</td>
                    <td className="px-4 py-3 font-mono text-xs text-indigo-500">{s.hacInvoiceNumber}</td>
                    <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">{s.totalAmount}</td>
                    <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                    <td className="px-4 py-3">{new Date(s.createdAt).toLocaleDateString("en-IN")}</td>
                    <td className="px-4 py-3">{s.paidAt ? new Date(s.paidAt).toLocaleDateString("en-IN") : "—"}</td>
                    <td className="px-4 py-3">
                      {s.status !== "Paid" && (
                        <button
                          onClick={() => paySettlement(s.id)}
                          className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                        >
                          <DollarSign className="w-3 h-3" /> Mark Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Status Change Modal */}
      {showStatusModal && selectedComm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`rounded-2xl w-full max-w-md shadow-2xl ${isDark ? "bg-[#0d1f35] border border-white/10" : "bg-white"}`}>
            <div className="p-6">
              <h3 className={`text-lg font-bold mb-1 ${ht}`}>
                {newStatus === "Approved" ? "Approve Commission" : "Reject Commission"}
              </h3>
              <p className={`text-xs mb-4 ${mt}`}>
                Commission for <strong>{selectedComm.seafarerName}</strong> — {selectedComm.courseName}
              </p>
              <div className={`text-xs font-semibold mb-2 ${isDark ? "text-white/60" : "text-slate-600"}`}>
                {newStatus === "Rejected" ? "Rejection Reason (Required)" : "Remarks (Optional)"}
              </div>
              <textarea
                rows={3}
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder={newStatus === "Rejected" ? "Enter mandatory rejection reason..." : "Enter optional remarks..."}
                className={`w-full px-3 py-2 rounded-xl text-xs border outline-none resize-none ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`}
              />
              {statusError && (
                <div className="mt-2 text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{statusError}</div>
              )}
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className={`flex-1 text-sm py-2.5 rounded-xl border font-semibold ${isDark ? "border-white/10 text-white/60 hover:bg-white/5" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                >
                  Cancel
                </button>
                <button
                  onClick={submitStatusChange}
                  disabled={statusActionLoading}
                  className={`flex-1 text-sm py-2.5 rounded-xl font-semibold text-white transition-colors ${newStatus === "Approved" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"} disabled:opacity-50`}
                >
                  {statusActionLoading ? "Updating..." : newStatus === "Approved" ? "Approve" : "Reject"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status History Modal */}
      {showHistoryModal && historyComm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`rounded-2xl w-full max-w-lg shadow-2xl ${isDark ? "bg-[#0d1f35] border border-white/10" : "bg-white"}`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-bold ${ht}`}>Status History</h3>
                <button onClick={() => setShowHistoryModal(false)} className={`text-xs px-3 py-1.5 rounded-lg ${isDark ? "bg-white/5 hover:bg-white/10 text-white/60" : "bg-slate-100 text-slate-600"}`}>Close</button>
              </div>
              <p className={`text-xs mb-4 ${mt}`}>{historyComm.seafarerName} — {historyComm.courseName}</p>
              {historyLoading ? (
                <div className={`text-sm text-center py-8 ${mt}`}>Loading history...</div>
              ) : history.length === 0 ? (
                <div className={`text-sm text-center py-8 ${mt}`}>No history records found.</div>
              ) : (
                <div className="space-y-3">
                  {history.map((h: any, i: number) => (
                    <div key={i} className={`flex gap-4 items-start p-3 rounded-xl ${isDark ? "bg-white/[0.03] border border-white/5" : "bg-slate-50 border border-slate-100"}`}>
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500 ring-4 ring-blue-500/20" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <StatusBadge status={h.old_status} />
                          <span className={`text-xs ${mt}`}>→</span>
                          <StatusBadge status={h.new_status} />
                        </div>
                        {h.reason && <div className={`text-xs mt-1.5 ${mt}`}>{h.reason}</div>}
                        <div className={`text-xs mt-1 ${mt}`}>
                          By {h.changed_by_user_name || "System"} · {new Date(h.created_at).toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Settlement Batch Modal */}
      {showSettleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`rounded-2xl w-full max-w-2xl shadow-2xl max-h-[85vh] flex flex-col ${isDark ? "bg-[#0d1f35] border border-white/10" : "bg-white"}`}>
            <div className="p-6 border-b border-white/[0.06] dark:border-white/10 border-slate-100">
              <h3 className={`text-lg font-bold ${ht}`}>Create Settlement Batch</h3>
              <p className={`text-xs mt-1 ${mt}`}>Select approved commissions to include in this settlement batch. Only commissions with Approved status can be settled.</p>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {approvedComms.length === 0 ? (
                <div className={`text-sm text-center py-8 ${mt}`}>No approved commissions available for settlement.</div>
              ) : (
                <div className="space-y-2">
                  {approvedComms.map(c => (
                    <label key={c.id} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-colors ${selectedForSettlement.includes(c.id) ? "border-emerald-500/50 bg-emerald-50 dark:bg-emerald-900/20" : isDark ? "border-white/5 hover:bg-white/5" : "border-slate-100 hover:bg-slate-50"}`}>
                      <input
                        type="checkbox"
                        checked={selectedForSettlement.includes(c.id)}
                        onChange={() => toggleSettlementSelect(c.id, c.agentId)}
                        className="accent-emerald-600"
                      />
                      <div className="flex-1 min-w-0">
                        <div className={`font-semibold text-xs ${ht}`}>{c.seafarerName} — {c.courseName}</div>
                        <div className={`text-xs ${mt}`}>{c.agentName} · {c.invoiceNumber}</div>
                      </div>
                      <div className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">{c.commissionAmount}</div>
                    </label>
                  ))}
                </div>
              )}
              {settleError && (
                <div className="mt-3 text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{settleError}</div>
              )}
            </div>
            <div className="p-6 border-t border-slate-100 dark:border-white/[0.06] flex gap-3">
              <button onClick={() => setShowSettleModal(false)} className={`flex-1 text-sm py-2.5 rounded-xl border font-semibold ${isDark ? "border-white/10 text-white/60" : "border-slate-200 text-slate-600"}`}>Cancel</button>
              <button
                onClick={submitSettlement}
                disabled={settleLoading || selectedForSettlement.length === 0}
                className="flex-1 text-sm py-2.5 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
              >
                {settleLoading ? "Creating..." : `Create Batch (${selectedForSettlement.length} selected)`}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Commission Details Modal */}
      {selectedCommDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className={`w-full max-w-lg p-6 rounded-3xl relative animate-in zoom-in-95 duration-200 ${
            isDark ? "bg-[#0d1f35] border border-white/10 text-white" : "bg-white text-slate-800 shadow-xl border border-slate-100"
          }`}>
            <button
              onClick={() => setSelectedCommDetails(null)}
              className={`absolute top-4 right-4 p-1.5 rounded-full transition ${isDark ? "hover:bg-white/5 text-white/40 hover:text-white" : "hover:bg-slate-100 text-slate-400 hover:text-slate-700"}`}
            >
              <X className="w-4 h-4" />
            </button>
            
            <h3 className="text-base font-bold mb-5 flex items-center gap-2 border-b pb-3 border-white/5">
              <DollarSign className="w-4 h-4 text-cyan-400" />
              Commission Details
            </h3>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/5">
                <span className={mt}>Invoice Number</span>
                <span className="col-span-2 font-mono font-bold text-blue-500">{selectedCommDetails.invoiceNumber}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/5">
                <span className={mt}>Seafarer Name</span>
                <span className="col-span-2 font-bold">{selectedCommDetails.seafarerName}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/5">
                <span className={mt}>Course Name</span>
                <span className="col-span-2 font-semibold">{selectedCommDetails.courseName}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/5">
                <span className={mt}>Course Fee</span>
                <span className="col-span-2 font-bold">{selectedCommDetails.courseFee}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/5">
                <span className={mt}>Commission Rate</span>
                <span className="col-span-2 font-bold text-blue-500">{selectedCommDetails.commissionRate}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/5">
                <span className={mt}>Commission Amount</span>
                <span className="col-span-2 font-bold text-emerald-600 dark:text-emerald-400">{selectedCommDetails.commissionAmount}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/5">
                <span className={mt}>Commission Source</span>
                <span className="col-span-2">
                  <SourceBadge source={selectedCommDetails.commissionSource || "General Commission"} />
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/5">
                <span className={mt}>Referring Agent</span>
                <span className="col-span-2 font-bold">{selectedCommDetails.agentName}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/5">
                <span className={mt}>Current Status</span>
                <span className="col-span-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    STATUS_COLORS[selectedCommDetails.status]?.bg || "bg-amber-100 dark:bg-amber-900/30"
                  } ${
                    STATUS_COLORS[selectedCommDetails.status]?.text || "text-amber-700 dark:text-amber-400"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_COLORS[selectedCommDetails.status]?.dot || "bg-amber-400"}`} />
                    {selectedCommDetails.status}
                  </span>
                </span>
              </div>
              {selectedCommDetails.rejection_reason && (
                <div className="pt-2">
                  <span className={`${mt} block mb-1.5`}>Rejection / Cancellation Remarks</span>
                  <div className={`p-4 rounded-xl leading-relaxed text-xs break-words ${isDark ? "bg-[#0b182d] text-white/80 border border-white/5" : "bg-slate-50 text-slate-700 border border-slate-200"}`}>
                    {selectedCommDetails.rejection_reason}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
