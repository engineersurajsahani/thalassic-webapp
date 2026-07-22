"use client";

import React from "react";
import { usePathname } from "next/navigation";
import AgentSidebar from "@/components/agent/sidebar";
import AgentTopbar from "@/components/agent/topbar";
import { useTheme } from "@/providers/theme-provider";

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const pathname = usePathname();

  const isOnboarding = pathname === "/agent/onboarding";

  if (isOnboarding) {
    return (
      <div className={`min-h-screen flex flex-col ${isDark ? "bg-[#031525]" : "bg-slate-50"}`}>
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-4xl">{children}</div>
        </main>
      </div>
    );
  }

  return (
    <div className={`flex h-screen relative overflow-hidden font-outfit ${isDark ? "bg-[#050a14] text-white" : "bg-[#f8fafc] text-slate-900"}`}>
      {/* Decorative Background Elements */}
      <div className={`absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[120px] pointer-events-none transition-all duration-1000 ${
        isDark ? "bg-blue-500/10" : "bg-blue-400/5"
      }`} />
      <div className={`absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[100px] pointer-events-none transition-all duration-1000 ${
        isDark ? "bg-sky-500/10" : "bg-cyan-400/5"
      }`} />

      {/* Sidebar */}
      <AgentSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Topbar */}
        <AgentTopbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
