import React from "react";
import {
  X,
  Package,
  CreditCard,
  ShoppingCart,
  Home,
  FileText,
  MapPin,
  User,
  Users,
  TrendingUp,
  Calendar,
  Loader2,
} from "lucide-react";

const DetailOrder = ({
  orderData,
  onClose,
  availableStatuses = [],
  isLoading = false,
}) => {
  if (!orderData) return null;

  const formatPrice = (price) => {
    if (!price) return "-";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusColor = (status) => {
    const statusInfo = availableStatuses.find((s) => s.key === status);
    if (!statusInfo) return "bg-gray-100 text-gray-800";

    const colorMap = {
      gray: "bg-gray-100 text-gray-800",
      green: "bg-green-100 text-green-800",
      orange: "bg-orange-100 text-orange-800",
      blue: "bg-blue-100 text-blue-800",
      indigo: "bg-indigo-100 text-indigo-800",
      slate: "bg-slate-100 text-slate-800",
      purple: "bg-purple-100 text-purple-800",
      yellow: "bg-yellow-100 text-yellow-800",
      cyan: "bg-cyan-100 text-cyan-800",
      pink: "bg-pink-100 text-pink-800",
      teal: "bg-teal-100 text-teal-800",
      emerald: "bg-emerald-100 text-emerald-800",
      red: "bg-red-100 text-red-800",
    };
    return colorMap[statusInfo.color] || "bg-gray-100 text-gray-800";
  };

  const getOrderTypeText = (type) => {
    const typeMap = {
      MUA_HO: "Mua hộ",
      VAN_CHUYEN: "Vận chuyển",
    };
    return typeMap[type] || type;
  };

  const getRoleText = (role) => {
    const roleMap = {
      CUSTOMER: "Khách hàng",
      STAFF_SALE: "Nhân viên bán hàng",
      STAFF_WAREHOUSE: "Nhân viên kho",
      MANAGER: "Quản lý",
    };
    return roleMap[role] || role;
  };

  const getStatusText = (status) => {
    const statusInfo = availableStatuses.find((s) => s.key === status);
    return statusInfo ? statusInfo.label : status;
  };

  // Skeleton loader component
  const SkeletonLine = () => (
    <div className="animate-pulse flex justify-between items-center">
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 animate-fadeIn">
      <div className="relative top-4 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white mb-8 animate-slideDown">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Chi tiết đơn hàng #{orderData.orderCode}
            </h2>
            {isLoading && (
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: Order Info */}
            <div className="space-y-6">
              {/* Basic Order Info */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-gray-700" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Thông tin đơn hàng
                  </h3>
                </div>
                {isLoading ? (
                  <div className="space-y-3">
                    <SkeletonLine />
                    <SkeletonLine />
                    <SkeletonLine />
                    <SkeletonLine />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Mã đơn:</span>
                      <span className="font-medium text-blue-600">
                        {orderData.orderCode}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Loại đơn:</span>
                      <span className="font-medium">
                        {getOrderTypeText(orderData.orderType)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Trạng thái:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          orderData.status
                        )}`}
                      >
                        {getStatusText(orderData.status)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Kiểm tra bắt buộc:</span>
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          orderData.checkRequired
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {orderData.checkRequired ? "Có" : "Không"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Financial Info */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5 text-blue-700" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Thông tin tài chính
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tỷ giá:</span>
                    <span className="font-medium">
                      {orderData.exchangeRate
                        ? `${orderData.exchangeRate.toLocaleString(
                            "vi-VN"
                          )} VNĐ`
                        : "Chưa cập nhật"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tổng tiền:</span>
                    <span className="font-bold text-lg text-blue-600">
                      {formatPrice(orderData.finalPriceOrder) || "Chưa tính"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Route & Destination */}
              {(orderData.route || orderData.destination) && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-green-700" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Tuyến đường & Điểm đến
                    </h3>
                  </div>
                  {isLoading ? (
                    <div className="space-y-3">
                      <SkeletonLine />
                      <SkeletonLine />
                      <SkeletonLine />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orderData.route && (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Mã tuyến:</span>
                            <span className="font-medium">
                              {orderData.route.name}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                              Thời gian vận chuyển:
                            </span>
                            <span className="font-medium">
                              {orderData.route.shipTime} ngày
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                              Phí vận chuyển:
                            </span>
                            <span className="font-medium">
                              {formatPrice(orderData.route.unitShippingPrice)}
                            </span>
                          </div>
                          {orderData.route.note && (
                            <div className="pt-2 border-t border-green-200">
                              <span className="text-gray-600 text-sm">
                                Tuyến:{" "}
                              </span>
                              <span className="text-sm">
                                {orderData.route.note}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                      {orderData.destination && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Điểm đến:</span>
                          <span className="font-medium">
                            {orderData.destination.destinationName}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Column 2: Customer & Staff Info */}
            <div className="space-y-6">
              {/* Customer Info */}
              {orderData.customer && (
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-purple-700" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Thông tin khách hàng
                    </h3>
                  </div>
                  {isLoading ? (
                    <div className="space-y-3">
                      <SkeletonLine />
                      <SkeletonLine />
                      <SkeletonLine />
                      <SkeletonLine />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Mã khách hàng:</span>
                        <span className="font-medium text-purple-600">
                          {orderData.customer.customerCode}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Tên:</span>
                        <span className="font-medium">
                          {orderData.customer.name}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Điện thoại:</span>
                        <span className="font-medium">
                          {orderData.customer.phone}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium text-sm">
                          {orderData.customer.email}
                        </span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-gray-600">Địa chỉ:</span>
                        <span className="font-medium text-right max-w-48">
                          {orderData.customer.address}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Nguồn:</span>
                        <span className="font-medium">
                          {orderData.customer.source}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Trạng thái:</span>
                        <span
                          className={`px-2 py-1 rounded text-sm ${
                            orderData.customer.status === "HOAT_DONG"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {orderData.customer.status === "HOAT_DONG"
                            ? "Hoạt động"
                            : orderData.customer.status}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Staff Info */}
              {orderData.staff && (
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-orange-700" />
                    <h3 className="text-lg font-semibold text-gray-900">
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
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Mã nhân viên:</span>
                        <span className="font-medium text-orange-600">
                          {orderData.staff.staffCode}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Tên:</span>
                        <span className="font-medium">
                          {orderData.staff.name}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Chức vụ:</span>
                        <span className="font-medium">
                          {getRoleText(orderData.staff.role)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Phòng ban:</span>
                        <span className="font-medium">
                          {orderData.staff.department}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Điện thoại:</span>
                        <span className="font-medium">
                          {orderData.staff.phone}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Column 3: Status & Related Data */}
            <div className="space-y-6">
              {/* Data Counts */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-gray-700" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Thống kê dữ liệu
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white rounded border hover:shadow-md transition-shadow">
                    <Package className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold text-blue-600">
                      {isLoading ? "..." : orderData.warehouses?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Kho hàng</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded border hover:shadow-md transition-shadow">
                    <CreditCard className="w-6 h-6 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold text-green-600">
                      {isLoading ? "..." : orderData.payments?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Thanh toán</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded border hover:shadow-md transition-shadow">
                    <ShoppingCart className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                    <div className="text-2xl font-bold text-purple-600">
                      {isLoading ? "..." : orderData.purchases?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Mua hàng</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded border hover:shadow-md transition-shadow">
                    <Home className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                    <div className="text-2xl font-bold text-orange-600">
                      {isLoading ? "..." : orderData.domestics?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Nội địa</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded border hover:shadow-md transition-shadow">
                    <Calendar className="w-6 h-6 mx-auto mb-2 text-teal-600" />
                    <div className="text-2xl font-bold text-teal-600">
                      {isLoading
                        ? "..."
                        : orderData.orderProcessLogs?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Nhật ký</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded border hover:shadow-md transition-shadow">
                    <MapPin className="w-6 h-6 mx-auto mb-2 text-indigo-600" />
                    <div className="text-2xl font-bold text-indigo-600">
                      {isLoading
                        ? "..."
                        : orderData.shipmentTrackings?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Theo dõi</div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-gray-700" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Thông tin bổ sung
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Phản hồi:</span>
                    <span className="text-sm">
                      {orderData.feedback ? "Có" : "Chưa có"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Đóng gói:</span>
                    <span className="text-sm">
                      {orderData.packing ? "Có" : "Chưa có"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Liên kết:</span>
                    <span className="text-sm">
                      {orderData.orderLinks?.length || 0} liên kết
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 transform hover:scale-105"
          >
            <X className="w-4 h-4" />
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailOrder;
