import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { motion } from 'framer-motion';
import { FaUserFriends, FaTools, FaBookOpen } from 'react-icons/fa';

const Dashboard = () => {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState(''); // State for the typed text
  const text = "Buuild. Collaborate. Shine in the Galaxy of Innovation."; // The text to type

  useEffect(() => {
    let index = 0;
    let typingInterval; // To hold the typing interval reference

    // Typing speed
    const typingSpeed = 100; // 100ms per character

    // Function to type the text one character at a time
    const typeText = () => {
      if (index < text.length-1) {
        setTypedText((prevText) => prevText + text[index]); // Append the next character
        index++;
      } else {
        clearInterval(typingInterval); // Stop typing once text is fully typed
      }
    };

    // Check if the text is not undefined or empty before starting the typing effect
    if (text !== undefined && text !== '') {
      setTypedText(''); // Reset typed text when component mounts
      typingInterval = setInterval(typeText, typingSpeed); // Start typing effect
    }

    // Cleanup function to clear the typing interval if the component unmounts
    return () => {
      clearInterval(typingInterval);
    };
  }, []); // Empty dependency array to ensure this only runs once


  return (
    <div className="dashboard-wrapper">
      {/* Navbar */}
      <nav className="navbar">
        <div className="app-name">🪐 UniCon</div>
        <div className="nav-links">
          <span>Dashboard</span>
          <span>Profile</span>
          <span>Logout</span>
        </div>
      </nav>

      {/* Cinematic Hero Section */}
      <section className="hero">
      
        <div className="hero-content">
          <h1 className="hero-title">
            {typedText} {/* Display typed text here */}
          </h1>
          <p>
            Join forces with students across dimensions. One platform. Infinite possibilities.
          </p>
          <div className="scroll-indicator">▼</div>
        </div>
      </section>

      {/* Main Features */}
      <section className="starbackground">
      <main className="dashboard-content">
      <h2 className='feature-title'>🚀 Mission Control</h2>
        <motion.div
          className="features-container"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          
          <div className="feature-card">
            <video src="/videos/study.mp4" autoPlay loop muted playsInline className="feature-bg" />
            <div className="feature-content">
              <div className="feature-card-icon"><FaUserFriends /></div>
              <h3>Study Lounge</h3>
              <p>Join topic-focused study rooms, track time, and collaborate with students live.</p>
              <button onClick={() => navigate('/study-lounge')}>Explore</button>
            </div>
          </div>

          <div className="feature-card">
            <video src="/videos/build.mp4" autoPlay loop muted playsInline className="feature-bg" />
            <div className="feature-content">
              <div className="feature-card-icon"><FaTools /></div>
              <h3>Build With Me</h3>
              <p>Post and join projects, manage tasks, and build amazing things together.</p>
              <button onClick={() => navigate('/buildwithme')}>Start Building</button>
            </div>
          </div>

          <div className="feature-card">
            <video src="/videos/resource.mp4" autoPlay loop muted playsInline className="feature-bg" />
            <div className="feature-content">
              <div className="feature-card-icon"><FaBookOpen /></div>
              <h3>Resource Hub</h3>
              <p>Share notes, upload materials, and access useful content from across campuses.</p>
              <button onClick={() => navigate('/resourcehub')}>Browse Resources</button>
            </div>
          </div>
        </motion.div>
      </main>
      </section>

      {/* Gamification Panel */}
      <section className="gamification-panel">
        <h2>🚀 Your Mission Stats</h2>
        <div className="gamify-stats">
          <div className="gamify-card">
            <h4>XP Points</h4>
            <p>4,200</p>
          </div>
          <div className="gamify-card">
            <h4>Collaborations</h4>
            <p>12 Projects</p>
          </div>
          <div className="gamify-card">
            <h4>Study Time</h4>
            <p>95 Hours</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
