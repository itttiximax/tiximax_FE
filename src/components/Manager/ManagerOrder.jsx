import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
  Eye,
  Package,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react";
import managerOrderService from "../../Services/Manager/managerOrderService";
import DetailOrder from "./DetailOrder";

const ManagerOrder = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeStatus, setActiveStatus] = useState("DA_XAC_NHAN");
  const [pageSize, setPageSize] = useState(50);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: false,
  });

  //  Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Detail modal states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailError, setDetailError] = useState(null);

  const availableStatuses = useMemo(
    () => managerOrderService.getAvailableStatuses(),
    []
  );

  // Page size options
  const pageSizeOptions = [10, 20, 30, 50, 100, 200];

  // Fetch orders data
  const fetchOrders = useCallback(
    async (page = 1, status = activeStatus, size = pageSize) => {
      setError(null);
      setLoading(true);

      try {
        const response = await managerOrderService.getOrdersPaging(
          page - 1,
          size,
          status
        );

        setOrders(response.content || []);
        setPagination({
          currentPage: page,
          totalElements: response.totalElements || 0,
          totalPages: response.totalPages || 0,
          first: response.first,
          last: response.last,
        });
      } catch (err) {
        setError(err.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    },
    [activeStatus, pageSize]
  );

  // ✅ Filter orders based on search term
  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;

    const search = searchTerm.toLowerCase().trim();
    return orders.filter(
      (order) =>
        order.orderCode?.toLowerCase().includes(search) ||
        order.customer?.customerCode?.toLowerCase().includes(search) ||
        order.customer?.name?.toLowerCase().includes(search) ||
        order.orderId?.toString().includes(search)
    );
  }, [orders, searchTerm]);

  // Fetch order detail
  const fetchOrderDetail = useCallback(async (orderId) => {
    setDetailError(null);

    try {
      const orderDetail = await managerOrderService.getOrderDetail(orderId);
      setSelectedOrder(orderDetail);
      setShowDetailModal(true);
    } catch (err) {
      setDetailError(err.message || "Failed to fetch order detail");
      alert("Không thể tải chi tiết đơn hàng: " + err.message);
    }
  }, []);

  // Handle view detail
  const handleViewDetail = useCallback(
    (orderId) => {
      fetchOrderDetail(orderId);
    },
    [fetchOrderDetail]
  );

  // Close detail modal
  const handleCloseDetail = useCallback(() => {
    setShowDetailModal(false);
    setSelectedOrder(null);
    setDetailError(null);
  }, []);

  useEffect(() => {
    fetchOrders(1, activeStatus, pageSize);
  }, [activeStatus, pageSize]);

  // Status change handler
  const handleStatusChange = useCallback(
    (status) => {
      if (status === activeStatus) return;
      setActiveStatus(status);
      setSearchTerm(""); // ✅ Reset search khi đổi status
      fetchOrders(1, status, pageSize);
    },
    [activeStatus, pageSize, fetchOrders]
  );

  // Page size change handler
  const handlePageSizeChange = useCallback(
    (newSize) => {
      setPageSize(newSize);
      fetchOrders(1, activeStatus, newSize);
    },
    [activeStatus, fetchOrders]
  );

  // Pagination handlers
  const handleNextPage = useCallback(() => {
    if (!pagination.last) {
      fetchOrders(pagination.currentPage + 1, activeStatus, pageSize);
    }
  }, [
    pagination.last,
    pagination.currentPage,
    activeStatus,
    pageSize,
    fetchOrders,
  ]);

  const handlePrevPage = useCallback(() => {
    if (!pagination.first) {
      fetchOrders(pagination.currentPage - 1, activeStatus, pageSize);
    }
  }, [
    pagination.first,
    pagination.currentPage,
    activeStatus,
    pageSize,
    fetchOrders,
  ]);

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
      gray: "bg-gray-100 text-gray-800 border-gray-200",
      green: "bg-emerald-50 text-emerald-700 border-emerald-200",
      orange: "bg-orange-50 text-orange-700 border-orange-200",
      blue: "bg-blue-50 text-blue-700 border-blue-200",
      indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
      slate: "bg-slate-50 text-slate-700 border-slate-200",
      purple: "bg-purple-50 text-purple-700 border-purple-200",
      yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
      cyan: "bg-cyan-50 text-cyan-700 border-cyan-200",
      pink: "bg-pink-50 text-pink-700 border-pink-200",
      teal: "bg-teal-50 text-teal-700 border-teal-200",
      emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
      red: "bg-red-50 text-red-700 border-red-200",
    };
    return colorMap[color] || "bg-gray-100 text-gray-800 border-gray-200";
  }, []);

  const getTabColor = useCallback((color, isActive) => {
    if (isActive) {
      const activeColors = {
        gray: "bg-gradient-to-br from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-500/30 border-gray-600",
        green:
          "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 border-emerald-600",
        orange:
          "bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 border-orange-600",
        blue: "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 border-blue-600",
        indigo:
          "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 border-indigo-600",
        slate:
          "bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-lg shadow-slate-500/30 border-slate-600",
        purple:
          "bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30 border-purple-600",
        yellow:
          "bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/30 border-yellow-600",
        cyan: "bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/30 border-cyan-600",
        pink: "bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/30 border-pink-600",
        teal: "bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/30 border-teal-600",
        emerald:
          "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 border-emerald-600",
        red: "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30 border-red-600",
      };
      return (
        activeColors[color] ||
        "bg-gradient-to-br from-gray-500 to-gray-600 text-white shadow-lg"
      );
    }
    return "bg-white text-gray-700 hover:bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-md";
  }, []);

  const getOrderTypeText = useCallback((type) => {
    return type === "MUA_HO"
      ? "Mua hộ"
      : type === "VAN_CHUYEN"
      ? "Vận chuyển"
      : type === "KY_GUI"
      ? "Ký gửi"
      : type === "DAU_GIA"
      ? "Đấu giá"
      : type;
  }, []);

  const currentStatus = useMemo(
    () => availableStatuses.find((s) => s.key === activeStatus),
    [availableStatuses, activeStatus]
  );

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex flex-col justify-center items-center py-16">
      <div className="relative">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full bg-blue-400 opacity-20"></div>
      </div>
      <span className="mt-4 text-gray-600 font-medium">
        Đang tải dữ liệu...
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br ">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-xl shadow-lg">
                  <Package className="h-7 w-7 text-white" />
                </div>
                Quản lý đơn hàng
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  fetchOrders(pagination.currentPage, activeStatus, pageSize)
                }
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                <span className="font-medium">Làm mới</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Tổng đơn hàng
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {pagination.totalElements.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Trạng thái hiện tại
                  </p>
                  <p className="text-xl font-bold text-gray-900 mt-1">
                    {currentStatus?.label}
                  </p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Trang hiện tại
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {pagination.currentPage}/{pagination.totalPages}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Đơn/trang</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {pageSize}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
            <nav className="flex flex-wrap gap-2">
              {availableStatuses.map((status) => (
                <button
                  key={status.key}
                  onClick={() => handleStatusChange(status.key)}
                  disabled={loading}
                  className={`
                    relative flex items-center gap-2 px-5 py-3 rounded-lg
                    font-semibold text-sm border-2 
                    transition-all duration-300 ease-out
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${getTabColor(status.color, activeStatus === status.key)}
                    ${
                      activeStatus === status.key
                        ? "scale-105 -translate-y-0.5"
                        : "scale-100"
                    }
                  `}
                >
                  <span>{status.label}</span>
                  {loading && activeStatus === status.key && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* ✅ Search Bar & Controls */}
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Search Box */}
            <div className="w-full lg:w-96">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm mã đơn, mã KH, tên KH..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Page Size & Stats */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700">
                  Hiển thị:
                </label>
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  disabled={loading}
                  className="border-2 border-gray-300 rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white hover:border-gray-400 transition-colors"
                >
                  {pageSizeOptions.map((size) => (
                    <option key={size} value={size}>
                      {size} đơn/trang
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">
                  {searchTerm ? "Tìm thấy:" : "Tổng cộng:"}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 font-bold rounded-lg">
                  {filteredOrders.length.toLocaleString()}
                </span>
                <span className="text-gray-600">
                  {searchTerm && <>/ {orders.length.toLocaleString()} </>}
                  đơn hàng
                </span>
              </div>
            </div>
          </div>

          {/* Search Info */}
          {searchTerm && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Filter className="w-4 h-4" />
                <span>
                  Đang tìm kiếm:{" "}
                  <span className="font-semibold text-blue-600">
                    {searchTerm}
                  </span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-red-900 mb-1">
                  Có lỗi xảy ra
                </h3>
                <p className="text-sm text-red-700 mb-3">{error}</p>
                <button
                  onClick={() =>
                    fetchOrders(pagination.currentPage, activeStatus, pageSize)
                  }
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                  />
                  {loading ? "Đang tải..." : "Thử lại"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <LoadingSpinner />
          </div>
        )}

        {/* Orders Table */}
        {!loading && (
          <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Mã đơn hàng
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Loại đơn
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Mã khách hàng
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Tên khách hàng
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Tỷ giá
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Tổng tiền
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredOrders.map((order, index) => {
                    const orderStatus = availableStatuses.find(
                      (s) => s.key === order.status
                    );

                    return (
                      <tr
                        key={order.orderId}
                        className={`transition-all duration-200 hover:bg-blue-50/50 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900">
                              {order.orderCode}
                            </span>
                            <span className="text-xs text-gray-500 mt-0.5">
                              ID: {order.orderId}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 border border-indigo-200">
                            {getOrderTypeText(order.orderType)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-full border ${
                              orderStatus
                                ? getStatusColor(orderStatus.color)
                                : getStatusColor("gray")
                            }`}
                          >
                            {orderStatus ? orderStatus.label : order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-blue-600">
                            {order.customer?.customerCode || "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {order.customer?.name || "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-gray-900">
                            {order.exchangeRate
                              ? `${order.exchangeRate.toLocaleString(
                                  "vi-VN"
                                )} ₫`
                              : "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-bold text-emerald-600">
                            {formatPrice(order.finalPriceOrder)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-700">
                            {formatDate(order.createdAt)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleViewDetail(order.orderId)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          >
                            <Eye className="w-4 h-4" />
                            <span>Chi tiết</span>
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 py-16">
            <div className="text-center">
              <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                <FileText className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {searchTerm
                  ? "Không tìm thấy kết quả"
                  : "Không có đơn hàng nào"}
              </h3>
              <p className="text-sm text-gray-600 max-w-sm mx-auto">
                {searchTerm ? (
                  <>
                    Không tìm thấy đơn hàng nào với từ khóa{" "}
                    <span className="font-semibold">"{searchTerm}"</span>
                  </>
                ) : (
                  <>
                    Chưa có đơn hàng nào với trạng thái{" "}
                    <span className="font-semibold">
                      "{currentStatus?.label}"
                    </span>
                  </>
                )}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Xóa tìm kiếm
                </button>
              )}
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredOrders.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={handlePrevPage}
                disabled={pagination.first || loading}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  pagination.first || loading
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 border-2 border-gray-300 hover:border-blue-500 shadow-sm hover:shadow"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                Trang trước
              </button>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Trang</span>
                <div className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg font-bold shadow-md">
                  <span className="text-lg">{pagination.currentPage}</span>
                  <span className="text-sm opacity-90">
                    / {pagination.totalPages}
                  </span>
                </div>
              </div>

              <button
                onClick={handleNextPage}
                disabled={pagination.last || loading}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  pagination.last || loading
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 border-2 border-gray-300 hover:border-blue-500 shadow-sm hover:shadow"
                }`}
              >
                Trang sau
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Detail Order Modal */}
        {showDetailModal && selectedOrder && (
          <DetailOrder
            orderData={selectedOrder}
            onClose={handleCloseDetail}
            availableStatuses={availableStatuses}
          />
        )}
      </div>
    </div>
  );
};
export default ManagerOrder;
