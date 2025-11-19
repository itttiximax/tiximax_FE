import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Package2,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Calendar,
  RefreshCw,
  Package,
} from "lucide-react";
import packingsService from "../../Services/Warehouse/packingsService";

const PackingEligibleList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalOrders, setTotalOrders] = useState(0);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const pageSizeOptions = [10, 20, 30, 50, 100];

  // Load orders with pagination
  const loadOrders = async (page = 0, limit = 20) => {
    setLoading(true);
    setError(null);
    try {
      const response = await packingsService.getEligibleOrders(page, limit);
      setOrders(response.content || []);
      setTotalOrders(response.totalElements || 0);
      setCurrentPage(page);
    } catch (err) {
      setError("Không thể tải danh sách đơn hàng");
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total products for an order
  const getTotalProducts = (trackingCodeToProductCount = {}) => {
    return Object.values(trackingCodeToProductCount || {}).reduce(
      (sum, count) => sum + (count || 0),
      0
    );
  };

  // Get tracking codes list
  const getTrackingCodes = (trackingCodeToProductCount = {}) => {
    return Object.keys(trackingCodeToProductCount || {});
  };

  useEffect(() => {
    loadOrders(0, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize]);

  const handlePageChange = (newPage) => {
    loadOrders(newPage, pageSize);
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    setCurrentPage(0);
  };

  // Filter orders based on search term + date (nếu backend trả createdDate)
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (!order) return false;

      const matchesSearch = order.orderCode
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesDate =
        !filterDate || order.createdDate?.split("T")[0] === filterDate;

      return matchesSearch && matchesDate;
    });
  }, [orders, searchTerm, filterDate]);

  const totalPages = Math.ceil(totalOrders / pageSize) || 1;

  return (
    <div className="min-h-screen bg-white p-6">
      <div className=" mx-auto">
        {/* HEADER kiểu ExportList */}
        <div className="bg-blue-600 rounded-xl shadow-sm p-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Package2 size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">
                Đơn Hàng Đủ Điều Kiện Đóng Gói
              </h1>
            </div>
          </div>
        </div>

        {/* Error Messages */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 p-4 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* CONTROLS kiểu ExportList */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm theo mã đơn hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Date Filter */}
              <div className="relative">
                <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Page Size */}
              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                disabled={loading}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
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
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center mb-4">
            <RefreshCw
              size={32}
              className="animate-spin text-blue-600 mx-auto mb-3"
            />
            <p className="text-gray-700 text-sm font-medium">
              Đang tải dữ liệu...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredOrders.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
            <Package2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              Không có đơn hàng nào
            </h3>
            <p className="text-gray-500 text-sm">
              {searchTerm || filterDate
                ? "Không tìm thấy kết quả phù hợp."
                : "Hiện tại không có đơn hàng nào đủ điều kiện đóng gói."}
            </p>
          </div>
        )}

        {/* TABLE kiểu ExportList */}
        {filteredOrders.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {/* Table Header Info */}
            <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-blue-900">
                  Tổng: {filteredOrders.length} đơn hàng
                </span>
                <span className="text-blue-700">
                  Trang {currentPage + 1} / {totalPages}
                </span>
              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-12">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4" />
                        Mã Đơn Hàng
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Tracking Codes
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Package2 className="w-4 h-4" />
                        Sản Phẩm
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Trạng Thái
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredOrders.map((order, index) => {
                    const trackingCodes = getTrackingCodes(
                      order.trackingCodeToProductCount
                    );
                    const totalProducts = getTotalProducts(
                      order.trackingCodeToProductCount
                    );

                    return (
                      <tr
                        key={order.orderCode}
                        className="hover:bg-blue-50/60 transition-colors"
                      >
                        {/* STT */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-semibold text-blue-600">
                              {currentPage * pageSize + index + 1}
                            </span>
                          </div>
                        </td>

                        {/* Order Code */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm font-semibold text-gray-900">
                            {order.orderCode}
                          </span>
                        </td>

                        {/* Tracking Codes */}
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1 max-w-md">
                            {trackingCodes.slice(0, 2).map((code) => (
                              <span
                                key={code}
                                className="inline-block px-1.5 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full font-medium border border-blue-100"
                              >
                                {code}
                              </span>
                            ))}
                            {trackingCodes.length > 2 && (
                              <span className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-medium border border-gray-200">
                                +{trackingCodes.length - 2}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Total Products */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <span className="text-lg font-bold text-blue-600">
                              {totalProducts}
                            </span>
                            <span className="text-xs text-gray-500">SP</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium border border-blue-100">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            Sẵn sàng
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PAGINATION kiểu ExportList */}
        {filteredOrders.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl px-6 py-3 mt-4">
            <div className="flex items-center justify-between text-sm">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  currentPage === 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-blue-50"
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  currentPage >= totalPages - 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-blue-50"
                }`}
              >
                Sau
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackingEligibleList;
