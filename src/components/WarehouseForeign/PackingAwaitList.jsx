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
import packingsService from "../../Services/Warehouse/packingsService";

const PackingAwaitList = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20); // ✅ Tăng default lên 20
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPackings, setSelectedPackings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [flightCode, setFlightCode] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState(null);
  const [assignSuccess, setAssignSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

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
        setSelectedPackings([]);
      } catch (err) {
        setError(err.message || "Failed to fetch awaiting-flight orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, limit]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 0) setPage((prev) => prev - 1);
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setLimit(newSize);
    setPage(0);
  };

  const handleSelectPacking = (packingId) => {
    setSelectedPackings((prev) =>
      prev.includes(packingId)
        ? prev.filter((id) => id !== packingId)
        : [...prev, packingId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPackings.length === filteredOrders.length) {
      setSelectedPackings([]);
    } else {
      setSelectedPackings(filteredOrders.map((order) => order.packingId));
    }
  };

  const handleAssignFlight = async () => {
    if (!flightCode.trim()) {
      setAssignError("Vui lòng nhập mã chuyến bay");
      return;
    }

    setAssignLoading(true);
    setAssignError(null);
    setAssignSuccess(null);

    try {
      await packingsService.assignFlight(selectedPackings, flightCode);
      setAssignSuccess(
        `Đã gán thành công ${selectedPackings.length} kiện hàng vào chuyến bay ${flightCode}`
      );

      const response = await packingsService.getAwaitingFlightOrders(
        page,
        limit
      );
      setOrders(response.content || []);
      setSelectedPackings([]);
      setFlightCode("");
      setShowModal(false);
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
    <div className="min-h-screen p-3">
      <div className="mx-auto">
        {/* ✅ COMPACT HEADER */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-blue-600">
              Đơn Hàng Chờ Chuyến Bay
            </h1>
          </div>
        </div>

        {/* Success/Error Messages */}
        {assignSuccess && (
          <div className="mb-3 p-2.5 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
            <div className="flex items-center">
              <Check className="w-4 h-4 text-green-400 mr-2" />
              <p className="text-green-700 text-sm">{assignSuccess}</p>
            </div>
          </div>
        )}

        {assignError && (
          <div className="mb-3 p-2.5 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
            <div className="flex items-center">
              <X className="w-4 h-4 text-red-400 mr-2" />
              <p className="text-red-700 text-sm">{assignError}</p>
            </div>
          </div>
        )}

        {/* ✅ COMPACT CONTROLS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 mb-3">
          <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm mã kiện hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <select
                value={limit}
                onChange={handlePageSizeChange}
                disabled={loading}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100"
              >
                <option value={10}>10 / trang</option>
                <option value={20}>20 / trang</option>
                <option value={30}>30 / trang</option>
                <option value={50}>50 / trang</option>
                <option value={100}>100 / trang</option>
              </select>
            </div>

            {/* Action Button */}
            <button
              onClick={() => setShowModal(true)}
              disabled={selectedPackings.length === 0}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedPackings.length === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
              }`}
            >
              <Plane className="w-4 h-4" />
              Gán Chuyến ({selectedPackings.length})
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="inline-flex items-center px-3 py-2 font-semibold leading-5 text-sm text-blue-600">
              <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" />
              Đang tải dữ liệu...
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8 text-center">
            <X className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <h3 className="text-base font-medium text-gray-900 mb-2">
              Có lỗi xảy ra
            </h3>
            <p className="text-red-600 text-sm">{error}</p>
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
              {searchTerm || filterDate
                ? "Không tìm thấy kết quả phù hợp."
                : "Hiện tại không có kiện hàng nào chờ gán chuyến bay."}
            </p>
          </div>
        )}

        {/* ✅ TABLE LAYOUT - COMPACT & SHOW MORE */}
        {filteredOrders.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      selectedPackings.length === filteredOrders.length &&
                      filteredOrders.length > 0
                    }
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="font-medium text-gray-700">
                    Chọn tất cả ({filteredOrders.length})
                  </span>
                </label>
                <span className="text-gray-500">
                  Đã chọn: {selectedPackings.length} kiện
                </span>
              </div>
            </div>

            {/* ✅ TABLE */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left w-12">
                      <span className="sr-only">Checkbox</span>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        Mã Kiện Hàng
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Danh Sách Hàng Hóa
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Ngày Đóng Gói
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng Thái
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.packingId}
                      className={`hover:bg-blue-50 transition-colors ${
                        selectedPackings.includes(order.packingId)
                          ? "bg-blue-50"
                          : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedPackings.includes(order.packingId)}
                          onChange={() => handleSelectPacking(order.packingId)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>

                      {/* Packing Code */}
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          {order.packingCode}
                        </span>
                      </td>
                      {/* Packing List */}
                      <td className="px-3 py-2.5">
                        <div className="flex flex-wrap gap-1 max-w-md">
                          {order.packingList && order.packingList.length > 0 ? (
                            <>
                              {order.packingList
                                .slice(0, 2)
                                .map((item, index) => (
                                  <span
                                    key={index}
                                    className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
                                  >
                                    {item}
                                  </span>
                                ))}
                              {order.packingList.length > 2 && (
                                <span className="inline-block px-1.5 py-0.5 bg-gray-200 text-gray-600 text-xs rounded font-medium">
                                  +{order.packingList.length - 2}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-xs text-gray-400">N/A</span>
                          )}
                        </div>
                      </td>

                      {/* Packed Date */}
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span className="text-xs text-gray-600">
                          {formatDate(order.packedDate)}
                        </span>
                      </td>

                      {/* Flight Status */}
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        {order.flightCode ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            {order.flightCode}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            Chờ CB
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ✅ COMPACT PAGINATION */}
        {filteredOrders.length > 0 && (
          <div className="flex items-center justify-between mt-3 bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-2.5">
            <button
              onClick={handlePrevPage}
              disabled={page === 0}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                page === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Trước
            </button>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500">Trang</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
                {page + 1}
              </span>
            </div>

            <button
              onClick={handleNextPage}
              disabled={orders.length < limit}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                orders.length < limit
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Sau
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ✅ COMPACT MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              <div className="p-5">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <Plane className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Gán Chuyến Bay
                  </h3>
                </div>

                <div className="mb-5">
                  <p className="text-gray-600 text-sm mb-3">
                    Gán chuyến bay cho{" "}
                    <span className="font-semibold text-blue-600">
                      {selectedPackings.length}
                    </span>{" "}
                    kiện hàng được chọn.
                  </p>

                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Mã chuyến bay <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={flightCode}
                    onChange={(e) => setFlightCode(e.target.value)}
                    placeholder="VD: FL123, VN456"
                    className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />

                  {assignError && (
                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                      <X className="w-3 h-3" />
                      {assignError}
                    </p>
                  )}
                </div>

                <div className="flex gap-2.5">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setFlightCode("");
                      setAssignError(null);
                    }}
                    className="flex-1 px-4 py-2.5 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleAssignFlight}
                    disabled={assignLoading || !flightCode.trim()}
                    className={`flex-1 px-4 py-2.5 text-sm rounded-lg font-medium transition-all ${
                      assignLoading || !flightCode.trim()
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {assignLoading ? (
                      <span className="flex items-center justify-center gap-1.5">
                        <RefreshCw className="animate-spin h-3.5 w-3.5" />
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
