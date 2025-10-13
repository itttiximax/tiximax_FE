import React, { useState, useEffect } from "react";
import {
  Search,
  Package2,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Eye,
  RefreshCw,
  Package,
} from "lucide-react";
import packingsService from "../../Services/Warehouse/packingsService";

const PackingEligibleList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20); // ✅ Tăng default lên 20
  const [totalOrders, setTotalOrders] = useState(0);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

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
  const getTotalProducts = (trackingCodeToProductCount) => {
    return Object.values(trackingCodeToProductCount).reduce(
      (sum, count) => sum + count,
      0
    );
  };

  // Get tracking codes list
  const getTrackingCodes = (trackingCodeToProductCount) => {
    return Object.keys(trackingCodeToProductCount);
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

  // Filter orders based on search term
  const filteredOrders = orders.filter((order) =>
    order.orderCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(totalOrders / pageSize);

  return (
    <div className="min-h-screen p-3">
      <div className="mx-auto">
        {/* ✅ COMPACT HEADER */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-green-100 rounded-lg">
              <Package2 className="w-4 h-4 text-green-600" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Đơn Hàng Đủ Điều Kiện Đóng Gói
            </h1>
          </div>
          <p className="text-gray-600 ml-7 text-sm">
            Danh sách các đơn hàng sẵn sàng để đóng gói và vận chuyển
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
                  placeholder="Tìm theo mã đơn hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>

              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                disabled={loading}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:bg-gray-100"
              >
                <option value={10}>10 / trang</option>
                <option value={20}>20 / trang</option>
                <option value={30}>30 / trang</option>
                <option value={50}>50 / trang</option>
                <option value={100}>100 / trang</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="inline-flex items-center px-3 py-2 font-semibold leading-5 text-sm text-green-600">
              <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4 text-green-600" />
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
                : "Hiện tại không có đơn hàng nào đủ điều kiện đóng gói."}
            </p>
          </div>
        )}

        {/* ✅ TABLE LAYOUT - COMPACT & SHOW MORE */}
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
                        <ShoppingCart className="w-3 h-3" />
                        Mã Đơn Hàng
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        Tracking Codes
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <Package2 className="w-3 h-3" />
                        Sản Phẩm
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng Thái
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
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
                        className="hover:bg-green-50 transition-colors"
                      >
                        {/* STT */}
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-semibold text-green-600">
                              {currentPage * pageSize + index + 1}
                            </span>
                          </div>
                        </td>

                        {/* Order Code */}
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          <span className="text-sm font-semibold text-gray-900">
                            {order.orderCode}
                          </span>
                        </td>

                        {/* Tracking Codes */}
                        <td className="px-3 py-2.5">
                          <div className="flex flex-wrap gap-1 max-w-md">
                            {trackingCodes.slice(0, 2).map((code) => (
                              <span
                                key={code}
                                className="inline-block px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-medium"
                              >
                                {code}
                              </span>
                            ))}
                            {trackingCodes.length > 2 && (
                              <span className="inline-block px-1.5 py-0.5 bg-gray-200 text-gray-600 text-xs rounded font-medium">
                                +{trackingCodes.length - 2}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Total Products */}
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <span className="text-lg font-bold text-green-600">
                              {totalProducts}
                            </span>
                            <span className="text-xs text-gray-500">SP</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
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
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-semibold">
                {currentPage + 1}
              </span>
              <span className="text-xs text-gray-500">/ {totalPages}</span>
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={orders.length < pageSize}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                orders.length < pageSize
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

export default PackingEligibleList;
