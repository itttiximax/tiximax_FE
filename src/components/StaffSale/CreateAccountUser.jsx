import React, { useState, useCallback, useRef, useMemo } from "react";
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

// Optimized InputField component with React.memo
const InputField = React.memo(
  ({
    label,
    icon: Icon,
    name,
    type = "text",
    placeholder,
    required,
    isTextarea,
    value,
    onChange,
    error,
  }) => (
    <div>
      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
        <Icon className="w-4 h-4 mr-2" />
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {isTextarea ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={3}
            className={`w-full border rounded-lg p-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-colors duration-200 ${
              error ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full border rounded-lg p-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
              error ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
            required={required}
          />
        )}
        <Icon className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-2 flex items-center">
          <FiAlertCircle className="w-3 h-3 mr-1" />
          {error}
        </p>
      )}
    </div>
  )
);

// Display components with React.memo
const SuccessAlert = React.memo(() => (
  <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-4 rounded-lg flex items-center">
    <FiCheckCircle className="w-5 h-5 mr-3" />
    <div className="font-medium">Tạo tài khoản thành công!</div>
  </div>
));

const InfoAlert = React.memo(() => (
  <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm p-4 rounded-lg mb-6 flex items-start">
    <FiInfo className="w-4 h-4 mr-2 mt-0.5" />
    <div className="font-medium">
      Tên đăng nhập và mật khẩu sẽ được tạo tự động
    </div>
  </div>
));

const EmptyLoginState = React.memo(() => (
  <div className="text-center py-12 text-gray-500">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <FiLock className="w-8 h-8 text-gray-00" />
    </div>
    <p className="text-sm font-medium">Chưa có thông tin đăng nhập</p>
    <p className="text-xs">
      Thông tin sẽ hiển thị sau khi tạo tài khoản thành công.
    </p>
  </div>
));

const CopyButton = React.memo(({ onClick, copied, text }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 text-sm rounded-lg flex items-center transition-all duration-200 ${
      copied
        ? "bg-green-100 text-green-700"
        : "bg-white text-gray-600 hover:bg-gray-50"
    }`}
  >
    {copied ? (
      <>
        <FiCheck className="w-4 h-4 mr-1" />
        Đã sao chép
      </>
    ) : (
      <>
        <FiCopy className="w-4 h-4 mr-1" />
        {text || "Sao chép"}
      </>
    )}
  </button>
));

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

  // Refs for debouncing
  const errorTimeoutRef = useRef({});
  const copyTimeoutRef = useRef();

  // Memoized initial form data
  const initialFormData = useMemo(
    () => ({
      email: "",
      phone: "",
      name: "",
      role: "CUSTOMER",
      address: "",
      source: "",
    }),
    []
  );

  // Optimized copy function with debounced reset
  const copyToClipboard = useCallback(async (text, fieldName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);

      const message = fieldName === "login" ? "thông tin đăng nhập" : fieldName;
      toast.success(`Đã sao chép ${message}!`);

      // Clear previous timeout
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }

      // Set new timeout
      copyTimeoutRef.current = setTimeout(() => {
        setCopiedField("");
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Sao chép thất bại!");
    }
  }, []);

  // Optimized input change handler with debounced error clearing
  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      // Update form data immediately for responsive typing
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Debounce error clearing to reduce re-renders
      if (errors[name]) {
        // Clear existing timeout for this field
        if (errorTimeoutRef.current[name]) {
          clearTimeout(errorTimeoutRef.current[name]);
        }

        // Set new timeout to clear error
        errorTimeoutRef.current[name] = setTimeout(() => {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
          });
        }, 500); // 500ms delay to avoid clearing errors too quickly
      }
    },
    [errors]
  );

  // Optimized form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Clear all pending error timeouts
      Object.values(errorTimeoutRef.current).forEach((timeout) => {
        if (timeout) clearTimeout(timeout);
      });
      errorTimeoutRef.current = {};

      const validation =
        registrationByStaffService.validateStaffRegistrationData(formData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        toast.error("Vui lòng kiểm tra lại thông tin!");
        return;
      }

      setLoading(true);
      setErrors({});

      try {
        const token = getToken();
        if (!token) throw new Error("Không tìm thấy token xác thực");

        const registrationData = { username: "", password: "", ...formData };
        const result = await registrationByStaffService.registerCustomerByStaff(
          registrationData,
          token
        );

        setCreatedAccount(result);
        toast.success("Tạo tài khoản thành công!");
      } catch (err) {
        const message = err.response?.data || "Tạo tài khoản thất bại!";
        setErrors({ general: message });
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [formData]
  );

  // Optimized reset function
  const handleCreateAnother = useCallback(() => {
    // Clear all timeouts
    Object.values(errorTimeoutRef.current).forEach((timeout) => {
      if (timeout) clearTimeout(timeout);
    });
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }

    // Reset state
    setCreatedAccount(null);
    setCopiedField("");
    setErrors({});
    setFormData(initialFormData);
    errorTimeoutRef.current = {};

    toast("Đã làm mới form!");
  }, [initialFormData]);

  // Cleanup timeouts on unmount
  React.useEffect(() => {
    return () => {
      Object.values(errorTimeoutRef.current).forEach((timeout) => {
        if (timeout) clearTimeout(timeout);
      });
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  // Memoized login info copy handler
  const handleCopyLogin = useCallback(() => {
    const loginText = `Tên đăng nhập: ${createdAccount.username}\nMật khẩu: 123456`;
    copyToClipboard(loginText, "login");
  }, [createdAccount?.username, copyToClipboard]);

  return (
    <div className="min-h-screen py-8 px-4">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Tạo Tài Khoản Khách Hàng
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
            <div className="flex items-center mb-6">
              <FiUser className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">
                Nhập thông tin khách hàng
              </h2>
            </div>

            <InfoAlert />

            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                label="Email"
                icon={FiMail}
                name="email"
                type="email"
                placeholder="Nhập địa chỉ email"
                required
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
              />

              <InputField
                label="Số điện thoại"
                icon={FiPhone}
                name="phone"
                type="tel"
                placeholder="Nhập số điện thoại"
                required
                value={formData.phone}
                onChange={handleInputChange}
                error={errors.phone}
              />

              <InputField
                label="Họ và tên"
                icon={FiUser}
                name="name"
                placeholder="Nhập họ và tên đầy đủ"
                required
                value={formData.name}
                onChange={handleInputChange}
                error={errors.name}
              />

              <InputField
                label="Địa chỉ"
                icon={FiMapPin}
                name="address"
                placeholder="Nhập địa chỉ (không bắt buộc)"
                isTextarea
                value={formData.address}
                onChange={handleInputChange}
                error={errors.address}
              />

              <InputField
                label="Nguồn giới thiệu"
                icon={FiUsers}
                name="source"
                placeholder="Nguồn giới thiệu (không bắt buộc)"
                value={formData.source}
                onChange={handleInputChange}
                error={errors.source}
              />

              {/* {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-lg flex items-center">
                  <FiAlertCircle className="w-4 h-4 mr-2" />
                  {errors.general}
                </div>
              )} */}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white text-sm font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <FiUserPlus className="w-4 h-4 mr-2" />
                    Tạo tài khoản
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Result Section */}
          <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
            <div className="flex items-center mb-6">
              <FiLock className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">
                Thông tin đăng nhập
              </h2>
            </div>

            {createdAccount ? (
              <div className="space-y-6">
                <SuccessAlert />

                {/* Login Info */}
                <div className="border border-gray-200 rounded-lg">
                  <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700 flex items-center">
                      <FiLock className="w-4 h-4 mr-2" />
                      Thông tin đăng nhập
                    </span>
                    <CopyButton
                      onClick={handleCopyLogin}
                      copied={copiedField === "login"}
                    />
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
                <div className="border border-gray-200 rounded-lg">
                  <div className="bg-gray-50 px-4 py-2 flex items-center">
                    <FiMail className="w-4 h-4 mr-2" />
                    <span className="text-sm font-semibold text-gray-700">
                      Email
                    </span>
                  </div>
                  <div className="p-4 text-sm bg-gray-50 rounded">
                    {createdAccount.email}
                  </div>
                </div>

                {/* Phone */}
                <div className="border border-gray-200 rounded-lg">
                  <div className="bg-gray-50 px-4 py-2 flex items-center">
                    <FiPhone className="w-4 h-4 mr-2" />
                    <span className="text-sm font-semibold text-gray-700">
                      Số điện thoại
                    </span>
                  </div>
                  <div className="p-4 text-sm bg-gray-50 rounded">
                    {createdAccount.phone}
                  </div>
                </div>

                <button
                  onClick={handleCreateAnother}
                  className="w-full bg-blue-600 text-white text-sm font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                >
                  <FiUserPlus className="w-4 h-4 mr-2" />
                  Tạo tài khoản khác
                </button>
              </div>
            ) : (
              <EmptyLoginState />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccountUser;
