import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ProductManagement.css';

function ProductManagement() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/products');
        setProducts(response.data.products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    fetchProducts();
  }, []);


  return (
    <div className="dashboard-container">
      <nav className="sidebar">
        <div className="sidebar-user">
        </div>
        <ul>
          <li><Link to="/dashboard"><i className="fas fa-tachometer-alt"></i> Dashboard</Link></li>
          <li className="active"><Link to="/product"><i className="fas fa-box"></i> Product</Link></li>
          <li><Link to="/transactions"><i className="fas fa-exchange-alt"></i> Transaction</Link></li>
          <li><Link to="/users"><i className="fas fa-users"></i> User</Link></li>
          <li><Link to="/logout"><i className="fas fa-sign-out-alt"></i> Log Out</Link></li>
        </ul>
      </nav>
      <main className="main-content">
        <div className="product-management">
          <h1>Products</h1>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Id</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Image</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.id}</td>
                  <td>{product.category}</td>
                  <td>{product.stock}</td>
                  <td>${product.price}</td>
                  <td><img src={product.image_url} alt={product.name} width="50" /></td>
                  <td>
                    <button>Edit</button>
                    <button>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="add-product-button"><Link to="/add-product" className="add-product-button">Add Product</Link></button>
        </div>
      </main>
    </div>
  );
}

export default ProductManagement;
