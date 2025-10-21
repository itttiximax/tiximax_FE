import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  User,
  Calendar,
  Package,
  DollarSign,
  CreditCard,
  CheckCircle,
  XCircle,
  FileText,
  Clock,
  Maximize2,
  X,
} from "lucide-react";
import paymentService from "../../Services/Payment/paymentService";

const CreateOrderPayment = ({
  orders,
  paymentResults,
  setPaymentResults,
  activeTab,
  fetchOrders,
  currentPage,
}) => {
  const [paymentLoading, setPaymentLoading] = useState({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentResult, setSelectedPaymentResult] = useState(null);
  const [completingPayment, setCompletingPayment] = useState({});
  const [fadingOut, setFadingOut] = useState({});

  // Handle creating payment
  const handleCreatePayment = async (orderCode) => {
    if (!orderCode) {
      toast.error("Mã đơn hàng không hợp lệ");
      return;
    }

    setPaymentLoading((prev) => ({ ...prev, [orderCode]: true }));

    try {
      const response = await paymentService.createPayment(orderCode);
      setPaymentResults((prev) => ({ ...prev, [orderCode]: response }));
      toast.success("Tạo thanh toán thành công!");
    } catch (error) {
      console.error("Error creating payment:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Tạo thanh toán thất bại";
      toast.error(errorMessage);
    } finally {
      setPaymentLoading((prev) => ({ ...prev, [orderCode]: false }));
    }
  };

  // Handle completing payment
  const handleCompletePayment = async (orderCode) => {
    setCompletingPayment((prev) => ({ ...prev, [orderCode]: true }));
    setFadingOut((prev) => ({ ...prev, [orderCode]: true }));

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setPaymentResults((prev) => {
        const newResults = { ...prev };
        delete newResults[orderCode];
        return newResults;
      });
      toast.success("Đã hoàn thành thanh toán!");
      setTimeout(() => {
        fetchOrders(activeTab, currentPage);
        setFadingOut((prev) => {
          const newFading = { ...prev };
          delete newFading[orderCode];
          return newFading;
        });
      }, 300);
    } catch (error) {
      console.error("Error completing payment:", error);
      toast.error("Có lỗi xảy ra khi hoàn thành thanh toán");
      setFadingOut((prev) => {
        const newFading = { ...prev };
        delete newFading[orderCode];
        return newFading;
      });
    } finally {
      setCompletingPayment((prev) => ({ ...prev, [orderCode]: false }));
    }
  };

  // Show payment details in modal
  const showPaymentDetails = (paymentResult) => {
    setSelectedPaymentResult(paymentResult);
    setShowPaymentModal(true);
  };

  // Check if QR code is valid
  const isValidQrCode = (qrCode) => {
    return qrCode && qrCode !== "Mã QR" && qrCode.startsWith("http");
  };

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

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      DA_XAC_NHAN: {
        text: "Đã xác nhận",
        className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      },
      CHO_THANH_TOAN_SHIP: {
        text: "Chờ thanh toán ship",
        className: "bg-purple-50 text-purple-700 border border-purple-200",
      },
      CHO_THANH_TOAN: {
        text: "Chờ thanh toán",
        className: "bg-orange-50 text-orange-700 border border-orange-200",
      },
      DA_DU_HANG: {
        text: "Đã đủ hàng",
        className: "bg-blue-50 text-blue-700 border border-blue-200",
      },
      CHO_NHAP_KHO_VN: {
        text: "Chờ nhập kho VN",
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
      DAU_GIA: "Đơn đấu giá",
      MUA_HO: "Mua hộ",
    };
    return typeMap[type] || type;
  };

  return (
    <div>
      <Toaster />
      <div className="divide-y divide-slate-100">
        {orders.map((order) => (
          <div key={order.orderId}>
            <div className="px-6 py-4 hover:bg-slate-50 transition-colors">
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Mã đơn hàng - col-span-2 */}
                <div className="col-span-2">
                  <div className="font-bold text-slate-900">
                    {order.orderCode}
                  </div>
                </div>

                {/* Tên khách hàng - col-span-2 */}
                <div className="col-span-2">
                  <div className="flex items-center gap-2 text-slate-700">
                    <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-sm font-medium truncate">
                      {order.customer?.name || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Loại đơn - col-span-1 */}
                <div className="col-span-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                    <Package className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">
                      {getOrderTypeLabel(order.orderType)}
                    </span>
                  </span>
                </div>

                {/* Trạng thái - col-span-1 */}
                <div className="col-span-1">{getStatusBadge(order.status)}</div>

                {/* Tổng tiền - col-span-2 */}
                <div className="col-span-2">
                  <div className="text-sm font-bold text-blue-600">
                    {formatCurrency(order.finalPriceOrder)}
                  </div>
                </div>

                {/* Ngày tạo - col-span-1 */}
                <div className="col-span-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Thao tác - col-span-2 */}
                {activeTab === "DA_XAC_NHAN" && (
                  <div className="col-span-2">
                    {!paymentResults[order.orderCode] ? (
                      <button
                        onClick={() => handleCreatePayment(order.orderCode)}
                        disabled={paymentLoading[order.orderCode]}
                        className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors w-full ${
                          paymentLoading[order.orderCode]
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                            : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                        }`}
                      >
                        {paymentLoading[order.orderCode] ? (
                          <>
                            <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                            Đang tạo...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4" />
                            Tạo thanh toán
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 text-sm font-semibold rounded-lg border border-emerald-200">
                        <CheckCircle className="w-4 h-4" />
                        Đã tạo thanh toán
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Payment Results section */}
              {paymentResults[order.orderCode] && (
                <div
                  className={`mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 transition-all duration-500 ${
                    fadingOut[order.orderCode]
                      ? "opacity-0 transform translate-y-2"
                      : "opacity-100 transform translate-y-0"
                  }`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-bold text-blue-900 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Thông tin thanh toán
                    </h4>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          showPaymentDetails(paymentResults[order.orderCode])
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-blue-700 text-xs font-semibold rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        Xem chi tiết
                      </button>
                      <button
                        onClick={() => handleCompletePayment(order.orderCode)}
                        disabled={completingPayment[order.orderCode]}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                          completingPayment[order.orderCode]
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                            : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                        }`}
                      >
                        {completingPayment[order.orderCode] ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            Hoàn thành
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <div className="bg-white rounded-lg p-3 border border-blue-200">
                      <div className="flex items-center gap-1.5 mb-1">
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-xs font-medium text-slate-600">
                          Mã giao dịch
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-blue-600 truncate">
                        {paymentResults[order.orderCode].paymentCode}
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-3 border border-blue-200">
                      <div className="flex items-center gap-1.5 mb-1">
                        <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-xs font-medium text-slate-600">
                          Số tiền
                        </span>
                      </div>
                      <p className="text-xs font-bold text-blue-600">
                        {paymentResults[
                          order.orderCode
                        ].amount?.toLocaleString()}{" "}
                        đ
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-3 border border-blue-200">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-xs font-medium text-slate-600">
                          Trạng thái
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-orange-600">
                        {paymentResults[order.orderCode].status}
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-3 border border-blue-200">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-xs font-medium text-slate-600">
                          Thời gian
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 truncate">
                        {new Date(
                          paymentResults[order.orderCode].actionAt
                        ).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPaymentResult && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Chi tiết thanh toán
              </h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* QR Code Section */}
                {isValidQrCode(selectedPaymentResult.qrCode) && (
                  <div className="flex flex-col items-center">
                    <div className="bg-white p-4 rounded-lg border-2 border-slate-200 shadow-sm">
                      <img
                        src={selectedPaymentResult.qrCode}
                        alt="QR Code thanh toán"
                        className="w-80 h-80 object-contain"
                      />
                    </div>
                    <button
                      onClick={() =>
                        window.open(selectedPaymentResult.qrCode, "_blank")
                      }
                      className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Maximize2 className="w-4 h-4" />
                      Xem full size
                    </button>
                  </div>
                )}

                {/* Payment Info Section */}
                <div className="space-y-4">
                  <h4 className="font-bold text-blue-900 text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Thông tin thanh toán
                  </h4>

                  <div className="space-y-3">
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <label className="text-xs font-semibold text-slate-600 block mb-1">
                        Mã giao dịch
                      </label>
                      <p className="font-mono text-sm font-bold text-blue-600">
                        {selectedPaymentResult.paymentCode}
                      </p>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <label className="text-xs font-semibold text-slate-600 block mb-1">
                        Đơn hàng
                      </label>
                      <p className="text-sm text-slate-900">
                        {selectedPaymentResult.content}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                        <label className="text-xs font-semibold text-emerald-700 block mb-1">
                          Số tiền thu
                        </label>
                        <p className="text-sm font-bold text-emerald-600">
                          {selectedPaymentResult.amount?.toLocaleString()} đ
                        </p>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <label className="text-xs font-semibold text-blue-700 block mb-1">
                          Số tiền cần thanh toán
                        </label>
                        <p className="text-sm font-bold text-blue-600">
                          {selectedPaymentResult.collectedAmount?.toLocaleString()}{" "}
                          đ
                        </p>
                      </div>
                    </div>

                    {selectedPaymentResult.actionAt && (
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <label className="text-xs font-semibold text-slate-600 block mb-1">
                          Thời gian tạo
                        </label>
                        <p className="text-sm text-slate-900">
                          {new Date(
                            selectedPaymentResult.actionAt
                          ).toLocaleString("vi-VN")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-5 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2.5 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-white transition-colors font-semibold text-sm"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  handleCompletePayment(selectedPaymentResult.paymentCode);
                  setShowPaymentModal(false);
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold text-sm shadow-md"
              >
                <CheckCircle className="w-4 h-4" />
                Hoàn thành
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateOrderPayment;
