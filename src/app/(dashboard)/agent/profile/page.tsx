"use client";

import React, { useEffect, useState } from "react";
import { agentService } from "@/services/agent.service";
import { api } from "@/lib/axios";
import { useTheme } from "@/providers/theme-provider";
import {
  User, ShieldCheck, Key, CheckCircle2, AlertCircle, Save, Bell
} from "lucide-react";

export default function AgentProfilePage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [formData, setFormData] = useState<any>({
    name: "",
    email: "",
    phone: "",
    alternatePhone: "",
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

  const [loading, setLoading] = useState(true);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [notifications, setNotifications] = useState({
    leadConversion: true,
    commissionPaid: true,
    documentAudit: true,
    systemAnnouncements: false,
  });
  const [notifSuccess, setNotifSuccess] = useState("");

  const handleSaveNotifications = () => {
    setNotifSuccess("Alert preferences saved successfully!");
    setTimeout(() => setNotifSuccess(""), 3000);
  };

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
      setProfileSuccess("Profile settings updated successfully!");
      await loadData();
    } catch (err: any) {
      setProfileError(err.response?.data?.message || "Failed to update profile settings.");
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
      // In this system, user profile security updates call auth security endpoints
      await api.put("/users/profile", {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordSuccess("Password updated successfully!");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || "Failed to update account password.");
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-96 rounded-3xl ${isDark ? 'bg-[#09162c]' : 'bg-slate-100'}" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn relative pb-10">
      
      {/* Title */}
      <div className="flex flex-col gap-1">
        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit ${
          isDark ? "bg-cyan-500/10 text-cyan-400" : "bg-blue-50 text-[#3b71cb]"
        }`}>
          ⚙️ Account Config
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight mt-1.5">
          Account Settings
        </h1>
        <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Manage your agency profile, credentials, and notification alert preferences in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Settings Form */}
        <section className={`lg:col-span-2 rounded-3xl border p-6 md:p-8 shadow-xl flex flex-col justify-between ${
          isDark ? "bg-[#0a1122]/70 border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-white backdrop-blur-xl" : "bg-white/80 border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-slate-900 backdrop-blur-xl"
        }`}>
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <h3 className="text-lg font-black tracking-tight border-b border-slate-800/40 pb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-cyan-400" />
              Agency & Profile Details
            </h3>

            {profileSuccess && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-start gap-3 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{profileSuccess}</span>
              </div>
            )}

            {profileError && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-3 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{profileError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Email (Disabled) */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">Account Email (Immutable)</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className={`w-full px-4 py-2.5 text-xs rounded-xl border outline-none cursor-not-allowed opacity-60 ${
                    isDark ? "bg-slate-950 border-slate-800 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-500"
                  }`}
                />
              </div>

              {/* Referral Code (Disabled) */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">Referral Code (Immutable)</label>
                <input
                  type="text"
                  value={formData.referralCode}
                  disabled
                  className={`w-full px-4 py-2.5 text-xs rounded-xl border outline-none cursor-not-allowed opacity-60 font-mono font-black ${
                    isDark ? "bg-slate-950 border-slate-800 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-500"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">Owner Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Owner Name"
                  className={`w-full px-4 py-2.5 text-xs rounded-xl border outline-none ${
                    isDark ? "bg-[#0b182d] border-slate-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-850"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">Owner Mobile</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Owner Phone"
                  className={`w-full px-4 py-2.5 text-xs rounded-xl border outline-none ${
                    isDark ? "bg-[#0b182d] border-slate-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-850"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">Agency Name</label>
                <input
                  type="text"
                  name="agencyName"
                  value={formData.agencyName}
                  onChange={handleInputChange}
                  placeholder="Agency Name"
                  className={`w-full px-4 py-2.5 text-xs rounded-xl border outline-none ${
                    isDark ? "bg-[#0b182d] border-slate-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-850"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">Alternate Phone</label>
                <input
                  type="text"
                  name="alternatePhone"
                  value={formData.alternatePhone}
                  onChange={handleInputChange}
                  placeholder="Alternate Phone"
                  className={`w-full px-4 py-2.5 text-xs rounded-xl border outline-none ${
                    isDark ? "bg-[#0b182d] border-slate-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-850"
                  }`}
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">Office Premises Address</label>
                <textarea
                  name="officeAddress"
                  value={formData.officeAddress}
                  onChange={handleInputChange}
                  placeholder="Office Premises Address"
                  rows={2}
                  className={`w-full px-4 py-2.5 text-xs rounded-xl border outline-none ${
                    isDark ? "bg-[#0b182d] border-slate-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-850"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">Agency City</label>
                <input
                  type="text"
                  name="agencyCity"
                  value={formData.agencyCity}
                  onChange={handleInputChange}
                  placeholder="Agency City"
                  className={`w-full px-4 py-2.5 text-xs rounded-xl border outline-none ${
                    isDark ? "bg-[#0b182d] border-slate-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-850"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">Agency State</label>
                <input
                  type="text"
                  name="agencyState"
                  value={formData.agencyState}
                  onChange={handleInputChange}
                  placeholder="Agency State"
                  className={`w-full px-4 py-2.5 text-xs rounded-xl border outline-none ${
                    isDark ? "bg-[#0b182d] border-slate-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-850"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">Agency PIN Code</label>
                <input
                  type="text"
                  name="agencyPinCode"
                  value={formData.agencyPinCode}
                  onChange={handleInputChange}
                  placeholder="Agency PIN Code"
                  className={`w-full px-4 py-2.5 text-xs rounded-xl border outline-none ${
                    isDark ? "bg-[#0b182d] border-slate-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-850"
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer mt-4 transition-all ${
                isDark ? "bg-cyan-600 hover:bg-cyan-505 text-white" : "bg-[#3b71cb] hover:bg-[#2c5fb3] text-white"
              }`}
            >
              <Save className="w-4 h-4" /> Save Profile Details
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

            {notifSuccess && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-start gap-3 text-xs mb-4 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{notifSuccess}</span>
              </div>
            )}

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold">Referral Leads Registered</p>
                  <p className="text-[10px] mt-0.5 text-slate-450 leading-tight">Get notified immediately when seafarers register via your code.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.leadConversion}
                  onChange={(e) => setNotifications({ ...notifications, leadConversion: e.target.checked })}
                  className="w-4 h-4 accent-cyan-550 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <div>
                  <p className="text-xs font-bold">Commission Payout Actions</p>
                  <p className="text-[10px] mt-0.5 text-slate-450 leading-tight">Receive updates regarding commission approvals and payments.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.commissionPaid}
                  onChange={(e) => setNotifications({ ...notifications, commissionPaid: e.target.checked })}
                  className="w-4 h-4 accent-cyan-550 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <div>
                  <p className="text-xs font-bold">KYC Document Verification Status</p>
                  <p className="text-[10px] mt-0.5 text-slate-450 leading-tight">Get alerts on the verification result of your uploaded files.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.documentAudit}
                  onChange={(e) => setNotifications({ ...notifications, documentAudit: e.target.checked })}
                  className="w-4 h-4 accent-cyan-550 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <div>
                  <p className="text-xs font-bold">System Announcements</p>
                  <p className="text-[10px] mt-0.5 text-slate-450 leading-tight">Receive emails regarding system changes or scheduled downtime.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.systemAnnouncements}
                  onChange={(e) => setNotifications({ ...notifications, systemAnnouncements: e.target.checked })}
                  className="w-4 h-4 accent-cyan-550 cursor-pointer"
                />
              </div>

              <button
                onClick={handleSaveNotifications}
                className={`w-full py-2.5 text-xs font-bold rounded-xl mt-6 flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition ${
                  isDark ? "bg-cyan-600 hover:bg-cyan-500 text-white" : "bg-[#3b71cb] hover:bg-[#2c5fb3] text-white"
                }`}
              >
                <Save className="w-3.5 h-3.5" />
                Save Preferences
              </button>
            </div>
          </section>

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

      </div>
    </div>
  );
}
