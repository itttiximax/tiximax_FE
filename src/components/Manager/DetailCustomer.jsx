import React from "react";
import {
  X,
  Phone,
  Mail,
  User,
  Shield,
  Calendar,
  BadgeCheck,
} from "lucide-react";

const DetailCustomer = ({ customer, onClose }) => {
  if (!customer) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 bg-gray-100 rounded-full hover:bg-gray-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <User className="w-6 h-6 text-blue-600" /> Thông Tin Khách Hàng
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4 bg-gray-50">
            <p className="text-sm text-gray-600">Mã khách hàng</p>
            <p className="text-lg font-semibold">
              {customer.customerCode || "-"}
            </p>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50">
            <p className="text-sm text-gray-600">Tên</p>
            <p className="text-lg font-semibold">{customer.name}</p>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50 flex items-center gap-2">
            <Phone className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Số điện thoại</p>
              <p className="font-medium">{customer.phone || "-"}</p>
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50 flex items-center gap-2">
            <Mail className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{customer.email || "-"}</p>
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50 flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Vai trò</p>
              <p className="font-medium">{customer.role}</p>
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50 flex items-center gap-2">
            <BadgeCheck className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Trạng thái</p>
              <p
                className={`font-semibold ${
                  customer.status === "HOAT_DONG"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {customer.status === "HOAT_DONG"
                  ? "Hoạt động"
                  : "Không hoạt động"}
              </p>
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50 flex items-center gap-2 col-span-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">Ngày tạo</p>
              <p className="font-medium">
                {new Date(customer.createdAt).toLocaleString("vi-VN")}
              </p>
            </div>
          </div>
        </div>

        {/* Authorities */}
        <div className="mt-4 border rounded-lg p-4 bg-white">
          <h3 className="text-sm text-gray-700 mb-2 font-semibold">
            Phân quyền
          </h3>
          <div className="flex gap-2 flex-wrap">
            {customer.authorities?.map((a, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-sm font-medium"
              >
                {a.authority}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailCustomer;
