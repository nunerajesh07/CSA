



import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiMenu, FiX, FiBookOpen, FiLogOut, FiUser, FiShield } from "react-icons/fi";

const Navbar =() =>{
  const { user, admin, logoutUser, logoutAdmin, isUserLoggedIn, isAdminLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdminPage = location.pathname.startsWith("/admin");

  const handleUserLogout = () => {
    logoutUser();
    navigate("/login");
    setMenuOpen(false);
  };

  const handleAdminLogout = () => {
    logoutAdmin();
    navigate("/admin/login");
    setMenuOpen(false);
  };

  return (
    <nav
      style={{
        background: "var(--color-bg)",
        borderBottom: "1px solid var(--color-border)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1.5rem",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "var(--color-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FiBookOpen size={18} color="white" />
          </div>
          <span
            style={{
              fontWeight: 800,
              fontSize: "1.25rem",
              WebkitBackgroundClip: "text",
            }}
          >
           CSA
          </span>
        </Link>

        {}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
          className="hidden-mobile"
        >
          {}
          {isUserLoggedIn && !isAdminPage && (
            <>
              <NavLink to="/">Courses</NavLink>
              <NavLink to="/purchases">My Courses</NavLink>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  color: "#94a3b8",
                  fontSize: "0.875rem",
                  padding: "0.375rem 0.75rem",
                }}
              >
                <FiUser size={14} />
                {user?.firstname}
              </span>
              <button
                onClick={handleUserLogout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "#ef4444",
                  padding: "0.375rem 1rem",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              >
                <FiLogOut size={14} /> Logout
              </button>
            </>
          )}

          {}
          {isAdminLoggedIn && isAdminPage && (
            <>
              <NavLink to="/admin/dashboard">Dashboard</NavLink>
              <NavLink to="/admin/course/new">Add Course</NavLink>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  color: "#94a3b8",
                  fontSize: "0.875rem",
                  padding: "0.375rem 0.75rem",
                }}
              >
                <FiShield size={14} color="#6366f1" />
                {admin?.firstname}
              </span>
              <button
                onClick={handleAdminLogout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "#ef4444",
                  padding: "0.375rem 1rem",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              >
                <FiLogOut size={14} /> Logout
              </button>
            </>
          )}

          {}
          {!isUserLoggedIn && !isAdminPage && (
            <>
              <NavLink to="/login">Login</NavLink>
              <Link to="/signup">
                <button className="btn-primary" style={{ padding: "0.5rem 1.25rem" }}>
                  Get Started
                </button>
              </Link>
              <Link
                to="/admin/login"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  color: "#6366f1",
                  fontSize: "0.8rem",
                  textDecoration: "none",
                  padding: "0.375rem 0.75rem",
                  border: "1px solid rgba(37,99,235,0.3)",
                  borderRadius: "8px",
                }}
              >
                <FiShield size={13} /> Admin
              </Link>
            </>
          )}

          {!isAdminLoggedIn && isAdminPage && (
            <>
              <NavLink to="/admin/login">Admin Login</NavLink>
              <NavLink to="/admin/signup">Admin Signup</NavLink>
            </>
          )}
        </div>

        {}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "none",
            border: "none",
            color: "#e2e8f0",
            cursor: "pointer",
            padding: "0.5rem",
          }}
        >
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {}
      {menuOpen && (
        <div
          style={{
            background: "rgba(15,15,26,0.98)",
            padding: "1rem 1.5rem",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          {isUserLoggedIn && (
            <>
              <MobileLink to="/" onClick={() => setMenuOpen(false)}>Courses</MobileLink>
              <MobileLink to="/purchases" onClick={() => setMenuOpen(false)}>My Courses</MobileLink>
              <button onClick={handleUserLogout} style={{ color: "#ef4444", background: "none", border: "none", textAlign: "left", cursor: "pointer", fontSize: "0.9rem" }}>
                Logout ({user?.firstname})
              </button>
            </>
          )}
          {!isUserLoggedIn && !isAdminPage && (
            <>
              <MobileLink to="/login" onClick={() => setMenuOpen(false)}>Login</MobileLink>
              <MobileLink to="/signup" onClick={() => setMenuOpen(false)}>Sign Up</MobileLink>
              <MobileLink to="/admin/login" onClick={() => setMenuOpen(false)}>Admin Login</MobileLink>
            </>
          )}
          {isAdminLoggedIn && (
            <>
              <MobileLink to="/admin/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</MobileLink>
              <MobileLink to="/admin/course/new" onClick={() => setMenuOpen(false)}>Add Course</MobileLink>
              <button onClick={handleAdminLogout} style={{ color: "#ef4444", background: "none", border: "none", textAlign: "left", cursor: "pointer", fontSize: "0.9rem" }}>
                Logout ({admin?.firstname})
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      style={{
        color: isActive ? "#6366f1" : "#94a3b8",
        textDecoration: "none",
        fontSize: "0.875rem",
        fontWeight: isActive ? 600 : 400,
        padding: "0.375rem 0.75rem",
        borderRadius: "8px",
        background: isActive ? "rgba(37,99,235,0.1)" : "transparent",
      }}
    >
      {children}
    </Link>
  );
}

function MobileLink({ to, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      style={{
        color: "#e2e8f0",
        textDecoration: "none",
        fontSize: "0.9rem",
        fontWeight: 500,
      }}
    >
      {children}
    </Link>
  );
}
export default Navbar