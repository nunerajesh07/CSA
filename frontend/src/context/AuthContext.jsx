



import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);




export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);

  const [admin, setAdmin] = useState(null);

  const [loading, setLoading] = useState(true);

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


  const loginAdmin = (adminData, token) => {
    setAdmin(adminData);
    localStorage.setItem("adminUser", JSON.stringify(adminData));
    localStorage.setItem("adminToken", token);
  };

  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminToken");
  };

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




export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
