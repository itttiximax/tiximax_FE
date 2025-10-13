import React, { useState, useEffect, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Loader2, Package } from "lucide-react";
import createOrderPaymentService from "../../Services/Payment/createOrderPaymentService";
import countStatusService from "../../Services/Order/countStatusService";
import CreatePaymentShip from "./CreatePaymentShip";
import ConfirmPaymentShip from "./ConfirmPaymentShip";
import PaymentDialog from "./PaymentDialog";

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

const PaymentShipList = () => {
  const validTabs = ["CHO_THANH_TOAN_SHIP", "DA_DU_HANG"];
  const savedTab = localStorage.getItem("activeTabShip");
  const initialTab = validTabs.includes(savedTab)
    ? savedTab
    : "CHO_THANH_TOAN_SHIP";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statusCounts, setStatusCounts] = useState({});
  const [statsLoading, setStatsLoading] = useState(false);
  const [paymentDialog, setPaymentDialog] = useState({
    open: false,
    payment: null,
  });

  // Fetch orders based on status
  const fetchOrders = useCallback(async (status, page = 0) => {
    setLoading(true);
    try {
      const response = await createOrderPaymentService.getOrdersByStatus(
        status,
        page,
        10
      );
      setOrders(
        response.content.map((order) => ({
          ...order,
          orderId: String(order.orderId),
        })) || []
      );
      setTotalPages(response.totalPages || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching orders:", error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage, { duration: 5000 });
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch status statistics
  const fetchStatusStatistics = useCallback(async () => {
    setStatsLoading(true);
    try {
      const response = await countStatusService.getForPaymentStatistics();
      const normalizedCounts = validTabs.reduce((acc, tab) => {
        acc[tab] = response[tab] ?? 0;
        return acc;
      }, {});
      setStatusCounts(normalizedCounts);
    } catch (error) {
      console.error("Error fetching payment statistics:", error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage, { duration: 5000 });
      setStatusCounts(
        validTabs.reduce((acc, tab) => ({ ...acc, [tab]: 0 }), {})
      );
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Handle payment creation success
  const handlePaymentCreated = (payment) => {
    setPaymentDialog({ open: true, payment });
    fetchOrders(activeTab, currentPage);
    fetchStatusStatistics();
  };

  // Handle payment confirmation success
  const handlePaymentConfirmed = () => {
    fetchOrders(activeTab, currentPage);
    fetchStatusStatistics();
  };

  // Close payment dialog
  const closePaymentDialog = () => {
    setPaymentDialog({ open: false, payment: null });
  };

  // Copy payment code to clipboard
  const copyPaymentCode = () => {
    if (paymentDialog.payment?.paymentCode) {
      navigator.clipboard.writeText(paymentDialog.payment.paymentCode);
      toast.success("Đã sao chép mã thanh toán");
    }
  };

  // Update localStorage and fetch data when activeTab changes
  useEffect(() => {
    localStorage.setItem("activeTabShip", activeTab);
    fetchOrders(activeTab, 0);
    fetchStatusStatistics();
  }, [activeTab, fetchOrders, fetchStatusStatistics]);

  // Tab configurations
  const tabConfigs = [
    {
      key: "DA_DU_HANG",
      label: "Đã đủ hàng",
      color: "text-blue-700",
      bgColor: "bg-white",
    },
    {
      key: "CHO_THANH_TOAN_SHIP",
      label: "Chờ thanh toán ship",
      color: "text-yellow-700",
      bgColor: "bg-white",
    },
  ];

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchOrders(activeTab, newPage);
    }
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      CHO_THANH_TOAN_SHIP: {
        text: "Chờ thanh toán ship",
        className: "bg-yellow-100 text-yellow-800",
      },
      DA_DU_HANG: {
        text: "Đã đủ hàng",
        className: "bg-blue-100 text-blue-800",
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

  // Get order type display
  const getOrderTypeDisplay = (orderType) => {
    const typeConfig = {
      MUA_HO: "Mua hộ",
      VAN_CHUYEN: "Vận chuyển",
      KY_GUI: "Ký gửi",
    };
    return typeConfig[orderType] || orderType;
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format weight
  const formatWeight = (weight) => {
    if (!weight) return "0 kg";
    return `${parseFloat(weight).toFixed(2)} kg`;
  };

  return (
    <div className="mx-auto p-6">
      <Toaster />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Quản lý thanh toán vận chuyển
        </h1>
      </div>

      {/* Tabs with Status Counts */}
      <div className="flex flex-wrap gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        {tabConfigs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? `${tab.bgColor} ${tab.color} shadow-sm`
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            {statsLoading ? (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                ...
              </span>
            ) : (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {statusCounts[tab.key] ?? 0}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
          <span className="ml-2 text-gray-600">Đang tải...</span>
        </div>
      )}

      {/* Payment Dialog */}
      <PaymentDialog
        open={paymentDialog.open}
        payment={paymentDialog.payment}
        onClose={closePaymentDialog}
        onCopyCode={copyPaymentCode}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
      />

      {/* Orders List */}
      {!loading && (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                Không có đơn hàng
              </h3>
              <p className="text-gray-500">
                Chưa có đơn hàng nào với trạng thái này
              </p>
            </div>
          ) : (
            <>
              {/* Header - Updated với thêm cột Khách hàng */}
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="lg:col-span-2">Mã đơn hàng</div>
                  <div className="lg:col-span-2">Khách hàng</div>
                  <div className="lg:col-span-1">Mã thanh toán</div>
                  <div className="lg:col-span-1">Loại đơn</div>
                  <div className="lg:col-span-2">Trạng thái</div>
                  <div className="lg:col-span-1">Trọng lượng</div>
                  <div className="lg:col-span-1">Tổng tiền</div>
                  <div className="lg:col-span-2">Thao tác</div>
                </div>
              </div>

              {/* Orders List - Updated với thêm hiển thị customer name */}
              <div className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <div
                    key={order.orderId}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                      {/* Order Code */}
                      <div className="lg:col-span-2">
                        <span className="font-medium lg:hidden text-gray-500">
                          Mã đơn:{" "}
                        </span>
                        <span className="font-medium text-gray-900">
                          {order.orderCode}
                        </span>
                      </div>

                      {/* Customer Name - MỚI THÊM */}
                      <div className="lg:col-span-2">
                        <span className="font-medium lg:hidden text-gray-500">
                          Khách hàng:{" "}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {order.customer?.name || "N/A"}
                        </span>
                      </div>

                      {/* Payment Code */}
                      <div className="lg:col-span-1">
                        <span className="font-medium lg:hidden text-gray-500">
                          Mã TT:{" "}
                        </span>
                        <span className="text-sm text-gray-600">
                          {order.paymentCode || "Chưa có"}
                        </span>
                      </div>

                      {/* Order Type */}
                      <div className="lg:col-span-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {getOrderTypeDisplay(order.orderType)}
                        </span>
                      </div>

                      {/* Status */}
                      <div className="lg:col-span-2">
                        {getStatusBadge(order.status)}
                      </div>

                      {/* Total Net Weight */}
                      <div className="lg:col-span-1">
                        <span className="font-medium lg:hidden text-gray-500">
                          Trọng lượng:{" "}
                        </span>
                        <span className="text-sm text-gray-600">
                          {formatWeight(order.totalNetWeight)}
                        </span>
                      </div>

                      {/* Final Price */}
                      <div className="lg:col-span-1">
                        <span className="font-medium lg:hidden text-gray-500">
                          Tổng tiền:{" "}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(order.finalPriceOrder)}
                        </span>
                      </div>

                      {/* Action */}
                      <div className="lg:col-span-2">
                        {order.status === "CHO_THANH_TOAN_SHIP" && (
                          <>
                            {!order.paymentCode ? (
                              <CreatePaymentShip
                                orderCode={order.orderCode}
                                onSuccess={handlePaymentCreated}
                              />
                            ) : (
                              <ConfirmPaymentShip
                                paymentCode={order.paymentCode}
                                onSuccess={handlePaymentConfirmed}
                              />
                            )}
                          </>
                        )}

                        {order.status === "DA_DU_HANG" &&
                          !order.paymentCode && (
                            <CreatePaymentShip
                              orderCode={order.orderCode}
                              onSuccess={handlePaymentCreated}
                            />
                          )}

                        {order.status === "DA_DU_HANG" && order.paymentCode && (
                          <span className="text-sm text-gray-500">
                            Đã tạo thanh toán
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Note if exists */}
                    {order.note && (
                      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                        <span className="font-medium">Ghi chú:</span>{" "}
                        {order.note}
                      </div>
                    )}
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
    </div>
  );
};

export default PaymentShipList;
