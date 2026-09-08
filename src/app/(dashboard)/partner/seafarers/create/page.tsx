"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { partnerService } from "@/services/partner.service";
import { useTheme } from "@/providers/theme-provider";
import {
  UserPlus,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShoppingCart,
  ShieldAlert,
  UserCheck,
} from "lucide-react";

export default function CreateSeafarerPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const isDark = theme === "dark";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    birthPlace: "",
    nationality: "Indian",
    fatherName: "",
    indosNum: "",
    passportNum: "",
    passportExpiry: "",
    passportPlace: "",
    cdcNum: "",
    cdcExpiry: "",
    cdcPlace: "",
    education: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdSeafarer, setCreatedSeafarer] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await partnerService.createSeafarer(formData);
      setCreatedSeafarer(result);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to create Seafarer Master.");
    } finally {
      setLoading(false);
    }
  };

  const cardBg = isDark
    ? "bg-[#09162c]/80 border-white/5 shadow-xl"
    : "bg-white border-slate-200/80 shadow-md";

  if (createdSeafarer) {
    return (
      <div className="max-w-2xl mx-auto py-10 animate-fadeIn">
        <div className={`p-8 rounded-3xl border text-center ${cardBg}`}>
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Seafarer Master Created</h2>
          <p className={`text-xs mt-1.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            One central Seafarer Master identity successfully established for{" "}
            <span className="font-bold text-cyan-400">{createdSeafarer.name}</span>. No website login required.
          </p>

          <div className={`my-6 p-4 rounded-2xl border text-left space-y-2 text-xs ${isDark ? "bg-white/[0.02] border-white/5" : "bg-slate-50 border-slate-200"}`}>
            <div className="flex justify-between">
              <span className="text-slate-400">Master ID:</span>
              <span className="font-mono font-bold text-cyan-400">{createdSeafarer.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">INDoS Number:</span>
              <span className="font-mono font-bold text-white">{createdSeafarer.indosNum || "Pending"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Passport / CDC:</span>
              <span className="font-mono text-slate-300">
                {createdSeafarer.passportNum || "N/A"} / {createdSeafarer.cdcNum || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Email & Mobile:</span>
              <span className="text-slate-300">
                {createdSeafarer.email} • {createdSeafarer.phone}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`/partner/purchases/create?seafarerId=${createdSeafarer.id}`}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Proceed to Course Purchase
            </Link>
            <Link
              href={`/partner/seafarers/${createdSeafarer.id}`}
              className={`w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-semibold border transition-all ${
                isDark ? "bg-white/5 hover:bg-white/10 border-white/10 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              View Master Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Back button & Header */}
      <div>
        <Link
          href="/partner/seafarers/search"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Search Seafarers
        </Link>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-2">
          Create New Seafarer Master
        </h1>
        <p className={`text-xs md:text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Register a candidate's master identity. The individual can purchase physical courses through multiple partners or direct Hari Om later without duplicate profiles.
        </p>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-start gap-3 text-xs leading-relaxed animate-fadeIn">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-rose-300">Identity Conflict / Validation Error</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className={`p-6 md:p-8 rounded-3xl border space-y-6 ${cardBg}`}>
        {/* Section 1: Basic Identity */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-4 pb-1 border-b border-white/5 flex items-center gap-2">
            <span>👤</span> Core Personal Identity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                Full Name (as per Passport) *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Captain Ramesh Sharma"
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium outline-none transition-all ${
                  isDark ? "bg-white/5 border border-white/10 text-white focus:border-cyan-500/50" : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-500"
                }`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="ramesh@example.com"
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium outline-none transition-all ${
                  isDark ? "bg-white/5 border border-white/10 text-white focus:border-cyan-500/50" : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-500"
                }`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                Mobile Number *
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium outline-none transition-all ${
                  isDark ? "bg-white/5 border border-white/10 text-white focus:border-cyan-500/50" : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-500"
                }`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium outline-none transition-all ${
                  isDark ? "bg-white/5 border border-white/10 text-white focus:border-cyan-500/50" : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-500"
                }`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                Place of Birth / State
              </label>
              <input
                type="text"
                name="birthPlace"
                value={formData.birthPlace}
                onChange={handleChange}
                placeholder="e.g. Mumbai, Maharashtra"
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium outline-none transition-all ${
                  isDark ? "bg-white/5 border border-white/10 text-white focus:border-cyan-500/50" : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-500"
                }`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                Nationality
              </label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium outline-none transition-all ${
                  isDark ? "bg-white/5 border border-white/10 text-white focus:border-cyan-500/50" : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-500"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Section 2: DG Shipping & Maritime Identity */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-4 pb-1 border-b border-white/5 flex items-center gap-2">
            <span>⚓</span> Maritime Credentials & Verification
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                INDoS Number (DG Shipping)
              </label>
              <input
                type="text"
                name="indosNum"
                value={formData.indosNum}
                onChange={handleChange}
                placeholder="e.g. 20N1234"
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono uppercase font-bold outline-none transition-all ${
                  isDark ? "bg-white/5 border border-white/10 text-cyan-300 focus:border-cyan-500/50" : "bg-slate-50 border border-slate-200 text-blue-600 focus:border-blue-500"
                }`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                Passport Number
              </label>
              <input
                type="text"
                name="passportNum"
                value={formData.passportNum}
                onChange={handleChange}
                placeholder="e.g. Z1234567"
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono uppercase font-bold outline-none transition-all ${
                  isDark ? "bg-white/5 border border-white/10 text-white focus:border-cyan-500/50" : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-500"
                }`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                CDC (Continuous Discharge Cert)
              </label>
              <input
                type="text"
                name="cdcNum"
                value={formData.cdcNum}
                onChange={handleChange}
                placeholder="e.g. MUM123456"
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono uppercase font-bold outline-none transition-all ${
                  isDark ? "bg-white/5 border border-white/10 text-white focus:border-cyan-500/50" : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-500"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Contact & Address */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-4 pb-1 border-b border-white/5 flex items-center gap-2">
            <span>📍</span> Residential Address & Notes
          </h2>
          <div>
            <textarea
              name="address"
              rows={2}
              value={formData.address}
              onChange={handleChange}
              placeholder="Flat/House No, Building, Street, City, State, PIN code"
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium outline-none transition-all ${
                isDark ? "bg-white/5 border border-white/10 text-white focus:border-cyan-500/50" : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-500"
              }`}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
          <Link
            href="/partner/seafarers/search"
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
              isDark ? "bg-white/5 hover:bg-white/10 border-white/10 text-slate-400" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <UserPlus className="w-4 h-4" />
            {loading ? "Creating Master Record..." : "Create Seafarer Master"}
          </button>
        </div>
      </form>
    </div>
  );
}
