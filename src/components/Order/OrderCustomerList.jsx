import React, { useState } from "react";
import toast from "react-hot-toast";
import AccountSearch from "./AccountSearch";
import orderCustomerService from "../../Services/Order/orderCustomerService";
import mergedPaymentService from "../../Services/Payment/mergedPaymentService";
import {
  User,
  Calendar,
  CreditCard,
  Package,
  Search,
  CheckSquare,
  Square,
  CreditCard as PaymentIcon,
  X,
  Copy,
  Download,
  QrCode,
} from "lucide-react";

const OrderCustomerList = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // New states for merged payment
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [creatingMergedPayment, setCreatingMergedPayment] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [mergedPaymentResult, setMergedPaymentResult] = useState(null);

  // Handle customer selection from AccountSearch
  const handleSelectCustomer = async (customer) => {
    setSelectedCustomer(customer);
    setHasSearched(true);
    // Clear previous selections when switching customer
    setSelectedOrders([]);
    setShowPaymentDialog(false);
    setMergedPaymentResult(null);
    await fetchCustomerOrders(customer.customerCode);
  };

  // Clear customer selection
  const handleClearCustomer = () => {
    setSelectedCustomer(null);
    setOrders([]);
    setHasSearched(false);
    setSelectedOrders([]);
    setShowPaymentDialog(false);
    setMergedPaymentResult(null);
  };

  // Handle order selection for merged payment
  const handleOrderSelection = (orderCode, isSelected) => {
    if (isSelected) {
      setSelectedOrders((prev) => [...prev, orderCode]);
    } else {
      setSelectedOrders((prev) => prev.filter((code) => code !== orderCode));
    }
  };

  // Select all orders
  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((order) => order.orderCode));
    }
  };

  // Create merged payment
  const handleCreateMergedPayment = async () => {
    if (selectedOrders.length < 2) {
      toast.error("Vui lòng chọn ít nhất 2 đơn hàng để gộp thanh toán");
      return;
    }

    try {
      setCreatingMergedPayment(true);
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");

      if (!token) {
        toast.error("Không tìm thấy token xác thực");
        return;
      }

      const result = await mergedPaymentService.createMergedPayment(
        selectedOrders,
        token
      );
      setMergedPaymentResult(result);
      setShowPaymentDialog(true);
      toast.success(
        `Tạo thanh toán gộp thành công! Mã thanh toán: ${result.paymentCode}`
      );

      // Clear selections after successful creation
      setSelectedOrders([]);
    } catch (error) {
      console.error("Error creating merged payment:", error);

      let errorMessage = "Có lỗi xảy ra khi tạo thanh toán gộp";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setCreatingMergedPayment(false);
    }
  };

  // Close payment dialog
  const handleClosePaymentDialog = () => {
    setShowPaymentDialog(false);
  };

  // Copy payment code to clipboard
  const handleCopyPaymentCode = async () => {
    if (mergedPaymentResult?.paymentCode) {
      try {
        await navigator.clipboard.writeText(mergedPaymentResult.paymentCode);
        toast.success("Đã sao chép mã thanh toán!");
      } catch {
        toast.error("Không thể sao chép mã thanh toán");
      }
    }
  };

  // Download QR Code
  const handleDownloadQR = () => {
    if (mergedPaymentResult?.qrCode) {
      const link = document.createElement("a");
      link.href = mergedPaymentResult.qrCode;
      link.download = `QR_${mergedPaymentResult.paymentCode}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Đang tải xuống mã QR...");
    }
  };

  // Fetch orders for selected customer
  const fetchCustomerOrders = async (customerCode) => {
    try {
      setLoading(true);
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");

      if (!token) {
        toast.error("Không tìm thấy token xác thực");
        return;
      }

      const data = await orderCustomerService.getOrdersByCustomer(
        customerCode,
        token
      );
      setOrders(data || []);

      if (!data || data.length === 0) {
        toast.info(
          `Không tìm thấy đơn hàng nào cho khách hàng ${customerCode}`
        );
      } else {
        toast.success(
          `Tìm thấy ${data.length} đơn hàng cho khách hàng ${customerCode}`
        );
      }
    } catch (error) {
      console.error("Error fetching customer orders:", error);

      let errorMessage = "Có lỗi xảy ra khi tải đơn hàng";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total amount of selected orders
  const calculateSelectedTotal = () => {
    return orders
      .filter((order) => selectedOrders.includes(order.orderCode))
      .reduce((total, order) => total + (order.finalPriceOrder || 0), 0);
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
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      DA_XAC_NHAN: {
        text: "Đã xác nhận",
        className: "bg-green-100 text-green-800",
      },
      CHO_THANH_TOAN_SHIP: {
        text: "Chờ thanh toán ship",
        className: "bg-yellow-100 text-yellow-800",
      },
      CHO_THANH_TOAN: {
        text: "Chờ thanh toán",
        className: "bg-orange-100 text-orange-800",
      },
      CHO_NHAP_KHO_VN: {
        text: "Chờ nhập kho VN",
        className: "bg-blue-100 text-blue-800",
      },
      HOAN_THANH: {
        text: "Hoàn thành",
        className: "bg-green-100 text-green-800",
      },
      HUY: {
        text: "Đã hủy",
        className: "bg-red-100 text-red-800",
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

  // Payment Success Dialog Component
  const PaymentSuccessDialog = () => {
    if (!showPaymentDialog || !mergedPaymentResult) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-t-2xl">
            <button
              onClick={handleClosePaymentDialog}
              className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <PaymentIcon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                Thanh toán gộp thành công!
              </h2>
              <p className="text-green-100">
                Đơn hàng đã được gộp và sẵn sàng thanh toán
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Payment Code */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-600 mb-2 block">
                Mã thanh toán
              </label>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <span className="font-mono text-lg font-bold text-gray-900">
                    {mergedPaymentResult.paymentCode}
                  </span>
                </div>
                <button
                  onClick={handleCopyPaymentCode}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition-colors"
                  title="Sao chép mã thanh toán"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Payment Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Tổng tiền
                </label>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(mergedPaymentResult.totalAmount)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Trạng thái
                </label>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                  {mergedPaymentResult.status === "CHO_THANH_TOAN"
                    ? "Chờ thanh toán"
                    : mergedPaymentResult.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Số tiền đã thu
                </label>
                <div className="text-lg font-semibold text-gray-900">
                  {formatCurrency(mergedPaymentResult.collectedAmount)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Ngày tạo
                </label>
                <div className="text-sm text-gray-900">
                  {formatDate(mergedPaymentResult.actionAt)}
                </div>
              </div>
            </div>

            {/* QR Code */}
            {mergedPaymentResult.qrCode && (
              <div className="text-center">
                <label className="text-sm font-medium text-gray-600 mb-3 block">
                  Mã QR thanh toán
                </label>
                <div className="bg-white border-2 border-gray-200 rounded-xl p-4 inline-block shadow-sm">
                  <img
                    src={mergedPaymentResult.qrCode}
                    alt="QR Code thanh toán"
                    className="w-48 h-48 mx-auto"
                  />
                </div>

                <div className="mt-4 flex justify-center space-x-3">
                  <button
                    onClick={handleDownloadQR}
                    className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Tải xuống QR</span>
                  </button>
                </div>
              </div>
            )}

            {/* Payment Instructions */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                <QrCode className="w-4 h-4 mr-2" />
                Hướng dẫn thanh toán
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Quét mã QR bằng ứng dụng ngân hàng</li>
                <li>
                  • Hoặc chuyển khoản với nội dung:{" "}
                  <strong>{mergedPaymentResult.content}</strong>
                </li>
                <li>
                  • Số tiền:{" "}
                  <strong>
                    {formatCurrency(mergedPaymentResult.totalAmount)}
                  </strong>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6">
            <button
              onClick={handleClosePaymentDialog}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tra cứu đơn hàng theo khách hàng
        </h1>
        <p className="text-gray-600">
          Tìm kiếm khách hàng để xem danh sách đơn hàng và tạo thanh toán gộp
        </p>
      </div>

      {/* Customer Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Tìm kiếm khách hàng
          </h2>
        </div>

        <div className="max-w-md">
          <AccountSearch
            onSelectAccount={handleSelectCustomer}
            onClear={handleClearCustomer}
            value={
              selectedCustomer
                ? `${selectedCustomer.customerCode} - ${selectedCustomer.name}`
                : ""
            }
          />
        </div>

        {/* Selected Customer Info */}
        {selectedCustomer && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-blue-900">
                  {selectedCustomer.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 text-sm text-blue-700">
                  <div>
                    <span className="font-medium">Mã KH:</span>{" "}
                    {selectedCustomer.customerCode}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>{" "}
                    {selectedCustomer.email}
                  </div>
                  <div>
                    <span className="font-medium">SĐT:</span>{" "}
                    {selectedCustomer.phone}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Merged Payment Result */}
      {mergedPaymentResult && (
        <div className="bg-white rounded-lg shadow-sm border border-green-200 p-6 mb-6">
          <div className="flex items-center mb-4">
            <PaymentIcon className="w-5 h-5 text-green-600 mr-2" />
            <h2 className="text-lg font-semibold text-green-900">
              Thanh toán gộp đã tạo thành công
            </h2>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-green-700 mb-1">
                  Mã thanh toán:
                </div>
                <div className="font-semibold text-green-900">
                  {mergedPaymentResult.paymentCode}
                </div>
              </div>
              <div>
                <div className="text-sm text-green-700 mb-1">Tổng tiền:</div>
                <div className="font-semibold text-green-900">
                  {formatCurrency(mergedPaymentResult.totalAmount)}
                </div>
              </div>
              <div>
                <div className="text-sm text-green-700 mb-1">Trạng thái:</div>
                <div className="font-semibold text-green-900">
                  {mergedPaymentResult.status}
                </div>
              </div>
              <div>
                <div className="text-sm text-green-700 mb-1">Ngày tạo:</div>
                <div className="font-semibold text-green-900">
                  {formatDate(mergedPaymentResult.actionAt)}
                </div>
              </div>
            </div>

            {mergedPaymentResult.qrCode && (
              <div className="mt-4 pt-4 border-t border-green-200">
                <div className="text-sm text-green-700 mb-2">
                  Mã QR thanh toán:
                </div>
                <img
                  src={mergedPaymentResult.qrCode}
                  alt="QR Code thanh toán"
                  className="w-48 h-48 border border-green-200 rounded"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Đang tải đơn hàng...</span>
        </div>
      )}

      {/* Orders List */}
      {!loading && hasSearched && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header with Bulk Actions */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Danh sách đơn hàng
                {orders.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-gray-600">
                    ({orders.length} đơn hàng)
                  </span>
                )}
              </h2>

              {orders.length > 0 && (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleSelectAll}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    {selectedOrders.length === orders.length ? (
                      <CheckSquare className="w-4 h-4 mr-1" />
                    ) : (
                      <Square className="w-4 h-4 mr-1" />
                    )}
                    {selectedOrders.length === orders.length
                      ? "Bỏ chọn tất cả"
                      : "Chọn tất cả"}
                  </button>

                  {selectedOrders.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        Đã chọn: {selectedOrders.length} đơn hàng
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        Tổng: {formatCurrency(calculateSelectedTotal())}
                      </span>
                      <button
                        onClick={handleCreateMergedPayment}
                        disabled={
                          creatingMergedPayment || selectedOrders.length < 2
                        }
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
                      >
                        {creatingMergedPayment ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Đang tạo...
                          </>
                        ) : (
                          <>
                            <PaymentIcon className="w-4 h-4 mr-2" />
                            Tạo thanh toán gộp
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Orders Content */}
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không có đơn hàng
              </h3>
              <p className="text-gray-500">
                Khách hàng này chưa có đơn hàng nào trong hệ thống
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {orders.map((order) => (
                <div
                  key={order.orderId}
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    selectedOrders.includes(order.orderCode)
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    {/* Checkbox */}
                    <div className="flex items-start space-x-4">
                      <button
                        onClick={() =>
                          handleOrderSelection(
                            order.orderCode,
                            !selectedOrders.includes(order.orderCode)
                          )
                        }
                        className="mt-1 text-blue-600 hover:text-blue-800"
                      >
                        {selectedOrders.includes(order.orderCode) ? (
                          <CheckSquare className="w-5 h-5" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>

                      {/* Order Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {order.orderCode}
                          </h3>
                          {getStatusBadge(order.status)}
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {getOrderTypeDisplay(order.orderType)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{formatDate(order.createdAt)}</span>
                          </div>
                          <div className="flex items-center">
                            <CreditCard className="w-4 h-4 mr-2" />
                            <span>Mã GD: {order.paymentCode}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium">Tỷ giá:</span>
                            <span className="ml-1">
                              {order.exchangeRate?.toLocaleString("vi-VN")}
                            </span>
                          </div>
                        </div>

                        {order.note && (
                          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                            <p className="text-sm text-yellow-800">
                              <span className="font-medium">Ghi chú:</span>{" "}
                              {order.note}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Total Amount */}
                    <div className="text-right ml-6">
                      <div className="text-2xl font-bold text-gray-900">
                        {formatCurrency(order.finalPriceOrder)}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Tổng đơn hàng
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty State - No Search Yet */}
      {!hasSearched && !loading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 text-center py-12">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chọn khách hàng để xem đơn hàng
          </h3>
          <p className="text-gray-500">
            Sử dụng ô tìm kiếm ở trên để tìm và chọn khách hàng
          </p>
        </div>
      )}

      {/* Payment Success Dialog */}
      <PaymentSuccessDialog />
    </div>
  );
};

export default OrderCustomerList;
