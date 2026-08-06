"use client";

import React from "react";
import { useTheme } from "@/providers/theme-provider";
import { useAuth } from "@/providers/auth-provider";
import { Building2, Mail, Phone, MapPin, Edit3 } from "lucide-react";

export default function ProfilePage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === "dark";

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-800"}`}>
            Company Profile
          </h1>
          <p className={`text-[11px] mt-0.5 ${isDark ? "text-white/40" : "text-slate-500"}`}>
            Manage your company details and administrative preferences.
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-sky-500 hover:bg-sky-600 text-white transition-colors"
        >
          <Edit3 className="w-4 h-4" />
          Edit Profile
        </button>
      </div>

      {/* Profile Card */}
      <div
        className={`p-6 rounded-xl border flex flex-col md:flex-row gap-8 ${
          isDark
            ? "bg-[#0c1a2e] border-white/5"
            : "bg-white border-slate-200"
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-2xl bg-sky-500 flex items-center justify-center text-white text-3xl font-black uppercase shadow-lg">
            {user?.name ? user.name.split(" ").map((n: any) => n[0]).join("") : "CA"}
          </div>
          <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${isDark ? "bg-sky-500/20 text-sky-400" : "bg-sky-50 text-sky-600"}`}>
            {user?.role?.replace("_", " ") || "COMPANY ADMIN"}
          </span>
        </div>

        <div className="flex-1 space-y-6">
          <div>
            <h2 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
              {user?.name || "Company Name placeholder"}
            </h2>
            <p className={`text-xs mt-1 ${isDark ? "text-white/60" : "text-slate-500"}`}>
              RPSL Number: RPSL-MUM-12345
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? "text-white/40" : "text-slate-400"}`}>
                Email Address
              </span>
              <div className={`flex items-center gap-2 text-sm font-medium ${isDark ? "text-white/80" : "text-slate-700"}`}>
                <Mail className="w-4 h-4 opacity-50" />
                {user?.email || "admin@shipping.com"}
              </div>
            </div>
            
            <div className="space-y-1">
              <span className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? "text-white/40" : "text-slate-400"}`}>
                Phone Number
              </span>
              <div className={`flex items-center gap-2 text-sm font-medium ${isDark ? "text-white/80" : "text-slate-700"}`}>
                <Phone className="w-4 h-4 opacity-50" />
                {user?.phone || "+91 98765 43210"}
              </div>
            </div>

            <div className="space-y-1 md:col-span-2">
              <span className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? "text-white/40" : "text-slate-400"}`}>
                Headquarters Address
              </span>
              <div className={`flex items-center gap-2 text-sm font-medium ${isDark ? "text-white/80" : "text-slate-700"}`}>
                <MapPin className="w-4 h-4 opacity-50 shrink-0" />
                Andheri East, Mumbai, Maharashtra 400069, India
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
