import React, { useState } from "react";
import managerOrderServic from "../../Services/Manager/managerOrderService";

function CancelOrderLink({ isOpen, onClose, link, orderId, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCancel = async () => {
    if (!link || !link.linkId) {
      setError("Không tìm thấy thông tin link");
      return;
    }

    if (!orderId) {
      setError("Không tìm thấy thông tin đơn hàng");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Gọi API: orderId + linkId (không còn reason)
      await managerOrderServic.cancelOrderLink(orderId, link.linkId);

      if (onSuccess) {
        onSuccess();
      }
      handleClose();
    } catch (error) {
      console.error("Error canceling order link:", error);
      setError(error.message || "Không thể hủy đơn hàng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      ></div>

      {/* Dialog */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">
                Xác nhận hủy link
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                disabled={loading}
              >
                ×
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Link Info */}
            {link && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Thông tin sản phẩm
                </h3>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-700">
                    <span className="font-medium">Tên:</span>{" "}
                    {link.productName || "-"}
                  </p>
                  {link.trackingCode && (
                    <p className="text-gray-700">
                      <span className="font-medium">Tracking:</span>{" "}
                      {link.trackingCode}
                    </p>
                  )}
                  {link.quantity && (
                    <p className="text-gray-700">
                      <span className="font-medium">Số lượng:</span>{" "}
                      {link.quantity}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Warning */}
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ Hành động này không thể hoàn tác. Bạn có chắc chắn muốn hủy
                link đặt hàng này?
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50"
              disabled={loading}
            >
              Đóng
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Xác nhận hủy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CancelOrderLink;
