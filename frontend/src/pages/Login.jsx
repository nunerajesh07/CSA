// src/pages/Login.jsx
// User login page with form validation and JWT storage.

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userSignin } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiBookOpen, FiEye, FiEyeOff } from "react-icons/fi";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await userSignin(formData);
      loginUser(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.firstname}! 👋`);
      navigate("/"); // Redirect to home after login
    } catch (err) {
      const message = err.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
        background: "radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.05) 0%, transparent 70%)",
      }}
    >
      <div
        className="glass-card animate-fade-in-up"
        style={{ width: "100%", maxWidth: "420px", padding: "2.5rem" }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              boxShadow: "0 8px 24px rgba(37,99,235,0.3)",
            }}
          >
            <FiBookOpen size={24} color="white" />
          </div>
          <h1
            style={{
              margin: "0 0 0.5rem",
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "var(--color-text)",
            }}
          >
            Welcome Back
          </h1>
          <p style={{ margin: 0, color: "var(--color-muted)", fontSize: "0.9rem" }}>
            Sign in to continue learning
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Email Field */}
          <div>
            <label style={{ display: "block", color: "var(--color-muted)", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.4rem" }}>
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <FiMail
                size={16}
                style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#64748b" }}
              />
              <input
                id="login-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                style={{ paddingLeft: "2.5rem" }}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label style={{ display: "block", color: "#94a3b8", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.4rem" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <FiLock
                size={16}
                style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#64748b" }}
              />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                style={{ paddingLeft: "2.5rem", paddingRight: "3rem" }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: 0,
                }}
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: "100%", marginTop: "0.5rem", padding: "0.875rem" }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                <span style={{ display: "inline-block", width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
                Signing in...
              </span>
            ) : "Sign In"}
          </button>
        </form>

        {/* Footer Links */}
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "#6366f1", fontWeight: 600, textDecoration: "none" }}>
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
