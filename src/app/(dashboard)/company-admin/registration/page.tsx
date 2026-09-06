"use client";

import React, { useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import {
  UserPlus,
  Save,
  RotateCcw,
  FileText,
  Send,
  CheckCircle2,
  X,
  UploadCloud,
  User,
  ShieldCheck,
  Lock,
  Search,
} from "lucide-react";
import { mockSeafarers } from "@/components/company-admin/mockData";

export default function WalkInRegistrationPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Existing Seafarer State
  const [existingSeafarerId, setExistingSeafarerId] = useState<string | null>(null);
  const [searchStatus, setSearchStatus] = useState<"idle" | "searching" | "found" | "not_found">("idle");

  // Field states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [nationality, setNationality] = useState("");
  const [gender, setGender] = useState("");
  const [cdcNo, setCdcNo] = useState("");
  const [passportNo, setPassportNo] = useState("");
  const [indosNo, setIndosNo] = useState("");

  // Document states (tracking if uploaded)
  const [passportFile, setPassportFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [cdcFile, setCdcFile] = useState<File | null>(null);
  const [otherDocsFile, setOtherDocsFile] = useState<File | null>(null);

  // Mock Generated Values
  const generatedUsername = existingSeafarerId 
    ? (email || "existing_user")
    : "walkin_sf_" + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  const generatedPassword = existingSeafarerId ? "****** (Existing)" : "TempPass123!";
  const todayDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const validateFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      return "Invalid file type. Only JPG, PNG, and PDF are allowed.";
    }
    if (file.size > 5 * 1024 * 1024) {
      return "File size exceeds 5MB limit.";
    }
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (file: File | null) => void) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const error = validateFile(file);
      if (error) {
        setValidationError(error);
        e.target.value = ''; // Reset input
      } else {
        setter(file);
        setValidationError(null);
      }
    }
  };

  const handleSearchExisting = () => {
    if (!email && !phone && !passportNo) {
      setValidationError("Please enter at least an Email, Phone, or Passport Number to check for an existing seafarer.");
      return;
    }

    setSearchStatus("searching");
    
    // Simulate API delay
    setTimeout(() => {
      const found = mockSeafarers.find(s => 
        (email && s.email.toLowerCase() === email.toLowerCase()) || 
        (phone && s.phone === phone)
      );
      
      if (found) {
        setSearchStatus("found");
        setExistingSeafarerId(found.id);
        setFullName(found.name);
        setEmail(found.email);
        setPhone(found.phone);
        setDob(found.dob || "1990-01-01");
        setNationality(found.nationality || "Indian");
        setGender("Male"); // mock data default
        setIndosNo(found.indosNumber || "");
        setValidationError(null);
      } else {
        setSearchStatus("not_found");
        setExistingSeafarerId(null);
      }
    }, 600);
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Manual Validation for missing required docs (if not linking existing)
    if (!existingSeafarerId) {
      if (!passportFile) {
        setValidationError("Passport document is mandatory.");
        return;
      }
      if (!photoFile) {
        setValidationError("Seafarer Photo is mandatory.");
        return;
      }
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessModal(true);
    }, 1000);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the form? All data will be lost.")) {
      setFullName("");
      setEmail("");
      setPhone("");
      setDob("");
      setNationality("");
      setGender("");
      setCdcNo("");
      setPassportNo("");
      setIndosNo("");
      setPassportFile(null);
      setPhotoFile(null);
      setCdcFile(null);
      setOtherDocsFile(null);
      setValidationError(null);
      setExistingSeafarerId(null);
      setSearchStatus("idle");
    }
  };

  const cardClasses = `p-6 rounded-xl border ${
    isDark ? "bg-[#0c1a2e] border-white/5 text-white" : "bg-white border-slate-200 text-slate-800"
  }`;

  const inputClasses = `w-full py-2.5 px-3 rounded-lg border text-xs outline-none transition-all focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 ${
    isDark
      ? "bg-white/5 border-white/10 text-white placeholder:text-white/20"
      : "bg-white border-slate-200 text-slate-800 placeholder:text-slate-400"
  }`;

  const labelClasses = `text-[10px] font-bold uppercase tracking-wider mb-1.5 block opacity-70 ${
    isDark ? "text-white" : "text-slate-600"
  }`;

  const FileUploadBox = ({ label, file, setFile }: { label: string, file: File | null, setFile: (file: File | null) => void }) => (
    <div className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center relative transition-colors ${
      isDark ? "border-white/10 hover:border-white/20 hover:bg-white/5" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
    }`}>
      <input
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={(e) => handleFileChange(e, setFile)}
      />
      {file ? (
        <>
          <CheckCircle2 className="w-6 h-6 mb-2 text-emerald-500" />
          <span className={`text-xs font-bold text-emerald-500 truncate max-w-full px-2`}>{file.name}</span>
        </>
      ) : (
        <>
          <UploadCloud className={`w-6 h-6 mb-2 opacity-50 ${isDark ? "text-white" : "text-slate-600"}`} />
          <span className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-700"}`}>Upload {label}</span>
          <span className="text-[10px] opacity-50 mt-1">PDF, JPG, PNG up to 5MB</span>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-xl font-bold tracking-tight flex items-center gap-2 ${isDark ? "text-white" : "text-slate-800"}`}>
            <UserPlus className="w-5 h-5 text-sky-500" />
            Walk-in Seafarer Registration
          </h1>
          <p className={`text-[11px] mt-1 ${isDark ? "text-white/40" : "text-slate-500"}`}>
            Register walk-in seafarers visiting the office and create or link their platform account.
          </p>
        </div>
      </div>

      {searchStatus === "found" && existingSeafarerId && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <div>
            Existing Seafarer Found! Data has been auto-filled. Registration will link this user instead of creating a duplicate.
          </div>
        </div>
      )}
      
      {searchStatus === "not_found" && (
        <div className="p-4 bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 rounded-lg text-sm font-semibold flex items-center gap-2">
          <User className="w-5 h-5 shrink-0" />
          <div>
            No existing seafarer found. You can proceed with registering a new seafarer.
          </div>
        </div>
      )}

      {validationError && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-lg text-sm font-semibold flex items-center gap-2">
          <X className="w-4 h-4 cursor-pointer" onClick={() => setValidationError(null)} />
          {validationError}
        </div>
      )}

      <form onSubmit={handleCreateAccount} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Section 1: Personal Information */}
            <div className={cardClasses}>
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/5 dark:border-white/5 border-slate-100">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-sky-500" />
                  <h2 className="text-sm font-bold uppercase tracking-wide">Personal Information</h2>
                </div>
                <button
                  type="button"
                  onClick={handleSearchExisting}
                  disabled={searchStatus === "searching"}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-bold transition-colors border cursor-pointer ${
                    isDark 
                      ? "bg-sky-500/10 text-sky-400 border-sky-500/20 hover:bg-sky-500/20" 
                      : "bg-sky-50 text-sky-600 border-sky-200 hover:bg-sky-100"
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  {searchStatus === "searching" ? "Checking..." : "Check Existing"}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClasses}>Email Address *</label>
                  <input type="email" placeholder="e.g. john@example.com" className={inputClasses} required value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div>
                  <label className={labelClasses}>Mobile Number *</label>
                  <input type="tel" placeholder="+91 9876543210" className={inputClasses} required pattern="[+0-9\s\-]{10,15}" title="Enter a valid phone number" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClasses}>Full Name *</label>
                  <input type="text" placeholder="e.g. John Doe" className={inputClasses} required minLength={2} value={fullName} onChange={e => setFullName(e.target.value)} />
                </div>
                <div>
                  <label className={labelClasses}>Date of Birth *</label>
                  <input type="date" className={inputClasses} required value={dob} onChange={e => setDob(e.target.value)} />
                </div>
                <div>
                  <label className={labelClasses}>Nationality *</label>
                  <select className={inputClasses} required value={nationality} onChange={e => setNationality(e.target.value)}>
                    <option value="">Select Nationality</option>
                    <option value="Indian">Indian</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Gender *</label>
                  <select className={inputClasses} required value={gender} onChange={e => setGender(e.target.value)}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Maritime Information */}
            <div className={cardClasses}>
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/5 dark:border-white/5 border-slate-100">
                <ShieldCheck className="w-4 h-4 text-sky-500" />
                <h2 className="text-sm font-bold uppercase tracking-wide">Maritime Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClasses}>CDC Number (Optional)</label>
                  <input type="text" placeholder="e.g. MUM12345" className={inputClasses} value={cdcNo} onChange={e => setCdcNo(e.target.value)} />
                </div>
                <div>
                  <label className={labelClasses}>Passport Number *</label>
                  <input type="text" placeholder="e.g. A1234567" className={inputClasses} required minLength={5} value={passportNo} onChange={e => setPassportNo(e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClasses}>INDOS Number (Optional)</label>
                  <input type="text" placeholder="e.g. 05GL1234" className={inputClasses} value={indosNo} onChange={e => setIndosNo(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Section 3: Document Upload */}
            <div className={cardClasses}>
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/5 dark:border-white/5 border-slate-100">
                <FileText className="w-4 h-4 text-sky-500" />
                <h2 className="text-sm font-bold uppercase tracking-wide">Document Upload</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FileUploadBox label="Passport *" file={passportFile} setFile={setPassportFile} />
                <FileUploadBox label="Seafarer Photo *" file={photoFile} setFile={setPhotoFile} />
                <FileUploadBox label="CDC" file={cdcFile} setFile={setCdcFile} />
                <FileUploadBox label="Other required documents" file={otherDocsFile} setFile={setOtherDocsFile} />
              </div>
            </div>

          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            
            {/* Account Information (Read-only) */}
            <div className={cardClasses}>
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/5 dark:border-white/5 border-slate-100">
                <Lock className="w-4 h-4 text-sky-500" />
                <h2 className="text-sm font-bold uppercase tracking-wide">Account Information</h2>
              </div>
              <div className="space-y-4">
                <div className={`p-3 rounded-lg border flex justify-between items-center ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                  <span className="text-xs opacity-70">Username</span>
                  <strong className="text-xs font-mono text-sky-500 truncate max-w-[120px]">{generatedUsername}</strong>
                </div>
                <div className={`p-3 rounded-lg border flex justify-between items-center ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                  <span className="text-xs opacity-70">Temp Password</span>
                  <strong className="text-xs font-mono">{generatedPassword}</strong>
                </div>
                <div className={`p-3 rounded-lg border flex justify-between items-center ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                  <span className="text-xs opacity-70">Registration Date</span>
                  <strong className="text-xs">{todayDate}</strong>
                </div>
                <div className={`p-3 rounded-lg border flex justify-between items-center ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                  <span className="text-xs opacity-70">Account Type</span>
                  <span className="text-[10px] font-bold uppercase px-2 py-1 bg-emerald-500/20 text-emerald-500 rounded">
                    {existingSeafarerId ? "Linked Account" : "Direct Walk-in"}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
          isDark ? "bg-[#0c1a2e] border-white/5" : "bg-white border-slate-200"
        }`}>
          <button
            type="button"
            onClick={handleReset}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              isDark ? "hover:bg-white/5 text-white/70" : "hover:bg-slate-50 text-slate-600"
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            Reset Form
          </button>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold bg-sky-500 hover:bg-sky-600 text-white transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? "Processing..." : existingSeafarerId ? "Link Existing Seafarer" : "Create Account"}
            </button>
          </div>
        </div>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity" />
          <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm shadow-2xl z-55 rounded-xl overflow-hidden border p-6 text-center ${
            isDark ? "bg-[#0b1625] border-white/5 text-white" : "bg-white border-slate-200 text-slate-800"
          }`}>
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold tracking-tight mb-2">Registration Successful!</h3>
            <p className="text-xs opacity-60 mb-6">
              {existingSeafarerId 
                ? "The walk-in registration has been successfully linked to the existing seafarer profile."
                : "The walk-in seafarer has been successfully registered. Their account is now active."
              }
            </p>
            
            <div className={`p-4 rounded-lg border text-left space-y-3 mb-6 ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
              <div className="flex justify-between items-center">
                <span className="text-xs opacity-70">Username</span>
                <span className="text-xs font-mono font-bold text-sky-500 truncate max-w-[120px]">{generatedUsername}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs opacity-70">Temp Password</span>
                <span className="text-xs font-mono font-bold">{generatedPassword}</span>
              </div>
            </div>

            <div className="space-y-3">
              {!existingSeafarerId && (
                <button
                  type="button"
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer bg-sky-500 hover:bg-sky-600 text-white shadow-sm`}
                >
                  <Send className="w-4 h-4" /> Send Credentials
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  handleReset();
                }}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer mt-2 ${
                  isDark ? "text-white/40 hover:text-white" : "text-slate-400 hover:text-slate-700"
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
