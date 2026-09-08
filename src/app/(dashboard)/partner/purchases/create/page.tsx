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
  const isDark = theme === "dark";

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
    ? "bg-[#09162c]/80 border-white/5 shadow-xl"
    : "bg-white border-slate-200/80 shadow-md";

  if (completedPurchase) {
    return (
      <div className="max-w-2xl mx-auto py-10 animate-fadeIn">
        <div className={`p-8 rounded-3xl border text-center ${cardBg}`}>
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Purchase Completed</h2>
          <p className={`text-xs mt-1.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Physical course purchase confirmed and physical training enrollment automatically created.
          </p>

          <div className={`my-6 p-5 rounded-2xl border text-left space-y-2.5 text-xs ${isDark ? "bg-white/[0.02] border-white/5" : "bg-slate-50 border-slate-200"}`}>
            <div className="flex justify-between">
              <span className="text-slate-400">Purchase ID:</span>
              <span className="font-mono font-bold text-cyan-400">{completedPurchase.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Seafarer Master:</span>
              <span className="font-bold text-white">{completedPurchase.seafarerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Physical Course:</span>
              <span className="font-semibold text-slate-200">{completedPurchase.courseName}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-white/5">
              <span className="text-slate-400 font-semibold">Hari Om Payable Amount:</span>
              <span className="font-extrabold text-base text-cyan-300">
                ₹{Number(completedPurchase.payableAmount).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Settlement Status:</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Pending Settlement
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Enrollment Status:</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
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
                isDark ? "bg-white/5 hover:bg-white/10 border-white/10 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Purchases
        </Link>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1.5">
          New Course Purchase
        </h1>
        <p className={`text-xs md:text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Purchase a physical training course for a seafarer. The Hari Om payable amount is automatically calculated and non-editable.
        </p>
      </div>

      {/* 3-Step Wizard Navigation Indicator */}
      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className={`p-3 rounded-2xl border text-left transition-all ${
            currentStep === 1
              ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
              : selectedSeafarer
              ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
              : "bg-white/[0.02] border-white/5 text-slate-500"
          }`}
        >
          <p className="text-[10px] font-bold uppercase tracking-wider">Step 1</p>
          <p className="text-xs font-bold mt-0.5 truncate">
            {selectedSeafarer ? `✓ ${selectedSeafarer.name}` : "Select Seafarer"}
          </p>
        </button>

        <button
          type="button"
          disabled={!selectedSeafarer}
          onClick={() => selectedSeafarer && setCurrentStep(2)}
          className={`p-3 rounded-2xl border text-left transition-all disabled:opacity-40 ${
            currentStep === 2
              ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
              : selectedCourse
              ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
              : "bg-white/[0.02] border-white/5 text-slate-500"
          }`}
        >
          <p className="text-[10px] font-bold uppercase tracking-wider">Step 2</p>
          <p className="text-xs font-bold mt-0.5 truncate">
            {selectedCourse ? `✓ ${selectedCourse.code}` : "Select Course"}
          </p>
        </button>

        <button
          type="button"
          disabled={!selectedSeafarer || !selectedCourse}
          onClick={() => selectedSeafarer && selectedCourse && setCurrentStep(3)}
          className={`p-3 rounded-2xl border text-left transition-all disabled:opacity-40 ${
            currentStep === 3
              ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
              : "bg-white/[0.02] border-white/5 text-slate-500"
          }`}
        >
          <p className="text-[10px] font-bold uppercase tracking-wider">Step 3</p>
          <p className="text-xs font-bold mt-0.5 truncate">Pricing & Confirmation</p>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center gap-3 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: Select or Search Seafarer */}
      {currentStep === 1 && (
        <div className={`p-6 md:p-8 rounded-3xl border space-y-6 ${cardBg}`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-white/5">
            <div>
              <h2 className="text-sm font-bold text-white">Step 1: Identify Seafarer Master</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Search candidate identity or select from the directory
              </p>
            </div>
            <Link
              href="/partner/seafarers/create"
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              + Create New Seafarer Master
            </Link>
          </div>

          {/* Search box */}
          <form onSubmit={handleSearchSeafarer} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={seafarerQuery}
                onChange={(e) => setQueryAndSearch(e.target.value)}
                placeholder="Search by INDoS, Passport, CDC, Email, or Name..."
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium outline-none transition-all ${
                  isDark ? "bg-white/5 border border-white/10 text-white focus:border-cyan-500/50" : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-500"
                }`}
              />
            </div>
            <button
              type="submit"
              disabled={seafarerLoading}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shrink-0"
            >
              {seafarerLoading ? "Searching..." : "Search"}
            </button>
          </form>

          {/* List of matching Seafarers */}
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
            {seafarerResults.length === 0 ? (
              <div className="p-8 text-center border border-dashed rounded-2xl border-white/10 text-slate-400 text-xs">
                No matching Seafarer Master records. Try another query or{" "}
                <Link href="/partner/seafarers/create" className="text-cyan-400 font-bold hover:underline">
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
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-cyan-500/15 border-cyan-500/40 shadow-md shadow-cyan-500/10"
                        : isDark
                        ? "bg-white/[0.02] border-white/5 hover:bg-white/5"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center font-black text-xs uppercase shrink-0">
                        {s.name ? s.name[0] : "S"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-white text-xs">{s.name}</p>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400">
                            INDoS: {s.indosNum || "N/A"}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {s.email} • {s.phone} • Passport: {s.passportNum || "N/A"}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                        isSelected
                          ? "bg-cyan-500 text-slate-950"
                          : "bg-white/10 hover:bg-white/15 text-white"
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
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <div>
              <h2 className="text-sm font-bold text-white">Step 2: Select Physical Course</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Enrolling candidate: <span className="font-bold text-cyan-400">{selectedSeafarer?.name}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="text-xs font-semibold text-slate-400 hover:text-white"
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
                      ? "bg-cyan-500/15 border-cyan-500/40 shadow-lg shadow-cyan-500/15"
                      : isDark
                      ? "bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/10"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {course.code}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        ⏱ {course.duration}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-white text-sm mt-2">{course.name}</h3>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {course.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Configured Hari Om Payable</p>
                      <p className="text-sm font-extrabold text-cyan-300">
                        ₹{Number(course.payableAmount).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
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
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <div>
              <h2 className="text-sm font-bold text-white">Step 3: Review & Confirm Purchase</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Verify Seafarer details, course selection, and configured Hari Om payable amount.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="text-xs font-semibold text-slate-400 hover:text-white"
            >
              Change Course
            </button>
          </div>

          {/* Candidate Card */}
          <div className={`p-4 rounded-2xl border ${isDark ? "bg-white/[0.02] border-white/5" : "bg-slate-50 border-slate-200"}`}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 mb-2">
              👤 Selected Seafarer Master
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <p className="font-bold text-white text-sm">{selectedSeafarer?.name}</p>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  {selectedSeafarer?.email} • {selectedSeafarer?.phone}
                </p>
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px]">
                <span className="text-cyan-300">INDoS: {selectedSeafarer?.indosNum || "N/A"}</span>
                <span className="text-slate-300">Passport: {selectedSeafarer?.passportNum || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Course Card */}
          <div className={`p-4 rounded-2xl border ${isDark ? "bg-white/[0.02] border-white/5" : "bg-slate-50 border-slate-200"}`}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 mb-2">
              ⚓ Selected Physical Training Course
            </p>
            <div className="flex justify-between items-center text-xs">
              <div>
                <p className="font-bold text-white text-sm">{selectedCourse?.name}</p>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Duration: {selectedCourse?.duration} • Training Type: Physical / In-Person
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                In-Person Class
              </span>
            </div>
          </div>

          {/* READ-ONLY Hari Om Payable Amount Display */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-transparent border border-cyan-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                  Configured Hari Om Payable Amount (Read-Only)
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                Partner Pricing
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  ₹{Number(pricing.payableAmount).toLocaleString("en-IN")}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Amount owed to Hari Om for this course enrollment. Settle via Partner Settlement ledger.
                </p>
              </div>
              <div className="text-right text-[11px] text-slate-400">
                <p>Zero Commission Model</p>
                <p className="text-slate-500 text-[10px]">No selling price / profit tracked</p>
              </div>
            </div>
          </div>

          {/* Acknowledgment checkbox */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-400 leading-relaxed">
            <p className="font-semibold text-slate-300">
              📌 Physical Course Purchase Agreement:
            </p>
            <p className="mt-1">
              By confirming, you verify that you have collected payment directly from the seafarer outside Hari Om. An official physical course enrollment will be issued immediately, and ₹{Number(pricing.payableAmount).toLocaleString("en-IN")} will be logged in your outstanding settlement balance.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-white/10 hover:bg-white/5 text-slate-300"
            >
              Back
            </button>

            <button
              type="button"
              disabled={submitting}
              onClick={handleConfirmPurchase}
              className="px-6 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 flex items-center gap-2 disabled:opacity-50"
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
