"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/navbar/navbar";
import Footer from "./footer";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
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