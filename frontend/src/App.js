// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register.js';
import Login from './pages/Login.js';
import Dashboard from './pages/Dashboard.js';
import StudyLounge from './pages/StudyLounge.js';
import './App.css'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/study-lounge" element={<StudyLounge />} />
      </Routes>
    </Router>
  );
}

export default App;
