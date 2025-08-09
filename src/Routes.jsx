import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/pages/Dashboard';
import Profile from './components/pages/Profile';
import Document from './components/pages/Document';
import Education from './components/pages/Education';
import Training from './components/pages/Training';
import SeaService from './components/pages/SeaService';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
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
