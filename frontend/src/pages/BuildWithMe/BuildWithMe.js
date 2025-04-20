import React from 'react';
import './BuildWithMe.css';
import { Link } from 'react-router-dom';

const BuildWithMe = () => {
  return (
    <>
      <div className="build-header-section">
        <h1 className="header-title">🚀 Build With Me</h1>
        <p className="header-subtitle">
          Collaborate, code, and create impactful projects with your peers
        </p>
      </div>

      <div className="build-wrapper">
        <div className="features-grid">
          {/* Find Teammates */}
          <Link to="/buildwithme/find-projects" className="feature-card fade-in">
            <span className="feature-icon">👥</span>
            <h3>Find Projects</h3>
            <p>Match with peers based on skills and interests.</p>
          </Link>

          {/* Post a Project */}
          <Link to="/buildwithme/post-project" className="feature-card fade-in">
            <span className="feature-icon">💼</span>
            <h3>Post a Project</h3>
            <p>Create a new project and find teammates with specific skills.</p>
          </Link>

          {/* My Projects */}
          <Link to="/buildwithme/my-projects" className="feature-card fade-in">
            <span className="feature-icon">📂</span>
            <h3>My Projects</h3>
            <p>View and manage the projects you're involved in.</p>
          </Link>
        </div>
      </div>
    </>
  );
};

export default BuildWithMe;
