"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/features/layout/components/Navbar";
import Footer from "./footer";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div className="min-h-screen flex flex-col bg-[#020b14]">
      <Navbar />

      <main className={`flex-grow ${isHome ? "" : "pt-[72px] lg:pt-[80px]"}`}>
        {children}
      </main>

      <Footer />
    </div>
  );
}