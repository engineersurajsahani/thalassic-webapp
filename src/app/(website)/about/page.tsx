import React from 'react';
import Link from 'next/link';

export default function AboutUsPage() {
  return (
    <div className="bg-[#031525] text-white min-h-screen font-sans">
      
      {/* Hero Header Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-16 text-center md:text-left">
        <span className="inline-block px-4 py-1.5 bg-blue-600/20 text-blue-400 rounded-full text-xs font-semibold tracking-wide uppercase mb-4 border border-blue-500/30">
          About Our Platform
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Hari Om Thalassic
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed">
          Hari Om Thalassic is a web-based maritime training platform designed to simplify how seafarers discover, purchase, and manage professional maritime training courses. We provide a centralized digital experience for seafarers while enabling efficient operational management through dedicated administrative dashboards.
        </p>
      </section>

      <hr className="border-gray-800 max-w-7xl mx-auto px-6" />

      {/* Vision & Mission Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-8">
        {/* Vision Card */}
        <div className="bg-[#071f33] border border-gray-800 rounded-2xl p-8 shadow-xl hover:border-blue-500/40 transition-all duration-300">
          <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center mb-6 border border-blue-500/20">
            {/* Eye Icon SVG */}
            <svg className="w-6 h-6 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-white">Product Vision</h2>
          <p className="text-gray-300 leading-relaxed">
            To become a trusted digital platform for maritime training by providing seafarers with a simple, secure, and professional experience while enabling efficient operational management for the organization.
          </p>
        </div>

        {/* Mission Card */}
        <div className="bg-[#071f33] border border-gray-800 rounded-2xl p-8 shadow-xl hover:border-blue-500/40 transition-all duration-300">
          <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center mb-6 border border-blue-500/20">
            {/* Target Icon SVG */}
            <svg className="w-6 h-6 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-white">Our Mission</h2>
          <p className="text-gray-300 leading-relaxed">
            The current training process relies heavily on manual interactions for registrations, course enrollment, document handling, and operational management. Hari Om Thalassic aims to completely digitize these legacy processes through a unified platform that delivers a seamless experience for both seafarers and internal staff, eliminating bottlenecks and maximizing administrative scalability.
          </p>
        </div>
      </section>

      {/* Maritime Training Experience Highlight */}
      <section className="bg-[#051a2c] py-16 border-y border-gray-800/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                {/* Anchor Icon SVG */}
                <svg className="w-7 h-7 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 5V19M5 12H19M12 5a3 3 0 110-6 3 3 0 010 6Z" />
                </svg> 
                Maritime Training Experience
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Built with deep industry alignment, our platform transforms high-friction, traditional administrative operations into modern workflow pipelines. By bridging the gap between rigorous merchant navy training demands and streamlined digital tools, we offer unrivaled efficiency for professional development at sea.
              </p>
            </div>
            <div className="bg-[#0a263f] p-6 rounded-xl border border-gray-800 text-center">
              {/* Award Icon SVG */}
              <svg className="w-10 h-10 text-yellow-500 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0Z" />
              </svg>
              <div className="text-3xl font-bold text-white mb-1">100% Digital</div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">No More Manual Enrollment Hurdles</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info & Responsive Contacts */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-br from-[#071f33] to-[#041727] rounded-2xl p-8 border border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Ready to advance your maritime career?</h3>
            <p className="text-sm text-gray-400">Explore authenticated professional courses managed flawlessly by our Master dashboard tracking systems.</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Link href="/courses" className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-center text-sm font-semibold rounded-lg transition-all shadow-md">
              Browse Courses
            </Link>
            <Link href="/contact" className="w-full md:w-auto px-6 py-3 bg-gray-800 hover:bg-gray-700 text-center text-sm font-semibold rounded-lg transition-all border border-gray-700">
              Contact Support
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}