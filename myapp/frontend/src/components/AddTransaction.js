import React, { useState } from 'react';
import axios from 'axios';
import './AddTransaction.css';

function AddTransaction() {
  const [transaction, setTransaction] = useState({
    transaction_id: '',
    date: '',
    product_id: '',
    total: '',
    quantity: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransaction(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/transactions', transaction);
      alert('Transaction added successfully');
      // Optionally, redirect or navigate back to the transaction list
    } catch (error) {
      console.error('Failed to add transaction:', error);
      alert('Failed to add transaction. Please try again.');
    }
  };

  return (
    <div className="add-transaction-container">
      <h1>Add New Transaction</h1>
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
    </div>
  );
}

export default AddTransaction;
