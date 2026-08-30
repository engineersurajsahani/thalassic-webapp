"use client";

import React, { useEffect, useState } from "react";
import { partnerService } from "@/services/partner.service";
import { useTheme } from "@/providers/theme-provider";
import { useAuth } from "@/providers/auth-provider";
import {
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Lock,
  CheckCircle2,
  AlertCircle,
  Save,
} from "lucide-react";

export default function PartnerProfilePage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === "dark";

  const [profile, setProfile] = useState<any>({
    name: "",
    email: "",
    phone: "",
    agencyName: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await partnerService.getProfile();
        setProfile(data);
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess("");
    setError("");

    try {
      await partnerService.updateProfile(profile);
      setSuccess("Partner profile updated successfully.");
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    setSaving(true);
    setSuccess("");
    setError("");

    try {
      await partnerService.changePassword({
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      });
      setSuccess("Password changed successfully.");
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to change password.");
    } finally {
      setSaving(false);
    }
  };

  const cardBg = isDark
    ? "bg-[#09162c]/80 border-white/5 shadow-sm"
    : "bg-white border-slate-200/80 shadow-sm";

  if (loading) {
    return <div className="p-8 text-center text-slate-400 animate-pulse">Loading profile settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      <div>
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full ${
              isDark ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "bg-blue-50 text-blue-600 border border-blue-200"
            }`}
          >
            Partner Credentials
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1.5">
          Account & Agency Settings
        </h1>
        <p className={`text-xs md:text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Manage your Partner company details, operating contact info, and login security credentials.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-3 text-xs">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center gap-3 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Agency Details Form */}
      <form onSubmit={handleProfileSave} className={`p-6 md:p-8 rounded-3xl border space-y-5 ${cardBg}`}>
        <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 pb-2 border-b border-white/5 flex items-center gap-2">
          <Building className="w-4 h-4" /> Partner Agency Profile
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Authorized Contact Person Name
            </label>
            <input
              type="text"
              value={profile.name || ""}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium outline-none transition-all ${
                isDark ? "bg-white/5 border border-white/10 text-white focus:border-cyan-500/50" : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-500"
              }`}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Account Email (Read-Only)
            </label>
            <input
              type="email"
              disabled
              value={profile.email || ""}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium outline-none opacity-60 cursor-not-allowed ${
                isDark ? "bg-white/5 border border-white/10 text-slate-400" : "bg-slate-100 border border-slate-200 text-slate-500"
              }`}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Agency Name
            </label>
            <input
              type="text"
              value={profile.agencyName || ""}
              onChange={(e) => setProfile({ ...profile, agencyName: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium outline-none transition-all ${
                isDark ? "bg-white/5 border border-white/10 text-white focus:border-cyan-500/50" : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-500"
              }`}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Contact Phone
            </label>
            <input
              type="tel"
              value={profile.phone || ""}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium outline-none transition-all ${
                isDark ? "bg-white/5 border border-white/10 text-white focus:border-cyan-500/50" : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-500"
              }`}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Operating Office Address
            </label>
            <input
              type="text"
              value={profile.address || ""}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium outline-none transition-all ${
                isDark ? "bg-white/5 border border-white/10 text-white focus:border-cyan-500/50" : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-500"
              }`}
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Agency Profile"}
          </button>
        </div>
      </form>

      {/* Change Password Form */}
      <form onSubmit={handlePasswordChange} className={`p-6 md:p-8 rounded-3xl border space-y-4 ${cardBg}`}>
        <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 pb-2 border-b border-white/5 flex items-center gap-2">
          <Lock className="w-4 h-4" /> Security & Password
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Current Password</label>
            <input
              type="password"
              required
              value={passwords.oldPassword}
              onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium outline-none transition-all ${
                isDark ? "bg-white/5 border border-white/10 text-white focus:border-cyan-500/50" : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-500"
              }`}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">New Password</label>
            <input
              type="password"
              required
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium outline-none transition-all ${
                isDark ? "bg-white/5 border border-white/10 text-white focus:border-cyan-500/50" : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-500"
              }`}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium outline-none transition-all ${
                isDark ? "bg-white/5 border border-white/10 text-white focus:border-cyan-500/50" : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-500"
              }`}
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-white transition-all border border-white/10"
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
}
