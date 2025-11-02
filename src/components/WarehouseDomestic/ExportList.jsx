import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Package2,
  User,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Eye,
  RefreshCw,
  Package,
  MapPin,
  Phone,
  X,
  Truck,
} from "lucide-react";
import domesticService from "../../Services/Warehouse/domesticService";

const ExportList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalOrders, setTotalOrders] = useState(0);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [exporting, setExporting] = useState(false);

  const pageSizeOptions = [10, 20, 30, 50, 100];

  // Load domestic orders with pagination
  const loadOrders = async (page = 0, limit = 20) => {
    setLoading(true);
    setError(null);
    try {
      const response = await domesticService.getDomesticOrders(page, limit);
      if (!response || !Array.isArray(response.content)) {
        throw new Error("Invalid API response format");
      }
      setOrders(response.content || []);
      setTotalOrders(response.totalElements || 0);
      setCurrentPage(page);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Không thể tải danh sách đơn hàng nội địa"
      );
      console.error("Error loading domestic orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn xuất kho tất cả đơn hàng?")) {
      return;
    }

    setExporting(true);
    setError(null);
    try {
      await domesticService.transferToCustomer();
      alert("Xuất kho thành công!");
      // Tự động load lại danh sách
      loadOrders(currentPage, pageSize);
    } catch (err) {
      setError(
        err.response?.data?.message || "Không thể xuất kho. Vui lòng thử lại!"
      );
      console.error("Error exporting orders:", err);
    } finally {
      setExporting(false);
    }
  };

  const getTotalTrackingCodes = (packings) => {
    if (!Array.isArray(packings)) return 0;
    return packings.reduce(
      (sum, packing) => sum + (packing?.trackingCodes?.length || 0),
      0
    );
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  useEffect(() => {
    loadOrders(0, pageSize);
  }, [pageSize]);

  const handlePageChange = (newPage) => {
    loadOrders(newPage, pageSize);
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    setCurrentPage(0);
  };

  // Filter orders based on search term and date
  const filteredOrders = useMemo(() => {
    if (!Array.isArray(orders)) return []; // ← Safe check

    return orders.filter((order) => {
      if (!order) return false; // ← Safe check

      const matchesSearch =
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerPhone?.includes(searchTerm) ||
        (Array.isArray(order.packings) &&
          order.packings.some((packing) =>
            packing?.packingCode
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase())
          ));

      const matchesDate =
        !filterDate || order.createdDate?.split("T")[0] === filterDate;

      return matchesSearch && matchesDate;
    });
  }, [orders, searchTerm, filterDate]);

  const totalPages = Math.ceil(totalOrders / pageSize) || 1; // ← Safe check

  return (
    <div className="min-h-screen p-3">
      <div className="mx-auto">
        {/* ✅ BLUE HEADER */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">
              Đơn Hàng Nội Địa
            </h1>
            <Truck className="w-5 h-5 text-blue-600" />
          </div>
        </div>

        {/* Error Messages */}
        {error && (
          <div className="mb-3 p-2.5 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
            <div className="flex items-center">
              <Eye className="w-4 h-4 text-red-400 mr-2" />

              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* ✅ BLUE CONTROLS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 mb-3">
          <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm tên KH, SĐT, mã packing..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                disabled={loading}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size} / trang
                  </option>
                ))}
              </select>
            </div>

            {/* NÚT XUẤT KHO */}
            <button
              onClick={handleExport}
              disabled={exporting || loading || filteredOrders.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm font-medium text-sm"
            >
              {exporting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Đang xuất kho...
                </>
              ) : (
                <>
                  <Truck className="w-4 h-4" />
                  Xuất Kho
                </>
              )}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="inline-flex items-center px-3 py-2 font-semibold leading-5 text-sm text-blue-600">
              <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" />
              Đang tải dữ liệu...
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredOrders.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <Package2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-medium text-gray-900 mb-2">
              Không có đơn hàng nào
            </h3>
            <p className="text-gray-500 text-sm">
              {searchTerm
                ? "Không tìm thấy kết quả phù hợp."
                : "Hiện tại không có đơn hàng nội địa nào."}
            </p>
            {(searchTerm || filterDate) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterDate("");
                }}
                className="mt-3 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        )}

        {/* ✅ BLUE TABLE */}
        {filteredOrders.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header Info */}
            <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-gray-700">
                  Tổng: {filteredOrders.length} đơn hàng
                </span>
                <span className="text-gray-500">
                  Trang {currentPage + 1} / {totalPages}
                </span>
              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                      #
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Khách Hàng
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        SĐT
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        Số Kiện
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <Package2 className="w-3 h-3" />
                        Tracking
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao Tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order, index) => {
                    const rowNumber = currentPage * pageSize + index + 1;
                    const packings = order?.packings || []; // ← Safe check

                    return (
                      <tr
                        key={index}
                        className="hover:bg-blue-50 transition-colors"
                      >
                        {/* STT */}
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-semibold text-blue-600">
                              {rowNumber}
                            </span>
                          </div>
                        </td>

                        {/* Customer Name */}
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          <span className="text-sm font-semibold text-gray-900">
                            {order?.customerName || "N/A"}
                          </span>
                        </td>

                        {/* Phone */}
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          <span className="text-sm text-gray-700">
                            {order?.customerPhone || "N/A"}
                          </span>
                        </td>

                        {/* Packings Count */}
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          <span className="text-sm font-bold text-blue-600">
                            {packings.length} kiện
                          </span>
                        </td>

                        {/* Total Tracking Codes */}
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          <span className="text-sm font-bold text-blue-600">
                            {getTotalTrackingCodes(packings)} mã
                          </span>
                        </td>

                        {/* View Details Button */}
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          <button
                            onClick={() => handleViewDetails(order)}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all"
                          >
                            <Eye className="w-3 h-3" />
                            Xem
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ✅ BLUE PAGINATION */}
        {filteredOrders.length > 0 && (
          <div className="flex items-center justify-between mt-3 bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-2.5">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentPage === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Trước
            </button>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500">Trang</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
                {currentPage + 1}
              </span>
              <span className="text-xs text-gray-500">/ {totalPages}</span>
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentPage >= totalPages - 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Sau
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* ✅ BLUE MODAL */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                    <Package2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Chi Tiết Đơn Hàng
                    </h3>
                    <p className="text-sm text-blue-100">
                      {selectedOrder?.customerName || "N/A"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* Customer Information */}
              <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  Thông Tin Khách Hàng
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <span className="text-gray-500 text-xs">Tên:</span>
                      <p className="font-semibold text-gray-900">
                        {selectedOrder?.customerName || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <span className="text-gray-500 text-xs">SĐT:</span>
                      <p className="font-semibold text-gray-900">
                        {selectedOrder?.customerPhone || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="md:col-span-2 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <span className="text-gray-500 text-xs">Địa chỉ:</span>
                      <p className="font-semibold text-gray-900">
                        {selectedOrder?.customerAddress !== "string"
                          ? selectedOrder?.customerAddress
                          : "Chưa có địa chỉ"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Packings Summary */}
              <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-600" />
                    Tổng Quan
                  </h4>
                  <div className="flex gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedOrder?.packings?.length || 0}
                      </div>
                      <div className="text-xs text-gray-500">Kiện hàng</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {getTotalTrackingCodes(selectedOrder?.packings)}
                      </div>
                      <div className="text-xs text-gray-500">Mã tracking</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Packings Details */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Package2 className="w-4 h-4 text-blue-600" />
                  Chi Tiết Kiện Hàng ({selectedOrder?.packings?.length ||
                    0}{" "}
                  kiện)
                </h4>
                <div className="space-y-3">
                  {(selectedOrder?.packings || []).map((packing, pIndex) => (
                    <div
                      key={pIndex}
                      className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-blue-600">
                              {pIndex + 1}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-900">
                              {packing?.packingCode || "N/A"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {packing?.trackingCodes?.length || 0} tracking
                              code
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-600 mb-2">
                          Tracking Codes:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(packing?.trackingCodes || []).map(
                            (code, cIndex) => (
                              <span
                                key={cIndex}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-100 text-blue-700 text-xs rounded-lg font-mono font-medium"
                              >
                                <Package className="w-3 h-3" />
                                {code}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end">
                <button
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-all"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportList;
