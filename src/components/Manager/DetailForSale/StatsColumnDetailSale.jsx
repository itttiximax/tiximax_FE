import React from "react";
import {
  Package,
  CreditCard,
  ShoppingCart,
  ClipboardList,
  Truck,
  ChevronRight,
  FileText,
  Link as LinkIcon,
} from "lucide-react";

const StatsColumnDetailSale = ({
  orderData,
  onShowPurchases,
  onShowPayments,
  onShowWarehouses,
  onShowProcessLogs,
  onShowOrderLinks,
}) => {
  return (
    <div className="space-y-4">
      {/* Quick Stats */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Package className="w-5 h-5 text-gray-700" />
          <h3 className="text-base font-semibold text-gray-900">
            Thống kê nhanh
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {/* Purchases */}
          <button
            onClick={onShowPurchases}
            disabled={!orderData.purchases?.length}
            className="p-3 bg-white rounded-lg border hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <ShoppingCart className="w-5 h-5 mx-auto mb-1 text-purple-600" />
            <div className="text-xl font-bold text-purple-600">
              {orderData.purchases?.length || 0}
            </div>
            <div className="text-xs text-gray-600">Mua hàng</div>
            {orderData.purchases?.length > 0 && (
              <ChevronRight className="w-4 h-4 mx-auto mt-1 text-gray-400 group-hover:text-purple-600" />
            )}
          </button>

          {/* Payments */}
          <button
            onClick={onShowPayments}
            disabled={!orderData.payments?.length}
            className="p-3 bg-white rounded-lg border hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <CreditCard className="w-5 h-5 mx-auto mb-1 text-green-600" />
            <div className="text-xl font-bold text-green-600">
              {orderData.payments?.length || 0}
            </div>
            <div className="text-xs text-gray-600">Thanh toán</div>
            {orderData.payments?.length > 0 && (
              <ChevronRight className="w-4 h-4 mx-auto mt-1 text-gray-400 group-hover:text-green-600" />
            )}
          </button>

          {/* Warehouses */}
          <button
            onClick={onShowWarehouses}
            disabled={!orderData.warehouses?.length}
            className="p-3 bg-white rounded-lg border hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <Package className="w-5 h-5 mx-auto mb-1 text-orange-600" />
            <div className="text-xl font-bold text-orange-600">
              {orderData.warehouses?.length || 0}
            </div>
            <div className="text-xs text-gray-600">Kho hàng</div>
            {orderData.warehouses?.length > 0 && (
              <ChevronRight className="w-4 h-4 mx-auto mt-1 text-gray-400 group-hover:text-orange-600" />
            )}
          </button>

          {/* Order Links */}
          <button
            onClick={onShowOrderLinks}
            disabled={!orderData.orderLinks?.length}
            className="p-3 bg-white rounded-lg border hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <LinkIcon className="w-5 h-5 mx-auto mb-1 text-blue-600" />
            <div className="text-xl font-bold text-blue-600">
              {orderData.orderLinks?.length || 0}
            </div>
            <div className="text-xs text-gray-600">Sản phẩm</div>
            {orderData.orderLinks?.length > 0 && (
              <ChevronRight className="w-4 h-4 mx-auto mt-1 text-gray-400 group-hover:text-blue-600" />
            )}
          </button>

          {/* Process Logs */}
          <button
            onClick={onShowProcessLogs}
            disabled={!orderData.orderProcessLogs?.length}
            className="p-3 bg-white rounded-lg border hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <ClipboardList className="w-5 h-5 mx-auto mb-1 text-indigo-600" />
            <div className="text-xl font-bold text-indigo-600">
              {orderData.orderProcessLogs?.length || 0}
            </div>
            <div className="text-xs text-gray-600">Nhật ký</div>
            {orderData.orderProcessLogs?.length > 0 && (
              <ChevronRight className="w-4 h-4 mx-auto mt-1 text-gray-400 group-hover:text-indigo-600" />
            )}
          </button>

          {/* Shipment Tracking */}
          <div className="p-3 bg-white rounded-lg border">
            <Truck className="w-5 h-5 mx-auto mb-1 text-teal-600" />
            <div className="text-xl font-bold text-teal-600">
              {orderData.shipmentTrackings?.length || 0}
            </div>
            <div className="text-xs text-gray-600">Vận đơn</div>
          </div>
        </div>
      </div>

      {/* Note Section */}
      {orderData.note && (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-yellow-700" />
            <h3 className="text-base font-semibold text-gray-900">Ghi chú</h3>
          </div>
          <p className="text-sm text-gray-700">{orderData.note}</p>
        </div>
      )}

      {/* Additional Info */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-5 h-5 text-gray-700" />
          <h3 className="text-base font-semibold text-gray-900">
            Thông tin khác
          </h3>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Phản hồi:</span>
            <span
              className={`px-2 py-0.5 rounded text-xs ${
                orderData.feedback
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {orderData.feedback ? "Có" : "Chưa có"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsColumnDetailSale;
