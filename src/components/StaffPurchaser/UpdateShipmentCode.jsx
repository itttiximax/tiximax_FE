import React, { useState, useEffect } from "react";
import { Package, Save, Loader2, X } from "lucide-react";
import orderlinkService from "../../Services/StaffPurchase/orderlinkService";
import toast from "react-hot-toast";

const getBackendError = (e) => {
  if (!e?.response) return e?.message || "Lỗi kết nối đến máy chủ.";
  const data = e.response.data;
  if (typeof data === "object") {
    return (
      data.error ||
      data.message ||
      data.detail ||
      (data.errors && JSON.stringify(data.errors)) ||
      "Lỗi không xác định từ máy chủ."
    );
  }
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data);
      return parsed.error || parsed.message || parsed.detail || data;
    } catch {
      return data;
    }
  }
  return e?.message || "Đã xảy ra lỗi trong quá trình cập nhật.";
};

const UpdateShipmentCode = ({ isOpen, onClose, purchase, onSaveSuccess }) => {
  const [shipmentCode, setShipmentCode] = useState("");
  const [saving, setSaving] = useState(false);

  // 🟢 Reset input mỗi khi mở modal hoặc chọn đơn khác
  useEffect(() => {
    if (isOpen) setShipmentCode("");
  }, [isOpen, purchase]);

  if (!isOpen) return null;

  const handleSaveShipmentCode = async () => {
    if (!shipmentCode.trim()) {
      toast.error("⚠️ Vui lòng nhập mã vận đơn!");
      return;
    }

    setSaving(true);
    try {
      await orderlinkService.updatePurchaseShipmentAddress(
        purchase.purchaseId,
        shipmentCode.trim()
      );
      toast.success("✅ Cập nhật mã vận đơn thành công!");
      setShipmentCode(""); // reset sau khi lưu thành công
      setTimeout(() => {
        onClose();
        onSaveSuccess();
      }, 600);
    } catch (e) {
      toast.error(getBackendError(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
          <Package className="h-5 w-5 text-indigo-600" />
          Nhập MÃ VẬN ĐƠN
        </h2>

        <p className="mb-4 text-sm text-gray-600">
          Order:{" "}
          <span className="font-mono font-medium text-indigo-700">
            {purchase?.orderCode}
          </span>
        </p>

        <input
          className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          placeholder="Nhập mã vận đơn..."
          value={shipmentCode}
          onChange={(e) => setShipmentCode(e.target.value)}
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 disabled:opacity-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSaveShipmentCode}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Đang lưu...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Lưu mã vận đơn
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateShipmentCode;
