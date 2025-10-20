// src/Components/StaffPurchase/AuctionPayment.jsx (FULL CODE - COMPLETE)
import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Gavel,
  CreditCard,
  QrCode,
  Calendar,
  RefreshCw,
  Eye,
  DollarSign,
  Filter,
  X,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import createOrderPaymentService from "../../Services/Payment/createOrderPaymentService";
import confirmPaymentService from "../../Services/Payment/confirmPaymentService";
import toast from "react-hot-toast";

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

const AuctionPayment = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedQRCode, setSelectedQRCode] = useState(null);
  const [processingPayments, setProcessingPayments] = useState({});
  const [paymentResults, setPaymentResults] = useState({});
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    payment: null,
  });

  // Fetch auction payments
  const fetchAuctionPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching auction payments...");
      const response = await createOrderPaymentService.getAuctionPayments();
      console.log("API Response:", response);

      if (Array.isArray(response)) {
        setPayments(response);
      } else {
        setPayments([]);
      }
    } catch (error) {
      console.error("Error fetching auction payments:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể tải danh sách thanh toán đấu giá";
      setError(errorMessage);
      setPayments([]);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuctionPayments();
  }, [fetchAuctionPayments]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "N/A";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Get status color and icon
  const getStatusInfo = (status) => {
    const statusMap = {
      CHO_THANH_TOAN: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        label: "Chờ thanh toán",
        icon: Clock,
      },
      DA_THANH_TOAN: {
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Đã thanh toán",
        icon: CheckCircle,
      },
      HUY: {
        color: "bg-red-100 text-red-800 border-red-200",
        label: "Đã hủy",
        icon: XCircle,
      },
    };
    return (
      statusMap[status] || {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        label: status,
        icon: Clock,
      }
    );
  };

  // Get payment type label
  const getPaymentTypeLabel = (type) => {
    const typeMap = {
      MA_QR: "QR Code",
      CHUYEN_KHOAN: "Chuyển khoản",
      TIEN_MAT: "Tiền mặt",
    };
    return typeMap[type] || type;
  };

  // Handle view QR code
  const handleViewQRCode = (payment) => {
    setSelectedQRCode(payment);
  };

  // Handle close QR modal
  const handleCloseQRModal = () => {
    setSelectedQRCode(null);
  };

  // Handle download QR code
  const handleDownloadQR = async (qrUrl, paymentCode) => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `QR_${paymentCode}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Tải QR code thành công!");
    } catch (error) {
      console.error("Error downloading QR code:", error);
      toast.error("Không thể tải QR code");
    }
  };

  // Show confirmation dialog
  const showConfirmDialog = (payment) => {
    setConfirmDialog({
      isOpen: true,
      payment: payment,
    });
  };

  // Close confirmation dialog
  const closeConfirmDialog = () => {
    setConfirmDialog({
      isOpen: false,
      payment: null,
    });
  };

  // Handle payment confirmation
  const handleConfirmPayment = async (payment) => {
    const paymentCode = payment.paymentCode;

    if (!paymentCode) {
      toast.error("Không tìm thấy mã thanh toán");
      return;
    }

    setProcessingPayments((prev) => ({ ...prev, [payment.paymentId]: true }));

    try {
      const token = localStorage.getItem("jwt");

      if (!token) {
        toast.error("Không tìm thấy token xác thực AuctionPayment");
        return;
      }

      const response = await confirmPaymentService.confirmPayment(
        paymentCode,
        token
      );

      setPaymentResults((prev) => ({
        ...prev,
        [payment.paymentId]: {
          success: true,
          message: "Xác nhận thanh toán thành công",
          data: response,
        },
      }));

      toast.success(
        `Xác nhận thanh toán thành công cho giao dịch ${payment.paymentCode}!`
      );

      // Refresh payments list after successful confirmation
      setTimeout(() => {
        fetchAuctionPayments();
      }, 1000);
    } catch (error) {
      console.error("Error confirming payment:", error);

      const errorMessage = getErrorMessage(error);

      setPaymentResults((prev) => ({
        ...prev,
        [payment.paymentId]: {
          success: false,
          message: errorMessage,
        },
      }));

      toast.error(`Không thể xác nhận thanh toán: ${errorMessage}`, {
        duration: 5000,
      });
    } finally {
      setProcessingPayments((prev) => ({
        ...prev,
        [payment.paymentId]: false,
      }));
    }
  };

  // Handle confirmed payment from dialog
  const handleConfirmedPayment = async () => {
    const payment = confirmDialog.payment;
    closeConfirmDialog();

    if (!payment) return;

    await handleConfirmPayment(payment);
  };

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    const matchSearch =
      payment.paymentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = filterStatus ? payment.status === filterStatus : true;

    return matchSearch && matchStatus;
  });

  // Get unique statuses for filter
  const uniqueStatuses = [...new Set(payments.map((p) => p.status))];

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="mx-auto">
        {/* Header Section - Purple Theme */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Thanh toán đấu giá
            </h1>
          </div>
        </div>

        {/* Error Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
            <div className="flex items-center">
              <XCircle className="w-4 h-4 text-red-400 mr-2" />
              <div>
                <p className="text-red-700 text-sm">{error}</p>
                <button
                  onClick={fetchAuctionPayments}
                  className="text-red-600 hover:text-red-800 text-xs underline mt-1"
                >
                  Thử lại
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Controls Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm "
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  disabled={loading}
                  className="pl-8 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 appearance-none bg-white"
                >
                  <option value="">Tất cả trạng thái</option>
                  {uniqueStatuses.map((status) => (
                    <option key={status} value={status}>
                      {getStatusInfo(status).label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={fetchAuctionPayments}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                Làm mới
              </button>
            </div>

            {/* Summary Stats */}
            <div className="flex items-center gap-4 text-sm">
              <div className="text-right">
                <p className="text-gray-500">Tổng giao dịch</p>
                <p className="text-lg font-bold text-purple-600">
                  {filteredPayments.length}
                </p>
              </div>
            </div>
          </div>

          {/* Active Filters Badge */}
          {(searchTerm || filterStatus) && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500">Bộ lọc:</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                  Tìm kiếm: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm("")}
                    className="hover:text-purple-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filterStatus && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                  {getStatusInfo(filterStatus).label}
                  <button
                    onClick={() => setFilterStatus("")}
                    className="hover:text-purple-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="inline-flex items-center px-3 py-2 font-semibold leading-5 text-sm text-purple-600">
              <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4 text-purple-600" />
              Đang tải dữ liệu...
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredPayments.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-medium text-gray-900 mb-2">
              Không có giao dịch nào
            </h3>
            <p className="text-gray-500 text-sm">
              {searchTerm || filterStatus
                ? "Không tìm thấy giao dịch phù hợp với bộ lọc."
                : "Hiện tại chưa có giao dịch thanh toán đấu giá nào."}
            </p>
            {(searchTerm || filterStatus) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("");
                }}
                className="mt-3 text-purple-600 hover:text-purple-800 text-sm underline"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        )}

        {/* Payments List */}
        {!loading && filteredPayments.length > 0 && (
          <div className="space-y-3">
            {filteredPayments.map((payment, index) => {
              const statusInfo = getStatusInfo(payment.status);
              const StatusIcon = statusInfo.icon;
              const isProcessing = processingPayments[payment.paymentId];
              const paymentResult = paymentResults[payment.paymentId];

              return (
                <div
                  key={payment.paymentId}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Payment Header */}
                  <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-purple-600">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                            <Gavel className="w-3 h-3 text-purple-500" />
                            {payment.paymentCode}
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                            <span>
                              <Calendar className="w-2.5 h-2.5 inline mr-1" />
                              {formatDate(payment.actionAt)}
                            </span>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              {getPaymentTypeLabel(payment.paymentType)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  {/* Payment Content */}
                  <div className="p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                      {/* Order Info */}
                      <div className="lg:col-span-1">
                        <div className="text-xs text-gray-500 mb-1">
                          Mã đơn hàng
                        </div>
                        <div className="font-semibold text-purple-600">
                          {payment.content}
                        </div>
                        {payment.isMergedPayment && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                            Gộp thanh toán
                          </span>
                        )}
                      </div>

                      {/* Amount Info */}
                      <div className="lg:col-span-1">
                        <div className="space-y-2">
                          <div>
                            <div className="text-xs text-gray-500">Số tiền</div>
                            <div className="font-semibold text-gray-900">
                              {formatCurrency(payment.amount)}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Đã thu</div>
                            <div className="font-semibold text-green-600">
                              {formatCurrency(payment.collectedAmount)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* QR Code Preview */}
                      {payment.qrCode && (
                        <div className="lg:col-span-1">
                          <div className="text-xs text-gray-500 mb-2">
                            QR Code
                          </div>
                          <div className="relative group">
                            <img
                              src={payment.qrCode}
                              alt="QR Code"
                              className="w-20 h-20 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-400 transition-colors"
                              onClick={() => handleViewQRCode(payment)}
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg cursor-pointer">
                              <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="lg:col-span-1 flex flex-col gap-2 items-end justify-center">
                        {payment.qrCode && (
                          <>
                            <button
                              onClick={() => handleViewQRCode(payment)}
                              className="flex items-center gap-1 bg-purple-500 text-white px-3 py-1.5 rounded-md text-xs hover:bg-purple-600 transition-colors w-full justify-center"
                            >
                              <QrCode className="w-3 h-3" />
                              Xem QR
                            </button>
                            <button
                              onClick={() =>
                                handleDownloadQR(
                                  payment.qrCode,
                                  payment.paymentCode
                                )
                              }
                              className="flex items-center gap-1 bg-gray-500 text-white px-3 py-1.5 rounded-md text-xs hover:bg-gray-600 transition-colors w-full justify-center"
                            >
                              <Download className="w-3 h-3" />
                              Tải QR
                            </button>
                          </>
                        )}

                        {/* Confirm Payment Button - Only show for CHO_THANH_TOAN */}
                        {payment.status === "CHO_THANH_TOAN" && (
                          <button
                            onClick={() => showConfirmDialog(payment)}
                            disabled={isProcessing}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors w-full justify-center ${
                              isProcessing
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-green-100 text-green-800 hover:bg-green-200"
                            }`}
                          >
                            <CheckCircle className="w-3 h-3" />
                            {isProcessing ? "Đang xử lý..." : "Xác nhận TT"}
                          </button>
                        )}
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
                            paymentResult.success
                              ? "text-green-800"
                              : "text-red-800"
                          }`}
                        >
                          {paymentResult.message}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {selectedQRCode && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={handleCloseQRModal}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  QR Code Thanh Toán
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedQRCode.paymentCode}
                </p>
              </div>
              <button
                onClick={handleCloseQRModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* QR Code Image */}
              <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
                <img
                  src={selectedQRCode.qrCode}
                  alt="QR Code"
                  className="w-64 h-64 border-4 border-purple-200 rounded-lg"
                />
              </div>

              {/* Payment Info */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="font-semibold text-purple-600">
                    {selectedQRCode.content}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số tiền:</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(selectedQRCode.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      getStatusInfo(selectedQRCode.status).color
                    }`}
                  >
                    {getStatusInfo(selectedQRCode.status).label}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() =>
                    handleDownloadQR(
                      selectedQRCode.qrCode,
                      selectedQRCode.paymentCode
                    )
                  }
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Tải xuống
                </button>
                <button
                  onClick={handleCloseQRModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog.isOpen && confirmDialog.payment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Xác nhận thanh toán
                </h3>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-3">
                Bạn có chắc chắn muốn xác nhận thanh toán cho giao dịch này
                không?
              </p>

              <div className="bg-gray-50 rounded-md p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Mã giao dịch:</span>
                  <span className="font-medium text-purple-600">
                    {confirmDialog.payment.paymentCode}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="font-medium">
                    {confirmDialog.payment.content}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Số tiền:</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(confirmDialog.payment.amount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Loại thanh toán:</span>
                  <span className="font-medium">
                    {getPaymentTypeLabel(confirmDialog.payment.paymentType)}
                  </span>
                </div>
              </div>
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
    </div>
  );
};

export default AuctionPayment;
