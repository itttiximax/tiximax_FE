// src/Components/StaffPurchase/CancelPurchase.jsx
import React, { useState } from "react";
import { X, AlertTriangle, Loader2, CheckCircle2 } from "lucide-react";
import createPurchaseService from "../../Services/StaffPurchase/createPurchaseService";

const CancelPurchase = ({
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

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setLoading(false);
      setError(null);
      setSuccess(false);
    }
  }, [isOpen]);

  // ✅ FIX: Helper function to get token
  const getToken = () => {
    // Try different possible token key names
    const possibleKeys = [
      "accessToken",
      "token",
      "authToken",
      "auth_token",
      "jwt",
      "jwtToken",
    ];

    for (const key of possibleKeys) {
      const token = localStorage.getItem(key);
      if (token) {
        console.log(`✅ Token found with key: ${key}`);
        return token;
      }
    }

    // Check sessionStorage as well
    for (const key of possibleKeys) {
      const token = sessionStorage.getItem(key);
      if (token) {
        console.log(`✅ Token found in sessionStorage with key: ${key}`);
        return token;
      }
    }

    // Debug: Show all localStorage keys
    console.log(
      "❌ Token not found. Available localStorage keys:",
      Object.keys(localStorage)
    );
    console.log("Available sessionStorage keys:", Object.keys(sessionStorage));

    return null;
  };

  const handleCancel = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ FIX: Use getToken helper
      const token = getToken();

      if (!token) {
        throw new Error(
          "Không tìm thấy token xác thực. Vui lòng đăng nhập lại."
        );
      }

      console.log("Cancelling order link:", { orderId, linkId });

      await createPurchaseService.cancelOrderLink(orderId, linkId, token);

      setSuccess(true);

      // Auto close after 1.5s and trigger success callback
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Error cancelling order link:", err);
      setError(err.message || "Không thể hủy đơn hàng. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Xác nhận hủy đơn
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            // Success State
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Hủy đơn thành công!
              </h3>
              <p className="text-sm text-gray-600">
                Đơn hàng đã được hủy. Đang cập nhật danh sách...
              </p>
            </div>
          ) : (
            <>
              {/* Warning Message */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-800">
                  <strong>Cảnh báo:</strong> Bạn đang thực hiện hủy đơn hàng.
                  Hành động này không thể hoàn tác!
                </p>
              </div>

              {/* Order Info */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Mã đơn hàng:</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {orderCode}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Order ID:</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {orderId}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Link ID:</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {linkId}
                  </span>
                </div>

                {linkInfo && (
                  <>
                    {linkInfo.productName && (
                      <div className="flex justify-between items-start py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Sản phẩm:</span>
                        <span className="text-sm font-medium text-gray-900 text-right max-w-[60%]">
                          {linkInfo.productName}
                        </span>
                      </div>
                    )}

                    {linkInfo.trackingCode && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">
                          Mã tracking:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {linkInfo.trackingCode}
                        </span>
                      </div>
                    )}

                    {linkInfo.status && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-600">
                          Trạng thái:
                        </span>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            linkInfo.status === "CHO_MUA"
                              ? "bg-yellow-100 text-yellow-800"
                              : linkInfo.status === "DANG_MUA"
                              ? "bg-blue-100 text-blue-800"
                              : linkInfo.status === "DA_MUA"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {linkInfo.status}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                  {error.includes("token") && (
                    <button
                      onClick={() => window.location.reload()}
                      className="text-xs text-red-600 underline mt-2 hover:text-red-800"
                    >
                      Tải lại trang và đăng nhập lại
                    </button>
                  )}
                </div>
              )}

              {/* Confirmation Question */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700 text-center font-medium">
                  Bạn có chắc chắn muốn hủy đơn hàng này không?
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!success && (
          <div className="flex gap-3 p-5 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Quay lại
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang hủy...
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  Xác nhận hủy
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CancelPurchase;
