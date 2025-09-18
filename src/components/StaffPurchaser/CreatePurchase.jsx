import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import createPurchaseService from "../../Services/StaffPurchase/createPurchaseService";
import uploadImageService from "../../Services/uploadImageService";
import imageCompression from "browser-image-compression";

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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deletingImage, setDeletingImage] = useState(false);

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
      setUploadingImage(false);
      setDeletingImage(false);
    }
  }, [isOpen]);

  // Handle image upload
  const handleImageUpload = async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh");
      return;
    }

    if (file.size > 1024 * 1024) {
      toast.error("File quá lớn. Vui lòng chọn ảnh dưới 1MB");
      return;
    }

    try {
      setUploadingImage(true);

      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1080,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      const response = await uploadImageService.upload(compressedFile);

      let imageUrl =
        typeof response === "string" && response.startsWith("http")
          ? response
          : response?.url || response?.imageUrl || response?.data?.url;

      if (!imageUrl) {
        toast.error("Upload thành công nhưng không lấy được URL ảnh");
        return;
      }

      setPurchaseData((prev) => ({
        ...prev,
        image: imageUrl,
      }));

      toast.success("Upload ảnh thành công!");
    } catch (error) {
      console.error("Lỗi upload:", error);
      toast.error(
        "Upload thất bại: " + (error.response?.data?.error || error.message)
      );
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle image removal
  const handleRemoveImage = async () => {
    if (!purchaseData.image) {
      toast.error("Không có ảnh để xóa");
      return;
    }

    try {
      setDeletingImage(true);

      try {
        await uploadImageService.deleteByUrl(purchaseData.image);
        console.log("Đã xóa ảnh từ server thành công");
      } catch (deleteError) {
        console.warn("Không thể xóa ảnh từ server:", deleteError);
      }

      setPurchaseData((prev) => ({
        ...prev,
        image: "",
      }));

      toast.success("Đã xóa ảnh thành công");
    } catch (error) {
      console.error("Lỗi khi xóa ảnh:", error);
      toast.error("Có lỗi khi xóa ảnh");
    } finally {
      setDeletingImage(false);
    }
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

      if (
        !purchaseData.purchaseTotal ||
        Number(purchaseData.purchaseTotal) <= 0
      ) {
        toast.error("Vui lòng nhập tổng tiền hợp lệ (> 0)");
        return;
      }

      if (!purchaseData.shipmentCode.trim()) {
        toast.error("Vui lòng nhập mã ship");
        return;
      }

      // NEW: Validation bắt buộc phải có ảnh
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
        purchaseTotal: Number(purchaseData.purchaseTotal),
        image: purchaseData.image, // Không còn fallback về "string" nữa
        note: purchaseData.note || "",
        shipmentCode: purchaseData.shipmentCode || "",
        trackingCode: selectedTrackingCodes,
      };

      await createPurchaseService.createPurchase(orderCode, payload, token);

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
                  placeholder="SP-VN908000"
                  required
                />
              </div>
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình ảnh Purchase <span className="text-red-500">*</span>
              </label>

              <div className="space-y-3">
                {/* Upload buttons */}
                <div className="flex space-x-2">
                  <label className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600 disabled:opacity-50 text-sm flex items-center">
                    {uploadingImage ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      "Chọn ảnh"
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files[0])}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>

                  {purchaseData.image && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 text-sm disabled:opacity-50 flex items-center"
                      disabled={deletingImage}
                    >
                      {deletingImage ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Deleting...
                        </>
                      ) : (
                        "Xóa ảnh"
                      )}
                    </button>
                  )}
                </div>

                {/* Image preview or placeholder */}
                {purchaseData.image ? (
                  <div className="flex items-center space-x-3">
                    <img
                      src={purchaseData.image}
                      alt="Purchase"
                      className="w-20 h-20 object-cover border border-gray-200 rounded-md"
                    />
                    <div className="flex-1">
                      <div className="bg-green-50 border border-green-200 rounded-md p-3">
                        <div className="flex items-center space-x-2">
                          <svg
                            className="w-5 h-5 text-green-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm font-medium text-green-800">
                            Ảnh đã upload thành công
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 bg-gray-100 p-4 rounded-md text-center border-2 border-dashed border-gray-300">
                    <div className="flex flex-col items-center space-y-2">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>Chưa có ảnh purchase</span>
                      <span className="text-xs text-gray-400">
                        Chọn ảnh để upload (tối đa 1MB)
                      </span>
                    </div>
                  </div>
                )}
              </div>
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
                !purchaseData.shipmentCode.trim() ||
                selectedTrackingCodes.length === 0 ||
                !purchaseData.image || // NEW: Thêm condition check ảnh
                purchaseData.image === "string" || // NEW: Check không phải default value
                uploadingImage ||
                deletingImage
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
