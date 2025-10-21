import React, { useState } from "react";
import { createShipment } from "../../Services/Warehouse/warehouseShipmentService";
import UploadImg from "../../common/UploadImg";
import { Package, Ruler, Scale, AlertCircle, CheckCircle } from "lucide-react";

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
  const [message, setMessage] = useState({ text: "", type: "success" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image upload from UploadImg component
  const handleImageUpload = (imageUrl) => {
    setFormData((prev) => ({
      ...prev,
      image: imageUrl,
    }));
  };

  // Handle image removal from UploadImg component
  const handleImageRemove = () => {
    setFormData((prev) => ({
      ...prev,
      image: "",
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage({ text: "", type: "success" });

    try {
      // Validation
      if (!shipmentId) {
        setMessage({ text: "Vui lòng nhập Shipment ID", type: "error" });
        setLoading(false);
        return;
      }

      if (
        !formData.length ||
        !formData.width ||
        !formData.height ||
        !formData.weight ||
        !formData.netWeight
      ) {
        setMessage({
          text: "Vui lòng điền đầy đủ thông tin kích thước và trọng lượng",
          type: "error",
        });
        setLoading(false);
        return;
      }

      const shipmentData = {
        length: Number(formData.length),
        width: Number(formData.width),
        height: Number(formData.height),
        weight: Number(formData.weight),
        netWeight: Number(formData.netWeight),
        image: formData.image,
      };

      const result = await createShipment(shipmentId, shipmentData);
      setMessage({ text: "Shipment created successfully!", type: "success" });
      console.log("Success:", result);

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
    } catch (error) {
      // Xử lý lỗi từ Backend
      let errorMessage = "Đã xảy ra lỗi không xác định";

      if (error.response?.data?.error) {
        // Lỗi trả về dạng { error: "message" }
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        // Lỗi trả về dạng { message: "message" }
        errorMessage = error.response.data.message;
      } else if (error.message) {
        // Lỗi từ network hoặc client
        errorMessage = error.message;
      }

      setMessage({ text: errorMessage, type: "error" });
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center mb-8">
          <Package className="w-8 h-8 text-indigo-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Tạo Shipment Kho</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              Shipment ID <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={shipmentId}
              onChange={(e) => {
                console.log("Input value:", e.target.value);
                setShipmentId(e.target.value.trim()); // Ensure only one code by trimming
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              placeholder="Nhập một mã Shipment ID duy nhất"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chiều dài (cm) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="length"
                value={formData.length}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chiều rộng (cm) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="width"
                value={formData.width}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chiều cao (cm) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Scale className="w-4 h-4 mr-2 text-gray-500" />
                Trọng lượng (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="0.00"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Scale className="w-4 h-4 mr-2 text-gray-500" />
                Trọng lượng tịnh (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="netWeight"
                value={formData.netWeight}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="0.00"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Upload Image Component */}
          <div>
            <UploadImg
              imageUrl={formData.image}
              onImageUpload={handleImageUpload}
              onImageRemove={handleImageRemove}
              label="Hình ảnh Shipment"
              maxSizeMB={3}
              placeholder="Chưa có ảnh shipment"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 flex items-center justify-center transition-colors"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Đang tạo...
              </>
            ) : (
              "Tạo Shipment"
            )}
          </button>
        </div>

        {message.text && (
          <div
            className={`mt-6 p-4 rounded-md flex items-center gap-2 ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default WarehouseShipment;
