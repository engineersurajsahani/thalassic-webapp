"use client";

import React, { useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import { CheckCircle2, TrendingUp, LayoutDashboard, Megaphone, Globe2, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { api } from "@/lib/axios";

// Reusable ScrollReveal from hero or a simple one if we don't want to import it
// But we can just use a simple intersection observer or static if needed, 
// or since we are in the same folder structure, maybe we can copy the ScrollReveal 
// logic or just use standard tailwind classes. Let's use a simple intersection observer.
function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1, rootMargin: "0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 transform will-change-transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function BusinessPartnerSection() {
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
      // We will hit our proxy endpoint or direct backend endpoint.
      // We assume /api/partner-applications is set up on the NestJS backend
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

  const benefits = [
    { icon: TrendingUp, title: "Attractive Commission", desc: "Earn competitive rates for every successful seafarer referral." },
    { icon: LayoutDashboard, title: "Dedicated Agent Dashboard", desc: "Track your leads, commissions, and performance in real-time." },
    { icon: Megaphone, title: "Marketing & Training Support", desc: "Get access to promotional materials and operational training." },
    { icon: Globe2, title: "Nationwide & Global Opportunities", desc: "Expand your reach with our wide network of shipping partners." },
  ];

  return (
    <section className={`py-24 relative overflow-hidden ${isDark ? "bg-[#050a14]" : "bg-slate-50"}`}>
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Content */}
          <div>
            <ScrollReveal>
              <div className="mb-8">
                <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4 border ${
                  isDark ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "bg-blue-50 border-blue-200 text-blue-700"
                }`}>
                  Partnership Program
                </span>
                <h2 className={`text-4xl md:text-5xl font-black tracking-tight mb-6 leading-tight ${
                  isDark ? "text-white" : "text-slate-900"
                }`}>
                  Become Our <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-400">
                    Business Partner
                  </span>
                </h2>
                <p className={`text-lg leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Join our trusted network of Manning Agents and grow your maritime business with us. Refer seafarers, earn attractive commissions, and expand your professional network.
                </p>
              </div>
            </ScrollReveal>

            <div className="space-y-6">
              {benefits.map((benefit, idx) => (
                <ScrollReveal key={idx} delay={idx * 100}>
                  <div className={`flex gap-4 p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
                    isDark 
                      ? "bg-[#0b1224]/60 border-slate-800 hover:border-slate-700" 
                      : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-md"
                  }`}>
                    <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                      isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"
                    }`}>
                      <benefit.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className={`font-bold mb-1 ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                        {benefit.title}
                      </h4>
                      <p className={`text-sm ${isDark ? "text-slate-500" : "text-slate-600"}`}>
                        {benefit.desc}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Right Side: Form */}
          <ScrollReveal delay={300}>
            <div className={`p-8 md:p-10 rounded-3xl border backdrop-blur-xl relative overflow-hidden ${
              isDark 
                ? "bg-[#0a1122]/80 border-slate-800/80 shadow-[0_8px_32px_rgba(0,0,0,0.4)]" 
                : "bg-white/80 border-white shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
            }`}>
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-sky-400 to-blue-500" />
              
              <h3 className={`text-2xl font-black mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                Partner Registration
              </h3>
              <p className={`text-sm mb-8 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Fill out the form below and our team will get back to you within 24-48 hours.
              </p>

              {status === "success" ? (
                <div className={`text-center py-12 rounded-2xl border ${
                  isDark ? "bg-green-500/10 border-green-500/20" : "bg-green-50 border-green-200"
                }`}>
                  <CheckCircle className={`w-16 h-16 mx-auto mb-4 ${isDark ? "text-green-400" : "text-green-600"}`} />
                  <h4 className={`text-xl font-bold mb-2 ${isDark ? "text-green-400" : "text-green-700"}`}>
                    Application Submitted!
                  </h4>
                  <p className={`text-sm max-w-xs mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    Thank you for your interest. We will review your details and contact you shortly.
                  </p>
                  <button 
                    onClick={() => setStatus("idle")}
                    className={`mt-6 px-6 py-2 rounded-full text-sm font-bold transition-colors ${
                      isDark ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-slate-200 text-slate-800 hover:bg-slate-300"
                    }`}
                  >
                    Submit Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                        Full Name *
                      </label>
                      <input
                        required
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:ring-2 focus:ring-blue-500/50 outline-none ${
                          isDark 
                            ? "bg-[#050a14]/50 border-slate-700 text-white placeholder-slate-600 focus:border-blue-500" 
                            : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500"
                        }`}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                        Agency/Company Name *
                      </label>
                      <input
                        required
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:ring-2 focus:ring-blue-500/50 outline-none ${
                          isDark 
                            ? "bg-[#050a14]/50 border-slate-700 text-white placeholder-slate-600 focus:border-blue-500" 
                            : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500"
                        }`}
                        placeholder="Maritime Services Inc."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                        Email Address *
                      </label>
                      <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:ring-2 focus:ring-blue-500/50 outline-none ${
                          isDark 
                            ? "bg-[#050a14]/50 border-slate-700 text-white placeholder-slate-600 focus:border-blue-500" 
                            : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500"
                        }`}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                        Mobile Number *
                      </label>
                      <input
                        required
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:ring-2 focus:ring-blue-500/50 outline-none ${
                          isDark 
                            ? "bg-[#050a14]/50 border-slate-700 text-white placeholder-slate-600 focus:border-blue-500" 
                            : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500"
                        }`}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                        City *
                      </label>
                      <input
                        required
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:ring-2 focus:ring-blue-500/50 outline-none ${
                          isDark 
                            ? "bg-[#050a14]/50 border-slate-700 text-white placeholder-slate-600 focus:border-blue-500" 
                            : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500"
                        }`}
                        placeholder="Mumbai"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                        State *
                      </label>
                      <input
                        required
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:ring-2 focus:ring-blue-500/50 outline-none ${
                          isDark 
                            ? "bg-[#050a14]/50 border-slate-700 text-white placeholder-slate-600 focus:border-blue-500" 
                            : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500"
                        }`}
                        placeholder="Maharashtra"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                      Message (Optional)
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={3}
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:ring-2 focus:ring-blue-500/50 outline-none resize-none ${
                        isDark 
                          ? "bg-[#050a14]/50 border-slate-700 text-white placeholder-slate-600 focus:border-blue-500" 
                          : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500"
                      }`}
                      placeholder="Tell us about your agency and experience..."
                    />
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-transparent"
                      required
                    />
                    <label htmlFor="agreeTerms" className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      I agree to the <a href="/terms" className="text-blue-500 hover:underline">Terms of Service</a> and <a href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</a>.
                    </label>
                  </div>

                  {status === "error" && (
                    <div className="flex items-center gap-2 text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <p>{errorMessage}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting" || !formData.agreeTerms}
                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] ${
                      status === "submitting" || !formData.agreeTerms
                        ? "opacity-50 cursor-not-allowed bg-slate-500 text-white"
                        : isDark
                          ? "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                          : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30"
                    }`}
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Apply as a Business Partner
                        <CheckCircle2 className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}
