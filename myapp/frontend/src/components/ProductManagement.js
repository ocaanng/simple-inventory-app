import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import '../style/ProductManagement.css';
import profileIcon from '../icon/profile.png';
import dashboardIcon from '../icon/dashboard.png';
import productsIcon from '../icon/product.png';
import transactionsIcon from '../icon/transaction.png';
import usersIcon from '../icon/user.png';
import logoutIcon from '../icon/logout.png';

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [fullName, setFullName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const history = useHistory();

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
      await axios.delete(`http://localhost:8000/products/${productToDelete}`);
      const response = await axios.get('http://localhost:8000/products');
      setProducts(response.data.products);
      console.log(`Product with ID ${productToDelete} deleted successfully.`);
      setShowModal(false);
    } catch (error) {
      console.error('Failed to delete product:', error);
      setShowModal(false);
    }
  };

  const openModal = (productId) => {
    setProductToDelete(productId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setProductToDelete(null);
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
          <li className="active">
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
                    <button className="action-button" onClick={() => openModal(product.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="add-product-button">
            <Link to="/add-product" className="add-product-button">
              Add Product
            </Link>
          </button>
        </div>
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Confirm Deletion</h2>
              <p>Are you sure you want to delete this product?</p>
              <button className="modal-button confirm" onClick={handleDelete}>Yes</button>
              <button className="modal-button cancel" onClick={closeModal}>No</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ProductManagement;