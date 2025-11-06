// src/Components/Payment/DividePaymentOrder.jsx
import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import AccountSearch from "../Order/AccountSearch";
import orderCustomerService from "../../Services/Order/orderCustomerService";
import {
  Search,
  Loader2,
  User,
  Link as LinkIcon,
  Package,
  CreditCard,
  CheckSquare,
  Square,
} from "lucide-react";
import CreateDividePaymentShip from "./CreateDividePaymentShip";

// Helper: bóc tách lỗi backend để hiện toast dễ hiểu
const getErrorMessage = (error) => {
  if (error?.response) {
    const be =
      error.response.data?.error ||
      error.response.data?.message ||
      error.response.data?.detail ||
      error.response.data?.errors;
    if (be) {
      if (typeof be === "object" && !Array.isArray(be)) {
        return Object.entries(be)
          .map(([k, v]) => `${k}: ${v}`)
          .join(", ");
      } else if (Array.isArray(be)) return be.join(", ");
      return be;
    }
    return `Lỗi ${error.response.status}: ${
      error.response.statusText || "Không xác định"
    }`;
  } else if (error?.request) return "Không thể kết nối tới server.";
  return error?.message || "Đã xảy ra lỗi không xác định";
};

const DividePaymentOrder = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);

  const selectedTotal = useMemo(() => {
    return items
      .filter((it) => selectedItems.includes(it.linkId))
      .reduce((sum, it) => sum + (it.finalPriceVnd || 0), 0);
  }, [items, selectedItems]);

  // trackingCodes hợp lệ (unique, bỏ falsy)
  const selectedShipmentCodes = useMemo(() => {
    const codes = items
      .filter((it) => selectedItems.includes(it.linkId))
      .map((it) => it.shipmentCode)
      .filter(Boolean);
    return Array.from(new Set(codes));
  }, [items, selectedItems]);

  const fetchPartialOrders = async (customer) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        toast.error("Không tìm thấy token xác thực");
        return;
      }
      const data = await orderCustomerService.getPartialOrdersByCustomer(
        customer.customerCode,
        token
      );
      setItems(Array.isArray(data) ? data : []);
      setHasSearched(true);
      setSelectedItems([]);
      if (!data?.length) {
        toast.info("Không có sản phẩm nào cho khách hàng này");
      } else {
        toast.success(`Tìm thấy ${data.length} sản phẩm`);
      }
    } catch (e) {
      console.error(e);
      toast.error(`Lỗi khi tải danh sách sản phẩm: ${getErrorMessage(e)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCustomer = async (customer) => {
    setSelectedCustomer(customer);
    setItems([]);
    setSelectedItems([]);
    setHasSearched(false);
    await fetchPartialOrders(customer);
  };

  const handleClear = () => {
    setSelectedCustomer(null);
    setItems([]);
    setSelectedItems([]);
    setHasSearched(false);
  };

  const toggleSelectItem = (linkId) => {
    setSelectedItems((prev) =>
      prev.includes(linkId)
        ? prev.filter((id) => id !== linkId)
        : [...prev, linkId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) setSelectedItems([]);
    else setSelectedItems(items.map((it) => it.linkId));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Chia thanh toán (Danh sách sản phẩm)
      </h1>

      {/* Search box */}
      <div className="bg-white border rounded-lg shadow-sm p-4 mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
          Tìm khách hàng
        </h2>

        <div className="max-w-md">
          <AccountSearch
            onSelectAccount={handleSelectCustomer}
            onClear={handleClear}
            value={
              selectedCustomer
                ? `${selectedCustomer.customerCode} - ${selectedCustomer.name}`
                : ""
            }
          />
        </div>

        {selectedCustomer && (
          <div className="mt-4 flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="w-10 h-10 bg-blue-100 flex items-center justify-center rounded-full">
              <User className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <p className="font-medium text-blue-900">
                {selectedCustomer.name}
              </p>
              <p className="text-sm text-blue-700">
                Mã KH: {selectedCustomer.customerCode}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div
          className="flex justify-center items-center py-12 text-gray-600"
          aria-busy="true"
        >
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Đang tải dữ liệu...
        </div>
      )}

      {/* Flat list */}
      {!loading && hasSearched && (
        <div className="bg-white border rounded-lg shadow-sm">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="font-semibold text-gray-800">
              Tổng số sản phẩm: {items.length}
            </div>
            {items.length > 0 && (
              <button
                onClick={handleSelectAll}
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                {selectedItems.length === items.length ? (
                  <>
                    <CheckSquare className="w-4 h-4 mr-1" /> Bỏ chọn tất cả
                  </>
                ) : (
                  <>
                    <Square className="w-4 h-4 mr-1" /> Chọn tất cả
                  </>
                )}
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Không có sản phẩm nào cho khách hàng này
            </div>
          ) : (
            <ul className="divide-y">
              {items.map((item) => (
                <li
                  key={item.linkId}
                  className={`p-4 hover:bg-gray-50 transition flex justify-between items-start ${
                    selectedItems.includes(item.linkId)
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-1 accent-blue-600"
                      checked={selectedItems.includes(item.linkId)}
                      onChange={() => toggleSelectItem(item.linkId)}
                      aria-label={`Chọn ${item.productName}`}
                    />
                    <div>
                      <p className="font-semibold text-gray-800 flex items-center gap-2">
                        <Package className="w-4 h-4 text-blue-600" />
                        {item.productName}{" "}
                        <span className="text-xs text-gray-500">
                          x{item.quantity}
                        </span>
                      </p>

                      <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                        {item.productLink ? (
                          <a
                            href={item.productLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                          >
                            <LinkIcon className="w-4 h-4" />
                            Link sản phẩm
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-gray-400">
                            <LinkIcon className="w-4 h-4" />
                            Không có link
                          </span>
                        )}

                        {item.trackingCode && (
                          <span className="inline-flex items-center gap-1 text-gray-600">
                            <CreditCard className="w-4 h-4" />
                            {item.trackingCode}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 text-sm text-gray-600">
                        <div>
                          Website: <b>{item.website || "-"}</b>
                        </div>
                        <div>
                          Ship web: <b>{formatCurrency(item.shipWeb)}</b>
                        </div>
                        <div>
                          Tổng web: <b>{formatCurrency(item.totalWeb)}</b>
                        </div>
                        <div>
                          Phí mua hộ: <b>{item.purchaseFee}%</b>
                        </div>
                        <div>
                          Phụ phí: <b>{formatCurrency(item.extraCharge)}</b>
                        </div>
                        <div>
                          Mã chuyến: <b>{item.shipmentCode || "-"}</b>
                        </div>
                        <div>
                          Trạng thái: <b>{item.status || "-"}</b>
                        </div>
                      </div>

                      {item.note && (
                        <div className="mt-2 text-sm text-yellow-800 bg-yellow-50 border border-yellow-200 rounded p-2">
                          <b>Ghi chú:</b> {item.note}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(item.finalPriceVnd)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Thành tiền (VND)
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Summary action bar */}
      {selectedItems.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white shadow-lg border rounded-xl px-4 py-3 flex items-center gap-4">
          <div className="text-gray-800 font-medium">
            Đã chọn: {selectedItems.length} sản phẩm{" "}
            <span className="ml-2 text-xs text-gray-500">
              ({selectedShipmentCodes.length} shipment)
            </span>
          </div>
          <div className="text-blue-700 font-semibold">
            Tổng: {formatCurrency(selectedTotal)}
          </div>

          <CreateDividePaymentShip
            selectedShipmentCodes={selectedShipmentCodes}
            totalAmount={selectedTotal}
            formatCurrency={formatCurrency}
            accountId={
              selectedCustomer?.accountId ?? selectedCustomer?.id ?? undefined
            }
            onSuccess={async (result) => {
              // Thông báo thành công rõ ràng tại đây (ngoài toast bên trong button)
              toast.success(
                `Đã tạo thanh toán tách đơn${
                  result?.paymentCode ? ` (${result.paymentCode})` : ""
                }`
              );
              // Reload list
              try {
                if (selectedCustomer) {
                  await fetchPartialOrders(selectedCustomer);
                }
                setSelectedItems([]);
              } catch (e) {
                toast.error(
                  `Tạo xong nhưng tải lại danh sách lỗi: ${getErrorMessage(e)}`
                );
              }
            }}
            onError={(e) => {
              const msg = getErrorMessage(e);
              // Thông báo lỗi rõ ràng
              toast.error(`Tạo thanh toán tách đơn thất bại: ${msg}`, {
                duration: 5000,
              });
              // Trường hợp không có tracking hợp lệ
              if (!selectedShipmentCodes.length) {
                toast.error("Không có trackingCode hợp lệ để tách đơn");
              }
            }}
            disabled={!selectedShipmentCodes.length}
          />
        </div>
      )}

      {/* Empty state */}
      {!loading && !hasSearched && (
        <div className="text-center py-12 bg-white border rounded-lg shadow-sm">
          <Search className="w-10 h-10 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600">
            Hãy chọn khách hàng để xem danh sách sản phẩm
          </p>
        </div>
      )}
    </div>
  );
};

export default DividePaymentOrder;
