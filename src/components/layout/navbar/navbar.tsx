"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/providers/theme-provider";
import { Sun, Moon, Menu, X } from "lucide-react";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const isDark = theme === "dark";
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Monitor scroll distance to toggle background styles
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine header classes dynamically
  const headerBgClass = isHome
    ? scrolled
      ? isDark
        ? "bg-[#020b14]/80 backdrop-blur-md border-gray-800/30 shadow-lg"
        : "bg-white/80 backdrop-blur-md border-slate-200/60 shadow-sm"
      : "bg-transparent border-transparent shadow-none"
    : isDark
    ? "bg-[#020b14]/90 backdrop-blur-md border-gray-800/30 shadow-sm"
    : "bg-white/90 backdrop-blur-md border-slate-200/60 shadow-sm";

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${headerBgClass}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.jpeg"
            alt="Hari Om Thalassic"
            width={40}
            height={40}
            className="rounded-full border border-white/10"
          />
          <div>
            <h2 className={`font-black text-sm tracking-wider uppercase transition-colors ${
              isDark ? "text-white" : "text-slate-800"
            }`}>
              Hari Om Thalassic
            </h2>
            <p className={`text-[10px] tracking-wide uppercase font-bold transition-colors ${
              isDark ? "text-cyan-400" : "text-blue-600"
            }`}>
              Maritime Career Partners
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: "Home", href: "/" },
            { label: "Courses", href: "/courses" },
            { label: "Placements", href: "/placements" },
            { label: "About", href: "/about" },
          ].map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`text-xs uppercase tracking-wider font-extrabold transition-colors relative py-1 ${
                  isActive
                    ? isDark ? "text-cyan-400" : "text-blue-600"
                    : isDark ? "text-gray-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className={`absolute bottom-0 left-0 w-full h-[2px] rounded-full ${
                    isDark ? "bg-cyan-400" : "bg-blue-600"
                  }`} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Buttons & Theme Switcher */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-all cursor-pointer shadow-sm flex items-center justify-center ${
              isDark 
                ? "bg-white/5 hover:bg-white/10 border-white/10 text-white" 
                : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700"
            }`}
            aria-label="Toggle theme mode"
          >
            {isDark ? (
              <Moon className="w-4 h-4 text-cyan-400 stroke-[2.5]" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500 stroke-[2.5]" />
            )}
          </button>

          <span className={`w-[1px] h-5 ${isDark ? "bg-white/10" : "bg-slate-200"}`} />

          <Link
            href="/login"
            className={`px-4 py-2 text-xs font-black rounded-lg tracking-wider uppercase transition-all duration-200 border ${
              isDark
                ? "border-cyan-500/20 text-cyan-300 bg-cyan-950/20 hover:bg-cyan-950/40"
                : "border-blue-200 text-blue-600 bg-blue-50/50 hover:bg-blue-50"
            }`}
          >
            Login
          </Link>

          <Link
            href="/register"
            className={`px-4 py-2 text-xs font-black rounded-lg tracking-wider uppercase transition-all duration-200 ${
              isDark
                ? "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white"
                : "bg-blue-600 hover:bg-blue-500 text-white"
            }`}
          >
            Register
          </Link>
        </div>

        {/* Mobile Menu Action Icon */}
        <div className="flex items-center gap-3 md:hidden">
          {/* Mobile Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg border flex items-center justify-center ${
              isDark ? "border-white/10 text-white" : "border-slate-200 text-slate-700"
            }`}
          >
            {isDark ? <Sun className="w-4 h-4 text-yellow-300" /> : <Moon className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-lg border ${
              isDark ? "border-white/10 text-white" : "border-slate-200 text-slate-700"
            }`}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Panel */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-t py-4 px-6 space-y-4 transition-all ${
          isDark ? "bg-[#020b14] border-gray-800/30 text-white" : "bg-white border-slate-200/80 text-slate-800"
        }`}>
          <nav className="flex flex-col gap-3.5">
            {[
              { label: "Home", href: "/" },
              { label: "Courses", href: "/courses" },
              { label: "Placements", href: "/placements" },
              { label: "About", href: "/about" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-xs uppercase tracking-wider font-extrabold ${
                  pathname === item.href
                    ? isDark ? "text-cyan-400" : "text-blue-600"
                    : isDark ? "text-gray-300" : "text-slate-600"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="h-[1px] bg-gray-800/10 w-full" />

          <div className="flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg text-xs font-black border border-white/10"
            >
              Login
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg text-xs font-black bg-blue-600 text-white"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}