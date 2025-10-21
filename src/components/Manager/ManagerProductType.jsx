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
        const updatedData = {
          productTypeId: editingId,
          ...formData,
        };

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

      toast.error(errorMessage, {
        id: loadingToast,
        duration: 5000,
      });

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

  const renderTableContent = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="4" className="px-4 py-8">
            <div className="flex flex-col items-center justify-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-600"></div>
              </div>
              <span className="mt-2 text-gray-600 text-sm">Đang tải...</span>
            </div>
          </td>
        </tr>
      );
    }

    if (filteredProductTypes.length === 0) {
      return (
        <tr>
          <td colSpan="4" className="px-4 py-12">
            <div className="flex flex-col items-center justify-center">
              <div className="p-3 bg-gray-100 rounded-lg mb-3">
                <FiBox className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-base font-bold text-gray-900 mb-1">
                {searchTerm || filterFee !== "all"
                  ? "Không tìm thấy"
                  : "Chưa có dữ liệu"}
              </p>
              <p className="text-xs text-gray-500 mb-4">
                {searchTerm || filterFee !== "all"
                  ? "Thử thay đổi bộ lọc"
                  : "Nhấn nút thêm để bắt đầu"}
              </p>
              {!searchTerm && filterFee === "all" && (
                <button
                  onClick={openCreateDialog}
                  className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all"
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
        <td className="px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                {item.productTypeName}
              </p>
            </div>
          </div>
        </td>
        <td className="px-4 py-2.5 text-center">
          {item.fee ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-100 to-yellow-100 text-yellow-700 border border-yellow-200">
              <FiDollarSign className="w-3 h-3" />
              Có phí
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border border-emerald-200">
              <FiCheck className="w-3 h-3" />
              Miễn phí
            </span>
          )}
        </td>
        <td className="px-4 py-2.5">
          <div className="flex items-center justify-center gap-1.5">
            <button
              onClick={() => handleEdit(item)}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <FiEdit2 className="w-3 h-3" />
              Sửa
            </button>
            <button
              onClick={() => handleDelete(item.productTypeId)}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow-md transition-all"
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
    if (loading) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-600"></div>
          <span className="mt-2 text-gray-600 text-sm">Đang tải...</span>
        </div>
      );
    }

    if (filteredProductTypes.length === 0) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center py-12">
          <div className="p-3 bg-gray-100 rounded-lg mb-3">
            <FiBox className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-base font-bold text-gray-900 mb-1">
            {searchTerm || filterFee !== "all"
              ? "Không tìm thấy"
              : "Chưa có dữ liệu"}
          </p>
          <p className="text-xs text-gray-500 mb-4">
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
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg">
                <FiPackage className="w-4 h-4 text-blue-600" />
              </div>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                #{item.productTypeId}
              </span>
            </div>
            {item.fee ? (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-100 to-yellow-100 text-yellow-700 border border-yellow-200">
                <FiDollarSign className="w-3 h-3" />
                Có phí
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border border-emerald-200">
                <FiCheck className="w-3 h-3" />
                Miễn phí
              </span>
            )}
          </div>

          <h3 className="text-sm font-bold text-gray-900 mb-3 line-clamp-2">
            {item.productTypeName}
          </h3>

          <div className="flex items-center gap-1.5 pt-3 border-t border-gray-100">
            <button
              onClick={() => handleEdit(item)}
              className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <FiEdit2 className="w-3 h-3" />
              Sửa
            </button>
            <button
              onClick={() => handleDelete(item.productTypeId)}
              className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow-md transition-all"
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
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-1">
                  <div className="p-1.5 bg-gradient-to-br from-blue-600 to-blue-600 rounded-lg shadow-md">
                    <FiBox className="h-5 w-5 text-white" />
                  </div>
                  Quản lý Loại Sản Phẩm
                </h1>
              </div>

              <button
                onClick={openCreateDialog}
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <FiPlus className="w-4 h-4" />
                Thêm mới
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-0.5">
                      Tổng
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {stats.total}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:shadow-md hover:border-emerald-300 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-0.5">
                      Miễn phí
                    </p>
                    <p className="text-xl font-bold text-emerald-600">
                      {stats.free}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:shadow-md hover:border-amber-300 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-0.5">
                      Có phí
                    </p>
                    <p className="text-xl font-bold text-amber-600">
                      {stats.paid}
                    </p>
                  </div>
                  <div className="p-2 bg-gradient-to-br from-amber-100 to-yellow-200 rounded-lg">
                    <FiDollarSign className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Search & Filter */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <select
                      value={filterFee}
                      onChange={(e) => setFilterFee(e.target.value)}
                      className="pl-9 pr-6 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer transition-all"
                    >
                      <option value="all">Tất cả</option>
                      <option value="free">Miễn phí</option>
                      <option value="paid">Có phí</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
                    <button
                      onClick={() => setViewMode("table")}
                      className={`p-1.5 rounded transition-all ${
                        viewMode === "table"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <FiList className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 rounded transition-all ${
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
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden relative">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-700 uppercase">
                        Tên loại
                      </th>
                      <th className="px-4 py-2.5 text-center text-xs font-bold text-gray-700 uppercase">
                        Phí
                      </th>
                      <th className="px-4 py-2.5 text-center text-xs font-bold text-gray-700 uppercase">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {renderTableContent()}
                  </tbody>
                </table>
              </div>

              {deleteLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center backdrop-blur-sm rounded-lg">
                  <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-red-200 border-t-red-600"></div>
                    <span className="text-red-600 text-sm font-semibold">
                      Đang xóa...
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {renderGridView()}
            </div>
          )}

          {!loading && filteredProductTypes.length > 0 && (
            <div className="mt-4 text-center">
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
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-blue-600 to-blue-600 text-white p-4 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white bg-opacity-20 rounded-lg">
                      <FiBox className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold">
                        {editingId ? "Cập nhật" : "Thêm mới"}
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={closeDialog}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-4">
                <div className="mb-4">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Tên loại sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiPackage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      name="productTypeName"
                      value={formData.productTypeName}
                      onChange={handleInputChange}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="VD: Điện tử, Thời trang..."
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-bold text-gray-700 mb-2">
                    Trạng thái phí <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label
                      className={`flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        !formData.fee
                          ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-green-50 shadow-md"
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
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-2 ${
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
                        className={`text-xs font-bold ${
                          !formData.fee ? "text-emerald-700" : "text-gray-600"
                        }`}
                      >
                        Miễn phí
                      </span>
                    </label>

                    <label
                      className={`flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.fee
                          ? "border-yellow-500 bg-gradient-to-br from-yellow-50 to-amber-50 shadow-md"
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
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-2 ${
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
                        className={`text-xs font-bold ${
                          formData.fee ? "text-yellow-700" : "text-gray-600"
                        }`}
                      >
                        Có phí
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeDialog}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all"
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
