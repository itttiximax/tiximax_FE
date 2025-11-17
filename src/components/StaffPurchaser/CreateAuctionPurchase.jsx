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
  selectedProducts = [], // Thêm prop mới
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
        toast.error("Vui lòng upload ảnh purchase đấu giá");
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

      await createPurchaseService.createAuctionPurchase(orderCode, payload);

      toast.success("Tạo purchase đấu giá thành công!");
      handleClose();
      onSuccess?.();
    } catch (error) {
      let errorMessage = "Có lỗi xảy ra khi tạo purchase đấu giá";

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
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header - Cyan Theme */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <span className="inline-block w-1 h-6 bg-cyan-600 rounded"></span>
                Mua hàng đấu giá
              </h3>
              <div className="flex items-center gap-2 mt-1 text-2sx text-black-600">
                <span>
                  Mã đơn:{" "}
                  <span className="font-medium text-cyan-600">{orderCode}</span>
                </span>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>
          </div>

          {/* Selected Products Summary with Product Names */}
          <div className="mb-6 p-4 bg-gray-100 rounded-lg border border-gray-400">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Sản phẩm đấu giá đã chọn :
            </h4>
            <div className="space-y-2">
              {selectedProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-cyan-50 rounded-lg border border-gray-200"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-black-700">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-black-900 text-sm mb-1">
                      {product.productName !== "string"
                        ? product.productName
                        : "Tên sản phẩm"}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-black-800">
                      <span className="font-medium text-black-600">
                        {product.trackingCode}
                      </span>
                      <span>---</span>
                      <span>SL: {product.quantity}</span>
                      <span>---</span>
                      <span className="font-medium">
                        {product.priceWeb?.toLocaleString() || 0} ₫
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Purchase Form */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <span className="inline-block w-1 h-5 bg-cyan-600 rounded"></span>
              Thông tin Đấu Giá
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
                  className="w-full border-2 border-red-500 rounded-md px-3 py-2 focus:border-black focus:ring-0 outline-none"
                  placeholder="000000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Mã vận đơn{" "}
                  <span className="text-gray-500 text-xs font-normal">
                    (Tùy chọn)
                  </span>
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
                  className="w-full border-2 border-gray-500 rounded-md px-3 py-2 focus:border-black focus:ring-0 outline-none"
                  placeholder="Nhập mã vận đơn (nếu có)"
                />
              </div>
            </div>

            <UploadImg
              imageUrl={purchaseData.image}
              onImageUpload={handleImageUpload}
              onImageRemove={handleImageRemove}
              label="Hình ảnh Đấu Giá"
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
                className="w-full border-2 border-gray-500 rounded-md px-3 py-2 focus:border-black focus:ring-0 outline-none"
              />
            </div>
          </div>

          {/* Actions - Cyan theme */}
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
              className="px-6 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
            >
              {creatingPurchase && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              )}
              {creatingPurchase ? "Đang tạo..." : "Xác nhận mua đấu giá"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAuctionPurchase;
