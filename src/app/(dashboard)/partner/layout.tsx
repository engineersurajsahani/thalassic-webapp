"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AgentSidebar from "@/components/agent/sidebar";
import AgentTopbar from "@/components/agent/topbar";
import { useTheme } from "@/providers/theme-provider";

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isOnboarding = pathname === "/partner/onboarding" || pathname === "/agent/onboarding";

  if (isOnboarding) {
    const onboardingBg = mounted && !isDark ? "bg-[#FAFAFA]" : "bg-[#0B0F19]";
    return (
      <div className={`min-h-screen flex flex-col ${onboardingBg}`}>
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-4xl">{children}</div>
        </main>
      </div>
    );
  }

  const themeClasses = mounted && !isDark ? "bg-[#FAFAFA] text-[#111827]" : "bg-[#050a14] text-white";
  const isDarkActive = mounted ? isDark : true;

  return (
    <div className={`flex h-screen relative overflow-hidden font-outfit ${themeClasses}`}>
      {/* Decorative Background Glows */}
      <div
        className={`absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[120px] pointer-events-none transition-all duration-1000 ${
          isDarkActive ? "bg-[#3D5EF6]/10" : "bg-[#3D5EF6]/5"
        }`}
      />
      <div
        className={`absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[100px] pointer-events-none transition-all duration-1000 ${
          isDarkActive ? "bg-[#3D5EF6]/10" : "bg-[#3D5EF6]/5"
        }`}
      />

      {/* Sidebar */}
      <AgentSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Topbar */}
        <AgentTopbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-6 w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
