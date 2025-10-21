import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
  Eye,
  Search,
  Filter,
  Download,
} from "lucide-react";
import managerOrderService from "../../Services/Manager/managerOrderService";
import DetailOrder from "../Manager/DetailOrder";

const OrderList = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedOrderType, setSelectedOrderType] = useState("ALL");
  const [dateFilter, setDateFilter] = useState({ from: "", to: "" });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  // Detail modal states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const availableStatuses = useMemo(
    () => managerOrderService.getAvailableStatuses(),
    []
  );

  const pageSizeOptions = [10, 20, 30, 50, 100];

  // Fetch all orders
  const fetchAllOrders = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      const response = await managerOrderService.getAllOrders();
      setAllOrders(Array.isArray(response) ? response : []);
      setCurrentPage(0); // Reset to first page
    } catch (err) {
      setError(err.message || "Không thể tải danh sách đơn hàng");
      setAllOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  // Filter logic
  const filteredOrders = useMemo(() => {
    let filtered = [...allOrders];

    // Search filter (orderCode, customer name, etc.)
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
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
  }, [allOrders, searchTerm, selectedStatus, selectedOrderType, dateFilter]);

  // Pagination logic
  const paginatedOrders = useMemo(() => {
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize);

  // Handlers
  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage >= 0 && newPage < totalPages) {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [totalPages]
  );

  const handlePageSizeChange = useCallback((newSize) => {
    setPageSize(newSize);
    setCurrentPage(0);
  }, []);

  // const handleResetFilters = useCallback(() => {
  //   setSearchTerm("");
  //   setSelectedStatus("ALL");
  //   setSelectedOrderType("ALL");
  //   setDateFilter({ from: "", to: "" });
  //   setCurrentPage(0);
  // }, []);

  const handleExport = useCallback(() => {
    if (filteredOrders.length === 0) {
      alert("Không có dữ liệu để xuất");
      return;
    }

    const csv = [
      [
        "Mã đơn",
        "Loại đơn",
        "Trạng thái",
        "Tỷ giá",
        "Tổng tiền",
        "Ngày tạo",
        "Khách hàng",
      ].join(","),
      ...filteredOrders.map((order) =>
        [
          order.orderCode,
          order.orderType,
          order.status,
          order.exchangeRate || "",
          order.finalPriceOrder || "",
          new Date(order.createdAt).toLocaleDateString("vi-VN"),
          order.customer?.name || "",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `orders_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  }, [filteredOrders]);

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
    return dateString ? new Date(dateString).toLocaleString("vi-VN") : "-";
  }, []);

  const formatPrice = useCallback((price) => {
    return price
      ? new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(price)
      : "-";
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
    return type === "MUA_HO"
      ? "Mua hộ"
      : type === "VAN_CHUYEN"
      ? "Vận chuyển"
      : type;
  }, []);

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-8">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      <span className="ml-2 text-gray-600">Đang tải...</span>
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Danh sách đơn hàng</h1>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">Bộ lọc</h2>
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
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Tất cả loại đơn</option>
            <option value="MUA_HO">Mua hộ</option>
            <option value="VAN_CHUYEN">Vận chuyển</option>
          </select>

          {/* Date From */}
          <input
            type="date"
            value={dateFilter.from}
            onChange={(e) =>
              setDateFilter({ ...dateFilter, from: e.target.value })
            }
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Từ ngày"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {/* Date To */}
          <input
            type="date"
            value={dateFilter.to}
            onChange={(e) =>
              setDateFilter({ ...dateFilter, to: e.target.value })
            }
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Đến ngày"
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

        {/* Filter Results Info */}
        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Hiển thị{" "}
            <span className="font-semibold text-blue-600">
              {filteredOrders.length}
            </span>{" "}
            trong tổng số{" "}
            <span className="font-semibold">{allOrders.length}</span> đơn hàng
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Hiển thị:</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
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

      {/* Error State */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Có lỗi xảy ra
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={fetchAllOrders}
                  disabled={loading}
                  className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded-md text-sm disabled:opacity-50"
                >
                  {loading ? "Đang tải..." : "Thử lại"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow-sm">
          <LoadingSpinner />
        </div>
      )}

      {/* Orders Table */}
      {!loading && (
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
                    Khách hàng
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
                {paginatedOrders.map((order) => {
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
                        <div className="text-xs text-gray-500">
                          ID: {order.orderId}
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.customer?.name || "-"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.customer?.phone || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.exchangeRate
                          ? `${order.exchangeRate.toLocaleString("vi-VN")} VNĐ`
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPrice(order.finalPriceOrder)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => handleViewDetail(order.orderId, order)}
                          className="group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-300"
                        >
                          <Eye className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                          <span>Xem</span>
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

      {/* Empty State */}
      {!loading && filteredOrders.length === 0 && !error && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy đơn hàng
          </p>
          <p className="text-sm text-gray-500">
            {allOrders.length === 0
              ? "Chưa có đơn hàng nào trong hệ thống"
              : "Thử thay đổi điều kiện lọc"}
          </p>
        </div>
      )}

      {/* Pagination */}
      {!loading && filteredOrders.length > 0 && totalPages > 1 && (
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
            Trang sau
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Detail Order Modal */}
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
