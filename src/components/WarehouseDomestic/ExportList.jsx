import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Package2,
  User,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Eye,
  RefreshCw,
  Package,
  MapPin,
  Phone,
  X,
  Truck,
} from "lucide-react";
import domesticService from "../../Services/Warehouse/domesticService";

const ExportList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalOrders, setTotalOrders] = useState(0);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [exporting, setExporting] = useState(false);

  const pageSizeOptions = [10, 20, 30, 50, 100];

  // Load domestic orders with pagination
  const loadOrders = async (page = 0, limit = 20) => {
    setLoading(true);
    setError(null);
    try {
      const response = await domesticService.getDomesticOrders(page, limit);

      // Handle if response is directly an array
      if (Array.isArray(response)) {
        setOrders(response);
        setTotalOrders(response.length);
        setCurrentPage(page);
      } else if (response && Array.isArray(response.content)) {
        setOrders(response.content || []);
        setTotalOrders(response.totalElements || 0);
        setCurrentPage(page);
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Không thể tải danh sách đơn hàng nội địa"
      );
      console.error("Error loading domestic orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn xuất kho tất cả đơn hàng?")) {
      return;
    }
    setExporting(true);
    setError(null);
    try {
      await domesticService.transferToCustomer();
      alert("Xuất kho thành công!");
      // Reset về trang đầu và load lại
      setCurrentPage(0);
      loadOrders(0, pageSize);
    } catch (err) {
      setError(
        err.response?.data?.message || "Không thể xuất kho. Vui lòng thử lại!"
      );
      console.error("Error exporting orders:", err);
    } finally {
      setExporting(false);
    }
  };

  // Calculate total packings and tracking codes for an order
  const getOrderStats = (addresses) => {
    if (!Array.isArray(addresses)) return { packings: 0, trackingCodes: 0 };

    let totalPackings = 0;
    let totalTracking = 0;

    addresses.forEach((address) => {
      if (Array.isArray(address.packings)) {
        totalPackings += address.packings.length;
        address.packings.forEach((packing) => {
          totalTracking += packing?.trackingCodes?.length || 0;
        });
      }
    });

    return { packings: totalPackings, trackingCodes: totalTracking };
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  useEffect(() => {
    loadOrders(0, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize]);

  const handlePageChange = (newPage) => {
    loadOrders(newPage, pageSize);
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    setCurrentPage(0);
  };

  // Filter orders based on search term and date
  const filteredOrders = useMemo(() => {
    if (!Array.isArray(orders)) return [];

    return orders.filter((order) => {
      if (!order) return false;

      const matchesSearch =
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerPhone?.includes(searchTerm) ||
        (Array.isArray(order.addresses) &&
          order.addresses.some(
            (address) =>
              address.addressName
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              (Array.isArray(address.packings) &&
                address.packings.some(
                  (packing) =>
                    packing?.packingCode
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    (Array.isArray(packing.trackingCodes) &&
                      packing.trackingCodes.some((code) =>
                        code?.toLowerCase().includes(searchTerm.toLowerCase())
                      ))
                ))
          ));

      const matchesDate =
        !filterDate || order.createdDate?.split("T")[0] === filterDate;

      return matchesSearch && matchesDate;
    });
  }, [orders, searchTerm, filterDate]);

  const totalPages = Math.ceil(totalOrders / pageSize) || 1;

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mx-auto space-y-6">
        {/* HEADER đơn giản */}
        <div className="bg-blue-600 rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Package2 size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">
                Đơn Hàng Nội Địa
              </h1>
            </div>
          </div>
        </div>

        {/* Error Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* CONTROLS đơn giản */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Tìm theo tên, SĐT, địa chỉ, mã kiện, tracking..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Date Filter */}
            <div className="relative">
              <Calendar
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Page Size */}
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size} / trang
                </option>
              ))}
            </select>

            {/* NÚT XUẤT KHO – chỉ dùng màu xanh */}
            <button
              onClick={handleExport}
              disabled={exporting || filteredOrders.length === 0}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {exporting ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  Đang xuất kho...
                </>
              ) : (
                <>
                  <Truck size={18} />
                  Xuất Kho
                </>
              )}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
            <RefreshCw
              size={32}
              className="animate-spin text-blue-600 mx-auto mb-3"
            />
            <p className="text-gray-700 text-sm font-medium">
              Đang tải dữ liệu...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredOrders.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
            <Package2 size={40} className="text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-800 mb-1">
              Không có đơn hàng nào
            </h3>
            <p className="text-gray-500 text-sm">
              {searchTerm
                ? "Không tìm thấy kết quả phù hợp."
                : "Hiện tại không có đơn hàng nội địa nào."}
            </p>
            {(searchTerm || filterDate) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterDate("");
                }}
                className="mt-3 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        )}

        {/* TABLE */}
        {filteredOrders.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {/* Table Header Info */}
            <div className="px-6 py-3 bg-blue-200 border-b border-blue-100">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-black-900">
                  Tổng: {filteredOrders.length} đơn hàng
                </span>
                <span className="text-blue-700">
                  Trang {currentPage + 1} / {totalPages}
                </span>
              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <User size={14} />
                        Khách Hàng
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Phone size={14} />
                        SĐT
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        Địa Chỉ
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center justify-center gap-2">
                        <Package size={14} />
                        Kiện Hàng
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center justify-center gap-2">
                        <Package2 size={14} />
                        Tracking
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Thao Tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredOrders.map((order, index) => {
                    const stats = getOrderStats(order?.addresses);
                    const addressCount = order?.addresses?.length || 0;

                    return (
                      <tr
                        key={`${order?.customerPhone}-${index}`}
                        className="hover:bg-blue-50/60 transition-colors"
                      >
                        {/* Customer Name */}
                        <td className="px-6 py-3 text-gray-900 font-medium">
                          {order?.customerName || "N/A"}
                        </td>

                        {/* Phone */}
                        <td className="px-4 py-3 text-gray-700">
                          {order?.customerPhone || "N/A"}
                        </td>

                        {/* Address Count */}
                        <td className="px-4 py-3 text-gray-700">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100">
                            <MapPin size={12} />
                            {addressCount} địa chỉ
                          </span>
                        </td>

                        {/* Packings Count */}
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-100">
                            {stats.packings} kiện
                          </span>
                        </td>

                        {/* Total Tracking Codes */}
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-100">
                            {stats.trackingCodes} mã
                          </span>
                        </td>

                        {/* View Details Button */}
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleViewDetails(order)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                          >
                            <Eye size={14} />
                            Xem
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PAGINATION */}
        {filteredOrders.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl px-6 py-3">
            <div className="flex items-center justify-between text-sm">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  currentPage === 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-blue-50"
                }`}
              >
                <ChevronLeft size={18} />
                Trước
              </button>

              <div className="font-medium text-gray-700">
                Trang {currentPage + 1} / {totalPages}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  currentPage >= totalPages - 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-blue-50"
                }`}
              >
                Sau
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL ĐƠN GIẢN */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-200">
            {/* Modal Header */}
            <div className="bg-blue-600 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-500/30 rounded-lg flex items-center justify-center">
                  <Package2 size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Chi Tiết Đơn Hàng
                  </h3>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-white hover:bg-blue-500/40 rounded-lg p-1.5 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1 p-6 space-y-6">
              {/* Customer Information */}
              <div className="bg-gray-100 rounded-lg p-4 border border-blue-100">
                <h4 className="text-xl font-semibold text-black-900 mb-3 flex items-center gap-2">
                  <User size={20} />
                  Thông Tin Khách Hàng
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Tên:</p>
                    <p className="font-semibold text-gray-900">
                      {selectedOrder?.customerName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">SĐT:</p>
                    <p className="font-semibold text-gray-900">
                      {selectedOrder?.customerPhone || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={16} className="text-blue-600" />
                    <p className="text-xs text-black-600 font-medium">
                      Địa chỉ
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-black-700">
                    {selectedOrder?.addresses?.length || 0}
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Package size={16} className="text-blue-600" />
                    <p className="text-xs text-black-600 font-medium">
                      Kiện hàng
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-black-700">
                    {getOrderStats(selectedOrder?.addresses).packings}
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Package2 size={16} className="text-blue-600" />
                    <p className="text-xs text-black-600 font-medium">
                      Mã tracking
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-black-700">
                    {getOrderStats(selectedOrder?.addresses).trackingCodes}
                  </p>
                </div>
              </div>

              {/* Addresses Details */}
              <div className="text-sm">
                <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  Chi Tiết Địa Chỉ -------- (
                  {selectedOrder?.addresses?.length || 0} địa chỉ)
                </h4>
                <div className="space-y-4">
                  {(selectedOrder?.addresses || []).map((address, aIndex) => (
                    <div
                      key={aIndex}
                      className="bg-white border border-gray-200 rounded-lg p-4"
                    >
                      {/* Address Header */}
                      <div className="flex items-start gap-3 mb-3 pb-3 border-b border-gray-100">
                        <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin size={15} className="text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                              Địa chỉ
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">
                            {address?.addressName || "Chưa có địa chỉ"}
                          </p>
                          <p className="text-xs text-black-600 mt-1">
                            {address?.packings?.length || 0} kiện hàng
                          </p>
                        </div>
                      </div>

                      {/* Packings List */}
                      <div className="space-y-3">
                        {(address?.packings || []).map((packing, pIndex) => (
                          <div
                            key={pIndex}
                            className="bg-gray-100 rounded-lg p-3 border border-blue-100"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {pIndex + 1}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1.5">
                                  <Package
                                    size={14}
                                    className="text-blue-600"
                                  />
                                  <span className="font-semibold text-sm text-gray-900">
                                    {packing?.packingCode || "N/A"}
                                  </span>
                                  <span className="text-xs bg-white text-blue-700 px-2 py-0.5 rounded-full border border-blue-200 font-medium">
                                    {packing?.trackingCodes?.length || 0}{" "}
                                    tracking
                                  </span>
                                </div>

                                {/* Tracking Codes */}
                                {packing?.trackingCodes &&
                                  packing.trackingCodes.length > 0 && (
                                    <div className="mt-2">
                                      <p className="text-xs text-gray-600 mb-1 font-medium">
                                        Tracking Codes:
                                      </p>
                                      <div className="flex flex-wrap gap-2">
                                        {(packing.trackingCodes || []).map(
                                          (code, cIndex) => (
                                            <span
                                              key={cIndex}
                                              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-300 rounded-lg text-xs font-mono text-gray-700 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                                            >
                                              <Package2
                                                size={12}
                                                className="text-gray-500"
                                              />
                                              {code}
                                            </span>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
              <button
                onClick={handleCloseModal}
                className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportList;
