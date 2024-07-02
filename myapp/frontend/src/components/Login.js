import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // Import the CSS file

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/login', {
        username,
        password
      });
      console.log(response.data.msg);
      alert(response.data.msg);
      localStorage.setItem('username', username);  // Store username
      window.location.href = '/dashboard'; // Redirect to dashboard
    } catch (error) {
      console.error('Login failed:', error.response.data);
      alert('Login failed');
    }
  };
  

  return (
    <div className="login-container">
      <div className="login-left">
        <h1>Inventoryqu</h1>
      </div>
      <div className="login-right">
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Nice to see you again</h2>
          <div className="input-group">
            <label htmlFor="username">Login</label>
            <input type="text" id="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="login-button">Login</button>
          <p>Don't have an account? <a href="/register">Sign up now</a></p>
        </form>
      </div>
    </div>
  );
}

export default Login;
