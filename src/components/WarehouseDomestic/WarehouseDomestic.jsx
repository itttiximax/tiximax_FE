import React, { useState, useEffect, useCallback, useMemo } from "react";
import domesticService from "../../Services/Warehouse/domesticService";

// Status constants
const STATUS_OPTIONS = [
  { value: "", label: "-- Tất cả trạng thái --" },
  { value: "DA_NHAP_KHO_VN", label: "Đã nhập kho VN" },
  { value: "CHO_TRUNG_CHUYEN", label: "Chờ trung chuyển" },
  { value: "CHO_GIAO", label: "Chờ giao" },
  { value: "DANG_GIAO", label: "Đang giao" },
  { value: "DA_GIAO", label: "Đã giao" },
];

// Image Modal Component
const ImageModal = ({ isOpen, onClose, imageUrl, linkData }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Image */}
        <div className="p-6">
          <img
            src={imageUrl}
            alt={linkData?.productName || "Product"}
            className="w-full h-auto rounded-lg shadow-lg mb-6"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/800x600?text=Image+Not+Available";
            }}
          />

          {/* Product Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 border-b pb-2">
                Thông tin sản phẩm
              </h3>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Tên sản phẩm
                </label>
                <p className="text-base text-gray-900 font-medium mt-1">
                  {linkData?.productName || "-"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Mã lô hàng
                </label>
                <p className="text-base text-gray-900 font-mono mt-1">
                  {linkData?.shipmentCode || "-"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Mã đóng gói
                </label>
                <p className="text-base text-gray-900 font-mono mt-1">
                  {linkData?.packingCode || "-"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Trạng thái
                </label>
                <div className="mt-1">
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                      linkData?.status === "DA_NHAP_KHO_VN"
                        ? "bg-green-100 text-green-800"
                        : linkData?.status === "CHO_TRUNG_CHUYEN"
                        ? "bg-yellow-100 text-yellow-800"
                        : linkData?.status === "CHO_GIAO"
                        ? "bg-blue-100 text-blue-800"
                        : linkData?.status === "DANG_GIAO"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {STATUS_OPTIONS.find((s) => s.value === linkData?.status)
                      ?.label || linkData?.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 border-b pb-2">
                Thông tin kích thước
              </h3>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Kích thước (D × R × C)
                </label>
                <p className="text-base text-gray-900 font-medium mt-1">
                  {linkData?.length && linkData?.width && linkData?.height
                    ? `${linkData.length} × ${linkData.width} × ${linkData.height} cm`
                    : "-"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Khối lượng thực tế
                </label>
                <p className="text-base text-gray-900 font-bold mt-1">
                  {linkData?.weight ? `${linkData.weight.toFixed(3)} kg` : "-"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Khối lượng quy đổi (Dim)
                </label>
                <p className="text-base text-gray-900 font-bold mt-1">
                  {linkData?.dim ? `${linkData.dim.toFixed(3)} kg` : "-"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Khối lượng tính phí
                </label>
                <p className="text-lg text-blue-600 font-bold mt-1">
                  {linkData?.weight && linkData?.dim
                    ? `${Math.max(linkData.weight, linkData.dim).toFixed(3)} kg`
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function WarehouseDomestic() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filters state
  const [status, setStatus] = useState("");
  const [shipmentCode, setShipmentCode] = useState("");
  const [customerCode, setCustomerCode] = useState("");
  const [customerName, setCustomerName] = useState("");

  // Image modal state
  const [imageModal, setImageModal] = useState({
    isOpen: false,
    imageUrl: "",
    linkData: null,
  });

  // Memoize filtered orders for better performance
  const filteredOrders = useMemo(() => {
    if (!customerName.trim()) return orders;

    const searchTerm = customerName.trim().toLowerCase();
    return orders.filter((order) =>
      order.customerName?.toLowerCase().includes(searchTerm)
    );
  }, [orders, customerName]);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const filters = {};

      if (status) filters.status = status;
      if (shipmentCode.trim()) filters.shipmentCode = shipmentCode.trim();
      if (customerCode.trim()) filters.customerCode = customerCode.trim();

      const response = await domesticService.getWarehouseLinkOrders(
        currentPage,
        20,
        filters
      );

      setOrders(response.content || []);
      setTotalElements(response.totalElements || 0);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error("Error loading orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, status, shipmentCode, customerCode]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleSearch = () => {
    setCurrentPage(0);
  };

  const handleClearFilters = () => {
    setStatus("");
    setShipmentCode("");
    setCustomerCode("");
    setCustomerName("");
    setCurrentPage(0);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const openImageModal = (imageUrl, linkData) => {
    setImageModal({
      isOpen: true,
      imageUrl,
      linkData,
    });
  };

  const closeImageModal = () => {
    setImageModal({
      isOpen: false,
      imageUrl: "",
      linkData: null,
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "DA_NHAP_KHO_VN":
        return "bg-green-100 text-green-800 border-green-200";
      case "CHO_TRUNG_CHUYEN":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "CHO_GIAO":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "DANG_GIAO":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "DA_GIAO":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status) => {
    return STATUS_OPTIONS.find((s) => s.value === status)?.label || status;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br ">
      <div className="p-4 md:p-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Quản lý đơn hàng Nội địa
          </h1>
        </div>

        {/* Filters Section - Enhanced */}
        <div className="bg-white rounded-xl shadow-sm mb-6 border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
              Bộ lọc tìm kiếm
            </h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Status Select */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Trạng thái
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm transition-all hover:border-blue-400"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Shipment Code Search */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mã vận đơn
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={shipmentCode}
                    onChange={(e) => setShipmentCode(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập mã vận đơn..."
                    className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all hover:border-blue-400"
                  />
                  <svg
                    className="absolute left-3 top-3 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
              </div>

              {/* Customer Code Search */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mã khách hàng
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={customerCode}
                    onChange={(e) => setCustomerCode(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập mã khách hàng..."
                    className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all hover:border-blue-400"
                  />
                  <svg
                    className="absolute left-3 top-3 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                    />
                  </svg>
                </div>
              </div>

              {/* Customer Name Search */}
              {/* <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên khách hàng
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập tên khách hàng..."
                    className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all hover:border-blue-400"
                  />
                  <svg
                    className="absolute left-3 top-3 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div> */}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:from-blue-300 disabled:to-blue-400 disabled:cursor-not-allowed font-medium text-sm flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {loading ? "Đang tìm..." : "Tìm kiếm"}
              </button>
              <button
                onClick={handleClearFilters}
                disabled={loading}
                className="px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed text-sm flex items-center gap-2 font-medium"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>

        {/* Results Section - Enhanced */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header with count - Enhanced */}
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Danh sách đơn hàng
                </h3>
                {totalElements > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    Tổng cộng:{" "}
                    <span className="font-bold text-blue-600">
                      {totalElements}
                    </span>{" "}
                    đơn hàng
                    {filteredOrders.length !== orders.length && (
                      <span className="ml-2">
                        (Hiển thị:{" "}
                        <span className="font-bold text-blue-600">
                          {filteredOrders.length}
                        </span>
                        )
                      </span>
                    )}
                  </p>
                )}
              </div>
              {filteredOrders.length > 0 && totalPages > 1 && (
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <span className="text-sm text-gray-700">
                    Trang{" "}
                    <span className="font-bold text-blue-600">
                      {currentPage + 1}
                    </span>{" "}
                    / <span className="font-bold">{totalPages}</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-blue-600 absolute top-0"></div>
                </div>
                <p className="text-gray-600 mt-4 font-medium">
                  Đang tải dữ liệu...
                </p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                  <svg
                    className="w-10 h-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 text-lg font-semibold">
                  Không tìm thấy đơn hàng
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Thử thay đổi bộ lọc tìm kiếm hoặc tạo đơn hàng mới
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredOrders.map((order, index) => (
                  <div
                    key={order.orderId || index}
                    className="hover:bg-blue-50/50 transition-colors"
                  >
                    {/* Order Header */}
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                        <div className="flex items-start gap-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold text-sm flex-shrink-0">
                            {currentPage * 20 + index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 flex-wrap mb-2">
                              <h3 className="text-lg font-bold text-gray-900">
                                {order.customerName || "-"}
                              </h3>
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                {order.customerCode || "-"}
                              </span>
                              {order.customerPhone && (
                                <span className="text-sm text-gray-600 flex items-center gap-1">
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    />
                                  </svg>
                                  {order.customerPhone}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 flex-wrap text-sm">
                              <span className="text-gray-600">
                                <span className="font-medium">Mã đơn:</span>{" "}
                                <span className="font-mono text-blue-600 font-semibold">
                                  {order.orderCode || "-"}
                                </span>
                              </span>
                              <span className="text-gray-600">
                                <span className="font-medium">
                                  Tên Khách hàng:
                                </span>{" "}
                                <span className="text-gray-900">
                                  {order.customerName || "-"}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 lg:flex-col lg:items-end">
                          <div className="text-right">
                            <p className="text-xs text-gray-500 mb-1">
                              Tổng trọng lượng
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                              {order.netWeight?.toFixed(2) || "0.00"}
                            </p>
                            <p className="text-xs text-gray-500">kg</p>
                          </div>
                          <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-lg border border-blue-200">
                            <svg
                              className="w-4 h-4 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                              />
                            </svg>
                            <span className="text-sm font-bold text-blue-800">
                              {order.orderLinks?.length || 0} links
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Order Links - Always visible */}
                      <div className="mt-6 space-y-3">
                        <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-3">
                          <svg
                            className="w-4 h-4 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 6h16M4 10h16M4 14h16M4 18h16"
                            />
                          </svg>
                          Chi tiết Order Links ({order.orderLinks?.length || 0})
                        </h4>
                        <div className="grid grid-cols-1 gap-3">
                          {order.orderLinks?.map((link, linkIndex) => (
                            <div
                              key={link.linkId || linkIndex}
                              className="bg-gradient-to-r from-white to-gray-50 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
                            >
                              <div className="flex gap-4">
                                {/* Image - Clickable */}
                                <div className="flex-shrink-0">
                                  {link.image ? (
                                    <div
                                      className="relative group cursor-pointer"
                                      onClick={() =>
                                        openImageModal(link.image, link)
                                      }
                                    >
                                      <img
                                        src={link.image}
                                        alt={link.productName}
                                        className="w-24 h-24 object-cover rounded-lg border-2 border-gray-300 shadow-sm group-hover:border-blue-500 transition-all"
                                      />
                                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-lg transition-all flex items-center justify-center">
                                        <svg
                                          className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                                          />
                                        </svg>
                                      </div>
                                      <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white shadow">
                                        {linkIndex + 1}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-300">
                                      <svg
                                        className="w-10 h-10 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                      </svg>
                                    </div>
                                  )}
                                </div>

                                {/* Info Grid */}
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                                    <p className="text-xs text-gray-500 mb-1 font-medium">
                                      Sản phẩm
                                    </p>
                                    <p className="font-semibold text-gray-900 truncate">
                                      {link.productName || "-"}
                                    </p>
                                  </div>

                                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                                    <p className="text-xs text-gray-500 mb-1 font-medium">
                                      Mã vận đơn
                                    </p>
                                    <p className="font-mono text-gray-900 text-xs font-semibold">
                                      {link.shipmentCode || "-"}
                                    </p>
                                  </div>

                                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                                    <p className="text-xs text-gray-500 mb-1 font-medium">
                                      Mã đóng gói
                                    </p>
                                    <p className="font-mono text-gray-900 text-xs font-semibold">
                                      {link.packingCode || "-"}
                                    </p>
                                  </div>

                                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                                    <p className="text-xs text-gray-500 mb-1 font-medium">
                                      Trạng thái
                                    </p>
                                    <span
                                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeClass(
                                        link.status
                                      )}`}
                                    >
                                      {getStatusLabel(link.status)}
                                    </span>
                                  </div>

                                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                                    <p className="text-xs text-gray-500 mb-1 font-medium">
                                      Kích thước (cm)
                                    </p>
                                    <p className="font-semibold text-gray-900">
                                      {link.length && link.width && link.height
                                        ? `${link.length} × ${link.width} × ${link.height}`
                                        : "-"}
                                    </p>
                                  </div>

                                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                                    <p className="text-xs text-gray-500 mb-1 font-medium">
                                      KL thực tế
                                    </p>
                                    <p className="font-bold text-blue-600">
                                      {link.weight?.toFixed(3) || "-"} kg
                                    </p>
                                  </div>

                                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                                    <p className="text-xs text-gray-500 mb-1 font-medium">
                                      KL quy đổi (Dim)
                                    </p>
                                    <p className="font-bold text-purple-600">
                                      {link.dim?.toFixed(3) || "-"} kg
                                    </p>
                                  </div>

                                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-lg border-2 border-green-300">
                                    <p className="text-xs text-green-700 mb-1 font-medium">
                                      KL tính phí
                                    </p>
                                    <p className="font-bold text-green-700 text-base">
                                      {link.weight && link.dim
                                        ? `${Math.max(
                                            link.weight,
                                            link.dim
                                          ).toFixed(3)} kg`
                                        : "-"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination - Enhanced */}
          {!loading && filteredOrders.length > 0 && totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(0, prev - 1))
                  }
                  disabled={currentPage === 0}
                  className="w-full sm:w-auto px-6 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-blue-400 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-200 transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Trang trước
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700 bg-white px-4 py-2 rounded-lg border-2 border-gray-200 font-medium">
                    Trang{" "}
                    <span className="font-bold text-blue-600">
                      {currentPage + 1}
                    </span>{" "}
                    / <span className="font-bold">{totalPages}</span>
                  </span>
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
                  }
                  disabled={currentPage >= totalPages - 1}
                  className="w-full sm:w-auto px-6 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-blue-400 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-200 transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow"
                >
                  Trang sau
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={imageModal.isOpen}
        onClose={closeImageModal}
        imageUrl={imageModal.imageUrl}
        linkData={imageModal.linkData}
      />
    </div>
  );
}
export default WarehouseDomestic;
