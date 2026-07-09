"use client";

import React from "react";
import MasterSidebar from "@/components/master/sidebar";
import MasterTopbar from "@/components/master/topbar";
import { useTheme } from "@/providers/theme-provider";

export default function MasterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`flex h-screen ${isDark ? "bg-[#031525]" : "bg-slate-50"}`}>
      {/* Sidebar */}
      <MasterSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <MasterTopbar />

        {/* Page Content */}
        <main
          className={`flex-1 overflow-y-auto ${
            isDark ? "bg-[#031525]" : "bg-slate-50"
          }`}
        >
          <div className="p-6 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

