/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { supabase } from "../config/supabaseClient";
import { getToken, getCurrentUser } from "../Services/Auth/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const token = getToken();
        const userData = getCurrentUser();

        if (token && userData) {
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback((userData) => {
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

/// code chuẩn
