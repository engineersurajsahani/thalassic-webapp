"use client";

import React, { useEffect, useState } from "react";
import AgentAdminSidebar from "@/components/agent-admin/sidebar";
import AgentAdminTopbar from "@/components/agent-admin/topbar";
import { useTheme } from "@/providers/theme-provider";

export default function AgentAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const themeClasses = mounted && !isDark ? "bg-[#FAFAFA] text-[#111827]" : "bg-[#050a14] text-white";
  const isDarkActive = mounted ? isDark : true;

  return (
    <div className={`flex h-screen relative overflow-hidden font-outfit ${themeClasses}`}>
      {/* Decorative Background Elements */}
      <div className={`absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[120px] pointer-events-none transition-all duration-1000 ${
        isDarkActive ? "bg-[#3D5EF6]/10" : "bg-[#3D5EF6]/5"
      }`} />
      <div className={`absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[100px] pointer-events-none transition-all duration-1000 ${
        isDarkActive ? "bg-[#3D5EF6]/10" : "bg-[#3D5EF6]/5"
      }`} />

      {/* Sidebar */}
      <AgentAdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Topbar */}
        <AgentAdminTopbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-6 w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
