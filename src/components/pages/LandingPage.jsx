import React, { useState, useEffect, useRef } from 'react';
import './LandingPage.css';
import BookingPortal from './BookingPortal.jsx';
import logo from '../../assets/logo.png';
import video from '../../assets/video.mp4';
import floatingCallIcon from '../../assets/floating-call.png';
import bookingIcon from '../../assets/booking.png';
import anchorIcon from '../../assets/anchor.png';
import joinIcon from '../../assets/join.png';
import aboutImage from '../../assets/about-imag.png';

// Sidebar Icons
import homeIcon from '../../assets/sideassets/home.png';
import courseIcon from '../../assets/sideassets/courese.png';
import servicesIcon from '../../assets/sideassets/services.png';
import blogIcon from '../../assets/sideassets/blog.png';
import aboutIcon from '../../assets/sideassets/about.png';
import contactIcon from '../../assets/sideassets/contact.png';
import logoutIcon from '../../assets/sideassets/logout.png';
import RegisterIcon from '../../assets/sideassets/register.png';

// Service Icons
import serviceIcon1 from '../../assets/services/documeny.png';
import serviceIcon2 from '../../assets/services/job.png';
import serviceIcon3 from '../../assets/services/traning.png';
import serviceIcon4 from '../../assets/services/travel.png';
import serviceIcon5 from '../../assets/services/flag.png';
import serviceIcon6 from '../../assets/services/knowledge.png';

const LandingPage = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isBookingPortalOpen, setIsBookingPortalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState(new Set());

  const handleAuthNavigation = (path) => {
    console.log('Navigation clicked:', path);
    try {
      // Force a full page reload to bypass React Router
      window.location.replace(window.location.origin + path);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback methods
      try {
        window.location.assign(window.location.origin + path);
      } catch (e) {
        window.open(window.location.origin + path, '_self');
      }
    }
  };

  // Refs for animated sections
  const videoRef = useRef(null);
  const aboutRef = useRef(null);
  const statsRef = useRef(null);
  const servicesRef = useRef(null);
  const partnersRef = useRef(null);
  const testimonialsRef = useRef(null);
  const contactRef = useRef(null);
  const officeRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const openBookingPortal = () => {
    setIsBookingPortalOpen(true);
  };

  const closeBookingPortal = () => {
    setIsBookingPortalOpen(false);
  };

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const sections = [aboutRef, statsRef, servicesRef, partnersRef, testimonialsRef, contactRef, officeRef];
    sections.forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      sections.forEach(ref => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  return (
    <div className="landing-page">
      {!isBookingPortalOpen && (
        <>
          {/* Video Background */}
          <div className="video-background">
            <video autoPlay muted loop className="bg-video">
              <source src={video} type="video/mp4" />
              {/* Placeholder for video - add your video file to public/videos/ */}
            </video>
            <div className="video-overlay"></div>
          </div>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <button className="sidebar-close" onClick={closeSidebar}>
            ×
          </button>
        </div>
        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            <li className="sidebar-item active">
              <a href="#home" className="sidebar-link">
                <img src={homeIcon} alt="Home" className="sidebar-icon" />
                <span className="sidebar-text">Home</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a href="/courses" className="sidebar-link">
                <img src={courseIcon} alt="Courses" className="sidebar-icon" />
                <span className="sidebar-text">Courses</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a href="#services" className="sidebar-link">
                <img src={servicesIcon} alt="Services" className="sidebar-icon" />
                <span className="sidebar-text">Services</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a href="/blog" className="sidebar-link">
                <img src={blogIcon} alt="Blogs" className="sidebar-icon" />
                <span className="sidebar-text">Blogs</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a href="#about" className="sidebar-link">
                <img src={aboutIcon} alt="About us" className="sidebar-icon" />
                <span className="sidebar-text">About us</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a href="#contact" className="sidebar-link">
                <img src={contactIcon} alt="Contact" className="sidebar-icon" />
                <span className="sidebar-text">Contact</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a href="/login" className="sidebar-link" style={{textDecoration: 'none', color: 'inherit'}}>
                <img src={logoutIcon} alt="Login" className="sidebar-icon" />
                <span className="sidebar-text">Login</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a href="/signup" className="sidebar-link" style={{textDecoration: 'none', color: 'inherit'}}>
                <img src={RegisterIcon} alt="Sign Up" className="sidebar-icon" />
                <span className="sidebar-text">Sign Up</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-left">
            <div className="nav-toggle" onClick={toggleSidebar}>
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </div>
          </div>

          <div className="nav-center">
            <div className="nav-logo">
              <div className="logo-circle">
                <img
                  src={logo}
                  alt="Thalassic Logo"
                  className="logo-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <span className="logo-placeholder" style={{ display: 'none' }}>THALASSIC</span>
              </div>
            </div>
          </div>

          <div className="nav-right">
            <a href="/login" className="nav-btn login-btn" style={{textDecoration: 'none', display: 'inline-block'}}>
              Login
            </a>
            <a href="/signup" className="nav-btn get-started-btn" style={{textDecoration: 'none', display: 'inline-block'}}>
              Get Started
            </a>
          </div>
        </div>


      </nav>

      {/* Floating Buttons */}
      <div className="floating-buttons">
        <div className="floating-call-btn">
          <img src={floatingCallIcon} alt="Floating Call Icon" />
        </div>
        <div className="floating-booking-btn" onClick={openBookingPortal}>
          <img src={bookingIcon} alt="Booking Icon" />
        </div>
      </div>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-content">
          <h1>Hari Om Thalassic</h1>
          <h2 className="hero-subtitle">A Complete Seafarer's Home</h2>
          <p>Your trusted partner for maritime documentation, training, and job placements</p>
          <div className="hero-buttons">
            <button className="btn btn-primary">
              <span className="btn-icon"><img src={anchorIcon} alt="Anchor" /></span>
              OUR SERVICES
            </button>
            <a href="/signup" className="btn btn-secondary" style={{textDecoration: 'none', color: 'inherit'}}>
              <span className="btn-icon"><img src={joinIcon} alt="Join" /></span>
              JOIN NOW
            </a>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-arrow">⌄</div>
        </div>
      </section>

      {/* About Us Section */}
      <section 
        id="about" 
        ref={aboutRef}
        className={`about-section ${visibleSections.has('about') ? 'animate-in' : ''}`}
      >
        <div className="about-container">
          <div className="about-grid">
            {/* Image Column */}
            <div className="about-image-column">
              <img
                src={aboutImage}
                alt="Maritime Training - Icon of the Seas"
                className="about-image"
              />
            </div>

            {/* Right Column - Text */}
            <div className="about-text-column">
              <span className="section-label">ABOUT US</span>
              <h2 className="about-title">Navigating Your Maritime Career</h2>
              <p className="about-description">
                Hari Om Thalassic Private Limited is a premier service provider for
                seafarers and maritime professionals, dedicated to making the journey
                at sea smoother and more rewarding.
              </p>

              <div className="about-feature">
                <span className="feature-icon">✔</span>
                <div>
                  <h4>Comprehensive Solutions</h4>
                  <p>
                    From documentation to job placements, we cover all aspects of maritime careers.
                  </p>
                </div>
              </div>

              <div className="about-feature">
                <span className="feature-icon">✔</span>
                <div>
                  <h4>Financial Services</h4>
                  <p>
                    Our HPAY system provides specialized financial solutions for seafarers.
                  </p>
                </div>
              </div>

              <button className="know-more-btn">KNOW MORE</button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section 
        id="stats"
        ref={statsRef}
        className={`stats-section ${visibleSections.has('stats') ? 'animate-in' : ''}`}
      >
        <div className="stats-container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Happy Seafarers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Shipping Partners</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Verified Companies</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support Available</div>
            </div>
          </div>
        </div>
      </section>


      {/* Our Services Section */}
      <section 
        id="services" 
        ref={servicesRef}
        className={`services-section ${visibleSections.has('services') ? 'animate-in' : ''}`}
      >
        <div className="container">
          <span className="section-label">Our Services</span>
          <h2 className="section-title">Comprehensive Maritime Solutions</h2>
          <p className="section-subtitle">
            We provide end-to-end services to support seafarers at every stage of their maritime journey.
          </p>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <img src={serviceIcon1} alt="Seafarer Documentation" />
              </div>
              <h3>Seafarer Documentation</h3>
              <p>Assistance with Passport, CDC, STCW Courses, INDOS, Medicals, and other essential documents.</p>
              <a href="#contact" className="learn-more">Learn More →</a>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <img src={serviceIcon2} alt="Job Placements" />
              </div>
              <h3>Job Placements</h3>
              <p>Verified shipping companies, vacancies for various ranks, and application assistance.</p>
              <a href="#contact" className="learn-more">Learn More →</a>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <img src={serviceIcon3} alt="Maritime Training" />
              </div>
              <h3>Maritime Training</h3>
              <p>Career counseling, course enrollment help, pre-sea and post-sea guidance.</p>
              <a href="/courses" className="learn-more">View Courses →</a>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <img src={serviceIcon4} alt="Travel Assistance" />
              </div>
              <h3>Travel Assistance</h3>
              <p>Flight bookings, visa help, itinerary planning for joining or vacation.</p>
              <a href="#contact" className="learn-more">Learn More →</a>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <img src={serviceIcon5} alt="Flag State Docs" />
              </div>
              <h3>Flag State Docs</h3>
              <p>PANAMA, HONDURAS, ST. KITTS, COOK ISLAND, and other flag state documentation.</p>
              <a href="#contact" className="learn-more">Learn More →</a>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <img src={serviceIcon6} alt="Knowledge Hub" />
              </div>
              <h3>Knowledge Hub</h3>
              <p>Blogs and resources to provide knowledge about the maritime industry.</p>
              <a href="#contact" className="learn-more">Learn More →</a>
            </div>
          </div>
        </div>
      </section>

      {/* Our Partners Section */}
      <section 
        id="partners" 
        ref={partnersRef}
        className={`partners-section ${visibleSections.has('partners') ? 'animate-in' : ''}`}
      >
        <div className="container">
          <span className="section-label">Our Partners</span>
          <h2 className="section-title">Trusted By Leading Maritime Companies</h2>
          <p className="section-subtitle">
            We collaborate with top maritime organizations to ensure quality services for our seafarers.
          </p>

          <div className="partners-logos">
            <div className="partners-scroll">
              <div className="partner-card">
                <img src={require('../../assets/partners/aqualishLogo.jpg')} alt="Aqualish Ship Management" />
                <p>Aqualish Ship Management</p>
              </div>
              <div className="partner-card">
                <img src={require('../../assets/partners/coralLogo.png')} alt="Coral Marine Services" />
                <p>Coral Marine Services</p>
              </div>
              <div className="partner-card">
                <img src={require('../../assets/partners/yak.jpg')} alt="YAK Maritime" />
                <p>YAK Maritime</p>
              </div>
              <div className="partner-card">
                <img src={require('../../assets/partners/anvayLogo.png')} alt="Anvay Maritime" />
                <p>Anvay Maritime</p>
              </div>
              <div className="partner-card">
                <img src={require('../../assets/partners/ashaLogo.jpg')} alt="Asha Maritime" />
                <p>Asha Maritime</p>
              </div>
              <div className="partner-card">
                <img src={require('../../assets/partners/fiveStarLogo.jpg')} alt="Five Star Maritime" />
                <p>Five Star Maritime</p>
              </div>
              <div className="partner-card">
                <img src={require('../../assets/partners/lmetlogo.png')} alt="LMET" />
                <p>LMET</p>
              </div>
              <div className="partner-card">
                <img src={require('../../assets/partners/sunLogo.png')} alt="Sun Maritime" />
                <p>Sun Maritime</p>
              </div>
              <div className="partner-card">
                <img src={require('../../assets/partners/unitedLogo.png')} alt="United Maritime" />
                <p>United Maritime</p>
              </div>
              {/* Duplicate for seamless loop */}
              <div className="partner-card">
                <img src={require('../../assets/partners/aqualishLogo.jpg')} alt="Aqualish Ship Management" />
                <p>Aqualish Ship Management</p>
              </div>
              <div className="partner-card">
                <img src={require('../../assets/partners/coralLogo.png')} alt="Coral Marine Services" />
                <p>Coral Marine Services</p>
              </div>
              <div className="partner-card">
                <img src={require('../../assets/partners/yak.jpg')} alt="YAK Maritime" />
                <p>YAK Maritime</p>
              </div>
              <div className="partner-card">
                <img src={require('../../assets/partners/anvayLogo.png')} alt="Anvay Maritime" />
                <p>Anvay Maritime</p>
              </div>
              <div className="partner-card">
                <img src={require('../../assets/partners/ashaLogo.jpg')} alt="Asha Maritime" />
                <p>Asha Maritime</p>
              </div>
              <div className="partner-card">
                <img src={require('../../assets/partners/fiveStarLogo.jpg')} alt="Five Star Maritime" />
                <p>Five Star Maritime</p>
              </div>
              <div className="partner-card">
                <img src={require('../../assets/partners/lmetlogo.png')} alt="LMET" />
                <p>LMET</p>
              </div>
              <div className="partner-card">
                <img src={require('../../assets/partners/sunLogo.png')} alt="Sun Maritime" />
                <p>Sun Maritime</p>
              </div>
              <div className="partner-card">
                <img src={require('../../assets/partners/unitedLogo.png')} alt="United Maritime" />
                <p>United Maritime</p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Testimonials Section */}
      <section 
        id="testimonials" 
        ref={testimonialsRef}
        className={`testimonials-section ${visibleSections.has('testimonials') ? 'animate-in' : ''}`}
      >
        <div className="container">
          <span className="section-label">Testimonials</span>
          <h2 className="section-title">What Our Clients Say</h2>
          <p className="section-subtitle">
            Hear from seafarers who have benefited from our services.
          </p>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-header">
                <img src={require('../../assets/testomonials/32.jpg')} alt="Vinit Tomar" className="testimonial-avatar" />
                <div>
                  <h4>Vinit Tomar</h4>
                  <p className="testimonial-role">Chief Cook</p>
                </div>
              </div>
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "Hari Om Thalassic made my CDC and INDOS process so smooth. Their guidance was invaluable for a newcomer like me. The team was always available to answer my questions."
              </p>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-header">
                <img src={require('../../assets/testomonials/44.jpg')} alt="Nitish Singh" className="testimonial-avatar" />
                <div>
                  <h4>Nitish Singh</h4>
                  <p className="testimonial-role">Second Engineer</p>
                </div>
              </div>
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "Got placed with a reputed shipping company within a month of registering with them. Their recruitment team is very professional and understands the industry needs."
              </p>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-header">
                <img src={require('../../assets/testomonials/75.jpg')} alt="Ravindar Saini" className="testimonial-avatar" />
                <div>
                  <h4>Ravindar Saini</h4>
                  <p className="testimonial-role">Chief Officer</p>
                </div>
              </div>
              <div className="testimonial-stars">⭐⭐⭐⭐½</div>
              <p className="testimonial-text">
                "Their travel assistance saved me so much time and hassle when joining my vessel in Singapore. Everything from flights to local transport was perfectly arranged."
              </p>
            </div>
          </div>
        </div>
      </section>
{/* Contact Us Section */}
<section 
  id="contact" 
  ref={contactRef}
  className={`contact-section ${visibleSections.has('contact') ? 'animate-in' : ''}`}
>
  <div className="container">
    <span className="section-label">Contact Us</span>
    <h2 className="section-title">Get In Touch</h2>
    <p className="section-subtitle">
      Have questions? Our team is ready to assist you with all your maritime needs.
    </p>

    <div className="contact-grid">
      {/* Contact Info Card */}
      <div className="contact-info-card">
        <div className="contact-item">
          <div className="icon-wrapper">
            <i className="fas fa-map-marker-alt"></i>
          </div>
          <div>
            <h4>Address</h4>
            <p>
              Office no 9, Ground Floor, Mehta Chamber, Kalyan Street, Dana Bandar,
              Masjid Bunder(East), Mumbai, Maharashtra 400009
            </p>
          </div>
        </div>

        <div className="contact-item">
          <div className="icon-wrapper">
            <i className="fas fa-phone-alt"></i>
          </div>
          <div>
            <h4>Phone</h4>
            <p>+91 76667 05007</p>
          </div>
        </div>

        <div className="contact-item">
          <div className="icon-wrapper">
            <i className="fas fa-envelope"></i>
          </div>
          <div>
            <h4>Email</h4>
            <p>support@hariomthalassic.com</p>
          </div>
        </div>

        <div className="contact-item">
          <div className="icon-wrapper">
            <i className="fas fa-clock"></i>
          </div>
          <div>
            <h4>Working Hours</h4>
            <p>Monday – Saturday: 9:00 AM – 6:00 PM</p>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <form className="contact-form">
        <div className="form-row">
          <input type="text" placeholder="Full Name" required />
          <input type="email" placeholder="Email" required />
        </div>
        <input type="text" placeholder="Subject" required />
        <textarea placeholder="Message" rows="4" required></textarea>
        <button type="submit" className="send-btn">
          <i className="fas fa-paper-plane"></i> SEND MESSAGE
        </button>
      </form>
    </div>
  </div>
</section>
      {/* Find Our Office Section */}
      <section 
        id="office" 
        ref={officeRef}
        className={`office-section ${visibleSections.has('office') ? 'animate-in' : ''}`}
      >
        <div className="container">
          <h2 className="section-title">Find Our Office</h2>
          <p className="section-subtitle">
            Conveniently located in the heart of Mumbai's maritime district
          </p>

          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4014.2033522728957!2d72.83738757538528!3d18.95574945573623!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ce3008a61829%3A0xe578be2261bf51dc!2sMehta%20Chamber%2C%20PRESTIGE%20CHAMBERS%2C%20Nandalal%20Jani%20Rd%2C%20Dana%20Bandar%2C%20Mandvi%2C%20Mumbai%2C%20Maharashtra%20400009!5e1!3m2!1sen!2sin!4v1754729111108!5m2!1sen!2sin"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Hari Om Thalassic Pvt Ltd Location"
            ></iframe>
          </div>

          <a href="https://www.google.com/maps/dir//Office+no+9,+Ground+Floor,+Mehta+Chamber,+Kalyan+Street,+Dana+Bandar,+Masjid+Bunder+(East),+Mumbai,+Maharashtra+400009" className="directions-link" target="_blank" rel="noopener noreferrer">
            GET PRECISE DIRECTIONS
          </a>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer-section">
        <div className="container footer-grid">
          {/* Company Info */}
          <div className="footer-about">
            <h4>HARI OM THALASSIC PRIVATE LIMITED</h4>
            <p>A Complete Seafarer's Home</p>
            <div className="footer-socials">
              <a href="https://facebook.com/hariomthalassic" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
              <a href="https://twitter.com/hariomthalassic" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
              <a href="https://linkedin.com/company/hariomthalassic" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>
              <a href="https://instagram.com/hariomthalassic" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h4>QUICK LINKS</h4>
            <ul>
              <li><a href="#services">Services</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="/login" style={{textDecoration: 'none', color: 'inherit'}}>Login</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-contact">
            <h4>CONTACT</h4>
            <p><i className="fas fa-phone-alt"></i> +91 76667 05007</p>
            <p><i className="fas fa-envelope"></i> support@hariomthalassic.com</p>
            <p><i className="fas fa-map-marker-alt"></i> Mumbai, India</p>
          </div>
        </div>

        <div className="footer-bottom">
          © 2025 Hari Om Thalassic Private Limited
        </div>
      </footer>
        </>
      )}

      {/* Booking Portal Page */}
      {isBookingPortalOpen && (
        <BookingPortal onClose={closeBookingPortal} />
      )}




    </div>
  );
};

export default LandingPage;
