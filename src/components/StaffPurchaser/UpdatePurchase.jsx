// src/Components/StaffPurchase/UpdatePurchase.jsx
import React, { useState } from "react";
import toast from "react-hot-toast";
import createPurchaseService from "../../Services/StaffPurchase/createPurchaseService";

const UpdatePurchase = ({ purchase, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    finalPriceOrder: purchase?.finalPriceOrder || "",
    note: purchase?.note || "",
    shipmentCode: purchase?.shipmentCode || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    if (!purchase?.purchaseId) {
      toast.error("Missing Purchase ID!");
      return;
    }

    setLoading(true);

    try {
      await createPurchaseService.updatePurchase(purchase.purchaseId, form);
      toast.success("Purchase updated successfully!");

      if (onUpdated) onUpdated();
      onClose();
    } catch (err) {
      toast.error("Update failed!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-lg">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Update Shipment Code</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Final Price */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Final price <span className="text-yeloow-400">(Optional) </span>
            </label>
            <input
              type="number"
              name="finalPriceOrder"
              value={form.finalPriceOrder}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Shipment Code */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Shipment code <span className="text-yeloow-400">(Optional) </span>
            </label>
            <input
              type="text"
              name="shipmentCode"
              value={form.shipmentCode}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Note */}
          <div>
            <label className="mb-1 block text-sm font-medium">Note</label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              rows={3}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpdate}
            disabled={loading}
            className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Updating..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePurchase;
