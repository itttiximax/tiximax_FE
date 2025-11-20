import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Shield,
  Loader2,
  AlertTriangle,
  X,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";
import profileService from "../Services/SharedService/profileService";
import registrationService from "../Services/Auth/Registration";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Change Password States
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await profileService.getCurrentAccount();
        setProfile(data);
      } catch (error) {
        setError(error.message);
        toast.error("Không thể tải thông tin profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "HOAT_DONG":
        return "bg-green-50 text-green-700 border-green-100";
      case "KHOA":
        return "bg-red-50 text-red-700 border-red-100";
      case "CHO_DUYET":
        return "bg-yellow-50 text-yellow-700 border-yellow-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "CUSTOMER":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "STAFF":
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "MANAGER":
        return "bg-orange-50 text-orange-700 border-orange-100";
      case "ADMIN":
        return "bg-red-50 text-red-700 border-red-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  // Password Change Handlers
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setPasswordError("");
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validatePassword = () => {
    if (
      !passwordData.oldPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmNewPassword
    ) {
      setPasswordError("Vui lòng điền đầy đủ thông tin");
      return false;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return false;
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordError("Mật khẩu mới không khớp");
      return false;
    }

    if (passwordData.oldPassword === passwordData.newPassword) {
      setPasswordError("Mật khẩu mới phải khác mật khẩu cũ");
      return false;
    }

    return true;
  };

  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!validatePassword()) return;

    setIsChangingPassword(true);

    try {
      await registrationService.changePassword(
        passwordData.oldPassword,
        passwordData.newPassword,
        passwordData.confirmNewPassword
      );

      setPasswordSuccess("Đổi mật khẩu thành công!");
      toast.success("Đổi mật khẩu thành công!");

      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });

      setTimeout(() => {
        setShowChangePassword(false);
        setPasswordSuccess("");
      }, 2000);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || "Đổi mật khẩu thất bại";
      setPasswordError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const closePasswordModal = () => {
    setShowChangePassword(false);
    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setPasswordError("");
    setPasswordSuccess("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="text-lg text-gray-700">Đang tải thông tin...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Không thể tải thông tin
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-blue-500 rounded-xl shadow-sm p-5 mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <User size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">
                  {profile?.name || "N/A"}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(
                  profile?.role
                )}`}
              >
                {profile?.role}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                  profile?.status
                )}`}
              >
                {profile?.status === "HOAT_DONG"
                  ? "Hoạt động"
                  : profile?.status}
              </span>
              <button
                onClick={() => setShowChangePassword(true)}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                <Lock size={16} />
                Đổi mật khẩu
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Personal Information */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <User size={18} className="text-blue-600" />
              </div>
              <h2 className="text-base font-semibold text-gray-900">
                Thông tin cá nhân
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Họ và tên
                </label>
                <p className="text-sm font-medium text-gray-900">
                  {profile?.name || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Email
                </label>
                <p className="text-sm font-medium text-gray-900">
                  {profile?.email || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Số điện thoại
                </label>
                <p className="text-sm font-medium text-gray-900">
                  {profile?.phone || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Địa chỉ
                </label>
                <p className="text-sm text-gray-900">
                  {profile?.address || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Lock size={18} className="text-blue-600" />
              </div>
              <h2 className="text-base font-semibold text-gray-900">
                Thông tin tài khoản
              </h2>
            </div>
            <div className="space-y-4">
              <div></div>
              <div>
                <label className="block text-2xs text-gray-600 mb-1">
                  Tên đăng nhập
                </label>
                <p className="text-sm font-medium text-gray-900">
                  {profile?.username}
                </p>
              </div>
              <div>
                <label className="block text-2xs text-gray-600 mb-1">
                  Ngày tạo
                </label>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(profile?.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Status */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Shield size={18} className="text-blue-600" />
            </div>
            <h2 className="text-base font-semibold text-gray-900">
              Trạng thái tài khoản
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-gray-200">
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  profile?.enabled
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {profile?.enabled ? "Kích hoạt" : "Vô hiệu hóa"}
              </div>
              <p className="text-xs text-black-600 mt-2">
                Trạng thái kích hoạt
              </p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-gray-200">
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  profile?.accountNonLocked
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {profile?.accountNonLocked ? "Không khóa" : "Bị khóa"}
              </div>
              <p className="text-xs text-black-600 mt-2">Trạng thái khóa</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-gray-200">
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  profile?.accountNonExpired
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {profile?.accountNonExpired ? "Còn hạn" : "Hết hạn"}
              </div>
              <p className="text-xs text-black-600 mt-2">Thời hạn tài khoản</p>
            </div>
          </div>
        </div>

        {/* Authorities */}
        {profile?.authorities && profile.authorities.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 mt-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Shield size={18} className="text-blue-600" />
              </div>
              <h2 className="text-base font-semibold text-gray-900">
                Quyền hạn
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.authorities.map((auth, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium border border-blue-100"
                >
                  <Shield size={12} className="mr-1.5" />
                  {auth.authority}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={closePasswordModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Lock className="text-blue-600" size={20} />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Đổi mật khẩu
              </h2>
            </div>

            <form onSubmit={handleSubmitPasswordChange} className="space-y-4">
              {/* Old Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu cũ
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.old ? "text" : "password"}
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Nhập mật khẩu cũ"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("old")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.old ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Nhập mật khẩu mới"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirmNewPassword"
                    value={passwordData.confirmNewPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Nhập lại mật khẩu mới"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {passwordError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="text-red-500" size={18} />
                  <p className="text-sm text-red-600">{passwordError}</p>
                </div>
              )}

              {/* Success Message */}
              {passwordSuccess && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <Check className="text-green-500" size={18} />
                  <p className="text-sm text-green-600">{passwordSuccess}</p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closePasswordModal}
                  disabled={isChangingPassword}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Đang xử lý...
                    </>
                  ) : (
                    "Xác nhận"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
