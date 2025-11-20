import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Warehouse,
  Package,
  ChevronLeft,
  ChevronRight,
  Calendar,
  RefreshCw,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";
import warehouseService from "../../Services/Warehouse/warehouseService";
import DetailWarehouse from "../Warehouse/DetailWarehouse";

const WarehouseList = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailId, setDetailId] = useState(null);

  useEffect(() => {
    fetchWarehouses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize]);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await warehouseService.getReadyWarehouses(
        currentPage,
        pageSize
      );
      setWarehouses(data?.content || []);
      setTotalPages(data?.totalPages || 0);
    } catch (e) {
      const errorMsg = e.response?.data?.message || "Error loading data!";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((p) => p + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((p) => p - 1);
    }
  };

  const changePageSize = (e) => {
    setPageSize(parseInt(e.target.value, 10));
    setCurrentPage(0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredWarehouses = useMemo(() => {
    const term = (searchTerm || "").toLowerCase().trim();
    const dateFilter = (filterDate || "").trim();

    return (warehouses || []).filter((w) => {
      const matchTerm =
        !term ||
        (w?.trackingCode || "").toLowerCase().includes(term) ||
        (w?.orderCode || "").toLowerCase().includes(term);

      if (!matchTerm) return false;
      if (!dateFilter) return true;

      const created = w?.createdAt ? new Date(w.createdAt) : null;
      if (!created || Number.isNaN(created.getTime())) return false;

      const yyyy = created.getFullYear();
      const mm = String(created.getMonth() + 1).padStart(2, "0");
      const dd = String(created.getDate()).padStart(2, "0");
      const createdDateOnly = `${yyyy}-${mm}-${dd}`;

      return createdDateOnly === dateFilter;
    });
  }, [warehouses, searchTerm, filterDate]);

  const openDetail = (id) => {
    setDetailId(id);
    setDetailOpen(true);
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setDetailId(null);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterDate("");
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="mx-auto">
        {/* Header */}
        <div className="bg-blue-600 rounded-xl shadow-sm p-5 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Warehouse size={22} className="text-white" />
            </div>
            <h1 className="text-xl font-semibold text-white">
              Warehouse Management
            </h1>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by tracking code or order code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

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

            <select
              value={pageSize}
              onChange={changePageSize}
              disabled={loading}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={30}>30 / page</option>
              <option value={50}>50 / page</option>
              <option value={100}>100 / page</option>
            </select>

            {(searchTerm || filterDate) && (
              <button
                onClick={clearFilters}
                className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
            <RefreshCw
              size={32}
              className="animate-spin text-blue-600 mx-auto mb-3"
            />
            <p className="text-gray-700 text-sm font-medium">Loading data...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredWarehouses.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
            <Warehouse size={40} className="text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-800 mb-1">
              No data
            </h3>
            <p className="text-gray-500 text-sm">
              {searchTerm || filterDate
                ? "No matching results."
                : "There are no items in the warehouse yet."}
            </p>
            {(searchTerm || filterDate) && (
              <button
                onClick={clearFilters}
                className="mt-3 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Table */}
        {filteredWarehouses.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-6 py-3 bg-blue-200 border-b border-blue-100">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-black-900">
                  Total: {filteredWarehouses.length} items
                </span>
                <span className="text-blue-700">
                  Page {currentPage + 1} / {totalPages}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      No.
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Tracking Code
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Order Code
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Weight
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Net Weight
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Dimension
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredWarehouses.map((item, index) => (
                    <tr
                      key={item.warehouseId ?? `${item.trackingCode}-${index}`}
                      className="hover:bg-blue-50/60 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-900">
                        {currentPage * pageSize + index + 1}
                      </td>
                      <td className="px-6 py-3 text-gray-900 font-medium">
                        {item.trackingCode}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {item.orderCode || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        {item.weight} kg
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        {item.netWeight} kg
                      </td>
                      <td className="px-4 py-3 text-gray-900">{item.dim} m³</td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => openDetail(item.warehouseId)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                          <Eye size={14} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white border border-gray-200 rounded-xl px-6 py-3">
              <div className="flex items-center justify-between text-sm">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    currentPage === 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-blue-50"
                  }`}
                >
                  <ChevronLeft size={18} />
                  Previous
                </button>

                <div className="font-medium text-gray-700">
                  Page {currentPage + 1} / {totalPages}
                </div>

                <button
                  onClick={nextPage}
                  disabled={currentPage >= totalPages - 1}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    currentPage >= totalPages - 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-blue-50"
                  }`}
                >
                  Next
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <DetailWarehouse
        open={detailOpen}
        warehouseId={detailId}
        onClose={closeDetail}
      />
    </div>
  );
};

export default WarehouseList;
