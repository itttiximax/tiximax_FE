// src/Components/Payment/PaymentOrderList.jsx
import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import createOrderPaymentService from "../../Services/Payment/createOrderPaymentService";
import countStatusService from "../../Services/Order/countStatusService";
import confirmPaymentService from "../../Services/Payment/confirmPaymentService";
import {
  CheckCircle,
  Clock,
  Package,
  Truck,
  ChevronLeft,
  ChevronRight,
  FileText,
  CreditCard,
  AlertTriangle,
  CheckCircle as CheckIcon,
  User,
  Loader2,
} from "lucide-react";
import { confirmPaymentOrder } from "./ConfirmPaymentOrder";

/* ===== Helpers ===== */
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

const orderTypeLabel = (t) => {
  switch (t) {
    case "AUCTION":
      return "Đấu giá";
    case "SHOPPING":
      return "Mua hộ";
    case "SHIP":
      return "Vận chuyển";
    default:
      return t || "—";
  }
};

const statusBadge = (status) => {
  const map = {
    DA_XAC_NHAN: {
      text: "Đã xác nhận",
      cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    CHO_THANH_TOAN: {
      text: "Chờ thanh toán",
      cls: "bg-orange-50 text-orange-700 border-orange-200",
    },
    DA_DU_HANG: {
      text: "Đã đủ hàng",
      cls: "bg-blue-50 text-blue-700 border-blue-200",
    },
    CHO_THANH_TOAN_SHIP: {
      text: "Chờ thanh toán ship",
      cls: "bg-purple-50 text-purple-700 border-purple-200",
    },
  };
  const it = map[status] || {
    text: status || "—",
    cls: "bg-gray-50 text-gray-700 border-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold border rounded-full ${it.cls}`}
    >
      {it.text}
    </span>
  );
};

const PaymentOrderList = () => {
  const validTabs = [
    "DA_XAC_NHAN",
    "CHO_THANH_TOAN",
    "CHO_THANH_TOAN_SHIP",
    "DA_DU_HANG",
  ];
  const savedTab = localStorage.getItem("activeTab");
  const initialTab = validTabs.includes(savedTab) ? savedTab : "DA_XAC_NHAN";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statusCounts, setStatusCounts] = useState({});
  const [statsLoading, setStatsLoading] = useState(false);

  // Processing states
  const [processingMap, setProcessingMap] = useState({});
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    order: null,
  });

  const fetchOrders = async (status, page = 0) => {
    setLoading(true);
    try {
      const response = await createOrderPaymentService.getOrdersByStatus(
        status,
        page,
        10
      );
      setOrders(response.content || []);
      setTotalPages(response.totalPages || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const fetchStatusStatistics = async () => {
    try {
      const response = await countStatusService.getForPaymentStatistics();
      const normalizedCounts = validTabs.reduce((acc, tab) => {
        acc[tab] = response[tab] ?? 0;
        return acc;
      }, {});
      setStatusCounts(normalizedCounts);
    } catch (error) {
      console.error("Error fetching payment statistics:", error);
      toast.error("Không thể tải thống kê trạng thái");
      setStatusCounts(
        validTabs.reduce((acc, tab) => ({ ...acc, [tab]: 0 }), {})
      );
    }
  };

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
    setLoading(true);
    setStatsLoading(true);
    Promise.all([fetchOrders(activeTab, 0), fetchStatusStatistics()])
      .catch(() => {})
      .finally(() => {
        setLoading(false);
        setStatsLoading(false);
      });
  }, [activeTab]);

  const tabConfigs = [
    {
      key: "DA_XAC_NHAN",
      label: "Đã xác nhận",
      icon: CheckCircle,
      color: "emerald",
    },
    {
      key: "CHO_THANH_TOAN",
      label: "Chờ thanh toán",
      icon: Clock,
      color: "orange",
    },
    { key: "DA_DU_HANG", label: "Đã đủ hàng", icon: Package, color: "blue" },
    {
      key: "CHO_THANH_TOAN_SHIP",
      label: "Chờ thanh toán ship",
      icon: Truck,
      color: "purple",
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      emerald: {
        activeBg: "bg-emerald-600",
        activeBorder: "border-emerald-600",
        activeText: "text-white",
        icon: "text-emerald-600",
        badge: "bg-emerald-600",
      },
      orange: {
        activeBg: "bg-orange-600",
        activeBorder: "border-orange-600",
        activeText: "text-white",
        icon: "text-orange-600",
        badge: "bg-orange-600",
      },
      blue: {
        activeBg: "bg-blue-600",
        activeBorder: "border-blue-600",
        activeText: "text-white",
        icon: "text-blue-600",
        badge: "bg-blue-600",
      },
      purple: {
        activeBg: "bg-purple-600",
        activeBorder: "border-purple-600",
        activeText: "text-white",
        icon: "text-purple-600",
        badge: "bg-purple-600",
      },
    };
    return colors[color];
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchOrders(activeTab, newPage);
    }
  };

  /* ===== Confirm payment (CHO_THANH_TOAN) ===== */
  const handleOpenDialog = (order) => {
    setConfirmDialog({ isOpen: true, order });
  };

  const handleCloseDialog = () => {
    setConfirmDialog({ isOpen: false, order: null });
  };

  const handleDoConfirm = async () => {
    const order = confirmDialog.order;
    handleCloseDialog();
    if (!order) return;

    const orderId = order.orderId ?? order.id ?? order.code;
    const paymentCode = order.paymentCode;
    if (!paymentCode) {
      toast.error("Không tìm thấy mã thanh toán");
      return;
    }

    const token = localStorage.getItem("jwt");

    setProcessingMap((s) => ({ ...s, [orderId]: true }));
    const res = await confirmPaymentOrder({ paymentCode, token });
    setProcessingMap((s) => ({ ...s, [orderId]: false }));

    if (res.success) {
      toast.success(
        `Xác nhận thanh toán thành công cho đơn ${order.orderCode}!`,
        {
          duration: 3000,
        }
      );
      await fetchOrders(activeTab, currentPage);
      await fetchStatusStatistics();
    } else {
      toast.error(`Không thể xác nhận thanh toán: ${res.message}`, {
        duration: 5000,
      });
    }
  };

  /* ===== Confirm shipping payment (CHO_THANH_TOAN_SHIP) ===== */
  const handleConfirmShippingPayment = async (order) => {
    const orderId = order.orderId ?? order.id ?? order.code;
    const paymentCode = order.paymentCode || order.shippingPaymentCode;

    // Validate
    if (!paymentCode || !paymentCode.trim()) {
      toast.error("Không tìm thấy mã thanh toán vận chuyển");
      return;
    }

    // Get token
    const token = localStorage.getItem("jwt");
    if (!token) {
      toast.error("Vui lòng đăng nhập để xác nhận thanh toán");
      return;
    }

    // Set processing state
    setProcessingMap((s) => ({ ...s, [orderId]: true }));

    try {
      const result = await confirmPaymentService.confirmShippingPayment(
        paymentCode,
        token
      );

      // Success message từ backend
      const successMessage =
        result?.message ||
        result?.data?.message ||
        `Xác nhận thanh toán ship thành công cho đơn ${order.orderCode}!`;

      toast.success(successMessage, {
        icon: "✅",
        duration: 3000,
        style: {
          background: "#D1FAE5",
          color: "#065F46",
          border: "1px solid #6EE7B7",
        },
      });

      // Refresh data
      await fetchOrders(activeTab, currentPage);
      await fetchStatusStatistics();
    } catch (error) {
      console.error("Error confirming shipping payment:", error);

      // ✅ Simple error handling
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.response?.data?.detail ||
        error.message ||
        "Không thể xác nhận thanh toán vận chuyển";

      toast.error(errorMessage, {
        icon: "❌",
        duration: 4000,
        style: {
          background: "#FEE2E2",
          color: "#991B1B",
          border: "1px solid #FCA5A5",
        },
      });
    } finally {
      setProcessingMap((s) => ({ ...s, [orderId]: false }));
    }
  };

  // Header columns
  const getHeaderColumns = () => {
    if (activeTab === "CHO_THANH_TOAN") {
      return [
        { key: "orderCode", label: "Mã đơn hàng", colSpan: "col-span-2" },
        { key: "customerName", label: "Khách hàng", colSpan: "col-span-2" },
        { key: "paymentCode", label: "Mã giao dịch", colSpan: "col-span-2" },
        { key: "orderType", label: "Loại đơn", colSpan: "col-span-1" },
        { key: "status", label: "Trạng thái", colSpan: "col-span-1" },
        { key: "finalPrice", label: "Tổng tiền", colSpan: "col-span-1" },
        { key: "createdAt", label: "Ngày tạo", colSpan: "col-span-1" },
        { key: "actions", label: "Thao tác", colSpan: "col-span-2" },
      ];
    }

    if (activeTab === "CHO_THANH_TOAN_SHIP") {
      return [
        { key: "orderCode", label: "Mã đơn hàng", colSpan: "col-span-2" },
        { key: "customerName", label: "Khách hàng", colSpan: "col-span-2" },
        {
          key: "paymentCode",
          label: "Mã giao dịch ship",
          colSpan: "col-span-2",
        },
        { key: "orderType", label: "Loại đơn", colSpan: "col-span-1" },
        { key: "status", label: "Trạng thái", colSpan: "col-span-1" },
        { key: "finalPrice", label: "Phí ship", colSpan: "col-span-1" },
        { key: "createdAt", label: "Ngày tạo", colSpan: "col-span-1" },
        { key: "actions", label: "Thao tác", colSpan: "col-span-2" },
      ];
    }

    return [
      { key: "orderCode", label: "Mã đơn hàng", colSpan: "col-span-2" },
      { key: "customerName", label: "Khách hàng", colSpan: "col-span-2" },
      { key: "orderType", label: "Loại đơn", colSpan: "col-span-1" },
      { key: "status", label: "Trạng thái", colSpan: "col-span-1" },
      { key: "finalPrice", label: "Tổng tiền", colSpan: "col-span-2" },
      { key: "createdAt", label: "Ngày tạo", colSpan: "col-span-2" },
      { key: "spacer", label: "", colSpan: "col-span-2" },
    ];
  };

  /* ===== Render body rows ===== */
  const renderRows = () => {
    const rows = (orders || []).map((order) => {
      const customerName = order?.customer?.name || "N/A";
      const code = order?.code || order?.orderCode || "—";
      const payCode = order?.paymentCode || order?.transactionCode || "—";
      const typeLabel = orderTypeLabel(order?.orderType);
      const price = formatCurrency(order?.finalPriceOrder ?? order?.finalPrice);
      const created = formatDate(order?.createdAt || order?.createdDate);
      const badge = statusBadge(order?.status || activeTab);
      const orderId = order.orderId ?? order.id ?? code;
      const isProcessing = !!processingMap[orderId];

      // Tab CHO_THANH_TOAN
      if (activeTab === "CHO_THANH_TOAN") {
        return (
          <div
            key={orderId}
            className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 items-center hover:bg-gray-50 transition-colors"
          >
            <div className="col-span-2">
              <div className="font-semibold text-gray-900">{code}</div>
              <div className="text-xs text-gray-500">{order?.id || ""}</div>
            </div>
            <div className="col-span-2">
              <div className="text-gray-900">{customerName}</div>
              <div className="text-xs text-gray-500">
                {order?.customer?.phone || order?.customer?.email || ""}
              </div>
            </div>
            <div className="col-span-2">
              {order?.paymentCode ? (
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-600 truncate">
                    {payCode}
                  </span>
                </div>
              ) : (
                <span className="text-xs text-gray-400">-</span>
              )}
            </div>
            <div className="col-span-1">{typeLabel}</div>
            <div className="col-span-1">{badge}</div>
            <div className="col-span-1 font-semibold">{price} đ</div>
            <div className="col-span-1 text-gray-600 text-sm">{created}</div>
            <div className="col-span-2 flex justify-end">
              <button
                onClick={() => handleOpenDialog(order)}
                disabled={isProcessing}
                className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors
                  ${
                    isProcessing
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                  }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-4 h-4" />
                    Xác nhận thanh toán
                  </>
                )}
              </button>
            </div>
          </div>
        );
      }

      // Tab CHO_THANH_TOAN_SHIP
      if (activeTab === "CHO_THANH_TOAN_SHIP") {
        return (
          <div
            key={orderId}
            className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 items-center hover:bg-gray-50 transition-colors"
          >
            <div className="col-span-2">
              <div className="font-semibold text-gray-900">{code}</div>
              <div className="text-xs text-gray-500">{order?.id || ""}</div>
            </div>
            <div className="col-span-2">
              <div className="text-gray-900">{customerName}</div>
              <div className="text-xs text-gray-500">
                {order?.customer?.phone || order?.customer?.email || ""}
              </div>
            </div>
            <div className="col-span-2">
              {order?.paymentCode ? (
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-600 truncate">
                    {payCode}
                  </span>
                </div>
              ) : (
                <span className="text-xs text-gray-400">-</span>
              )}
            </div>
            <div className="col-span-1">{typeLabel}</div>
            <div className="col-span-1">{badge}</div>
            <div className="col-span-1 font-semibold">{price} đ</div>
            <div className="col-span-1 text-gray-600 text-sm">{created}</div>
            <div className="col-span-2 flex justify-end">
              <button
                onClick={() => handleConfirmShippingPayment(order)}
                disabled={isProcessing}
                className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors
                  ${
                    isProcessing
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                      : "bg-purple-600 text-white hover:bg-purple-700 shadow-sm"
                  }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Truck className="w-4 h-4" />
                    Xác nhận thanh toán ship
                  </>
                )}
              </button>
            </div>
          </div>
        );
      }

      // Các tab còn lại
      return (
        <div
          key={orderId}
          className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 items-center hover:bg-gray-50 transition-colors"
        >
          <div className="col-span-2">
            <div className="font-semibold text-gray-900">{code}</div>
            <div className="text-xs text-gray-500">{order?.id || ""}</div>
          </div>
          <div className="col-span-2">
            <div className="text-gray-900">{customerName}</div>
            <div className="text-xs text-gray-500">
              {order?.customer?.phone || order?.customer?.email || ""}
            </div>
          </div>
          <div className="col-span-1">{typeLabel}</div>
          <div className="col-span-1">{badge}</div>
          <div className="col-span-2 font-semibold">{price} đ</div>
          <div className="col-span-2 text-gray-600 text-sm">{created}</div>
          <div className="col-span-2">{/* spacer */}</div>
        </div>
      );
    });

    return <div>{rows}</div>;
  };

  return (
    <div className="min-h-screen  py-6 px-4">
      <Toaster position="top-right" />

      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Quản lý thanh toán đơn hàng
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Theo dõi và xác nhận các giao dịch thanh toán
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow border border-gray-200 mb-6">
          <div className="grid grid-cols-4 gap-px bg-gray-200">
            {tabConfigs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              const color = getColorClasses(tab.color);
              const count = statusCounts[tab.key] ?? 0;

              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  aria-current={isActive ? "page" : undefined}
                  className={`
                    relative px-6 py-4 text-left border first:rounded-tl-lg last:rounded-tr-lg
                    ${
                      isActive
                        ? `${color.activeBg} ${color.activeText} ${color.activeBorder}`
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    }
                    focus:outline-none transition-all
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-5 h-5 ${
                          isActive ? "text-white" : color.icon
                        }`}
                      />
                      <span className="text-sm font-semibold">{tab.label}</span>
                    </div>

                    {statsLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    ) : (
                      <span
                        className={`
                          px-2.5 py-0.5 rounded-full text-xs font-bold
                          ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-gray-100 text-gray-600"
                          }
                        `}
                      >
                        {count}
                      </span>
                    )}
                  </div>

                  {isActive && (
                    <div
                      className={`absolute bottom-0 left-0 right-0 h-1 ${color.badge}`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-12">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              <p className="mt-4 text-sm text-gray-600 font-medium">
                Đang tải dữ liệu...
              </p>
            </div>
          </div>
        )}

        {/* Orders Table */}
        {!loading && (
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            {orders.length === 0 ? (
              <div className="text-center py-16 px-6">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Không có đơn hàng
                </h3>
                <p className="text-sm text-gray-500">
                  Chưa có đơn hàng nào với trạng thái này
                </p>
              </div>
            ) : (
              <>
                {/* Table Header */}
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                  <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {getHeaderColumns().map((column) => (
                      <div key={column.key} className={column.colSpan}>
                        {column.label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Table Body */}
                {renderRows()}
              </>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between bg-white rounded-lg shadow border border-gray-200 px-6 py-4">
            <div className="text-sm text-gray-700">
              Trang <span className="font-semibold">{currentPage + 1}</span> /{" "}
              <span className="font-semibold">{totalPages}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className={`
                  flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border transition-colors
                  ${
                    currentPage === 0
                      ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }
                `}
              >
                <ChevronLeft className="w-4 h-4" />
                Trước
              </button>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className={`
                  flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border transition-colors
                  ${
                    currentPage >= totalPages - 1
                      ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }
                `}
              >
                Sau
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialog (CHO_THANH_TOAN only) */}
      {confirmDialog.isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            {/* Header */}
            <div className="flex items-center gap-3 p-5 border-b border-slate-200 bg-slate-50">
              <div className="bg-blue-600 p-2.5 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3
                  id="confirm-title"
                  className="text-base font-bold text-slate-900"
                >
                  Xác nhận thanh toán
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Vui lòng kiểm tra kỹ thông tin trước khi xác nhận
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="p-5">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-amber-800 font-medium">
                  Bạn có chắc chắn muốn xác nhận thanh toán cho đơn hàng này
                  không?
                </p>
              </div>

              {confirmDialog.order && (
                <div className="space-y-3">
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4 text-slate-600" />
                      <span className="text-xs font-medium text-slate-600">
                        Mã đơn hàng
                      </span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">
                      {confirmDialog.order.orderCode}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <div className="flex items-center gap-2 mb-1">
                        <CreditCard className="w-4 h-4 text-slate-600" />
                        <span className="text-xs font-medium text-slate-600">
                          Mã giao dịch
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-blue-600">
                        {confirmDialog.order.paymentCode}
                      </span>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-slate-600" />
                        <span className="text-xs font-medium text-slate-600">
                          Khách hàng
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-slate-900 truncate block">
                        {confirmDialog.order.customer?.name || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="bg-blue-600 rounded-lg p-4 border-2 border-blue-500 shadow-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckIcon className="w-4 h-4 text-white" />
                      <span className="text-xs font-medium text-blue-100">
                        Số tiền thanh toán
                      </span>
                    </div>
                    <span className="text-lg font-bold text-white">
                      {formatCurrency(
                        confirmDialog.order.finalPriceOrder ||
                          confirmDialog.order.finalPrice
                      )}{" "}
                      đ
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-5 border-t border-slate-200 bg-slate-50">
              <button
                onClick={handleCloseDialog}
                className="flex-1 px-4 py-2.5 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-white transition-colors font-semibold text-sm"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleDoConfirm}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm shadow-md"
              >
                <CheckIcon className="w-4 h-4" />
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentOrderList;
