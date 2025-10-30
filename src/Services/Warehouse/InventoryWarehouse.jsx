// src/Components/Warehouse/InventoryWarehouse.jsx
import React, { useState, useRef, useEffect } from "react";
import warehouseService from "../../Services/Warehouse/warehouseService";
import UploadImg from "../../common/UploadImg";
import toast, { Toaster } from "react-hot-toast";
import {
  Package,
  ScanBarcode,
  Ruler,
  Weight,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  X,
  ChevronLeft,
  Loader2,
  AlertTriangle,
  Image as ImageIcon,
} from "lucide-react";

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
      const errorMsg = "Vui lòng nhập mã warehouse";
      setError(errorMsg);
      toast.error(errorMsg);
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
        setError(errorMsg);
        toast.error(errorMsg, {
          icon: "⚠️",
          duration: 4000,
        });
        setWarehouseCode("");
        scanInputRef.current?.focus();
        return;
      }

      // Chưa được cân ký -> Cho phép update
      setStep(2);
      const successMsg = `Mã warehouse "${code}" hợp lệ. Nhập thông số bên dưới.`;
      setSuccess(successMsg);
      toast.success(successMsg, {
        icon: "✅",
        duration: 3000,
      });
    } catch (err) {
      // ✅ Error handling đầy đủ từ Backend
      const errorMsg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        "Không thể kiểm tra warehouse. Vui lòng thử lại.";

      setError(errorMsg);
      toast.error(errorMsg, {
        icon: "❌",
        duration: 4000,
        style: {
          background: "#FEE2E2",
          color: "#991B1B",
          border: "1px solid #FCA5A5",
        },
      });
      setWarehouseCode("");
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
      setSuccess(successMsg);
      toast.success(successMsg, {
        duration: 3000,
        style: {
          background: "#ffffffff",
          color: "#0da33fff",
          border: "1px solid #ecececff",
          fontWeight: "500",
        },
      });

      // Reset form sau 2s
      setTimeout(() => {
        handleReset();
      }, 2000);
    } catch (err) {
      toast.dismiss(loadingToast);

      // ✅ Error handling đầy đủ từ Backend
      const errorMsg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        "Không thể cập nhật thông tin warehouse";

      setError(errorMsg);
      toast.error(errorMsg, {
        duration: 4000,
        style: {
          background: "#FEE2E2",
          color: "#e23333ff",
          border: "1px solid #ffffffff",
          fontWeight: "500",
        },
      });
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
    <div className="min-h-screen  py-8 px-4">
      <Toaster position="top-right" />

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Cập Nhật Warehouse Package
              </h1>
            </div>
          </div>
        </div>

        {/* Error & Success Messages */}
        {error && (
          <div
            className={`mb-4 p-4 rounded-lg flex items-start gap-3 ${
              isWeighed
                ? "bg-yellow-50 border border-yellow-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            {isWeighed ? (
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <span
              className={`text-sm ${
                isWeighed ? "text-yellow-800" : "text-red-700"
              }`}
            >
              {error}
            </span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-green-700">{success}</span>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-md p-6">
          {/* STEP 1: Nhập/Scan Warehouse Code */}
          {step === 1 && (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <ScanBarcode className="w-4 h-4 text-blue-500" />
                  Mã Warehouse <span className="text-red-500">*</span>
                </label>
                <div className="relative">
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
                    placeholder="Quét mã hoặc nhập thủ công..."
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-all"
                    autoFocus
                  />
                  <ScanBarcode className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Quét mã bằng máy quét hoặc nhấn Enter để kiểm tra
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !warehouseCode.trim()}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Đang kiểm tra...
                  </>
                ) : (
                  <>
                    Kiểm tra & Tiếp tục
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* Warning nếu đã được cân ký */}
              {isWeighed && (
                <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">
                        Warehouse này đã hoàn tất cân ký
                      </p>
                      <p className="mt-1 text-xs text-yellow-700">
                        Bạn không thể chỉnh sửa thông tin sau khi đã được cân
                        ký. Vui lòng quét mã khác hoặc liên hệ quản trị viên nếu
                        cần thay đổi.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </form>
          )}

          {/* STEP 2: Nhập Thông Số */}
          {step === 2 && (
            <form onSubmit={handleUpdatePackage} className="space-y-6">
              {/* Warehouse Code Display */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  <div>
                    <span className="text-xs text-gray-600">Mã warehouse:</span>
                    <p className="font-semibold text-blue-700">
                      {warehouseCode}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleBack}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Đổi mã
                </button>
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
                      step="0.01"
                      value={formData.length}
                      onChange={(e) =>
                        handleInputChange("length", e.target.value)
                      }
                      placeholder="0.00"
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Rộng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.width}
                      onChange={(e) =>
                        handleInputChange("width", e.target.value)
                      }
                      placeholder="0.00"
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Cao <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.height}
                      onChange={(e) =>
                        handleInputChange("height", e.target.value)
                      }
                      placeholder="0.00"
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
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

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-gray-600" />
                  Hình ảnh Package
                </label>
                <UploadImg
                  imageUrl={formData.image}
                  onImageUpload={handleImageUpload}
                  onImageRemove={handleImageRemove}
                  required={false}
                  maxSizeMB={3}
                  placeholder="Chưa có ảnh package"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={loading}
                  className="flex-1 bg-gray-200 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-2.5 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang cập nhật...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Cập nhật
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryWarehouse;
