// src/Components/Packing/RemoveShipment.jsx
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Trash2, Loader2, AlertTriangle, X } from "lucide-react";
import packingsService from "../../Services/Warehouse/packingsService";

const RemoveShipment = ({
  packingCode,
  shipmentCodes = [],
  onSuccess,
  className = "",
}) => {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRemove = async () => {
    setShowConfirm(false);
    setLoading(true);

    try {
      await toast.promise(
        packingsService.removeShipments(packingCode, shipmentCodes),
        {
          loading: "Đang xóa shipment...",
          success: "Đã xóa shipment khỏi packing!",
          error: "Xóa shipment thất bại!",
        }
      );

      onSuccess && onSuccess();
    } catch (err) {
      let msg = "Lỗi không xác định";

      if (err?.response) {
        msg = `HTTP ${err.response.status}: ${
          err.response.statusText || "Lỗi máy chủ"
        }`;
      } else if (err?.request) {
        msg = "Lỗi mạng - Không nhận được phản hồi từ server";
      } else if (err?.message) {
        msg = err.message;
      }

      toast.error(`Xóa thất bại: ${msg}`, { duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const disabled = loading || !shipmentCodes?.length;

  // Confirm Modal Component (Inline)
  const ConfirmModal = () => {
    if (!showConfirm) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={() => setShowConfirm(false)}
        />

        {/* Modal */}
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all">
            {/* Close button */}
            <button
              onClick={() => setShowConfirm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>

            {/* Content */}
            <div className="mt-4 text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Xác nhận xóa shipment
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Bạn có chắc muốn xóa <strong>{shipmentCodes.length}</strong>{" "}
                shipment khỏi packing{" "}
                <strong className="text-blue-600">{packingCode}</strong>?
                <br />
                <span className="text-red-600 font-medium">
                  Hành động này không thể hoàn tác.
                </span>
              </p>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleRemove}
                className="flex-1 px-4 py-2 rounded-lg text-white font-medium bg-red-600 hover:bg-red-700 transition"
              >
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <button
        onClick={() => {
          if (!packingCode) {
            toast.error("Thiếu mã packing.");
            return;
          }
          if (!Array.isArray(shipmentCodes) || shipmentCodes.length === 0) {
            toast.error("Hãy chọn ít nhất 1 shipment để xóa.");
            return;
          }
          setShowConfirm(true);
        }}
        disabled={disabled}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
          ${
            disabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-red-500 text-white hover:bg-red-600 active:scale-95 shadow-sm hover:shadow"
          } ${className}`}
        title={
          disabled
            ? "Chọn ít nhất 1 shipment để xóa"
            : "Xóa shipment khỏi packing"
        }
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Đang xử lý...
          </>
        ) : (
          <>
            <Trash2 className="w-4 h-4" />
            Xóa shipment
          </>
        )}
      </button>

      <ConfirmModal />
    </>
  );
};

export default RemoveShipment;
