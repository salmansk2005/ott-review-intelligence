import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  email: string;
  name: string;
  preferredGenre?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  setGenrePreference: (genre: string) => void;
  getGenrePreference: () => string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const session = localStorage.getItem("ott_session");
    if (session) setUser(JSON.parse(session));
  }, []);

  const signup = (name: string, email: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem("ott_users") || "{}");
    if (users[email]) return false;
    users[email] = { name, email, password };
    localStorage.setItem("ott_users", JSON.stringify(users));
    const u = { email, name };
    localStorage.setItem("ott_session", JSON.stringify(u));
    setUser(u);
    return true;
  };

  const login = (email: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem("ott_users") || "{}");
    const found = users[email];
    if (!found || found.password !== password) return false;
    const u = { email, name: found.name };
    localStorage.setItem("ott_session", JSON.stringify(u));
    setUser(u);
    return true;
  };

  const logout = () => {
    localStorage.removeItem("ott_session");
    localStorage.removeItem("preferredGenre");
    setUser(null);
  };

  // Set genre preference and store in localStorage
  const setGenrePreference = (genre: string) => {
    localStorage.setItem("preferredGenre", genre);
    if (user) {
      const updatedUser = { ...user, preferredGenre: genre };
      setUser(updatedUser);
      localStorage.setItem("ott_session", JSON.stringify(updatedUser));
    }
  };

  // Get genre preference from localStorage
  const getGenrePreference = (): string | null => {
    return localStorage.getItem("preferredGenre");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, setGenrePreference, getGenrePreference }}>
      {children}
    </AuthContext.Provider>
  );
};
