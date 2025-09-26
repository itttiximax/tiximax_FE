import React, { useState, useEffect } from "react";
import {
  Search,
  Warehouse,
  Package,
  ChevronLeft,
  ChevronRight,
  Calendar,
  RefreshCw,
  Weight,
  Ruler,
} from "lucide-react";
import warehouseService from "../../Services/Warehouse/warehouseService";

const WarehouseList = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    fetchWarehouses();
  }, [currentPage, pageSize]);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await warehouseService.getReadyWarehouses(
        currentPage,
        pageSize
      );

      setWarehouses(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch {
      setError("Có lỗi khi tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const changePageSize = (e) => {
    setPageSize(parseInt(e.target.value));
    setCurrentPage(0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter warehouses based on search term
  const filteredWarehouses = warehouses.filter(
    (warehouse) =>
      warehouse.trackingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.orderCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className=" mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Warehouse className="w-6 h-6 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Danh Sách Kho Hàng
            </h1>
          </div>
          <p className="text-gray-600 ml-11">
            Quản lý thông tin kho hàng sẵn sàng
          </p>
        </div>

        {/* Error Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
            <div className="flex items-center">
              <Package className="w-5 h-5 text-red-400 mr-2" />
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
                  placeholder="Tìm kiếm theo mã tracking hoặc mã đơn..."
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
                onChange={changePageSize}
                disabled={loading}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
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
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm text-purple-600">
              <RefreshCw className="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-600" />
              Đang tải dữ liệu...
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredWarehouses.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <Warehouse className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không có dữ liệu kho hàng
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? "Không tìm thấy kết quả phù hợp với từ khóa tìm kiếm."
                : "Chưa có dữ liệu kho hàng nào."}
            </p>
          </div>
        )}

        {/* Warehouse List */}
        {filteredWarehouses.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* List Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-700">
                    Hiển thị: {filteredWarehouses.length} mặt hàng
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Trang {currentPage + 1} / {totalPages}
                </div>
              </div>
            </div>

            {/* List Body */}
            <div className="divide-y divide-gray-200">
              {filteredWarehouses.map((item, index) => (
                <div
                  key={item.warehouseId}
                  className="p-6 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex items-start gap-4">
                    {/* Item Number */}
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-purple-600">
                          {currentPage * pageSize + index + 1}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Tracking & Order Info */}
                      <div className="lg:col-span-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="w-4 h-4 text-purple-500" />
                          <span className="font-semibold text-gray-900 text-lg font-mono">
                            {item.trackingCode}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-1">
                          Mã đơn:{" "}
                          <span className="font-medium">{item.orderCode}</span>
                        </p>
                        <p className="text-sm text-gray-500">
                          Ngày tạo: {formatDate(item.createdAt)}
                        </p>
                      </div>

                      {/* Weight Info */}
                      <div className="lg:col-span-1">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Trọng lượng:
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Weight className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              Cân nặng:{" "}
                              <span className="font-semibold text-purple-600">
                                {item.weight} kg
                              </span>
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Weight className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              TL thực:{" "}
                              <span className="font-semibold text-green-600">
                                {item.netWeight} kg
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Dimension Info */}
                      <div className="lg:col-span-1">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Kích thước:
                        </p>
                        <div className="flex items-center gap-2">
                          <Ruler className="w-4 h-4 text-gray-400" />
                          <span className="text-2xl font-bold text-purple-600">
                            {item.dim}
                          </span>
                          <span className="text-sm text-gray-500">m³</span>
                        </div>

                        <div className="mt-2">
                          <div className="flex items-center gap-2"></div>
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
        {filteredWarehouses.length > 0 && (
          <div className="flex items-center justify-between mt-6 bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-4">
            <button
              onClick={prevPage}
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
              onClick={nextPage}
              disabled={warehouses.length < pageSize}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                warehouses.length < pageSize
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

export default WarehouseList;
