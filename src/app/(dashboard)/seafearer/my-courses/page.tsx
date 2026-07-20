"use client";

import React, { useEffect, useState } from "react";
import { courseService } from "@/features/courses/services/course.service";
import { useTheme } from "@/providers/theme-provider";
import { useAuth } from "@/providers/auth-provider";
import { BookOpen, Award, CheckCircle, GraduationCap, Play, ShieldCheck, Flame, BookOpenCheck, ArrowLeft, Check, ChevronRight, Printer } from "lucide-react";
import Link from "next/link";

interface CourseModule {
  id: number;
  title: string;
  desc: string;
  content: string;
}

const COURSE_MODULES: CourseModule[] = [
  {
    id: 1,
    title: "1. Maritime Safety Regulations & IMO Codes",
    desc: "SOLAS and MARPOL international compliance codes",
    content: `Safety of Life at Sea (SOLAS) remains the most critical maritime safety treaty. In this section, we study:
• SOLAS Chapter III: Life-saving appliances and arrangements.
• Chapter II-2: Fire protection, fire detection, and fire extinction.
• Personal Safety on Board: Understanding muster lists, emergency alarms (7 short blasts followed by 1 long blast for abandon ship), and the location of life jackets and immersion suits.
• MARPOL Annex I & V: Marine pollution prevention protocols, bilge discharge rules, and garbage disposal restrictions (plastic discharge is strictly banned everywhere).`
  },
  {
    id: 2,
    title: "2. Personal Protective Equipment & Safety Procedures",
    desc: "Vessel PPE requirements and working aloft guides",
    content: `Before performing any deck or engine work, a Permit to Work (PTW) must be issued. Safety procedures include:
• Personal Protective Equipment (PPE): Boiler suits, steel-toed safety boots, helmets, protective gloves, and safety goggles.
• Enclosed Space Entry: Atmosphere testing for oxygen level (minimum 21% required), toxic gases (H2S, CO), and flammable vapors using a gas detector.
• Working Aloft/Overboard: Using safety harnesses, securing lifelines, and posting safety lookouts on deck.`
  },
  {
    id: 3,
    title: "3. Fire Prevention & onboard Fire Fighting",
    desc: "Understanding the Fire Triangle and extinguisher alignments",
    content: `Fire onboard is a catastrophic emergency. You must know:
• The Fire Triangle: Fuel, Heat, and Oxygen. Removing any of these three elements extinguishes the fire.
• Extinguisher Types and Applications:
  - Water (Class A: Wood, paper, textiles)
  - Foam (Class B: Flammable liquids, oil, fuels)
  - CO2 / Carbon Dioxide (Class C: Electrical fires - does not leave residue or conduct electricity)
  - Dry Chemical Powder (Multi-class usage)
• Fire Drills: Understanding the sound of fire alarm (continuous ringing) and fire main activation procedures.`
  },
  {
    id: 4,
    title: "4. Elementary First Aid & Trauma Care",
    desc: "Cardiopulmonary Resuscitation (CPR) and stretcher logistics",
    content: `Medical help is miles away at sea. Basic trauma care includes:
• The ABCs of First Aid:
  - Airway: Ensure the airway is clear of obstructions.
  - Breathing: Check for chest rise. Perform rescue breaths if necessary.
  - Circulation: Check pulse. Initiate CPR (30 chest compressions to 2 rescue breaths) if pulse is absent.
• Shock Treatment: Raise feet, keep the patient warm, and check vitals.
• Stretcher Logistics: Securing the patient on a Neil Robertson stretcher for transit through narrow shipboard passages.`
  },
  {
    id: 5,
    title: "5. Personal Survival Techniques & Assessment",
    desc: "Life raft launching, muster protocols and cold water survival",
    content: `If the captain issues the Abandon Ship command:
• Don your lifejacket and immersion suit quickly.
• Muster Station check-in: Report to your assigned station for headcount.
• Jumping into water: Hold the lifejacket down firmly, block your nose and mouth, look straight ahead, and jump feet-first.
• Cold Water Survival: Adopt the HELP position (Heat Escape Lessening Posture) to preserve body heat. Group together in a huddle if multiple survivors are in the water.
• Final Simulator Assessment: Test your knowledge in this virtual drill.`
  }
];

export default function MyCoursesPage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === "dark";

  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");
  
  // LMS console study state
  const [studyCourseId, setStudyCourseId] = useState<string | null>(null);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [savingProgress, setSavingProgress] = useState(false);

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

  const activeEnrollment = enrollments.find((e) => e.courseId === studyCourseId);

  // Determine current active module based on database progress
  useEffect(() => {
    if (activeEnrollment) {
      const dbProgress = activeEnrollment.progress;
      const computedIndex = Math.min(Math.floor(dbProgress / 20), 4);
      setActiveModuleIndex(computedIndex);
    }
  }, [studyCourseId, enrollments]);

  const handleCompleteModule = async (modIndex: number) => {
    if (!studyCourseId || !activeEnrollment) return;

    setSavingProgress(true);
    try {
      const nextProgress = Math.min((modIndex + 1) * 20, 100);
      await courseService.updateCourseProgress(studyCourseId, nextProgress);
      
      await fetchEnrollments();

      if (nextProgress >= 100) {
        alert("🎉 Congratulations! You have completed the final module and earned your Certificate!");
        setStudyCourseId(null);
      } else {
        setActiveModuleIndex(modIndex + 1);
      }
    } catch (err) {
      console.error("Failed to save learning progress: ", err);
      alert("Failed to save progress. Please try again.");
    } finally {
      setSavingProgress(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex gap-4">
          <div className="w-32 h-10 rounded-lg bg-gray-800" />
          <div className="w-32 h-10 rounded-lg bg-gray-800" />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-44 rounded-2xl bg-gray-800" />
          <div className="h-44 rounded-2xl bg-gray-800" />
        </div>
      </div>
    );
  }

  const activeCourses = enrollments.filter((e) => e.status === "active");
  const completedCourses = enrollments.filter((e) => e.status === "completed");
  const filteredEnrollments = activeTab === "active" ? activeCourses : completedCourses;

  // Study Console View
  if (studyCourseId && activeEnrollment) {
    const course = activeEnrollment.course;
    const progress = activeEnrollment.progress;

    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Study Console Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800/40 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setStudyCourseId(null)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isDark ? "border-gray-800 text-gray-300 hover:bg-slate-800" : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                  isDark ? "bg-cyan-500/15 text-cyan-400" : "bg-blue-50 text-[#3b71cb]"
                }`}>
                  {course.code}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Learning Console</span>
              </div>
              <h2 className="text-xl font-black tracking-tight">{course.name}</h2>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="text-left md:text-right flex-1 md:flex-initial">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Course Progress</span>
              <span className="text-lg font-black text-emerald-400">{progress}%</span>
            </div>
            <div className={`w-32 h-2 rounded-full overflow-hidden ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
              <div
                className="h-full bg-emerald-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Console Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left panel: Modules List */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-400 pl-1">Course Syllabus</h3>
            <div className="space-y-2">
              {COURSE_MODULES.map((mod, idx) => {
                const isCompleted = progress >= (idx + 1) * 20;
                const isActive = activeModuleIndex === idx;
                const isLocked = progress < idx * 20;

                return (
                  <button
                    key={mod.id}
                    disabled={isLocked}
                    onClick={() => setActiveModuleIndex(idx)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-start justify-between gap-3 transition-all ${
                      isActive
                        ? isDark
                          ? "bg-cyan-500/10 border-cyan-500/40 text-white"
                          : "bg-blue-50 border-[#3b71cb]/30 text-slate-900"
                        : isLocked
                        ? "opacity-50 cursor-not-allowed border-gray-800/20"
                        : isDark
                        ? "bg-[#0A1929] border-gray-800/40 hover:border-gray-700 text-gray-300"
                        : "bg-white border-slate-200 hover:bg-slate-50 text-slate-800"
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="font-black text-xs truncate">{mod.title}</div>
                      <div className={`text-[10px] truncate ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                        {mod.desc}
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                          <Check className="w-3.5 h-3.5 stroke-[3px]" />
                        </div>
                      ) : isActive ? (
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                          isDark ? "border-cyan-400 text-cyan-400" : "border-[#3b71cb] text-[#3b71cb]"
                        }`}>
                          <Play className="w-2.5 h-2.5 fill-current" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right panel: Active Module Reader Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className={`rounded-3xl border p-6 md:p-8 shadow-sm flex flex-col justify-between min-h-[400px] ${
              isDark ? "bg-[#0A1929] border-gray-800 text-white" : "bg-white border-slate-200 text-slate-900"
            }`}>
              <div className="space-y-5">
                <div className="border-b border-gray-800/40 pb-3 flex justify-between items-center">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded ${
                    isDark ? "bg-cyan-500/10 text-cyan-400" : "bg-blue-50 text-[#3b71cb]"
                  }`}>
                    Active Module
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">
                    Module {activeModuleIndex + 1} of 5
                  </span>
                </div>

                <h3 className="text-xl font-black">{COURSE_MODULES[activeModuleIndex].title}</h3>

                <div className={`text-xs leading-relaxed whitespace-pre-line space-y-2.5 ${
                  isDark ? "text-gray-300" : "text-slate-700"
                }`}>
                  {COURSE_MODULES[activeModuleIndex].content}
                </div>
              </div>

              {/* Complete Module Buttons */}
              <div className="border-t border-gray-800/40 pt-6 mt-8 flex justify-end">
                {progress >= (activeModuleIndex + 1) * 20 ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <CheckCircle className="w-5 h-5" /> Module Completed
                  </div>
                ) : (
                  <button
                    onClick={() => handleCompleteModule(activeModuleIndex)}
                    disabled={savingProgress}
                    className={`px-6 py-3 rounded-xl font-bold text-xs shadow-md inline-flex items-center gap-2 cursor-pointer transition-transform hover:scale-[1.01] ${
                      isDark ? "bg-cyan-600 hover:bg-cyan-500 text-white" : "bg-[#3b71cb] hover:bg-[#2c5fb3] text-white"
                    }`}
                  >
                    {savingProgress ? (
                      "Saving Progress..."
                    ) : (
                      <>
                        Mark as Read & Continue <ChevronRight className="w-4.5 h-4.5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Tab Select Header */}
      <div className="flex justify-between items-center border-b border-gray-800/40 pb-4 no-print">
        <div className="flex gap-2 p-1 rounded-xl border border-gray-800/40 bg-gray-950/20">
          <button
            onClick={() => setActiveTab("active")}
            className={`px-6 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "active"
                ? isDark
                  ? "bg-cyan-600 text-white shadow-md"
                  : "bg-[#3b71cb] text-white shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Active Courses ({activeCourses.length})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-6 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "completed"
                ? isDark
                  ? "bg-cyan-600 text-white shadow-md"
                  : "bg-[#3b71cb] text-white shadow-md"
                : "text-gray-400 hover:text-white"
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
          <div className="text-3xl mb-4">📚</div>
          <h3 className="font-extrabold text-sm mb-1">No courses found in this list</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
            You don't have any {activeTab === "active" ? "active" : "completed"} trainings registered.
          </p>
          <Link
            href="/seafearer/browse-courses"
            className={`mt-4 px-6 py-2.5 rounded-xl font-bold text-xs inline-block transition-transform hover:scale-[1.01] ${
              isDark ? "bg-cyan-600 text-white hover:bg-cyan-500" : "bg-[#3b71cb] text-white hover:bg-[#2c5fb3]"
            }`}
          >
            Explore Course Offerings
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6 no-print">
          {filteredEnrollments.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl p-6 border shadow-sm flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
                isDark 
                  ? "bg-[#0A1929] border-gray-800 hover:border-cyan-500/40 text-white" 
                  : "bg-white border-slate-200 hover:border-[#3b71cb]/40 text-slate-900"
              }`}
            >
              {item.status === "active" && (
                <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none rounded-full blur-3xl ${
                  isDark ? "bg-cyan-500" : "bg-blue-500"
                }`} />
              )}

              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                      isDark ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "bg-blue-50 text-[#3b71cb] border border-blue-100"
                    }`}>
                      {item.course.code}
                    </span>
                    <h3 className="font-extrabold text-base leading-snug mt-2 truncate max-w-[200px]" title={item.course.name}>
                      {item.course.name}
                    </h3>
                  </div>
                  <div className="text-2xl">{item.course.icon}</div>
                </div>

                <p className={`text-xs line-clamp-2 leading-relaxed ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                  {item.course.description}
                </p>

                {/* Progress Details */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold text-slate-400">
                    <span>Course Progress</span>
                    <span>{item.progress}%</span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.status === "completed" 
                          ? "bg-green-500" 
                          : isDark ? "bg-cyan-500" : "bg-[#3b71cb]"
                      }`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>

                {/* Meta specifications */}
                <div className="grid grid-cols-2 gap-4 text-[10px] text-slate-400 border-t border-gray-800/40 pt-4">
                  <div>
                    <span className="font-semibold block uppercase">Duration</span>
                    <span className={`font-bold ${isDark ? "text-white" : "text-slate-800"}`}>{item.course.duration}</span>
                  </div>
                  <div>
                    <span className="font-semibold block uppercase">Fees</span>
                    <span className={`font-bold ${isDark ? "text-white" : "text-slate-800"}`}>{item.course.fees}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-5 pt-4 border-t border-gray-800/40 flex justify-end gap-2">
                {item.status === "active" ? (
                  <button
                    onClick={() => {
                      setStudyCourseId(item.courseId);
                    }}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                      isDark ? "bg-cyan-600 text-white hover:bg-cyan-500" : "bg-[#3b71cb] text-white hover:bg-[#2c5fb3]"
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-white" /> Continue Learning
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setCertificateItem(item);
                    }}
                    className="w-full py-2.5 rounded-xl font-bold text-xs bg-green-600 hover:bg-green-500 text-white inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <ShieldCheck className="w-4 h-4" /> Download Certificate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

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
                has successfully completed the DGS-approved maritime training curriculum and simulator assessments for:
              </p>
              <h5 className="text-lg font-extrabold text-slate-950 tracking-tight">
                {certificateItem.course.name} ({certificateItem.course.code})
              </h5>
              <p className="text-[9px] text-slate-400">
                Classified under: {certificateItem.course.level} • Duration: {certificateItem.course.duration}
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
