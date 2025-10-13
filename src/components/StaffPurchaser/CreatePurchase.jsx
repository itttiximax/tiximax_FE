import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import createPurchaseService from "../../Services/StaffPurchase/createPurchaseService";
import UploadImg from "../../common/UploadImg";

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

  // Helper function để format số tiền với dấu phẩy cho hiển thị (giữ nguyên phần thập phân)
  const formatCurrency = (value) => {
    if (!value || value === "") return "";

    // Chuyển đổi thành string và xử lý
    const stringValue = value.toString();

    // Tách phần nguyên và phần thập phân
    const parts = stringValue.split(".");
    const integerPart = parts[0].replace(/,/g, ""); // Loại bỏ dấu phẩy cũ
    const decimalPart = parts[1];

    // Kiểm tra phần nguyên có hợp lệ không
    if (!/^\d*$/.test(integerPart)) return stringValue;

    // Format phần nguyên với dấu phẩy
    const formattedInteger = integerPart
      ? parseInt(integerPart).toLocaleString("en-US")
      : "";

    // Ghép lại với phần thập phân nếu có
    if (decimalPart !== undefined) {
      return formattedInteger + "." + decimalPart;
    }

    return formattedInteger;
  };

  // Helper function để lấy giá trị thô (remove dấu phẩy nhưng giữ dấu chấm thập phân)
  const getRawValue = (value) => {
    return value.toString().replace(/,/g, "");
  };

  // Hàm kiểm tra tính hợp lệ của số thập phân
  const isValidDecimal = (value) => {
    // Cho phép: số nguyên, số thập phân, chuỗi rỗng
    return /^\d*\.?\d*$/.test(value) || value === "";
  };

  // Handle purchase total input change
  const handlePurchaseTotalChange = (e) => {
    const value = e.target.value;
    const cleanValue = getRawValue(value);

    // Cho phép nhập số thập phân
    if (isValidDecimal(cleanValue)) {
      setPurchaseData((prev) => ({
        ...prev,
        purchaseTotal: cleanValue,
      }));
    }
  };

  // Handle blur - validate khi rời khỏi input
  const handlePurchaseTotalBlur = () => {
    const currentValue = getRawValue(purchaseData.purchaseTotal);

    if (currentValue && currentValue !== "") {
      const numValue = parseFloat(currentValue);
      if (!isNaN(numValue) && numValue >= 0) {
        setPurchaseData((prev) => ({
          ...prev,
          purchaseTotal: currentValue,
        }));
      }
    }
  };

  // Handle image upload from UploadImg component
  const handleImageUpload = (imageUrl) => {
    setPurchaseData((prev) => ({
      ...prev,
      image: imageUrl,
    }));
  };

  // Handle image removal from UploadImg component
  const handleImageRemove = () => {
    setPurchaseData((prev) => ({
      ...prev,
      image: "",
    }));
  };

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

      const rawPurchaseTotal = getRawValue(purchaseData.purchaseTotal);
      if (!rawPurchaseTotal || Number(rawPurchaseTotal) <= 0) {
        toast.error("Vui lòng nhập tổng tiền hợp lệ (> 0)");
        return;
      }

      if (!purchaseData.shipmentCode.trim()) {
        toast.error("Vui lòng nhập mã ship");
        return;
      }

      // Validation bắt buộc phải có ảnh
      if (
        !purchaseData.image ||
        purchaseData.image.trim() === "" ||
        purchaseData.image === "string"
      ) {
        toast.error("Vui lòng upload ảnh purchase");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Không tìm thấy token. Vui lòng đăng nhập lại.");
        return;
      }

      // Prepare payload
      const payload = {
        purchaseTotal: Number(rawPurchaseTotal),
        image: purchaseData.image,
        note: purchaseData.note || "",
        shipmentCode: purchaseData.shipmentCode || "",
        trackingCode: selectedTrackingCodes,
      };

      console.log("Payload gửi lên:", payload);

      await createPurchaseService.createPurchase(orderCode, payload, token);

      toast.success("Tạo purchase thành công!");
      handleClose();
      onSuccess?.();
    } catch (error) {
      console.error("Error creating purchase:", error);
      console.error("Error response:", error.response);

      let errorMessage = "Có lỗi xảy ra khi tạo purchase";

      if (error.response) {
        // Lỗi từ server có response
        const { data, status } = error.response;

        console.log("Backend error status:", status);
        console.log("Backend error data:", data);

        // Xử lý các format lỗi khác nhau từ BE
        if (data) {
          // Format 1: { message: "error message" }
          if (data.message) {
            errorMessage = data.message;
          }
          // Format 2: { error: "error message" }
          else if (data.error) {
            errorMessage = data.error;
          }
          // Format 3: { errors: [{...}] } - validation errors
          else if (data.errors && Array.isArray(data.errors)) {
            errorMessage = data.errors
              .map((err) => err.message || err.msg)
              .join(", ");
          }
          // Format 4: { detail: "error message" }
          else if (data.detail) {
            errorMessage = data.detail;
          }
          // Format 5: Nếu data là string
          else if (typeof data === "string") {
            errorMessage = data;
          }
        }

        // Thêm status code vào message nếu cần
        if (status === 400) {
          errorMessage = `[Lỗi dữ liệu] ${errorMessage}`;
        } else if (status === 401) {
          errorMessage = "[Không có quyền truy cập] Vui lòng đăng nhập lại";
          localStorage.removeItem("token");
        } else if (status === 403) {
          errorMessage = `[Forbidden] ${errorMessage}`;
        } else if (status === 404) {
          errorMessage = `[Không tìm thấy] ${errorMessage}`;
        } else if (status === 409) {
          errorMessage = `[Conflict] ${errorMessage}`;
        } else if (status === 500) {
          errorMessage = `[Lỗi server] ${errorMessage}`;
        }
      } else if (error.request) {
        // Request được gửi nhưng không nhận được response
        console.error("No response received:", error.request);
        errorMessage =
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.";
      } else {
        // Lỗi khác
        errorMessage = error.message || errorMessage;
      }

      // Hiển thị lỗi
      toast.error(errorMessage, {
        duration: 5000, // Hiển thị lâu hơn để user đọc được
        style: {
          maxWidth: "500px",
        },
      });

      // ============ END XỬ LÝ LỖI ============
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

  // Format currency for display VND
  const formatCurrencyVND = (amount) => {
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
      DA_MUA: "bg-red-600 text-white",
      HUY: "bg-red-100 text-red-800",
      DA_HUY: "bg-red-100 text-red-800",
      HOAT_DONG: "bg-green-100 text-green-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };
  const getStatusText = (status) => {
    const texts = {
      CHO_MUA: "Chờ mua",
      DANG_MUA: "Đang mua",
      DA_MUA: "Đã mua",
      HUY: "Đã hủy",
      DA_HUY: "Đã hủy",
      HOAT_DONG: "Hoạt động",
    };
    return texts[status] || status;
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
                          {formatCurrencyVND(link.finalPriceVnd)}
                        </div>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            link.status
                          )}`}
                        >
                          {getStatusText(link.status)}
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
                  type="text"
                  value={formatCurrency(purchaseData.purchaseTotal || "")}
                  onChange={handlePurchaseTotalChange}
                  onBlur={handlePurchaseTotalBlur}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="000000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã vận đơn <span className="text-red-500">*</span>
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
                  placeholder="SPX-123456789"
                  required
                />
              </div>
            </div>

            {/* Upload Image Component */}
            <UploadImg
              imageUrl={purchaseData.image}
              onImageUpload={handleImageUpload}
              onImageRemove={handleImageRemove}
              label="Hình ảnh Purchase"
              required={true}
              maxSizeMB={3}
              placeholder="Chưa có ảnh purchase"
            />

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
                !purchaseData.shipmentCode.trim() ||
                selectedTrackingCodes.length === 0 ||
                !purchaseData.image ||
                purchaseData.image === "string"
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
