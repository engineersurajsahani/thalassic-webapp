"use client";

import Link from "next/link";
import { Briefcase, Building2, FileText, ArrowRight } from "lucide-react";

export default function PlacementsPage() {
  return (
    <section className="min-h-screen bg-[#041827] text-white">
      <div className="max-w-7xl mx-auto px-6 py-24">

        <div className="text-center">

          <span className="inline-block px-4 py-2 rounded-full bg-blue-600/20 text-blue-400 text-sm font-semibold">
            🚧 Work In Progress
          </span>

          <h1 className="mt-8 text-5xl font-black">
            Placements <span className="text-blue-500">Coming Soon</span>
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-slate-400 leading-8">
            We're building a dedicated placement portal where maritime
            professionals can connect with leading shipping companies,
            explore opportunities, and apply for verified jobs.
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-20">

          <div className="rounded-2xl bg-[#071f33] border border-gray-800 p-8 hover:border-blue-500 transition">
            <Building2 className="w-10 h-10 text-blue-500 mb-5" />
            <h3 className="text-xl font-bold mb-3">Company Hiring</h3>
            <p className="text-slate-400">
              Discover verified placement opportunities from trusted maritime companies.
            </p>
          </div>

          <div className="rounded-2xl bg-[#071f33] border border-gray-800 p-8 hover:border-blue-500 transition">
            <FileText className="w-10 h-10 text-blue-500 mb-5" />
            <h3 className="text-xl font-bold mb-3">Resume Builder</h3>
            <p className="text-slate-400">
              Build a professional resume tailored for maritime careers.
            </p>
          </div>

          <div className="rounded-2xl bg-[#071f33] border border-gray-800 p-8 hover:border-blue-500 transition">
            <Briefcase className="w-10 h-10 text-blue-500 mb-5" />
            <h3 className="text-xl font-bold mb-3">Job Applications</h3>
            <p className="text-slate-400">
              Apply to shipping companies directly through our upcoming portal.
            </p>
          </div>

        </div>

        <div className="flex justify-center mt-16">
          <Link
            href="/courses"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-xl font-semibold transition"
          >
            Explore Courses
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </section>
  );
}