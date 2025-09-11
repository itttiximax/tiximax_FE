import React, { useState, useEffect, useCallback } from "react";
import orderlinkService from "../../Services/StaffPurchase/orderlinkService";
import DetailOrderLink from "./DetailOrderLink";
import CreatePurchase from "./CreatePurchase";
import toast from "react-hot-toast";

const OrderLinkList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLinkId, setSelectedLinkId] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 10,
    totalPages: 0,
    totalElements: 0,
    first: true,
    last: true,
  });

  // States for CreatePurchase component
  const [showCreatePurchase, setShowCreatePurchase] = useState(false);
  const [selectedOrderForPurchase, setSelectedOrderForPurchase] =
    useState(null);

  // Memoized fetch function
  const fetchOrders = useCallback(async (page = 0, size = 10) => {
    try {
      setLoading(true);
      setError(null);

      const response = await orderlinkService.getOrdersWithLinks(page, size);

      if (response?.content) {
        setOrders(response.content);
        setPagination({
          pageNumber: response.number ?? 0,
          pageSize: response.size ?? 10,
          totalPages: response.totalPages ?? 0,
          totalElements: response.totalElements ?? 0,
          first: response.first ?? true,
          last: response.last ?? true,
        });
      } else {
        setOrders([]);
        setPagination((prev) => ({ ...prev, totalElements: 0, totalPages: 0 }));
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error.message);
      toast.error("Không thể tải danh sách đơn hàng");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Handle pagination
  const handlePageChange = useCallback(
    (newPage) => {
      if (
        newPage >= 0 &&
        newPage < pagination.totalPages &&
        newPage !== pagination.pageNumber
      ) {
        fetchOrders(newPage, pagination.pageSize);
      }
    },
    [
      fetchOrders,
      pagination.pageNumber,
      pagination.pageSize,
      pagination.totalPages,
    ]
  );

  // Handle view detail
  const handleViewDetail = useCallback((linkId) => {
    setSelectedLinkId(linkId);
  }, []);

  // Handle close detail
  const handleCloseDetail = useCallback(() => {
    setSelectedLinkId(null);
  }, []);

  // Toggle expand order
  const toggleExpandOrder = useCallback((orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  }, []);

  // Handle create purchase
  const handleCreatePurchase = useCallback((order) => {
    if (!order.orderLinks?.length) {
      toast.error("Đơn hàng này chưa có sản phẩm nào");
      return;
    }
    setSelectedOrderForPurchase(order);
    setShowCreatePurchase(true);
  }, []);

  // Handle close create purchase modal
  const handleCloseCreatePurchase = useCallback(() => {
    setShowCreatePurchase(false);
    setSelectedOrderForPurchase(null);
  }, []);

  // Handle purchase success
  const handlePurchaseSuccess = useCallback(() => {
    fetchOrders(pagination.pageNumber, pagination.pageSize);
  }, [fetchOrders, pagination.pageNumber, pagination.pageSize]);

  // Utility functions
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    if (amount == null) return "N/A";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const statusColors = {
      CHO_MUA: "bg-yellow-100 text-yellow-800",
      DANG_MUA: "bg-blue-100 text-blue-800",
      DA_MUA: "bg-green-100 text-green-800",
      HUY: "bg-red-100 text-red-800",
      HOAT_DONG: "bg-green-100 text-green-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  const getOrderTypeDisplay = (type) => (type === "MUA_HO" ? "Mua hộ" : type);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Đang tải danh sách đơn hàng...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <svg
              className="w-12 h-12 text-red-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không thể tải dữ liệu
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => fetchOrders()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  const start = pagination.pageNumber * pagination.pageSize + 1;
  const end = Math.min(
    (pagination.pageNumber + 1) * pagination.pageSize,
    pagination.totalElements
  );

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Danh sách đơn hàng
            </h1>
            <div className="text-sm text-gray-500 space-y-1">
              <div>
                Trang: {pagination.pageNumber + 1}/{pagination.totalPages || 1}
              </div>
              <div>Tổng: {pagination.totalElements} đơn hàng</div>
              {pagination.totalElements > 0 && (
                <div>
                  Hiển thị: {start} - {end}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không có đơn hàng
              </h3>
              <p className="text-gray-600">
                Hiện tại chưa có đơn hàng nào trong hệ thống.
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.orderId}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                {/* Order Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {order.orderCode}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {getOrderTypeDisplay(order.orderType)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Ngày tạo:</span>{" "}
                        {formatDate(order.createdAt)}
                      </div>
                      <div>
                        <span className="font-medium">Tỷ giá:</span>{" "}
                        {order.exchangeRate?.toLocaleString() || "N/A"}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end space-y-2">
                    <div>
                      <div className="text-lg font-bold text-gray-900">
                        {formatCurrency(order.finalPriceOrder)}
                      </div>
                      <div className="text-sm text-gray-500">Tổng tiền</div>
                    </div>
                    {order.orderLinks?.length > 0 && (
                      <button
                        onClick={() => handleCreatePurchase(order)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors flex items-center"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        Tạo Purchase
                      </button>
                    )}
                  </div>
                </div>

                {/* Order Links */}
                {order.orderLinks?.length > 0 ? (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-700 flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                        Sản phẩm ({order.orderLinks.length})
                      </h4>
                      {order.orderLinks.length > 2 && (
                        <button
                          onClick={() => toggleExpandOrder(order.orderId)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                        >
                          {expandedOrders[order.orderId] ? (
                            <>
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 15l7-7 7 7"
                                />
                              </svg>
                              Thu gọn
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                              Xem tất cả
                            </>
                          )}
                        </button>
                      )}
                    </div>
                    <div className="space-y-3">
                      {(order.orderLinks.length <= 1 ||
                      expandedOrders[order.orderId]
                        ? order.orderLinks
                        : order.orderLinks.slice(0, 0)
                      ).map((link) => (
                        <div
                          key={link.linkId}
                          className="border border-gray-200 rounded-md p-4 bg-gray-50"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                              <div className="text-sm">
                                <div className="font-medium text-gray-900 mb-1">
                                  {link.productName !== "string"
                                    ? link.productName
                                    : "Tên sản phẩm"}
                                </div>
                                <div className="text-gray-600">
                                  Website:{" "}
                                  {link.website !== "string"
                                    ? link.website
                                    : "N/A"}
                                </div>
                                <div className="text-gray-600">
                                  Tracking: {link.trackingCode}
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="text-sm">
                                <div className="text-gray-600">
                                  SL: {link.quantity}
                                </div>
                                <div className="text-gray-600">
                                  Giá web:{" "}
                                  {link.priceWeb?.toLocaleString() || 0}
                                </div>
                                <div className="text-gray-600">
                                  Giá Ship:{" "}
                                  {link.shipWeb?.toLocaleString() || 0}
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="text-sm">
                                <div className="text-gray-600">
                                  Group Tag:{" "}
                                  {link.groupTag !== "string"
                                    ? link.groupTag
                                    : "N/A"}
                                </div>
                                <div className="text-gray-600">
                                  Note: {link.note || "N/A"}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-semibold text-gray-900 mb-2">
                                {formatCurrency(link.finalPriceVnd)}
                              </div>
                              <div className="flex flex-col space-y-2">
                                <span
                                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                    link.status
                                  )}`}
                                >
                                  {link.status}
                                </span>
                                <button
                                  onClick={() => handleViewDetail(link.linkId)}
                                  className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs hover:bg-blue-700 transition-colors flex items-center justify-center"
                                >
                                  <svg
                                    className="w-3 h-3 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                  </svg>
                                  Chi tiết
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-yellow-600 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                      <span className="text-sm text-yellow-800">
                        Đơn hàng chưa có sản phẩm nào
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                {pagination.totalElements > 0 ? (
                  <>
                    Hiển thị <span className="font-medium">{start}</span> -{" "}
                    <span className="font-medium">{end}</span> trong tổng số{" "}
                    <span className="font-medium">
                      {pagination.totalElements}
                    </span>{" "}
                    đơn hàng
                  </>
                ) : (
                  "Không có dữ liệu"
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(0)}
                  disabled={pagination.first}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ««
                </button>
                <button
                  onClick={() => handlePageChange(pagination.pageNumber - 1)}
                  disabled={pagination.first}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  « Trước
                </button>
                <span className="px-4 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-medium">
                  {pagination.pageNumber + 1} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.pageNumber + 1)}
                  disabled={pagination.last}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Tiếp »
                </button>
                <button
                  onClick={() => handlePageChange(pagination.totalPages - 1)}
                  disabled={pagination.last}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  »»
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreatePurchase
        isOpen={showCreatePurchase}
        onClose={handleCloseCreatePurchase}
        orderCode={selectedOrderForPurchase?.orderCode}
        orderLinks={selectedOrderForPurchase?.orderLinks || []}
        onSuccess={handlePurchaseSuccess}
      />

      {selectedLinkId && (
        <DetailOrderLink linkId={selectedLinkId} onClose={handleCloseDetail} />
      )}
    </div>
  );
};

export default OrderLinkList;
