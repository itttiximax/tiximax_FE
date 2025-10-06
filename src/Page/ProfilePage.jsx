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
} from "lucide-react";
import profileService from "../Services/SharedService/profileService";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await profileService.getCurrentAccount();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "HOAT_DONG":
        return "bg-emerald-100 text-emerald-700";
      case "KHOA":
        return "bg-red-100 text-red-700";
      case "CHO_DUYET":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "CUSTOMER":
        return "bg-blue-100 text-blue-700";
      case "STAFF":
        return "bg-purple-100 text-purple-700";
      case "MANAGER":
        return "bg-orange-100 text-orange-700";
      case "ADMIN":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-3 animate-fade-in">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
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
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200"
              aria-label="Thử lại"
            >
              Thử lại
            </button>
            <button
              onClick={() => setError(null)}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md">
              <User className="w-16 h-16 text-teal-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">
                {profile?.name || "N/A"}
              </h1>
              <p className="text-lg text-gray-200 mb-3">@{profile?.username}</p>
              <div className="flex flex-wrap gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(
                    profile?.role
                  )}`}
                >
                  {profile?.role}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    profile?.status
                  )}`}
                >
                  {profile?.status === "HOAT_DONG"
                    ? "Hoạt động"
                    : profile?.status}
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <article className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
                <User className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Thông tin cá nhân
              </h2>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Họ và tên
                </label>
                <p className="text-gray-900 font-medium">
                  {profile?.name || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email
                </label>
                <p className="text-gray-900">{profile?.email || "N/A"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Số điện thoại
                </label>
                <p className="text-gray-900">{profile?.phone || "N/A"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Địa chỉ
                </label>
                <p className="text-gray-900">{profile?.address || "N/A"}</p>
              </div>
            </div>
          </article>

          {/* Account Information */}
          <article className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mr-3">
                <Lock className="w-5 h-5 text-cyan-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Thông tin tài khoản
              </h2>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  ID tài khoản
                </label>
                <p className="text-gray-900 font-mono">#{profile?.accountId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Tên đăng nhập
                </label>
                <p className="text-gray-900">{profile?.username}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Mã khách hàng
                </label>
                <div className="inline-flex items-center px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                  <span className="text-gray-900 font-mono text-sm">
                    {profile?.customerCode}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Nguồn khách hàng
                </label>
                <p className="text-gray-900">{profile?.source || "N/A"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Ngày tạo tài khoản
                </label>
                <p className="text-gray-900">
                  {formatDate(profile?.createdAt)}
                </p>
              </div>
            </div>
          </article>
        </div>

        {/* Account Status */}
        <article className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mt-8">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Trạng thái tài khoản
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  profile?.enabled
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {profile?.enabled ? "Kích hoạt" : "Vô hiệu hóa"}
              </div>
              <p className="text-xs text-gray-600 mt-2">Trạng thái kích hoạt</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  profile?.accountNonLocked
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {profile?.accountNonLocked ? "Không khóa" : "Bị khóa"}
              </div>
              <p className="text-xs text-gray-600 mt-2">Trạng thái khóa</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  profile?.accountNonExpired
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {profile?.accountNonExpired ? "Còn hạn" : "Hết hạn"}
              </div>
              <p className="text-xs text-gray-600 mt-2">Thời hạn tài khoản</p>
            </div>
          </div>
        </article>

        {/* Authorities Section */}
        {profile?.authorities && profile.authorities.length > 0 && (
          <article className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mt-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <Shield className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Quyền hạn</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {profile.authorities.map((auth, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-200 transition-colors duration-200"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  {auth.authority}
                </span>
              ))}
            </div>
          </article>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
