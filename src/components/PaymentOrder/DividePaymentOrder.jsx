// src/Components/Payment/DividePaymentOrder.jsx
import React, { useMemo, useState, useEffect } from "react";
import toast from "react-hot-toast";
import AccountSearch from "../Order/AccountSearch";
import orderCustomerService from "../../Services/Order/orderCustomerService";
import managerBankAccountService from "../../Services/Manager/managerBankAccountService";
import {
  Search,
  User,
  Calendar,
  CreditCard,
  Package,
  CheckSquare,
  Square,
  Link as LinkIcon,
} from "lucide-react";
import CreateDividePaymentShip from "./CreateDividePaymentShip";
import ListOrderManager from "../Order/ListOrderManager";

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

  // State để cache bank accounts
  const [cachedBankAccounts, setCachedBankAccounts] = useState([]);
  const [bankAccountsLoading, setBankAccountsLoading] = useState(false);

  // Prefetch bank accounts khi component mount
  useEffect(() => {
    const prefetchBankAccounts = async () => {
      try {
        setBankAccountsLoading(true);
        const data = await managerBankAccountService.getProxyAccounts();
        setCachedBankAccounts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to prefetch bank accounts:", error);
      } finally {
        setBankAccountsLoading(false);
      }
    };

    prefetchBankAccounts();
  }, []);

  const formatCurrency = (amount) => {
    if (!amount) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const selectedTotal = useMemo(() => {
    return items
      .filter((it) => selectedItems.includes(it.linkId))
      .reduce((sum, it) => sum + (it.finalPriceVnd || 0), 0);
  }, [items, selectedItems]);

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
        toast(
          `Không tìm thấy sản phẩm nào cho khách hàng ${customer.customerCode}`,
          {
            duration: 4000,
            style: {
              background: "#3bf64bff",
              color: "#fff",
            },
          }
        );
      } else {
        toast.success(
          `Tìm thấy ${data.length} sản phẩm cho khách hàng ${customer.customerCode}`
        );
      }
    } catch (e) {
      console.error(e);
      const errorMessage = getErrorMessage(e);
      toast.error(`Không thể tải danh sách sản phẩm: ${errorMessage}`, {
        duration: 5000,
      });
      setItems([]);
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
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map((it) => it.linkId));
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Thanh toán tách đơn
        </h1>
      </div>

      {/* Customer Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Tìm kiếm khách hàng
          </h2>
        </div>

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

        {/* Selected Customer Info */}
        {selectedCustomer && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-blue-900">
                  {selectedCustomer.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 text-sm text-blue-700">
                  <div>
                    <span className="font-medium">Mã KH:</span>{" "}
                    {selectedCustomer.customerCode}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>{" "}
                    {selectedCustomer.email}
                  </div>
                  <div>
                    <span className="font-medium">SĐT:</span>{" "}
                    {selectedCustomer.phone}
                  </div>
                  {selectedCustomer.balance !== undefined && (
                    <div className="inline-flex items-center gap-1 bg-red-50 border border-red-200 rounded-md px-2 py-1 text-sm font-semibold text-red-700 shadow-sm w-auto max-w-max">
                      <span className="font-medium">Số dư:</span>{" "}
                      {new Intl.NumberFormat("vi-VN").format(
                        selectedCustomer.balance
                      )}{" "}
                      VND
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Đang tải sản phẩm...</span>
        </div>
      )}

      {/* Items List */}
      {!loading && hasSearched && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header with Bulk Actions */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                Danh sách sản phẩm
                {items.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-gray-600">
                    ({items.length} sản phẩm)
                  </span>
                )}
              </h2>

              {items.length > 0 && (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleSelectAll}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    {selectedItems.length === items.length ? (
                      <CheckSquare className="w-4 h-4 mr-1" />
                    ) : (
                      <Square className="w-4 h-4 mr-1" />
                    )}
                    {selectedItems.length === items.length
                      ? "Bỏ chọn tất cả"
                      : "Chọn tất cả"}
                  </button>

                  {selectedItems.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        Đã chọn: {selectedItems.length} sản phẩm
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        Tổng: {formatCurrency(selectedTotal)}
                      </span>

                      {/* Use CreateDividePaymentShip Component */}
                      <CreateDividePaymentShip
                        selectedShipmentCodes={selectedShipmentCodes}
                        totalAmount={selectedTotal}
                        formatCurrency={formatCurrency}
                        accountId={
                          selectedCustomer?.accountId ??
                          selectedCustomer?.id ??
                          undefined
                        }
                        cachedBankAccounts={cachedBankAccounts}
                        bankAccountsLoading={bankAccountsLoading}
                        onSuccess={async (result) => {
                          toast.success(
                            `Tạo thanh toán tách đơn thành công! Mã thanh toán: ${
                              result?.paymentCode || result?.id || "N/A"
                            }`
                          );
                          try {
                            if (selectedCustomer) {
                              await fetchPartialOrders(selectedCustomer);
                            }
                            setSelectedItems([]);
                          } catch (e) {
                            toast.error(
                              `Tạo xong nhưng tải lại danh sách lỗi: ${getErrorMessage(
                                e
                              )}`
                            );
                          }
                        }}
                        onError={(e) => {
                          console.error("Divide payment error:", e);
                        }}
                        disabled={!selectedShipmentCodes.length}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Items Content */}
          {items.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không có sản phẩm
              </h3>
              <p className="text-gray-500">
                Khách hàng này chưa có sản phẩm nào trong hệ thống
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {items.map((item) => (
                <div
                  key={item.linkId}
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    selectedItems.includes(item.linkId)
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    {/* Checkbox */}
                    <div className="flex items-start space-x-4">
                      <button
                        onClick={() => toggleSelectItem(item.linkId)}
                        className="mt-1 text-blue-600 hover:text-blue-800"
                      >
                        {selectedItems.includes(item.linkId) ? (
                          <CheckSquare className="w-5 h-5" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>

                      {/* Item Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.productName}
                          </h3>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            x{item.quantity}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Package className="w-4 h-4 mr-2" />
                            <span>Website: {item.website || "N/A"}</span>
                          </div>
                          {item.trackingCode && (
                            <div className="flex items-center">
                              <CreditCard className="w-4 h-4 mr-2" />
                              <span>Mã tracking: {item.trackingCode}</span>
                            </div>
                          )}
                          {item.shipmentCode && (
                            <div className="flex items-center">
                              <span className="font-medium">Mã chuyến:</span>
                              <span className="ml-1">{item.shipmentCode}</span>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-sm">
                          <div className="text-gray-600">
                            <span className="font-medium">Ship web:</span>{" "}
                            {formatCurrency(item.shipWeb)}
                          </div>
                          <div className="text-gray-600">
                            <span className="font-medium">Tổng web:</span>{" "}
                            {formatCurrency(item.totalWeb)}
                          </div>
                          <div className="text-gray-600">
                            <span className="font-medium">Phí mua hộ:</span>{" "}
                            {item.purchaseFee}%
                          </div>
                          <div className="text-gray-600">
                            <span className="font-medium">Phụ phí:</span>{" "}
                            {formatCurrency(item.extraCharge)}
                          </div>
                        </div>

                        {item.productLink && (
                          <div className="mt-3">
                            <a
                              href={item.productLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              <LinkIcon className="w-4 h-4 mr-1" />
                              Xem sản phẩm
                            </a>
                          </div>
                        )}

                        {item.note && (
                          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                            <p className="text-sm text-yellow-800">
                              <span className="font-medium">Ghi chú:</span>{" "}
                              {item.note}
                            </p>
                          </div>
                        )}

                        {item.status && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {item.status}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Total Amount */}
                    <div className="text-right ml-6">
                      <div className="text-2xl font-bold text-gray-900">
                        {formatCurrency(item.finalPriceVnd)}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Thành tiền
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty State - No Search Yet */}
      {!hasSearched && !loading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 text-center py-12">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chọn khách hàng để xem sản phẩm
          </h3>
          <p className="text-gray-500">
            Sử dụng ô tìm kiếm ở trên để tìm và chọn khách hàng
          </p>
        </div>
      )}

      {/* ListOrderManager component */}
      <div className="mt-8">
        <div className="border-t border-gray-300 pt-8">
          <ListOrderManager />
        </div>
      </div>
    </div>
  );
};

export default DividePaymentOrder;
