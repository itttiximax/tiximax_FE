// src/Components/StaffPurchase/AuctionPayment.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Gavel,
  QrCode,
  Calendar,
  RefreshCw,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  FileText,
  User,
  X,
} from "lucide-react";
import createOrderPaymentService from "../../Services/Payment/createOrderPaymentService";
import confirmPaymentService from "../../Services/Payment/confirmPaymentService";
import toast from "react-hot-toast";

const AuctionPayment = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedQRCode, setSelectedQRCode] = useState(null);
  const [processingPayments, setProcessingPayments] = useState({});
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    payment: null,
  });

  // Fetch auction payments
  const fetchAuctionPayments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await createOrderPaymentService.getAuctionPayments();
      setPayments(Array.isArray(response) ? response : []);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể tải danh sách thanh toán";
      toast.error(errorMessage);
      setPayments([]);
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
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
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

  // Get status info
  const getStatusInfo = (status) => {
    const statusMap = {
      CHO_THANH_TOAN: {
        color: "bg-amber-50 text-amber-700 border-amber-200",
        label: "Chờ thanh toán",
        icon: Clock,
      },
      DA_THANH_TOAN: {
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        label: "Đã thanh toán",
        icon: CheckCircle,
      },
      HUY: {
        color: "bg-red-50 text-red-700 border-red-200",
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
    } catch {
      toast.error("Không thể tải QR code");
    }
  };

  // Handle payment confirmation
  const handleConfirmPayment = async (payment) => {
    const paymentCode = payment.paymentCode;
    setProcessingPayments((prev) => ({ ...prev, [payment.paymentId]: true }));

    try {
      const token = localStorage.getItem("jwt");
      const response = await confirmPaymentService.confirmPayment(
        paymentCode,
        token
      );

      if (response.success) {
        toast.success(response.message || "Xác nhận thanh toán thành công!");
        await fetchAuctionPayments();
      } else {
        toast.error(response.message || "Xác nhận thanh toán thất bại!");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Lỗi xác nhận thanh toán";
      toast.error(errorMsg);
    } finally {
      setProcessingPayments((prev) => ({
        ...prev,
        [payment.paymentId]: false,
      }));
      setConfirmDialog({ isOpen: false, payment: null });
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
    <div className="min-h-screen  p-4 md:p-6">
      <div className="mx-auto space-y-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-5">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2.5 rounded-lg">
                <Gavel className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base md:text-lg font-bold text-slate-800">
                  Quản lý thanh toán đấu giá
                </h1>
              </div>
            </div>
            <button
              onClick={fetchAuctionPayments}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 text-xs md:text-sm font-medium disabled:opacity-70"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              <span>Làm mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Search Box */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm mã thanh toán, nội dung, khách hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:border-black focus:ring-0 bg-white"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg bg-white focus:border-black focus:ring-0"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="CHO_THANH_TOAN">Chờ thanh toán</option>
              <option value="DA_THANH_TOAN">Đã thanh toán</option>
              <option value="HUY">Đã hủy</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-3 md:p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-blue-600 font-semibold">
                  Tổng giao dịch
                </p>
                <p className="text-lg md:text-xl font-bold text-slate-800">
                  {payments.length}
                </p>
              </div>
              <FileText className="w-6 h-6 text-blue-500" />
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl border border-amber-200 p-3 md:p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-amber-600 font-semibold">
                  Chờ thanh toán
                </p>
                <p className="text-lg md:text-xl font-bold text-slate-800">
                  {payments.filter((p) => p.status === "CHO_THANH_TOAN").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-3 md:p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-emerald-600 font-semibold">
                  Đã hoàn tất
                </p>
                <p className="text-lg md:text-xl font-bold text-slate-800">
                  {payments.filter((p) => p.status === "DA_THANH_TOAN").length}
                </p>
              </div>
              <CheckCircle className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-xl border border-slate-200 py-8 text-center">
            <RefreshCw className="w-6 h-6 text-blue-600 animate-spin mx-auto mb-2" />
            <p className="text-xs md:text-sm text-slate-600">
              Đang tải danh sách thanh toán...
            </p>
          </div>
        )}

        {/* Payments List */}
        {!loading && (
          <div className="space-y-2">
            {filteredPayments.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-600">
                  Không tìm thấy giao dịch phù hợp
                </p>
              </div>
            ) : (
              filteredPayments.map((payment) => {
                const statusInfo = getStatusInfo(payment.status);
                const StatusIcon = statusInfo.icon;
                const isProcessing = processingPayments[payment.paymentId];

                return (
                  <div
                    key={payment.paymentId}
                    className="bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow"
                  >
                    <div className="p-3 md:p-4">
                      {/* Header row */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className="text-sm md:text-base font-semibold text-slate-800">
                              {payment.paymentCode}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] md:text-xs font-medium border ${statusInfo.color}`}
                            >
                              <StatusIcon className="w-3.5 h-3.5" />
                              {statusInfo.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xl font-semibold text-black-500">
                            <User className="w-5 h-5" />
                            <span className="truncate">
                              {payment.customerName || "N/A"}
                            </span>
                            <p className="mx-1 text-gray-600">|Mã KH:</p>
                            <span className="truncate">
                              {payment.customerCode || "N/A"}
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm md:text-base font-bold text-blue-600">
                            {formatCurrency(payment.amount)}
                          </div>
                          <div className="flex items-center justify-end gap-1 text-xl text-black-500 mt-1">
                            <span>{formatDate(payment.actionAt)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Detail row */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3 p-2.5 bg-gray-100 rounded-lg text-xs md:text-sm">
                        <div className="min-w-0">
                          <p className="text-2sx text-black-500 mb-0.5">
                            Đơn hàng / Nội dung
                          </p>
                          <p className="font-semibold text-slate-800 truncate">
                            {payment.content || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-2sx text-black-500 mb-0.5">
                            Loại thanh toán
                          </p>
                          <p className="font-semibold text-slate-800">
                            {getPaymentTypeLabel(payment.paymentType)}
                          </p>
                        </div>
                        <div>
                          <p className="text-2sx text-black-500 mb-0.5">
                            Số tiền thu
                          </p>
                          <p className="font-semibold text-slate-800">
                            {formatCurrency(payment.collectedAmount)}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 text-xs md:text-sm">
                        {payment.qrCode && payment.paymentType === "MA_QR" && (
                          <>
                            <button
                              onClick={() => setSelectedQRCode(payment)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                              QR
                            </button>
                            <button
                              onClick={() =>
                                handleDownloadQR(
                                  payment.qrCode,
                                  payment.paymentCode
                                )
                              }
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 font-medium"
                            >
                              <Download className="w-3.5 h-3.5" />
                              Tải QR
                            </button>
                          </>
                        )}

                        <div className="ml-auto flex gap-2">
                          {payment.status === "CHO_THANH_TOAN" && (
                            <button
                              onClick={() =>
                                setConfirmDialog({ isOpen: true, payment })
                              }
                              disabled={isProcessing}
                              className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-medium ${
                                isProcessing
                                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                  : "bg-emerald-500 text-white hover:bg-emerald-600"
                              }`}
                            >
                              {isProcessing ? "Đang xử lý..." : "Xác nhận"}
                            </button>
                          )}
                        </div>
                      </div>
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
          onClick={() => setSelectedQRCode(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <h3 className="text-base md:text-lg font-semibold text-black-800">
                  QR Code thanh toán
                </h3>
              </div>
              <button
                onClick={() => setSelectedQRCode(null)}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* QR Image */}
            <div className="p-6">
              <div className="flex items-center justify-center">
                <img
                  src={selectedQRCode.qrCode}
                  alt="QR Code"
                  className="max-h-[500px] w-auto"
                />
              </div>
              <p className="text-center text-xl md:text-2xl text-black-500 mt-4">
                Quét mã QR để thực hiện thanh toán
              </p>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={() =>
                  handleDownloadQR(
                    selectedQRCode.qrCode,
                    selectedQRCode.paymentCode
                  )
                }
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-xs md:text-sm"
              >
                <Download className="w-4 h-4" />
                Tải xuống
              </button>
              <button
                onClick={() => setSelectedQRCode(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-semibold text-xs md:text-sm"
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
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 p-5 border-b border-blue-200 bg-gradient-to-r from-blue-500 to-blue-400">
              <div className="bg-white/15 p-2.5 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-white">
                  Xác nhận thanh toán
                </h3>
                <p className="text-xs text-blue-100">
                  Kiểm tra kỹ trước khi xác nhận hoàn tất giao dịch
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs md:text-sm text-slate-700 font-medium">
                  Bạn có chắc chắn muốn xác nhận thanh toán cho giao dịch này
                  không? Sau khi xác nhận, trạng thái sẽ được cập nhật thành{" "}
                  <span className="font-semibold text-emerald-600">
                    Đã thanh toán
                  </span>
                  .
                </p>
              </div>

              <div className="space-y-3">
                <div className="bg-blue-600 rounded-xl p-4">
                  <p className="text-xs text-blue-100 mb-1">Mã giao dịch</p>
                  <p className="text-lg md:text-xl font-bold text-white">
                    {confirmDialog.payment.paymentCode}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm">
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <p className="text-[11px] text-slate-500 mb-1">Đơn hàng</p>
                    <p className="font-semibold text-slate-800">
                      {confirmDialog.payment.content}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <p className="text-[11px] text-slate-500 mb-1">
                      Loại thanh toán
                    </p>
                    <p className="font-semibold text-slate-800">
                      {getPaymentTypeLabel(confirmDialog.payment.paymentType)}
                    </p>
                  </div>

                  <div className="sm:col-span-2 bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                    <p className="text-[11px] text-emerald-700 mb-1">
                      Số tiền thanh toán
                    </p>
                    <p className="text-lg md:text-2xl font-bold text-emerald-600">
                      {formatCurrency(confirmDialog.payment.amount)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 p-5 border-t border-slate-200">
              <button
                onClick={() =>
                  setConfirmDialog({ isOpen: false, payment: null })
                }
                className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-semibold text-sm"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => handleConfirmPayment(confirmDialog.payment)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-semibold text-sm"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionPayment;
