import React, { useState, useEffect } from "react";
import profileService from "../../Services/SharedService/profileService";
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
} from "lucide-react";

const StaffProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileService.getCurrentAccount();
        setProfile(data);
      } catch (err) {
        setError("Không thể tải dữ liệu hồ sơ.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen ">
        <Loader2 className="w-12 h-12 text-sky-600 animate-spin mb-4" />
        <p className="text-slate-600 text-lg">Đang tải hồ sơ của bạn...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-red-50 to-pink-50">
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
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
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
      active: "bg-green-100 text-green-700 border-green-200",
      inactive: "bg-slate-100 text-slate-700 border-slate-200",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    };

    const statusText = {
      active: "Hoạt động",
      inactive: "Không hoạt động",
      pending: "Chờ xử lý",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium border ${
          statusColors[status?.toLowerCase()] || statusColors.inactive
        }`}
      >
        {statusText[status?.toLowerCase()] || status}
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
      <div className=" mx-auto">
        {/* Header Card - Avatar, Name, Authorities */}
        <div className="bg-gradient-to-r from-sky-600 to-sky-600 rounded-2xl shadow-xl p-8 mb-6 text-white">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
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
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Contact & Work Information Combined */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
              {/* Contact Information Section */}
              <div className="mb-6">
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

              {/* Divider */}
              <div className="border-t border-slate-200 my-6"></div>

              {/* Work Information Section */}
              <div>
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
          </div>

          {/* Right Column - Account Status & Timeline */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
              {/* Account Status Section */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <CheckCircle className="text-sky-600" size={24} />
                  Trạng thái tài khoản
                </h2>
                <div className="space-y-3">
                  {[
                    {
                      label: "Đang kích hoạt",
                      value: profile.enabled,
                    },
                    {
                      label: "Đã xác minh",
                      value: profile.verify,
                    },
                    {
                      label: "Không bị khóa",
                      value: profile.accountNonLocked,
                    },
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
                      className="flex items-center justify-between p-3 rounded-lg text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-700">
                          {item.label}
                        </span>
                      </div>
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

              {/* Divider */}
              <div className="border-t border-slate-200 my-6"></div>

              {/* Timeline Section */}
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Calendar className="text-sky-600" size={24} />
                  Thời gian
                </h2>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;
