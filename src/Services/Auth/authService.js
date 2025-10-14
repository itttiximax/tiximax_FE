import api from "../../config/api";
import { supabase } from "../../config/supabaseClient";

export const ROLES = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  LEAD_SALE: "LEAD_SALE",
  STAFF_SALE: "STAFF_SALE",
  STAFF_PURCHASER: "STAFF_PURCHASER",
  STAFF_WAREHOUSE_FOREIGN: "STAFF_WAREHOUSE_FOREIGN",
  STAFF_WAREHOUSE_DOMESTIC: "STAFF_WAREHOUSE_DOMESTIC",
  CUSTOMER: "CUSTOMER",
};

// Constants
const TOKEN_KEY = "jwt";
const USER_KEY = "user";

// Validation helpers
const isValidToken = (token) => {
  return token && typeof token === "string" && token.length > 20;
};

const isValidUser = (user) => {
  return user && (user.id || user.accountId) && user.role;
};

// Storage helpers
const setAuthData = (token, user) => {
  if (!isValidToken(token)) {
    console.error("❌ Invalid token:", token);
    throw new Error("Token không hợp lệ");
  }

  if (!isValidUser(user)) {
    console.error("❌ Invalid user data:", user);
    throw new Error("Dữ liệu người dùng không hợp lệ");
  }

  // Sanitize user data - normalize accountId to id
  const sanitizedUser = {
    id: user.id || user.accountId, // ✅ Support both
    accountId: user.accountId || user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    name: user.name || user.fullName || user.username,
    phone: user.phone,
    staffCode: user.staffCode,
    department: user.department,
  };

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(sanitizedUser));

  console.log("✅ Auth data saved:", {
    token: token.substring(0, 30) + "...",
    user: sanitizedUser,
  });
};

const clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem("token_expiry");
};

// Login with username/password
export const login = async (username, password) => {
  if (!username || !password) {
    throw new Error("Username và password là bắt buộc");
  }

  try {
    console.log("🔐 Attempting login for:", username);

    const response = await api.post(
      "/accounts/login",
      { username, password },
      { timeout: 10000 }
    );

    const data = response.data;
    console.log("✅ Login response received:", data);

    // ⭐ PARSE TOKEN AND USER
    let token = null;
    let user = null;

    // Format 1: { token, user: {...} } - Nested
    if (data.token && data.user && typeof data.user === "object") {
      token = data.token;
      user = data.user;
      console.log("📦 Format detected: Nested { token, user }");
    }
    // Format 2: { jwt, user: {...} } - Nested with jwt key
    else if (data.jwt && data.user && typeof data.user === "object") {
      token = data.jwt;
      user = data.user;
      console.log("📦 Format detected: Nested { jwt, user }");
    }
    // Format 3: Flat structure with accountId (YOUR BACKEND FORMAT)
    else if (data.token && (data.accountId || data.id)) {
      token = data.token;
      user = {
        id: data.accountId || data.id,
        accountId: data.accountId || data.id,
        username: data.username,
        email: data.email,
        phone: data.phone,
        role: data.role,
        name: data.name || data.fullName,
        staffCode: data.staffCode,
        department: data.department,
        location: data.location,
        status: data.status,
      };
      console.log("📦 Format detected: Flat with accountId");
    }
    // Format 4: Flat structure with jwt key
    else if (data.jwt && (data.accountId || data.id)) {
      token = data.jwt;
      user = {
        id: data.accountId || data.id,
        accountId: data.accountId || data.id,
        username: data.username,
        email: data.email,
        phone: data.phone,
        role: data.role,
        name: data.name || data.fullName,
        staffCode: data.staffCode,
        department: data.department,
      };
      console.log("📦 Format detected: Flat with jwt and accountId");
    }

    // Validation
    if (!token || !user) {
      console.error("❌ Could not parse response:", data);
      console.error("❌ Parsed - Token:", token);
      console.error("❌ Parsed - User:", user);
      throw new Error(
        "Dữ liệu đăng nhập không hợp lệ. Vui lòng liên hệ quản trị viên."
      );
    }

    // Save to localStorage
    setAuthData(token, user);

    // Return normalized format
    return {
      token,
      user,
      // Keep original data for compatibility
      ...data,
    };
  } catch (error) {
    console.error("❌ Login Error:", error);

    // Handle different error types
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message;

      if (status === 401) {
        throw new Error("Tên đăng nhập hoặc mật khẩu không đúng!");
      } else if (status === 404) {
        throw new Error("Tài khoản không tồn tại!");
      } else if (status === 400) {
        throw new Error(message || "Dữ liệu đăng nhập không hợp lệ!");
      } else if (message) {
        throw new Error(message);
      }
    }

    // Re-throw if already an Error object with message
    if (error.message) {
      throw error;
    }

    throw new Error("Đăng nhập thất bại. Vui lòng thử lại.");
  }
};

// Verify Supabase token with backend
export const verifySupabaseToken = async (supabaseToken) => {
  if (!isValidToken(supabaseToken)) {
    throw new Error("Token không hợp lệ");
  }

  try {
    console.log("🔐 Verifying Supabase token...");

    const response = await api.post("/accounts/verify", null, {
      headers: { Authorization: `Bearer ${supabaseToken}` },
      timeout: 10000,
    });

    const data = response.data;

    // Parse token and user from response
    const token = data.jwt || data.token || data.access_token;
    let user = data.user;

    // If user is flat in response
    if (!user && (data.accountId || data.id)) {
      user = {
        id: data.accountId || data.id,
        accountId: data.accountId || data.id,
        username: data.username,
        email: data.email,
        role: data.role,
        name: data.name,
        phone: data.phone,
      };
    }

    if (!token || !user) {
      throw new Error("Xác thực thất bại");
    }

    console.log("✅ Token verified");
    setAuthData(token, user);

    return {
      jwt: token,
      token: token,
      user: user,
    };
  } catch (error) {
    console.error("❌ Verify Token Error:", error);

    const message = error.response?.data?.message || "Xác thực token thất bại";
    throw new Error(message);
  }
};

// Google OAuth login
export const googleLogin = async () => {
  try {
    console.log("🚀 Starting Google OAuth...");

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      throw new Error(error.message || "Đăng nhập Google thất bại");
    }

    console.log("✅ Google OAuth initiated");
    return data;
  } catch (error) {
    console.error("❌ Google OAuth Error:", error);
    throw error;
  }
};

// Logout
export const logout = async () => {
  try {
    await supabase.auth.signOut();
    clearAuthData();
    console.log("✅ Logged out successfully");
  } catch (error) {
    console.error("❌ Logout Error:", error);
    clearAuthData(); // Clear anyway
  }
};

// Helpers
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getCurrentUser = () => {
  const user = localStorage.getItem(USER_KEY);
  try {
    return user ? JSON.parse(user) : null;
  } catch {
    clearAuthData();
    return null;
  }
};

export const getRole = () => getCurrentUser()?.role || null;

export const hasRole = (allowedRoles = []) => {
  if (!Array.isArray(allowedRoles)) {
    console.warn("hasRole expects an array");
    return false;
  }

  const role = getRole();
  return role && allowedRoles.includes(role);
};

export const isAuthenticated = () => {
  return getToken() !== null && getCurrentUser() !== null;
};
