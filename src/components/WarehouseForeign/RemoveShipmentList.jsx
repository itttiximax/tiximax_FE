// src/Components/Packing/RemoveShipmentList.jsx
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Loader2,
  Eye,
  PackageSearch,
  Calendar,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Package,
  PackageX,
  X,
  CheckCircle,
} from "lucide-react"; // ⟵ ĐÃ bỏ ChevronDown/ChevronUp
import packingsService from "../../Services/Warehouse/packingsService";
import RemoveShipment from "./RemoveShipment";

const RemoveShipmentList = () => {
  const [packings, setPackings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPacking, setSelectedPacking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState({});
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [packingCache, setPackingCache] = useState({});
  const pageSize = 10;

  const fetchAwaiting = async (pageIndex = page) => {
    setLoading(true);
    try {
      const data = await packingsService.getAwaitingFlightOrders(
        pageIndex,
        pageSize
      );
      setPackings(data?.content || []);
      setTotalPages(data?.totalPages || 0);

      if (data?.content?.length > 0) {
        toast.success(`Đã tải ${data.content.length} packing`, {
          icon: "📦",
          duration: 2000,
        });
      }
    } catch {
      toast.error("Không thể tải danh sách awaiting-flight!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAwaiting();
  }, [page]);

  const handleViewDetail = async (packingId) => {
    if (packingCache[packingId]) {
      setSelectedPacking(packingCache[packingId]);
      setShowDetailModal(true);
      return;
    }

    try {
      const data = await packingsService.getPackingById(packingId);
      setSelectedPacking(data);
      setPackingCache((prev) => ({ ...prev, [packingId]: data }));
      setShowDetailModal(true);
    } catch {
      toast.error("Không thể tải chi tiết packing");
    }
  };

  const handleSelectShipment = (packingCode, shipmentCode) => {
    setSelectedShipment((prev) => ({
      ...prev,
      [packingCode]: shipmentCode,
    }));
  };

  const reloadAwaitingList = () => {
    fetchAwaiting(page);
    if (selectedPacking) {
      setPackingCache((prev) => {
        const newCache = { ...prev };
        delete newCache[selectedPacking.packingId];
        return newCache;
      });
      setSelectedPacking(null);
    }
  };

  // Detail Modal Component (Inline)
  const DetailModal = () => {
    if (!showDetailModal || !selectedPacking) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={() => setShowDetailModal(false)}
        />

        {/* Modal */}
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden transform transition-all">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
              <button
                onClick={() => setShowDetailModal(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-200 transition"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold">Chi tiết Packing</h2>
              <p className="text-blue-100 text-sm mt-1">
                #{selectedPacking.packingId}
              </p>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Package className="w-4 h-4" />
                    <span className="text-sm font-medium">Mã Packing</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedPacking.packingCode}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">Ngày Đóng Gói</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(selectedPacking.packedDate).toLocaleString(
                      "vi-VN"
                    )}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Trạng Thái</span>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {selectedPacking.status}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Package className="w-4 h-4" />
                    <span className="text-sm font-medium">Số Shipment</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedPacking.packingList?.length || 0} shipment
                  </p>
                </div>
              </div>

              {/* Shipment List */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Danh Sách Shipment
                </h3>
                <div className="bg-gray-50 rounded-lg border border-gray-200 divide-y divide-gray-200 max-h-64 overflow-y-auto">
                  {selectedPacking.packingList?.map((code, index) => (
                    <div
                      key={code}
                      className="px-4 py-3 hover:bg-gray-100 transition flex items-center justify-between"
                    >
                      <span className="font-mono text-sm font-medium text-gray-900">
                        {code}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                        #{index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t">
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Empty State Component (Inline)
  const EmptyState = () => (
    <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
      <div className="flex justify-center mb-4">
        <div className="bg-gray-100 rounded-full p-6">
          <PackageX className="w-16 h-16 text-gray-400" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Không có dữ liệu
      </h3>
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">
        Không có packing nào trong trạng thái "Awaiting Flight" lúc này.
      </p>
      <button
        onClick={() => fetchAwaiting(page)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition shadow-sm"
      >
        <RefreshCw className="w-4 h-4" />
        Tải lại
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br p-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-lg p-3">
                <PackageSearch className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Quản Lý Packing
                </h1>
              </div>
            </div>
            <button
              onClick={() => fetchAwaiting(page)}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition shadow-sm hover:shadow"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Tải lại
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600 font-medium">Đang tải danh sách...</p>
              <p className="text-sm text-gray-400 mt-1">Vui lòng đợi</p>
            </div>
          </div>
        ) : packings.length > 0 ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Tổng Packing
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {packings.length}
                    </p>
                  </div>
                  <div className="bg-blue-100 rounded-lg p-3">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Trang hiện tại
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {page + 1}/{totalPages}
                    </p>
                  </div>
                  <div className="bg-green-100 rounded-lg p-3">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Đã chọn</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {
                        Object.keys(selectedShipment).filter(
                          (k) => selectedShipment[k]
                        ).length
                      }
                    </p>
                  </div>
                  <div className="bg-purple-100 rounded-lg p-3">
                    <PackageSearch className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Mã Packing
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Ngày Đóng Gói
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Trạng Thái
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Số Shipment
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Hành Động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {packings.map((item, index) => (
                      <tr
                        key={item.packingId}
                        className={`hover:bg-blue-50 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="bg-blue-100 rounded p-2">
                              <Package className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="font-mono font-semibold text-gray-900">
                              {item.packingCode}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {new Date(item.packedDate).toLocaleString("vi-VN")}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            {item.packingList?.length || 0} shipment
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-2">
                            {/* Select & Remove Row */}
                            <div className="flex items-center gap-2">
                              <select
                                value={selectedShipment[item.packingCode] || ""}
                                onChange={(e) =>
                                  handleSelectShipment(
                                    item.packingCode,
                                    e.target.value
                                  )
                                }
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:border-gray-400 transition"
                              >
                                <option value="">-- Chọn shipment --</option>
                                {item.packingList?.map((code) => (
                                  <option key={code} value={code}>
                                    {code}
                                  </option>
                                ))}
                              </select>

                              <RemoveShipment
                                packingCode={item.packingCode}
                                shipmentCodes={
                                  selectedShipment[item.packingCode]
                                    ? [selectedShipment[item.packingCode]]
                                    : []
                                }
                                onSuccess={reloadAwaitingList}
                              />
                            </div>

                            {/* View Detail Button */}
                            <button
                              onClick={() => handleViewDetail(item.packingId)}
                              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition shadow-sm hover:shadow active:scale-95"
                            >
                              <Eye className="w-4 h-4" />
                              Xem chi tiết
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Hiển thị{" "}
                    <span className="font-semibold text-gray-900">
                      {packings.length}
                    </span>{" "}
                    kết quả
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                      disabled={page === 0}
                      className="inline-flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Trước
                    </button>

                    <div className="hidden sm:flex items-center gap-1">
                      {[...Array(Math.min(totalPages, 5))].map((_, idx) => {
                        const pageNum = page < 3 ? idx : page - 2 + idx;
                        if (pageNum >= totalPages) return null;

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                              page === pageNum
                                ? "bg-blue-600 text-white shadow-sm"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {pageNum + 1}
                          </button>
                        );
                      })}
                    </div>

                    <span className="sm:hidden text-sm text-gray-700 font-medium">
                      {page + 1} / {totalPages}
                    </span>

                    <button
                      onClick={() =>
                        setPage((prev) => Math.min(prev + 1, totalPages - 1))
                      }
                      disabled={page === totalPages - 1}
                      className="inline-flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Sau
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Detail Modal */}
      <DetailModal />
    </div>
  );
};

export default RemoveShipmentList;
