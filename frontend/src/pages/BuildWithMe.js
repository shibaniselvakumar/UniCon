import React from 'react';
import './BuildWithMe.css';

const BuildWithMe = () => {
  return (
    <>
      {/* Gradient Header */}
      <div className="build-header-section">
        <h1 className="header-title">🚀 Build With Me</h1>
        <p className="header-subtitle">Collaborate, code, and create impactful projects with your peers</p>
      </div>

      {/* Features Grid */}
      <div className="build-wrapper">
        <div className="features-grid">
          <div className="feature-card fade-in">
            <span className="feature-icon">👥</span>
            <h3>Find Teammates</h3>
            <p>Match with peers based on skills and interests.</p>
          </div>

          <div className="feature-card fade-in">
            <span className="feature-icon">💡</span>
            <h3>Project Ideas</h3>
            <p>Browse curated lists of innovative ideas.</p>
          </div>

          <div className="feature-card fade-in">
            <span className="feature-icon">🛠️</span>
            <h3>Live Build Spaces</h3>
            <p>Collaborate in real-time rooms with version control.</p>
          </div>

          <div className="feature-card fade-in">
            <span className="feature-icon">📈</span>
            <h3>Track Progress</h3>
            <p>Set goals, assign tasks, and monitor your timeline.</p>
          </div>

          <div className="feature-card fade-in">
            <span className="feature-icon">🗂️</span>
            <h3>Showcase Projects</h3>
            <p>Highlight your work and add to your UniCon profile.</p>
          </div>

          
        </div>
      </div>
    </>
  );
};

export default BuildWithMe;
