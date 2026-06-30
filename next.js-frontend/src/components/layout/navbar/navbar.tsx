"use client";

import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0A2540] shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">

          <Image
            src="/logo.jpeg"
            alt="Hari Om Thalassic"
            width={50}
            height={50}
            className="rounded-full"
          />

          <div>
            <h2 className="text-white font-bold text-lg">
              Hari Om Thalassic
            </h2>

            <p className="text-gray-300 text-sm">
              Maritime Career Partners
            </p>
          </div>

        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">

          <Link
            href="/"
            className="text-white hover:text-cyan-400 transition"
          >
            Home
          </Link>

          <Link
            href="/courses"
            className="text-white hover:text-cyan-400 transition"
          >
            Courses
          </Link>

          <Link
            href="/placements"
            className="text-white hover:text-cyan-400 transition"
          >
            Placements
          </Link>

          <Link
            href="/about"
            className="text-white hover:text-cyan-400 transition"
          >
            About
          </Link>

        </nav>

        {/* Buttons */}
        <div className="hidden md:flex gap-4">

          <Link
            href="/login"
            className="px-5 py-2 border border-white rounded-lg text-white hover:bg-white hover:text-[#0A2540] transition"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="px-5 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition"
          >
            Register
          </Link>

        </div>

      </div>
    </header>
  );
}