"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { agentService } from "@/services/agent.service";
import { useTheme } from "@/providers/theme-provider";
import { setCookie } from "@/lib/axios";
import {
  Anchor, CheckCircle2, ChevronRight, FileText,
  Upload, User, ShieldCheck, AlertCircle, Sparkles
} from "lucide-react";

export default function OnboardingPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Form State
  const [referralCode, setReferralCode] = useState("");
  
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    alternatePhone: "",
    agencyName: "",
    officeAddress: "",
    city: "",
    state: "",
    pinCode: "",
    agencyCity: "",
    agencyState: "",
    agencyPinCode: ""
  });

  const [documents, setDocuments] = useState({
    passport: { file: null as File | null, number: "", issue: "", expiry: "", place: "" },
    cdc: { file: null as File | null, number: "", issue: "", expiry: "", place: "" },
    aadhaar: { file: null as File | null, number: "" },
    pan: { file: null as File | null, number: "" },
    cancelledCheque: { file: null as File | null },
    ownerPhoto: { file: null as File | null },
    officePhotos: { file: null as File | null }
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleDocFileChange = (category: keyof typeof documents, file: File | null) => {
    setDocuments({
      ...documents,
      [category]: { ...documents[category], file }
    });
  };

  const handleDocTextChange = (category: "passport" | "cdc" | "aadhaar" | "pan", field: string, value: string) => {
    setDocuments({
      ...documents,
      [category]: { ...documents[category], [field]: value }
    });
  };

  // Step Navigations
  const nextStep = () => {
    setErrorMsg("");
    if (step === 1) {
      const codeClean = referralCode.trim().toUpperCase();
      if (!codeClean) {
        setErrorMsg("Referral code is required.");
        return;
      }
      if (codeClean.length < 3) {
        setErrorMsg("Referral code must be at least 3 characters.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!profile.name || !profile.phone || !profile.agencyName || !profile.officeAddress) {
        setErrorMsg("Please fill out all mandatory fields marked with an asterisk (*).");
        return;
      }
      setStep(3);
    }
  };

  const prevStep = () => {
    setErrorMsg("");
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleCompleteOnboarding = async () => {
    setErrorMsg("");
    setLoading(true);
    try {
      const codeClean = referralCode.trim().toUpperCase();
      
      // 1. Submit Onboarding Data to Backend (Uniqueness and immutability checked here)
      await agentService.onboard({
        referralCode: codeClean,
        name: profile.name,
        phone: profile.phone,
        alternatePhone: profile.alternatePhone || null,
        agencyName: profile.agencyName,
        officeAddress: profile.officeAddress,
        city: profile.city || profile.agencyCity,
        state: profile.state || profile.agencyState,
        pinCode: profile.pinCode || profile.agencyPinCode,
        agencyCity: profile.agencyCity || profile.city,
        agencyState: profile.agencyState || profile.state,
        agencyPinCode: profile.agencyPinCode || profile.pinCode
      });

      // 2. Upload verification documents (Simulated or REST)
      const docCategories = Object.keys(documents) as (keyof typeof documents)[];
      for (const cat of docCategories) {
        const doc = documents[cat];
        if (doc.file) {
          let expiryStr = "";
          if (cat === "passport" || cat === "cdc") {
            expiryStr = (doc as any).expiry || "";
          }
          await agentService.uploadDocument(
            cat,
            expiryStr || undefined,
            doc.file.name
          );
        }
      }

      // 3. Update onboarding status cookie to Active and redirect
      setCookie("onboarding_status", "Active");
      router.push("/agent/dashboard");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Onboarding failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fadeIn py-10">
      
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-10 space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/10">
          <Anchor className="w-6 h-6 text-white animate-pulse" strokeWidth={2.5} />
        </div>
        <div>
          <span className={`text-[10px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full ${
            isDark ? "bg-cyan-500/10 text-cyan-400" : "bg-cyan-50 text-cyan-600"
          }`}>
            ⚓ Partner Onboarding Wizard
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-3">
            Setup Your Thalassic Agency
          </h1>
          <p className={`text-xs mt-1.5 max-w-md ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Complete your onboarding checklist to activate your partner status, set your referral link, and start earning commissions.
          </p>
        </div>
      </div>

      {/* Steps Indicator Progress Bar */}
      <div className="mb-10 px-4">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-3.5">
          <span className={step >= 1 ? (isDark ? "text-cyan-400" : "text-cyan-600") : ""}>Step 1: Referral Link</span>
          <span className={step >= 2 ? (isDark ? "text-cyan-400" : "text-cyan-600") : ""}>Step 2: Agency Profile</span>
          <span className={step >= 3 ? (isDark ? "text-cyan-400" : "text-cyan-600") : ""}>Step 3: Verification Docs</span>
        </div>
        <div className={`w-full h-1.5 rounded-full overflow-hidden border ${isDark ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200"}`}>
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Form Body Card */}
      <div className={`rounded-3xl border p-6 md:p-8 shadow-xl relative overflow-hidden ${
        isDark ? "bg-[#0a1122]/70 border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-white backdrop-blur-xl" : "bg-white/80 border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-slate-900 backdrop-blur-xl"
      }`}>
        
        {/* Error Alert Box */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-3 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold">Requirement Missing or Conflict</p>
              <p className="mt-0.5 opacity-90">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* STEP 1: REFERRAL CODE */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                Select Your Unique Referral Code
              </h2>
              <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Your referral code is the permanent identifier that will be appended to your links and scanned QR codes. Once created, it **cannot be modified**.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                Unique Referral Code *
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                    ref=
                  </span>
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                    placeholder="E.G. PACIFIC20"
                    maxLength={15}
                    className={`w-full pl-12 pr-4 py-3 text-sm font-black tracking-widest uppercase rounded-xl border outline-none transition-colors ${
                      isDark
                        ? "bg-[#0b182d] border-slate-800 text-white focus:border-cyan-500"
                        : "bg-slate-50 border-slate-200 text-slate-800 focus:border-cyan-600"
                    }`}
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-500 italic mt-1">
                Alphanumeric characters only. Must be unique across all Thalassic placement agents.
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: PROFILE DETAILS */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                <User className="w-5 h-5 text-cyan-400" />
                Fill Agency Profile Details
              </h2>
              <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Provide your official agency name, contact details, and premises addresses for operational tracking.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">Agency Owner Name *</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  placeholder="E.g. Captain Manning Manager"
                  className={`w-full px-4 py-2.5 text-xs rounded-xl border outline-none ${
                    isDark ? "bg-[#0b182d] border-slate-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">Owner Mobile *</label>
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  placeholder="E.g. +91 99887 76655"
                  className={`w-full px-4 py-2.5 text-xs rounded-xl border outline-none ${
                    isDark ? "bg-[#0b182d] border-slate-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">Agency Company Name *</label>
                <input
                  type="text"
                  name="agencyName"
                  value={profile.agencyName}
                  onChange={handleProfileChange}
                  placeholder="E.g. Oceanic Manning Agency"
                  className={`w-full px-4 py-2.5 text-xs rounded-xl border outline-none ${
                    isDark ? "bg-[#0b182d] border-slate-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">Alternate Phone (Optional)</label>
                <input
                  type="text"
                  name="alternatePhone"
                  value={profile.alternatePhone}
                  onChange={handleProfileChange}
                  placeholder="E.g. +91 99887 76656"
                  className={`w-full px-4 py-2.5 text-xs rounded-xl border outline-none ${
                    isDark ? "bg-[#0b182d] border-slate-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                  }`}
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">Office Premises Address *</label>
                <textarea
                  name="officeAddress"
                  value={profile.officeAddress}
                  onChange={handleProfileChange}
                  placeholder="Suite 404, Marine Trade Tower, Mumbai"
                  rows={2}
                  className={`w-full px-4 py-2.5 text-xs rounded-xl border outline-none ${
                    isDark ? "bg-[#0b182d] border-slate-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">City *</label>
                <input
                  type="text"
                  name="agencyCity"
                  value={profile.agencyCity}
                  onChange={handleProfileChange}
                  placeholder="Mumbai"
                  className={`w-full px-4 py-2.5 text-xs rounded-xl border outline-none ${
                    isDark ? "bg-[#0b182d] border-slate-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">State *</label>
                <input
                  type="text"
                  name="agencyState"
                  value={profile.agencyState}
                  onChange={handleProfileChange}
                  placeholder="Maharashtra"
                  className={`w-full px-4 py-2.5 text-xs rounded-xl border outline-none ${
                    isDark ? "bg-[#0b182d] border-slate-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">PIN Code *</label>
                <input
                  type="text"
                  name="agencyPinCode"
                  value={profile.agencyPinCode}
                  onChange={handleProfileChange}
                  placeholder="400001"
                  className={`w-full px-4 py-2.5 text-xs rounded-xl border outline-none ${
                    isDark ? "bg-[#0b182d] border-slate-800 text-white focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#3b71cb]"
                  }`}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: DOCUMENTS */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                Upload Verification Credentials
              </h2>
              <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Upload scanned copies of identity and banking documents. The admin will review and verify them to finalize your onboarding.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              {/* Passport Slot */}
              <div className={`p-4 rounded-2xl border flex flex-col justify-between ${isDark ? "bg-slate-950/20 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-xs">Owner Passport Copy *</span>
                    {documents.passport.file && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  </div>
                  <input
                    type="text"
                    placeholder="Passport Number"
                    value={documents.passport.number}
                    onChange={(e) => handleDocTextChange("passport", "number", e.target.value)}
                    className={`w-full px-3 py-1.5 text-xs rounded-lg border outline-none ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"}`}
                  />
                  <input
                    type="date"
                    placeholder="Expiry Date"
                    value={documents.passport.expiry}
                    onChange={(e) => handleDocTextChange("passport", "expiry", e.target.value)}
                    className={`w-full px-3 py-1.5 text-xs rounded-lg border outline-none ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"}`}
                  />
                  <label className="w-full flex items-center justify-center gap-2 py-2 border border-dashed rounded-lg text-xs cursor-pointer hover:bg-cyan-500/5 transition-colors">
                    <Upload className="w-3.5 h-3.5" /> {documents.passport.file ? "Change File" : "Select File"}
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="sr-only"
                      onChange={(e) => handleDocFileChange("passport", e.target.files?.[0] || null)}
                    />
                  </label>
                  {documents.passport.file && <p className="text-[10px] text-slate-500 truncate">{documents.passport.file.name}</p>}
                </div>
              </div>

              {/* CDC Slot */}
              <div className={`p-4 rounded-2xl border flex flex-col justify-between ${isDark ? "bg-slate-950/20 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-xs">CDC Booklet Copy *</span>
                    {documents.cdc.file && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  </div>
                  <input
                    type="text"
                    placeholder="CDC Booklet Number"
                    value={documents.cdc.number}
                    onChange={(e) => handleDocTextChange("cdc", "number", e.target.value)}
                    className={`w-full px-3 py-1.5 text-xs rounded-lg border outline-none ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"}`}
                  />
                  <input
                    type="date"
                    placeholder="Expiry Date"
                    value={documents.cdc.expiry}
                    onChange={(e) => handleDocTextChange("cdc", "expiry", e.target.value)}
                    className={`w-full px-3 py-1.5 text-xs rounded-lg border outline-none ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"}`}
                  />
                  <label className="w-full flex items-center justify-center gap-2 py-2 border border-dashed rounded-lg text-xs cursor-pointer hover:bg-cyan-500/5 transition-colors">
                    <Upload className="w-3.5 h-3.5" /> {documents.cdc.file ? "Change File" : "Select File"}
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="sr-only"
                      onChange={(e) => handleDocFileChange("cdc", e.target.files?.[0] || null)}
                    />
                  </label>
                  {documents.cdc.file && <p className="text-[10px] text-slate-500 truncate">{documents.cdc.file.name}</p>}
                </div>
              </div>

              {/* Aadhaar Card */}
              <div className={`p-4 rounded-2xl border flex flex-col justify-between ${isDark ? "bg-slate-950/20 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-xs">Aadhaar Card Copy *</span>
                    {documents.aadhaar.file && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  </div>
                  <input
                    type="text"
                    placeholder="Aadhaar Card Number"
                    value={documents.aadhaar.number}
                    onChange={(e) => handleDocTextChange("aadhaar", "number", e.target.value)}
                    className={`w-full px-3 py-1.5 text-xs rounded-lg border outline-none ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"}`}
                  />
                  <label className="w-full flex items-center justify-center gap-2 py-2 border border-dashed rounded-lg text-xs cursor-pointer hover:bg-cyan-500/5 transition-colors">
                    <Upload className="w-3.5 h-3.5" /> {documents.aadhaar.file ? "Change File" : "Select File"}
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="sr-only"
                      onChange={(e) => handleDocFileChange("aadhaar", e.target.files?.[0] || null)}
                    />
                  </label>
                  {documents.aadhaar.file && <p className="text-[10px] text-slate-500 truncate">{documents.aadhaar.file.name}</p>}
                </div>
              </div>

              {/* PAN Card */}
              <div className={`p-4 rounded-2xl border flex flex-col justify-between ${isDark ? "bg-slate-950/20 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-xs">PAN Card Copy *</span>
                    {documents.pan.file && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  </div>
                  <input
                    type="text"
                    placeholder="PAN Card Number"
                    value={documents.pan.number}
                    onChange={(e) => handleDocTextChange("pan", "number", e.target.value)}
                    className={`w-full px-3 py-1.5 text-xs rounded-lg border outline-none ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"}`}
                  />
                  <label className="w-full flex items-center justify-center gap-2 py-2 border border-dashed rounded-lg text-xs cursor-pointer hover:bg-cyan-500/5 transition-colors">
                    <Upload className="w-3.5 h-3.5" /> {documents.pan.file ? "Change File" : "Select File"}
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="sr-only"
                      onChange={(e) => handleDocFileChange("pan", e.target.files?.[0] || null)}
                    />
                  </label>
                  {documents.pan.file && <p className="text-[10px] text-slate-500 truncate">{documents.pan.file.name}</p>}
                </div>
              </div>

              {/* Cancelled Cheque */}
              <div className={`p-4 rounded-2xl border flex flex-col justify-between ${isDark ? "bg-slate-950/20 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-xs">Cancelled Cheque (Bank Verification) *</span>
                    {documents.cancelledCheque.file && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  </div>
                  <label className="w-full flex items-center justify-center gap-2 py-2 border border-dashed rounded-lg text-xs cursor-pointer hover:bg-cyan-500/5 transition-colors">
                    <Upload className="w-3.5 h-3.5" /> {documents.cancelledCheque.file ? "Change File" : "Select File"}
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="sr-only"
                      onChange={(e) => handleDocFileChange("cancelledCheque", e.target.files?.[0] || null)}
                    />
                  </label>
                  {documents.cancelledCheque.file && <p className="text-[10px] text-slate-500 truncate">{documents.cancelledCheque.file.name}</p>}
                </div>
              </div>

              {/* Owner Photo */}
              <div className={`p-4 rounded-2xl border flex flex-col justify-between ${isDark ? "bg-slate-950/20 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-xs">Agency Owner Photograph *</span>
                    {documents.ownerPhoto.file && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  </div>
                  <label className="w-full flex items-center justify-center gap-2 py-2 border border-dashed rounded-lg text-xs cursor-pointer hover:bg-cyan-500/5 transition-colors">
                    <Upload className="w-3.5 h-3.5" /> {documents.ownerPhoto.file ? "Change File" : "Select File"}
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      className="sr-only"
                      onChange={(e) => handleDocFileChange("ownerPhoto", e.target.files?.[0] || null)}
                    />
                  </label>
                  {documents.ownerPhoto.file && <p className="text-[10px] text-slate-500 truncate">{documents.ownerPhoto.file.name}</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Buttons Controls */}
        <div className="mt-8 pt-5 border-t border-slate-800/40 flex justify-between">
          {step > 1 ? (
            <button
              onClick={prevStep}
              disabled={loading}
              className={`px-5 py-2 text-xs font-bold rounded-xl border transition-all ${
                isDark ? "border-slate-800 text-slate-400 hover:bg-white/5" : "border-slate-350 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Previous Step
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={nextStep}
              className={`px-5 py-2 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 ${
                isDark ? "bg-cyan-600 hover:bg-cyan-505 text-white" : "bg-[#3b71cb] hover:bg-[#2c5fb3] text-white"
              }`}
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleCompleteOnboarding}
              disabled={loading}
              className={`px-6 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 ${
                loading
                  ? "bg-slate-700 text-slate-400"
                  : isDark
                  ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:brightness-110"
                  : "bg-gradient-to-r from-[#3b71cb] to-[#2c5fb3] text-white hover:brightness-110"
              }`}
            >
              {loading ? "Completing Setup..." : "Finish Onboarding & Activate"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
