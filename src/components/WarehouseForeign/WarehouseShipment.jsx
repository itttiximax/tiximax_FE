// src/Components/Warehouse/WarehouseShipment.jsx
import React, { useState, useRef, useEffect } from "react";
import { createShipment } from "../../Services/Warehouse/warehouseShipmentService";
import UploadImg from "../../common/UploadImg";
import toast, { Toaster } from "react-hot-toast";
import {
  Package,
  Ruler,
  Weight,
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
    netWeight: "",
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
      !formData.weight ||
      !formData.netWeight
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin kích thước và trọng lượng");
      return;
    }

    // Validate positive numbers
    if (
      Number(formData.length) <= 0 ||
      Number(formData.width) <= 0 ||
      Number(formData.height) <= 0 ||
      Number(formData.weight) <= 0 ||
      Number(formData.netWeight) <= 0
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
        netWeight: Number(formData.netWeight),
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
          background: "#ffffffff",
          color: "#23da60ff",
          border: "1px solid #ffffffff",
        },
      });

      // Reset form after success
      setFormData({
        length: "",
        width: "",
        height: "",
        weight: "",
        netWeight: "",
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
          background: "#ffffffff",
          color: "#df3131ff",
          border: "1px solid #ffffffff",
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
    <div className="min-h-screen py-8 px-4">
      <Toaster position="top-right" />

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Box className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Nhập kho và cân ký đơn hàng
              </h1>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shipment ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Package className="w-4 h-4 text-indigo-600" />
                Mã vận đơn <span className="text-red-500">*</span>
              </label>
              <input
                ref={shipmentInputRef}
                type="text"
                value={shipmentId}
                onChange={(e) => setShipmentId(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="Nhập mã Shipment ID"
                disabled={loading}
                autoFocus
              />
              <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Nhập mã shipment duy nhất, nhấn Enter để nhanh chóng
              </p>
            </div>

            {/* Dimensions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                Kích thước (cm)
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Dài <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="length"
                    value={formData.length}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
                    placeholder="0.00"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Rộng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="width"
                    value={formData.width}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
                    placeholder="0.00"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Cao <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
                    placeholder="0.00"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Weight & Net Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                Trọng lượng (kg)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Tổng trọng lượng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="0.00"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Trọng lượng tịnh <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="netWeight"
                    value={formData.netWeight}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="0.00"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-gray-600" />
                Hình ảnh đơn hàng
              </label>
              <UploadImg
                imageUrl={formData.image}
                onImageUpload={handleImageUpload}
                onImageRemove={handleImageRemove}
                maxSizeMB={3}
                placeholder="Chưa có ảnh shipment"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang tạo shipment...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Tạo Shipment
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
