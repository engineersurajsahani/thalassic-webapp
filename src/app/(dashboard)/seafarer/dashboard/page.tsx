"use client";
import toast from 'react-hot-toast';

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
  FileSignature,
  Ship,
  Calendar,
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

  const getDocumentStatus = (status: string) => {
    switch (status?.toLowerCase()) {
      case "verified":
        return {
          label: "Verified",
          textColor: isDark ? "text-emerald-400" : "text-emerald-600",
        };
      case "pending":
        return {
          label: "Pending Verification",
          textColor: isDark ? "text-amber-400" : "text-amber-600",
        };
      case "rejected":
        return {
          label: "Rejected",
          textColor: isDark ? "text-rose-400" : "text-rose-600",
        };
      case "missing":
      default:
        return {
          label: "Document Not Uploaded",
          textColor: isDark ? "text-slate-400" : "text-slate-500",
        };
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
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{user?.name}</span>!
              </h1>
            </div>
            
            <p className={`text-sm leading-relaxed max-w-2xl ${isDark ? "text-slate-350" : "text-slate-650"}`}>
              Your digitized marine profile is actively synced with DGS records. Complete your training curriculum, verify uploaded STCW credentials, and log ship service voyages directly from your dashboard console.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/seafarer/browse-courses"
                className={`px-5 py-3 rounded-xl font-bold text-xs shadow-lg inline-flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5 ${
                  isDark 
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-cyan-500/20 hover:brightness-110" 
                    : "bg-[#3b71cb] text-white hover:bg-[#2c5fb3]"
                }`}
              >
                Browse Curriculum <Compass className="w-4.5 h-4.5" />
              </Link>
              <Link
                href="/seafarer/documents"
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
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
        {[
          { 
            label: "Time at Sea", 
            value: `${totalDaysAtSea} Days`, 
            icon: Ship, 
            color: "text-cyan-400 bg-cyan-500/10" 
          },
          { 
            label: "Completed Training", 
            value: `${courses.completedCount || 0} Courses`, 
            icon: Award, 
            color: "text-emerald-400 bg-emerald-500/10" 
          },
          { 
            label: "Ongoing Physical Training", 
            value: courses.active ? "1 Active Course" : `${courses.ongoingCount || 0} Ongoing`, 
            icon: BookOpen, 
            color: "text-indigo-400 bg-indigo-500/10" 
          },
          { 
            label: "Status / On Hold", 
            value: (courses.onHold || (courses.onHoldCount && courses.onHoldCount > 0) || dashboardData?.userStatus === "On Hold") ? "On Hold" : "Active / Verified", 
            icon: (courses.onHold || (courses.onHoldCount && courses.onHoldCount > 0)) ? AlertCircle : FileSignature, 
            color: (courses.onHold || (courses.onHoldCount && courses.onHoldCount > 0)) ? "text-amber-400 bg-amber-500/10" : "text-cyan-400 bg-cyan-500/10" 
          },
        ].map((stat, idx) => {
          const IconComp = stat.icon;
          return (
            <div
              key={idx}
              className={`rounded-2xl py-3.5 px-4 border shadow-sm flex items-center transition-all duration-300 hover:shadow-md ${
                isDark ? "bg-[#09162c]/60 border-slate-800/80 text-white" : "bg-white border-slate-200 text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 w-full">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}>
                  <IconComp className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`uppercase tracking-wider truncate ${
                    stat.label === "Time at Sea"
                      ? `text-[10px] font-black ${isDark ? "text-cyan-400" : "text-[#1e429f]"}`
                      : `text-[10px] font-black ${isDark ? "text-slate-400" : "text-slate-500"}`
                  }`}>
                    {stat.label}
                  </p>
                  <h3 className="text-base md:text-lg font-black tracking-tight mt-0.5 truncate">{stat.value}</h3>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* 3. Main Split Panels */}
      <section className="grid lg:grid-cols-2 gap-6">
        
        {/* Credentials Checklist panel */}
        <div className={`rounded-3xl p-6 border shadow-lg flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${
          isDark ? "bg-[#09162c]/40 border-slate-800/80 text-white" : "bg-white border-slate-200 text-slate-900"
        }`}>
          <div className="space-y-5">
            <div className={`flex items-center justify-between border-b ${isDark ? "border-slate-800/80" : "border-slate-200"} pb-3`}>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="font-extrabold text-sm uppercase tracking-wider">Document Registry</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span className={`text-[9px] font-black uppercase tracking-wider ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}>
                  Safety Audit
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              {[
                { label: "Passport Check", status: certificates.passport },
                { label: "CDC Document", status: certificates.cdc },
                { label: "Medical Certificate", status: certificates.medical },
                { label: "STCW Validation", status: certificates.stcw },
              ].map((cert) => {
                const docStatus = getDocumentStatus(cert.status);
                return (
                  <Link
                    key={cert.label}
                    href="/seafarer/documents"
                    className={`group flex items-center justify-between px-4 py-3 rounded-2xl border transition-all duration-200 ${
                      isDark
                        ? "bg-[#0b1b36]/40 border-slate-800/80 hover:bg-[#0f2244]/70 hover:border-slate-700/80 shadow-xs"
                        : "bg-slate-50/70 border-slate-200/80 hover:bg-slate-100/80 hover:border-slate-300 shadow-xs"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isDark
                            ? "bg-slate-800/70 text-slate-300 group-hover:text-cyan-400 group-hover:bg-slate-800"
                            : "bg-white text-slate-500 border border-slate-200/90 group-hover:text-[#3b71cb] group-hover:border-slate-300 shadow-xs"
                        }`}
                      >
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4
                          className={`text-xs font-bold truncate leading-snug ${
                            isDark ? "text-slate-100 group-hover:text-white" : "text-slate-900 group-hover:text-slate-950"
                          }`}
                        >
                          {cert.label}
                        </h4>
                        <p
                          className={`text-[11px] font-medium leading-none mt-1 ${
                            isDark ? "text-slate-400" : "text-slate-500"
                          }`}
                        >
                          Required document
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 ml-3">
                      <span className={`text-xs font-medium tracking-normal ${docStatus.textColor}`}>
                        {docStatus.label}
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 shrink-0 ${
                          isDark ? "text-slate-500 group-hover:text-slate-300" : "text-slate-400 group-hover:text-slate-600"
                        }`}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className={`pt-5 border-t ${isDark ? "border-slate-800/40" : "border-slate-200"} mt-6`}>
            <Link
              href="/seafarer/documents"
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
            <div className={`flex items-center justify-between border-b ${isDark ? "border-slate-800/80" : "border-slate-200"} pb-3`}>
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
                toast("Click the notification bell icon in the top navigation bar to access the full read operations list!");
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
            { label: "Book Courses", href: "/seafarer/browse-courses", icon: Compass, desc: "Curriculum booking registry" },
            { label: "Upload Documents", href: "/seafarer/documents", icon: FileText, desc: "Upload and verify credentials" },
            { label: "Seafarer profile", href: "/seafarer/profile", icon: User, desc: "Modify INDoS info" },
            { label: "Vessel Sign-On Logs", href: "/seafarer/profile?tab=sea-service", icon: FileSignature, desc: "Log active ship signs" },
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
