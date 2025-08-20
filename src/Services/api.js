import axios from "axios";

// Tạo instance của axios
const api = axios.create({
  baseURL: "https://t-6cn5.onrender.com", // server URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Nếu có token cần Auth thì thêm vào interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // hoặc sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Export mặc định axios instance để tái sử dụng
export default api;
