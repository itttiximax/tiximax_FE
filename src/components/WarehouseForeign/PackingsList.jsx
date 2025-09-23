import React, { useState, useEffect } from "react";
import packingsService from "../../Services/Warehouse/packingsService";

const PackingsList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);
  const [error, setError] = useState(null);

  // Load orders with pagination
  const loadOrders = async (page = 0, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await packingsService.getEligibleOrders(page, limit);
      setOrders(response.content || []);
      setTotalOrders(response.totalElements || 0);
      setCurrentPage(page);
    } catch (err) {
      setError("Không thể tải danh sách đơn hàng");
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load all orders
  const loadAllOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const allOrders = await packingsService.getAllEligibleOrders(pageSize);
      setOrders(allOrders);
      setTotalOrders(allOrders.length);
    } catch (err) {
      setError("Không thể tải tất cả đơn hàng");
      console.error("Error loading all orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total products for an order
  const getTotalProducts = (trackingCodeToProductCount) => {
    return Object.values(trackingCodeToProductCount).reduce(
      (sum, count) => sum + count,
      0
    );
  };

  // Get tracking codes list
  const getTrackingCodes = (trackingCodeToProductCount) => {
    return Object.keys(trackingCodeToProductCount);
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

  const totalPages = Math.ceil(totalOrders / pageSize);

  return (
    <div className=" mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Danh sách đơn hàng đóng gói
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={loadAllOrders}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            {loading ? "Đang tải..." : "Tải tất cả"}
          </button>
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            disabled={loading}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value={5}>5 / trang</option>
            <option value={10}>10 / trang</option>
            <option value={20}>20 / trang</option>
            <option value={50}>50 / trang</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      STT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã đơn hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tracking Codes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tổng sản phẩm
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chi tiết
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.length > 0 ? (
                    orders.map((order, index) => (
                      <tr
                        key={order.orderCode}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {currentPage * pageSize + index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-blue-600 font-semibold text-sm">
                            {order.orderCode}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {getTrackingCodes(
                              order.trackingCodeToProductCount
                            ).map((code) => (
                              <span
                                key={code}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {code}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-green-600 font-bold text-sm">
                            {getTotalProducts(order.trackingCodeToProductCount)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs text-gray-600 space-y-1">
                            {Object.entries(
                              order.trackingCodeToProductCount
                            ).map(([code, count]) => (
                              <div key={code} className="flex justify-between">
                                <span>{code}:</span>
                                <span className="font-medium">
                                  {count} sản phẩm
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-12 text-center text-gray-500 italic"
                      >
                        Không có đơn hàng nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0 || loading}
                className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Trang trước
              </button>

              <div className="text-sm text-gray-600 text-center">
                <span className="font-medium">Trang {currentPage + 1}</span>
                <span className="mx-2">/</span>
                <span>{totalPages}</span>
                <span className="block sm:inline sm:ml-2">
                  ({totalOrders} đơn hàng)
                </span>
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1 || loading}
                className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Trang sau
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PackingsList;
