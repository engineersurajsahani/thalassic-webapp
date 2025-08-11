import React, { useState } from 'react';
import './BookingPortal.css';
import logo from '../../assets/logo.png';

// Sidebar Icons
import homeIcon from '../../assets/sideassets/home.png';
import courseIcon from '../../assets/sideassets/courese.png';
import servicesIcon from '../../assets/sideassets/services.png';
import blogIcon from '../../assets/sideassets/blog.png';
import aboutIcon from '../../assets/sideassets/about.png';
import contactIcon from '../../assets/sideassets/contact.png';
import logoutIcon from '../../assets/sideassets/logout.png';
import RegisterIcon from '../../assets/sideassets/register.png';

const BookingPortal = ({ onClose }) => {
  const [courseCategory, setCourseCategory] = useState('');
  const [specificCourse, setSpecificCourse] = useState('');
  const [commencementDate, setCommencementDate] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState('selection'); // 'selection' or 'information'
  
  // Personal Info form state
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    email: '',
    phone: '',
    experience: ''
  });

  // Course data
  const courseData = {
    'basic-safety': {
      title: 'Basic Safety Training',
      duration: '5 Days',
      fees: '₹15,000',
      eligibility: 'Class 10th Pass, Age 18-35 years',
      description: 'This course covers basic safety training including personal survival techniques, fire prevention and fire fighting, elementary first aid, and personal safety and social responsibilities.',
      documents: ['Educational Certificate', 'Age Proof', 'Medical Certificate', 'Passport Size Photos (4)', 'Identity Proof']
    },
    'watchkeeping': {
      title: 'Watchkeeping',
      duration: '3 Weeks',
      fees: '₹25,000',
      eligibility: 'Deck Cadet Certificate, Age 18-40 years',
      description: 'Comprehensive training for deck watchkeeping duties including navigation, collision avoidance, and bridge resource management.',
      documents: ['CDC Certificate', 'Educational Certificate', 'Medical Certificate', 'Passport Size Photos (6)', 'Experience Certificate']
    },
    'navigation': {
      title: 'Navigation',
      duration: '4 Weeks',
      fees: '₹35,000',
      eligibility: 'OOW Certificate, Age 21-45 years',
      description: 'Advanced navigation techniques including electronic navigation systems, radar navigation, and GPS operations.',
      documents: ['OOW Certificate', 'Sea Service Certificate', 'Medical Certificate', 'Passport Size Photos (6)', 'Identity Proof']
    },
    'marine-engineering': {
      title: 'Marine Engineering',
      duration: '6 Weeks',
      fees: '₹45,000',
      eligibility: 'Engineering Degree, Age 21-40 years',
      description: 'Comprehensive marine engineering course covering engine room operations, maintenance procedures, and safety protocols.',
      documents: ['Engineering Degree', 'Medical Certificate', 'Passport Size Photos (6)', 'Experience Certificate', 'Identity Proof']
    },
    'electro-technical': {
      title: 'Electro-Technical Officer',
      duration: '8 Weeks',
      fees: '₹55,000',
      eligibility: 'Electrical Engineering Degree, Age 21-40 years',
      description: 'Specialized training for electro-technical officers covering electrical systems, automation, and control systems on ships.',
      documents: ['Electrical Engineering Degree', 'Medical Certificate', 'Passport Size Photos (6)', 'Experience Certificate', 'Identity Proof']
    },
    'engine-watchkeeping': {
      title: 'Engine Watchkeeping',
      duration: '3 Weeks',
      fees: '₹28,000',
      eligibility: 'Engine Cadet Certificate, Age 18-40 years',
      description: 'Training for engine room watchkeeping duties including machinery operation, maintenance, and safety procedures.',
      documents: ['CDC Certificate', 'Educational Certificate', 'Medical Certificate', 'Passport Size Photos (6)', 'Experience Certificate']
    },
    'ship-cook': {
      title: 'Ship Cook',
      duration: '2 Weeks',
      fees: '₹12,000',
      eligibility: 'Class 8th Pass, Age 18-45 years',
      description: 'Training for ship catering services including food preparation, hygiene standards, and galley management.',
      documents: ['Educational Certificate', 'Medical Certificate', 'Passport Size Photos (4)', 'Identity Proof', 'Experience Certificate (if any)']
    },
    'food-safety': {
      title: 'Food Safety & Hygiene',
      duration: '1 Week',
      fees: '₹8,000',
      eligibility: 'Class 8th Pass, Age 18-50 years',
      description: 'Essential food safety and hygiene training for catering personnel on ships.',
      documents: ['Educational Certificate', 'Medical Certificate', 'Passport Size Photos (4)', 'Identity Proof']
    },
    'stcw-basic': {
      title: 'STCW Basic Safety',
      duration: '1 Week',
      fees: '₹18,000',
      eligibility: 'Class 10th Pass, Age 18-35 years',
      description: 'STCW basic safety training including personal survival techniques, fire prevention, elementary first aid, and personal safety.',
      documents: ['Educational Certificate', 'Age Proof', 'Medical Certificate', 'Passport Size Photos (4)', 'Identity Proof']
    },
    'fire-fighting': {
      title: 'Advanced Fire Fighting',
      duration: '3 Days',
      fees: '₹10,000',
      eligibility: 'Basic Safety Certificate, Age 18-45 years',
      description: 'Advanced fire fighting techniques and emergency response procedures for maritime personnel.',
      documents: ['Basic Safety Certificate', 'Medical Certificate', 'Passport Size Photos (4)', 'Identity Proof']
    },
    'medical-first-aid': {
      title: 'Medical First Aid',
      duration: '3 Days',
      fees: '₹9,000',
      eligibility: 'Basic Safety Certificate, Age 18-50 years',
      description: 'Medical first aid training for maritime personnel including emergency medical procedures.',
      documents: ['Basic Safety Certificate', 'Medical Certificate', 'Passport Size Photos (4)', 'Identity Proof']
    },
    'radar': {
      title: 'Radar Navigation',
      duration: '2 Weeks',
      fees: '₹22,000',
      eligibility: 'OOW Certificate, Age 21-45 years',
      description: 'Specialized radar navigation training including ARPA operations and collision avoidance.',
      documents: ['OOW Certificate', 'Medical Certificate', 'Passport Size Photos (6)', 'Experience Certificate', 'Identity Proof']
    },
    'gmdss': {
      title: 'GMDSS',
      duration: '2 Weeks',
      fees: '₹20,000',
      eligibility: 'Radio Operator License, Age 18-45 years',
      description: 'Global Maritime Distress and Safety System operations and maintenance training.',
      documents: ['Radio Operator License', 'Medical Certificate', 'Passport Size Photos (6)', 'Educational Certificate', 'Identity Proof']
    },
    'dangerous-goods': {
      title: 'Dangerous Goods',
      duration: '1 Week',
      fees: '₹15,000',
      eligibility: 'Basic Safety Certificate, Age 21-50 years',
      description: 'Training for handling and transportation of dangerous goods in maritime environment.',
      documents: ['Basic Safety Certificate', 'Medical Certificate', 'Passport Size Photos (4)', 'Experience Certificate', 'Identity Proof']
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleContinue = () => {
    if (specificCourse && commencementDate) {
      setCurrentStep('information');
    } else {
      alert('Please select both course and commencement date to continue.');
    }
  };

  const handleBackToSelection = () => {
    setCurrentStep('selection');
  };

  const handleNextStep = () => {
    // This will be the next step in the booking process
    alert('Next step in booking process will be implemented here!');
  };

  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBookNow = () => {
    if (personalInfo.name && personalInfo.email && personalInfo.phone) {
      alert('Booking submitted successfully! We will contact you soon.');
    } else {
      alert('Please fill in all required fields (Name, Email, Phone Number).');
    }
  };

  const handleAddToCart = () => {
    if (personalInfo.name && personalInfo.email && personalInfo.phone) {
      alert('Course added to cart successfully!');
    } else {
      alert('Please fill in all required fields (Name, Email, Phone Number).');
    }
  };

  // Get current course data
  const currentCourse = courseData[specificCourse] || null;

  return (
    <div className="booking-portal-page">

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <button className="sidebar-close" onClick={closeSidebar}>
            ×
          </button>
        </div>
        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            <li className="sidebar-item">
              <a href="#home" className="sidebar-link" onClick={onClose}>
                <img src={homeIcon} alt="Home" className="sidebar-icon" />
                <span className="sidebar-text">Home</span>
              </a>
            </li>
            <li className="sidebar-item active">
              <a href="#courses" className="sidebar-link">
                <img src={courseIcon} alt="Courses" className="sidebar-icon" />
                <span className="sidebar-text">Courses</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a href="#services" className="sidebar-link" onClick={onClose}>
                <img src={servicesIcon} alt="Services" className="sidebar-icon" />
                <span className="sidebar-text">Services</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a href="#blogs" className="sidebar-link" onClick={onClose}>
                <img src={blogIcon} alt="Blogs" className="sidebar-icon" />
                <span className="sidebar-text">Blogs</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a href="#about" className="sidebar-link" onClick={onClose}>
                <img src={aboutIcon} alt="About us" className="sidebar-icon" />
                <span className="sidebar-text">About us</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a href="#contact" className="sidebar-link" onClick={onClose}>
                <img src={contactIcon} alt="Contact" className="sidebar-icon" />
                <span className="sidebar-text">Contact</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a href="#login" className="sidebar-link" onClick={onClose}>
                <img src={logoutIcon} alt="Login" className="sidebar-icon" />
                <span className="sidebar-text">Login</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a href="#register" className="sidebar-link" onClick={onClose}>
                <img src={RegisterIcon} alt="Register" className="sidebar-icon" />
                <span className="sidebar-text">Register</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      {/* Navbar */}
      <nav className="booking-navbar">
        <div className="booking-navbar-left">
          <button className="booking-menu-btn" onClick={toggleSidebar}>
            <i className="fas fa-bars"></i>
          </button>
          <div className="booking-navbar-logo" onClick={onClose}>
            <img src={logo} alt="Hari Om Thalassic Logo" />
            <span>Hari Om Thalassic</span>
          </div>
        </div>

        <div className="booking-navbar-right">
          <div className="booking-navbar-time">
            <i className="fas fa-clock"></i>
            <span>06:27 AM</span>
          </div>
          <button className="booking-notification-btn">
            <i className="fas fa-bell"></i>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="booking-main">
        <div className="course-selection">
          <div className="course-icon">
            <i className="fas fa-graduation-cap"></i>
          </div>
          
          <h2>Select Your Course</h2>
          <p>Choose from our comprehensive range of DGS approved maritime courses</p>

          <form className="course-form">
            <div className="form-row">
              <div className="form-group">
                <label>
                  <i className="fas fa-list"></i> Course Category
                </label>
                <select 
                  value={courseCategory} 
                  onChange={(e) => setCourseCategory(e.target.value)}
                  className="form-select"
                >
                  <option value="">Select Course Category</option>
                  <option value="deck">Deck Department</option>
                  <option value="engine">Engine Department</option>
                  <option value="catering">Catering Department</option>
                  <option value="safety">Safety Training</option>
                  <option value="specialized">Specialized Courses</option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  <i className="fas fa-bookmark"></i> Specific Course
                </label>
                <select 
                  value={specificCourse} 
                  onChange={(e) => setSpecificCourse(e.target.value)}
                  className="form-select"
                  disabled={!courseCategory}
                >
                  <option value="">First Select Course Category</option>
                  {courseCategory === 'deck' && (
                    <>
                      <option value="basic-safety">Basic Safety Training</option>
                      <option value="watchkeeping">Watchkeeping</option>
                      <option value="navigation">Navigation</option>
                    </>
                  )}
                  {courseCategory === 'engine' && (
                    <>
                      <option value="marine-engineering">Marine Engineering</option>
                      <option value="electro-technical">Electro-Technical Officer</option>
                      <option value="engine-watchkeeping">Engine Watchkeeping</option>
                    </>
                  )}
                  {courseCategory === 'catering' && (
                    <>
                      <option value="ship-cook">Ship Cook</option>
                      <option value="food-safety">Food Safety & Hygiene</option>
                    </>
                  )}
                  {courseCategory === 'safety' && (
                    <>
                      <option value="stcw-basic">STCW Basic Safety</option>
                      <option value="fire-fighting">Advanced Fire Fighting</option>
                      <option value="medical-first-aid">Medical First Aid</option>
                    </>
                  )}
                  {courseCategory === 'specialized' && (
                    <>
                      <option value="radar">Radar Navigation</option>
                      <option value="gmdss">GMDSS</option>
                      <option value="dangerous-goods">Dangerous Goods</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>
                <i className="fas fa-calendar"></i> Commencement Date
              </label>
              <select 
                value={commencementDate} 
                onChange={(e) => setCommencementDate(e.target.value)}
                className="form-select"
              >
                <option value="">Select Course First</option>
                <option value="2025-02-01">February 1, 2025</option>
                <option value="2025-02-15">February 15, 2025</option>
                <option value="2025-03-01">March 1, 2025</option>
                <option value="2025-03-15">March 15, 2025</option>
                <option value="2025-04-01">April 1, 2025</option>
              </select>
            </div>
          </form>
        </div>
        
      </main>
    


        {/* Course Information Section - Only show when course is selected */}
        {specificCourse && (
          <div className="course-info-section">
            <div className="course-info-header-area">
              <div className="course-info-header-top-border"></div>
              <div className="course-info-header-content">
                <div className="course-info-header-icon-container">
                  <i className="fas fa-file-alt"></i>
                </div>
                <div className="course-info-header-title">
                  Course Information
                </div>
              </div>
            </div>
            <div className="course-info-grid">
              <div className="course-info-row">
                <div className="course-card course-card-duration">
                  <div className="course-card-icon" style={{ backgroundColor: "#06b6d4" }}>
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="course-card-title">Duration</div>
                  <div className="course-card-content">
                    {currentCourse ? currentCourse.duration : 'N/A'}
                  </div>
                </div>
                <div className="course-card course-card-fees">
                  <div className="course-card-icon" style={{ backgroundColor: "#22c55e" }}>
                    <i className="fas fa-money-bill-wave"></i>
                  </div>
                  <div className="course-card-title">Course Fees</div>
                  <div className="course-card-content">
                    {currentCourse ? currentCourse.fees : 'N/A'}
                  </div>
                </div>
                <div className="course-card course-card-eligibility">
                  <div className="course-card-icon" style={{ backgroundColor: "#f97316" }}>
                    <i className="fas fa-user-check"></i>
                  </div>
                  <div className="course-card-title">Eligibility</div>
                  <div className="course-card-content">
                    {currentCourse ? currentCourse.eligibility : 'N/A'}
                  </div>
                </div>
              </div>
              <div className="course-info-row">
                <div className="course-card course-card-description">
                  <div className="course-card-icon" style={{ backgroundColor: "#0f3c3d" }}>
                    <i className="fas fa-align-left"></i>
                  </div>
                  <div className="course-card-title">Description</div>
                  <div className="course-card-content">
                    {currentCourse ? currentCourse.description : 'N/A'}
                  </div>
                </div>
                <div className="course-card course-card-documents">
                  <div className="course-card-icon" style={{ backgroundColor: "#0f3c3d" }}>
                    <i className="fas fa-folder-open"></i>
                  </div>
                  <div className="course-card-title">Required Documents</div>
                  <div className="course-card-content">
                    {currentCourse && currentCourse.documents ? (
                      <ul>
                        {currentCourse.documents.map((doc, index) => (
                          <li key={index}>{doc}</li>
                        ))}
                      </ul>
                    ) : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Personal Info Section - Show when course is selected */}
        {specificCourse && (
          <div className="personal-info-section">
            <div className="personal-info-header">
              <div className="personal-info-header-area">
                <div className="personal-info-header-top-border"></div>
                <div className="personal-info-header-content">
                  <div className="personal-info-header-icon-container">
                    <i className="fas fa-user"></i>
                  </div>
                  <div className="personal-info-header-title">
                    Personal Info
                  </div>
                </div>
              </div>
            </div>

            <div className="personal-info-form">
              <div className="form-row">
                <div className="form-group">
                  <label>
                    <i className="fas fa-user"></i> Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={personalInfo.name}
                    onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <i className="fas fa-envelope"></i> Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={personalInfo.email}
                    onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    <i className="fas fa-phone"></i> Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={personalInfo.phone}
                    onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <i className="fas fa-briefcase"></i> Experience
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your experience (optional)"
                    value={personalInfo.experience}
                    onChange={(e) => handlePersonalInfoChange('experience', e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            <div className="booking-actions">
              <button className="btn-add-to-cart" onClick={handleAddToCart}>
                Add to Cart
              </button>
              <button className="btn-book-now" onClick={handleBookNow}>
                Book Now
              </button>
            </div>
          </div>
        )}

    </div>
  );
};

export default BookingPortal;
