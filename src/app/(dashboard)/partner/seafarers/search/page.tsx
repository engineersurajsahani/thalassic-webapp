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
    ? "bg-[#0B0F19] rounded-[16px] border-0 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
    : "bg-[#FFFFFF] rounded-[16px] border-0 shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]";

  const headingText = isDark ? "text-white font-extrabold" : "text-[#111827] font-extrabold";
  const subText = isDark ? "text-gray-400 font-medium" : "text-[#6B7280] font-medium";
  const accentText = "text-[#3D5EF6] font-extrabold";

  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${headingText}`}>
            Search Seafarer Master
          </h1>
          <p className={`text-xs md:text-sm mt-1 ${subText}`}>
            Look up candidates using their INDoS number, Passport, CDC, Email, Mobile number, or Name before processing a course purchase.
          </p>
        </div>

        <Link
          href="/partner/seafarers/create"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white shadow-sm transition-colors shrink-0 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Create New Seafarer
        </Link>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className={`p-4.5 space-y-3 ${cardBg}`}>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter INDoS (e.g. 20N1234 - 8 chars), Passport, CDC, Email, or Name..."
              className={`w-full pl-10 pr-4 py-3 rounded-lg text-sm font-medium outline-none transition-colors ${
                isDark
                  ? "bg-[#111827] border border-[#1F2937] text-white placeholder-gray-500 focus:border-[#3D5EF6]"
                  : "bg-[#FAFAFA] border border-[#E5E7EB] text-[#111827] placeholder-[#9CA3AF] focus:border-[#3D5EF6]"
              }`}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 rounded-lg text-xs font-bold bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white shadow-sm transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            {loading ? "Searching..." : "Search Identity"}
          </button>
        </div>
        <div className={`flex flex-wrap items-center gap-2 text-xs font-semibold ${subText}`}>
          <span className={isDark ? "text-gray-200 font-bold" : "text-[#111827] font-bold"}>Quick Searches:</span>
          <button
            type="button"
            onClick={() => {
              setQuery("20N1234");
              partnerService.searchSeafarers("20N1234").then(setResults);
            }}
            className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-[#EEF1FE] text-[#3D5EF6] dark:bg-[#3D5EF6]/15 hover:opacity-80 transition-colors cursor-pointer"
          >
            INDoS: 20N1234
          </button>
          <button
            type="button"
            onClick={() => {
              setQuery("Z1234567");
              partnerService.searchSeafarers("Z1234567").then(setResults);
            }}
            className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-[#EEF1FE] text-[#3D5EF6] dark:bg-[#3D5EF6]/15 hover:opacity-80 transition-colors cursor-pointer"
          >
            Passport: Z1234567
          </button>
          <button
            type="button"
            onClick={() => {
              setQuery("raj@example.com");
              partnerService.searchSeafarers("raj@example.com").then(setResults);
            }}
            className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-[#EEF1FE] text-[#3D5EF6] dark:bg-[#3D5EF6]/15 hover:opacity-80 transition-colors cursor-pointer"
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
              <div key={i} className="h-32 rounded-[16px] bg-slate-200 dark:bg-white/5" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className={`p-10 text-center space-y-3 ${cardBg}`}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto bg-[#EEF1FE] text-[#3D5EF6] dark:bg-[#3D5EF6]/15">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className={`text-base font-extrabold ${headingText}`}>No Seafarer Master Found</h3>
            <p className={`text-xs max-w-md mx-auto mt-1 ${subText}`}>
              No existing Seafarer Master matched query <span className={accentText}>"{query}"</span>. You can create a new Seafarer Master record without requiring a public website account.
            </p>
            <div className="mt-4">
              <Link
                href="/partner/seafarers/create"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white shadow-sm"
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
                className={`p-5 ${cardBg}`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#3D5EF6] text-white flex items-center justify-center text-sm font-black uppercase shrink-0 shadow-sm">
                      {seafarer.name ? seafarer.name.split(" ").map((n: any) => n[0]).join("") : "SM"}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className={`text-base font-black ${headingText}`}>{seafarer.name}</h3>
                        <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-lg bg-[#EEF1FE] text-[#3D5EF6] dark:bg-[#3D5EF6]/15">
                          ID: {seafarer.id.substring(0, 8)}...
                        </span>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-[#DCFCE7] text-[#16A34A] dark:bg-emerald-500/15 dark:text-emerald-400">
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
                          <span className={`font-extrabold ${isDark ? "text-white" : "text-[#111827]"}`}>{seafarer.passportNum || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono">
                          <span className={`font-sans font-bold ${subText}`}>CDC:</span>
                          <span className={`font-extrabold ${isDark ? "text-white" : "text-[#111827]"}`}>{seafarer.cdcNum || "N/A"}</span>
                        </div>
                      </div>

                      <div className={`flex flex-wrap items-center gap-4 mt-2 text-xs font-semibold ${subText}`}>
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-[#3D5EF6] shrink-0" /> {seafarer.email}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-[#3D5EF6] shrink-0" /> {seafarer.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className={`flex items-center gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 ${
                    isDark ? "border-[#1F2937]" : "border-[#E5E7EB]"
                  }`}>
                    <Link
                      href={`/partner/seafarers/${seafarer.id}`}
                      className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                        isDark
                          ? "border-[#1F2937] hover:bg-[#1F2937] text-gray-200"
                          : "border-[#E5E7EB] hover:bg-[#F3F4F6] text-[#6B7280]"
                      }`}
                    >
                      View Profile & History
                    </Link>
                    <Link
                      href={`/partner/purchases/create?seafarerId=${seafarer.id}`}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white shadow-sm cursor-pointer transition-colors"
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
