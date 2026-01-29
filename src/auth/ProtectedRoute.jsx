import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

/**
 * Use this wrapper to protect routes for authenticated users only.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Save intended location so we can redirect back after login later
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
