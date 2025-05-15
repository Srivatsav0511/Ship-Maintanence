import React from 'react';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children, isAuthenticated }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
} 