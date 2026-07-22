"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import { agentAdminService } from "@/services/agent-admin.service";
import { Search, ClipboardList, RefreshCw, User, ShieldCheck } from "lucide-react";

export default function ReferredSeafarers() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [loading, setLoading] = useState(true);
  const [seafarers, setSeafarers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const card = `rounded-3xl overflow-hidden p-6 ${isDark ? "bg-[#0d1f35] border border-white/[0.06]" : "bg-white border border-slate-200 shadow-sm"}`;
  const labelText = isDark ? "text-white/50" : "text-slate-500";
  const ht = isDark ? "text-white/80" : "text-slate-800";
  const mt = isDark ? "text-white/35" : "text-slate-400";

  const fetchSeafarers = async () => {
    try {
      const list = await agentAdminService.getReferredSeafarers();
      setSeafarers(list);
    } catch (err) {
      console.error("Failed to load referred seafarers: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeafarers();
  }, []);

  const filteredSeafarers = seafarers.filter(sf => {
    return (
      sf.seafarerName?.toLowerCase().includes(search.toLowerCase()) ||
      sf.courseName?.toLowerCase().includes(search.toLowerCase()) ||
      sf.agentName?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${ht}`}>Referred Seafarers</h1>
          <p className={`text-xs mt-1.5 ${mt}`}>View the list of seafarers who registered and purchased courses via agent referral codes.</p>
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
            placeholder="Search by seafarer name, course, or agent..."
            className="bg-transparent outline-none w-full text-xs"
          />
        </label>
        
        <button 
          onClick={fetchSeafarers}
          className={`p-2.5 rounded-xl border flex items-center justify-center cursor-pointer transition ${isDark ? "border-white/10 hover:bg-white/5 text-white/50" : "border-slate-200 hover:bg-slate-50 text-slate-500 shadow-sm"}`}
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Seafarers Table List */}
      <div className={card}>
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredSeafarers.length === 0 ? (
          <div className="text-center py-10">
            <p className={`text-xs ${mt}`}>No referred seafarers found matching your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b pb-3 ${isDark ? "border-white/5 text-white/30" : "border-slate-100 text-slate-400"} uppercase font-semibold tracking-wider`}>
                  <th className="py-3.5 px-2">Seafarer Info</th>
                  <th className="py-3.5 px-2">Referring Agent</th>
                  <th className="py-3.5 px-2">Course Purchased</th>
                  <th className="py-3.5 px-2">Purchase Amount</th>
                  <th className="py-3.5 px-2">Purchase Date</th>
                  <th className="py-3.5 px-2 text-right">Referral Status</th>
                </tr>
              </thead>
              <tbody className={isDark ? "divide-y divide-white/5" : "divide-y divide-slate-100"}>
                {filteredSeafarers.map((sf) => (
                  <tr key={sf.id} className="hover:bg-white/[0.01] transition-all">
                    {/* Seafarer */}
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="font-bold">{sf.seafarerName}</span>
                      </div>
                    </td>

                    {/* Agent */}
                    <td className="py-4 px-2">
                      <p className={`font-semibold ${isDark ? "text-white/80" : "text-slate-700"}`}>{sf.agentName}</p>
                      <p className={`text-[10px] ${labelText}`}>{sf.agentEmail}</p>
                    </td>

                    {/* Course */}
                    <td className="py-4 px-2">
                      <span className="font-semibold">{sf.courseName}</span>
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-2 font-bold">
                      {sf.purchaseAmount}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-2">
                      {new Date(sf.purchaseDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>

                    {/* Status badge */}
                    <td className="py-4 px-2 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 justify-end bg-emerald-500/10 text-emerald-500`}>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {sf.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
