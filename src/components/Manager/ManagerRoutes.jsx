import React, { useEffect, useState } from "react";
import {
  Truck,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Clock,
  DollarSign,
  FileText,
  X,
  Save,
  AlertTriangle,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import routesService from "../../Services/LeadSale/routesService";

const ManagerRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [editRoute, setEditRoute] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("view"); // 'view', 'edit', 'create'
  const [formData, setFormData] = useState({
    name: "",
    shipTime: "",
    unitShippingPrice: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");

  const fetchRoutes = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await routesService.getRoutes(token);
      setRoutes(data);
      toast.success("Đã tải danh sách tuyến vận chuyển");
    } catch (error) {
      console.error("Error fetching routes:", error);
      toast.error("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, routeName) => {
    if (!token) return;

    const confirmToast = toast.custom(
      (t) => (
        <div className="bg-white border border-red-200 shadow-lg rounded-xl p-4 max-w-md">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="text-red-500" size={20} />
            <h3 className="font-semibold text-gray-800">Xác nhận xóa</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Bạn có chắc muốn xóa tuyến <strong>"{routeName}"</strong>?
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                toast.dismiss(t.id);
              }}
              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                setLoading(true);
                try {
                  await routesService.deleteRoute(token, id);
                  await fetchRoutes();
                  toast.success(`Đã xóa tuyến "${routeName}"`);
                } catch (error) {
                  console.error("Error deleting route:", error);
                  toast.error("Lỗi khi xóa tuyến");
                } finally {
                  setLoading(false);
                }
              }}
              className="px-3 py-1.5 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Xóa
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  const handleViewDetail = async (id) => {
    if (!token) return;
    setLoading(true);
    try {
      const detail = await routesService.getRouteById(token, id);
      setSelectedRoute(detail);
      setDialogMode("view");
      setShowDialog(true);
    } catch (error) {
      console.error("Error fetching route detail:", error);
      toast.error("Lỗi khi tải chi tiết");
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (route) => {
    setEditRoute(route);
    setFormData({
      name: route.name,
      shipTime: route.shipTime,
      unitShippingPrice: route.unitShippingPrice,
      note: route.note || "",
    });
    setDialogMode("edit");
    setShowDialog(true);
  };

  const openCreateDialog = () => {
    setFormData({ name: "", shipTime: "", unitShippingPrice: "", note: "" });
    setDialogMode("create");
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setSelectedRoute(null);
    setEditRoute(null);
    setFormData({ name: "", shipTime: "", unitShippingPrice: "", note: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    const loadingToast = toast.loading(
      dialogMode === "create" ? "Đang tạo tuyến mới..." : "Đang cập nhật..."
    );

    setLoading(true);
    try {
      if (dialogMode === "create") {
        await routesService.createRoute(token, {
          ...formData,
          unitShippingPrice: Number(formData.unitShippingPrice),
        });
        toast.success("Tạo tuyến mới thành công!", { id: loadingToast });
      } else {
        await routesService.updateRoute(token, editRoute.routeId, formData);
        toast.success("Cập nhật tuyến thành công!", { id: loadingToast });
      }

      closeDialog();
      await fetchRoutes();
    } catch (error) {
      console.error("Error saving route:", error);
      toast.error("Có lỗi xảy ra khi lưu", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const filteredRoutes = routes.filter(
    (route) =>
      route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.note?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchRoutes();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#374151",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      {/* Header */}
      <div className="mb-8 bg-white rounded-2xl shadow-xl p-6 backdrop-blur-sm bg-opacity-80">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white">
              <Truck size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Quản lý Tuyến Vận Chuyển
              </h1>
              <p className="text-gray-600 mt-1">
                Quản lý các tuyến logistics và vận chuyển
              </p>
            </div>
          </div>

          <button
            onClick={openCreateDialog}
            className="group flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Plus
              size={18}
              className="group-hover:rotate-90 transition-transform duration-200"
            />
            <span>Thêm Tuyến Mới</span>
          </button>
        </div>

        {/* Search */}
        <div className="mt-6">
          <div className="relative max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm tuyến..."
              className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin opacity-0"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl text-white">
              <Truck size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {routes.length}
              </p>
              <p className="text-sm text-gray-600">Tổng tuyến</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {routes.length > 0
                  ? Math.round(
                      routes.reduce((acc, route) => acc + route.shipTime, 0) /
                        routes.length
                    )
                  : 0}
              </p>
              <p className="text-sm text-gray-600">Thời gian TB (ngày)</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl text-white">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {routes.length > 0
                  ? (
                      routes.reduce(
                        (acc, route) => acc + route.unitShippingPrice,
                        0
                      ) /
                      routes.length /
                      1000
                    ).toFixed(0) + "K"
                  : "0"}
              </p>
              <p className="text-sm text-gray-600">Đơn giá TB (đ)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 bg-white rounded-xl px-6 py-4 shadow-lg">
            <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <span className="text-gray-600 font-medium">
              Đang tải dữ liệu...
            </span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredRoutes.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck size={24} className="text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {routes.length === 0
                ? "Chưa có tuyến vận chuyển"
                : "Không tìm thấy tuyến nào"}
            </h3>
            <p className="text-gray-600 mb-4">
              {routes.length === 0
                ? "Hãy tạo tuyến vận chuyển đầu tiên của bạn"
                : `Không có tuyến nào khớp với "${searchTerm}"`}
            </p>
            {routes.length === 0 && (
              <button
                onClick={openCreateDialog}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
              >
                Tạo Tuyến Đầu Tiên
              </button>
            )}
          </div>
        </div>
      )}

      {/* Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoutes.map((route, index) => (
          <div
            key={route.routeId}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group transform hover:scale-[1.02]"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: "slideInUp 0.6s ease-out forwards",
            }}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
                    <Truck size={18} className="text-blue-600" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition-colors">
                    {route.name}
                  </h3>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock size={16} className="text-blue-500" />
                  <span className="text-sm">
                    <span className="font-medium">{route.shipTime}</span> ngày
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign size={16} className="text-green-500" />
                  <span className="text-sm">
                    <span className="font-medium">
                      {route.unitShippingPrice.toLocaleString()}
                    </span>{" "}
                    đ
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <FileText size={16} className="text-purple-500" />
                  <span className="text-sm truncate">
                    {route.note || "Không có ghi chú"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleViewDetail(route.routeId)}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                >
                  <Eye size={14} />
                  <span>Xem</span>
                </button>

                <button
                  onClick={() => openEditDialog(route)}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-600 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                >
                  <Edit2 size={14} />
                  <span>Sửa</span>
                </button>

                <button
                  onClick={() => handleDelete(route.routeId, route.name)}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  {dialogMode === "view" && (
                    <Eye size={20} className="text-blue-600" />
                  )}
                  {dialogMode === "edit" && (
                    <Edit2 size={20} className="text-amber-600" />
                  )}
                  {dialogMode === "create" && (
                    <Plus size={20} className="text-green-600" />
                  )}

                  {dialogMode === "view" && `Chi tiết: ${selectedRoute?.name}`}
                  {dialogMode === "edit" && `Chỉnh sửa: ${editRoute?.name}`}
                  {dialogMode === "create" && "Thêm Tuyến Mới"}
                </h3>
                <button
                  onClick={closeDialog}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-6">
              {dialogMode === "view" && selectedRoute && (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center gap-3">
                        <Clock size={18} className="text-blue-500" />
                        <div>
                          <p className="text-sm text-gray-600">
                            Thời gian vận chuyển
                          </p>
                          <p className="font-semibold text-gray-800">
                            {selectedRoute.shipTime} ngày
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <DollarSign size={18} className="text-green-500" />
                        <div>
                          <p className="text-sm text-gray-600">
                            Đơn giá vận chuyển
                          </p>
                          <p className="font-semibold text-gray-800">
                            {selectedRoute.unitShippingPrice.toLocaleString()} đ
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <FileText
                          size={18}
                          className="text-purple-500 mt-0.5"
                        />
                        <div>
                          <p className="text-sm text-gray-600">Ghi chú</p>
                          <p className="font-semibold text-gray-800">
                            {selectedRoute.note || "Không có ghi chú"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditDialog(selectedRoute)}
                      className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white py-2 px-4 rounded-xl font-medium hover:from-amber-600 hover:to-orange-700 transition-all duration-200"
                    >
                      Chỉnh Sửa
                    </button>
                    <button
                      onClick={closeDialog}
                      className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl font-medium transition-colors"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              )}

              {(dialogMode === "edit" || dialogMode === "create") && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tên tuyến *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                      placeholder="Nhập tên tuyến vận chuyển"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Thời gian vận chuyển (ngày) *
                    </label>
                    <input
                      type="number"
                      value={formData.shipTime}
                      onChange={(e) =>
                        setFormData({ ...formData, shipTime: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                      min={1}
                      placeholder="Số ngày vận chuyển"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Đơn giá vận chuyển (đ) *
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
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                      min={0}
                      placeholder="Đơn giá vận chuyển"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ghi chú
                    </label>
                    <textarea
                      value={formData.note}
                      onChange={(e) =>
                        setFormData({ ...formData, note: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                      rows={3}
                      placeholder="Ghi chú thêm về tuyến vận chuyển"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save size={16} />
                      <span>
                        {dialogMode === "create" ? "Tạo Tuyến" : "Lưu Thay Đổi"}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={closeDialog}
                      disabled={loading}
                      className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-semibold transition-colors disabled:opacity-50"
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Custom Animation */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ManagerRoutes;
