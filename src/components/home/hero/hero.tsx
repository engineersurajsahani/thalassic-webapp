"use client";

import Link from "next/link";
import { useTheme } from "@/providers/theme-provider";

// --- HERO COMPONENT (Your Original Code Unchanged) ---
function Hero() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
   <section
  className={`min-h-screen flex items-center transition-colors duration-500 relative overflow-hidden ${
      isDark ? "bg-[#0A2540] text-white" : "bg-slate-50 text-slate-900"
    }`}>
      
      {/* Decorative light elements in dark mode */}
      {isDark && (
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/30 blur-[130px]" />
          <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-600/30 blur-[130px]" />
        </div>
      )}

      <div className="max-w-7xl mx-auto w-full px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Block */}
          <div className="space-y-6">
            
            {/* Trust Badging Block */}
            <div className="flex flex-wrap items-center gap-4">
              <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase ${
                isDark 
                  ? "bg-blue-900/40 border border-blue-700/30 text-cyan-300" 
                  : "bg-blue-50 border border-blue-200 text-blue-600"
              }`}>
                Trusted Maritime Career Partner
              </span>
              
              {/* Dynamic Rating Accents */}
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className={`w-6 h-6 rounded-full border-2 ${isDark ? "border-[#0A2540] bg-cyan-500" : "border-slate-50 bg-blue-500"} flex items-center justify-center text-[8px] font-black text-white`}>M</div>
                  <div className={`w-6 h-6 rounded-full border-2 ${isDark ? "border-[#0A2540] bg-blue-600" : "border-slate-50 bg-slate-400"} flex items-center justify-center text-[8px] font-black text-white`}>O</div>
                  <div className={`w-6 h-6 rounded-full border-2 ${isDark ? "border-[#0A2540] bg-indigo-700" : "border-slate-50 bg-slate-600"} flex items-center justify-center text-[8px] font-black text-white`}>S</div>
                </div>
                <p className={`text-xs font-semibold ${isDark ? "text-cyan-400" : "text-[#3b71cb]"}`}>
                  ★ 4.9/5 Rating
                </p>
              </div>
            </div>

            <h1 className={`text-5xl lg:text-7xl font-black leading-tight tracking-tight ${
              isDark ? "text-white" : "text-slate-800"
            }`}>
              A Complete
              <br />
              <span className={isDark ? "text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text" : "text-[#3b71cb]"}>
                Seafarer's Home
              </span>
            </h1>

            <p className={`text-base lg:text-lg leading-relaxed max-w-xl ${
              isDark ? "text-gray-300" : "text-slate-600"
            }`}>
              From DGS preparatory training and documentation to global placements and travel assistance, we guide seafarers through every step of their professional journey.
            </p>

            {/* Quick Context Feature Badges */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 max-w-md pt-2">
              {[
                "DGS Approved Courses",
                "End-to-End Documentation",
                "Global Placement Network",
                "24/7 Crew Assistance"
              ].map((feature, fIdx) => (
                <div key={fIdx} className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isDark ? "bg-cyan-400" : "bg-[#3b71cb]"}`} />
                  <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-slate-700"}`}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/courses"
                className={`px-7 py-4 rounded-xl font-bold transition-all shadow-md transform hover:scale-[1.01] ${
                  isDark 
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white" 
                    : "bg-[#3b71cb] hover:bg-[#2c5fb3] text-white"
                }`}
              >
                Explore Courses
              </Link>

              <Link
                href="/contact"
                className={`px-7 py-4 rounded-xl font-bold transition-all border ${
                  isDark 
                    ? "border-white/30 text-white hover:bg-white/5" 
                    : "border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Right Block (Stats Grid Card) */}
          <div className={`rounded-3xl p-8 md:p-10 border transition-all duration-500 ${
            isDark 
              ? "bg-[#071f33]/60 border-gray-800/60 backdrop-blur-xl shadow-2xl" 
              : "bg-white border-slate-200 shadow-xl"
          }`}>
            <div className="grid grid-cols-2 gap-8 md:gap-10">
              {[
                { val: "500+", lbl: "Seafarers Assisted", desc: "Successful crew bookings" },
                { val: "50+", lbl: "Partner Institutes", desc: "DGS Accredited centers" },
                { val: "100%", lbl: "Verified Support", desc: "Audit compliance rate" },
                { val: "24/7", lbl: "Guidance Helpline", desc: "Global crew tracking support" },
              ].map((stat, idx) => (
                <div key={idx} className="space-y-1.5 group cursor-default">
                  <h2 className={`text-4xl font-black tracking-tight transition-transform duration-300 group-hover:translate-x-1 inline-block ${
                    isDark 
                      ? "text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text" 
                      : "text-[#3b71cb]"
                  }`}>
                    {stat.val}
                  </h2>
                  <div className={`font-bold text-sm ${isDark ? "text-white" : "text-slate-800"}`}>
                    {stat.lbl}
                  </div>
                  <p className={`text-xs ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                    {stat.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// --- MAIN WRAPPER PAGE ---
export default function HomePage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Why Choose Us Bullet Data
  const keyHighlights = [
    { title: "Experienced Trainers", text: "Instructional modules led exclusively by certified Master Mariners and Chief Engineers." },
    { title: "Industry-Relevant Courses", text: "Curriculum structurally kept up to date with updated global administrative criteria." },
    { title: "Trusted Maritime Training", text: "Strong alignment with verified partner institutions ensuring seamless course processing." },
    { title: "Professional Learning Experience", text: "Interactive testing systems designed to guarantee high examination success metrics." }
  ];

  return (
    <>
      {/* 1. Hero Banner Component */}
      <Hero />

      {/* 2. About Hari Om Thalassic Section */}
      <section className={`py-24 border-t transition-colors duration-500 ${
        isDark ? "bg-[#091F36] border-slate-800 text-white" : "bg-white border-slate-100 text-slate-900"
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-cyan-400" : "text-[#3b71cb]"}`}>
                Who We Are
              </span>
              <h2 className="text-3xl lg:text-4xl font-black tracking-tight">
                About Hari Om Thalassic
              </h2>
              <div className={`w-12 h-1 rounded ${isDark ? "bg-cyan-500" : "bg-[#3b71cb]"}`} />
            </div>

            <div className="lg:col-span-7 space-y-6">
              <p className={`text-base leading-relaxed ${isDark ? "text-gray-300" : "text-slate-600"}`}>
                Hari Om Thalassic serves as a premier ecosystem dedicated to refining maritime competencies. We act as a critical operational nexus, bridging foundational training platforms with elite career pathways for modern seafarers globally.
              </p>
              
              <div className={`p-6 rounded-2xl border ${isDark ? "bg-[#0B2540] border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                <h4 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-2">Our Core Mission</h4>
                <p className={`text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-slate-600"}`}>
                  To empower maritime professionals through robust processing assistance, top-tier instructional pipelines, and compliance verification models that secure stable, verified maritime placements.
                </p>
              </div>

              <div>
                <Link
                  href="/about"
                  className={`inline-flex items-center font-bold text-sm tracking-wide gap-2 group ${
                    isDark ? "text-cyan-400 hover:text-cyan-300" : "text-[#3b71cb] hover:text-[#2c5fb3]"
                  }`}
                >
                  Discover Full Journey
                  <span className="transform transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Why Choose Us Section */}
      <section className={`py-24 border-t transition-colors duration-500 ${
        isDark ? "bg-[#0A2540] border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-cyan-400" : "text-[#3b71cb]"}`}>
              Strategic Strengths
            </span>
            <h2 className="text-3xl lg:text-4xl font-black tracking-tight">
              Why Choose Our Platform
            </h2>
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-slate-500"}`}>
              We align our infrastructure with precise global administrative criteria to maximize compliance and training speed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {keyHighlights.map((item, index) => (
              <div 
                key={index} 
                className={`p-6 rounded-2xl border transition-all duration-300 ${
                  isDark ? "bg-[#0B2540] border-slate-800/80 hover:border-slate-700" : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <h3 className="font-bold text-base tracking-tight mb-2">{item.title}</h3>
                <p className={`text-xs leading-relaxed ${isDark ? "text-gray-400" : "text-slate-600"}`}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}