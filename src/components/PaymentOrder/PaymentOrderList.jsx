// PaymentOrderList.jsx
import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import createOrderPaymentService from "../../Services/Payment/createOrderPaymentService";
import countStatusService from "../../Services/Order/countStatusService";
import CreateOrderPayment from "./CreateOrderPayment";
import ConfirmPaymentOrder from "./ConfirmPaymentOrder";
import {
  CheckCircle,
  Clock,
  Package,
  Truck,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";

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
  const [paymentResults, setPaymentResults] = useState({});
  const [statusCounts, setStatusCounts] = useState({});
  const [statsLoading, setStatsLoading] = useState(false);

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
      toast.error(
        error.message?.includes("DA_DU_HANG")
          ? "Không thể tải thống kê cho đơn hàng đã đủ hàng"
          : "Không thể tải thống kê trạng thái"
      );
      setStatusCounts(
        validTabs.reduce((acc, tab) => ({ ...acc, [tab]: 0 }), {})
      );
    }
  };

  // Đồng bộ spinner count khi chuyển tab
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
    setPaymentResults({});
    setLoading(true);
    setStatsLoading(true);

    Promise.all([fetchOrders(activeTab, 0), fetchStatusStatistics()])
      .catch(() => {}) // lỗi đã toast ở từng hàm
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

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchOrders(activeTab, newPage);
    }
  };

  const renderOrderComponent = () => {
    const ordersWithCustomer = orders.map((order) => ({
      ...order,
      customerName: order.customer?.name || "N/A",
    }));

    if (activeTab === "CHO_THANH_TOAN") {
      return (
        <ConfirmPaymentOrder
          orders={ordersWithCustomer}
          paymentResults={paymentResults}
          setPaymentResults={setPaymentResults}
          fetchOrders={fetchOrders}
          currentPage={currentPage}
        />
      );
    }

    return (
      <CreateOrderPayment
        orders={ordersWithCustomer}
        paymentResults={paymentResults}
        setPaymentResults={setPaymentResults}
        activeTab={activeTab}
        fetchOrders={fetchOrders}
        currentPage={currentPage}
      />
    );
  };

  const getHeaderColumns = () => {
    if (activeTab === "CHO_THANH_TOAN") {
      return [
        { key: "orderCode", label: "Mã đơn hàng", colSpan: "col-span-2" },
        { key: "customerName", label: "Khách hàng", colSpan: "col-span-2" },
        { key: "paymentCode", label: "Mã giao dịch", colSpan: "col-span-2" }, // ✨ ĐÃ SỬA: từ col-span-1 → col-span-2
        { key: "orderType", label: "Loại đơn", colSpan: "col-span-1" },
        { key: "status", label: "Trạng thái", colSpan: "col-span-1" },
        { key: "finalPrice", label: "Tổng tiền", colSpan: "col-span-1" },
        { key: "createdAt", label: "Ngày tạo", colSpan: "col-span-1" },
        { key: "actions", label: "Thao tác", colSpan: "col-span-2" },
      ];
    }

    const baseColumns = [
      { key: "orderCode", label: "Mã đơn hàng", colSpan: "col-span-2" },
      { key: "customerName", label: "Khách hàng", colSpan: "col-span-2" },
      { key: "orderType", label: "Loại đơn", colSpan: "col-span-1" },
      { key: "status", label: "Trạng thái", colSpan: "col-span-1" },
      { key: "finalPrice", label: "Tổng tiền", colSpan: "col-span-2" },
      { key: "createdAt", label: "Ngày tạo", colSpan: "col-span-1" },
    ];

    if (activeTab === "DA_XAC_NHAN") {
      baseColumns.push({
        key: "actions",
        label: "Thao tác",
        colSpan: "col-span-2",
      });
    }

    return baseColumns;
  };

  // Màu tab (active có nền màu + chữ trắng; không hover)
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

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" />

      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Quản lý báo giá đơn hàng
              </h1>
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
                        : "bg-white text-gray-700 border-gray-200"
                    }
                    focus:outline-none
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
                      <div className="h-4 w-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
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

        {/* Loading (khung nội dung) */}
        {loading && (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
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
                      <div key={column.key} className={`${column.colSpan}`}>
                        {column.label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Table Body */}
                {renderOrderComponent()}
              </>
            )}
          </div>
        )}

        {/* Pagination (no hover) */}
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
                  flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border
                  ${
                    currentPage === 0
                      ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                      : "bg-white text-gray-700 border-gray-300"
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
                  flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border
                  ${
                    currentPage >= totalPages - 1
                      ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                      : "bg-white text-gray-700 border-gray-300"
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
    </div>
  );
};

export default PaymentOrderList;
