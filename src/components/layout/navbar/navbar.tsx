"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/providers/theme-provider";
import { Sun, Moon } from "lucide-react";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const isDark = theme === "dark";

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-colors duration-500 border-b shadow-sm ${
      isDark ? "bg-[#0A2540] border-gray-800/30" : "bg-white border-slate-200/80"
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.jpeg"
            alt="Hari Om Thalassic"
            width={44}
            height={44}
            className="rounded-full border border-white/10"
          />
          <div>
            <h2 className={`font-extrabold text-sm tracking-wide transition-colors ${
              isDark ? "text-white" : "text-slate-800"
            }`}>
              Hari Om Thalassic
            </h2>
            <p className={`text-xs transition-colors ${
              isDark ? "text-gray-300" : "text-slate-500"
            }`}>
              Maritime Career Partners
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: "Home", href: "/" },
            { label: "Courses", href: "/courses" },
            { label: "Placements", href: "/placements" },
            { label: "About", href: "/about" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`text-sm font-semibold transition-colors ${
                isDark ? "text-white hover:text-cyan-400" : "text-slate-600 hover:text-blue-600"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Buttons & Theme Switcher */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-all cursor-pointer shadow-sm flex items-center justify-center ${
              isDark 
                ? "bg-white/10 hover:bg-white/20 border-white/15 text-white" 
                : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700"
            }`}
            aria-label="Toggle theme mode"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-yellow-300 stroke-[2.5]" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600 stroke-[2.5]" />
            )}
          </button>

          <div className={`w-px h-5 hidden md:block ${isDark ? "bg-white/20" : "bg-slate-200"}`} />

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className={`
                px-4 py-1.5 text-xs font-bold rounded-lg tracking-wider uppercase transition-all duration-300 border
                ${
                  isDark
                    ? pathname === "/login"
                      ? "bg-white/10 border-white/40 text-white"
                      : "border-white/20 text-white/80 hover:bg-white/5 hover:text-white"
                    : pathname === "/login"
                      ? "bg-slate-100 border-slate-350 text-slate-800"
                      : "border-slate-350 text-slate-700 hover:bg-slate-50"
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
                  isDark
                    ? pathname === "/register"
                      ? "bg-white/10 border-white/40 text-white"
                      : "border-white/20 text-white/80 hover:bg-white/5 hover:text-white"
                    : pathname === "/register"
                      ? "bg-slate-100 border-slate-350 text-slate-800"
                      : "border-slate-350 text-slate-700 hover:bg-slate-50"
                }
              `}
            >
              Register
            </Link>
          </div>
        </div>

      </div>
    </header>
  );
}