"use client";

import React, { useState } from "react";
import CompanyAdminSidebar from "@/components/company-admin/sidebar";
import CompanyAdminTopbar from "@/components/company-admin/topbar";
import { useTheme } from "@/providers/theme-provider";

export default function CompanyAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`flex h-screen ${isDark ? "bg-[#031525]" : "bg-slate-50"}`}>
      {/* Sidebar */}
      <CompanyAdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar Header */}
        <CompanyAdminTopbar onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Page Content Scroll Container */}
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
