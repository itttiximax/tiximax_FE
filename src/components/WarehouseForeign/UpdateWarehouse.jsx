import React, { useState, useEffect } from "react";
import { X, Package } from "lucide-react";
import warehouseService from "../../Services/Warehouse/warehouseService";
import UploadImg from "../../common/UploadImg";
import toast from "react-hot-toast";

const UpdateWarehouse = ({ isOpen, onClose, warehouseData, onSuccess }) => {
  const [formData, setFormData] = useState({
    length: "",
    width: "",
    height: "",
    weight: "",
    image: "",
    imageCheck: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchingData, setFetchingData] = useState(false);

  useEffect(() => {
    if (isOpen && warehouseData?.warehouseId) {
      fetchFullWarehouseData();
    }
  }, [isOpen, warehouseData]);

  const fetchFullWarehouseData = async () => {
    try {
      setFetchingData(true);
      const data = await warehouseService.getWarehouseById(
        warehouseData.warehouseId
      );

      setFormData({
        length: data.length || "",
        width: data.width || "",
        height: data.height || "",
        weight: data.weight || "",
        image: data.image || "",
        imageCheck: data.imageCheck || "",
      });
      setError("");
    } catch (err) {
      console.error("Error fetching warehouse data:", err);
      toast.error("Unable to load warehouse information");
      setError("Unable to load warehouse information");
    } finally {
      setFetchingData(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleImageUpload = (imageUrl) => {
    setFormData((prev) => ({ ...prev, image: imageUrl }));
  };

  const handleImageRemove = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  const handleImageCheckUpload = (imageUrl) => {
    setFormData((prev) => ({ ...prev, imageCheck: imageUrl }));
  };

  const handleImageCheckRemove = () => {
    setFormData((prev) => ({ ...prev, imageCheck: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.length ||
      !formData.width ||
      !formData.height ||
      !formData.weight
    ) {
      setError("Please enter complete dimension and weight information");
      return;
    }

    try {
      setLoading(true);
      await warehouseService.patchWarehousePackage(warehouseData.trackingCode, {
        length: parseFloat(formData.length),
        width: parseFloat(formData.width),
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        image: formData.image,
        imageCheck: formData.imageCheck,
      });

      toast.success("Update successful!");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Update failed";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              Update Warehouse
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Loading State */}
        {fetchingData ? (
          <div className="p-10 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Warehouse Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tracking Code
                </label>
                <input
                  type="text"
                  value={warehouseData?.trackingCode || ""}
                  disabled
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Code
                </label>
                <input
                  type="text"
                  value={warehouseData?.orderCode || "-"}
                  disabled
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Current Info Display */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-3">
                Recent Warehouse Information
              </h3>
              <div className="grid grid-cols-4 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Length:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {warehouseData?.length || "-"} cm
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Width:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {warehouseData?.width || "-"} cm
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Height:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {warehouseData?.height || "-"} cm
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Weight:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {warehouseData?.weight || "-"} kg
                  </span>
                </div>
              </div>
            </div>

            {/* Dimensions */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Length (cm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="length"
                  value={formData.length}
                  onChange={handleInputChange}
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Width (cm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="width"
                  value={formData.width}
                  onChange={handleInputChange}
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="Enter width"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (cm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="Enter height"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="Enter weight"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Main Image */}
              <UploadImg
                imageUrl={formData.image}
                onImageUpload={handleImageUpload}
                onImageRemove={handleImageRemove}
                label="Main Image"
                placeholder="No main image yet"
                maxSizeMB={5}
              />

              {/* Check Image */}
              <UploadImg
                imageUrl={formData.imageCheck}
                onImageUpload={handleImageCheckUpload}
                onImageRemove={handleImageCheckRemove}
                label="Check Image"
                placeholder="No check image yet"
                maxSizeMB={5}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  "Update"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateWarehouse;
