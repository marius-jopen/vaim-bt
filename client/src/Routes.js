import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import FullVideo from './FullVideo';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/fullvideo" element={<FullVideo />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
