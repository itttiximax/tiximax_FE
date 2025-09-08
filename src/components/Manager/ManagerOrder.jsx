import React, { useState, useEffect, useCallback, useMemo } from "react";
import managerOrderService from "../../Services/Manager/managerOrderService";

const ManagerOrder = () => {
  const [orders, setOrders] = useState([]);
  const [tableLoading, setTableLoading] = useState(false); // Chỉ loading cho table
  const [error, setError] = useState(null);
  const [activeStatus, setActiveStatus] = useState("DA_XAC_NHAN");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: false,
  });

  const availableStatuses = useMemo(
    () => managerOrderService.getAvailableStatuses(),
    []
  );

  // Fetch orders data chỉ dùng tableLoading
  const fetchOrders = useCallback(
    async (page = 1, status = activeStatus) => {
      setTableLoading(true);
      setError(null);

      try {
        const response = await managerOrderService.getOrdersPaging(
          page - 1,
          20,
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
        setTableLoading(false);
      }
    },
    [activeStatus]
  );

  useEffect(() => {
    fetchOrders(1, activeStatus); // Initial load
    // eslint-disable-next-line
  }, [activeStatus]);

  // Status change handler
  const handleStatusChange = useCallback(
    (status) => {
      setActiveStatus(status);
      fetchOrders(1, status);
    },
    [fetchOrders]
  );

  // Pagination handlers
  const handleNextPage = useCallback(() => {
    if (!pagination.last) {
      fetchOrders(pagination.currentPage + 1, activeStatus);
    }
  }, [pagination.last, pagination.currentPage, activeStatus, fetchOrders]);

  const handlePrevPage = useCallback(() => {
    if (!pagination.first) {
      fetchOrders(pagination.currentPage - 1, activeStatus);
    }
  }, [pagination.first, pagination.currentPage, activeStatus, fetchOrders]);

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
      purple: "bg-purple-100 text-purple-800",
      yellow: "bg-yellow-100 text-yellow-800",
      cyan: "bg-cyan-100 text-cyan-800",
      pink: "bg-pink-100 text-pink-800",
      teal: "bg-teal-100 text-teal-800",
      emerald: "bg-emerald-100 text-emerald-800",
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
        purple: "bg-purple-600 text-white",
        yellow: "bg-yellow-600 text-white",
        cyan: "bg-cyan-600 text-white",
        pink: "bg-pink-600 text-white",
        teal: "bg-teal-600 text-white",
        emerald: "bg-emerald-600 text-white",
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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
        <p className="mt-1 text-sm text-gray-600">
          Quản lý đơn hàng theo trạng thái
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div className="mb-6">
        <div className="border-b border-green-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {availableStatuses.map((status) => (
              <button
                key={status.key}
                onClick={() => handleStatusChange(status.key)}
                disabled={tableLoading}
                className={`
                  whitespace-nowrap py-2 px-3 border-b-2 font-medium text-sm rounded-t-lg transition-all duration-200 
                  ${tableLoading ? "opacity-50 cursor-not-allowed" : ""}
                  ${
                    activeStatus === status.key
                      ? `${getTabColor(status.color, true)} border-current`
                      : `${getTabColor(
                          status.color,
                          false
                        )} border-transparent hover:border-gray-300`
                  }
                `}
              >
                {status.label}
                {tableLoading && activeStatus === status.key && (
                  <span className="ml-2 inline-block w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Loading indicator for table area only */}
      {tableLoading && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-3"></div>
            <p className="text-sm text-blue-700">Đang tải dữ liệu...</p>
          </div>
        </div>
      )}

      {/* Current Status Info */}
      <div className="mb-4">
        <div
          className={`bg-white p-4 rounded-lg shadow-sm border transition-opacity duration-200 ${
            tableLoading ? "opacity-50" : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {currentStatus?.label}
              </h3>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {pagination.totalElements}
              </div>
              <div className="text-sm text-gray-500">đơn hàng</div>
            </div>
          </div>
          {pagination.totalPages > 0 && (
            <div className="mt-2 text-sm text-gray-500">
              Trang {pagination.currentPage}/{pagination.totalPages}
            </div>
          )}
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
                    fetchOrders(pagination.currentPage, activeStatus)
                  }
                  disabled={tableLoading}
                  className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded-md text-sm disabled:opacity-50"
                >
                  Thử lại
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div
        className={`bg-white shadow-sm rounded-lg overflow-hidden relative transition-opacity duration-200 ${
          tableLoading ? "opacity-70" : ""
        }`}
      >
        {/* Table loading overlay */}
        {tableLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="text-sm text-gray-600">Đang tải...</span>
            </div>
          </div>
        )}

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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {orders.length === 0 && !tableLoading && !error && (
        <div className="text-center py-12 bg-white rounded-lg">
          <div className="text-gray-500">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
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
      {pagination.totalPages > 1 && (
        <div
          className={`bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 transition-opacity duration-200 ${
            tableLoading ? "opacity-50" : ""
          }`}
        >
          <div className="flex-1 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-700">
                Hiển thị{" "}
                <span className="font-medium">
                  {(pagination.currentPage - 1) * 20 + 1}
                </span>{" "}
                đến{" "}
                <span className="font-medium">
                  {Math.min(
                    pagination.currentPage * 20,
                    pagination.totalElements
                  )}
                </span>{" "}
                trong{" "}
                <span className="font-medium">{pagination.totalElements}</span>{" "}
                kết quả
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevPage}
                disabled={pagination.first || tableLoading}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Trang trước
              </button>
              <span className="text-sm text-gray-500">
                Trang {pagination.currentPage} / {pagination.totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={pagination.last || tableLoading}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trang sau →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerOrder;
