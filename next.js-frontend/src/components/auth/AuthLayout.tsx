"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/providers/theme-provider";
import { 
  BookOpen, 
  Map, 
  MapPin, 
  Route, 
  Check, 
  Ship, 
  Award, 
  Clock, 
  ChevronRight, 
  CircleDot,
  Sun,
  Moon
} from "lucide-react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
}: AuthLayoutProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const [activeTab, setActiveTab] = useState<0 | 1 | 2 | 3>(0);
  const [activeStep, setActiveStep] = useState(0);

  // Dynamic CSS themes based on active dark/light mode
  const bgGradient = isDark 
    ? "from-[#02101d] via-[#051c2f] to-[#0A2540] text-white" 
    : "from-[#f1f5f9] via-[#e2e8f0] to-[#cbd5e1] text-slate-900";
  
  const cardStyles = isDark
    ? "bg-[#071f33]/60 border-gray-800/60 text-white backdrop-blur-xl shadow-2xl"
    : "bg-white border-slate-200/80 text-slate-900 shadow-xl";
    
  const cardTitleColor = isDark
    ? "text-transparent bg-gradient-to-r from-white to-gray-300 bg-clip-text"
    : "text-slate-800";
    
  const cardSubColor = isDark ? "text-gray-400" : "text-slate-500";
  
  const borderTheme = isDark ? "border-gray-800/40" : "border-slate-300/60";
  
  const footerLinkColor = isDark 
    ? "text-cyan-200/50 hover:text-white" 
    : "text-slate-500 hover:text-slate-800";

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ${
      isDark ? "bg-[#031525]" : "bg-white"
    }`}>
      
      {/* Top Header Navbar */}
      <header className="h-16 w-full bg-[#0A2540] px-6 md:px-12 flex items-center z-30 shadow-md">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20 group-hover:border-white/40 transition-all duration-300">
              <Image
                src="/logo.jpeg"
                alt="Hari Om Thalassic logo"
                fill
                sizes="44px"
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div>
              <h2 className="text-white font-extrabold text-sm tracking-wide leading-none group-hover:text-cyan-200 transition-colors">
                Hari Om Thalassic
              </h2>
            </div>
          </Link>

          <div className="flex items-center gap-3.5">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all cursor-pointer shadow-sm flex items-center justify-center"
              aria-label="Toggle theme mode"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-yellow-300 stroke-[2.5]" />
              ) : (
                <Moon className="w-4 h-4 text-slate-100 stroke-[2.5]" />
              )}
            </button>

            <div className="w-px h-5 bg-white/20" />

            <Link
              href="/"
              className="px-4 py-1.5 text-xs font-bold rounded-lg tracking-wider uppercase transition-all duration-300 border border-transparent text-white/80 hover:bg-white/5 hover:text-white"
            >
              Home
            </Link>

            <Link
              href="/login"
              className={`
                px-4 py-1.5 text-xs font-bold rounded-lg tracking-wider uppercase transition-all duration-300 border
                ${
                  pathname === "/login"
                    ? "bg-white/10 border-white/40 text-white"
                    : "border-white/20 text-white/80 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              Login
            </Link>
            <Link
              href="/register"
              className={`
                px-4 py-1.5 text-xs font-bold rounded-lg tracking-wider uppercase transition-all duration-300 border
                ${
                  pathname === "/register"
                    ? "bg-white/10 border-white/40 text-white"
                    : "border-white/20 text-white/80 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Main Split Layout */}
      <main className="flex-1 grid lg:grid-cols-2 relative w-full overflow-hidden">
        
        {/* Left Panel: Dynamic Concept Showroom (Hidden on Mobile) */}
        <div className={`hidden lg:flex flex-col justify-between relative bg-gradient-to-br ${bgGradient} px-12 py-10 overflow-hidden border-r ${borderTheme} transition-all duration-500`}>
          
          {/* Subtle Ambient Background Gradients */}
          {isDark && (
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
              <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-500 blur-[120px]" />
              <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-cyan-500 blur-[120px]" />
            </div>
          )}

          {/* Switcher Top Tab Bar */}
          <div className="relative z-10 w-full">
            <span className={`text-[10px] font-extrabold uppercase tracking-wider block mb-3.5 ${
              isDark ? "text-cyan-400" : "text-blue-600"
            }`}>
              Live Showroom Selector (Click tabs to preview)
            </span>
            <div className={`grid grid-cols-4 gap-1.5 border p-1 rounded-xl backdrop-blur-md transition-colors ${
              isDark ? "bg-black/35 border-white/5" : "bg-slate-200/50 border-slate-300/30"
            }`}>
              {[
                { id: 0, label: "Courses" },
                { id: 1, label: "Vessel Tracker" },
                { id: 2, label: "Roadmap" },
                { id: 3, label: "Partners" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    py-2 text-[10px] font-bold rounded-lg tracking-wider uppercase transition-all duration-300 cursor-pointer
                    ${activeTab === tab.id 
                      ? "bg-[#3b71cb] text-white shadow-md shadow-blue-900/10" 
                      : isDark 
                        ? "text-gray-400 hover:text-white hover:bg-white/5" 
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-300/30"
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Concept Showcase Render */}
          <div className="relative z-10 my-auto w-full max-w-lg mx-auto py-6">
            
            {/* CONCEPT 0: Course Discovery */}
            {activeTab === 0 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="space-y-1.5">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 border rounded-full text-[10px] font-bold uppercase tracking-wide ${
                    isDark ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" : "bg-blue-50 border-blue-200 text-[#3b71cb]"
                  }`}>
                    <BookOpen className="w-3.5 h-3.5" />
                    Interactive Previews
                  </div>
                  <h3 className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-800"}`}>Popular Maritime Training</h3>
                  <p className={`text-xs max-w-sm leading-relaxed ${isDark ? "text-gray-300" : "text-slate-500"}`}>
                    Explore and enroll in verified, DGS-compliant preparatory and safety courses.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    { title: "STCW Basic Safety Training (BST)", type: "Mandatory Safety", duration: "11 Days", price: "₹4,800", rating: "4.9" },
                    { title: "Advanced Fire Fighting (AFF)", type: "Advanced Training", duration: "5 Days", price: "₹5,200", rating: "4.8" },
                    { title: "GMDSS Preparation", type: "Radio Certifications", duration: "12 Days", price: "₹12,000", rating: "5.0" }
                  ].map((course, idx) => (
                    <div 
                      key={idx} 
                      className={`
                        group border p-4.5 rounded-2xl transition-all duration-300 flex justify-between items-center cursor-pointer
                        ${isDark 
                          ? "bg-white/5 border-white/10 hover:border-cyan-500/40 hover:shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
                          : "bg-white border-slate-200/80 hover:border-[#3b71cb]/40 hover:shadow-md"
                        }
                      `}
                    >
                      <div className="space-y-1.5">
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? "text-cyan-400" : "text-[#3b71cb]"}`}>{course.type}</span>
                        <h4 className={`font-bold text-sm transition-colors ${isDark ? "text-white group-hover:text-cyan-300" : "text-slate-800 group-hover:text-[#3b71cb]"}`}>{course.title}</h4>
                        <div className={`flex items-center gap-4 text-xs ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>
                          <span className={`font-semibold ${isDark ? "text-cyan-300" : "text-[#2e5fa7]"}`}>{course.price}</span>
                          <span className="text-yellow-500">★ {course.rating}</span>
                        </div>
                      </div>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        isDark ? "bg-white/5 group-hover:bg-cyan-500/20 text-gray-400 group-hover:text-cyan-300" : "bg-slate-100 group-hover:bg-blue-50 text-slate-400 group-hover:text-[#3b71cb]"
                      }`}>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CONCEPT 1: Vessel Tracker */}
            {activeTab === 1 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="space-y-1.5">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 border rounded-full text-[10px] font-bold uppercase tracking-wide ${
                    isDark ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" : "bg-blue-50 border-blue-200 text-[#3b71cb]"
                  }`}>
                    <Map className="w-3.5 h-3.5" />
                    Command Center Tracker
                  </div>
                  <h3 className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-800"}`}>Vessel & Crew Tracker</h3>
                  <p className={`text-xs max-w-sm leading-relaxed ${isDark ? "text-gray-300" : "text-slate-500"}`}>
                    Live operational telemetry representing global crew changes and vessel positions.
                  </p>
                </div>

                {/* Simulated Map Layout */}
                <div className={`border rounded-2xl p-5 relative overflow-hidden backdrop-blur-md ${
                  isDark ? "bg-[#051c2f]/80 border-gray-800" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className={`absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#000000_1px,transparent_1px)] ${
                    isDark ? "bg-[radial-gradient(#ffffff_1px,transparent_1px)]" : ""
                  } [background-size:16px_16px]`} />
                  
                  {/* Glowing Radar Rings */}
                  <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-cyan-500/10 rounded-full animate-ping pointer-events-none" />
                  
                  <div className="space-y-3.5 relative z-10">
                    <div className={`flex justify-between items-center text-xs border-b pb-2.5 ${isDark ? "border-gray-800" : "border-slate-100"}`}>
                      <span className={isDark ? "text-gray-400" : "text-slate-500"}>Vessels Tracked: <strong className={isDark ? "text-white" : "text-slate-800"}>45 Active</strong></span>
                      <span className="flex items-center gap-1 text-green-500 font-semibold"><CircleDot className="w-2.5 h-2.5 animate-pulse" /> Live Telemetry</span>
                    </div>

                    {[
                      { name: "MT Ocean Prince", voyage: "Suez Canal -> Hamburg", crew: "24 Seafarers", status: "Voyage Active" },
                      { name: "MV Thalassic Star", voyage: "Mumbai Port -> Singapore", crew: "18 Seafarers", status: "Crew Change Lock" }
                    ].map((vessel, idx) => (
                      <div key={idx} className={`border rounded-xl p-3.5 space-y-1.5 ${
                        isDark ? "bg-white/[0.03] border-white/5" : "bg-slate-50/70 border-slate-150"
                      }`}>
                        <div className="flex justify-between items-center">
                          <h4 className={`font-extrabold text-sm flex items-center gap-1.5 ${isDark ? "text-cyan-400" : "text-[#3b71cb]"}`}>
                            <Ship className="w-4 h-4" /> {vessel.name}
                          </h4>
                          <span className={`text-[9px] border px-2 py-0.5 rounded font-bold uppercase ${
                            isDark ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-300" : "bg-blue-50 border-blue-200 text-[#3b71cb]"
                          }`}>{vessel.status}</span>
                        </div>
                        <div className={`text-xs flex justify-between items-center ${isDark ? "text-gray-300" : "text-slate-600"}`}>
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {vessel.voyage}</span>
                          <span className={isDark ? "text-gray-400" : "text-slate-500"}>{vessel.crew}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CONCEPT 2: Roadmap Stepper */}
            {activeTab === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="space-y-1.5">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 border rounded-full text-[10px] font-bold uppercase tracking-wide ${
                    isDark ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" : "bg-blue-50 border-blue-200 text-[#3b71cb]"
                  }`}>
                    <Route className="w-3.5 h-3.5" />
                    Interactive Roadmap
                  </div>
                  <h3 className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-800"}`}>Your Seafarer Journey</h3>
                  <p className={`text-xs max-w-sm leading-relaxed ${isDark ? "text-gray-300" : "text-slate-500"}`}>
                    Click each milestone node to preview step requirements and objectives.
                  </p>
                </div>

                <div className={`relative pl-6 border-l space-y-5 ${isDark ? "border-gray-800" : "border-slate-200"}`}>
                  {[
                    { step: 0, title: "1. Join the Portal ⚓", desc: "Choose your professional track (Seafarer or Company Admin) and setup profile details." },
                    { step: 1, title: "2. Credentials Audit 📂", desc: "Upload your CDC, passport, and certificates. Our Master console validates credentials." },
                    { step: 2, title: "3. Book Courses 🎓", desc: "Discover DGS-approved simulator courses, safety trainings, and pay online securely." },
                    { step: 3, title: "4. Global Placements 🚢", desc: "Verify travel coordinates, view assignments, and download joining letters." }
                  ].map((item) => (
                    <div 
                      key={item.step} 
                      onClick={() => setActiveStep(item.step)}
                      className="relative cursor-pointer group"
                    >
                      {/* Node circle */}
                      <div className={`
                        absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300
                        ${activeStep === item.step 
                          ? isDark 
                            ? "bg-cyan-500 border-cyan-400 scale-120 shadow-[0_0_10px_rgba(6,182,212,0.6)]" 
                            : "bg-[#3b71cb] border-white scale-120 shadow-md"
                          : isDark 
                            ? "bg-[#02101d] border-gray-800 group-hover:border-gray-600" 
                            : "bg-slate-200 border-slate-300 group-hover:border-slate-400"
                        }
                      `}>
                        {activeStep > item.step && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>

                      <div className={`
                        p-3.5 rounded-xl border transition-all duration-300
                        ${activeStep === item.step
                          ? isDark 
                            ? "bg-white/5 border-cyan-500/30 text-white" 
                            : "bg-white border-[#3b71cb]/30 text-slate-800 shadow-sm"
                          : "border-transparent text-slate-400 group-hover:text-slate-600"
                        }
                      `}>
                        <h4 className={`font-extrabold text-sm ${
                          activeStep === item.step 
                            ? isDark ? "text-white" : "text-slate-800" 
                            : ""
                        }`}>{item.title}</h4>
                        {activeStep === item.step && (
                          <p className={`text-xs mt-2 leading-relaxed animate-fadeIn ${
                            isDark ? "text-gray-300" : "text-slate-500"
                          }`}>{item.desc}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CONCEPT 3: Trust Metrics */}
            {activeTab === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="space-y-1.5">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 border rounded-full text-[10px] font-bold uppercase tracking-wide ${
                    isDark ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" : "bg-blue-50 border-blue-200 text-[#3b71cb]"
                  }`}>
                    <Award className="w-3.5 h-3.5" />
                    Credentials & Trust
                  </div>
                  <h3 className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-800"}`}>Trust & Accreditation</h3>
                  <p className={`text-xs max-w-sm leading-relaxed ${isDark ? "text-gray-300" : "text-slate-500"}`}>
                    Connecting seafarers with audited institutions and partner crewing agencies.
                  </p>
                </div>

                {/* Big Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { val: "500+", lbl: "Seafarers Assisted", desc: "Successful crew bookings" },
                    { val: "50+", lbl: "Partner Institutes", desc: "DGS Accredited centers" },
                    { val: "99.8%", lbl: "Audit Compliance", desc: "CDC verification rate" },
                    { val: "24/7", lbl: "Operational Support", desc: "Vessel routing crew help" },
                  ].map((stat, idx) => (
                    <div 
                      key={idx} 
                      className={`border rounded-2xl p-4.5 text-center backdrop-blur-md transition-all ${
                        isDark 
                          ? "bg-white/5 border-white/10 hover:border-cyan-500/25" 
                          : "bg-white border-slate-200/80 hover:border-[#3b71cb]/30 shadow-sm"
                      }`}
                    >
                      <div className={`text-2xl font-black bg-gradient-to-r bg-clip-text text-transparent ${
                        isDark ? "from-cyan-400 to-blue-400" : "from-[#3b71cb] to-blue-600"
                      }`}>{stat.val}</div>
                      <div className={`text-xs font-bold mt-1 ${isDark ? "text-white" : "text-slate-800"}`}>{stat.lbl}</div>
                      <p className={`text-[10px] mt-1 leading-normal ${isDark ? "text-gray-400" : "text-slate-500"}`}>{stat.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Recruiters Banner */}
                <div className={`border rounded-2xl p-4 text-center backdrop-blur-md ${
                  isDark ? "bg-black/35 border-white/5" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider mb-2">Accredited Recruiters Network</div>
                  <div className={`flex justify-around items-center gap-4 text-xs font-black select-none ${
                    isDark ? "text-gray-500/60" : "text-slate-400"
                  }`}>
                    <span className="hover:text-blue-500 transition-colors">MAERSK</span>
                    <span className="hover:text-blue-500 transition-colors">MSC</span>
                    <span className="hover:text-blue-500 transition-colors">SYNERGY</span>
                    <span className="hover:text-blue-500 transition-colors">ANGLO</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer branding */}
          <div className={`relative z-10 flex items-center justify-between text-[11px] border-t pt-5 mt-4 transition-colors ${
            isDark ? "text-gray-500 border-gray-800/40" : "text-slate-500 border-slate-350"
          }`}>
            <span>© 2026 Hari Om Thalassic. All rights reserved.</span>
            <div className="flex gap-4 font-semibold">
              <Link href="/privacy" className={`${footerLinkColor} transition-colors`}>Privacy Policy</Link>
              <Link href="/terms" className={`${footerLinkColor} transition-colors`}>Terms of Service</Link>
            </div>
          </div>

        </div>

        {/* Right Panel: Form Chamber (Adaptable theme) */}
        <div className={`flex flex-col justify-center items-center px-6 md:px-16 py-12 relative overflow-y-auto transition-colors duration-500 ${
          isDark ? "bg-[#031525]" : "bg-white"
        }`}>
          
          {/* Subtle Ambient Glowing Orbs */}
          {isDark && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
              <div className="absolute top-[20%] right-[-20%] w-[400px] h-[400px] rounded-full bg-blue-600/5 blur-[100px]" />
              <div className="absolute bottom-[20%] left-[-20%] w-[400px] h-[400px] rounded-full bg-cyan-600/5 blur-[100px]" />
            </div>
          )}

          <div className={`w-full max-w-md border rounded-3xl p-6 md:p-7 transition-all duration-500 z-10 ${cardStyles}`}>
            
            {/* Logo and Subtitle */}
            <div className="text-center mb-5">
              <div className={`relative w-12 h-12 rounded-full overflow-hidden mx-auto border shadow-sm p-0.5 mb-3 ${
                isDark ? "border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]" : "border-slate-200"
              }`}>
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image
                    src="/logo.jpeg"
                    alt="Hari Om Thalassic logo"
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
              </div>
              
              <h3 className={`font-extrabold text-[10px] tracking-wide uppercase leading-none ${
                isDark ? "text-white" : "text-slate-500"
              }`}>
                A Complete Seafarer's Home
              </h3>
              
              <h2 className={`text-xl font-black mt-2.5 tracking-tight ${cardTitleColor}`}>
                {title}
              </h2>
              
              <p className={`text-xs mt-1.5 font-medium ${cardSubColor}`}>
                {subtitle}
              </p>
            </div>

            {/* Form Content */}
            {children}

          </div>

        </div>

      </main>

    </div>
  );
}