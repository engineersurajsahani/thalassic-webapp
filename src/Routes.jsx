import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/pages/LandingPage';
import Dashboard from './components/pages/Dashboard';
import Profile from './components/pages/Profile';
import Document from './components/pages/Document';
import Education from './components/pages/Education';
import Training from './components/pages/Training';
import SeaService from './components/pages/SeaService';
import SignupPage from './components/auth/Index';
import LoginPage from './components/auth/Login';
import TestLogin from './components/auth/TestLogin';
import VerifyEmailPage from './components/auth/VerifyEmail';
import VerifyPhonePage from './components/auth/VerifyPhone';
import AccountVerifiedPage from './components/auth/AccountVerified';
import GetStarted from './components/pages/GetStarted';
import CoursePage from './components/courses/CoursePage';
import BlogPage from './components/blog/BlogPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminDocumentation from './components/admin/AdminDocumentation';
import AdminFlagState from './components/admin/AdminFlagState';
import AdminAnalytics from './components/admin/AdminAnalytics';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/courses" element={<CoursePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="documentation" element={<AdminDocumentation />} />
          <Route path="flag-state" element={<AdminFlagState />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Route>
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/verify-phone" element={<VerifyPhonePage />} />
        <Route path="/account-verified" element={<AccountVerifiedPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/overview" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/document" element={<Document />} />
        <Route path="/education" element={<Education />} />
        <Route path="/training" element={<Training />} />
        <Route path="/sea-service" element={<SeaService />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
