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
} from "lucide-react";
import packingsService from "../../Services/Warehouse/packingsService";

const PackingEligibleList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Load orders with pagination
  const loadOrders = async (page = 0, limit = 10) => {
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
    <div className="min-h-screen p-4 sm:p-6">
      <div className="mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package2 className="w-6 h-6 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Đơn Hàng Đủ Điều Kiện Đóng Gói
            </h1>
          </div>
          <p className="text-gray-600 ml-11">
            Danh sách các đơn hàng sẵn sàng để đóng gói và vận chuyển
          </p>
        </div>

        {/* Error Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
            <div className="flex items-center">
              <Eye className="w-5 h-5 text-red-400 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Controls Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo mã đơn hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                disabled={loading}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
              >
                <option value={5}>5 / trang</option>
                <option value={10}>10 / trang</option>
                <option value={20}>20 / trang</option>
                <option value={50}>50 / trang</option>
                <option value={100}>100 / trang</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm text-green-600">
              <RefreshCw className="animate-spin -ml-1 mr-3 h-5 w-5 text-green-600" />
              Đang tải dữ liệu...
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredOrders.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <Package2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không có đơn hàng nào
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? "Không tìm thấy kết quả phù hợp với từ khóa tìm kiếm."
                : "Hiện tại không có đơn hàng nào đủ điều kiện đóng gói."}
            </p>
          </div>
        )}

        {/* Orders List */}
        {filteredOrders.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* List Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-700">
                    Tổng cộng: {filteredOrders.length} đơn hàng
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Trang {currentPage + 1} / {totalPages}
                </div>
              </div>
            </div>

            {/* List Body */}
            <div className="divide-y divide-gray-200">
              {filteredOrders.map((order, index) => (
                <div
                  key={order.orderCode}
                  className="p-6 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex items-start gap-4">
                    {/* Order Number */}
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-green-600">
                          {currentPage * pageSize + index + 1}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Order Info */}
                      <div className="lg:col-span-1">
                        <div className="flex items-center gap-2 mb-2">
                          <ShoppingCart className="w-4 h-4 text-green-500" />
                          <span className="font-semibold text-gray-900 text-lg">
                            {order.orderCode}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-sm text-green-600 font-medium">
                            Sẵn sàng đóng gói
                          </span>
                        </div>
                      </div>

                      {/* Tracking Codes */}
                      <div className="lg:col-span-1">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Mã tracking:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {getTrackingCodes(order.trackingCodeToProductCount)
                            .slice(0, 3)
                            .map((code) => (
                              <span
                                key={code}
                                className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                              >
                                {code}
                              </span>
                            ))}
                          {getTrackingCodes(order.trackingCodeToProductCount)
                            .length > 3 && (
                            <span className="inline-block px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                              +
                              {getTrackingCodes(
                                order.trackingCodeToProductCount
                              ).length - 3}{" "}
                              mã khác
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Product Summary */}
                      <div className="lg:col-span-1">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Tổng sản phẩm:
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl font-bold text-green-600">
                            {getTotalProducts(order.trackingCodeToProductCount)}
                          </span>
                          <span className="text-sm text-gray-500">
                            sản phẩm
                          </span>
                        </div>

                        {/* Product Details */}
                        <div className="space-y-1">
                          {Object.entries(order.trackingCodeToProductCount)
                            .slice(0, 2)
                            .map(([code, count]) => (
                              <div
                                key={code}
                                className="flex justify-between text-xs text-gray-600"
                              >
                                <span className="truncate max-w-[100px]">
                                  {code}:
                                </span>
                                <span className="font-medium">{count} sp</span>
                              </div>
                            ))}
                          {Object.entries(order.trackingCodeToProductCount)
                            .length > 2 && (
                            <div className="text-xs text-gray-500 italic">
                              +
                              {Object.entries(order.trackingCodeToProductCount)
                                .length - 2}{" "}
                              mã tracking khác
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="flex items-center justify-between mt-6 bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentPage === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Trang trước
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Trang</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg font-semibold">
                {currentPage + 1}
              </span>
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={orders.length < pageSize}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                orders.length < pageSize
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Trang sau
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackingEligibleList;
