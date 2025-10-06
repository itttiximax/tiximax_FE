import React, { useState, useEffect } from "react";
import {
  Search,
  PlaneTakeoff,
  ChevronLeft,
  ChevronRight,
  Calendar,
  RefreshCw,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import packingsService from "../../Services/Warehouse/packingsService";
import receivePackingService from "../../Services/Warehouse/receivePackingService";

const PackingFlyingList = () => {
  const [packings, setPackings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
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
  const loadPackings = async (page = 0, limit = 10) => {
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
    <div className="min-h-screen p-4 sm:p-6">
      <div className="mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <PlaneTakeoff className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Đơn Hàng Đang Vận Chuyển
            </h1>
          </div>
          <p className="text-gray-600 ml-11">
            Danh sách các đơn hàng đã đóng gói và đang trên đường vận chuyển
          </p>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo mã đóng gói..."
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
                value={pageSize}
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

            {/* Confirm Receipt Button */}
            <button
              onClick={handleConfirmReceipt}
              disabled={loading || selectedPackings.length === 0}
              className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                loading || selectedPackings.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Xác nhận nhận hàng ({selectedPackings.length})
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

        {/* Empty State */}
        {!loading && filteredPackings.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <PlaneTakeoff className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không có đơn hàng nào
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? "Không tìm thấy kết quả phù hợp với từ khóa tìm kiếm."
                : "Hiện tại không có đơn hàng nào đang vận chuyển."}
            </p>
          </div>
        )}

        {/* Packings List */}
        {filteredPackings.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* List Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-700">
                    Tổng cộng: {filteredPackings.length} đơn hàng
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Trang {currentPage + 1} / {totalPages}
                </div>
              </div>
            </div>

            {/* List Body */}
            <div className="divide-y divide-gray-200">
              {filteredPackings.map((packing, index) => (
                <div
                  key={packing.packingId}
                  className="p-6 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox and Packing Number */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedPackings.includes(packing.packingCode)}
                        onChange={() =>
                          handleSelectPacking(packing.packingCode)
                        }
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">
                          {currentPage * pageSize + index + 1}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Packing Info */}
                      <div className="lg:col-span-1">
                        <div className="flex items-center gap-2 mb-2">
                          <PlaneTakeoff className="w-4 h-4 text-blue-500" />
                          <span className="font-semibold text-gray-900 text-lg">
                            {packing.packingCode}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span className="text-sm text-blue-600 font-medium">
                            Đang vận chuyển
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Chuyến bay: {packing.flightCode}
                        </p>
                      </div>

                      {/* Packing List */}
                      <div className="lg:col-span-1">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Danh sách sản phẩm:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {packing.packingList.slice(0, 3).map((item) => (
                            <span
                              key={item}
                              className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                            >
                              {item}
                            </span>
                          ))}
                          {packing.packingList.length > 3 && (
                            <span className="inline-block px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                              +{packing.packingList.length - 3} mã khác
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Product Summary */}
                      <div className="lg:col-span-1">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Tổng sản phẩm:
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl font-bold text-blue-600">
                            {getTotalProducts(packing.packingList)}
                          </span>
                          <span className="text-sm text-gray-500">
                            sản phẩm
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Ngày đóng gói:{" "}
                          {new Date(packing.packedDate).toLocaleDateString(
                            "vi-VN"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        {filteredPackings.length > 0 && (
          <div className="flex items-center justify-between mt-6 bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentPage === 0
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
                {currentPage + 1}
              </span>
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentPage >= totalPages - 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Trang sau
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackingFlyingList;
