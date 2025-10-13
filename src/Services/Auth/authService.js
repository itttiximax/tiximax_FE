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


export const login = async (username, password) => {
  const response = await api.post("/accounts/login", { username, password });
  const userData = response.data;
  if (userData?.token) {
    localStorage.setItem("jwt", userData.token);
    localStorage.setItem("user", JSON.stringify(userData));
  }
  return userData;
};

// 🔹 Gửi token Supabase lên backend để xác thực và lấy JWT
export const verifySupabaseToken = async (token) => {
  const response = await api.post("/accounts/verify", null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = response.data;
  localStorage.setItem("jwt", data.jwt);
  localStorage.setItem("user", JSON.stringify(data.user));
  return data;
};

// 🔹 Google login qua Supabase
export const googleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
  if (error) throw error;
};

// 🔹 Helpers
export const logout = () => {
  localStorage.removeItem("jwt");
  localStorage.removeItem("user");
};

export const getToken = () => localStorage.getItem("jwt");
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const getRole = () => getCurrentUser()?.role || null;

export const hasRole = (allowedRoles = []) => {
  const role = getRole();
  return role && allowedRoles.includes(role);
};
