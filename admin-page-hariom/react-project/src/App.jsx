import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Documentation from './pages/Documentation';
import Analytics from './pages/Analytics';
import FlagState from './pages/FlagState';
import NotFound from './pages/NotFound';
import './App.css';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/documentation" element={<Documentation />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/flag-state" element={<FlagState />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
