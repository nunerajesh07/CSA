import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { isAdminLoggedIn, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return isAdminLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRoute;
