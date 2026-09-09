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
  ShieldCheck,
} from "lucide-react";

export default function PartnerProfilePage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted ? theme === "dark" : true;

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
    ? "bg-[#09162c]/90 border-white/10 shadow-xl"
    : "bg-white border-slate-200 shadow-md";

  const headingText = isDark ? "text-white font-extrabold" : "text-slate-900 font-extrabold";
  const subText = isDark ? "text-slate-300 font-medium" : "text-slate-600 font-medium";
  const labelText = isDark ? "text-slate-200 font-bold" : "text-slate-800 font-bold";
  const accentText = isDark ? "text-cyan-300 font-extrabold" : "text-blue-700 font-extrabold";
  const inputStyle = isDark
    ? "bg-[#080F1E] border border-white/15 text-white placeholder-slate-500 focus:border-cyan-400"
    : "bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-600 shadow-sm";

  if (loading) {
    return <div className="p-8 text-center text-slate-400 animate-pulse">Loading profile settings...</div>;
  }

  const agencyDisplayName = profile.agencyName || (user as any)?.agencyName || "Alpha Shipping Agency";
  const contactName = profile.name || user?.name || "Authorized Contact";
  const initial = agencyDisplayName ? agencyDisplayName.charAt(0).toUpperCase() : "A";

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Top Header */}
      <div>
        <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${headingText}`}>
          Account & Agency Settings
        </h1>
        <p className={`text-xs md:text-sm mt-1 ${subText}`}>
          Manage your Partner company details, operating contact info, and login security credentials.
        </p>
      </div>

      {success && (
        <div className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-bold ${
          isDark ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300" : "bg-emerald-50 border-emerald-300 text-emerald-900"
        }`}>
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-bold ${
          isDark ? "bg-rose-500/15 border-rose-500/30 text-rose-300" : "bg-rose-50 border-rose-300 text-rose-900"
        }`}>
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Hero Agency Avatar Banner */}
      <div className={`p-6 rounded-3xl border ${cardBg}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center text-2xl font-black uppercase shrink-0 shadow-lg shadow-blue-500/25">
            {initial}
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className={`text-xl font-extrabold ${headingText}`}>{agencyDisplayName}</h2>
              <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                isDark ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-emerald-100 text-emerald-900 border border-emerald-300"
              }`}>
                VERIFIED PARTNER AGENCY
              </span>
            </div>
            <p className={`text-xs font-semibold ${subText}`}>
              Authorized Person: <span className={headingText}>{contactName}</span>
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium pt-1">
              <span className={`flex items-center gap-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                <Mail className={`w-3.5 h-3.5 ${isDark ? "text-cyan-400" : "text-blue-600"}`} /> {profile.email}
              </span>
              {profile.phone && (
                <span className={`flex items-center gap-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  <Phone className={`w-3.5 h-3.5 ${isDark ? "text-cyan-400" : "text-blue-600"}`} /> {profile.phone}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Panel: Security & Compliance Summary Card (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className={`p-6 rounded-3xl border space-y-5 sticky top-6 ${cardBg}`}>
            <h3 className={`text-xs font-black uppercase tracking-wider pb-3 border-b flex items-center gap-2 ${
              isDark ? "text-cyan-400 border-white/10" : "text-blue-700 border-slate-200"
            }`}>
              <ShieldCheck className="w-4 h-4" /> Account Health & Status
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className={`p-3.5 rounded-2xl border ${isDark ? "bg-white/[0.03] border-white/10" : "bg-slate-50 border-slate-200"}`}>
                <span className={`text-[10px] uppercase font-bold block ${subText}`}>Portal Account Status</span>
                <div className="flex items-center justify-between mt-1">
                  <span className={`font-bold ${headingText}`}>Active Partner</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              </div>

              <div className={`p-3.5 rounded-2xl border ${isDark ? "bg-white/[0.03] border-white/10" : "bg-slate-50 border-slate-200"}`}>
                <span className={`text-[10px] uppercase font-bold block ${subText}`}>Channel Compliance</span>
                <p className={`font-bold mt-0.5 ${accentText}`}>DG Shipping Compliant</p>
                <p className={`text-[10px] mt-1 ${subText}`}>Verified direct candidate collection & automated settlement ledger</p>
              </div>

              <div className={`p-3.5 rounded-2xl border ${isDark ? "bg-white/[0.03] border-white/10" : "bg-slate-50 border-slate-200"}`}>
                <span className={`text-[10px] uppercase font-bold block ${subText}`}>Security Seal</span>
                <p className={`font-semibold mt-0.5 ${isDark ? "text-slate-200" : "text-slate-800"}`}>SSL Encrypted Partner Session</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Editable Settings Forms (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Agency Details Form */}
          <form onSubmit={handleProfileSave} className={`p-6 md:p-8 rounded-3xl border space-y-5 ${cardBg}`}>
            <h2 className={`text-xs font-black uppercase tracking-wider pb-3 border-b flex items-center gap-2 ${
              isDark ? "text-cyan-400 border-white/10" : "text-blue-700 border-slate-200"
            }`}>
              <Building className="w-4 h-4" /> Partner Agency Profile
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs mb-1.5 ${labelText}`}>
                  Authorized Contact Person Name
                </label>
                <div className="relative">
                  <User className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                  <input
                    type="text"
                    value={profile.name || ""}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs font-bold outline-none transition-all ${inputStyle}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs mb-1.5 ${labelText}`}>
                  Account Email (Read-Only)
                </label>
                <div className="relative">
                  <Mail className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                  <input
                    type="email"
                    disabled
                    value={profile.email || ""}
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs font-bold outline-none cursor-not-allowed ${
                      isDark ? "bg-white/5 border border-white/10 text-slate-400" : "bg-slate-100 border border-slate-300 text-slate-700 font-semibold"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs mb-1.5 ${labelText}`}>
                  Agency Name
                </label>
                <div className="relative">
                  <Building className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                  <input
                    type="text"
                    value={profile.agencyName || ""}
                    onChange={(e) => setProfile({ ...profile, agencyName: e.target.value })}
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs font-bold outline-none transition-all ${inputStyle}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs mb-1.5 ${labelText}`}>
                  Contact Phone
                </label>
                <div className="relative">
                  <Phone className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                  <input
                    type="tel"
                    value={profile.phone || ""}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs font-bold outline-none transition-all ${inputStyle}`}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className={`block text-xs mb-1.5 ${labelText}`}>
                  Operating Office Address
                </label>
                <div className="relative">
                  <MapPin className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                  <input
                    type="text"
                    value={profile.address || ""}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs font-semibold outline-none transition-all ${inputStyle}`}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-xl text-xs font-black bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving Changes..." : "Save Agency Profile"}
              </button>
            </div>
          </form>

          {/* Security & Change Password Form */}
          <form onSubmit={handlePasswordChange} className={`p-6 md:p-8 rounded-3xl border space-y-5 ${cardBg}`}>
            <h2 className={`text-xs font-black uppercase tracking-wider pb-3 border-b flex items-center gap-2 ${
              isDark ? "text-cyan-400 border-white/10" : "text-blue-700 border-slate-200"
            }`}>
              <Lock className="w-4 h-4" /> Security & Password Credentials
            </h2>

            <div className="space-y-4">
              <div>
                <label className={`block text-xs mb-1.5 ${labelText}`}>Current Password</label>
                <input
                  type="password"
                  required
                  value={passwords.oldPassword}
                  onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold outline-none transition-all ${inputStyle}`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs mb-1.5 ${labelText}`}>New Password</label>
                  <input
                    type="password"
                    required
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold outline-none transition-all ${inputStyle}`}
                  />
                </div>

                <div>
                  <label className={`block text-xs mb-1.5 ${labelText}`}>Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold outline-none transition-all ${inputStyle}`}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className={`px-6 py-3 rounded-xl text-xs font-black transition-all border cursor-pointer ${
                  isDark ? "bg-white/10 hover:bg-white/20 text-white border-white/15" : "bg-slate-800 hover:bg-slate-900 text-white border-slate-800 shadow-md"
                }`}
              >
                Update Security Credentials
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
