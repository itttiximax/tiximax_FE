import React, { useState } from "react";
import {
  FiMail,
  FiPhone,
  FiUser,
  FiMapPin,
  FiUsers,
  FiCopy,
  FiCheck,
  FiUserPlus,
  FiLock,
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
} from "react-icons/fi";
import registrationByStaffService from "../../Services/Auth/RegistrationByStaffService";
import { getToken } from "../../Services/Auth/authService";
import { toast, Toaster } from "react-hot-toast";

const CreateAccountUser = () => {
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
      toast.success(
        `Đã sao chép ${
          fieldName === "login" ? "thông tin đăng nhập" : fieldName
        }!`
      );
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
      toast.success(
        `Đã sao chép ${
          fieldName === "login" ? "thông tin đăng nhập" : fieldName
        }!`
      );
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
      toast.error("Vui lòng kiểm tra lại thông tin nhập vào!");
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
      toast.success("Tạo tài khoản thành công!");
    } catch (err) {
      console.error("Account creation error:", err);

      if (err.response?.data?.message) {
        setErrors({ general: err.response.data.message });
        toast.error(err.response.data.message);
      } else if (err.response?.status === 400) {
        setErrors({
          general: "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.",
        });
        toast.error("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.");
      } else if (err.response?.status === 401) {
        setErrors({
          general: "Không có quyền truy cập. Vui lòng đăng nhập lại.",
        });
        toast.error("Không có quyền truy cập. Vui lòng đăng nhập lại.");
      } else if (err.response?.status === 409) {
        setErrors({
          general:
            "Email hoặc số điện thoại đã tồn tại. Vui lòng sử dụng thông tin khác.",
        });
        toast.error(
          "Email hoặc số điện thoại đã tồn tại. Vui lòng sử dụng thông tin khác."
        );
      } else {
        setErrors({ general: "Tạo tài khoản thất bại. Vui lòng thử lại." });
        toast.error("Tạo tài khoản thất bại. Vui lòng thử lại.");
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
    toast("Đã làm mới form tạo tài khoản!");
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Tạo Tài Khoản Khách Hàng
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Create Form */}
          <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
            <div className="flex items-center mb-6">
              <FiUser className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">
                Nhập thông tin khách hàng
              </h2>
            </div>

            <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm p-4 rounded-lg mb-6 flex items-start">
              <FiInfo className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
              <div>Tên đăng nhập và mật khẩu sẽ được tạo tự động</div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FiMail className="w-4 h-4 mr-2" />
                  Email <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Nhập địa chỉ email"
                    className={`w-full border rounded-lg p-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.email
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                    required
                  />
                  <FiMail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-2 flex items-center">
                    <FiAlertCircle className="w-3 h-3 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FiPhone className="w-4 h-4 mr-2" />
                  Số điện thoại <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Nhập số điện thoại"
                    className={`w-full border rounded-lg p-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.phone
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                    required
                  />
                  <FiPhone className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-2 flex items-center">
                    <FiAlertCircle className="w-3 h-3 mr-1" />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FiUser className="w-4 h-4 mr-2" />
                  Họ và tên <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nhập họ và tên đầy đủ"
                    className={`w-full border rounded-lg p-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.name
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                    required
                  />
                  <FiUser className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs mt-2 flex items-center">
                    <FiAlertCircle className="w-3 h-3 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FiMapPin className="w-4 h- mr-2" />
                  Địa chỉ
                </label>
                <div className="relative">
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Nhập địa chỉ (không bắt buộc)"
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg p-1 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-colors"
                  />
                  <FiMapPin className="absolute left-3 top-4 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Source */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FiUsers className="w-4 h-4 mr-2" />
                  Nguồn giới thiệu
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="source"
                    value={formData.source}
                    onChange={handleInputChange}
                    placeholder="Nguồn giới thiệu (không bắt buộc)"
                    className="w-full border border-gray-300 rounded-lg p-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  />
                  <FiUsers className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white text-sm font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      <FiUserPlus className="w-4 h-4 mr-2" />
                      Tạo tài khoản
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Side - Success Display */}
          <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
            <div className="flex items-center mb-6">
              <FiLock className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">
                Thông tin đăng nhập
              </h2>
            </div>

            {createdAccount ? (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-4 rounded-lg flex items-center">
                  <FiCheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Tạo tài khoản thành công!</div>
                  </div>
                </div>

                {/* Login Info */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700 flex items-center">
                      <FiLock className="w-4 h-4 mr-2" />
                      Thông tin đăng nhập
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `Tên đăng nhập: ${createdAccount.username}\nMật khẩu: 123456`,
                          "login"
                        )
                      }
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center ${
                        copiedField === "login"
                          ? "bg-green-100 text-green-700"
                          : "bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {copiedField === "login" ? (
                        <>
                          <FiCheck className="w-4 h-4 mr-1" />
                          Đã sao chép
                        </>
                      ) : (
                        <>
                          <FiCopy className="w-4 h-4 mr-1" />
                          Sao chép
                        </>
                      )}
                    </button>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Tên đăng nhập:</span>
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                        {createdAccount.username}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Mật khẩu:</span>
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                        123456
                      </span>
                    </div>
                  </div>
                  <div className="bg-amber-50 border-t border-amber-200 px-4 py-3">
                    <p className="text-xs text-amber-700 flex items-center">
                      <FiInfo className="w-3 h-3 mr-1" />
                      Mật khẩu mặc định. Khuyến khích đổi mật khẩu sau lần đăng
                      nhập đầu tiên.
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700 flex items-center">
                      <FiMail className="w-4 h-4 mr-2" />
                      Email
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="text-sm bg-gray-50 p-1 rounded">
                      {createdAccount.email}
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700 flex items-center">
                      <FiPhone className="w-4 h-4 mr-2" />
                      Số điện thoại
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="text-sm bg-gray-50 p-1 rounded">
                      {createdAccount.phone}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCreateAnother}
                  className="w-full bg-blue-600 text-white text-sm font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <FiUserPlus className="w-4 h-4 mr-2" />
                  Tạo tài khoản khác
                </button>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiLock className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-sm font-medium mb-1">
                  Chưa có thông tin đăng nhập
                </p>
                <p className="text-xs">
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

/// pok
