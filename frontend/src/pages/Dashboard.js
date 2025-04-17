// src/pages/Dashboard.js
import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-wrapper">
      <nav className="navbar">
        <div className="app-name">UniCon</div>
        <div className="nav-links">
          <span>Dashboard</span>
          <span>Profile</span>
          <span>Logout</span>
        </div>
      </nav>

      <main className="dashboard-content">
        <h1>Welcome to UniCon</h1>
        <div className="features-container">
          <div className="feature-panel study">
            <h2>🧠 Study Lounge</h2>
            <p>A dedicated space to study together with global peers.</p>
            <button>Enter</button>
          </div>

          <div className="feature-panel build">
            <h2>🤝 Build With Me</h2>
            <p>Find collaborators and build exciting projects together.</p>
            <button>Explore</button>
          </div>

          <div className="feature-panel resources">
            <h2>📚 Resource Hub</h2>
            <p>Access notes, past papers, and curated learning materials.</p>
            <button>Browse</button>
          </div>
        </div>
      </main>
      {/* Gamification Panel */}
<div className="gamification-panel">
  <h2>🎮 Your Progress</h2>
  <div className="gamify-stats">
    <div className="gamify-card">
      <span className="icon">🏅</span>
      <div>
        <h4>Badges</h4>
        <p>Contributor, Team Player</p>
      </div>
    </div>
    <div className="gamify-card">
      <span className="icon">🌟</span>
      <div>
        <h4>Level</h4>
        <p>Level 3</p>
      </div>
    </div>
    <div className="gamify-card">
      <span className="icon">🔥</span>
      <div>
        <h4>Streak</h4>
        <p>5 days</p>
      </div>
    </div>
    <div className="gamify-card">
      <span className="icon">🎯</span>
      <div>
        <h4>Goal</h4>
        <p>3 of 5 tasks complete</p>
      </div>
    </div>
  </div>
</div>

    </div>
  );
};

export default Dashboard;
