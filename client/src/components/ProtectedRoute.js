import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthStore();
  
  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;