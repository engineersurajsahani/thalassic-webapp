"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import { masterService } from "@/services/master.service";
import { Settings, Save, Mail, Globe, Phone, User, Lock, Shield, Check } from "lucide-react";

export default function SettingsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [activeTab, setActiveTab] = useState<"system" | "profile">("system");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // System Configuration fields
  const [systemForm, setSystemForm] = useState({
    system_email: "",
    contact_phone: "",
    payment_gateway: "razorpay_production_mode",
    dgs_accreditation_id: "",
  });

  // Admin Profile fields
  const [adminForm, setAdminForm] = useState({
    name: "",
    password: "",
    confirmPassword: "",
    role: "MASTER"
  });

  const bg = isDark ? "bg-[#0d1f35] border border-white/6" : "bg-white border border-slate-200 shadow-sm";
  const headText = isDark ? "text-white/80" : "text-slate-800";
  const mutedText = isDark ? "text-white/35" : "text-slate-400";
  const inputBg = isDark ? "bg-white/5 border-white/10 text-white/70 focus:border-indigo-500" : "bg-slate-50 border-slate-200 text-slate-700 focus:border-indigo-500";
  const labelColor = isDark ? "text-slate-400" : "text-slate-500";

  const fetchSettingsAndProfile = async () => {
    try {
      const settingsData = await masterService.getSettings();
      setSystemForm({
        system_email: settingsData.system_email ?? settingsData.supportEmail ?? "support@hariomthalassic.com",
        contact_phone: settingsData.contact_phone ?? "+91 22 12345678",
        payment_gateway: settingsData.payment_gateway ?? "razorpay_production_mode",
        dgs_accreditation_id: settingsData.dgs_accreditation_id ?? "DGS-MTI-10294",
      });

      const profileData = await masterService.getAdminProfile();
      setAdminForm({
        name: profileData.name ?? "master_ceo",
        password: "",
        confirmPassword: "",
        role: profileData.role ?? "Master / Complete Control"
      });
    } catch (err) {
      console.error("Failed to load settings data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettingsAndProfile();
  }, []);

  const handleSaveSystem = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await masterService.updateSettings(systemForm);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert("Failed to save system configuration");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminForm.password !== adminForm.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setSaving(true);
    setSuccess(false);
    try {
      await masterService.updateAdminProfile({
        name: adminForm.name,
        password: adminForm.password || undefined
      });
      setSuccess(true);
      setAdminForm(prev => ({ ...prev, password: "", confirmPassword: "" }));
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert("Failed to save profile updates");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-slate-800 rounded-lg" />
        <div className="h-64 bg-slate-800 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-black tracking-tight ${headText}`}>Platform Settings</h1>
        <p className={`text-xs mt-1 ${mutedText}`}>Configure administrative variables, profile credentials, and API connection credentials.</p>
      </div>

      {/* Tabs list */}
      <div className={`flex border-b ${isDark ? "border-slate-800" : "border-slate-200"}`}>
        <button
          onClick={() => setActiveTab("system")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 outline-none cursor-pointer ${
            activeTab === "system"
              ? "border-indigo-500 text-indigo-500"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Settings className="w-4 h-4" /> System Configuration
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 outline-none cursor-pointer ${
            activeTab === "profile"
              ? "border-indigo-500 text-indigo-500"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <User className="w-4 h-4" /> Admin Profile
        </button>
      </div>

      {/* Tab content cards */}
      <div className={`${bg} rounded-3xl p-6`}>
        {activeTab === "system" ? (
          <form onSubmit={handleSaveSystem} className="space-y-6">
            {/* Header Title */}
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-500" />
              <h3 className={`text-[11px] font-black uppercase tracking-wider ${headText}`}>General Platform Configuration</h3>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-slate-400">
                  <Mail className="w-3.5 h-3.5" /> Support Email ID
                </label>
                <input
                  type="email"
                  value={systemForm.system_email}
                  onChange={(e) => setSystemForm({ ...systemForm, system_email: e.target.value })}
                  className={`w-full px-3.5 py-3 rounded-xl border text-xs font-medium outline-none transition-all ${inputBg}`}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-slate-400">
                  <Phone className="w-3.5 h-3.5" /> Contact Helpline Number
                </label>
                <input
                  type="text"
                  value={systemForm.contact_phone}
                  onChange={(e) => setSystemForm({ ...systemForm, contact_phone: e.target.value })}
                  className={`w-full px-3.5 py-3 rounded-xl border text-xs font-medium outline-none transition-all ${inputBg}`}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-slate-400">
                  <Shield className="w-3.5 h-3.5" /> Payment Gateway Mode
                </label>
                <select
                  value={systemForm.payment_gateway}
                  onChange={(e) => setSystemForm({ ...systemForm, payment_gateway: e.target.value })}
                  className={`w-full px-3.5 py-3 rounded-xl border text-xs font-medium outline-none transition-all cursor-pointer ${inputBg}`}
                >
                  <option value="razorpay_production_mode">Razorpay (Live Mode)</option>
                  <option value="razorpay_sandbox_mode">Razorpay (Sandbox Mode)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-slate-400">
                  DGS Accreditation MTI Number
                </label>
                <input
                  type="text"
                  value={systemForm.dgs_accreditation_id}
                  onChange={(e) => setSystemForm({ ...systemForm, dgs_accreditation_id: e.target.value })}
                  className={`w-full px-3.5 py-3 rounded-xl border text-xs font-medium outline-none transition-all ${inputBg}`}
                  required
                />
              </div>
            </div>

            {/* Divider */}
            <div className={`border-b pt-2 ${isDark ? "border-slate-800" : "border-slate-100"}`} />

            {/* Footer row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {success ? (
                  <span className="text-emerald-500 flex items-center gap-1">
                    <Check className="w-4 h-4" /> Settings updated successfully!
                  </span>
                ) : (
                  <span>Please click Save Changes to publish edits.</span>
                )}
              </div>
              <button
                type="submit"
                disabled={saving}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all cursor-pointer ${
                  saving 
                    ? "bg-slate-600 text-slate-400 cursor-not-allowed" 
                    : "bg-indigo-600 hover:bg-indigo-500 text-white hover:-translate-y-0.5"
                }`}
              >
                <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Header Title */}
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-500" />
              <h3 className={`text-[11px] font-black uppercase tracking-wider ${headText}`}>Admin Credentials and Password</h3>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-slate-400">
                  Admin Username
                </label>
                <input
                  type="text"
                  value={adminForm.name}
                  onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                  className={`w-full px-3.5 py-3 rounded-xl border text-xs font-medium outline-none transition-all ${inputBg}`}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-slate-400">
                  Security Access Level
                </label>
                <input
                  type="text"
                  value={adminForm.role === "MASTER" ? "Master / Complete Control" : adminForm.role}
                  className={`w-full px-3.5 py-3 rounded-xl border text-xs font-medium outline-none transition-all cursor-not-allowed opacity-50 ${inputBg}`}
                  disabled
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-slate-400">
                  <Lock className="w-3.5 h-3.5" /> New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={adminForm.password}
                  onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                  className={`w-full px-3.5 py-3 rounded-xl border text-xs font-medium outline-none transition-all ${inputBg}`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-slate-400">
                  <Lock className="w-3.5 h-3.5" /> Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={adminForm.confirmPassword}
                  onChange={(e) => setAdminForm({ ...adminForm, confirmPassword: e.target.value })}
                  className={`w-full px-3.5 py-3 rounded-xl border text-xs font-medium outline-none transition-all ${inputBg}`}
                />
              </div>
            </div>

            {/* Divider */}
            <div className={`border-b pt-2 ${isDark ? "border-slate-800" : "border-slate-100"}`} />

            {/* Footer row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {success ? (
                  <span className="text-emerald-500 flex items-center gap-1">
                    <Check className="w-4 h-4" /> Profile saved successfully!
                  </span>
                ) : (
                  <span>Please click Save Changes to publish edits.</span>
                )}
              </div>
              <button
                type="submit"
                disabled={saving}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all cursor-pointer ${
                  saving 
                    ? "bg-slate-600 text-slate-400 cursor-not-allowed" 
                    : "bg-indigo-600 hover:bg-indigo-500 text-white hover:-translate-y-0.5"
                }`}
              >
                <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
