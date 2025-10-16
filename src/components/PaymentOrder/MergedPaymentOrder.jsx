// MergedPaymentOrder.jsx
import React, { useState } from "react";
import toast from "react-hot-toast";
import AccountSearch from "../Order/AccountSearch";
import orderCustomerService from "../../Services/Order/orderCustomerService";
import mergedPaymentService from "../../Services/Payment/mergedPaymentService";
import PaymentDialog from "./PaymentDialog";
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
  Info,
} from "lucide-react";

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

// Merged Payment Config Modal Component
const MergedPaymentConfigModal = ({
  isOpen,
  onClose,
  onConfirm,
  selectedCount,
  totalAmount,
  formatCurrency,
}) => {
  const [depositPercent, setDepositPercent] = useState(0);
  const [isUseBalance, setIsUseBalance] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (depositPercent < 0) {
      newErrors.depositPercent = "Phần trăm cọc không thể âm";
    }
    if (depositPercent > 100) {
      newErrors.depositPercent = "Phần trăm cọc không thể vượt quá 100%";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onConfirm(depositPercent, isUseBalance);
    }
  };

  const handleDepositPercentChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setDepositPercent(value);
    if (errors.depositPercent) {
      setErrors({});
    }
  };

  const calculateDepositAmount = () => {
    return (totalAmount * depositPercent) / 100;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Cấu hình thanh toán gộp
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          {/* Info Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">
                  Bạn đã chọn {selectedCount} đơn hàng
                </p>
                <p>Tổng giá trị: {formatCurrency(totalAmount)}</p>
              </div>
            </div>
          </div>

          {/* Deposit Percent Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phần trăm tiền cọc <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                value={depositPercent}
                onChange={handleDepositPercentChange}
                className={`w-full px-3 py-2 pr-8 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.depositPercent
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Nhập phần trăm tiền cọc (0-100)"
              />
              <span className="absolute right-3 top-2.5 text-gray-500">%</span>
            </div>
            {errors.depositPercent && (
              <p className="mt-1 text-sm text-red-600">
                {errors.depositPercent}
              </p>
            )}

            {/* Deposit Amount Preview */}
            {depositPercent > 0 && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Số tiền cọc:</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(calculateDepositAmount())}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Còn lại:</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(totalAmount - calculateDepositAmount())}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Use Balance Field */}
          <div className="mb-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isUseBalance}
                onChange={(e) => setIsUseBalance(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Sử dụng số dư tài khoản
                </span>
                <p className="text-xs text-gray-500 mt-0.5">
                  Sử dụng số dư có sẵn trong tài khoản để thanh toán
                </p>
              </div>
            </label>
          </div>

          {/* Summary */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Tóm tắt cấu hình:
            </h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Số đơn hàng:</span>
                <span className="font-medium">{selectedCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phần trăm cọc:</span>
                <span className="font-medium">{depositPercent}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sử dụng số dư:</span>
                <span className="font-medium">
                  {isUseBalance ? "Có" : "Không"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Xác nhận tạo thanh toán
          </button>
        </div>
      </div>
    </div>
  );
};

const MergedPaymentOrder = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [creatingMergedPayment, setCreatingMergedPayment] = useState(false);
  const [paymentDialog, setPaymentDialog] = useState({
    open: false,
    payment: null,
  });
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Handle customer selection from AccountSearch
  const handleSelectCustomer = async (customer) => {
    setSelectedCustomer(customer);
    setHasSearched(true);
    setSelectedOrders([]);
    setPaymentDialog({ open: false, payment: null });
    await fetchCustomerOrders(customer.customerCode);
  };

  // Clear customer selection
  const handleClearCustomer = () => {
    setSelectedCustomer(null);
    setOrders([]);
    setHasSearched(false);
    setSelectedOrders([]);
    setPaymentDialog({ open: false, payment: null });
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

  // Open config modal
  const handleOpenConfigModal = () => {
    if (selectedOrders.length < 2) {
      toast.error("Vui lòng chọn ít nhất 2 đơn hàng để gộp thanh toán");
      return;
    }
    setShowConfigModal(true);
  };

  // Create merged payment with config
  const handleConfirmMergedPayment = async (depositPercent, isUseBalance) => {
    setShowConfigModal(false);

    try {
      setCreatingMergedPayment(true);

      // Call the mergedPaymentService with the correct parameters
      const result = await mergedPaymentService.mergePayments(
        depositPercent,
        isUseBalance,
        selectedOrders // This is the array of payment IDs
      );

      setPaymentDialog({ open: true, payment: result });
      toast.success(
        `Tạo thanh toán gộp thành công! Mã thanh toán: ${
          result.paymentCode || result.id || "N/A"
        }`
      );
      setSelectedOrders([]);
    } catch (error) {
      console.error("Error creating merged payment:", error);
      const errorMessage = getErrorMessage(error);
      toast.error(`Không thể tạo thanh toán gộp: ${errorMessage}`, {
        duration: 5000,
      });
    } finally {
      setCreatingMergedPayment(false);
    }
  };

  // Close payment dialog
  const handleClosePaymentDialog = () => {
    setPaymentDialog({ open: false, payment: null });
  };

  // Copy payment code to clipboard
  const handleCopyPaymentCode = () => {
    if (paymentDialog.payment?.paymentCode) {
      navigator.clipboard.writeText(paymentDialog.payment.paymentCode);
      toast.success("Đã sao chép mã thanh toán");
    }
  };

  // Fetch orders for selected customer
  const fetchCustomerOrders = async (customerCode) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

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
      const errorMessage = getErrorMessage(error);
      toast.error(`Không thể tải đơn hàng: ${errorMessage}`, {
        duration: 5000,
      });
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
    if (!dateString) return "N/A";
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
      DA_DU_HANG: {
        text: "Đã đủ hàng",
        className: "bg-blue-100 text-blue-800",
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

      {/* Merged Payment Config Modal */}
      <MergedPaymentConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        onConfirm={handleConfirmMergedPayment}
        selectedCount={selectedOrders.length}
        totalAmount={calculateSelectedTotal()}
        formatCurrency={formatCurrency}
      />

      {/* Payment Dialog - Using reusable component */}
      <PaymentDialog
        open={paymentDialog.open}
        payment={paymentDialog.payment}
        onClose={handleClosePaymentDialog}
        onCopyCode={handleCopyPaymentCode}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
      />

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
                        onClick={handleOpenConfigModal}
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
                          {order.paymentCode && (
                            <div className="flex items-center">
                              <CreditCard className="w-4 h-4 mr-2" />
                              <span>Mã GD: {order.paymentCode}</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <span className="font-medium">Tỷ giá:</span>
                            <span className="ml-1">
                              {order.exchangeRate
                                ? order.exchangeRate.toLocaleString("vi-VN")
                                : "N/A"}
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
    </div>
  );
};

export default MergedPaymentOrder;
