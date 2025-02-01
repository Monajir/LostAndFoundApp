import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";

const RegistrationPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
    const navigate = useNavigate();

  const handleRegistration = async (e) => {
    e.preventDefault();

    // Validation
    if (!email || !name || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // If validation passes, proceed with registration
    setError("");
    // console.log("Registration Data:", { email, name, password });

    try{
        await axios.post("http://localhost:8081/public/signup", 
            {
                name,
                password,
                email,
            });
        navigate("/login")
    }catch(err) {
        console.log(err);
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Create an Account</h1>
        <p className="login-subtitle">Join us to get started</p>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleRegistration} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>
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
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Register
          </button>
        </form>
        <div className="register-link">
          Already have an account? <Link to={'/login'} className="custom-link">Login here</Link>
          {/* <a href="/login">Login here</a> */}
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
