import React, { useState, useEffect, useRef } from "react";
import { listShipments } from "../../Services/Warehouse/warehouseShipmentService";
import {
  Package,
  ScanBarcode,
  Trash2,
  Check,
  AlertCircle,
  Clock,
  X,
  Database,
  Upload,
} from "lucide-react";

const ImportPacking = () => {
  const [barcodeInput, setBarcodeInput] = useState("");
  const [scannedItems, setScannedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const inputRef = useRef(null);

  // Auto focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, [scannedItems]);

  // Always focus on input
  useEffect(() => {
    const handleClickAnywhere = () => {
      inputRef.current?.focus();
    };
    document.addEventListener("click", handleClickAnywhere);
    return () => document.removeEventListener("click", handleClickAnywhere);
  }, []);

  // Handle barcode submit (Enter)
  const handleBarcodeSubmit = (e) => {
    e.preventDefault();

    const barcode = barcodeInput.trim();

    if (!barcode) {
      showMessage("warning", "Vui lòng quét mã barcode");
      return;
    }

    // Check duplicate
    const isDuplicate = scannedItems.some((item) => item.barcode === barcode);
    if (isDuplicate) {
      showMessage("warning", `Mã ${barcode} đã tồn tại trong danh sách`);
      setBarcodeInput("");
      return;
    }

    // Add barcode to list
    const newItem = {
      id: Date.now(),
      barcode: barcode,
      timestamp: new Date().toLocaleString("vi-VN"),
    };

    setScannedItems((prev) => [newItem, ...prev]);
    setBarcodeInput("");
    showMessage("success", `Đã thêm mã: ${barcode}`);
  };

  // Remove one item
  const handleRemoveItem = (id) => {
    setScannedItems((prev) => prev.filter((item) => item.id !== id));
    showMessage("info", "Đã xóa mã khỏi danh sách");
  };

  // Clear all
  const handleClearAll = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tất cả mã đã quét?")) {
      setScannedItems([]);
      showMessage("info", "Đã xóa toàn bộ danh sách");
    }
  };

  // Submit data
  const handleSubmit = async () => {
    if (scannedItems.length === 0) {
      showMessage(
        "warning",
        "Danh sách trống. Vui lòng quét mã trước khi import"
      );
      return;
    }

    setIsLoading(true);
    try {
      const shipmentIds = scannedItems.map((item) => item.barcode);
      const response = await listShipments(shipmentIds);

      console.log("API Response:", response);

      showMessage(
        "success",
        `Import thành công ${scannedItems.length} shipment`
      );

      setTimeout(() => {
        setScannedItems([]);
      }, 2000);
    } catch (error) {
      showMessage(
        "error",
        `Lỗi kết nối: ${error.message || "Không thể kết nối đến server"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Show message
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 4000);
  };

  const messageConfig = {
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-800",
      icon: <Check className="w-5 h-5" />,
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-800",
      icon: <AlertCircle className="w-5 h-5" />,
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      icon: <AlertCircle className="w-5 h-5" />,
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
      icon: <Database className="w-5 h-5" />,
    },
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-indigo-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Import Packing
                </h1>
                <p className="text-sm text-gray-500">
                  Quản lý nhập kho shipment
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-md border border-gray-200">
              <Database className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Tổng:{" "}
                <span className="text-indigo-600">{scannedItems.length}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Scan Input Section */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <ScanBarcode className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Quét Barcode Shipment
            </h2>
          </div>

          <form onSubmit={handleBarcodeSubmit}>
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  placeholder="Quét hoặc nhập mã barcode shipment..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  autoComplete="off"
                  autoFocus
                />
                <ScanBarcode className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm"
              >
                <Check className="w-4 h-4" />
                Thêm
              </button>
            </div>
          </form>

          {/* Message Alert */}
          {message.text && (
            <div
              className={`mt-4 px-4 py-3 rounded-md border flex items-center gap-3 ${
                messageConfig[message.type].bg
              } ${messageConfig[message.type].border}`}
            >
              {messageConfig[message.type].icon}
              <span className={`text-sm ${messageConfig[message.type].text}`}>
                {message.text}
              </span>
            </div>
          )}
        </div>

        {/* Items Table Section */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Danh sách Shipment Đã Quét
            </h2>
            {scannedItems.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                Xóa tất cả
              </button>
            )}
          </div>

          {/* Empty State */}
          {scannedItems.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Database className="mx-auto w-12 h-12 text-gray-400 mb-4" />
              <p className="text-sm font-medium text-gray-900 mb-1">
                Chưa có shipment nào
              </p>
              <p className="text-sm text-gray-500">
                Quét barcode để thêm shipment vào danh sách
              </p>
            </div>
          ) : (
            /* Table */
            <div className="overflow-x-auto">
              <table className="w-full min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                      STT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã Shipment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian quét
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {scannedItems.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-900">
                          <Package className="w-4 h-4 text-gray-500" />
                          {item.barcode}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {item.timestamp}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                          title="Xóa"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Action Button */}
        {scannedItems.length > 0 && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-8 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm shadow-md"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang import...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Import {scannedItems.length} Shipment
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportPacking;
