import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import '../style/UserManagement.css';
import profileIcon from '../icon/profile.png';
import dashboardIcon from '../icon/dashboard.png';
import productsIcon from '../icon/product.png';
import transactionsIcon from '../icon/transaction.png';
import usersIcon from '../icon/user.png';
import logoutIcon from '../icon/logout.png';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [fullName, setFullName] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    fetchUsers();

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

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/users/${userToDelete}`);
      const response = await axios.get('http://localhost:8000/users');
      setUsers(response.data);
      console.log(`User with username ${userToDelete} deleted successfully.`);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const confirmDelete = (username) => {
    setUserToDelete(username);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setUserToDelete(null);
    setShowDeleteModal(false);
  };

  const logout = () => {
    localStorage.removeItem('username');
    history.push('/login');
  };

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
          <li className="active">
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
        <div className="user-management">
          <h1>Users</h1>
          <div className="user-cards">
            {users.map(user => (
              <div key={user.username} className="user-card">
                <img src={profileIcon} alt="User Profile" className="user-pic" />
                <p>{user.full_name}</p>
                <p><strong>Password:</strong> {'****'}</p>
                <p><strong>Username:</strong> {user.username}</p>
                <button className="delete-button" onClick={() => confirmDelete(user.username)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
        {showDeleteModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Confirm Deletion</h3>
              <p>Are you sure you want to delete the user <strong>{userToDelete}</strong>?</p>
              <button className="modal-button confirm" onClick={handleDelete}>Delete</button>
              <button className="modal-button cancel" onClick={cancelDelete}>Cancel</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default UserManagement;