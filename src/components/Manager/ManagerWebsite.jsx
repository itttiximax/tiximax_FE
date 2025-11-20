import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiCheck,
  FiGlobe,
} from "react-icons/fi";
import websiteService from "../../Services/SharedService/websiteService";
import ConfirmDialog from "../../common/ConfirmDialog";

const ManagerWebsite = ({ token }) => {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ websiteName: "" });

  useEffect(() => {
    fetchWebsites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchWebsites = async () => {
    try {
      setLoading(true);
      const data = await websiteService.getAllWebsite(token);
      setWebsites(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Có lỗi khi tải dữ liệu!");
      setWebsites([]);
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
        // optimistic update
        setWebsites((prev) =>
          prev.map((item) =>
            item.websiteId === editingId ? { ...item, ...formData } : item
          )
        );
        await websiteService.updateWebsite(editingId, formData, token);
        toast.success("Cập nhật thành công!", { id: loadingToast });
      } else {
        const newItem = await websiteService.createWebsite(formData, token);
        setWebsites((prev) => [...prev, newItem]);
        toast.success("Tạo mới thành công!", { id: loadingToast });
      }
      closeDialog();
    } catch (error) {
      let errorMessage = "Có lỗi xảy ra!";
      if (error?.response?.data) {
        errorMessage =
          error.response.data.error ||
          error.response.data.message ||
          error.response.data.detail ||
          JSON.stringify(error.response.data);
      } else if (error?.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage, { id: loadingToast, duration: 5000 });
      if (editingId) fetchWebsites();
    }
  };

  const closeDialog = () => {
    setFormData({ websiteName: "" });
    setShowDialog(false);
    setEditingId(null);
  };

  const openCreateDialog = () => {
    setEditingId(null);
    setFormData({ websiteName: "" });
    setShowDialog(true);
  };

  const handleEdit = (item) => {
    setFormData({ websiteName: item.websiteName });
    setEditingId(item.websiteId);
    setShowDialog(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      setWebsites((prev) => prev.filter((item) => item.websiteId !== deleteId));
      await websiteService.deleteWebsite(deleteId, token);
      toast.success("Xóa thành công!");
    } catch (error) {
      let errorMessage = "Có lỗi xảy ra khi xóa!";
      if (error?.response?.data) {
        errorMessage =
          error.response.data.error ||
          error.response.data.message ||
          error.response.data.detail ||
          "Có lỗi xảy ra khi xóa!";
      }
      toast.error(errorMessage, { duration: 5000 });
      fetchWebsites();
    } finally {
      setDeleteLoading(false);
      setShowDeleteDialog(false);
      setDeleteId(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ---------- Loading Skeleton cho bảng ----------
  const TableSkeletonRows = () =>
    [...Array(6)].map((_, i) => (
      <tr key={i} className="animate-pulse">
        <td className="px-3 py-2">
          <div className="h-3 w-16 bg-slate-100 rounded" />
        </td>
        <td className="px-3 py-2">
          <div className="h-3 w-40 bg-slate-100 rounded" />
        </td>
        <td className="px-3 py-2">
          <div className="h-8 w-24 bg-slate-100 rounded mx-auto" />
        </td>
      </tr>
    ));

  const renderTableContent = () => {
    if (loading) return <TableSkeletonRows />;

    if (websites.length === 0) {
      return (
        <tr>
          <td colSpan="3" className="px-4 py-10 text-center text-slate-500">
            <FiGlobe className="w-10 h-10 text-slate-300 mb-2 mx-auto" />
            <p className="text-sm font-medium mb-1">Chưa có dữ liệu website</p>

            <button
              onClick={openCreateDialog}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-md text-sm font-semibold transition-all inline-flex items-center gap-1.5 shadow-sm"
            >
              <FiPlus className="w-4 h-4" />
              Thêm website mới
            </button>
          </td>
        </tr>
      );
    }

    return websites.map((item, idx) => (
      <tr
        key={item.websiteId}
        className={`transition-colors hover:bg-slate-50 ${
          idx % 2 ? "bg-white" : "bg-slate-50/40"
        }`}
      >
        <td className="px-3 py-2 text-xs font-semibold text-slate-900">
          #{item.websiteId}
        </td>
        <td className="px-3 py-2">
          <div className="flex items-center gap-2 text-sm text-slate-900">
            <FiGlobe className="w-4 h-4 text-slate-500" />
            <span className="font-medium">{item.websiteName}</span>
          </div>
        </td>
        <td className="px-3 py-2">
          <div className="flex items-center justify-center gap-1.5">
            <button
              onClick={() => handleEdit(item)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-md transition-all shadow-sm"
              title="Chỉnh sửa"
            >
              <FiEdit2 className="w-3.5 h-3.5" />
              Sửa
            </button>
            <button
              onClick={() => handleDelete(item.websiteId)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-md transition-all shadow-sm"
              title="Xóa"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
              Xóa
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <div className="min-h-screen  p-4 md:p-6">
      <Toaster
        position="top-right"
        toastOptions={{ style: { fontSize: "12px" } }}
      />

      <div className="mx-auto space-y-5">
        {/* Header card xanh – đồng bộ với các màn Manager khác */}
        <div className="border border-blue-400 bg-blue-600 text-white rounded-xl px-5 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
              <FiGlobe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-semibold">
                Quản lý Website
              </h1>
            </div>
          </div>

          <button
            onClick={openCreateDialog}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-blue-300 bg-white/10 hover:bg-white/20 text-white shadow-sm"
          >
            <FiPlus className="w-4 h-4" />
            Thêm website mới
          </button>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 relative">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2 text-left text-[11px] font-semibold text-slate-700 uppercase">
                    ID
                  </th>
                  <th className="px-3 py-2 text-left text-[11px] font-semibold text-slate-700 uppercase">
                    Tên website
                  </th>
                  <th className="px-3 py-2 text-center text-[11px] font-semibold text-slate-700 uppercase">
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
            <div className="absolute inset-x-0 bottom-0 bg-white/85 flex items-center justify-center py-6 rounded-b-xl">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-600 border-t-transparent" />
                <span className="text-red-600 text-sm font-semibold">
                  Đang xóa...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FiGlobe className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-slate-900">
                  {editingId ? "Cập nhật website" : "Thêm website mới"}
                </h3>
              </div>
              <button
                onClick={closeDialog}
                className="text-slate-400 hover:text-slate-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4 text-sm">
              <div>
                <label className="block text-[12px] font-medium text-slate-700 mb-1 uppercase">
                  Tên website <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="websiteName"
                  value={formData.websiteName}
                  onChange={handleInputChange}
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
                  placeholder="VD: Shopee, Lazada, Tiki..."
                  required
                />
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center justify-center gap-1.5"
                >
                  <FiCheck className="w-4 h-4" />
                  {editingId ? "Cập nhật" : "Lưu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm delete */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setDeleteId(null);
        }}
        onConfirm={confirmDelete}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa website này không? Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn."
        confirmText="Xác nhận xóa"
        cancelText="Hủy"
        loading={deleteLoading}
        type="danger"
      />
    </div>
  );
};

export default ManagerWebsite;
