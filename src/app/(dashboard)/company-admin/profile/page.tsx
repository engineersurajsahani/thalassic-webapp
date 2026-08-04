"use client";

import React, { useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  UserCircle, Building2, Mail, Phone, MapPin,
  Lock, Bell, Shield, CheckCircle2, Eye, EyeOff, Save,
} from "lucide-react";

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { theme } = useTheme();
  const dk = theme === "dark";

  const [profile, setProfile] = useState({
    name: "Company Admin",
    email: "admin@company.in",
    phone: "+91 98765 43210",
    company: "Hari Om Thalassic Pvt. Ltd.",
    location: "Mumbai, Maharashtra",
    designation: "Admin Manager",
  });

  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [showPass, setShowPass]   = useState({ current: false, newPass: false, confirm: false });
  const [saved,    setSaved]      = useState(false);
  const [pwSaved,  setPwSaved]    = useState(false);

  const [notifications, setNotifications] = useState({
    newRegistration: true,
    paymentReceived: true,
    documentVerification: false,
    weeklyReport: true,
  });

  const card    = `rounded-2xl overflow-hidden ${dk ? "bg-[#0d1f35] border border-white/[0.06]" : "bg-white border border-slate-200 shadow-sm"}`;
  const ht      = dk ? "text-white/80"  : "text-slate-800";
  const mt      = dk ? "text-white/35"  : "text-slate-400";
  const inputBg = dk
    ? "bg-white/5 border-white/10 text-white/80 placeholder:text-white/25 focus:border-emerald-500/60"
    : "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-emerald-400";
  const labelCls = `block text-[11px] font-semibold mb-1 ${mt}`;
  const sectionHead = `flex items-center gap-2 px-6 py-4 border-b ${dk ? "border-white/5" : "border-slate-100"}`;

  function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswords({ current: "", newPass: "", confirm: "" });
    setPwSaved(true);
    setTimeout(() => setPwSaved(false), 3000);
  }

  const toggleNotif = (key: keyof typeof notifications) =>
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));

  const passInput = (field: keyof typeof passwords, placeholder: string) => (
    <div className="relative">
      <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${mt}`} />
      <input
        type={showPass[field] ? "text" : "password"}
        value={passwords[field]}
        onChange={e => setPasswords(p => ({ ...p, [field]: e.target.value }))}
        placeholder={placeholder}
        className={`w-full pl-9 pr-10 py-2 text-sm rounded-lg border outline-none transition-colors ${inputBg}`}
      />
      <button
        type="button"
        onClick={() => setShowPass(p => ({ ...p, [field]: !p[field] }))}
        className={`absolute right-3 top-1/2 -translate-y-1/2 ${mt}`}
      >
        {showPass[field] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
      </button>
    </div>
  );

  return (
    <div className="space-y-5 max-w-4xl">

      {/* Header */}
      <div>
        <h1 className={`text-xl font-bold ${ht}`}>Profile</h1>
        <p className={`text-sm mt-0.5 ${mt}`}>Manage your account and company settings</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* ── Avatar Card ───────────────────────────────────────────────────── */}
        <div className={`${card} xl:col-span-1 flex flex-col items-center px-6 py-8 gap-4`}>
          <div className="w-20 h-20 rounded-2xl bg-emerald-500 flex items-center justify-center text-white text-2xl font-bold">
            CA
          </div>
          <div className="text-center">
            <p className={`text-base font-bold ${ht}`}>{profile.name}</p>
            <p className={`text-sm ${mt}`}>{profile.designation}</p>
            <p className={`text-xs mt-1 ${mt}`}>{profile.company}</p>
          </div>
          <div className={`w-full rounded-xl px-4 py-3 space-y-2 ${dk ? "bg-white/[0.04] border border-white/6" : "bg-slate-50 border border-slate-100"}`}>
            {[
              { icon: Mail,    label: profile.email },
              { icon: Phone,   label: profile.phone },
              { icon: MapPin,  label: profile.location },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className={`w-3.5 h-3.5 shrink-0 ${mt}`} />
                <span className={`text-[12px] truncate ${ht}`}>{label}</span>
              </div>
            ))}
          </div>
          <div className={`w-full rounded-xl px-4 py-3 flex items-center gap-2 ${dk ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-emerald-50 border border-emerald-100"}`}>
            <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className={`text-[12px] font-medium ${dk ? "text-emerald-400" : "text-emerald-700"}`}>Company Admin · Verified</span>
          </div>
        </div>

        {/* ── Right Column ──────────────────────────────────────────────────── */}
        <div className="xl:col-span-2 space-y-5">

          {/* Profile Form */}
          <div className={card}>
            <div className={sectionHead}>
              <UserCircle className={`w-4 h-4 ${dk ? "text-indigo-400" : "text-indigo-500"}`} />
              <p className={`text-sm font-semibold ${ht}`}>Personal Information</p>
            </div>
            <form onSubmit={saveProfile} className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Full Name</label>
                  <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                    className={`w-full px-3 py-2 text-sm rounded-lg border outline-none transition-colors ${inputBg}`} />
                </div>
                <div>
                  <label className={labelCls}>Designation</label>
                  <input value={profile.designation} onChange={e => setProfile(p => ({ ...p, designation: e.target.value }))}
                    className={`w-full px-3 py-2 text-sm rounded-lg border outline-none transition-colors ${inputBg}`} />
                </div>
                <div>
                  <label className={labelCls}>Email</label>
                  <input type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                    className={`w-full px-3 py-2 text-sm rounded-lg border outline-none transition-colors ${inputBg}`} />
                </div>
                <div>
                  <label className={labelCls}>Phone</label>
                  <input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                    className={`w-full px-3 py-2 text-sm rounded-lg border outline-none transition-colors ${inputBg}`} />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Company Name</label>
                  <div className="relative">
                    <Building2 className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${mt}`} />
                    <input value={profile.company} onChange={e => setProfile(p => ({ ...p, company: e.target.value }))}
                      className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border outline-none transition-colors ${inputBg}`} />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Location</label>
                  <div className="relative">
                    <MapPin className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${mt}`} />
                    <input value={profile.location} onChange={e => setProfile(p => ({ ...p, location: e.target.value }))}
                      className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border outline-none transition-colors ${inputBg}`} />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1">
                {saved ? (
                  <div className="flex items-center gap-2 text-emerald-500 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Profile saved!
                  </div>
                ) : <span />}
                <button type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors">
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Password */}
          <div className={card}>
            <div className={sectionHead}>
              <Lock className={`w-4 h-4 ${dk ? "text-amber-400" : "text-amber-500"}`} />
              <p className={`text-sm font-semibold ${ht}`}>Change Password</p>
            </div>
            <form onSubmit={savePassword} className="px-6 py-5 space-y-4">
              <div>
                <label className={labelCls}>Current Password</label>
                {passInput("current", "Enter current password")}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>New Password</label>
                  {passInput("newPass", "Enter new password")}
                </div>
                <div>
                  <label className={labelCls}>Confirm Password</label>
                  {passInput("confirm", "Confirm new password")}
                </div>
              </div>
              <div className="flex items-center justify-between pt-1">
                {pwSaved ? (
                  <div className="flex items-center gap-2 text-emerald-500 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Password updated!
                  </div>
                ) : <span />}
                <button type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors">
                  <Lock className="w-3.5 h-3.5" /> Update Password
                </button>
              </div>
            </form>
          </div>

          {/* Notifications */}
          <div className={card}>
            <div className={sectionHead}>
              <Bell className={`w-4 h-4 ${dk ? "text-sky-400" : "text-sky-500"}`} />
              <p className={`text-sm font-semibold ${ht}`}>Notification Preferences</p>
            </div>
            <div className="px-6 py-5 space-y-4">
              {[
                { key: "newRegistration",      label: "New Registration",          desc: "Alert when a new seafarer registers" },
                { key: "paymentReceived",       label: "Payment Received",           desc: "Alert when a payment is confirmed" },
                { key: "documentVerification",  label: "Document Verification",      desc: "Alert when a document needs review" },
                { key: "weeklyReport",          label: "Weekly Summary Report",      desc: "Receive a weekly digest every Monday" },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between gap-4">
                  <div>
                    <p className={`text-sm font-medium ${ht}`}>{label}</p>
                    <p className={`text-[11px] mt-0.5 ${mt}`}>{desc}</p>
                  </div>
                  <button
                    onClick={() => toggleNotif(key as keyof typeof notifications)}
                    className={`relative w-11 h-6 rounded-full transition-all duration-300 shrink-0 ${
                      notifications[key as keyof typeof notifications]
                        ? "bg-emerald-500"
                        : dk ? "bg-white/10" : "bg-slate-200"
                    }`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                      notifications[key as keyof typeof notifications] ? "translate-x-5" : "translate-x-0"
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
