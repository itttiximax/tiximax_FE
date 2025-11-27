import React from "react";
import { FileText, CreditCard, MapPin } from "lucide-react";

const SkeletonLine = () => (
  <div className="animate-pulse flex justify-between items-center">
    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
  </div>
);

const OrderColumnDetailSale = ({ orderData, availableStatuses, isLoading }) => {
  const formatPrice = (price) => {
    if (price === null || price === undefined) return "-";
    return new Intl.NumberFormat("vi-VN").format(price);
  };
  const getOrderTypeText = (type) => {
    const typeMap = {
      MUA_HO: "Mua hộ",
      VAN_CHUYEN: "Vận chuyển",
      DAU_GIA: "Đấu giá",
      KY_GUI: "Ký gửi",
    };
    return typeMap[type] || type;
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

  const getStatusText = (status) => {
    const statusInfo = availableStatuses.find((s) => s.key === status);
    return statusInfo ? statusInfo.label : status;
  };

  return (
    <div className="space-y-4">
      {/* Basic Order Info */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-5 h-5 text-blue-700" />
          <h3 className="text-base font-semibold text-gray-900">
            Thông tin đơn hàng
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
              <span className="text-gray-600">Mã đơn:</span>
              <span className="font-semibold text-blue-700">
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
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  orderData.status
                )}`}
              >
                {getStatusText(orderData.status)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Ngày tạo:</span>
              <span className="font-medium">
                {new Date(orderData.createdAt).toLocaleDateString("vi-VN")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Kiểm tra:</span>
              <span
                className={`px-2 py-0.5 rounded text-xs ${
                  orderData.checkRequired
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {orderData.checkRequired ? "Bắt buộc" : "Không"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Financial Info */}
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard className="w-5 h-5 text-green-700" />
          <h3 className="text-base font-semibold text-gray-900">
            Thông tin tài chính
          </h3>
        </div>
        {isLoading ? (
          <div className="space-y-3">
            <SkeletonLine />
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tỷ giá:</span>
              <span className="font-medium">
                {orderData.exchangeRate
                  ? `${orderData.exchangeRate.toLocaleString("vi-VN")} `
                  : "-"}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-green-200">
              <span className="text-gray-700 font-medium">Tổng tiền:</span>
              <span className="font-bold text-lg text-green-700">
                {formatPrice(orderData.finalPriceOrder)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Route & Destination */}
      {(orderData.route || isLoading) && (
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-purple-700" />
            <h3 className="text-base font-semibold text-gray-900">
              Tuyến & Điểm đến
            </h3>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              <SkeletonLine />
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tuyến:</span>
                <span className="font-medium">
                  {orderData.route?.name || "-"}
                </span>
              </div>
              {orderData.route?.shipTime && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Thời gian ship:</span>
                  <span>{orderData.route.shipTime} ngày</span>
                </div>
              )}
              {orderData.destination && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Điểm đến:</span>
                  <span className="font-medium">
                    {orderData.destination.destinationName}
                  </span>
                </div>
              )}
              {orderData.route?.note && (
                <div className="pt-2 border-t border-purple-200 text-xs text-gray-600">
                  {orderData.route.note}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderColumnDetailSale;
