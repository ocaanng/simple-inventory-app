import React, { useState } from 'react';
import axios from 'axios';
import './Register.css'; // Import CSS file

function Register() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/register', {
        full_name: fullName,
        username,
        password,
        role: 'user', // Assuming a default role for new users
      });
      alert(response.data.msg);
    } catch (error) {
      console.error('Registration failed:', error.response.data);
      alert('Registration failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1>Inventoryqu</h1>
      </div>
      <div className="login-right">
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Register Now</h2>
          <div className="input-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="login-input"
            />
          </div>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
          </div>
          <button type="submit" className="login-button">
            Register
          </button>
          <p>Already have an account? <a href="/login">Login here</a></p>
        </form>
      </div>
    </div>
  );
}

export default Register;
