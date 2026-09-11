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

  const cardBg = `rounded-[16px] border-0 ${
    isDark
      ? "bg-[#0B0F19] shadow-[0_4px_20px_rgba(0,0,0,0.3)] text-white"
      : "bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] text-[#111827]"
  }`;

  if (completedPurchase) {
    return (
      <div className="max-w-2xl mx-auto py-10 animate-fadeIn">
        <div className={`p-8 rounded-[16px] border-0 text-center ${cardBg}`}>
          <div className="w-16 h-16 rounded-full bg-[#DCFCE7] text-[#16A34A] dark:bg-emerald-500/15 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#111827] dark:text-white">Purchase Completed</h2>
          <p className={`text-xs mt-1.5 ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
            Course purchase confirmed and training enrollment automatically created.
          </p>

          <div className={`my-6 p-5 rounded-[16px] border-0 text-left space-y-2.5 text-xs ${isDark ? "bg-[#111827]" : "bg-[#FAFAFA]"}`}>
            <div className="flex justify-between">
              <span className={isDark ? "text-gray-400" : "text-[#6B7280]"}>Purchase ID:</span>
              <span className="font-mono font-bold text-[#111827] dark:text-white">{completedPurchase.id}</span>
            </div>
            <div className="flex justify-between">
              <span className={isDark ? "text-gray-400" : "text-[#6B7280]"}>Seafarer Master:</span>
              <span className="font-bold text-[#111827] dark:text-white">{completedPurchase.seafarerName}</span>
            </div>
            <div className="flex justify-between">
              <span className={isDark ? "text-gray-400" : "text-[#6B7280]"}>Course:</span>
              <span className="font-semibold text-[#111827] dark:text-white">{completedPurchase.courseName}</span>
            </div>
            <div className={`flex justify-between items-center pt-2 border-t ${isDark ? "border-[#1F2937]" : "border-[#E5E7EB]"}`}>
              <span className={`font-semibold ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>Hari Om Payable Amount:</span>
              <span className="font-extrabold text-base text-[#111827] dark:text-white">
                ₹{Number(completedPurchase.payableAmount).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={isDark ? "text-gray-400" : "text-[#6B7280]"}>Settlement Status:</span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#B45309] dark:bg-amber-500/15 dark:text-amber-400">
                Pending Settlement
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={isDark ? "text-gray-400" : "text-[#6B7280]"}>Enrollment Status:</span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A] dark:bg-emerald-500/15 dark:text-emerald-400">
                Course Enrolled
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`/partner/purchases/${completedPurchase.id}`}
              className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-bold bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white transition-colors duration-200 shadow-sm"
            >
              View Purchase Details
            </Link>
            <Link
              href="/partner/settlements/create"
              className={`w-full sm:w-auto px-5 py-3 rounded-full text-xs font-semibold transition-colors duration-200 flex items-center justify-center gap-1.5 ${
                isDark ? "bg-[#1F2937] hover:bg-[#374151] text-gray-200" : "bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#6B7280]"
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              Submit Settlement Now
            </Link>
            <Link
              href="/partner/purchases"
              className={`w-full sm:w-auto px-5 py-3 rounded-full text-xs font-semibold transition-colors duration-200 ${
                isDark ? "bg-[#111827] hover:bg-white/10 text-gray-300" : "bg-[#F3F4F6] hover:bg-[#EEF1FE] text-[#6B7280] hover:text-[#3D5EF6]"
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
    <div className="max-w-4xl space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <Link
          href="/partner/purchases"
          className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors duration-200 mb-2 ${
            isDark ? "text-gray-400 hover:text-white" : "text-[#6B7280] hover:text-[#3D5EF6]"
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Purchases
        </Link>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1.5 text-[#111827] dark:text-white">
          New Course Purchase
        </h1>
        <p className={`text-xs md:text-sm mt-1 ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
          Purchase a training course for a seafarer. The Hari Om payable amount is automatically calculated and non-editable.
        </p>
      </div>

      {/* 3-Step Wizard Navigation Indicator */}
      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className={`p-3 rounded-[16px] border-0 text-left transition-colors duration-200 ${
            currentStep === 1
              ? "bg-[#EEF1FE] text-[#3D5EF6] dark:bg-[#3D5EF6]/15 dark:text-[#3D5EF6]"
              : selectedSeafarer
              ? "bg-[#DCFCE7] text-[#16A34A] dark:bg-emerald-500/15 dark:text-emerald-400"
              : isDark
              ? "bg-[#111827] text-gray-500"
              : "bg-[#F3F4F6] text-[#9CA3AF]"
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
          className={`p-3 rounded-[16px] border-0 text-left transition-colors duration-200 disabled:opacity-40 ${
            currentStep === 2
              ? "bg-[#EEF1FE] text-[#3D5EF6] dark:bg-[#3D5EF6]/15 dark:text-[#3D5EF6]"
              : selectedCourse
              ? "bg-[#DCFCE7] text-[#16A34A] dark:bg-emerald-500/15 dark:text-emerald-400"
              : isDark
              ? "bg-[#111827] text-gray-500"
              : "bg-[#F3F4F6] text-[#9CA3AF]"
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
          className={`p-3 rounded-[16px] border-0 text-left transition-colors duration-200 disabled:opacity-40 ${
            currentStep === 3
              ? "bg-[#EEF1FE] text-[#3D5EF6] dark:bg-[#3D5EF6]/15 dark:text-[#3D5EF6]"
              : isDark
              ? "bg-[#111827] text-gray-500"
              : "bg-[#F3F4F6] text-[#9CA3AF]"
          }`}
        >
          <p className="text-[10px] font-bold uppercase tracking-wider">Step 3</p>
          <p className="text-xs font-bold mt-0.5 truncate">Pricing & Confirmation</p>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-[16px] bg-[#FEE2E2] border-0 text-[#DC2626] dark:bg-red-500/15 dark:text-red-400 flex items-center gap-3 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: Select or Search Seafarer */}
      {currentStep === 1 && (
        <div className={`p-6 md:p-8 rounded-[16px] border-0 space-y-6 ${cardBg}`}>
          <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b ${isDark ? "border-[#1F2937]" : "border-[#E5E7EB]"}`}>
            <div>
              <h2 className="text-sm font-bold text-[#111827] dark:text-white">Step 1: Identify Seafarer Master</h2>
              <p className={`text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
                Search candidate identity or select from the directory
              </p>
            </div>
            <Link
              href="/partner/seafarers/create"
              className="text-xs font-bold text-[#3D5EF6] hover:text-[#2E4FE0] transition-colors duration-200 flex items-center gap-1"
            >
              + Create New Seafarer Master
            </Link>
          </div>

          {/* Search box */}
          <form onSubmit={handleSearchSeafarer} className="flex gap-2">
            <div className="relative flex-1">
              <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-500" : "text-[#9CA3AF]"}`} />
              <input
                type="text"
                value={seafarerQuery}
                onChange={(e) => setQueryAndSearch(e.target.value)}
                placeholder="Search by INDoS, Passport, CDC, Email, or Name..."
                className={`w-full pl-10 pr-4 py-2.5 rounded-full text-xs font-medium outline-none transition-colors duration-200 ${
                  isDark ? "bg-[#111827] border-0 text-white focus:ring-1 focus:ring-[#3D5EF6]" : "bg-[#FAFAFA] border-0 text-[#111827] placeholder:text-[#9CA3AF] focus:ring-1 focus:ring-[#3D5EF6]"
                }`}
              />
            </div>
            <button
              type="submit"
              disabled={seafarerLoading}
              className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white transition-colors duration-200 shrink-0"
            >
              {seafarerLoading ? "Searching..." : "Search"}
            </button>
          </form>

          {/* List of matching Seafarers */}
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
            {seafarerResults.length === 0 ? (
              <div className={`p-8 text-center border-0 rounded-[16px] text-xs ${isDark ? "bg-[#111827] text-gray-400" : "bg-[#FAFAFA] text-[#6B7280]"}`}>
                No matching Seafarer Master records. Try another query or{" "}
                <Link href="/partner/seafarers/create" className="text-[#3D5EF6] font-bold hover:underline">
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
                    className={`p-4 rounded-[16px] border-0 cursor-pointer transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-[#EEF1FE] dark:bg-[#3D5EF6]/15"
                        : isDark
                        ? "bg-[#111827] hover:bg-white/5"
                        : "bg-[#FAFAFA] hover:bg-[#EEF1FE]/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#3D5EF6] text-white flex items-center justify-center font-black text-xs uppercase shrink-0">
                        {s.name ? s.name[0] : "S"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-[#111827] dark:text-white text-xs">{s.name}</p>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${isDark ? "bg-[#3D5EF6]/15 text-[#3D5EF6]" : "bg-[#EEF1FE] text-[#3D5EF6]"}`}>
                            INDoS: {s.indosNum || "N/A"}
                          </span>
                        </div>
                        <p className={`text-[11px] mt-0.5 ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
                          {s.email} • {s.phone} • Passport: {s.passportNum || "N/A"}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors duration-200 shrink-0 ${
                        isSelected
                          ? "bg-[#3D5EF6] text-white"
                          : isDark
                          ? "bg-[#1F2937] hover:bg-[#374151] text-gray-200"
                          : "bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#6B7280]"
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

      {/* STEP 2: Select Course */}
      {currentStep === 2 && (
        <div className={`p-6 md:p-8 rounded-[16px] border-0 space-y-6 ${cardBg}`}>
          <div className={`flex justify-between items-center pb-4 border-b ${isDark ? "border-[#1F2937]" : "border-[#E5E7EB]"}`}>
            <div>
              <h2 className="text-sm font-bold text-[#111827] dark:text-white">Step 2: Select Course</h2>
              <p className={`text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
                Enrolling candidate: <span className="font-bold text-[#3D5EF6]">{selectedSeafarer?.name}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`text-xs font-semibold transition-colors duration-200 ${isDark ? "text-gray-400 hover:text-white" : "text-[#6B7280] hover:text-[#3D5EF6]"}`}
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
                  className={`p-5 rounded-[16px] border-0 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? "bg-[#EEF1FE] dark:bg-[#3D5EF6]/15"
                      : isDark
                      ? "bg-[#111827] hover:bg-white/5"
                      : "bg-[#FAFAFA] hover:bg-[#EEF1FE]/40"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${isDark ? "bg-[#3D5EF6]/15 text-[#3D5EF6]" : "bg-[#EEF1FE] text-[#3D5EF6]"}`}>
                        {course.code}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-[#111827] dark:text-white text-sm mt-2">{course.name}</h3>
                    <p className={`text-[11px] mt-1 line-clamp-2 ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
                      {course.description}
                    </p>
                  </div>

                  <div className={`mt-4 pt-3 border-t flex items-center justify-between ${isDark ? "border-[#1F2937]" : "border-[#E5E7EB]"}`}>
                    <div>
                      <p className={`text-[10px] uppercase font-semibold ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>Configured Hari Om Payable</p>
                      <p className="text-sm font-extrabold text-[#111827] dark:text-white">
                        ₹{Number(course.payableAmount).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#3D5EF6] flex items-center gap-1">
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
        <div className={`p-6 md:p-8 rounded-[16px] border-0 space-y-6 ${cardBg}`}>
          <div className={`flex justify-between items-center pb-4 border-b ${isDark ? "border-[#1F2937]" : "border-[#E5E7EB]"}`}>
            <div>
              <h2 className="text-sm font-bold text-[#111827] dark:text-white">Step 3: Review & Confirm Purchase</h2>
              <p className={`text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
                Verify Seafarer details, course selection, and configured Hari Om payable amount.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className={`text-xs font-semibold transition-colors duration-200 ${isDark ? "text-gray-400 hover:text-white" : "text-[#6B7280] hover:text-[#3D5EF6]"}`}
            >
              Change Course
            </button>
          </div>

          {/* Candidate Card */}
          <div className={`p-4 rounded-[16px] border-0 ${isDark ? "bg-[#111827]" : "bg-[#FAFAFA]"}`}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#3D5EF6] mb-2">
              👤 Selected Seafarer Master
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <p className="font-bold text-[#111827] dark:text-white text-sm">{selectedSeafarer?.name}</p>
                <p className={`text-[11px] mt-0.5 ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
                  {selectedSeafarer?.email} • {selectedSeafarer?.phone}
                </p>
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px]">
                <span className={isDark ? "text-gray-300" : "text-[#111827]"}>INDoS: {selectedSeafarer?.indosNum || "N/A"}</span>
                <span className={isDark ? "text-gray-400" : "text-[#6B7280]"}>Passport: {selectedSeafarer?.passportNum || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Course Card */}
          <div className={`p-4 rounded-[16px] border-0 ${isDark ? "bg-[#111827]" : "bg-[#FAFAFA]"}`}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#3D5EF6] mb-2">
              ⚓ Selected Course
            </p>
            <div className="flex justify-between items-center text-xs">
              <div>
                <p className="font-bold text-[#111827] dark:text-white text-sm">{selectedCourse?.name}</p>
                <p className={`text-[11px] mt-0.5 ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
                  Duration: {selectedCourse?.duration} • STCW Certified
                </p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A] dark:bg-emerald-500/15 dark:text-emerald-400">
                DG Approved
              </span>
            </div>
          </div>

          {/* READ-ONLY Hari Om Payable Amount Display */}
          <div className={`p-5 rounded-[16px] border-0 space-y-3 ${isDark ? "bg-[#111827]" : "bg-[#EEF1FE]/60"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#3D5EF6]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#3D5EF6]">
                  Configured Hari Om Payable Amount (Read-Only)
                </span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isDark ? "bg-[#3D5EF6]/20 text-[#3D5EF6]" : "bg-[#EEF1FE] text-[#3D5EF6]"}`}>
                Partner Pricing
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-[#111827] dark:text-white tracking-tight">
                  ₹{Number(pricing.payableAmount).toLocaleString("en-IN")}
                </p>
                <p className={`text-[11px] mt-0.5 ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
                  Amount owed to Hari Om for this course enrollment. Settle via Partner Settlement ledger.
                </p>
              </div>
              <div className={`text-right text-[11px] ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
                <p className="font-medium text-[#111827] dark:text-white">Zero Commission Model</p>
                <p className={`text-[10px] ${isDark ? "text-gray-500" : "text-[#9CA3AF]"}`}>No selling price / profit tracked</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`flex items-center justify-between pt-4 border-t ${isDark ? "border-[#1F2937]" : "border-[#E5E7EB]"}`}>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-colors duration-200 ${
                isDark ? "bg-[#1F2937] hover:bg-[#374151] text-gray-300" : "bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#6B7280]"
              }`}
            >
              Back
            </button>

            <button
              type="button"
              disabled={submitting}
              onClick={handleConfirmPurchase}
              className="px-6 py-3 rounded-full text-xs font-bold bg-[#3D5EF6] hover:bg-[#2E4FE0] text-white shadow-sm transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
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
