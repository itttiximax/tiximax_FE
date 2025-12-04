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
  ImageIcon,
  Edit,
  PackagePlus,
  CheckSquare,
  Square,
  MapPin,
  Barcode,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import warehouseService from "../../Services/Warehouse/warehouseService";
import managerDestinationService from "../../Services/Manager/managerDestinationService";
import { createPackingService } from "../../Services/Warehouse/createpackingService";
import DetailWarehouse from "../Warehouse/DetailWarehouse";
import UpdateWarehouse from "./UpdateWarehouse";

const CreatePackingJapan = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailId, setDetailId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [updateData, setUpdateData] = useState(null);

  // States for Create Packing
  const [selectedItems, setSelectedItems] = useState([]);
  const [showPackingModal, setShowPackingModal] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState("");
  const [loadingDestinations, setLoadingDestinations] = useState(false);
  const [creatingPacking, setCreatingPacking] = useState(false);
  const [packingResult, setPackingResult] = useState(null);
  const [packingError, setPackingError] = useState("");

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

  const fetchDestinations = async () => {
    try {
      setLoadingDestinations(true);
      const data = await managerDestinationService.getDestinations();
      setDestinations(data);
    } catch (e) {
      const errorMsg =
        e.response?.data?.message || "Cannot load destination list.";
      setPackingError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoadingDestinations(false);
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

  const openUpdate = (item) => {
    setUpdateData(item);
    setUpdateOpen(true);
  };

  const closeUpdate = () => {
    setUpdateOpen(false);
    setUpdateData(null);
  };

  const handleUpdateSuccess = () => {
    toast.success("Cập nhật thành công!");
    fetchWarehouses();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterDate("");
  };

  const openImagePreview = (imageUrl) => {
    setPreviewImage(imageUrl);
  };

  const closeImagePreview = () => {
    setPreviewImage(null);
  };

  // Packing functions
  const toggleSelectItem = (item) => {
    setSelectedItems((prev) => {
      const exists = prev.find((i) => i.warehouseId === item.warehouseId);
      if (exists) {
        return prev.filter((i) => i.warehouseId !== item.warehouseId);
      } else {
        return [...prev, item];
      }
    });
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredWarehouses.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems([...filteredWarehouses]);
    }
  };

  const openPackingModal = async () => {
    if (selectedItems.length === 0) {
      toast.error("Please select at least one item to create packing.");
      return;
    }
    setShowPackingModal(true);
    setPackingResult(null);
    setPackingError("");
    await fetchDestinations();
  };

  const closePackingModal = () => {
    setShowPackingModal(false);
    setSelectedDestination("");
    setPackingResult(null);
    setPackingError("");
  };

  const handleCreatePacking = async () => {
    if (!selectedDestination) {
      setPackingError("Please select a destination.");
      return;
    }

    try {
      setCreatingPacking(true);
      setPackingError("");

      const shipmentCodes = selectedItems.map((item) => item.trackingCode);

      const packingData = {
        destinationId: parseInt(selectedDestination),
        shipmentCodes: shipmentCodes,
      };

      const response = await createPackingService(packingData);
      setPackingResult(response);
      toast.success("Packing created successfully!");
      setSelectedItems([]);
      fetchWarehouses();
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "An unknown error occurred.";
      setPackingError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setCreatingPacking(false);
    }
  };

  const isSelected = (item) => {
    return selectedItems.some((i) => i.warehouseId === item.warehouseId);
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

          {selectedItems.length > 0 && (
            <button
              onClick={openPackingModal}
              className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              <PackagePlus size={18} />
              Create Packing ({selectedItems.length})
            </button>
          )}
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
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleSelectAll}
                    className="flex items-center gap-2 text-blue-700 hover:text-blue-900 font-medium"
                  >
                    {selectedItems.length === filteredWarehouses.length ? (
                      <CheckSquare size={18} />
                    ) : (
                      <Square size={18} />
                    )}
                    Select All
                  </button>
                  <span className="font-medium text-gray-900">
                    Total: {filteredWarehouses.length} items
                    {selectedItems.length > 0 && (
                      <span className="text-blue-600 ml-2">
                        ({selectedItems.length} selected)
                      </span>
                    )}
                  </span>
                </div>
                <span className="text-blue-700">
                  Page {currentPage + 1} / {totalPages}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Select
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      No.
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Destination
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Shipment Code
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
                      className={`hover:bg-blue-50/60 transition-colors ${
                        isSelected(item) ? "bg-blue-50" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex justify-center">
                          <button
                            onClick={() => toggleSelectItem(item)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {isSelected(item) ? (
                              <CheckSquare size={20} />
                            ) : (
                              <Square size={20} />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        {currentPage * pageSize + index + 1}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.trackingCode}
                              onClick={() => openImagePreview(item.image)}
                              className="w-14 h-14 object-cover rounded-lg border-2 border-gray-200 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
                            />
                          ) : (
                            <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-200">
                              <ImageIcon size={22} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-900 font-medium">
                        {item.destination || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-900 font-medium">
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
                      <td className="px-4 py-3 text-gray-900">{item.dim} kg</td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openDetail(item.warehouseId)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                          >
                            <Eye size={14} />
                            View
                          </button>
                          <button
                            onClick={() => openUpdate(item)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                          >
                            <Edit size={14} />
                            Update
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white border-t border-gray-200 px-6 py-3">
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

      {/* Update Modal */}
      <UpdateWarehouse
        isOpen={updateOpen}
        onClose={closeUpdate}
        warehouseData={updateData}
        onSuccess={handleUpdateSuccess}
      />

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closeImagePreview}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={closeImagePreview}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors flex items-center gap-2 bg-black/50 px-3 py-2 rounded-lg"
            >
              <span className="text-sm font-medium">Close</span>
              <X size={20} />
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[85vh] rounded-lg shadow-2xl border-4 border-white"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Create Packing Modal */}
      {showPackingModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-blue-600 text-white p-5 rounded-t-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <PackagePlus size={24} />
                <h2 className="text-xl font-semibold">Create Packing</h2>
              </div>
              <button
                onClick={closePackingModal}
                className="text-white hover:bg-blue-700 p-2 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Success Result */}
              {packingResult && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="text-sm font-semibold text-green-800">
                      Packing created successfully!
                    </h3>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-1.5 border-b border-green-100">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Packing ID
                      </span>
                      <span className="font-semibold">
                        {packingResult.packingId}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-green-100">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Barcode className="w-4 h-4" />
                        Packing Code
                      </span>
                      <span className="font-mono text-blue-600 font-semibold">
                        {packingResult.packingCode}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-green-100">
                      <span className="text-gray-600">Flight Code</span>
                      <span className="font-semibold">
                        {packingResult.flightCode || (
                          <span className="text-yellow-600">
                            Not assigned yet
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-green-100">
                      <span className="text-gray-600">Packing date</span>
                      <span className="font-semibold">
                        {new Date(packingResult.packedDate).toLocaleString(
                          "en-US"
                        )}
                      </span>
                    </div>
                    <div className="pt-2">
                      <span className="text-gray-600 block mb-2 font-medium">
                        Shipment code list ({packingResult.packingList.length})
                      </span>
                      <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                        {packingResult.packingList.map((item, index) => (
                          <div
                            key={index}
                            className="font-mono text-xs py-1 flex items-center gap-2"
                          >
                            <Barcode className="w-3 h-3 text-gray-400" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={closePackingModal}
                    className="mt-4 w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Close
                  </button>
                </div>
              )}

              {/* Error Message */}
              {packingError && !packingResult && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-700">{packingError}</p>
                  </div>
                </div>
              )}

              {/* Form */}
              {!packingResult && (
                <>
                  {/* Selected Items */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Selected Items ({selectedItems.length})
                    </label>
                    <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto border border-gray-200">
                      {selectedItems.map((item, index) => (
                        <div
                          key={item.warehouseId}
                          className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {index + 1}.
                            </span>
                            <span className="font-mono text-sm text-gray-900">
                              {item.trackingCode}
                            </span>
                            {item.destination && (
                              <span className="text-xs text-gray-500">
                                → {item.destination}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Destination Selection */}
                  <div>
                    <label
                      htmlFor="packingDestination"
                      className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
                    >
                      <MapPin className="w-4 h-4 text-blue-500" />
                      Select Destination <span className="text-red-500">*</span>
                    </label>
                    {loadingDestinations ? (
                      <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                        <span className="text-gray-500 text-sm">
                          Loading destinations...
                        </span>
                      </div>
                    ) : (
                      <select
                        id="packingDestination"
                        value={selectedDestination}
                        onChange={(e) => setSelectedDestination(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      >
                        <option value="">Select destination</option>
                        {destinations.map((destination) => (
                          <option
                            key={destination.destinationId}
                            value={destination.destinationId}
                          >
                            {destination.destinationName}
                          </option>
                        ))}
                      </select>
                    )}
                    {destinations.length === 0 && !loadingDestinations && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        No destination found.
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closePackingModal}
                      className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleCreatePacking}
                      disabled={creatingPacking || !selectedDestination}
                      className="flex-1 py-2.5 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      {creatingPacking ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Package className="w-4 h-4" />
                          Create Packing
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePackingJapan;
