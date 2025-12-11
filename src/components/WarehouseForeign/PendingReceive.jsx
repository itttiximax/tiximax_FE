import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCcw,
  PackageSearch,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import warehouseService from "../../Services/Warehouse/warehouseService";

const STATUS_BADGES = {
  DA_MUA: {
    label: "PURCHASED",
    className: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  KY_GUI: {
    label: "CONSIGNED",
    className: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  },
  DEFAULT: {
    label: "OTHER",
    className: "bg-gray-50 text-gray-600 border border-gray-200",
  },
};

const PAGE_SIZE_OPTIONS = [20, 50, 100, 200];

const PendingReceive = () => {
  const [rows, setRows] = useState([]);
  const [shipmentCodeFilter, setShipmentCodeFilter] = useState("");
  const [customerCodeFilter, setCustomerCodeFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(50); // Default 50
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async (pageIndex = 0, pageSize = size) => {
    try {
      setLoading(true);
      setError(null);

      const data = await warehouseService.getWarehouseForeignLinks(
        pageIndex,
        pageSize,
        {
          shipmentCode: shipmentCodeFilter,
          customerCode: customerCodeFilter,
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

      if (data?.totalPages !== undefined) {
        setTotalPages(data.totalPages);
      } else {
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Error fetching foreign warehouse links:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(0, size);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  const handleSearch = () => fetchData(0, size);

  const handleRefresh = () => {
    setShipmentCodeFilter("");
    setCustomerCodeFilter("");
    fetchData(0, size);
  };

  const filteredRows = useMemo(() => rows, [rows]);

  return (
    <div className="p-6 min-h-screen text-gray-900">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-blue-100 p-2">
            <PackageSearch className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Foreign Incoming Packages
            </h1>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Filters */}
          <div className="border-b border-gray-100 bg-gray-50 px-4 py-3 flex flex-wrap justify-between gap-3">
            {/* Filter Inputs */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Customer Code */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Customer code"
                  value={customerCodeFilter}
                  onChange={(e) => setCustomerCodeFilter(e.target.value)}
                  className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-52 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {/* Shipment Code */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Shipment code"
                  value={shipmentCodeFilter}
                  onChange={(e) => setShipmentCodeFilter(e.target.value)}
                  className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-52 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Search className="w-4 h-4" />
                Search
              </button>

              {/* Clear Filters */}
              <button
                onClick={handleRefresh}
                className="inline-flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <RefreshCcw className="w-4 h-4" />
                Reset
              </button>
            </div>

            {/* Page Size Selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rows per page</span>
              <select
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {PAGE_SIZE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <div className="px-4 py-2 bg-red-50 border-b border-red-100 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                    #
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                    Customer code
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                    Order code
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                    Product
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                    Image
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                    Shipment code
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white">
                {/* Loading Skeleton */}
                {loading &&
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="border-b">
                      <td className="px-4 py-3">
                        <div className="h-3 w-6 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-3 w-28 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-10 w-10 bg-gray-200 rounded-md animate-pulse"></div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                      </td>
                    </tr>
                  ))}

                {/* Empty state */}
                {!loading && filteredRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No data found.
                    </td>
                  </tr>
                )}

                {/* Data Rows */}
                {!loading &&
                  filteredRows.map((row, idx) => {
                    const badge =
                      STATUS_BADGES[row.status] || STATUS_BADGES.DEFAULT;

                    return (
                      <tr
                        key={`${row.orderId}-${row.linkId}`}
                        className="border-b last:border-b-0 hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-4 py-2 text-gray-700">
                          {idx + 1 + page * size}
                        </td>
                        <td className="px-4 py-2">{row.customerCode}</td>
                        <td className="px-4 py-2 text-blue-600 font-semibold">
                          {row.orderCode}
                        </td>
                        <td className="px-4 py-2">{row.productName}</td>

                        <td className="px-4 py-2">
                          {row.image ? (
                            <img
                              src={row.image}
                              alt={row.productName}
                              className="w-12 h-12 object-cover rounded-md border border-gray-200"
                            />
                          ) : (
                            <span className="text-xs text-gray-400">
                              No image
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-2 font-mono text-xs">
                          {row.shipmentcode || (
                            <span className="text-gray-400 italic">N/A</span>
                          )}
                        </td>

                        <td className="px-4 py-2">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${badge.className}`}
                          >
                            {badge.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex flex-wrap justify-between items-center gap-3">
            <div className="text-sm text-gray-600">
              <span>
                Page <strong>{page + 1}</strong> of {totalPages}
              </span>
              <span className="mx-2">•</span>
              <span>{rows.length} items on this page</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1.5 rounded-lg border bg-white text-gray-700 disabled:opacity-40 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={page === 0 || loading}
                onClick={() => fetchData(page - 1, size)}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                className="px-3 py-1.5 rounded-lg border bg-white text-gray-700 disabled:opacity-40 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={page >= totalPages - 1 || loading}
                onClick={() => fetchData(page + 1, size)}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingReceive;
