import React, { useState, useEffect } from "react";
import { UserPlus, CheckCircle, AlertTriangle, Loader2, X } from "lucide-react";
import registrationService from "../../Services/Auth/Registration";
import managerRoutesService from "../../Services/Manager/managerRoutesService";

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
  const [successMessage, setSuccessMessage] = useState("");
  const [showRouteDropdown, setShowRouteDropdown] = useState(false);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const data = await managerRoutesService.getRoutes();
      setRoutes(data);
      console.log("Routes loaded:", data);
    } catch (error) {
      console.error("Error fetching routes:", error);
      setErrors((prev) => ({
        ...prev,
        general: "Không thể tải danh sách tuyến đường",
      }));
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

  const handleRouteSelect = (routeId) => {
    setFormData((prev) => ({
      ...prev,
      routeIds: prev.routeIds.includes(routeId)
        ? prev.routeIds.filter((id) => id !== routeId)
        : [...prev.routeIds, routeId],
    }));
    setShowRouteDropdown(false);
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

      const validation =
        registrationService.validateStaffRegistrationData(formData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }

      const { confirmPassword, ...registrationData } = formData;
      const result = await registrationService.registerStaff(registrationData);

      setSuccessMessage(
        `Tạo tài khoản thành công! Mã nhân viên: ${result.staffCode}`
      );

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-6 py-4">
          <h2 className="text-2xl font-bold flex items-center">
            <UserPlus className="w-6 h-6 mr-2" />
            Tạo tài khoản nhân viên
          </h2>
          <p className="text-indigo-100 mt-1">
            Điền thông tin để tạo tài khoản mới cho nhân viên
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 animate-fade-in">
          {/* Success Message */}
          {successMessage && (
            <div
              className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-800 rounded-r-lg flex items-center transition-all duration-300"
              role="alert"
              aria-live="assertive"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>{successMessage}</span>
              <button
                onClick={() => setSuccessMessage("")}
                className="ml-auto text-green-600 hover:text-green-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* General Error */}
          {errors.general && (
            <div
              className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-r-lg flex items-center transition-all duration-300"
              role="alert"
              aria-live="assertive"
            >
              <AlertTriangle className="w-5 h-5 mr-2" />
              <span>{errors.general}</span>
              <button
                onClick={() => setErrors({})}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Basic Information Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              Thông tin cơ bản
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Username */}
              <div className="relative">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`peer w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                    errors.username
                      ? "border-red-500"
                      : formData.username
                      ? "border-indigo-300"
                      : "border-gray-300"
                  }`}
                  placeholder=" "
                  aria-describedby="username-error"
                />
                <label
                  htmlFor="username"
                  className="absolute left-3 -top-2.5 text-sm text-gray-600 bg-white px-1 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600"
                >
                  Tên đăng nhập <span className="text-red-500">*</span>
                </label>
                {errors.username && (
                  <p
                    id="username-error"
                    className="mt-1 text-sm text-red-600"
                    aria-live="polite"
                  >
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Name */}
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`peer w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                    errors.name
                      ? "border-red-500"
                      : formData.name
                      ? "border-indigo-300"
                      : "border-gray-300"
                  }`}
                  placeholder=" "
                  aria-describedby="name-error"
                />
                <label
                  htmlFor="name"
                  className="absolute left-3 -top-2.5 text-sm text-gray-600 bg-white px-1 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600"
                >
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                {errors.name && (
                  <p
                    id="name-error"
                    className="mt-1 text-sm text-red-600"
                    aria-live="polite"
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`peer w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                    errors.email
                      ? "border-red-500"
                      : formData.email
                      ? "border-indigo-300"
                      : "border-gray-300"
                  }`}
                  placeholder=" "
                  aria-describedby="email-error"
                />
                <label
                  htmlFor="email"
                  className="absolute left-3 -top-2.5 text-sm text-gray-600 bg-white px-1 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                {errors.email && (
                  <p
                    id="email-error"
                    className="mt-1 text-sm text-red-600"
                    aria-live="polite"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="relative">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`peer w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                    errors.phone
                      ? "border-red-500"
                      : formData.phone
                      ? "border-indigo-300"
                      : "border-gray-300"
                  }`}
                  placeholder=" "
                  aria-describedby="phone-error"
                />
                <label
                  htmlFor="phone"
                  className="absolute left-3 -top-2.5 text-sm text-gray-600 bg-white px-1 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600"
                >
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                {errors.phone && (
                  <p
                    id="phone-error"
                    className="mt-1 text-sm text-red-600"
                    aria-live="polite"
                  >
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`peer w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                    errors.password
                      ? "border-red-500"
                      : formData.password
                      ? "border-indigo-300"
                      : "border-gray-300"
                  }`}
                  placeholder=" "
                  aria-describedby="password-error"
                />
                <label
                  htmlFor="password"
                  className="absolute left-3 -top-2.5 text-sm text-gray-600 bg-white px-1 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600"
                >
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                {errors.password && (
                  <p
                    id="password-error"
                    className="mt-1 text-sm text-red-600"
                    aria-live="polite"
                  >
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`peer w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : formData.confirmPassword
                      ? "border-indigo-300"
                      : "border-gray-300"
                  }`}
                  placeholder=" "
                  aria-describedby="confirmPassword-error"
                />
                <label
                  htmlFor="confirmPassword"
                  className="absolute left-3 -top-2.5 text-sm text-gray-600 bg-white px-1 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600"
                >
                  Xác nhận mật khẩu <span className="text-red-500">*</span>
                </label>
                {errors.confirmPassword && (
                  <p
                    id="confirmPassword-error"
                    className="mt-1 text-sm text-red-600"
                    aria-live="polite"
                  >
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Work Information Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              Thông tin công việc
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Role */}
              <div className="relative">
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleRoleChange}
                  className={`peer w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 appearance-none ${
                    errors.role
                      ? "border-red-500"
                      : formData.role
                      ? "border-indigo-300"
                      : "border-gray-300"
                  }`}
                  aria-describedby="role-error"
                >
                  <option value="">Chọn vai trò</option>
                  <option value="STAFF_SALE">Nhân viên bán hàng</option>
                  <option value="LEAD_SALE">Trưởng nhóm bán hàng</option>
                  <option value="STAFF_PURCHASER">Nhân viên mua hàng</option>
                  <option value="STAFF_WAREHOUSE_FOREIGN">
                    Nhân viên kho ngoại
                  </option>
                  <option value="STAFF_WAREHOUSE_DOMESTIC">
                    Nhân viên kho nội
                  </option>
                  <option value="MANAGER">Quản lý</option>
                </select>
                <label
                  htmlFor="role"
                  className="absolute left-3 -top-2.5 text-sm text-gray-600 bg-white px-1"
                >
                  Vai trò <span className="text-red-500">*</span>
                </label>
                {errors.role && (
                  <p
                    id="role-error"
                    className="mt-1 text-sm text-red-600"
                    aria-live="polite"
                  >
                    {errors.role}
                  </p>
                )}
              </div>

              {/* Department */}
              <div className="relative">
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className={`peer w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                    errors.department
                      ? "border-red-500"
                      : formData.department
                      ? "border-indigo-300"
                      : "border-gray-300"
                  }`}
                  placeholder=" "
                  aria-describedby="department-error"
                />
                <label
                  htmlFor="department"
                  className="absolute left-3 -top-2.5 text-sm text-gray-600 bg-white px-1 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600"
                >
                  Phòng ban
                </label>
                {errors.department && (
                  <p
                    id="department-error"
                    className="mt-1 text-sm text-red-600"
                    aria-live="polite"
                  >
                    {errors.department}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Các phòng ban: SALE, WAREHOUSE, PURCHASING, MANAGEMENT
                </p>
              </div>

              {/* Location */}
              <div className="relative">
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`peer w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                    errors.location
                      ? "border-red-500"
                      : formData.location
                      ? "border-indigo-300"
                      : "border-gray-300"
                  }`}
                  placeholder=" "
                  aria-describedby="location-error"
                />
                <label
                  htmlFor="location"
                  className="absolute left-3 -top-2.5 text-sm text-gray-600 bg-white px-1 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600"
                >
                  Địa điểm làm việc
                </label>
                {errors.location && (
                  <p
                    id="location-error"
                    className="mt-1 text-sm text-red-600"
                    aria-live="polite"
                  >
                    {errors.location}
                  </p>
                )}
              </div>

              {/* Route IDs */}
              <div className="sm:col-span-2 lg:col-span-3">
                <label
                  htmlFor="routeIds"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tuyến đường phụ trách (chỉ cho nhân viên bán hàng)
                </label>
                <div className="relative">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.routeIds.map((routeId) => {
                      const route = routes.find((r) => r.routeId === routeId);
                      return (
                        <span
                          key={routeId}
                          className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                        >
                          {route?.name || `Tuyến ${routeId}`}
                          <button
                            type="button"
                            onClick={() => handleRouteSelect(routeId)}
                            className="ml-2 text-indigo-600 hover:text-indigo-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowRouteDropdown(!showRouteDropdown)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                  >
                    {formData.routeIds.length === 0
                      ? "Chọn tuyến đường"
                      : "Thêm tuyến đường"}
                  </button>
                  {showRouteDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {routes.map((route) => (
                        <button
                          key={route.routeId}
                          type="button"
                          onClick={() => handleRouteSelect(route.routeId)}
                          className={`w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-indigo-50 transition-all duration-200 ${
                            formData.routeIds.includes(route.routeId)
                              ? "bg-indigo-100"
                              : ""
                          }`}
                        >
                          {route.name} -{" "}
                          {route.note || `Tuyến ${route.routeId}`}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Nhấp để chọn hoặc bỏ chọn tuyến đường
                </p>
                {errors.routeIds && (
                  <p className="mt-1 text-sm text-red-600" aria-live="polite">
                    {errors.routeIds}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
            >
              Đặt lại
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 border border-transparent rounded-lg text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
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
