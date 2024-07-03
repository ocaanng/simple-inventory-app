import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import profileIcon from '../icon/profile.png';
import dashboardIcon from '../icon/dashboard.png';
import productsIcon from '../icon/product.png';
import transactionsIcon from '../icon/transaction.png';
import usersIcon from '../icon/user.png';
import logoutIcon from '../icon/logout.png';
import '../style/AddTransaction.css';

function AddTransaction() {
  const [transaction, setTransaction] = useState({
    transaction_id: '',
    date: '',
    product_id: '',
    total: '',
    quantity: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();
  const [fullName, setFullName] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // State for success message

  useEffect(() => {
    const fullNameFromStorage = localStorage.getItem('fullName');
    if (fullNameFromStorage) {
      setFullName(fullNameFromStorage);
    } else {
      setFullName('User');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransaction(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!transaction.transaction_id || !transaction.date || !transaction.product_id || !transaction.total || !transaction.quantity) {
      setErrorMessage('Please fill out all fields.');
      return;
    }
  
    try {
      await axios.post('http://localhost:8000/transactions', transaction);
      setShowSuccessMessage(true); // Set success message to true upon successful submission
      setTimeout(() => {
        setShowSuccessMessage(false); // Hide message after 3 seconds
        history.push('/transactions');
      }, 3000); // Redirect after 3 seconds
    } catch (error) {
      console.error('Failed to add transaction:', error);
      setErrorMessage('Failed to add transaction. Please try again.');
    }
  };

  const fetchUserData = async () => {
    const username = localStorage.getItem('username');
    try {
      const response = await axios.get(`http://localhost:8000/user?username=${username}`);
      setFullName(response.data.full_name);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const logout = () => {
    localStorage.removeItem('username');
    history.push('/login');
  };

  return (
    <div className="dashboard-container">
      {showSuccessMessage && (
        <div className="success-message">
          <p>Transaction added successfully!</p>
        </div>
      )}

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
        <h1>Add New Transaction</h1>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Transaction ID:</label>
            <input type="number" name="transaction_id" value={transaction.transaction_id} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Date:</label>
            <input type="date" name="date" value={transaction.date} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Product ID:</label>
            <input type="number" name="product_id" value={transaction.product_id} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Total:</label>
            <input type="number" step="0.01" name="total" value={transaction.total} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Quantity:</label>
            <input type="number" name="quantity" value={transaction.quantity} onChange={handleChange} required />
          </div>
          <button type="submit">Add Transaction</button>
        </form>
      </main>
    </div>
  );
}

export default AddTransaction;
