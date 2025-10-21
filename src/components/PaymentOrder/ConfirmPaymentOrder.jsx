// ConfirmPaymentOrder.jsx
import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  User,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  FileText,
  CreditCard,
  Package,
} from "lucide-react";
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
      const token = localStorage.getItem("jwt");

      if (!token) {
        toast.error("Không tìm thấy token xác thực");
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
        className: "bg-blue-50 text-blue-700 border border-blue-200",
      },
    };

    const config = statusConfig[status] || {
      text: status,
      className: "bg-slate-50 text-slate-600 border border-slate-200",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${config.className}`}
      >
        {config.text}
      </span>
    );
  };

  // Get order type label
  const getOrderTypeLabel = (type) => {
    const typeMap = {
      DON_HANG: "Đơn hàng",
      DON_DAU_GIA: "Đơn đấu giá",
      MUA_HO: "Mua hộ",
    };
    return typeMap[type] || type;
  };

  return (
    <>
      <div className="divide-y divide-slate-100">
        {orders.map((order) => {
          const isProcessing = processingOrders[order.orderId];
          const paymentResult = paymentResults[order.orderId];

          return (
            <div
              key={order.orderId}
              className="px-6 py-4 hover:bg-slate-50 transition-colors"
            >
              <div className="grid grid-cols-12 gap-4 items-center text-sm">
                {/* Order Code - col-span-2 */}
                <div className="col-span-2">
                  <div className="font-bold text-slate-900">
                    {order.orderCode}
                  </div>
                </div>

                {/* Customer Name - col-span-2 */}
                <div className="col-span-2">
                  <div className="flex items-center gap-2 text-slate-700">
                    <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-sm font-medium truncate">
                      {order.customer?.name || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Payment Code - col-span-2 */}
                <div className="col-span-2">
                  {order.paymentCode ? (
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="text-sm font-semibold text-blue-600 truncate">
                        {order.paymentCode}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">-</span>
                  )}
                </div>

                {/* Order Type - col-span-1 */}
                <div className="col-span-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                    <Package className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">
                      {getOrderTypeLabel(order.orderType)}
                    </span>
                  </span>
                </div>

                {/* Status - col-span-1 */}
                <div className="col-span-1">{getStatusBadge(order.status)}</div>

                {/* Total Amount - col-span-1 */}
                <div className="col-span-1">
                  <div className="text-sm font-bold text-blue-600">
                    {formatCurrency(order.finalPriceOrder)}
                  </div>
                </div>

                {/* Created Date - col-span-1 */}
                <div className="col-span-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Actions - col-span-2 */}
                <div className="col-span-2 justify-end">
                  <button
                    onClick={() => showConfirmDialog(order)}
                    disabled={isProcessing}
                    className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors w-full ${
                      isProcessing
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                    }`}
                  >
                    {isProcessing ? "Đang xử lý..." : "Xác nhận thanh toán"}
                  </button>
                </div>
              </div>

              {/* Payment Result */}
              {paymentResult && (
                <div
                  className={`mt-3 p-3 rounded-lg border ${
                    paymentResult.success
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div
                    className={`text-xs font-medium ${
                      paymentResult.success
                        ? "text-emerald-700"
                        : "text-red-700"
                    }`}
                  >
                    {paymentResult.message}
                  </div>
                </div>
              )}

              {/* Note */}
              {order.note && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-xs text-blue-800">
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            {/* Dialog Header */}
            <div className="flex items-center gap-3 p-5 border-b border-slate-200 bg-slate-50">
              <div className="bg-blue-600 p-2.5 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-slate-900">
                  Xác nhận thanh toán
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Vui lòng kiểm tra kỹ thông tin trước khi xác nhận
                </p>
              </div>
            </div>

            {/* Dialog Body */}
            <div className="p-5">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-amber-800 font-medium">
                  Bạn có chắc chắn muốn xác nhận thanh toán cho đơn hàng này
                  không?
                </p>
              </div>

              {confirmDialog.order && (
                <div className="space-y-3">
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4 text-slate-600" />
                      <span className="text-xs font-medium text-slate-600">
                        Mã đơn hàng
                      </span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">
                      {confirmDialog.order.orderCode}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <div className="flex items-center gap-2 mb-1">
                        <CreditCard className="w-4 h-4 text-slate-600" />
                        <span className="text-xs font-medium text-slate-600">
                          Mã giao dịch
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-blue-600">
                        {confirmDialog.order.paymentCode}
                      </span>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-slate-600" />
                        <span className="text-xs font-medium text-slate-600">
                          Khách hàng
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-slate-900 truncate block">
                        {confirmDialog.order.customer?.name || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="bg-blue-600 rounded-lg p-4 border-2 border-blue-500 shadow-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-4 h-4 text-white" />
                      <span className="text-xs font-medium text-blue-100">
                        Số tiền thanh toán
                      </span>
                    </div>
                    <span className="text-lg font-bold text-white">
                      {formatCurrency(confirmDialog.order.finalPriceOrder)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Dialog Footer */}
            <div className="flex gap-3 p-5 border-t border-slate-200 bg-slate-50">
              <button
                onClick={closeConfirmDialog}
                className="flex-1 px-4 py-2.5 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-white transition-colors font-semibold text-sm"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmedPayment}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm shadow-md"
              >
                <CheckCircle className="w-4 h-4" />
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmPaymentOrder;
