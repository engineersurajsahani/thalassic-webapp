"use client";

import React, { useEffect } from "react";
import SeafarerSidebar from "@/components/seafarer/sidebar";
import SeafarerTopbar from "@/components/seafarer/topbar";
import { useAuth } from "@/providers/auth-provider";
import { useTheme } from "@/providers/theme-provider";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const isDark = theme === "dark";

  useEffect(() => {
    const role = user?.role?.toLowerCase();
    if (!isLoading && (!user || (role !== "seafarer" && role !== "seafarer"))) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className={`w-screen h-screen flex flex-col items-center justify-center transition-colors duration-500 ${
        isDark ? "bg-[#031525]" : "bg-slate-50"
      }`}>
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 animate-pulse" />
          <div className="absolute inset-0 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin" />
        </div>
        <p className={`mt-4 text-xs font-bold uppercase tracking-wider animate-pulse ${
          isDark ? "text-cyan-400" : "text-[#3b71cb]"
        }`}>
          Loading Seafarer Console...
        </p>
      </div>
    );
  }

  // Fallback check (although middleware handles route guarding)
  const role = user?.role?.toLowerCase();
  if (!user || (role !== "seafarer" && role !== "seafarer")) {
    return null;
  }

  return (
    <div className={`flex w-screen h-screen overflow-hidden transition-colors duration-300 ${
      isDark ? "bg-[#031525]" : "bg-slate-50"
    }`}>
      {/* Desktop Sidebar */}
      <SeafarerSidebar />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Portal top bar */}
        <SeafarerTopbar />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
