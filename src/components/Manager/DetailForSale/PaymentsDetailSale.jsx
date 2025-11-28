import React from "react";
import { X, CreditCard } from "lucide-react";

const PaymentsDetailSale = ({ payments, onClose }) => {
  const getPaymentStatusDisplay = (status) => {
    const statusMap = {
      DA_XAC_NHAN: {
        label: "Đã xác nhận",
        className: "bg-green-100 text-green-800",
      },
      CHO_THANH_TOAN: {
        label: "Chờ thanh toán",
        className: "bg-yellow-100 text-yellow-800",
      },
      CHO_THANH_TOAN_SHIP: {
        label: "Chờ thanh toán ship",
        className: "bg-blue-100 text-blue-800",
      },
      DA_THANH_TOAN_SHIP: {
        label: "Đã thanh toán ship",
        className: "bg-cyan-100 text-cyan-800",
      },
      DA_THANH_TOAN: {
        label: "Đã thanh toán",
        className: "bg-green-100 text-green-800",
      },
      THAT_BAI: { label: "Thất bại", className: "bg-red-100 text-red-800" },
      DA_HUY: { label: "Đã hủy", className: "bg-gray-100 text-gray-800" },
      DA_HOAN_TIEN: {
        label: "Đã hoàn tiền",
        className: "bg-purple-100 text-purple-800",
      },
    };
    return (
      statusMap[status] || {
        label: status,
        className: "bg-gray-100 text-gray-800",
      }
    );
  };

  const getPaymentTypeText = (type) => {
    const typeMap = {
      MA_QR: "Mã QR",
      TIEN_MAT: "Tiền mặt",
      CHUYEN_KHOAN: "Chuyển khoản",
      THE: "Thẻ",
    };
    return typeMap[type] || type;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b bg-green-50">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold">Chi tiết thanh toán</h3>
            <span className="text-sm text-gray-600">
              ({payments.length} giao dịch)
            </span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-green-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
          {payments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Chưa có thanh toán nào
            </div>
          ) : (
            payments.map((payment) => {
              const statusInfo = getPaymentStatusDisplay(payment.status);
              return (
                <div
                  key={payment.paymentId}
                  className="mb-3 border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold text-green-600">
                        {payment.paymentCode}
                      </div>
                      {payment.actionAt && (
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(payment.actionAt).toLocaleString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-green-600">
                        {payment.amount?.toLocaleString("vi-VN")} ₫
                      </div>
                      {payment.collectedAmount &&
                        payment.collectedAmount !== payment.amount && (
                          <div className="text-xs text-gray-600">
                            Thu:{" "}
                            {payment.collectedAmount?.toLocaleString("vi-VN")}
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Phương thức: </span>
                      <span className="font-medium">
                        {getPaymentTypeText(payment.paymentType)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-600">Trạng thái: </span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${statusInfo.className}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                    {payment.depositPercent && (
                      <div>
                        <span className="text-gray-600">Đặt cọc: </span>
                        <span className="font-medium">
                          {payment.depositPercent}%
                        </span>
                      </div>
                    )}
                    {payment.content && (
                      <div>
                        <span className="text-gray-600">Nội dung: </span>
                        <span className="font-medium">{payment.content}</span>
                      </div>
                    )}
                  </div>

                  {payment.qrCode && (
                    <div className="mt-3 flex justify-center">
                      <img
                        src={payment.qrCode}
                        alt="QR Code"
                        className="w-48 h-48 object-contain border rounded"
                      />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentsDetailSale;
