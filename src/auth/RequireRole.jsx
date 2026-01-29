import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

/**
 * Protect routes by role (example: Admin-only pages).
 */
export default function RequireRole({ role, children }) {
  const { roles } = useAuth();

  if (!roles.includes(role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
}
