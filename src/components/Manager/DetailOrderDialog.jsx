import React, { useState, useEffect } from "react";
import managerOrderService from "../../Services/Manager/managerOrderService";
import CancelOrderLink from "./CancelOrderLink"; // Import component

const ORDER_STATUS_OPTIONS = [
  { value: "DA_XAC_NHAN", label: "Đã xác nhận" },
  { value: "CHO_THANH_TOAN", label: "Chờ thanh toán" },
  { value: "CHO_MUA", label: "Chờ mua" },
  { value: "CHO_NHAP_KHO_NN", label: "Chờ nhập kho NN" },
];

function DetailOrderDialog({ isOpen, onClose, orderId }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cancel dialog state
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);

  useEffect(() => {
    if (isOpen && orderId) {
      loadOrderDetail();
    }
  }, [isOpen, orderId]);

  const loadOrderDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await managerOrderService.getOrderDetail(orderId);
      setOrder(data);
    } catch (error) {
      console.error("Error loading order detail:", error);
      setError("Không thể tải thông tin đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusLabel = (status) => {
    return (
      ORDER_STATUS_OPTIONS.find((s) => s.value === status)?.label || status
    );
  };

  const handleCancelLink = (link) => {
    setSelectedLink(link);
    setCancelDialogOpen(true);
  };

  const handleCancelSuccess = () => {
    // Reload order detail after successful cancel
    loadOrderDetail();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        ></div>

        {/* Dialog */}
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Chi tiết đơn hàng
                </h2>
                {order && (
                  <p className="text-sm text-gray-600 mt-1">
                    Mã đơn:{" "}
                    <span className="font-semibold text-blue-600">
                      {order.orderCode}
                    </span>
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="text-gray-600 mt-2">Đang tải...</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800">{error}</p>
                </div>
              ) : order ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Order Info */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Order Information */}
                    <div className="bg-gray-50 rounded-lg border border-gray-200">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <h3 className="text-base font-semibold text-gray-900">
                          Thông tin đơn hàng
                        </h3>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                              Mã đơn hàng
                            </label>
                            <p className="text-sm font-semibold text-gray-900">
                              {order.orderCode}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                              Loại đơn
                            </label>
                            <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                              {order.orderType === "MUA_HO"
                                ? "Mua hộ"
                                : order.orderType}
                            </span>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                              Trạng thái
                            </label>
                            <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                              {getStatusLabel(order.status)}
                            </span>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                              Ngày tạo
                            </label>
                            <p className="text-sm text-gray-900">
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleDateString(
                                    "vi-VN",
                                    {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )
                                : "-"}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                              Tỷ giá
                            </label>
                            <p className="text-sm font-semibold text-gray-900">
                              {order.exchangeRate || "-"}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                              Yêu cầu kiểm tra
                            </label>
                            <span
                              className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                                order.checkRequired
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {order.checkRequired ? "Có" : "Không"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Links */}
                    <div className="bg-gray-50 rounded-lg border border-gray-200">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <h3 className="text-base font-semibold text-gray-900">
                          Danh sách sản phẩm ({order.orderLinks?.length || 0})
                        </h3>
                      </div>
                      <div className="p-4 max-h-96 overflow-y-auto">
                        {order.orderLinks && order.orderLinks.length > 0 ? (
                          <div className="space-y-4">
                            {order.orderLinks.map((link, index) => (
                              <div
                                key={link.linkId || index}
                                className="bg-white border border-gray-200 rounded-lg p-4"
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-bold text-xs">
                                        {index + 1}
                                      </span>
                                      <h4 className="text-sm font-semibold text-gray-900">
                                        {link.productName}
                                      </h4>
                                    </div>
                                    {link.classify && (
                                      <p className="text-xs text-gray-500 mb-1">
                                        Phân loại: {link.classify}
                                      </p>
                                    )}
                                    <p className="text-xs text-gray-600 break-all line-clamp-2">
                                      {link.productLink}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2 ml-2">
                                    <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                                      {getStatusLabel(link.status)}
                                    </span>
                                    {/* Cancel Button */}
                                    {(link.status === "CHO_MUA" ||
                                      link.status === "DA_XAC_NHAN") && (
                                      <button
                                        onClick={() => handleCancelLink(link)}
                                        className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200"
                                        title="Hủy đơn"
                                      >
                                        Hủy
                                      </button>
                                    )}
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                      Số lượng
                                    </label>
                                    <p className="font-semibold text-gray-900">
                                      {link.quantity}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                      Giá web
                                    </label>
                                    <p className="text-gray-900">
                                      {formatCurrency(link.priceWeb)}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                      Phí ship
                                    </label>
                                    <p className="text-gray-900">
                                      {formatCurrency(link.shipWeb)}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                      Tổng web
                                    </label>
                                    <p className="font-semibold text-gray-900">
                                      {formatCurrency(link.totalWeb)}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                      Phí mua hộ
                                    </label>
                                    <p className="text-gray-900">
                                      {formatCurrency(link.purchaseFee)}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                      Phí phát sinh
                                    </label>
                                    <p className="text-gray-900">
                                      {formatCurrency(link.extraCharge)}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                      Tổng VND
                                    </label>
                                    <p className="font-bold text-blue-600">
                                      {formatCurrency(link.finalPriceVnd)}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                      Tracking
                                    </label>
                                    <p className="font-mono text-xs text-gray-900">
                                      {link.trackingCode || "-"}
                                    </p>
                                  </div>
                                </div>

                                {link.website && (
                                  <div className="mt-3 pt-3 border-t border-gray-200">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                      Website
                                    </label>
                                    <p className="text-sm text-gray-900">
                                      {link.website}
                                    </p>
                                  </div>
                                )}

                                {link.shipmentCode && (
                                  <div className="mt-2">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                      Mã lô hàng
                                    </label>
                                    <p className="text-sm font-mono text-gray-900">
                                      {link.shipmentCode}
                                    </p>
                                  </div>
                                )}

                                {link.note && (
                                  <div className="mt-2">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                      Ghi chú
                                    </label>
                                    <p className="text-sm text-gray-600">
                                      {link.note}
                                    </p>
                                  </div>
                                )}

                                {link.groupTag && (
                                  <div className="mt-2">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                      Nhóm
                                    </label>
                                    <span className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                                      {link.groupTag}
                                    </span>
                                  </div>
                                )}

                                {link.purchaseImage && (
                                  <div className="mt-3">
                                    <label className="block text-xs font-medium text-gray-500 mb-2">
                                      Ảnh mua hàng
                                    </label>
                                    <img
                                      src={link.purchaseImage}
                                      alt="Purchase"
                                      className="w-32 h-32 object-cover rounded border border-gray-200 cursor-pointer hover:opacity-80"
                                      onClick={() =>
                                        window.open(
                                          link.purchaseImage,
                                          "_blank"
                                        )
                                      }
                                      onError={(e) => {
                                        e.target.src =
                                          "https://via.placeholder.com/128?text=No+Image";
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center text-gray-500 py-4">
                            Không có sản phẩm
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Customer & Summary */}
                  <div className="space-y-6">
                    {/* Customer Information */}
                    <div className="bg-gray-50 rounded-lg border border-gray-200">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <h3 className="text-base font-semibold text-gray-900">
                          Thông tin khách hàng
                        </h3>
                      </div>
                      <div className="p-4">
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                              Tên khách hàng
                            </label>
                            <p className="text-sm font-semibold text-gray-900">
                              {order.customer?.name || "-"}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                              Mã khách hàng
                            </label>
                            <p className="text-sm text-gray-900">
                              {order.customer?.customerCode || "-"}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                              Email
                            </label>
                            <p className="text-sm text-gray-900 break-all">
                              {order.customer?.email || "-"}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                              Số điện thoại
                            </label>
                            <p className="text-sm text-gray-900">
                              {order.customer?.phone || "-"}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                              Username
                            </label>
                            <p className="text-sm text-gray-900">
                              {order.customer?.username || "-"}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                              Trạng thái tài khoản
                            </label>
                            <span
                              className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                                order.customer?.status === "HOAT_DONG"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {order.customer?.status === "HOAT_DONG"
                                ? "Hoạt động"
                                : order.customer?.status || "-"}
                            </span>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                              Xác thực
                            </label>
                            <span
                              className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                                order.customer?.verify
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {order.customer?.verify
                                ? "Đã xác thực"
                                : "Chưa xác thực"}
                            </span>
                          </div>
                          {order.customer?.source && (
                            <div>
                              <label className="block text-sm font-medium text-gray-500 mb-1">
                                Nguồn
                              </label>
                              <p className="text-sm text-gray-900">
                                {order.customer.source}
                              </p>
                            </div>
                          )}
                          {order.customer?.balance !== null && (
                            <div>
                              <label className="block text-sm font-medium text-gray-500 mb-1">
                                Số dư
                              </label>
                              <p className="text-sm font-semibold text-gray-900">
                                {formatCurrency(order.customer.balance)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 rounded-lg border border-gray-200">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <h3 className="text-base font-semibold text-gray-900">
                          Tổng kết đơn hàng
                        </h3>
                      </div>
                      <div className="p-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                            <span className="text-sm text-gray-600">
                              Số lượng sản phẩm
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {order.orderLinks?.reduce(
                                (sum, link) => sum + (link.quantity || 0),
                                0
                              ) || 0}
                            </span>
                          </div>
                          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                            <span className="text-sm text-gray-600">
                              Tỷ giá
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {order.exchangeRate || "-"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center pt-3 border-t-2 border-gray-300">
                            <span className="text-base font-semibold text-gray-900">
                              Tổng tiền
                            </span>
                            <span className="text-lg font-bold text-blue-600">
                              {formatCurrency(order.finalPriceOrder)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">Không tìm thấy đơn hàng</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded text-sm font-medium hover:bg-gray-700"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Link Dialog */}
      <CancelOrderLink
        isOpen={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        link={selectedLink}
        orderId={orderId}
        onSuccess={handleCancelSuccess}
      />
    </>
  );
}

export default DetailOrderDialog;
