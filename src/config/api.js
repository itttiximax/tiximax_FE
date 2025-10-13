import axios from "axios";
import toast from "react-hot-toast";

// Get API URL from env or fallback
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://t-6cn5.onrender.com/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
  },
  timeout: 30000,
});

// Auto add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response || error);

    if (error.code === "ERR_NETWORK") {
      toast.error("Không thể kết nối tới server!");
    } else if (error.response?.status === 404) {
      toast.error("API không tìm thấy. Kiểm tra endpoint!");
    } else if (error.response?.status === 401) {
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
