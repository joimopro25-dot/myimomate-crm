// app/router/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from '../useAuthState';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuthState();
  if (loading) return <div className="p-6">Loading…</div>;
  return user ? children : <Navigate to="/login" replace />;
}