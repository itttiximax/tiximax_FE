// src/Components/StaffPurchase/UpdatePurchase.jsx
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Info, DollarSign, Package, FileText } from "lucide-react";
import createPurchaseService from "../../Services/StaffPurchase/createPurchaseService";
import UploadImg from "../../common/UploadImg";

const UpdatePurchase = ({ purchase, onClose, onUpdated }) => {
  // Shipment & image hiện tại lấy từ nhiều nguồn
  const currentShipmentCode =
    purchase?.pendingLinks?.[0]?.shipmentCode || purchase?.shipmentCode || "";

  const currentImagePurchased =
    purchase?.imagePurchased ||
    purchase?.purchaseImage || // từ list
    purchase?.pendingLinks?.[0]?.imagePurchased ||
    purchase?.pendingLinks?.[0]?.purchaseImage ||
    "";

  const [form, setForm] = useState({
    finalPriceOrder: purchase?.finalPriceOrder || "",
    note: purchase?.note || "",
    shipmentCode: currentShipmentCode || "",
    imagePurchased: currentImagePurchased || "",
  });

  const [loading, setLoading] = useState(false);

  const formatNumber = (num) => {
    if (!num && num !== 0) return "";
    return Number(num).toLocaleString("en-US");
  };

  const parseNumber = (str) => {
    if (!str) return "";
    return str.replace(/,/g, "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "finalPriceOrder") {
      const cleanValue = parseNumber(value);
      if (cleanValue && !/^\d*\.?\d*$/.test(cleanValue)) return;

      setForm((prev) => ({
        ...prev,
        [name]: cleanValue,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleUpdate = async () => {
    if (!purchase?.purchaseId) {
      toast.error("Missing Purchase ID!");
      return;
    }

    setLoading(true);

    try {
      await createPurchaseService.updatePurchase(purchase.purchaseId, form);

      if (onUpdated) {
        onUpdated({
          finalPriceOrder: form.finalPriceOrder,
          note: form.note,
          shipmentCode: form.shipmentCode,
          imagePurchased: form.imagePurchased,
        });
      }

      toast.success("Purchase updated successfully!");
      onClose();
    } catch (err) {
      toast.error("Update failed!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Update Purchase
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/80 hover:bg-white/20 transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Current Info */}
        <div className="mb-6 rounded-xl bg-blue-50 border border-blue-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Info className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-semibold text-blue-900">
              Current Information
            </h3>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Price Purchase:</span>
              <span className="font-semibold text-gray-900">
                {purchase?.finalPriceOrder
                  ? `${formatNumber(purchase.finalPriceOrder)}`
                  : "Not set"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Shipment Code:</span>
              <span className="font-mono font-semibold text-gray-900">
                {currentShipmentCode || "Not set"}
              </span>
            </div>

            <div className="flex items-start justify-between gap-3">
              <span className="text-gray-600 mt-1">Image Purchased:</span>
              {currentImagePurchased ? (
                <div className="h-16 w-16 rounded-lg overflow-hidden border border-blue-200 bg-white">
                  <img
                    src={currentImagePurchased}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <span className="font-medium text-gray-500">No image</span>
              )}
            </div>

            <div className="flex items-start justify-between">
              <span className="text-gray-600">Note:</span>
              <span className="font-medium text-gray-900 text-right max-w-xs truncate">
                {purchase?.note || "No note"}
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Final Price */}
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
              Price Purchase{" "}
              <span className="text-yellow-500 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              name="finalPriceOrder"
              value={formatNumber(form.finalPriceOrder)}
              onChange={handleChange}
              placeholder={
                purchase?.finalPriceOrder
                  ? `Current: ${formatNumber(purchase.finalPriceOrder)}`
                  : "Enter price purchase"
              }
              className="w-full rounded-lg border border-gray-300 pl-4 pr-10 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          {/* Shipment Code */}
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
              Shipment code{" "}
              <span className="text-yellow-500 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              name="shipmentCode"
              value={form.shipmentCode}
              onChange={handleChange}
              placeholder={
                currentShipmentCode
                  ? `Current: ${currentShipmentCode}`
                  : "Enter shipment code"
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-mono focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          {/* Image Upload */}
          <UploadImg
            imageUrl={form.imagePurchased}
            onImageUpload={(url) =>
              setForm((prev) => ({ ...prev, imagePurchased: url }))
            }
            onImageRemove={() =>
              setForm((prev) => ({ ...prev, imagePurchased: "" }))
            }
            label="Image Purchased"
            placeholder="Chưa có ảnh sản phẩm"
            maxSizeMB={3}
            className=""
          />

          {/* Note */}
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
              <FileText className="h-4 w-4 text-gray-500" />
              Note
            </label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              rows={4}
              placeholder={
                purchase?.note
                  ? `Current: ${purchase.note}`
                  : "Enter notes or additional information..."
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpdate}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {loading && (
              <svg
                className="animate-spin h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePurchase;
