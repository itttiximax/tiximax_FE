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
  const [formData, setFormData] = useState({
    websiteName: "",
  });

  useEffect(() => {
    fetchWebsites();
  }, []);

  const fetchWebsites = async () => {
    try {
      const data = await websiteService.getAllWebsite(token);
      setWebsites(data);
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

  const handleDelete = async (id) => {
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

    if (websites.length === 0) {
      return (
        <tr>
          <td colSpan="3" className="px-6 py-20 text-center text-gray-500">
            <FiGlobe className="w-16 h-16 text-gray-400 mb-4 mx-auto" />
            <p className="text-xl font-medium mb-2">Chưa có dữ liệu website</p>
            <p className="text-sm text-gray-400 mb-6">
              Nhấn "Thêm website mới" để bắt đầu
            </p>
            <button
              onClick={openCreateDialog}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl mx-auto"
            >
              <FiPlus className="w-5 h-5" />
              Thêm website mới
            </button>
          </td>
        </tr>
      );
    }

    return websites.map((item) => (
      <tr key={item.websiteId} className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 text-sm font-medium text-gray-900">
          #{item.websiteId}
        </td>
        <td className="px-6 py-4 font-medium text-gray-900">
          <div className="flex items-center gap-2">
            <FiGlobe className="w-4 h-4 text-gray-500" />
            {item.websiteName}
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
              onClick={() => handleDelete(item.websiteId)}
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
          Quản lý Website
        </h1>
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

      <div className="bg-white rounded-xl shadow-lg overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Tên website
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
          <div className="absolute inset-x-0 bottom-0 bg-white bg-opacity-75 flex items-center justify-center py-8 rounded-b-xl">
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
                  {editingId ? "Cập nhật website" : "Thêm website mới"}
                </h3>
              </div>
              <button
                onClick={closeDialog}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên website <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="websiteName"
                  value={formData.websiteName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="VD: Shopee, Lazada, Tiki..."
                  required
                />
              </div>

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
