"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/navbar/navbar";
import Footer from "./footer";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500 bg-white dark:bg-[#020b14]">
      <Navbar />

      <main className="flex-grow">
        {children}
      </main>

      <Footer />
    </div>
  );
}