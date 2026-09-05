"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { useTheme } from "@/providers/theme-provider";
import { User, Shield, Anchor, Heart, Plus, Trash2, Calendar, Phone, Mail, Award, Upload } from "lucide-react";

function ProfileContent() {
  const { theme } = useTheme();
  const { user, updateProfile, uploadProfilePhoto, updateSecurity, addSeaService, deleteSeaService } = useAuth();
  const isDark = theme === "dark";
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get("tab");

  const [activeTab, setActiveTab] = useState<"personal" | "sea-service" | "emergency" | "security">(
    tabParam === "sea-service" ? "sea-service" : "personal"
  );

  useEffect(() => {
    if (tabParam === "sea-service" || tabParam === "personal" || tabParam === "emergency" || tabParam === "security") {
      setActiveTab(tabParam);
    }
  }, [tabParam]);
  const [profileLoading, setProfileLoading] = useState(false);
  const [securityLoading, setSecurityLoading] = useState(false);
  const [seaServiceLoading, setSeaServiceLoading] = useState(false);

  // 1. Personal & Contact state
  const nameParts = (user?.name || "").trim().split(" ");
  const initialFirstName = user?.profile?.firstName || user?.firstName || nameParts[0] || "";
  const initialLastName = user?.profile?.lastName || user?.lastName || nameParts.slice(1).join(" ") || "";

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPhotoRemoved, setIsPhotoRemoved] = useState<boolean>(false);

  const [personalForm, setPersonalForm] = useState({
    firstName: initialFirstName,
    lastName: initialLastName,
    email: user?.email || user?.profile?.email || "",
    phone: user?.phone || user?.profile?.phone || "",
    alternatePhone: user?.profile?.alternatePhone || "",
    dob: user?.profile?.dob || "",
    placeOfBirth: user?.profile?.placeOfBirth || "",
    address: user?.profile?.address || "",
    city: user?.profile?.city || "",
    state: user?.profile?.state || "",
    country: user?.profile?.country || "India",
    indosNumber: user?.profile?.indosNumber || "",
    profilePicture: user?.profile?.profilePicture || user?.profilePicture || "",
  });

  // Re-sync form state when user object updates
  React.useEffect(() => {
    if (user) {
      const parts = (user.name || "").trim().split(" ");
      const savedPhoto = user.profile?.profilePicture || user.profilePicture || "";
      setPersonalForm((prev) => ({
        firstName: user.profile?.firstName || user.firstName || parts[0] || "",
        lastName: user.profile?.lastName || user.lastName || parts.slice(1).join(" ") || "",
        email: user.email || user.profile?.email || "",
        phone: user.phone || user.profile?.phone || "",
        alternatePhone: user.profile?.alternatePhone || "",
        dob: user.profile?.dob || "",
        placeOfBirth: user.profile?.placeOfBirth || "",
        address: user.profile?.address || "",
        city: user.profile?.city || "",
        state: user.profile?.state || "",
        country: user.profile?.country || "India",
        indosNumber: user.profile?.indosNumber || "",
        profilePicture: selectedFile ? prev.profilePicture : (isPhotoRemoved ? "" : savedPhoto),
      }));
    }
  }, [user, selectedFile, isPhotoRemoved]);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image format
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type.toLowerCase())) {
      alert("Invalid image format. Please upload a JPG, JPEG, PNG, or WEBP image.");
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB. Please choose a smaller image.");
      return;
    }

    setSelectedFile(file);
    setIsPhotoRemoved(false);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPersonalForm((prev) => ({ ...prev, profilePicture: reader.result as string }));
      }
    };
    reader.onerror = () => {
      alert("Failed to read the selected image file. Please try again.");
    };
    reader.readAsDataURL(file);

    // Reset input so same file can be re-selected if desired
    e.target.value = "";
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setIsPhotoRemoved(true);
    setPersonalForm((prev) => ({ ...prev, profilePicture: "" }));
  };

  const validatePersonalForm = () => {
    const errors: Record<string, string> = {};
    if (!personalForm.firstName.trim()) errors.firstName = "First Name is required.";
    if (!personalForm.lastName.trim()) errors.lastName = "Last Name is required.";
    if (!personalForm.email.trim()) {
      errors.email = "Email Address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalForm.email.trim())) {
      errors.email = "Invalid email format.";
    }
    if (!personalForm.phone.trim()) errors.phone = "Mobile Number is required.";
    if (!personalForm.dob) errors.dob = "Date of Birth is required.";
    if (!personalForm.placeOfBirth.trim()) errors.placeOfBirth = "Place of Birth is required.";
    if (!personalForm.address.trim()) errors.address = "Address is required.";
    if (!personalForm.city.trim()) errors.city = "City is required.";
    if (!personalForm.state.trim()) errors.state = "State is required.";
    if (!personalForm.country.trim()) errors.country = "Country is required.";
    if (!personalForm.indosNumber.trim()) errors.indosNumber = "INDOS Number is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 2. Emergency Contact state
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
    if (!validatePersonalForm()) {
      alert("Please correct the validation errors in the form before saving.");
      return;
    }
    setProfileLoading(true);

    try {
      let finalPhotoUrl = personalForm.profilePicture;

      // 1. Upload photo if newly selected
      if (selectedFile) {
        try {
          finalPhotoUrl = await uploadProfilePhoto(selectedFile);
        } catch (uploadErr: any) {
          alert("Profile photo upload failed. Please try again.");
          setProfileLoading(false);
          return;
        }
      } else if (isPhotoRemoved) {
        finalPhotoUrl = "";
      }

      // 2. Save full profile with final photo URL
      await updateProfile({
        ...personalForm,
        profilePicture: finalPhotoUrl,
      });

      setSelectedFile(null);
      setIsPhotoRemoved(false);
      setPersonalForm((prev) => ({ ...prev, profilePicture: finalPhotoUrl }));

      alert("Profile updated successfully!");
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
          {(personalForm.profilePicture || user?.profile?.profilePicture || user?.profilePicture) ? (
            <img
              src={personalForm.profilePicture || user?.profile?.profilePicture || user?.profilePicture}
              alt="Profile Avatar"
              className="w-20 h-20 rounded-full object-cover border-2 border-[#3b71cb] dark:border-cyan-500 mx-auto shadow-md"
            />
          ) : (
            <div className={`w-20 h-20 rounded-full flex items-center justify-center font-bold text-white text-3xl mx-auto shadow-md ${
              isDark ? "bg-cyan-600" : "bg-[#3b71cb]"
            }`}>
              {user?.name?.charAt(0) || "S"}
            </div>
          )}
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
            
            {/* Profile Photo Upload Section */}
            <div className="border-b border-gray-800/20 dark:border-gray-800/40 pb-5">
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={handlePhotoUpload}
                className="hidden"
                id="profile-photo-upload"
              />
              <div className="flex items-center justify-between gap-4">
                {/* Larger Circular Avatar Preview on Left */}
                {personalForm.profilePicture ? (
                  <img
                    src={personalForm.profilePicture}
                    alt="Profile Avatar Preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-[#3b71cb] dark:border-cyan-500 shadow-sm shrink-0"
                  />
                ) : (
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center font-bold text-white text-2xl shadow-sm shrink-0 ${
                      isDark ? "bg-cyan-600" : "bg-[#3b71cb]"
                    }`}
                  >
                    {personalForm.firstName?.charAt(0) || user?.name?.charAt(0) || "S"}
                  </div>
                )}

                {/* Upload Photo Button Aligned to Far Right */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#3b71cb] hover:bg-[#2c5fb3] text-white transition-all shadow-sm cursor-pointer active:scale-95 shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    {personalForm.profilePicture ? "Change Photo" : "Upload Photo"}
                  </button>
                  {personalForm.profilePicture && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="text-xs font-bold text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 transition-colors cursor-pointer px-2 py-1 shrink-0"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {/* First Name */}
              <div className="space-y-1.5">
                <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-800"}`}>First Name *</label>
                <input
                  type="text"
                  required
                  value={personalForm.firstName}
                  onChange={(e) => setPersonalForm({ ...personalForm, firstName: e.target.value })}
                  className={`w-full p-3 text-xs rounded-xl border outline-none ${
                    formErrors.firstName ? "border-red-500" : isDark ? "bg-[#0B2540] border-gray-800 text-white placeholder:text-slate-500 focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-900 font-medium placeholder:text-slate-500 focus:border-[#3b71cb]"
                  }`}
                />
                {formErrors.firstName && <p className="text-[10px] text-red-400 font-semibold">{formErrors.firstName}</p>}
              </div>

              {/* Last Name */}
              <div className="space-y-1.5">
                <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-800"}`}>Last Name *</label>
                <input
                  type="text"
                  required
                  value={personalForm.lastName}
                  onChange={(e) => setPersonalForm({ ...personalForm, lastName: e.target.value })}
                  className={`w-full p-3 text-xs rounded-xl border outline-none ${
                    formErrors.lastName ? "border-red-500" : isDark ? "bg-[#0B2540] border-gray-800 text-white placeholder:text-slate-500 focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-900 font-medium placeholder:text-slate-500 focus:border-[#3b71cb]"
                  }`}
                />
                {formErrors.lastName && <p className="text-[10px] text-red-400 font-semibold">{formErrors.lastName}</p>}
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-800"}`}>Email Address *</label>
                <input
                  type="email"
                  required
                  value={personalForm.email}
                  onChange={(e) => setPersonalForm({ ...personalForm, email: e.target.value })}
                  className={`w-full p-3 text-xs rounded-xl border outline-none ${
                    formErrors.email ? "border-red-500" : isDark ? "bg-[#0B2540] border-gray-800 text-white placeholder:text-slate-500 focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-900 font-medium placeholder:text-slate-500 focus:border-[#3b71cb]"
                  }`}
                />
                {formErrors.email && <p className="text-[10px] text-red-400 font-semibold">{formErrors.email}</p>}
              </div>

              {/* Mobile Number */}
              <div className="space-y-1.5">
                <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-800"}`}>Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={personalForm.phone}
                  onChange={(e) => setPersonalForm({ ...personalForm, phone: e.target.value })}
                  className={`w-full p-3 text-xs rounded-xl border outline-none ${
                    formErrors.phone ? "border-red-500" : isDark ? "bg-[#0B2540] border-gray-800 text-white placeholder:text-slate-500 focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-900 font-medium placeholder:text-slate-500 focus:border-[#3b71cb]"
                  }`}
                />
                {formErrors.phone && <p className="text-[10px] text-red-400 font-semibold">{formErrors.phone}</p>}
              </div>

              {/* Alternate Mobile Number */}
              <div className="space-y-1.5">
                <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-800"}`}>Alternate Mobile Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 00000"
                  value={personalForm.alternatePhone}
                  onChange={(e) => setPersonalForm({ ...personalForm, alternatePhone: e.target.value })}
                  className={`w-full p-3 text-xs rounded-xl border outline-none ${
                    isDark ? "bg-[#0B2540] border-gray-800 text-white placeholder:text-slate-500 focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-900 font-medium placeholder:text-slate-500 focus:border-[#3b71cb]"
                  }`}
                />
              </div>

              {/* Date of Birth */}
              <div className="space-y-1.5">
                <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-800"}`}>Date of Birth *</label>
                <input
                  type="date"
                  required
                  value={personalForm.dob}
                  onChange={(e) => setPersonalForm({ ...personalForm, dob: e.target.value })}
                  className={`w-full p-3 text-xs rounded-xl border outline-none ${
                    formErrors.dob ? "border-red-500" : isDark ? "bg-[#0B2540] border-gray-800 text-white placeholder:text-slate-500 focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-900 font-medium placeholder:text-slate-500 focus:border-[#3b71cb]"
                  }`}
                />
                {formErrors.dob && <p className="text-[10px] text-red-400 font-semibold">{formErrors.dob}</p>}
              </div>

              {/* Place of Birth */}
              <div className="space-y-1.5">
                <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-800"}`}>Place of Birth *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mumbai, Maharashtra"
                  value={personalForm.placeOfBirth}
                  onChange={(e) => setPersonalForm({ ...personalForm, placeOfBirth: e.target.value })}
                  className={`w-full p-3 text-xs rounded-xl border outline-none ${
                    formErrors.placeOfBirth ? "border-red-500" : isDark ? "bg-[#0B2540] border-gray-800 text-white placeholder:text-slate-500 focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-900 font-medium placeholder:text-slate-500 focus:border-[#3b71cb]"
                  }`}
                />
                {formErrors.placeOfBirth && <p className="text-[10px] text-red-400 font-semibold">{formErrors.placeOfBirth}</p>}
              </div>

              {/* INDoS Number */}
              <div className="space-y-1.5">
                <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-800"}`}>INDOS Number *</label>
                <input
                  type="text"
                  required
                  placeholder="22GL4567"
                  value={personalForm.indosNumber}
                  onChange={(e) => setPersonalForm({ ...personalForm, indosNumber: e.target.value })}
                  className={`w-full p-3 text-xs rounded-xl border outline-none ${
                    formErrors.indosNumber ? "border-red-500" : isDark ? "bg-[#0B2540] border-gray-800 text-white placeholder:text-slate-500 focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-900 font-medium placeholder:text-slate-500 focus:border-[#3b71cb]"
                  }`}
                />
                {formErrors.indosNumber && <p className="text-[10px] text-red-400 font-semibold">{formErrors.indosNumber}</p>}
              </div>

              {/* Address */}
              <div className="space-y-1.5 md:col-span-2">
                <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-800"}`}>Address *</label>
                <input
                  type="text"
                  required
                  placeholder="Street address / House No."
                  value={personalForm.address}
                  onChange={(e) => setPersonalForm({ ...personalForm, address: e.target.value })}
                  className={`w-full p-3 text-xs rounded-xl border outline-none ${
                    formErrors.address ? "border-red-500" : isDark ? "bg-[#0B2540] border-gray-800 text-white placeholder:text-slate-500 focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-900 font-medium placeholder:text-slate-500 focus:border-[#3b71cb]"
                  }`}
                />
                {formErrors.address && <p className="text-[10px] text-red-400 font-semibold">{formErrors.address}</p>}
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-800"}`}>City *</label>
                <input
                  type="text"
                  required
                  placeholder="Mumbai"
                  value={personalForm.city}
                  onChange={(e) => setPersonalForm({ ...personalForm, city: e.target.value })}
                  className={`w-full p-3 text-xs rounded-xl border outline-none ${
                    formErrors.city ? "border-red-500" : isDark ? "bg-[#0B2540] border-gray-800 text-white placeholder:text-slate-500 focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-900 font-medium placeholder:text-slate-500 focus:border-[#3b71cb]"
                  }`}
                />
                {formErrors.city && <p className="text-[10px] text-red-400 font-semibold">{formErrors.city}</p>}
              </div>

              {/* State */}
              <div className="space-y-1.5">
                <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-800"}`}>State *</label>
                <input
                  type="text"
                  required
                  placeholder="Maharashtra"
                  value={personalForm.state}
                  onChange={(e) => setPersonalForm({ ...personalForm, state: e.target.value })}
                  className={`w-full p-3 text-xs rounded-xl border outline-none ${
                    formErrors.state ? "border-red-500" : isDark ? "bg-[#0B2540] border-gray-800 text-white placeholder:text-slate-500 focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-900 font-medium placeholder:text-slate-500 focus:border-[#3b71cb]"
                  }`}
                />
                {formErrors.state && <p className="text-[10px] text-red-400 font-semibold">{formErrors.state}</p>}
              </div>

              {/* Country */}
              <div className="space-y-1.5 md:col-span-2">
                <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-800"}`}>Country *</label>
                <input
                  type="text"
                  required
                  placeholder="India"
                  value={personalForm.country}
                  onChange={(e) => setPersonalForm({ ...personalForm, country: e.target.value })}
                  className={`w-full p-3 text-xs rounded-xl border outline-none ${
                    formErrors.country ? "border-red-500" : isDark ? "bg-[#0B2540] border-gray-800 text-white placeholder:text-slate-500 focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-900 font-medium placeholder:text-slate-500 focus:border-[#3b71cb]"
                  }`}
                />
                {formErrors.country && <p className="text-[10px] text-red-400 font-semibold">{formErrors.country}</p>}
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
                    <label className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-800"}`}>Vessel Name</label>
                    <input
                      type="text"
                      required
                      value={seaServiceForm.vesselName}
                      onChange={(e) => setSeaServiceForm({ ...seaServiceForm, vesselName: e.target.value })}
                      className={`w-full p-2.5 text-xs rounded-xl border outline-none ${
                        isDark ? "bg-[#0B2540] border-gray-800 text-white placeholder:text-slate-500 focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-900 font-medium placeholder:text-slate-500 focus:border-[#3b71cb]"
                      }`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-800"}`}>IMO Number</label>
                    <input
                      type="text"
                      required
                      value={seaServiceForm.imoNumber}
                      onChange={(e) => setSeaServiceForm({ ...seaServiceForm, imoNumber: e.target.value })}
                      className={`w-full p-2.5 text-xs rounded-xl border outline-none ${
                        isDark ? "bg-[#0B2540] border-gray-800 text-white placeholder:text-slate-500 focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-900 font-medium placeholder:text-slate-500 focus:border-[#3b71cb]"
                      }`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-800"}`}>Rank/Capacity</label>
                    <input
                      type="text"
                      required
                      placeholder="Third Officer"
                      value={seaServiceForm.rank}
                      onChange={(e) => setSeaServiceForm({ ...seaServiceForm, rank: e.target.value })}
                      className={`w-full p-2.5 text-xs rounded-xl border outline-none ${
                        isDark ? "bg-[#0B2540] border-gray-800 text-white placeholder:text-slate-500 focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-900 font-medium placeholder:text-slate-500 focus:border-[#3b71cb]"
                      }`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-800"}`}>Shipping Company</label>
                    <input
                      type="text"
                      required
                      value={seaServiceForm.company}
                      onChange={(e) => setSeaServiceForm({ ...seaServiceForm, company: e.target.value })}
                      className={`w-full p-2.5 text-xs rounded-xl border outline-none ${
                        isDark ? "bg-[#0B2540] border-gray-800 text-white placeholder:text-slate-500 focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-900 font-medium placeholder:text-slate-500 focus:border-[#3b71cb]"
                      }`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-800"}`}>Sign-on Date</label>
                    <input
                      type="date"
                      required
                      value={seaServiceForm.signOn}
                      onChange={(e) => setSeaServiceForm({ ...seaServiceForm, signOn: e.target.value })}
                      className={`w-full p-2.5 text-xs rounded-xl border outline-none ${
                        isDark ? "bg-[#0B2540] border-gray-800 text-white placeholder:text-slate-500 focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-900 font-medium placeholder:text-slate-500 focus:border-[#3b71cb]"
                      }`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-800"}`}>Sign-off Date</label>
                    <input
                      type="date"
                      required
                      value={seaServiceForm.signOff}
                      onChange={(e) => setSeaServiceForm({ ...seaServiceForm, signOff: e.target.value })}
                      className={`w-full p-2.5 text-xs rounded-xl border outline-none ${
                        isDark ? "bg-[#0B2540] border-gray-800 text-white placeholder:text-slate-500 focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-900 font-medium placeholder:text-slate-500 focus:border-[#3b71cb]"
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
                <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-800"}`}>Contact Name</label>
                <input
                  type="text"
                  required
                  value={emergencyForm.contactName}
                  onChange={(e) => setEmergencyForm({ ...emergencyForm, contactName: e.target.value })}
                  className={`w-full p-3 text-xs rounded-xl border outline-none ${
                    isDark ? "bg-[#0B2540] border-gray-800 text-white placeholder:text-slate-500 focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-900 font-medium placeholder:text-slate-500 focus:border-[#3b71cb]"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-800"}`}>Relationship</label>
                <input
                  type="text"
                  required
                  value={emergencyForm.relationship}
                  onChange={(e) => setEmergencyForm({ ...emergencyForm, relationship: e.target.value })}
                  className={`w-full p-3 text-xs rounded-xl border outline-none ${
                    isDark ? "bg-[#0B2540] border-gray-800 text-white placeholder:text-slate-500 focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-900 font-medium placeholder:text-slate-500 focus:border-[#3b71cb]"
                  }`}
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-800"}`}>Contact Phone Number</label>
                <input
                  type="tel"
                  required
                  value={emergencyForm.contactPhone}
                  onChange={(e) => setEmergencyForm({ ...emergencyForm, contactPhone: e.target.value })}
                  className={`w-full p-3 text-xs rounded-xl border outline-none ${
                    isDark ? "bg-[#0B2540] border-gray-800 text-white placeholder:text-slate-500 focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-900 font-medium placeholder:text-slate-500 focus:border-[#3b71cb]"
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
                <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-800"}`}>Current Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={securityForm.currentPassword}
                  onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                  className={`w-full p-3 text-xs rounded-xl border outline-none ${
                    isDark ? "bg-[#0B2540] border-gray-800 text-white placeholder:text-slate-500 focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-900 font-medium placeholder:text-slate-500 focus:border-[#3b71cb]"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-800"}`}>New Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={securityForm.newPassword}
                  onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                  className={`w-full p-3 text-xs rounded-xl border outline-none ${
                    isDark ? "bg-[#0B2540] border-gray-800 text-white placeholder:text-slate-500 focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-900 font-medium placeholder:text-slate-500 focus:border-[#3b71cb]"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-800"}`}>Confirm New Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={securityForm.confirmPassword}
                  onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                  className={`w-full p-3 text-xs rounded-xl border outline-none ${
                    isDark ? "bg-[#0B2540] border-gray-800 text-white placeholder:text-slate-500 focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-900 font-medium placeholder:text-slate-500 focus:border-[#3b71cb]"
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

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="p-8 animate-pulse text-sm text-slate-400">Loading Profile...</div>}>
      <ProfileContent />
    </Suspense>
  );
}

