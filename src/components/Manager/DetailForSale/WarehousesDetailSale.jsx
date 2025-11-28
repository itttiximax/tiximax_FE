import React, { useState } from "react";
import { X, Package } from "lucide-react";

const WarehousesDetailSale = ({ warehouses, onClose }) => {
  const [previewImage, setPreviewImage] = useState(null);

  const getStatusDisplay = (status) => {
    const statusMap = {
      CHO_NHAP_KHO: {
        label: "Chờ nhập kho",
        className: "bg-yellow-100 text-yellow-800",
      },
      DA_NHAP_KHO: {
        label: "Đã nhập kho",
        className: "bg-green-100 text-green-800",
      },
      DA_XUAT_KHO: {
        label: "Đã xuất kho",
        className: "bg-blue-100 text-blue-800",
      },
      DANG_VAN_CHUYEN: {
        label: "Đang vận chuyển",
        className: "bg-purple-100 text-purple-800",
      },
      DA_GIAO: {
        label: "Đã giao",
        className: "bg-emerald-100 text-emerald-800",
      },
    };
    return (
      statusMap[status] || {
        label: status,
        className: "bg-gray-100 text-gray-800",
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b bg-orange-50">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-semibold">Chi tiết kho hàng</h3>
            <span className="text-sm text-gray-600">
              ({warehouses.length} kiện)
            </span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-orange-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
          {warehouses.map((warehouse) => {
            const statusInfo = getStatusDisplay(warehouse.status);
            return (
              <div
                key={warehouse.warehouseId}
                className="mb-4 border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-semibold text-lg text-orange-600">
                      {warehouse.trackingCode}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(warehouse.createdAt).toLocaleString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusInfo.className}`}
                  >
                    {statusInfo.label}
                  </span>
                </div>

                {/* Images */}
                <div className="flex gap-2 mb-3">
                  {warehouse.image && (
                    <div>
                      <div className="text-xs text-gray-600 mb-1">
                        Hình ảnh:
                      </div>
                      <img
                        src={warehouse.image}
                        alt="Warehouse"
                        className="w-32 h-32 object-cover rounded border cursor-pointer hover:border-orange-500 hover:shadow-md transition-all"
                        onClick={() => setPreviewImage(warehouse.image)}
                      />
                    </div>
                  )}
                  {warehouse.imageCheck && (
                    <div>
                      <div className="text-xs text-gray-600 mb-1">
                        Hình kiểm tra:
                      </div>
                      <img
                        src={warehouse.imageCheck}
                        alt="Check"
                        className="w-32 h-32 object-cover rounded border cursor-pointer hover:border-orange-500 hover:shadow-md transition-all"
                        onClick={() => setPreviewImage(warehouse.imageCheck)}
                      />
                    </div>
                  )}
                </div>

                {/* Dimensions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                  <div className="bg-white p-2 rounded border">
                    <div className="text-gray-600 text-xs">Dài</div>
                    <div className="font-medium">{warehouse.length} cm</div>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <div className="text-gray-600 text-xs">Rộng</div>
                    <div className="font-medium">{warehouse.width} cm</div>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <div className="text-gray-600 text-xs">Cao</div>
                    <div className="font-medium">{warehouse.height} cm</div>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <div className="text-gray-600 text-xs">DIM</div>
                    <div className="font-medium">{warehouse.dim}</div>
                  </div>
                </div>

                {/* Weight */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-white p-2 rounded border">
                    <div className="text-gray-600 text-xs">Cân nặng</div>
                    <div className="font-bold text-orange-600">
                      {warehouse.weight} kg
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <div className="text-gray-600 text-xs">Cân thực</div>
                    <div className="font-bold text-orange-600">
                      {warehouse.netWeight} kg
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 z-[70] flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors flex items-center gap-2 bg-black/50 px-3 py-2 rounded-lg"
            >
              <span className="text-sm font-medium">Close</span>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[85vh] rounded-lg shadow-2xl border-4 border-white"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehousesDetailSale;
