// src/Components/StaffPurchase/PurchaseLater.jsx
import React, { useState, useEffect } from "react";
import { X, Clock, Loader2, CheckCircle2 } from "lucide-react";
import createPurchaseService from "../../Services/StaffPurchase/createPurchaseService";

const PurchaseLater = ({
  isOpen,
  onClose,
  orderId,
  linkId,
  orderCode,
  linkInfo,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(false);
      setError(null);
      setSuccess(false);
    }
  }, [isOpen]);

  const handleMarkBuyLater = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("jwt");
      if (!token) {
        throw new Error(
          "Không tìm thấy token xác thực. Vui lòng đăng nhập lại."
        );
      }

      // Gọi service (truyền thêm token nếu service có nhận)
      await createPurchaseService.markBuyLaterForLink(orderId, linkId, token);

      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err) {
      let msg = "Không thể chuyển sang 'Mua sau'.";

      if (err.response) {
        const { data } = err.response;
        if (data?.message) msg = data.message;
        else if (data?.error) msg = data.error;
        // ví dụ: "Chỉ có thể chuyển sang MUA SAU nếu trạng thái hiện tại là CHỜ MUA!"
        else if (typeof data === "string") msg = data;
      } else if (err.message) {
        msg = err.message;
      }

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const statusBadgeClass = (status) => {
    const map = {
      CHO_MUA: "bg-yellow-100 text-yellow-800",
      DANG_MUA: "bg-blue-100 text-blue-800",
      DA_MUA: "bg-emerald-100 text-emerald-800",
      MUA_SAU: "bg-purple-100 text-purple-800",
      DA_HUY: "bg-red-100 text-red-800",
    };
    return map[status] || "bg-gray-100 text-gray-800";
  };

  const statusBadgeText = (status) => {
    switch (status) {
      case "CHO_MUA":
        return "Chờ mua";
      case "DANG_MUA":
        return "Đang mua";
      case "DA_MUA":
        return "Đã mua";
      case "MUA_SAU":
        return "Mua sau";
      case "DA_HUY":
        return "Đã hủy";
      default:
        return status;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-indigo-600" />
            </div>
            <h2 className="text-base font-semibold text-gray-900">Mua sau</h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {success ? (
            <div className="text-center py-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Đã chuyển sang "Mua sau"!
              </h3>
              <p className="text-xs text-gray-600">Đang cập nhật...</p>
            </div>
          ) : (
            <>
              {/* Note */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-md p-3 mb-3">
                <p className="text-xs text-indigo-800">
                  Link sẽ không được xử lý trong đợt mua hiện tại cho đến khi
                  bạn kích hoạt lại.
                </p>
              </div>

              {/* Order Info */}
              <div className="space-y-2 mb-4">
                {orderCode && (
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                    <span className="text-xs text-gray-600">Mã đơn:</span>
                    <span className="text-xs font-semibold text-gray-900">
                      {orderCode}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                  <span className="text-xs text-gray-600">Order ID:</span>
                  <span className="text-xs font-semibold text-gray-900">
                    {orderId}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                  <span className="text-xs text-gray-600">Link ID:</span>
                  <span className="text-xs font-semibold text-gray-900">
                    {linkId}
                  </span>
                </div>

                {linkInfo && (
                  <>
                    {linkInfo.productName && (
                      <div className="flex justify-between items-start py-1.5 border-b border-gray-200">
                        <span className="text-xs text-gray-600">Sản phẩm:</span>
                        <span className="text-xs font-medium text-gray-900 text-right max-w-[60%]">
                          {linkInfo.productName}
                        </span>
                      </div>
                    )}

                    {linkInfo.trackingCode && (
                      <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                        <span className="text-xs text-gray-600">Tracking:</span>
                        <span className="text-xs font-medium text-gray-900">
                          {linkInfo.trackingCode}
                        </span>
                      </div>
                    )}

                    {linkInfo.status && (
                      <div className="flex justify-between items-center py-1.5">
                        <span className="text-xs text-gray-600">
                          Trạng thái:
                        </span>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusBadgeClass(
                            linkInfo.status
                          )}`}
                        >
                          {statusBadgeText(linkInfo.status)}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-xs text-red-800">{error}</p>
                </div>
              )}

              {/* Confirm */}
              <div className="bg-gray-50 rounded-md p-3">
                <p className="text-xs text-gray-700 text-center font-medium">
                  Xác nhận chuyển link này sang "Mua sau"?
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!success && (
          <div className="flex gap-2 px-4 py-3 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-xs font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              onClick={handleMarkBuyLater}
              disabled={loading}
              className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-md text-xs font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>Xác nhận</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseLater;
