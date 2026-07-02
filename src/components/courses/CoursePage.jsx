import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { X, Clock, Calendar, Users, Award, FileText, Phone, Mail, MapPin } from 'lucide-react';
import { courseData as courses } from './courseData';
import { HeroSection, CourseSection, CourseCard, CourseModal, BubbleBackground } from './CourseComponents';
import SeaServiceSection from './SeaServiceSection';
import Footer from './Footer';
import '../pages/LandingPage.css';

// Import sidebar assets
import homeIcon from '../../assets/sideassets/home.png';
import courseIcon from '../../assets/sideassets/courese.png';
import servicesIcon from '../../assets/sideassets/services.png';
import blogIcon from '../../assets/sideassets/blog.png';
import aboutIcon from '../../assets/sideassets/about.png';
import contactIcon from '../../assets/sideassets/contact.png';
import logoutIcon from '../../assets/sideassets/logout.png';
import RegisterIcon from '../../assets/sideassets/register.png';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  
  const handleNavigation = (href, text) => {
    toggleSidebar(); // Close sidebar first
    
    if (href === '/courses') {
      // Stay on courses page
      return;
    } else if (href === '/login' || href === '/signup') {
      navigate(href);
    } else if (href.startsWith('#')) {
      // Navigate to landing page and scroll to section
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(href.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      navigate(href);
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <button className="sidebar-close" onClick={toggleSidebar}>
            ×
          </button>
        </div>
        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            <li className="sidebar-item">
              <button 
                onClick={() => handleNavigation('/', 'Home')}
                className="sidebar-link"
                style={{background: 'none', border: 'none', width: '100%', textAlign: 'left'}}
              >
                <img src={homeIcon} alt="Home" className="sidebar-icon" />
                <span className="sidebar-text">Home</span>
              </button>
            </li>
            <li className="sidebar-item active">
              <button 
                onClick={() => handleNavigation('/courses', 'Courses')}
                className="sidebar-link"
                style={{background: 'none', border: 'none', width: '100%', textAlign: 'left'}}
              >
                <img src={courseIcon} alt="Courses" className="sidebar-icon" />
                <span className="sidebar-text">Courses</span>
              </button>
            </li>
            <li className="sidebar-item">
              <button 
                onClick={() => handleNavigation('#services', 'Services')}
                className="sidebar-link"
                style={{background: 'none', border: 'none', width: '100%', textAlign: 'left'}}
              >
                <img src={servicesIcon} alt="Services" className="sidebar-icon" />
                <span className="sidebar-text">Services</span>
              </button>
            </li>
            <li className="sidebar-item">
              <button 
                onClick={() => handleNavigation('#blogs', 'Blogs')}
                className="sidebar-link"
                style={{background: 'none', border: 'none', width: '100%', textAlign: 'left'}}
              >
                <img src={blogIcon} alt="Blogs" className="sidebar-icon" />
                <span className="sidebar-text">Blogs</span>
              </button>
            </li>
            <li className="sidebar-item">
              <button 
                onClick={() => handleNavigation('#about', 'About us')}
                className="sidebar-link"
                style={{background: 'none', border: 'none', width: '100%', textAlign: 'left'}}
              >
                <img src={aboutIcon} alt="About us" className="sidebar-icon" />
                <span className="sidebar-text">About us</span>
              </button>
            </li>
            <li className="sidebar-item">
              <button 
                onClick={() => handleNavigation('#contact', 'Contact')}
                className="sidebar-link"
                style={{background: 'none', border: 'none', width: '100%', textAlign: 'left'}}
              >
                <img src={contactIcon} alt="Contact" className="sidebar-icon" />
                <span className="sidebar-text">Contact</span>
              </button>
            </li>
            <li className="sidebar-item">
              <button 
                onClick={() => handleNavigation('/login', 'Login')}
                className="sidebar-link"
                style={{background: 'none', border: 'none', width: '100%', textAlign: 'left', textDecoration: 'none', color: 'inherit'}}
              >
                <img src={logoutIcon} alt="Login" className="sidebar-icon" />
                <span className="sidebar-text">Login</span>
              </button>
            </li>
            <li className="sidebar-item">
              <button 
                onClick={() => handleNavigation('/signup', 'Sign Up')}
                className="sidebar-link"
                style={{background: 'none', border: 'none', width: '100%', textAlign: 'left', textDecoration: 'none', color: 'inherit'}}
              >
                <img src={RegisterIcon} alt="Sign Up" className="sidebar-icon" />
                <span className="sidebar-text">Sign Up</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Sidebar Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </>
  );
};

const Header = ({ toggleSidebar, currentTime, formatTime }) => {
  const navigate = useNavigate();
  
  return (
    <header className="fixed top-0 left-0 w-full h-[120px] bg-white flex items-center justify-between px-8 z-30 border-b border-gray-100 shadow-sm">
      <div className="flex items-center space-x-6">
        <button 
          onClick={toggleSidebar}
          className="p-3 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <svg width="33" height="24" viewBox="0 0 33 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 1.95768C0 1.38633 0.220785 0.917936 0.662356 0.552502C1.10045 0.184167 1.66198 0 2.34693 0H30.5101C31.1951 0 31.7566 0.184167 32.1947 0.552502C32.6363 0.917936 32.857 1.38633 32.857 1.95768C32.857 2.52904 32.6363 2.99743 32.1947 3.36286C31.7566 3.7312 31.1951 3.91536 30.5101 3.91536H2.34693C1.66198 3.91536 1.10045 3.7312 0.662356 3.36286C0.220785 2.99743 0 2.52904 0 1.95768ZM0 11.7461C0 11.1747 0.220785 10.7063 0.662356 10.3409C1.10045 9.97258 1.66198 9.78841 2.34693 9.78841H30.5101C31.1951 9.78841 31.7566 9.97258 32.1947 10.3409C32.6363 10.7063 32.857 11.1747 32.857 11.7461C32.857 12.3174 32.6363 12.7858 32.1947 13.1513C31.7566 13.5196 31.1951 13.7038 30.5101 13.7038H2.34693C1.66198 13.7038 1.10045 13.5196 0.662356 13.1513C0.220785 12.7858 0 12.3174 0 11.7461ZM32.857 21.5345C32.857 22.1059 32.6363 22.5742 32.1947 22.9397C31.7566 23.308 31.1951 23.4922 30.5101 23.4922H2.34693C1.66198 23.4922 1.10045 23.308 0.662356 22.9397C0.220785 22.5742 0 22.1059 0 21.5345C0 20.9632 0.220785 20.4948 0.662356 20.1293C1.10045 19.761 1.66198 19.5768 2.34693 19.5768H30.5101C31.1951 19.5768 31.7566 19.761 32.1947 20.1293C32.6363 20.4948 32.857 20.9632 32.857 21.5345Z" fill="#243F42"/>
          </svg>
        </button>
        <button 
          onClick={() => navigate('/')}
          className="flex items-center space-x-4 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/d36f89b966d2ba0f2b29fcae06d07532d8c2fb65?width=212"
            alt="Logo"
            className="w-[80px] h-[60px]"
          />
          <h1 className="text-3xl font-semibold text-[#243F42] font-josefin tracking-wide">
            Hari Om Thalassic
          </h1>
        </button>
      </div>
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-full">
          <div className="w-8 h-8 rounded-full border-2 border-[#64748B] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="#64748B" strokeWidth="2"/>
              <polyline points="12,6 12,12 16,14" stroke="#64748B" strokeWidth="2"/>
            </svg>
          </div>
          <span className="text-lg font-medium text-[#64748B]">
            {formatTime(currentTime)}
          </span>
        </div>
        <div className="w-[50px] h-[50px] rounded-full bg-gradient-to-br from-[#528A91] to-[#2A464B] flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-white">
          RK
        </div>
      </div>
    </header>
  );
};

export default function CoursePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const basicCourses = courses.filter(course => course.category === 'basic');
  const advancedCourses = courses.filter(course => course.category === 'advanced');
  const refresherCourses = courses.filter(course => course.category === 'refresher');
  const additionalCourses = courses.filter(course => course.category === 'additional');

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Header 
        toggleSidebar={toggleSidebar} 
        currentTime={currentTime} 
        formatTime={formatTime} 
      />
      <div className="pt-[120px]">
        <HeroSection />
        
        <main className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <CourseSection
              title="Basic Courses - DGS Approved"
              subtitle="Essential foundation courses for maritime careers"
              icon="🎯"
              courses={basicCourses}
              bgGradient="bg-gradient-to-r from-[#243F42] via-[#2A464B] to-[#1A2E31]"
            />
            
            <CourseSection
              title="Advanced Courses - DGS Approved"
              subtitle="Specialized training for experienced maritime professionals"
              icon="🔥"
              courses={advancedCourses}
              bgGradient="bg-gradient-to-r from-[#243F42] via-[#2A464B] to-[#1A2E31]"
            />
            
            <CourseSection
              title="Refresher Courses - DGS Approved"
              subtitle="Update and renew your maritime certifications"
              icon="🔄"
              courses={refresherCourses}
              bgGradient="bg-gradient-to-r from-[#243F42] via-[#2A464B] to-[#1A2E31]"
            />
            
            <CourseSection
              title="Additional Courses - DGS Approved"
              subtitle="Specialized maritime training programs"
              icon="⚡"
              courses={additionalCourses}
              bgGradient="bg-gradient-to-r from-[#243F42] via-[#2A464B] to-[#1A2E31]"
            />
          </div>
        </main>
        
        <SeaServiceSection />
        <Footer />
      </div>
    </div>
  );
}
