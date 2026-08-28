"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/providers/theme-provider";
import { 
  Shield, 
  Zap, 
  AlertTriangle, 
  Calendar, 
  TrendingUp, 
  Compass, 
  Award, 
  CheckCircle2, 
  BookOpen, 
  Briefcase, 
  ShieldCheck, 
  FileText, 
  Globe, 
  MapPin, 
  Mail, 
  Phone, 
  Clock, 
  Star, 
  Lock, 
  Building2, 
  Users, 
  Layers,
  ArrowRight,
  Check,
  ChevronRight,
  Activity,
  Heart,
  Wrench,
  Timer,
  UserCog,
  Search
} from "lucide-react";

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
        threshold: 0.02,
        rootMargin: "0px 0px -20px 0px"
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
          : "opacity-0 translate-y-8 scale-[0.99]"
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

  const getRotationColor = (idx: number) => {
    const colors = [
      isDark ? "text-sky-400" : "text-sky-600",
      isDark ? "text-emerald-400" : "text-emerald-600",
      isDark ? "text-orange-400" : "text-orange-600",
      isDark ? "text-purple-400" : "text-purple-600"
    ];
    return colors[idx % 4];
  };

  return (
    <div className={`transition-colors duration-500 min-h-screen font-outfit ${
      isDark ? "bg-[#040810] text-slate-100" : "bg-[#f8fafc] text-slate-900"
    }`}>

      {/* Brand Accent Top Strip */}


      {/* 1. Hero / Intro Block */}
      <section className="relative pt-20 pb-16 md:pt-24 md:pb-20 bg-[#0F1B2D] text-white overflow-hidden text-center z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 flex flex-col items-center">
          <ScrollReveal>
            {/* Logo badge */}
            <div className="flex justify-center mb-4">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-cyan-500/20 shadow-2xl bg-slate-900">
                <Image 
                  src="/logo.jpeg" 
                  alt="Hari Om Thalassic Logo" 
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>

            {/* Pill badge (above title) */}
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase mb-4 border bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
              ⚓ CORPORATE PARTNERSHIP PITCH DECK
            </div>

            {/* Main title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight mb-3 uppercase leading-none">
              HARI OM <span className="text-cyan-400">THALASSIC</span>
            </h1>

            {/* Tagline */}
            <p className="text-base md:text-xl font-bold italic text-cyan-400 mb-4">
              "Assistance at Sea, Support on Land."
            </p>

            {/* Description line */}
            <p className="text-xs md:text-sm max-w-2xl mx-auto leading-relaxed text-slate-300 font-light mb-6">
              Your End-to-End One-Stop Solution for Ethical Maritime Documentation, DG Shipping Compliance & Candidate Upgradation
            </p>

            {/* Divider */}
            <div className="w-20 h-px bg-slate-700/65 mx-auto mb-6" />

            {/* Bottom pill badge */}
            <div className="text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center justify-center gap-2">
              <span>🤝</span> STRATEGIC TIE-UPS & ASSISTANCE FOR LEADING MARITIME MNCs & SHIP MANAGEMENT COMPANIES
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. Executive Summary */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <ScrollReveal>
          <div className="text-center md:text-left mb-10">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Executive Summary</h2>
            <div className="w-12 h-1 bg-cyan-500 rounded-full" />
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Card 1 — 100% Ethical & DG Compliant */}
          <ScrollReveal delay={100}>
            <div className={`border rounded-2xl p-8 h-full flex flex-col gap-5 transition-all duration-300 hover:shadow-md ${
              isDark ? "bg-[#0b1329] border-slate-800" : "bg-white border-slate-200"
            }`}>
              {/* Icon — bare, light-blue rounded square, matching PDF */}
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isDark ? "bg-blue-950/50 text-blue-400" : "bg-blue-50 text-blue-600"
              }`}>
                <Shield className="w-5 h-5" />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-black">100% Ethical &amp; DG Compliant</h3>
                <p className={`text-sm leading-relaxed font-light ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}>
                  We provide complete, end-to-end documentation assistance adhering strictly to all updated DG Shipping rules and amended regulations, guaranteeing 100% legal integrity for candidate processing.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2 — Hassle-Free One-Stop Service */}
          <ScrollReveal delay={200}>
            <div className={`border rounded-2xl p-8 h-full flex flex-col gap-5 transition-all duration-300 hover:shadow-md ${
              isDark ? "bg-[#0b1329] border-slate-800" : "bg-white border-slate-200"
            }`}>
              {/* Icon — bare, teal rounded square, matching PDF */}
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isDark ? "bg-emerald-950/50 text-emerald-400" : "bg-emerald-50 text-emerald-600"
              }`}>
                <Zap className="w-5 h-5" />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-black">Hassle-Free One-Stop Service</h3>
                <p className={`text-sm leading-relaxed font-light ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}>
                  Eliminate administrative bottlenecks for your crew. From INDOS creation &amp; profile updates to TARBook issuance, COPs, C1/D US visas, and flag state documentation, we handle every step seamlessly.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 16. Proven Track Record & Industry Reputation */}
      <section className={`py-16 transition-colors ${isDark ? "bg-[#040810]" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center md:text-left mb-10">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Proven Track Record &amp; Industry Reputation</h2>
              <div className="w-12 h-1 bg-cyan-500 rounded-full" />
            </div>
          </ScrollReveal>
          {/* 4-stat light-blue row — matches PDF */}
          <ScrollReveal delay={100}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { val: "4.9★", sub: "★★★★★", label: "GOOGLE RATING" },
                { val: "1,000+", sub: "Candidate Reviews", label: "VERIFIED RATINGS" },
                { val: "4.5+", sub: "Years Registered", label: "FLAWLESS OPERATION" },
                { val: "100%", sub: "Zero Complaints", label: "CLIENT SATISFACTION" }
              ].map((stat, sIdx) => (
                <div key={sIdx} className={`rounded-xl p-4 text-center border ${
                  isDark ? "bg-blue-950/20 border-blue-900/30" : "bg-blue-50 border-blue-100"
                }`}>
                  <div className={`text-2xl md:text-3xl font-black ${isDark ? "text-blue-300" : "text-blue-600"}`}>{stat.val}</div>
                  <div className={`text-[10px] font-medium mt-0.5 ${isDark ? "text-blue-400" : "text-blue-500"}`}>{stat.sub}</div>
                  <div className={`text-[9px] font-black uppercase tracking-wider mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>{stat.label}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>
          {/* 2×2 left-border cards — matches PDF */}
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { title: "6 Years Industry Experience", icon: Briefcase,
                leftColor: "border-l-blue-500", iconColor: isDark ? "text-blue-400" : "text-blue-600",
                desc: "Providing trusted services in the maritime domain for over 6 years, working closely with industry experts to deliver seamless, one-stop crew solutions for ship management companies."
              },
              { title: "Flawless Corporate Record", icon: ShieldCheck,
                leftColor: "border-l-teal-500", iconColor: isDark ? "text-teal-400" : "text-teal-600",
                descParts: [
                  { text: "Completed 4.5+ years as a registered entity with " },
                  { text: "zero negative reports", bold: true },
                  { text: " and 100% satisfaction maintained across partner companies and thousands of seafarers." }
                ]
              },
              { title: "Expert-Led Crew Management", icon: Users,
                leftColor: "border-l-orange-400", iconColor: isDark ? "text-orange-400" : "text-orange-500",
                desc: "Collaborating directly with maritime veteran advisors to ensure candidate documentation aligns perfectly with changing statutory mandates and fleet readiness."
              },
              { title: "Most Trusted Seafarer Partner", icon: Star,
                leftColor: "border-l-purple-500", iconColor: isDark ? "text-purple-400" : "text-purple-600",
                desc: "Renowned across the industry for serving candidates with absolute transparency and ethical commitment, building long-term goodwill and corporate reliability."
              }
            ].map((card, idx) => (
              <ScrollReveal key={idx} delay={idx * 80}>
                <div className={`border-l-4 rounded-r-xl rounded-l-sm p-6 h-full flex flex-col gap-3 ${
                  isDark ? `bg-[#0b1329] border border-slate-800/60 ${card.leftColor}` : `bg-white border border-slate-200 shadow-sm ${card.leftColor}`
                }`}>
                  <div className="flex items-center gap-2.5">
                    <card.icon className={`w-5 h-5 shrink-0 ${card.iconColor}`} />
                    <h5 className={`text-sm font-black leading-snug ${isDark ? "text-white" : "text-slate-800"}`}>{card.title}</h5>
                  </div>
                  <p className={`text-[12px] leading-relaxed font-light ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    {"descParts" in card
                      ? card.descParts!.map((p, pi) => p.bold ? <strong key={pi} className="font-black">{p.text}</strong> : <span key={pi}>{p.text}</span>)
                      : card.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3. The Industry Challenge */}
      <section className={`py-20 transition-colors ${isDark ? "bg-slate-950/40" : "bg-slate-100/50"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center md:text-left mb-12">
              <span className={`text-[10px] font-black uppercase tracking-[0.25em] mb-3 inline-block ${
                isDark ? "text-cyan-400" : "text-cyan-600"
              }`}>// Why It Matters</span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">The Industry Challenge</h2>
              <div className="w-12 h-1 bg-cyan-500 rounded-full" />
              <p className={`mt-4 text-sm font-light max-w-2xl leading-relaxed ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}>
                Maritime documentation is riddled with complexity. Here is what seafarers and ship managers face every day — and why we exist.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Stricter DG Regulations",
                desc: "With DG Shipping constantly tightening compliance rules and portal verification norms, candidates face complex obstacles obtaining correct e-certificates and document approvals on time.",
                icon: Wrench,
                iconBg: isDark ? "bg-blue-950/50 text-blue-400" : "bg-blue-50 text-blue-600"
              },
              {
                title: "Candidate Sign-On Delays",
                desc: "Seafarers often get entangled in TARBook submissions, COP applications, profile discrepancies, or visa delays, holding up critical crew joining schedules.",
                icon: Timer,
                iconBg: isDark ? "bg-blue-950/50 text-blue-400" : "bg-blue-50 text-blue-600"
              },
              {
                title: "Skill & Profile Upgradation Gap",
                desc: "Leading MNCs require thoroughly vetted, properly endorsed candidates whose profiles are updated and fully upgraded for specialized fleet requirements.",
                icon: UserCog,
                iconBg: isDark ? "bg-blue-950/50 text-blue-400" : "bg-blue-50 text-blue-600"
              }
            ].map((challenge, idx) => (
              <ScrollReveal key={idx} delay={idx * 120}>
                <div className={`border rounded-2xl p-7 h-full flex flex-col gap-5 transition-all duration-300 hover:shadow-md ${
                  isDark ? "bg-[#0b1329] border-slate-800" : "bg-white border-slate-200"
                }`}>
                  {/* Icon badge — matches PDF: bare light-blue rounded square */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    challenge.iconBg
                  }`}>
                    <challenge.icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-base font-black leading-snug">{challenge.title}</h4>
                    <p className={`text-sm leading-relaxed font-light ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}>
                      {challenge.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Our Value Proposition */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-6 space-y-6 text-left">
            <ScrollReveal>
              <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border inline-block ${
                isDark ? "bg-cyan-500/5 border-cyan-500/10 text-cyan-300" : "bg-cyan-50 border-cyan-200 text-cyan-655"
              }`}>
                // Our Value Proposition
              </span>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                Dedicated Partner for Corporate MNCs
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" />
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <p className={`text-base leading-relaxed font-light ${isDark ? "text-slate-300" : "text-slate-650"}`}>
                Hari Om Thalassic operates as an extended documentation wing for top ship management companies and crewing agencies across India. 
                We guide candidates through every ethical route, ensuring they receive genuine, timely, and fully upgraded documents without operational friction or bureaucratic hurdles.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="flex gap-6 text-xs font-bold uppercase text-slate-500">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4.5 h-4.5 text-cyan-500" /> DGS Approved Pathways</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4.5 h-4.5 text-cyan-500" /> Crew Mobilization Ready</span>
              </div>
            </ScrollReveal>
          </div>

          <div className="md:col-span-6">
            <ScrollReveal delay={300}>
              <div className="relative rounded-3xl overflow-hidden aspect-[16/10] border border-slate-200/10 shadow-xl group">
                <Image 
                  src="https://astra-crew.com/_next/image?url=https%3A%2F%2Fastra-crew.com%2Fstorage%2Farticles%2Fthe-most-dangerous-and-safest-types-of-ships--astra-crew-maritime-recruitment%2F58989532-1a69-454f-82a1-3b88a545471a.jpg&w=1920&q=75"
                  alt="Container ship at sea"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-[8px] text-white/80 px-2 py-0.5 rounded font-mono z-10">
                  Source: astra-crew.com
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 5. Permitted CDC Pathways & Compliance */}
      <section className={`py-16 transition-colors ${isDark ? "bg-slate-950/40" : "bg-slate-50"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center md:text-left mb-10">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Permitted CDC Pathways &amp; Compliance</h2>
              <div className="w-12 h-1 bg-cyan-500 rounded-full" />
            </div>
          </ScrollReveal>

          {/* 2×2 Grid — matching PDF layout */}
          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                title: "Pre-Sea Certificate Holders",
                desc: "Candidates who have completed DG-approved pre-sea training courses (B.Sc Nautical, DNS, BE Marine, GME, GP Rating, ETO, CCMC) along with 5 basic STCW safety courses.",
                icon: BookOpen,
                leftColor: "border-l-blue-500",
                iconColor: isDark ? "text-blue-400" : "text-blue-600"
              },
              {
                title: "Hospitality Sector & Cruise CDC",
                desc: "Degree/Diploma in Hotel Management + OCCP + 5 STCW courses, OR structured engagement via DG-approved Cruise RPSL companies with official Offer Letters (Cruise-Restricted CDC).",
                icon: Building2,
                leftColor: "border-l-orange-400",
                iconColor: isDark ? "text-orange-400" : "text-orange-500"
              },
              {
                title: "CoC, Certified Cooks & Defense Personnel",
                desc: "Certified Cooks (Cook CoC), CoC Officers, Ex-Indian Navy, and Agniveer Discharge Certificate holders completing 5 STCW courses qualify under compliant pathways.",
                icon: Award,
                leftColor: "border-l-emerald-500",
                iconColor: isDark ? "text-emerald-400" : "text-emerald-600"
              },
              {
                title: "General CDC & Profile Processing",
                desc: "End-to-end legal filing, verification, and portal alignment ensuring candidate CDCs are procured legally and without bureaucratic delays.",
                icon: ShieldCheck,
                leftColor: "border-l-purple-500",
                iconColor: isDark ? "text-purple-400" : "text-purple-600"
              }
            ].map((pathway, idx) => (
              <ScrollReveal key={idx} delay={idx * 80}>
                <div className={`border-l-4 rounded-r-xl rounded-l-sm p-6 h-full flex flex-col gap-3 ${
                  isDark
                    ? `bg-[#0b1329] border border-slate-800/60 ${pathway.leftColor}`
                    : `bg-white border border-slate-200 shadow-sm ${pathway.leftColor}`
                }`}>
                  {/* Icon + Title inline — matches PDF */}
                  <div className="flex items-center gap-2.5">
                    <pathway.icon className={`w-5 h-5 shrink-0 ${pathway.iconColor}`} />
                    <h5 className={`text-sm font-black leading-snug ${isDark ? "text-white" : "text-slate-800"}`}>
                      {pathway.title}
                    </h5>
                  </div>
                  {/* Description */}
                  <p className={`text-[12px] leading-relaxed font-light ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    {pathway.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>


      {/* 6. Cruise Fleet Solutions — Shortlist to Sign-On */}
      <section className={`py-16 transition-colors ${isDark ? "bg-[#040810]" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center md:text-left mb-10">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Cruise Fleet Solutions – Shortlist to Sign-On</h2>
              <div className="w-12 h-1 bg-cyan-500 rounded-full" />
            </div>
          </ScrollReveal>

          {/* 2×2 Grid — matching PDF layout */}
          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                title: "RPSL Offer Letter & INDOS Mapping",
                desc: "For shortlisted cruise candidates, we map official Offer Letters from DG-approved RPSL companies into the DG portal for INDOS creation and Cruise-Restricted CDC issuance.",
                icon: FileText,
                leftColor: "border-l-blue-500",
                iconColor: isDark ? "text-blue-400" : "text-blue-600",
                highlight: false
              },
              {
                title: "Catering Degree + OCCP Verification",
                desc: "Assisting hospitality candidates holding 1-Year Diplomas or 3-Year Degrees with 5 basic STCW courses + OCCP enrollment for CDC and Ship's Cook CoC endorsements.",
                icon: Award,
                leftColor: "border-l-emerald-500",
                iconColor: isDark ? "text-emerald-400" : "text-emerald-600",
                highlight: false
              },
              {
                title: "BSID (SID Card) & C1/D US Visa",
                desc: "Complete execution of BSID (Biometric Seafarer ID) applications, appointment booking, and specialized C1/D US Maritime Crew Visa documentation and interview scheduling.",
                icon: Globe,
                iconColor: isDark ? "text-purple-400" : "text-purple-600",
                highlight: false
              },
              {
                title: "Shortlist-to-Sign-On Turnkey Solution",
                descParts: [
                  { text: "Once your crewing team shortlists a candidate for your cruise fleet, Hari Om Thalassic manages " },
                  { text: "100% of the process top-to-bottom", bold: true },
                  { text: ", delivering fully compliant seafarers." }
                ],
                icon: Zap,
                iconColor: isDark ? "text-cyan-400" : "text-cyan-600",
                highlight: true
              }
            ].map((sol, idx) => (
              <ScrollReveal key={idx} delay={idx * 80}>
                <div className={`rounded-xl p-6 h-full flex flex-col gap-3 border transition-all duration-300 ${
                  sol.highlight
                    ? isDark
                      ? "bg-cyan-950/25 border-cyan-900/40"
                      : "bg-sky-50/70 border-sky-200/80 shadow-sm"
                    : isDark
                      ? "bg-[#0b1329] border-slate-700"
                      : "bg-white border-slate-200"
                }`}>
                  {/* Icon + Title inline — matches PDF */}
                  <div className="flex items-center gap-2.5">
                    <sol.icon className={`w-5 h-5 shrink-0 ${sol.iconColor}`} />
                    <h5 className={`text-sm font-black leading-snug ${
                      isDark ? "text-white" : sol.highlight ? "text-sky-900" : "text-slate-800"
                    }`}>
                      {sol.title}
                    </h5>
                  </div>
                  {/* Description — supports bold inline text for card 4 */}
                  <p className={`text-[12px] leading-relaxed font-light ${
                    isDark ? "text-slate-400" : sol.highlight ? "text-sky-800" : "text-slate-600"
                  }`}>
                    {"descParts" in sol
                      ? sol.descParts!.map((part, pIdx) =>
                          part.bold
                            ? <strong key={pIdx} className="font-black">{part.text}</strong>
                            : <span key={pIdx}>{part.text}</span>
                        )
                      : sol.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>


      {/* 7. GP Rating Upgradation & Eligibility */}
      <section className={`py-16 transition-colors ${isDark ? "bg-slate-950/40" : "bg-slate-50"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center md:text-left mb-10">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">GP Rating Upgradation &amp; Eligibility</h2>
              <div className="w-12 h-1 bg-cyan-500 rounded-full" />
            </div>
          </ScrollReveal>

          {/* 2×2 Grid — matching PDF layout */}
          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                title: "Technical Reserved Quota",
                desc: "Guidance and placement for GP Rating seats reserved for candidates holding 1-year ITI / Govt diplomas in Fitter, Mechanic, Electrical, Plumbing, Computer, or IACS Welding.",
                icon: Wrench,
                leftColor: "border-l-blue-500",
                iconColor: isDark ? "text-blue-400" : "text-blue-600"
              },
              {
                title: "Expanded Age Eligibility (28 Years)",
                desc: "Upper age limit for GP Rating entry up to 28 years (with applicable SC/ST relaxations), expanding eligibility for mature, skilled technical candidates joining your fleet.",
                icon: Calendar,
                leftColor: "border-l-teal-500",
                iconColor: isDark ? "text-teal-400" : "text-teal-600"
              },
              {
                title: "Trade Skill Verification",
                desc: "We verify candidate trade certificates against DG Shipping guidelines, ensuring trade-certified ratings enter your fleet with genuine technical competencies.",
                icon: Users,
                leftColor: "border-l-orange-400",
                iconColor: isDark ? "text-orange-400" : "text-orange-500"
              },
              {
                title: "Seafarer Profile Protection",
                desc: "Comprehensive profile auditing ensuring all serving seafarers in your active pool maintain valid, compliant documentation without operational disruption.",
                icon: Shield,
                leftColor: "border-l-purple-500",
                iconColor: isDark ? "text-purple-400" : "text-purple-600"
              }
            ].map((gp, idx) => (
              <ScrollReveal key={idx} delay={idx * 80}>
                <div className={`border-l-4 rounded-r-xl rounded-l-sm p-6 h-full flex flex-col gap-3 ${
                  isDark
                    ? `bg-[#0b1329] border border-slate-800/60 ${gp.leftColor}`
                    : `bg-white border border-slate-200 shadow-sm ${gp.leftColor}`
                }`}>
                  {/* Icon + Title inline — matches PDF */}
                  <div className="flex items-center gap-2.5">
                    <gp.icon className={`w-5 h-5 shrink-0 ${gp.iconColor}`} />
                    <h5 className={`text-sm font-black leading-snug ${isDark ? "text-white" : "text-slate-800"}`}>
                      {gp.title}
                    </h5>
                  </div>
                  {/* Description */}
                  <p className={`text-[12px] leading-relaxed font-light ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    {gp.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>


      {/* 8. Identity & Primary Documentation */}
      <section className={`py-16 transition-colors ${isDark ? "bg-[#040810]" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center md:text-left mb-10">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Identity &amp; Primary Documentation</h2>
              <div className="w-12 h-1 bg-cyan-500 rounded-full" />
            </div>
          </ScrollReveal>

          {/* 3-column grid — matches PDF page 8 */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 — CDC & INDOS Assistance */}
            <ScrollReveal delay={0}>
              <div className={`border rounded-2xl p-7 h-full flex flex-col gap-5 transition-all duration-300 hover:shadow-md ${
                isDark ? "bg-[#0b1329] border-slate-800" : "bg-white border-slate-200"
              }`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isDark ? "bg-blue-950/50 text-blue-400" : "bg-blue-50 text-blue-600"
                }`}>
                  <FileText className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h4 className={`text-base font-black leading-snug ${isDark ? "text-white" : "text-slate-800"}`}>
                    CDC &amp; INDOS Assistance
                  </h4>
                  <p className={`text-sm leading-relaxed font-light ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    Fresh INDOS application creation, profile updating assistance, CDC application (General &amp; Cruise), CDC renewal, duplicate, and replacement services under DG Shipping rules.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 2 — BSID & Passport Services */}
            <ScrollReveal delay={100}>
              <div className={`border rounded-2xl p-7 h-full flex flex-col gap-5 transition-all duration-300 hover:shadow-md ${
                isDark ? "bg-[#0b1329] border-slate-800" : "bg-white border-slate-200"
              }`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isDark ? "bg-blue-950/50 text-blue-400" : "bg-blue-50 text-blue-600"
                }`}>
                  <Layers className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h4 className={`text-base font-black leading-snug ${isDark ? "text-white" : "text-slate-800"}`}>
                    BSID &amp; Passport Services
                  </h4>
                  <p className={`text-sm leading-relaxed font-light ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    End-to-end assistance for BSID (Biometric Seafarer Identity Document) applications, fresh passport applications, passport renewals, and damaged passport re-issuance.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 3 — C1/D US Maritime Visa (with bold inline text) */}
            <ScrollReveal delay={200}>
              <div className={`border rounded-2xl p-7 h-full flex flex-col gap-5 transition-all duration-300 hover:shadow-md ${
                isDark ? "bg-[#0b1329] border-slate-800" : "bg-white border-slate-200"
              }`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isDark ? "bg-blue-950/50 text-blue-400" : "bg-blue-50 text-blue-600"
                }`}>
                  <Globe className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h4 className={`text-base font-black leading-snug ${isDark ? "text-white" : "text-slate-800"}`}>
                    C1/D US Maritime Visa
                  </h4>
                  <p className={`text-sm leading-relaxed font-light ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    Specialized application, documentation verification, and appointment scheduling strictly for{" "}
                    <strong className="font-black">C1/D US Crew Visas</strong>{" "}
                    tailored exclusively for maritime seafarers.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>


      {/* 9. Certification, TARBook & COPs */}
      <section className={`py-16 transition-colors ${isDark ? "bg-[#040810]" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center md:text-left mb-10">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Certification, TARBook &amp; COPs</h2>
              <div className="w-12 h-1 bg-cyan-500 rounded-full" />
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left — checklist matching PDF style */}
            <div className="space-y-5">
              {[
                {
                  title: "TARBook Issuance & Review",
                  desc: "Official TARBook issuance to candidates with complete step-by-step guidance for Deck & Engine ranks."
                },
                {
                  title: "Watchkeeping & COPs",
                  desc: "Comprehensive filing for Navigational Watchkeeping, Engineering Watchkeeping, Deck COP, and Engine COP."
                },
                {
                  title: "GMDSS Endorsements",
                  desc: "Fast-track processing for GMDSS renewal certificates and GOC verification."
                },
                {
                  title: "DG Profile Updating",
                  desc: "Complete assistance in updating and correcting DG Shipping portal profile details."
                }
              ].map((item, idx) => (
                <ScrollReveal key={idx} delay={idx * 60}>
                  {/* PDF style: blue filled circle icon + bold title inline with desc */}
                  <div className="flex gap-3 items-start">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      <strong className="font-black">{item.title}:</strong>{" "}
                      <span className="font-light">{item.desc}</span>
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Right — navigational officer on ship bridge image */}
            <ScrollReveal delay={200}>
              <div className={`relative rounded-2xl overflow-hidden aspect-[4/3] border shadow-lg group ${
                isDark ? "border-slate-800" : "border-slate-200"
              }`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://ik.imagekit.io/mwakqpfup/ship_master_ship_office_ab0cjq.jpg"
                  alt="Navigational seafarer officer on ship bridge"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-[8px] text-white/80 px-2 py-0.5 rounded font-mono z-10">
                  Navigational officer on ship bridge
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>




      {/* 10. DG Courses: Pre-Sea & Entry Programs */}
      <section className={`py-16 transition-colors ${isDark ? "bg-[#040810]" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center md:text-left mb-10">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">DG Courses: Pre-Sea &amp; Entry Programs</h2>
              <div className="w-12 h-1 bg-cyan-500 rounded-full" />
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { title: "Nautical Cadets & Ratings", icon: Compass, leftColor: "border-l-blue-500", iconColor: isDark ? "text-blue-400" : "text-blue-600",
                items: ["B.Sc Nautical Science (3 Years Degree)", "Diploma in Nautical Science (DNS - 1 Year)", "B.Sc (Maritime Science) Polyvalent Course", "Training for General Purpose (GP) Ratings (6 Months)"] },
              { title: "Marine Engineering Cadets", icon: Activity, leftColor: "border-l-teal-500", iconColor: isDark ? "text-teal-400" : "text-teal-600",
                items: ["B.E. / B.Tech Marine Engineering (4 Years)", "Graduate Marine Engineering (GME - 1 Year)", "Pre-Sea Training for Diploma Holders (2 Years)", "Bridging Course for ATS Candidates"] },
              { title: "Electro-Technical Officers (ETO)", icon: Zap, leftColor: "border-l-orange-400", iconColor: isDark ? "text-orange-400" : "text-orange-500",
                items: ["Electro Technical Officers Course (ETO - 85 Days)", "Bridging Course for Existing Electrical Officers to ETO", "Special ETO Bridging Course (Non-qualifying eligibility)"] },
              { title: "Catering & Cruise Services", icon: Users, leftColor: "border-l-purple-500", iconColor: isDark ? "text-purple-400" : "text-purple-600",
                items: ["Certificate Course in Maritime Catering (CCMC - 6 Months)", "Orientation Course for Catering Personnel (OCCP)", "Applying Cruise-Only Vessel CDCs & Endorsements"] }
            ].map((sub, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className={`border-l-4 rounded-r-xl rounded-l-sm p-6 h-full flex flex-col gap-3 ${
                  isDark ? `bg-[#0b1329] border border-slate-800/60 ${sub.leftColor}` : `bg-white border border-slate-200 shadow-sm ${sub.leftColor}`
                }`}>
                  <div className="flex items-center gap-2.5">
                    <sub.icon className={`w-5 h-5 shrink-0 ${sub.iconColor}`} />
                    <h4 className={`text-sm font-black leading-snug ${isDark ? "text-white" : "text-slate-800"}`}>{sub.title}</h4>
                  </div>
                  <ul className={`text-[12px] space-y-1 font-light ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    {sub.items.map((item, j) => <li key={j} className="flex gap-2"><span className="text-current opacity-50 shrink-0">•</span>{item}</li>)}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 11. DG Courses: STCW, Security & Tankers */}
      <section className={`py-16 transition-colors ${isDark ? "bg-slate-950/40" : "bg-slate-50"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center md:text-left mb-10">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">DG Courses: STCW, Security &amp; Tankers</h2>
              <div className="w-12 h-1 bg-cyan-500 rounded-full" />
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { title: "Basic STCW Safety Modular", icon: ShieldCheck, leftColor: "border-l-blue-500", iconColor: isDark ? "text-blue-400" : "text-blue-600",
                items: ["Basic Safety Training (BST - 11 Days: PST, FPFF, EFA, PSSR)", "Augmentation of FPFF (Practical Tanker Fire Fighting)", "Basic Offshore Safety Course"] },
              { title: "Maritime Security Courses", icon: Shield, leftColor: "border-l-teal-500", iconColor: isDark ? "text-teal-400" : "text-teal-600",
                items: ["Security Training for Seafarers with Designated Duties (STSDSD)", "Ship Security Officer (SSO - 2 Days)", "Company Security Officer (CSO) & Port Facility Officer (PFSO)"] },
              { title: "Tanker Cargo Operations (DC)", icon: Layers, leftColor: "border-l-orange-400", iconColor: isDark ? "text-orange-400" : "text-orange-500",
                items: ["Basic & Advanced Oil Tanker Operations (BTOCO / ATOCO - TASCO)", "Basic & Advanced Chemical Tanker Operations (BTCO / ATCCO - CHEMCO)", "Basic & Advanced Liquefied Gas Operations (BLGCO / ATGCO - GASCO)", "LNG Tanker Cargo Operations Familiarization"] },
              { title: "Dual-Fuel, IGF & Polar Waters", icon: Globe, leftColor: "border-l-purple-500", iconColor: isDark ? "text-purple-400" : "text-purple-600",
                items: ["Basic & Advanced Training for Ships using IGF Code Fuels", "Basic & Advanced Training for Ships Operating in Polar Waters", "Crowd Management, Passenger Safety & Crisis Management"] }
            ].map((sub, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className={`border-l-4 rounded-r-xl rounded-l-sm p-6 h-full flex flex-col gap-3 ${
                  isDark ? `bg-[#0b1329] border border-slate-800/60 ${sub.leftColor}` : `bg-white border border-slate-200 shadow-sm ${sub.leftColor}`
                }`}>
                  <div className="flex items-center gap-2.5">
                    <sub.icon className={`w-5 h-5 shrink-0 ${sub.iconColor}`} />
                    <h4 className={`text-sm font-black leading-snug ${isDark ? "text-white" : "text-slate-800"}`}>{sub.title}</h4>
                  </div>
                  <ul className={`text-[12px] space-y-1 font-light ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    {sub.items.map((item, j) => <li key={j} className="flex gap-2"><span className="text-current opacity-50 shrink-0">•</span>{item}</li>)}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 12. DG Courses: Advanced Modular & Simulators */}
      <section className={`py-16 transition-colors ${isDark ? "bg-[#040810]" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center md:text-left mb-10">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">DG Courses: Advanced Modular &amp; Simulators</h2>
              <div className="w-12 h-1 bg-cyan-500 rounded-full" />
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { title: "Advanced Safety & Medical", icon: Heart, leftColor: "border-l-blue-500", iconColor: isDark ? "text-blue-400" : "text-blue-600",
                items: ["Advanced Training in Fire Fighting (AFF - 4 Days)", "Proficiency in Survival Craft and Rescue Boats (PSCRB - 5 Days)", "Fast Rescue Boats (FRB - 3 Days)", "Medical First Aid (MFA - 4 Days) & Medical Care (10 Days)"] },
              { title: "Bridge Navigation & GMDSS", icon: Compass, leftColor: "border-l-teal-500", iconColor: isDark ? "text-teal-400" : "text-teal-600",
                items: ["Electronic Chart Display and Information Systems (ECDIS)", "Automatic Radar Plotting Aids (ARPA) & Radar Observer (ROS)", "Radar and Navigation Simulator (RANS) & Ship Manoeuvering", "GMDSS General Operator (GOC) & Restricted Operator (ROC)"] },
              { title: "Engine & Electrical Simulators", icon: Activity, leftColor: "border-l-orange-400", iconColor: isDark ? "text-orange-400" : "text-orange-500",
                items: ["Engine Room Simulator (ERS - Operational & Management Level)", "High Voltage Safety & Switchgear (Management & Ops Level)", "Diesel Engine Combustion Gas Simulator", "Marine Boiler & Steam Engineering Course (Ops & Mgmt)"] },
              { title: "Cargo Handling Simulators", icon: Layers, leftColor: "border-l-purple-500", iconColor: isDark ? "text-purple-400" : "text-purple-600",
                items: ["Liquid Cargo Handling Simulator - Oil (Management Level)", "Liquid Cargo Handling Simulator - Chemical", "Liquid Cargo Handling Simulator - Gas / LPG / LNG"] }
            ].map((sub, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className={`border-l-4 rounded-r-xl rounded-l-sm p-6 h-full flex flex-col gap-3 ${
                  isDark ? `bg-[#0b1329] border border-slate-800/60 ${sub.leftColor}` : `bg-white border border-slate-200 shadow-sm ${sub.leftColor}`
                }`}>
                  <div className="flex items-center gap-2.5">
                    <sub.icon className={`w-5 h-5 shrink-0 ${sub.iconColor}`} />
                    <h4 className={`text-sm font-black leading-snug ${isDark ? "text-white" : "text-slate-800"}`}>{sub.title}</h4>
                  </div>
                  <ul className={`text-[12px] space-y-1 font-light ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    {sub.items.map((item, j) => <li key={j} className="flex gap-2"><span className="text-current opacity-50 shrink-0">•</span>{item}</li>)}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 13. Competency, Refresher (RUT) & Skill Courses */}
      <section className={`py-16 transition-colors ${isDark ? "bg-slate-950/40" : "bg-slate-50"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center md:text-left mb-10">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Competency, Refresher (RUT) &amp; Skill Courses</h2>
              <div className="w-12 h-1 bg-cyan-500 rounded-full" />
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { title: "Deck Competency Courses", icon: Compass, leftColor: "border-l-blue-500", iconColor: isDark ? "text-blue-400" : "text-blue-600",
                items: ["Second Mate (FG / NCV) Foundation & Competency Course", "Chief Mate (FG Phase I & II / NCV Phase 2)", "Master (FG / NCV) Advanced Shipboard Management (ASM)"] },
              { title: "Engine Competency Courses", icon: Wrench, leftColor: "border-l-teal-500", iconColor: isDark ? "text-teal-400" : "text-teal-600",
                items: ["MEO Class IV (FG / NCV) Competency Course", "MEO Class II & Class I Competency Courses", "Extra Chief Engineer & MEO (NCV SEO / CEO)"] },
              { title: "Mandatory STCW Refresher (RUT)", icon: Timer, leftColor: "border-l-orange-400", iconColor: isDark ? "text-orange-400" : "text-orange-500",
                items: ["Refresher PST, FPFF, PSCRB, AFF, FRB & Medical Care", "Revalidation Course for Masters and Deck Officers", "Refresher & Updating Course for Engineers (Ops & Mgmt)"] },
              { title: "Value-Added & Trainer Courses", icon: Star, leftColor: "border-l-purple-500", iconColor: isDark ? "text-purple-400" : "text-purple-600",
                items: ["Ship's Cook Training & Certification", "Vertical Integration Course for Trainers (VICT) & AECS", "Train the Simulator Trainer and Assessor Course (TSTA)", "Flag State Endorsements & Flag Courses (Panama, Liberia, etc.)"] }
            ].map((sub, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className={`border-l-4 rounded-r-xl rounded-l-sm p-6 h-full flex flex-col gap-3 ${
                  isDark ? `bg-[#0b1329] border border-slate-800/60 ${sub.leftColor}` : `bg-white border border-slate-200 shadow-sm ${sub.leftColor}`
                }`}>
                  <div className="flex items-center gap-2.5">
                    <sub.icon className={`w-5 h-5 shrink-0 ${sub.iconColor}`} />
                    <h4 className={`text-sm font-black leading-snug ${isDark ? "text-white" : "text-slate-800"}`}>{sub.title}</h4>
                  </div>
                  <ul className={`text-[12px] space-y-1 font-light ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    {sub.items.map((item, j) => <li key={j} className="flex gap-2"><span className="text-current opacity-50 shrink-0">•</span>{item}</li>)}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 14. Courses & Flag State Solutions — table */}
      <section className={`py-16 transition-colors ${isDark ? "bg-[#040810]" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center md:text-left mb-10">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Courses &amp; Flag State Solutions</h2>
              <div className="w-12 h-1 bg-cyan-500 rounded-full" />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div className={`border rounded-xl overflow-hidden ${isDark ? "border-slate-800" : "border-slate-200 shadow-sm"}`}>
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#0F1B2D] text-white font-bold">
                    <th className="p-4 w-1/4 text-xs font-black uppercase tracking-wider">Category</th>
                    <th className="p-4 w-1/2 text-xs font-black uppercase tracking-wider">Services &amp; Endorsements Covered</th>
                    <th className="p-4 w-1/4 text-xs font-black uppercase tracking-wider">Target Audience / Fleet</th>
                  </tr>
                </thead>
                <tbody className={`divide-y text-sm font-light ${isDark ? "divide-slate-800 text-slate-400" : "divide-slate-200 text-slate-700"}`}>
                  {[
                    { cat: "Flag State Documentation", srv: "Flag State Endorsements & Flag Courses tailored as per company & vessel flag state requirements", target: "Officers & Ratings (Panama, Liberia, Marshall Is., etc.)" },
                    { cat: "Dangerous Cargo (DC)", srv: "DC Endorsements for Gas Tankers, Oil Tankers, Chemical Tankers & Dual-Fuel Gas Vessels", target: "Deck & Engine Officers & Ratings" },
                    { cat: "DG Approved Courses", srv: "Pre-Sea, STCW Modular, OCCP, Refresher RUTs & On-Demand DG Approved Courses", target: "Cruise & Cargo Fleet Crew" },
                    { cat: "Value-Added Upgradation", srv: "Enrollment assistance to end-point certification for specialized skill development & profile upgrading", target: "Pre-sea Cadets & Serving Seafarers" }
                  ].map((row, rIdx) => (
                    <tr key={rIdx} className={`transition-colors ${isDark ? "hover:bg-slate-800/30" : "hover:bg-slate-50"}`}>
                      <td className={`p-4 font-black text-sm ${isDark ? "text-slate-200" : "text-slate-800"}`}>{row.cat}</td>
                      <td className="p-4">{row.srv}</td>
                      <td className="p-4">{row.target}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </div>
      </section>




      {/* 15. Candidate Audit & Strict Data Privacy */}
      <section className={`py-16 transition-colors ${isDark ? "bg-slate-950/40" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center md:text-left mb-10">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Candidate Audit &amp; Strict Data Privacy</h2>
              <div className="w-12 h-1 bg-cyan-500 rounded-full" />
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-5">
            {/* Top row — white cards */}
            {[
              { title: "Individual Profile Audit & Checklists", icon: Search,
                iconColor: isDark ? "text-blue-400" : "text-blue-600",
                bgCard: isDark ? "bg-[#0b1329] border-slate-700" : "bg-white border-slate-200",
                descParts: [
                  { text: "We systematically audit candidate profiles provided in your database against company requirements and basic DG Shipping norms, verifying amended PSSR course requirements, mandatory " },
                  { text: "Sagar Mein Yog", bold: true },
                  { text: " course completion, and essential joining paperwork." }
                ]
              },
              { title: "Gap Analysis & Fast-Track Assistance", icon: Layers,
                iconColor: isDark ? "text-blue-400" : "text-blue-600",
                bgCard: isDark ? "bg-[#0b1329] border-slate-700" : "bg-white border-slate-200",
                desc: "As per agreement, we proactively notify both company and candidate of required updates, providing end-to-end guidance to execute course enrollments and documentation as quickly as possible for mutual benefit."
              },
              /* Bottom row — light mint-green tint cards */
              { title: "100% Strict Non-Disclosure Policy", icon: Lock,
                iconColor: isDark ? "text-emerald-400" : "text-emerald-600",
                bgCard: isDark ? "bg-emerald-950/25 border-emerald-900/40" : "bg-emerald-50 border-emerald-200/70",
                desc: "We strictly guarantee that candidate details, documents, and data will NEVER be shared with any third-party institution, organization, or external firm for any use or mode. Client data remains 100% protected."
              },
              { title: "Sole Access & Accountable Management", icon: Users,
                iconColor: isDark ? "text-emerald-400" : "text-emerald-600",
                bgCard: isDark ? "bg-emerald-950/25 border-emerald-900/40" : "bg-emerald-50 border-emerald-200/70",
                desc: "Only the authorized Hari Om Thalassic team maintains direct access to candidate profiles. We assume full responsibility for secure file handling, data integrity, and compliance updating."
              }
            ].map((card, idx) => (
              <ScrollReveal key={idx} delay={idx * 80}>
                <div className={`rounded-xl p-6 h-full flex flex-col gap-3 border ${card.bgCard}`}>
                  <div className="flex items-center gap-2.5">
                    <card.icon className={`w-5 h-5 shrink-0 ${card.iconColor}`} />
                    <h5 className={`text-sm font-black leading-snug ${isDark ? "text-white" : "text-slate-800"}`}>{card.title}</h5>
                  </div>
                  <p className={`text-[12px] leading-relaxed font-light ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    {"descParts" in card
                      ? card.descParts!.map((p, pi) => p.bold ? <strong key={pi} className="font-black">{p.text}</strong> : <span key={pi}>{p.text}</span>)
                      : card.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>


      {/* 17. Operational Scale & Cumulative Impact */}
      <section className={`py-16 transition-colors ${isDark ? "bg-slate-950/40" : "bg-slate-50"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center md:text-left mb-10">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Operational Scale &amp; Cumulative Impact</h2>
              <div className="w-12 h-1 bg-cyan-500 rounded-full" />
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { val: "65,000+", label: "Total Seafarers Served", icon: Users,
                leftColor: "border-l-blue-500", valColor: isDark ? "text-blue-400" : "text-blue-600",
                iconColor: isDark ? "text-blue-400" : "text-blue-600",
                descParts: [
                  { text: "In the last 6 years, we have directly served " },
                  { text: "40,000+ candidates", bold: true },
                  { text: " through our Mumbai operations and supported " },
                  { text: "25,000+ candidates indirectly", bold: true },
                  { text: " via our authorized partner network across India." }
                ]
              },
              { val: "15+", label: "Authorized Network Agencies", icon: Building2,
                leftColor: "border-l-teal-500", valColor: isDark ? "text-teal-400" : "text-teal-600",
                iconColor: isDark ? "text-teal-400" : "text-teal-600",
                descParts: [
                  { text: "Operating a robust national footprint with " },
                  { text: "15+ authorized agency partners", bold: true },
                  { text: " across India, with active infrastructure expanding rapidly to support regional crewing requirements." }
                ]
              },
              { val: "2,500+", label: "Annual CDC Applications", icon: FileText,
                leftColor: "border-l-orange-400", valColor: isDark ? "text-orange-400" : "text-orange-500",
                iconColor: isDark ? "text-orange-400" : "text-orange-500",
                descParts: [
                  { text: "Handling comprehensive processing for over " },
                  { text: "2,500 seafarers annually", bold: true },
                  { text: " across fresh CDC applications, CDC renewals, damaged replacement, and duplicate CDC re-issuance." }
                ]
              },
              { val: "800+", label: "Annual Fresh CDCs Issued", icon: Award,
                leftColor: "border-l-purple-500", valColor: isDark ? "text-purple-400" : "text-purple-600",
                iconColor: isDark ? "text-purple-400" : "text-purple-600",
                descParts: [
                  { text: "Successfully issued " },
                  { text: "300+ fresh CDCs", bold: true },
                  { text: " directly through our Mumbai office and " },
                  { text: "500+ fresh CDCs", bold: true },
                  { text: " in the last financial year through our authorized network partners." }
                ]
              }
            ].map((card, idx) => (
              <ScrollReveal key={idx} delay={idx * 80}>
                <div className={`border-l-4 rounded-r-xl rounded-l-sm p-6 h-full flex flex-col gap-2 ${
                  isDark ? `bg-[#0b1329] border border-slate-800/60 ${card.leftColor}` : `bg-white border border-slate-200 shadow-sm ${card.leftColor}`
                }`}>
                  {/* Large number + label row */}
                  <div className="flex items-start justify-between">
                    <span className={`text-2xl font-black leading-none ${card.valColor}`}>{card.val}</span>
                    <div className="flex items-center gap-1.5">
                      <card.icon className={`w-4 h-4 shrink-0 ${card.iconColor}`} />
                      <span className={`text-[11px] font-black ${isDark ? "text-slate-300" : "text-slate-700"}`}>{card.label}</span>
                    </div>
                  </div>
                  <p className={`text-[12px] leading-relaxed font-light ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    {card.descParts.map((p, pi) => p.bold ? <strong key={pi} className="font-black">{p.text}</strong> : <span key={pi}>{p.text}</span>)}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 18. Annual Certification & Training Volume */}
      <section className={`py-16 transition-colors ${isDark ? "bg-[#040810]" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center md:text-left mb-10">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Annual Certification &amp; Training Volume</h2>
              <div className="w-12 h-1 bg-cyan-500 rounded-full" />
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { val: "1,500 / Yr", label: "Watchkeeping Certificates", icon: Award,
                leftColor: "border-l-blue-500", valColor: isDark ? "text-blue-400" : "text-blue-600",
                iconColor: isDark ? "text-blue-400" : "text-blue-600",
                descParts: [
                  { text: "Assisting over " },
                  { text: "1,500 seafarer candidates annually", bold: true },
                  { text: " across India with end-to-end filing and procurement of Navigational & Engineering Watchkeeping Certificates." }
                ]
              },
              { val: "2,000 / Yr", label: "Able Seafarer COPs", icon: Star,
                leftColor: "border-l-teal-500", valColor: isDark ? "text-teal-400" : "text-teal-600",
                iconColor: isDark ? "text-teal-400" : "text-teal-600",
                descParts: [
                  { text: "Guiding around " },
                  { text: "2,000 rating seafarers nationally", bold: true },
                  { text: " every year in obtaining Certificates of Proficiency (COP) for Able Seafarer Deck and Able Seafarer Engine ranks." }
                ]
              },
              { val: "11,000+", label: "STCW & Refresher Courses", icon: Layers,
                leftColor: "border-l-orange-400", valColor: isDark ? "text-orange-400" : "text-orange-500",
                iconColor: isDark ? "text-orange-400" : "text-orange-500",
                descParts: [
                  { text: "Annual training volume of " },
                  { text: "5,000+ candidates", bold: true },
                  { text: " via Mumbai HQ and " },
                  { text: "6,000+ seafarers", bold: true },
                  { text: " through authorized partner agencies for mandatory STCW Refreshers (RUT), modular, and simulator courses." }
                ]
              },
              { val: "100+ / Yr", label: "Pre-Sea Enrolments & Admissions", icon: Users,
                leftColor: "border-l-purple-500", valColor: isDark ? "text-purple-400" : "text-purple-600",
                iconColor: isDark ? "text-purple-400" : "text-purple-600",
                descParts: [
                  { text: "Enrolling " },
                  { text: "100+ candidates annually", bold: true },
                  { text: " for GP Rating and CCMC courses nationwide. Executing structured admissions for GP Rating, CCMC, ETO, and upcoming DNS programs under DG Shipping norms." }
                ]
              }
            ].map((card, idx) => (
              <ScrollReveal key={idx} delay={idx * 80}>
                <div className={`border-l-4 rounded-r-xl rounded-l-sm p-6 h-full flex flex-col gap-2 ${
                  isDark ? `bg-[#0b1329] border border-slate-800/60 ${card.leftColor}` : `bg-white border border-slate-200 shadow-sm ${card.leftColor}`
                }`}>
                  <div className="flex items-start justify-between">
                    <span className={`text-2xl font-black leading-none ${card.valColor}`}>{card.val}</span>
                    <div className="flex items-center gap-1.5">
                      <card.icon className={`w-4 h-4 shrink-0 ${card.iconColor}`} />
                      <span className={`text-[11px] font-black ${isDark ? "text-slate-300" : "text-slate-700"}`}>{card.label}</span>
                    </div>
                  </div>
                  <p className={`text-[12px] leading-relaxed font-light ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    {card.descParts.map((p, pi) => p.bold ? <strong key={pi} className="font-black">{p.text}</strong> : <span key={pi}>{p.text}</span>)}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 19. Compliance & Operational Impact */}
      <section className={`py-16 transition-colors ${isDark ? "bg-slate-950/40" : "bg-slate-50"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center md:text-left mb-10">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Compliance &amp; Operational Impact</h2>
              <div className="w-12 h-1 bg-cyan-500 rounded-full" />
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* 2×2 stat tiles — matches PDF */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { val: "100%", label: "ETHICAL & LEGAL" },
                { val: "0", label: "ZERO DELAYS" },
                { val: "20+", label: "SERVICES OFFERED" },
                { val: "24/7", label: "SUPPORT ACCESS" }
              ].map((tile, iIdx) => (
                <ScrollReveal key={iIdx} delay={iIdx * 60}>
                  <div className={`p-5 rounded-xl border text-center ${
                    isDark ? "bg-[#0b1329] border-slate-800" : "bg-white border-slate-200 shadow-sm"
                  }`}>
                    <div className={`text-2xl font-black mb-1 ${isDark ? "text-blue-400" : "text-blue-600"}`}>{tile.val}</div>
                    <div className={`text-[9px] font-black uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>{tile.label}</div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
            {/* Text block — matches PDF */}
            <ScrollReveal delay={200}>
              <div className="space-y-4 text-left">
                <h4 className={`text-lg font-black ${isDark ? "text-white" : "text-slate-800"}`}>Streamlined Corporate Support</h4>
                <p className={`text-sm leading-relaxed font-light ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  By partnering with Hari Om Thalassic, corporate crewing departments save hundreds of administrative hours in document tracking and verification.
                </p>
                <p className={`text-sm leading-relaxed font-light ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  We scrutinize candidate paperwork against all amended DG Shipping circulars and flag state mandates prior to submission, ensuring zero rejections and instant sign-on readiness.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 16. Strategic Corporate Tie-Up */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-left">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-6 space-y-6">
            <ScrollReveal>
              <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border inline-block ${
                isDark ? "bg-cyan-500/5 border-cyan-500/10 text-cyan-300" : "bg-cyan-50 border-cyan-200 text-cyan-655"
              }`}>
                // Fleet Partnerships
              </span>
              <h2 className="text-3xl font-black tracking-tight leading-tight">
                Empowering Top Maritime MNCs
              </h2>
              <p className={`text-sm font-light ${isDark ? "text-slate-450" : "text-slate-600"}`}>
                We partner with leading multinational ship management companies and manning agencies requiring dependable, ethical documentation support.
              </p>
              <div className="w-16 h-1 bg-cyan-500 rounded-full" />
            </ScrollReveal>

            <div className="space-y-4">
              {[
                { title: "Dedicated Account Executive", desc: "Direct point of contact for your fleet candidates." },
                { title: "Bulk Document & Profile Audits", desc: "Rapid verification of crew files and DG profile updates." },
                { title: "On-Demand Course Slots", desc: "Fast-tracked DG & Flag course enrollments aligned with vessel joining schedules." }
              ].map((item, idx) => (
                <ScrollReveal key={idx} delay={idx * 60}>
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className={`text-sm font-black ${isDark ? "text-white" : "text-slate-800"}`}>{item.title}</h4>
                      <p className={`text-[11px] leading-tight font-light ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          <div className="md:col-span-6">
            <ScrollReveal delay={250}>
              <div className="relative rounded-3xl overflow-hidden aspect-[16/10] border border-slate-200/10 shadow-xl group">
                <Image 
                  src="https://static.vecteezy.com/system/resources/previews/071/673/033/large_2x/international-business-partnership-handshake-at-a-shipping-port-photo.jpg"
                  alt="Business handshake at shipping port"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-[8px] text-white/80 px-2 py-0.5 rounded font-mono z-10">
                  Source: vecteezy.com
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 21. Corporate Engagement Workflow — PDF page 21 */}
      <section className={`py-20 transition-colors ${isDark ? "bg-slate-950/40" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center md:text-left mb-16">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Corporate Engagement Workflow</h2>
              <div className="w-12 h-1 bg-cyan-500 rounded-full" />
            </div>
          </ScrollReveal>

          {/* Desktop Timeline — blue bordered icon circles connected by gray line */}
          <div className="hidden md:flex justify-between items-start relative w-full max-w-4xl mx-auto">
            {/* connecting line */}
            <div className={`absolute top-[28px] left-12 right-12 h-px z-0 ${
              isDark ? "bg-slate-700" : "bg-slate-300"
            }`} />

            {[
              { step: 1, label: "Corporate Tie-Up",  icon: Briefcase,
                desc: "Establish corporate understanding and define documentation SLAs for your fleet candidates." },
              { step: 2, label: "Candidate Audit",    icon: Search,
                desc: "Receive crew profiles and conduct DG portal & document gap analysis." },
              { step: 3, label: "Action & Training",  icon: Activity,
                desc: "Execute TARBook issuance, DG/Flag courses, COPs, Profile update & C1/D US Visa." },
              { step: 4, label: "Sign-On Ready",      icon: Briefcase,
                desc: "Deliver 100% verified, legal, and upgraded candidate documents ready for immediate vessel joining." }
            ].map((s, idx) => (
              <ScrollReveal key={idx} delay={idx * 100}>
                <div className="relative z-10 flex flex-col items-center text-center w-44 gap-3">
                  {/* blue-bordered circle with icon */}
                  <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center ${
                    isDark
                      ? "bg-slate-900 border-blue-500 text-blue-400"
                      : "bg-white border-blue-500 text-blue-600"
                  }`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className={`text-xs font-black block leading-tight mb-1 ${
                      isDark ? "text-white" : "text-slate-800"
                    }`}>{s.step}. {s.label}</span>
                    <span className={`text-[11px] leading-normal block font-light ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}>{s.desc}</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Mobile Stepper */}
          <div className="md:hidden space-y-8 max-w-md mx-auto text-left">
            {[
              { step: 1, label: "Corporate Tie-Up",  icon: Briefcase,
                desc: "Establish corporate understanding and define documentation SLAs for your fleet candidates." },
              { step: 2, label: "Candidate Audit",    icon: Search,
                desc: "Receive crew profiles and conduct DG portal & document gap analysis." },
              { step: 3, label: "Action & Training",  icon: Activity,
                desc: "Execute TARBook issuance, DG/Flag courses, COPs, Profile update & C1/D US Visa." },
              { step: 4, label: "Sign-On Ready",      icon: Briefcase,
                desc: "Deliver 100% verified, legal, and upgraded candidate documents ready for immediate vessel joining." }
            ].map((s, idx) => (
              <ScrollReveal key={idx} delay={idx * 60}>
                <div className="flex gap-4 items-start">
                  <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    isDark ? "bg-slate-900 border-blue-500 text-blue-400" : "bg-white border-blue-500 text-blue-600"
                  }`}>
                    <s.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className={`text-sm font-black leading-tight mb-1 ${isDark ? "text-white" : "text-slate-800"}`}>
                      {s.step}. {s.label}
                    </h4>
                    <p className={`text-[11px] font-light leading-normal ${isDark ? "text-slate-400" : "text-slate-600"}`}>{s.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>



    </div>
  );
}
