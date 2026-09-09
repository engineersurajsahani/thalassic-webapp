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
      s.cdcNum?.toLowerCase().includes(q) ||
      s.passportNum?.toLowerCase().includes(q)
    );
  });

  const cardBg = isDark
    ? "bg-[#0B0F19] rounded-[16px] border-0 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
    : "bg-[#FFFFFF] rounded-[16px] border-0 shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]";

  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-[#111827]"}`}>
            Seafarer Management
          </h1>
          <p className={`text-xs md:text-sm mt-1 ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}>
            Unified database of Seafarer Master identities. One record per individual across all partners and direct purchases.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            href="/partner/seafarers/create"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white shadow-sm transition-colors duration-200 shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            Create Seafarer Master
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className={`p-4 ${cardBg}`}>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter seafarers by name, INDoS, CDC, email, or mobile..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-full text-xs font-medium outline-none transition-colors duration-200 ${
              isDark
                ? "bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:border-[#3D5EF6]"
                : "bg-[#FAFAFA] border border-[#E5E7EB] text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#3D5EF6]"
            }`}
          />
        </div>
      </div>

      {/* Directory Table */}
      <div className={`overflow-hidden ${cardBg}`}>
        {loading ? (
          <div className="p-8 text-center text-slate-400 animate-pulse">Loading Seafarer Masters...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <p className={`text-sm font-semibold ${isDark ? "text-slate-300" : "text-[#6B7280]"}`}>No Seafarer Masters match your search.</p>
            <Link
              href="/partner/seafarers/create"
              className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-[#3D5EF6] hover:underline"
            >
              Register a new Seafarer Master
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className={isDark ? "bg-white/[0.03] text-slate-400 border-b border-white/5" : "bg-[#FAFAFA] text-[#6B7280] border-b border-[#E5E7EB]"}>
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Seafarer Name</th>
                  <th className="py-3.5 px-4 font-semibold">INDoS No</th>
                  <th className="py-3.5 px-4 font-semibold">CDC Number</th>
                  <th className="py-3.5 px-4 font-semibold">Contact Info</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Purchases</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={isDark ? "divide-y divide-white/5" : "divide-y divide-[#E5E7EB]"}>
                {filtered.map((s) => (
                  <tr key={s.id} className={isDark ? "hover:bg-white/[0.02] transition-colors duration-200" : "hover:bg-[#EEF1FE]/30 transition-colors duration-200"}>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#3D5EF6] text-white flex items-center justify-center font-bold text-[10px] uppercase shrink-0">
                          {s.name ? s.name[0] : "S"}
                        </div>
                        <div>
                          <p className={`font-bold leading-tight ${isDark ? "text-white" : "text-[#111827]"}`}>{s.name}</p>
                          <p className={`text-[10px] font-mono ${isDark ? "text-slate-400" : "text-[#9CA3AF]"}`}>ID: {s.id.substring(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#3D5EF6]">
                      {s.indosNum || "N/A"}
                    </td>
                    <td className={`py-3.5 px-4 font-mono ${isDark ? "text-slate-300" : "text-[#6B7280]"}`}>
                      {s.cdcNum || "N/A"}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className={`space-y-0.5 text-[11px] ${isDark ? "text-slate-300" : "text-[#6B7280]"}`}>
                        <p>{s.email}</p>
                        <p className={`text-[10px] ${isDark ? "text-slate-400" : "text-[#9CA3AF]"}`}>{s.phone}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isDark ? "bg-white/5 text-slate-200 border border-white/10" : "bg-[#EEF1FE] text-[#3D5EF6]"
                      }`}>
                        {s.purchasesCount || 0} Courses
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/partner/seafarers/${s.id}`}
                          className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors duration-200 ${
                            isDark ? "border-white/10 hover:bg-white/5 text-slate-300" : "border-[#E5E7EB] bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#6B7280]"
                          }`}
                        >
                          Profile
                        </Link>
                        <Link
                          href={`/partner/purchases/create?seafarerId=${s.id}`}
                          className="px-3.5 py-1.5 rounded-full bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-colors duration-200"
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
