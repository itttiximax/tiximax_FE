import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import routesService from "../../Services/LeadSale/routesService";

const ManagerRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    shipTime: "",
    unitShippingPrice: "",
    note: "",
  });

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const data = await routesService.getRoutes();
      setRoutes(data);
    } catch (err) {
      console.error("Error:", err);
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
          ...formData,
          shipTime: Number(formData.shipTime),
          unitShippingPrice: Number(formData.unitShippingPrice),
        };

        // Optimistic update
        setRoutes((prev) =>
          prev.map((item) =>
            item.routeId === editingId ? { ...item, ...updatedData } : item
          )
        );

        await routesService.updateRoute(editingId, updatedData);
        toast.success("Cập nhật thành công!", { id: loadingToast });
      } else {
        const newItemData = {
          ...formData,
          shipTime: Number(formData.shipTime),
          unitShippingPrice: Number(formData.unitShippingPrice),
        };

        const newItem = await routesService.createRoute(newItemData);

        // Add to list immediately
        setRoutes((prev) => [...prev, newItem]);
        toast.success("Tạo mới thành công!", { id: loadingToast });
      }

      setFormData({ name: "", shipTime: "", unitShippingPrice: "", note: "" });
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      console.error("Error:", err);
      toast.error("Có lỗi xảy ra!", { id: loadingToast });

      // Revert optimistic update if needed
      if (editingId) {
        fetchRoutes();
      }
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      shipTime: item.shipTime,
      unitShippingPrice: item.unitShippingPrice,
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

        await routesService.deleteRoute(id);
        toast.success("Xóa thành công!", { id: loadingToast });
      } catch (err) {
        console.error("Error deleting:", err);
        toast.error("Có lỗi xảy ra khi xóa!", { id: loadingToast });

        // Revert optimistic delete
        fetchRoutes();
      }
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", shipTime: "", unitShippingPrice: "", note: "" });
    setShowForm(false);
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) return <div>Đang tải...</div>;

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
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        {showForm ? "Hủy" : "Thêm mới"}
      </button>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded mb-4">
          <h3 className="text-lg font-medium mb-3">
            {editingId ? "Sửa tuyến vận chuyển" : "Thêm mới tuyến vận chuyển"}
          </h3>

          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Tên tuyến:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Thời gian vận chuyển (ngày):
            </label>
            <input
              type="number"
              name="shipTime"
              value={formData.shipTime}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
              min="1"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Đơn giá vận chuyển (đ):
            </label>
            <input
              type="number"
              name="unitShippingPrice"
              value={formData.unitShippingPrice}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
              min="0"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Ghi chú:</label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              rows="3"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              {editingId ? "Cập nhật" : "Lưu"}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Tên tuyến</th>
            <th className="border border-gray-300 px-4 py-2">
              Thời gian (ngày)
            </th>
            <th className="border border-gray-300 px-4 py-2">Đơn giá (đ)</th>
            <th className="border border-gray-300 px-4 py-2">Ghi chú</th>
            <th className="border border-gray-300 px-4 py-2">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((item) => (
            <tr key={item.routeId}>
              <td className="border border-gray-300 px-4 py-2">
                {item.routeId}
              </td>
              <td className="border border-gray-300 px-4 py-2">{item.name}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {item.shipTime}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-right">
                {item.unitShippingPrice.toLocaleString()}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {item.note || "Không có"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(item.routeId)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Xóa
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagerRoutes;
