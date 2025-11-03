import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  Eye,
  Banknote,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Loader2,
} from "lucide-react";
import orderService from "../../Services/LeadSale/orderService";
import ConfirmRefundOrder from "./ConfirmRefundOrder"; // <-- modal confirm

const RefundOrder = () => {
  const [refundOrders, setRefundOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
    total: 0,
    currentPage: 1,
  });

  // modal state
  const [openRefundModal, setOpenRefundModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // fetch list
  const fetchRefundOrders = async (offset = 0, limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getRefundOrders(offset, limit);
      setRefundOrders(response.content || []);
      setPagination((prev) => ({
        ...prev,
        offset,
        limit,
        total: response.totalElements || response.content?.length || 0,
      }));
    } catch (err) {
      setError("Không thể tải danh sách hoàn tiền. Vui lòng thử lại.");
      console.error("Error fetching refund orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefundOrders();
  }, []);

  // helpers
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getOrderTypeName = (type) => {
    const map = {
      MUA_HO: "Mua hộ",
      CHIA_DON: "Chia đơn",
      NHAP_HANG: "Nhập hàng",
    };
    return map[type] || type;
  };

  const getStatusInfo = (status) => {
    const map = {
      DA_HUY: {
        name: "Đã hủy",
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
      },
      CHO_HOAN_TIEN: {
        name: "Chờ hoàn tiền",
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
      },
      DA_HOAN_TIEN: {
        name: "Đã hoàn tiền",
        bg: "bg-green-50",
        text: "text-green-700",
        border: "border-green-200",
      },
      DANG_XU_LY: {
        name: "Đang xử lý",
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
      },
    };
    return (
      map[status] || {
        name: status,
        bg: "bg-gray-50",
        text: "text-gray-700",
        border: "border-gray-200",
      }
    );
  };

  // pagination logic
  const handlePageChange = (page) => {
    const newOffset = (page - 1) * pagination.limit;
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
      offset: newOffset,
    }));
    fetchRefundOrders(newOffset, pagination.limit);
  };
  const handleRefresh = () =>
    fetchRefundOrders(pagination.offset, pagination.limit);

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  // modal control
  const openRefundDialog = (order) => {
    setSelectedOrder(order);
    setOpenRefundModal(true);
  };
  const closeRefundDialog = () => {
    setSelectedOrder(null);
    setOpenRefundModal(false);
  };

  return (
    <div className="min-h-screen  p-4 md:p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Danh sách đơn hoàn tiền
          </h2>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-12 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-gray-500">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {[
                      "Mã đơn",
                      "Loại đơn",
                      "Trạng thái",
                      "Ngày tạo",
                      "Tỷ giá",
                      "Giá trước phí",
                      "Tổng tiền",
                      "Tiền dư",
                      "Kiểm tra",
                      "Hành động",
                    ].map((col) => (
                      <th
                        key={col}
                        className={`px-6 py-3 text-xs font-medium uppercase tracking-wider ${
                          col === "Hành động" || col === "Kiểm tra"
                            ? "text-center text-gray-600"
                            : "text-left text-gray-600"
                        }`}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {refundOrders.length > 0 ? (
                    refundOrders.map((order) => {
                      const s = getStatusInfo(order.status);
                      return (
                        <tr
                          key={order.orderId}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
                              {order.orderCode}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {getOrderTypeName(order.orderType)}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${s.bg} ${s.text} ${s.border}`}
                            >
                              {s.name}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700 text-right">
                            {order.exchangeRate}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700 text-right">
                            {formatCurrency(order.priceBeforeFee)}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">
                            {formatCurrency(order.finalPriceOrder)}
                          </td>
                          <td
                            className={`px-6 py-4 text-sm text-right font-medium ${
                              order.leftoverMoney < 0
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {formatCurrency(order.leftoverMoney)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {order.checkRequired ? (
                              <Check className="w-5 h-5 text-green-500 inline" />
                            ) : (
                              <X className="w-5 h-5 text-gray-300 inline" />
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() =>
                                  console.log("View order:", order.orderId)
                                }
                                className="p-1.5 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                title="Xem chi tiết"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openRefundDialog(order)}
                                className="p-1.5 rounded-md text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
                                title="Xử lý hoàn tiền"
                              >
                                <Banknote className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="10"
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <AlertCircle className="w-12 h-12 text-gray-300" />
                          <p>Không có đơn hoàn tiền nào</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-600">
                  Hiển thị {(pagination.currentPage - 1) * pagination.limit + 1}{" "}
                  -{" "}
                  {Math.min(
                    pagination.currentPage * pagination.limit,
                    pagination.total
                  )}{" "}
                  trong tổng số {pagination.total} đơn
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {[...Array(totalPages)].map((_, i) => {
                    const p = i + 1;
                    if (
                      p === 1 ||
                      p === totalPages ||
                      (p >= pagination.currentPage - 2 &&
                        p <= pagination.currentPage + 2)
                    ) {
                      return (
                        <button
                          key={p}
                          onClick={() => handlePageChange(p)}
                          className={`px-3 py-1 rounded-md text-sm font-medium ${
                            p === pagination.currentPage
                              ? "bg-blue-500 text-white"
                              : "hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          {p}
                        </button>
                      );
                    } else if (
                      p === pagination.currentPage - 3 ||
                      p === pagination.currentPage + 3
                    ) {
                      return (
                        <span key={p} className="px-2 text-gray-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}

                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === totalPages}
                    className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ✅ Modal Confirm Refund */}
      <ConfirmRefundOrder
        open={openRefundModal}
        order={selectedOrder}
        onClose={closeRefundDialog}
        onSuccess={() => fetchRefundOrders(pagination.offset, pagination.limit)}
      />
    </div>
  );
};

export default RefundOrder;
