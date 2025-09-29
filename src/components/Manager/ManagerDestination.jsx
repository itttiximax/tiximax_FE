import { useState, useEffect, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiCheck,
  FiMapPin,
  FiAlertTriangle,
} from "react-icons/fi";
import managerDestinationService from "../../Services/Manager/managerDestinationService";
import ConfirmDialog from "../../common/ConfirmDialog";

const ManagerDestination = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    destinationName: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const data = await managerDestinationService.getDestinations();
      setDestinations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching destinations:", error);
      toast.error("Có lỗi khi tải dữ liệu!");
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.destinationName.trim()) {
      errors.destinationName = "Tên điểm đến là bắt buộc";
    } else if (formData.destinationName.trim().length < 2) {
      errors.destinationName = "Tên điểm đến phải có ít nhất 2 ký tự";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra thông tin nhập vào!");
      return;
    }

    setSubmitLoading(true);
    const loadingToast = toast.loading(
      editingId ? "Đang cập nhật..." : "Đang tạo mới..."
    );

    try {
      if (editingId) {
        await managerDestinationService.updateDestination(editingId, formData);
        setDestinations((prev) =>
          prev.map((item) =>
            item.destinationId === editingId ? { ...item, ...formData } : item
          )
        );
        toast.success("Cập nhật thành công!", { id: loadingToast });
      } else {
        const newItem = await managerDestinationService.createDestination(
          formData
        );
        setDestinations((prev) => [...prev, newItem]);
        toast.success("Tạo mới thành công!", { id: loadingToast });
      }

      closeDialog();
    } catch (error) {
      console.error("Error submitting form:", error);

      // Lấy error message từ BE
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

      if (editingId) {
        fetchDestinations();
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const closeDialog = useCallback(() => {
    setFormData({ destinationName: "" });
    setFormErrors({});
    setShowDialog(false);
    setEditingId(null);
    setSubmitLoading(false);
  }, []);

  const openCreateDialog = useCallback(() => {
    setEditingId(null);
    setFormData({ destinationName: "" });
    setFormErrors({});
    setShowDialog(true);
  }, []);

  const handleEdit = useCallback((item) => {
    setFormData({ destinationName: item.destinationName });
    setEditingId(item.destinationId);
    setFormErrors({});
    setShowDialog(true);
  }, []);

  const handleDelete = useCallback(async (id) => {
    setDeleteId(id);
    setShowDeleteDialog(true);
  }, []);

  const confirmDelete = async () => {
    if (!deleteId) return;

    setDeleteLoading(true);

    try {
      await managerDestinationService.deleteDestination(deleteId);
      setDestinations((prev) =>
        prev.filter((item) => item.destinationId !== deleteId)
      );
      toast.success("Xóa thành công!");
    } catch (error) {
      console.error("Error deleting destination:", error);

      let errorMessage = "Có lỗi xảy ra khi xóa!";

      if (error.response?.data) {
        errorMessage =
          error.response.data.error ||
          error.response.data.message ||
          error.response.data.detail ||
          "Có lỗi xảy ra khi xóa!";
      }

      toast.error(errorMessage, { duration: 5000 });
      fetchDestinations();
    } finally {
      setDeleteLoading(false);
      setShowDeleteDialog(false);
      setDeleteId(null);
    }
  };

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (formErrors[name]) {
        setFormErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [formErrors]
  );

  const renderTableContent = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="3" className="px-6 py-12">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
            </div>
          </td>
        </tr>
      );
    }

    if (destinations.length === 0) {
      return (
        <tr>
          <td colSpan="3" className="px-6 py-20 text-center text-gray-500">
            <FiMapPin className="w-16 h-16 text-gray-400 mb-4 mx-auto" />
            <p className="text-xl font-medium mb-2">Chưa có dữ liệu điểm đến</p>
            <p className="text-sm text-gray-400 mb-6">
              Nhấn "Thêm điểm đến mới" để bắt đầu
            </p>
            <button
              onClick={openCreateDialog}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl mx-auto"
            >
              <FiPlus className="w-5 h-5" />
              Thêm
            </button>
          </td>
        </tr>
      );
    }

    return destinations.map((item) => (
      <tr
        key={item.destinationId}
        className="hover:bg-gray-50 transition-colors"
      >
        <td className="px-6 py-4 text-sm font-medium text-gray-900">
          #{item.destinationId}
        </td>
        <td className="px-6 py-4 font-medium text-gray-900">
          <div className="flex items-center gap-2">
            <FiMapPin className="w-4 h-4 text-gray-500" />
            {item.destinationName}
          </div>
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
              onClick={() => handleDelete(item.destinationId)}
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all hover:scale-105"
              title="Xóa"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <div className="p-6 bg-white-50 min-h-screen">
      <Toaster position="top-right" />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Quản lý Điểm Đến
        </h1>
      </div>

      <div className="mb-6">
        <button
          onClick={openCreateDialog}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
          disabled={loading}
        >
          <FiPlus className="w-5 h-5" />
          Thêm
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Tên điểm đến
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {renderTableContent()}
            </tbody>
          </table>
        </div>

        {deleteLoading && (
          <div className="absolute inset-x-0 bottom-0 bg-white bg-opacity-90 flex items-center justify-center py-8 rounded-b-xl">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
              <span className="text-red-600 font-medium">Đang xóa...</span>
            </div>
          </div>
        )}
      </div>

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingId ? "Cập nhật điểm đến" : "Thêm điểm đến mới"}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {editingId
                    ? "Chỉnh sửa thông tin điểm đến"
                    : "Nhập thông tin điểm đến mới"}
                </p>
              </div>
              <button
                onClick={closeDialog}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={submitLoading}
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên điểm đến <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="destinationName"
                  value={formData.destinationName}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    formErrors.destinationName
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="VD: Hà Nội, TP.HCM, Đà Nẵng..."
                  required
                  disabled={submitLoading}
                />
                {formErrors.destinationName && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <FiAlertTriangle className="w-4 h-4" />
                    {formErrors.destinationName}
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={closeDialog}
                  disabled={submitLoading}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {editingId ? "Đang cập nhật..." : "Đang tạo..."}
                    </>
                  ) : (
                    <>
                      <FiCheck className="w-4 h-4" />
                      {editingId ? "Cập nhật" : "Lưu"}
                    </>
                  )}
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
        message="Bạn có chắc chắn muốn xóa điểm đến này không? Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn."
        confirmText="Xác nhận xóa"
        cancelText="Hủy"
        loading={deleteLoading}
        type="danger"
      />
    </div>
  );
};

export default ManagerDestination;
