// ConfirmPaymentOrder.jsx
import React, { useState } from "react";
import toast from "react-hot-toast";
import confirmPaymentService from "../../Services/Payment/confirmPaymentService";

// Helper function to extract error message from backend
const getErrorMessage = (error) => {
  if (error.response) {
    const backendError =
      error.response.data?.error ||
      error.response.data?.message ||
      error.response.data?.detail ||
      error.response.data?.errors;

    if (backendError) {
      if (typeof backendError === "object" && !Array.isArray(backendError)) {
        const errorMessages = Object.entries(backendError)
          .map(([field, msg]) => `${field}: ${msg}`)
          .join(", ");
        return `Lỗi validation: ${errorMessages}`;
      } else if (Array.isArray(backendError)) {
        return backendError.join(", ");
      } else {
        return backendError;
      }
    }
    return `Lỗi ${error.response.status}: ${
      error.response.statusText || "Không xác định"
    }`;
  } else if (error.request) {
    return "Không thể kết nối tới server. Vui lòng kiểm tra kết nối mạng.";
  }
  return error.message || "Đã xảy ra lỗi không xác định";
};

const ConfirmPaymentOrder = ({
  orders,
  paymentResults,
  setPaymentResults,
  fetchOrders,
  currentPage,
}) => {
  const [processingOrders, setProcessingOrders] = useState({});
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    order: null,
  });

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Show confirmation dialog
  const showConfirmDialog = (order) => {
    setConfirmDialog({
      isOpen: true,
      order: order,
    });
  };

  // Close confirmation dialog
  const closeConfirmDialog = () => {
    setConfirmDialog({
      isOpen: false,
      order: null,
    });
  };

  // Handle payment confirmation
  const handleConfirmPayment = async (order) => {
    const paymentId = order.paymentCode;

    if (!paymentId) {
      toast.error("Không tìm thấy mã thanh toán");
      return;
    }

    setProcessingOrders((prev) => ({ ...prev, [order.orderId]: true }));

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Không tìm thấy token xác thực confirmPayment");
        return;
      }

      const response = await confirmPaymentService.confirmPayment(
        paymentId,
        token
      );

      setPaymentResults((prev) => ({
        ...prev,
        [order.orderId]: {
          success: true,
          message: "Xác nhận thanh toán thành công",
          data: response,
        },
      }));

      toast.success(
        `Xác nhận thanh toán thành công cho đơn hàng ${order.orderCode}!`
      );

      // Refresh orders list after successful payment
      setTimeout(() => {
        fetchOrders("CHO_THANH_TOAN", currentPage);
      }, 1000);
    } catch (error) {
      console.error("Error confirming payment:", error);

      const errorMessage = getErrorMessage(error);

      setPaymentResults((prev) => ({
        ...prev,
        [order.orderId]: {
          success: false,
          message: errorMessage,
        },
      }));

      toast.error(`Không thể xác nhận thanh toán: ${errorMessage}`, {
        duration: 5000,
      });
    } finally {
      setProcessingOrders((prev) => ({ ...prev, [order.orderId]: false }));
    }
  };

  // Handle confirmed payment
  const handleConfirmedPayment = async () => {
    const order = confirmDialog.order;
    closeConfirmDialog();

    if (!order) return;

    await handleConfirmPayment(order);
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      CHO_THANH_TOAN: {
        text: "Chờ thanh toán",
        className: "bg-orange-100 text-orange-800",
      },
    };

    const config = statusConfig[status] || {
      text: status,
      className: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
      >
        {config.text}
      </span>
    );
  };

  return (
    <>
      <div className="divide-y divide-gray-200">
        {orders.map((order) => {
          const isProcessing = processingOrders[order.orderId];
          const paymentResult = paymentResults[order.orderId];

          return (
            <div
              key={order.orderId}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Order Code */}
                <div className="col-span-2">
                  <div className="font-medium text-gray-900">
                    {order.orderCode}
                  </div>
                </div>

                {/* Customer Name - MỚI THÊM */}
                <div className="col-span-2">
                  <div className="text-sm font-medium text-gray-900">
                    {order.customer?.name || "N/A"}
                  </div>
                </div>

                {/* Payment Code */}
                <div className="col-span-1">
                  {order.paymentCode && (
                    <div className="text-sm text-blue-600 font-medium">
                      {order.paymentCode}
                    </div>
                  )}
                </div>

                {/* Order Type */}
                <div className="col-span-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {order.orderType === "MUA_HO" ? "Mua hộ" : order.orderType}
                  </span>
                </div>

                {/* Status */}
                <div className="col-span-1">{getStatusBadge(order.status)}</div>

                {/* Total Amount */}
                <div className="col-span-1">
                  <div className="font-medium text-gray-900">
                    {formatCurrency(order.finalPriceOrder)}
                  </div>
                </div>

                {/* Created Date */}
                <div className="col-span-1">
                  <div className="text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </div>
                </div>

                {/* Actions */}
                <div className="col-span-2">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => showConfirmDialog(order)}
                      disabled={isProcessing}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                        isProcessing
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-green-100 text-green-800 hover:bg-green-200"
                      }`}
                    >
                      {isProcessing ? "Đang xử lý..." : "Xác nhận thanh toán"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Payment Result */}
              {paymentResult && (
                <div
                  className={`mt-3 p-3 rounded-md ${
                    paymentResult.success
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div
                    className={`text-sm font-medium ${
                      paymentResult.success ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {paymentResult.message}
                  </div>
                </div>
              )}

              {/* Note */}
              {order.note && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="text-sm text-yellow-800">
                    <strong>Ghi chú:</strong> {order.note}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Confirmation Dialog */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Xác nhận thanh toán
                </h3>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-3">
                Bạn có chắc chắn muốn xác nhận thanh toán cho đơn hàng này
                không?
              </p>

              {confirmDialog.order && (
                <div className="bg-gray-50 rounded-md p-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Mã đơn hàng:</span>
                    <span className="font-medium">
                      {confirmDialog.order.orderCode}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Mã giao dịch:</span>
                    <span className="font-medium text-blue-600">
                      {confirmDialog.order.paymentCode}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tổng tiền:</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(confirmDialog.order.finalPriceOrder)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Khách hàng:</span>
                    <span className="font-medium">
                      {confirmDialog.order.customer?.name || "N/A"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={closeConfirmDialog}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmedPayment}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Xác nhận thanh toán
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmPaymentOrder;
