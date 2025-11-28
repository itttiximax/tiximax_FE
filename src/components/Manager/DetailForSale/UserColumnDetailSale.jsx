import React from "react";
import { User, Users } from "lucide-react";

const SkeletonLine = () => (
  <div className="animate-pulse flex justify-between items-center">
    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
  </div>
);

const UserColumnDetailSale = ({ customer, staff, isLoading }) => {
  const getRoleText = (role) => {
    const roleMap = {
      CUSTOMER: "Khách hàng",
      STAFF_SALE: "Nhân viên bán hàng",
      LEAD_SALE: "Trưởng phòng kinh doanh",
      STAFF_WAREHOUSE: "Nhân viên kho",
      STAFF_WAREHOUSE_DOMESTIC: "Nhân viên kho trong nước",
      STAFF_WAREHOUSE_FOREIGN: "Nhân viên kho nước ngoài",
      STAFF_PURCHASER: "Nhân viên mua hàng",
      MANAGER: "Quản lý",
      ADMIN: "Quản trị viên",
    };
    return roleMap[role] || role;
  };

  return (
    <div className="space-y-4">
      {/* Customer Info */}
      {(customer || isLoading) && (
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-5 h-5 text-orange-700" />
            <h3 className="text-base font-semibold text-gray-900">
              Khách hàng
            </h3>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              <SkeletonLine />
              <SkeletonLine />
              <SkeletonLine />
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Mã KH:</span>
                <span className="font-semibold text-orange-700">
                  {customer.customerCode}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tên:</span>
                <span className="font-medium">{customer.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">SĐT:</span>
                <span className="font-medium">{customer.phone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Email:</span>
                <span className="text-xs break-all">{customer.email}</span>
              </div>
              {customer.source && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Nguồn:</span>
                  <span>{customer.source}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Trạng thái:</span>
                <span
                  className={`px-2 py-0.5 rounded text-xs ${
                    customer.status === "HOAT_DONG"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {customer.status === "HOAT_DONG"
                    ? "Hoạt động"
                    : "Không hoạt động"}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Staff Info */}
      {(staff || isLoading) && (
        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-indigo-700" />
            <h3 className="text-base font-semibold text-gray-900">
              Nhân viên phụ trách
            </h3>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              <SkeletonLine />
              <SkeletonLine />
              <SkeletonLine />
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Mã NV:</span>
                <span className="font-semibold text-indigo-700">
                  {staff.staffCode}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tên:</span>
                <span className="font-medium">{staff.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Chức vụ:</span>
                <span>{getRoleText(staff.role)}</span>
              </div>
              {staff.department && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Phòng ban:</span>
                  <span>{staff.department}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-600">SĐT:</span>
                <span className="font-medium">{staff.phone}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserColumnDetailSale;
