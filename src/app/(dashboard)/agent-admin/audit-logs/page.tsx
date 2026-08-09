"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import { agentAdminService } from "@/services/agent-admin.service";
import { Search, ShieldAlert, RefreshCw, Terminal, Calendar, Info, X } from "lucide-react";

export default function AuditLogs() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  const card = `rounded-3xl overflow-hidden p-6 ${isDark ? "bg-[#0d1f35] border border-white/[0.06]" : "bg-white border border-slate-200 shadow-sm"}`;
  const labelText = isDark ? "text-white/50" : "text-slate-500";
  const ht = isDark ? "text-white/95" : "text-slate-800";
  const mt = isDark ? "text-white/35" : "text-slate-400";

  const fetchLogs = async () => {
    try {
      const list = await agentAdminService.getAuditLogs();
      setLogs(list);
    } catch (err) {
      console.error("Failed to load audit logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    return (
      log.user_name?.toLowerCase().includes(search.toLowerCase()) ||
      log.action?.toLowerCase().includes(search.toLowerCase()) ||
      log.details?.toLowerCase().includes(search.toLowerCase()) ||
      log.module?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${ht}`}>System Audit Logs</h1>
          <p className={`text-xs mt-1.5 ${mt}`}>Trace administrative actions, credentials resets, status changes, and commission updates.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <label className={`flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm ${isDark ? "bg-white/5 border-white/10 text-white/60" : "bg-white border-slate-200 text-slate-600 shadow-sm"}`}>
          <Search className="w-4 h-4 opacity-55" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search logs by action, user, module, or details..."
            className="bg-transparent outline-none w-full text-xs"
          />
        </label>
        
        <button 
          onClick={fetchLogs}
          className={`p-2.5 rounded-xl border flex items-center justify-center cursor-pointer transition ${isDark ? "border-white/10 hover:bg-white/5 text-white/50" : "border-slate-200 hover:bg-slate-50 text-slate-500 shadow-sm"}`}
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Logs Table List */}
      <div className={card}>
        <div className="flex items-center gap-2 border-b pb-4 mb-4 border-white/5">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold">Audit Ledger</h3>
        </div>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-10">
            <p className={`text-xs ${mt}`}>No audit logs recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b pb-3 ${isDark ? "border-white/5 text-white/30" : "border-slate-100 text-slate-400"} uppercase font-semibold tracking-wider`}>
                  <th className="py-3.5 px-2">Timestamp</th>
                  <th className="py-3.5 px-2">User / Admin</th>
                  <th className="py-3.5 px-2">Action</th>
                  <th className="py-3.5 px-2">Module</th>
                  <th className="py-3.5 px-2">Details</th>
                  <th className="py-3.5 px-2 text-right">Details</th>
                </tr>
              </thead>
              <tbody className={isDark ? "divide-y divide-white/5" : "divide-y divide-slate-100"}>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.01] transition-all">
                    {/* Timestamp */}
                    <td className="py-4 px-2 whitespace-nowrap">
                      <p className="flex items-center gap-1.5 text-[10px] font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        {new Date(log.created_at).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <p className={`text-[10px] mt-0.5 ml-5 ${labelText}`}>
                        {new Date(log.created_at).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </p>
                    </td>

                    {/* Admin Name */}
                    <td className="py-4 px-2 font-bold">
                      {log.user_name || "Agent Admin"}
                    </td>

                    {/* Action */}
                    <td className="py-4 px-2">
                      <span className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] ${isDark ? "bg-white/5 text-cyan-400" : "bg-slate-100 text-cyan-600"}`}>
                        {log.action}
                      </span>
                    </td>

                    {/* Module */}
                    <td className="py-4 px-2 font-semibold">
                      {log.module}
                    </td>

                    {/* Details */}
                    <td className="py-4 px-2 max-w-sm leading-normal">
                      <span className={isDark ? "text-white/70" : "text-slate-650"}>{log.details}</span>
                    </td>

                    {/* Details Action Button */}
                    <td className="py-4 px-2 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className={`p-1.5 rounded-lg border transition ${isDark ? "border-white/5 hover:bg-white/5 text-white/50 hover:text-white" : "border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800"}`}
                        title="View Info"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Audit Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-lg p-6 rounded-3xl relative animate-in fade-in zoom-in-95 duration-200 ${
            isDark ? "bg-[#0d1f35] border border-white/10 text-white" : "bg-white text-slate-800 shadow-xl border border-slate-100"
          }`}>
            <button
              onClick={() => setSelectedLog(null)}
              className={`absolute top-4 right-4 p-1.5 rounded-full transition ${isDark ? "hover:bg-white/5 text-white/40 hover:text-white" : "hover:bg-slate-100 text-slate-400 hover:text-slate-700"}`}
            >
              <X className="w-4 h-4" />
            </button>
            
            <h3 className="text-base font-bold mb-5 flex items-center gap-2 border-b pb-3 border-white/5">
              <Terminal className="w-4 h-4 text-cyan-400" />
              Audit Log Details
            </h3>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/5">
                <span className={labelText}>Action</span>
                <span className="col-span-2 font-mono font-bold text-cyan-400">{selectedLog.action}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/5">
                <span className={labelText}>Module</span>
                <span className="col-span-2 font-semibold">{selectedLog.module}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/5">
                <span className={labelText}>User / Admin</span>
                <span className="col-span-2 font-bold">{selectedLog.user_name || "Agent Admin"}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/5">
                <span className={labelText}>Timestamp</span>
                <span className="col-span-2 font-semibold">
                  {new Date(selectedLog.created_at).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                  })}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/5">
                <span className={labelText}>IP Address</span>
                <span className="col-span-2 font-mono">{selectedLog.ip_address || "127.0.0.1"}</span>
              </div>
              <div className="pt-2">
                <span className={`${labelText} block mb-1.5`}>Full Details</span>
                <div className={`p-4 rounded-xl leading-relaxed text-xs break-words ${isDark ? "bg-[#0b182d] text-white/80 border border-white/5" : "bg-slate-50 text-slate-700 border border-slate-200"}`}>
                  {selectedLog.details}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
