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
  const [pageSize, setPageSize] = useState(20); // ✅ Tăng default lên 20
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
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
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
    <div className="min-h-screen p-3">
      <div className="mx-auto">
        {/* ✅ COMPACT HEADER */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-purple-100 rounded-lg">
              <Warehouse className="w-4 h-4 text-purple-600" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Danh Sách Kho Hàng
            </h1>
          </div>
          <p className="text-gray-600 ml-7 text-sm">
            Quản lý thông tin kho hàng sẵn sàng
          </p>
        </div>

        {/* Error Messages */}
        {error && (
          <div className="mb-3 p-2.5 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
            <div className="flex items-center">
              <Package className="w-4 h-4 text-red-400 mr-2" />
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
                  placeholder="Tìm tracking/mã đơn..."
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
                onChange={changePageSize}
                disabled={loading}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:bg-gray-100"
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
            <div className="inline-flex items-center px-3 py-2 font-semibold leading-5 text-sm text-purple-600">
              <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4 text-purple-600" />
              Đang tải dữ liệu...
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredWarehouses.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <Warehouse className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-medium text-gray-900 mb-2">
              Không có dữ liệu kho hàng
            </h3>
            <p className="text-gray-500 text-sm">
              {searchTerm
                ? "Không tìm thấy kết quả phù hợp."
                : "Chưa có dữ liệu kho hàng nào."}
            </p>
          </div>
        )}

        {/* ✅ TABLE LAYOUT - COMPACT & SHOW MORE */}
        {filteredWarehouses.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header Info */}
            <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-gray-700">
                  Hiển thị: {filteredWarehouses.length} mặt hàng
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
                        <Package className="w-3 h-3" />
                        Tracking Code
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã Đơn
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <Weight className="w-3 h-3" />
                        Cân Nặng
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <Weight className="w-3 h-3" />
                        TL Thực
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <Ruler className="w-3 h-3" />
                        Dim (m³)
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Ngày Tạo
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredWarehouses.map((item, index) => (
                    <tr
                      key={item.warehouseId}
                      className="hover:bg-purple-50 transition-colors"
                    >
                      {/* STT */}
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-purple-600">
                            {currentPage * pageSize + index + 1}
                          </span>
                        </div>
                      </td>

                      {/* Tracking Code */}
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900 font-mono">
                          {item.trackingCode}
                        </span>
                      </td>

                      {/* Order Code */}
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span className="text-sm text-gray-700">
                          {item.orderCode}
                        </span>
                      </td>

                      {/* Weight */}
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span className="text-sm font-semibold text-purple-600">
                          {item.weight} kg
                        </span>
                      </td>

                      {/* Net Weight */}
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span className="text-sm font-semibold text-green-600">
                          {item.netWeight} kg
                        </span>
                      </td>

                      {/* Dim */}
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span className="text-sm font-bold text-purple-600">
                          {item.dim}
                        </span>
                      </td>

                      {/* Created At */}
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span className="text-xs text-gray-500">
                          {formatDate(item.createdAt)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ✅ COMPACT PAGINATION */}
        {filteredWarehouses.length > 0 && (
          <div className="flex items-center justify-between mt-3 bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-2.5">
            <button
              onClick={prevPage}
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
              onClick={nextPage}
              disabled={warehouses.length < pageSize}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                warehouses.length < pageSize
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

export default WarehouseList;
