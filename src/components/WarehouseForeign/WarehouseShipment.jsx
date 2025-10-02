import React, { useState } from "react";
import { createShipment } from "../../Services/Warehouse/warehouseShipmentService";
import UploadImg from "../../common/UploadImg";

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
  const [message, setMessage] = useState("");

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
    setMessage("");

    try {
      // Validation
      if (!shipmentId) {
        setMessage("Vui lòng nhập Shipment ID");
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
        setMessage("Vui lòng điền đầy đủ thông tin kích thước và trọng lượng");
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
      setMessage("Shipment created successfully!");
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

      setMessage(errorMessage);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Create Warehouse Shipment
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Shipment ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={shipmentId}
            onChange={(e) => {
              console.log("Input value:", e.target.value);
              setShipmentId(e.target.value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter shipment ID"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Length <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="length"
              value={formData.length}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="cm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Width <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="width"
              value={formData.width}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="cm"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Height <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="cm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="kg"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Net Weight <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="netWeight"
            value={formData.netWeight}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="kg"
            required
          />
        </div>

        {/* Upload Image Component */}
        <UploadImg
          imageUrl={formData.image}
          onImageUpload={handleImageUpload}
          onImageRemove={handleImageRemove}
          label="Hình ảnh Shipment"
          maxSizeMB={3}
          placeholder="Chưa có ảnh shipment"
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating...
            </>
          ) : (
            "Create Shipment"
          )}
        </button>
      </div>

      {message && (
        <div
          className={`mt-4 p-3 rounded-md ${
            message.includes("successfully")
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default WarehouseShipment;
