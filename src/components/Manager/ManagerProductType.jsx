import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiCheck,
  FiBox,
  FiAlertTriangle,
} from "react-icons/fi";
import {
  getAllProductTypes,
  createProductType,
  updateProductType,
  deleteProductType,
} from "../../Services/Manager/managerProductTypeService";

const ManagerProductType = () => {
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
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
    } catch (err) {
      // Bắt lỗi từ backend
      const errorMessage =
        err?.response?.data?.error || err?.message || "Có lỗi xảy ra!";
      toast.error(errorMessage, { id: loadingToast });

      // Rollback optimistic update nếu cần
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
    } catch {
      toast.error("Có lỗi xảy ra khi xóa!");
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

  if (productTypes.length === 0 && !loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <Toaster position="top-right" />
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Quản lý Loại Sản Phẩm
          </h1>
          <p className="text-gray-600">Quản lý thông tin các loại sản phẩm</p>
        </div>
        <div className="mb-6">
          <button
            onClick={openCreateDialog}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <FiPlus className="w-5 h-5" />
            Thêm
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-12 text-center text-gray-500">
          <FiBox className="w-12 h-12 text-gray-400 mb-4 mx-auto" />
          <p className="text-lg">Chưa có dữ liệu loại sản phẩm</p>
          <p className="text-sm text-gray-400 mt-1">
            Nhấn "Thêm loại sản phẩm mới" để bắt đầu
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white-50 min-h-screen">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Quản lý Loại Sản Phẩm
        </h1>
      </div>

      {/* Add button */}
      <div className="mb-6">
        <button
          onClick={openCreateDialog}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <FiPlus className="w-5 h-5" />
          Thêm
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Tên loại sản phẩm
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  Phí
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-3 text-gray-600">
                        Đang tải dữ liệu...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                productTypes.map((item) => (
                  <tr
                    key={item.productTypeId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      #{item.productTypeId}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <FiBox className="w-4 h-4 text-gray-500" />
                        {item.productTypeName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.fee ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Có phí
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Miễn phí
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-lg transition-all hover:scale-105"
                          title="Chỉnh sửa"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.productTypeId)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all hover:scale-105"
                          title="Xóa"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Loading overlay chỉ ở phía dưới table */}
        {deleteLoading && (
          <div className="absolute inset-x-0 bottom-0 bg-white bg-opacity-75 flex items-center justify-center py-8 rounded-b-xl">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
              <span className="text-red-600 font-medium">Đang xóa...</span>
            </div>
          </div>
        )}
      </div>

      {/* Dialog Modal */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingId
                    ? "Cập nhật loại sản phẩm"
                    : "Thêm loại sản phẩm mới"}
                </h3>
              </div>
              <button
                onClick={closeDialog}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên loại sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="productTypeName"
                  value={formData.productTypeName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="VD: Điện tử, Thời trang, Gia dụng..."
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Trạng thái phí
                </label>
                <div className="flex gap-4">
                  {/* Miễn phí option */}
                  <label
                    className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      !formData.fee
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="relative">
                      <input
                        type="radio"
                        name="feeOption"
                        value="false"
                        checked={!formData.fee}
                        onChange={() =>
                          setFormData((prev) => ({ ...prev, fee: false }))
                        }
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          !formData.fee
                            ? "border-green-500 bg-green-500"
                            : "border-gray-300"
                        }`}
                      >
                        {!formData.fee && (
                          <FiCheck className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        !formData.fee ? "text-green-700" : "text-gray-600"
                      }`}
                    >
                      Miễn phí
                    </span>
                  </label>

                  {/* Có phí option */}
                  <label
                    className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.fee
                        ? "border-yellow-500 bg-yellow-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="relative">
                      <input
                        type="radio"
                        name="feeOption"
                        value="true"
                        checked={formData.fee}
                        onChange={() =>
                          setFormData((prev) => ({ ...prev, fee: true }))
                        }
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          formData.fee
                            ? "border-yellow-500 bg-yellow-500"
                            : "border-gray-300"
                        }`}
                      >
                        {formData.fee && (
                          <FiCheck className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        formData.fee ? "text-yellow-700" : "text-gray-600"
                      }`}
                    >
                      Có phí
                    </span>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Chọn trạng thái phí cho loại sản phẩm này
                </p>
              </div>

              {/* Footer */}
              <div className="flex gap-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <FiCheck className="w-4 h-4" />
                  {editingId ? "Cập nhật" : "Lưu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="flex items-center gap-4 p-6 border-b">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <FiAlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Xác nhận xóa
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Hành động này không thể hoàn tác
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-700">
                Bạn có chắc chắn muốn xóa loại sản phẩm này không? Tất cả dữ
                liệu liên quan sẽ bị xóa vĩnh viễn.
              </p>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t bg-gray-50 rounded-b-2xl">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteDialog(false);
                  setDeleteId(null);
                }}
                disabled={deleteLoading}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleteLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Đang xóa...
                  </>
                ) : (
                  <>
                    <FiTrash2 className="w-4 h-4" />
                    Xác nhận xóa
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerProductType;
