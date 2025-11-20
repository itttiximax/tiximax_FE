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
  const [updateRatesLoading, setUpdateRatesLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // ✅ Thêm differenceRate & updateAuto cho đúng API
  const [formData, setFormData] = useState({
    name: "",
    shipTime: "",
    unitBuyingPrice: "",
    unitDepositPrice: "",
    exchangeRate: "",
    differenceRate: "",
    updateAuto: false,
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

  // Cập nhật tỷ giá cho tất cả routes
  const handleUpdateExchangeRates = async () => {
    setUpdateRatesLoading(true);
    const loadingToast = toast.loading("Đang cập nhật tỷ giá...");

    try {
      await managerRoutesService.updateExchangeRates();
      toast.success("Cập nhật tỷ giá thành công!", { id: loadingToast });
      await fetchRoutes();
    } catch (error) {
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
      toast.error(errorMessage, { id: loadingToast, duration: 5000 });
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
      // ✅ Chuẩn payload đúng API mới
      const submitData = {
        name: formData.name,
        shipTime: formData.shipTime, // API đang nhận string -> giữ nguyên
        unitBuyingPrice: Number(formData.unitBuyingPrice) || 0,
        unitDepositPrice: Number(formData.unitDepositPrice) || 0,
        exchangeRate: Number(formData.exchangeRate) || 0,
        differenceRate: Number(formData.differenceRate) || 0,
        updateAuto: !!formData.updateAuto,
        note: formData.note,
      };

      if (editingId) {
        // Optimistic update
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
      differenceRate: "",
      updateAuto: false,
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
      differenceRate: "",
      updateAuto: false,
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
      differenceRate: item.differenceRate ?? "",
      updateAuto: item.updateAuto ?? false,
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

  // ✅ riêng checkbox updateAuto
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN").format(amount);

  // ===== Loading Skeleton Rows (8) =====
  const SkeletonRows = () =>
    [...Array(8)].map((_, idx) => (
      <tr key={idx} className="animate-pulse">
        <td className="px-3 py-2">
          <div className="h-3 w-10 bg-gray-200 rounded" />
        </td>
        <td className="px-3 py-2">
          <div className="h-3 w-24 bg-gray-200 rounded" />
        </td>
        <td className="px-3 py-2">
          <div className="h-5 w-20 bg-gray-200 rounded-full" />
        </td>
        <td className="px-3 py-2">
          <div className="h-3 w-24 bg-gray-200 rounded ml-auto" />
        </td>
        <td className="px-3 py-2">
          <div className="h-3 w-24 bg-gray-200 rounded ml-auto" />
        </td>
        <td className="px-3 py-2">
          <div className="h-3 w-20 bg-gray-200 rounded ml-auto" />
        </td>
        <td className="px-3 py-2">
          <div className="h-3 w-40 bg-gray-200 rounded" />
        </td>
        <td className="px-3 py-2">
          <div className="h-8 w-20 bg-gray-200 rounded mx-auto" />
        </td>
      </tr>
    ));

  return (
    <div className="p-4 bg-white-50 min-h-screen">
      <Toaster position="top-right" />

      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-800">
          Quản lý Tuyến Vận Chuyển
        </h1>
      </div>

      {/* Actions (compact) */}
      <div className="mb-4 flex items-center gap-2">
        <button
          onClick={openCreateDialog}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-1 shadow-sm"
        >
          <FiPlus className="w-4 h-4" />
          Thêm
        </button>

        <button
          onClick={handleUpdateExchangeRates}
          disabled={updateRatesLoading || loading}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {updateRatesLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Đang cập nhật...</span>
            </>
          ) : (
            <>
              <FiRefreshCw className="w-4 h-4" />
              <span>Cập nhật tỷ giá</span>
            </>
          )}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">
                  Mã tỷ giá
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">
                  Thời gian
                </th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 uppercase">
                  ĐG mua hộ
                </th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 uppercase">
                  ĐG ký gửi
                </th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 uppercase">
                  Tỷ giá
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">
                  Tên tuyến
                </th>
                <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700 uppercase">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 text-sm">
              {loading ? (
                <SkeletonRows />
              ) : routes.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-4 py-10 text-center text-gray-500"
                  >
                    <FiFileText className="w-12 h-12 text-gray-400 mb-3 mx-auto" />
                    <p className="text-base font-medium mb-1">
                      Chưa có dữ liệu tuyến vận chuyển
                    </p>
                    <p className="text-xs text-gray-400 mb-3">
                      Nhấn "Thêm" để bắt đầu
                    </p>
                    <button
                      onClick={openCreateDialog}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 inline-flex items-center gap-1 shadow-sm"
                    >
                      <FiPlus className="w-4 h-4" />
                      Thêm tuyến mới
                    </button>
                  </td>
                </tr>
              ) : (
                routes.map((item) => (
                  <tr
                    key={item.routeId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap">
                      {item.name}
                    </td>
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-100 text-blue-800">
                        {item.shipTime}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right text-gray-900 font-mono">
                      {item.unitBuyingPrice
                        ? formatCurrency(item.unitBuyingPrice)
                        : "-"}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-900 font-mono">
                      {item.unitDepositPrice
                        ? formatCurrency(item.unitDepositPrice)
                        : "-"}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-900 font-mono">
                      {item.exchangeRate
                        ? formatCurrency(item.exchangeRate)
                        : "-"}
                    </td>
                    <td className="px-3 py-2">
                      <div className="max-w-xs truncate" title={item.note}>
                        {item.note || "Không có"}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-amber-500 hover:bg-amber-600 text-white p-1.5 rounded-md transition-all"
                          title="Chỉnh sửa"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.routeId)}
                          className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-md transition-all"
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

        {deleteLoading && (
          <div className="absolute inset-x-0 bottom-0 bg-white/80 flex items-center justify-center py-6 rounded-b-lg">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
              <span className="text-red-600 text-sm font-medium">
                Đang xóa...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Dialog nhỏ gọn */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-base font-semibold text-gray-900">
                {editingId
                  ? "Cập nhật tuyến vận chuyển"
                  : "Thêm tuyến vận chuyển mới"}
              </h3>
              <button
                onClick={closeDialog}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Mã tỷ giá<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="VD: JPY - VNĐ"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Thời gian vận chuyển <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="shipTime"
                    value={formData.shipTime}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="VD: 7-10 ngày"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Đơn giá mua hộ (VNĐ)
                  </label>
                  <input
                    type="number"
                    name="unitBuyingPrice"
                    value={formData.unitBuyingPrice}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Đơn giá ký gửi (VNĐ)
                  </label>
                  <input
                    type="number"
                    name="unitDepositPrice"
                    value={formData.unitDepositPrice}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Tỷ giá
                  </label>
                  <input
                    type="number"
                    name="exchangeRate"
                    value={formData.exchangeRate}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>

                {/* ✅ Tỷ giá chênh */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Tỷ giá chênh (VNĐ)
                  </label>
                  <input
                    type="number"
                    name="differenceRate"
                    value={formData.differenceRate}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Tên tuyến
                  </label>
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập tên tuyến vận chuyển..."
                    rows={3}
                  />
                </div>

                {/* ✅ Checkbox updateAuto */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
                    <input
                      type="checkbox"
                      name="updateAuto"
                      checked={formData.updateAuto}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    Tự động cập nhật tỷ giá cho mã này
                  </label>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Nếu bật, hệ thống sẽ tự cập nhật tỷ giá dựa trên nguồn tỷ
                    giá chung (API backend).
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mt-5 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center justify-center gap-1"
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
