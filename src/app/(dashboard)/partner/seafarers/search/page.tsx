"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { partnerService } from "@/services/partner.service";
import { useTheme } from "@/providers/theme-provider";
import {
  Search,
  UserPlus,
  ShoppingCart,
  UserCheck,
  CreditCard,
  Building,
  ShieldCheck,
  Phone,
  Mail,
  FileText,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function SeafarerSearchPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted ? theme === "dark" : true;

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const data = await partnerService.searchSeafarers(query);
      setResults(data || []);
      setSearched(true);
    } catch (err) {
      console.error("Failed to search seafarers:", err);
      setResults([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch of sample list
    handleSearch();
  }, []);

  const cardBg = isDark
    ? "bg-[#09162c]/80 border-white/5 hover:border-white/10"
    : "bg-white border-slate-200/80 shadow-sm hover:shadow-md";

  return (
    <div className="space-y-8 animate-fadeIn pb-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Search Seafarer Master
          </h1>
          <p className={`text-xs md:text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Look up candidates using their INDoS number, Passport, CDC, Email, Mobile number, or Name before processing a course purchase.
          </p>
        </div>

        <Link
          href="/partner/seafarers/create"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 transition-all shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          Create New Seafarer
        </Link>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className={`p-4 rounded-2xl border ${cardBg}`}>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter INDoS (e.g. 20N1234), Passport, CDC, Email, or Name..."
              className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium outline-none transition-all ${
                isDark
                  ? "bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:border-cyan-500/50"
                  : "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500"
              }`}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search Identity"}
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px] text-slate-400">
          <span className="font-semibold text-slate-300">Quick Searches:</span>
          <button
            type="button"
            onClick={() => {
              setQuery("20N1234");
              partnerService.searchSeafarers("20N1234").then(setResults);
            }}
            className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-cyan-400 font-mono"
          >
            INDoS: 20N1234
          </button>
          <button
            type="button"
            onClick={() => {
              setQuery("Z1234567");
              partnerService.searchSeafarers("Z1234567").then(setResults);
            }}
            className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-cyan-400 font-mono"
          >
            Passport: Z1234567
          </button>
          <button
            type="button"
            onClick={() => {
              setQuery("raj@example.com");
              partnerService.searchSeafarers("raj@example.com").then(setResults);
            }}
            className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-cyan-400 font-mono"
          >
            raj@example.com
          </button>
        </div>
      </form>

      {/* Search Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-300">
            {searched ? `Found ${results.length} Seafarer Master Record${results.length === 1 ? "" : "s"}` : "Seafarer Master Directory"}
          </h2>
          <span className="text-[11px] text-slate-400">
            One Seafarer Master per individual • Multi-partner supported
          </span>
        </div>

        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-slate-200 dark:bg-white/5" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className={`p-10 rounded-2xl border text-center ${cardBg}`}>
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-4">
              <UserCheck className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold">No Seafarer Master Found</h3>
            <p className={`text-xs max-w-md mx-auto mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              No existing Seafarer Master matched query <span className="font-semibold text-cyan-400">"{query}"</span>. You can create a new Seafarer Master record without requiring a public website account.
            </p>
            <div className="mt-5">
              <Link
                href="/partner/seafarers/create"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-lg shadow-cyan-500/20"
              >
                <UserPlus className="w-4 h-4" />
                Create New Seafarer Master
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((seafarer) => (
              <div
                key={seafarer.id}
                className={`p-5 rounded-2xl border transition-all ${cardBg}`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center text-sm font-black uppercase shrink-0 shadow-md shadow-cyan-500/20">
                      {seafarer.name ? seafarer.name.split(" ").map((n: any) => n[0]).join("") : "SM"}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-extrabold text-white">{seafarer.name}</h3>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          ID: {seafarer.id.substring(0, 8)}...
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Seafarer Master
                        </span>
                      </div>

                      {/* Identity credentials badges */}
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                        <div className="flex items-center gap-1.5 font-mono text-slate-300">
                          <span className="text-slate-400 font-sans">INDoS:</span>
                          <span className="font-bold text-cyan-300">{seafarer.indosNum || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono text-slate-300">
                          <span className="text-slate-400 font-sans">Passport:</span>
                          <span className="font-bold">{seafarer.passportNum || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono text-slate-300">
                          <span className="text-slate-400 font-sans">CDC:</span>
                          <span className="font-bold">{seafarer.cdcNum || "N/A"}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-400" /> {seafarer.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" /> {seafarer.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-white/5">
                    <Link
                      href={`/partner/seafarers/${seafarer.id}`}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        isDark ? "bg-white/5 hover:bg-white/10 border-white/10 text-slate-200" : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                      }`}
                    >
                      View Profile & History
                    </Link>
                    <Link
                      href={`/partner/purchases/create?seafarerId=${seafarer.id}`}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-md shadow-cyan-500/20"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Proceed to Course Purchase
                    </Link>
                  </div>
                </div>

                {/* Unified Multi-source Purchase History pill */}
                {seafarer.purchases && seafarer.purchases.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">
                      Unified Purchase History ({seafarer.purchases.length} courses):
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {seafarer.purchases.slice(0, 3).map((p: any) => (
                        <span
                          key={p.id}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/5 text-slate-300 border border-white/5"
                        >
                          {p.courseCode || p.courseName} ({p.purchaseSource || "Partner"})
                        </span>
                      ))}
                      {seafarer.purchases.length > 3 && (
                        <span className="text-[10px] text-cyan-400 font-semibold">
                          +{seafarer.purchases.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
