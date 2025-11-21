import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Eye,
  Search,
  Filter,
  Download,
} from "lucide-react";
import managerOrderService from "../../Services/Manager/managerOrderService";
import DetailOrder from "../Manager/DetailOrder";

const OrderList = () => {
  // Pagination & Data states
  const [orders, setOrders] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedOrderType, setSelectedOrderType] = useState("ALL");
  const [dateFilter, setDateFilter] = useState({ from: "", to: "" });

  // Detail modal states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Constants
  const availableStatuses = useMemo(
    () => managerOrderService.getAvailableStatuses(),
    []
  );
  const pageSizeOptions = useMemo(() => [10, 20, 30, 50, 100], []);

  // Fetch orders from API
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await managerOrderService.getOrdersPaginated(
        currentPage,
        pageSize
      );
      setOrders(result.content || []);
      setTotalPages(result.totalPages || 1);
      setTotalElements(result.totalElements || 0);
    } catch (err) {
      setError(err.message || "Không thể tải danh sách đơn hàng");
      setOrders([]);
      setTotalPages(1);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Apply frontend filters
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (order) =>
          order.orderCode?.toLowerCase().includes(search) ||
          order.customer?.name?.toLowerCase().includes(search) ||
          order.customer?.phone?.includes(search) ||
          order.orderId?.toString().includes(search)
      );
    }

    // Status filter
    if (selectedStatus !== "ALL") {
      filtered = filtered.filter((order) => order.status === selectedStatus);
    }

    // Order type filter
    if (selectedOrderType !== "ALL") {
      filtered = filtered.filter(
        (order) => order.orderType === selectedOrderType
      );
    }

    // Date range filter
    if (dateFilter.from) {
      const fromDate = new Date(dateFilter.from);
      fromDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter(
        (order) => new Date(order.createdAt) >= fromDate
      );
    }

    if (dateFilter.to) {
      const toDate = new Date(dateFilter.to);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(
        (order) => new Date(order.createdAt) <= toDate
      );
    }

    return filtered;
  }, [orders, searchTerm, selectedStatus, selectedOrderType, dateFilter]);

  // Pagination handlers
  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage >= 0 && newPage < totalPages && !loading) {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [totalPages, loading]
  );

  const handlePageSizeChange = useCallback((newSize) => {
    setPageSize(Number(newSize));
    setCurrentPage(0);
  }, []);

  // Export to CSV
  const handleExport = useCallback(() => {
    if (filteredOrders.length === 0) {
      alert("Không có dữ liệu để xuất");
      return;
    }

    const headers = [
      "Mã đơn",
      "Loại đơn",
      "Trạng thái",
      "Tỷ giá",
      "Tổng tiền",
      "Ngày tạo",
      "Khách hàng",
    ];

    const rows = filteredOrders.map((order) => [
      order.orderCode || "",
      getOrderTypeText(order.orderType),
      availableStatuses.find((s) => s.key === order.status)?.label ||
        order.status,
      order.exchangeRate
        ? `${order.exchangeRate.toLocaleString("vi-VN")} VNĐ`
        : "",
      order.finalPriceOrder
        ? order.finalPriceOrder.toLocaleString("vi-VN")
        : "",
      new Date(order.createdAt).toLocaleDateString("vi-VN"),
      order.customer?.name || "",
    ]);

    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join(
      "\n"
    );

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `orders_page${currentPage + 1}_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
  }, [filteredOrders, currentPage, availableStatuses]);

  // Detail order handlers
  const fetchOrderDetail = useCallback(async (orderId) => {
    setLoadingDetail(true);
    try {
      const orderDetail = await managerOrderService.getOrderDetail(orderId);
      setSelectedOrder(orderDetail);
    } catch (err) {
      alert("Không thể tải chi tiết đơn hàng: " + err.message);
      setShowDetailModal(false);
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  const handleViewDetail = useCallback(
    (orderId, orderPreview) => {
      setShowDetailModal(true);
      setSelectedOrder(orderPreview);
      fetchOrderDetail(orderId);
    },
    [fetchOrderDetail]
  );

  const handleCloseDetail = useCallback(() => {
    setShowDetailModal(false);
    setSelectedOrder(null);
    setLoadingDetail(false);
  }, []);

  // Utility functions
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("vi-VN");
  }, []);

  const formatPrice = useCallback((price) => {
    if (!price) return "-";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  }, []);

  const getStatusColor = useCallback((color) => {
    const colorMap = {
      gray: "bg-gray-100 text-gray-800",
      green: "bg-green-100 text-green-800",
      orange: "bg-orange-100 text-orange-800",
      blue: "bg-blue-100 text-blue-800",
      indigo: "bg-indigo-100 text-indigo-800",
      slate: "bg-slate-100 text-slate-800",
      purple: "bg-purple-100 text-purple-800",
      yellow: "bg-yellow-100 text-yellow-800",
      cyan: "bg-cyan-100 text-cyan-800",
      pink: "bg-pink-100 text-pink-800",
      teal: "bg-teal-100 text-teal-800",
      emerald: "bg-emerald-100 text-emerald-800",
      red: "bg-red-100 text-red-800",
    };
    return colorMap[color] || "bg-gray-100 text-gray-800";
  }, []);

  const getOrderTypeText = useCallback((type) => {
    const orderTypes = {
      MUA_HO: "Mua hộ",
      VAN_CHUYEN: "Vận chuyển",
      DAU_GIA: "Đấu giá",
      KY_GUI: "Ký gửi",
    };
    return orderTypes[type] || type;
  }, []);

  // Reset filters
  const handleResetFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedStatus("ALL");
    setSelectedOrderType("ALL");
    setDateFilter({ from: "", to: "" });
  }, []);

  // Check if filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      searchTerm ||
      selectedStatus !== "ALL" ||
      selectedOrderType !== "ALL" ||
      dateFilter.from ||
      dateFilter.to
    );
  }, [searchTerm, selectedStatus, selectedOrderType, dateFilter]);

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Danh sách đơn hàng</h1>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Bộ lọc</h2>
          </div>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm mã đơn, khách hàng, SĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">Tất cả trạng thái</option>
            {availableStatuses.map((status) => (
              <option key={status.key} value={status.key}>
                {status.label}
              </option>
            ))}
          </select>

          {/* Order Type Filter */}
          <select
            value={selectedOrderType}
            onChange={(e) => setSelectedOrderType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">Tất cả loại đơn</option>
            <option value="MUA_HO">Mua hộ</option>
            <option value="VAN_CHUYEN">Vận chuyển</option>
            <option value="DAU_GIA">Đấu giá</option>
            <option value="KY_GUI">Ký gửi</option>
          </select>

          {/* From Date */}
          <input
            type="date"
            value={dateFilter.from}
            onChange={(e) =>
              setDateFilter({ ...dateFilter, from: e.target.value })
            }
            placeholder="Từ ngày"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {/* To Date */}
          <input
            type="date"
            value={dateFilter.to}
            onChange={(e) =>
              setDateFilter({ ...dateFilter, to: e.target.value })
            }
            placeholder="Đến ngày"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          {/* Export Button */}
          <button
            onClick={handleExport}
            disabled={loading || filteredOrders.length === 0}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Xuất CSV
          </button>
        </div>

        {/* Filter Summary */}
        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Hiển thị{" "}
            <span className="font-semibold text-blue-600">
              {loading ? "..." : filteredOrders.length}
            </span>{" "}
            / <span className="font-semibold">{totalElements}</span> đơn hàng
            {hasActiveFilters && (
              <span className="ml-2 text-gray-500">(đã lọc)</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Hiển thị:</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size} đơn/trang
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800">
                Có lỗi xảy ra
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={fetchOrders}
                  disabled={loading}
                  className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Đang tải..." : "Thử lại"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã đơn hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại đơn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tỷ giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading
                ? // Loading skeleton
                  [...Array(8)].map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-28 bg-gray-200 rounded" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-20 bg-gray-200 rounded" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-6 w-24 bg-gray-200 rounded-full" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-24 bg-gray-200 rounded" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-28 bg-gray-200 rounded" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-24 bg-gray-200 rounded" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-9 w-20 bg-gray-200 rounded-lg" />
                      </td>
                    </tr>
                  ))
                : filteredOrders.length > 0
                ? // Data rows
                  filteredOrders.map((order) => {
                    const orderStatus = availableStatuses.find(
                      (s) => s.key === order.status
                    );
                    return (
                      <tr
                        key={order.orderId}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {order.orderCode}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getOrderTypeText(order.orderType)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              orderStatus
                                ? getStatusColor(orderStatus.color)
                                : getStatusColor("gray")
                            }`}
                          >
                            {orderStatus ? orderStatus.label : order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.exchangeRate
                            ? `${order.exchangeRate.toLocaleString(
                                "vi-VN"
                              )} VNĐ`
                            : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {formatPrice(order.finalPriceOrder)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() =>
                              handleViewDetail(order.orderId, order)
                            }
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            <span>Xem</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                : null}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {!loading && filteredOrders.length === 0 && !error && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200 mt-6">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy đơn hàng
          </p>
          <p className="text-sm text-gray-500">
            {totalElements === 0
              ? "Chưa có đơn hàng nào trong hệ thống"
              : "Thử thay đổi điều kiện lọc hoặc tìm kiếm"}
          </p>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalElements > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4">
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
            <span>Trang trước</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Trang</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg font-semibold">
              {currentPage + 1}
            </span>
            <span className="text-sm text-gray-500">/ {totalPages}</span>
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
            <span>Trang sau</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedOrder && (
        <DetailOrder
          orderData={selectedOrder}
          onClose={handleCloseDetail}
          availableStatuses={availableStatuses}
          isLoading={loadingDetail}
        />
      )}
    </div>
  );
};

export default OrderList;
