import React from 'react';
import './Header.css';
import logo from '../assets/logo.png';

// Placeholder icons
const Menu = () => <span>[Menu]</span>;
const Clock = () => <span>[Clock]</span>;
const Bell = () => <span>[Bell]</span>;
const Settings = () => <span>[Settings]</span>;

const Header = ({ onToggleSidebar }) => {
  return (
    <header className="header-container">
      <div className="header-left">
        <button onClick={onToggleSidebar} className="sidebar-toggle-button">
          <Menu />
        </button>
        <div className="logo-container">
          <div className="logo-image-wrapper">
            {/* The logo will be added in the next step */}
            <img src={logo} alt="Hari Om Thalassic Logo" className="logo-image" />
          </div>
          <h1 className="header-title">Hari Om Thalassic</h1>
        </div>
      </div>
      <div className="header-right">
        <div className="time-display">
          <Clock />
          <span>06:27 AM</span>
        </div>
        <button className="icon-button-header">
          <Bell />
          <span className="notification-dot"></span>
        </button>
        <button className="icon-button-header">
          <Settings />
        </button>
        <button className="user-avatar">
          RK
        </button>
      </div>
    </header>
  );
};

export default Header;
