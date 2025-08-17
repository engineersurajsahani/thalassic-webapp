import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

// Placeholder icons
const BookOpen = () => <span>[BO]</span>;
const FileText = () => <span>[FT]</span>;
const Users = () => <span>[U]</span>;
const Plus = () => <span>[+]</span>;
const BarChart3 = () => <span>[BC]</span>;
const Settings = () => <span>[S]</span>;
const X = () => <span>[X]</span>;

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const mainModules = [
    {
      name: "Course Booking Manager",
      path: "/",
      icon: BookOpen,
      active: location.pathname === "/"
    },
    {
      name: "Documentation Admin - DG",
      path: "/documentation",
      icon: FileText,
      active: location.pathname === "/documentation"
    },
    {
      name: "Documentation Admin - Flag State",
      path: "/flag-state",
      icon: FileText,
      active: location.pathname === "/flag-state"
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: Users,
      active: location.pathname === "/analytics"
    }
  ];

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar-container ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-close-button-wrapper">
          <button onClick={onClose} className="sidebar-close-button">
            <X />
          </button>
        </div>
        <div className="sidebar-content">
          <nav>
            {mainModules.map((module) => (
              <Link
                key={module.name}
                to={module.path}
                onClick={onClose}
                className={`nav-link ${module.active ? 'active' : ''}`}>
                <module.icon className="nav-link-icon" />
                {module.name}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
