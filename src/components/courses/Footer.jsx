import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[#243F42] via-[#1A2E31] to-[#0F1C1E] text-white">
      <div className="max-w-7xl mx-auto px-8">
        {/* Main Footer Content */}
        <div className="py-20">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12 lg:gap-16">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 mr-6 flex-shrink-0">
                  <img 
                    src="/logo.png" 
                    alt="Hari Om Thalassic Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-2xl font-bold text-white font-josefin leading-tight">Hari Om Thalassic</h3>
                  <p className="text-[#64B5F6] text-base font-medium mt-1">Maritime Training Institute</p>
                </div>
              </div>
              <p className="text-white/80 leading-relaxed text-sm max-w-sm">
                Professional maritime education and training services approved by DGS India. Building careers at sea since 2009.
              </p>
              <div className="flex space-x-4 mt-6">
                <div className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center cursor-pointer transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="white"/>
                  </svg>
                </div>
                <div className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center cursor-pointer transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" fill="white"/>
                  </svg>
                </div>
                <div className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center cursor-pointer transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z" fill="white"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6 font-josefin">Quick Links</h4>
              <div className="space-y-3">
                {[
                  { 
                    name: 'Training Courses', 
                    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" fill="white"/>
                    </svg>
                  },
                  { 
                    name: 'Sea Service', 
                    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.32-.42-.58-.5L20 10.62V6c0-.55-.45-1-1-1h-1V3c0-.55-.45-1-1-1h-10c-.55 0-1 .45-1 1v2H5c-.55 0-1 .45-1 1v4.62L2.7 11.04c-.26.08-.46.26-.58.5s-.14.52-.06.78L3.95 19z" fill="white"/>
                    </svg>
                  },
                  { 
                    name: 'Contact Us', 
                    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="white"/>
                    </svg>
                  },
                  { 
                    name: 'About Institute', 
                    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="white"/>
                    </svg>
                  }
                ].map((link) => (
                  <a key={link.name} href="#" className="flex items-center text-white/70 hover:text-white hover:translate-x-1 transition-all duration-200 group">
                    <span className="mr-3 group-hover:scale-110 transition-transform">{link.icon}</span>
                    <span className="text-sm">{link.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Course Categories */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6 font-josefin">Course Categories</h4>
              <div className="space-y-3">
                {[
                  { name: 'Basic Courses', color: 'bg-green-500/20 text-green-300' },
                  { name: 'Advanced Training', color: 'bg-orange-500/20 text-orange-300' },
                  { name: 'Refresher Courses', color: 'bg-purple-500/20 text-purple-300' },
                  { name: 'Specialized Programs', color: 'bg-red-500/20 text-red-300' }
                ].map((category) => (
                  <a key={category.name} href="#" className="block group">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${category.color} hover:scale-105 transition-all`}>
                      {category.name}
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6 font-josefin">Get In Touch</h4>
              <div className="space-y-4">
                <div className="flex items-start group">
                  <div className="w-10 h-10 bg-[#64B5F6]/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-[#64B5F6]/30 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="white"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Email</p>
                    <p className="text-white/70 text-sm">info@hariomthalassic.com</p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="w-10 h-10 bg-[#64B5F6]/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-[#64B5F6]/30 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="white"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Phone</p>
                    <p className="text-white/70 text-sm">+91 XXX XXX XXXX</p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="w-10 h-10 bg-[#64B5F6]/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-[#64B5F6]/30 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="white"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Location</p>
                    <p className="text-white/70 text-sm">Mumbai, Maharashtra, India</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-[#64B5F6] to-[#42A5F5] rounded-full flex items-center justify-center">
                <span className="text-white text-xs">©</span>
              </div>
              <p className="text-white/80 text-sm">
                2024 Hari Om Thalassic. All rights reserved.
              </p>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-end gap-6">
              {[
                { name: 'Privacy Policy', icon: '🔒' },
                { name: 'Terms of Service', icon: '📋' },
                { name: 'DGS Approval', icon: '✅' }
              ].map((link) => (
                <a key={link.name} href="#" className="flex items-center text-white/60 hover:text-white text-sm transition-colors group">
                  <span className="mr-2 group-hover:scale-110 transition-transform">{link.icon}</span>
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
