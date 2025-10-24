// /src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoTixi from "../assets/TixiLogo.jpg";
import BgHeader from "../assets/bg.jpg";
import OTPDialog from "./OTPDialog";
import registrationService from "../Services/Auth/Registration";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // OTP dialog
  const [showOTPDialog, setShowOTPDialog] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Validate
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
    setSuccess("");

    try {
      // GỌI API THẬT gửi OTP
      // registrationService.sendOTP sẽ POST /otp/send?email=...
      await registrationService.sendOTP(email);

      setSuccess("Đã gửi mã OTP đến email của bạn.");
      // Mở OTP dialog để xác thực
      setShowOTPDialog(true);
    } catch (err) {
      console.error("Send OTP error:", err);
      // Cố gắng lấy message đẹp từ server
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Không thể gửi OTP. Vui lòng thử lại sau.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Khi xác thực OTP thành công → chuyển sang trang đổi mật khẩu
  const handleVerifySuccess = () => {
    setShowOTPDialog(false);
    navigate("/reset-password", {
      replace: true,
      state: { email },
    });
  };

  const isFormValid = email.trim() && validateEmail(email);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4"
      style={{ backgroundImage: `url(${LogoTixi})` }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header có ảnh nền rõ (không mờ) */}
        <div
          className="px-8 py-8 text-center bg-cover bg-center bg-no-repeat relative"
          style={{ backgroundImage: `url(${BgHeader})` }}
        >
          <h1 className="text-3xl font-bold text-white mb-2 drop-shadow">
            Quên Mật Khẩu
          </h1>
          <p className="text-blue-100 font-medium drop-shadow">
            Nhập email để chúng tôi gửi mã xác thực (OTP)
          </p>
        </div>

        {/* Body giữ nền trắng */}
        <div className="p-8">
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
          <form onSubmit={handleResetPassword} className="space-y-6">
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
                disabled={loading}
                required
              />
            </div>

            {/* Send OTP Button */}
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Đang gửi OTP...
                </div>
              ) : (
                "Gửi Mã OTP"
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
              <span className="font-medium">Lưu ý:</span> Kiểm tra cả thư mục
              spam nếu không thấy email OTP.
            </p>
          </div>
        </div>
      </div>

      {/* OTP Dialog */}
      <OTPDialog
        isOpen={showOTPDialog}
        onClose={() => setShowOTPDialog(false)}
        email={email}
        onVerifySuccess={handleVerifySuccess}
      />
    </div>
  );
};

export default ForgotPassword;
