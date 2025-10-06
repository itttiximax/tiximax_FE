import React, { useState, useEffect } from "react";
import {
  Search,
  Package2,
  User,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Eye,
  RefreshCw,
} from "lucide-react";
import domesticService from "../../Services/Warehouse/domesticService";

const ExportList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Load domestic orders with pagination
  const loadOrders = async (page = 0, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await domesticService.getDomesticOrders(page, limit);
      setOrders(response.content || []);
      setTotalOrders(response.totalElements || 0);
      setCurrentPage(page);
    } catch (err) {
      setError("Không thể tải danh sách đơn hàng nội địa");
      console.error("Error loading domestic orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Get total tracking codes for a packing
  const getTotalTrackingCodes = (packings) => {
    return packings.reduce(
      (sum, packing) => sum + packing.trackingCodes.length,
      0
    );
  };

  // Get all packing codes
  const getPackingCodes = (packings) => {
    return packings.map((packing) => packing.packingCode);
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
  const filteredOrders = orders.filter(
    (order) =>
      (order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getPackingCodes(order.packings).some((code) =>
          code.toLowerCase().includes(searchTerm.toLowerCase())
        )) &&
      // Note: Add date filtering if API returns a date field (e.g., createdDate)
      !filterDate /* || order.createdDate?.split("T")[0] === filterDate */
  );

  const totalPages = Math.ceil(totalOrders / pageSize);

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package2 className="w-6 h-6 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Đơn Hàng Nội Địa
            </h1>
          </div>
          <p className="text-gray-600 ml-11">
            Danh sách các đơn hàng nội địa đã được giao đến kho
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
                  placeholder="Tìm kiếm theo tên khách hàng hoặc mã đóng gói..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                disabled={loading}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
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
            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm text-purple-600">
              <RefreshCw className="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-600" />
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
                : "Hiện tại không có đơn hàng nội địa nào."}
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
                  key={index}
                  className="p-6 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex items-start gap-4">
                    {/* Order Number */}
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-purple-600">
                          {currentPage * pageSize + index + 1}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Customer Info */}
                      <div className="lg:col-span-1">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-purple-500" />
                          <span className="font-semibold text-gray-900 text-lg">
                            {order.customerName}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Số điện thoại: {order.customerPhone}
                        </p>
                        <p className="text-sm text-gray-600">
                          Địa chỉ: {order.customerAddress}
                        </p>
                      </div>

                      {/* Packing List */}
                      <div className="lg:col-span-1">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Mã đóng gói:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {order.packings.slice(0, 3).map((packing) => (
                            <span
                              key={packing.packingCode}
                              className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium"
                            >
                              {packing.packingCode}
                            </span>
                          ))}
                          {order.packings.length > 3 && (
                            <span className="inline-block px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                              +{order.packings.length - 3} mã khác
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Tracking Codes Summary */}
                      <div className="lg:col-span-1">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Tổng mã tracking:
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl font-bold text-purple-600">
                            {getTotalTrackingCodes(order.packings)}
                          </span>
                          <span className="text-sm text-gray-500">mã</span>
                        </div>
                        <div className="space-y-1">
                          {order.packings.slice(0, 2).map((packing) =>
                            packing.trackingCodes.slice(0, 2).map((code) => (
                              <div
                                key={code}
                                className="flex justify-between text-xs text-gray-600"
                              >
                                <span className="truncate max-w-[100px]">
                                  {code}
                                </span>
                                <span className="font-medium">1 mã</span>
                              </div>
                            ))
                          )}
                          {getTotalTrackingCodes(order.packings) > 4 && (
                            <div className="text-xs text-gray-500 italic">
                              +{getTotalTrackingCodes(order.packings) - 4} mã
                              khác
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
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg font-semibold">
                {currentPage + 1}
              </span>
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentPage >= totalPages - 1
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

export default ExportList;
