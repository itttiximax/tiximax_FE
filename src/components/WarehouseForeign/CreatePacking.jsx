import React, { useState, useEffect, useRef } from "react";
import {
  Package,
  MapPin,
  Barcode,
  Plus,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  FileText,
} from "lucide-react";
import { createPackingService } from "../../Services/Warehouse/createpackingService";
import managerDestinationService from "../../Services/Manager/managerDestinationService";

const CreatePacking = () => {
  const [destinations, setDestinations] = useState([]);
  const [loadingDestinations, setLoadingDestinations] = useState(true);
  const [formData, setFormData] = useState({
    destinationId: "",
    shipmentCodes: [""],
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const inputRefs = useRef([]);

  useEffect(() => {
    fetchDestinations();
  }, []);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(
      0,
      formData.shipmentCodes.length
    );
  }, [formData.shipmentCodes.length]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const fetchDestinations = async () => {
    try {
      const data = await managerDestinationService.getDestinations();
      setDestinations(data);
    } catch {
      setError("Không thể tải danh sách điểm đến");
    } finally {
      setLoadingDestinations(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleShipmentCodeChange = (index, value) => {
    const newShipmentCodes = [...formData.shipmentCodes];
    newShipmentCodes[index] = value;
    setFormData((prev) => ({ ...prev, shipmentCodes: newShipmentCodes }));
  };

  const addShipmentCode = () => {
    setFormData((prev) => ({
      ...prev,
      shipmentCodes: [...prev.shipmentCodes, ""],
    }));
  };

  const removeShipmentCode = (index) => {
    const newShipmentCodes = formData.shipmentCodes.filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({
      ...prev,
      shipmentCodes: newShipmentCodes.length > 0 ? newShipmentCodes : [""],
    }));
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter" && formData.shipmentCodes[index].trim() !== "") {
      e.preventDefault();
      const nextIndex = index + 1;
      if (nextIndex < formData.shipmentCodes.length) {
        inputRefs.current[nextIndex]?.focus();
      } else {
        addShipmentCode();
        setTimeout(() => inputRefs.current[nextIndex]?.focus(), 0);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const filteredShipmentCodes = formData.shipmentCodes.filter(
        (code) => code.trim() !== ""
      );

      if (filteredShipmentCodes.length === 0) {
        setError("Vui lòng nhập ít nhất một mã vận đơn");
        setLoading(false);
        return;
      }

      const packingData = {
        destinationId: parseInt(formData.destinationId),
        shipmentCodes: filteredShipmentCodes,
      };

      const response = await createPackingService(packingData);
      setResult(response);

      setFormData({
        destinationId: "",
        shipmentCodes: [""],
      });

      setTimeout(() => inputRefs.current[0]?.focus(), 0);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Đã xảy ra lỗi không xác định";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Package className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Đóng hàng</h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-semibold text-gray-800">
                Chi tiết đóng hàng
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Destination Selection */}
              <div>
                <label
                  htmlFor="destinationId"
                  className="block text-2xl font-medium text-black-700 mb-2 flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-blue-500" />
                  Chọn điểm đến <span className="text-red-500">*</span>
                </label>
                {loadingDestinations ? (
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                    <span className="text-gray-500">Đang tải...</span>
                  </div>
                ) : (
                  <select
                    id="destinationId"
                    name="destinationId"
                    value={formData.destinationId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:border-red-600 focus:outline-none"
                  >
                    <option value="">Chọn điểm đến</option>
                    {destinations.map((destination) => (
                      <option
                        key={destination.destinationId}
                        value={destination.destinationId}
                      >
                        {destination.destinationName}
                      </option>
                    ))}
                  </select>
                )}
                {destinations.length === 0 && !loadingDestinations && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-6 h-6" />
                    Không có điểm đến
                  </p>
                )}
              </div>

              {/* Shipment Codes */}
              <div>
                <label className="block text-2xl font-medium text-black-700 mb-2 flex items-center gap-2">
                  <Barcode className="w-4 h-4 text-blue-500" />
                  Mã vận đơn <span className="text-red-500">*</span>
                </label>
                <p className="text-sm font-medium text-black-700 mb-3">
                  Hỗ trợ quét barcode
                </p>
                <div className="space-y-3">
                  {formData.shipmentCodes.map((code, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          ref={(el) => (inputRefs.current[index] = el)}
                          value={code}
                          onChange={(e) =>
                            handleShipmentCodeChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          placeholder={`Mã vận đơn ${index + 1}`}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-red-600 focus:outline-none"
                        />
                      </div>
                      {formData.shipmentCodes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeShipmentCode(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa mã vận đơn"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addShipmentCode}
                    className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Thêm mã vận đơn
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !formData.destinationId}
                className="w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Package className="w-5 h-5" />
                    Tạo đóng gói
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Success Result */}
            {result && (
              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-400">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-800">
                    Hoàn thành đóng gói!
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Packing ID:
                    </span>
                    <span className="font-semibold">{result.packingId}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Barcode className="w-4 h-4" />
                      Packing Code:
                    </span>
                    <span className="font-mono text-blue-600 font-semibold">
                      {result.packingCode}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Flight Code:</span>
                    <span className="font-semibold">
                      {result.flightCode || (
                        <span className="text-yellow-600">Chưa phân</span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Ngày đóng gói:</span>
                    <span className="font-semibold">
                      {new Date(result.packedDate).toLocaleString("vi-VN")}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 block mb-2 font-medium">
                      Danh sách mã vận đơn:
                    </span>
                    <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                      {result.packingList.map((item, index) => (
                        <div
                          key={index}
                          className="font-mono text-sm py-1 flex items-center gap-2"
                        >
                          <Barcode className="w-3 h-3 text-gray-400" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            {!result && !error && (
              <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-400">
                <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Hướng dẫn đóng gói
                </h3>
                <ol className="space-y-3 text-blue-700">
                  <li className="flex items-start gap-2">
                    <span className="font-bold min-w-[20px]">1.</span>
                    <span>Chọn điểm đến từ danh sách thả xuống</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold min-w-[20px]">2.</span>
                    <span>
                      Nhập mã vận đơn thủ công hoặc quét barcode. Nhấn Enter sau
                      mỗi mã để tự động tạo ô mới
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold min-w-[20px]">3.</span>
                    <span>Nhấn "Tạo đóng gói" để hoàn thành</span>
                  </li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePacking;
