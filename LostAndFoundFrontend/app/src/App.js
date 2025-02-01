import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import { useState, useEffect } from "react";
import { useAuth } from './provider/AuthProvider';
import AuthenticatedRoutes from './routes/AuthenticatedRoutes'
import RoutesForNotAuthenticatedOnly from './routes/Non-authenticatedRoutes';

function App() {

  const {isAuthenticated} = useAuth();

  return (

    <Router>
      {isAuthenticated ? <AuthenticatedRoutes /> : <RoutesForNotAuthenticatedOnly />}
    </Router>
  );
}

export default App;