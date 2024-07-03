import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import profileIcon from '../icon/profile.png';
import dashboardIcon from '../icon/dashboard.png';
import productsIcon from '../icon/product.png';
import transactionsIcon from '../icon/transaction.png';
import usersIcon from '../icon/user.png';
import logoutIcon from '../icon/logout.png';
import '../style/AddProduct.css';

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
  const [fullName, setFullName] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);


  useEffect(() => {
    const fullNameFromStorage = localStorage.getItem('fullName');
    if (fullNameFromStorage) {
      setFullName(fullNameFromStorage);
    } else {
      setFullName('User'); // Default name if not found in localStorage
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value
    });
  };

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

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.id || !newProduct.category || !newProduct.price || !newProduct.stock || !newProduct.image_url) {
      setErrorMessage('Please fill out all fields.');
      return;
    }
  
    try {
      await axios.post('http://localhost:8000/products', {
        name: newProduct.name,
        id: newProduct.id,
        category: newProduct.category,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        image_url: newProduct.image_url
      });
      setShowSuccessMessage(true); // Set success message to true upon successful addition
      setTimeout(() => {
        setShowSuccessMessage(false); // Hide message after 3 seconds
        history.push('/products');
      }, 3000); // Redirect after 3 seconds
    } catch (error) {
      console.error('Failed to add product:', error);
      setErrorMessage('Failed to add product. Please try again.');
    }
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
        <h1>Add Product</h1> <br></br>
        <div className="add-product">
          {errorMessage && <p className="error-message">{errorMessage}</p>}
    {showSuccessMessage && (
      <div className="success-message">
        <p>Product added successfully!</p>
      </div>
    )}
          <div className="add-product-form">
            <label>Name</label>
            <input type="text" name="name" placeholder="Type product name here..." value={newProduct.name} onChange={handleInputChange} />
            <label>Id</label>
            <input type="text" name="id" placeholder="Type product id here..." value={newProduct.id} onChange={handleInputChange} />
            <label>Category</label>
            <input type="text" name="category" placeholder="Type product category here..." value={newProduct.category} onChange={handleInputChange} />
            <label>Price</label>
            <input type="text" name="price" placeholder="Type product price here..." value={newProduct.price} onChange={handleInputChange} />
            <label>Stock</label>
            <input type="text" name="stock" placeholder="Type product stock here..." value={newProduct.stock} onChange={handleInputChange} />
            <label>Image url</label>
            <input type="text" name="image_url" placeholder="Paste your url image here..." value={newProduct.image_url} onChange={handleInputChange} />
            <button onClick={handleAddProduct}>Add Product</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AddProduct;
