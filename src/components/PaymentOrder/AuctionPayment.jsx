// src/Components/StaffPurchase/AuctionPayment.jsx (REDESIGNED - CLEAN BLUE THEME)
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
  FileText,
  User,
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

  // Get status color and icon (Blue theme only)
  const getStatusInfo = (status) => {
    const statusMap = {
      CHO_THANH_TOAN: {
        color: "bg-blue-50 text-blue-700 border-blue-200",
        label: "Chờ thanh toán",
        icon: Clock,
      },
      DA_THANH_TOAN: {
        color: "bg-blue-100 text-blue-800 border-blue-300",
        label: "Đã thanh toán",
        icon: CheckCircle,
      },
      HUY: {
        color: "bg-slate-100 text-slate-600 border-slate-200",
        label: "Đã hủy",
        icon: XCircle,
      },
    };
    return (
      statusMap[status] || {
        color: "bg-slate-50 text-slate-600 border-slate-200",
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
        toast.error("Không tìm thấy token xác thực");
        return;
      }

      const response = await confirmPaymentService.confirmPayment(
        paymentCode,
        token
      );

      if (response.success) {
        toast.success(response.message || "Xác nhận thanh toán thành công!");
        setPaymentResults((prev) => ({
          ...prev,
          [payment.paymentId]: {
            success: true,
            message: response.message || "Thanh toán đã được xác nhận",
          },
        }));
        await fetchAuctionPayments();
      } else {
        const errorMsg = getErrorMessage(response);
        toast.error(errorMsg);
        setPaymentResults((prev) => ({
          ...prev,
          [payment.paymentId]: {
            success: false,
            message: errorMsg,
          },
        }));
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      const errorMsg = getErrorMessage(error);
      toast.error(errorMsg);
      setPaymentResults((prev) => ({
        ...prev,
        [payment.paymentId]: {
          success: false,
          message: errorMsg,
        },
      }));
    } finally {
      setProcessingPayments((prev) => ({
        ...prev,
        [payment.paymentId]: false,
      }));
      closeConfirmDialog();
    }
  };

  // Handle confirmed payment from dialog
  const handleConfirmedPayment = () => {
    if (confirmDialog.payment) {
      handleConfirmPayment(confirmDialog.payment);
    }
  };

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.paymentCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.userName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "" || payment.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Gavel className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800">
                  Quản lý thanh toán đấu giá
                </h1>
              </div>
            </div>
            <button
              onClick={fetchAuctionPayments}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
              />
              Làm mới
            </button>
          </div>

          {/* Search and Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã, đơn hàng, người dùng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-sm"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="CHO_THANH_TOAN">Chờ thanh toán</option>
                <option value="DA_THANH_TOAN">Đã thanh toán</option>
                <option value="HUY">Đã hủy</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600">Tổng số giao dịch</p>
                <p className="text-lg font-bold text-slate-800 mt-0.5">
                  {payments.length}
                </p>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600">Chờ thanh toán</p>
                <p className="text-lg font-bold text-blue-600 mt-0.5">
                  {payments.filter((p) => p.status === "CHO_THANH_TOAN").length}
                </p>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600">Đã thanh toán</p>
                <p className="text-lg font-bold text-blue-800 mt-0.5">
                  {payments.filter((p) => p.status === "DA_THANH_TOAN").length}
                </p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-800" />
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <RefreshCw className="w-6 h-6 text-blue-600 animate-spin mx-auto mb-2" />
              <p className="text-sm text-slate-600">Đang tải dữ liệu...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 text-center">
            <AlertTriangle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-600 mb-3">{error}</p>
            <button
              onClick={fetchAuctionPayments}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Payments List */}
        {!loading && !error && (
          <div className="space-y-3">
            {filteredPayments.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-8 text-center">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600 text-base mb-1">
                  Không tìm thấy giao dịch nào
                </p>
                <p className="text-slate-400 text-xs">
                  Thử điều chỉnh bộ lọc hoặc tìm kiếm khác
                </p>
              </div>
            ) : (
              filteredPayments.map((payment) => {
                const statusInfo = getStatusInfo(payment.status);
                const StatusIcon = statusInfo.icon;
                const isProcessing = processingPayments[payment.paymentId];
                const paymentResult = paymentResults[payment.paymentId];

                return (
                  <div
                    key={payment.paymentId}
                    className="bg-white rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow"
                  >
                    <div className="p-4">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-sm font-bold text-slate-800">
                              {payment.paymentCode}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${statusInfo.color}`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {statusInfo.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <User className="w-3 h-3" />
                            <span>{payment.userName || "N/A"}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-base font-bold text-blue-600">
                            {formatCurrency(payment.amount)}
                          </div>
                          <div className="flex items-center justify-end gap-1 text-xs text-slate-500 mt-0.5">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(payment.createAt)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3 p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="text-xs text-slate-500 mb-0.5">
                            Mã đơn hàng
                          </p>
                          <p className="text-xs font-medium text-slate-800">
                            {payment.content || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-0.5">
                            Loại thanh toán
                          </p>
                          <div className="flex items-center gap-1">
                            <CreditCard className="w-3 h-3 text-blue-600" />
                            <p className="text-xs font-medium text-slate-800">
                              {getPaymentTypeLabel(payment.paymentType)}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-0.5">
                            Phí giao dịch
                          </p>
                          <p className="text-xs font-medium text-slate-800">
                            {formatCurrency(payment.fee)}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        {payment.qrCode && payment.paymentType === "MA_QR" && (
                          <>
                            <button
                              onClick={() => handleViewQRCode(payment)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                              Xem QR Code
                            </button>
                            <button
                              onClick={() =>
                                handleDownloadQR(
                                  payment.qrCode,
                                  payment.paymentCode
                                )
                              }
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-xs font-medium"
                            >
                              <Download className="w-3.5 h-3.5" />
                              Tải QR
                            </button>
                          </>
                        )}

                        {payment.status === "CHO_THANH_TOAN" && (
                          <button
                            onClick={() => showConfirmDialog(payment)}
                            disabled={isProcessing}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ml-auto text-xs ${
                              isProcessing
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                            }`}
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            {isProcessing
                              ? "Đang xử lý..."
                              : "Xác nhận thanh toán"}
                          </button>
                        )}
                      </div>

                      {/* Payment Result */}
                      {paymentResult && (
                        <div
                          className={`mt-3 p-2.5 rounded-lg border ${
                            paymentResult.success
                              ? "bg-blue-50 border-blue-200"
                              : "bg-slate-50 border-slate-200"
                          }`}
                        >
                          <p
                            className={`text-xs font-medium ${
                              paymentResult.success
                                ? "text-blue-700"
                                : "text-slate-600"
                            }`}
                          >
                            {paymentResult.message}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {selectedQRCode && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={handleCloseQRModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Compact Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-800">
                QR Code Thanh Toán
              </h3>
              <button
                onClick={handleCloseQRModal}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Large QR Code - Takes most space */}
            <div className="p-5">
              <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-5 flex items-center justify-center">
                <img
                  src={selectedQRCode.qrCode}
                  alt="QR Code"
                  className="w-80 h-80 border-4 border-blue-400 rounded-xl shadow-lg"
                />
              </div>
              <p className="text-center text-xs text-slate-500 mt-2">
                Quét mã QR để thanh toán
              </p>
            </div>

            {/* Compact Info */}
            <div className="px-5 pb-4">
              <div className="bg-slate-50 rounded-lg p-3 space-y-2 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Mã đơn hàng</span>
                  <span className="text-xs font-semibold text-blue-600">
                    {selectedQRCode.content}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Số tiền</span>
                  <span className="text-sm font-bold text-slate-800">
                    {formatCurrency(selectedQRCode.amount)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Trạng thái</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      getStatusInfo(selectedQRCode.status).color
                    }`}
                  >
                    {getStatusInfo(selectedQRCode.status).label}
                  </span>
                </div>
              </div>
            </div>

            {/* Compact Footer */}
            <div className="flex gap-2 px-5 pb-4">
              <button
                onClick={() =>
                  handleDownloadQR(
                    selectedQRCode.qrCode,
                    selectedQRCode.paymentCode
                  )
                }
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                <Download className="w-4 h-4" />
                Tải xuống
              </button>
              <button
                onClick={handleCloseQRModal}
                className="px-4 py-2 border-2 border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog.isOpen && confirmDialog.payment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            {/* Dialog Header */}
            <div className="flex items-center gap-3 p-5 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-slate-50">
              <div className="bg-blue-600 p-2.5 rounded-lg shadow-lg">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-slate-800">
                  Xác nhận thanh toán
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Vui lòng kiểm tra kỹ thông tin trước khi xác nhận
                </p>
              </div>
            </div>

            {/* Dialog Body */}
            <div className="p-5">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-blue-800 font-medium">
                  ⚠️ Bạn có chắc chắn muốn xác nhận thanh toán cho giao dịch này
                  không?
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 space-y-3 border border-slate-200">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 bg-white rounded-lg p-3 border border-slate-200">
                    <div className="flex items-center gap-1.5 mb-1">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-medium text-slate-600">
                        Mã giao dịch
                      </span>
                    </div>
                    <span className="text-sm font-bold text-blue-600">
                      {confirmDialog.payment.paymentCode}
                    </span>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-slate-200">
                    <div className="flex items-center gap-1.5 mb-1">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-medium text-slate-600">
                        Mã đơn hàng
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-slate-800">
                      {confirmDialog.payment.content}
                    </span>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-slate-200">
                    <div className="flex items-center gap-1.5 mb-1">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-medium text-slate-600">
                        Loại thanh toán
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-slate-800">
                      {getPaymentTypeLabel(confirmDialog.payment.paymentType)}
                    </span>
                  </div>

                  <div className="col-span-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-3 border-2 border-blue-400 shadow-lg">
                    <div className="flex items-center gap-1.5 mb-1">
                      <DollarSign className="w-4 h-4 text-white" />
                      <span className="text-xs font-medium text-blue-100">
                        Số tiền thanh toán
                      </span>
                    </div>
                    <span className="text-lg font-bold text-white">
                      {formatCurrency(confirmDialog.payment.amount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dialog Footer */}
            <div className="flex gap-2 p-5 border-t border-slate-200 bg-slate-50">
              <button
                onClick={closeConfirmDialog}
                className="flex-1 px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-white transition-colors font-medium text-sm"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmedPayment}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-lg shadow-blue-200"
              >
                <CheckCircle className="w-4 h-4" />
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
