// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const handleChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: loginData.email,
            password: loginData.password
          }),
          
      });
  
      const data = await res.json();
  
      if (res.ok) {
        alert('Login successful');
        // You can store user data if needed
        // localStorage.setItem('student', JSON.stringify(data.student));
        navigate('/dashboard'); // or any page you want
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (err) {
      alert('Server error');
      console.error(err);
    }
  };
  

  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
        <p onClick={() => navigate('/register')}>Don't have an account? Register</p>
      </form>
    </div>
  );
};

export default Login;
