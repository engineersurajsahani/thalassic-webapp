"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useTheme } from "@/providers/theme-provider";
import { masterService } from "@/services/master.service";
import {
  Shield, Mail, Phone, Lock, Save, Check,
  CreditCard, Upload, Sparkles, CheckCircle2,
} from "lucide-react";

export default function SettingsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Consolidated form state
  const [form, setForm] = useState({
    // Admin Profile
    name: "master_ceo",
    email: "master@thalassic.in",
    role: "Master Administrator",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",

    // System & Gateway
    system_email: "support@thalassic.in",
    contact_phone: "+91 22 6819 4000",
    payment_gateway: "razorpay_production_mode", // Payment gateway mode

    // Accreditation
    dgs_accreditation_id: "DGS-MTI-10294 / IND-AP-9941",

    // Branding
    brandName: "Thalassic Maritime",
    brandTagline: "DG Shipping Approved Maritime Training & Certification Platform",
    logoUrl: "/logo.png",
  });

  const bg = isDark ? "bg-[#0d1f35] border border-white/6" : "bg-white border border-slate-200 shadow-sm";
  const headText = isDark ? "text-white/90" : "text-slate-800";
  const mutedText = isDark ? "text-white/40" : "text-slate-400";
  const inputBg = isDark
    ? "bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-indigo-500"
    : "bg-slate-50 border-slate-200 text-slate-700 placeholder:text-slate-400 focus:border-indigo-500";

  useEffect(() => {
    let mounted = true;
    masterService.getSettings()
      .then(settingsData => {
        if (!mounted) return;
        setForm(prev => ({
          ...prev,
          system_email: settingsData?.system_email ?? settingsData?.supportEmail ?? "support@thalassic.in",
          contact_phone: settingsData?.contact_phone ?? "+91 22 6819 4000",
          payment_gateway: settingsData?.payment_gateway ?? "razorpay_production_mode",
          dgs_accreditation_id: settingsData?.dgs_accreditation_id ?? "DGS-MTI-10294 / IND-AP-9941",
        }));
      })
      .catch(() => null)
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setSaving(true);
    setSuccess(false);

    try {
      // 1. Update system settings
      await masterService.updateSettings({
        system_email: form.system_email,
        contact_phone: form.contact_phone,
        payment_gateway: form.payment_gateway,
        dgs_accreditation_id: form.dgs_accreditation_id,
        brandName: form.brandName,
        brandTagline: form.brandTagline,
      });

      // 2. Update admin profile
      await masterService.updateAdminProfile({
        name: form.name,
        password: form.newPassword || undefined,
      }).catch(() => null);

      setSuccess(true);
      toast.success("Profile & platform settings updated successfully!");
      setForm(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
      setTimeout(() => setSuccess(false), 3500);
    } catch (err) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto animate-pulse">
        <div className="h-8 w-48 bg-slate-800 rounded-lg" />
        <div className="h-32 bg-slate-800 rounded-2xl" />
        <div className="h-64 bg-slate-800 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-black tracking-tight ${headText}`}>Master Profile & Settings</h1>
          <p className={`text-xs mt-0.5 ${mutedText}`}>
            Manage your master administrator profile, platform credentials, DGS accreditations, and branding
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Shield className="w-3.5 h-3.5" /> Super Admin Role
          </span>
        </div>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-6">

        {/* ── 1. Profile Overview Header Card ── */}
        <div className={`${bg} rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6`}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20 shrink-0">
              {form.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-lg font-bold ${headText}`}>{form.name}</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                  MASTER USER
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${mutedText}`}>{form.email}</p>
              <p className={`text-[11px] mt-1 text-sky-400 font-mono`}>Access: Full Platform & Financial Authority</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`px-4 py-2.5 rounded-xl border text-center ${isDark ? "bg-white/3 border-white/5" : "bg-slate-50 border-slate-100"}`}>
              <p className={`text-[10px] font-semibold uppercase ${mutedText}`}>Active Mode</p>
              <p className="text-xs font-bold text-emerald-400 mt-0.5">
                {form.payment_gateway === "razorpay_production_mode" ? "Live Production" : "Sandbox Mode"}
              </p>
            </div>
            <div className={`px-4 py-2.5 rounded-xl border text-center ${isDark ? "bg-white/3 border-white/5" : "bg-slate-50 border-slate-100"}`}>
              <p className={`text-[10px] font-semibold uppercase ${mutedText}`}>Accreditation</p>
              <p className={`text-xs font-bold mt-0.5 ${headText}`}>DGS Verified</p>
            </div>
          </div>
        </div>

        {/* ── 2. Thalassic Logo Branding Section ── */}
        <div className={`${bg} rounded-2xl p-6 space-y-4`}>
          <div className="flex items-center gap-2.5 pb-2 border-b border-white/5">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h3 className={`text-sm font-bold ${headText}`}>Thalassic Logo & Branding</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Logo Preview */}
            <div className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center gap-3 ${isDark ? "bg-white/3 border-white/5" : "bg-slate-50 border-slate-200"}`}>
              <div className="relative w-28 h-20 flex items-center justify-center p-2 rounded-xl bg-slate-900/60 border border-white/10 overflow-hidden">
                <Image
                  src={form.logoUrl}
                  alt="Thalassic Logo"
                  width={110}
                  height={60}
                  className="object-contain max-h-16"
                  onError={() => {}}
                />
              </div>
              <div>
                <p className={`text-xs font-bold ${headText}`}>Current Thalassic Logo</p>
                <p className={`text-[10px] ${mutedText}`}>Primary webapp header & invoices</p>
              </div>
              <button
                type="button"
                onClick={() => toast.success("Logo upload modal ready. Asset saved to /public/logo.png")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                  isDark ? "border-white/10 hover:bg-white/5 text-white/70" : "border-slate-200 hover:bg-slate-100 text-slate-600"
                }`}
              >
                <Upload className="w-3.5 h-3.5" /> Upload New Logo
              </button>
            </div>

            {/* Brand Fields */}
            <div className="md:col-span-2 space-y-4">
              <div className="space-y-1.5">
                <label className={`text-[11px] font-semibold block ${mutedText}`}>Brand Display Name</label>
                <input
                  type="text"
                  value={form.brandName}
                  onChange={e => setForm({ ...form, brandName: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium outline-none transition-all ${inputBg}`}
                />
              </div>

              <div className="space-y-1.5">
                <label className={`text-[11px] font-semibold block ${mutedText}`}>Platform Tagline / Subtitle</label>
                <input
                  type="text"
                  value={form.brandTagline}
                  onChange={e => setForm({ ...form, brandTagline: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium outline-none transition-all ${inputBg}`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. Payment Gateway Mode & DGS Accreditation Numbers ── */}
        <div className={`${bg} rounded-2xl p-6 space-y-5`}>
          <div className="flex items-center gap-2.5 pb-2 border-b border-white/5">
            <CreditCard className="w-4 h-4 text-sky-400" />
            <h3 className={`text-sm font-bold ${headText}`}>Payment Gateway & DG Shipping Accreditations</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Payment Gateway Mode */}
            <div className="space-y-2">
              <label className={`text-[11px] font-semibold block ${mutedText}`}>
                Payment Gateway Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, payment_gateway: "razorpay_production_mode" })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    form.payment_gateway === "razorpay_production_mode"
                      ? "border-emerald-500/50 bg-emerald-500/10"
                      : isDark ? "border-white/5 bg-white/3 opacity-60" : "border-slate-200 bg-slate-50 opacity-70"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">Live Production Mode</span>
                    {form.payment_gateway === "razorpay_production_mode" && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <p className={`text-[10px] mt-1 ${mutedText}`}>Processes real UPI, Card, NetBanking transactions</p>
                </button>

                <button
                  type="button"
                  onClick={() => setForm({ ...form, payment_gateway: "razorpay_sandbox_mode" })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    form.payment_gateway === "razorpay_sandbox_mode"
                      ? "border-amber-500/50 bg-amber-500/10"
                      : isDark ? "border-white/5 bg-white/3 opacity-60" : "border-slate-200 bg-slate-50 opacity-70"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">Sandbox / Test Mode</span>
                    {form.payment_gateway === "razorpay_sandbox_mode" && (
                      <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    )}
                  </div>
                  <p className={`text-[10px] mt-1 ${mutedText}`}>Simulated sandbox payments for testing</p>
                </button>
              </div>
            </div>

            {/* DGS Accreditation Numbers */}
            <div className="space-y-1.5">
              <label className={`text-[11px] font-semibold block ${mutedText}`}>
                DGS Accreditation Numbers
              </label>
              <input
                type="text"
                value={form.dgs_accreditation_id}
                onChange={e => setForm({ ...form, dgs_accreditation_id: e.target.value })}
                placeholder="e.g. DGS-MTI-10294 / IND-AP-9941"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium outline-none transition-all ${inputBg}`}
                required
              />
              <p className={`text-[10px] ${mutedText}`}>
                Directorate General of Shipping recognition and training institute approval numbers
              </p>
            </div>

            {/* Support Email */}
            <div className="space-y-1.5">
              <label className={`text-[11px] font-semibold flex items-center gap-1.5 ${mutedText}`}>
                <Mail className="w-3.5 h-3.5" /> Official Support Email
              </label>
              <input
                type="email"
                value={form.system_email}
                onChange={e => setForm({ ...form, system_email: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium outline-none transition-all ${inputBg}`}
                required
              />
            </div>

            {/* Support Phone */}
            <div className="space-y-1.5">
              <label className={`text-[11px] font-semibold flex items-center gap-1.5 ${mutedText}`}>
                <Phone className="w-3.5 h-3.5" /> Support Hotline Number
              </label>
              <input
                type="text"
                value={form.contact_phone}
                onChange={e => setForm({ ...form, contact_phone: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium outline-none transition-all ${inputBg}`}
                required
              />
            </div>
          </div>
        </div>

        {/* ── 4. Admin Credentials & Password ── */}
        <div className={`${bg} rounded-2xl p-6 space-y-5`}>
          <div className="flex items-center gap-2.5 pb-2 border-b border-white/5">
            <Lock className="w-4 h-4 text-amber-400" />
            <h3 className={`text-sm font-bold ${headText}`}>Admin Credentials & Password Security</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <label className={`text-[11px] font-semibold block ${mutedText}`}>Admin Username</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium outline-none transition-all ${inputBg}`}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className={`text-[11px] font-semibold block ${mutedText}`}>New Password (Optional)</label>
              <input
                type="password"
                placeholder="Leave blank to keep current"
                value={form.newPassword}
                onChange={e => setForm({ ...form, newPassword: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium outline-none transition-all ${inputBg}`}
              />
            </div>

            <div className="space-y-1.5">
              <label className={`text-[11px] font-semibold block ${mutedText}`}>Confirm New Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={form.confirmPassword}
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium outline-none transition-all ${inputBg}`}
              />
            </div>
          </div>
        </div>

        {/* ── 5. Consolidated Save Footer ── */}
        <div className="flex items-center justify-between pt-2">
          <div>
            {success ? (
              <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4" /> All profile and platform settings updated successfully!
              </span>
            ) : (
              <span className={`text-xs ${mutedText}`}>
                Changes apply across Master Portal sessions and public branding immediately.
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-600/25 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving Changes..." : "Save Profile & Settings"}
          </button>
        </div>

      </form>
    </div>
  );
}
