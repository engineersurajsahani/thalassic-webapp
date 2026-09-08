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
    handleSearch();
  }, []);

  const cardBg = isDark
    ? "bg-[#09162c]/90 border-white/10 shadow-xl hover:border-white/20"
    : "bg-white border-slate-200 shadow-md hover:shadow-lg";

  const headingText = isDark ? "text-white font-extrabold" : "text-slate-900 font-extrabold";
  const subText = isDark ? "text-slate-300 font-medium" : "text-slate-600 font-medium";
  const accentText = isDark ? "text-cyan-300 font-extrabold" : "text-blue-700 font-extrabold";

  return (
    <div className="space-y-8 animate-fadeIn pb-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full ${
                isDark ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30" : "bg-blue-100 text-blue-900 border border-blue-300"
              }`}
            >
              Step 1: Identify Seafarer Master
            </span>
          </div>
          <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight mt-2 ${headingText}`}>
            Search Seafarer Master
          </h1>
          <p className={`text-xs md:text-sm mt-1 ${subText}`}>
            Look up candidates using their INDoS number, Passport, CDC, Email, Mobile number, or Name before processing a course purchase.
          </p>
        </div>

        <Link
          href="/partner/seafarers/create"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-500/20 transition-all shrink-0 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Create New Seafarer
        </Link>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className={`p-4.5 rounded-2xl border ${cardBg}`}>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter INDoS (e.g. 20N1234), Passport, CDC, Email, or Name..."
              className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm font-semibold outline-none transition-all ${
                isDark
                  ? "bg-[#080F1E] border border-white/15 text-white placeholder:text-slate-500 focus:border-cyan-400"
                  : "bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-blue-600"
              }`}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer ${
              isDark
                ? "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
            }`}
          >
            {loading ? "Searching..." : "Search Identity"}
          </button>
        </div>
        <div className={`flex flex-wrap items-center gap-2 mt-3 text-xs font-semibold ${subText}`}>
          <span className={isDark ? "text-slate-200 font-bold" : "text-slate-800 font-bold"}>Quick Searches:</span>
          <button
            type="button"
            onClick={() => {
              setQuery("20N1234");
              partnerService.searchSeafarers("20N1234").then(setResults);
            }}
            className={`px-2.5 py-1 rounded text-xs font-mono font-extrabold transition-colors cursor-pointer ${
              isDark ? "bg-white/10 text-cyan-300 hover:bg-white/20" : "bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200"
            }`}
          >
            INDoS: 20N1234
          </button>
          <button
            type="button"
            onClick={() => {
              setQuery("Z1234567");
              partnerService.searchSeafarers("Z1234567").then(setResults);
            }}
            className={`px-2.5 py-1 rounded text-xs font-mono font-extrabold transition-colors cursor-pointer ${
              isDark ? "bg-white/10 text-cyan-300 hover:bg-white/20" : "bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200"
            }`}
          >
            Passport: Z1234567
          </button>
          <button
            type="button"
            onClick={() => {
              setQuery("raj@example.com");
              partnerService.searchSeafarers("raj@example.com").then(setResults);
            }}
            className={`px-2.5 py-1 rounded text-xs font-mono font-extrabold transition-colors cursor-pointer ${
              isDark ? "bg-white/10 text-cyan-300 hover:bg-white/20" : "bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200"
            }`}
          >
            raj@example.com
          </button>
        </div>
      </form>

      {/* Search Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className={`text-sm font-extrabold ${headingText}`}>
            {searched ? `Found ${results.length} Seafarer Master Record${results.length === 1 ? "" : "s"}` : "Seafarer Master Directory"}
          </h2>
          <span className={`text-xs font-medium ${subText}`}>
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
          <div className={`p-10 rounded-3xl border text-center ${cardBg}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
              isDark ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30" : "bg-blue-100 text-blue-800 border border-blue-200"
            }`}>
              <UserCheck className="w-7 h-7" />
            </div>
            <h3 className={`text-base font-extrabold ${headingText}`}>No Seafarer Master Found</h3>
            <p className={`text-xs max-w-md mx-auto mt-1 ${subText}`}>
              No existing Seafarer Master matched query <span className={accentText}>"{query}"</span>. You can create a new Seafarer Master record without requiring a public website account.
            </p>
            <div className="mt-5">
              <Link
                href="/partner/seafarers/create"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
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
                className={`p-5 rounded-3xl border transition-all ${cardBg}`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center text-sm font-black uppercase shrink-0 shadow-md shadow-blue-500/20">
                      {seafarer.name ? seafarer.name.split(" ").map((n: any) => n[0]).join("") : "SM"}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Candidate Name - FIXED High Contrast Class */}
                        <h3 className={`text-base font-black ${headingText}`}>{seafarer.name}</h3>
                        <span className={`text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded border ${
                          isDark ? "bg-cyan-500/15 text-cyan-300 border-cyan-500/30" : "bg-blue-100 text-blue-900 border-blue-300"
                        }`}>
                          ID: {seafarer.id.substring(0, 8)}...
                        </span>
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded border ${
                          isDark ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" : "bg-emerald-100 text-emerald-900 border-emerald-300"
                        }`}>
                          Seafarer Master
                        </span>
                      </div>

                      {/* Identity credentials badges */}
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                        <div className="flex items-center gap-1.5 font-mono">
                          <span className={`font-sans font-bold ${subText}`}>INDoS:</span>
                          <span className={`font-extrabold ${accentText}`}>{seafarer.indosNum || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono">
                          <span className={`font-sans font-bold ${subText}`}>Passport:</span>
                          <span className={`font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>{seafarer.passportNum || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono">
                          <span className={`font-sans font-bold ${subText}`}>CDC:</span>
                          <span className={`font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>{seafarer.cdcNum || "N/A"}</span>
                        </div>
                      </div>

                      <div className={`flex flex-wrap items-center gap-4 mt-2 text-xs font-semibold ${subText}`}>
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" /> {seafarer.email}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-blue-500 shrink-0" /> {seafarer.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className={`flex items-center gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 ${
                    isDark ? "border-white/10" : "border-slate-200"
                  }`}>
                    <Link
                      href={`/partner/seafarers/${seafarer.id}`}
                      className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        isDark
                          ? "bg-white/5 hover:bg-white/10 border-white/15 text-slate-200"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300"
                      }`}
                    >
                      View Profile & History
                    </Link>
                    <Link
                      href={`/partner/purchases/create?seafarerId=${seafarer.id}`}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-md shadow-blue-500/20 cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Proceed to Course Purchase
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
