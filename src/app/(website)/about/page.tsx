"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useTheme } from "@/providers/theme-provider";
import { ArrowRight, Eye, Target, Compass, Award } from "lucide-react";

// --- SCROLL REVEAL COMPONENT ---
function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { 
        threshold: 0.05, 
        rootMargin: "0px 0px -40px 0px" 
      }
    );

    const current = ref.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 transform will-change-transform ${
        isVisible 
          ? "opacity-100 translate-y-0 scale-100" 
          : "opacity-0 translate-y-12 scale-[0.98]"
      }`}
      style={{
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)"
      }}
    >
      {children}
    </div>
  );
}

export default function AboutUsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`transition-colors duration-500 min-h-screen font-outfit ${
      isDark ? "bg-[#050a14] text-slate-100" : "bg-[#f8fafc] text-slate-900"
    }`}>
      
      {/* Hero Header Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-[140px] pb-16 text-center md:text-left">
        <ScrollReveal>
          <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase mb-4 border ${
            isDark 
              ? "bg-blue-950/40 text-blue-300 border-blue-500/10" 
              : "bg-blue-50 text-blue-600 border-blue-200"
          }`}>
            // About Our Platform
          </span>
          <h1 className={`text-4xl md:text-6xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r ${
            isDark ? "from-white via-slate-100 to-slate-350" : "from-slate-900 via-blue-950 to-slate-800"
          }`}>
            Hari Om Thalassic
          </h1>
          <p className={`text-base md:text-lg max-w-3xl leading-relaxed font-light ${
            isDark ? "text-slate-300" : "text-slate-600"
          }`}>
            We believe booking maritime courses and updating credentials shouldn't be a headache. Hari Om Thalassic was created to make seafarer training, CDC documentation, and placement assistance smooth and simple. We provide a single digital home where seafarers can find courses, track their certificates, and get certified guidance from experienced captains.
          </p>
        </ScrollReveal>
      </section>

      <hr className={`max-w-7xl mx-auto px-6 ${isDark ? "border-slate-800/60" : "border-slate-200"}`} />

      {/* Vision & Mission Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-8">
        
        {/* Vision Card */}
        <ScrollReveal delay={100}>
          <div className={`border rounded-3xl p-8 shadow-xl transition-all duration-500 hover:scale-[1.01] ${
            isDark 
              ? "bg-[#0a1122]/70 border-slate-800 hover:border-blue-500/20" 
              : "bg-white border-slate-200 shadow-slate-200/50"
          }`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border ${
              isDark
                ? "bg-slate-900/60 border-slate-700/20 text-blue-300"
                : "bg-blue-50 border-blue-200 text-blue-600"
            }`}>
              <Eye className="w-5 h-5 animate-pulse" />
            </div>
            <h2 className="text-2xl font-black mb-4">Our Vision</h2>
            <p className={`leading-relaxed text-sm font-light ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              To build the most reliable and easy-to-use digital home for seafarers. We want to save your time spent on paperwork and registration queues, so you can focus on your training and career at sea.
            </p>
          </div>
        </ScrollReveal>

        {/* Mission Card */}
        <ScrollReveal delay={200}>
          <div className={`border rounded-3xl p-8 shadow-xl transition-all duration-500 hover:scale-[1.01] ${
            isDark 
              ? "bg-[#0a1122]/70 border-slate-800 hover:border-blue-500/20" 
              : "bg-white border-slate-200 shadow-slate-200/50"
          }`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border ${
              isDark
                ? "bg-slate-900/60 border-slate-700/20 text-blue-300"
                : "bg-blue-50 border-blue-200 text-blue-600"
            }`}>
              <Target className="w-5 h-5 animate-pulse" />
            </div>
            <h2 className="text-2xl font-black mb-4">Our Mission</h2>
            <p className={`leading-relaxed text-sm font-light ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Legacy maritime processes rely heavily on running from one office to another for CDC stamps, visa approvals, and course certificates. Our mission is to digitize these manual hurdles. We guide seafarers through the entire lifecycle—from preparatory training and document validation to global placements.
            </p>
          </div>
        </ScrollReveal>

      </section>

      {/* Maritime Training Experience Highlight */}
      <section className={`py-20 border-y ${
        isDark 
          ? "bg-slate-950/40 border-slate-800/80" 
          : "bg-slate-50 border-slate-200"
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            
            <div className="md:col-span-2 text-left">
              <ScrollReveal>
                <h2 className="text-3xl font-black mb-4 flex items-center gap-3">
                  <Compass className="w-7 h-7 text-blue-400 animate-spin-slow" /> 
                  Built by Mariners, for Mariners
                </h2>
                <p className={`leading-relaxed mb-4 text-sm font-light ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Our platform is built in alignment with international Directorate General of Shipping (DGS) guidelines. We bridge the gap between merchant navy requirements and user-friendly digital tools, helping deck officers, cadets, and engine crew prepare for competency exams and safety standards with absolute confidence.
                </p>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={200}>
              <div className={`p-8 rounded-3xl border text-center ${
                isDark
                  ? "bg-[#0a1122]/70 border-slate-800"
                  : "bg-white border-slate-200 shadow-sm"
              }`}>
                <Award className="w-10 h-10 text-blue-400 mx-auto mb-3 animate-bounce" />
                <div className="text-3xl font-black mb-1 bg-gradient-to-r from-blue-400 to-slate-400 bg-clip-text text-transparent">100% Digital</div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">No More Manual Enrollment Hurdles</p>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* Quick Info & Responsive Contacts */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <ScrollReveal>
          <div className={`rounded-3xl p-8 border flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${
            isDark
              ? "bg-[#07132a] border-slate-800/80"
              : "bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-650 border-blue-500 text-white shadow-lg"
          }`}>
            <div>
              <h3 className={`text-xl font-black mb-2 ${isDark ? "text-white" : "text-white"}`}>Ready to advance your maritime career?</h3>
              <p className={`text-xs ${isDark ? "text-slate-400" : "text-blue-100"}`}>Explore DGS-approved courses and get professional guidance to advance your career at sea.</p>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <Link href="/courses" className={`w-full md:w-auto px-6 py-3.5 text-center text-xs font-black rounded-2xl transition-all shadow-md ${
                isDark ? "bg-gradient-to-r from-blue-600 to-slate-600 text-white hover:from-blue-500" : "bg-white hover:bg-slate-50 text-blue-600"
              }`}>
                Browse Courses
              </Link>
              <Link href="/contact" className={`w-full md:w-auto px-6 py-3.5 text-center text-xs font-black rounded-2xl transition-all border ${
                isDark
                  ? "bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300"
                  : "bg-transparent hover:bg-white/10 text-white border-white/40"
              }`}>
                Contact Support
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
}