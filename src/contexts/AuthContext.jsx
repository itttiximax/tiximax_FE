// Context/AuthContext.jsx - FULL CODE FIXED
/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { supabase } from "../config/supabaseClient";
import {
  getToken,
  getCurrentUser,
  setAuthData,
  clearAuthData,
} from "../Services/Auth/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [token, setTokenState] = useState(null); // ✅ THÊM: Lưu token
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const savedToken = getToken(); // Lấy từ "jwt"
        const userData = getCurrentUser(); // Lấy từ "user"

        console.log(
          "✅ Auth Check - Token:",
          savedToken ? "Found" : "Not found"
        );
        console.log(
          "✅ Auth Check - User:",
          userData ? userData.id : "Not found"
        );

        if (savedToken && userData) {
          setTokenState(savedToken); // ✅ THÊM: Set token state
          setUserState(userData);
        } else {
          setTokenState(null);
          setUserState(null);
        }
      } catch (error) {
        console.error("❌ Auth check error:", error);
        setTokenState(null);
        setUserState(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // ✅ CẬP NHẬT: Nhận cả token và user, sử dụng setAuthData từ authService
  const login = useCallback((userData, tokenData) => {
    console.log("✅ Login - Setting token and user in context");

    try {
      // ✅ Sử dụng setAuthData từ authService (validation + localStorage + logging)
      setAuthData(tokenData, userData);

      // Update state
      setTokenState(tokenData);
      setUserState(userData);
    } catch (error) {
      console.error("❌ Login error:", error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      console.log("🔓 Logging out...");

      // Xóa từ Supabase
      await supabase.auth.signOut();

      // Xóa từ localStorage
      clearAuthData();

      // Clear state
      setTokenState(null);
      setUserState(null);

      console.log("✅ Logout successful");
    } catch (error) {
      console.error("❌ Logout error:", error);
      // Vẫn clear local state ngay cả khi Supabase error
      clearAuthData();
      setTokenState(null);
      setUserState(null);
    }
  }, []);

  // ✅ CẬP NHẬT: Export token
  const value = {
    user,
    token, // ✅ THÊM: Token
    loading,
    isAuthenticated: !!(user && token), // ✅ CẬP NHẬT: Kiểm tra cả user và token
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
