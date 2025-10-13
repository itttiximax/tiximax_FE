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
} from "lucide-react";
import domesticService from "../../Services/Warehouse/domesticService";

const ExportList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20); // ✅ Tăng default lên 20
  const [totalOrders, setTotalOrders] = useState(0);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [expandedRows, setExpandedRows] = useState({}); // Track expanded rows

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
      setOrders(response.content);
      setTotalOrders(response.totalElements || 0);
      setCurrentPage(page);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Không thể tải danh sách đơn hàng nội địa"
      );
      console.error("Error loading domestic orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Get total tracking codes for all packings
  const getTotalTrackingCodes = (packings) => {
    return packings.reduce(
      (sum, packing) => sum + packing.trackingCodes.length,
      0
    );
  };

  // Toggle row expansion
  const toggleRow = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
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
    return orders.filter((order) => {
      const matchesSearch =
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerPhone.includes(searchTerm) ||
        order.packings.some((packing) =>
          packing.packingCode.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesDate =
        !filterDate || order.createdDate?.split("T")[0] === filterDate;

      return matchesSearch && matchesDate;
    });
  }, [orders, searchTerm, filterDate]);

  const totalPages = Math.ceil(totalOrders / pageSize);

  return (
    <div className="min-h-screen p-3">
      <div className="mx-auto">
        {/* ✅ COMPACT HEADER */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-purple-100 rounded-lg">
              <Package2 className="w-4 h-4 text-purple-600" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Đơn Hàng Nội Địa
            </h1>
          </div>
          <p className="text-gray-600 ml-7 text-sm">
            Danh sách các đơn hàng nội địa đã được giao đến kho
          </p>
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

        {/* ✅ COMPACT CONTROLS */}
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
                  className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                disabled={loading}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:bg-gray-100"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size} / trang
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="inline-flex items-center px-3 py-2 font-semibold leading-5 text-sm text-purple-600">
              <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4 text-purple-600" />
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
                className="mt-3 px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        )}

        {/* ✅ TABLE LAYOUT - COMPACT & EXPANDABLE */}
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

            {/* ✅ TABLE */}
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
                      Chi Tiết
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order, index) => {
                    const isExpanded = expandedRows[index];
                    const rowNumber = currentPage * pageSize + index + 1;

                    return (
                      <React.Fragment key={index}>
                        {/* Main Row */}
                        <tr className="hover:bg-purple-50 transition-colors">
                          {/* STT */}
                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-semibold text-purple-600">
                                {rowNumber}
                              </span>
                            </div>
                          </td>

                          {/* Customer Name */}
                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <span className="text-sm font-semibold text-gray-900">
                              {order.customerName}
                            </span>
                          </td>

                          {/* Phone */}
                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <span className="text-sm text-gray-700">
                              {order.customerPhone}
                            </span>
                          </td>

                          {/* Packings Count */}
                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <span className="text-sm font-bold text-purple-600">
                              {order.packings.length} kiện
                            </span>
                          </td>

                          {/* Total Tracking Codes */}
                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <span className="text-sm font-bold text-blue-600">
                              {getTotalTrackingCodes(order.packings)} mã
                            </span>
                          </td>

                          {/* Expand Button */}
                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <button
                              onClick={() => toggleRow(index)}
                              className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-purple-600 hover:bg-purple-100 rounded transition-all"
                            >
                              {isExpanded ? (
                                <>
                                  <Eye className="w-3 h-3" />
                                  Ẩn
                                </>
                              ) : (
                                <>
                                  <Eye className="w-3 h-3" />
                                  Xem
                                </>
                              )}
                            </button>
                          </td>
                        </tr>

                        {/* ✅ EXPANDED ROW - Show Details */}
                        {isExpanded && (
                          <tr className="bg-purple-50">
                            <td colSpan="6" className="px-3 py-3">
                              <div className="space-y-3">
                                {/* Customer Details */}
                                <div className="bg-white rounded-lg p-3 border border-purple-200">
                                  <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    Thông tin khách hàng
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                    <div>
                                      <span className="text-gray-500">
                                        Tên:{" "}
                                      </span>
                                      <span className="font-medium text-gray-900">
                                        {order.customerName}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">
                                        SĐT:{" "}
                                      </span>
                                      <span className="font-medium text-gray-900">
                                        {order.customerPhone}
                                      </span>
                                    </div>
                                    <div className="md:col-span-2">
                                      <span className="text-gray-500">
                                        Địa chỉ:{" "}
                                      </span>
                                      <span className="font-medium text-gray-900">
                                        {order.customerAddress !== "string"
                                          ? order.customerAddress
                                          : "Chưa có địa chỉ"}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Packings Details */}
                                <div className="bg-white rounded-lg p-3 border border-purple-200">
                                  <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                    <Package className="w-3 h-3" />
                                    Chi tiết kiện hàng ({
                                      order.packings.length
                                    }{" "}
                                    kiện)
                                  </h4>
                                  <div className="space-y-2">
                                    {order.packings.map((packing, pIndex) => (
                                      <div
                                        key={pIndex}
                                        className="flex items-start justify-between p-2 bg-gray-50 rounded border border-gray-200"
                                      >
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-semibold text-purple-600">
                                              {packing.packingCode}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                              ({packing.trackingCodes.length}{" "}
                                              tracking)
                                            </span>
                                          </div>
                                          <div className="flex flex-wrap gap-1">
                                            {packing.trackingCodes.map(
                                              (code, cIndex) => (
                                                <span
                                                  key={cIndex}
                                                  className="inline-block px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-mono"
                                                >
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
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ✅ COMPACT PAGINATION */}
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
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-semibold">
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
    </div>
  );
};

export default ExportList;
