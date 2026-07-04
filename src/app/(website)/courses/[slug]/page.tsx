"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "@/providers/theme-provider";
import { courseData } from "@/constants/courseData";
import { 
  ArrowLeft, 
  Clock, 
  Award, 
  BookOpen, 
  ShieldCheck, 
  FileText, 
  Coins, 
  Users,
  CheckCircle2
} from "lucide-react";

export default function CourseDetailsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();
  const params = useParams();
  
  // Resolve course by id (slug)
  const courseId = params?.slug as string;
  const course = courseData.find((c) => c.id.toLowerCase() === courseId?.toLowerCase());

  // Tab State
  const [activeTab, setActiveTab] = useState<"overview" | "eligibility" | "documents">("overview");

  if (!course) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center font-sans ${
        isDark ? "bg-[#031525] text-white" : "bg-slate-50 text-slate-900"
      }`}>
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-black">Course Not Found</h2>
          <p className="text-slate-400">The course you are looking for does not exist or has been archived.</p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  // Handle enrollment checkout redirect
  const handleEnrollClick = () => {
    // Redirect to login/register if not authenticated, or directly to checkout
    // For demo purposes, we will redirect to checkout/payment
    router.push(`/login?redirect=/courses/${course.id}/enroll`);
  };

  return (
    <div className={`min-h-screen font-sans pb-20 transition-colors duration-500 ${
      isDark ? "bg-[#031525] text-white" : "bg-slate-50 text-slate-900"
    }`}>
      
      {/* Back navigation header */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <Link
          href="/courses"
          className={`inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider transition-colors ${
            isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <ArrowLeft className="w-4.5 h-4.5" /> Back to Catalog
        </Link>
      </div>

      {/* Main content grid */}
      <main className="max-w-7xl mx-auto px-6 pt-6 grid lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Image, Title, Description, and Switcher Tabs */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Header & Badges */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className={`px-2.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide shadow-sm ${
                course.category === "basic" ? "bg-cyan-500 text-white" :
                course.category === "advanced" ? "bg-blue-600 text-white" :
                course.category === "refresher" ? "bg-green-600 text-white" : "bg-amber-600 text-white"
              }`}>
                {course.category} Course
              </span>
              <span className={`text-[10px] px-2.5 py-0.5 border rounded-lg font-bold ${
                isDark ? "bg-white/5 border-gray-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-600"
              }`}>
                {course.level}
              </span>
              <span className="text-[10px] px-2.5 py-0.5 bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg font-bold">
                DGS Approved
              </span>
            </div>
            
            <h1 className={`text-3xl md:text-4xl font-black tracking-tight leading-tight ${
              isDark ? "text-white" : "text-slate-800"
            }`}>
              {course.name}
            </h1>
            
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="text-blue-500 font-extrabold uppercase tracking-wider">{course.code}</span>
              <span className="text-slate-400">•</span>
              <div className="flex items-center gap-1">
                <span className="text-yellow-500 font-bold">★ {course.rating?.toFixed(1) || "4.8"}</span>
                <span className="text-slate-400">({course.ratingCount || "150"}+ active students)</span>
              </div>
            </div>
          </div>

          {/* Large image banner */}
          <div className={`relative w-full h-80 rounded-3xl overflow-hidden border ${
            isDark ? "border-gray-800" : "border-slate-250 shadow-sm"
          }`}>
            <Image
              src={course.image}
              alt={course.name}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          </div>

          {/* Tab Switcher Headers */}
          <div className="space-y-6">
            <div className={`flex border-b ${isDark ? "border-gray-800" : "border-slate-200"}`}>
              {[
                { id: "overview", label: "Overview", icon: BookOpen },
                { id: "eligibility", label: "Eligibility & Requirements", icon: Award },
                { id: "documents", label: "Required Documents", icon: FileText },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 -mb-[2px] cursor-pointer ${
                      active
                        ? "border-blue-500 text-blue-500 font-black"
                        : isDark
                          ? "border-transparent text-slate-400 hover:text-white"
                          : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            <div className={`p-6 border rounded-2xl ${
              isDark ? "bg-[#071f33] border-gray-800" : "bg-white border-slate-200 shadow-sm"
            }`}>
              
              {activeTab === "overview" && (
                <div className="space-y-5 animate-fadeIn">
                  <h3 className="text-lg font-black flex items-center gap-2">
                    Course Description
                  </h3>
                  <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                    {course.description}
                  </p>
                  
                  <div className="space-y-3 pt-3">
                    <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">What you will learn:</h4>
                    <ul className="grid sm:grid-cols-2 gap-3">
                      {[
                        "IMO Model regulations & framework compliance",
                        "Emergency drill coordination onboard vessels",
                        "Practical safety equipment utilization operations",
                        "Mock simulation scenario management and assessment"
                      ].map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-xs font-semibold">
                          <CheckCircle2 className="w-4.5 h-4.5 text-green-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === "eligibility" && (
                <div className="space-y-5 animate-fadeIn">
                  <h3 className="text-lg font-black">Eligibility Requirements</h3>
                  <div className="space-y-3">
                    <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                      All trainees must meet the eligibility criteria guidelines defined by the Directorate General of Shipping (DGS), India:
                    </p>
                    <ul className="space-y-2.5">
                      <li className="flex items-start gap-2.5 text-xs font-semibold">
                        <CheckCircle2 className="w-4.5 h-4.5 text-blue-500 shrink-0 mt-0.5" />
                        <span>Must possess a valid Indian INDOS number prior to booking.</span>
                      </li>
                      <li className="flex items-start gap-2.5 text-xs font-semibold">
                        <CheckCircle2 className="w-4.5 h-4.5 text-blue-500 shrink-0 mt-0.5" />
                        <span>Medical fitness standards certificate declared by a DGS-approved medical practitioner.</span>
                      </li>
                      {course.level !== "Entry Level" && (
                        <li className="flex items-start gap-2.5 text-xs font-semibold">
                          <CheckCircle2 className="w-4.5 h-4.5 text-blue-500 shrink-0 mt-0.5" />
                          <span>Must submit verification of required sea service hours if applicable (e.g. CDC stamp entries).</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === "documents" && (
                <div className="space-y-5 animate-fadeIn">
                  <h3 className="text-lg font-black">Documents Required for Verification</h3>
                  <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                    Please upload high-quality PDF/JPG scans of these documents inside your seafarer portal dashboard after completing payment:
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3.5">
                    {course.documentsRequired.map((doc, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-3 p-3.5 border rounded-xl ${
                          isDark ? "bg-white/5 border-gray-800" : "bg-slate-50 border-slate-150"
                        }`}
                      >
                        <FileText className="w-5 h-5 text-blue-500 shrink-0" />
                        <span className="text-xs font-bold">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* Right 1 Column: Sticky Details Card & Purchase Panel */}
        <div className="space-y-6">
          
          {/* Purchase Details Panel */}
          <div className={`p-6 border rounded-3xl space-y-6 shadow-xl ${
            isDark ? "bg-[#071f33] border-gray-800" : "bg-white border-slate-200"
          }`}>
            
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Total Enrollment Fee</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-blue-500 dark:text-blue-400">{course.fees}</span>
                <span className="text-xs font-bold text-slate-400">All inclusive</span>
              </div>
            </div>

            {/* Quick stats details list */}
            <div className={`border-y py-4.5 space-y-3.5 ${
              isDark ? "border-gray-800" : "border-slate-100"
            }`}>
              
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wide">Duration</span>
                <span className="font-extrabold flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" /> {course.duration}</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wide">Level</span>
                <span className="font-extrabold flex items-center gap-1.5"><Award className="w-4 h-4 text-slate-400" /> {course.level}</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wide">Accreditation</span>
                <span className="font-extrabold flex items-center gap-1.5 text-green-500"><ShieldCheck className="w-4 h-4" /> DGS Approved</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wide">Refund Policy</span>
                <span className="font-extrabold flex items-center gap-1.5 text-slate-400">DGS Standard</span>
              </div>

            </div>

            {/* Buy / Enroll CTA Button */}
            <button
              onClick={handleEnrollClick}
              className="w-full py-4.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm uppercase tracking-wider rounded-2xl transition-all shadow-md shadow-blue-500/20 cursor-pointer text-center"
            >
              Enroll and Book Slot
            </button>

            {/* Trainee reviews summary banner */}
            <div className="flex items-center gap-3 justify-center text-xs text-slate-400">
              <Users className="w-4 h-4" />
              <span>DGS Compliance Verification Guaranteed</span>
            </div>

          </div>

          {/* Quick Support Card */}
          <div className={`p-6 border rounded-3xl space-y-4 ${
            isDark ? "bg-white/5 border-gray-800" : "bg-slate-50 border-slate-200"
          }`}>
            <h4 className="font-extrabold text-sm">Need Help Booking?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              If you have issues with your INDOS number, booking dates, or need group training packages, contact our helpdesk.
            </p>
            <Link
              href="/contact"
              className="inline-block text-xs font-bold text-blue-500 hover:text-blue-400 tracking-wide transition-colors"
            >
              Contact Support Support →
            </Link>
          </div>

        </div>

      </main>

    </div>
  );
}
