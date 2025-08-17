import "./global.css";
import { createRoot } from "react-dom/client";
import { useState } from "react";
import Index from "./pages/Index.jsx";
import Login from "./pages/Login.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import VerifyPhone from "./pages/VerifyPhone.jsx";
import AccountVerified from "./pages/AccountVerified.jsx";

const App = () => {
  const [currentPage, setCurrentPage] = useState('signup'); // 'signup', 'login', 'verify-email', 'verify-phone', 'account-verified'
  const [userData, setUserData] = useState({
    email: '',
    phone: '',
    fullName: ''
  });

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login onNavigate={setCurrentPage} />;
      case 'verify-email':
        return <VerifyEmail onNavigate={setCurrentPage} userEmail={userData.email} />;
      case 'verify-phone':
        return <VerifyPhone onNavigate={setCurrentPage} userPhone={userData.phone} />;
      case 'account-verified':
        return <AccountVerified onNavigate={setCurrentPage} />;
      default:
        return <Index onNavigate={setCurrentPage} setUserData={setUserData} />;
    }
  };

  return (
    <div>
      {renderCurrentPage()}
    </div>
  );
};

createRoot(document.getElementById("root")).render(<App />);
