// src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css'; // Use the same Login.css
import galaxyBg from './assets/galaxy4.png'; // Adjust the path as necessary
import { FaRocket } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', college: '', year: '', password: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/student/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          college: formData.college,
          year: formData.year,
          password: formData.password, // Add password for registration
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Registered successfully!' , { className: 'toast-success' });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (err) {
      toast.error('Server error');
      console.error(err);
    }
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${galaxyBg})` }}>
      <ToastContainer />
      {/* Floating objects */}
      <div className="floating-object"></div>
      <div className="floating-object"></div>
      <div className="floating-object"></div>

      <div className="login-left">
        <h1 className="brand-name">UniCon</h1>
        <p className="tagline"><FaRocket style={{ marginRight: '8px' }} />Connect, Collaborate, Conquer the Cosmos.</p>
      </div>

      <motion.div
        className="login-right"
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, type: 'spring' }}
      >
        <div className="login-card">
          <h2>Register</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="college"
              placeholder="College"
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="year"
              placeholder="Year"
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
            <button  className='login-button'>Register</button>
          </form>
          <p className="register-link" onClick={() => navigate('/login')}>
            Already have an account? <span>Login</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
