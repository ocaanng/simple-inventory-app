import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import './AddProduct.css';

function AddProduct() {
  const [newProduct, setNewProduct] = useState({
    name: '',
    id: '',
    category: '',
    price: '',
    stock: '',
    image_url: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value
    });
  };

  const handleAddProduct = async () => {
    // Validate the inputs
    if (!newProduct.name || !newProduct.id || !newProduct.category || !newProduct.price || !newProduct.stock || !newProduct.image_url) {
      setErrorMessage('Please fill out all fields.');
      return;
    }
  
    try {
      console.log('New Product:', newProduct);
      await axios.post('http://localhost:8000/products', {
        name: newProduct.name,
        id: newProduct.id,
        category: newProduct.category,
        price: parseFloat(newProduct.price),  // Ensure price is a float
        stock: parseInt(newProduct.stock),    // Ensure stock is an integer
        image_url: newProduct.image_url
      });
      history.push('/product');
    } catch (error) {
      console.error('Failed to add product:', error);
      setErrorMessage('Failed to add product. Please try again.');
    }
  };
  
  return (
    <div className="dashboard-container">
      <nav className="sidebar">
        <div className="sidebar-user">
        </div>
        <ul>
          <li><Link to="/dashboard"><i className="fas fa-tachometer-alt"></i> Dashboard</Link></li>
          <li><Link to="/products"><i className="fas fa-box"></i> Products</Link></li>
          <li><Link to="/transaction"><i className="fas fa-exchange-alt"></i> Transaction</Link></li>
          <li><Link to="/users"><i className="fas fa-users"></i> Users</Link></li>
          <li><Link to="/logout"><i className="fas fa-sign-out-alt"></i> Log Out</Link></li>
        </ul>
      </nav>
      <main className="main-content">
        <div className="add-product">
          <h1>Add New Product</h1>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="add-product-form">
            <input type="text" name="name" placeholder="Product Name" value={newProduct.name} onChange={handleInputChange} />
            <input type="text" name="id" placeholder="Product ID" value={newProduct.id} onChange={handleInputChange} />
            <input type="text" name="category" placeholder="Category" value={newProduct.category} onChange={handleInputChange} />
            <input type="text" name="price" placeholder="Price" value={newProduct.price} onChange={handleInputChange} />
            <input type="text" name="stock" placeholder="Stock" value={newProduct.stock} onChange={handleInputChange} />
            <input type="text" name="image_url" placeholder="Image URL" value={newProduct.image_url} onChange={handleInputChange} />
            <button onClick={handleAddProduct}>Add Product</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AddProduct;
