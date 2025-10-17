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

const TOKEN_KEY = "jwt";
const USER_KEY = "user";

// Storage helpers
const setAuthData = (token, user) => {
  const sanitizedUser = {
    id: user.id || user.accountId,
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
};

const clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// Login with username/password
export const login = async (username, password) => {
  const response = await api.post("/accounts/login", { username, password });
  const data = response.data;

  // Parse token and user from response
  let token = data.token || data.jwt;
  let user = data.user;

  // Handle flat structure
  if (!user && (data.accountId || data.id)) {
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
  }

  if (!token || !user) {
    throw new Error("Dữ liệu đăng nhập không hợp lệ");
  }

  setAuthData(token, user);

  return { token, user };
};

// Verify Supabase token with backend
export const verifySupabaseToken = async (supabaseToken) => {
  const response = await api.post("/accounts/verify", null, {
    headers: { Authorization: `Bearer ${supabaseToken}` },
  });

  const data = response.data;
  const token = data.jwt || data.token || data.access_token;
  let user = data.user;

  // Handle flat structure
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

  setAuthData(token, user);

  return { jwt: token, token, user };
};

// Google OAuth login
export const googleLogin = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw new Error(error.message);
  return data;
};

// Logout
export const logout = async () => {
  await supabase.auth.signOut();
  clearAuthData();
};

// Helpers
export const getToken = () => localStorage.getItem(TOKEN_KEY);

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
  const role = getRole();
  return role && allowedRoles.includes(role);
};

export const isAuthenticated = () => {
  return getToken() !== null && getCurrentUser() !== null;
};
