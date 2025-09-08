import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import createOrderPaymentService from "../../Services/SharedService/createorderpayment";
import paymentService from "../../Services/LeadSale/paymentService";

const CreateOrderPayment = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("DA_XAC_NHAN");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Payment states
  const [paymentLoading, setPaymentLoading] = useState({});
  const [paymentResults, setPaymentResults] = useState({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentResult, setSelectedPaymentResult] = useState(null);
  const [completingPayment, setCompletingPayment] = useState({});
  const [fadingOut, setFadingOut] = useState({});

  // Fetch orders based on status
  const fetchOrders = async (status, page = 0) => {
    setLoading(true);
    try {
      const response = await createOrderPaymentService.getOrdersByStatus(
        status,
        page,
        10
      );
      setOrders(response.content || []);
      setTotalPages(response.totalPages || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(activeTab, 0);
    // Clear payment results when switching tabs
    setPaymentResults({});
  }, [activeTab]);

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

  // Handle completing payment (mark as done and refresh)
  const handleCompletePayment = async (orderCode) => {
    setCompletingPayment((prev) => ({ ...prev, [orderCode]: true }));
    setFadingOut((prev) => ({ ...prev, [orderCode]: true }));

    try {
      // Wait for fade out animation
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Remove from payment results
      setPaymentResults((prev) => {
        const newResults = { ...prev };
        delete newResults[orderCode];
        return newResults;
      });

      // Show success message
      toast.success("Đã hoàn thành thanh toán!");

      // Refresh orders data after a short delay
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

  // Get tab configurations
  const tabConfigs = [
    {
      key: "DA_XAC_NHAN",
      label: "Đã xác nhận",
      color: "text-green-700",
      bgColor: "bg-white",
    },
    {
      key: "CHO_THANH_TOAN_SHIP",
      label: "Chờ thanh toán ship",
      color: "text-yellow-700",
      bgColor: "bg-white",
    },
    {
      key: "CHO_THANH_TOAN",
      label: "Chờ thanh toán",
      color: "text-orange-700",
      bgColor: "bg-white",
    },
    {
      key: "CHO_NHAP_KHO_VN",
      label: "Chờ nhập kho VN",
      color: "text-blue-700",
      bgColor: "bg-white",
    },
  ];

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchOrders(activeTab, newPage);
    }
  };

  // Check if QR code is valid
  const isValidQrCode = (qrCode) => {
    return qrCode && qrCode !== "Mã QR" && qrCode.startsWith("http");
  };

  return (
    <div className="mx-auto p-6">
      <Toaster />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Quản lý đơn hàng
        </h1>
        <p className="text-gray-600">
          Danh sách đơn hàng theo các trạng thái khác nhau
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        {tabConfigs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? `${tab.bgColor} ${tab.color} shadow-sm`
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Đang tải...</span>
        </div>
      )}

      {/* Orders List */}
      {!loading && (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">📦</div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                Không có đơn hàng
              </h3>
              <p className="text-gray-500">
                Chưa có đơn hàng nào với trạng thái này
              </p>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="col-span-2">Mã đơn hàng</div>
                  <div className="col-span-1">Loại đơn</div>
                  <div className="col-span-2">Trạng thái</div>
                  <div className="col-span-1">Tỷ giá</div>
                  <div className="col-span-2">Tổng tiền</div>
                  <div className="col-span-2">Ngày tạo</div>
                  {activeTab === "DA_XAC_NHAN" && (
                    <div className="col-span-2">Thao tác</div>
                  )}
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <div key={order.orderId}>
                    <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Order Code */}
                        <div className="col-span-2">
                          <div className="font-medium text-gray-900">
                            {order.orderCode}
                          </div>
                        </div>

                        {/* Order Type */}
                        <div className="col-span-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {order.orderType === "MUA_HO"
                              ? "Mua hộ"
                              : order.orderType}
                          </span>
                        </div>

                        {/* Status */}
                        <div className="col-span-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusText(order.status)}
                          </span>
                        </div>

                        {/* Exchange Rate */}
                        <div className="col-span-1">
                          <div className="text-sm font-medium text-gray-900">
                            {order.exchangeRate}
                          </div>
                          <div className="text-xs text-gray-500">VND/CNY</div>
                        </div>

                        {/* Final Price */}
                        <div className="col-span-2">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(order.finalPriceOrder)}
                          </div>
                        </div>

                        {/* Created Date */}
                        <div className="col-span-2">
                          <div className="text-sm text-gray-900">
                            {formatDate(order.createdAt)}
                          </div>
                        </div>

                        {/* Actions - Only for confirmed orders */}
                        {activeTab === "DA_XAC_NHAN" && (
                          <div className="col-span-2">
                            {!paymentResults[order.orderCode] ? (
                              <button
                                onClick={() =>
                                  handleCreatePayment(order.orderCode)
                                }
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
                                      showPaymentDetails(
                                        paymentResults[order.orderCode]
                                      )
                                    }
                                    className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-all duration-200"
                                  >
                                    Xem QR
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleCompletePayment(order.orderCode)
                                    }
                                    disabled={
                                      completingPayment[order.orderCode]
                                    }
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

                      {/* Payment Result Preview */}
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
                              onClick={() =>
                                handleCompletePayment(order.orderCode)
                              }
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
                              <span className="font-semibold text-gray-700">
                                Mã GD:
                              </span>
                              <p className="font-mono text-blue-600 break-all">
                                {paymentResults[order.orderCode].paymentCode}
                              </p>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-700">
                                Số tiền:
                              </span>
                              <p className="font-bold text-green-600">
                                {paymentResults[
                                  order.orderCode
                                ].amount?.toLocaleString()}{" "}
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
              </div>
            </>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Trang {currentPage + 1} / {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
        </div>
      )}

      {/* Payment Details Modal */}
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
                {/* QR Code */}
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

                {/* Payment Details */}
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
                          Số tiền thu :
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
