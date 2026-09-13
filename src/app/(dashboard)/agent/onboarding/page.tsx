"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { agentService } from "@/services/agent.service";
import { useTheme } from "@/providers/theme-provider";
import { setCookie } from "@/lib/axios";
import {
  CheckCircle2,
  ChevronRight,
  FileText,
  Upload,
  User,
  ShieldCheck,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export default function OnboardingPage() {
  const { theme, mounted } = useTheme();
  const isDark = mounted ? theme === "dark" : true;
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
    agencyPinCode: "",
  });

  const [documents, setDocuments] = useState({
    passport: {
      file: null as File | null,
      number: "",
      issue: "",
      expiry: "",
      place: "",
    },
    cdc: {
      file: null as File | null,
      number: "",
      issue: "",
      expiry: "",
      place: "",
    },
    aadhaar: { file: null as File | null, number: "" },
    pan: { file: null as File | null, number: "" },
    cancelledCheque: { file: null as File | null },
    ownerPhoto: { file: null as File | null },
    officePhotos: { file: null as File | null },
    officeAddressProof: { file: null as File | null },
    residentialAddressProof: { file: null as File | null },
  });

  const [termsAgreed, setTermsAgreed] = useState(false);

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleDocFileChange = (
    category: keyof typeof documents,
    file: File | null,
  ) => {
    setDocuments({
      ...documents,
      [category]: { ...documents[category], file },
    });
  };

  const handleDocTextChange = (
    category: "passport" | "cdc" | "aadhaar" | "pan",
    field: string,
    value: string,
  ) => {
    setDocuments({
      ...documents,
      [category]: { ...documents[category], [field]: value },
    });
  };

  // Step Navigations
  const nextStep = () => {
    setErrorMsg("");
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (
        !profile.name ||
        !profile.phone ||
        !profile.agencyName ||
        !profile.officeAddress
      ) {
        setErrorMsg(
          "Please fill out all mandatory fields marked with an asterisk (*).",
        );
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
    if (!termsAgreed) {
      setErrorMsg(
        "You must accept the Terms & Conditions to complete your onboarding registration.",
      );
      return;
    }
    setLoading(true);
    try {
      // 1. Submit Onboarding Data to Backend
      await agentService.onboard({
        agencyName: profile.agencyName,
        phone: profile.phone,
      });
      // ISSUE-012/013: Expanded onboarding payload removed - backend contract only accepts agencyName + phone

      // 2. Upload verification documents (Simulated or REST)
      const docCategories = Object.keys(
        documents,
      ) as (keyof typeof documents)[];
      for (const cat of docCategories) {
        const doc = documents[cat];
        if (doc.file) {
          let expiryStr = "";
          if (cat === "passport" || cat === "cdc") {
            expiryStr = (doc as any).expiry || "";
          }
          await agentService.uploadDocument(cat, doc.file, {
            documentNumber: doc.file.name,
            expiryDate: expiryStr || undefined,
          });
        }
      }

      // 3. Update onboarding status cookies to Active and redirect
      setCookie("onboarding_status", "Active");
      setCookie("onboarding_status_agent", "Active");
      router.push("/agent/dashboard");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message || "Onboarding failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fadeIn py-10">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-10 space-y-3">
        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#3D5EF6]/20 shadow-md shrink-0">
          <Image
            src="/logo.jpeg"
            alt="Hari Om Thalassic"
            width={48}
            height={48}
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Setup Your Thalassic Agency
          </h1>
          <p
            className={`text-xs mt-1.5 max-w-md ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}
          >
            Complete your onboarding checklist to activate your partner status,
            set your referral link, and start earning commissions.
          </p>
        </div>
      </div>

      {/* Steps Indicator Progress Bar */}
      <div className="mb-10 px-4">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-3.5">
          <span className={step >= 1 ? "text-[#3D5EF6]" : ""}>
            Step 1: Referral Link
          </span>
          <span className={step >= 2 ? "text-[#3D5EF6]" : ""}>
            Step 2: Agency Profile
          </span>
          <span className={step >= 3 ? "text-[#3D5EF6]" : ""}>
            Step 3: Verification Docs
          </span>
        </div>
        <div
          className={`w-full h-1.5 rounded-full overflow-hidden border ${isDark ? "bg-[#111827] border-[#1F2937]" : "bg-[#F3F4F6] border-[#E5E7EB]"}`}
        >
          <div
            className="h-full bg-[#3D5EF6] rounded-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Form Body Card */}
      <div
        className={`rounded-[16px] border-0 p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] relative overflow-hidden ${
          isDark
            ? "bg-[#0B0F19] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] text-white"
            : "bg-white text-[#111827]"
        }`}
      >
        {/* Error Alert Box */}
        {errorMsg && (
          <div
            className={`mb-6 p-4 rounded-[16px] border flex items-start gap-3 text-xs animate-shake ${isDark ? "bg-[#FEE2E2]/10 border-[#DC2626]/20 text-[#DC2626]" : "bg-[#FEE2E2] border-[#FEE2E2] text-[#DC2626]"}`}
          >
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
                <Sparkles className="w-5 h-5 text-[#3D5EF6]" />
                Automatic Referral Code Generation
              </h2>
              <p
                className={`text-xs ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}
              >
                Thalassic automatically issues a permanent, immutable referral
                identifier for your agency upon completion of onboarding
                registration.
              </p>
            </div>

            <div
              className={`p-6 rounded-[16px] border ${isDark ? "bg-[#0B0F19] border-[#1F2937]" : "bg-[#FAFAFA] border-[#E5E7EB]"} space-y-4`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#EEF1FE] dark:bg-[#3D5EF6]/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-[#3D5EF6]" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider">
                    System Generation Rules
                  </h4>
                  <p
                    className={`text-[10px] ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}
                  >
                    To keep link mappings safe and stable:
                  </p>
                </div>
              </div>

              <ul
                className={`space-y-2 text-[11px] list-disc list-inside ${isDark ? "text-slate-300" : "text-[#6B7280]"}`}
              >
                <li>
                  Generated uniquely using your agency owner name and a numeric
                  suffix (e.g. <strong>OCEAN25</strong>).
                </li>
                <li>
                  Permanently generated once, and cannot be modified under any
                  circumstances.
                </li>
                <li>
                  Used to auto-populate checkout discount parameters and
                  commission tracking headers.
                </li>
              </ul>

              <div className="pt-2 border-t border-[#E5E7EB] dark:border-[#1F2937]">
                <div
                  className={`p-3 rounded-[16px] ${isDark ? "bg-[#111827] text-slate-400" : "bg-white text-[#6B7280]"} text-center text-[10px] font-mono border border-dashed border-[#3D5EF6]/40`}
                >
                  Mock Preview:{" "}
                  <span className="text-[#3D5EF6] font-extrabold">
                    YOURNAME[YY]
                  </span>{" "}
                  (e.g. KISHAN26)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: PROFILE DETAILS */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                <User className="w-5 h-5 text-[#3D5EF6]" />
                Fill Agency Profile Details
              </h2>
              <p
                className={`text-xs ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}
              >
                Provide your official agency name, contact details, and premises
                addresses for operational tracking.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label
                  className={`text-xs font-black uppercase tracking-wider ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}
                >
                  Agency Owner Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  placeholder="E.g. Captain Manning Manager"
                  className={`w-full px-4 py-2.5 text-xs rounded-full border outline-none transition-colors duration-200 ${
                    isDark
                      ? "bg-[#0B0F19] border-[#1F2937] text-white focus:border-[#3D5EF6]"
                      : "bg-[#FAFAFA] border-[#E5E7EB] text-[#111827] focus:border-[#3D5EF6]"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  className={`text-xs font-black uppercase tracking-wider ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}
                >
                  Owner Mobile *
                </label>
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  placeholder="E.g. +91 99887 76655"
                  className={`w-full px-4 py-2.5 text-xs rounded-full border outline-none transition-colors duration-200 ${
                    isDark
                      ? "bg-[#0B0F19] border-[#1F2937] text-white focus:border-[#3D5EF6]"
                      : "bg-[#FAFAFA] border-[#E5E7EB] text-[#111827] focus:border-[#3D5EF6]"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  className={`text-xs font-black uppercase tracking-wider ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}
                >
                  Agency Company Name *
                </label>
                <input
                  type="text"
                  name="agencyName"
                  value={profile.agencyName}
                  onChange={handleProfileChange}
                  placeholder="E.g. Oceanic Manning Agency"
                  className={`w-full px-4 py-2.5 text-xs rounded-full border outline-none transition-colors duration-200 ${
                    isDark
                      ? "bg-[#0B0F19] border-[#1F2937] text-white focus:border-[#3D5EF6]"
                      : "bg-[#FAFAFA] border-[#E5E7EB] text-[#111827] focus:border-[#3D5EF6]"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  className={`text-xs font-black uppercase tracking-wider ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}
                >
                  Alternate Phone (Optional)
                </label>
                <input
                  type="text"
                  name="alternatePhone"
                  value={profile.alternatePhone}
                  onChange={handleProfileChange}
                  placeholder="E.g. +91 99887 76656"
                  className={`w-full px-4 py-2.5 text-xs rounded-full border outline-none transition-colors duration-200 ${
                    isDark
                      ? "bg-[#0B0F19] border-[#1F2937] text-white focus:border-[#3D5EF6]"
                      : "bg-[#FAFAFA] border-[#E5E7EB] text-[#111827] focus:border-[#3D5EF6]"
                  }`}
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label
                  className={`text-xs font-black uppercase tracking-wider ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}
                >
                  Office Premises Address *
                </label>
                <textarea
                  name="officeAddress"
                  value={profile.officeAddress}
                  onChange={handleProfileChange}
                  placeholder="Suite 404, Marine Trade Tower, Mumbai"
                  rows={2}
                  className={`w-full px-4 py-2.5 text-xs rounded-[16px] border outline-none transition-colors duration-200 ${
                    isDark
                      ? "bg-[#0B0F19] border-[#1F2937] text-white focus:border-[#3D5EF6]"
                      : "bg-[#FAFAFA] border-[#E5E7EB] text-[#111827] focus:border-[#3D5EF6]"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  className={`text-xs font-black uppercase tracking-wider ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}
                >
                  City *
                </label>
                <input
                  type="text"
                  name="agencyCity"
                  value={profile.agencyCity}
                  onChange={handleProfileChange}
                  placeholder="Mumbai"
                  className={`w-full px-4 py-2.5 text-xs rounded-full border outline-none transition-colors duration-200 ${
                    isDark
                      ? "bg-[#0B0F19] border-[#1F2937] text-white focus:border-[#3D5EF6]"
                      : "bg-[#FAFAFA] border-[#E5E7EB] text-[#111827] focus:border-[#3D5EF6]"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  className={`text-xs font-black uppercase tracking-wider ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}
                >
                  State *
                </label>
                <input
                  type="text"
                  name="agencyState"
                  value={profile.agencyState}
                  onChange={handleProfileChange}
                  placeholder="Maharashtra"
                  className={`w-full px-4 py-2.5 text-xs rounded-full border outline-none transition-colors duration-200 ${
                    isDark
                      ? "bg-[#0B0F19] border-[#1F2937] text-white focus:border-[#3D5EF6]"
                      : "bg-[#FAFAFA] border-[#E5E7EB] text-[#111827] focus:border-[#3D5EF6]"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  className={`text-xs font-black uppercase tracking-wider ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}
                >
                  PIN Code *
                </label>
                <input
                  type="text"
                  name="agencyPinCode"
                  value={profile.agencyPinCode}
                  onChange={handleProfileChange}
                  placeholder="400001"
                  className={`w-full px-4 py-2.5 text-xs rounded-full border outline-none transition-colors duration-200 ${
                    isDark
                      ? "bg-[#0B0F19] border-[#1F2937] text-white focus:border-[#3D5EF6]"
                      : "bg-[#FAFAFA] border-[#E5E7EB] text-[#111827] focus:border-[#3D5EF6]"
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
                <ShieldCheck className="w-5 h-5 text-[#3D5EF6]" />
                Upload Verification Credentials
              </h2>
              <p
                className={`text-xs ${isDark ? "text-slate-400" : "text-[#6B7280]"}`}
              >
                Upload scanned copies of identity and banking documents. The
                admin will review and verify them to finalize your onboarding.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Passport Slot */}
              <div
                className={`p-4 rounded-[16px] border flex flex-col justify-between ${isDark ? "bg-[#0B0F19] border-[#1F2937]" : "bg-[#FAFAFA] border-[#E5E7EB]"}`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-xs">
                      Owner Passport Copy *
                    </span>
                    {documents.passport.file && (
                      <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Passport Number"
                    value={documents.passport.number}
                    onChange={(e) =>
                      handleDocTextChange("passport", "number", e.target.value)
                    }
                    className={`w-full px-3 py-1.5 text-xs rounded-full border outline-none ${isDark ? "bg-[#111827] border-[#1F2937] text-white focus:border-[#3D5EF6]" : "bg-white border-[#E5E7EB] text-[#111827] focus:border-[#3D5EF6]"}`}
                  />
                  <input
                    type="date"
                    placeholder="Expiry Date"
                    value={documents.passport.expiry}
                    onChange={(e) =>
                      handleDocTextChange("passport", "expiry", e.target.value)
                    }
                    className={`w-full px-3 py-1.5 text-xs rounded-full border outline-none ${isDark ? "bg-[#111827] border-[#1F2937] text-white focus:border-[#3D5EF6]" : "bg-white border-[#E5E7EB] text-[#111827] focus:border-[#3D5EF6]"}`}
                  />
                  <label className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-[#E5E7EB] dark:border-[#1F2937] rounded-full text-xs cursor-pointer hover:bg-[#EEF1FE] hover:border-[#3D5EF6] hover:text-[#3D5EF6] transition-colors duration-200">
                    <Upload className="w-3.5 h-3.5" />{" "}
                    {documents.passport.file ? "Change File" : "Select File"}
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="sr-only"
                      onChange={(e) =>
                        handleDocFileChange(
                          "passport",
                          e.target.files?.[0] || null,
                        )
                      }
                    />
                  </label>
                  {documents.passport.file && (
                    <p className="text-[10px] text-[#6B7280] truncate">
                      {documents.passport.file.name}
                    </p>
                  )}
                </div>
              </div>

              {/* CDC Slot */}
              <div
                className={`p-4 rounded-[16px] border flex flex-col justify-between ${isDark ? "bg-[#0B0F19] border-[#1F2937]" : "bg-[#FAFAFA] border-[#E5E7EB]"}`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-xs">
                      CDC Booklet Copy *
                    </span>
                    {documents.cdc.file && (
                      <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="CDC Booklet Number"
                    value={documents.cdc.number}
                    onChange={(e) =>
                      handleDocTextChange("cdc", "number", e.target.value)
                    }
                    className={`w-full px-3 py-1.5 text-xs rounded-full border outline-none ${isDark ? "bg-[#111827] border-[#1F2937] text-white focus:border-[#3D5EF6]" : "bg-white border-[#E5E7EB] text-[#111827] focus:border-[#3D5EF6]"}`}
                  />
                  <input
                    type="date"
                    placeholder="Expiry Date"
                    value={documents.cdc.expiry}
                    onChange={(e) =>
                      handleDocTextChange("cdc", "expiry", e.target.value)
                    }
                    className={`w-full px-3 py-1.5 text-xs rounded-full border outline-none ${isDark ? "bg-[#111827] border-[#1F2937] text-white focus:border-[#3D5EF6]" : "bg-white border-[#E5E7EB] text-[#111827] focus:border-[#3D5EF6]"}`}
                  />
                  <label className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-[#E5E7EB] dark:border-[#1F2937] rounded-full text-xs cursor-pointer hover:bg-[#EEF1FE] hover:border-[#3D5EF6] hover:text-[#3D5EF6] transition-colors duration-200">
                    <Upload className="w-3.5 h-3.5" />{" "}
                    {documents.cdc.file ? "Change File" : "Select File"}
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="sr-only"
                      onChange={(e) =>
                        handleDocFileChange("cdc", e.target.files?.[0] || null)
                      }
                    />
                  </label>
                  {documents.cdc.file && (
                    <p className="text-[10px] text-[#6B7280] truncate">
                      {documents.cdc.file.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Aadhaar Card */}
              <div
                className={`p-4 rounded-[16px] border flex flex-col justify-between ${isDark ? "bg-[#0B0F19] border-[#1F2937]" : "bg-[#FAFAFA] border-[#E5E7EB]"}`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-xs">
                      Aadhaar Card Copy *
                    </span>
                    {documents.aadhaar.file && (
                      <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Aadhaar Card Number"
                    value={documents.aadhaar.number}
                    onChange={(e) =>
                      handleDocTextChange("aadhaar", "number", e.target.value)
                    }
                    className={`w-full px-3 py-1.5 text-xs rounded-full border outline-none ${isDark ? "bg-[#111827] border-[#1F2937] text-white focus:border-[#3D5EF6]" : "bg-white border-[#E5E7EB] text-[#111827] focus:border-[#3D5EF6]"}`}
                  />
                  <label className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-[#E5E7EB] dark:border-[#1F2937] rounded-full text-xs cursor-pointer hover:bg-[#EEF1FE] hover:border-[#3D5EF6] hover:text-[#3D5EF6] transition-colors duration-200">
                    <Upload className="w-3.5 h-3.5" />{" "}
                    {documents.aadhaar.file ? "Change File" : "Select File"}
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="sr-only"
                      onChange={(e) =>
                        handleDocFileChange(
                          "aadhaar",
                          e.target.files?.[0] || null,
                        )
                      }
                    />
                  </label>
                  {documents.aadhaar.file && (
                    <p className="text-[10px] text-[#6B7280] truncate">
                      {documents.aadhaar.file.name}
                    </p>
                  )}
                </div>
              </div>

              {/* PAN Card */}
              <div
                className={`p-4 rounded-[16px] border flex flex-col justify-between ${isDark ? "bg-[#0B0F19] border-[#1F2937]" : "bg-[#FAFAFA] border-[#E5E7EB]"}`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-xs">
                      PAN Card Copy *
                    </span>
                    {documents.pan.file && (
                      <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="PAN Card Number"
                    value={documents.pan.number}
                    onChange={(e) =>
                      handleDocTextChange("pan", "number", e.target.value)
                    }
                    className={`w-full px-3 py-1.5 text-xs rounded-full border outline-none ${isDark ? "bg-[#111827] border-[#1F2937] text-white focus:border-[#3D5EF6]" : "bg-white border-[#E5E7EB] text-[#111827] focus:border-[#3D5EF6]"}`}
                  />
                  <label className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-[#E5E7EB] dark:border-[#1F2937] rounded-full text-xs cursor-pointer hover:bg-[#EEF1FE] hover:border-[#3D5EF6] hover:text-[#3D5EF6] transition-colors duration-200">
                    <Upload className="w-3.5 h-3.5" />{" "}
                    {documents.pan.file ? "Change File" : "Select File"}
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="sr-only"
                      onChange={(e) =>
                        handleDocFileChange("pan", e.target.files?.[0] || null)
                      }
                    />
                  </label>
                  {documents.pan.file && (
                    <p className="text-[10px] text-[#6B7280] truncate">
                      {documents.pan.file.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Cancelled Cheque */}
              <div
                className={`p-4 rounded-[16px] border flex flex-col justify-between ${isDark ? "bg-[#0B0F19] border-[#1F2937]" : "bg-[#FAFAFA] border-[#E5E7EB]"}`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-xs">
                      Cancelled Cheque (Bank Verification) *
                    </span>
                    {documents.cancelledCheque.file && (
                      <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    )}
                  </div>
                  <label className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-[#E5E7EB] dark:border-[#1F2937] rounded-full text-xs cursor-pointer hover:bg-[#EEF1FE] hover:border-[#3D5EF6] hover:text-[#3D5EF6] transition-colors duration-200">
                    <Upload className="w-3.5 h-3.5" />{" "}
                    {documents.cancelledCheque.file
                      ? "Change File"
                      : "Select File"}
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="sr-only"
                      onChange={(e) =>
                        handleDocFileChange(
                          "cancelledCheque",
                          e.target.files?.[0] || null,
                        )
                      }
                    />
                  </label>
                  {documents.cancelledCheque.file && (
                    <p className="text-[10px] text-[#6B7280] truncate">
                      {documents.cancelledCheque.file.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Owner Photo */}
              <div
                className={`p-4 rounded-[16px] border flex flex-col justify-between ${isDark ? "bg-[#0B0F19] border-[#1F2937]" : "bg-[#FAFAFA] border-[#E5E7EB]"}`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-xs">
                      Agency Owner Photograph *
                    </span>
                    {documents.ownerPhoto.file && (
                      <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    )}
                  </div>
                  <label className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-[#E5E7EB] dark:border-[#1F2937] rounded-full text-xs cursor-pointer hover:bg-[#EEF1FE] hover:border-[#3D5EF6] hover:text-[#3D5EF6] transition-colors duration-200">
                    <Upload className="w-3.5 h-3.5" />{" "}
                    {documents.ownerPhoto.file ? "Change File" : "Select File"}
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      className="sr-only"
                      onChange={(e) =>
                        handleDocFileChange(
                          "ownerPhoto",
                          e.target.files?.[0] || null,
                        )
                      }
                    />
                  </label>
                  {documents.ownerPhoto.file && (
                    <p className="text-[10px] text-[#6B7280] truncate">
                      {documents.ownerPhoto.file.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Office Address Proof */}
              <div
                className={`p-4 rounded-[16px] border flex flex-col justify-between ${isDark ? "bg-[#0B0F19] border-[#1F2937]" : "bg-[#FAFAFA] border-[#E5E7EB]"}`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-xs">
                      Office Address Proof *
                    </span>
                    {documents.officeAddressProof.file && (
                      <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    )}
                  </div>
                  <label className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-[#E5E7EB] dark:border-[#1F2937] rounded-full text-xs cursor-pointer hover:bg-[#EEF1FE] hover:border-[#3D5EF6] hover:text-[#3D5EF6] transition-colors duration-200">
                    <Upload className="w-3.5 h-3.5" />{" "}
                    {documents.officeAddressProof.file
                      ? "Change File"
                      : "Select File"}
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="sr-only"
                      onChange={(e) =>
                        handleDocFileChange(
                          "officeAddressProof",
                          e.target.files?.[0] || null,
                        )
                      }
                    />
                  </label>
                  {documents.officeAddressProof.file && (
                    <p className="text-[10px] text-[#6B7280] truncate">
                      {documents.officeAddressProof.file.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Residential Address Proof */}
              <div
                className={`p-4 rounded-[16px] border flex flex-col justify-between ${isDark ? "bg-[#0B0F19] border-[#1F2937]" : "bg-[#FAFAFA] border-[#E5E7EB]"}`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-xs">
                      Residential Address Proof *
                    </span>
                    {documents.residentialAddressProof.file && (
                      <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    )}
                  </div>
                  <label className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-[#E5E7EB] dark:border-[#1F2937] rounded-full text-xs cursor-pointer hover:bg-[#EEF1FE] hover:border-[#3D5EF6] hover:text-[#3D5EF6] transition-colors duration-200">
                    <Upload className="w-3.5 h-3.5" />{" "}
                    {documents.residentialAddressProof.file
                      ? "Change File"
                      : "Select File"}
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="sr-only"
                      onChange={(e) =>
                        handleDocFileChange(
                          "residentialAddressProof",
                          e.target.files?.[0] || null,
                        )
                      }
                    />
                  </label>
                  {documents.residentialAddressProof.file && (
                    <p className="text-[10px] text-[#6B7280] truncate">
                      {documents.residentialAddressProof.file.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Terms and Conditions Acceptance */}
            <div
              className={`mt-6 p-4 rounded-[16px] border flex items-start gap-3 ${
                isDark
                  ? "bg-[#3D5EF6]/10 border-[#3D5EF6]/20 text-slate-300"
                  : "bg-[#EEF1FE] border-[#3D5EF6]/20 text-[#111827]"
              }`}
            >
              <input
                type="checkbox"
                id="terms"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="mt-1 accent-[#3D5EF6] w-4 h-4 rounded cursor-pointer"
              />
              <label
                htmlFor="terms"
                className="text-xs leading-relaxed cursor-pointer select-none"
              >
                I hereby declare that the details and identity/verification
                documents furnished above are true and correct. I accept the{" "}
                <strong>
                  Hari Om Thalassic Maritime Partner Terms of Service
                </strong>
                , including direct settlement guidelines, compliance standards,
                and seafarer data privacy rules.
              </label>
            </div>
          </div>
        )}

        {/* Buttons Controls */}
        <div
          className={`mt-8 pt-5 border-t flex justify-between ${isDark ? "border-[#1F2937]" : "border-[#E5E7EB]"}`}
        >
          {step > 1 ? (
            <button
              onClick={prevStep}
              disabled={loading}
              className={`px-5 py-2 text-xs font-bold rounded-full border transition-colors duration-200 ${
                isDark
                  ? "border-[#1F2937] text-slate-400 hover:bg-white/5"
                  : "bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB] border border-[#E5E7EB]"
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
              className="px-5 py-2 text-xs font-bold rounded-full shadow-sm transition-colors duration-200 flex items-center gap-1.5 bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleCompleteOnboarding}
              disabled={loading}
              className={`px-6 py-2.5 text-xs font-black uppercase tracking-wider rounded-full shadow-sm transition-colors duration-200 flex items-center gap-2 ${
                loading
                  ? "bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed"
                  : "bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white"
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
