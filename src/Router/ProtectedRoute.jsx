import React from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Đang kiểm tra authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">
            Đang kiểm tra quyền truy cập...
          </p>
        </div>
      </div>
    );
  }

  // Chưa đăng nhập → Redirect về trang đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  // Kiểm tra quyền truy cập (role)
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    const handleBack = () => {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate("/");
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Không có quyền truy cập
          </h1>

          <p className="text-gray-600 mb-6">
            Xin lỗi, bạn không có quyền truy cập vào trang này. Vui lòng liên hệ
            quản trị viên nếu bạn nghĩ đây là lỗi.
          </p>

          <div className="space-y-3">
            <Link
              to="/"
              className="block w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-2 px-4 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 transition duration-200"
            >
              Về trang chủ
            </Link>
            <button
              onClick={handleBack}
              className="block w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-200 transition duration-200"
            >
              Quay lại
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Tài khoản hiện tại:{" "}
              <span className="font-semibold">{user?.name || user?.email}</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">Role: {user?.role}</p>
          </div>
        </div>
      </div>
    );
  }

  // Đã đăng nhập và có quyền → Render component
  return children;
};

export default ProtectedRoute;
