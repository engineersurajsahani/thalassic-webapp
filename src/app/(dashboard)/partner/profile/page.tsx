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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess("");
    setError("");

    try {
      await partnerService.updateProfile(profile);
      setSuccess("Agency details successfully updated!");
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (passwords.newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    setSaving(true);
    try {
      await partnerService.updatePassword({
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      });
      setSuccess("Account password updated successfully!");
      setPasswords({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to change password.");
    } finally {
      setSaving(false);
    }
  };

  const cardBg = isDark
    ? "bg-[#0B0F19] rounded-[16px] border-0 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
    : "bg-[#FFFFFF] rounded-[16px] border-0 shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]";

  const headingText = isDark ? "text-white font-extrabold" : "text-[#111827] font-extrabold";
  const subText = isDark ? "text-gray-400 font-medium" : "text-[#6B7280] font-medium";
  const labelText = isDark ? "text-gray-300 font-bold" : "text-[#111827] font-bold";
  const inputStyle = isDark
    ? "bg-[#111827] border border-[#1F2937] text-white placeholder-gray-500 focus:border-[#3D5EF6]"
    : "bg-[#FAFAFA] border border-[#E5E7EB] text-[#111827] placeholder-[#9CA3AF] focus:border-[#3D5EF6] shadow-sm";

  if (loading) {
    return <div className="p-8 text-center text-gray-400 animate-pulse">Loading profile settings...</div>;
  }

  const agencyDisplayName = profile.agencyName || (user as any)?.agencyName || "Alpha Shipping Agency";
  const initial = agencyDisplayName ? agencyDisplayName.charAt(0).toUpperCase() : "A";

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
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
        <div className="p-4 rounded-[16px] flex items-center gap-3 text-xs font-bold bg-[#DCFCE7] text-[#16A34A] dark:bg-emerald-500/15 dark:text-emerald-400">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-[16px] flex items-center gap-3 text-xs font-bold bg-[#FEE2E2] text-[#DC2626] dark:bg-red-500/15 dark:text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Hero Agency Avatar Banner */}
      <div className={`p-6 ${cardBg}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-16 h-16 rounded-[16px] bg-[#3D5EF6] text-white flex items-center justify-center text-2xl font-black uppercase shrink-0 shadow-sm">
            {initial}
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className={`text-xl font-extrabold ${headingText}`}>{agencyDisplayName}</h2>
              <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-lg bg-[#DCFCE7] text-[#16A34A] dark:bg-emerald-500/15 dark:text-emerald-400">
                VERIFIED PARTNER AGENCY
              </span>
            </div>
            <p className={`text-xs ${subText}`}>
              Authorized DG Shipping Academy Partner & Manning Representative
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-1">
              <span className="flex items-center gap-1.5 text-[#3D5EF6]">
                <Mail className="w-3.5 h-3.5" /> {profile.email}
              </span>
              {profile.phone && (
                <span className="flex items-center gap-1.5 text-[#6B7280] dark:text-gray-300">
                  <Phone className="w-3.5 h-3.5" /> {profile.phone}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Agency & Contact Form (2 cols) */}
        <div className={`lg:col-span-2 p-6 md:p-8 space-y-6 ${cardBg}`}>
          <div className={`border-b pb-4 ${isDark ? "border-[#1F2937]" : "border-[#E5E7EB]"}`}>
            <h2 className={`text-base font-extrabold flex items-center gap-2 ${headingText}`}>
              <Building className="w-4 h-4 text-[#3D5EF6]" />
              Agency Organization & Address
            </h2>
            <p className={`text-xs mt-0.5 ${subText}`}>
              Primary company details reflected on student purchase enrollments
            </p>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block mb-1.5 ${labelText}`}>Agency / Company Name *</label>
                <input
                  type="text"
                  required
                  value={profile.agencyName || ""}
                  onChange={(e) => setProfile({ ...profile, agencyName: e.target.value })}
                  placeholder="e.g. Apex Marine Crewing Ltd"
                  className={`w-full px-3.5 py-2.5 rounded-xl font-medium outline-none ${inputStyle}`}
                />
              </div>

              <div>
                <label className={`block mb-1.5 ${labelText}`}>Contact Person Name *</label>
                <input
                  type="text"
                  required
                  value={profile.name || ""}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="e.g. Captain Ramesh Sharma"
                  className={`w-full px-3.5 py-2.5 rounded-xl font-medium outline-none ${inputStyle}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block mb-1.5 ${labelText}`}>Official Email Address (Login)</label>
                <input
                  type="email"
                  disabled
                  value={profile.email || ""}
                  className={`w-full px-3.5 py-2.5 rounded-xl font-medium outline-none opacity-60 cursor-not-allowed ${inputStyle}`}
                />
                <span className={`text-[10px] block mt-1 ${subText}`}>Managed by Thalassic Master Ops</span>
              </div>

              <div>
                <label className={`block mb-1.5 ${labelText}`}>Contact Mobile Phone</label>
                <input
                  type="tel"
                  value={profile.phone || ""}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className={`w-full px-3.5 py-2.5 rounded-xl font-medium outline-none ${inputStyle}`}
                />
              </div>
            </div>

            <div className={`border-t pt-4 ${isDark ? "border-[#1F2937]" : "border-[#E5E7EB]"}`}>
              <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5 ${headingText}`}>
                <MapPin className="w-3.5 h-3.5 text-[#3D5EF6]" /> Physical Office Location
              </h3>

              <div className="space-y-3">
                <div>
                  <label className={`block mb-1.5 ${labelText}`}>Street Address</label>
                  <input
                    type="text"
                    value={profile.address || ""}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    placeholder="Suite 402, Maritime Chambers, Ballard Estate"
                    className={`w-full px-3.5 py-2.5 rounded-xl font-medium outline-none ${inputStyle}`}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={`block mb-1.5 ${labelText}`}>City</label>
                    <input
                      type="text"
                      value={profile.city || ""}
                      onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                      placeholder="Mumbai"
                      className={`w-full px-3.5 py-2.5 rounded-xl font-medium outline-none ${inputStyle}`}
                    />
                  </div>

                  <div>
                    <label className={`block mb-1.5 ${labelText}`}>State</label>
                    <input
                      type="text"
                      value={profile.state || ""}
                      onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                      placeholder="Maharashtra"
                      className={`w-full px-3.5 py-2.5 rounded-xl font-medium outline-none ${inputStyle}`}
                    />
                  </div>

                  <div>
                    <label className={`block mb-1.5 ${labelText}`}>PIN Code</label>
                    <input
                      type="text"
                      value={profile.pinCode || ""}
                      onChange={(e) => setProfile({ ...profile, pinCode: e.target.value })}
                      placeholder="400001"
                      className={`w-full px-3.5 py-2.5 rounded-xl font-medium outline-none ${inputStyle}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={`flex justify-end pt-3 border-t ${isDark ? "border-[#1F2937]" : "border-[#E5E7EB]"}`}>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-lg text-xs font-bold bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving Changes..." : "Save Agency Details"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Security & Password Reset */}
        <div className={`p-6 md:p-8 space-y-6 ${cardBg}`}>
          <div className={`border-b pb-4 ${isDark ? "border-[#1F2937]" : "border-[#E5E7EB]"}`}>
            <h2 className={`text-base font-extrabold flex items-center gap-2 ${headingText}`}>
              <Lock className="w-4 h-4 text-[#3D5EF6]" />
              Security & Credentials
            </h2>
            <p className={`text-xs mt-0.5 ${subText}`}>
              Update your account password
            </p>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs">
            <div>
              <label className={`block mb-1.5 ${labelText}`}>Current Password *</label>
              <input
                type="password"
                required
                value={passwords.oldPassword}
                onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                placeholder="••••••••"
                className={`w-full px-3.5 py-2.5 rounded-xl font-medium outline-none ${inputStyle}`}
              />
            </div>

            <div>
              <label className={`block mb-1.5 ${labelText}`}>New Password *</label>
              <input
                type="password"
                required
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                placeholder="At least 6 characters..."
                className={`w-full px-3.5 py-2.5 rounded-xl font-medium outline-none ${inputStyle}`}
              />
            </div>

            <div>
              <label className={`block mb-1.5 ${labelText}`}>Confirm New Password *</label>
              <input
                type="password"
                required
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                placeholder="Re-type new password..."
                className={`w-full px-3.5 py-2.5 rounded-xl font-medium outline-none ${inputStyle}`}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 rounded-lg text-xs font-bold bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white shadow-sm transition-colors cursor-pointer"
            >
              {saving ? "Updating..." : "Update Security Password"}
            </button>
          </form>

          {/* Compliance & Security Policy Callout */}
          <div className={`p-4 rounded-[16px] text-xs space-y-1.5 ${isDark ? "bg-white/[0.02]" : "bg-[#FAFAFA]"}`}>
            <p className="font-bold flex items-center gap-1 text-[#3D5EF6]">
              <ShieldCheck className="w-4 h-4" /> Partner Compliance Notice
            </p>
            <p className={`text-[11px] leading-relaxed ${subText}`}>
              Partner login access is audited for security compliance. Do not share your login credentials outside authorized corporate officers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
