import React, { useState, useEffect } from "react";
import profileService from "../../Services/SharedService/profileService";
import registrationService from "../../Services/Auth/Registration";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  CheckCircle,
  Calendar,
  Hash,
  Building,
  MapPin,
  Shield,
  Check,
  Lock,
  Clock,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  X,
} from "lucide-react";

const StaffProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Change Password States
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
        const data = await profileService.getCurrentAccount();
        setProfile(data);
      } catch {
        setError("Không thể tải dữ liệu hồ sơ.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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
      setPasswordError(
        err.response?.data?.message || err.message || "Đổi mật khẩu thất bại"
      );
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
      <div className="flex flex-col justify-center items-center h-screen">
        <Loader2 className="w-12 h-12 text-sky-600 animate-spin mb-4" />
        <p className="text-slate-600 text-lg">Đang tải hồ sơ của bạn...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <p className="text-red-600 text-xl font-semibold">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <AlertCircle className="w-16 h-16 text-slate-400 mb-4" />
        <p className="text-slate-600 text-xl">Không có dữ liệu hồ sơ</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const StatusBadge = ({ status }) => {
    const statusColors = {
      HOAT_DONG: "bg-green-100 text-green-700 border-green-200",
      inactive: "bg-slate-100 text-slate-700 border-slate-200",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    };

    const statusText = {
      HOAT_DONG: "Hoạt động",
      inactive: "Không hoạt động",
      pending: "Chờ xử lý",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium border ${
          statusColors[status] || statusColors.inactive
        }`}
      >
        {statusText[status] || status}
      </span>
    );
  };

  const InfoCard = ({ icon: Icon, label, value, fullWidth = false }) => (
    <div
      className={`${
        fullWidth ? "col-span-1 md:col-span-2" : ""
      } bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-all duration-300 hover:border-sky-300`}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-sky-50 rounded-lg">
          <Icon size={20} className="text-sky-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-500 font-medium mb-1">{label}</p>
          <p className="text-sm text-slate-900 font-semibold break-words">
            {value}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-sky-600 to-sky-600 rounded-2xl shadow-xl p-8 mb-6 text-white">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30 shadow-lg">
              <span className="text-3xl font-bold text-white">
                {getInitials(profile.name)}
              </span>
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
              <p className="text-sky-100 text-lg mb-3">@{profile.username}</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <StatusBadge status={profile.status} />
                {profile.verify && (
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium flex items-center gap-1 border border-white/30">
                    <Check size={16} />
                    Đã xác minh
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowChangePassword(true)}
              className="px-6 py-3 bg-white text-sky-600 rounded-xl font-semibold hover:bg-sky-50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <Lock size={20} />
              Đổi mật khẩu
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Mail className="text-sky-600" size={24} />
                Thông tin liên hệ
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard icon={Mail} label="Email" value={profile.email} />
                <InfoCard
                  icon={Phone}
                  label="Số điện thoại"
                  value={profile.phone}
                />
                <InfoCard
                  icon={Hash}
                  label="Mã nhân viên"
                  value={profile.staffCode}
                />
              </div>
            </div>

            {/* Work Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Briefcase className="text-sky-600" size={24} />
                Thông tin công việc
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard
                  icon={Briefcase}
                  label="Vai trò"
                  value={profile.role}
                />
                <InfoCard
                  icon={Building}
                  label="Phòng ban"
                  value={profile.department}
                />
                <InfoCard
                  icon={MapPin}
                  label="Địa điểm"
                  value={profile.location}
                  fullWidth
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Account Status */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <CheckCircle className="text-sky-600" size={24} />
                Trạng thái tài khoản
              </h2>
              <div className="space-y-3">
                {[
                  { label: "Đang kích hoạt", value: profile.enabled },
                  { label: "Đã xác minh", value: profile.verify },
                  { label: "Không bị khóa", value: profile.accountNonLocked },
                  {
                    label: "Tài khoản còn hạn",
                    value: profile.accountNonExpired,
                  },
                  {
                    label: "Thông tin hợp lệ",
                    value: profile.credentialsNonExpired,
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-sm font-medium text-slate-700">
                      {item.label}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.value
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.value ? "Có" : "Không"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Calendar className="text-sky-600" size={24} />
                Thời gian
              </h2>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 font-medium mb-1">
                  Ngày tạo tài khoản
                </p>
                <p className="text-sm text-slate-900 font-semibold">
                  {formatDate(profile.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={closePasswordModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-sky-100 rounded-xl">
                <Lock className="text-sky-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">
                Đổi mật khẩu
              </h2>
            </div>

            <form onSubmit={handleSubmitPasswordChange} className="space-y-4">
              {/* Old Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Mật khẩu cũ
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.old ? "text" : "password"}
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl 
                 focus:outline-none focus:ring-2 focus:ring-sky-500 
                 focus:border-sky-500 transition-all"
                    placeholder="Nhập mật khẩu cũ"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("old")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPasswords.old ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl 
                 focus:outline-none focus:ring-2 focus:ring-sky-500 
                 focus:border-sky-500 transition-all"
                    placeholder="Nhập mật khẩu mới"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPasswords.new ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Xác nhận mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirmNewPassword"
                    value={passwordData.confirmNewPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl 
                 focus:outline-none focus:ring-2 focus:ring-sky-500 
                 focus:border-sky-500 transition-all"
                    placeholder="Nhập lại mật khẩu mới"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {passwordError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="text-red-500" size={20} />
                  <p className="text-sm text-red-600 font-medium">
                    {passwordError}
                  </p>
                </div>
              )}

              {/* Success Message */}
              {passwordSuccess && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                  <Check className="text-green-500" size={20} />
                  <p className="text-sm text-green-600 font-medium">
                    {passwordSuccess}
                  </p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closePasswordModal}
                  className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                  disabled={isChangingPassword}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="flex-1 px-4 py-3 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
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

export default StaffProfile;
