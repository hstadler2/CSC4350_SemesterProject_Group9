import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// only patients sign up here
const Signup = () => {
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

    // make sure passwords match
    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    // call signUpNewUser func
    const result = await signUpNewUser(signupData.email, signupData.password, {
      firstName: signupData.firstName,
      lastName: signupData.lastName,
      role: "patient",
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
        {/* top brand + tabs like the GitHub repo */}
        <header className="auth-header">
          <div className="auth-brand">CampusCare</div>

          <nav className="auth-tabs">
            <NavLink to="/login" className="auth-tab">
              Log in
            </NavLink>
            <NavLink to="/signup" className="auth-tab auth-tab--active">
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
          <div className="form-row form-row--two">
            <div>
              <label htmlFor="firstName">First name</label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                placeholder="First name"
                value={signupData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="lastName">Last name</label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                placeholder="Last name"
                value={signupData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.edu"
              value={signupData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row form-row--two">
            <div>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={signupData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Retype password"
                value={signupData.confirmPassword}
                onChange={handleChange}
                required
              />
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

export default Signup;
