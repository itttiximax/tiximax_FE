import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { supabase } from "../config/supabaseClient";
import {
  login,
  googleLogin,
  verifySupabaseToken,
  getRole,
  ROLES,
} from "../Services/Auth/authService";

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
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔹 Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 🔹 Login bằng username/password
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(formData.username, formData.password);
      toast.success(`Xin chào ${data.name || formData.username}! 🎉`);

      const role = getRole();
      const route = roleRoutes[role] || "/";
      navigate(route);
    } catch (err) {
      console.error(err);
      toast.error("Đăng nhập thất bại! Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Login bằng Google (cho phép chọn lại tài khoản nếu muốn)
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) throw error;

      // Nếu đã có session Supabase
      if (session?.access_token) {
        const confirmUseOld = window.confirm(
          "Bạn đã đăng nhập Google trước đó.\n\nChọn 'OK' để dùng lại tài khoản hiện tại,\nhoặc 'Cancel' để đăng nhập bằng tài khoản khác."
        );

        if (confirmUseOld) {
          // Dùng lại tài khoản cũ
          const data = await verifySupabaseToken(session.access_token);
          toast.success(`Chào mừng ${data.user.name || data.user.email}! 🎉`);
          const route = roleRoutes[data.user.role] || "/";
          navigate(route);
          return;
        } else {
          // Đăng xuất khỏi Supabase để chọn tài khoản khác
          await supabase.auth.signOut();
          toast("Bạn có thể chọn tài khoản khác để đăng nhập.");
        }
      }
   
      await googleLogin();
     // if (loginError) throw loginError;
    } catch (err) {
      console.error("Google login failed:", err.message);
      toast.error("Đăng nhập Google thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Đăng Nhập</h1>
          <p className="text-gray-600">Chào mừng bạn trở lại</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên đăng nhập
            </label>
            <input
              type="text"
              name="username"
              placeholder="Nhập tên đăng nhập"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              placeholder="Nhập mật khẩu"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="ml-2 text-sm text-gray-600">Ghi nhớ tôi</span>
            </label>
            <a
              href="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              Quên mật khẩu?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading || !formData.username || !formData.password}
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

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Hoặc</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          <FcGoogle className="text-xl" />
          <span className="text-gray-700 font-medium">
            {loading ? "Đang xử lý..." : "Đăng nhập bằng Google"}
          </span>
        </button>

        <p className="text-center text-sm text-gray-600 mt-6">
          Chưa có tài khoản?{" "}
          <a
            href="/signup"
            className="text-blue-600 font-semibold hover:text-blue-800 hover:underline transition-colors"
          >
            Đăng ký ngay
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
