// src/Components/LeadSale/OrderList.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Package,
  ChevronLeft,
  ChevronRight,
  Calendar,
  RefreshCw,
  Eye,
  User,
  Mail,
  Phone,
  FileText,
  AlertCircle,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import createOrderPaymentService from "../../Services/Payment/createOrderPaymentService";
import DetailPaymentOrder from "../PaymentOrder/DetailPaymentOrder";
const ListOrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("DA_XAC_NHAN");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 15,
    totalPages: 0,
    totalElements: 0,
    first: true,
    last: true,
  });

  // 👉 state dialog thanh toán
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedPaymentCode, setSelectedPaymentCode] = useState(null);

  const tabs = [
    {
      key: "DA_XAC_NHAN",
      label: "Đã xác nhận",
      color: "green",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      borderColor: "border-green-500",
    },
    {
      key: "CHO_THANH_TOAN",
      label: "Chờ thanh toán",
      color: "orange",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
      borderColor: "border-orange-500",
    },

    {
      key: "DA_DU_HANG",
      label: "Đã đủ hàng",
      color: "blue",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      borderColor: "border-blue-500",
    },
    {
      key: "CHO_THANH_TOAN_SHIP",
      label: "Chờ thanh toán ship",
      color: "yellow",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700",
      borderColor: "border-yellow-500",
    },
  ];

  const fetchOrders = useCallback(
    async (page = 0, size = 15) => {
      try {
        setLoading(true);
        setError(null);

        const response = await createOrderPaymentService.getOrdersByStatus(
          activeTab,
          page,
          size
        );

        if (response?.content) {
          setOrders(response.content);
          setPagination({
            pageNumber: response.number ?? page,
            pageSize: response.size ?? size,
            totalPages: response.totalPages ?? 0,
            totalElements: response.totalElements ?? 0,
            first: response.first ?? page === 0,
            last: response.last ?? true,
          });
        } else {
          setOrders([]);
          setPagination((prev) => ({
            ...prev,
            totalElements: 0,
            totalPages: 0,
          }));
        }
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Không thể tải danh sách đơn hàng";
        setError(errorMessage);
        toast.error(errorMessage);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    },
    [activeTab]
  );

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setPagination((prev) => ({ ...prev, pageNumber: 0 }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "N/A";
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  const getOrderTypeColor = (type) => {
    const colors = {
      MUA_HO: "bg-blue-100 text-blue-800",
      DAU_GIA: "bg-purple-100 text-purple-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const getOrderTypeText = (type) => {
    const texts = {
      MUA_HO: "Mua hộ",
      DAU_GIA: "Đấu giá",
    };
    return texts[type] || type;
  };

  const filteredOrders = orders
    .filter((order) =>
      searchTerm
        ? order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.customer?.customerCode
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
        : true
    )
    .filter((order) =>
      filterDate
        ? new Date(order.createdAt).toISOString().slice(0, 10) === filterDate
        : true
    );

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setPagination((prev) => ({ ...prev, pageSize: newSize }));
    fetchOrders(0, newSize);
  };

  const currentTab = tabs.find((tab) => tab.key === activeTab);

  // 👉 Mở dialog thanh toán
  const openPaymentDialog = (order) => {
    if (!order.paymentCode) {
      toast.error("Đơn hàng này chưa có mã thanh toán");
      return;
    }
    setSelectedPaymentCode(order.paymentCode);
    setIsPaymentDialogOpen(true);
  };

  // 👉 Đóng dialog
  const closePaymentDialog = () => {
    setIsPaymentDialogOpen(false);
    setSelectedPaymentCode(null);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-800">
            Quản Lý Đơn Hàng Thanh Toán
          </h1>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-4">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`flex-1 min-w-[150px] px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? `${tab.bgColor} ${tab.textColor} ${tab.borderColor} border-2`
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
              <div>
                <p className="text-red-700 text-sm">{error}</p>
                <button
                  onClick={() => fetchOrders()}
                  className="text-red-600 hover:text-red-800 text-xs underline mt-1"
                >
                  Thử lại
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm mã đơn, khách hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:ring-0"
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:ring-0"
                />
              </div>

              <select
                value={pagination.pageSize}
                onChange={handlePageSizeChange}
                disabled={loading}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value={10}>10 / trang</option>
                <option value={15}>15 / trang</option>
                <option value={20}>20 / trang</option>
                <option value={30}>30 / trang</option>
                <option value={50}>50 / trang</option>
              </select>
            </div>

            <div className="text-sm text-gray-600">
              Tổng:{" "}
              <span className="font-semibold">{pagination.totalElements}</span>{" "}
              đơn
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="inline-flex items-center px-3 py-2 font-semibold text-sm text-blue-600">
              <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Đang tải dữ liệu...
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredOrders.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-medium text-gray-900 mb-2">
              Không có đơn hàng nào
            </h3>
            <p className="text-gray-500 text-sm">
              {searchTerm
                ? "Không tìm thấy kết quả phù hợp."
                : `Chưa có đơn hàng ${currentTab?.label.toLowerCase()}.`}
            </p>
          </div>
        )}

        {/* Orders List */}
        {filteredOrders.length > 0 && (
          <div className="space-y-3">
            {filteredOrders.map((order, index) => (
              <div
                key={order.orderId}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div className={`px-4 py-3 border-b ${currentTab?.bgColor}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 ${currentTab?.bgColor} rounded-full flex items-center justify-center border ${currentTab?.borderColor}`}
                      >
                        <span
                          className={`text-xs font-semibold ${currentTab?.textColor}`}
                        >
                          {pagination.pageNumber * pagination.pageSize +
                            index +
                            1}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                          {order.orderCode}
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${getOrderTypeColor(
                              order.orderType
                            )}`}
                          >
                            {getOrderTypeText(order.orderType)}
                          </span>
                        </h3>
                        <div className="text-2xs text-black-600 mt-1">
                          {formatDate(order.createdAt)}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-medium text-black-500">
                        Tổng tiền
                      </div>
                      <div className="text-base font-bold text-gray-900">
                        {formatCurrency(order.finalPriceOrder)} ₫
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Customer Info */}
                    <div className="space-y-2">
                      <h4 className="text-sx font-medium text-black-700 flex items-center gap-1.5 mb-2">
                        <User className="w-4 h-4 text-blue-600" />
                        Thông tin khách hàng
                      </h4>
                      <div className="bg-gray-100 rounded-lg p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                            {order.customer?.customerCode || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <User className="w-4 h-4 text-gray-500 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900">
                              {order.customer?.name || "Chưa có tên"}
                            </div>
                          </div>
                        </div>
                        {order.customer?.email && (
                          <div className="flex items-center gap-2 text-sm text-black-600">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <span className="text-xs">
                              {order.customer.email}
                            </span>
                          </div>
                        )}
                        {order.customer?.phone && (
                          <div className="flex items-center gap-2 text-sm text-black-600">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span className="text-xs font-medium">
                              {order.customer.phone}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1.5 mb-2">
                        <FileText className="w-4 h-4 text-green-600" />
                        Chi tiết đơn hàng
                      </h4>
                      <div className="bg-gray-100 rounded-lg p-3 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-black-600 ">Tổng tiền:</span>
                          <span className="font-medium text-gray-900">
                            {order.finalPriceOrder?.toLocaleString() || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-black-600">
                            Tổng trọng lượng:
                          </span>
                          <span className="font-medium text-gray-900">
                            {formatCurrency(order.totalNetWeight)} kg
                          </span>
                        </div>
                        {order.paymentCode && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Mã thanh toán:
                            </span>
                            <span className="font-medium text-blue-600">
                              {order.paymentCode}
                            </span>
                          </div>
                        )}
                        {order.leftoverMoney && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tiền thừa:</span>
                            <span className="font-medium text-green-600">
                              {formatCurrency(order.leftoverMoney)} ₫
                            </span>
                          </div>
                        )}
                        {order.note && (
                          <div className="pt-2 border-t border-gray-200">
                            <span className="text-gray-600 block mb-1">
                              Ghi chú:
                            </span>
                            <span className="text-xs text-gray-800 italic">
                              {order.note}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end gap-2">
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      <Eye className="w-4 h-4" />
                      Xem chi tiết
                    </button>

                    {order.paymentCode && (
                      <button
                        onClick={() => openPaymentDialog(order)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        Xem thanh toán
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="flex items-center justify-between mt-4 bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-3">
            <button
              onClick={() => handlePageChange(pagination.pageNumber - 1)}
              disabled={pagination.first}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                pagination.first
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Trang trước
            </button>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500">Trang</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
                {pagination.pageNumber + 1}
              </span>
              <span className="text-xs text-gray-500">
                / {pagination.totalPages}
              </span>
            </div>

            <button
              onClick={() => handlePageChange(pagination.pageNumber + 1)}
              disabled={pagination.last}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                pagination.last
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Trang sau
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 👉 Dialog thanh toán */}
      {isPaymentDialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={closePaymentDialog}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-5xl w-[95%] max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={closePaymentDialog}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <X className="w-6 h-6 text-red-500" />
              </button>
            </div>

            {selectedPaymentCode && (
              <DetailPaymentOrder codeFromProp={selectedPaymentCode} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListOrderManager;
