import React, { useState } from "react";
import toast from "react-hot-toast";
import { createShipment } from "../../Services/Warehouse/warehouseShipmentService";
import uploadImageService from "../../Services/uploadImageService";
import imageCompression from "browser-image-compression";

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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deletingImage, setDeletingImage] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleImageUpload = async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      toast.error("File quá lớn. Vui lòng chọn ảnh dưới 3MB");
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

      setFormData((prev) => ({
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
    if (!formData.image) {
      toast.error("Không có ảnh để xóa");
      return;
    }

    try {
      setDeletingImage(true);

      try {
        await uploadImageService.deleteByUrl(formData.image);
        console.log("Đã xóa ảnh từ server thành công");
      } catch (deleteError) {
        console.warn("Không thể xóa ảnh từ server:", deleteError);
      }

      setFormData((prev) => ({
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

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    try {
      // Validation
      if (!shipmentId) {
        setMessage("Vui lòng nhập Shipment ID");
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
      setMessage("Error creating shipment: " + error.message);
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
              placeholder="g"
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
            placeholder="g"
            required
          />
        </div>

        {/* Image Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hình ảnh Shipment
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

              {formData.image && (
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
            {formData.image ? (
              <div className="flex items-center space-x-3">
                <img
                  src={formData.image}
                  alt="Shipment"
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
                  <span>Chưa có ảnh shipment</span>
                  <span className="text-xs text-gray-400">
                    Chọn ảnh để upload (tối đa 3MB)
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || uploadingImage || deletingImage}
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
            message.includes("Error") || message.includes("Vui lòng")
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-green-100 text-green-700 border border-green-300"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default WarehouseShipment;
