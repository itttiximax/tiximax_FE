import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import registrationByStaffService from "../../Services/Auth/RegistrationByStaffService";
import { getToken } from "../../Services/Auth/authService";

const CreateAccountUser = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [createdAccount, setCreatedAccount] = useState(null);
  const [copiedField, setCopiedField] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    name: "",
    role: "CUSTOMER",
    address: "",
    source: "",
  });

  // Copy to clipboard function
  const copyToClipboard = async (text, fieldName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(""), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(""), 2000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation =
      registrationByStaffService.validateStaffRegistrationData(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const token = getToken();
      if (!token) {
        throw new Error("Không tìm thấy token xác thực");
      }

      const registrationData = {
        username: "",
        password: "",
        ...formData,
      };

      const result = await registrationByStaffService.registerCustomerByStaff(
        registrationData,
        token
      );

      setCreatedAccount(result);
    } catch (err) {
      console.error("Account creation error:", err);

      if (err.response?.data?.message) {
        setErrors({ general: err.response.data.message });
      } else if (err.response?.status === 400) {
        setErrors({
          general: "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.",
        });
      } else if (err.response?.status === 401) {
        setErrors({
          general: "Không có quyền truy cập. Vui lòng đăng nhập lại.",
        });
      } else if (err.response?.status === 409) {
        setErrors({
          general:
            "Email hoặc số điện thoại đã tồn tại. Vui lòng sử dụng thông tin khác.",
        });
      } else {
        setErrors({ general: "Tạo tài khoản thất bại. Vui lòng thử lại." });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnother = () => {
    setCreatedAccount(null);
    setCopiedField("");
    setFormData({
      email: "",
      phone: "",
      name: "",
      role: "CUSTOMER",
      address: "",
      source: "",
    });
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Tạo Tài Khoản Khách Hàng
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Side - Create Form */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Nhập thông tin khách hàng
            </h2>

            {errors.general && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-4">
                {errors.general}
              </div>
            )}

            <div className="bg-blue-50 text-blue-600 text-sm p-3 rounded mb-4">
              Tên đăng nhập và mật khẩu sẽ được tạo tự động và hiển thị sau khi
              tạo tài khoản.
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Nhập email"
                  className={`w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                  className={`w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên"
                  className={`w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ (không bắt buộc)"
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Source */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Nguồn giới thiệu
                </label>
                <input
                  type="text"
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  placeholder="Nguồn giới thiệu (không bắt buộc)"
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {loading ? "Đang tạo..." : "Tạo tài khoản"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-100"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>

          {/* Right Side - Success Display */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Thông tin đăng nhập
            </h2>

            {createdAccount ? (
              <div className="space-y-4">
                <div className="bg-green-50 text-green-600 text-sm p-3 rounded">
                  Tạo tài khoản thành công! Vui lòng gửi thông tin này cho khách
                  hàng.
                </div>

                {/* Login Info */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700">
                      Thông tin đăng nhập
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `Tên đăng nhập: ${createdAccount.username}\nMật khẩu: 123456`,
                          "login"
                        )
                      }
                      className={`px-3 py-1 text-sm rounded-lg ${
                        copiedField === "login"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {copiedField === "login" ? "Đã sao chép" : "Sao chép"}
                    </button>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tên đăng nhập:</span>
                      <span className="font-mono">
                        {createdAccount.username}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Mật khẩu:</span>
                      <span className="font-mono">123456</span>
                    </div>
                  </div>
                  <p className="text-xs text-amber-600 mt-2">
                    Mật khẩu mặc định. Khuyến khích đổi mật khẩu sau lần đăng
                    nhập đầu tiên.
                  </p>
                </div>

                {/* Email */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700">
                      Email
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(createdAccount.email, "email")
                      }
                      className={`px-3 py-1 text-sm rounded-lg ${
                        copiedField === "email"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {copiedField === "email" ? "Đã sao chép" : "Sao chép"}
                    </button>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm">
                    {createdAccount.email}
                  </div>
                </div>

                {/* Phone */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700">
                      Số điện thoại
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(createdAccount.phone, "phone")
                      }
                      className={`px-3 py-1 text-sm rounded-lg ${
                        copiedField === "phone"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {copiedField === "phone" ? "Đã sao chép" : "Sao chép"}
                    </button>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm">
                    {createdAccount.phone}
                  </div>
                </div>

                {/* Customer Code and Account ID */}
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <span className="text-sm font-semibold text-gray-600">
                      Mã khách hàng:
                    </span>
                    <div className="text-sm font-mono text-blue-600 mt-1">
                      {createdAccount.customerCode}
                    </div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <span className="text-sm font-semibold text-gray-600">
                      ID tài khoản:
                    </span>
                    <div className="text-sm font-mono text-blue-600 mt-1">
                      {createdAccount.accountId}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCreateAnother}
                  className="w-full bg-blue-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-blue-700"
                >
                  Tạo tài khoản khác
                </button>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p className="text-sm font-medium">
                  Chưa có thông tin đăng nhập
                </p>
                <p className="text-xs mt-1">
                  Thông tin sẽ hiển thị sau khi tạo tài khoản thành công.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccountUser;
