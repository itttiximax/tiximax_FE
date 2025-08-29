import React, { useState, useEffect } from "react";
import managerOrderService from "../../Services/Manager/managerOrderService";

const ManagerOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 20,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: false,
    numberOfElements: 0,
  });

  // Fetch orders data
  const fetchOrders = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      // Convert UI page (1-based) to API page (0-based)
      const apiPage = page - 1;
      const response = await managerOrderService.getOrdersPaging(apiPage, 20);

      setOrders(response.content || []);
      setPagination({
        currentPage: page, // Keep UI page as 1-based
        pageSize: 20,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        first: response.first,
        last: response.last,
        numberOfElements: response.numberOfElements,
        empty: response.empty,
      });
    } catch (err) {
      setError(err.message || "Failed to fetch orders");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchOrders(1);
  }, []);

  // Handle next page
  const handleNextPage = () => {
    if (!pagination.last) {
      fetchOrders(pagination.currentPage + 1);
    }
  };

  // Handle previous page
  const handlePrevPage = () => {
    if (!pagination.first) {
      fetchOrders(pagination.currentPage - 1);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  // Format price
  const formatPrice = (price) => {
    if (!price) return "-";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Get status display text
  const getStatusText = (status) => {
    const statusMap = {
      CHO_THANH_TOAN: "Chờ thanh toán",
      CHO_THANH_TOAN_SHIP: "Chờ thanh toán ship",
      DA_THANH_TOAN: "Đã thanh toán",
      HOAN_THANH: "Hoàn thành",
      HUY: "Đã hủy",
    };
    return statusMap[status] || status;
  };

  // Get status color class
  const getStatusColor = (status) => {
    const colorMap = {
      CHO_THANH_TOAN: "bg-yellow-100 text-yellow-800",
      CHO_THANH_TOAN_SHIP: "bg-orange-100 text-orange-800",
      DA_THANH_TOAN: "bg-blue-100 text-blue-800",
      HOAN_THANH: "bg-green-100 text-green-800",
      HUY: "bg-red-100 text-red-800",
    };
    return colorMap[status] || "bg-gray-100 text-gray-800";
  };

  // Get order type text
  const getOrderTypeText = (type) => {
    const typeMap = {
      MUA_HO: "Mua hộ",
      VAN_CHUYEN: "Vận chuyển",
    };
    return typeMap[type] || type;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Có lỗi xảy ra</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={() => fetchOrders(pagination.currentPage)}
                className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded-md text-sm"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
        <p className="mt-1 text-sm text-gray-600">
          Tổng cộng {pagination.totalElements} đơn hàng - Trang{" "}
          {pagination.currentPage}/{pagination.totalPages}
        </p>
      </div>

      {/* Orders Table */}
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
                Ghi chú
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.orderId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <div className="text-sm font-medium text-gray-900">
                      {order.orderCode}
                    </div>
                    <div className="text-xs text-gray-500">
                      ID: {order.orderId}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {getOrderTypeText(order.orderType)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusText(order.status)}
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="max-w-xs truncate" title={order.note}>
                    {order.note || "-"}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {orders.length === 0 && !loading && (
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
              {pagination.totalElements > 0
                ? `Trang ${pagination.currentPage} không có dữ liệu. Tổng cộng ${pagination.totalElements} đơn hàng trong ${pagination.totalPages} trang.`
                : "Chưa có đơn hàng nào được tạo."}
            </p>
            {pagination.totalElements > 0 && pagination.currentPage > 1 && (
              <button
                onClick={() => fetchOrders(1)}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
              >
                Về trang đầu
              </button>
            )}
          </div>
        </div>
      )}

      {/* Simple Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4">
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
                disabled={pagination.first}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Trang trước
              </button>
              <span className="text-sm text-gray-500">
                Trang {pagination.currentPage} / {pagination.totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={pagination.last}
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
