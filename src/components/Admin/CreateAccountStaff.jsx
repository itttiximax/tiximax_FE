import React, { useState, useEffect } from "react";
import registrationService from "../../Services/Auth/Registration";

const CreateAccountStaff = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    phone: "",
    name: "",
    role: "",
    department: "",
    location: "",
    routeIds: [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [routes, setRoutes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  // Mock data - replace with actual API calls
  useEffect(() => {
    setRoutes([
      { id: 1, name: "Tuyến 1 - Quận 1" },
      { id: 2, name: "Tuyến 2 - Quận 2" },
      { id: 3, name: "Tuyến 3 - Quận 3" },
      { id: 4, name: "Tuyến 4 - Quận 4" },
    ]);

    setLocations([
      { id: "1", name: "Chi nhánh HCM" },
      { id: "2", name: "Chi nhánh Hà Nội" },
      { id: "3", name: "Chi nhánh Đà Nẵng" },
    ]);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleRoleChange = (e) => {
    const role = e.target.value;
    setSelectedRole(role);
    setFormData((prev) => ({
      ...prev,
      role: role,
      department: "",
      location: "",
      routeIds: [],
    }));
  };

  const handleRouteChange = (e) => {
    const options = e.target.options;
    const selectedRoutes = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedRoutes.push(parseInt(options[i].value));
      }
    }
    setFormData((prev) => ({
      ...prev,
      routeIds: selectedRoutes,
    }));
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      STAFF_SALE: "Nhân viên bán hàng",
      LEAD_SALE: "Trưởng nhóm bán hàng",
      STAFF_PURCHASER: "Nhân viên mua hàng",
      STAFF_WAREHOUSE_FOREIGN: "Nhân viên kho ngoại",
      STAFF_WAREHOUSE_DOMESTIC: "Nhân viên kho nội",
      MANAGER: "Quản lý",
      ADMIN: "Quản trị viên",
    };
    return roleNames[role] || role;
  };

  const isFieldRequired = (fieldName) => {
    const requiredFields =
      registrationService.getRequiredFieldsByRole(selectedRole);
    return requiredFields.includes(fieldName);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setErrors({});
      setSuccessMessage("");

      // Validate data
      const validation =
        registrationService.validateStaffRegistrationData(formData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }

      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registrationData } = formData;

      // Register staff
      const result = await registrationService.registerStaff(registrationData);

      setSuccessMessage(
        `Tạo tài khoản thành công! Mã nhân viên: ${result.staffCode}`
      );

      // Reset form
      setFormData({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        phone: "",
        name: "",
        role: "",
        department: "",
        location: "",
        routeIds: [],
      });
      setSelectedRole("");

      console.log("Registration successful:", result);
    } catch (error) {
      console.error("Registration failed:", error);

      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else if (error.message) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: "Có lỗi xảy ra khi tạo tài khoản" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      phone: "",
      name: "",
      role: "",
      department: "",
      location: "",
      routeIds: [],
    });
    setSelectedRole("");
    setErrors({});
    setSuccessMessage("");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            Tạo tài khoản nhân viên
          </h2>
          <p className="text-gray-600 mt-1">
            Điền thông tin để tạo tài khoản mới cho nhân viên
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {successMessage}
              </div>
            </div>
          )}

          {/* General Error */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.general}
              </div>
            </div>
          )}

          {/* Basic Information Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
              Thông tin cơ bản
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tên đăng nhập <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Nhập tên đăng nhập"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.username ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                )}
              </div>

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ email"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Nhập mật khẩu"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Xác nhận mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Nhập lại mật khẩu"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Work Information Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
              Thông tin công việc
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Role */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Vai trò <span className="text-red-500">*</span>
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleRoleChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.role ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Chọn vai trò</option>
                  {Object.entries(registrationService.ROLES)
                    .filter(([key]) => key !== "CUSTOMER")
                    .map(([key, value]) => (
                      <option key={value} value={value}>
                        {getRoleDisplayName(value)}
                      </option>
                    ))}
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                )}
              </div>

              {/* Department */}
              {selectedRole && isFieldRequired("department") && (
                <div>
                  <label
                    htmlFor="department"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phòng ban <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.department ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Chọn phòng ban</option>
                    {Object.entries(registrationService.DEPARTMENTS).map(
                      ([key, value]) => (
                        <option key={value} value={value}>
                          {key === "SALE"
                            ? "Bán hàng"
                            : key === "WAREHOUSE"
                            ? "Kho"
                            : key === "PURCHASING"
                            ? "Mua hàng"
                            : key === "MANAGEMENT"
                            ? "Quản lý"
                            : value}
                        </option>
                      )
                    )}
                  </select>
                  {errors.department && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.department}
                    </p>
                  )}
                </div>
              )}

              {/* Location */}
              {selectedRole && isFieldRequired("location") && (
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Địa điểm làm việc <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.location ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Chọn địa điểm làm việc</option>
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.location}
                    </p>
                  )}
                </div>
              )}

              {/* Route IDs for STAFF_SALE */}
              {selectedRole === "STAFF_SALE" && (
                <div className="md:col-span-2 lg:col-span-3">
                  <label
                    htmlFor="routeIds"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Tuyến đường phụ trách{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="routeIds"
                    name="routeIds"
                    multiple
                    value={formData.routeIds}
                    onChange={handleRouteChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 ${
                      errors.routeIds ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    {routes.map((route) => (
                      <option key={route.id} value={route.id}>
                        {route.name}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-sm text-gray-500">
                    Giữ Ctrl (hoặc Cmd) để chọn nhiều tuyến
                  </p>
                  {errors.routeIds && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.routeIds}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Đặt lại
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang tạo...
                </div>
              ) : (
                "Tạo tài khoản"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAccountStaff;
