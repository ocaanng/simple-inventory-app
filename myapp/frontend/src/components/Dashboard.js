import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import '../style/Dashboard.css';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import profileIcon from '../icon/profile.png';
import dashboardIcon from '../icon/dashboard.png';
import productsIcon from '../icon/product.png';
import transactionsIcon from '../icon/transaction.png';
import usersIcon from '../icon/user.png';
import logoutIcon from '../icon/logout.png';

function Dashboard() {
  const [fullName, setFullName] = useState('');
  const history = useHistory();

  useEffect(() => {
    const username = localStorage.getItem('username');
    // Jika tidak ada username di local storage, arahkan kembali ke halaman login
    if (!username) {
      history.push('/login');
    } else {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/user?username=${username}`);
          setFullName(response.data.full_name);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      };
      fetchUserData();
    }
  }, [history]);

  const logout = () => {
    localStorage.removeItem('username'); // Hapus username dari local storage saat logout
    history.push('/login'); // Redirect ke halaman login setelah logout
  };

  const data = [
    { name: 'Jan', sales: 4000, orders: 2400 },
    { name: 'Feb', sales: 3000, orders: 1398 },
    { name: 'Mar', sales: 2000, orders: 9800 },
    { name: 'Apr', sales: 2780, orders: 3908 },
    { name: 'May', sales: 1890, orders: 4800 },
    { name: 'Jun', sales: 2390, orders: 3800 },
    { name: 'Jul', sales: 3490, orders: 4300 },
  ];

  return (
    <div className="dashboard-container">
      <nav className="sidebar">
        <div className="sidebar-user">
          <img src={profileIcon} alt="User Profile" className="profile-pic" />
          <p>{fullName}</p>
        </div>
        <ul>
          <li>
            <Link to="/dashboard">
              <img src={dashboardIcon} alt="Dashboard Icon" className="sidebar-icon" /> 
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/products">
              <img src={productsIcon} alt="Products Icon" className="sidebar-icon" /> 
              Products
            </Link>
          </li>
          <li>
            <Link to="/transactions">
              <img src={transactionsIcon} alt="Transactions Icon" className="sidebar-icon" /> 
              Transactions
            </Link>
          </li>
          <li>
            <Link to="/users">
              <img src={usersIcon} alt="Users Icon" className="sidebar-icon" /> 
              Users
            </Link>
          </li>
          <li>
            <a onClick={logout}>
              <img src={logoutIcon} alt="Logout Icon" className="sidebar-icon" /> 
              Log Out
            </a>
          </li>
        </ul>
      </nav>
      <main className="main-content">
        <header className="dashboard-header">
          <h1>Welcome, {fullName}</h1>
        </header>
        <div className="stats">
          <div className="stat-card">
            <h2>Total Sales</h2>
            <p className="text-green">$30,412</p>
            <p>↑ 1.5% vs last Month</p>
          </div>
          <div className="stat-card">
            <h2>Total Orders</h2>
            <p className="text-red">$12,980</p>
            <p>↓ 0.7% vs last Month</p>
          </div>
        </div>
        <div className="chart-container">
          <h2>Sales and Orders Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <Line type="monotone" dataKey="sales" stroke="#8884d8" />
              <Line type="monotone" dataKey="orders" stroke="#82ca9d" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
