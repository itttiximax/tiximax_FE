// /src/pages/Signup.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import registrationService from "../Services/Auth/Registration";
import LoginGoogle from "./LoginGoogle";
import OTPDialog from "./OTPDialog";
import LogoTixi from "../assets/TixiLogo.jpg";
import BgHeader from "../assets/bg.jpg";

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
    role: "CUSTOMER",
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
      const registrationData = { ...clean };
      delete registrationData.confirmPassword;
      delete registrationData.role;

      await registrationService.registerCustomer(registrationData);
      if (!isMountedRef.current) return;

      try {
        await registrationService.sendOTP(clean.email);
      } catch (e) {
        console.warn("sendOTP ngay sau đăng ký lỗi nhẹ:", e?.response || e);
      }

      setRegisteredEmail(clean.email);
      toast.success("Đăng ký thành công! Vui lòng xác thực email.");
      setShowOTPDialog(true);
    } catch (err) {
      if (!isMountedRef.current) return;

      const data = err?.response?.data;
      const fieldErrors = data?.errors;

      if (fieldErrors && typeof fieldErrors === "object") {
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
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4"
      style={{
        backgroundImage: `url(${LogoTixi})`,
      }}
    >
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div
          className="px-8 py-8 text-center bg-cover bg-center bg-no-repeat relative"
          style={{
            backgroundImage: `url(${BgHeader})`,
          }}
        >
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

        {/* Form Container */}
        <div className="px-8 py-6 bg-white">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Tạo Tài Khoản
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <fieldset disabled={submitting}>
              {/* Row 1: Username & Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Tên đăng nhập <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Nhập tên đăng nhập"
                    autoComplete="username"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nhập họ và tên"
                    autoComplete="name"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Email & Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                    autoComplete="email"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="0901234567"
                    autoComplete="tel"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
                    required
                  />
                </div>
              </div>

              {/* Row 3: Password & Confirm Password */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.password ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Nhập mật khẩu"
                      autoComplete="new-password"
                      minLength={6}
                      className="w-full px-4 py-2.5 pr-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePassword("password")}
                      aria-label={
                        showPasswords.password ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                      }
                      aria-pressed={showPasswords.password}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPasswords.password ? (
                        <FaEyeSlash className="w-4 h-4" />
                      ) : (
                        <FaEye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {/* <p className="text-xstext-black-500 mt-1">Min 6 ký tự</p> */}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Xác nhận mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Nhập lại mật khẩu"
                      autoComplete="new-password"
                      minLength={6}
                      className="w-full px-4 py-2.5 pr-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
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
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPasswords.confirmPassword ? (
                        <FaEyeSlash className="w-4 h-4" />
                      ) : (
                        <FaEye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Optional Fields */}
              <div className="pt-4 border-gray-400">
                <p className="text-xl text-black-500 mb-3">
                  Thông tin thêm (không bắt buộc)
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Địa chỉ
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Nhập địa chỉ"
                      autoComplete="street-address"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Nguồn giới thiệu
                    </label>
                    <input
                      type="text"
                      name="source"
                      value={formData.source}
                      onChange={handleInputChange}
                      placeholder="VD: Facebook, Google"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            </fieldset>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormFilled || submitting}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg text-sm"
            >
              {submitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Đang xử lý...
                </div>
              ) : (
                "Đăng Ký"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-gray-400 font-medium">
                Hoặc đăng ký với
              </span>
            </div>
          </div>

          {/* Google Signup */}
          <LoginGoogle buttonText="Tiếp tục với Google" disabled={submitting} />

          {/* Sign In Link */}
          <p className="text-center text-xs text-gray-500 mt-5 pt-5 border-t border-gray-100">
            Đã có tài khoản?{" "}
            <Link
              to="/signin"
              className="text-blue-600 font-semibold hover:text-blue-800 hover:underline transition-colors"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-3 text-center border-t border-gray-100">
          <p className="text-xs text-gray-400">
            © 2024 TixiMax. All rights reserved.
          </p>
        </div>
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
