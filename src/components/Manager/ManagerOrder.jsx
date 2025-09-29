import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
  Eye,
} from "lucide-react";
import managerOrderService from "../../Services/Manager/managerOrderService";
import DetailOrder from "./DetailOrder";

const ManagerOrder = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeStatus, setActiveStatus] = useState("DA_XAC_NHAN");
  const [pageSize, setPageSize] = useState(20);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: false,
  });

  // Detail modal states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailError, setDetailError] = useState(null);

  const availableStatuses = useMemo(
    () => managerOrderService.getAvailableStatuses(),
    []
  );

  // Page size options
  const pageSizeOptions = [10, 20, 30, 50, 100];

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

  const getTabColor = useCallback((color, isActive) => {
    if (isActive) {
      const activeColors = {
        gray: "bg-gray-600 text-white",
        green: "bg-green-600 text-white",
        orange: "bg-orange-600 text-white",
        blue: "bg-blue-600 text-white",
        indigo: "bg-indigo-600 text-white",
        slate: "bg-slate-600 text-white",
        purple: "bg-purple-600 text-white",
        yellow: "bg-yellow-600 text-white",
        cyan: "bg-cyan-600 text-white",
        pink: "bg-pink-600 text-white",
        teal: "bg-teal-600 text-white",
        emerald: "bg-emerald-600 text-white",
        red: "bg-red-600 text-white",
      };
      return activeColors[color] || "bg-gray-600 text-white";
    }
    return "bg-white text-gray-700 hover:bg-gray-50";
  }, []);

  const getOrderTypeText = useCallback((type) => {
    return type === "MUA_HO"
      ? "Mua hộ"
      : type === "VAN_CHUYEN"
      ? "Vận chuyển"
      : type;
  }, []);

  const currentStatus = useMemo(
    () => availableStatuses.find((s) => s.key === activeStatus),
    [availableStatuses, activeStatus]
  );

  // Loading spinner component
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
        <h1 className="text-2xl font-bold text-gray-900">
          Quản lý trạng thái đơn hàng
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Quản lí trạng thái đơn hàng, xem chi tiết đơn hàng
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {availableStatuses.map((status) => (
              <button
                key={status.key}
                onClick={() => handleStatusChange(status.key)}
                disabled={loading}
                className={`
                  whitespace-nowrap py-2 px-3 border-b-2 font-medium text-sm rounded-t-lg transition-all duration-200 
                  ${
                    activeStatus === status.key
                      ? `${getTabColor(status.color, true)} border-current`
                      : `${getTabColor(
                          status.color,
                          false
                        )} border-transparent hover:border-gray-300`
                  }
                  ${loading ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                {status.label}
                {loading && activeStatus === status.key && (
                  <Loader2 className="inline-block ml-2 h-3 w-3 animate-spin" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Page Size Selector */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-700">Hiển thị:</label>
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            disabled={loading}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size} đơn/trang
              </option>
            ))}
          </select>
        </div>
        <div className="text-sm text-gray-600">
          Tổng:{" "}
          <span className="font-semibold">{pagination.totalElements}</span> đơn
          hàng
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
                  onClick={() =>
                    fetchOrders(pagination.currentPage, activeStatus, pageSize)
                  }
                  disabled={loading}
                  className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
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
              {orders.map((order) => {
                const orderStatus = availableStatuses.find(
                  (s) => s.key === order.status
                );

                return (
                  <tr key={order.orderId} className="hover:bg-gray-50">
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
                        onClick={() => handleViewDetail(order.orderId)}
                        className="group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        <Eye className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                        <span>Xem chi tiết</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {!loading && orders.length === 0 && !error && (
        <div className="text-center py-12 bg-white rounded-lg">
          <div className="text-gray-500">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Không có đơn hàng nào
            </p>
            <p className="text-sm text-gray-500">
              Chưa có đơn hàng nào với trạng thái "{currentStatus?.label}"
            </p>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && orders.length > 0 && (
        <div className="flex items-center justify-between mt-6 bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-4">
          <button
            onClick={handlePrevPage}
            disabled={pagination.first || loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              pagination.first || loading
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
              {pagination.currentPage}
            </span>
            <span className="text-sm text-gray-500">
              / {pagination.totalPages}
            </span>
          </div>

          <button
            onClick={handleNextPage}
            disabled={pagination.last || loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              pagination.last || loading
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
        />
      )}
    </div>
  );
};

export default ManagerOrder;
