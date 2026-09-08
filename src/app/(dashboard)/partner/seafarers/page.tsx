"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { partnerService } from "@/services/partner.service";
import { useTheme } from "@/providers/theme-provider";
import {
  Users,
  Search,
  UserPlus,
  ShoppingCart,
  Eye,
  Mail,
  Phone,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function SeafarersDirectoryPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted ? theme === "dark" : true;

  const [seafarers, setSeafarers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSeafarers() {
      try {
        const data = await partnerService.getSeafarers();
        setSeafarers(data || []);
      } catch (err) {
        console.error("Failed to load seafarers directory:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSeafarers();
  }, []);

  const filtered = seafarers.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.name?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.phone?.toLowerCase().includes(q) ||
      s.indosNum?.toLowerCase().includes(q) ||
      s.passportNum?.toLowerCase().includes(q)
    );
  });

  const cardBg = isDark
    ? "bg-[#09162c]/80 border-white/5"
    : "bg-white border-slate-200/80 shadow-sm";

  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full ${
                isDark ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "bg-blue-50 text-blue-600 border border-blue-200"
              }`}
            >
              Master Identity Registry
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-2">
            Seafarer Masters
          </h1>
          <p className={`text-xs md:text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Unified database of Seafarer Master identities. One record per individual across all partners and direct purchases.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            href="/partner/seafarers/search"
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              isDark
                ? "bg-white/10 hover:bg-white/15 text-white border border-white/10"
                : "bg-slate-100 hover:bg-slate-200 text-slate-800"
            }`}
          >
            <Search className="w-4 h-4 text-cyan-400" />
            Search Seafarer
          </Link>
          <Link
            href="/partner/seafarers/create"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 transition-all shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            Create Seafarer Master
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className={`p-4 rounded-2xl border ${cardBg}`}>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter seafarers by name, INDoS, passport, email, or mobile..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium outline-none transition-all ${
              isDark
                ? "bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:border-cyan-500/50"
                : "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500"
            }`}
          />
        </div>
      </div>

      {/* Directory Table */}
      <div className={`rounded-2xl border overflow-hidden ${cardBg}`}>
        {loading ? (
          <div className="p-8 text-center text-slate-400 animate-pulse">Loading Seafarer Masters...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-300">No Seafarer Masters match your search.</p>
            <Link
              href="/partner/seafarers/create"
              className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:underline"
            >
              Register a new Seafarer Master
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className={isDark ? "bg-white/[0.03] text-slate-400 border-b border-white/5" : "bg-slate-50 text-slate-700 border-b border-slate-200 font-bold"}>
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Seafarer Name</th>
                  <th className="py-3.5 px-4 font-semibold">INDoS No</th>
                  <th className="py-3.5 px-4 font-semibold">Passport No</th>
                  <th className="py-3.5 px-4 font-semibold">Contact Info</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Purchases</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={isDark ? "divide-y divide-white/5" : "divide-y divide-slate-200"}>
                {filtered.map((s) => (
                  <tr key={s.id} className={isDark ? "hover:bg-white/[0.02]" : "hover:bg-slate-50"}>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center font-bold text-[10px] uppercase shrink-0">
                          {s.name ? s.name[0] : "S"}
                        </div>
                        <div>
                          <p className={`font-bold leading-tight ${isDark ? "text-white" : "text-slate-900"}`}>{s.name}</p>
                          <p className={`text-[10px] font-mono ${isDark ? "text-slate-400" : "text-slate-500 font-semibold"}`}>ID: {s.id.substring(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className={`py-3.5 px-4 font-mono font-bold ${isDark ? "text-cyan-400" : "text-blue-700"}`}>
                      {s.indosNum || "N/A"}
                    </td>
                    <td className={`py-3.5 px-4 font-mono ${isDark ? "text-slate-300" : "text-slate-800 font-semibold"}`}>
                      {s.passportNum || "N/A"}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className={`space-y-0.5 text-[11px] ${isDark ? "text-slate-300" : "text-slate-800 font-semibold"}`}>
                        <p>{s.email}</p>
                        <p className={isDark ? "text-slate-400 text-[10px]" : "text-slate-500 text-[10px] font-medium"}>{s.phone}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                        isDark ? "bg-white/5 text-slate-200 border-white/10" : "bg-blue-50 text-blue-900 border-blue-200"
                      }`}>
                        {s.purchasesCount || 0} Courses
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/partner/seafarers/${s.id}`}
                          className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                            isDark
                              ? "border-white/10 hover:bg-white/5 text-slate-300"
                              : "border-slate-300 hover:bg-slate-100 text-slate-800 bg-white"
                          }`}
                        >
                          Profile
                        </Link>
                        <Link
                          href={`/partner/purchases/create?seafarerId=${s.id}`}
                          className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs flex items-center gap-1 shadow-sm"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          Purchase
                        </Link>
                      </div>
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
