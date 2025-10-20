// MergedPaymentOrder.jsx - FULL CODE FIXED
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext"; // ✅ THÊM: Import useAuth
import AccountSearch from "../Order/AccountSearch";
import orderCustomerService from "../../Services/Order/orderCustomerService";
import PaymentDialog from "./PaymentDialog";
import CreateMergedPaymentOrder from "./CreateMergedPaymentOrder";
import {
  User,
  Calendar,
  CreditCard,
  Package,
  Search,
  CheckSquare,
  Square,
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

const MergedPaymentOrder = () => {
  // ✅ THÊM: Lấy token từ useAuth hook
  const { token, isAuthenticated, logout } = useAuth();

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [paymentDialog, setPaymentDialog] = useState({
    open: false,
    payment: null,
  });

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

  // Handle successful merged payment creation
  const handleMergedPaymentSuccess = (payment) => {
    setPaymentDialog({ open: true, payment });
    setSelectedOrders([]);
    // Optionally refresh orders list
    if (selectedCustomer) {
      fetchCustomerOrders(selectedCustomer.customerCode);
    }
  };

  // Handle merged payment creation error
  const handleMergedPaymentError = (error) => {
    console.error("Merged payment error:", error);
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

  // ✅ CẬP NHẬT: Fetch orders using token from context
  const fetchCustomerOrders = async (customerCode) => {
    try {
      setLoading(true);

      // ✅ THAY ĐỔI: Lấy token từ context (key đúng: "jwt")
      if (!token) {
        console.warn("❌ Token không tìm thấy trong AuthContext");
        toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.", {
          duration: 5000,
        });
        return;
      }

      console.log("✅ Token found, fetching orders for:", customerCode);

      // ✅ Sử dụng token từ context
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
      console.error("❌ Error fetching customer orders:", error);

      // ✅ Xử lý lỗi 401 (token hết hạn hoặc không hợp lệ)
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.warn("❌ Token expired or invalid - 401/403 received");
        toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.", {
          duration: 5000,
        });
        // Optional: Logout and redirect to login
        // await logout();
        // window.location.href = "/login";
      } else {
        const errorMessage = getErrorMessage(error);
        toast.error(`Không thể tải đơn hàng: ${errorMessage}`, {
          duration: 5000,
        });
      }

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
      DANG_SHIP: {
        text: "Đang vận chuyển",
        className: "bg-purple-100 text-purple-800",
      },
    };

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          statusConfig[status]?.className || "bg-gray-100 text-gray-800"
        }`}
      >
        {statusConfig[status]?.text || status}
      </span>
    );
  };

  // Get order type display
  const getOrderTypeDisplay = (type) => {
    const typeMap = {
      THUONG: "Thường",
      TET: "Tết",
      BLACK_FRIDAY: "Black Friday",
      FLASH_SALE: "Flash Sale",
    };
    return typeMap[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* Account Search */}
      <AccountSearch
        onSelectCustomer={handleSelectCustomer}
        onClearCustomer={handleClearCustomer}
      />

      {/* Selected Customer Info */}
      {selectedCustomer && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Thông tin khách hàng
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Tên:</span>{" "}
                  {selectedCustomer.name}
                </div>
                <div>
                  <span className="font-medium">Mã khách hàng:</span>{" "}
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
                <div className="inline-flex items-center gap-1 bg-red-50 border border-red-200 rounded-md px-2 py-1 text-sm font-semibold text-red-700 shadow-sm w-auto max-w-max">
                  <span className="font-medium">Số dư:</span>{" "}
                  {new Intl.NumberFormat("vi-VN").format(
                    selectedCustomer.balance
                  )}{" "}
                  VND
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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

                      {/* Use CreateMergedPaymentOrder Component */}
                      <CreateMergedPaymentOrder
                        selectedOrders={selectedOrders}
                        totalAmount={calculateSelectedTotal()}
                        formatCurrency={formatCurrency}
                        onSuccess={handleMergedPaymentSuccess}
                        onError={handleMergedPaymentError}
                      />
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
