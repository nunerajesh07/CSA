// src/context/AuthContext.jsx
// Global authentication state using React Context.
// Provides user/admin data and login/logout functions to any component.

import React, { createContext, useContext, useState, useEffect } from "react";

// Create the context
const AuthContext = createContext(null);

// ─────────────────────────────────────────────
// AuthProvider Component
// Wrap your entire app with this to make auth state global
// ─────────────────────────────────────────────
export function AuthProvider({ children }) {
  // User state (null = not logged in)
  const [user, setUser] = useState(null);
  // Admin state (null = not logged in as admin)
  const [admin, setAdmin] = useState(null);
  // Loading state while restoring auth from localStorage
  const [loading, setLoading] = useState(true);

  // On first mount: restore user/admin from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedAdmin = localStorage.getItem("adminUser");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }

    if (savedAdmin) {
      try {
        setAdmin(JSON.parse(savedAdmin));
      } catch {
        localStorage.removeItem("adminUser");
      }
    }

    setLoading(false); // Auth restoration complete
  }, []);

  // ─── User Auth Functions ───

  // loginUser: called after successful user signin/signup
  const loginUser = (userData, token) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("userToken", token);
  };

  // logoutUser: clears user session
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("userToken");
  };

  // ─── Admin Auth Functions ───

  // loginAdmin: called after successful admin signin/signup
  const loginAdmin = (adminData, token) => {
    setAdmin(adminData);
    localStorage.setItem("adminUser", JSON.stringify(adminData));
    localStorage.setItem("adminToken", token);
  };

  // logoutAdmin: clears admin session
  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminToken");
  };

  // Value provided to all child components
  const value = {
    user,
    admin,
    loading,
    loginUser,
    logoutUser,
    loginAdmin,
    logoutAdmin,
    isUserLoggedIn: !!user,
    isAdminLoggedIn: !!admin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─────────────────────────────────────────────
// useAuth Hook
// Usage: const { user, loginUser, logoutUser } = useAuth();
// ─────────────────────────────────────────────
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
