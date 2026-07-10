"use client";

import React, { useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import { 
  Settings, 
  Save, 
  User, 
  Lock, 
  Globe, 
  HelpCircle,
  CheckCircle2,
  Mail,
  Phone
} from "lucide-react";

export default function SettingsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // State Management
  const [activeTab, setActiveTab] = useState<"platform" | "profile">("platform");
  const [isSaved, setIsSaved] = useState(false);

  // Form states
  const [platformConfig, setPlatformConfig] = useState({
    systemEmail: "support@hariomthalassic.com",
    contactPhone: "+91 22 12345678",
    paymentGateway: "razorpay_production_mode",
    dgsAccreditationId: "DGS-MTI-10294"
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Glassmorphic Styles
  const glassStyle = isDark
    ? "bg-slate-900/60 border-slate-800/80 backdrop-blur-xl"
    : "bg-white border-slate-200/80 shadow-md shadow-slate-100";

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 border-slate-800/40">
        <div>
          <h1 className={`text-3xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            Platform Settings
          </h1>
          <p className={`text-xs mt-0.5 font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Configure administrative variables, profile credentials, and API connection credentials.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-800/40 pb-px">
        {[
          { id: "platform", label: "System Configuration", icon: Settings },
          { id: "profile", label: "Admin Profile", icon: User }
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 pb-3 px-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 -mb-[2px] cursor-pointer ${
                active
                  ? "border-blue-500 text-blue-500"
                  : isDark
                    ? "border-transparent text-slate-400 hover:text-white"
                    : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Settings Form Container */}
      <div className={`p-6 rounded-3xl border ${glassStyle}`}>
        <form onSubmit={handleSave} className="space-y-5 text-xs font-bold uppercase tracking-wide">
          
          {activeTab === "platform" && (
            <div className="space-y-4">
              <h3 className={`text-sm font-black flex items-center gap-2 mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                <Globe className="w-4.5 h-4.5 text-cyan-400" /> General Platform Configuration
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-400 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Support Email ID</label>
                  <input
                    type="email"
                    value={platformConfig.systemEmail}
                    onChange={(e) => setPlatformConfig({ ...platformConfig, systemEmail: e.target.value })}
                    className={`w-full p-3 rounded-xl border outline-none font-semibold normal-case ${
                      isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-850"
                    }`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-400 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Contact Helpline Number</label>
                  <input
                    type="text"
                    value={platformConfig.contactPhone}
                    onChange={(e) => setPlatformConfig({ ...platformConfig, contactPhone: e.target.value })}
                    className={`w-full p-3 rounded-xl border outline-none font-semibold ${
                      isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-850"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-400">Payment Gateway Mode</label>
                  <select
                    value={platformConfig.paymentGateway}
                    onChange={(e) => setPlatformConfig({ ...platformConfig, paymentGateway: e.target.value })}
                    className={`w-full p-3 rounded-xl border outline-none cursor-pointer ${
                      isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-850"
                    }`}
                  >
                    <option value="razorpay_production_mode">Razorpay (Live Mode)</option>
                    <option value="razorpay_sandbox_mode">Razorpay (Sandbox / Testing)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-400">DGS Accreditation MTI Number</label>
                  <input
                    type="text"
                    value={platformConfig.dgsAccreditationId}
                    onChange={(e) => setPlatformConfig({ ...platformConfig, dgsAccreditationId: e.target.value })}
                    className={`w-full p-3 rounded-xl border outline-none font-semibold uppercase tracking-wider ${
                      isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-850"
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-4">
              <h3 className={`text-sm font-black flex items-center gap-2 mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                <User className="w-4.5 h-4.5 text-cyan-400" /> Admin Credentials and Password
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-400">Admin Username</label>
                  <input
                    type="text"
                    defaultValue="master_ceo"
                    disabled
                    className={`w-full p-3 rounded-xl border font-bold opacity-60 ${
                      isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-100 border-slate-200 text-slate-600"
                    }`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-400">Security Access Level</label>
                  <input
                    type="text"
                    defaultValue="Master / Complete Control"
                    disabled
                    className={`w-full p-3 rounded-xl border font-bold opacity-60 ${
                      isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-100 border-slate-200 text-slate-600"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-400 flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    className={`w-full p-3 rounded-xl border outline-none font-semibold ${
                      isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-850"
                    }`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-400 flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> Confirm Password</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    className={`w-full p-3 rounded-xl border outline-none font-semibold ${
                      isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-850"
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-800/40 flex items-center justify-between gap-4">
            {isSaved ? (
              <span className="text-green-500 font-extrabold flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="w-4.5 h-4.5" /> Configuration updated successfully!
              </span>
            ) : (
              <span className="text-slate-500 text-[10px] font-bold">Please click save changes to publish edits.</span>
            )}
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider text-white shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-blue-500/20"
            >
              <Save className="w-4.5 h-4.5" /> Save Changes
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
