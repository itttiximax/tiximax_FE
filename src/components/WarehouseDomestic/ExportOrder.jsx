// src/Components/Domestic/ExportOrder.jsx
import React, { useState } from "react";
import {
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Truck,
  PackageCheck,
  XCircle,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";
import domesticService from "../../Services/Warehouse/domesticService";
import AccountSearch from "../Order/AccountSearch";

// Chuẩn hoá text backend trả về có thêm dấu "
const normalizeText = (value) => {
  if (!value) return "";
  return String(value)
    .replace(/^"+|"+$/g, "")
    .trim();
};

const STATUS_CONFIG = {
  DA_GIAO: {
    label: "Đã giao",
    className: "bg-green-100 text-green-800 border-green-200",
    dot: "bg-green-500",
  },
};

const ExportOrder = () => {
  const [customerCode, setCustomerCode] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatDateTime = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleString("vi-VN", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const handleTransfer = async () => {
    const code = selectedCustomer?.customerCode || customerCode.trim();

    if (!code) {
      toast.error("Vui lòng chọn hoặc nhập mã khách hàng");
      return;
    }

    try {
      setLoading(true);
      const data = await domesticService.transferByCustomer(code);

      const list = Array.isArray(data) ? data : data ? [data] : [];
      setOrders(list);

      if (!list.length) {
        toast("Không có đơn nào để giao cho khách này");
      } else {
        toast.success(`Đã giao ${list.length} đơn cho khách ${code}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi giao hàng cho khách");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleTransfer();
    }
  };

  // Callback khi chọn account từ dropdown
  const handleSelectAccount = (account) => {
    setSelectedCustomer(account);
    setCustomerCode(account.customerCode);
  };

  // Callback khi thay đổi input (typing)
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setCustomerCode(value);
    // Clear selected customer nếu user đang typing manually
    if (selectedCustomer && value !== selectedCustomer.customerCode) {
      setSelectedCustomer(null);
    }
  };

  // Callback khi clear search
  const handleClearSearch = () => {
    setCustomerCode("");
    setSelectedCustomer(null);
  };

  const handleReset = () => {
    setCustomerCode("");
    setSelectedCustomer(null);
    setOrders([]);
  };

  // Tính tổng số mã vận đơn
  const totalShippingCodes = orders.reduce(
    (sum, order) => sum + (order.shippingList?.length || 0),
    0
  );

  return (
    <div className="min-h-screen px-4 py-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 shadow-lg shadow-emerald-500/30">
              <PackageCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Xuất đơn giao hàng
              </h1>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-6 rounded-xl bg-white border border-gray-200 shadow-sm p-6">
          <div className="flex flex-col gap-4">
            {/* Account Search với autocomplete */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm khách hàng
              </label>
              <AccountSearch
                value={customerCode}
                onChange={handleSearchChange}
                onSelectAccount={handleSelectAccount}
                onClear={handleClearSearch}
              />
              {selectedCustomer && (
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>
                    Đã chọn:{" "}
                    <span className="font-semibold text-gray-900">
                      {selectedCustomer.name}
                    </span>
                    {selectedCustomer.phone && (
                      <span className="ml-2 text-gray-500">
                        ({selectedCustomer.phone})
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {orders.length > 0 && (
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <XCircle className="h-4 w-4" />
                  Làm mới
                </button>
              )}

              <button
                onClick={handleTransfer}
                disabled={loading || !customerCode.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Truck className="h-4 w-4" />
                    Giao hàng
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Stats - Chỉ hiển thị khi có kết quả */}
        {orders.length > 0 && (
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-white border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                  <Package className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Số đơn đã giao
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {orders.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <Truck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Tổng mã vận đơn
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalShippingCodes}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                  <User className="h-5 w-5 text-purple-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 font-medium">
                    Khách hàng
                  </p>
                  <p className="text-lg font-bold text-gray-900 truncate">
                    {selectedCustomer?.name || customerCode}
                  </p>
                  {selectedCustomer?.phone && (
                    <p className="text-xs text-gray-500 truncate">
                      {selectedCustomer.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order List */}
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order, index) => {
              const statusCfg = STATUS_CONFIG[order.status] || {
                label: order.status,
                className: "bg-gray-100 text-gray-800 border-gray-200",
                dot: "bg-gray-500",
              };

              return (
                <div
                  key={order.domesticId}
                  className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
                >
                  {/* Header */}
                  <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">
                            Đơn nội địa #{order.domesticId}
                          </h3>
                          {order.note && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {order.note}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${statusCfg.className}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`}
                          />
                          {statusCfg.label}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDateTime(order.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <div className="grid gap-5 lg:grid-cols-2 mb-5">
                      {/* Thông tin kho */}
                      <div>
                        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          Thông tin kho
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                            <MapPin className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-emerald-700 font-medium">
                                Kho xuất
                              </p>
                              <p className="text-sm font-semibold text-gray-900">
                                {order.fromLocationName || "—"}
                              </p>
                            </div>
                          </div>

                          {order.toLocationName && (
                            <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
                              <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0" />
                              <div>
                                <p className="text-xs text-blue-700 font-medium">
                                  Kho nhập
                                </p>
                                <p className="text-sm font-semibold text-gray-900">
                                  {order.toLocationName}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Địa chỉ giao hàng */}
                      <div>
                        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5" />
                          Địa chỉ giao hàng
                        </h4>
                        <div className="rounded-lg border border-purple-200 bg-purple-50 p-3">
                          <div className="flex items-start gap-3">
                            <User className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs text-purple-700 font-medium mb-1">
                                Người nhận
                              </p>
                              <p className="text-sm font-semibold text-gray-900">
                                {normalizeText(order.toAddressName) ||
                                  "Không có thông tin"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Danh sách mã vận đơn */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5" />
                          Danh sách mã vận đơn
                        </h4>
                        {order.shippingList &&
                          order.shippingList.length > 0 && (
                            <span className="text-xs font-medium text-gray-500">
                              {order.shippingList.length} mã
                            </span>
                          )}
                      </div>

                      {order.shippingList && order.shippingList.length > 0 ? (
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {order.shippingList.map((code, idx) => (
                            <div
                              key={code}
                              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 hover:border-gray-300 hover:bg-gray-100 transition-colors"
                            >
                              <span className="flex h-5 w-5 items-center justify-center rounded bg-gray-200 text-xs font-bold text-gray-700">
                                {idx + 1}
                              </span>
                              <span className="flex-1 font-mono text-xs font-medium text-gray-900 truncate">
                                {code}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-800">
                          <AlertCircle className="h-4 w-4 flex-shrink-0" />
                          <span>Không có mã vận đơn</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Empty State
          <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gray-100">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Chưa có kết quả
            </h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Tìm kiếm hoặc nhập mã khách hàng và bấm{" "}
              <span className="font-semibold text-emerald-600">Giao hàng</span>{" "}
              để xem danh sách đơn đã giao
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportOrder;
