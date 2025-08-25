import React, { useEffect, useState } from "react";
import routesService from "../../Services/LeadSale/routesService";

const ManagerRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null); // xem chi tiết
  const [editRoute, setEditRoute] = useState(null); // sửa
  const [formData, setFormData] = useState({
    name: "",
    shipTime: "",
    unitShippingPrice: "",
    note: "",
  });

  // Lấy token từ localStorage
  const token = localStorage.getItem("token");

  const fetchRoutes = async () => {
    if (!token) return; // không có token thì không gọi API
    try {
      const data = await routesService.getRoutes(token);
      setRoutes(data);
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!token) return;
    if (!window.confirm("Bạn có chắc muốn xóa tuyến này?")) return;
    try {
      await routesService.deleteRoute(token, id);
      fetchRoutes();
    } catch (error) {
      console.error("Error deleting route:", error);
    }
  };

  const handleViewDetail = async (id) => {
    if (!token) return;
    try {
      const detail = await routesService.getRouteById(token, id);
      setSelectedRoute(detail);
    } catch (error) {
      console.error("Error fetching route detail:", error);
    }
  };

  const handleEdit = (route) => {
    setEditRoute(route);
    setFormData({
      name: route.name,
      shipTime: route.shipTime,
      unitShippingPrice: route.unitShippingPrice,
      note: route.note || "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!token) return;
    try {
      await routesService.updateRoute(token, editRoute.routeId, formData);
      setEditRoute(null);
      setFormData({ name: "", shipTime: "", unitShippingPrice: "", note: "" });
      fetchRoutes();
    } catch (error) {
      console.error("Error updating route:", error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!token) return;
    try {
      await routesService.createRoute(token, {
        ...formData,
        unitShippingPrice: Number(formData.unitShippingPrice),
      });
      setFormData({ name: "", shipTime: "", unitShippingPrice: "", note: "" });
      fetchRoutes();
    } catch (error) {
      console.error("Error creating route:", error);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Danh sách tuyến</h2>

      {/* Form thêm mới */}
      {!editRoute && (
        <form
          onSubmit={handleCreate}
          className="mb-6 bg-white border rounded-xl shadow p-4"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Thêm tuyến mới
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Tên tuyến
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="border rounded w-full p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Thời gian (ngày)
              </label>
              <input
                type="number"
                value={formData.shipTime}
                onChange={(e) =>
                  setFormData({ ...formData, shipTime: e.target.value })
                }
                className="border rounded w-full p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Đơn giá (đ)
              </label>
              <input
                type="number"
                value={formData.unitShippingPrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    unitShippingPrice: e.target.value,
                  })
                }
                className="border rounded w-full p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ghi chú</label>
              <input
                type="text"
                value={formData.note}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
                className="border rounded w-full p-2"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
            >
              Thêm
            </button>
          </div>
        </form>
      )}

      {/* Form sửa */}
      {editRoute && (
        <form
          onSubmit={handleUpdate}
          className="mb-6 bg-white border rounded-xl shadow p-4"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Chỉnh sửa tuyến: {editRoute.name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* same input fields as above */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Tên tuyến
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="border rounded w-full p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Thời gian (ngày)
              </label>
              <input
                type="number"
                value={formData.shipTime}
                onChange={(e) =>
                  setFormData({ ...formData, shipTime: e.target.value })
                }
                className="border rounded w-full p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Đơn giá (đ)
              </label>
              <input
                type="number"
                value={formData.unitShippingPrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    unitShippingPrice: e.target.value,
                  })
                }
                className="border rounded w-full p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ghi chú</label>
              <input
                type="text"
                value={formData.note}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
                className="border rounded w-full p-2"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
            >
              Lưu
            </button>
            <button
              type="button"
              onClick={() => {
                setEditRoute(null);
                setFormData({
                  name: "",
                  shipTime: "",
                  unitShippingPrice: "",
                  note: "",
                });
              }}
              className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded"
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      {/* Hiển thị chi tiết */}
      {selectedRoute && (
        <div className="mb-6 bg-white border rounded-xl shadow p-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Chi tiết tuyến: {selectedRoute.name}
          </h3>
          <p>
            <span className="font-medium">Thời gian: </span>
            {selectedRoute.shipTime} ngày
          </p>
          <p>
            <span className="font-medium">Đơn giá: </span>
            {selectedRoute.unitShippingPrice.toLocaleString()} đ
          </p>
          <p>
            <span className="font-medium">Ghi chú: </span>
            {selectedRoute.note || "Không có"}
          </p>
          <button
            onClick={() => setSelectedRoute(null)}
            className="mt-3 bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Danh sách */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {routes.map((route) => (
          <div
            key={route.routeId}
            className="bg-white shadow rounded-2xl p-4 border hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {route.name}
            </h3>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Thời gian: </span>
              {route.shipTime} ngày
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Đơn giá: </span>
              {route.unitShippingPrice.toLocaleString()} đ
            </p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleViewDetail(route.routeId)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              >
                Xem
              </button>
              <button
                onClick={() => handleEdit(route)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
              >
                Sửa
              </button>
              <button
                onClick={() => handleDelete(route.routeId)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerRoutes;
