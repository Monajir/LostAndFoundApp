import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import LoginPage from '../components/LoginPage'; 
import ItemList from '../components/ItemList';
import RegistrationPage from '../components/RegistrationPage';
// import AddItem from 'components/AddItem';

// Navbar Component
const Navbar = () => (
  <nav className="navbar">
    <h1><span style={{color: '#B82132'}}>Lost</span> & Found</h1>
    <div className="nav-links">
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
    </div>
  </nav>
);

// Layout for Non-Authenticated Users
const NonAuthenticatedLayout = ({ children }) => (
  <div className="app">
    <Navbar />
    <main>{children}</main>
  </div>
);

// Routes for Non-Authenticated Users
const RoutesForNotAuthenticatedOnly = () => (
  <Routes>
    <Route
      path="/"
      element={
        <NonAuthenticatedLayout>
          <ItemList />
        </NonAuthenticatedLayout>
      }
    />
    <Route
      path="/login"
      element={
        <NonAuthenticatedLayout>
          <LoginPage />
        </NonAuthenticatedLayout>
      }
    />
    <Route
      path="/register"
      element={
        <NonAuthenticatedLayout>
          <RegistrationPage />
        </NonAuthenticatedLayout>
      }
    />
  </Routes>
);

export default RoutesForNotAuthenticatedOnly;
