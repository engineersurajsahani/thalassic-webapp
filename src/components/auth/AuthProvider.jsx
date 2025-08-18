import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('signup'); // 'signup', 'login', 'verify-email', 'verify-phone', 'account-verified'
  const [userData, setUserData] = useState({
    email: '',
    phone: '',
    fullName: '',
    userType: ''
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const openAuth = (page = 'signup') => {
    setCurrentPage(page);
    setIsAuthOpen(true);
  };

  const closeAuth = () => {
    setIsAuthOpen(false);
    setCurrentPage('signup');
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      // Simulate API call - replace with actual authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - replace with actual API response
      const mockUser = {
        id: '1',
        email: email,
        fullName: 'John Doe',
        phone: '+1234567890',
        userType: 'student', // Default to student for login
        profileComplete: true
      };
      
      // Store auth data
      localStorage.setItem('authToken', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      setIsAuthenticated(true);
      setUser(mockUser);
      setUserData(prev => ({ ...prev, email, fullName: mockUser.fullName }));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setUserData({ email: '', phone: '', fullName: '', userType: '' });
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUserData(userData);
      navigateTo('verify-email');
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentPage,
    userData,
    isAuthOpen,
    isAuthenticated,
    user,
    loading,
    setUserData,
    openAuth,
    closeAuth,
    navigateTo,
    login,
    logout,
    signup
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
