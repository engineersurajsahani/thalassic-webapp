"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { useTheme } from "@/providers/theme-provider";
import { dashboardService } from "@/services/dashboard.service";
import {
  Compass,
  FileText,
  User,
  ArrowRight,
  Award,
  BookOpen,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  FileSignature,
  Ship,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await dashboardService.getDashboardData();
        setDashboardData(data);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Welcome Skeleton */}
        <div className={`h-48 rounded-3xl ${isDark ? "bg-[#0A192F]" : "bg-slate-100"}`} />
        
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`h-28 rounded-2xl ${isDark ? "bg-[#0A192F]" : "bg-slate-100"}`} />
          ))}
        </div>

        {/* Info Cards Skeleton */}
        <div className="grid lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`h-56 rounded-2xl ${isDark ? "bg-[#0A192F]" : "bg-slate-100"}`} />
          ))}
        </div>
      </div>
    );
  }

  const { profileCompletion, courses, certificates, notifications } = dashboardData || {
    profileCompletion: 0,
    courses: { active: null, completedCount: 0 },
    certificates: { passport: "missing", cdc: "missing", medical: "missing", stcw: "missing" },
    notifications: [],
  };

  // Calculate sea service summary from user profile data
  const seaServiceRecords = user?.profile?.seaService || [];
  const totalDaysAtSea = seaServiceRecords.reduce((acc: number, record: any) => {
    if (!record.signOn || !record.signOff) return acc;
    const start = new Date(record.signOn);
    const end = new Date(record.signOff);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return acc + (diff > 0 ? diff : 0);
  }, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            <CheckCircle className="w-3 h-3" /> Verified
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
            <AlertCircle className="w-3 h-3" /> Pending
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-red-400 bg-red-400/10 px-2.5 py-0.5 rounded-full border border-red-500/20">
            <AlertCircle className="w-3 h-3" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-400/10 px-2.5 py-0.5 rounded-full border border-slate-500/20">
            <HelpCircle className="w-3 h-3" /> Missing
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn relative pb-10">
      
      {/* Background Decorative Orbs */}
      {isDark && (
        <>
          <div className="absolute top-[-100px] left-[20%] w-[350px] h-[350px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none -z-10" />
          <div className="absolute top-[200px] right-[10%] w-[300px] h-[300px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none -z-10" />
        </>
      )}

      {/* 1. Welcome Card Banner */}
      <section className={`rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl border transition-all duration-300 ${
        isDark 
          ? "bg-gradient-to-br from-[#0b1b36] via-[#09162c] to-[#040c1a] border-slate-800/80 text-white" 
          : "bg-white border-slate-200 text-slate-900"
      }`}>
        {/* Glow Accent */}
        {isDark && (
          <div className="absolute -top-10 -right-10 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-500/10 to-indigo-500/0 blur-[80px] pointer-events-none" />
        )}
        
        <div className="grid lg:grid-cols-4 gap-8 items-center relative z-10">
          
          <div className="lg:col-span-3 space-y-5">
            <div className="space-y-2">
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                isDark ? "bg-cyan-500/10 text-cyan-400" : "bg-blue-50 text-[#3b71cb]"
              }`}>
                ⚓ System Active | Ready to Sail
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight pt-2">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{user?.name}</span>!
              </h1>
            </div>
            
            <p className={`text-sm leading-relaxed max-w-2xl ${isDark ? "text-slate-350" : "text-slate-650"}`}>
              Your digitized marine profile is actively synced with DGS records. Complete your training curriculum, verify uploaded STCW credentials, and log ship service voyages directly from your dashboard console.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/seafearer/browse-courses"
                className={`px-5 py-3 rounded-xl font-bold text-xs shadow-lg inline-flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5 ${
                  isDark 
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-cyan-500/20 hover:brightness-110" 
                    : "bg-[#3b71cb] text-white hover:bg-[#2c5fb3]"
                }`}
              >
                Browse Curriculum <Compass className="w-4.5 h-4.5" />
              </Link>
              <Link
                href="/seafearer/documents"
                className={`px-5 py-3 rounded-xl font-bold text-xs border inline-flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5 ${
                  isDark 
                    ? "border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 text-white hover:border-slate-700" 
                    : "border-slate-300 hover:bg-slate-50 text-slate-700"
                }`}
              >
                Upload Documents <FileText className="w-4.5 h-4.5" />
              </Link>
            </div>
          </div>

          {/* Profile Completion Gauge */}
          <div className="flex flex-col items-center justify-center space-y-3 lg:border-l lg:border-slate-800/60 lg:pl-8">
            <div className="relative w-28 h-28 flex items-center justify-center">
              {/* Outer Glowing Ring */}
              {isDark && (
                <div className="absolute w-24 h-24 rounded-full bg-cyan-500/10 blur-[8px]" />
              )}
              <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={isDark ? "#122540" : "#e2e8f0"}
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={isDark ? "#06b6d4" : "#3b71cb"}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * profileCompletion) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <span className="text-2xl font-black tracking-tight">{profileCompletion}%</span>
            </div>
            <div className="text-center">
              <h4 className="font-extrabold text-xs">Profile Verified</h4>
              <p className={`text-[10px] mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                {profileCompletion === 100 ? "All verified by DGS" : "Complete INDoS details"}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Visual Metric Widgets Row */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { 
            label: "Time at Sea", 
            value: `${totalDaysAtSea} Days`, 
            sub: `${seaServiceRecords.length} Voyages Logged`, 
            icon: Ship, 
            color: "text-cyan-400 bg-cyan-500/10" 
          },
          { 
            label: "Completed Training", 
            value: `${courses.completedCount} Courses`, 
            sub: "DGS Accredited Certificates", 
            icon: Award, 
            color: "text-emerald-400 bg-emerald-500/10" 
          },
          { 
            label: "Active Enrollment", 
            value: courses.active ? "1 Course" : "None Active", 
            sub: courses.active ? courses.active.name : "Curriculum up-to-date", 
            icon: BookOpen, 
            color: "text-indigo-400 bg-indigo-500/10" 
          },
          { 
            label: "INDoS Status", 
            value: user?.profile?.indosNumber ? "Linked" : "Not Found", 
            sub: user?.profile?.indosNumber || "Update inside profile", 
            icon: FileSignature, 
            color: "text-amber-400 bg-amber-500/10" 
          },
        ].map((stat, idx) => {
          const IconComp = stat.icon;
          return (
            <div
              key={idx}
              className={`rounded-2xl p-5 border shadow-sm transition-all duration-300 ${
                isDark ? "bg-[#09162c]/60 border-slate-800/80 text-white" : "bg-white border-slate-200 text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}>
                  <IconComp className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className={`text-[10px] font-black uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    {stat.label}
                  </p>
                  <h3 className="text-lg font-black tracking-tight mt-0.5 truncate">{stat.value}</h3>
                  <p className={`text-[9px] truncate mt-0.5 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                    {stat.sub}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* 3. Main Split Panels */}
      <section className="grid lg:grid-cols-3 gap-6">
        
        {/* Active Learning panel */}
        <div className={`rounded-3xl p-6 border shadow-lg flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${
          isDark ? "bg-[#09162c]/40 border-slate-800/80 text-white" : "bg-white border-slate-200 text-slate-900"
        }`}>
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className={`w-5 h-5 ${isDark ? "text-cyan-400" : "text-[#3b71cb]"}`} />
                <h3 className="font-extrabold text-sm uppercase tracking-wider">LMS Learning console</h3>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                courses.active ? "bg-cyan-500/10 text-cyan-400" : "bg-slate-500/10 text-slate-400"
              }`}>
                {courses.active ? "In Progress" : "Available"}
              </span>
            </div>
            
            {courses.active ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-black text-base leading-snug">{courses.active.name}</h4>
                  <p className={`text-[10px] mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    STCW Regulation Curriculum Section
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>Syllabus Mastery</span>
                    <span className="text-cyan-400">{courses.active.progress}%</span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
                      style={{ width: `${courses.active.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className={`py-6 text-center rounded-2xl border border-dashed flex flex-col items-center justify-center p-4 ${
                isDark ? "border-slate-800 bg-slate-900/20" : "border-slate-200 bg-slate-50/50"
              }`}>
                <Layers className="w-8 h-8 text-slate-500 mb-2" />
                <p className="text-xs font-semibold text-slate-400">No Active Course Enrollment</p>
                <p className="text-[10px] text-slate-500 mt-1 max-w-[200px] leading-relaxed">
                  Start or book safety modules to maintain certificate compliance.
                </p>
              </div>
            )}
          </div>
          
          <div className="pt-5 border-t border-slate-800/40 mt-6">
            <Link
              href={courses.active ? "/seafearer/my-courses" : "/seafearer/browse-courses"}
              className={`font-black text-xs tracking-wider inline-flex items-center gap-1.5 hover:translate-x-1 transition-transform group ${
                isDark ? "text-cyan-400" : "text-[#3b71cb]"
              }`}
            >
              {courses.active ? "Continue Learning" : "Browse Courses"} 
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Credentials Checklist panel */}
        <div className={`rounded-3xl p-6 border shadow-lg flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${
          isDark ? "bg-[#09162c]/40 border-slate-800/80 text-white" : "bg-white border-slate-200 text-slate-900"
        }`}>
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="font-extrabold text-sm uppercase tracking-wider">Document Registry</h3>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                isDark ? "bg-amber-500/10 text-amber-400" : "bg-amber-50 text-amber-600"
              }`}>
                Safety Audit
              </span>
            </div>
            
            <div className="space-y-3.5">
              {[
                { label: "Passport Check", status: certificates.passport },
                { label: "CDC Document", status: certificates.cdc },
                { label: "Medical Certificate", status: certificates.medical },
                { label: "STCW Validation", status: certificates.stcw },
              ].map((cert) => (
                <div key={cert.label} className="flex justify-between items-center py-1 border-b border-slate-800/10 last:border-b-0">
                  <span className="text-xs font-bold">{cert.label}</span>
                  {getStatusBadge(cert.status)}
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-5 border-t border-slate-800/40 mt-6">
            <Link
              href="/seafearer/documents"
              className={`font-black text-xs tracking-wider inline-flex items-center gap-1.5 hover:translate-x-1 transition-transform group ${
                isDark ? "text-cyan-400" : "text-[#3b71cb]"
              }`}
            >
              Verify Credentials 
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Recent Feeds and Notifications panel */}
        <div className={`rounded-3xl p-6 border shadow-lg flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${
          isDark ? "bg-[#09162c]/40 border-slate-800/80 text-white" : "bg-white border-slate-200 text-slate-900"
        }`}>
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-indigo-400" />
                <h3 className="font-extrabold text-sm uppercase tracking-wider">Feeds & Notices</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Live</span>
              </div>
            </div>
            
            <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
              {notifications.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500">
                  No notifications recorded.
                </div>
              ) : (
                notifications.slice(0, 3).map((item: any) => (
                  <div key={item.id} className={`p-3 rounded-xl border transition-colors ${
                    isDark ? "bg-[#0f1f3a]/30 border-slate-800/50 hover:bg-[#0f1f3a]/60" : "bg-slate-50/50 border-slate-200 hover:bg-slate-50"
                  }`}>
                    <h4 className="font-bold text-xs truncate text-cyan-400">{item.title}</h4>
                    <p className={`text-[10px] leading-relaxed mt-1 line-clamp-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      {item.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="pt-5 border-t border-slate-800/40 mt-6">
            <button
              onClick={() => {
                alert("Click the notification bell icon in the top navigation bar to access the full read operations list!");
              }}
              className={`font-black text-xs tracking-wider inline-flex items-center gap-1.5 hover:translate-x-1 transition-transform group text-left cursor-pointer ${
                isDark ? "text-cyan-400" : "text-[#3b71cb]"
              }`}
            >
              See All Feeds 
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

      </section>

      {/* 4. Quick Actions Grid */}
      <section className="space-y-5 pt-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-black tracking-tight">Vessel & Training Action Centers</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Book Courses", href: "/seafearer/browse-courses", icon: Compass, desc: "Curriculum booking registry" },
            { label: "Upload Documents", href: "/seafearer/documents", icon: FileText, desc: "Upload and verify credentials" },
            { label: "Seafarer profile", href: "/seafearer/profile", icon: User, desc: "Modify INDoS info" },
            { label: "Vessel Sign-On Logs", href: "/seafearer/profile", icon: FileSignature, desc: "Log active ship signs" },
          ].map((act, idx) => {
            const IconComp = act.icon;
            return (
              <Link
                key={idx}
                href={act.href}
                className={`p-5 rounded-2xl border shadow-sm group hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ${
                  isDark 
                    ? "bg-[#09162c]/30 border-slate-800/80 hover:border-cyan-500/30 text-white" 
                    : "bg-white border-slate-200 hover:border-[#3b71cb]/30 text-slate-900"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:rotate-6 ${
                  isDark ? "bg-cyan-500/10 text-cyan-400" : "bg-blue-50 text-[#3b71cb]"
                }`}>
                  <IconComp className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-sm tracking-tight">{act.label}</h4>
                <p className={`text-[10px] mt-1.5 leading-normal ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  {act.desc}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
      
    </div>
  );
}
