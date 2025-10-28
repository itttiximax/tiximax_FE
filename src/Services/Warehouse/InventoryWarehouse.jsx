// src/Components/Warehouse/InventoryWarehouse.jsx
import React, { useState, useRef, useEffect } from "react";
import warehouseService from "../../Services/Warehouse/warehouseService";
import UploadImg from "../../common/UploadImg";
import toast, { Toaster } from "react-hot-toast";

const InventoryWarehouse = () => {
  // Step control
  const [step, setStep] = useState(1);

  // Form data
  const [warehouseCode, setWarehouseCode] = useState("");
  const [formData, setFormData] = useState({
    length: "",
    width: "",
    height: "",
    weight: "",
    image: "",
  });

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isWeighed, setIsWeighed] = useState(false);

  // Ref for auto-focus
  const scanInputRef = useRef(null);

  // Auto focus khi mount hoặc quay về step 1
  useEffect(() => {
    if (step === 1) {
      scanInputRef.current?.focus();
    }
  }, [step]);

  // Step 1: Verify warehouse code và check net weight
  const handleVerifyCode = async (e) => {
    if (e) e.preventDefault();

    const code = warehouseCode.trim();

    if (!code) {
      setError("Vui lòng nhập mã warehouse");
      toast.error("Vui lòng nhập mã warehouse");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setIsWeighed(false);

    try {
      // Check xem đã được cân ký chưa
      const hasBeenWeighed = await warehouseService.checkNetWeight(code);

      if (hasBeenWeighed === true) {
        // Đã được cân ký -> KHÔNG cho update
        setIsWeighed(true);
        const errorMsg = `Warehouse "${code}" đã được cân ký. Không thể cập nhật!`;
        setError(`⚠️ ${errorMsg}`);
        toast.error(errorMsg);
        setWarehouseCode(""); // Clear để quét mã khác
        scanInputRef.current?.focus();
        return;
      }

      // Chưa được cân ký -> Cho phép update
      setStep(2);
      const successMsg = `Mã warehouse "${code}" hợp lệ. Nhập thông số bên dưới.`;
      setSuccess(`✓ ${successMsg}`);
      toast.success(successMsg);
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err.message ||
        "Không thể kiểm tra warehouse. Vui lòng thử lại.";
      setError(errorMsg);
      toast.error(errorMsg);
      setWarehouseCode(""); // Clear để quét mã khác
      scanInputRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key từ máy quét
  const handleScanKeyDown = (e) => {
    if (e.key === "Enter" && warehouseCode.trim()) {
      e.preventDefault();
      handleVerifyCode();
    }
  };

  // Step 2: Update warehouse package
  const handleUpdatePackage = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    const { length, width, height, weight } = formData;

    if (
      [length, width, height, weight].some(
        (v) => !v || isNaN(Number(v)) || Number(v) <= 0
      )
    ) {
      const errorMsg =
        "Vui lòng nhập đầy đủ kích thước và trọng lượng (phải là số dương)";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Đang cập nhật...");

    try {
      await warehouseService.updateWarehousePackage(warehouseCode, {
        length: Number(length),
        width: Number(width),
        height: Number(height),
        weight: Number(weight),
        image: formData.image || "",
      });

      toast.dismiss(loadingToast);
      const successMsg = "Cập nhật thông tin warehouse package thành công!";
      setSuccess(`✓ ${successMsg}`);
      toast.success(successMsg);

      // Reset form sau 2s
      setTimeout(() => {
        handleReset();
      }, 2000);
    } catch (err) {
      toast.dismiss(loadingToast);
      const errorMsg =
        err?.response?.data?.message ||
        err.message ||
        "Không thể cập nhật thông tin warehouse";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  // Handle image upload
  const handleImageUpload = (imageUrl) => {
    setFormData((prev) => ({ ...prev, image: imageUrl }));
  };

  // Handle image remove
  const handleImageRemove = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  // Reset form
  const handleReset = () => {
    setStep(1);
    setWarehouseCode("");
    setFormData({
      length: "",
      width: "",
      height: "",
      weight: "",
      image: "",
    });
    setError("");
    setSuccess("");
    setIsWeighed(false);
  };

  // Go back to step 1
  const handleBack = () => {
    setStep(1);
    setError("");
    setSuccess("");
  };

  return (
    <>
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#ffffff",
            color: "#222121",
          },
          success: {
            style: {
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
            },
          },
          error: {
            style: {
              background: "#fef2f2",
              border: "1px solid #fecaca",
            },
          },
        }}
      />

      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          📦 Cập Nhật Thông Tin Warehouse Package
        </h2>

        {/* Error & Success Messages */}
        {error && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm ${
              isWeighed
                ? "bg-yellow-50 border border-yellow-300 text-yellow-800"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {success}
          </div>
        )}

        {/* STEP 1: Nhập/Scan Warehouse Code */}
        {step === 1 && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã Warehouse (Scan hoặc nhập){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                ref={scanInputRef}
                type="text"
                value={warehouseCode}
                onChange={(e) => {
                  setWarehouseCode(e.target.value);
                  setError("");
                  setIsWeighed(false);
                }}
                onKeyDown={handleScanKeyDown}
                placeholder="Quét mã hoặc nhập thủ công (Enter để tiếp tục)"
                disabled={loading}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-all"
                autoFocus
              />
              <p className="mt-2 text-xs text-gray-500">
                💡 <strong>Tip:</strong> Quét mã bằng máy quét → Tự động kiểm
                tra. Hệ thống sẽ kiểm tra xem warehouse đã được cân ký hay chưa.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !warehouseCode.trim()}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang kiểm tra...
                </span>
              ) : (
                "Kiểm tra & Tiếp tục →"
              )}
            </button>

            {/* Hiển thị warning nếu đã được cân ký */}
            {isWeighed && (
              <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-yellow-800">
                      Warehouse này đã hoàn tất cân ký
                    </p>
                    <p className="mt-1 text-xs text-yellow-700">
                      Bạn không thể chỉnh sửa thông tin sau khi đã được cân ký.
                      Vui lòng quét mã khác hoặc liên hệ quản trị viên nếu cần
                      thay đổi.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </form>
        )}

        {/* STEP 2: Nhập Thông Số */}
        {step === 2 && (
          <form onSubmit={handleUpdatePackage} className="space-y-4">
            {/* Hiển thị mã warehouse */}
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <span className="text-sm text-gray-600">Mã warehouse:</span>
              <span className="ml-2 font-semibold text-blue-700">
                {warehouseCode}
              </span>
              <button
                type="button"
                onClick={handleBack}
                className="ml-4 text-sm text-blue-600 hover:underline"
              >
                ← Đổi mã
              </button>
            </div>

            {/* Dimensions Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chiều dài (cm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.length}
                  onChange={(e) => handleInputChange("length", e.target.value)}
                  placeholder="0.00"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chiều rộng (cm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.width}
                  onChange={(e) => handleInputChange("width", e.target.value)}
                  placeholder="0.00"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chiều cao (cm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.height}
                  onChange={(e) => handleInputChange("height", e.target.value)}
                  placeholder="0.00"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trọng lượng (kg) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  placeholder="0.00"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* Image Upload Component */}
            <UploadImg
              imageUrl={formData.image}
              onImageUpload={handleImageUpload}
              onImageRemove={handleImageRemove}
              label="Hình ảnh Package"
              required={false}
              maxSizeMB={3}
              placeholder="Chưa có ảnh package"
              className="mt-4"
            />

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? "Đang cập nhật..." : "✓ Cập nhật"}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default InventoryWarehouse;
