import React, { useState, useEffect } from "react";
import {
  UserPlus,
  CheckCircle,
  AlertTriangle,
  Loader2,
  X,
  Eye,
  EyeOff,
  Shield,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Building2,
  Route,
  ChevronDown,
} from "lucide-react";
import registrationService from "../../Services/Auth/Registration";
import managerRoutesService from "../../Services/Manager/managerRoutesService";
import ConfirmDialog from "../../common/ConfirmDialog";
import toast from "react-hot-toast";
import registrationByStaffService from "../../Services/Auth/RegistrationByStaffService";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const data = await managerRoutesService.getRoutes();
      setRoutes(data);
    } catch (error) {
      console.error("Error fetching routes:", error);
      toast.error("Không thể tải danh sách tuyến đường");
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

  const handleRouteToggle = (routeId) => {
    setFormData((prev) => ({
      ...prev,
      routeIds: prev.routeIds.includes(routeId)
        ? prev.routeIds.filter((id) => id !== routeId)
        : [...prev.routeIds, routeId],
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
    };
    return roleNames[role] || role;
  };

  const handleSubmitClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      setLoading(true);
      setErrors({});

      const validation =
        registrationByStaffService.validateStaffRegistrationData(formData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        setShowConfirmDialog(false);
        return;
      }

      const { confirmPassword, ...registrationData } = formData;
      const result = await registrationService.registerStaff(registrationData);

      toast.success(
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
    } catch (error) {
      console.error("Registration failed:", error);

      // XỬ LÝ ERROR TỪ BACKEND
      let errorMessage = "Có lỗi xảy ra khi tạo tài khoản";

      if (error.response?.data) {
        // Trường hợp 1: Backend trả về string trực tiếp
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        }
        // Trường hợp 2: Backend trả về object có message
        else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        // Trường hợp 3: Backend trả về object có error
        else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setShowConfirmDialog(false);
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
  };

  // Calculate form completion percentage
  const calculateProgress = () => {
    const fields = Object.keys(formData).filter((key) => key !== "routeIds");
    const filled = fields.filter((key) => formData[key]).length;
    return Math.round((filled / fields.length) * 100);
  };

  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header với Progress - KHÔNG DÙNG SVG */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <UserPlus className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Tạo tài khoản nhân viên
                </h1>
              </div>
            </div>

            {/* Progress Bar - THAY THẾ SVG */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-gray-500">Tiến độ hoàn thành</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {progress}%
                </p>
              </div>
              <div className="w-24">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-600 to-blue-600 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <CheckCircle
                    className={`w-4 h-4 ${
                      progress === 100 ? "text-green-600" : "text-gray-400"
                    }`}
                  />
                  <span className="text-xs text-gray-500">
                    {progress === 100 ? "Hoàn tất" : "Đang điền"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Account Info */}
          <div className="col-span-12 lg:col-span-6 space-y-6">
            {/* Thông tin tài khoản */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Thông tin tài khoản
                </h3>
              </div>

              <div className="space-y-5">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên đăng nhập <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                      errors.username ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Nhập tên đăng nhập"
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.username}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Nhập mật khẩu"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xác nhận mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Nhập lại mật khẩu"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Thông tin cá nhân */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-6">
                <Mail className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Thông tin cá nhân
                </h3>
              </div>

              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Nguyễn Văn A"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="email@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="0912345678"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Work Info */}
          <div className="col-span-12 lg:col-span-6 space-y-6">
            {/* Thông tin công việc */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-6">
                <Briefcase className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Thông tin công việc
                </h3>
              </div>

              <div className="space-y-5">
                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vai trò <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleRoleChange}
                      className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none transition-all ${
                        errors.role ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Chọn vai trò</option>
                      <option value="STAFF_SALE">Nhân viên bán hàng</option>
                      <option value="LEAD_SALE">Trưởng nhóm bán hàng</option>
                      <option value="STAFF_PURCHASER">
                        Nhân viên mua hàng
                      </option>
                      <option value="STAFF_WAREHOUSE_FOREIGN">
                        Nhân viên kho ngoại
                      </option>
                      <option value="STAFF_WAREHOUSE_DOMESTIC">
                        Nhân viên kho nội
                      </option>
                      <option value="MANAGER">Quản lý</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                  )}
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phòng ban
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder="VD: SALE, WAREHOUSE, PURCHASING"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa điểm làm việc
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder="Hà Nội, Hồ Chí Minh..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tuyến đường */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-6">
                <Route className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Tuyến đường phụ trách
                </h3>
              </div>

              {/* Selected Routes Pills */}
              {formData.routeIds.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.routeIds.map((routeId) => {
                    const route = routes.find((r) => r.routeId === routeId);
                    return (
                      <span
                        key={routeId}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium transition-all hover:bg-indigo-200"
                      >
                        {route?.name || `Tuyến ${routeId}`}
                        <button
                          type="button"
                          onClick={() => handleRouteToggle(routeId)}
                          className="hover:text-indigo-900"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Routes Grid - Hiển thị TẤT CẢ routes */}
              <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {routes.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Không có tuyến đường nào
                  </p>
                ) : (
                  routes.map((route) => (
                    <label
                      key={route.routeId}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.routeIds.includes(route.routeId)}
                        onChange={() => handleRouteToggle(route.routeId)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">
                          {route.name}
                        </p>
                        {route.note && (
                          <p className="text-xs text-gray-500">{route.note}</p>
                        )}
                      </div>
                    </label>
                  ))
                )}
              </div>
              <p className="mt-3 text-xs text-gray-500">
                Chỉ áp dụng cho nhân viên bán hàng
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {errors.general && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="text-sm font-medium">{errors.general}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
              >
                Đặt lại
              </button>
              <button
                type="button"
                onClick={handleSubmitClick}
                disabled={loading || progress < 80}
                className={`px-6 py-3 rounded-lg text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all flex items-center gap-2 ${
                  loading || progress < 80
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md hover:shadow-lg"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Tạo tài khoản
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Confirm Dialog */}
        <ConfirmDialog
          isOpen={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          onConfirm={handleConfirmSubmit}
          title="Xác nhận tạo tài khoản nhân viên"
          message={
            <div className="space-y-3">
              <p className="text-gray-700">
                Bạn có chắc chắn muốn tạo tài khoản với thông tin sau:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2 border border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tên đăng nhập:</span>
                  <span className="font-semibold text-gray-900">
                    {formData.username}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Họ và tên:</span>
                  <span className="font-semibold text-gray-900">
                    {formData.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-semibold text-gray-900">
                    {formData.email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vai trò:</span>
                  <span className="font-semibold text-gray-900">
                    {getRoleDisplayName(formData.role)}
                  </span>
                </div>
                {formData.routeIds.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số tuyến đường:</span>
                    <span className="font-semibold text-gray-900">
                      {formData.routeIds.length}
                    </span>
                  </div>
                )}
              </div>
            </div>
          }
          confirmText="Tạo tài khoản"
          cancelText="Hủy"
          loading={loading}
          loadingText="Đang tạo tài khoản"
          type="info"
        />
      </div>
    </div>
  );
};

export default CreateAccountStaff;
