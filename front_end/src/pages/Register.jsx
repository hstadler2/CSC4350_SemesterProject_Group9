// src/pages/Register.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Only patients register here
const Register = () => {
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Get Supabase auth helper
  const auth = useAuth() || {};
  const { signUpNewUser } = auth;

  const handleChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!signUpNewUser) {
      setError("Authentication is not initialized. Please refresh.");
      setLoading(false);
      return;
    }

    // Make sure passwords match
    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    // Call Supabase sign-up
    const result = await signUpNewUser(signupData.email, signupData.password, {
      firstName: signupData.firstName,
      lastName: signupData.lastName,
      role: "patient", // fixed role
    });

    setLoading(false);

    if (result.success) {
      alert("Account was created successfully");
      navigate("/login");
    } else {
      setError(result.error?.message || "Failed to create account");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* top brand + tabs */}
        <header className="auth-header">
          <div className="auth-brand">CampusCare</div>

          <nav className="auth-tabs">
            <NavLink to="/login" className="auth-tab">
              Log in
            </NavLink>
            <NavLink to="/register" className="auth-tab auth-tab--active">
              Register
            </NavLink>
          </nav>
        </header>

        {/* title + subtitle */}
        <div className="auth-intro">
          <h1>Create account</h1>
          <p>Sign up as a patient to manage your care with MediTrack.</p>
        </div>

        {/* form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {/* first + last name side by side */}
          <div className="form-row form-row--two">
            <div>
              <label htmlFor="firstName">
                <span>First name</span>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={signupData.firstName}
                  onChange={handleChange}
                  required
                  className="auth-input"
                />
              </label>
            </div>

            <div>
              <label htmlFor="lastName">
                <span>Last name</span>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={signupData.lastName}
                  onChange={handleChange}
                  required
                  className="auth-input"
                />
              </label>
            </div>
          </div>

          {/* email */}
          <div className="form-row">
            <label htmlFor="email">
              <span>Email</span>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.edu"
                value={signupData.email}
                onChange={handleChange}
                required
                className="auth-input"
              />
            </label>
          </div>

          {/* password + confirm password side by side */}
          <div className="form-row form-row--two">
            <div>
              <label htmlFor="password">
                <span>Password</span>
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={signupData.password}
                  onChange={handleChange}
                  required
                  className="auth-input"
                />
              </label>
            </div>

            <div>
              <label htmlFor="confirmPassword">
                <span>Confirm password</span>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="Retype password"
                  value={signupData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="auth-input"
                />
              </label>
            </div>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?
          <NavLink to="/login" className="auth-link">
            &nbsp;Log in
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Register;
