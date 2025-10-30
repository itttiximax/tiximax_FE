import React, { useState, useEffect, useRef } from "react";
import { listShipments } from "../../Services/Warehouse/warehouseShipmentService";
import toast from "react-hot-toast";
import {
  Package,
  ScanBarcode,
  Trash2,
  Check,
  X,
  Database,
  Upload,
  Loader2,
} from "lucide-react";

const ImportPacking = () => {
  const [barcodeInput, setBarcodeInput] = useState("");
  const [scannedItems, setScannedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  // Auto focus input on mount and after scanning
  useEffect(() => {
    inputRef.current?.focus();
  }, [scannedItems]);

  // Always focus on input when clicking anywhere
  useEffect(() => {
    const handleClickAnywhere = () => {
      inputRef.current?.focus();
    };
    document.addEventListener("click", handleClickAnywhere);
    return () => document.removeEventListener("click", handleClickAnywhere);
  }, []);

  // Handle barcode submit (Enter key)
  const handleBarcodeSubmit = (e) => {
    e.preventDefault();

    const barcode = barcodeInput.trim();

    if (!barcode) {
      toast.error("Vui lòng quét mã barcode");
      return;
    }

    // Check duplicate
    const isDuplicate = scannedItems.some((item) => item.barcode === barcode);
    if (isDuplicate) {
      toast.error(`Mã ${barcode} đã tồn tại trong danh sách`, {
        icon: "⚠️",
      });
      setBarcodeInput("");
      return;
    }

    // Add barcode to list
    const newItem = {
      id: Date.now(),
      barcode: barcode,
    };

    setScannedItems((prev) => [newItem, ...prev]);
    setBarcodeInput("");
  };

  // Remove one item
  const handleRemoveItem = (id) => {
    setScannedItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Clear all items
  const handleClearAll = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tất cả mã đã quét?")) {
      setScannedItems([]);
      toast("Đã xóa tất cả", { icon: "🗑️" });
    }
  };

  // Submit data to backend
  const handleSubmit = async () => {
    if (scannedItems.length === 0) {
      toast.error("Danh sách trống. Vui lòng quét mã trước khi import");
      return;
    }

    setIsLoading(true);
    try {
      const shipmentIds = scannedItems.map((item) => item.barcode);
      const response = await listShipments(shipmentIds);

      console.log("API Response:", response);

      // ✅ CRITICAL: Check for errors in response
      // Backend có thể trả về error trong response thành công (status 200)
      const errorMessage =
        response?.error || response?.data?.error || response?.message?.error;

      if (errorMessage) {
        // ✅ Hiển thị lỗi từ backend (ví dụ: "Mục kho đã tồn tại cho mã vận đơn này!")
        toast.error(errorMessage, {
          duration: 4000,
          style: {
            background: "#ebebebff",
            color: "#e43333ff",
            border: "1px solid #f1f1f1ff",
            fontWeight: "500",
          },
        });
        return;
      }

      // ✅ Show success message
      const successMessage =
        response?.message ||
        response?.data?.message ||
        `✅ Đã import ${scannedItems.length} shipment thành công`;

      toast.success(successMessage, {
        duration: 3000,
        icon: "✅",
        style: {
          background: "#D1FAE5",
          color: "#065F46",
          border: "1px solid #6EE7B7",
          fontWeight: "500",
        },
      });

      // Clear list after 2 seconds
      setTimeout(() => {
        setScannedItems([]);
      }, 2000);
    } catch (error) {
      console.error("Import error:", error);

      // ✅ Xử lý lỗi từ catch block (network error, 4xx, 5xx)
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.response?.data?.detail ||
        error.message ||
        "Không thể kết nối đến server";

      toast.error(errorMessage, {
        duration: 4000,
        style: {
          background: "#fddfdfff",
          color: "#ee3131ff",
          border: "1px solid #f0eeeeff",
          fontWeight: "400",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-slate-700 rounded-lg">
                <Package className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-base font-semibold text-gray-900">
                  Import Packing
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-md border border-gray-300">
              <Database className="w-3.5 h-3.5 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">
                Tổng:{" "}
                <span className="font-semibold text-slate-900">
                  {scannedItems.length}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Scan Input Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <ScanBarcode className="w-4 h-4 text-gray-600" />
            <h2 className="text-sm font-semibold text-gray-900">
              Quét Barcode
            </h2>
          </div>

          <form onSubmit={handleBarcodeSubmit}>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  placeholder="Quét hoặc nhập mã barcode shipment..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500 text-sm"
                  autoComplete="off"
                  autoFocus
                />
                <ScanBarcode className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-slate-700 text-white rounded-md text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                Thêm
              </button>
            </div>
          </form>
        </div>

        {/* Items Table Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-900">
              Danh sách Shipment
            </h2>
            {scannedItems.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-xs font-medium text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Xóa tất cả
              </button>
            )}
          </div>

          {/* Empty State */}
          {scannedItems.length === 0 ? (
            <div className="text-center py-8 px-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg mb-3">
                <Database className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-700 mb-0.5">
                Chưa có shipment nào
              </p>
              <p className="text-xs text-gray-500">
                Quét barcode để thêm vào danh sách
              </p>
            </div>
          ) : (
            /* Table */
            <div className="overflow-x-auto">
              <table className="w-full min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-12">
                      STT
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Mã Shipment
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-600 uppercase tracking-wider w-16">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {scannedItems.map((item, index) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-2.5 whitespace-nowrap text-xs text-gray-700 font-medium">
                        {index + 1}
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs text-gray-900 font-medium">
                          <Package className="w-3.5 h-3.5 text-gray-500" />
                          {item.barcode}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="inline-flex items-center justify-center w-6 h-6 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          title="Xóa"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Submit Button */}
        {scannedItems.length > 0 && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-5 py-2 bg-slate-700 text-white rounded-md text-sm font-medium hover:bg-slate-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Đang import...
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
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
