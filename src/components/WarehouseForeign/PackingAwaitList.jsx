import React, { useState, useEffect } from "react";
import {
  Search,
  Package,
  Plane,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  RefreshCw,
} from "lucide-react";
import packingsService from "../../Services/Warehouse/packingsService"; // Import service

const PackingAwaitList = () => {
  const [orders, setOrders] = useState([]); // Lưu danh sách orders
  const [page, setPage] = useState(0); // Trang hiện tại
  const [limit, setLimit] = useState(10); // Số item mỗi trang
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [error, setError] = useState(null); // Lưu lỗi nếu có
  const [selectedPackings, setSelectedPackings] = useState([]); // Lưu packingId được chọn
  const [showModal, setShowModal] = useState(false); // Hiển thị modal
  const [flightCode, setFlightCode] = useState(""); // flightCode input
  const [assignLoading, setAssignLoading] = useState(false); // Trạng thái loading khi gán flight
  const [assignError, setAssignError] = useState(null); // Lỗi khi gán flight
  const [assignSuccess, setAssignSuccess] = useState(null); // Thông báo thành công
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Fetch dữ liệu khi component mount hoặc page thay đổi
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await packingsService.getAwaitingFlightOrders(
          page,
          limit
        );
        setOrders(response.content || []);
        // Reset selectedPackings khi chuyển trang
        setSelectedPackings([]);
      } catch (err) {
        setError(err.message || "Failed to fetch awaiting-flight orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, limit]);

  // Format ngày giờ cho dễ đọc
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle chuyển trang
  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 0) setPage((prev) => prev - 1);
  };

  // Handle thay đổi page size
  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setLimit(newSize);
    setPage(0); // Reset về trang đầu khi thay đổi page size
  };

  // Handle chọn checkbox
  const handleSelectPacking = (packingId) => {
    setSelectedPackings((prev) =>
      prev.includes(packingId)
        ? prev.filter((id) => id !== packingId)
        : [...prev, packingId]
    );
  };

  // Handle chọn tất cả
  const handleSelectAll = () => {
    if (selectedPackings.length === filteredOrders.length) {
      setSelectedPackings([]);
    } else {
      setSelectedPackings(filteredOrders.map((order) => order.packingId));
    }
  };

  // Handle gán chuyến bay
  const handleAssignFlight = async () => {
    if (!flightCode.trim()) {
      setAssignError("Vui lòng nhập mã chuyến bay");
      return;
    }

    setAssignLoading(true);
    setAssignError(null);
    setAssignSuccess(null);

    try {
      // Gọi API assignFlight với mảng packingIds
      await packingsService.assignFlight(selectedPackings, flightCode);
      setAssignSuccess(
        `Đã gán thành công ${selectedPackings.length} kiện hàng vào chuyến bay ${flightCode}`
      );

      // Làm mới danh sách orders
      const response = await packingsService.getAwaitingFlightOrders(
        page,
        limit
      );
      setOrders(response.content || []);
      setSelectedPackings([]); // Reset lựa chọn
      setFlightCode(""); // Reset input
      setShowModal(false); // Đóng modal
    } catch (err) {
      setAssignError(
        err.response?.status === 405
          ? "Method Not Allowed: Check if the API supports PUT"
          : err.message || "Failed to assign flights"
      );
    } finally {
      setAssignLoading(false);
    }
  };

  // Filter orders based on search term and date
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.packingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.packingId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate =
      !filterDate ||
      new Date(order.packedDate).toDateString() ===
        new Date(filterDate).toDateString();

    return matchesSearch && matchesDate;
  });

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Đơn Hàng Chờ Chuyến Bay
            </h1>
          </div>
          <p className="text-gray-600 ml-11">
            Quản lý và gán chuyến bay cho các kiện hàng đã đóng gói
          </p>
        </div>

        {/* Success/Error Messages */}
        {assignSuccess && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
            <div className="flex items-center">
              <Check className="w-5 h-5 text-green-400 mr-2" />
              <p className="text-green-700">{assignSuccess}</p>
            </div>
          </div>
        )}

        {assignError && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
            <div className="flex items-center">
              <X className="w-5 h-5 text-red-400 mr-2" />
              <p className="text-red-700">{assignError}</p>
            </div>
          </div>
        )}

        {/* Controls Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo mã kiện hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <select
                value={limit}
                onChange={handlePageSizeChange}
                disabled={loading}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
              >
                <option value={5}>5 / trang</option>
                <option value={10}>10 / trang</option>
                <option value={20}>20 / trang</option>
                <option value={50}>50 / trang</option>
                <option value={100}>100 / trang</option>
              </select>
            </div>

            {/* Action Button */}
            <button
              onClick={() => setShowModal(true)}
              disabled={selectedPackings.length === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                selectedPackings.length === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-lg transform hover:-translate-y-0.5"
              }`}
            >
              <Plane className="w-5 h-5" />
              Gán Chuyến Bay ({selectedPackings.length})
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm text-blue-600">
              <RefreshCw className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" />
              Đang tải dữ liệu...
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-12 text-center">
            <X className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Có lỗi xảy ra
            </h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredOrders.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không có đơn hàng nào
            </h3>
            <p className="text-gray-500">
              {searchTerm || filterDate
                ? "Không tìm thấy kết quả phù hợp với bộ lọc của bạn."
                : "Hiện tại không có kiện hàng nào chờ gán chuyến bay."}
            </p>
          </div>
        )}

        {/* Table Section */}
        {filteredOrders.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={
                        selectedPackings.length === filteredOrders.length &&
                        filteredOrders.length > 0
                      }
                      onChange={handleSelectAll}
                      className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="font-medium text-gray-700">
                      Chọn tất cả ({filteredOrders.length})
                    </span>
                  </label>
                </div>
                <div className="text-sm text-gray-500">
                  Đã chọn: {selectedPackings.length} kiện hàng
                </div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <div
                  key={order.packingId}
                  className={`p-6 hover:bg-gray-50 transition-colors duration-150 ${
                    selectedPackings.includes(order.packingId)
                      ? "bg-blue-50 border-l-4 border-blue-400"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={selectedPackings.includes(order.packingId)}
                      onChange={() => handleSelectPacking(order.packingId)}
                      className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
                    />

                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4">
                      {/* Packing Info */}
                      <div className="lg:col-span-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Package className="w-4 h-4 text-blue-500" />
                          <span className="font-semibold text-gray-900">
                            {order.packingCode}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          ID: {order.packingId}
                        </p>
                      </div>

                      {/* Packing List */}
                      <div className="lg:col-span-1">
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Danh sách hàng hóa:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {order.packingList && order.packingList.length > 0 ? (
                            <>
                              {order.packingList
                                .slice(0, 2)
                                .map((item, index) => (
                                  <span
                                    key={index}
                                    className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                  >
                                    {item}
                                  </span>
                                ))}
                              {order.packingList.length > 2 && (
                                <span className="inline-block px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                                  +{order.packingList.length - 2} mặt hàng
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-sm text-gray-400">
                              Không có thông tin
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Packed Date */}
                      <div className="lg:col-span-1">
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Ngày đóng gói:
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDate(order.packedDate)}
                        </p>
                      </div>

                      {/* Flight Status */}
                      <div className="lg:col-span-1">
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Trạng thái:
                        </p>
                        <div className="flex items-center gap-2">
                          {order.flightCode ? (
                            <>
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <span className="text-sm text-green-600 font-medium">
                                {order.flightCode}
                              </span>
                            </>
                          ) : (
                            <>
                              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                              <span className="text-sm text-yellow-600 font-medium">
                                Chờ chuyến bay
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="flex items-center justify-between mt-6 bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-4">
            <button
              onClick={handlePrevPage}
              disabled={page === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                page === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Trang trước
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Trang</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg font-semibold">
                {page + 1}
              </span>
            </div>

            <button
              onClick={handleNextPage}
              disabled={orders.length < limit}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                orders.length < limit
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Trang sau
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Plane className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Gán Chuyến Bay
                  </h3>
                </div>

                <div className="mb-6">
                  <p className="text-gray-600 mb-4">
                    Bạn đang gán chuyến bay cho{" "}
                    <span className="font-semibold text-blue-600">
                      {selectedPackings.length}
                    </span>{" "}
                    kiện hàng được chọn.
                  </p>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã chuyến bay <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={flightCode}
                    onChange={(e) => setFlightCode(e.target.value)}
                    placeholder="VD: FL123, VN456"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    autoFocus
                  />

                  {assignError && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                      <X className="w-4 h-4" />
                      {assignError}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setFlightCode("");
                      setAssignError(null);
                    }}
                    className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium transition-colors duration-200"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleAssignFlight}
                    disabled={assignLoading || !flightCode.trim()}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      assignLoading || !flightCode.trim()
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                    }`}
                  >
                    {assignLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <RefreshCw className="animate-spin h-4 w-4" />
                        Đang xử lý...
                      </span>
                    ) : (
                      "Xác nhận"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackingAwaitList;
