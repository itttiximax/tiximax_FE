import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Search,
  RefreshCcw,
  PackageSearch,
  ChevronLeft,
  ChevronRight,
  Package,
  User,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import warehouseService from "../../Services/Warehouse/warehouseService";

const STATUS_BADGES = {
  DA_MUA: {
    label: "Đã mua",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  KY_GUI: {
    label: "Ký gửi",
    className: "bg-indigo-100 text-indigo-800 border-indigo-200",
  },
  DEFAULT: {
    label: "Khác",
    className: "bg-gray-100 text-gray-800 border-gray-200",
  },
};

const PAGE_SIZE_OPTIONS = [20, 50, 100, 200];

// Loading Skeleton Component
const TableLoadingSkeleton = () => {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <tr key={i} className="border-b border-gray-100">
          <td className="px-4 py-3">
            <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
          </td>
          <td className="px-4 py-3">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
          </td>
          <td className="px-4 py-3">
            <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
          </td>
          <td className="px-4 py-3">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          </td>
          <td className="px-4 py-3">
            <div className="h-12 w-12 bg-gray-200 rounded-md animate-pulse"></div>
          </td>
          <td className="px-4 py-3">
            <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
          </td>
          <td className="px-4 py-3">
            <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
          </td>
        </tr>
      ))}
    </>
  );
};

// Table Row Component - Memoized
const TableRow = React.memo(({ row, index, page, size }) => {
  const badge = STATUS_BADGES[row.status] || STATUS_BADGES.DEFAULT;
  const [imageError, setImageError] = useState(false);

  return (
    <tr className="border-b border-gray-100 last:border-b-0 hover:bg-blue-50/30 transition-colors">
      <td className="px-4 py-3 text-gray-700 font-medium">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">
          {index + 1 + page * size}
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-gray-800 font-mono text-xs font-semibold border border-gray-200">
          {row.customerCode}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="font-mono text-sm font-semibold text-blue-600">
          {row.orderCode}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="text-gray-900 font-medium">{row.productName}</span>
      </td>

      <td className="px-4 py-3">
        {row.image && !imageError ? (
          <div className="relative group">
            <img
              src={row.image}
              alt={row.productName}
              className="w-14 h-14 object-cover rounded-lg border-2 border-gray-200 shadow-sm group-hover:border-blue-400 transition-all cursor-pointer"
              loading="lazy"
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all"></div>
          </div>
        ) : (
          <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-200">
            <ImageIcon className="w-6 h-6 text-gray-400" />
          </div>
        )}
      </td>

      <td className="px-4 py-3">
        {row.shipmentcode ? (
          <span className="font-mono text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded border border-gray-200">
            {row.shipmentcode}
          </span>
        ) : (
          <span className="text-xs text-gray-400 italic">Chưa có</span>
        )}
      </td>

      <td className="px-4 py-3">
        <span
          className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold border ${badge.className}`}
        >
          {badge.label}
        </span>
      </td>
    </tr>
  );
});

TableRow.displayName = "TableRow";

const PendingReceive = () => {
  const [rows, setRows] = useState([]);
  const [filters, setFilters] = useState({
    shipmentCode: "",
    customerCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const fetchData = useCallback(
    async (pageIndex = 0, pageSize = size) => {
      try {
        setLoading(true);
        setError(null);

        const data = await warehouseService.getWarehouseForeignLinks(
          pageIndex,
          pageSize,
          {
            shipmentCode: filters.shipmentCode,
            customerCode: filters.customerCode,
          }
        );

        const list = Array.isArray(data) ? data : data?.content || [];

        const flattened = [];
        list.forEach((order) => {
          (order.orderLinks || []).forEach((link) => {
            flattened.push({
              customerCode: order.customerCode,
              orderId: order.orderId,
              orderCode: order.orderCode,
              linkId: link.linkId,
              productName: link.productName,
              image: link.image,
              status: link.status,
              shipmentcode: link.shipmentcode || "",
            });
          });
        });

        setRows(flattened);
        setPage(pageIndex);
        setTotalPages(data?.totalPages || 1);
        setTotalElements(data?.totalElements || flattened.length);
      } catch (err) {
        console.error("Error fetching foreign warehouse links:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại.");
        setRows([]);
      } finally {
        setLoading(false);
      }
    },
    [filters.shipmentCode, filters.customerCode, size]
  );

  useEffect(() => {
    fetchData(0, size);
  }, [size, fetchData]);

  const handleFilterChange = useCallback((field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSearch = useCallback(() => {
    fetchData(0, size);
  }, [fetchData, size]);

  const handleRefresh = useCallback(() => {
    setFilters({ shipmentCode: "", customerCode: "" });
    fetchData(0, size);
  }, [fetchData, size]);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    },
    [handleSearch]
  );

  const handlePageChange = useCallback(
    (direction) => {
      if (direction === "next" && page < totalPages - 1) {
        fetchData(page + 1, size);
      } else if (direction === "prev" && page > 0) {
        fetchData(page - 1, size);
      }
    },
    [page, totalPages, size, fetchData]
  );

  const handlePageSizeChange = useCallback((newSize) => {
    setSize(newSize);
    setPage(0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br">
      <div className="p-4 md:p-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-full bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 shadow-md">
              <PackageSearch className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Quản lý hàng Nước ngoài chờ nhận
            </h1>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Filters Section */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Search className="w-5 h-5" />
              Bộ lọc tìm kiếm
            </h2>
          </div>

          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Customer Code */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mã khách hàng
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Nhập mã khách hàng..."
                    value={filters.customerCode}
                    onChange={(e) =>
                      handleFilterChange("customerCode", e.target.value)
                    }
                    onKeyPress={handleKeyPress}
                    className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all hover:border-blue-400"
                  />
                  <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Shipment Code */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mã vận đơn
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Nhập mã vận đơn..."
                    value={filters.shipmentCode}
                    onChange={(e) =>
                      handleFilterChange("shipmentCode", e.target.value)
                    }
                    onKeyPress={handleKeyPress}
                    className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all hover:border-blue-400"
                  />
                  <Package className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Page Size Selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Số dòng hiển thị
                </label>
                <select
                  value={size}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm transition-all hover:border-blue-400"
                >
                  {PAGE_SIZE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt} dòng
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:from-blue-300 disabled:to-blue-400 disabled:cursor-not-allowed font-medium text-sm flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <Search className="w-4 h-4" />
                {loading ? "Đang tìm..." : "Tìm kiếm"}
              </button>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed text-sm flex items-center gap-2 font-medium"
              >
                <RefreshCcw className="w-4 h-4" />
                Làm mới
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="px-6 py-3 bg-red-50 border-b border-red-200 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-sm text-red-700 font-medium">{error}</span>
            </div>
          )}

          {/* Results Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Danh sách gói hàng
                </h3>
                {totalElements > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    Tổng cộng:{" "}
                    <span className="font-bold text-blue-600">
                      {totalElements}
                    </span>{" "}
                    gói hàng
                    <span className="mx-2">•</span>
                    Hiển thị:{" "}
                    <span className="font-bold text-blue-600">
                      {rows.length}
                    </span>{" "}
                    trên trang này
                  </p>
                )}
              </div>
              {totalPages > 1 && (
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200">
                  <span className="text-sm text-gray-700">
                    Trang{" "}
                    <span className="font-bold text-blue-600">{page + 1}</span>{" "}
                    / <span className="font-bold">{totalPages}</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    STT
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Mã KH
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Mã đơn hàng
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Tên sản phẩm
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Hình ảnh
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Mã vận đơn
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Trạng thái
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-100">
                {/* Loading Skeleton */}
                {loading && <TableLoadingSkeleton />}

                {/* Empty State */}
                {!loading && rows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                          <PackageSearch className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-600 text-base font-semibold">
                          Không tìm thấy dữ liệu
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          Thử thay đổi bộ lọc tìm kiếm
                        </p>
                      </div>
                    </td>
                  </tr>
                )}

                {/* Data Rows */}
                {!loading &&
                  rows.map((row, idx) => (
                    <TableRow
                      key={`${row.orderId}-${row.linkId}`}
                      row={row}
                      index={idx}
                      page={page}
                      size={size}
                    />
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && rows.length > 0 && totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={() => handlePageChange("prev")}
                  disabled={page === 0}
                  className="w-full sm:w-auto px-6 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-blue-400 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-200 transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Trang trước
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700 bg-white px-4 py-2 rounded-lg border-2 border-gray-200 font-medium">
                    Trang{" "}
                    <span className="font-bold text-blue-600">{page + 1}</span>{" "}
                    / <span className="font-bold">{totalPages}</span>
                  </span>
                </div>

                <button
                  onClick={() => handlePageChange("next")}
                  disabled={page >= totalPages - 1}
                  className="w-full sm:w-auto px-6 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-blue-400 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-200 transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow"
                >
                  Trang sau
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingReceive;
