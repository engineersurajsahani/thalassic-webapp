import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

const getCategoryColor = (category) => {
  switch (category) {
    case 'basic':
      return 'bg-gradient-to-r from-[#10B981] to-[#059669]';
    case 'advanced':
      return 'bg-gradient-to-r from-[#F59E0B] to-[#D97706]';
    case 'refresher':
      return 'bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED]';
    case 'additional':
      return 'bg-gradient-to-r from-[#EF4444] to-[#DC2626]';
    default:
      return 'bg-gradient-to-r from-[#10B981] to-[#059669]';
  }
};

const getCategoryLabel = (category) => {
  switch (category) {
    case 'basic':
      return 'Basic';
    case 'advanced':
      return 'Advanced';
    case 'refresher':
      return 'Refresher';
    case 'additional':
      return 'Additional';
    default:
      return 'Basic';
  }
};

export const BubbleBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary large bubble - top right, framing the content */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-60 transform rotate-[25deg]"
        style={{
          background: 'radial-gradient(circle at 30% 40%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.1) 25%, transparent 50%), radial-gradient(circle at 20% 60%, #243F42 0%, #1B2D30 40%, #0F1C1E 80%, transparent 100%)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 4px 16px rgba(255, 255, 255, 0.2), inset 0 -2px 8px rgba(0, 0, 0, 0.1)',
          top: '-150px',
          right: '-100px',
          filter: 'blur(0.5px)'
        }}
      />

      {/* Secondary medium bubble - left side, smaller and more subtle */}
      <div
        className="absolute w-[350px] h-[350px] rounded-full opacity-50 transform rotate-[-15deg]"
        style={{
          background: 'radial-gradient(circle at 40% 30%, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.05) 30%, transparent 60%), radial-gradient(circle at 60% 70%, #396369 0%, #294146 50%, #1A2E31 90%, transparent 100%)',
          boxShadow: '0 6px 24px rgba(0, 0, 0, 0.08), inset 0 3px 12px rgba(255, 255, 255, 0.15), inset 0 -1px 6px rgba(0, 0, 0, 0.08)',
          top: '200px',
          left: '-80px',
          filter: 'blur(0.3px)'
        }}
      />

      {/* Accent small bubble - bottom right */}
      <div
        className="absolute w-[180px] h-[180px] rounded-full opacity-40 transform rotate-[45deg]"
        style={{
          background: 'radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.1) 40%, transparent 70%), radial-gradient(circle at 30% 70%, #64B5F6 0%, #42A5F5 60%, #2196F3 90%, transparent 100%)',
          boxShadow: '0 4px 16px rgba(100, 181, 246, 0.2), inset 0 2px 8px rgba(255, 255, 255, 0.3)',
          bottom: '100px',
          right: '150px'
        }}
      />

      {/* Very subtle accent bubble - top left */}
      <div
        className="absolute w-[120px] h-[120px] rounded-full opacity-30 transform rotate-[-30deg]"
        style={{
          background: 'radial-gradient(circle at 60% 40%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 80%), radial-gradient(circle at 40% 60%, #528A91 0%, #2A464B 70%, transparent 100%)',
          boxShadow: '0 3px 12px rgba(82, 138, 145, 0.15), inset 0 1px 6px rgba(255, 255, 255, 0.2)',
          top: '50px',
          left: '200px'
        }}
      />

      {/* Floating particles for depth */}
      <div className="absolute top-[30%] left-[15%] w-3 h-3 rounded-full bg-white/20 animate-pulse"></div>
      <div className="absolute top-[60%] right-[25%] w-2 h-2 rounded-full bg-blue-200/30 animate-pulse delay-1000"></div>
      <div className="absolute bottom-[40%] left-[70%] w-4 h-4 rounded-full bg-teal-100/25 animate-pulse delay-2000"></div>
    </div>
  );
};

export const HeroSection = () => {
  return (
    <section className="relative min-h-[700px] bg-gradient-to-br from-slate-50 via-white to-gray-50 flex flex-col items-center justify-center px-8 py-24">
      <BubbleBackground />
      <div className="relative z-10 max-w-5xl text-center">
        <div className="inline-flex items-center px-8 py-4 mb-16 rounded-full bg-gradient-to-r from-[#243F42] via-[#2A464B] to-[#1A2E31] text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="w-2 h-2 bg-white rounded-full mr-3 animate-pulse"></div>
          <span className="text-sm font-bold tracking-widest uppercase font-josefin">Training Programs</span>
          <div className="w-2 h-2 bg-white rounded-full ml-3 animate-pulse delay-500"></div>
        </div>
        <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold mb-12 font-josefin leading-tight">
          <span className="bg-gradient-to-r from-[#243F42] via-[#2A464B] to-[#1A2E31] bg-clip-text text-transparent">
            Maritime Training
          </span>
          <br />
          <span className="bg-gradient-to-r from-[#528A91] via-[#64B5F6] to-[#42A5F5] bg-clip-text text-transparent">
            Excellence
          </span>
        </h1>
        <div className="max-w-4xl mx-auto mb-16">
          <p className="text-xl lg:text-2xl text-[#64748B] leading-relaxed font-inter font-medium">
            Comprehensive STCW certified courses for seafarers at all levels
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#64B5F6] to-[#42A5F5] mx-auto mt-8 rounded-full"></div>
        </div>
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button className="px-8 py-4 bg-gradient-to-r from-[#243F42] to-[#2A464B] text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 font-josefin tracking-wide">
            Explore Courses
          </button>
          <button className="px-8 py-4 border-2 border-[#243F42] text-[#243F42] font-semibold rounded-full hover:bg-[#243F42] hover:text-white transition-all duration-300 font-josefin tracking-wide">
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
};

export const CourseModal = ({ course }) => {
  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-full border-2 border-[#243F42] shadow-2xl sm:max-w-[90vw] md:max-w-4xl lg:max-w-5xl">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-[#243F42] mb-4">
          {course.name} ({course.code})
        </DialogTitle>
      </DialogHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Image and Course Info */}
        <div className="space-y-6">
          <div className="relative rounded-lg overflow-hidden">
            <img 
              src={course.image} 
              alt={course.name}
              className="w-full h-64 object-cover"
            />
            <div className="absolute top-4 right-4">
              <div className={`px-4 py-2 rounded-[20px] ${getCategoryColor(course.category)}`}>
                <span className="text-white text-xs font-semibold uppercase tracking-wider">
                  {getCategoryLabel(course.category)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-[#243F42]">Course Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#F1F5F9] rounded-lg p-4">
                <span className="text-[#64748B] text-sm font-medium block">Duration</span>
                <span className="text-[#243F42] font-semibold">{course.duration}</span>
              </div>
              <div className="bg-[#F1F5F9] rounded-lg p-4">
                <span className="text-[#64748B] text-sm font-medium block">Level</span>
                <span className="text-[#243F42] font-semibold">{course.level}</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-[#243F42] to-[#2A464B] rounded-lg p-6 text-center">
              <span className="text-white text-sm font-medium block mb-2">Course Fees</span>
              <span className="text-white text-3xl font-bold">{course.fees}</span>
            </div>
          </div>
        </div>
        
        {/* Right Column - Documents Required */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-[#243F42] mb-4">Documents Required</h3>
            <div className="space-y-3">
              {course.documentsRequired.map((doc, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                  <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
                  <span className="text-[#475569] font-medium">{doc}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-[#F0F9FF] border border-[#BAE6FD] rounded-lg p-6">
            <h4 className="text-lg font-semibold text-[#0369A1] mb-3">Important Notes</h4>
            <ul className="space-y-2 text-[#0369A1] text-sm">
              <li>• All documents must be original or certified copies</li>
              <li>• Medical certificate should be valid and recent</li>
              <li>• Course fees include training materials and certification</li>
              <li>• Registration closes 3 days before course start date</li>
            </ul>
          </div>
          
          <div className="flex gap-4">
            <button className="flex-1 bg-gradient-to-r from-[#243F42] to-[#2A464B] text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300">
              Enroll Now
            </button>
            <button className="flex-1 border-2 border-[#243F42] text-[#243F42] font-semibold py-3 px-6 rounded-lg hover:bg-[#243F42] hover:text-white transition-all duration-300">
              Download Brochure
            </button>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};

export const CourseCard = ({ course }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="bg-white rounded-[20px] border border-[rgba(100,181,246,0.10)] shadow-[0_10px_40px_0_rgba(0,0,0,0.08)] p-6 h-[334px] relative overflow-hidden cursor-pointer hover:shadow-[0_15px_50px_0_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 left-0 w-full h-[5px] bg-gradient-to-r from-[#243F42] via-[#1A2E31] to-[#64B5F6]"></div>
          <div className="flex items-start justify-between mb-6">
            <div className="w-[37px] h-[77px] bg-gradient-to-br from-[rgba(36,63,66,0.10)] to-[rgba(100,181,246,0.10)] rounded-[12px] flex items-center justify-center">
              <span className="text-2xl">{course.icon}</span>
            </div>
            <div className={`px-4 py-2 rounded-[20px] ${getCategoryColor(course.category)}`}>
              <span className="text-white text-xs font-semibold uppercase tracking-wider">
                {getCategoryLabel(course.category)}
              </span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#243F42] mb-4">
            {course.code}
          </h3>
          <p className="text-[#64748B] text-base mb-8 leading-relaxed">
            {course.description}
          </p>
          <div className="flex gap-3 mt-auto">
            <div className="bg-[#F1F5F9] rounded-lg px-3 py-2">
              <span className="text-[#64748B] text-sm font-medium">
                ⏱️ {course.duration}
              </span>
            </div>
            <div className="bg-[#F1F5F9] rounded-lg px-3 py-2">
              <span className="text-[#64748B] text-sm font-medium">
                {course.level}
              </span>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <CourseModal course={course} />
    </Dialog>
  );
};

export const CourseSection = ({ title, subtitle, icon, courses, bgGradient }) => {
  return (
    <div className="mb-16">
      <div className={`w-full h-[194px] rounded-[20px] ${bgGradient} shadow-[0_10px_40px_0_rgba(36,63,66,0.20)] flex items-center px-8 mb-8`}>
        <div className="bg-gradient-to-br from-[rgba(100,181,246,0.20)] to-[rgba(66,165,245,0.20)] backdrop-blur-[5px] rounded-[15px] w-[96px] h-[96px] flex items-center justify-center mr-8">
          <span className="text-4xl text-white">{icon}</span>
        </div>
        <div>
          <h2 className="text-white text-3xl font-bold mb-2">{title}</h2>
          <p className="text-white/90 text-lg">{subtitle}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};
