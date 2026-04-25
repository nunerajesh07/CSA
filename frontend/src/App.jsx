


import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PurchasedCourses from "./pages/PurchasedCourses";

import AdminDashboard from "./pages/AdminDashboard";
import AddEditCourse from "./pages/AddEditCourse";
import AdminRoute from "./components/AdminRoute";

export default function App() {
  return (

    <AuthProvider>
      <BrowserRouter>
        {}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#ffffff",
              color: "#212529",
              border: "1px solid #dee2e6",
              borderRadius: "5px",
              fontSize: "0.875rem",
              fontFamily: "Arial, sans-serif",
            },
            success: {
              iconTheme: { primary: "#10b981", secondary: "white" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "white" },
            },
          }}
        />

        {}
        <Navbar />

        {}
        <Routes>
          {}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/purchases" element={<PurchasedCourses />} />

          {}
          
          {/* Protected Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/course/new" element={<AddEditCourse />} />
            <Route path="/admin/course/edit" element={<AddEditCourse />} />
          </Route>

          {}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
