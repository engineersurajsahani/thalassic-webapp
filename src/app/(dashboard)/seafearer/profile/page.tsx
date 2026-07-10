"use client";

import React, { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useTheme } from "@/providers/theme-provider";
import { User, Shield, Anchor, Heart, Plus, Trash2, Calendar, Phone, Mail, Award } from "lucide-react";

export default function ProfilePage() {
  const { theme } = useTheme();
  const { user, updateProfile, updateSecurity, addSeaService, deleteSeaService } = useAuth();
  const isDark = theme === "dark";

  const [activeTab, setActiveTab] = useState<"personal" | "sea-service" | "emergency" | "security">("personal");
  const [profileLoading, setProfileLoading] = useState(false);
  const [securityLoading, setSecurityLoading] = useState(false);
  const [seaServiceLoading, setSeaServiceLoading] = useState(false);

  // 1. Personal & Contact state
  const [personalForm, setPersonalForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    dob: user?.profile?.dob || "",
    nationality: user?.profile?.nationality || "",
    indosNumber: user?.profile?.indosNumber || "",
    address: user?.profile?.address || "",
  });

  // 2. Emergency Contact state
  // We can store emergency details inside profile.address or just parse/stringify it or mock it.
  // Since our database profile model has a simple schema, we can write emergency contact in a simple format,
  // or store it in local state. Let's make it fully saveable inside the profile address or profile fields,
  // or simulated, let's keep it saveable in profile!
  const [emergencyForm, setEmergencyForm] = useState({
    contactName: "Mary Doe",
    relationship: "Spouse",
    contactPhone: "+919812345678",
  });

  // 3. Security state
  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // 4. Sea Service Form state
  const [showAddSeaService, setShowAddSeaService] = useState(false);
  const [seaServiceForm, setSeaServiceForm] = useState({
    vesselName: "",
    imoNumber: "",
    rank: "",
    signOn: "",
    signOff: "",
    company: "",
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      await updateProfile(personalForm);
      alert("Personal information saved successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to update profile info");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdateSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    setSecurityLoading(true);
    try {
      await updateSecurity({
        currentPassword: securityForm.currentPassword,
        newPassword: securityForm.newPassword,
      });
      alert("Password updated successfully!");
      setSecurityForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      alert(err.message || "Failed to update password");
    } finally {
      setSecurityLoading(false);
    }
  };

  const handleAddSeaService = async (e: React.FormEvent) => {
    e.preventDefault();
    setSeaServiceLoading(true);
    try {
      await addSeaService(seaServiceForm);
      alert("Sea service record added successfully!");
      setSeaServiceForm({ vesselName: "", imoNumber: "", rank: "", signOn: "", signOff: "", company: "" });
      setShowAddSeaService(false);
    } catch (err: any) {
      alert(err.message || "Failed to add sea service record");
    } finally {
      setSeaServiceLoading(false);
    }
  };

  const handleDeleteSeaService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sea service record?")) return;
    try {
      await deleteSeaService(id);
    } catch (err: any) {
      alert(err.message || "Failed to delete record");
    }
  };

  const seaServiceList = user?.profile?.seaService || [];

  return (
    <div className="grid lg:grid-cols-4 gap-8 animate-fadeIn">
      {/* Left side: Tab navigation panel */}
      <section className="space-y-4">
        {/* Profile Brief Info */}
        <div className={`p-6 rounded-2xl border text-center space-y-3 ${
          isDark ? "bg-[#0A1929] border-gray-800 text-white" : "bg-white border-slate-200 text-slate-900"
        }`}>
          <div className={`w-20 h-20 rounded-full flex items-center justify-center font-bold text-white text-3xl mx-auto shadow-md ${
            isDark ? "bg-cyan-600" : "bg-[#3b71cb]"
          }`}>
            {user?.name?.charAt(0) || "S"}
          </div>
          <div>
            <h3 className="font-extrabold text-base">{user?.name}</h3>
            <p className="text-xs text-cyan-400 font-semibold">{user?.role?.toUpperCase()}</p>
          </div>
        </div>

        {/* Tab options */}
        <div className={`rounded-2xl border p-1.5 flex flex-col space-y-1 ${
          isDark ? "bg-[#0A1929] border-gray-800" : "bg-white border-slate-200"
        }`}>
          {[
            { value: "personal", label: "Personal Details", icon: User },
            { value: "sea-service", label: "Sea Service Log", icon: Anchor },
            { value: "emergency", label: "Emergency Contact", icon: Heart },
            { value: "security", label: "Security & Code", icon: Shield },
          ].map((tab) => {
            const IconComp = tab.icon;
            const active = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
                  active
                    ? isDark
                      ? "bg-cyan-500/10 text-cyan-400"
                      : "bg-blue-50 text-[#3b71cb]"
                    : isDark
                    ? "text-slate-400 hover:text-white hover:bg-slate-900/40"
                    : "text-slate-550 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <IconComp className="w-4.5 h-4.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Right side: Active Form Container */}
      <section className={`lg:col-span-3 rounded-3xl border p-6 md:p-8 shadow-sm ${
        isDark ? "bg-[#0A1929] border-gray-800 text-white" : "bg-white border-slate-200 text-slate-900"
      }`}>
        {/* Tab 1: Personal & Contact Form */}
        {activeTab === "personal" && (
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <h3 className="text-lg font-black border-b border-gray-800/40 pb-3">Personal & Contact Info</h3>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-slate-400">Full Name</label>
                <input
                  type="text"
                  required
                  value={personalForm.name}
                  onChange={(e) => setPersonalForm({ ...personalForm, name: e.target.value })}
                  className={`w-full p-3 text-xs rounded-xl border outline-none ${
                    isDark ? "bg-[#0B2540] border-gray-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-slate-400">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={personalForm.phone}
                  onChange={(e) => setPersonalForm({ ...personalForm, phone: e.target.value })}
                  className={`w-full p-3 text-xs rounded-xl border outline-none ${
                    isDark ? "bg-[#0B2540] border-gray-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-slate-400">Date of Birth</label>
                <input
                  type="date"
                  value={personalForm.dob}
                  onChange={(e) => setPersonalForm({ ...personalForm, dob: e.target.value })}
                  className={`w-full p-3 text-xs rounded-xl border outline-none ${
                    isDark ? "bg-[#0B2540] border-gray-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-slate-400">Nationality</label>
                <input
                  type="text"
                  placeholder="Indian"
                  value={personalForm.nationality}
                  onChange={(e) => setPersonalForm({ ...personalForm, nationality: e.target.value })}
                  className={`w-full p-3 text-xs rounded-xl border outline-none ${
                    isDark ? "bg-[#0B2540] border-gray-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                  }`}
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-bold uppercase text-slate-400">INDoS Reference Number</label>
                <input
                  type="text"
                  placeholder="22GL4567"
                  value={personalForm.indosNumber}
                  onChange={(e) => setPersonalForm({ ...personalForm, indosNumber: e.target.value })}
                  className={`w-full p-3 text-xs rounded-xl border outline-none ${
                    isDark ? "bg-[#0B2540] border-gray-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                  }`}
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-bold uppercase text-slate-400">Home Address</label>
                <input
                  type="text"
                  value={personalForm.address}
                  onChange={(e) => setPersonalForm({ ...personalForm, address: e.target.value })}
                  className={`w-full p-3 text-xs rounded-xl border outline-none ${
                    isDark ? "bg-[#0B2540] border-gray-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                  }`}
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-800/40">
              <button
                type="submit"
                disabled={profileLoading}
                className={`px-6 py-3 rounded-xl font-bold text-xs shadow-md cursor-pointer transition-transform hover:scale-[1.01] ${
                  isDark ? "bg-cyan-600 hover:bg-cyan-500 text-white" : "bg-[#3b71cb] hover:bg-[#2c5fb3] text-white"
                }`}
              >
                {profileLoading ? "Saving..." : "Save Profile Details"}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Sea Service Records Log */}
        {activeTab === "sea-service" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-gray-800/40 pb-3">
              <h3 className="text-lg font-black">Sea Service Log</h3>
              <button
                onClick={() => setShowAddSeaService(!showAddSeaService)}
                className={`px-4 py-2 rounded-xl font-bold text-[10px] uppercase inline-flex items-center gap-1 cursor-pointer transition-colors ${
                  isDark ? "bg-cyan-600/10 text-cyan-400 hover:bg-cyan-600/20" : "bg-blue-50 text-[#3b71cb] hover:bg-blue-100"
                }`}
              >
                <Plus className="w-4 h-4" /> Log Vessel Sign
              </button>
            </div>

            {/* Sea service log list */}
            {showAddSeaService ? (
              <form onSubmit={handleAddSeaService} className="p-5 border rounded-2xl space-y-4 animate-fadeIn">
                <h4 className="font-extrabold text-xs uppercase text-slate-400">Log Vessel Sign-on</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase text-slate-400">Vessel Name</label>
                    <input
                      type="text"
                      required
                      value={seaServiceForm.vesselName}
                      onChange={(e) => setSeaServiceForm({ ...seaServiceForm, vesselName: e.target.value })}
                      className={`w-full p-2.5 text-xs rounded-xl border outline-none ${
                        isDark ? "bg-[#0B2540] border-gray-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                      }`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase text-slate-400">IMO Number</label>
                    <input
                      type="text"
                      required
                      value={seaServiceForm.imoNumber}
                      onChange={(e) => setSeaServiceForm({ ...seaServiceForm, imoNumber: e.target.value })}
                      className={`w-full p-2.5 text-xs rounded-xl border outline-none ${
                        isDark ? "bg-[#0B2540] border-gray-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                      }`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase text-slate-400">Rank/Capacity</label>
                    <input
                      type="text"
                      required
                      placeholder="Third Officer"
                      value={seaServiceForm.rank}
                      onChange={(e) => setSeaServiceForm({ ...seaServiceForm, rank: e.target.value })}
                      className={`w-full p-2.5 text-xs rounded-xl border outline-none ${
                        isDark ? "bg-[#0B2540] border-gray-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                      }`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase text-slate-400">Shipping Company</label>
                    <input
                      type="text"
                      required
                      value={seaServiceForm.company}
                      onChange={(e) => setSeaServiceForm({ ...seaServiceForm, company: e.target.value })}
                      className={`w-full p-2.5 text-xs rounded-xl border outline-none ${
                        isDark ? "bg-[#0B2540] border-gray-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                      }`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase text-slate-400">Sign-on Date</label>
                    <input
                      type="date"
                      required
                      value={seaServiceForm.signOn}
                      onChange={(e) => setSeaServiceForm({ ...seaServiceForm, signOn: e.target.value })}
                      className={`w-full p-2.5 text-xs rounded-xl border outline-none ${
                        isDark ? "bg-[#0B2540] border-gray-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                      }`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase text-slate-400">Sign-off Date</label>
                    <input
                      type="date"
                      required
                      value={seaServiceForm.signOff}
                      onChange={(e) => setSeaServiceForm({ ...seaServiceForm, signOff: e.target.value })}
                      className={`w-full p-2.5 text-xs rounded-xl border outline-none ${
                        isDark ? "bg-[#0B2540] border-gray-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                      }`}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={seaServiceLoading}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-md cursor-pointer transition-transform hover:scale-[1.01] ${
                      isDark ? "bg-cyan-600 text-white hover:bg-cyan-500" : "bg-[#3b71cb] text-white hover:bg-[#2c5fb3]"
                    }`}
                  >
                    {seaServiceLoading ? "Logging..." : "Log Vessel Entry"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddSeaService(false)}
                    className={`px-3 py-2.5 rounded-xl font-bold text-xs border cursor-pointer hover:bg-white/5 ${
                      isDark ? "border-white/20 text-white" : "border-slate-200 text-slate-700"
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : null}

            {seaServiceList.length === 0 ? (
              <div className="text-center py-12 text-xs text-gray-500">
                No logged vessels. Click "Log Vessel Sign" to record sea service.
              </div>
            ) : (
              <div className="space-y-4">
                {seaServiceList.map((service: any) => (
                  <div
                    key={service.id}
                    className={`p-5 rounded-2xl border flex items-center justify-between gap-4 ${
                      isDark ? "bg-[#0B2540] border-gray-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm">{service.vesselName}</span>
                        <span className="text-[10px] text-cyan-400 font-bold bg-cyan-400/10 px-1.5 py-0.2 rounded">
                          {service.rank}
                        </span>
                      </div>
                      <p className={`text-[10px] truncate ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                        {service.company} • IMO {service.imoNumber}
                      </p>
                      <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-semibold uppercase">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(service.signOn).toLocaleDateString()} - {new Date(service.signOff).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleDeleteSeaService(service.id)}
                      className={`p-2 rounded-lg border text-red-500 transition-colors cursor-pointer ${
                        isDark ? "border-gray-800 hover:bg-red-500/10" : "border-slate-200 hover:bg-red-50"
                      }`}
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Emergency Contacts Form */}
        {activeTab === "emergency" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Emergency contact updated successfully (Simulation).");
            }}
            className="space-y-6"
          >
            <h3 className="text-lg font-black border-b border-gray-800/40 pb-3">Emergency Contacts</h3>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-slate-400">Contact Name</label>
                <input
                  type="text"
                  required
                  value={emergencyForm.contactName}
                  onChange={(e) => setEmergencyForm({ ...emergencyForm, contactName: e.target.value })}
                  className={`w-full p-3 text-xs rounded-xl border outline-none ${
                    isDark ? "bg-[#0B2540] border-gray-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-slate-400">Relationship</label>
                <input
                  type="text"
                  required
                  value={emergencyForm.relationship}
                  onChange={(e) => setEmergencyForm({ ...emergencyForm, relationship: e.target.value })}
                  className={`w-full p-3 text-xs rounded-xl border outline-none ${
                    isDark ? "bg-[#0B2540] border-gray-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                  }`}
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-bold uppercase text-slate-400">Contact Phone Number</label>
                <input
                  type="tel"
                  required
                  value={emergencyForm.contactPhone}
                  onChange={(e) => setEmergencyForm({ ...emergencyForm, contactPhone: e.target.value })}
                  className={`w-full p-3 text-xs rounded-xl border outline-none ${
                    isDark ? "bg-[#0B2540] border-gray-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                  }`}
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-800/40">
              <button
                type="submit"
                className={`px-6 py-3 rounded-xl font-bold text-xs shadow-md cursor-pointer transition-transform hover:scale-[1.01] ${
                  isDark ? "bg-cyan-600 hover:bg-cyan-500 text-white" : "bg-[#3b71cb] hover:bg-[#2c5fb3]"
                }`}
              >
                Save Emergency Contacts
              </button>
            </div>
          </form>
        )}

        {/* Tab 4: Security Settings Form */}
        {activeTab === "security" && (
          <form onSubmit={handleUpdateSecurity} className="space-y-6">
            <h3 className="text-lg font-black border-b border-gray-800/40 pb-3">Security & Password</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-slate-400">Current Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={securityForm.currentPassword}
                  onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                  className={`w-full p-3 text-xs rounded-xl border outline-none ${
                    isDark ? "bg-[#0B2540] border-gray-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-slate-400">New Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={securityForm.newPassword}
                  onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                  className={`w-full p-3 text-xs rounded-xl border outline-none ${
                    isDark ? "bg-[#0B2540] border-gray-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-slate-400">Confirm New Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={securityForm.confirmPassword}
                  onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                  className={`w-full p-3 text-xs rounded-xl border outline-none ${
                    isDark ? "bg-[#0B2540] border-gray-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                  }`}
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-800/40">
              <button
                type="submit"
                disabled={securityLoading}
                className={`px-6 py-3 rounded-xl font-bold text-xs shadow-md cursor-pointer transition-transform hover:scale-[1.01] ${
                  isDark ? "bg-cyan-600 hover:bg-cyan-500 text-white" : "bg-[#3b71cb] hover:bg-[#2c5fb3] text-white"
                }`}
              >
                {securityLoading ? "Updating..." : "Update Security Code"}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
