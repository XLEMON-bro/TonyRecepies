import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function Header() {
  const { isAuthenticated, roles, logout } = useAuth();

  return (
    <header style={{ padding: 16, borderBottom: "2px solid #e5e5e5", display: "flex", gap: 12, alignItems: "center", backgroundColor: "white" }}>
      <Link to="/"><img style={{height: "32px"}} src="/Tony.png" alt="Tony Logo"/></Link>
      <Link to="/">Home</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/admin">Admin</Link>

      <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
        {isAuthenticated ? (
          <>
            <small>Roles: {roles.join(", ")}</small>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </header>
  );
}
