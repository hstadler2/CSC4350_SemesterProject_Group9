import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const STORAGE_KEY = "campuscare_auth_v1";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = async ({ email, password }) => {
    // demo only: any email works. role by domain hint
    const role = email.endsWith("@staff.edu") ? "staff" : "student";
    const profile = { id: crypto.randomUUID(), email, role, name: email.split("@")[0] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setUser(profile);
    return profile;
  };

  const register = async ({ name, email, password, role }) => {
    const profile = { id: crypto.randomUUID(), name, email, role };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setUser(profile);
    return profile;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);