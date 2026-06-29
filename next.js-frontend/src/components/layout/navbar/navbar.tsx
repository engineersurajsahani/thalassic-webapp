"use client";

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="site-header">
      <div className="container header-inner">

        {/* Logo */}
        <Link href="/" className="brand">
          <Image
         src="/logo.jpeg"
         alt="Hari Om Thalassic"
         width={50}
         height={50}
         className="brand-logo"
         />

          <div className="brand-copy">
            <span className="brand-name">
              Hari Om Thalassic
            </span>

            <span className="brand-tag">
              Maritime Career Partners
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="site-nav">
          <Link href="/">Home</Link>
          <Link href="/courses">Courses</Link>
          <Link href="/placements">Placements</Link>
          <Link href="/about">About</Link>
        </nav>

        {/* Buttons */}
        <div className="header-actions">
          <Link href="/login" className="button button-secondary">
            Login
          </Link>

          <Link href="/register" className="button">
            Register
          </Link>
        </div>

      </div>
    </header>
  );
}