import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../config/supabaseClient";
import { getToken, getCurrentUser } from "../Services/Auth/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const userData = getCurrentUser();

    setUser(token && userData ? userData : null);
    setLoading(false);
  }, []);

  const login = (userData) => setUser(userData);

  const logout = async () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
