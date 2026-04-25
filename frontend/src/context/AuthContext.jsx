import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    // Clean up residual admin records if they exist to prevent state poisoning.
    if (localStorage.getItem("adminUser")) localStorage.removeItem("adminUser");
    if (localStorage.getItem("adminToken")) localStorage.removeItem("adminToken");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  const loginUser = (userData, token) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("userToken", token);
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("userToken");
  };

  // Backwards compatiblility logic in case Navbar or elsewhere specifically tries to hit Admin.
  // Both logout features simply strip the universal user payload now.
  const logoutAdmin = () => logoutUser();

  const value = {
    user,
    // Provide user payload generically as 'admin' reference if something was heavily depending on `{ admin } = useAuth()`
    admin: user?.role === "admin" ? user : null,
    loading,
    loginUser,
    logoutUser,
    logoutAdmin,
    isUserLoggedIn: !!user && user.role === "user",
    isAdminLoggedIn: !!user && user.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
