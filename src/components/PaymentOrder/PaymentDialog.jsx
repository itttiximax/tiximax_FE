import React from "react";
import { X, Download } from "lucide-react";

const PaymentDialog = ({
  open,
  payment,
  onClose,
  formatCurrency,
  formatDate,
}) => {
  if (!open || !payment) return null;

  // Hàm download QR code
  const handleDownloadQR = async () => {
    try {
      const response = await fetch(payment.qrCode);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `QR_${payment.paymentCode}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Lỗi khi tải QR code:", error);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      PENDING: {
        label: "Chờ thanh toán",
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
      COMPLETED: {
        label: "Đã thanh toán",
        className: "bg-green-100 text-green-800 border-green-200",
      },
      CANCELLED: {
        label: "Đã hủy",
        className: "bg-red-100 text-red-800 border-red-200",
      },
    };
    return (
      configs[status] || {
        label: status,
        className: "bg-gray-100 text-gray-800 border-gray-200",
      }
    );
  };

  const statusConfig = getStatusConfig(payment.status);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Thông tin thanh toán
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-4">
          {/* QR Code - TO NHẤT */}
          <div className="bg-white rounded-xl p-8 border-2 border-gray-200">
            <div className="flex flex-col items-center">
              <div className="bg-white rounded-xl shadow-lg mb-4 w-full h-auto">
                <img
                  src={payment.qrCode}
                  alt="Payment QR Code"
                  className="w-full h-auto object-contain"
                />
              </div>
              <p className="text-xs text-gray-600 mb-3">
                Quét mã QR để thanh toán
              </p>
              <button
                onClick={handleDownloadQR}
                className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                Tải QR Code
              </button>
            </div>
          </div>

          {/* Mã thanh toán */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600 mb-1">Mã thanh toán</p>
            <p className="text-xl font-bold text-blue-900 tracking-wide select-all">
              {payment.paymentCode}
            </p>
          </div>

          {/* Thông tin chính - 2 cột */}
          <div className="grid grid-cols-2 gap-3">
            {/* Số tiền */}
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Số tiền</p>
              <p className="text-lg font-bold text-gray-900">
                {formatCurrency(payment.amount)}
              </p>
            </div>

            {/* Trạng thái */}
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Trạng thái</p>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${statusConfig.className}`}
              >
                {statusConfig.label}
              </span>
            </div>
          </div>

          {/* Chi tiết khác */}
          <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
            <div className="px-3 py-2 flex justify-between items-center">
              <span className="text-xs text-gray-600">Loại thanh toán</span>
              <span className="text-xs font-semibold text-gray-900">
                {payment.paymentType === "SHIPPING"
                  ? "Vận chuyển"
                  : payment.paymentType}
              </span>
            </div>

            {payment.content && (
              <div className="px-3 py-2">
                <p className="text-xs text-gray-600 mb-1">Nội dung</p>
                <p className="text-xs text-gray-900 font-medium">
                  {payment.content}
                </p>
              </div>
            )}

            <div className="px-3 py-2 flex justify-between items-center">
              <span className="text-xs text-gray-600">Thời gian tạo</span>
              <span className="text-xs font-medium text-gray-900">
                {formatDate(payment.actionAt)}
              </span>
            </div>

            {payment.collectedAmount > 0 && (
              <div className="px-3 py-2 bg-red-50 flex justify-between items-center">
                <span className="text-xs text-red-700 font-medium">
                  Số tiền thu
                </span>
                <span className="text-xs font-bold text-black-800">
                  {formatCurrency(payment.collectedAmount)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDialog;
