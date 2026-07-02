import React from 'react';
import { useAuth } from './AuthProvider';
import Index from './Index';
import Login from './Login';
import VerifyEmail from './VerifyEmail';
import VerifyPhone from './VerifyPhone';
import AccountVerified from './AccountVerified';
import './auth.css';

const AuthModal = () => {
  const { currentPage, userData, isAuthOpen, closeAuth, navigateTo, setUserData } = useAuth();

  if (!isAuthOpen) return null;

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login onNavigate={navigateTo} onClose={closeAuth} />;
      case 'verify-email':
        return <VerifyEmail onNavigate={navigateTo} userEmail={userData.email} onClose={closeAuth} />;
      case 'verify-phone':
        return <VerifyPhone onNavigate={navigateTo} userPhone={userData.phone} onClose={closeAuth} />;
      case 'account-verified':
        return <AccountVerified onNavigate={navigateTo} onClose={closeAuth} />;
      default:
        return <Index onNavigate={navigateTo} setUserData={setUserData} onClose={closeAuth} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50" 
        onClick={closeAuth}
      ></div>
      
      {/* Modal Content */}
      <div className="relative z-10 w-full h-full overflow-auto">
        {renderCurrentPage()}
      </div>
    </div>
  );
};

export default AuthModal;
