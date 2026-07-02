import React, { useState, useEffect } from "react";
import "../../styles/blog.css";

function BlogPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const formatTime = (time) => {
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const menuItems = [
    { text: 'Home', active: true },
    { text: 'Courses', active: false },
    { text: 'Services', active: false },
    { text: 'Blogs', active: false },
    { text: 'About us', active: false },
    { text: 'Contact', active: false },
    { text: 'Login', active: false },
    { text: 'Register', active: false }
  ];

  return (
    <div className="blog-page">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <button className="sidebar-close" onClick={toggleSidebar}>
            ×
          </button>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {menuItems.map((item, index) => (
              <li key={index}>
                <a 
                  href={`#${item.text.toLowerCase().replace(' ', '')}`}
                  className={item.active ? 'active' : ''}
                  onClick={toggleSidebar}
                >
                  <span className="nav-text">{item.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Header */}
      <header className="blog-header">
        <div className="left-section">
          <div className="menu-icon" onClick={toggleSidebar}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12h18M3 6h18M3 18h18" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="logo-container">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/d36f89b966d2ba0f2b29fcae06d07532d8c2fb65?width=212"
              alt="Hari Om Thalassic Logo"
              className="logo-image"
            />
            <span className="logo-text">Hari Om Thalassic</span>
          </div>
        </div>
        <div className="right-section">
          <div className="header-icon clock-display">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="#6b7280" strokeWidth="2"/>
              <polyline points="12,6 12,12 16,14" stroke="#6b7280" strokeWidth="2"/>
            </svg>
            <span className="time-text">{formatTime(currentTime)}</span>
          </div>
          <div className="header-icon notification">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="#6b7280" strokeWidth="2"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#6b7280" strokeWidth="2"/>
            </svg>
          </div>
          <div className="header-icon settings">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="3" stroke="#6b7280" strokeWidth="2"/>
              <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" stroke="#6b7280" strokeWidth="2"/>
            </svg>
          </div>
          <div className="profile-avatar">RK</div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <img
          src="/src/assets/port-image.jpg"
          alt="Maritime background"
          className="hero-image"
        />
        <div className="hero-text">
          <h1>Maritime Insights & Updates</h1>
          <p>
            Expert perspectives on industry trends, career advice, and maritime
            innovations
          </p>
        </div>
      </section>

      {/* Featured Section */}
      <section className="featured-section">
        <div className="featured-badge">Featured</div>
        <h2>Latest Maritime Insights</h2>
        <p>
          Discover expert perspectives on industry developments and career
          opportunities
        </p>

        <div className="blog-cards">
          {/* Card 1 */}
          <div className="blog-card">
            <div className="card-tag career">Career Guidance</div>
            <div className="card-meta">
              <span>15 May 2025</span> | <span>Capt. Raj Sharma</span>
            </div>
            <h3>Navigating Your Career Path: From Cadet to Captain</h3>
            <p>
              Essential milestones and strategies for advancing your maritime
              career through the ranks, with insights from experienced captains.
            </p>
            <button className="read-more">Read More →</button>
          </div>

          {/* Card 2 */}
          <div className="blog-card">
            <div className="card-tag industry">Industry Trends</div>
            <div className="card-meta">
              <span>8 May 2025</span> | <span>Dr. Ananya Patel</span>
            </div>
            <h3>Emerging Technologies Transforming Modern Shipping</h3>
            <p>
              How AI, blockchain, and green technologies are revolutionizing
              maritime operations and creating new career opportunities.
            </p>
            <button className="read-more">Read More →</button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Articles Section */}
        <section className="articles-section">
          <div className="section-header">
            <h2>Latest Articles</h2>
            <div className="search-bar">
              <input type="text" placeholder="Search Articles..." />
              <button className="search-btn">🔍</button>
            </div>
          </div>

          <div className="articles-grid">
            {/* Article 1 */}
            <article className="article-card">
              <div className="article-image">
                <img src="/src/assets/port-image.jpg" alt="Maritime Safety" />
                <div className="article-tag safety">Maritime Safety</div>
              </div>
              <div className="article-content">
                <div className="article-meta">
                  <span>12 May 2025</span>
                </div>
                <h3>Navigating New Safety Regulations in 2025</h3>
                <p>Comprehensive guide to the latest IMO safety regulations and their impact on maritime operations...</p>
                <button className="read-more">Read More</button>
              </div>
            </article>

            {/* Article 2 */}
            <article className="article-card">
              <div className="article-image">
                <img src="/src/assets/port-image.jpg" alt="Port Operations" />
                <div className="article-tag logistics">Logistics</div>
              </div>
              <div className="article-content">
                <div className="article-meta">
                  <span>10 May 2025</span>
                </div>
                <h3>Financial Planning for Seafarers: Managing Income at Sea</h3>
                <p>Essential financial strategies for maritime professionals to build wealth and secure their future...</p>
                <button className="read-more">Read More</button>
              </div>
            </article>

            {/* Article 3 */}
            <article className="article-card">
              <div className="article-image">
                <img src="/src/assets/port-image.jpg" alt="Green Shipping" />
                <div className="article-tag environment">Environment</div>
              </div>
              <div className="article-content">
                <div className="article-meta">
                  <span>8 May 2025</span>
                </div>
                <h3>The Future of Green Shipping: Sustainable Maritime Solutions</h3>
                <p>Exploring eco-friendly technologies and practices transforming the maritime industry...</p>
                <button className="read-more">Read More</button>
              </div>
            </article>

            {/* Article 4 */}
            <article className="article-card">
              <div className="article-image">
                <img src="/src/assets/port-image.jpg" alt="Maritime Technology" />
                <div className="article-tag technology">Technology</div>
              </div>
              <div className="article-content">
                <div className="article-meta">
                  <span>5 May 2025</span>
                </div>
                <h3>Essential Certifications for Modern Maritime Professionals</h3>
                <p>A comprehensive guide to the most valuable certifications in today's maritime industry...</p>
                <button className="read-more">Read More</button>
              </div>
            </article>

            {/* Article 5 */}
            <article className="article-card">
              <div className="article-image">
                <img src="/src/assets/port-image.jpg" alt="Maritime Career" />
                <div className="article-tag career">Career</div>
              </div>
              <div className="article-content">
                <div className="article-meta">
                  <span>3 May 2025</span>
                </div>
                <h3>Mental Health Strategies for Long Voyages</h3>
                <p>Practical approaches to maintaining psychological well-being during extended periods at sea...</p>
                <button className="read-more">Read More</button>
              </div>
            </article>

            {/* Article 6 */}
            <article className="article-card">
              <div className="article-image">
                <img src="/src/assets/port-image.jpg" alt="Digital Transformation" />
                <div className="article-tag digital">Digital</div>
              </div>
              <div className="article-content">
                <div className="article-meta">
                  <span>1 May 2025</span>
                </div>
                <h3>Digital Transformation in Port Operations</h3>
                <p>How smart port technologies are revolutionizing cargo handling and logistics management...</p>
                <button className="read-more">Read More</button>
              </div>
            </article>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <span className="page-dots">...</span>
            <button className="page-btn">Next</button>
          </div>
        </section>

        {/* Sidebar */}
        <aside className="sidebar-content">
          {/* Categories */}
          <div className="sidebar-widget">
            <h3>Categories</h3>
            <ul className="category-list">
              <li><a href="#">Career Guidance <span>15</span></a></li>
              <li><a href="#">Industry Trends <span>12</span></a></li>
              <li><a href="#">Safety & Compliance <span>8</span></a></li>
              <li><a href="#">Technology <span>6</span></a></li>
              <li><a href="#">Environmental <span>4</span></a></li>
            </ul>
          </div>

          {/* Popular Articles */}
          <div className="sidebar-widget">
            <h3>Popular Articles</h3>
            <div className="popular-articles">
              <div className="popular-item">
                <h4>How to Prepare for Your First Ship Assignment</h4>
                <span>25 Jan 2025</span>
              </div>
              <div className="popular-item">
                <h4>Understanding Maritime Communication Systems</h4>
                <span>20 Jan 2025</span>
              </div>
              <div className="popular-item">
                <h4>Global Transformation in Port Operations</h4>
                <span>15 Jan 2025</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer className="blog-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Maritime Training Institute</h4>
            <p>Professional maritime education and training programs designed to advance your career at sea.</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#">Training Courses</a></li>
              <li><a href="#">Sea Books</a></li>
              <li><a href="#">Simulator</a></li>
              <li><a href="#">About Institute</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Course Categories</h4>
            <ul>
              <li><a href="#">Deck Course</a></li>
              <li><a href="#">Advanced Training</a></li>
              <li><a href="#">Navigation</a></li>
              <li><a href="#">Open Source Programs</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact Information</h4>
            <p>📞 +91 999 999 9999</p>
            <p>📧 info@hariomthalassic.com</p>
            <p>📍 Mumbai, Maharashtra, India</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2024 Maritime Training Institute. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Preferences</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default BlogPage;
