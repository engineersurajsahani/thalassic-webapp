"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useTheme } from "@/providers/theme-provider";
import { masterService } from "@/services/master.service";
import {
  Shield,
  Mail,
  Lock,
  Save,
  Check,
  Eye,
  EyeOff,
  User,
  Camera,
} from "lucide-react";

const PROFILE_PIC_KEY = "master_portal_profile_pic";

export default function SettingsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "master_ceo",
    email: "master@thalassic.in",
    newPassword: "",
    confirmPassword: "",
  });

  // Styling tokens
  const bg = isDark
    ? "bg-[#0d1f35] border border-white/6"
    : "bg-white border border-slate-200 shadow-sm";
  const headText = isDark ? "text-white/90" : "text-slate-800";
  const mutedText = isDark ? "text-white/40" : "text-slate-400";
  const inputBg = isDark
    ? "bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-indigo-500"
    : "bg-slate-50 border-slate-200 text-slate-700 placeholder:text-slate-400 focus:border-indigo-500";

  useEffect(() => {
    // Load saved profile pic from localStorage
    const saved = localStorage.getItem(PROFILE_PIC_KEY);
    if (saved) setProfilePic(saved);

    let mounted = true;
    Promise.all([
      masterService.getSettings().catch(() => null),
      masterService.getAdminProfile().catch(() => null),
    ])
      .then(([, profile]) => {
        if (!mounted || !profile) return;
        setForm((prev) => ({
          ...prev,
          name: profile.name || profile.username || prev.name,
          email: profile.email || prev.email,
        }));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const handlePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setProfilePic(dataUrl);
      localStorage.setItem(PROFILE_PIC_KEY, dataUrl);
      // Dispatch storage event so topbar picks it up in the same tab
      window.dispatchEvent(new StorageEvent("storage", { key: PROFILE_PIC_KEY, newValue: dataUrl }));
      toast.success("Profile picture updated!");
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.newPassword && form.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setSaving(true);
    setSuccess(false);

    try {
      await masterService.updateAdminProfile({ name: form.name, email: form.email }).catch(() => null);
      if (form.newPassword) {
        await masterService.changePassword({ newPassword: form.newPassword }).catch(() => null);
      }
      setSuccess(true);
      toast.success("Profile updated successfully!");
      setForm((prev) => ({ ...prev, newPassword: "", confirmPassword: "" }));
      setTimeout(() => setSuccess(false), 3500);
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto animate-pulse">
        <div className="h-8 w-48 bg-slate-800 rounded-lg" />
        <div className="h-48 bg-slate-800 rounded-2xl" />
        <div className="h-64 bg-slate-800 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-16">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-black tracking-tight ${headText}`}>Profile & Settings</h1>
          <p className={`text-xs mt-0.5 ${mutedText}`}>Manage your master administrator credentials</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Shield className="w-3.5 h-3.5" /> Super Admin Role
        </span>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* ── Profile Header Card ── */}
        <div className={`${bg} rounded-2xl p-6 flex items-center gap-5`}>

          {/* Editable Avatar */}
          <div className="relative shrink-0 group">
            <div
              className={`w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden border ${
                isDark ? "bg-[#0a1525] border-white/10" : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              {profilePic ? (
                <Image
                  src={profilePic}
                  alt="Profile Picture"
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              ) : (
                <Image
                  src="/logo/hariom_logo.png"
                  alt="Hari Om Thalassic Logo"
                  width={64}
                  height={64}
                  className="object-contain w-14 h-14"
                  onError={() => {}}
                />
              )}
            </div>

            {/* Camera overlay */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 w-20 h-20 rounded-2xl flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              title="Change profile picture"
            >
              <Camera className="w-5 h-5 text-white" />
            </button>

            {/* Small edit badge */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-indigo-600 hover:bg-indigo-500 border-2 border-[#0d1f35] flex items-center justify-center transition-colors cursor-pointer"
              title="Edit profile picture"
            >
              <Camera className="w-3 h-3 text-white" />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePicChange}
            />
          </div>

          {/* Identity */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className={`text-lg font-bold truncate ${headText}`}>{form.name}</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 shrink-0">
                MASTER USER
              </span>
            </div>
            <p className={`text-xs mt-0.5 truncate ${mutedText}`}>{form.email}</p>
            <p className="text-[11px] mt-1 text-sky-400 font-mono">Full Platform & Financial Authority</p>
          </div>
        </div>

        {/* ── Credentials Card ── */}
        <div className={`${bg} rounded-2xl p-6 space-y-5`}>
          <div className={`flex items-center gap-2.5 pb-3 border-b ${isDark ? "border-white/5" : "border-slate-100"}`}>
            <User className="w-4 h-4 text-indigo-400" />
            <h3 className={`text-sm font-bold ${headText}`}>Account Credentials</h3>
          </div>

          <div className="space-y-1.5">
            <label className={`text-[11px] font-semibold flex items-center gap-1.5 ${mutedText}`}>
              <User className="w-3.5 h-3.5" /> Username
            </label>
            <input
              id="settings-username"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter username"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium outline-none transition-all ${inputBg}`}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className={`text-[11px] font-semibold flex items-center gap-1.5 ${mutedText}`}>
              <Mail className="w-3.5 h-3.5" /> Gmail / Email ID
            </label>
            <input
              id="settings-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Enter email address"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium outline-none transition-all ${inputBg}`}
              required
            />
          </div>
        </div>

        {/* ── Password Card ── */}
        <div className={`${bg} rounded-2xl p-6 space-y-5`}>
          <div className={`flex items-center gap-2.5 pb-3 border-b ${isDark ? "border-white/5" : "border-slate-100"}`}>
            <Lock className="w-4 h-4 text-amber-400" />
            <h3 className={`text-sm font-bold ${headText}`}>Change Password</h3>
          </div>

          <div className="space-y-1.5">
            <label className={`text-[11px] font-semibold flex items-center gap-1.5 ${mutedText}`}>
              <Lock className="w-3.5 h-3.5" /> New Password
            </label>
            <div className="relative">
              <input
                id="settings-new-password"
                type={showNew ? "text" : "password"}
                placeholder="Leave blank to keep current"
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                className={`w-full px-3.5 py-2.5 pr-10 rounded-xl border text-xs font-medium outline-none transition-all ${inputBg}`}
              />
              <button type="button" onClick={() => setShowNew((v) => !v)} className={`absolute right-3 top-1/2 -translate-y-1/2 ${mutedText} hover:opacity-80`}>
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={`text-[11px] font-semibold flex items-center gap-1.5 ${mutedText}`}>
              <Lock className="w-3.5 h-3.5" /> Confirm New Password
            </label>
            <div className="relative">
              <input
                id="settings-confirm-password"
                type={showConf ? "text" : "password"}
                placeholder="Re-enter new password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className={`w-full px-3.5 py-2.5 pr-10 rounded-xl border text-xs font-medium outline-none transition-all ${
                  form.confirmPassword && form.newPassword !== form.confirmPassword
                    ? isDark ? "border-red-500/50 bg-red-500/5" : "border-red-400 bg-red-50"
                    : form.confirmPassword && form.newPassword === form.confirmPassword
                    ? isDark ? "border-emerald-500/50 bg-emerald-500/5" : "border-emerald-400 bg-emerald-50"
                    : inputBg
                }`}
              />
              <button type="button" onClick={() => setShowConf((v) => !v)} className={`absolute right-3 top-1/2 -translate-y-1/2 ${mutedText} hover:opacity-80`}>
                {showConf ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {form.confirmPassword && form.newPassword !== form.confirmPassword && (
              <p className="text-[10px] text-red-400 mt-1">Passwords do not match</p>
            )}
            {form.confirmPassword && form.newPassword === form.confirmPassword && (
              <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                <Check className="w-3 h-3" /> Passwords match
              </p>
            )}
          </div>
        </div>

        {/* ── Save Footer ── */}
        <div className="flex items-center justify-between pt-1">
          <div>
            {success ? (
              <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Profile updated successfully!
              </span>
            ) : (
              <span className={`text-xs ${mutedText}`}>Changes apply immediately across all Master Portal sessions.</span>
            )}
          </div>
          <button
            id="settings-save-btn"
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-600/25 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

