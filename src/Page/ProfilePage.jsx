import React, { useState, useEffect } from "react";
import profileService from "../Services/SharedService/profileService";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch profile data
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

  // Format date
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

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "HOAT_DONG":
        return "bg-green-100 text-green-800";
      case "KHOA":
        return "bg-red-100 text-red-800";
      case "CHO_DUYET":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get role color
  const getRoleColor = (role) => {
    switch (role) {
      case "CUSTOMER":
        return "bg-blue-100 text-blue-800";
      case "STAFF":
        return "bg-purple-100 text-purple-800";
      case "MANAGER":
        return "bg-orange-100 text-orange-800";
      case "ADMIN":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Đang tải thông tin...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <svg
              className="w-12 h-12 text-red-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không thể tải thông tin
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {profile?.name || "N/A"}
              </h1>
              <p className="text-lg text-gray-600 mb-3">@{profile?.username}</p>
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Thông tin cá nhân
              </h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Họ và tên
                </label>
                <p className="text-gray-900 font-medium">
                  {profile?.name || "N/A"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Email
                </label>
                <p className="text-gray-900">{profile?.email || "N/A"}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Số điện thoại
                </label>
                <p className="text-gray-900">{profile?.phone || "N/A"}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Địa chỉ
                </label>
                <p className="text-gray-900">{profile?.address || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Thông tin tài khoản
              </h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  ID tài khoản
                </label>
                <p className="text-gray-900 font-mono">#{profile?.accountId}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Tên đăng nhập
                </label>
                <p className="text-gray-900">{profile?.username}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Mã khách hàng
                </label>
                <div className="inline-flex items-center px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                  <span className="text-gray-900 font-mono text-sm">
                    {profile?.customerCode}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Nguồn khách hàng
                </label>
                <p className="text-gray-900">{profile?.source || "N/A"}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Ngày tạo tài khoản
                </label>
                <p className="text-gray-900">
                  {formatDate(profile?.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-8">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <svg
                className="w-5 h-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Trạng thái tài khoản
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  profile?.enabled
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {profile?.enabled ? "Kích hoạt" : "Vô hiệu hóa"}
              </div>
              <p className="text-xs text-gray-500 mt-2">Trạng thái kích hoạt</p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  profile?.accountNonLocked
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {profile?.accountNonLocked ? "Không khóa" : "Bị khóa"}
              </div>
              <p className="text-xs text-gray-500 mt-2">Trạng thái khóa</p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  profile?.accountNonExpired
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {profile?.accountNonExpired ? "Còn hạn" : "Hết hạn"}
              </div>
              <p className="text-xs text-gray-500 mt-2">Thời hạn tài khoản</p>
            </div>
          </div>
        </div>

        {/* Authorities Section */}
        {profile?.authorities && profile.authorities.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m0 0v2m0-2h2m-2 0h-2m8-6a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Quyền hạn</h2>
            </div>

            <div className="flex flex-wrap gap-3">
              {profile.authorities.map((auth, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-lg text-sm font-medium"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {auth.authority}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
