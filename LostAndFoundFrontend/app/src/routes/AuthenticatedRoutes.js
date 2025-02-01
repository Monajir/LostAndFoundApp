import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import AddItem from '../components/AddItem';
import ItemList from '../components/ItemList';
import Profile from '../components/Profile';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../provider/AuthProvider';
import ItemDetails from '../components/ItemDetails';
// Navbar for authenticated users
const AuthenticatedNavbar = () => {
    const navigate = useNavigate(); 
    
    const { logout } = useAuth();

    const handleLogout = () => {
      logout();
      navigate("/");
    };
  
    return (
      <nav className="navbar">
        <h1><span style={{color: '#B82132'}}>Lost</span> & Found</h1>
        <div className="nav-links">
          <Link to="/">Home</Link>  
          <Link to="/add">Add item</Link>
          <Link to="/profile">Profile</Link>
          {/* Use onClick for logout */}
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#333333', fontFamily: 'Montserrat, seriff', fontSize: '16px', fontWeight: '1000'}}>
            Logout
          </button>
        </div>
      </nav>
    );
  };

// Layout for authenticated users
const AuthenticatedLayout = ({ children }) => (
  <div className="app">
    <AuthenticatedNavbar />
    <main>{children}</main>
  </div>
);

// Routes for authenticated users
const AuthenticatedRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <AuthenticatedLayout>
          <ItemList />
        </AuthenticatedLayout>
        }
    />
    <Route
      path="/add"
      element={
        <AuthenticatedLayout>
          <AddItem />
        </AuthenticatedLayout>
      }
    />
    <Route
      path="/profile"
      element={
        <AuthenticatedLayout>
          <Profile />
        </AuthenticatedLayout>
      }
    />
    <Route
      path="/item/:id"
      element={
        <AuthenticatedLayout>
          <ItemDetails />
        </AuthenticatedLayout>
      }
    />
  </Routes>
);

export default AuthenticatedRoutes;
