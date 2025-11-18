// Components/Warehouse/WarehouseList.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Warehouse,
  Package,
  ChevronLeft,
  ChevronRight,
  Calendar,
  RefreshCw,
  Eye,
  Filter,
  Download,
} from "lucide-react";
import warehouseService from "../../Services/Warehouse/warehouseService";
import DetailWarehouse from "../Warehouse/DetailWarehouse";

const WarehouseList = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // State cho DetailWarehouse
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailId, setDetailId] = useState(null);

  useEffect(() => {
    fetchWarehouses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize]);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await warehouseService.getReadyWarehouses(
        currentPage,
        pageSize
      );

      setWarehouses(data?.content || []);
      setTotalPages(data?.totalPages || 0);
    } catch (e) {
      console.error(e);
      setError("Có lỗi khi tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((p) => p + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((p) => p - 1);
    }
  };

  const changePageSize = (e) => {
    setPageSize(parseInt(e.target.value, 10));
    setCurrentPage(0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredWarehouses = useMemo(() => {
    const term = (searchTerm || "").toLowerCase().trim();
    const dateFilter = (filterDate || "").trim();

    return (warehouses || []).filter((w) => {
      const matchTerm =
        !term ||
        (w?.trackingCode || "").toLowerCase().includes(term) ||
        (w?.orderCode || "").toLowerCase().includes(term);

      if (!matchTerm) return false;

      if (!dateFilter) return true;

      const created = w?.createdAt ? new Date(w.createdAt) : null;
      if (!created || Number.isNaN(created.getTime())) return false;

      const yyyy = created.getFullYear();
      const mm = String(created.getMonth() + 1).padStart(2, "0");
      const dd = String(created.getDate()).padStart(2, "0");
      const createdDateOnly = `${yyyy}-${mm}-${dd}`;

      return createdDateOnly === dateFilter;
    });
  }, [warehouses, searchTerm, filterDate]);

  const openDetail = (id) => {
    setDetailId(id);
    setDetailOpen(true);
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setDetailId(null);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterDate("");
  };

  return (
    <div className="min-h-screen  p-4 lg:p-6">
      <div className=" mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Warehouse className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  Quản Lý Kho Hàng
                </h1>
              </div>
            </div>

            <button
              onClick={fetchWarehouses}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Làm mới
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Package className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-800 mb-1">
                  Lỗi tải dữ liệu
                </h3>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-700">Bộ lọc</h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã vận đơn hoặc mã đơn hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Date Filter */}
            <div className="relative w-full lg:w-64">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Page Size */}
            <select
              value={pageSize}
              onChange={changePageSize}
              disabled={loading}
              className="px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-slate-50 disabled:cursor-not-allowed appearance-none bg-white"
            >
              <option value={10}>10 mục</option>
              <option value={20}>20 mục</option>
              <option value={30}>30 mục</option>
              <option value={50}>50 mục</option>
              <option value={100}>100 mục</option>
            </select>

            {/* Clear Filters */}
            {(searchTerm || filterDate) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all whitespace-nowrap"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-sm font-medium text-slate-600">
              Đang tải dữ liệu...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredWarehouses.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-2xl mb-4">
              <Warehouse className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Không có dữ liệu
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              {searchTerm || filterDate
                ? "Không tìm thấy kết quả phù hợp với bộ lọc của bạn. Vui lòng thử lại với các tiêu chí khác."
                : "Chưa có hàng hóa nào trong kho. Dữ liệu sẽ hiển thị khi có hàng mới nhập kho."}
            </p>
          </div>
        )}

        {/* Table */}
        {filteredWarehouses.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Table Header Info */}
            <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-slate-700">
                      {filteredWarehouses.length} mặt hàng
                    </span>
                  </div>
                  <div className="h-4 w-px bg-slate-300"></div>
                  <span className="text-sm text-slate-500">
                    Trang {currentPage + 1} / {totalPages}
                  </span>
                </div>
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-left">
                      <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        STT
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Mã Vận Đơn
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Mã Đơn Hàng
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Cân Nặng
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        TL Thực
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Kích Thước
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Ngày Tạo
                      </span>
                    </th>
                    <th className="px-6 py-4 text-center">
                      <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Thao Tác
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredWarehouses.map((item, index) => (
                    <tr
                      key={item.warehouseId ?? `${item.trackingCode}-${index}`}
                      className="hover:bg-blue-50/50 transition-colors group"
                    >
                      {/* STT */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg group-hover:from-blue-200 group-hover:to-blue-100 transition-all">
                          <span className="text-xs font-bold text-blue-700">
                            {currentPage * pageSize + index + 1}
                          </span>
                        </div>
                      </td>

                      {/* Tracking Code */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-slate-400" />
                          <span className="text-sm font-semibold text-slate-800 font-mono">
                            {item.trackingCode}
                          </span>
                        </div>
                      </td>

                      {/* Order Code */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-600">
                          {item.orderCode || "-"}
                        </span>
                      </td>

                      {/* Weight */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 rounded-lg">
                          <span className="text-sm font-semibold text-blue-700">
                            {item.weight}
                          </span>
                          <span className="text-xs text-blue-600">kg</span>
                        </div>
                      </td>

                      {/* Net Weight */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 rounded-lg">
                          <span className="text-sm font-semibold text-green-700">
                            {item.netWeight}
                          </span>
                          <span className="text-xs text-green-600">kg</span>
                        </div>
                      </td>

                      {/* Dim */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 rounded-lg">
                          <span className="text-sm font-semibold text-purple-700">
                            {item.dim}
                          </span>
                          <span className="text-xs text-purple-600">m³</span>
                        </div>
                      </td>

                      {/* Created At */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-xs text-slate-500">
                            {formatDate(item.createdAt)}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => openDetail(item.warehouseId)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-all shadow-sm hover:shadow-md"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {filteredWarehouses.length > 0 && (
          <div className="flex items-center justify-between mt-6 bg-white rounded-2xl shadow-sm border border-slate-200 px-6 py-4">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                currentPage === 0
                  ? "text-slate-400 cursor-not-allowed bg-slate-50"
                  : "text-slate-700 hover:bg-slate-100 bg-white border border-slate-200"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Trang trước
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i;
                } else if (currentPage < 3) {
                  pageNum = i;
                } else if (currentPage > totalPages - 4) {
                  pageNum = totalPages - 5 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                      currentPage === pageNum
                        ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}
            </div>

            <button
              onClick={nextPage}
              disabled={
                warehouses.length < pageSize || currentPage >= totalPages - 1
              }
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                warehouses.length < pageSize || currentPage >= totalPages - 1
                  ? "text-slate-400 cursor-not-allowed bg-slate-50"
                  : "text-slate-700 hover:bg-slate-100 bg-white border border-slate-200"
              }`}
            >
              Trang sau
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Detail Drawer/Modal */}
      <DetailWarehouse
        open={detailOpen}
        warehouseId={detailId}
        onClose={closeDetail}
      />
    </div>
  );
};

export default WarehouseList;
