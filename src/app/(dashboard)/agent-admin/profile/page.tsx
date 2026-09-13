"use client";

import React, { useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import { useAuth } from "@/providers/auth-provider";
import { User, ShieldCheck, Mail, Phone, Lock, Check } from "lucide-react";

export default function Profile() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { user, updateSecurity } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const card = `rounded-[16px] p-7 border-0 transition-all duration-300 hover:-translate-y-0.5 ${
    isDark
      ? "bg-[#0c1629] shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.4)] text-white"
      : "bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] text-[#111827]"
  }`;
  const inputBg = isDark ? "bg-white/5 border-white/10 text-white placeholder:text-white/20" : "bg-slate-50 border-slate-200 text-slate-700 placeholder:text-slate-400";
  const labelText = isDark ? "text-white/50" : "text-slate-500";
  const ht = isDark ? "text-white/95" : "text-slate-800";
  const mt = isDark ? "text-white/35" : "text-slate-400";

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    setLoading(true);
    try {
      await updateSecurity({
        currentPassword,
        newPassword,
      });
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || "Failed to update security credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold tracking-tight ${ht}`}>Account Settings</h1>
        <p className={`text-xs mt-1.5 ${mt}`}>Manage your personal credentials, contact info, and security parameters.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className={`${card} h-fit space-y-6`}>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#3D5EF6] flex items-center justify-center text-white text-xl font-black uppercase shadow-lg mb-4">
              {user?.name ? user.name.split(" ").map((n: any) => n[0]).join("") : "AA"}
            </div>
            <h3 className={`text-sm font-bold ${ht}`}>{user?.name || "Agent Admin"}</h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#3D5EF6]/10 text-[#3D5EF6] mt-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              {user?.role || "AGENT_ADMIN"}
            </span>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5 text-xs">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#3D5EF6] shrink-0" />
              <div className="min-w-0">
                <p className={labelText}>Email Address</p>
                <p className={`font-semibold truncate ${ht}`}>{user?.email || "admin@thalassic.in"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#3D5EF6] shrink-0" />
              <div className="min-w-0">
                <p className={labelText}>Contact Number</p>
                <p className={`font-semibold truncate ${ht}`}>{user?.phone || "+91 99887 76655"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        <div className={`${card} lg:col-span-2 space-y-6 self-start max-w-2xl`}>
          <div className="flex items-center gap-2 border-b pb-4 mb-4 border-white/5">
            <Lock className="w-4 h-4 text-[#3D5EF6]" />
            <h3 className="text-sm font-bold">Change Password</h3>
          </div>

          {error && <p className="text-xs text-red-500 bg-red-500/10 p-2 rounded-lg">{error}</p>}
          {success && <p className="text-xs text-emerald-500 bg-emerald-500/10 p-2 rounded-lg flex items-center gap-1"><Check className="w-4 h-4" /> Password updated successfully!</p>}

          <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-sm">
            <div className="space-y-1">
              <label className={`text-[10px] font-bold ${labelText}`}>Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-3 py-2.5 rounded-xl border text-xs outline-none ${inputBg}`}
              />
            </div>

            <div className="space-y-1">
              <label className={`text-[10px] font-bold ${labelText}`}>New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-3 py-2.5 rounded-xl border text-xs outline-none ${inputBg}`}
              />
            </div>

            <div className="space-y-1">
              <label className={`text-[10px] font-bold ${labelText}`}>Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-3 py-2.5 rounded-xl border text-xs outline-none ${inputBg}`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white rounded-xl font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Credentials"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
