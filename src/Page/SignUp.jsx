import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import registrationService from "../Services/Auth/Registration";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    const validation = registrationService.validateRegistrationData(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Prepare data for API (exclude confirmPassword)
      const { confirmPassword, ...registrationData } = formData;

      // Only send fields that have values for optional fields
      const cleanedData = Object.keys(registrationData).reduce((acc, key) => {
        const value = registrationData[key];

        // Always include required fields
        const requiredFields = [
          "username",
          "password",
          "email",
          "phone",
          "name",
          "role",
        ];

        // Include field if it's required or has a non-empty value
        if (requiredFields.includes(key) || (value && value.trim() !== "")) {
          acc[key] = value;
        }

        return acc;
      }, {});

      console.log("Submitting registration data:", cleanedData); // Debug log

      await registrationService.registerCustomer(cleanedData);

      setSuccess("Đăng ký thành công! Chuyển hướng đến trang đăng nhập...");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (err) {
      console.error("Registration error:", err);

      if (err.response?.data?.message) {
        setErrors({ general: err.response.data.message });
      } else if (err.response?.status === 400) {
        setErrors({
          general: "Dữ liệu đăng ký không hợp lệ. Vui lòng kiểm tra lại.",
        });
      } else if (err.response?.status === 409) {
        setErrors({
          general:
            "Tên đăng nhập hoặc email đã tồn tại. Vui lòng chọn tên khác.",
        });
      } else {
        setErrors({ general: "Đăng ký thất bại. Vui lòng thử lại." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      {/* Left side - Image */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-yellow-50">
        <img
          src="https://i.ibb.co/8c7HptR/running.png"
          alt="illustration"
          className="max-h-[80%] object-contain"
        />
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-16 bg-black text-white overflow-y-auto">
        <h1 className="text-4xl font-bold mb-3 text-yellow-400">
          Tạo Tài Khoản
        </h1>
        <p className="text-gray-300 mb-6">
          Tham gia với chúng tôi ngay hôm nay!
        </p>

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 bg-green-600 text-white rounded-lg">
            {success}
          </div>
        )}

        {/* General Error Message */}
        {errors.general && (
          <div className="mb-4 p-4 bg-red-600 text-white rounded-lg">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-gray-200 mb-2 text-sm font-semibold">
              Tên đăng nhập *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Nhập tên đăng nhập"
              className={`w-full border rounded-lg px-4 py-3 bg-gray-800 text-white focus:outline-none focus:ring-2 transition ${
                errors.username
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-600 focus:ring-yellow-400"
              }`}
              required
            />
            {errors.username && (
              <p className="text-red-400 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-gray-200 mb-2 text-sm font-semibold">
              Họ và Tên *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Nhập họ và tên của bạn"
              className={`w-full border rounded-lg px-4 py-3 bg-gray-800 text-white focus:outline-none focus:ring-2 transition ${
                errors.name
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-600 focus:ring-yellow-400"
              }`}
              required
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-200 mb-2 text-sm font-semibold">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Nhập email của bạn"
              className={`w-full border rounded-lg px-4 py-3 bg-gray-800 text-white focus:outline-none focus:ring-2 transition ${
                errors.email
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-600 focus:ring-yellow-400"
              }`}
              required
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-200 mb-2 text-sm font-semibold">
              Số điện thoại *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Nhập số điện thoại (VD: 0901234567)"
              className={`w-full border rounded-lg px-4 py-3 bg-gray-800 text-white focus:outline-none focus:ring-2 transition ${
                errors.phone
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-600 focus:ring-yellow-400"
              }`}
              required
            />
            {errors.phone && (
              <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-200 mb-2 text-sm font-semibold">
              Mật khẩu *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="********"
                className={`w-full border rounded-lg px-4 py-3 pr-12 bg-gray-800 text-white focus:outline-none focus:ring-2 transition ${
                  errors.password
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-600 focus:ring-yellow-400"
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-200 mb-2 text-sm font-semibold">
              Xác Nhận Mật Khẩu *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="********"
                className={`w-full border rounded-lg px-4 py-3 pr-12 bg-gray-800 text-white focus:outline-none focus:ring-2 transition ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-600 focus:ring-yellow-400"
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-300"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Address (Optional) */}
          <div>
            <label className="block text-gray-200 mb-2 text-sm font-semibold">
              Địa chỉ (không bắt buộc)
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Nhập địa chỉ của bạn"
              rows={3}
              className="w-full border border-gray-600 rounded-lg px-4 py-3 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition resize-none"
            />
          </div>

          {/* Source (Optional) */}
          <div>
            <label className="block text-gray-200 mb-2 text-sm font-semibold">
              Nguồn giới thiệu (không bắt buộc)
            </label>
            <input
              type="text"
              name="source"
              value={formData.source}
              onChange={handleInputChange}
              placeholder="Bạn biết đến chúng tôi qua đâu?"
              className="w-full border border-gray-600 rounded-lg px-4 py-3 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            />
          </div>

          {/* Sign Up button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-lg hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                Đang đăng ký...
              </div>
            ) : (
              "Đăng Ký"
            )}
          </button>
        </form>

        {/* Google button */}
        <button className="w-full flex justify-center items-center border border-gray-600 py-3 rounded-lg hover:bg-gray-700 transition mt-4">
          <FcGoogle className="mr-2 text-xl" />
          <span className="text-gray-200">Đăng ký bằng Google</span>
        </button>

        {/* Sign in link */}
        <p className="text-sm text-gray-300 text-center mt-6">
          Đã có tài khoản?{" "}
          <Link
            to="/signin"
            className="text-yellow-400 font-semibold hover:underline"
          >
            Đăng nhập ngay!
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
