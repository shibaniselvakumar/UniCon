// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register.js';
import Login from './pages/Login.js';
import Dashboard from './pages/Dashboard.js';
import StudyLounge from './pages/StudyLounge.js';
import BuildWithMe from './pages/BuildWithMe/BuildWithMe.js';
import ResourceHub from './pages/ResourceHub.js';
import FindProjects from './pages/BuildWithMe/FindProjects.js';
import PostProject from './pages/BuildWithMe/PostProject.js';
import MyProjects from './pages/BuildWithMe/MyProjects.js';
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
        <Route path="/buildwithme" element={<BuildWithMe/>} />
        <Route path="/buildwithme/find-projects" element={<FindProjects/>} />
        <Route path="/buildwithme/post-project" element={<PostProject/>} />
        <Route path="/buildwithme/my-projects" element={<MyProjects/>} />
        <Route path="/resourcehub" element={<ResourceHub/>} />
      </Routes>
    </Router>
  );
}

export default App;
