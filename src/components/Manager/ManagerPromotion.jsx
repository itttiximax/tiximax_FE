// src/pages/Manager/ManagerPromotion.jsx
import React, { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  FiPlus,
  FiTrash2,
  FiX,
  FiGift,
  FiPercent,
  FiDollarSign,
  FiCalendar,
  FiFileText,
  FiChevronLeft,
  FiChevronRight,
  FiMapPin,
  FiCheck,
} from "react-icons/fi";
import managerPromotionService from "../../Services/Manager/managerPromotionService";
import ConfirmDialog from "../../common/ConfirmDialog";
// Import route service nếu có
// import { getAllRoutes } from "../../Services/Manager/managerRouteService";

// Helper: convert datetime-local => ISO
const toIso = (v) => {
  if (!v) return v;
  if (typeof v === "string" && v.endsWith("Z")) return v;
  try {
    return new Date(v).toISOString();
  } catch {
    return v;
  }
};

// Set cứng option
const VOUCHER_TYPES = [
  { value: "PHAN_TRAM", label: "PHẦN TRĂM" },
  { value: "CO_DINH", label: "CỐ ĐỊNH" },
];

const ASSIGN_TYPES = [
  { value: "THU_CONG", label: "THỦ CÔNG" },
  { value: "DANG_KI_TK", label: "ĐĂNG KÝ TÀI KHOẢN" },
  { value: "DAT_CHI_TIEU", label: "ĐẠT CHỈ TIÊU" },
];

const ManagerPromotion = () => {
  // Table & paging
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  // Create form
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    type: "PHAN_TRAM",
    value: "",
    description: "",
    startDate: "",
    endDate: "",
    minOrderValue: "",
    assignType: "THU_CONG",
    thresholdAmount: "",
    routeIds: [],
  });

  // Delete
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Routes
  const [routes, setRoutes] = useState([]);

  const totalPages = useMemo(() => {
    if (!totalElements) return 1;
    return Math.max(1, Math.ceil(totalElements / size));
  }, [totalElements, size]);

  const fetchVouchers = async (p = page, s = size) => {
    try {
      setLoading(true);
      const res = await managerPromotionService.getVouchers(p, s);
      if (Array.isArray(res)) {
        setVouchers(res);
        setTotalElements(res.length);
      } else {
        setVouchers(res.content || []);
        setTotalElements(
          res.totalElements ?? res.total ?? res.content?.length ?? 0
        );
      }
    } catch {
      toast.error("Lỗi khi tải danh sách voucher");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoutes = async () => {
    try {
      // TODO: Thay bằng API call thực tế
      // const data = await getAllRoutes();
      // setRoutes(data);

      // Mock data để demo
      const mockRoutes = [
        { routeId: 1, routeName: "Hà Nội - Hải Phòng" },
        { routeId: 2, routeName: "Hà Nội - Đà Nẵng" },
        { routeId: 3, routeName: "Hà Nội - Sài Gòn" },
        { routeId: 4, routeName: "Đà Nẵng - Nha Trang" },
        { routeId: 5, routeName: "Sài Gòn - Cần Thơ" },
      ];
      setRoutes(mockRoutes);
    } catch {
      toast.error("Lỗi khi tải danh sách tuyến đường");
    }
  };

  useEffect(() => {
    fetchVouchers(page, size);
    fetchRoutes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size]);

  const resetForm = () =>
    setFormData({
      code: "",
      type: "PHAN_TRAM",
      value: "",
      description: "",
      startDate: "",
      endDate: "",
      minOrderValue: "",
      assignType: "THU_CONG",
      thresholdAmount: "",
      routeIds: [],
    });

  const handleCreate = async (e) => {
    e.preventDefault();

    // Validation đơn giản
    if (!formData.code?.trim()) {
      toast.error("Vui lòng nhập mã voucher");
      return;
    }
    if (formData.value === "" || isNaN(Number(formData.value))) {
      toast.error("Vui lòng nhập giá trị hợp lệ");
      return;
    }

    const payload = {
      ...formData,
      value: Number(formData.value),
      minOrderValue:
        formData.minOrderValue === "" ? 0 : Number(formData.minOrderValue),
      thresholdAmount:
        formData.thresholdAmount === "" ? 0 : Number(formData.thresholdAmount),
      startDate: toIso(formData.startDate),
      endDate: toIso(formData.endDate),
      routeIds: formData.routeIds?.length ? formData.routeIds : [],
    };

    const loadingToast = toast.loading("Đang tạo voucher...");

    try {
      setSaving(true);
      await managerPromotionService.createVoucher(payload);
      toast.success("Tạo voucher thành công!", { id: loadingToast });
      resetForm();
      setShowForm(false);
      fetchVouchers(page, size);
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Không thể tạo voucher";
      toast.error(msg, { id: loadingToast, duration: 5000 });
    } finally {
      setSaving(false);
    }
  };

  const openDelete = (id) => {
    if (id === undefined || id === null) {
      toast.error("Không tìm thấy ID voucher để xóa");
      return;
    }
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (deleteId === undefined || deleteId === null) return;
    setDeleting(true);
    try {
      setVouchers((prev) =>
        prev.filter((item) => (item.id ?? item.voucherId) !== deleteId)
      );
      await managerPromotionService.deleteVoucher(deleteId);
      toast.success("Xóa voucher thành công!");

      // Nếu xóa hết trang hiện tại, lùi về trang trước (nếu có)
      const remaining = vouchers.length - 1;
      if (remaining <= 0 && page > 0) {
        setPage((p) => p - 1);
      } else {
        fetchVouchers(page, size);
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Không thể xóa voucher";
      toast.error(msg, { duration: 5000 });
      fetchVouchers(page, size);
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
      setDeleteId(null);
    }
  };

  const valuePlaceholder =
    formData.type === "PHAN_TRAM" ? "VD: 10, 20, 50" : "VD: 30000, 50000";

  const handleRouteToggle = (routeId) => {
    setFormData((prev) => {
      const currentIds = prev.routeIds || [];
      const isSelected = currentIds.includes(routeId);

      return {
        ...prev,
        routeIds: isSelected
          ? currentIds.filter((id) => id !== routeId)
          : [...currentIds, routeId],
      };
    });
  };

  const renderTableContent = () => {
    if (loading)
      return (
        <tr>
          <td colSpan="7" className="px-4 py-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-600 mx-auto mb-2"></div>
            <span className="text-gray-600 text-sm">Đang tải...</span>
          </td>
        </tr>
      );

    if (vouchers.length === 0)
      return (
        <tr>
          <td colSpan="7" className="px-4 py-12 text-center">
            <div className="p-3 bg-gray-100 rounded-lg mb-3 inline-block">
              <FiGift className="w-10 h-10 text-gray-400" />
            </div>
            <p className="font-bold text-gray-900 mb-1">Chưa có voucher nào</p>
            <p className="text-xs text-gray-500 mb-4">
              Nhấn "Thêm mới" để tạo voucher đầu tiên
            </p>
          </td>
        </tr>
      );

    return vouchers.map((v, idx) => {
      // Get route names for display
      const voucherRouteIds = v.routeIds || [];
      const routeNames =
        voucherRouteIds.length > 0
          ? voucherRouteIds
              .map((id) => routes.find((r) => r.routeId === id)?.routeName)
              .filter(Boolean)
          : [];

      return (
        <tr
          key={v.id ?? v.voucherId ?? idx}
          className={`transition-all hover:bg-blue-50/50 ${
            idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
          }`}
        >
          <td className="px-4 py-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
                <FiGift className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <span className="font-semibold text-blue-700 text-sm">
                {v.code}
              </span>
            </div>
          </td>
          <td className="px-4 py-2.5 text-center">
            {v.type === "PHAN_TRAM" ? (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 border border-purple-200">
                <FiPercent className="w-3 h-3" /> Phần trăm
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-100 to-yellow-100 text-yellow-700 border border-yellow-200">
                <FiDollarSign className="w-3 h-3" /> Cố định
              </span>
            )}
          </td>
          <td className="px-4 py-2.5 text-center">
            <span className="font-bold text-gray-900 text-sm">
              {v.value}
              {v.type === "PHAN_TRAM" ? "%" : " VNĐ"}
            </span>
          </td>
          <td className="px-4 py-2.5 text-xs text-gray-600">
            {v.startDate
              ? new Date(v.startDate).toLocaleDateString("vi-VN")
              : "—"}
          </td>
          <td className="px-4 py-2.5 text-xs text-gray-600">
            {v.endDate ? new Date(v.endDate).toLocaleDateString("vi-VN") : "—"}
          </td>
          <td className="px-4 py-2.5">
            {routeNames.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {routeNames.slice(0, 2).map((name, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200"
                  >
                    <FiMapPin className="w-2.5 h-2.5" />
                    {name}
                  </span>
                ))}
                {routeNames.length > 2 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-gray-200 text-gray-700">
                    +{routeNames.length - 2}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-xs text-gray-500 italic">Tất cả</span>
            )}
          </td>
          <td className="px-4 py-2.5 text-center">
            <button
              onClick={() => openDelete(v.id ?? v.voucherId)}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow-md transition-all"
              title="Xóa voucher"
            >
              <FiTrash2 className="w-3 h-3" /> Xóa
            </button>
          </td>
        </tr>
      );
    });
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="max-w-[1600px] mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
              <FiGift className="h-5 w-5 text-white" />
            </div>
            Quản lý Voucher
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all ${
              showForm
                ? "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white"
                : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
            }`}
          >
            {showForm ? (
              <>
                <FiX className="w-4 h-4" /> Đóng
              </>
            ) : (
              <>
                <FiPlus className="w-4 h-4" /> Thêm mới
              </>
            )}
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-5">
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="p-1 bg-gradient-to-br from-green-100 to-green-200 rounded">
                <FiPlus className="w-4 h-4 text-green-600" />
              </div>
              Tạo Voucher Mới
            </h2>

            <form onSubmit={handleCreate} className="space-y-4">
              {/* Row 1: Code + Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">
                    Mã Voucher *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData((s) => ({ ...s, code: e.target.value }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    placeholder="VD: SUMMER2024"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">
                    Loại Voucher *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData((s) => ({ ...s, type: e.target.value }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white"
                  >
                    {VOUCHER_TYPES.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Value + Min Order */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">
                    Giá Trị *
                  </label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) =>
                      setFormData((s) => ({ ...s, value: e.target.value }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    placeholder={valuePlaceholder}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">
                    Đơn Hàng Tối Thiểu
                  </label>
                  <input
                    type="number"
                    value={formData.minOrderValue}
                    onChange={(e) =>
                      setFormData((s) => ({
                        ...s,
                        minOrderValue: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    placeholder="VD: 100000"
                  />
                </div>
              </div>

              {/* Row 3: Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">
                    <FiCalendar className="inline w-3 h-3 mr-1" />
                    Ngày Bắt Đầu
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData((s) => ({ ...s, startDate: e.target.value }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">
                    <FiCalendar className="inline w-3 h-3 mr-1" />
                    Ngày Kết Thúc
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData((s) => ({ ...s, endDate: e.target.value }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Row 4: Assign Type + Threshold */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">
                    Cách Gán
                  </label>
                  <select
                    value={formData.assignType}
                    onChange={(e) =>
                      setFormData((s) => ({ ...s, assignType: e.target.value }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white"
                  >
                    {ASSIGN_TYPES.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">
                    Ngưỡng Đạt Chỉ Tiêu
                  </label>
                  <input
                    type="number"
                    value={formData.thresholdAmount}
                    onChange={(e) =>
                      setFormData((s) => ({
                        ...s,
                        thresholdAmount: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    placeholder="VD: 500000"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">
                  <FiFileText className="inline w-3 h-3 mr-1" />
                  Mô Tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((s) => ({ ...s, description: e.target.value }))
                  }
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
                  placeholder="Mô tả chi tiết về voucher..."
                />
              </div>

              {/* Route Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">
                  <FiMapPin className="inline w-3 h-3 mr-1" />
                  Áp Dụng Cho Tuyến Đường
                  <span className="ml-1 text-xs font-normal text-gray-500 normal-case">
                    ({formData.routeIds?.length || 0} đã chọn)
                  </span>
                </label>

                {routes.length === 0 ? (
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-xs text-gray-500">
                      Đang tải danh sách tuyến đường...
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 border border-gray-200 rounded-lg bg-gray-50">
                    {routes.map((route) => {
                      const isSelected = formData.routeIds?.includes(
                        route.routeId
                      );
                      return (
                        <label
                          key={route.routeId}
                          className={`flex items-center gap-2 p-2.5 border-2 rounded-lg cursor-pointer transition-all ${
                            isSelected
                              ? "border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-sm"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleRouteToggle(route.routeId)}
                            className="sr-only"
                          />
                          <div
                            className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${
                              isSelected
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-300 bg-white"
                            }`}
                          >
                            <FiCheck
                              className={`w-3 h-3 ${
                                isSelected ? "text-white" : "text-transparent"
                              }`}
                            />
                          </div>
                          <div className="flex items-center gap-1.5 flex-1 min-w-0">
                            <FiMapPin
                              className={`flex-shrink-0 w-3 h-3 ${
                                isSelected ? "text-blue-600" : "text-gray-400"
                              }`}
                            />
                            <span
                              className={`text-xs font-medium truncate ${
                                isSelected ? "text-blue-900" : "text-gray-700"
                              }`}
                            >
                              {route.routeName}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
                <p className="mt-1.5 text-xs text-gray-500">
                  Để trống để áp dụng cho tất cả tuyến đường
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={saving}
                  className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-semibold shadow-md transition-all ${
                    saving
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:shadow-lg"
                  }`}
                >
                  {saving ? "Đang lưu..." : "Lưu voucher"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-semibold transition-all"
                >
                  Hủy bỏ
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-700 uppercase">
                    Mã Voucher
                  </th>
                  <th className="px-4 py-2.5 text-center text-xs font-bold text-gray-700 uppercase">
                    Loại
                  </th>
                  <th className="px-4 py-2.5 text-center text-xs font-bold text-gray-700 uppercase">
                    Giá Trị
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-700 uppercase">
                    Bắt Đầu
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-700 uppercase">
                    Kết Thúc
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-700 uppercase">
                    Tuyến Đường
                  </th>
                  <th className="px-4 py-2.5 text-center text-xs font-bold text-gray-700 uppercase">
                    Thao Tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {renderTableContent()}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {vouchers.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-gray-50 border-t border-gray-200">
              <div className="text-xs text-gray-600 font-medium">
                Trang{" "}
                <span className="text-blue-600 font-bold">{page + 1}</span> /{" "}
                {totalPages} • Tổng{" "}
                <span className="text-blue-600 font-bold">{totalElements}</span>{" "}
                voucher
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    page <= 0
                      ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                      : "text-gray-700 bg-white border border-gray-300 hover:border-blue-500 hover:text-blue-600 hover:shadow-sm"
                  }`}
                >
                  <FiChevronLeft className="w-3.5 h-3.5" /> Trước
                </button>

                <button
                  disabled={page + 1 >= totalPages}
                  onClick={() =>
                    setPage((p) => (p + 1 < totalPages ? p + 1 : p))
                  }
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    page + 1 >= totalPages
                      ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                      : "text-gray-700 bg-white border border-gray-300 hover:border-blue-500 hover:text-blue-600 hover:shadow-sm"
                  }`}
                >
                  Sau <FiChevronRight className="w-3.5 h-3.5" />
                </button>

                <select
                  value={size}
                  onChange={(e) => {
                    setSize(Number(e.target.value));
                    setPage(0);
                  }}
                  className="ml-1 border border-gray-300 rounded-lg px-2 py-1.5 text-xs font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white"
                  title="Số voucher trên mỗi trang"
                >
                  {[10, 20, 50, 100].map((n) => (
                    <option key={n} value={n}>
                      {n} / trang
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setDeleteId(null);
        }}
        onConfirm={confirmDelete}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa voucher này không?"
        confirmText="Xóa"
        cancelText="Hủy"
        loading={deleting}
        type="danger"
      />
    </>
  );
};

export default ManagerPromotion;
