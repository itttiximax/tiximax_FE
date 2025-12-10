import React, { useEffect, useState } from "react";
import {
  Search,
  Loader2,
  Check,
  X,
  Package,
  Truck,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Image as ImageIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import orderlinkService from "../../Services/StaffPurchase/orderlinkService";

const RelateOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogSubmitting, setDialogSubmitting] = useState(false);
  const [dialogCode, setDialogCode] = useState("");
  const [editingItem, setEditingItem] = useState(null);

  // Image preview
  const [imagePreview, setImagePreview] = useState(null);

  const pageSizeOptions = [20, 50, 100, 200];

  const fetchOrders = async (page = 0, size = pageSize) => {
    try {
      setLoadingList(true);
      const data = await orderlinkService.getOrdersWithoutShipment(page, size);
      setOrders(data?.content || []);
      setTotalElements(data?.totalElements || 0);
      setTotalPages(data?.totalPages || 0);
      setCurrentPage(page);
    } catch (err) {
      toast.error("Không thể tải danh sách.");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchOrders(0, pageSize);
  }, [pageSize]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchOrders(newPage, pageSize);
    }
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(0);
    fetchOrders(0, newSize);
  };

  const statusBadge = (status) => {
    const statusMap = {
      CHO_MUA: {
        label: "Chờ mua",
        style: "bg-amber-50 text-amber-700 border-amber-200",
        dot: "bg-amber-500",
      },
      DAU_GIA_THANH_CONG: {
        label: "Đấu giá thành công",
        style: "bg-emerald-50 text-emerald-700 border-emerald-200",
        dot: "bg-emerald-500",
      },
      MUA_SAU: {
        label: "Mua sau",
        style: "bg-blue-50 text-blue-700 border-blue-200",
        dot: "bg-blue-500",
      },
      DA_NHAN: {
        label: "Đã nhận",
        style: "bg-green-50 text-green-700 border-green-200",
        dot: "bg-green-500",
      },
      DA_HUY: {
        label: "Đã hủy",
        style: "bg-red-50 text-red-700 border-red-200",
        dot: "bg-red-500",
      },
      CHO_XU_LY: {
        label: "Chờ xử lý",
        style: "bg-gray-50 text-gray-700 border-gray-200",
        dot: "bg-gray-500",
      },
    };

    const statusInfo = statusMap[status] || {
      label: status,
      style: "bg-gray-50 text-gray-600 border-gray-200",
      dot: "bg-gray-400",
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border ${statusInfo.style}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
        {statusInfo.label}
      </span>
    );
  };

  // Flatten
  const rows = orders.flatMap((o) =>
    o.pendingLinks.map((l) => ({
      orderId: o.orderId,
      orderCode: o.orderCode,
      customerName: o.customer?.name,
      customerCode: o.customer?.customerCode,
      productName: l.productName,
      quantity: l.quantity,
      linkId: l.linkId,
      status: l.status,
      shipmentCode: l.shipmentCode || "",
      purchaseImage: l.purchaseImage || "",
      checkStatus: l.checkStatus || "CHECK", // vẫn giữ data, chỉ không hiển thị
    }))
  );

  // Search
  const filtered = rows.filter((r) => {
    const t = searchText.toLowerCase();
    return (
      !t ||
      r.orderCode.toLowerCase().includes(t) ||
      r.customerCode.toLowerCase().includes(t) ||
      r.customerName.toLowerCase().includes(t) ||
      r.productName.toLowerCase().includes(t)
    );
  });

  // Open dialog
  const handleOpenDialog = (row) => {
    setEditingItem(row);
    setDialogCode(row.shipmentCode || "");
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    if (dialogSubmitting) return;
    setDialogOpen(false);
    setDialogCode("");
    setEditingItem(null);
  };

  const handleConfirmUpdate = async () => {
    if (!editingItem) return;

    if (!dialogCode.trim()) {
      toast.error("Vui lòng nhập mã vận đơn!");
      return;
    }

    try {
      setDialogSubmitting(true);

      await orderlinkService.updateOrderLinkShipmentCode(
        editingItem.orderId,
        editingItem.linkId,
        dialogCode
      );

      toast.success("Cập nhật thành công.");
      handleCloseDialog();
      fetchOrders(currentPage, pageSize);
    } catch {
      toast.error("Cập nhật thất bại.");
    } finally {
      setDialogSubmitting(false);
    }
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage < 3) {
        for (let i = 0; i < 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages - 1);
      } else if (currentPage > totalPages - 4) {
        pages.push(0);
        pages.push("...");
        for (let i = totalPages - 4; i < totalPages; i++) pages.push(i);
      } else {
        pages.push(0);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages - 1);
      }
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br p-6">
      <div className="mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-600/20">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Cập nhật mã vận đơn
            </h1>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tổng đơn hàng</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.length}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tổng link</p>
                <p className="text-2xl font-bold text-gray-900">
                  {rows.length}
                </p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg">
                <Truck className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Kết quả tìm kiếm</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filtered.length}
                </p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <Search className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tổng số bản ghi</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalElements}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTER */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div className="lg:col-span-3">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Tìm kiếm nhanh
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700 placeholder:text-gray-400"
                  placeholder="Nhập mã đơn, mã khách hàng, tên khách hàng hoặc sản phẩm..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                {searchText && (
                  <button
                    onClick={() => setSearchText("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                )}
              </div>
            </div>

            {/* Page Size Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Số dòng / trang
              </label>
              <div className="relative">
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="w-full appearance-none pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700 font-medium cursor-pointer"
                >
                  {pageSizeOptions.map((size) => (
                    <option key={size} value={size}>
                      {size} dòng
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
                  {[
                    { label: "Hình ảnh", width: "w-[10%]" },
                    { label: "Mã đơn", width: "w-[15%]" },
                    { label: "Khách hàng", width: "w-[18%]" },
                    { label: "Mã KH", width: "w-[12%]" },
                    { label: "Sản phẩm", width: "w-[20%]" },
                    { label: "Trạng thái", width: "w-[15%]" },
                    { label: "Thao tác", width: "w-[10%]" },
                  ].map((h) => (
                    <th
                      key={h.label}
                      className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 ${h.width}`}
                    >
                      {h.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loadingList ? (
                  <tr>
                    <td colSpan="7" className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                        <p className="text-gray-500 font-medium">
                          Đang tải dữ liệu...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-4 bg-gray-100 rounded-full">
                          <AlertCircle className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-gray-700 font-medium mb-1">
                            Không tìm thấy dữ liệu
                          </p>
                          <p className="text-sm text-gray-500">
                            {searchText
                              ? "Thử thay đổi từ khóa tìm kiếm"
                              : "Chưa có đơn hàng nào cần cập nhật"}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((row, i) => (
                    <tr
                      key={i}
                      className="hover:bg-blue-50/30 transition-colors group"
                    >
                      {/* Purchase Image */}
                      <td className="px-4 py-4 w-[10%]">
                        {row.purchaseImage ? (
                          <div className="relative group/img">
                            <img
                              src={row.purchaseImage}
                              alt="Product"
                              className="w-14 h-14 object-cover rounded-lg border-2 border-gray-200 cursor-pointer hover:border-blue-500 transition-all shadow-sm"
                              onClick={() => setImagePreview(row.purchaseImage)}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 rounded-lg transition-all flex items-center justify-center pointer-events-none">
                              <ImageIcon className="w-5 h-5 text-white opacity-0 group-hover/img:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-14 h-14 bg-gray-100 rounded-lg border-2 border-gray-200 flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </td>

                      {/* Order Code */}
                      <td className="px-4 py-4 w-[15%]">
                        <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors break-words">
                          {row.orderCode}
                        </span>
                      </td>

                      {/* Customer Name */}
                      <td className="px-4 py-4 w-[18%]">
                        <span className="text-gray-700 font-medium break-words">
                          {row.customerName}
                        </span>
                      </td>

                      {/* Customer Code */}
                      <td className="px-4 py-4 w-[10%]">
                        <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md break-words">
                          {row.customerCode}
                        </span>
                      </td>

                      {/* Product Name */}
                      <td className="px-4 py-4 w-[29%]">
                        <div className="space-y-1">
                          <p className="font-medium text-gray-900 break-words line-clamp-2">
                            {row.productName}
                          </p>
                          <p className="text-xs text-gray-500">
                            Số lượng:{" "}
                            <span className="font-semibold">
                              {row.quantity}
                            </span>
                          </p>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 w-[10%]">
                        {statusBadge(row.status)}
                      </td>

                      {/* Action */}
                      <td className="px-4 py-4 w-[8%]">
                        <button
                          onClick={() => handleOpenDialog(row)}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg shadow-sm hover:shadow-md hover:from-blue-700 hover:to-blue-600 transition-all"
                        >
                          <Truck className="w-4 h-4" />
                          Cập nhật
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {!loadingList && totalPages > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Hiển thị{" "}
                  <span className="font-semibold text-gray-900">
                    {currentPage * pageSize + 1}
                  </span>{" "}
                  đến{" "}
                  <span className="font-semibold text-gray-900">
                    {Math.min((currentPage + 1) * pageSize, totalElements)}
                  </span>{" "}
                  trong tổng số{" "}
                  <span className="font-semibold text-gray-900">
                    {totalElements}
                  </span>{" "}
                  bản ghi
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="p-2 rounded-lg border border-gray-200 hover:bg:white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    title="Trang trước"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>

                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, idx) => (
                      <React.Fragment key={idx}>
                        {page === "..." ? (
                          <span className="px-3 py-2 text-gray-400">...</span>
                        ) : (
                          <button
                            onClick={() => handlePageChange(page)}
                            className={`min-w-[40px] px-4 py-2 rounded-lg font-medium transition-all ${
                              currentPage === page
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                : "border border-gray-200 text-gray-700 hover:bg-white"
                            }`}
                          >
                            {page + 1}
                          </button>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="p-2 rounded-lg border border-gray-200 hover:bg:white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    title="Trang tiếp"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DIALOG */}
      {dialogOpen && editingItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 animate-in fade-in zoom-in duration-200">
            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-blue-100/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-600/20">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Cập nhật mã vận đơn
                </h3>
              </div>
              <button
                onClick={handleCloseDialog}
                disabled={dialogSubmitting}
                className="p-2 hover:bg-white rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* CONTENT */}
            <div className="px-6 py-6 space-y-5">
              {/* Order Info Card */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start gap-3">
                  {editingItem.purchaseImage && (
                    <img
                      src={editingItem.purchaseImage}
                      alt="Product"
                      className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200 flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-gray-900">
                        {editingItem.orderCode}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-700 font-medium truncate">
                        {editingItem.customerName}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {editingItem.productName}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-gray-500">
                        Số lượng: {editingItem.quantity}
                      </span>
                      <span className="text-gray-300">•</span>
                      {statusBadge(editingItem.status)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Input Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mã vận đơn <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                    placeholder="Nhập mã vận đơn..."
                    value={dialogCode}
                    onChange={(e) => setDialogCode(e.target.value)}
                    disabled={dialogSubmitting}
                    autoFocus
                  />
                </div>
              </div>

              {/* Info Notice */}
              <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-700">
                  Vui lòng kiểm tra kỹ thông tin trước khi lưu. Mã vận đơn không
                  thể thay đổi sau khi cập nhật.
                </p>
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={handleCloseDialog}
                disabled={dialogSubmitting}
                className="px-5 py-2.5 rounded-lg border-2 border-gray-200 text-gray-700 font-medium hover:bg-white hover:border-gray-300 transition-all disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmUpdate}
                disabled={dialogSubmitting || !dialogCode.trim()}
                className="px-5 py-2.5 rounded-lg text-white font-medium bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {dialogSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Xác nhận lưu</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE PREVIEW MODAL */}
      {imagePreview && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-[200] p-4"
          onClick={() => setImagePreview(null)}
        >
          <div className="relative w-full max-w-6xl max-h-[90vh] flex items-center justify-center">
            <button
              onClick={() => setImagePreview(null)}
              className="absolute -top-12 right-0 p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
            <img
              src={imagePreview}
              alt="Preview"
              className="w-auto max-w-[95vw] max-h-[85vh] rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RelateOrder;
