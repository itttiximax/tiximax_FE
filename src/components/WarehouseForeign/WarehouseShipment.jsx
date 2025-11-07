// src/Components/Warehouse/WarehouseShipment.jsx
import React, { useState, useRef, useEffect } from "react";
import { createShipment } from "../../Services/Warehouse/warehouseShipmentService";
import UploadImg from "../../common/UploadImg";
import toast, { Toaster } from "react-hot-toast";
import {
  Package,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Loader2,
  Box,
} from "lucide-react";

const WarehouseShipment = () => {
  const [formData, setFormData] = useState({
    length: "",
    width: "",
    height: "",
    weight: "",
    image: "",
  });
  const [shipmentId, setShipmentId] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto focus on shipmentId input
  const shipmentInputRef = useRef(null);

  useEffect(() => {
    shipmentInputRef.current?.focus();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (imageUrl) => {
    setFormData((prev) => ({
      ...prev,
      image: imageUrl,
    }));
  };

  const handleImageRemove = () => {
    setFormData((prev) => ({
      ...prev,
      image: "",
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    // Validation
    if (!shipmentId || !shipmentId.trim()) {
      toast.error("Vui lòng nhập Shipment ID");
      return;
    }

    if (
      !formData.length ||
      !formData.width ||
      !formData.height ||
      !formData.weight
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin kích thước và trọng lượng");
      return;
    }

    // Validate positive numbers
    if (
      Number(formData.length) <= 0 ||
      Number(formData.width) <= 0 ||
      Number(formData.height) <= 0 ||
      Number(formData.weight) <= 0
    ) {
      toast.error("Kích thước và trọng lượng phải lớn hơn 0");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Đang tạo shipment...");

    try {
      const shipmentData = {
        length: Number(formData.length),
        width: Number(formData.width),
        height: Number(formData.height),
        weight: Number(formData.weight),
        image: formData.image || "",
      };

      const result = await createShipment(shipmentId.trim(), shipmentData);

      toast.dismiss(loadingToast);

      // Success message from backend
      const successMessage =
        result?.message || result?.data?.message || "Tạo shipment thành công!";

      toast.success(successMessage, {
        duration: 3000,
        style: {
          background: "#ffffff",
          color: "#23da60",
          border: "1px solid #23da60",
        },
      });

      // Reset form after success
      setFormData({
        length: "",
        width: "",
        height: "",
        weight: "",
        image: "",
      });
      setShipmentId("");
      shipmentInputRef.current?.focus();
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Error creating shipment:", error);

      // Error handling from backend
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.response?.data?.detail ||
        error.message ||
        "Không thể tạo shipment";

      toast.error(errorMessage, {
        duration: 4000,
        style: {
          background: "#ffffff",
          color: "#df3131",
          border: "1px solid #df3131",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key for quick submit
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-full">
              <Box className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Nhập kho và cân ký đơn hàng
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Điền thông tin shipment để tạo mới nhanh chóng
              </p>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Shipment ID */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-600" />
                Mã vận đơn <span className="text-red-500">*</span>
              </label>
              <input
                ref={shipmentInputRef}
                type="text"
                value={shipmentId}
                onChange={(e) => setShipmentId(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                placeholder="Nhập mã Shipment ID (ví dụ: SPX123456678)"
                disabled={loading}
                autoFocus
              />
              <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-yellow-500" />
                Nhấn Enter để submit nhanh. Mã phải duy nhất.
              </p>
            </div>

            {/* Dimensions */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Box className="w-5 h-5 text-indigo-600" />
                Kích thước (cm)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Dài <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="length"
                    value={formData.length}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm text-sm"
                    placeholder="0.00"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Rộng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="width"
                    value={formData.width}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm text-sm"
                    placeholder="0.00"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Cao <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm text-sm"
                    placeholder="0.00"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Box className="w-5 h-5 text-indigo-600" />
                Trọng lượng (kg)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Tổng trọng lượng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                    placeholder="0.00"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <UploadImg
                imageUrl={formData.image}
                onImageUpload={handleImageUpload}
                onImageRemove={handleImageRemove}
                maxSizeMB={3}
                placeholder="Chưa có ảnh shipment. Upload ảnh để lưu trữ."
              />
              <p className="mt-2 text-xs text-gray-500">
                Tùy chọn: Upload ảnh minh họa shipment (tối đa 3MB)
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-md"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang tạo shipment...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Tạo Shipment Mới
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WarehouseShipment;
