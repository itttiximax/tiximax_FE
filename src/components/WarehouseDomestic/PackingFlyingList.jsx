import React, { useState, useEffect } from "react";
import {
  Search,
  PlaneTakeoff,
  ChevronLeft,
  ChevronRight,
  Calendar,
  RefreshCw,
  CheckCircle,
  Package,
} from "lucide-react";
import toast from "react-hot-toast";
import packingsService from "../../Services/Warehouse/packingsService";
import receivePackingService from "../../Services/Warehouse/receivepackingService";

const PackingFlyingList = () => {
  const [packings, setPackings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20); // ✅ Tăng default lên 20
  const [totalPackings, setTotalPackings] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [selectedPackings, setSelectedPackings] = useState([]);

  // Helper function to extract error message from backend response
  const getErrorMessage = (error) => {
    if (error.response) {
      const backendError =
        error.response.data?.error ||
        error.response.data?.message ||
        error.response.data?.detail ||
        error.response.data?.errors;

      if (backendError) {
        if (typeof backendError === "object" && !Array.isArray(backendError)) {
          const errorMessages = Object.entries(backendError)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join(", ");
          return `Lỗi validation: ${errorMessages}`;
        } else if (Array.isArray(backendError)) {
          return backendError.join(", ");
        } else {
          return backendError;
        }
      } else {
        return `Lỗi ${error.response.status}: ${
          error.response.statusText || "Không xác định"
        }`;
      }
    } else if (error.request) {
      return "Không thể kết nối tới server. Vui lòng kiểm tra kết nối mạng.";
    } else {
      return error.message || "Đã xảy ra lỗi không xác định";
    }
  };

  // Load packings with pagination
  const loadPackings = async (page = 0, limit = 20) => {
    setLoading(true);
    try {
      const response = await packingsService.getFlyingAwayOrders(page, limit);
      setPackings(response.content || []);
      setTotalPackings(response.totalElements || 0);
      setCurrentPage(page);
    } catch (err) {
      console.error("Error loading flying-away packings:", err);
      const errorMessage = getErrorMessage(err);
      toast.error(errorMessage, { duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  // Get total products for a packing
  const getTotalProducts = (packingList) => {
    return packingList.length;
  };

  // Handle checkbox selection
  const handleSelectPacking = (packingCode) => {
    setSelectedPackings((prev) =>
      prev.includes(packingCode)
        ? prev.filter((code) => code !== packingCode)
        : [...prev, packingCode]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedPackings.length === filteredPackings.length) {
      setSelectedPackings([]);
    } else {
      setSelectedPackings(filteredPackings.map((p) => p.packingCode));
    }
  };

  // Handle confirm receipt
  const handleConfirmReceipt = async () => {
    if (selectedPackings.length === 0) {
      toast.error("Vui lòng chọn ít nhất một đơn hàng để xác nhận nhận");
      return;
    }
    setLoading(true);
    try {
      const note = "Đã nhận tại kho nội địa";
      await receivePackingService.confirmReceipt(selectedPackings, note);
      toast.success("Xác nhận nhận hàng thành công!");
      setSelectedPackings([]);
      await loadPackings(currentPage, pageSize);
    } catch (err) {
      console.error("Error confirming receipt:", err);
      const errorMessage = getErrorMessage(err);
      toast.error(`Không thể xác nhận nhận hàng: ${errorMessage}`, {
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackings(0, pageSize);
  }, [pageSize]);

  const handlePageChange = (newPage) => {
    loadPackings(newPage, pageSize);
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    setCurrentPage(0);
  };

  // Filter packings based on search term and date
  const filteredPackings = packings.filter(
    (packing) =>
      packing.packingCode.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!filterDate || packing.packedDate.split("T")[0] === filterDate)
  );

  const totalPages = Math.ceil(totalPackings / pageSize);

  return (
    <div className="min-h-screen p-3">
      <div className="mx-auto">
        {/* ✅ COMPACT HEADER */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">
              Đơn Hàng Đang Vận Chuyển
            </h1>
          </div>
        </div>

        {/* ✅ COMPACT CONTROLS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 mb-3">
          <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm mã đóng gói..."
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
                value={pageSize}
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

            {/* Confirm Receipt Button */}
            <button
              onClick={handleConfirmReceipt}
              disabled={loading || selectedPackings.length === 0}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                loading || selectedPackings.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              Nhận hàng ({selectedPackings.length})
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

        {/* Empty State */}
        {!loading && filteredPackings.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <PlaneTakeoff className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-medium text-gray-900 mb-2">
              Không có đơn hàng nào
            </h3>
            <p className="text-gray-500 text-sm">
              {searchTerm
                ? "Không tìm thấy kết quả phù hợp."
                : "Hiện tại không có đơn hàng nào đang vận chuyển."}
            </p>
          </div>
        )}

        {/* ✅ COMPACT TABLE */}
        {filteredPackings.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header Info */}
            <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      selectedPackings.length === filteredPackings.length &&
                      filteredPackings.length > 0
                    }
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="font-medium text-gray-700">
                    Chọn tất cả ({filteredPackings.length})
                  </span>
                </label>
                <span className="text-gray-500">
                  Trang {currentPage + 1} / {totalPages}
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
                        Mã Đóng Gói
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <PlaneTakeoff className="w-3 h-3" />
                        Chuyến Bay
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sản Phẩm
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        Tổng SP
                      </div>
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
                  {filteredPackings.map((packing, index) => (
                    <tr
                      key={packing.packingId}
                      className={`hover:bg-blue-50 transition-colors ${
                        selectedPackings.includes(packing.packingCode)
                          ? "bg-blue-50"
                          : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedPackings.includes(
                            packing.packingCode
                          )}
                          onChange={() =>
                            handleSelectPacking(packing.packingCode)
                          }
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>

                      {/* Packing Code */}
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          {packing.packingCode}
                        </span>
                      </td>

                      {/* Flight Code */}
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span className="text-sm font-medium text-blue-600">
                          {packing.flightCode}
                        </span>
                      </td>

                      {/* Packing List */}
                      <td className="px-3 py-2.5">
                        <div className="flex flex-wrap gap-1 max-w-md">
                          {packing.packingList.slice(0, 2).map((item) => (
                            <span
                              key={item}
                              className="inline-block px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-medium"
                            >
                              {item}
                            </span>
                          ))}
                          {packing.packingList.length > 2 && (
                            <span className="inline-block px-1.5 py-0.5 bg-gray-200 text-gray-600 text-xs rounded font-medium">
                              +{packing.packingList.length - 2}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Total Products */}
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span className="text-sm font-bold text-blue-600">
                          {getTotalProducts(packing.packingList)}
                        </span>
                      </td>

                      {/* Packed Date */}
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span className="text-xs text-gray-600">
                          {new Date(packing.packedDate).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          Đang bay
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ✅ COMPACT PAGINATION */}
        {filteredPackings.length > 0 && (
          <div className="flex items-center justify-between mt-3 bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-2.5">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentPage === 0
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
                {currentPage + 1}
              </span>
              <span className="text-xs text-gray-500">/ {totalPages}</span>
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentPage >= totalPages - 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Sau
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackingFlyingList;
