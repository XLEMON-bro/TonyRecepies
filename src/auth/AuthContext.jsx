import React, { createContext, useContext, useMemo, useState } from "react";

/**
 * Placeholder auth state.
 * Later we will replace login/logout with API calls to TonyIdentity and JWT logic.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Keep it simple for now: user is null or object { email, roles: [] }
  const [user, setUser] = useState(null);

  function loginAsUser() {
    setUser({ email: "user@demo.com", roles: ["User"] });
  }

  function loginAsAdmin() {
    setUser({ email: "admin@demo.com", roles: ["Admin"] });
  }

  function logout() {
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      roles: user?.roles ?? [],
      loginAsUser,
      loginAsAdmin,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
