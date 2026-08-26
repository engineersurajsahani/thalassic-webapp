"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "@/providers/theme-provider";
import { financeService } from "@/services/finance.service";
import { Search, ShieldAlert, Clock, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";

export default function AuditLogsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const card    = isDark ? "bg-[#0c1a2e] border-white/5"  : "bg-white border-slate-200";
  const text    = isDark ? "text-white"                   : "text-slate-800";
  const subtext = isDark ? "text-white/40"                : "text-slate-500";
  const input   = isDark ? "bg-[#0a1525] border-white/8 text-white placeholder-white/20 focus:border-sky-500/40" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-sky-400";
  const row     = isDark ? "border-white/5 hover:bg-white/3" : "border-slate-100 hover:bg-slate-50";
  const th      = isDark ? "text-white/30 border-white/5"    : "text-slate-400 border-slate-100";

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await financeService.getAuditLogs({ search: search || undefined });
      setLogs(data?.logs || []);
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const filtered = logs.filter((l) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return l.action?.toLowerCase().includes(term) || l.user_name?.toLowerCase().includes(term) || l.entity_id?.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-bold tracking-tight ${text}`}>Financial Audit Logs</h1>
          <p className={`text-xs mt-0.5 ${subtext}`}>Permanent, immutable record of all financial actions</p>
        </div>
        <button onClick={load} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${isDark ? "border-white/10 text-white/50 hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      <div className={`p-4 rounded-xl border flex gap-4 ${isDark ? 'bg-rose-500/5 border-rose-500/10' : 'bg-rose-50 border-rose-100'}`}>
        <ShieldAlert className="w-8 h-8 text-rose-500 shrink-0" />
        <div>
          <h3 className={`text-sm font-bold ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>Strict Compliance Mode Active</h3>
          <p className={`text-xs mt-1 ${isDark ? 'text-rose-400/70' : 'text-rose-600/70'}`}>Audit logs cannot be edited or deleted under any circumstances. Access is restricted to Master role.</p>
        </div>
      </div>

      {/* Filters */}
      <div className={`p-4 rounded-xl border ${card} flex flex-wrap gap-3`}>
        <div className="flex-1 min-w-52 relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${subtext}`} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search logs by action, user, or entity ID..."
            className={`w-full pl-8 pr-3 py-2 rounded-lg text-xs border outline-none transition-all ${input}`}
          />
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-xl border ${card} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className={`border-b ${isDark ? "border-white/5" : "border-slate-100"}`}>
                {["Timestamp", "User", "Action", "Module", "Entity ID", "Details", "IP Address"].map(h => (
                  <th key={h} className={`px-4 py-3 text-left font-semibold uppercase tracking-wider ${th}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className={`border-b ${row}`}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className={`h-3 rounded animate-pulse ${isDark ? "bg-white/5" : "bg-slate-100"}`} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className={`px-4 py-12 text-center ${subtext}`}>
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    No audit records found
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <React.Fragment key={log.id}>
                    <tr className={`border-b ${row} transition-colors cursor-pointer`} onClick={() => setExpandedRow(expandedRow === log.id ? null : log.id)}>
                      <td className={`px-4 py-3 ${subtext}`}>
                        <div className="flex items-center gap-2">
                          {expandedRow === log.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          {new Date(log.created_at).toLocaleString('en-IN')}
                        </div>
                      </td>
                      <td className={`px-4 py-3 font-medium ${text}`}>{log.user_name || "System"}</td>
                      <td className={`px-4 py-3 font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{log.action}</td>
                      <td className={`px-4 py-3 ${text}`}>{log.module}</td>
                      <td className={`px-4 py-3 font-mono text-[11px] ${subtext}`}>{log.entity_id || "—"}</td>
                      <td className={`px-4 py-3 ${subtext} max-w-xs truncate`} title={log.details || ""}>{log.details || "—"}</td>
                      <td className={`px-4 py-3 font-mono text-[10px] ${subtext}`}>{log.ip_address || "—"}</td>
                    </tr>
                    {expandedRow === log.id && (log.previous_value || log.new_value) && (
                      <tr className={`${isDark ? 'bg-white/[0.02]' : 'bg-slate-50/50'}`}>
                        <td colSpan={7} className="px-10 py-4">
                          <div className="flex flex-col gap-3">
                            {log.previous_value && (
                              <div>
                                <span className={`text-[10px] font-bold uppercase ${subtext}`}>Previous Value</span>
                                <pre className={`mt-1 p-2 rounded text-[11px] font-mono overflow-x-auto ${isDark ? 'bg-black/40 text-rose-300' : 'bg-slate-100 text-rose-600'}`}>
                                  {JSON.stringify(log.previous_value, null, 2)}
                                </pre>
                              </div>
                            )}
                            {log.new_value && (
                              <div>
                                <span className={`text-[10px] font-bold uppercase ${subtext}`}>New Value</span>
                                <pre className={`mt-1 p-2 rounded text-[11px] font-mono overflow-x-auto ${isDark ? 'bg-black/40 text-emerald-300' : 'bg-slate-100 text-emerald-600'}`}>
                                  {JSON.stringify(log.new_value, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
