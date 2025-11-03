import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiCheck,
  FiBox,
  FiSearch,
  FiFilter,
  FiPackage,
  FiDollarSign,
  FiGrid,
  FiList,
} from "react-icons/fi";
import {
  getAllProductTypes,
  createProductType,
  updateProductType,
  deleteProductType,
} from "../../Services/Manager/managerProductTypeService";
import ConfirmDialog from "../../common/ConfirmDialog";

const ManagerProductType = () => {
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFee, setFilterFee] = useState("all");
  const [viewMode, setViewMode] = useState("table");
  const [formData, setFormData] = useState({
    productTypeName: "",
    fee: false,
  });

  useEffect(() => {
    fetchProductTypes();
  }, []);

  const fetchProductTypes = async () => {
    try {
      const data = await getAllProductTypes();
      setProductTypes(data);
    } catch {
      toast.error("Có lỗi khi tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loadingToast = toast.loading(
      editingId ? "Đang cập nhật..." : "Đang tạo mới..."
    );

    try {
      if (editingId) {
        const updatedData = { productTypeId: editingId, ...formData };
        setProductTypes((prev) =>
          prev.map((item) =>
            item.productTypeId === editingId ? { ...item, ...formData } : item
          )
        );
        await updateProductType(editingId, updatedData);
        toast.success("Cập nhật thành công!", { id: loadingToast });
      } else {
        const newItem = await createProductType(formData);
        setProductTypes((prev) => [...prev, newItem]);
        toast.success("Tạo mới thành công!", { id: loadingToast });
      }
      closeDialog();
    } catch (error) {
      console.error("Error submitting form:", error);
      let errorMessage = "Có lỗi xảy ra!";
      if (error.response?.data) {
        errorMessage =
          error.response.data.error ||
          error.response.data.message ||
          error.response.data.detail ||
          JSON.stringify(error.response.data);
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage, { id: loadingToast, duration: 5000 });
      if (editingId) fetchProductTypes();
    }
  };

  const closeDialog = () => {
    setFormData({ productTypeName: "", fee: false });
    setShowDialog(false);
    setEditingId(null);
  };

  const openCreateDialog = () => {
    setEditingId(null);
    setFormData({ productTypeName: "", fee: false });
    setShowDialog(true);
  };

  const handleEdit = (item) => {
    setFormData({
      productTypeName: item.productTypeName,
      fee: item.fee,
    });
    setEditingId(item.productTypeId);
    setShowDialog(true);
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      setProductTypes((prev) =>
        prev.filter((item) => item.productTypeId !== deleteId)
      );
      await deleteProductType(deleteId);
      toast.success("Xóa thành công!");
    } catch (error) {
      console.error("Error deleting:", error);
      let errorMessage = "Có lỗi xảy ra khi xóa!";
      if (error.response?.data) {
        errorMessage =
          error.response.data.error ||
          error.response.data.message ||
          error.response.data.detail ||
          "Có lỗi xảy ra khi xóa!";
      }
      toast.error(errorMessage, { duration: 5000 });
      fetchProductTypes();
    } finally {
      setDeleteLoading(false);
      setShowDeleteDialog(false);
      setDeleteId(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const filteredProductTypes = productTypes.filter((item) => {
    const matchesSearch = item.productTypeName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFee =
      filterFee === "all" ||
      (filterFee === "free" && !item.fee) ||
      (filterFee === "paid" && item.fee);
    return matchesSearch && matchesFee;
  });

  const stats = {
    total: productTypes.length,
    free: productTypes.filter((item) => !item.fee).length,
    paid: productTypes.filter((item) => item.fee).length,
  };

  // ---------- SKELETONS ----------
  const TableSkeletonRows = () =>
    [...Array(6)].map((_, i) => (
      <tr key={i} className="animate-pulse">
        <td className="px-3 py-2">
          <div className="h-3 w-56 bg-gray-200 rounded" />
        </td>
        <td className="px-3 py-2 text-center">
          <div className="h-5 w-16 bg-gray-200 rounded mx-auto" />
        </td>
        <td className="px-3 py-2">
          <div className="h-8 w-28 bg-gray-200 rounded mx-auto" />
        </td>
      </tr>
    ));

  const GridSkeletonCards = () =>
    [...Array(8)].map((_, i) => (
      <div
        key={i}
        className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 animate-pulse"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="h-6 w-28 bg-gray-200 rounded" />
          <div className="h-5 w-14 bg-gray-200 rounded" />
        </div>
        <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-1/2 bg-gray-200 rounded mb-3" />
        <div className="flex gap-2 pt-2 border-t border-gray-100">
          <div className="h-8 w-full bg-gray-200 rounded" />
          <div className="h-8 w-full bg-gray-200 rounded" />
        </div>
      </div>
    ));

  const renderTableContent = () => {
    if (loading) return <TableSkeletonRows />;

    if (filteredProductTypes.length === 0) {
      return (
        <tr>
          <td colSpan="3" className="px-4 py-8">
            <div className="flex flex-col items-center justify-center">
              <div className="p-2 bg-gray-100 rounded mb-2">
                <FiBox className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm font-semibold text-gray-900 mb-1">
                {searchTerm || filterFee !== "all"
                  ? "Không tìm thấy"
                  : "Chưa có dữ liệu"}
              </p>
              <p className="text-xs text-gray-500 mb-3">
                {searchTerm || filterFee !== "all"
                  ? "Thử thay đổi bộ lọc"
                  : "Nhấn nút thêm để bắt đầu"}
              </p>
              {!searchTerm && filterFee === "all" && (
                <button
                  onClick={openCreateDialog}
                  className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-xs font-semibold shadow-sm transition-all"
                >
                  <FiPlus className="w-4 h-4" />
                  Thêm ngay
                </button>
              )}
            </div>
          </td>
        </tr>
      );
    }

    return filteredProductTypes.map((item, index) => (
      <tr
        key={item.productTypeId}
        className={`transition-all hover:bg-blue-50/50 ${
          index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
        }`}
      >
        <td className="px-3 py-2">
          <p className="font-semibold text-gray-900 text-sm">
            {item.productTypeName}
          </p>
        </td>
        <td className="px-3 py-2 text-center">
          {item.fee ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
              <FiDollarSign className="w-3 h-3" />
              Có phí
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
              <FiCheck className="w-3 h-3" />
              Miễn phí
            </span>
          )}
        </td>
        <td className="px-3 py-2">
          <div className="flex items-center justify-center gap-1.5">
            <button
              onClick={() => handleEdit(item)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-md shadow-sm transition-all"
            >
              <FiEdit2 className="w-3 h-3" />
              Sửa
            </button>
            <button
              onClick={() => handleDelete(item.productTypeId)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-md shadow-sm transition-all"
            >
              <FiTrash2 className="w-3 h-3" />
              Xóa
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  const renderGridView = () => {
    if (loading) return <GridSkeletonCards />;

    if (filteredProductTypes.length === 0) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center py-8">
          <div className="p-2 bg-gray-100 rounded mb-2">
            <FiBox className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm font-semibold text-gray-900 mb-1">
            {searchTerm || filterFee !== "all"
              ? "Không tìm thấy"
              : "Chưa có dữ liệu"}
          </p>
          <p className="text-xs text-gray-500">
            {searchTerm || filterFee !== "all"
              ? "Thử thay đổi bộ lọc"
              : "Nhấn nút thêm để bắt đầu"}
          </p>
        </div>
      );
    }

    return filteredProductTypes.map((item) => (
      <div
        key={item.productTypeId}
        className="bg-white rounded-lg border border-gray-200 hover:border-blue-400 shadow-sm hover:shadow-md transition-all overflow-hidden"
      >
        <div className="p-3">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-100 rounded">
                <FiPackage className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            {item.fee ? (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
                <FiDollarSign className="w-3 h-3" />
                Có phí
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                <FiCheck className="w-3 h-3" />
                Miễn phí
              </span>
            )}
          </div>

          <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">
            {item.productTypeName}
          </h3>

          <div className="flex items-center gap-1.5 pt-2 border-t border-gray-100">
            <button
              onClick={() => handleEdit(item)}
              className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-md shadow-sm transition-all"
            >
              <FiEdit2 className="w-3 h-3" />
              Sửa
            </button>
            <button
              onClick={() => handleDelete(item.productTypeId)}
              className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-md shadow-sm transition-all"
            >
              <FiTrash2 className="w-3 h-3" />
              Xóa
            </button>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
          {/* Header */}
          <div className="mb-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3">
              <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                Quản lý Loại Sản Phẩm
              </h1>

              <button
                onClick={openCreateDialog}
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-semibold shadow-sm transition-all"
              >
                <FiPlus className="w-4 h-4" />
                Thêm mới
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-white rounded-md p-3 shadow-sm border border-gray-200">
                <p className="text-[11px] font-medium text-gray-600">Tổng</p>
                <p className="text-lg font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-white rounded-md p-3 shadow-sm border border-gray-200">
                <p className="text-[11px] font-medium text-gray-600">
                  Miễn phí
                </p>
                <p className="text-lg font-bold text-emerald-600">
                  {stats.free}
                </p>
              </div>
              <div className="bg-white rounded-md p-3 shadow-sm border border-gray-200">
                <p className="text-[11px] font-medium text-gray-600">Có phí</p>
                <p className="text-lg font-bold text-amber-600">{stats.paid}</p>
              </div>
            </div>

            {/* Search & Filter */}
            <div className="bg-white rounded-md shadow-sm border border-gray-200 p-3">
              <div className="flex flex-col lg:flex-row gap-2">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <select
                      value={filterFee}
                      onChange={(e) => setFilterFee(e.target.value)}
                      className="pl-9 pr-6 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer"
                    >
                      <option value="all">Tất cả</option>
                      <option value="free">Miễn phí</option>
                      <option value="paid">Có phí</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1 bg-gray-100 rounded-md p-0.5">
                    <button
                      onClick={() => setViewMode("table")}
                      className={`p-1.5 rounded ${
                        viewMode === "table"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <FiList className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 rounded ${
                        viewMode === "grid"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <FiGrid className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {(searchTerm || filterFee !== "all") && (
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
                  <span className="text-xs font-medium text-gray-600">
                    Bộ lọc:
                  </span>
                  {searchTerm && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      "{searchTerm}"
                      <button onClick={() => setSearchTerm("")}>
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filterFee !== "all" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                      {filterFee === "free" ? "Miễn phí" : "Có phí"}
                      <button onClick={() => setFilterFee("all")}>
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          {viewMode === "table" ? (
            <div className="bg-white shadow-sm rounded-md border border-gray-200 overflow-hidden relative">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-3 py-2 text-left text-[11px] font-bold text-gray-700 uppercase">
                        Tên loại
                      </th>
                      <th className="px-3 py-2 text-center text-[11px] font-bold text-gray-700 uppercase">
                        Phí
                      </th>
                      <th className="px-3 py-2 text-center text-[11px] font-bold text-gray-700 uppercase">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {renderTableContent()}
                  </tbody>
                </table>
              </div>

              {deleteLoading && (
                <div className="absolute inset-0 bg-white/90 flex items-center justify-center backdrop-blur-sm rounded-md">
                  <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-200 border-t-red-600"></div>
                    <span className="text-red-600 text-xs font-semibold">
                      Đang xóa...
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {renderGridView()}
            </div>
          )}

          {!loading && filteredProductTypes.length > 0 && (
            <div className="mt-3 text-center">
              <p className="text-xs text-gray-600">
                Hiển thị{" "}
                <span className="font-bold">{filteredProductTypes.length}</span>{" "}
                / <span className="font-bold">{stats.total}</span> loại
              </p>
            </div>
          )}
        </div>

        {/* Modal */}
        {showDialog && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="bg-blue-600 text-white p-3 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white/20 rounded">
                      <FiBox className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold">
                      {editingId ? "Cập nhật" : "Thêm mới"}
                    </h3>
                  </div>
                  <button
                    onClick={closeDialog}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-4">
                <div className="mb-3">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Tên loại sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiPackage className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      name="productTypeName"
                      value={formData.productTypeName}
                      onChange={handleInputChange}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="VD: Điện tử, Thời trang..."
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Trạng thái phí <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label
                      className={`flex flex-col items-center p-2.5 border-2 rounded-md cursor-pointer transition-all ${
                        !formData.fee
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="feeOption"
                        checked={!formData.fee}
                        onChange={() =>
                          setFormData((prev) => ({ ...prev, fee: false }))
                        }
                        className="sr-only"
                      />
                      <div
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center mb-1.5 ${
                          !formData.fee
                            ? "border-emerald-500 bg-emerald-500"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        <FiCheck
                          className={`w-4 h-4 ${
                            !formData.fee ? "text-white" : "text-transparent"
                          }`}
                        />
                      </div>
                      <span
                        className={`text-[11px] font-bold ${
                          !formData.fee ? "text-emerald-700" : "text-gray-600"
                        }`}
                      >
                        Miễn phí
                      </span>
                    </label>

                    <label
                      className={`flex flex-col items-center p-2.5 border-2 rounded-md cursor-pointer transition-all ${
                        formData.fee
                          ? "border-yellow-500 bg-yellow-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="feeOption"
                        checked={formData.fee}
                        onChange={() =>
                          setFormData((prev) => ({ ...prev, fee: true }))
                        }
                        className="sr-only"
                      />
                      <div
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center mb-1.5 ${
                          formData.fee
                            ? "border-yellow-500 bg-yellow-500"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        <FiDollarSign
                          className={`w-4 h-4 ${
                            formData.fee ? "text-white" : "text-transparent"
                          }`}
                        />
                      </div>
                      <span
                        className={`text-[11px] font-bold ${
                          formData.fee ? "text-yellow-700" : "text-gray-600"
                        }`}
                      >
                        Có phí
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeDialog}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-semibold transition-all"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-all"
                  >
                    <FiCheck className="w-4 h-4" />
                    {editingId ? "Cập nhật" : "Lưu"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => {
            setShowDeleteDialog(false);
            setDeleteId(null);
          }}
          onConfirm={confirmDelete}
          title="Xác nhận xóa"
          message="Bạn có chắc chắn muốn xóa loại sản phẩm này không?"
          confirmText="Xóa"
          cancelText="Hủy"
          loading={deleteLoading}
          type="danger"
        />
      </div>
    </>
  );
};

export default ManagerProductType;
