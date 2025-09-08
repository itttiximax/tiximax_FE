import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Validation
    if (!email.trim()) {
      setError("Vui lòng nhập email.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Email không hợp lệ.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Simulate API call for password reset
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSuccess(
        "Liên kết đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư!"
      );

      // In real app, you would call your password reset API here
      // await authService.forgotPassword(email);
    } catch (err) {
      console.error("Reset password error:", err);
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = email.trim() && validateEmail(email);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quên Mật Khẩu
          </h1>
          <p className="text-gray-600">
            Nhập email để đặt lại mật khẩu của bạn
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-3 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {success}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-3 text-red-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Form */}
        <div className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Nhập email của bạn"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all duration-200 ${
                error && !success
                  ? "border-red-300 focus:ring-red-200"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              disabled={loading || success}
              required
            />
          </div>

          {/* Reset Password Button */}
          <button
            onClick={handleResetPassword}
            disabled={loading || !isFormValid || success}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Đang gửi...
              </div>
            ) : success ? (
              "Đã gửi thành công"
            ) : (
              "Gửi Liên Kết Đặt Lại"
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Hoặc</span>
          </div>
        </div>

        {/* Back to Sign In */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Nhớ mật khẩu?{" "}
            <Link
              to="/signin"
              className="text-blue-600 font-semibold hover:text-blue-800 hover:underline transition-colors"
            >
              Quay lại Đăng Nhập
            </Link>
          </p>
        </div>

        {/* Additional Help */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            <span className="font-medium">Lưu ý:</span> Kiểm tra cả thư mục spam
            nếu không thấy email đặt lại mật khẩu.
          </p>
        </div>

        {/* Try Again Button (shown after success) */}
        {success && (
          <button
            onClick={() => {
              setSuccess("");
              setEmail("");
            }}
            className="w-full mt-4 bg-gray-100 text-gray-700 font-medium py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            Gửi lại với email khác
          </button>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
