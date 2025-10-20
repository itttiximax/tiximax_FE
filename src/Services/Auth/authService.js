// Services/Auth/authService.js - FULL CODE FIXED
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

// ===== Constants & Storage =====
const TOKEN_KEY = "jwt";
const USER_KEY = "user";

const isValidToken = (t) => typeof t === "string" && t.length > 20;
const isValidUser = (u) => u && (u.id || u.accountId) && u.role;

// ✅ FIX #1: Handle undefined email properly - username never undefined
const normalizeUser = (raw = {}) => {
  // Ensure username is always a string, never undefined
  let username = raw.username;
  if (!username && raw.email) {
    username = raw.email.split("@")[0];
  }
  if (!username) {
    username = `user_${raw.id ?? raw.accountId ?? Date.now()}`;
  }

  // Ensure name is always a string, never undefined
  let name = raw.name ?? raw.fullName ?? raw.username ?? raw.email;
  if (!name && raw.id) {
    name = `User ${raw.id}`;
  }
  if (!name) {
    name = "user";
  }

  return {
    id: raw.id ?? raw.accountId,
    accountId: raw.accountId ?? raw.id,
    username, // ✅ Always string
    email: raw.email ?? null,
    role: raw.role ?? ROLES.CUSTOMER,
    name, // ✅ Always string
    phone: raw.phone ?? null,
    staffCode: raw.staffCode ?? null,
    department: raw.department ?? null,
  };
};

// ✅ FIX #2: Export setAuthData for use in AuthContext
export const setAuthData = (token, user) => {
  if (!isValidToken(token)) {
    console.error("❌ Invalid token format");
    throw new Error("Token không hợp lệ");
  }
  const sanitized = normalizeUser(user);
  if (!isValidUser(sanitized)) {
    console.error("❌ Invalid user data:", sanitized);
    throw new Error("Dữ liệu người dùng không hợp lệ");
  }
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(sanitized));
  console.log("✅ Auth data saved successfully");
};

export const clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem("token_expiry");
  console.log("✅ Auth data cleared");
};

// ✅ FIX #3: Export individual setters for flexibility
export const setToken = (token) => {
  if (token) {
    if (!isValidToken(token)) {
      console.warn("⚠️ Token might be invalid (too short)");
    }
    localStorage.setItem(TOKEN_KEY, token);
    console.log("✅ Token saved");
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const setUser = (user) => {
  if (user) {
    const sanitized = normalizeUser(user);
    if (!isValidUser(sanitized)) {
      console.error("❌ Invalid user:", sanitized);
      throw new Error("Dữ liệu người dùng không hợp lệ");
    }
    localStorage.setItem(USER_KEY, JSON.stringify(sanitized));
    console.log("✅ User saved");
  } else {
    localStorage.removeItem(USER_KEY);
  }
};

// ===== Parse helpers (gom tất cả format backend) =====
const extractTokenUser = (data = {}) => {
  // Handle nested responses
  const root = data.data ?? data.result ?? data;

  const token = root.jwt ?? root.token ?? root.access_token ?? null;
  const user =
    root.user && typeof root.user === "object"
      ? root.user
      : root.id || root.accountId
      ? {
          id: root.id ?? root.accountId,
          accountId: root.accountId ?? root.id,
          username: root.username,
          email: root.email,
          phone: root.phone,
          role: root.role,
          name: root.name ?? root.fullName,
          staffCode: root.staffCode,
          department: root.department,
          location: root.location,
          status: root.status,
        }
      : null;

  return { token, user };
};

// ===== Auth Flows =====
export const login = async (username, password) => {
  if (!username || !password)
    throw new Error("Username và password là bắt buộc");

  try {
    const { data } = await api.post(
      "/accounts/login",
      { username, password },
      { timeout: 10000 }
    );

    const { token, user } = extractTokenUser(data);

    if (!token || !user) {
      console.error("❌ Invalid login response:", {
        token,
        user,
        rawData: data,
      });
      throw new Error(
        "Dữ liệu đăng nhập không hợp lệ. Vui lòng liên hệ quản trị viên."
      );
    }

    setAuthData(token, user);
    console.log("✅ Login successful:", user.username);
    return { token, user };
  } catch (error) {
    const status = error.response?.status;
    const message = error.response?.data?.message;
    const code = error.code;

    console.error("❌ Login error:", { status, code, message });

    // ✅ FIX #4: Handle timeout and network errors
    if (code === "ECONNABORTED") {
      throw new Error("Kết nối timeout. Vui lòng thử lại.");
    }

    if (code === "ERR_NETWORK" || !navigator.onLine) {
      throw new Error("Lỗi kết nối mạng. Vui lòng kiểm tra internet.");
    }

    // HTTP status errors
    if (status === 401)
      throw new Error("Tên đăng nhập hoặc mật khẩu không đúng!");
    if (status === 404) throw new Error("Tài khoản không tồn tại!");
    if (status === 400)
      throw new Error(message || "Dữ liệu đăng nhập không hợp lệ!");
    if (status === 429)
      throw new Error("Quá nhiều lần thử. Vui lòng thử lại sau 5 phút.");
    if (status >= 500) throw new Error("Lỗi server. Vui lòng thử lại sau.");

    throw new Error(
      message || error.message || "Đăng nhập thất bại. Vui lòng thử lại."
    );
  }
};

export const verifySupabaseToken = async (supabaseToken) => {
  if (!isValidToken(supabaseToken)) throw new Error("Token không hợp lệ");

  try {
    const { data } = await api.post("/accounts/verify", null, {
      headers: { Authorization: `Bearer ${supabaseToken}` },
      timeout: 10000,
    });

    const { token, user } = extractTokenUser(data);
    if (!token || !user) {
      console.error("❌ Verify failed:", { token, user });
      throw new Error("Xác thực thất bại");
    }

    setAuthData(token, user);
    console.log("✅ Supabase token verified");
    return { jwt: token, token, user };
  } catch (error) {
    const message = error.response?.data?.message || "Xác thực token thất bại";
    console.error("❌ Verify error:", message);
    throw new Error(message);
  }
};

export const googleLogin = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
    if (error) throw new Error(error.message || "Đăng nhập Google thất bại");
    console.log("✅ Google login initiated");
    return data;
  } catch (error) {
    console.error("❌ Google login error:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await supabase.auth.signOut();
    console.log("✅ Supabase sign out successful");
  } catch (error) {
    console.error("⚠️ Supabase sign out error:", error);
  } finally {
    clearAuthData();
  }
};

// ===== Helpers =====
export const getToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    console.warn("⚠️ No token found in localStorage");
  }
  return token;
};

export const getCurrentUser = () => {
  const raw = localStorage.getItem(USER_KEY);
  try {
    if (!raw) return null;

    const user = JSON.parse(raw);
    console.log("✅ User retrieved from localStorage:", user.username);
    return user;
  } catch (error) {
    // ✅ FIX #3: Log error instead of silent fail
    console.error("❌ Error parsing user from localStorage:", error);
    console.error("❌ Raw data:", raw);
    clearAuthData();
    return null;
  }
};

export const getRole = () => getCurrentUser()?.role || null;

export const hasRole = (allowedRoles = []) =>
  Array.isArray(allowedRoles) && allowedRoles.includes(getRole());

export const isAuthenticated = () => Boolean(getToken() && getCurrentUser());
