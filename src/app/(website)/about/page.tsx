"use client";

import React from 'react';
import Link from 'next/link';
import { useTheme } from "@/providers/theme-provider";

export default function AboutUsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`${isDark ? "bg-[#031525] text-white" : "bg-slate-50 text-slate-900"} min-h-screen font-sans`}>
      
      {/* Hero Header Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-[100px] pb-16 text-center md:text-left">
        <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-4 border ${
          isDark 
            ? "bg-blue-600/20 text-cyan-300 border-blue-500/30" 
            : "bg-blue-50 text-blue-600 border-blue-200"
        }`}>
          About Our Platform
        </span>
        <h1 className={`text-4xl md:text-6xl font-extrabold tracking-tight mb-6 ${
          isDark
            ? "bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
            : "text-slate-900"
        }`}>
          Hari Om Thalassic
        </h1>
        <p className={`text-lg md:text-xl max-w-3xl leading-relaxed ${
          isDark ? "text-gray-300" : "text-slate-600"
        }`}>
          We believe booking maritime courses and updating credentials shouldn't be a headache. Hari Om Thalassic was created to make seafarer training, CDC documentation, and placement assistance smooth and simple. We provide a single digital home where seafarers can find courses, track their certificates, and get certified guidance from experienced captains.
        </p>
      </section>

      <hr className={`max-w-7xl mx-auto px-6 ${isDark ? "border-gray-800" : "border-slate-200"}`} />

      {/* Vision & Mission Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-8">
        {/* Vision Card */}
        <div className={`border rounded-2xl p-8 shadow-xl hover:border-blue-500/40 transition-all duration-300 ${
          isDark 
            ? "bg-[#071f33] border-gray-800" 
            : "bg-white border-slate-200"
        }`}>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border ${
            isDark
              ? "bg-blue-600/10 border-blue-500/20"
              : "bg-blue-50 border-blue-200"
          }`}>
            {/* Eye Icon SVG */}
            <svg className="w-6 h-6 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className={`text-2xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>Our Vision</h2>
          <p className={`leading-relaxed ${isDark ? "text-gray-300" : "text-slate-600"}`}>
            To build the most reliable and easy-to-use digital home for seafarers. We want to save your time spent on paperwork and registration queues, so you can focus on your training and career at sea.
          </p>
        </div>

        {/* Mission Card */}
        <div className={`border rounded-2xl p-8 shadow-xl hover:border-blue-500/40 transition-all duration-300 ${
          isDark 
            ? "bg-[#071f33] border-gray-800" 
            : "bg-white border-slate-200"
        }`}>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border ${
            isDark
              ? "bg-blue-600/10 border-blue-500/20"
              : "bg-blue-50 border-blue-200"
          }`}>
            {/* Target Icon SVG */}
            <svg className="w-6 h-6 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </div>
          <h2 className={`text-2xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>Our Mission</h2>
          <p className={`leading-relaxed ${isDark ? "text-gray-300" : "text-slate-600"}`}>
            Legacy maritime processes rely heavily on running from one office to another for CDC stamps, visa approvals, and course certificates. Our mission is to digitize these manual hurdles. We guide seafarers through the entire lifecycle—from preparatory training and document validation to global placements.
          </p>
        </div>
      </section>

      {/* Maritime Training Experience Highlight */}
      <section className={`py-16 border-y ${
        isDark 
          ? "bg-[#051a2c] border-gray-800/60" 
          : "bg-slate-100 border-slate-200"
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <h2 className={`text-3xl font-bold mb-4 flex items-center gap-3 ${isDark ? "text-white" : "text-slate-900"}`}>
                {/* Anchor Icon SVG */}
                <svg className="w-7 h-7 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 5V19M5 12H19M12 5a3 3 0 110-6 3 3 0 010 6Z" />
                </svg> 
                Built by Mariners, for Mariners
              </h2>
              <p className={`leading-relaxed mb-4 ${isDark ? "text-gray-300" : "text-slate-600"}`}>
                Our platform is built in alignment with international Directorate General of Shipping (DGS) guidelines. We bridge the gap between merchant navy requirements and user-friendly digital tools, helping deck officers, cadets, and engine crew prepare for competency exams and safety standards with absolute confidence.
              </p>
            </div>
            <div className={`p-6 rounded-xl border text-center ${
              isDark
                ? "bg-[#0a263f] border-gray-800"
                : "bg-white border-slate-200"
            }`}>
              {/* Award Icon SVG */}
              <svg className="w-10 h-10 text-yellow-500 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0Z" />
              </svg>
              <div className={`text-3xl font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>100% Digital</div>
              <p className={`text-xs uppercase tracking-wider ${isDark ? "text-gray-400" : "text-slate-500"}`}>No More Manual Enrollment Hurdles</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info & Responsive Contacts */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className={`rounded-2xl p-8 border flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${
          isDark
            ? "bg-gradient-to-br from-[#071f33] to-[#041727] border-gray-800"
            : "bg-gradient-to-br from-blue-600 to-indigo-600 border-blue-500 text-white shadow-lg"
        }`}>
          <div>
            <h3 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>Ready to advance your maritime career?</h3>
            <p className={`text-sm ${isDark ? "text-cyan-100" : "text-blue-100"}`}>Explore DGS-approved courses and get professional guidance to advance your career at sea.</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Link href="/courses" className={`w-full md:w-auto px-6 py-3 text-center text-sm font-semibold rounded-lg transition-all shadow-md ${
              isDark ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-white hover:bg-slate-50 text-blue-600"
            }`}>
              Browse Courses
            </Link>
            <Link href="/contact" className={`w-full md:w-auto px-6 py-3 text-center text-sm font-semibold rounded-lg transition-all border ${
              isDark
                ? "bg-gray-800 hover:bg-gray-700 border-gray-700 text-white"
                : "bg-transparent hover:bg-white/10 text-white border-white/40"
            }`}>
              Contact Support
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}