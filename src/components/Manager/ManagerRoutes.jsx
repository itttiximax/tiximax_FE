import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import managerRoutesService from "../../Services/Manager/managerRoutesService";

const ManagerRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
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
      setLoading(true);
      const data = await managerRoutesService.getRoutes();
      setRoutes(data);
    } catch (err) {
      console.error("Error:", err);
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
      const submitData = {
        name: formData.name,
        shipTime: formData.shipTime,
        unitBuyingPrice: Number(formData.unitBuyingPrice) || 0,
        unitDepositPrice: Number(formData.unitDepositPrice) || 0,
        exchangeRate: Number(formData.exchangeRate) || 0,
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

        // Add to list immediately
        setRoutes((prev) => [...prev, newItem]);
        toast.success("Tạo mới thành công!", { id: loadingToast });
      }

      resetForm();
    } catch (err) {
      console.error("Error:", err);
      toast.error("Có lỗi xảy ra!", { id: loadingToast });

      // Revert optimistic update if needed
      if (editingId) {
        fetchRoutes();
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      shipTime: "",
      unitBuyingPrice: "",
      unitDepositPrice: "",
      exchangeRate: "",
      note: "",
    });
    setShowForm(false);
    setEditingId(null);
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
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tuyến này?")) {
      const loadingToast = toast.loading("Đang xóa...");

      try {
        // Optimistic delete
        setRoutes((prev) => prev.filter((item) => item.routeId !== id));

        await managerRoutesService.deleteRoute(id);
        toast.success("Xóa thành công!", { id: loadingToast });
      } catch (err) {
        console.error("Error deleting:", err);
        toast.error("Có lỗi xảy ra khi xóa!", { id: loadingToast });

        // Revert optimistic delete
        fetchRoutes();
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Đang tải...</div>
      </div>
    );

  return (
    <div className="p-4">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            style: {
              background: "#10b981",
            },
          },
          error: {
            style: {
              background: "#ef4444",
            },
          },
        }}
      />

      <h1 className="text-2xl font-bold mb-4">Quản lý Tuyến Vận Chuyển</h1>

      {/* Add button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4 transition-colors"
      >
        {showForm ? "Hủy" : "Thêm mới"}
      </button>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded mb-4">
          <h3 className="text-lg font-medium mb-3">
            {editingId ? "Sửa tuyến vận chuyển" : "Thêm mới tuyến vận chuyển"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">
                Tên tuyến: *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">
                Thời gian vận chuyển: *
              </label>
              <input
                type="text"
                name="shipTime"
                value={formData.shipTime}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="VD: 7-10 ngày"
                required
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">
                Đơn giá mua (đ):
              </label>
              <input
                type="number"
                name="unitBuyingPrice"
                value={formData.unitBuyingPrice}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">
                Đơn giá đặt cọc (đ):
              </label>
              <input
                type="number"
                name="unitDepositPrice"
                value={formData.unitDepositPrice}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Tỷ giá:</label>
              <input
                type="number"
                name="exchangeRate"
                value={formData.exchangeRate}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Ghi chú:</label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Nhập ghi chú..."
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
            >
              {editingId ? "Cập nhật" : "Lưu"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Tên tuyến</th>
              <th className="border border-gray-300 px-4 py-2">Thời gian</th>
              <th className="border border-gray-300 px-4 py-2">Đơn giá mua</th>
              <th className="border border-gray-300 px-4 py-2">
                Đơn giá đặt cọc
              </th>
              <th className="border border-gray-300 px-4 py-2">Tỷ giá</th>
              <th className="border border-gray-300 px-4 py-2">Ghi chú</th>
              <th className="border border-gray-300 px-4 py-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {routes.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="border border-gray-300 px-4 py-8 text-center text-gray-500"
                >
                  Chưa có dữ liệu
                </td>
              </tr>
            ) : (
              routes.map((item) => (
                <tr key={item.routeId} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {item.routeId}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 font-medium">
                    {item.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {item.shipTime}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-right">
                    {item.unitBuyingPrice
                      ? formatCurrency(item.unitBuyingPrice)
                      : "-"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-right">
                    {item.unitDepositPrice
                      ? formatCurrency(item.unitDepositPrice)
                      : "-"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-right">
                    {item.exchangeRate
                      ? formatCurrency(item.exchangeRate)
                      : "-"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.note || "Không có"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(item.routeId)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerRoutes;
