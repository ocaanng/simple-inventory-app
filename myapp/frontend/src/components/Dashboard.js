import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
  const [fullName, setFullName] = useState('');
  const history = useHistory();

  useEffect(() => {
    // Assume username is stored in localStorage after login
    const username = localStorage.getItem('username');
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/user?username=${username}`);
        setFullName(response.data.full_name);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const logout = () => {
    // Clear localStorage or session data here
    localStorage.removeItem('username');
    // Redirect to login page
    history.push('/login');
  };

  return (
    <div className="dashboard-container">
      <nav className="sidebar">
        <div className="sidebar-user">
        </div>
        <ul>
          <li><Link to="/dashboard"><i className="fas fa-tachometer-alt"></i> Dashboard</Link></li>
          <li><Link to="/products"><i className="fas fa-box"></i> Products</Link></li>
          <li><Link to="/transactions"><i className="fas fa-exchange-alt"></i> Transaction</Link></li>
          <li><Link to="/users"><i className="fas fa-users"></i> Users</Link></li>
          <li><a href="#" onClick={logout}><i className="fas fa-sign-out-alt"></i> Log Out</a></li>
        </ul>
      </nav>
      <main className="main-content">
        <h1>Welcome, {fullName}</h1>
        <div className="stats">
          <div className="stat-card">
            <h2>Total Sales</h2>
            <p>$30,412</p>
            <p>↑ 1.5% vs last Month</p>
          </div>
          <div className="stat-card">
            <h2>Total Order</h2>
            <p>$12,980</p>
            <p>↓ 0.7% vs last Month</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
