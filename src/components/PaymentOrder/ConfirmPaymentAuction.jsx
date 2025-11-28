// src/Components/Payment/ConfirmPaymentAuction.jsx
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import createOrderPaymentService from "../../Services/Payment/createOrderPaymentService";
import {
  CheckCircle,
  X,
  Loader2,
  DollarSign,
  AlertCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  FileText,
  Search,
  Gavel,
} from "lucide-react";

const formatCurrency = (v) => {
  if (v === null || v === undefined || isNaN(Number(v))) return "—";
  try {
    return new Intl.NumberFormat("vi-VN").format(Number(v));
  } catch {
    return String(v);
  }
};

const formatDate = (isoStr) => {
  if (!isoStr) return "—";
  try {
    const d = new Date(isoStr);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
  } catch {
    return isoStr;
  }
};

const statusBadge = () => {
  return (
    <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold border rounded-full bg-orange-50 text-orange-700 border-orange-200">
      Chờ thanh toán đấu giá
    </span>
  );
};

// Dialog Component
const PaymentDialog = ({ order, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await createOrderPaymentService.confirmPaymentOrder(
        order?.id || order?.orderId
      );
      toast.success("Xác nhận thanh toán đấu giá thành công!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error confirming auction payment:", error);
      toast.error(
        error?.response?.data?.message ||
          "Không thể xác nhận thanh toán đấu giá"
      );
    } finally {
      setLoading(false);
    }
  };

  const orderCode = order?.code || order?.orderCode || "—";
  const customerName = order?.customer?.name || "N/A";
  const finalPrice = formatCurrency(
    order?.finalPriceOrder ?? order?.finalPrice
  );
  const paymentCode = order?.paymentCode || order?.transactionCode || "—";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Xác nhận thanh toán đấu giá
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          {/* Warning */}
          <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-orange-800">
              <p className="font-medium mb-1">Lưu ý quan trọng</p>
              <p>
                Vui lòng kiểm tra kỹ thông tin thanh toán đấu giá trước khi xác
                nhận. Thao tác này không thể hoàn tác.
              </p>
            </div>
          </div>

          {/* Order Info */}
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Mã đơn hàng:</span>
              <span className="text-sm font-semibold text-gray-900">
                {orderCode}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Khách hàng:</span>
              <span className="text-sm font-medium text-gray-900">
                {customerName}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Mã giao dịch:</span>
              <span className="text-sm font-medium text-blue-600">
                {paymentCode}
              </span>
            </div>

            <div className="flex justify-between py-2 bg-orange-50 px-3 rounded-lg">
              <span className="text-sm font-medium text-gray-900">
                Số tiền đấu giá:
              </span>
              <span className="text-base font-bold text-orange-600">
                {finalPrice} đ
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Xác nhận thanh toán
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const ConfirmPaymentAuction = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const PAGE_SIZE = 50;
  const STATUS = "CHO_THANH_TOAN_DAU_GIA";

  const fetchOrders = async (page = 0) => {
    setLoading(true);
    try {
      const response = await createOrderPaymentService.getOrdersByStatus(
        STATUS,
        page,
        PAGE_SIZE
      );
      setOrders(response.content || []);
      setTotalPages(response.totalPages || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching auction orders:", error);
      setOrders([]);
      toast.error("Không thể tải danh sách đơn đấu giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(0);
  }, []);

  const refreshAll = async () => {
    await fetchOrders(currentPage);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchOrders(newPage);
    }
  };

  const handleOpenDialog = (order) => {
    setSelectedOrder(order);
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setSelectedOrder(null);
  };

  const orderTypeLabel = (t) => {
    switch (t) {
      case "DAU_GIA":
      case "AUCTION":
        return "Đấu giá";
      default:
        return t || "—";
    }
  };

  const renderRows = () => {
    const term = searchTerm.trim().toLowerCase();

    const filteredOrders = (orders || []).filter((order) => {
      if (!term) return true;

      const code = (order?.code || order?.orderCode || "").toLowerCase();
      const payCode = (
        order?.paymentCode ||
        order?.transactionCode ||
        ""
      ).toLowerCase();

      return code.includes(term) || payCode.includes(term);
    });

    if (filteredOrders.length === 0) {
      return (
        <div className="col-span-12 text-center py-8 text-gray-500">
          Không tìm thấy đơn hàng phù hợp
        </div>
      );
    }

    return filteredOrders.map((order) => {
      const customerName = order?.customer?.name || "N/A";
      const code = order?.code || order?.orderCode || "—";
      const payCode = order?.paymentCode || order?.transactionCode || "—";
      const typeLabel = orderTypeLabel(order?.orderType);
      const price = formatCurrency(order?.finalPriceOrder ?? order?.finalPrice);
      const created = formatDate(order?.createdAt || order?.createdDate);
      const badge = statusBadge();

      return (
        <div
          key={order.id || order.orderId || code}
          className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 items-center hover:bg-gray-50 transition-colors"
        >
          <div className="col-span-2 font-semibold text-gray-900">{code}</div>
          <div className="col-span-2 text-gray-900">{customerName}</div>
          <div className="col-span-2 text-blue-600 truncate">{payCode}</div>
          <div className="col-span-1">{typeLabel}</div>
          <div className="col-span-1">{badge}</div>
          <div className="col-span-1 font-semibold text-orange-600">
            {price} đ
          </div>
          <div className="col-span-1 text-gray-600 text-sm">{created}</div>
          <div className="col-span-2 flex justify-end">
            <button
              onClick={() => handleOpenDialog(order)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 transition-colors"
            >
              <DollarSign className="w-4 h-4" />
              Xác nhận thanh toán
            </button>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Gavel className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Thanh toán đấu giá
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Quản lý các đơn hàng đấu giá chờ thanh toán
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm mã đơn hoặc mã giao dịch..."
              className="pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-72"
            />
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow border border-orange-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">
                Tổng đơn chờ thanh toán
              </p>
              <p className="text-3xl font-bold text-orange-900 mt-1">
                {loading ? "..." : orders.length}
              </p>
            </div>
            <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-orange-700" />
            </div>
          </div>
        </div>

        {/* Loading / List */}
        {loading ? (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
            <Loader2 className="w-12 h-12 text-orange-600 animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-600 font-medium">
              Đang tải dữ liệu đấu giá...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow border border-gray-200 text-center py-16 px-6">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Không có đơn đấu giá
            </h3>
            <p className="text-sm text-gray-500">
              Chưa có đơn hàng đấu giá nào chờ thanh toán
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="col-span-2">Mã đơn hàng</div>
                <div className="col-span-2">Khách hàng</div>
                <div className="col-span-2">Mã giao dịch</div>
                <div className="col-span-1">Loại đơn</div>
                <div className="col-span-1">Trạng thái</div>
                <div className="col-span-1">Tổng tiền</div>
                <div className="col-span-1">Ngày tạo</div>
                <div className="col-span-2">Thao tác</div>
              </div>
            </div>
            {/* Rows */}
            {renderRows()}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between bg-white rounded-lg shadow border border-gray-200 px-6 py-4">
            <div className="text-sm text-gray-700">
              Trang <span className="font-semibold">{currentPage + 1}</span> /{" "}
              <span className="font-semibold">{totalPages}</span>
              <span className="ml-2 text-xs text-gray-500">
                ({PAGE_SIZE} đơn / trang)
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
                  currentPage === 0
                    ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Trước
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
                  currentPage >= totalPages - 1
                    ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Sau
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Dialog */}
      {showDialog && selectedOrder && (
        <PaymentDialog
          order={selectedOrder}
          onClose={handleCloseDialog}
          onSuccess={refreshAll}
        />
      )}
    </div>
  );
};

export default ConfirmPaymentAuction;
