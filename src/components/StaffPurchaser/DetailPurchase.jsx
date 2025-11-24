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
  MapPin,
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
    warehouses = [],
  } = purchase;

  // helper: get initials from name
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  // Get status label in English
  const getStatusLabel = (status) => {
    const statusMap = {
      DA_MUA: "Purchased",
      HOAT_DONG: "Active",
      CHO_MUA: "Pending Purchase",
      TAM_DUNG: "On Hold",
      HUY: "Cancelled",
      CHO_NHAP_KHO_NN: "Awaiting Overseas Warehouse",
    };
    return statusMap[status] || status;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl border border-gray-100 max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-slate-50 via-white to-blue-50">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Purchase Detail
                </h2>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-600">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full shadow-sm">
                <Tag className="w-3.5 h-3.5" />
                <span className="uppercase tracking-wide text-gray-500 font-medium">
                  Purchase
                </span>
                <strong className="text-gray-900 text-sm">
                  {purchase.purchaseCode}
                </strong>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full shadow-sm">
                <Calendar className="w-3.5 h-3.5" />
                <span className="font-medium">Date:</span>{" "}
                {formatDate(purchase.purchaseTime)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {purchase.purchaseImage && (
              <img
                src={purchase.purchaseImage}
                alt="Purchase"
                className="w-16 h-16 rounded-lg object-cover border border-gray-200 shadow-sm"
              />
            )}
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
          {/* LEFT: Order & Products */}
          <div className="lg:col-span-2 space-y-5">
            {/* Order summary */}
            <div className="border border-gray-200 rounded-xl p-5 bg-gradient-to-br from-slate-50 to-blue-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-gray-700" />
                  <h3 className="font-bold text-base uppercase tracking-wide text-slate-800">
                    Order Information
                  </h3>
                </div>
                {orders?.orderCode && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs text-slate-700 shadow-sm">
                    <Tag className="w-3.5 h-3.5" />
                    Order:{" "}
                    <span className="font-bold text-slate-900 text-sm">
                      {orders.orderCode}
                    </span>
                  </span>
                )}
              </div>
              {orders ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs text-gray-700">
                  <div className="bg-white rounded-lg p-2.5 border border-gray-200">
                    <span className="font-semibold text-slate-800 block mb-0.5">
                      Order Type:
                    </span>
                    <span className="text-sm">{orders.orderType}</span>
                  </div>
                  <div className="bg-white rounded-lg p-2.5 border border-gray-200">
                    <span className="font-semibold text-slate-800 block mb-0.5">
                      Status:
                    </span>
                    <span className="text-sm">{orders.status}</span>
                  </div>
                  <div className="bg-white rounded-lg p-2.5 border border-gray-200">
                    <span className="font-semibold text-slate-800 block mb-0.5">
                      Exchange Rate:
                    </span>
                    <span className="text-sm">
                      {formatCurrency(orders.exchangeRate)}
                    </span>
                  </div>
                  <div className="bg-white rounded-lg p-2.5 border border-gray-200">
                    <span className="font-semibold text-slate-800 block mb-0.5">
                      Final Order Price:
                    </span>
                    <span className="text-sm font-bold text-blue-700">
                      {formatCurrency(orders.finalPriceOrder)}
                    </span>
                  </div>
                  <div className="bg-white rounded-lg p-2.5 border border-gray-200">
                    <span className="font-semibold text-slate-800 block mb-0.5">
                      Shipping Fee:
                    </span>
                    <span className="text-sm">
                      {formatCurrency(orders.priceShip)}
                    </span>
                  </div>
                  <div className="bg-white rounded-lg p-2.5 border border-gray-200">
                    <span className="font-semibold text-slate-800 block mb-0.5">
                      Price Before Fee:
                    </span>
                    <span className="text-sm">
                      {formatCurrency(orders.priceBeforeFee)}
                    </span>
                  </div>

                  <div className="bg-white rounded-lg p-2.5 border border-gray-200 col-span-2">
                    <span className="font-semibold text-slate-800 block mb-0.5">
                      Order Created:
                    </span>
                    <span className="text-xs">
                      {formatDate(orders.createdAt)}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-500">No order information.</p>
              )}
            </div>

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
                        <tr
                          key={link.linkId}
                          className={`border-t ${
                            idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                          }`}
                        >
                          <td className="px-3 py-2.5 align-top">
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-900 text-sm mb-1.5">
                                {link.productName || "—"}
                              </span>
                              {link.productLink && (
                                <a
                                  href={link.productLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-base text-blue-600 hover:text-blue-800 hover:underline break-all font-medium leading-relaxed"
                                >
                                  {link.productLink}
                                </a>
                              )}
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
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-gray-500">No products.</p>
              )}
            </div>

            {/* Warehouses (if any) */}
            <div className="border border-gray-200 rounded-xl p-5 bg-gradient-to-br from-slate-50 to-gray-50">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-gray-700" />
                <h3 className="font-bold text-base uppercase tracking-wide text-slate-800">
                  Warehouses
                </h3>
              </div>
              {warehouses.length > 0 ? (
                <ul className="text-xs text-gray-700 space-y-2">
                  {warehouses.map((wh, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                      <span className="font-semibold">
                        {wh.warehouseCode || "—"}
                      </span>
                      <span className="text-gray-500">-</span>
                      <span>{wh.location || "—"}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-500">No warehouse linked.</p>
              )}
            </div>
          </div>

          {/* RIGHT: Staff & Customer */}
          <div className="space-y-5">
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
                        <span className="inline-flex items-center gap-1 rounded-full bg-white border border-blue-200 px-2 py-1 text-xl text-blue-700 font-semibold shadow-sm">
                          {staff.staffCode}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-gray-200">
                      <Phone className="w-3.5 h-3.5 text-gray-500" />
                      <span className="font-medium">{staff.phone || "—"}</span>
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
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-1 text-xl text-emerald-700 font-semibold shadow-sm">
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
                    {customer.source && (
                      <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-gray-200">
                        <ClipboardList className="w-3.5 h-3.5 text-gray-500" />
                        <span className="font-medium">
                          Source: {customer.source}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-500">
                  No customer information.
                </p>
              )}
            </div>

            {/* Note */}
            <div className="border border-gray-200 rounded-xl p-5 bg-gradient-to-br from-slate-50 to-amber-50">
              <div className="flex items-center gap-2 mb-3">
                <ClipboardList className="w-5 h-5 text-gray-700" />
                <h3 className="font-bold text-base uppercase tracking-wide text-slate-800">
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
        </div>
      </div>
    </div>
  );
};

export default DetailPurchase;
