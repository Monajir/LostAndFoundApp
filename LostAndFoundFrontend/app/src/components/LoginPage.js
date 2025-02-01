import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";
import "./LoginPage.css";
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setToken, setIsAuthenticated } = useAuth(); // object de-structuring
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await axios.post("http://localhost:8081/public/login", {
        name,
        password,
      });
      // response.data is a string. So, if u want to store it in a variable do it as const token = response.data not like const {token} = response.data, we don't need to destructure as backend returns only a string
      setToken(response.data);
      setIsAuthenticated(true);
      localStorage.setItem("accessToken", response.data); // Save token for future requests
      navigate("/"); 
    } catch (err) {
      console.log(err);
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Welcome Back!</h1>
        <p className="login-subtitle">Please log in to continue</p>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Login
          </button>
        </form>
        <div className="register-link">
          Don't have an account? <Link to={'/register'} className="custom-link">Register here</Link>
          {/* <a href="/register">Register here</a> */}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
