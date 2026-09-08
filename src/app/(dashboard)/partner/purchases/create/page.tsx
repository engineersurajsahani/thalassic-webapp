"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { partnerService } from "@/services/partner.service";
import { useTheme } from "@/providers/theme-provider";
import {
  ShoppingCart,
  Search,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Building,
  GraduationCap,
  Sparkles,
  Lock,
} from "lucide-react";

export default function CreatePurchasePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedSeafarerId = searchParams.get("seafarerId");

  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted ? theme === "dark" : true;

  // Flow steps: 1: Seafarer Selection, 2: Course Selection, 3: Pricing & Confirmation
  const [currentStep, setCurrentStep] = useState(1);

  // Seafarer Search & Selection
  const [seafarerQuery, setSeafarerQuery] = useState("");
  const [seafarerResults, setSeafarerResults] = useState<any[]>([]);
  const [selectedSeafarer, setSelectedSeafarer] = useState<any>(null);
  const [seafarerLoading, setSeafarerLoading] = useState(false);

  // Course Selection
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [coursesLoading, setCoursesLoading] = useState(true);

  // Pricing
  const [pricing, setPricing] = useState<any>(null);
  const [pricingLoading, setPricingLoading] = useState(false);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [completedPurchase, setCompletedPurchase] = useState<any>(null);

  // Initial loads
  useEffect(() => {
    async function init() {
      try {
        const [courseList, seafarerList] = await Promise.all([
          partnerService.getCourses(),
          partnerService.searchSeafarers(),
        ]);
        setCourses(courseList || []);
        setSeafarerResults(seafarerList || []);

        if (preselectedSeafarerId) {
          const matched = (seafarerList || []).find((s: any) => s.id === preselectedSeafarerId);
          if (matched) {
            setSelectedSeafarer(matched);
            setCurrentStep(2);
          }
        }
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setCoursesLoading(false);
      }
    }
    init();
  }, [preselectedSeafarerId]);

  // Handle Seafarer Search
  const handleSearchSeafarer = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSeafarerLoading(true);
    try {
      const data = await partnerService.searchSeafarers(seafarerQuery);
      setSeafarerResults(data || []);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setSeafarerLoading(false);
    }
  };

  // Handle Course Selection & fetch read-only pricing
  const handleSelectCourse = async (course: any) => {
    setSelectedCourse(course);
    setPricingLoading(true);
    try {
      const priceData = await partnerService.getCoursePricing(course.id);
      setPricing(priceData);
      setCurrentStep(3);
    } catch (err) {
      console.error("Failed to fetch partner pricing:", err);
      setPricing({
        courseId: course.id,
        courseName: course.name,
        courseCode: course.code,
        payableAmount: course.payableAmount || course.standardFee,
        duration: course.duration,
      });
      setCurrentStep(3);
    } finally {
      setPricingLoading(false);
    }
  };

  // Submit Purchase
  const handleConfirmPurchase = async () => {
    if (!selectedSeafarer || !selectedCourse) {
      setError("Please select both a Seafarer Master and a Course.");
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      const purchase = await partnerService.createPurchase({
        seafarerId: selectedSeafarer.id,
        courseId: selectedCourse.id,
      });
      setCompletedPurchase(purchase);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to process course purchase.");
    } finally {
      setSubmitting(false);
    }
  };

  const cardBg = isDark
    ? "bg-[#09162c]/90 border-white/10 shadow-xl"
    : "bg-white border-slate-200 shadow-md";

  const headingText = isDark ? "text-white font-extrabold" : "text-slate-900 font-extrabold";
  const subText = isDark ? "text-slate-300 font-medium" : "text-slate-600 font-medium";
  const accentText = isDark ? "text-cyan-300 font-extrabold" : "text-blue-700 font-extrabold";

  if (completedPurchase) {
    return (
      <div className="max-w-2xl mx-auto py-10 animate-fadeIn">
        <div className={`p-8 rounded-3xl border text-center ${cardBg}`}>
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className={`text-2xl font-extrabold ${headingText}`}>Purchase Completed</h2>
          <p className={`text-xs mt-1.5 ${subText}`}>
            Physical course purchase confirmed and physical training enrollment automatically created.
          </p>

          <div className={`my-6 p-5 rounded-2xl border text-left space-y-2.5 text-xs ${isDark ? "bg-white/[0.02] border-white/5" : "bg-slate-50 border-slate-200"}`}>
            <div className="flex justify-between">
              <span className={subText}>Purchase ID:</span>
              <span className={`font-mono font-bold ${accentText}`}>{completedPurchase.id}</span>
            </div>
            <div className="flex justify-between">
              <span className={subText}>Seafarer Master:</span>
              <span className={`font-bold ${headingText}`}>{completedPurchase.seafarerName}</span>
            </div>
            <div className="flex justify-between">
              <span className={subText}>Physical Course:</span>
              <span className={`font-semibold ${isDark ? "text-slate-200" : "text-slate-800"}`}>{completedPurchase.courseName}</span>
            </div>
            <div className={`flex justify-between items-center pt-2 border-t ${isDark ? "border-white/5" : "border-slate-200"}`}>
              <span className={`font-semibold ${subText}`}>Hari Om Payable Amount:</span>
              <span className={`font-extrabold text-base ${accentText}`}>
                ₹{Number(completedPurchase.payableAmount).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={subText}>Settlement Status:</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                Pending Settlement
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={subText}>Enrollment Status:</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                Physical Training Enrolled
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`/partner/purchases/${completedPurchase.id}`}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-lg shadow-cyan-500/20"
            >
              View Purchase Details
            </Link>
            <Link
              href="/partner/settlements/create"
              className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5" />
              Submit Settlement Now
            </Link>
            <Link
              href="/partner/purchases"
              className={`w-full sm:w-auto px-4 py-3 rounded-xl text-xs font-semibold border transition-all ${
                isDark ? "bg-white/5 hover:bg-white/10 border-white/10 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300"
              }`}
            >
              Purchase Ledger
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <Link
          href="/partner/purchases"
          className={`inline-flex items-center gap-1.5 text-xs font-bold transition-colors mb-2 ${
            isDark ? "text-cyan-400 hover:text-cyan-300" : "text-blue-600 hover:text-blue-700"
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Purchases
        </Link>
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
              isDark ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30" : "bg-blue-100 text-blue-900 border border-blue-300"
            }`}
          >
            Physical Course Purchase Wizard
          </span>
        </div>
        <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight mt-1.5 ${headingText}`}>
          New Course Purchase
        </h1>
        <p className={`text-xs md:text-sm mt-1 ${subText}`}>
          Purchase a physical training course for a seafarer. The Hari Om payable amount is automatically calculated and non-editable.
        </p>
      </div>

      {/* 3-Step Wizard Navigation Indicator */}
      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            currentStep === 1
              ? isDark
                ? "bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-lg"
                : "bg-blue-50 border-blue-600 text-blue-950 shadow-md font-bold"
              : selectedSeafarer
              ? isDark
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold"
              : isDark
              ? "bg-white/[0.03] border-white/10 text-slate-400"
              : "bg-slate-100 border-slate-300 text-slate-600"
          }`}
        >
          <p className="text-[10px] font-black uppercase tracking-wider">Step 1</p>
          <p className="text-xs font-extrabold mt-0.5 truncate">
            {selectedSeafarer ? `✓ ${selectedSeafarer.name}` : "Select Seafarer"}
          </p>
        </button>

        <button
          type="button"
          disabled={!selectedSeafarer}
          onClick={() => selectedSeafarer && setCurrentStep(2)}
          className={`p-3.5 rounded-2xl border text-left transition-all disabled:opacity-40 ${
            currentStep === 2
              ? isDark
                ? "bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-lg"
                : "bg-blue-50 border-blue-600 text-blue-950 shadow-md font-bold"
              : selectedCourse
              ? isDark
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold"
              : isDark
              ? "bg-white/[0.03] border-white/10 text-slate-400"
              : "bg-slate-100 border-slate-300 text-slate-600"
          }`}
        >
          <p className="text-[10px] font-black uppercase tracking-wider">Step 2</p>
          <p className="text-xs font-extrabold mt-0.5 truncate">
            {selectedCourse ? `✓ ${selectedCourse.code}` : "Select Course"}
          </p>
        </button>

        <button
          type="button"
          disabled={!selectedSeafarer || !selectedCourse}
          onClick={() => selectedSeafarer && selectedCourse && setCurrentStep(3)}
          className={`p-3.5 rounded-2xl border text-left transition-all disabled:opacity-40 ${
            currentStep === 3
              ? isDark
                ? "bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-lg"
                : "bg-blue-50 border-blue-600 text-blue-950 shadow-md font-bold"
              : isDark
              ? "bg-white/[0.03] border-white/10 text-slate-400"
              : "bg-slate-100 border-slate-300 text-slate-600"
          }`}
        >
          <p className="text-[10px] font-black uppercase tracking-wider">Step 3</p>
          <p className="text-xs font-extrabold mt-0.5 truncate">Pricing & Confirmation</p>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-500 flex items-center gap-3 text-xs font-bold">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: Select or Search Seafarer */}
      {currentStep === 1 && (
        <div className={`p-6 md:p-8 rounded-3xl border space-y-6 ${cardBg}`}>
          <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b ${
            isDark ? "border-white/10" : "border-slate-200"
          }`}>
            <div>
              <h2 className={`text-base font-extrabold ${headingText}`}>Step 1: Identify Seafarer Master</h2>
              <p className={`text-xs mt-0.5 ${subText}`}>
                Search candidate identity or select from the directory
              </p>
            </div>
            <Link
              href="/partner/seafarers/create"
              className={`text-xs font-extrabold flex items-center gap-1 ${
                isDark ? "text-cyan-300 hover:text-cyan-200" : "text-blue-700 hover:text-blue-800"
              }`}
            >
              + Create New Seafarer Master
            </Link>
          </div>

          {/* Search box */}
          <form onSubmit={handleSearchSeafarer} className="flex gap-2">
            <div className="relative flex-1">
              <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
              <input
                type="text"
                value={seafarerQuery}
                onChange={(e) => setQueryAndSearch(e.target.value)}
                placeholder="Search by INDoS, Passport, CDC, Email, or Name..."
                className={`w-full pl-10 pr-4 py-3 rounded-xl text-xs font-semibold outline-none transition-all ${
                  isDark ? "bg-[#080F1E] border border-white/15 text-white focus:border-cyan-400" : "bg-slate-50 border border-slate-300 text-slate-900 focus:border-blue-600"
                }`}
              />
            </div>
            <button
              type="submit"
              disabled={seafarerLoading}
              className={`px-5 py-3 rounded-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
                isDark ? "bg-cyan-500 hover:bg-cyan-400 text-slate-950" : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {seafarerLoading ? "Searching..." : "Search"}
            </button>
          </form>

          {/* List of matching Seafarers */}
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
            {seafarerResults.length === 0 ? (
              <div className={`p-8 text-center border border-dashed rounded-2xl text-xs ${
                isDark ? "border-white/15 text-slate-400" : "border-slate-300 text-slate-600"
              }`}>
                No matching Seafarer Master records. Try another query or{" "}
                <Link href="/partner/seafarers/create" className={`font-bold hover:underline ${isDark ? "text-cyan-300" : "text-blue-700"}`}>
                  create a new Seafarer Master
                </Link>
                .
              </div>
            ) : (
              seafarerResults.map((s) => {
                const isSelected = selectedSeafarer?.id === s.id;
                return (
                  <div
                    key={s.id}
                    onClick={() => {
                      setSelectedSeafarer(s);
                      setCurrentStep(2);
                    }}
                    className={`p-4.5 rounded-2xl border cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected
                        ? isDark
                          ? "bg-cyan-500/15 border-cyan-500/40 shadow-md shadow-cyan-500/10"
                          : "bg-blue-50 border-blue-500 shadow-sm"
                        : isDark
                        ? "bg-white/[0.02] border-white/10 hover:bg-white/5"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center font-black text-xs uppercase shrink-0 shadow-sm">
                        {s.name ? s.name[0] : "S"}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className={`font-extrabold text-sm ${headingText}`}>{s.name}</p>
                          <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded border ${
                            isDark ? "bg-cyan-500/15 text-cyan-300 border-cyan-500/30" : "bg-blue-100 text-blue-900 border-blue-300"
                          }`}>
                            INDoS: {s.indosNum || "N/A"}
                          </span>
                        </div>
                        <p className={`text-xs mt-1 ${subText}`}>
                          {s.email} • {s.phone} • Passport: {s.passportNum || "N/A"}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
                        isSelected
                          ? "bg-cyan-500 text-slate-950"
                          : isDark
                          ? "bg-white/10 hover:bg-white/20 text-white"
                          : "bg-slate-200 hover:bg-slate-300 text-slate-900"
                      }`}
                    >
                      {isSelected ? "Selected ✓" : "Select Candidate"}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* STEP 2: Select Physical Course */}
      {currentStep === 2 && (
        <div className={`p-6 md:p-8 rounded-3xl border space-y-6 ${cardBg}`}>
          <div className={`flex justify-between items-center pb-4 border-b ${isDark ? "border-white/10" : "border-slate-200"}`}>
            <div>
              <h2 className={`text-base font-extrabold ${headingText}`}>Step 2: Select Physical Course</h2>
              <p className={`text-xs mt-0.5 ${subText}`}>
                Enrolling candidate: <span className={`font-black ${accentText}`}>{selectedSeafarer?.name}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`text-xs font-bold hover:underline ${isDark ? "text-cyan-400" : "text-blue-600"}`}
            >
              Change Candidate
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => {
              const isSelected = selectedCourse?.id === course.id;
              return (
                <div
                  key={course.id}
                  onClick={() => handleSelectCourse(course)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? isDark
                        ? "bg-cyan-500/15 border-cyan-500/40 shadow-lg shadow-cyan-500/15"
                        : "bg-blue-50 border-blue-500 shadow-md"
                      : isDark
                      ? "bg-white/[0.02] border-white/10 hover:bg-white/5 hover:border-white/20"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded border ${
                        isDark ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/20" : "bg-blue-100 text-blue-900 border-blue-300"
                      }`}>
                        {course.code}
                      </span>
                      <span className={`text-[10px] font-bold ${subText}`}>
                        ⏱ {course.duration}
                      </span>
                    </div>
                    <h3 className={`font-extrabold text-sm mt-2 ${headingText}`}>{course.name}</h3>
                    <p className={`text-xs mt-1 line-clamp-2 ${subText}`}>
                      {course.description}
                    </p>
                  </div>

                  <div className={`mt-4 pt-3 border-t flex items-center justify-between ${isDark ? "border-white/10" : "border-slate-200"}`}>
                    <div>
                      <p className={`text-[10px] uppercase font-bold ${subText}`}>Configured Hari Om Payable</p>
                      <p className={`text-sm font-black ${accentText}`}>
                        ₹{Number(course.payableAmount).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <span className={`text-xs font-black flex items-center gap-1 ${accentText}`}>
                      Select <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 3: Pricing Verification & Confirmation */}
      {currentStep === 3 && pricing && (
        <div className={`p-6 md:p-8 rounded-3xl border space-y-6 ${cardBg}`}>
          <div className={`flex justify-between items-center pb-4 border-b ${isDark ? "border-white/10" : "border-slate-200"}`}>
            <div>
              <h2 className={`text-base font-extrabold ${headingText}`}>Step 3: Review & Confirm Purchase</h2>
              <p className={`text-xs mt-0.5 ${subText}`}>
                Verify Seafarer details, course selection, and configured Hari Om payable amount.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className={`text-xs font-bold hover:underline ${isDark ? "text-cyan-400" : "text-blue-600"}`}
            >
              Change Course
            </button>
          </div>

          {/* Candidate Card */}
          <div className={`p-4.5 rounded-2xl border ${isDark ? "bg-white/[0.02] border-white/10" : "bg-slate-50 border-slate-200"}`}>
            <p className={`text-[10px] font-black uppercase tracking-wider mb-2 ${accentText}`}>
              👤 Selected Seafarer Master
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <p className={`font-extrabold text-sm ${headingText}`}>{selectedSeafarer?.name}</p>
                <p className={`text-xs mt-0.5 ${subText}`}>
                  {selectedSeafarer?.email} • {selectedSeafarer?.phone}
                </p>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className={`font-bold ${accentText}`}>INDoS: {selectedSeafarer?.indosNum || "N/A"}</span>
                <span className={`font-semibold ${isDark ? "text-slate-300" : "text-slate-800"}`}>Passport: {selectedSeafarer?.passportNum || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Course Card */}
          <div className={`p-4.5 rounded-2xl border ${isDark ? "bg-white/[0.02] border-white/10" : "bg-slate-50 border-slate-200"}`}>
            <p className={`text-[10px] font-black uppercase tracking-wider mb-2 ${accentText}`}>
              ⚓ Selected Physical Training Course
            </p>
            <div className="flex justify-between items-center text-xs">
              <div>
                <p className={`font-extrabold text-sm ${headingText}`}>{selectedCourse?.name}</p>
                <p className={`text-xs mt-0.5 ${subText}`}>
                  Duration: {selectedCourse?.duration} • Training Type: Physical / In-Person
                </p>
              </div>
              <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded border ${
                isDark ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20" : "bg-emerald-100 text-emerald-900 border-emerald-300"
              }`}>
                In-Person Class
              </span>
            </div>
          </div>

          {/* READ-ONLY Hari Om Payable Amount Display (PRD Section 4.11 Compliance) */}
          <div className={`p-5 rounded-2xl border space-y-3 ${
            isDark
              ? "bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-transparent border-cyan-500/30"
              : "bg-blue-50/70 border-blue-200"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className={`w-4 h-4 ${isDark ? "text-cyan-400" : "text-blue-700"}`} />
                <span className={`text-xs font-black uppercase tracking-wider ${accentText}`}>
                  Applicable Hari Om Payable Amount
                </span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                isDark ? "bg-cyan-500/20 text-cyan-300" : "bg-blue-100 text-blue-900 border border-blue-300"
              }`}>
                Fixed Hari Om Rate
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2">
              <div>
                <p className={`text-2xl sm:text-3xl font-black tracking-tight ${headingText}`}>
                  ₹{Number(pricing.payableAmount).toLocaleString("en-IN")}
                </p>
                <p className={`text-xs mt-0.5 ${subText}`}>
                  Recorded Hari Om Amount for settlement & revenue tracking.
                </p>
              </div>
              <div className="text-right text-xs">
                <p className="font-bold text-emerald-600 dark:text-emerald-400">Independent Partner Pricing</p>
                <p className={`text-[10px] ${subText}`}>Your external selling price is NOT required</p>
              </div>
            </div>
          </div>

          {/* Acknowledgment checkbox */}
          <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
            isDark ? "bg-white/[0.02] border-white/10 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"
          }`}>
            <p className={`font-bold ${isDark ? "text-slate-200" : "text-slate-900"}`}>
              📌 Physical Course Purchase Agreement:
            </p>
            <p className="mt-1">
              By confirming, you verify that you have collected payment directly from the seafarer outside Hari Om. An official physical course enrollment will be issued immediately, and ₹{Number(pricing.payableAmount).toLocaleString("en-IN")} will be logged in your outstanding settlement balance.
            </p>
          </div>

          {/* Action Buttons */}
          <div className={`flex items-center justify-between pt-4 border-t ${isDark ? "border-white/10" : "border-slate-200"}`}>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                isDark ? "border-white/15 hover:bg-white/5 text-slate-300" : "border-slate-300 hover:bg-slate-100 text-slate-800"
              }`}
            >
              Back
            </button>

            <button
              type="button"
              disabled={submitting}
              onClick={handleConfirmPurchase}
              className="px-6 py-3 rounded-xl text-xs font-black bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-500/25 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              {submitting ? "Processing Enrollment..." : "Confirm & Create Purchase"}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  function setQueryAndSearch(val: string) {
    setSeafarerQuery(val);
    partnerService.searchSeafarers(val).then(setSeafarerResults);
  }
}
