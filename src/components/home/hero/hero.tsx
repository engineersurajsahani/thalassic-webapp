"use client";

import Link from "next/link";
import { useTheme } from "@/providers/theme-provider";

export default function Hero() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className={`min-h-screen flex items-center pt-24 transition-colors duration-500 relative overflow-hidden ${
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
            <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase ${
              isDark 
                ? "bg-blue-900/40 border border-blue-700/30 text-cyan-300" 
                : "bg-blue-50 border border-blue-200 text-blue-600"
            }`}>
              Trusted Maritime Career Partner
            </span>

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
                href="/about"
                className={`px-7 py-4 rounded-xl font-bold transition-all border ${
                  isDark 
                    ? "border-white/30 text-white hover:bg-white/5" 
                    : "border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                Learn More
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
                <div key={idx} className="space-y-1.5">
                  <h2 className={`text-4xl font-black tracking-tight ${
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