import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function LoginPage() {
  const { loginAsUser, loginAsAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from ?? "/";

  return (
    <div style={{ maxWidth: 460 }}>
      <h1>Login</h1>
      <p>Temporary buttons for training. Later we replace with TonyIdentity API.</p>

      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={() => {
            loginAsUser();
            navigate(redirectTo, { replace: true });
          }}
        >
          Login as User
        </button>

        <button
          onClick={() => {
            loginAsAdmin();
            navigate(redirectTo, { replace: true });
          }}
        >
          Login as Admin
        </button>
      </div>

      <p style={{ marginTop: 12 }}>
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
