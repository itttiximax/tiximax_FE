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
  try {
    const response = await api.post("/accounts/login", { username, password });
    const userData = response.data;

    if (userData?.token) {
      localStorage.setItem("jwt", userData.token);
      localStorage.setItem("user", JSON.stringify(userData));
    }

    return userData;
  } catch (error) {
    console.error("Login Error:", error);

    if (error.code === "ERR_NETWORK") {
      throw new Error("Không thể kết nối tới server!");
    }

    throw error;
  }
};

export const verifySupabaseToken = async (token) => {
  try {
    const response = await api.post("/accounts/verify", null, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = response.data;

    localStorage.setItem("jwt", data.jwt);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
  } catch (error) {
    console.error("Verify Token Error:", error);
    throw error;
  }
};

export const googleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
  if (error) throw error;
};

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
