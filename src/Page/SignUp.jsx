// /src/pages/Signup.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import registrationService from "../Services/Auth/Registration";
import LoginGoogle from "./LoginGoogle";
import OTPDialog from "./OTPDialog";

const sanitize = (obj) => ({
  ...obj,
  username: (obj.username || "").trim(),
  name: (obj.name || "").trim(),
  email: (obj.email || "").trim(),
  phone: (obj.phone || "").replace(/[^\d+]/g, "").trim(),
  address: (obj.address || "").trim(),
  source: (obj.source || "").trim(),
});

const Signup = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const isMountedRef = useRef(true);
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    phone: "",
    name: "",
    role: "CUSTOMER", // sẽ không gửi lên server; server nên set role
    address: "",
    source: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmPassword: false,
  });

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePassword = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const requiredFields = [
    "username",
    "name",
    "email",
    "phone",
    "password",
    "confirmPassword",
  ];

  const isFormFilled = useMemo(() => {
    return requiredFields.every((field) => {
      const value = formData[field];
      return value && String(value).trim() !== "";
    });
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const clean = sanitize(formData);

    setSubmitting(true);

    try {
      // Không cho client tự set role: để backend xử lý
      const registrationData = { ...clean };
      delete registrationData.confirmPassword;
      delete registrationData.role;

      // 1) Đăng ký
      await registrationService.registerCustomer(registrationData);
      if (!isMountedRef.current) return;

      // 2) Gửi OTP (soft-fail)
      try {
        await registrationService.sendOTP(clean.email);
      } catch (e) {
        console.warn("sendOTP ngay sau đăng ký lỗi nhẹ:", e?.response || e);
      }

      // 3) Mở OTP dialog
      setRegisteredEmail(clean.email);
      toast.success("Đăng ký thành công! Vui lòng xác thực email.");
      setShowOTPDialog(true);
    } catch (err) {
      if (!isMountedRef.current) return;

      const data = err?.response?.data;
      const fieldErrors = data?.errors;

      // Hiển thị lỗi từ backend bằng toast
      if (fieldErrors && typeof fieldErrors === "object") {
        // Hiển thị tất cả các lỗi field
        Object.entries(fieldErrors).forEach(([field, message]) => {
          toast.error(`${field}: ${message}`);
        });
      } else if (data?.message) {
        toast.error(data.message);
      } else {
        toast.error("Đăng ký thất bại. Vui lòng thử lại.");
      }
    } finally {
      if (isMountedRef.current) setSubmitting(false);
    }
  };

  const handleVerifySuccess = () => {
    setShowOTPDialog(false);
    navigate("/signin", {
      replace: true,
      state: { message: "Xác thực email thành công! Vui lòng đăng nhập." },
    });
  };

  const handleCloseDialog = () => {
    setShowOTPDialog(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tạo Tài Khoản
          </h1>
          <p className="text-gray-600">Tham gia với chúng tôi ngay hôm nay!</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Khóa toàn bộ input khi đang submit */}
          <fieldset disabled={submitting} className="space-y-6">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên đăng nhập *
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Nhập tên đăng nhập"
                  autoComplete="username"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên"
                  autoComplete="name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Nhập email"
                  autoComplete="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="VD: 0901234567"
                  autoComplete="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu *
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.password ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Nhập mật khẩu"
                    autoComplete="new-password"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePassword("password")}
                    aria-label={
                      showPasswords.password ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                    }
                    aria-pressed={showPasswords.password}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPasswords.password ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Tối thiểu 8 ký tự, gồm chữ và số.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xác nhận mật khẩu *
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Nhập lại mật khẩu"
                    autoComplete="new-password"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePassword("confirmPassword")}
                    aria-label={
                      showPasswords.confirmPassword
                        ? "Ẩn mật khẩu"
                        : "Hiện mật khẩu"
                    }
                    aria-pressed={showPasswords.confirmPassword}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPasswords.confirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>

            {/* Optional Fields */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700">
                Thông tin bổ sung (không bắt buộc)
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ của bạn"
                  rows={3}
                  autoComplete="street-address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nguồn giới thiệu
                </label>
                <input
                  type="text"
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  placeholder="Bạn biết đến chúng tôi qua đâu?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                />
              </div>
            </div>
          </fieldset>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormFilled || submitting}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mt-6"
          >
            {submitting ? "Đang đăng ký..." : "Đăng Ký"}
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

        {/* Google Signup */}
        <LoginGoogle buttonText="Đăng ký bằng Google" disabled={submitting} />

        {/* Sign In Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Đã có tài khoản?{" "}
          <Link
            to="/signin"
            className="text-blue-600 font-semibold hover:text-blue-800 hover:underline transition-colors"
          >
            Đăng nhập ngay!
          </Link>
        </p>
      </div>

      {/* OTP Dialog */}
      <OTPDialog
        isOpen={showOTPDialog}
        onClose={handleCloseDialog}
        email={registeredEmail}
        onVerifySuccess={handleVerifySuccess}
      />
    </div>
  );
};

export default Signup;
