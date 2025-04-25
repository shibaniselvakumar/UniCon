// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';
import galaxyBg from './assets/galaxy4.png'; // Adjust the path as necessary
import { FaRocket } from 'react-icons/fa';


const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const handleChange = (e) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });

  // src/pages/Login.js
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData),
    });
    const data = await res.json();

    if (res.ok && data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
     
      // Display personalized greeting toast
      const username = JSON.parse(localStorage.getItem('user'))  // Replace with actual username field
      toast.success(`Welcome aboard, Captain ${username.name} 👩‍🚀`, { className: 'toast-success' });
      
      setTimeout(() => navigate('/dashboard'), 2000);
    } else {
      toast.error(data.message || 'Login failed');
    }
  } catch (err) {
    toast.error('Server error');
    console.error(err);
  }
};


 // src/pages/Login.js
return (
  <div className="login-container" style={{ backgroundImage: `url(${galaxyBg})` }}>
    <ToastContainer />
    {/* Floating objects */}
    <div className="floating-object"></div>
    <div className="floating-object"></div>
    <div className="floating-object"></div>

    <div className="login-left">
      <h1 className="brand-name">UniCon</h1>

      <p className="tagline"> <FaRocket style={{ marginRight: '8px' }} />Connect, Collaborate, Conquer the Cosmos.</p>

    </div>

    <div
      className="login-right"
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, type: 'spring' }}
    >
      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button className='login-button'>Login</button>
        </form>
        <p className="register-link" onClick={() => navigate('/register')}>
          Don't have an account? <span>Register</span>
        </p>
      </div>
    </div>
  </div>
);

};

export default Login;
