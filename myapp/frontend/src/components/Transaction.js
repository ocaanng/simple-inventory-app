import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import '../style/Transaction.css';
import profileIcon from '../icon/profile.png';
import dashboardIcon from '../icon/dashboard.png';
import productsIcon from '../icon/product.png';
import transactionsIcon from '../icon/transaction.png';
import usersIcon from '../icon/user.png';
import logoutIcon from '../icon/logout.png';

function Transaction() {
  const [transactions, setTransactions] = useState([]);
  const [fullName, setFullName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:8000/transactions');
        setTransactions(response.data.transactions);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      }
    };
    fetchTransactions();

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
      await axios.delete(`http://localhost:8000/transactions/${transactionToDelete}`);
      const response = await axios.get('http://localhost:8000/transactions');
      setTransactions(response.data.transactions);
      console.log(`Transaction with ID ${transactionToDelete} deleted successfully.`);
      setShowModal(false);
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      setShowModal(false);
    }
  };

  const openModal = (transactionId) => {
    setTransactionToDelete(transactionId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTransactionToDelete(null);
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
          <li className="active">
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
        <div className="transaction-container">
          <h1>Transaction History</h1>
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Product ID</th>
                <th>Total</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.transaction_id}>
                  <td>{transaction.transaction_id}</td>
                  <td>{transaction.date}</td>
                  <td>{transaction.product_id}</td>
                  <td>${transaction.total}</td>
                  <td>{transaction.quantity}</td>
                  <td>
                    <button className="action-button" onClick={() => openModal(transaction.transaction_id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="add-transaction-button">
            <Link to="/add-transaction" className="add-transaction-button">
              Add Transaction
            </Link>
          </button>
        </div>
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Confirm Deletion</h2>
              <p>Are you sure you want to delete this transaction?</p>
              <button className="modal-button confirm" onClick={handleDelete}>Yes</button>
              <button className="modal-button cancel" onClick={closeModal}>No</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Transaction;