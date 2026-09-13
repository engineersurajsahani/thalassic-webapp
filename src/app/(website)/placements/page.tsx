"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Briefcase, Building2, FileText, ArrowRight } from "lucide-react";
import { useTheme } from "@/providers/theme-provider";

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
      className={`transition-all duration-1000 transform will-change-transform ${isVisible
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

export default function PlacementsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className={`min-h-screen transition-colors duration-500 font-outfit ${isDark ? "bg-[#050a14] text-slate-100" : "bg-[#f8fafc] text-slate-900"
      }`}>
      <div className="max-w-7xl mx-auto px-6 pt-[88px] md:pt-[96px] pb-24">

        <div className="text-center">
          <ScrollReveal>
            <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${isDark
                ? "bg-blue-950/40 text-blue-300 border-blue-500/10"
                : "bg-blue-50 text-blue-600 border-blue-200"
              }`}>
              // Work In Progress
            </span>

            <h1 className={`mt-6 text-4xl sm:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r ${isDark ? "from-white via-slate-100 to-slate-350" : "from-slate-900 via-blue-950 to-slate-800"
              }`}>
              Placements <span className="font-extralight text-slate-400">Coming Soon</span>
            </h1>

            <p className={`mt-6 max-w-2xl mx-auto text-sm leading-relaxed font-light ${isDark ? "text-slate-400" : "text-slate-650"
              }`}>
              We're building a dedicated placement portal where maritime professionals can connect with leading shipping companies, explore opportunities, and apply for verified jobs.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-16">

          <ScrollReveal delay={100}>
            <div className={`rounded-3xl border p-8 shadow-xl transition-all duration-500 hover:scale-[1.02] h-full flex flex-col justify-between ${isDark
                ? "bg-[#0a1122]/70 border-slate-800 hover:border-blue-500/20"
                : "bg-white border-slate-200 shadow-slate-200/50"
              }`}>
              <div>
                <div className={`p-3 rounded-2xl w-fit mb-6 ${isDark ? "bg-slate-900/60 border border-slate-700/20 text-blue-300" : "bg-blue-50 text-blue-600 border border-blue-100"
                  }`}>
                  <Building2 className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-lg font-black mb-3">Company Hiring</h3>
                <p className={`text-xs leading-relaxed font-light ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Discover verified placement opportunities from trusted maritime companies.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className={`rounded-3xl border p-8 shadow-xl transition-all duration-500 hover:scale-[1.02] h-full flex flex-col justify-between ${isDark
                ? "bg-[#0a1122]/70 border-slate-800 hover:border-blue-500/20"
                : "bg-white border-slate-200 shadow-slate-200/50"
              }`}>
              <div>
                <div className={`p-3 rounded-2xl w-fit mb-6 ${isDark ? "bg-slate-900/60 border border-slate-700/20 text-blue-300" : "bg-blue-50 text-blue-600 border border-blue-100"
                  }`}>
                  <FileText className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-lg font-black mb-3">Resume Builder</h3>
                <p className={`text-xs leading-relaxed font-light ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Build a professional resume tailored for maritime careers.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className={`rounded-3xl border p-8 shadow-xl transition-all duration-500 hover:scale-[1.02] h-full flex flex-col justify-between ${isDark
                ? "bg-[#0a1122]/70 border-slate-800 hover:border-blue-500/20"
                : "bg-white border-slate-200 shadow-slate-200/50"
              }`}>
              <div>
                <div className={`p-3 rounded-2xl w-fit mb-6 ${isDark ? "bg-slate-900/60 border border-slate-700/20 text-blue-300" : "bg-blue-50 text-blue-600 border border-blue-100"
                  }`}>
                  <Briefcase className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-lg font-black mb-3">Job Applications</h3>
                <p className={`text-xs leading-relaxed font-light ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Apply to shipping companies directly through our upcoming portal.
                </p>
              </div>
            </div>
          </ScrollReveal>

        </div>

        <div className="flex justify-center mt-16">
          <ScrollReveal delay={400}>
            <Link
              href="/courses"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 px-8 py-4 rounded-xl font-bold transition text-xs tracking-widest text-white shadow-lg shadow-blue-500/10 cursor-pointer uppercase"
            >
              Explore Courses
              <ArrowRight className="w-4 h-4" />
            </Link>
          </ScrollReveal>
        </div>

      </div>
    </section>
  );
}