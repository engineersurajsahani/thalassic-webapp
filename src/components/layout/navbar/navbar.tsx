"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/providers/theme-provider";
import { Sun, Moon, Menu, X } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const isDark = theme === "dark";
  const isAuthPage = pathname === "/login" || pathname === "/register";

  const navRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navbar is hidden by default on homepage and revealed after the storytelling climax.
  // It is instantly visible on all other subpages.
  const [isVisible, setIsVisible] = useState(pathname !== "/");

  // Entrance & Reveal Animations
  useGSAP(() => {
    if (!navRef.current) return;

    if (pathname === "/") {
      if (isVisible) {
        // Slide down, fade in, blur sharp transition
        gsap.fromTo(
          navRef.current,
          { y: -100, opacity: 0, filter: "blur(12px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.9, ease: "power3.out" }
        );
      } else {
        // Ensure starting state is fully hidden
        gsap.set(navRef.current, { y: -100, opacity: 0, filter: "blur(12px)" });
      }
    } else {
      // Normal subpage loading slide-in
      gsap.fromTo(
        navRef.current,
        { y: -60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
    }
  }, { scope: navRef, dependencies: [isVisible, pathname] });

  // Custom Event Listener for Navbar Climax Reveal
  useEffect(() => {
    if (pathname !== "/") {
      setIsVisible(true);
      return;
    }

    const handleReveal = () => {
      setIsVisible(true);
    };

    window.addEventListener("reveal-navbar", handleReveal);
    return () => window.removeEventListener("reveal-navbar", handleReveal);
  }, [pathname]);

  // Monitor scroll distance to toggle background styles
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine header classes dynamically (Sticky Apple-style)
  const headerBgClass = isAuthPage
    ? isDark
      ? "bg-[#051124]/95 backdrop-blur-md border-b border-white/5 py-3 shadow-md"
      : "bg-white/95 backdrop-blur-md border-b border-slate-200/80 py-3 shadow-md"
    : scrolled
      ? isDark
        ? "bg-[#020b14]/80 backdrop-blur-md border-b border-gray-800/40 py-3 shadow-md"
        : "bg-white/80 backdrop-blur-md border-b border-slate-200/50 py-3 shadow-md"
      : "bg-transparent border-b border-transparent py-4.5";

  return (
    <div 
      ref={navRef} 
      className="main-nav-container fixed top-0 left-0 w-full z-50 pointer-events-none transition-all duration-300"
      style={{
        visibility: isVisible ? "visible" : "hidden",
      }}
    >
      <header
        className={`w-full transition-all duration-500 ease-out pointer-events-auto ${headerBgClass}`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.jpeg"
              alt="Hari Om Thalassic"
              width={34}
              height={34}
              className="rounded-full border border-white/10 group-hover:scale-105 transition-transform duration-300"
            />
            <div className="flex flex-col">
              <h2 className={`font-black text-xs tracking-widest uppercase transition-colors ${
                isDark ? "text-white" : "text-slate-800"
              }`}>
                Hari Om Thalassic
              </h2>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {!isAuthPage && (
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
                    className={`text-xs uppercase tracking-widest font-bold transition-all relative py-1 ${
                      isActive
                        ? isDark ? "text-white" : "text-slate-900"
                        : isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                        isDark ? "bg-white" : "bg-slate-900"
                      }`} />
                    )}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Desktop Buttons & Theme Switcher */}
          <div className="hidden md:flex items-center gap-6">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`transition-colors cursor-pointer flex items-center justify-center ${
                isDark ? "text-slate-400 hover:text-white" : "text-slate-400 hover:text-slate-900"
              }`}
              aria-label="Toggle theme mode"
            >
              {isDark ? <Sun className="w-4 h-4 stroke-[2]" /> : <Moon className="w-4 h-4 stroke-[2]" />}
            </button>

            <div className={`w-[1px] h-4 ${isDark ? "bg-white/10" : "bg-slate-200"}`} />

            {isAuthPage ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className={`text-xs font-bold tracking-widest uppercase transition-colors px-3 py-1.5 ${
                    isDark ? "text-slate-350 hover:text-white" : "text-slate-550 hover:text-slate-900"
                  }`}
                >
                  Home
                </Link>

                <Link
                  href="/login"
                  className={`
                    px-4 py-1.5 text-xs font-bold rounded-lg tracking-wider uppercase transition-all duration-300 border
                    ${
                      pathname === "/login"
                        ? isDark ? "bg-white/10 border-white/40 text-white" : "bg-slate-100 border-slate-350 text-slate-800 shadow-sm"
                        : isDark ? "border-transparent text-slate-400 hover:text-white" : "border-transparent text-slate-500 hover:text-slate-950"
                    }
                  `}
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className={`
                    px-4 py-1.5 text-xs font-bold rounded-lg tracking-wider uppercase transition-all duration-300 border
                    ${
                      pathname === "/register"
                        ? isDark ? "bg-white/10 border-white/40 text-white" : "bg-slate-100 border-slate-350 text-slate-800 shadow-sm"
                        : isDark ? "border-transparent text-slate-400 hover:text-white" : "border-transparent text-slate-500 hover:text-slate-950"
                    }
                  `}
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-5">
                <Link
                  href="/login"
                  className={`text-xs font-bold tracking-widest uppercase transition-colors ${
                    isDark ? "text-slate-300 hover:text-white" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Login
                </Link>

                <Link
                  href="/courses"
                  className={`px-5 py-2 text-xs font-bold rounded-lg tracking-widest uppercase transition-all duration-300 ${
                    isDark
                      ? "bg-white text-black hover:bg-gray-200 hover:scale-[1.03]"
                      : "bg-black text-white hover:bg-gray-800 hover:scale-[1.03]"
                  }`}
                >
                  Begin Journey
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Action Icon */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={toggleTheme}
              className={`flex items-center justify-center ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-1.5 rounded-full border ${isDark ? "border-white/10 text-white" : "border-slate-200 text-slate-800"}`}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Mobile Drawer Panel */}
        {mobileMenuOpen && (
          <div className={`md:hidden mt-4 pt-4 pb-4 px-6 border-t space-y-5 transition-all ${
            isDark ? "border-white/10 text-white bg-[#020b14]" : "border-slate-200/80 text-slate-800 bg-white"
          }`}>
            <nav className="flex flex-col gap-4">
              {isAuthPage ? (
                [
                  { label: "Home", href: "/" },
                  { label: "Login", href: "/login" },
                  { label: "Register", href: "/register" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-xs uppercase tracking-widest font-bold ${
                      pathname === item.href
                        ? isDark ? "text-white" : "text-slate-900"
                        : isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))
              ) : (
                [
                  { label: "Home", href: "/" },
                  { label: "Courses", href: "/courses" },
                  { label: "Placements", href: "/placements" },
                  { label: "About", href: "/about" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-xs uppercase tracking-widest font-bold ${
                      pathname === item.href
                        ? isDark ? "text-white" : "text-slate-900"
                        : isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))
              )}
            </nav>
            
            {!isAuthPage && (
              <>
                <div className="h-[1px] bg-white/10 w-full" />

                <div className="flex flex-col gap-3 pb-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full text-center py-3 rounded-lg text-xs font-bold tracking-widest uppercase border ${
                      isDark ? "border-white/20 text-white" : "border-slate-200 text-slate-800"
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    href="/courses"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full text-center py-3 rounded-lg text-xs font-bold tracking-widest uppercase ${
                      isDark ? "bg-white text-black" : "bg-black text-white"
                    }`}
                  >
                    Begin Journey
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </header>
    </div>
  );
}