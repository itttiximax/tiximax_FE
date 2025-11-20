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
  const [formData, setFormData] = useState({ destinationName: "" });
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
      if (editingId) fetchDestinations();
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
      if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
    },
    [formErrors]
  );

  // Skeleton rows (3 cột)
  const SkeletonRows = () =>
    [...Array(6)].map((_, i) => (
      <tr key={i} className="animate-pulse">
        <td className="px-4 py-3">
          <div className="h-4 w-12 bg-slate-100 rounded" />
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-slate-100 rounded-full" />
            <div className="h-4 w-48 bg-slate-100 rounded" />
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="h-8 w-24 bg-slate-100 rounded mx-auto" />
        </td>
      </tr>
    ));

  const renderTableContent = () => {
    if (loading) return <SkeletonRows />;

    if (destinations.length === 0) {
      return (
        <tr>
          <td colSpan={3} className="px-4 py-10 text-center text-slate-500">
            <FiMapPin className="w-12 h-12 text-slate-300 mb-3 mx-auto" />
            <p className="text-sm font-medium mb-1">Chưa có dữ liệu điểm đến</p>
            <button
              onClick={openCreateDialog}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all inline-flex items-center gap-1 shadow-sm"
            >
              <FiPlus className="w-4 h-4" />
              Thêm điểm đến
            </button>
          </td>
        </tr>
      );
    }

    return destinations.map((item) => (
      <tr
        key={item.destinationId}
        className="hover:bg-slate-50 transition-colors"
      >
        <td className="px-4 py-3 text-sm font-medium text-slate-900 whitespace-nowrap">
          #{item.destinationId}
        </td>
        <td className="px-4 py-3 font-medium text-slate-900">
          <div className="flex items-center gap-2">
            <FiMapPin className="w-4 h-4 text-slate-500" />
            <span className="text-sm">{item.destinationName}</span>
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center justify-center gap-1.5">
            <button
              onClick={() => handleEdit(item)}
              className="inline-flex items-center justify-center p-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 transition-all"
              title="Chỉnh sửa"
            >
              <FiEdit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(item.destinationId)}
              className="inline-flex items-center justify-center p-1.5 rounded-lg bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 transition-all"
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
    <div className="min-h-screen p-4 md:p-6 ">
      <Toaster position="top-right" />

      <div className="mx-auto space-y-6">
        {/* Header card xanh – đồng bộ */}
        <div className="border border-blue-400 bg-blue-600 text-white rounded-xl px-5 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
              <FiMapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-semibold">
                Quản lý điểm đến
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={openCreateDialog}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-blue-300 bg-white/10 hover:bg-white/20 shadow-sm"
              disabled={loading}
            >
              <FiPlus className="w-4 h-4" />
              Thêm điểm đến
            </button>
          </div>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                    Tên điểm đến
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {renderTableContent()}
              </tbody>
            </table>
          </div>

          {deleteLoading && (
            <div className="absolute inset-x-0 bottom-0 bg-white/85 flex items-center justify-center py-4 rounded-b-xl border-t border-red-100">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600" />
                <span className="text-red-600 text-xs font-medium">
                  Đang xóa...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dialog form */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {editingId ? "Cập nhật điểm đến" : "Thêm điểm đến mới"}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {editingId
                    ? "Chỉnh sửa thông tin điểm đến hiện có."
                    : "Nhập tên điểm đến mới để sử dụng trong cấu hình tuyến."}
                </p>
              </div>
              <button
                onClick={closeDialog}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded hover:bg-slate-100"
                disabled={submitLoading}
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-5 py-4 text-sm">
              <div className="mb-4">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Tên điểm đến <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="destinationName"
                  value={formData.destinationName}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all ${
                    formErrors.destinationName
                      ? "border border-red-500 bg-red-50"
                      : "border border-slate-200"
                  }`}
                  placeholder="VD: Hà Nội, TP.HCM, Đà Nẵng..."
                  required
                  disabled={submitLoading}
                />
                {formErrors.destinationName && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FiAlertTriangle className="w-4 h-4" />
                    {formErrors.destinationName}
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={closeDialog}
                  disabled={submitLoading}
                  className="flex-1 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-xs font-medium transition-colors border border-slate-200 disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors inline-flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  {submitLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
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
