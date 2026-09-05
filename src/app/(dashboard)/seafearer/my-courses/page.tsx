"use client";

import React, { useEffect, useState } from "react";
import { courseService } from "@/services/course.service";
import { useTheme } from "@/providers/theme-provider";
import { useAuth } from "@/providers/auth-provider";
import { 
  BookOpen, 
  Award, 
  CheckCircle, 
  GraduationCap, 
  ShieldCheck, 
  ArrowLeft, 
  Check, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  FileText, 
  Printer, 
  ExternalLink,
  Info
} from "lucide-react";
import Link from "next/link";
import { CourseEnrollment, Course } from "@/types/course";

interface CourseDetailInfo {
  topics: string[];
  guidelines: string[];
}

function getCourseDetails(course?: Course | { code?: string; name?: string; description?: string } | null): CourseDetailInfo {
  const code = (course?.code || "").toUpperCase();
  const name = (course?.name || "").toLowerCase();

  if (code.includes("PSCRB") || name.includes("survival craft") || name.includes("rescue boat")) {
    return {
      topics: [
        "Survival craft launching and handling mechanisms",
        "Rescue boat operations and in-water recovery drills",
        "Emergency procedures and rough-sea navigation",
        "Practical safety training and capsize righting drills",
        "Required attendance logging and DGS documentation"
      ],
      guidelines: [
        "Boiler suit and steel-toed safety boots are required for practical boat davit drills.",
        "Carry original Passport, CDC, and INDoS registration certificate for physical identity verification.",
        "100% biometric attendance is required for DGS completion certificate issuance."
      ]
    };
  }

  if (code.includes("STSDSD") || code.includes("STSDSSD") || name.includes("designated security duties")) {
    return {
      topics: [
        "Maritime security threats, piracy mitigation, and armed robbery defense",
        "Ship Security Plan (SSP) execution and designated security protocols",
        "Security screening, search procedures, and recognition of security risks",
        "Emergency security communications and drill coordination"
      ],
      guidelines: [
        "Carry original CDC / Passport and INDoS certificate for identity verification.",
        "Active participation in ISPS code security case study assessments is mandatory.",
        "100% attendance required for DGS accredited certificate issuance."
      ]
    };
  }

  if (code.includes("OCTCO") || name.includes("oil") || name.includes("chemical tanker")) {
    return {
      topics: [
        "Physical and chemical properties of oil and liquid chemical cargoes",
        "Cargo containment systems, piping layouts, and deepwell pumping operations",
        "Inert Gas Systems (IGS), tank venting, and gas-freeing protocols",
        "Chemical reactivity hazards, enclosed space entry, and emergency response"
      ],
      guidelines: [
        "Review basic tanker familiarization modules prior to practical simulator drills.",
        "Mandatory compliance with ISGOTT and IBC Code safety checklists.",
        "Original CDC and INDoS certificate required for registrar verification."
      ]
    };
  }

  if (code.includes("EFA") || name.includes("first aid") || name.includes("elementary first aid")) {
    return {
      topics: [
        "Emergency casualty assessment, vital signs monitoring, and triage protocols",
        "Cardiopulmonary Resuscitation (CPR) & Automated External Defibrillator (AED) execution",
        "Hemorrhage control, tourniquet application, and shock management",
        "Bandaging techniques, fracture splinting, and maritime burns treatment"
      ],
      guidelines: [
        "Wear comfortable training attire suitable for floor-level CPR manikin simulations.",
        "Demonstrated practical proficiency in CPR is required for course sign-off.",
        "100% biometric attendance is required for DGS certificate generation."
      ]
    };
  }

  if (code.includes("AFF") || name.includes("advanced fire")) {
    return {
      topics: [
        "Fire command organization, communication tactics, and tactical leadership",
        "Self-Contained Breathing Apparatus (SCBA) endurance drills in smoke chambers",
        "Fixed fire-extinguishing systems (CO2, foam, dry chemical, and water mist)",
        "Hazardous cargo fire isolation, ventilation controls, and post-fire inspection"
      ],
      guidelines: [
        "Flame-retardant boiler suit, safety footwear, and valid medical fitness clearance mandatory.",
        "Active participation in live fire ground simulator drills is required for accreditation.",
        "Original INDoS and CDC required for physical verification."
      ]
    };
  }

  if (code.includes("PST") || code.includes("BST") || name.includes("personal survival") || name.includes("basic safety")) {
    return {
      topics: [
        "Emergency station bill muster, donning lifejackets, and immersion suits",
        "Abandon ship jumps from height, in-water survival clusters, and hypothermia defense",
        "Liferaft boarding, righting an inverted raft, and sea anchor deployment",
        "Pyrotechnic distress signaling and helicopter hoist rescue procedures"
      ],
      guidelines: [
        "Swimming attire, towel, and clean boiler suit required for pool survival drills.",
        "Medical fitness declaration required prior to high-jump water exercises.",
        "100% biometric attendance required conforming to DGS regulations."
      ]
    };
  }

  if (code.includes("GMDSS") || code.includes("GMDS") || name.includes("gmdss")) {
    return {
      topics: [
        "VHF, MF/HF DSC radio installations and distress alert transmission",
        "Inmarsat satellite communications (C, Fleet Broadband) and SafetyNET",
        "EPIRB, SART, and NAVTEX operation, testing routines, and battery checks",
        "SOLAS radio regulations and official maritime radio logbook maintenance"
      ],
      guidelines: [
        "Valid GMDSS logbook and passport required for practical simulator logging.",
        "Daily communication logs must be completed and signed by the instructor.",
        "Full simulator hours must be completed before terminal competency assessment."
      ]
    };
  }

  if (code.includes("MFA") || name.includes("medical first aid")) {
    return {
      topics: [
        "Advanced trauma care, clinical dressing, wound closure, and sutures",
        "Shipboard medical chest inventory, drug administration, and injections",
        "Telemedical Maritime Assistance Service (TMAS) protocols and vital reporting",
        "Spinal immobilization, Neil Robertson stretcher evacuation, and patient stabilization"
      ],
      guidelines: [
        "Hands-on clinical demonstrations and practical suture/injection drills are mandatory.",
        "Compliance with WHO International Medical Guide for Ships standards.",
        "Valid CDC, Passport, and INDoS verification required."
      ]
    };
  }

  const descPoints = course?.description
    ? course.description
        .split(/[.,;]/)
        .map(s => s.trim())
        .filter(s => s.length > 12)
        .slice(0, 4)
    : [];

  const topics = descPoints.length >= 2
    ? descPoints
    : [
        "Standard DGS & STCW operational procedures and maritime safety compliance",
        "Core competency training, practical drills, and technical assessment modules",
        "Emergency response coordination, hazard recognition, and team communication",
        "Equipment operation, compliance logging, and industry best practices"
      ];

  const guidelines = [
    "Report at the campus training registrar office 15 minutes prior to session commencement.",
    "Carry original Passport, CDC, and INDoS registration certificate for physical identity verification.",
    "100% biometric attendance is required for DGS completion certificate issuance."
  ];

  return { topics, guidelines };
}

export default function MyCoursesPage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === "dark";

  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"active" | "on_hold" | "completed">("active");
  
  // Physical Training Schedule & Dossier Modal
  const [dossierEnrollment, setDossierEnrollment] = useState<CourseEnrollment | null>(null);

  // Certificate Modal state
  const [certificateItem, setCertificateItem] = useState<any | null>(null);

  const fetchEnrollments = async () => {
    try {
      const data = await courseService.getMyEnrollments();
      setEnrollments(data);
    } catch (err) {
      console.error("Failed to load user enrollments: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex gap-4">
          <div className="w-32 h-10 rounded-lg bg-gray-800" />
          <div className="w-32 h-10 rounded-lg bg-gray-800" />
          <div className="w-32 h-10 rounded-lg bg-gray-800" />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-52 rounded-2xl bg-gray-800" />
          <div className="h-52 rounded-2xl bg-gray-800" />
        </div>
      </div>
    );
  }

  const ongoingCourses = enrollments.filter((e) => e.status === "active" || e.status === "ongoing");
  const onHoldCourses = enrollments.filter((e) => e.status === "on_hold");
  const completedCourses = enrollments.filter((e) => e.status === "completed");

  const filteredEnrollments = 
    activeTab === "active" 
      ? ongoingCourses 
      : activeTab === "on_hold" 
      ? onHoldCourses 
      : completedCourses;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Title Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight">My Enrolled Courses</h1>
        <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          View your registered maritime courses, batch schedules, and completion records.
        </p>
      </div>

      {/* Tab Select Header */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b ${isDark ? "border-gray-800/40" : "border-slate-200"} pb-4 no-print`}>
        <div className={`flex flex-wrap gap-2 p-1 rounded-xl border transition-colors ${
          isDark ? "bg-gray-950/40 border-gray-800/60" : "bg-white border-slate-200 shadow-xs"
        }`}>
          <button
            onClick={() => setActiveTab("active")}
            className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "active"
                ? isDark
                  ? "bg-cyan-600 text-white shadow-md"
                  : "bg-[#3b71cb] text-white shadow-md"
                : isDark
                ? "text-slate-400 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Ongoing Courses ({ongoingCourses.length})
          </button>

          <button
            onClick={() => setActiveTab("on_hold")}
            className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "on_hold"
                ? "bg-amber-600 text-white shadow-md"
                : isDark
                ? "text-slate-400 hover:text-amber-400"
                : "text-slate-600 hover:text-amber-600"
            }`}
          >
            On Hold ({onHoldCourses.length})
          </button>

          <button
            onClick={() => setActiveTab("completed")}
            className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "completed"
                ? "bg-emerald-600 text-white shadow-md"
                : isDark
                ? "text-slate-400 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Completed & Certs ({completedCourses.length})
          </button>
        </div>

        <Link
          href="/seafearer/browse-courses"
          className={`px-4 py-2.5 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 transition-transform hover:scale-[1.01] ${
            isDark ? "bg-cyan-600/10 text-cyan-400 hover:bg-cyan-600/20" : "bg-blue-50 text-[#3b71cb] hover:bg-blue-100"
          }`}
        >
          Book Another Course <GraduationCap className="w-4.5 h-4.5" />
        </Link>
      </div>

      {/* Courses List Grid */}
      {filteredEnrollments.length === 0 ? (
        <div className={`text-center py-20 border border-dashed rounded-3xl p-6 no-print ${
          isDark ? "border-gray-800" : "border-slate-300"
        }`}>
          <div className="text-3xl mb-4">
            {activeTab === "on_hold" ? "⚠️" : "🏫"}
          </div>
          <h3 className="font-extrabold text-sm mb-1">
            {activeTab === "active" 
              ? "No ongoing physical courses" 
              : activeTab === "on_hold" 
              ? "No courses currently on hold" 
              : "No completed courses registered"}
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
            {activeTab === "on_hold"
              ? "All your course enrollments and records are in good operational standing."
              : `You do not have any ${activeTab === "active" ? "ongoing" : "completed"} physical trainings registered.`}
          </p>
          <Link
            href="/seafearer/browse-courses"
            className={`mt-4 px-6 py-2.5 rounded-xl font-bold text-xs inline-block transition-transform hover:scale-[1.01] ${
              isDark ? "bg-cyan-600 text-white hover:bg-cyan-500" : "bg-[#3b71cb] text-white hover:bg-[#2c5fb3]"
            }`}
          >
            Explore Maritime Course Offerings
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6 no-print">
          {filteredEnrollments.map((item) => {
            const isOnHold = item.status === "on_hold";
            const isCompleted = item.status === "completed";
            const isOngoing = !isOnHold && !isCompleted;

            return (
              <div
                key={item.id}
                className={`rounded-2xl px-6 pt-3.5 pb-6 border shadow-sm flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
                  isOnHold
                    ? isDark
                      ? "bg-[#14120a] border-amber-500/40 text-white"
                      : "bg-amber-50/40 border-amber-300 text-slate-900"
                    : isDark 
                    ? "bg-[#0A1929] border-gray-800 hover:border-cyan-500/40 text-white" 
                    : "bg-white border-slate-200 hover:border-[#3b71cb]/40 text-slate-900"
                }`}
              >
                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Visual Status Indicator */}
                    <div className="flex items-center justify-end">
                      {isOnHold ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-500/30">
                          <AlertTriangle className="w-3.5 h-3.5" /> On Hold
                        </span>
                      ) : isCompleted ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-500/30">
                          <CheckCircle className="w-3.5 h-3.5" /> Completed
                        </span>
                      ) : (
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider ${
                          isDark ? "text-emerald-400" : "text-emerald-600"
                        }`}>
                          <Clock className="w-3.5 h-3.5" /> Ongoing
                        </span>
                      )}
                    </div>

                    {/* Course Title */}
                    <div className="mt-1.5">
                      <h3 className="font-extrabold text-base leading-snug truncate" title={item.course?.name}>
                        {item.course?.name}
                      </h3>
                      <p className={`text-xs mt-1 line-clamp-2 leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                        {item.course?.description}
                      </p>
                    </div>

                    {/* On Hold Explanatory Warning Notice */}
                    {isOnHold && (
                      <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
                        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold">Training Status: On Hold</div>
                          <p className="text-[10px] text-amber-200/80 leading-normal mt-0.5">
                            This course schedule is temporarily on hold for document or administrative verification. All previous purchases, documents, and records remain securely linked to your master profile.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Batch Schedule */}
                  <div className={`p-3 rounded-xl border flex items-center gap-2 ${
                    isDark ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}>
                    <Calendar className={`w-3.5 h-3.5 shrink-0 ${isDark ? "text-cyan-400" : "text-[#3b71cb]"}`} />
                    <span className={`text-xs font-medium ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                      Schedule: <strong className={`font-bold ${isDark ? "text-white" : "text-slate-800"}`}>{item.batchSchedule || "Mon - Fri | 09:00 - 17:30 IST"}</strong>
                    </span>
                  </div>

                  {/* Meta specifications */}
                  <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-400 border-t border-gray-800/40 pt-3">
                    <div>
                      <span className="font-semibold block uppercase">Duration</span>
                      <span className={`font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
                        {item.course?.duration || "12 Days"}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold block uppercase">Training Mode</span>
                      <span className={`font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
                        Physical Campus
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold block uppercase">Attendance / Status</span>
                      <span className={`font-bold ${
                        isOnHold ? "text-amber-400" : isCompleted ? "text-emerald-400" : "text-cyan-400"
                      }`}>
                        {isOnHold ? "On Hold" : isCompleted ? "100% (Certified)" : "In Progress"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="mt-5 pt-4 border-t border-gray-800/40 flex justify-end gap-2">
                  <button
                    onClick={() => setDossierEnrollment(item)}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-sm border ${
                      isDark 
                        ? "border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-200" 
                        : "border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-800"
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Course Schedule & Dossier
                  </button>

                  {isCompleted && (
                    <button
                      onClick={() => setCertificateItem(item)}
                      className="py-2.5 px-4 rounded-xl font-bold text-xs bg-green-600 hover:bg-green-500 text-white inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <ShieldCheck className="w-4 h-4" /> Certificate
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Course Schedule & Dossier Modal */}
      {dossierEnrollment && (() => {
        const courseDetails = getCourseDetails(dossierEnrollment.course);
        const isOnHold = dossierEnrollment.status === "on_hold";
        const isCompleted = dossierEnrollment.status === "completed";
        const batchText = dossierEnrollment.enrollmentDetails?.batchId || "BATCH 2026";
        const durationText = dossierEnrollment.course?.duration || "5 Days";
        const trainingModeText = dossierEnrollment.course?.trainingType || dossierEnrollment.course?.deliveryMode || "Physical Campus";
        const scheduleText = dossierEnrollment.batchSchedule || "Monday – Friday | 09:00 – 17:30 IST";
        const attendanceText = isOnHold 
          ? "On Hold" 
          : isCompleted 
          ? "100% (Certified)" 
          : dossierEnrollment.progress && dossierEnrollment.progress > 0 
          ? `${dossierEnrollment.progress}% (In Progress)`
          : "In Progress";

        return (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
            <div className={`w-full max-w-2xl rounded-3xl border shadow-2xl p-6 md:p-8 space-y-5 my-8 max-h-[90vh] overflow-y-auto ${
              isDark ? "bg-[#09162c] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
            }`}>
              {/* 1. Course Name & Close Button */}
              <div className="flex justify-between items-start gap-4 pb-4 border-b border-slate-200 dark:border-slate-800/60">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl md:text-2xl font-black tracking-tight leading-snug break-words text-slate-900 dark:text-white">
                    {dossierEnrollment.course?.name}
                    {dossierEnrollment.course?.code ? ` (${dossierEnrollment.course.code})` : ""}
                  </h3>
                </div>
                <button
                  onClick={() => setDossierEnrollment(null)}
                  className={`p-2 px-3 rounded-xl border font-bold text-xs cursor-pointer shrink-0 transition-colors ${
                    isDark 
                      ? "border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white" 
                      : "border-slate-200 hover:bg-slate-100 text-slate-700 hover:text-slate-950"
                  }`}
                >
                  Close
                </button>
              </div>

              {/* 2. Status | Batch */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Status:</span>
                  {isOnHold ? (
                    <span className="inline-flex items-center gap-1.5 font-black uppercase tracking-wider text-amber-500">
                      <AlertTriangle className="w-4 h-4" /> On Hold
                    </span>
                  ) : isCompleted ? (
                    <span className="inline-flex items-center gap-1.5 font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="w-4 h-4" /> Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      <Clock className="w-4 h-4" /> Ongoing
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Batch:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {batchText}
                  </span>
                </div>
              </div>

              {/* 3. Duration | Training Mode | Attendance */}
              <div className={`grid grid-cols-3 gap-3 p-4 rounded-2xl border ${
                isDark ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-200"
              }`}>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Duration
                  </span>
                  <span className="text-xs font-bold mt-1 block text-slate-900 dark:text-white">
                    {durationText}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Training Mode
                  </span>
                  <span className="text-xs font-bold mt-1 block text-slate-900 dark:text-white">
                    {trainingModeText}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Attendance / Progress
                  </span>
                  <span className={`text-xs font-bold mt-1 block ${
                    isOnHold 
                      ? "text-amber-500" 
                      : "text-emerald-600 dark:text-emerald-400"
                  }`}>
                    {attendanceText}
                  </span>
                </div>
              </div>

              {/* 4. Schedule */}
              <div className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
                isDark ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"
              }`}>
                <Calendar className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <div className="text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Schedule: </span>
                  <strong className="font-bold text-slate-900 dark:text-white">
                    {scheduleText}
                  </strong>
                </div>
              </div>

              {/* 5. Course Information */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-200 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> COURSE INFORMATION & FOCUS AREAS
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 items-start">
                  {courseDetails.topics.map((topic, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-snug">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-[5px]" />
                      <span className="flex-1 min-w-0">{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 6. Important Guidelines / Requirements */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-200 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Important Guidelines & Requirements
                </h4>
                <ul className="space-y-2">
                  {courseDetails.guidelines.map((guide, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-snug">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 shrink-0 mt-[5px]" />
                      <span className="flex-1 min-w-0">{guide}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer: Acknowledge & Close */}
              <div className="border-t border-slate-200 dark:border-slate-800/60 pt-4 flex justify-end">
                <button
                  onClick={() => setDossierEnrollment(null)}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs cursor-pointer shadow-sm transition-colors ${
                    isDark ? "bg-cyan-600 hover:bg-cyan-500 text-white" : "bg-[#3b71cb] hover:bg-[#2c5fb3] text-white"
                  }`}
                >
                  Acknowledge & Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Renders Printable Certificate Overlay Modal */}
      {certificateItem && (
        <div className="fixed inset-0 z-50 bg-black/85 flex flex-col items-center justify-center p-4 overflow-y-auto no-print-backdrop">
          {/* Controls */}
          <div className="w-full max-w-4xl flex justify-between items-center mb-4 no-print">
            <button
              onClick={() => setCertificateItem(null)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white rounded-xl font-bold text-xs inline-flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold text-xs inline-flex items-center gap-2 shadow-lg cursor-pointer transition-transform hover:scale-[1.02]"
            >
              <Printer className="w-4.5 h-4.5" /> Print / Save as PDF
            </button>
          </div>

          {/* Certificate Page Element */}
          <div
            id="printable-certificate"
            className="w-full max-w-4xl aspect-[1.414/1] bg-white border-[16px] border-double border-slate-900 p-12 md:p-16 relative flex flex-col justify-between overflow-hidden text-slate-800 select-none shadow-2xl"
          >
            {/* Corner Details */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-500" />
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-500" />
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-500" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-500" />

            {/* Header */}
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center gap-2 mb-1 text-slate-950">
                <Award className="w-10 h-10 text-amber-500" />
                <h1 className="text-xl font-black uppercase tracking-widest text-[#0F2027]">
                  Hari Om Thalassic
                </h1>
              </div>
              <h2 className="text-[8px] tracking-[0.2em] font-black uppercase text-amber-600">
                Maritime Training Academy & Career Partners
              </h2>
              <div className="w-2/3 h-[1px] bg-slate-200 mx-auto mt-2" />
            </div>

            {/* Main content details */}
            <div className="text-center space-y-4 my-2">
              <h3 className="font-serif italic text-2xl text-slate-700">
                Certificate of Completion
              </h3>
              <p className="text-[9px] text-slate-500 uppercase tracking-widest">
                This is to certify that seafarer
              </p>
              <h4 className="text-2xl font-black tracking-tight text-[#0F2027] border-b border-dotted border-slate-400 pb-1 max-w-sm mx-auto">
                {user?.name}
              </h4>
              <p className="text-[10px] text-slate-500 max-w-md mx-auto leading-relaxed">
                has successfully completed the physical maritime training curriculum and simulator assessments for:
              </p>
              <h5 className="text-lg font-extrabold text-slate-950 tracking-tight">
                {certificateItem.course?.name} ({certificateItem.course?.code})
              </h5>
              <p className="text-[9px] text-slate-400">
                Course Duration: {certificateItem.course?.duration}
              </p>
            </div>

            {/* Footers / Seal */}
            <div className="grid grid-cols-3 items-end gap-4 border-t border-slate-100 pt-6 text-center text-[9px]">
              <div>
                <div className="font-semibold text-slate-500 uppercase">Issue Date</div>
                <div className="font-bold text-slate-950 mt-1">
                  {certificateItem.completion_date 
                    ? new Date(certificateItem.completion_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                    : new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </div>
              </div>

              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full border-4 border-double border-amber-500 flex flex-col items-center justify-center text-amber-600 bg-amber-50/50 shadow-inner relative transform rotate-6">
                  <ShieldCheck className="w-7 h-7 text-amber-500" />
                  <span className="text-[6px] font-bold uppercase tracking-wider mt-0.5">VERIFIED</span>
                </div>
              </div>

              <div>
                <div className="font-serif italic text-sm text-slate-700 leading-none">
                  Capt. Suresh Kumar
                </div>
                <div className="w-3/4 h-[1px] bg-slate-300 mx-auto my-1" />
                <div className="font-semibold text-slate-500 uppercase">Academy Director</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global CSS Inject to customize printing output */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-certificate, #printable-certificate * {
            visibility: visible !important;
          }
          #printable-certificate {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            margin: 0 !important;
            padding: 2cm !important;
            box-shadow: none !important;
            border: 12px double #1e293b !important;
            background-color: white !important;
            display: flex !important;
          }
          .no-print, .no-print-backdrop {
            display: none !important;
            background: none !important;
          }
        }
      `}</style>
    </div>
  );
}

