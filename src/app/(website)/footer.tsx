import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#020e1a] border-t border-gray-800 text-gray-400 font-sans w-full">
      <div className="max-w-7xl mx-auto px-6 py-6">
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* Brand & Mission Column */}
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-white tracking-tight">
              Hari Om Thalassic
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed max-w-xs">
              Digitizing maritime training pathways for seafarers worldwide.
            </p>
          </div>

          {/* Dynamic Featured Courses Links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">
              Featured Courses
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/courses" className="hover:text-blue-400 transition-colors">Pre-Sea Training</Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-blue-400 transition-colors">STCW Courses</Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-blue-400 transition-colors">Post-Sea Courses</Link>
              </li>
            </ul>
          </div>

          {/* Connect & Contact Column */}
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">
                Connect With Us
              </h4>
              
              {/* Social Media Links */}
              <div className="flex space-x-3 mb-2">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="LinkedIn">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Twitter">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Contact Parameters */}
            <div className="text-xs space-y-0.5 border-t border-gray-800/60 pt-2">
              <p className="text-gray-300 font-medium">Contact Details</p>
              <p className="text-gray-400">Email: support@hariomthalassic.com</p>
              <p className="text-gray-400">Phone: +91 XXXXX XXXXX</p>
            </div>

            {/* Legal Links */}
            <div className="flex space-x-4 text-xs pt-1">
              <Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-blue-400 transition-colors">Terms & Conditions</Link>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}