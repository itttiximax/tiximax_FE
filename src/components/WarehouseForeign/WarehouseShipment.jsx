// src/Components/Warehouse/WarehouseShipment.jsx
import React, { useState, useRef, useEffect } from "react";
import { createShipment } from "../../Services/Warehouse/warehouseShipmentService";
import UploadImg from "../../common/UploadImg";
import toast from "react-hot-toast";
import { CheckCircle, AlertCircle, Loader2, Box } from "lucide-react";

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

      const successMessage =
        result?.message || result?.data?.message || "Tạo shipment thành công!";

      toast.success(successMessage, {
        duration: 3000,
        style: {
          background: "#ffffff",
          color: "#15803d",
          border: "1px solid #15803d",
          fontSize: "13px",
        },
      });

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
          color: "#b91c1c",
          border: "1px solid #b91c1c",
          fontSize: "13px",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-[70vh]  py-6 px-3 sm:px-4 lg:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Card tổng */}
        <div className="bg-white rounded-2xl shadow-md border border-blue-100">
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-blue-50">
            <div className="p-2.5 bg-blue-100 rounded-full">
              <Box className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-slate-900 leading-tight">
                Nhập kho & cân ký --------- ( Có thể dùng phím Enter nhập nhanh)
              </h1>
              {/* <p className="mt-0.5 text-xl text-black flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                Nhấn <span className="font-semibold">Enter</span> để submit
                nhanh.
              </p> */}
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="px-5 py-5 sm:px-6 sm:py-6 space-y-6"
          >
            {/* Shipment ID */}
            <div className="space-y-1.5">
              <label className="block text-xl font-semibold text-slate-700 flex items-center gap-1.5">
                Mã vận đơn <span className="text-red-500">*</span>
              </label>
              <input
                ref={shipmentInputRef}
                type="text"
                value={shipmentId}
                onChange={(e) => setShipmentId(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ví dụ: SPX123456678"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-xl"
                disabled={loading}
                autoFocus
              />
            </div>

            {/* 2 cột: Kích thước & Trọng lượng + Ảnh */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Kích thước & trọng lượng */}
              <div className="lg:col-span-2 space-y-4">
                {/* Kích thước */}
                <div>
                  <label className="block text-xl font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                    Kích thước (cm)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-2xs font-medium text-black-600 mb-1">
                        Dài <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="length"
                        value={formData.length}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        step="1"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-xs"
                        placeholder="00"
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="block text-2xs font-medium text-black-600 mb-1">
                        Rộng <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="width"
                        value={formData.width}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        step="1"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-xs"
                        placeholder="00"
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="block text-2xs font-medium text-black-600 mb-1">
                        Cao <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        step="1"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-xs"
                        placeholder="00"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Trọng lượng */}
                <div>
                  <label className="block text-xl font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                    Trọng lượng (kg)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-2xs font-medium text--600 mb-1">
                        Tổng trọng lượng <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        step="1"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-xs"
                        placeholder="00"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Ảnh Shipment */}
              <div className="space-y-2.5">
                <UploadImg
                  imageUrl={formData.image}
                  onImageUpload={handleImageUpload}
                  onImageRemove={handleImageRemove}
                  maxSizeMB={3}
                  placeholder="Upload ảnh kiện hàng (tối đa 3MB)."
                />
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-100" />

            {/* Nút submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg text-sm font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang tạo nhập kho...
                </>
              ) : (
                <>Nhập kho</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WarehouseShipment;
