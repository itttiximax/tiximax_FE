import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { login, ROLES } from "../Services/Auth/authService";
import { useAuth } from "../contexts/AuthContext";
import LoginGoogle from "./LoginGoogle";
import LogoTixi from "../assets/TixiLogo.jpg";
import BgHeader from "../assets/bg.jpg";

const roleRoutes = {
  [ROLES.ADMIN]: "/admin",
  [ROLES.MANAGER]: "/manager",
  [ROLES.LEAD_SALE]: "/lead-sale",
  [ROLES.STAFF_SALE]: "/staff-sale",
  [ROLES.STAFF_PURCHASER]: "/staff-purchaser",
  [ROLES.STAFF_WAREHOUSE_FOREIGN]: "/staff-warehouse-foreign",
  [ROLES.STAFF_WAREHOUSE_DOMESTIC]: "/staff-warehouse-domestic",
  [ROLES.CUSTOMER]: "/",
};

const SignIn = () => {
  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setLoading(true);
    try {
      const response = await login(formData.username, formData.password);
      const token =
        response.token || response.accessToken || response.user?.token;

      if (!token) throw new Error("Token không được trả về từ API!");
      localStorage.setItem("jwt", token);

      const userData = {
        id: response.user?.id || response.id,
        username: response.user?.username || response.username,
        name: response.user?.name || response.name,
        email: response.user?.email || response.email,
        role: response.user?.role || response.role,
      };

      setAuthUser(userData);
      toast.success(`Chào mừng ${userData.name || userData.username}! 🎉`);
      const route = roleRoutes[userData.role] || "/";
      await new Promise((r) => setTimeout(r, 100));
      navigate(route, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      if (error.response?.status === 401) {
        toast.error("Tên đăng nhập hoặc mật khẩu không đúng!");
      } else if (error.response?.status === 404) {
        toast.error("Tài khoản không tồn tại!");
      } else {
        toast.error(error.message || "Đăng nhập thất bại. Vui lòng thử lại!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4"
      style={{
        backgroundImage: `url(${LogoTixi})`,
      }}
    >
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* 🖼 HEADER DÙNG ẢNH NỀN */}
        <div
          className="px-8 py-8 text-center bg-cover bg-center bg-no-repeat relative"
          style={{
            backgroundImage: `url(${BgHeader})`,
          }}
        >
          {/* 👇 nếu muốn ảnh rõ 100%, xoá dòng dưới */}
          <div className="absolute inset-0 bg-blue-700/40"></div>

          <div className="relative z-10">
            <div className="mb-3">
              <h1 className="text-4xl font-bold text-white tracking-tight">
                TixiMax
              </h1>
              <div className="h-1 w-20 bg-white/30 mx-auto mt-2 rounded-full"></div>
            </div>
            <p className="text-blue-100 text-sm font-medium">
              Hệ thống quản lý chuyên nghiệp
            </p>
          </div>
        </div>

        {/* FORM PHÍA DƯỚI GIỮ NGUYÊN */}
        <div className="px-8 py-6 bg-white">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Đăng Nhập</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Tên đăng nhập
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Nhập tên đăng nhập"
                disabled={loading}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Nhập mật khẩu"
                  disabled={loading}
                  className="w-full px-4 py-2.5 pr-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-not-allowed"
                >
                  {showPassword ? (
                    <FaEyeSlash className="w-4 h-4" />
                  ) : (
                    <FaEye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg text-sm"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Đang xử lý...
                </div>
              ) : (
                "Đăng Nhập"
              )}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-gray-400 font-medium">
                Hoặc đăng nhập với
              </span>
            </div>
          </div>

          <LoginGoogle buttonText="Tiếp tục với Google" disabled={loading} />

          <p className="text-center text-xs text-gray-500 mt-5 pt-5 border-t border-gray-100">
            Chưa có tài khoản?{" "}
            <Link
              to="/signup"
              className="text-blue-600 font-semibold hover:text-blue-800 hover:underline transition-colors"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>

        {/* FOOTER */}
        <div className="bg-gray-50 px-8 py-3 text-center border-t border-gray-100">
          <p className="text-xs text-gray-400">
            © 2024 TixiMax. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
