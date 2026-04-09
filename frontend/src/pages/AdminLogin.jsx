// src/pages/AdminLogin.jsx
// Admin login page — uses separate JWT_ADMIN_SECRET on the backend.

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminSignin } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiShield, FiEye, FiEyeOff } from "react-icons/fi";

export default function AdminLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { loginAdmin } = useAuth();
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
      const res = await adminSignin(formData);
      loginAdmin(res.data.admin, res.data.token);
      toast.success(`Welcome back, Admin ${res.data.admin.firstname}! 🛡️`);
      navigate("/admin/dashboard");
    } catch (err) {
      const message = err.response?.data?.message || "Admin login failed.";
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
        background: "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.15) 0%, transparent 70%)",
      }}
    >
      <div className="glass-card animate-fade-in-up" style={{ width: "100%", maxWidth: "420px", padding: "2.5rem" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "56px", height: "56px", borderRadius: "16px",
              background: "linear-gradient(135deg, #7c3aed, #6366f1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 1rem", boxShadow: "0 8px 24px rgba(124,58,237,0.4)",
            }}
          >
            <FiShield size={24} color="white" />
          </div>
          <h1
            style={{
              margin: "0 0 0.5rem", fontSize: "1.75rem", fontWeight: 800,
              background: "linear-gradient(135deg, #e2e8f0, #94a3b8)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}
          >
            Admin Portal
          </h1>
          <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>
            Sign in to manage your courses
          </p>
        </div>

        {/* Admin badge */}
        <div
          style={{
            background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)",
            borderRadius: "8px", padding: "0.625rem 1rem",
            display: "flex", alignItems: "center", gap: "0.5rem",
            color: "#a78bfa", fontSize: "0.8rem", fontWeight: 500, marginBottom: "1.5rem",
          }}
        >
          <FiShield size={14} />
          This area is restricted to administrators only
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", color: "#94a3b8", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.4rem" }}>
              Admin Email
            </label>
            <div style={{ position: "relative" }}>
              <FiMail size={16} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
              <input
                id="admin-login-email"
                type="email" name="email" placeholder="admin@example.com"
                value={formData.email} onChange={handleChange}
                className="input-field" style={{ paddingLeft: "2.5rem" }} required
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", color: "#94a3b8", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.4rem" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <FiLock size={16} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
              <input
                id="admin-login-password"
                type={showPassword ? "text" : "password"} name="password"
                placeholder="Enter admin password"
                value={formData.password} onChange={handleChange}
                className="input-field" style={{ paddingLeft: "2.5rem", paddingRight: "3rem" }} required
              />
              <button
                type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: 0 }}
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          <button
            id="admin-login-submit"
            type="submit" disabled={loading}
            style={{
              width: "100%", marginTop: "0.5rem", padding: "0.875rem",
              background: "linear-gradient(135deg, #7c3aed, #6366f1)",
              color: "white", border: "none", borderRadius: "10px",
              fontWeight: 600, fontSize: "0.95rem", cursor: "pointer",
              boxShadow: "0 4px 15px rgba(124,58,237,0.4)",
              opacity: loading ? 0.7 : 1, transition: "all 0.2s ease",
            }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                <span style={{ display: "inline-block", width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
                Signing in...
              </span>
            ) : "Sign In as Admin"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
            New admin?{" "}
            <Link to="/admin/signup" style={{ color: "#7c3aed", fontWeight: 600, textDecoration: "none" }}>
              Create Admin Account
            </Link>
          </p>
          <p style={{ color: "#64748b", fontSize: "0.875rem", marginTop: "0.5rem" }}>
            Not an admin?{" "}
            <Link to="/login" style={{ color: "#6366f1", fontWeight: 600, textDecoration: "none" }}>
              User Login
            </Link>
          </p>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
