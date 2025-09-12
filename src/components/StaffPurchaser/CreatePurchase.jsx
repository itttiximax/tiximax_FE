import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import createPurchaseService from "../../Services/StaffPurchase/createPurchaseService";

const CreatePurchase = ({
  isOpen,
  onClose,
  orderCode,
  orderLinks = [],
  onSuccess,
}) => {
  const [selectedTrackingCodes, setSelectedTrackingCodes] = useState([]);
  const [purchaseData, setPurchaseData] = useState({
    purchaseTotal: "",
    image: "",
    note: "",
    shipmentCode: "",
  });
  const [creatingPurchase, setCreatingPurchase] = useState(false);

  // Reset form khi modal mở
  useEffect(() => {
    if (isOpen) {
      setSelectedTrackingCodes([]);
      setPurchaseData({
        purchaseTotal: "",
        image: "",
        note: "",
        shipmentCode: "",
      });
    }
  }, [isOpen]);

  // Handle tracking code selection
  const handleTrackingCodeSelect = (trackingCode, isSelected) => {
    setSelectedTrackingCodes((prev) =>
      isSelected
        ? [...prev, trackingCode]
        : prev.filter((code) => code !== trackingCode)
    );
  };

  // Handle select all tracking codes
  const handleSelectAll = (isSelectAll) => {
    const allTrackingCodes = orderLinks.map((link) => link.trackingCode);
    setSelectedTrackingCodes(isSelectAll ? allTrackingCodes : []);
  };

  // Handle purchase creation
  const handleSubmitPurchase = async () => {
    try {
      setCreatingPurchase(true);

      // Basic validation
      if (selectedTrackingCodes.length === 0) {
        toast.error("Vui lòng chọn ít nhất một tracking code");
        return;
      }

      if (
        !purchaseData.purchaseTotal ||
        Number(purchaseData.purchaseTotal) <= 0
      ) {
        toast.error("Vui lòng nhập tổng tiền hợp lệ (> 0)");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Không tìm thấy token. Vui lòng đăng nhập lại.");
        return;
      }

      // Prepare payload
      const payload = {
        purchaseTotal: Number(purchaseData.purchaseTotal),
        image: purchaseData.image || "string",
        note: purchaseData.note || "",
        shipmentCode: purchaseData.shipmentCode || "",
        trackingCode: selectedTrackingCodes,
      };

      await createPurchaseService.createPurchase(
        orderCode,

        payload,
        token
      );

      toast.success("Tạo purchase thành công!");
      handleClose();
      onSuccess?.();
    } catch (error) {
      console.error("Error creating purchase:", error);

      // Sử dụng message từ BE, fallback về message mặc định
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra khi tạo purchase";

      toast.error(errorMessage);

      // Handle token expiry
      if (error.status === 401) {
        localStorage.removeItem("token");
      }
    } finally {
      setCreatingPurchase(false);
    }
  };

  const handleClose = () => {
    setSelectedTrackingCodes([]);
    setPurchaseData({
      purchaseTotal: "",
      image: "",
      note: "",
      shipmentCode: "",
    });
    onClose();
  };

  // Format currency for display
  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      CHO_MUA: "bg-yellow-100 text-yellow-800",
      DANG_MUA: "bg-blue-100 text-blue-800",
      DA_MUA: "bg-green-100 text-green-800",
      HUY: "bg-red-100 text-red-800",
      HOAT_DONG: "bg-green-100 text-green-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (!isOpen) return null;

  const allTrackingCodes = orderLinks.map((link) => link.trackingCode);
  const isAllSelected =
    allTrackingCodes.length > 0 &&
    allTrackingCodes.every((code) => selectedTrackingCodes.includes(code));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Tạo Purchase - {orderCode}
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Product Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">
                Chọn sản phẩm ({orderLinks.length} sản phẩm)
              </h4>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Chọn tất cả ({selectedTrackingCodes.length}/
                  {allTrackingCodes.length})
                </span>
              </label>
            </div>

            {/* Selected summary */}
            {selectedTrackingCodes.length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="text-sm font-medium text-blue-900 mb-1">
                  Tracking codes đã chọn ({selectedTrackingCodes.length}):
                </div>
                <div className="text-sm text-blue-700">
                  {selectedTrackingCodes.join(", ")}
                </div>
              </div>
            )}

            {/* Product list */}
            <div className="space-y-3 max-h-60 overflow-y-auto border border-gray-200 rounded-md">
              {orderLinks.map((link) => (
                <div
                  key={link.linkId}
                  className={`p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 ${
                    selectedTrackingCodes.includes(link.trackingCode)
                      ? "bg-blue-50 border-l-4 border-l-blue-500"
                      : ""
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedTrackingCodes.includes(
                        link.trackingCode
                      )}
                      onChange={(e) =>
                        handleTrackingCodeSelect(
                          link.trackingCode,
                          e.target.checked
                        )
                      }
                      className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="font-medium text-gray-900 mb-1">
                          {link.productName !== "string"
                            ? link.productName
                            : "Tên sản phẩm"}
                        </div>
                        <div className="text-sm text-gray-600">
                          Website:{" "}
                          {link.website !== "string" ? link.website : "N/A"}
                        </div>
                        <div className="text-sm text-blue-600 font-medium">
                          Tracking: {link.trackingCode}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>SL: {link.quantity}</div>
                        <div>
                          Giá web: {link.priceWeb?.toLocaleString() || 0}
                        </div>
                        <div>
                          Giá Ship: {link.shipWeb?.toLocaleString() || 0}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900 mb-2">
                          {formatCurrency(link.finalPriceVnd)}
                        </div>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            link.status
                          )}`}
                        >
                          {link.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tổng tiền <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={purchaseData.purchaseTotal}
                  onChange={(e) =>
                    setPurchaseData((prev) => ({
                      ...prev,
                      purchaseTotal: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="000000"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hình ảnh (URL)
                </label>
                <input
                  type="text"
                  value={purchaseData.image}
                  onChange={(e) =>
                    setPurchaseData((prev) => ({
                      ...prev,
                      image: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="URL hình ảnh"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ship code <span className="text-red-500">*</span>
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
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="SP-VN908000"
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ghi chú
              </label>
              <textarea
                value={purchaseData.note}
                onChange={(e) =>
                  setPurchaseData((prev) => ({ ...prev, note: e.target.value }))
                }
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ghi chú"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmitPurchase}
              disabled={
                creatingPurchase ||
                !purchaseData.purchaseTotal ||
                selectedTrackingCodes.length === 0
              }
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {creatingPurchase && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              )}
              {creatingPurchase ? "Đang tạo..." : "Tạo Purchase"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePurchase;
