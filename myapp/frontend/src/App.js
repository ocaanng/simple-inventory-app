import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Register from './components/Register'; // Ensure the path is correct
import Login from './components/Login'; // Ensure the path is correct
import Dashboard from './components/Dashboard';
import ProductManagement from './components/ProductManagement';
import AddProduct from './components/AddProduct';
import Transaction from './components/Transaction';
import AddTransaction from './components/AddTransaction';
import Users from './components/Users';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/products" component={ProductManagement} />
        <Route path="/add-transaction" component={AddTransaction} />
        <Route path="/add-product" component={AddProduct} />
        <Route path="/transactions" component={Transaction} />
        <Route path="/users" component={Users} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        {/* Add other routes here */}
      </Switch>
    </Router>
  );
}

export default App;
