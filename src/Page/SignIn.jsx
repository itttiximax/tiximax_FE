import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { login, ROLES } from "../Services/Auth/authService";
import { useAuth } from "../contexts/AuthContext";
import LoginGoogle from "./LoginGoogle";

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
  const { login: setAuthUser } = useAuth(); // Get login function from Context

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
      console.log("🔐 Attempting login...");
      const response = await login(formData.username, formData.password);
      console.log("✅ Login response:", JSON.stringify(response, null, 2));

      // Lưu token vào localStorage
      const token =
        response.token || response.accessToken || response.user?.token;
      if (!token) {
        throw new Error("Token không được trả về từ API!");
      }
      localStorage.setItem("jwt", token); // Lưu token với key "jwt"

      // Cập nhật userData vào AuthContext
      const userData = {
        id: response.user?.id || response.id,
        username: response.user?.username || response.username,
        name: response.user?.name || response.name,
        email: response.user?.email || response.email,
        role: response.user?.role || response.role,
      };

      console.log("📝 Setting user in context:", userData);
      setAuthUser(userData);

      // Hiển thị thông báo thành công
      toast.success(`Chào mừng ${userData.name || userData.username}! 🎉`);

      // Điều hướng theo vai trò
      const route = roleRoutes[userData.role] || "/";
      console.log("🚀 Navigating to:", route);

      // Đợi một chút để đảm bảo Context được cập nhật
      await new Promise((resolve) => setTimeout(resolve, 100));
      navigate(route, { replace: true });
    } catch (error) {
      console.error("❌ Login error:", error);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Đăng Nhập</h1>
          <p className="text-gray-600">Chào mừng bạn trở lại!</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên đăng nhập
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Nhập tên đăng nhập"
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-not-allowed"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              Quên mật khẩu?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Đang đăng nhập...
              </div>
            ) : (
              "Đăng Nhập"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Hoặc</span>
          </div>
        </div>

        {/* Google Login */}
        <LoginGoogle buttonText="Đăng nhập bằng Google" disabled={loading} />

        {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Chưa có tài khoản?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-semibold hover:text-blue-800 hover:underline transition-colors"
          >
            Đăng ký ngay!
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
