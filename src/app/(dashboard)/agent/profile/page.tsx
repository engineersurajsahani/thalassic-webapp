"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { agentService } from "@/services/agent.service";
import { useTheme } from "@/providers/theme-provider";
import {
  User, ShieldCheck, Key, CheckCircle2, AlertCircle, Save, Bell,
  Building2, MapPin, Camera, FileText, ArrowRight, Eye, EyeOff, Download, Clock
} from "lucide-react";

export default function AgentProfilePage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [formData, setFormData] = useState<any>({
    name: "",
    email: "",
    phone: "",
    alternatePhone: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    agencyName: "",
    officeAddress: "",
    agencyCity: "",
    agencyState: "",
    agencyPinCode: "",
    referralCode: "",
    onboardingStatus: ""
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [loading, setLoading] = useState(true);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [activeTab, setActiveTab] = useState<"personal" | "agency" | "documents">("personal");

  const loadData = async () => {
    try {
      const data = await agentService.getProfile();
      setFormData(data);
    } catch (err) {
      console.error("Failed to load profile details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess("");
    setProfileError("");
    try {
      await agentService.updateProfile(formData);
      setProfileSuccess("Profile updated successfully!");
      await loadData();
    } catch (err: any) {
      setProfileError(err.response?.data?.message || "Failed to update profile.");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess("");
    setPasswordError("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    try {
      await agentService.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordSuccess("Password updated successfully!");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || "Failed to update password.");
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "AG";
    return name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const inputClasses = `w-full px-4 py-2.5 text-xs rounded-xl border outline-none transition-colors ${
    isDark ? "bg-[#0b182d] border-slate-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
  }`;

  const disabledInputClasses = `w-full px-4 py-2.5 text-xs rounded-xl border outline-none cursor-not-allowed opacity-60 ${
    isDark ? "bg-slate-950 border-slate-800 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-500"
  }`;

  const labelClasses = `text-xs font-black uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`;

  const cardClasses = `rounded-3xl border p-6 md:p-8 shadow-xl ${
    isDark ? "bg-[#0a1122]/70 border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-white backdrop-blur-xl" : "bg-white/80 border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-slate-900 backdrop-blur-xl"
  }`;

  const tabActive = isDark ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/20" : "bg-blue-50 text-[#3b71cb] border-blue-200";
  const tabInactive = isDark ? "text-slate-400 hover:text-white hover:bg-white/5 border-transparent" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 border-transparent";

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className={`h-96 rounded-3xl ${isDark ? "bg-[#09162c]" : "bg-slate-100"}`} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn relative pb-10">

      {/* Header */}
      <div className="flex flex-col gap-1">
        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit ${
          isDark ? "bg-cyan-500/10 text-cyan-400" : "bg-blue-50 text-[#3b71cb]"
        }`}>
          <User className="w-3 h-3 inline mr-1 -mt-0.5" />
          Agent Profile
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight mt-1.5">
          My Profile
        </h1>
        <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          View and manage your personal information, agency details, and documents.
        </p>
      </div>

      {/* Profile Card with Photo + Tabs */}
      <div className={`${cardClasses} !p-0 overflow-hidden`}>

        {/* Profile Header with Photo */}
        <div className={`px-6 md:px-8 pt-6 md:pt-8 pb-4 border-b ${isDark ? "border-white/5" : "border-slate-200/60"}`}>
          <div className="flex items-center gap-5">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black shrink-0 ${
              isDark ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20" : "bg-blue-50 text-[#3b71cb] border border-blue-200"
            }`}>
              {getInitials(formData.name)}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-extrabold tracking-tight truncate">{formData.name || "Agent"}</h2>
              <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>{formData.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600"
                }`}>
                  {formData.onboardingStatus || "Active"}
                </span>
                {formData.referralCode && (
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isDark ? "bg-cyan-500/10 text-cyan-400" : "bg-cyan-50 text-cyan-600"
                  }`}>
                    {formData.referralCode}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={`px-6 md:px-8 pt-4 flex gap-2 overflow-x-auto`}>
          {[
            { key: "personal" as const, label: "Personal Info", icon: User },
            { key: "agency" as const, label: "Agency Info", icon: Building2 },
            { key: "documents" as const, label: "Documents", icon: FileText },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.key ? tabActive : tabInactive
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="px-6 md:px-8 py-6">

          {/* Success/Error Messages */}
          {profileSuccess && (
            <div className={`p-4 rounded-xl flex items-start gap-3 text-xs mb-6 ${isDark ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-emerald-50 border border-emerald-200 text-emerald-700"}`}>
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{profileSuccess}</span>
            </div>
          )}
          {profileError && (
            <div className={`p-4 rounded-xl flex items-start gap-3 text-xs mb-6 ${isDark ? "bg-red-500/10 border border-red-500/20 text-red-400" : "bg-red-50 border border-red-200 text-red-700"}`}>
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{profileError}</span>
            </div>
          )}

          {/* Personal Information Tab */}
          {activeTab === "personal" && (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div>
                <h3 className="text-sm font-black tracking-tight flex items-center gap-2 mb-4">
                  <User className={`w-4 h-4 ${isDark ? "text-cyan-400" : "text-blue-600"}`} />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className={labelClasses}>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      className={inputClasses}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={labelClasses}>Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className={disabledInputClasses}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={labelClasses}>Mobile Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Primary mobile number"
                      className={inputClasses}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={labelClasses}>Alternate Mobile Number</label>
                    <input
                      type="text"
                      name="alternatePhone"
                      value={formData.alternatePhone}
                      onChange={handleInputChange}
                      placeholder="Alternate mobile number"
                      className={inputClasses}
                    />
                  </div>
                </div>
              </div>

              {/* Permanent Address */}
              <div>
                <h3 className="text-sm font-black tracking-tight flex items-center gap-2 mb-4">
                  <MapPin className={`w-4 h-4 ${isDark ? "text-cyan-400" : "text-blue-600"}`} />
                  Permanent Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2 space-y-1.5">
                    <label className={labelClasses}>Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street address / locality"
                      rows={2}
                      className={inputClasses}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={labelClasses}>City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      className={inputClasses}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={labelClasses}>State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="State"
                      className={inputClasses}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={labelClasses}>PIN Code</label>
                    <input
                      type="text"
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={handleInputChange}
                      placeholder="PIN Code"
                      className={inputClasses}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  isDark ? "bg-cyan-600 hover:bg-cyan-500 text-white" : "bg-[#3b71cb] hover:bg-[#2c5fb3] text-white"
                }`}
              >
                <Save className="w-4 h-4" /> Save Personal Details
              </button>
            </form>
          )}

          {/* Agency Information Tab */}
          {activeTab === "agency" && (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div>
                <h3 className="text-sm font-black tracking-tight flex items-center gap-2 mb-4">
                  <Building2 className={`w-4 h-4 ${isDark ? "text-cyan-400" : "text-blue-600"}`} />
                  Agency Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className={labelClasses}>Agency Name</label>
                    <input
                      type="text"
                      name="agencyName"
                      value={formData.agencyName}
                      onChange={handleInputChange}
                      placeholder="Agency / Company name"
                      className={inputClasses}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={labelClasses}>Referral Code</label>
                    <input
                      type="text"
                      value={formData.referralCode}
                      disabled
                      className={`${disabledInputClasses} font-mono font-black`}
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1.5">
                    <label className={labelClasses}>Office Premises Address</label>
                    <textarea
                      name="officeAddress"
                      value={formData.officeAddress}
                      onChange={handleInputChange}
                      placeholder="Full office address"
                      rows={2}
                      className={inputClasses}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={labelClasses}>City</label>
                    <input
                      type="text"
                      name="agencyCity"
                      value={formData.agencyCity}
                      onChange={handleInputChange}
                      placeholder="Agency city"
                      className={inputClasses}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={labelClasses}>State</label>
                    <input
                      type="text"
                      name="agencyState"
                      value={formData.agencyState}
                      onChange={handleInputChange}
                      placeholder="Agency state"
                      className={inputClasses}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={labelClasses}>PIN Code</label>
                    <input
                      type="text"
                      name="agencyPinCode"
                      value={formData.agencyPinCode}
                      onChange={handleInputChange}
                      placeholder="Agency PIN code"
                      className={inputClasses}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  isDark ? "bg-cyan-600 hover:bg-cyan-500 text-white" : "bg-[#3b71cb] hover:bg-[#2c5fb3] text-white"
                }`}
              >
                <Save className="w-4 h-4" /> Save Agency Details
              </button>
            </form>
          )}

          {/* Documents Tab */}
          {activeTab === "documents" && (
            <DocumentsTabContent isDark={isDark} />
          )}
        </div>
      </div>

      {/* Bottom Row: Change Password */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className={`${cardClasses} lg:col-span-2`}>
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <h3 className={`text-lg font-black tracking-tight pb-4 flex items-center gap-2 ${isDark ? "border-b border-slate-800/40" : "border-b border-slate-200"}`}>
              <Key className={`w-5 h-5 ${isDark ? "text-cyan-400" : "text-blue-600"}`} />
              Change Password
            </h3>

            {passwordSuccess && (
              <div className={`p-4 rounded-xl flex items-start gap-3 text-xs animate-fadeIn ${isDark ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-emerald-50 border border-emerald-200 text-emerald-700"}`}>
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div className={`p-4 rounded-xl flex items-start gap-3 text-xs animate-fadeIn ${isDark ? "bg-red-500/10 border border-red-500/20 text-red-400" : "bg-red-50 border border-red-200 text-red-700"}`}>
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{passwordError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className={labelClasses}>Current Password</label>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    required
                    placeholder="Enter current password"
                    className={`${inputClasses} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors cursor-pointer ${isDark ? "hover:text-white" : "hover:text-slate-800"}`}
                  >
                    {showOldPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={labelClasses}>New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    placeholder="Enter new password"
                    className={`${inputClasses} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors cursor-pointer ${isDark ? "hover:text-white" : "hover:text-slate-800"}`}
                  >
                    {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={labelClasses}>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Confirm new password"
                  className={inputClasses}
                />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                isDark ? "bg-cyan-600 hover:bg-cyan-500 text-white" : "bg-[#3b71cb] hover:bg-[#2c5fb3] text-white"
              }`}
            >
              <Key className="w-4 h-4" /> Update Password
            </button>
          </form>
        </section>

        {/* Right Column: Stacked Credentials & Alerts */}
        <div className="lg:col-span-1 space-y-6 self-start">
          
          {/* Alert Preferences Card */}
          <section className={`rounded-3xl border p-6 md:p-8 shadow-xl ${
            isDark ? "bg-[#0a1122]/70 border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-white backdrop-blur-xl" : "bg-white/80 border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-slate-900 backdrop-blur-xl"
          }`}>
            <div className="flex items-center gap-2 border-b pb-4 mb-6 border-white/5">
              <Bell className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold">Alert Preferences</h3>
            </div>

            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-500" : "text-slate-400"}`}>Role</span>
              <span className="text-xs font-black">Manning Agent</span>
            </div>

          {/* Change Password Card */}
          <section className={`rounded-3xl border p-6 md:p-8 shadow-xl ${
            isDark ? "bg-[#0a1122]/70 border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-white backdrop-blur-xl" : "bg-white/80 border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-slate-900 backdrop-blur-xl"
          }`}>
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <h3 className="text-lg font-black tracking-tight border-b border-slate-800/40 pb-4 flex items-center gap-2">
                <Key className="w-5 h-5 text-cyan-400" />
                Change Password
              </h3>

              {passwordSuccess && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-start gap-3 text-xs animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              {passwordError && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-3 text-xs animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{passwordError}</span>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400">Current Password</label>
                  <input
                    type="password"
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    required
                    placeholder="••••••••"
                    className={`w-full px-4 py-2.5 text-xs rounded-xl border outline-none ${
                      isDark ? "bg-[#0b182d] border-slate-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-855 focus:border-[#3b71cb]"
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    placeholder="••••••••"
                    className={`w-full px-4 py-2.5 text-xs rounded-xl border outline-none ${
                      isDark ? "bg-[#0b182d] border-slate-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-855 focus:border-[#3b71cb]"
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    placeholder="••••••••"
                    className={`w-full px-4 py-2.5 text-xs rounded-xl border outline-none ${
                      isDark ? "bg-[#0b182d] border-slate-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-855 focus:border-[#3b71cb]"
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer mt-4 transition-all ${
                  isDark ? "bg-cyan-600 hover:bg-cyan-505 text-white animate-pulse" : "bg-[#3b71cb] hover:bg-[#2c5fb3] text-white"
                }`}
              >
                <Key className="w-4 h-4" /> Reset Password
              </button>
            </form>
          </section>

        </div>

            <div className={`pt-4 border-t ${isDark ? "border-white/5" : "border-slate-200/60"}`}>
              <p className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                Contact support if any of your details are incorrect or need urgent correction.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function DocumentsTabContent({ isDark }: { isDark: boolean }) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await agentService.getDocuments();
        setDocuments(data);
      } catch {
        console.error("Failed to load documents");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDownload = async (docId: string) => {
    setDownloadingId(docId);
    try {
      const result = await agentService.downloadDocument(docId);
      if (result?.signedUrl) {
        const link = document.createElement("a");
        link.href = result.signedUrl;
        link.download = result.fileName || "document";
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || "Download failed.");
    } finally {
      setDownloadingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "verified":
        return <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${isDark ? "text-emerald-400 bg-emerald-400/10" : "text-emerald-700 bg-emerald-50"}`}><CheckCircle2 className="w-3 h-3" /> Verified</span>;
      case "rejected":
        return <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${isDark ? "text-red-400 bg-red-400/10" : "text-red-700 bg-red-50"}`}><AlertCircle className="w-3 h-3" /> Rejected</span>;
      default:
        return <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${isDark ? "text-amber-400 bg-amber-400/10" : "text-amber-700 bg-amber-50"}`}><Clock className="w-3 h-3" /> Pending</span>;
    }
  };

  if (loading) {
    return <div className={`h-24 rounded-xl animate-pulse ${isDark ? "bg-slate-900/40" : "bg-slate-100"}`} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black tracking-tight flex items-center gap-2">
          <FileText className={`w-4 h-4 ${isDark ? "text-cyan-400" : "text-blue-600"}`} />
          Documents ({documents.length})
        </h3>
        <Link
          href="/agent/documents"
          className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full transition-all ${
            isDark ? "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20" : "bg-blue-50 text-[#3b71cb] hover:bg-blue-100"
          }`}
        >
          Manage All
        </Link>
      </div>

      {documents.length === 0 ? (
        <p className={`text-xs italic py-6 text-center ${isDark ? "text-slate-600" : "text-slate-400"}`}>
          No documents uploaded yet.
        </p>
      ) : (
        <div className="space-y-2">
          {documents.map((doc: any) => (
            <div
              key={doc.id}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                isDark ? "bg-slate-900/30 border-slate-800/60 hover:border-cyan-500/10" : "bg-slate-50 border-slate-200/60 hover:border-blue-500/10"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileText className={`w-4 h-4 shrink-0 ${isDark ? "text-cyan-400" : "text-[#3b71cb]"}`} />
                <div className="min-w-0">
                  <span className="text-xs font-black block truncate">{doc.label || doc.type}</span>
                  <span className={`text-[10px] block ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                    {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : "Not uploaded"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {getStatusBadge(doc.status)}
                <button
                  onClick={() => handleDownload(doc.id)}
                  disabled={downloadingId === doc.id}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    isDark ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  } disabled:opacity-50`}
                >
                  <Download className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
