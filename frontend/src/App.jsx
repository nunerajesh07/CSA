// src/App.jsx
// Root component — sets up routing, auth provider, and toast notifications.

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";

// Layout
import Navbar from "./components/Navbar";

// User Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PurchasedCourses from "./pages/PurchasedCourses";

// Admin Pages
import AdminLogin from "./pages/AdminLogin";
import AdminSignup from "./pages/AdminSignup";
import AdminDashboard from "./pages/AdminDashboard";
import AddEditCourse from "./pages/AddEditCourse";

export default function App() {
  return (
    // AuthProvider wraps the entire app to provide auth state globally
    <AuthProvider>
      <BrowserRouter>
        {/* Toast notification container */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#ffffff",
              color: "#212529",
              border: "1px solid #dee2e6",
              borderRadius: "10px",
              fontSize: "0.875rem",
              fontFamily: "'Inter', sans-serif",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            },
            success: {
              iconTheme: { primary: "#10b981", secondary: "white" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "white" },
            },
          }}
        />

        {/* Sticky navigation bar */}
        <Navbar />

        {/* Application Routes */}
        <Routes>
          {/* ── User Routes ── */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/purchases" element={<PurchasedCourses />} />

          {/* ── Admin Routes ── */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/course/new" element={<AddEditCourse />} />
          <Route path="/admin/course/edit" element={<AddEditCourse />} />

          {/* ── Fallback: redirect unknown routes to home ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
