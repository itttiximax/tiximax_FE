// src/Components/StaffPurchase/DetailPurchase.jsx
import React, { useEffect, useState } from "react";
import createPurchaseService from "../../Services/StaffPurchase/createPurchaseService";
import {
  X,
  ShoppingCart,
  User,
  Package,
  CreditCard,
  Calendar,
  Tag,
  ClipboardList,
  Phone,
  Mail,
} from "lucide-react";
import toast from "react-hot-toast";

const formatCurrency = (v) => {
  if (v === null || v === undefined || isNaN(Number(v))) return "—";
  try {
    return new Intl.NumberFormat("en-US").format(Number(v));
  } catch {
    return String(v);
  }
};

const formatDate = (isoStr) => {
  if (!isoStr) return "—";
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString("en-US");
  } catch {
    return isoStr;
  }
};

// Status label cho từng product link (bảng Product List)
const getStatusLabel = (status) => {
  const statusMap = {
    DA_MUA: "Purchased",
    HOAT_DONG: "Active",
    CHO_MUA: "Pending Purchase",
    TAM_DUNG: "On Hold",
    HUY: "Cancelled",
    CHO_NHAP_KHO_NN: "Awaiting Overseas Warehouse",
    CHO_NHAP_KHO_VN: "Awaiting Vietnam Warehouse",
  };

  return statusMap[status] || status || "—";
};

// Chỉ lấy loại dịch vụ mua hộ / vận chuyển
const getOrderTypeLabel = (order) => {
  if (!order) return "—";

  const typeMap = {
    MUA_HO: "Mua hộ",
    VAN_CHUYEN: "Vận chuyển",
  };

  return typeMap[order.orderType] || order.orderType || "—";
};

// Trạng thái đơn hàng
const getOrderStatusLabel = (order) => {
  if (!order) return "—";

  const statusMap = {
    CHO_NHAP_KHO_NN: "Chờ nhập kho nước ngoài",
    CHO_NHAP_KHO_VN: "Chờ nhập kho Việt Nam",
    DA_HOAN_THANH: "Đã hoàn thành",
    DA_MUA: "Đã mua",
    TAM_DUNG: "Tạm dừng",
    HUY: "Đã hủy",
  };

  return statusMap[order.status] || order.status || "—";
};

const DetailPurchase = ({ purchaseId, onClose }) => {
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!purchaseId) return;

    const fetchPurchaseDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await createPurchaseService.getPurchaseById(purchaseId);
        setPurchase(data);
      } catch (err) {
        console.error("Error fetching purchase detail:", err);
        setError("Failed to load purchase detail");
        toast.error("Failed to load purchase detail");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseDetail();
  }, [purchaseId]);

  if (!purchaseId) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-xl w-full mx-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm text-gray-600">
              Loading purchase details...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !purchase) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-xl w-full mx-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
              Purchase Detail
            </h2>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <p className="text-sm text-red-500">{error || "No data found."}</p>
        </div>
      </div>
    );
  }

  const {
    orders,
    orderLinks = [],
    staff,
    customer,
    // warehouses = [], // đã bỏ không dùng
  } = purchase;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl border border-gray-100 max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-slate-50 via-white to-blue-50">
          <div className="flex items-start justify-between gap-4">
            {/* Left: title + code + date */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Purchase Detail
                  </h2>
                </div>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full shadow-sm">
                  <span className="text-xs text-black-500 font-medium">
                    Purchase Code --
                  </span>
                  <strong className="text-gray-900 text-xs ml-1">
                    {purchase.purchaseCode}
                  </strong>
                </span>
              </div>
            </div>

            {/* Right: only close button */}
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 p-6">
          {/* LEFT: Ảnh + Product */}
          <div className="lg:col-span-2 space-y-5">
            {/* Ảnh to bên dưới header */}
            {purchase.purchaseImage && (
              <div className="">
                <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  Purchase Image
                </h3>
                <div className="w-full">
                  <img
                    src={purchase.purchaseImage}
                    alt="Purchase"
                    className="w-full max-h-80 object-contain rounded-xl border border-gray-200 shadow-md bg-slate-50"
                  />
                </div>
              </div>
            )}

            {/* Product list */}
            <div className="border border-gray-200 rounded-xl p-5 bg-white">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-gray-700" />
                <h3 className="font-bold text-base uppercase tracking-wide text-slate-800">
                  Product List
                </h3>
              </div>
              {orderLinks.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-gray-800 border-b border-gray-200">
                        <th className="px-3 py-2.5 text-left font-bold">
                          Product
                        </th>
                        <th className="px-3 py-2.5 text-center font-bold">
                          Qty
                        </th>
                        <th className="px-3 py-2.5 text-right font-bold">
                          Web Price
                        </th>
                        <th className="px-3 py-2.5 text-right font-bold">
                          Web Ship
                        </th>
                        <th className="px-3 py-2.5 text-right font-bold">
                          Web Total
                        </th>
                        <th className="px-3 py-2.5 text-left font-bold">
                          Status
                        </th>
                        <th className="px-3 py-2.5 text-left font-bold">
                          Website
                        </th>
                        <th className="px-3 py-2.5 text-left font-bold">
                          Tracking
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderLinks.map((link, idx) => (
                        <React.Fragment key={link.linkId || `${idx}`}>
                          {/* main row */}
                          <tr
                            className={`border-t ${
                              idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                            }`}
                          >
                            <td className="px-3 py-2.5 align-top">
                              <div className="flex flex-col">
                                <span className="font-semibold text-gray-900 text-sm mb-1.5">
                                  {link.productName || "—"}
                                </span>
                                {/* keep productName here; productLink will be on separate full-width row */}
                              </div>
                            </td>
                            <td className="px-3 py-2.5 text-center align-top">
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs">
                                {link.quantity}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 text-right align-top font-medium">
                              {formatCurrency(link.priceWeb)}
                            </td>
                            <td className="px-3 py-2.5 text-right align-top font-medium">
                              {formatCurrency(link.shipWeb)}
                            </td>
                            <td className="px-3 py-2.5 text-right align-top font-medium">
                              {formatCurrency(link.totalWeb)}
                            </td>

                            <td className="px-3 py-2.5 text-left align-top">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                {getStatusLabel(link.status)}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 text-left align-top">
                              {link.website || "—"}
                            </td>
                            <td className="px-3 py-2.5 text-left align-top font-mono text-[10px]">
                              {link.trackingCode || "—"}
                            </td>
                          </tr>

                          {/* link row: span full columns, show ellipsis with title for full url */}
                          <tr
                            className={`${
                              idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                            }`}
                          >
                            <td colSpan={8} className="px-3 py-2.5">
                              {link.productLink ? (
                                <a
                                  href={link.productLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title={link.productLink}
                                  className="block w-full overflow-hidden whitespace-nowrap text-ellipsis text-xl font-semibold text-blue-500 break-all hover:underline"
                                  style={{ textOverflow: "ellipsis" }}
                                >
                                  {/* To prefer ellipsis but allow break when necessary, we combine CSS:
                                      - whitespace-nowrap + overflow-hidden + text-overflow: ellipsis
                                      - break-all as fallback for extremely long tokens
                                  */}
                                  {link.productLink}
                                </a>
                              ) : (
                                <span className="text-xs text-gray-500">
                                  No link
                                </span>
                              )}
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-gray-500">No products.</p>
              )}
            </div>

            {/* Note */}
            <div className="border border-gray-200 rounded-xl p-4 bg-gradient-to-br from-slate-50 to-amber-50">
              <div className="flex items-center gap-2 mb-2">
                <ClipboardList className="w-5 h-5 text-gray-700" />
                <h3 className="font-bold text-sm uppercase tracking-wide text-slate-800">
                  Note
                </h3>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200 min-h-[60px]">
                <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                  {purchase.note && purchase.note.trim() !== ""
                    ? purchase.note
                    : "No note for this purchase."}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Staff, Customer, Note, Order Info */}
          <div className="space-y-4">
            {/* Staff Card */}
            <div className="border border-gray-200 rounded-xl p-5 bg-gradient-to-br from-slate-50 to-purple-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-700" />
                  <h3 className="font-bold text-base uppercase tracking-wide text-slate-800">
                    Staff
                  </h3>
                </div>
              </div>
              {staff ? (
                <div className="flex gap-3">
                  <div className="space-y-2 text-xs text-gray-700 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 text-sm">
                        {staff.name}
                      </span>
                      {staff.staffCode && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white border border-blue-200 px-2 py-0.5 text-xs text-blue-700 font-semibold shadow-sm">
                          {staff.staffCode}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-gray-200">
                      <Mail className="w-3.5 h-3.5 text-gray-500" />
                      <span className="truncate font-medium">
                        {staff.email || "—"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-500">No staff information.</p>
              )}
            </div>

            {/* Customer Card */}
            <div className="border border-gray-200 rounded-xl p-5 bg-gradient-to-br from-white to-green-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-700" />
                  <h3 className="font-bold text-base uppercase tracking-wide text-slate-800">
                    Customer
                  </h3>
                </div>
              </div>
              {customer ? (
                <div className="flex gap-3">
                  <div className="space-y-2 text-xs text-gray-700 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 text-sm">
                        {customer.name}
                      </span>
                      {customer.customerCode && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-xs text-emerald-700 font-semibold shadow-sm">
                          {customer.customerCode}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-gray-200">
                      <Phone className="w-3.5 h-3.5 text-gray-500" />
                      <span className="font-medium">
                        {customer.phone || "—"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-gray-200">
                      <Mail className="w-3.5 h-3.5 text-gray-500" />
                      <span className="truncate font-medium">
                        {customer.email || "—"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-500">
                  No customer information.
                </p>
              )}
            </div>
            {/* Order summary */}
            <div className="border border-gray-200 rounded-xl p-3 bg-slate-50">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4 text-gray-700" />
                <h3 className="font-semibold text-xs uppercase tracking-wide text-slate-800">
                  Order Information
                </h3>
              </div>

              {orders ? (
                <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-700">
                  {/* Order Type */}
                  <div className="bg-white rounded-lg p-2 border border-gray-200 col-span-2">
                    <span className="font-semibold text-slate-800 block mb-0.5">
                      Order Type:
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {getOrderTypeLabel(orders)}
                    </span>
                  </div>
                  {/* Order Code */}
                  <div className="bg-white rounded-lg p-2 border border-gray-200 col-span-2">
                    <span className="font-semibold text-slate-800 block mb-0.5">
                      Order Code:
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {orders.orderCode}
                    </span>
                  </div>

                  {/* Order Status */}
                  <div className="bg-white rounded-lg p-2 border border-gray-200 col-span-2">
                    <span className="font-semibold text-slate-800 block mb-0.5">
                      Order Status:
                    </span>
                    <span className="text-sm font-bold text-blue-700">
                      {getOrderStatusLabel(orders)}
                    </span>
                  </div>

                  {/* Exchange rate */}
                  <div className="bg-white rounded-lg p-2 border border-gray-200">
                    <span className="font-semibold text-slate-800 block mb-0.5">
                      Exchange Rate:
                    </span>
                    <span className="text-black">
                      {formatCurrency(orders.exchangeRate)}
                    </span>
                  </div>

                  {/* Final price */}
                  <div className="bg-white rounded-lg p-2 border border-gray-200">
                    <span className="font-semibold text-slate-800 block mb-0.5">
                      Final Order Price:
                    </span>
                    <span className="font-bold text-blue-700">
                      {formatCurrency(orders.finalPriceOrder)}
                    </span>
                  </div>

                  {/* Shipping fee */}
                  <div className="bg-white rounded-lg p-2 border border-gray-200">
                    <span className="font-semibold text-slate-800 block mb-0.5">
                      Shipping Fee:
                    </span>
                    <span>{formatCurrency(orders.priceShip)}</span>
                  </div>

                  {/* Price before fee */}
                  <div className="bg-white rounded-lg p-2 border border-gray-200">
                    <span className="font-semibold text-slate-800 block mb-0.5">
                      Price Before Fee:
                    </span>
                    <span>{formatCurrency(orders.priceBeforeFee)}</span>
                  </div>

                  {/* Created at */}
                  <div className="bg-white rounded-lg p-2 border border-gray-200 col-span-2">
                    <span className="font-semibold text-slate-800 block mb-0.5">
                      Order Created:
                    </span>
                    <span>{formatDate(orders.createdAt)}</span>
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-gray-500">
                  No order information.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPurchase;
