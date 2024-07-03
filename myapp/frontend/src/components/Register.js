import React, { useState } from 'react';
import axios from 'axios';
import '../style/Register.css'; // Import CSS file

function Register() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerError, setRegisterError] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/register', {
        full_name: fullName,
        username,
        password,
        role: 'user', // Assuming a default role for new users
      });
      setRegisterSuccess(true);
      setTimeout(() => {
        setRegisterSuccess(false);
      }, 3000); // Hide success message after 3 seconds
    } catch (error) {
      console.error('Registration failed:', error.response.data);
      setRegisterError(true);
      setTimeout(() => {
        setRegisterError(false);
      }, 3000); // Hide error message after 3 seconds
    }
  };
  

  return (
    <div className="login-container">
      <div className="login-left">
        <h1>Inventoryqu</h1>
      </div>
      <div className="login-right">
      {registerSuccess && (
      <div className="success-popup">
        <p>Registration successful!</p>
      </div>
    )}
    {registerError && (
      <div className="error-popup">
        <p>Registration failed. Please try again.</p>
      </div>
    )}
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
              required/>
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
              required
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
              required
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
