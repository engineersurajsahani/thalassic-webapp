"use client";

import React, { useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import { useAuth } from "@/providers/auth-provider";
import { Building2, Mail, Phone, MapPin, Edit3, X } from "lucide-react";

export default function ProfilePage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === "dark";

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "Company Name placeholder",
    email: user?.email || "admin@shipping.com",
    phone: user?.phone || "+91 98765 43210",
    address: "Andheri East, Mumbai, Maharashtra 400069, India",
  });

  const [formData, setFormData] = useState(profileData);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileData(formData);
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-4xl relative">
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
          onClick={() => {
            setFormData(profileData);
            setIsEditModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-sky-500 hover:bg-sky-600 text-white transition-colors cursor-pointer"
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
            {profileData.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2)}
          </div>
          <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${isDark ? "bg-sky-500/20 text-sky-400" : "bg-sky-50 text-sky-600"}`}>
            {user?.role?.replace("_", " ") || "COMPANY ADMIN"}
          </span>
        </div>

        <div className="flex-1 space-y-6">
          <div>
            <h2 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
              {profileData.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? "text-white/40" : "text-slate-400"}`}>
                Email Address
              </span>
              <div className={`flex items-center gap-2 text-sm font-medium ${isDark ? "text-white/80" : "text-slate-700"}`}>
                <Mail className="w-4 h-4 opacity-50" />
                {profileData.email}
              </div>
            </div>
            
            <div className="space-y-1">
              <span className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? "text-white/40" : "text-slate-400"}`}>
                Phone Number
              </span>
              <div className={`flex items-center gap-2 text-sm font-medium ${isDark ? "text-white/80" : "text-slate-700"}`}>
                <Phone className="w-4 h-4 opacity-50" />
                {profileData.phone}
              </div>
            </div>

            <div className="space-y-1 md:col-span-2">
              <span className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? "text-white/40" : "text-slate-400"}`}>
                Headquarters Address
              </span>
              <div className={`flex items-center gap-2 text-sm font-medium ${isDark ? "text-white/80" : "text-slate-700"}`}>
                <MapPin className="w-4 h-4 opacity-50 shrink-0" />
                {profileData.address}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
            onClick={() => setIsEditModalOpen(false)}
          />
          <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg shadow-2xl z-55 rounded-xl overflow-hidden border ${isDark ? "bg-[#0b1625] border-white/5 text-white" : "bg-white border-slate-200 text-slate-850"}`}>
            <div className={`p-4 border-b flex items-center justify-between gap-4 ${isDark ? "border-white/5 bg-[#09111e]" : "border-slate-100 bg-slate-50"}`}>
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold">Edit Company Profile</h3>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className={`p-1.5 rounded transition-colors cursor-pointer ${isDark ? "hover:bg-white/5" : "hover:bg-slate-100"}`}>
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase opacity-60">Company Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className={`w-full py-2 px-3 rounded-lg border text-xs outline-none ${isDark ? "bg-[#0c1a2e] border-white/10 text-white focus:border-sky-500" : "bg-white border-slate-200 text-slate-850 focus:border-sky-500"}`} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase opacity-60">Email Address</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className={`w-full py-2 px-3 rounded-lg border text-xs outline-none ${isDark ? "bg-[#0c1a2e] border-white/10 text-white focus:border-sky-500" : "bg-white border-slate-200 text-slate-850 focus:border-sky-500"}`} />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase opacity-60">Phone Number</label>
                  <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required className={`w-full py-2 px-3 rounded-lg border text-xs outline-none ${isDark ? "bg-[#0c1a2e] border-white/10 text-white focus:border-sky-500" : "bg-white border-slate-200 text-slate-850 focus:border-sky-500"}`} />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase opacity-60">Headquarters Address</label>
                <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} required className={`w-full py-2 px-3 rounded-lg border text-xs outline-none ${isDark ? "bg-[#0c1a2e] border-white/10 text-white focus:border-sky-500" : "bg-white border-slate-200 text-slate-850 focus:border-sky-500"}`} />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer ${isDark ? "bg-white/5 hover:bg-white/10" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}>
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-lg text-xs font-semibold bg-sky-500 hover:bg-sky-600 text-white cursor-pointer">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
