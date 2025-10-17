import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
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
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "DA_XAC_NHAN":
        return "bg-green-100 text-green-800";
      case "CHO_THANH_TOAN_SHIP":
        return "bg-yellow-100 text-yellow-800";
      case "CHO_THANH_TOAN":
        return "bg-orange-100 text-orange-800";
      case "CHO_NHAP_KHO_VN":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case "DA_XAC_NHAN":
        return "Đã xác nhận";
      case "CHO_THANH_TOAN_SHIP":
        return "Chờ thanh toán ship";
      case "CHO_THANH_TOAN":
        return "Chờ thanh toán";
      case "CHO_NHAP_KHO_VN":
        return "Chờ nhập kho VN";
      default:
        return status;
    }
  };

  return (
    <div>
      <Toaster />
      {orders.map((order) => (
        <div key={order.orderId}>
          <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="grid grid-cols-12 gap-4 items-center">
              {/* Mã đơn hàng */}
              <div className="col-span-2">
                <div className="font-medium text-gray-900">
                  {order.orderCode}
                </div>
              </div>

              {/* Tên khách hàng - MỚI THÊM */}
              <div className="col-span-2">
                <div className="text-sm font-medium text-gray-900">
                  {order.customer?.name || "N/A"}
                </div>
              </div>

              {/* Loại đơn */}
              <div className="col-span-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {order.orderType === "MUA_HO" ? "Mua hộ" : order.orderType}
                </span>
              </div>

              {/* Trạng thái */}
              <div className="col-span-1">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {getStatusText(order.status)}
                </span>
              </div>
              {/* Tổng tiền */}
              <div className="col-span-2">
                <div className="text-sm font-medium text-gray-900">
                  {formatCurrency(order.finalPriceOrder)}
                </div>
              </div>

              {/* Ngày tạo */}
              <div className="col-span-1">
                <div className="text-sm text-gray-900">
                  {formatDate(order.createdAt)}
                </div>
              </div>

              {/* Thao tác */}
              {activeTab === "DA_XAC_NHAN" && (
                <div className="col-span-2">
                  {!paymentResults[order.orderCode] ? (
                    <button
                      onClick={() => handleCreatePayment(order.orderCode)}
                      disabled={paymentLoading[order.orderCode]}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {paymentLoading[order.orderCode]
                        ? "Đang tạo..."
                        : "Tạo thanh toán"}
                    </button>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex gap-1">
                        <button
                          onClick={() =>
                            showPaymentDetails(paymentResults[order.orderCode])
                          }
                          className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-all duration-200"
                        >
                          Xem QR
                        </button>
                        <button
                          onClick={() => handleCompletePayment(order.orderCode)}
                          disabled={completingPayment[order.orderCode]}
                          className="px-2 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          {completingPayment[order.orderCode]
                            ? "..."
                            : "Hoàn thành"}
                        </button>
                      </div>
                      <div className="text-xs text-green-600">
                        Đã tạo thanh toán
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Payment Results section */}
            {paymentResults[order.orderCode] && (
              <div
                className={`mt-3 bg-green-50 border border-green-200 rounded p-3 transition-all duration-500 ${
                  fadingOut[order.orderCode]
                    ? "opacity-0 transform translate-y-2 scale-95"
                    : "opacity-100 transform translate-y-0 scale-100"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-semibold text-green-700">
                    Thông tin thanh toán
                  </h4>
                  <button
                    onClick={() => handleCompletePayment(order.orderCode)}
                    disabled={completingPayment[order.orderCode]}
                    className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-md"
                  >
                    {completingPayment[order.orderCode] ? (
                      <div className="flex items-center gap-1">
                        <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
                        <span>Đang xử lý...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <span>Hoàn thành</span>
                      </div>
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="font-semibold text-gray-700">Mã GD:</span>
                    <p className="font-mono text-blue-600 break-all">
                      {paymentResults[order.orderCode].paymentCode}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      Số tiền:
                    </span>
                    <p className="font-bold text-green-600">
                      {paymentResults[order.orderCode].amount?.toLocaleString()}{" "}
                      đ
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      Trạng thái:
                    </span>
                    <p className="text-orange-600 font-semibold">
                      {paymentResults[order.orderCode].status}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      Thời gian:
                    </span>
                    <p>
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

      {/* Payment Modal */}
      {showPaymentModal && selectedPaymentResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Chi tiết thanh toán
                </h3>
                <div className="flex gap-3 items-center">
                  <button
                    onClick={() => {
                      handleCompletePayment(selectedPaymentResult.paymentCode);
                      setShowPaymentModal(false);
                    }}
                    className="px-3 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Hoàn thành
                  </button>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isValidQrCode(selectedPaymentResult.qrCode) && (
                  <div className="text-center">
                    <div className="bg-white p-4 rounded border inline-block">
                      <img
                        src={selectedPaymentResult.qrCode}
                        alt="QR Code thanh toán"
                        className="w-80 h-80 object-contain mx-auto"
                      />
                    </div>
                    <div className="mt-4 flex justify-center gap-3">
                      <button
                        onClick={() =>
                          window.open(selectedPaymentResult.qrCode, "_blank")
                        }
                        className="px-4 py-2 bg-blue-100 text-blue-700 text-sm rounded hover:bg-blue-200"
                      >
                        Xem full size
                      </button>
                    </div>
                  </div>
                )}
                <div className="space-y-4">
                  <h4 className="font-semibold text-green-700 text-lg">
                    Thông tin thanh toán
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="font-semibold text-gray-700">
                        Mã giao dịch:
                      </label>
                      <p className="font-mono text-blue-600 bg-blue-50 p-2 rounded">
                        {selectedPaymentResult.paymentCode}
                      </p>
                    </div>
                    <div>
                      <label className="font-semibold text-gray-700">
                        Đơn hàng:
                      </label>
                      <p className="font-mono bg-gray-50 p-2 rounded">
                        {selectedPaymentResult.content}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-gray-700">
                          Số tiền thu:
                        </label>
                        <p className="font-bold text-green-600 bg-green-50 p-2 rounded">
                          {selectedPaymentResult.amount?.toLocaleString()} đ
                        </p>
                      </div>
                      <div>
                        <label className="font-semibold text-gray-700">
                          Số tiền cần thanh toán:
                        </label>
                        <p className="font-bold text-blue-600 bg-blue-50 p-2 rounded">
                          {selectedPaymentResult.collectedAmount?.toLocaleString()}{" "}
                          đ
                        </p>
                      </div>
                    </div>
                    {selectedPaymentResult.actionAt && (
                      <div>
                        <label className="font-semibold text-gray-700">
                          Thời gian tạo:
                        </label>
                        <p className="bg-gray-50 p-2 rounded">
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
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateOrderPayment;
