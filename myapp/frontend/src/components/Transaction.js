import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Transaction.css';

function Transaction() {
  const [transactions, setTransactions] = useState([]);

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
  }, []);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <nav className="sidebar">
        <div className="sidebar-user">
        </div>
        <ul>
          <li><Link to="/dashboard"><i className="fas fa-tachometer-alt"></i> Dashboard</Link></li>
          <li><Link to="/products"><i className="fas fa-box"></i> Product</Link></li>
          <li className="active"><Link to="/transaction"><i className="fas fa-exchange-alt"></i> Transaction</Link></li>
          <li><Link to="/users"><i className="fas fa-users"></i> User</Link></li>
          <li><Link to="/logout"><i className="fas fa-sign-out-alt"></i> Log Out</Link></li>
        </ul>
      </nav>

      {/* Main Content */}
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
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Button to Add Transaction */}
          <Link to="/add-transaction" className="add-transaction-button">Add Transaction</Link>
        </div>
      </main>
    </div>
  );
}

export default Transaction;
