// src/Components/StaffPurchase/PinOrder.jsx
import React, { useEffect, useState } from "react";
import { X, Pin, PinOff, Loader2, CheckCircle2 } from "lucide-react";
import createPurchaseService from "../../Services/StaffPurchase/createPurchaseService";

const PinOrder = ({
  isOpen,
  onClose,
  orderId,
  orderCode,
  pinned = false,
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

  if (!isOpen) return null;

  const desiredPin = !pinned;
  const actionText = desiredPin ? "Ghim đơn" : "Bỏ ghim";

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("jwt");
      if (!token) {
        throw new Error(
          "Không tìm thấy token xác thực. Vui lòng đăng nhập lại."
        );
      }

      await createPurchaseService.pinOrder(orderId, desiredPin);

      setSuccess(true);
      setTimeout(() => {
        onSuccess?.(orderId, desiredPin);
        onClose();
      }, 1200);
    } catch (err) {
      console.error("Error pin/unpin order:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Không thể cập nhật trạng thái ghim."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 ${
                desiredPin ? "bg-amber-100" : "bg-gray-100"
              } rounded-lg flex items-center justify-center`}
            >
              {desiredPin ? (
                <Pin className="w-4 h-4 text-amber-600" />
              ) : (
                <PinOff className="w-4 h-4 text-gray-600" />
              )}
            </div>
            <h2 className="text-base font-semibold text-gray-900">
              {actionText}
            </h2>
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
                {desiredPin ? "Đã ghim đơn hàng!" : "Đã bỏ ghim đơn hàng!"}
              </h3>
              <p className="text-xs text-gray-600">Đang cập nhật...</p>
            </div>
          ) : (
            <>
              {/* Info Message */}
              <div
                className={`${
                  desiredPin
                    ? "bg-amber-50 border-amber-200"
                    : "bg-gray-50 border-gray-200"
                } border rounded-md p-3 mb-3`}
              >
                <p
                  className={`${
                    desiredPin ? "text-amber-800" : "text-gray-700"
                  } text-xs`}
                >
                  {desiredPin
                    ? "Đơn hàng sẽ được ưu tiên hiển thị ở đầu danh sách."
                    : "Đơn hàng sẽ không còn được ưu tiên."}
                </p>
              </div>

              {/* Order Info */}
              {/* <div className="space-y-2 mb-4">
                {orderCode && (
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                    <span className="text-xs text-gray-600">Mã đơn:</span>
                    <span className="text-xs font-semibold text-gray-900">
                      {orderCode}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-xs text-gray-600">Order ID:</span>
                  <span className="text-xs font-semibold text-gray-900">
                    {orderId}
                  </span>
                </div>
              </div> */}

              {/* Error */}
              {error && (
                <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-xs text-red-800">{error}</p>
                </div>
              )}

              {/* Confirmation */}
              <div className="bg-gray-50 rounded-md p-3">
                <p className="text-xs text-gray-700 text-center font-medium">
                  Bạn có chắc muốn {desiredPin ? "ghim" : "bỏ ghim"} đơn này?
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
              onClick={handleConfirm}
              disabled={loading}
              className={`flex-1 px-3 py-2 text-white rounded-md text-xs font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 ${
                desiredPin
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-gray-700 hover:bg-gray-800"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  {desiredPin ? (
                    <Pin className="w-3.5 h-3.5" />
                  ) : (
                    <PinOff className="w-3.5 h-3.5" />
                  )}
                  Xác nhận
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PinOrder;
