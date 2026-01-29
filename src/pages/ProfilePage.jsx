import React from "react";
import { useAuth } from "../auth/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Profile (secured)</h1>
      <p>Only logged-in users can see this page.</p>
      <pre style={{ background: "#f7f7f7", padding: 12, borderRadius: 8 }}>
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
}
