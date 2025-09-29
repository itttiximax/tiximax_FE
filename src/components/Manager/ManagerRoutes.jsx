import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiCheck,
  FiFileText,
  FiRefreshCw,
} from "react-icons/fi";
import managerRoutesService from "../../Services/Manager/managerRoutesService";
import ConfirmDialog from "../../common/ConfirmDialog";

const ManagerRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [updateRatesLoading, setUpdateRatesLoading] = useState(false); // NEW
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    shipTime: "",
    unitBuyingPrice: "",
    unitDepositPrice: "",
    exchangeRate: "",
    note: "",
  });

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const data = await managerRoutesService.getRoutes();
      setRoutes(data);
    } catch {
      toast.error("Có lỗi khi tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  // NEW: Hàm cập nhật tỷ giá cho tất cả routes
  const handleUpdateExchangeRates = async () => {
    setUpdateRatesLoading(true);
    const loadingToast = toast.loading("Đang cập nhật tỷ giá...");

    try {
      await managerRoutesService.updateExchangeRates();
      toast.success("Cập nhật tỷ giá thành công!", { id: loadingToast });

      // Refresh lại danh sách routes để hiển thị tỷ giá mới
      await fetchRoutes();
    } catch (error) {
      console.error("Error updating exchange rates:", error);

      let errorMessage = "Có lỗi xảy ra khi cập nhật tỷ giá!";

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
    } finally {
      setUpdateRatesLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loadingToast = toast.loading(
      editingId ? "Đang cập nhật..." : "Đang tạo mới..."
    );

    try {
      const submitData = {
        name: formData.name,
        shipTime: formData.shipTime,
        unitBuyingPrice: Number(formData.unitBuyingPrice) || 0,
        unitDepositPrice: Number(formData.unitDepositPrice) || 0,
        exchangeRate: Number(formData.exchangeRate) || 0,
        note: formData.note,
      };

      if (editingId) {
        setRoutes((prev) =>
          prev.map((item) =>
            item.routeId === editingId ? { ...item, ...submitData } : item
          )
        );
        await managerRoutesService.updateRoute(editingId, submitData);
        toast.success("Cập nhật thành công!", { id: loadingToast });
      } else {
        const newItem = await managerRoutesService.createRoute(submitData);
        setRoutes((prev) => [...prev, newItem]);
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

      if (editingId) fetchRoutes();
    }
  };

  const closeDialog = () => {
    setFormData({
      name: "",
      shipTime: "",
      unitBuyingPrice: "",
      unitDepositPrice: "",
      exchangeRate: "",
      note: "",
    });
    setShowDialog(false);
    setEditingId(null);
  };

  const openCreateDialog = () => {
    setEditingId(null);
    setFormData({
      name: "",
      shipTime: "",
      unitBuyingPrice: "",
      unitDepositPrice: "",
      exchangeRate: "",
      note: "",
    });
    setShowDialog(true);
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      shipTime: item.shipTime,
      unitBuyingPrice: item.unitBuyingPrice || "",
      unitDepositPrice: item.unitDepositPrice || "",
      exchangeRate: item.exchangeRate || "",
      note: item.note || "",
    });
    setEditingId(item.routeId);
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
      setRoutes((prev) => prev.filter((item) => item.routeId !== deleteId));
      await managerRoutesService.deleteRoute(deleteId);
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
      fetchRoutes();
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

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN").format(amount);

  const renderTableContent = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="8" className="px-6 py-12">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
            </div>
          </td>
        </tr>
      );
    }

    if (routes.length === 0) {
      return (
        <tr>
          <td colSpan="8" className="px-6 py-20 text-center text-gray-500">
            <FiFileText className="w-16 h-16 text-gray-400 mb-4 mx-auto" />
            <p className="text-xl font-medium mb-2">
              Chưa có dữ liệu tuyến vận chuyển
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Nhấn "Thêm tuyến mới" để bắt đầu
            </p>
            <button
              onClick={openCreateDialog}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl mx-auto"
            >
              <FiPlus className="w-5 h-5" />
              Thêm tuyến mới
            </button>
          </td>
        </tr>
      );
    }

    return routes.map((item) => (
      <tr key={item.routeId} className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 text-sm font-medium text-gray-900">
          #{item.routeId}
        </td>
        <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
        <td className="px-6 py-4 text-sm text-gray-700">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {item.shipTime}
          </span>
        </td>
        <td className="px-6 py-4 text-sm text-right text-gray-900 font-mono">
          {item.unitBuyingPrice ? formatCurrency(item.unitBuyingPrice) : "-"}
        </td>
        <td className="px-6 py-4 text-sm text-right text-gray-900 font-mono">
          {item.unitDepositPrice ? formatCurrency(item.unitDepositPrice) : "-"}
        </td>
        <td className="px-6 py-4 text-sm text-right text-gray-900 font-mono">
          {item.exchangeRate ? formatCurrency(item.exchangeRate) : "-"}
        </td>
        <td className="px-6 py-4 font-medium text-gray-900">
          <div className="max-w-xs truncate" title={item.note}>
            {item.note || "Không có"}
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
              onClick={() => handleDelete(item.routeId)}
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
          Quản lý Tuyến Vận Chuyển
        </h1>
      </div>

      {/* UPDATED: Thêm button Cập nhật tỷ giá */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={openCreateDialog}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <FiPlus className="w-5 h-5" />
          Thêm
        </button>

        <button
          onClick={handleUpdateExchangeRates}
          disabled={updateRatesLoading || loading}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {updateRatesLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Đang cập nhật...</span>
            </>
          ) : (
            <>
              <FiRefreshCw className="w-5 h-5" />
              <span>Cập nhật tỷ giá</span>
            </>
          )}
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
                  Mã tỷ giá
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Thời gian
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  Đơn giá mua hộ
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  Đơn giá ký gửi
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  Tỷ giá
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Tên tuyến
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingId
                    ? "Cập nhật tuyến vận chuyển"
                    : "Thêm tuyến vận chuyển mới"}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã tỷ giá<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="VD: JPY - USD"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời gian vận chuyển <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="shipTime"
                    value={formData.shipTime}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="VD: 7-10 ngày"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đơn giá mua hộ (VNĐ)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="unitBuyingPrice"
                    value={formData.unitBuyingPrice}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đơn giá ký gửi (VNĐ)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="unitDepositPrice"
                    value={formData.unitDepositPrice}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tỷ giá<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="exchangeRate"
                    value={formData.exchangeRate}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên tuyến<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Nhập tên tuyến vận chuyển..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8 pt-6 border-t">
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
        message="Bạn có chắc chắn muốn xóa tuyến vận chuyển này không? Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn."
        confirmText="Xác nhận xóa"
        cancelText="Hủy"
        loading={deleteLoading}
        type="danger"
      />
    </div>
  );
};

export default ManagerRoutes;
