import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  Eye,
  Banknote,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
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

  // modal state: confirm refund
  const [openRefundModal, setOpenRefundModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // modal state: detail cancelled links
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [detailOrder, setDetailOrder] = useState(null);

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
    }).format(amount ?? 0);

  const formatDate = (dateString) => {
    if (!dateString) return "";
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
      DAU_GIA: "Đấu giá",
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
    const totalPages = Math.max(
      1,
      Math.ceil(pagination.total / pagination.limit || 0)
    );
    const clamped = Math.min(Math.max(page, 1), totalPages);
    const newOffset = (clamped - 1) * pagination.limit;
    setPagination((prev) => ({
      ...prev,
      currentPage: clamped,
      offset: newOffset,
    }));
    fetchRefundOrders(newOffset, pagination.limit ?? 10);
  };

  const handleRefresh = () =>
    fetchRefundOrders(pagination.offset, pagination.limit);

  const totalPages = pagination.total
    ? Math.ceil(pagination.total / pagination.limit)
    : 0;

  // modal control: confirm refund
  const openRefundDialog = (order) => {
    setSelectedOrder(order);
    setOpenRefundModal(true);
  };
  const closeRefundDialog = () => {
    setSelectedOrder(null);
    setOpenRefundModal(false);
  };

  // modal control: detail cancelled links
  const openDetailDialog = (item) => {
    setDetailOrder(item);
    setOpenDetailModal(true);
  };
  const closeDetailDialog = () => {
    setDetailOrder(null);
    setOpenDetailModal(false);
  };

  // ===== Loading Skeleton Row (10 cột, đã bỏ "Kiểm tra") =====
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      {/* Mã đơn */}
      <td className="px-6 py-4">
        <div className="h-5 w-24 bg-gray-200 rounded-md" />
      </td>
      {/* Loại đơn */}
      <td className="px-6 py-4">
        <div className="h-4 w-20 bg-gray-200 rounded" />
      </td>
      {/* Trạng thái */}
      <td className="px-6 py-4">
        <div className="h-6 w-24 bg-gray-200 rounded-full" />
      </td>
      {/* Ngày tạo */}
      <td className="px-6 py-4">
        <div className="h-4 w-24 bg-gray-200 rounded" />
      </td>
      {/* Tỷ giá */}
      <td className="px-6 py-4 text-right">
        <div className="h-4 w-16 bg-gray-200 rounded ml-auto" />
      </td>
      {/* Giá trước phí */}
      <td className="px-6 py-4 text-right">
        <div className="h-4 w-24 bg-gray-200 rounded ml-auto" />
      </td>
      {/* Tổng tiền */}
      <td className="px-6 py-4 text-right">
        <div className="h-4 w-24 bg-gray-200 rounded ml-auto" />
      </td>
      {/* Tiền dư */}
      <td className="px-6 py-4 text-right">
        <div className="h-4 w-20 bg-gray-200 rounded ml-auto" />
      </td>
      {/* Links hủy */}
      <td className="px-6 py-4">
        <div className="h-4 w-32 bg-gray-200 rounded" />
      </td>
      {/* Hành động */}
      <td className="px-6 py-4 text-center">
        <div className="h-8 w-20 bg-gray-200 rounded mx-auto" />
      </td>
    </tr>
  );

  // ===== Modal chi tiết cancelledLinks =====
  const RefundOrderDetailModal = ({ open, data, onClose }) => {
    if (!open || !data) return null;
    const { order, cancelledLinks = [] } = data;
    const customer = order?.customer;

    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Chi tiết liên kết hủy – {order?.orderCode}
              </h3>
              {customer && (
                <p className="text-sm text-gray-500 mt-1">
                  Khách hàng:{" "}
                  <span className="font-medium">{customer.name}</span>{" "}
                  {customer.phone && `(${customer.phone})`}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-4 space-y-3 overflow-y-auto">
            {cancelledLinks.length === 0 && (
              <p className="text-sm text-gray-500">
                Không có link hủy nào cho đơn này.
              </p>
            )}

            {cancelledLinks.map((link) => (
              <div
                key={link.linkId}
                className="border border-gray-200 rounded-md p-3 bg-gray-50"
              >
                <p className="font-medium text-gray-800">
                  {link.productName || "Sản phẩm không tên"}
                </p>
                {link.productLink && (
                  <a
                    href={link.productLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 underline break-all"
                  >
                    {link.productLink}
                  </a>
                )}

                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>
                    SL:{" "}
                    <span className="font-semibold">{link.quantity ?? 0}</span>
                  </div>
                  <div>
                    Web:{" "}
                    <span className="font-semibold">
                      {formatCurrency(link.priceWeb)}
                    </span>
                  </div>
                  <div>
                    Ship web:{" "}
                    <span className="font-semibold">
                      {formatCurrency(link.shipWeb)}
                    </span>
                  </div>
                  <div>
                    Tổng web:{" "}
                    <span className="font-semibold">
                      {formatCurrency(link.totalWeb)}
                    </span>
                  </div>
                  <div>
                    Phí mua hộ:{" "}
                    <span className="font-semibold">
                      {formatCurrency(link.purchaseFee)}
                    </span>
                  </div>
                  <div>
                    Phụ thu:{" "}
                    <span className="font-semibold">
                      {formatCurrency(link.extraCharge)}
                    </span>
                  </div>
                  <div className="col-span-2">
                    Giá cuối (VND):{" "}
                    <span className="font-semibold">
                      {formatCurrency(link.finalPriceVnd)}
                    </span>
                  </div>
                  {link.trackingCode && (
                    <div className="col-span-2">
                      Mã tracking:{" "}
                      <span className="font-semibold">{link.trackingCode}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-500 text-white text-sm hover:bg-gray-600"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
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
                  "Links hủy",
                  "Hành động",
                ].map((col) => (
                  <th
                    key={col}
                    className={`px-6 py-3 text-xs font-medium uppercase tracking-wider ${
                      col === "Hành động"
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
              {/* Loading skeleton rows */}
              {loading &&
                Array.from({ length: Math.min(pagination.limit, 10) }).map(
                  (_, i) => <SkeletonRow key={`skeleton-${i}`} />
                )}

              {/* Data rows */}
              {!loading &&
                refundOrders.length > 0 &&
                refundOrders.map((item) => {
                  const order = item.order;
                  const links = item.cancelledLinks || [];
                  const s = getStatusInfo(order.status);
                  const leftover = order.leftoverMoney ?? 0;
                  const leftoverClass =
                    leftover < 0
                      ? "text-red-600"
                      : leftover > 0
                      ? "text-green-600"
                      : "text-gray-600";

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
                        className={`px-6 py-4 text-sm text-right font-medium ${leftoverClass}`}
                      >
                        {formatCurrency(order.leftoverMoney)}
                      </td>

                      {/* Links hủy (ẩn bớt) */}
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {links.length === 0 && (
                          <span className="text-gray-400">–</span>
                        )}

                        {links.length === 1 && (
                          <div className="space-y-1">
                            <p className="font-medium">
                              {links[0].productName || "Sản phẩm"}
                            </p>
                            {links[0].productLink && (
                              <p className="text-xs text-gray-500 truncate max-w-[220px]">
                                {links[0].productLink}
                              </p>
                            )}
                          </div>
                        )}

                        {links.length > 1 && (
                          <div className="space-y-2">
                            <div>
                              <p className="font-medium">
                                {links[0].productName || "Sản phẩm"}
                              </p>
                              {links[0].productLink && (
                                <p className="text-xs text-gray-500 truncate max-w-[220px]">
                                  {links[0].productLink}
                                </p>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 italic">
                              + {links.length - 1} link khác
                            </p>
                            {/* Nút Xem chi tiết to hơn */}
                            <button
                              onClick={() => openDetailDialog(item)}
                              className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:text-blue-800 transition-colors"
                            >
                              Xem chi tiết
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Hành động */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() =>
                              console.log("View order:", order.orderId)
                            }
                            className="p-1.5 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Xem chi tiết đơn"
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
                })}

              {!loading && refundOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={10}
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
      {pagination.total > 0 && totalPages > 1 && (
        <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              Hiển thị {(pagination.currentPage - 1) * pagination.limit + 1} -{" "}
              {Math.min(
                pagination.currentPage * pagination.limit,
                pagination.total
              )}{" "}
              trong tổng số {pagination.total} đơn
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1 || loading}
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
                      disabled={loading}
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
                disabled={pagination.currentPage === totalPages || loading}
                className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirm Refund */}
      <ConfirmRefundOrder
        open={openRefundModal}
        order={selectedOrder}
        onClose={closeRefundDialog}
        onSuccess={() => fetchRefundOrders(pagination.offset, pagination.limit)}
      />

      {/* Modal chi tiết cancelledLinks */}
      <RefundOrderDetailModal
        open={openDetailModal}
        data={detailOrder}
        onClose={closeDetailDialog}
      />
    </div>
  );
};

export default RefundOrder;
