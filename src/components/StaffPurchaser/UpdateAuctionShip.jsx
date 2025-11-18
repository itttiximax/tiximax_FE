import React, { useState } from "react";
import orderlinkService from "../../Services/StaffPurchase/orderlinkService";
import {
  X,
  Package,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Loader2,
  Barcode,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";

const UpdateAuctionShip = ({ isOpen, onClose, purchase, onSaveSuccess }) => {
  const [shipmentCode, setShipmentCode] = useState("");
  const [shipFee, setShipFee] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !purchase) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!shipmentCode.trim()) {
      setError("Vui lòng nhập mã vận đơn");
      return;
    }

    if (!shipFee || Number(shipFee) < 0) {
      setError("Vui lòng nhập phí ship hợp lệ");
      return;
    }

    setLoading(true);

    try {
      await orderlinkService.updateShipmentCodeAndFee(
        purchase.purchaseId,
        shipmentCode.trim(),
        Number(shipFee)
      );

      toast.success("Cập nhật thành công!", {
        position: "top-right",
      });

      setShipmentCode("");
      setShipFee("");
      setError("");

      onSaveSuccess?.();
      onClose();
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Cập nhật thất bại";
      setError(errorMessage);
      toast.error(errorMessage, { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setShipmentCode("");
      setShipFee("");
      setError("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Cập nhật vận chuyển
              </h2>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Purchase Info Card */}
          <div className="rounded-xl border border-gray-500 bg-gray-50 p-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Barcode className="h-4 w-4 text-blue-600" />
              Thông tin đơn hàng
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-2sxs text-black-500 mb-1">Mã đơn hàng</p>
                <p className="font-semibold text-gray-900 font-mono">
                  {purchase.orderCode}
                </p>
              </div>
              <div>
                <p className="text-2xs text-black-500  mb-1">Trạng thái</p>
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 border border-blue-100">
                  Đấu giá thành công
                </span>
              </div>
              <div className="col-span-2">
                <p className="text-2xs text-black-500 mb-1 flex items-center gap-1">
                  Thời gian mua
                </p>
                <p className="text-xs font-medium font-bold text-gray-900">
                  {formatDate(purchase.purchaseTime)}
                </p>
              </div>
            </div>

            {purchase.pendingLinks && purchase.pendingLinks.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xl font-semibold text-black-500 mb-2">
                  Sản phẩm ({purchase.pendingLinks.length})
                </p>
                <div className="space-y-2">
                  {purchase.pendingLinks.map((link) => (
                    <div
                      key={link.linkId}
                      className="bg-white rounded-lg border border-gray-200 p-3"
                    >
                      <p className="text-2xs font-medium text-gray-900 mb-1 line-clamp-1">
                        {link.productName}
                      </p>
                      <div className="flex items-center gap-3 text-2xs text-black-600">
                        <span>Số lượng: {link.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Shipment Code Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Mã vận đơn <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></div>
                <input
                  type="text"
                  value={shipmentCode}
                  onChange={(e) => setShipmentCode(e.target.value)}
                  placeholder="Ex: SP712278768VN)"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Ship Fee Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Phí vận chuyển <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></div>
                <input
                  type="text"
                  value={shipFee}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setShipFee(value);
                  }}
                  placeholder="00000000"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 flex-1">{error}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-800 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading || !shipmentCode.trim() || !shipFee}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    Xác nhận cập nhật
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateAuctionShip;
