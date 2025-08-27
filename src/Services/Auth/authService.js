import api from "../../config/api.js"; // ← CHỈ THÊM DÒNG NÀY

// Định nghĩa roles chung để dễ quản lý
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

    // Lưu token và user info vào localStorage
    if (userData?.token) {
      localStorage.setItem("token", userData.token);
      localStorage.setItem("user", JSON.stringify(userData));
    }
    return userData;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Lấy role hiện tại của user
export const getRole = () => {
  const user = getCurrentUser();
  return user?.role || null;
};

// Kiểm tra quyền có khớp role không
export const hasRole = (allowedRoles = []) => {
  const role = getRole();
  return role && allowedRoles.includes(role);
};
