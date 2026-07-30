"use client";

import React from "react";
import { useTheme } from "@/providers/theme-provider";
import { 
  TrendingUp, LayoutDashboard, Megaphone, Globe2, Anchor, ChevronRight 
} from "lucide-react";
import Link from "next/link";

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

  const benefits = [
    { icon: TrendingUp, title: "Attractive Commission", desc: "Earn competitive rates for every successful seafarer referral." },
    { icon: LayoutDashboard, title: "Dedicated Agent Dashboard", desc: "Track your leads, commissions, and performance in real-time." },
    { icon: Megaphone, title: "Marketing & Training Support", desc: "Get access to promotional materials and operational training." },
    { icon: Globe2, title: "Nationwide & Global Opportunities", desc: "Expand your reach with our wide network of shipping partners." },
  ];

  return (
    <section id="partnership" className={`py-24 relative overflow-hidden ${isDark ? "bg-[#050a14]" : "bg-slate-50"}`}>
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
                <p className={`text-base leading-relaxed ${isDark ? "text-slate-400" : "text-slate-650"}`}>
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

          {/* Right Side: Clean Call-To-Action Card */}
          <ScrollReveal delay={300}>
            <div className={`p-8 md:p-10 rounded-3xl border backdrop-blur-xl relative overflow-hidden flex flex-col justify-between min-h-[380px] ${
              isDark 
                ? "bg-[#0a1122]/80 border-slate-800/80 shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-white" 
                : "bg-white/80 border-white shadow-[0_8px_32px_rgba(0,0,0,0.08)] text-slate-800"
            }`}>
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-sky-400 to-blue-500" />
              
              <div className="space-y-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  isDark ? "bg-blue-500/10 text-cyan-400" : "bg-blue-50 text-blue-600"
                }`}>
                  <Anchor className="w-6 h-6" />
                </div>
                
                <h3 className={`text-2xl font-black tracking-tight leading-snug ${isDark ? "text-white" : "text-slate-900"}`}>
                  Grow Your Placement Network With Us
                </h3>
                
                <p className={`text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-650"}`}>
                  Become an authorized Manning Agent partner of Hari Om Thalassic. Connect with premium maritime opportunities, access our training portals, and refer seafarers with automated tracking.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800/30">
                <Link
                  href="/partner-registration"
                  className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                    isDark
                      ? "bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/30"
                      : "bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-blue-200"
                  }`}
                >
                  Apply as a Partner <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}
