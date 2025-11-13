import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import createPurchaseService from "../../Services/StaffPurchase/createPurchaseService";
import UploadImg from "../../common/UploadImg";
import { Package } from "lucide-react";

const CreatePurchase = ({
  isOpen,
  onClose,
  orderCode,
  selectedTrackingCodes = [],
  onSuccess,
}) => {
  const [purchaseData, setPurchaseData] = useState({
    purchaseTotal: "",
    image: "",
    note: "",
    shipmentCode: "",
  });
  const [creatingPurchase, setCreatingPurchase] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPurchaseData({
        purchaseTotal: "",
        image: "",
        note: "",
        shipmentCode: "",
      });
    }
  }, [isOpen]);

  const formatCurrency = (value) => {
    if (!value) return "";
    const stringValue = value.toString();
    const parts = stringValue.split(".");
    const integerPart = parts[0].replace(/,/g, "");
    const decimalPart = parts[1];
    const formattedInteger = integerPart
      ? parseInt(integerPart).toLocaleString("en-US")
      : "";
    return decimalPart !== undefined
      ? formattedInteger + "." + decimalPart
      : formattedInteger;
  };

  const getRawValue = (value) => value.toString().replace(/,/g, "");
  const isValidDecimal = (value) => /^\d*\.?\d*$/.test(value) || value === "";

  const handlePurchaseTotalChange = (e) => {
    const value = e.target.value;
    const cleanValue = getRawValue(value);
    if (isValidDecimal(cleanValue)) {
      setPurchaseData((prev) => ({ ...prev, purchaseTotal: cleanValue }));
    }
  };

  const handlePurchaseTotalBlur = () => {
    const currentValue = getRawValue(purchaseData.purchaseTotal);
    if (currentValue) {
      const numValue = parseFloat(currentValue);
      if (!isNaN(numValue) && numValue >= 0) {
        setPurchaseData((prev) => ({
          ...prev,
          purchaseTotal: currentValue,
        }));
      }
    }
  };

  const handleImageUpload = (imageUrl) =>
    setPurchaseData((prev) => ({ ...prev, image: imageUrl }));

  const handleImageRemove = () =>
    setPurchaseData((prev) => ({ ...prev, image: "" }));

  const handleSubmitPurchase = async () => {
    try {
      setCreatingPurchase(true);

      if (selectedTrackingCodes.length === 0) {
        toast.error("Không có sản phẩm nào được chọn");
        return;
      }

      const rawPurchaseTotal = getRawValue(purchaseData.purchaseTotal);
      if (!rawPurchaseTotal || Number(rawPurchaseTotal) <= 0) {
        toast.error("Vui lòng nhập tổng tiền hợp lệ (> 0)");
        return;
      }

      if (!purchaseData.image || purchaseData.image === "string") {
        toast.error("Vui lòng upload ảnh purchase");
        return;
      }

      const token = localStorage.getItem("jwt");
      if (!token) {
        toast.error("Không tìm thấy token. Vui lòng đăng nhập lại.");
        return;
      }

      const payload = {
        purchaseTotal: Number(rawPurchaseTotal),
        image: purchaseData.image,
        note: purchaseData.note || "",
        shipmentCode: purchaseData.shipmentCode || "",
        trackingCode: selectedTrackingCodes,
      };

      await createPurchaseService.createPurchase(orderCode, payload, token);

      toast.success("Tạo purchase thành công!");
      handleClose();
      onSuccess?.();
    } catch (error) {
      let errorMessage = "Có lỗi xảy ra khi tạo purchase";

      if (error.response) {
        const { data, status } = error.response;
        if (data?.message) errorMessage = data.message;
        else if (data?.error) errorMessage = data.error;
        else if (typeof data === "string") errorMessage = data;
        else if (data?.errors) {
          errorMessage = data.errors
            .map((err) => err.message || err.msg)
            .join(", ");
        }

        if (status === 401) {
          localStorage.removeItem("jwt");
          errorMessage = "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.";
        }
      }

      toast.error(errorMessage, { duration: 5000 });
    } finally {
      setCreatingPurchase(false);
    }
  };

  const handleClose = () => {
    setPurchaseData({
      purchaseTotal: "",
      image: "",
      note: "",
      shipmentCode: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Mua hộ - {orderCode}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                <Package className="w-4 h-4" />
                <span>Đã chọn {selectedTrackingCodes.length} sản phẩm</span>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>
          </div>

          {/* Selected Products Summary */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              Sản phẩm đã chọn:
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedTrackingCodes.map((code, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 bg-white text-blue-700 rounded text-xs font-medium border border-blue-200"
                >
                  {code}
                </span>
              ))}
            </div>
          </div>

          {/* Purchase Form */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900">
              Thông tin Purchase
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tổng tiền <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formatCurrency(purchaseData.purchaseTotal || "")}
                  onChange={handlePurchaseTotalChange}
                  onBlur={handlePurchaseTotalBlur}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="000000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Mã vận đơn (Tùy chọn)
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
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập mã vận đơn"
                />
              </div>
            </div>

            <UploadImg
              imageUrl={purchaseData.image}
              onImageUpload={handleImageUpload}
              onImageRemove={handleImageRemove}
              label="Hình ảnh Purchase"
              required={true}
              maxSizeMB={3}
            />

            <div>
              <label className="block text-sm font-medium mb-1">Ghi chú</label>
              <textarea
                value={purchaseData.note}
                onChange={(e) =>
                  setPurchaseData((prev) => ({ ...prev, note: e.target.value }))
                }
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ghi chú (tùy chọn)"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
            <button
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>

            <button
              onClick={handleSubmitPurchase}
              disabled={
                creatingPurchase ||
                !purchaseData.purchaseTotal ||
                selectedTrackingCodes.length === 0 ||
                !purchaseData.image
              }
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
            >
              {creatingPurchase && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              )}
              {creatingPurchase ? "Đang tạo..." : "Xác nhận mua hộ"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePurchase;
