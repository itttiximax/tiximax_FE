// src/services/authService.jsx
import axios from "axios";

const API_BASE_URL = "https://t-6cn5.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
  },
});

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
