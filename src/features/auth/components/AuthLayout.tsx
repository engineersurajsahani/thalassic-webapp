"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "@/features/layout/components/Navbar";
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
      
      <Navbar />

      {/* Main Split Layout */}
      <main className="flex-1 grid lg:grid-cols-2 relative w-full overflow-hidden pt-[72px] lg:pt-[80px]">
        
        {/* Left Panel: Roadmap Stepper (Hidden on Mobile) */}
        <div className={`hidden lg:flex flex-col justify-between relative bg-gradient-to-br ${bgGradient} px-12 py-10 overflow-hidden border-r ${borderTheme} transition-all duration-500`}>
          
          {/* Subtle Ambient Background Gradients */}
          {isDark && (
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
              <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-500 blur-[120px]" />
              <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-cyan-500 blur-[120px]" />
            </div>
          )}

          {/* Stepper Content */}
          <div className="relative z-10 my-auto w-full max-w-lg mx-auto py-6">
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