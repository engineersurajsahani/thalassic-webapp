"use client";

import React, { useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import { api } from "@/lib/axios";
import { 
  CheckCircle, ArrowLeft, TrendingUp, LayoutDashboard, Megaphone, Globe2, Loader2 
} from "lucide-react";
import Link from "next/link";

export default function PartnerRegistrationPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    message: "",
    agreeTerms: false,
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeTerms) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      await api.post("/partner-applications", formData);
      setStatus("success");
      setFormData({
        fullName: "",
        companyName: "",
        email: "",
        phone: "",
        city: "",
        state: "",
        message: "",
        agreeTerms: false,
      });
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(error.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  const inputBg = isDark 
    ? "bg-slate-900/60 border-slate-800 text-white placeholder:text-slate-650 focus:border-blue-500" 
    : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-600";

  return (
    <div className={`min-h-screen py-28 relative overflow-hidden ${isDark ? "bg-[#020b14]" : "bg-slate-50"}`}>
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        {/* Back Link */}
        <Link 
          href="/" 
          className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-8 transition-colors ${
            isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          
          {/* Left Column: Benefits info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-3 border ${
                isDark ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "bg-blue-50 border-blue-200 text-blue-700"
              }`}>
                Partnership Program
              </span>
              <h1 className={`text-3xl md:text-4xl font-black tracking-tight leading-tight mb-4 ${
                isDark ? "text-white" : "text-slate-900"
              }`}>
                Become Our <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-400">
                  Business Partner
                </span>
              </h1>
              <p className={`text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-650"}`}>
                Register as an authorized placement and manning partner. Refer qualified seafarers to our DGS-approved programs and manage your referrals with full payout transparency.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-800/30">
              <div className="flex gap-3 items-start">
                <div className={`p-2 rounded-xl shrink-0 ${isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h4 className={`text-xs font-bold ${isDark ? "text-slate-200" : "text-slate-800"}`}>Attractive Commission</h4>
                  <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-500" : "text-slate-600"}`}>Earn competitive overrides on STCW BST and Post-Sea bookings.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className={`p-2 rounded-xl shrink-0 ${isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
                  <LayoutDashboard className="w-4 h-4" />
                </div>
                <div>
                  <h4 className={`text-xs font-bold ${isDark ? "text-slate-200" : "text-slate-800"}`}>Manning Dashboard</h4>
                  <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-500" : "text-slate-600"}`}>Track referral leads, check onboarding stages, and request payouts.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form Container */}
          <div className="lg:col-span-3">
            <div className={`p-6 md:p-8 rounded-3xl border backdrop-blur-xl relative overflow-hidden ${
              isDark 
                ? "bg-[#0a1122]/80 border-slate-800/80 shadow-[0_8px_32px_rgba(0,0,0,0.4)]" 
                : "bg-white/80 border-white shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
            }`}>
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-sky-400 to-blue-500" />
              
              <h3 className={`text-xl font-black mb-1.5 ${isDark ? "text-white" : "text-slate-900"}`}>
                Partner Registration
              </h3>
              <p className={`text-xs mb-6 ${isDark ? "text-slate-450" : "text-slate-600"}`}>
                Fill out the form below and our team will get back to you within 24-48 hours.
              </p>

              {status === "success" ? (
                <div className={`text-center py-10 rounded-2xl border ${
                  isDark ? "bg-green-500/10 border-green-500/20" : "bg-green-50 border-green-200"
                }`}>
                  <CheckCircle className={`w-12 h-12 mx-auto mb-3 ${isDark ? "text-green-400" : "text-green-600"}`} />
                  <h4 className={`text-lg font-bold mb-1.5 ${isDark ? "text-green-400" : "text-green-700"}`}>
                    Application Submitted!
                  </h4>
                  <p className={`text-xs max-w-xs mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    Thank you for your interest. We will review your details and contact you shortly.
                  </p>
                  <button 
                    onClick={() => setStatus("idle")}
                    className={`mt-4 px-5 py-2 rounded-full text-xs font-bold transition-colors ${
                      isDark ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-slate-200 text-slate-800 hover:bg-slate-300"
                    }`}
                  >
                    Submit Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <p className="p-2 text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg">
                      {errorMessage}
                    </p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${inputBg}`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>Agency/Company Name *</label>
                      <input
                        type="text"
                        name="companyName"
                        required
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="Maritime Services Inc."
                        className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${inputBg}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${inputBg}`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>Mobile Number *</label>
                      <input
                        type="text"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${inputBg}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>City *</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Mumbai"
                        className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${inputBg}`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>State *</label>
                      <input
                        type="text"
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="Maharashtra"
                        className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${inputBg}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>Message (Optional)</label>
                    <textarea
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your agency and experience..."
                      className={`w-full px-3 py-2 rounded-xl border text-xs outline-none resize-none ${inputBg}`}
                    />
                  </div>

                  <div className="flex items-start gap-2.5 pt-2">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      name="agreeTerms"
                      required
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="mt-0.5 accent-blue-500 cursor-pointer"
                    />
                    <label htmlFor="agreeTerms" className={`text-[11px] leading-tight select-none cursor-pointer ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}>
                      I agree to the <Link href="/terms" className="text-blue-400 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</Link>.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={status === "submitting" || !formData.agreeTerms}
                    className="w-full py-3 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-55 flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md mt-4"
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting...
                      </>
                    ) : "Apply as a Business Partner"}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
