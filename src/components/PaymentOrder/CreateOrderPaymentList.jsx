import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import createOrderPaymentService from "../../Services/SharedService/createorderpayment";
import countStatusService from "../../Services/SharedService/countStatusService";
import CreateOrderPayment from "./CreateOrderPayment";
import OrderPending from "./OrderPending";

const CreateOrderPaymentList = () => {
  const validTabs = [
    "DA_XAC_NHAN",
    "CHO_THANH_TOAN_SHIP",
    "CHO_THANH_TOAN",
    "CHO_NHAP_KHO_VN",
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

  // Fetch orders based on status
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

  // Fetch status statistics
  const fetchStatusStatistics = async () => {
    setStatsLoading(true);
    try {
      const response = await countStatusService.getForPaymentStatistics();
      console.log("Status statistics response:", response);
      // Ensure all valid tabs have a count, defaulting to 0 if missing
      const normalizedCounts = validTabs.reduce((acc, tab) => {
        acc[tab] = response[tab] ?? 0;
        return acc;
      }, {});
      setStatusCounts(normalizedCounts);
    } catch (error) {
      console.error("Error fetching payment statistics:", error);
      toast.error(
        error.message.includes("CHO_NHAP_KHO_VN")
          ? "Không thể tải thống kê cho Chờ nhập kho VN"
          : "Không thể tải thống kê trạng thái"
      );
      // Set default counts to 0 for all tabs on error
      setStatusCounts(
        validTabs.reduce((acc, tab) => ({ ...acc, [tab]: 0 }), {})
      );
    } finally {
      setStatsLoading(false);
    }
  };

  // Update localStorage and fetch data when activeTab changes
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
    fetchOrders(activeTab, 0);
    setPaymentResults({});
    fetchStatusStatistics();
  }, [activeTab]);

  // Tab configurations
  const tabConfigs = [
    {
      key: "DA_XAC_NHAN",
      label: "Đã xác nhận",
      color: "text-green-700",
      bgColor: "bg-white",
    },
    {
      key: "CHO_THANH_TOAN_SHIP",
      label: "Chờ thanh toán ship",
      color: "text-yellow-700",
      bgColor: "bg-white",
    },
    {
      key: "CHO_THANH_TOAN",
      label: "Chờ thanh toán",
      color: "text-orange-700",
      bgColor: "bg-white",
    },
    {
      key: "CHO_NHAP_KHO_VN",
      label: "Chờ nhập kho VN",
      color: "text-blue-700",
      bgColor: "bg-white",
    },
  ];

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchOrders(activeTab, newPage);
    }
  };

  // Render appropriate component based on active tab
  const renderOrderComponent = () => {
    if (activeTab === "CHO_THANH_TOAN") {
      return (
        <OrderPending
          orders={orders}
          paymentResults={paymentResults}
          setPaymentResults={setPaymentResults}
          fetchOrders={fetchOrders}
          currentPage={currentPage}
        />
      );
    }

    // For other tabs, use the original CreateOrderPayment component
    return (
      <CreateOrderPayment
        orders={orders}
        paymentResults={paymentResults}
        setPaymentResults={setPaymentResults}
        activeTab={activeTab}
        fetchOrders={fetchOrders}
        currentPage={currentPage}
      />
    );
  };

  // Get header columns based on active tab
  const getHeaderColumns = () => {
    if (activeTab === "CHO_THANH_TOAN") {
      // Special headers for CHO_THANH_TOAN tab with separate payment code column
      return [
        { key: "orderCode", label: "Mã đơn hàng", colSpan: "col-span-2" },
        { key: "paymentCode", label: "Mã giao dịch", colSpan: "col-span-2" },
        { key: "orderType", label: "Loại đơn", colSpan: "col-span-1" },
        { key: "status", label: "Trạng thái", colSpan: "col-span-1" },
        { key: "exchangeRate", label: "Tỷ giá", colSpan: "col-span-1" },
        { key: "finalPrice", label: "Tổng tiền", colSpan: "col-span-2" },
        { key: "createdAt", label: "Ngày tạo", colSpan: "col-span-1" },
        { key: "actions", label: "Thao tác", colSpan: "col-span-2" },
      ];
    }

    // Default headers for other tabs
    const baseColumns = [
      { key: "orderCode", label: "Mã đơn hàng", colSpan: "col-span-2" },
      { key: "orderType", label: "Loại đơn", colSpan: "col-span-1" },
      { key: "status", label: "Trạng thái", colSpan: "col-span-2" },
      { key: "exchangeRate", label: "Tỷ giá", colSpan: "col-span-1" },
      { key: "finalPrice", label: "Tổng tiền", colSpan: "col-span-2" },
      { key: "createdAt", label: "Ngày tạo", colSpan: "col-span-2" },
    ];

    // Add actions column for specific tabs
    if (activeTab === "DA_XAC_NHAN") {
      baseColumns.push({
        key: "actions",
        label: "Thao tác",
        colSpan: "col-span-2",
      });
    }

    return baseColumns;
  };

  return (
    <div className="mx-auto p-6">
      <Toaster />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Quản lý đơn hàng
        </h1>
        <p className="text-gray-600">
          Danh sách đơn hàng theo các trạng thái khác nhau
        </p>
      </div>

      {/* Tabs with Status Counts */}
      <div className="flex flex-wrap gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        {tabConfigs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? `${tab.bgColor} ${tab.color} shadow-sm`
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            {statsLoading ? (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                ...
              </span>
            ) : (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {statusCounts[tab.key] ?? 0}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Đang tải...</span>
        </div>
      )}

      {/* Orders List */}
      {!loading && (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">📦</div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                Không có đơn hàng
              </h3>
              <p className="text-gray-500">
                Chưa có đơn hàng nào với trạng thái này
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {getHeaderColumns().map((column) => (
                    <div key={column.key} className={column.colSpan}>
                      {column.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Render appropriate order component */}
              {renderOrderComponent()}
            </>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Trang {currentPage + 1} / {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateOrderPaymentList;
