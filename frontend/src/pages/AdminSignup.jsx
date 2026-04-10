


import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminSignup } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiUser, FiShield, FiEye, FiEyeOff } from "react-icons/fi";

export default function AdminSignup() {
  const [formData, setFormData] = useState({ firstname: "", lastname: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstname || !formData.lastname || !formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await adminSignup(formData);
      loginAdmin(res.data.admin, res.data.token);
      toast.success("Admin account created! Welcome aboard! 🛡️");
      navigate("/admin/dashboard");
    } catch (err) {
      const message = err.response?.data?.message || "Signup failed.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 64px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "2rem 1rem",
        background: "rgba(124,58,237,0.04)",
      }}
    >
      <div className="glass-card" style={{ width: "100%", maxWidth: "440px", padding: "2.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "56px", height: "56px", borderRadius: "16px",
              background: "#7c3aed",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 1rem", boxShadow: "0 8px 24px rgba(124,58,237,0.4)",
            }}
          >
            <FiShield size={24} color="white" />
          </div>
          <h1
            style={{
              margin: "0 0 0.5rem", fontSize: "1.75rem", fontWeight: 800,
              color: "var(--color-text)",
            }}
          >
            Create Admin Account
          </h1>
          <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>Start creating amazing courses</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div>
              <label style={{ display: "block", color: "#94a3b8", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.4rem" }}>First Name</label>
              <div style={{ position: "relative" }}>
                <FiUser size={16} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
                <input id="admin-signup-firstname" type="text" name="firstname" placeholder="Jane" value={formData.firstname} onChange={handleChange} className="input-field" style={{ paddingLeft: "2.5rem" }} required />
              </div>
            </div>
            <div>
              <label style={{ display: "block", color: "#94a3b8", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.4rem" }}>Last Name</label>
              <div style={{ position: "relative" }}>
                <FiUser size={16} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
                <input id="admin-signup-lastname" type="text" name="lastname" placeholder="Doe" value={formData.lastname} onChange={handleChange} className="input-field" style={{ paddingLeft: "2.5rem" }} required />
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: "block", color: "#94a3b8", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.4rem" }}>Admin Email</label>
            <div style={{ position: "relative" }}>
              <FiMail size={16} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
              <input id="admin-signup-email" type="email" name="email" placeholder="admin@example.com" value={formData.email} onChange={handleChange} className="input-field" style={{ paddingLeft: "2.5rem" }} required />
            </div>
          </div>

          <div>
            <label style={{ display: "block", color: "#94a3b8", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.4rem" }}>Password</label>
            <div style={{ position: "relative" }}>
              <FiLock size={16} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
              <input id="admin-signup-password" type={showPassword ? "text" : "password"} name="password" placeholder="Min. 6 characters" value={formData.password} onChange={handleChange} className="input-field" style={{ paddingLeft: "2.5rem", paddingRight: "3rem" }} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: 0 }}>
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          <button
            id="admin-signup-submit" type="submit" disabled={loading}
            style={{
              width: "100%", marginTop: "0.5rem", padding: "0.875rem",
              background: "#7c3aed",
              color: "white", border: "none", borderRadius: "10px",
              fontWeight: 600, fontSize: "0.95rem", cursor: "pointer",
              boxShadow: "0 4px 15px rgba(124,58,237,0.4)",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Creating account..." : "Create Admin Account"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
            Already have an admin account?{" "}
            <Link to="/admin/login" style={{ color: "#7c3aed", fontWeight: 600, textDecoration: "none" }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
