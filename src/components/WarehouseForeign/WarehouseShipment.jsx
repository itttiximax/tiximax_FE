import React, { useState, useRef, useEffect } from "react";
import { createShipment } from "../../Services/Warehouse/warehouseShipmentService";
import UploadImg from "../../common/UploadImg";
import toast from "react-hot-toast";
import { Loader2, Package } from "lucide-react";

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

    if (["length", "width", "height", "weight"].includes(name)) {
      const regex = /^\d*\.?\d*$/;
      if (!regex.test(value)) {
        return;
      }
    }

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
      toast.error("Vui lòng nhập Mã vận đơn");
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
    const loadingToast = toast.loading("Đang nhập kho...");

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
        result?.message || result?.data?.message || "Nhập kho thành công!";

      toast.success(successMessage);

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

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.response?.data?.detail ||
        error.message ||
        "Không thể nhập kho";

      toast.error(errorMessage);
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
    <div className="p-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-blue-600 rounded-xl shadow-sm p-5 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Package size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">
                Nhập Kho & Cân Ký
              </h1>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Mã vận đơn */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã vận đơn <span className="text-red-500">*</span>
              </label>
              <input
                ref={shipmentInputRef}
                type="text"
                value={shipmentId}
                onChange={(e) => setShipmentId(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ví dụ: SPX123456678"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                disabled={loading}
                autoFocus
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Kích thước & trọng lượng */}
              <div className="lg:col-span-2 space-y-4">
                {/* Kích thước */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kích thước (cm)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Dài <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="length"
                        value={formData.length}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="0"
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Rộng <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="width"
                        value={formData.width}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="0"
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Cao <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="height"
                        value={formData.height}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="0"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Trọng lượng */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trọng lượng (kg)
                  </label>
                  <div className="max-w-xs">
                    <label className="block text-xs text-gray-600 mb-1">
                      Tổng trọng lượng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="0"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Ảnh */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ảnh kiện hàng
                </label>
                <UploadImg
                  imageUrl={formData.image}
                  onImageUpload={handleImageUpload}
                  onImageRemove={handleImageRemove}
                  maxSizeMB={3}
                  placeholder="Tải ảnh (tối đa 3MB)"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang nhập kho...
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
