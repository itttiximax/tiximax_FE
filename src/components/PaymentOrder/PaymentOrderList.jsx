// src/Components/Payment/PaymentOrderList.jsx
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import createOrderPaymentService from "../../Services/Payment/createOrderPaymentService";
import {
  CheckCircle,
  Clock,
  Package,
  Truck,
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
  Search,
} from "lucide-react";
import ConfirmPayment from "./ConfirmPayment";

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

  // Search theo mã đơn + mã giao dịch
  const [searchTerm, setSearchTerm] = useState("");

  const PAGE_SIZE = 50; // default 50 / trang

  const fetchOrders = async (status, page = 0) => {
    setLoading(true);
    try {
      const response = await createOrderPaymentService.getOrdersByStatus(
        status,
        page,
        PAGE_SIZE
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

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
    fetchOrders(activeTab, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const refreshAll = async () => {
    await fetchOrders(activeTab, currentPage);
  };

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
      },
      orange: {
        activeBg: "bg-orange-600",
        activeBorder: "border-orange-600",
        activeText: "text-white",
        icon: "text-orange-600",
      },
      blue: {
        activeBg: "bg-blue-600",
        activeBorder: "border-blue-600",
        activeText: "text-white",
        icon: "text-blue-600",
      },
      purple: {
        activeBg: "bg-purple-600",
        activeBorder: "border-purple-600",
        activeText: "text-white",
        icon: "text-purple-600",
      },
    };
    return colors[color];
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchOrders(activeTab, newPage);
    }
  };

  const orderTypeLabel = (t) => {
    switch (t) {
      case "MUA_HO":
        return "Mua hộ";
      case "KY_GUI":
        return "Ký gửi";
      case "DAU_GIA":
        return "Đấu giá";

      case "SHOPPING":
        return "Mua hộ";
      case "SHIP":
        return "Ký gửi";
      case "AUCTION":
        return "Đấu giá";

      default:
        return t || "—";
    }
  };

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

    return filteredOrders.map((order) => {
      const customerName = order?.customer?.name || "N/A";
      const code = order?.code || order?.orderCode || "—";
      const payCode = order?.paymentCode || order?.transactionCode || "—";
      const typeLabel = orderTypeLabel(order?.orderType);
      const price = formatCurrency(order?.finalPriceOrder ?? order?.finalPrice);
      const created = formatDate(order?.createdAt || order?.createdDate);
      const badge = statusBadge(order?.status || activeTab);

      return (
        <div
          key={order.id || order.orderId || code}
          className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 items-center hover:bg-gray-50 transition-colors"
        >
          <div className="col-span-2 font-semibold text-gray-900">{code}</div>
          <div className="col-span-2 text-gray-900">{customerName}</div>
          {activeTab.includes("CHO_THANH_TOAN") && (
            <div className="col-span-2 text-blue-600 truncate">{payCode}</div>
          )}
          <div className="col-span-1">{typeLabel}</div>
          <div className="col-span-1">{badge}</div>
          <div className="col-span-1 font-semibold">{price} đ</div>
          <div className="col-span-1 text-gray-600 text-sm">{created}</div>
          <div className="col-span-2 flex justify-end">
            {activeTab === "CHO_THANH_TOAN" && (
              <ConfirmPayment order={order} mode="order" onDone={refreshAll} />
            )}
            {activeTab === "CHO_THANH_TOAN_SHIP" && (
              <ConfirmPayment
                order={order}
                mode="ship"
                onDone={refreshAll}
                confirmWithDialog={true}
              />
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý thanh toán đơn hàng
          </h1>

          {/* Search mã đơn + mã giao dịch */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm mã đơn hoặc mã giao dịch..."
                className="pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-72"
              />
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

              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative px-6 py-4 text-left border 
                    ${
                      isActive
                        ? `${color.activeBg} ${color.activeText} ${color.activeBorder}`
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    }`}
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
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading / List */}
        {loading ? (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-600 font-medium">
              Đang tải dữ liệu...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow border border-gray-200 text-center py-16 px-6">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Không có đơn hàng
            </h3>
            <p className="text-sm text-gray-500">
              Chưa có đơn hàng nào với trạng thái này
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {getHeaderColumns().map((column) => (
                  <div key={column.key} className={column.colSpan}>
                    {column.label}
                  </div>
                ))}
              </div>
            </div>
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
    </div>
  );
};

export default PaymentOrderList;
