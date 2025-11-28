// src/Components/StaffPurchase/CreateAuctionPurchase.jsx
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import createPurchaseService from "../../Services/StaffPurchase/createPurchaseService";
import UploadImg from "../../common/UploadImg";
import { Package, Gavel } from "lucide-react";

const CreateAuctionPurchase = ({
  isOpen,
  onClose,
  orderCode,
  selectedTrackingCodes = [],
  selectedProducts = [],
  onSuccess,
}) => {
  const [purchaseData, setPurchaseData] = useState({
    purchaseTotal: "",
    shipWeb: "",
    purchaseFee: "",
    image: "",
    note: "",
    shipmentCode: "",
  });

  const [creatingPurchase, setCreatingPurchase] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPurchaseData({
        purchaseTotal: "",
        shipWeb: "",
        purchaseFee: "",
        image: "",
        note: "",
        shipmentCode: "",
      });
    }
  }, [isOpen]);

  // -----------------------------
  // Currency helpers
  // -----------------------------
  const formatCurrency = (value) => {
    if (!value && value !== 0) return "";
    const number = Number(value);
    const fixed = number.toFixed(2);
    const [integerPart, decimalPart] = fixed.split(".");
    const formattedInteger = parseInt(integerPart).toLocaleString("en-US");
    return decimalPart === "00"
      ? formattedInteger
      : `${formattedInteger}.${decimalPart}`;
  };

  const getRawValue = (value) => value.toString().replace(/,/g, "");
  const isValidDecimal = (value) => /^\d*\.?\d*$/.test(value) || value === "";

  const handleCurrencyInput = (field, value) => {
    const cleanValue = getRawValue(value);
    if (isValidDecimal(cleanValue)) {
      setPurchaseData((prev) => ({ ...prev, [field]: cleanValue }));
    }
  };

  const handleCurrencyBlur = (field) => {
    const v = getRawValue(purchaseData[field]);
    if (!isNaN(v) && v !== "") {
      setPurchaseData((prev) => ({ ...prev, [field]: v }));
    }
  };

  // -----------------------------
  // Image handling
  // -----------------------------
  const handleImageUpload = (imageUrl) =>
    setPurchaseData((prev) => ({ ...prev, image: imageUrl }));

  const handleImageRemove = () =>
    setPurchaseData((prev) => ({ ...prev, image: "" }));

  // -----------------------------
  // Calculate total auction amount
  // -----------------------------
  const calculatedTotal = selectedProducts.reduce(
    (sum, product) => sum + (product.priceWeb || 0),
    0
  );

  // -----------------------------
  // Submit handler
  // -----------------------------
  const handleSubmitPurchase = async () => {
    try {
      setCreatingPurchase(true);

      if (selectedTrackingCodes.length === 0) {
        toast.error("No products selected");
        return;
      }

      const rawPurchaseTotal = getRawValue(purchaseData.purchaseTotal);
      const rawShipWeb = getRawValue(purchaseData.shipWeb);
      const rawPurchaseFee = getRawValue(purchaseData.purchaseFee);

      if (!rawPurchaseTotal || Number(rawPurchaseTotal) <= 0) {
        toast.error("Please enter a valid total amount (> 0)");
        return;
      }

      if (!purchaseData.image) {
        toast.error("Please upload auction purchase image");
        return;
      }

      const token = localStorage.getItem("jwt");
      if (!token) {
        toast.error("Token not found. Please login again.");
        return;
      }

      const payload = {
        purchaseTotal: Number(rawPurchaseTotal),
        shipWeb: Number(rawShipWeb || 0),
        purchaseFee: Number(rawPurchaseFee || 0),
        image: purchaseData.image,
        note: purchaseData.note || "",
        shipmentCode: purchaseData.shipmentCode || "",
        trackingCode: selectedTrackingCodes,
      };

      await createPurchaseService.createAuctionPurchase(orderCode, payload);

      toast.success("Auction purchase created successfully!");
      handleClose();
      onSuccess?.();
    } catch (error) {
      let errorMessage = "An error occurred while creating auction purchase";

      if (error.response) {
        const { data, status } = error.response;

        if (data?.message) errorMessage = data.message;
        else if (data?.error) errorMessage = data.error;
        else if (typeof data === "string") errorMessage = data;
        else if (data?.errors)
          errorMessage = data.errors
            .map((err) => err.message || err.msg)
            .join(", ");

        if (status === 401) {
          localStorage.removeItem("jwt");
          errorMessage = "Session expired. Please login again.";
        }
      }

      toast.error(errorMessage, { duration: 5000 });
    } finally {
      setCreatingPurchase(false);
    }
  };

  // -----------------------------
  // Close modal
  // -----------------------------
  const handleClose = () => {
    setPurchaseData({
      purchaseTotal: "",
      shipWeb: "",
      purchaseFee: "",
      image: "",
      note: "",
      shipmentCode: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <span className="inline-block w-1 h-6 bg-cyan-600 rounded"></span>
              Auction Purchase - {orderCode}
            </h3>

            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>
          </div>

          {/* Product Table */}
          <div className="mb-6">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left">No.</th>
                      <th className="px-4 py-3 text-left">Product Name</th>
                      <th className="px-4 py-3 text-center">Qty</th>
                      <th className="px-4 py-3 text-right">Auction Price</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {selectedProducts.map((product, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{index + 1}</td>
                        <td className="px-4 py-3">{product.productName}</td>
                        <td className="px-4 py-3 text-center">
                          {product.quantity}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">
                          {formatCurrency(product.priceWeb)}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  <tfoot className="bg-cyan-50 border-t-2 border-cyan-200">
                    <tr>
                      <td colSpan="3" className="px-4 py-3 text-right font-bold">
                        Grand Total:
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-cyan-700">
                        {formatCurrency(calculatedTotal)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          {/* Auction Form */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Auction Information</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Purchase Total */}
              <div>
                <label className="block text-sm font-medium mb-1">
                Total Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formatCurrency(purchaseData.purchaseTotal)}
                  onChange={(e) =>
                    handleCurrencyInput("purchaseTotal", e.target.value)
                  }
                  onBlur={() => handleCurrencyBlur("purchaseTotal")}
                  className="w-full border-2 border-red-500 rounded-md px-3 py-2"
                  placeholder={`Suggested: ${formatCurrency(
                    calculatedTotal
                  )}`}
                />
              </div>

              {/* Shipment Code */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Shipment Code
                </label>
                <input
                  type="text"
                  value={purchaseData.shipmentCode}
                  onChange={(e) =>
                    setPurchaseData((prev) => ({
                      ...prev,
                      shipmentCode: e.target.value,
                    }))
                  }
                  className="w-full border-2 border-gray-500 rounded-md px-3 py-2"
                />
              </div>

              {/* Ship Web */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Ship Web <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formatCurrency(purchaseData.shipWeb)}
                  onChange={(e) =>
                    handleCurrencyInput("shipWeb", e.target.value)
                  }
                  onBlur={() => handleCurrencyBlur("shipWeb")}
                  className="w-full border-2 border-gray-500 rounded-md px-3 py-2"
                  placeholder="Ship Web fee"
                />
              </div>

              {/* Purchase Fee */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Purchase Fee (Phí mua hộ)
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formatCurrency(purchaseData.purchaseFee)}
                  onChange={(e) =>
                    handleCurrencyInput("purchaseFee", e.target.value)
                  }
                  onBlur={() => handleCurrencyBlur("purchaseFee")}
                  className="w-full border-2 border-gray-500 rounded-md px-3 py-2"
                  placeholder="Purchase fee"
                />
              </div>
            </div>

            {/* Image Upload */}
            <UploadImg
              imageUrl={purchaseData.image}
              onImageUpload={handleImageUpload}
              onImageRemove={handleImageRemove}
              label="Auction Purchase Image"
              required={true}
              maxSizeMB={3}
            />

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                rows={3}
                value={purchaseData.note}
                onChange={(e) =>
                  setPurchaseData((prev) => ({ ...prev, note: e.target.value }))
                }
                className="w-full border-2 border-gray-500 rounded-md px-3 py-2"
                placeholder="Add notes (optional)"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
            <button
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 rounded-md"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmitPurchase}
              disabled={
                creatingPurchase ||
                !purchaseData.purchaseTotal ||
                !purchaseData.shipWeb ||
                !purchaseData.purchaseFee ||
                selectedTrackingCodes.length === 0 ||
                !purchaseData.image
              }
              className="px-6 py-2 bg-cyan-600 text-white rounded-md disabled:opacity-50 flex items-center"
            >
              {creatingPurchase && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              )}
              {creatingPurchase ? "Creating..." : "Create Auction Purchase"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAuctionPurchase;
