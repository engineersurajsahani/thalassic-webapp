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
  CreditCard,
  User,
  ShieldCheck,
  BookOpen,
  Calendar,
  Lock,
} from "lucide-react";

export default function WalkInRegistrationPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Form State (Mock)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Mock Generated Values
  const generatedUsername = "walkin_sf_001";
  // ISSUE-007: Generate a random secure password instead of hardcoded "TempPass123!"
  // In production, this should be generated server-side and sent via email
  const generatedPassword = Array.from({ length: 12 }, () =>
    Math.random() > 0.5 ? String.fromCharCode(65 + Math.floor(Math.random() * 26)) : String.fromCharCode(97 + Math.floor(Math.random() * 26))
  ).join('') + Math.floor(Math.random() * 1000);
  const todayDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessModal(true);
    }, 1000);
  };

  // ISSUE-041: Replaced window.location.reload() with proper state management
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    dob: '',
    nationality: '',
    gender: '',
    cdcNumber: '',
    passportNumber: '',
    indosNumber: '',
    course: '',
    amount: '',
    paymentMethod: '',
    paymentStatus: 'Paid',
  });

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the form? All data will be lost.")) {
      // ISSUE-041: Use state reset instead of page reload
      setFormData({
        fullName: '',
        email: '',
        mobile: '',
        dob: '',
        nationality: '',
        gender: '',
        cdcNumber: '',
        passportNumber: '',
        indosNumber: '',
        course: '',
        amount: '',
        paymentMethod: '',
        paymentStatus: 'Paid',
      });
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

  const FileUploadBox = ({ label }: { label: string }) => (
    <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
      isDark ? "border-white/10 hover:border-white/20 hover:bg-white/5" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
    }`}>
      <UploadCloud className={`w-6 h-6 mb-2 opacity-50 ${isDark ? "text-white" : "text-slate-600"}`} />
      <span className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-700"}`}>Upload {label}</span>
      <span className="text-[10px] opacity-50 mt-1">PDF, JPG, PNG up to 5MB</span>
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
            Register walk-in seafarers visiting the office and create their platform account.
          </p>
        </div>
        <button
          onClick={(e) => handleCreateAccount(e as any)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold bg-sky-500 hover:bg-sky-600 text-white transition-all shadow-sm cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Create New Seafarer
        </button>
      </div>

      <form onSubmit={handleCreateAccount} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Section 1: Personal Information */}
            <div className={cardClasses}>
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/5 dark:border-white/5 border-slate-100">
                <User className="w-4 h-4 text-sky-500" />
                <h2 className="text-sm font-bold uppercase tracking-wide">Personal Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClasses}>Full Name *</label>
                  <input type="text" placeholder="e.g. John Doe" className={inputClasses} required />
                </div>
                <div>
                  <label className={labelClasses}>Email Address *</label>
                  <input type="email" placeholder="e.g. john@example.com" className={inputClasses} required />
                </div>
                <div>
                  <label className={labelClasses}>Mobile Number *</label>
                  <input type="tel" placeholder="+91 9876543210" className={inputClasses} required />
                </div>
                <div>
                  <label className={labelClasses}>Date of Birth *</label>
                  <input type="date" className={inputClasses} required />
                </div>
                <div>
                  <label className={labelClasses}>Nationality *</label>
                  <select className={inputClasses} required>
                    <option value="">Select Nationality</option>
                    <option value="Indian">Indian</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Gender *</label>
                  <select className={inputClasses} required>
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
                  <input type="text" placeholder="e.g. MUM12345" className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>Passport Number *</label>
                  <input type="text" placeholder="e.g. A1234567" className={inputClasses} required />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClasses}>INDOS Number (Optional)</label>
                  <input type="text" placeholder="e.g. 05GL1234" className={inputClasses} />
                </div>
              </div>
            </div>

            {/* Section 6: Document Upload */}
            <div className={cardClasses}>
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/5 dark:border-white/5 border-slate-100">
                <FileText className="w-4 h-4 text-sky-500" />
                <h2 className="text-sm font-bold uppercase tracking-wide">Document Upload</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FileUploadBox label="Passport Copy" />
                <FileUploadBox label="CDC Document" />
                <FileUploadBox label="Medical Certificate" />
                <FileUploadBox label="Passport Photo" />
              </div>
            </div>

          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            
            {/* Section 3: Account Information (Read-only) */}
            <div className={cardClasses}>
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/5 dark:border-white/5 border-slate-100">
                <Lock className="w-4 h-4 text-sky-500" />
                <h2 className="text-sm font-bold uppercase tracking-wide">Account Information</h2>
              </div>
              <div className="space-y-4">
                <div className={`p-3 rounded-lg border flex justify-between items-center ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                  <span className="text-xs opacity-70">Username</span>
                  <strong className="text-xs font-mono text-sky-500">{generatedUsername}</strong>
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
                  <span className="text-[10px] font-bold uppercase px-2 py-1 bg-emerald-500/20 text-emerald-500 rounded">Direct Walk-in</span>
                </div>
              </div>
            </div>

            {/* Section 4: Course Assignment */}
            <div className={cardClasses}>
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/5 dark:border-white/5 border-slate-100">
                <BookOpen className="w-4 h-4 text-sky-500" />
                <h2 className="text-sm font-bold uppercase tracking-wide">Course Assignment</h2>
              </div>
              <div>
                <label className={labelClasses}>Available Courses (Optional)</label>
                <select className={inputClasses}>
                  <option value="">None Selected</option>
                  <option value="stcw">Basic STCW Safety Training</option>
                  <option value="pscrb">PSCRB Certification</option>
                  <option value="aff">Advanced Fire Fighting</option>
                </select>
              </div>
            </div>

            {/* Section 5: Payment */}
            <div className={cardClasses}>
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/5 dark:border-white/5 border-slate-100">
                <CreditCard className="w-4 h-4 text-sky-500" />
                <h2 className="text-sm font-bold uppercase tracking-wide">Payment Details</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={labelClasses}>Amount (USD) *</label>
                  <input type="number" placeholder="0.00" className={inputClasses} required />
                </div>
                <div>
                  <label className={labelClasses}>Payment Method *</label>
                  <select className={inputClasses} required>
                    <option value="">Select Method</option>
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Payment Status *</label>
                  <div className="flex items-center gap-3 mt-2">
                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                      <input type="radio" name="payment_status" value="Paid" className="accent-sky-500" required /> Paid
                    </label>
                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                      <input type="radio" name="payment_status" value="Pending" className="accent-sky-500" required /> Pending
                    </label>
                  </div>
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
              type="button"
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                isDark ? "bg-white/5 hover:bg-white/10 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-800"
              }`}
            >
              <FileText className="w-4 h-4" />
              Generate Invoice
            </button>
            <button
              type="button"
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                isDark ? "bg-white/5 hover:bg-white/10 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-800"
              }`}
            >
              <Send className="w-4 h-4" />
              Send Login Credentials
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold bg-sky-500 hover:bg-sky-600 text-white transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? "Creating..." : "Create Account"}
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
              The walk-in seafarer has been successfully registered. Their account is now active.
            </p>
            
            <div className={`p-4 rounded-lg border text-left space-y-3 mb-6 ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
              <div className="flex justify-between items-center">
                <span className="text-xs opacity-70">Username</span>
                <span className="text-xs font-mono font-bold text-sky-500">{generatedUsername}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs opacity-70">Temp Password</span>
                <span className="text-xs font-mono font-bold">{generatedPassword}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  isDark ? "bg-white/5 hover:bg-white/10 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                }`}
              >
                <FileText className="w-4 h-4" /> Generate Invoice
              </button>
              <button
                type="button"
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer bg-sky-500 hover:bg-sky-600 text-white shadow-sm`}
              >
                <Send className="w-4 h-4" /> Send Credentials
              </button>
              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
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
