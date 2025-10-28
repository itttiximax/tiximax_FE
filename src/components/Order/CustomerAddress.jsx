// src/components/Order/CustomerAddress.jsx
import React, { useEffect, useState } from "react";
import addressService from "../../Services/Order/addressService";
import { ChevronDown, Plus, MapPin, Loader2, AlertCircle } from "lucide-react";
import AddressDialog from "./AddressDialog";
import { useWebSocket } from "../../hooks/useWebSocket";

const CustomerAddress = ({
  customerCode,
  onAddressSelect,
  autoSelectFirst = true,
  disabled = false,
  required = true,
}) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [creatingAddress, setCreatingAddress] = useState(false);

  // ✨ Connect to WebSocket
  const { messages, isConnected } = useWebSocket("/topic/Tiximax");

  const labelOf = (addr) =>
    String(addr?.addressName ?? "")
      .replace(/^["']|["']$/g, "")
      .trim() || `#${addr?.addressId}`;

  // ✨ Fetch addresses function
  const fetchAddresses = async (code) => {
    try {
      setLoading(true);
      const data = await addressService.getCustomerAddresses(code);
      const list = Array.isArray(data) ? data : data?.items ?? [];
      setAddresses(list);

      if (list.length > 0 && autoSelectFirst) {
        const firstId = Number(list[0].addressId);
        setSelectedAddressId(firstId);
        onAddressSelect?.({ ...list[0], addressId: firstId });
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Không lấy được địa chỉ";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ✨ Handle WebSocket messages
  useEffect(() => {
    if (messages.length === 0) return;

    const latestMessage = messages[0];

    console.log("=== WebSocket Message Debug ===");
    console.log("Message:", latestMessage);
    console.log("Event:", latestMessage.event);
    console.log("Message Customer:", latestMessage.customerCode);
    console.log("Current Customer:", customerCode);
    console.log("===============================");

    if (latestMessage.event === "INSERT") {
      if (latestMessage.customerCode === customerCode) {
        console.log("✅ Match! Refreshing addresses...");
        if (customerCode && customerCode.trim()) {
          fetchAddresses(customerCode.trim());
        }
      } else {
        console.log("ℹ️ Different customer, skipping...");
      }
    }
  }, [messages, customerCode]);

  // Load addresses when customer changes
  useEffect(() => {
    const code = (customerCode ?? "").trim();
    setError(null);
    setAddresses([]);
    setSelectedAddressId(null);
    setShowDialog(false);

    if (!code) return;

    fetchAddresses(code);
  }, [customerCode]);

  const handleDialogSubmit = async (addressText) => {
    if (!addressText.trim()) {
      setError("Nhập địa chỉ");
      return;
    }

    try {
      setCreatingAddress(true);
      setError(null);

      await addressService.createCustomerAddress(
        customerCode.trim(),
        addressText.trim()
      );

      const updatedData = await addressService.getCustomerAddresses(
        customerCode.trim()
      );
      const updatedList = Array.isArray(updatedData)
        ? updatedData
        : updatedData?.items ?? [];
      setAddresses(updatedList);

      if (updatedList.length > 0) {
        const lastAddr = updatedList[updatedList.length - 1];
        const lastId = Number(lastAddr.addressId);
        setSelectedAddressId(lastId);
        onAddressSelect?.({ ...lastAddr, addressId: lastId });
      }

      setShowDialog(false);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Không thể tạo địa chỉ";
      setError(msg);
    } finally {
      setCreatingAddress(false);
    }
  };

  const hasData = addresses.length > 0;
  const canAddAddress = customerCode && customerCode.trim() && !disabled;

  let statusIcon = null;
  let statusColor = "text-gray-400";
  let statusCount = null;

  if (loading) {
    statusIcon = <Loader2 className="w-4 h-4 animate-spin" />;
    statusColor = "text-blue-500";
  } else if (error) {
    statusIcon = <AlertCircle className="w-4 h-4" />;
    statusColor = "text-red-500";
  } else if (hasData) {
    statusIcon = <MapPin className="w-4 h-4" />;
    statusColor = "text-green-500";
    statusCount = addresses.length;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Địa chỉ giao hàng{" "}
          {required && <span className="text-red-500">*</span>}
        </label>

        <div className="flex items-center gap-2">
          {/* ✨ WebSocket Status */}
          {isConnected && (
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 border border-green-200"
              title="WebSocket đã kết nối - Tự động cập nhật"
            >
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-700 font-medium">Live</span>
            </div>
          )}

          {/* Status Badge */}
          <div
            className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-gray-50 border border-gray-200"
            title={
              loading
                ? "Đang tải..."
                : error
                ? error
                : hasData
                ? `${statusCount} địa chỉ`
                : "Chưa có"
            }
          >
            <span className={statusColor}>{statusIcon}</span>
            {statusCount && (
              <span className="text-xs font-medium text-gray-600">
                {statusCount}
              </span>
            )}
          </div>

          {canAddAddress && !loading && (
            <button
              type="button"
              onClick={() => setShowDialog(true)}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Thêm địa chỉ mới"
              disabled={creatingAddress}
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-10 bg-gray-100 animate-pulse rounded" />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {!loading && !error && !hasData && (
        <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded">
          <AlertCircle className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">
            {customerCode
              ? "Khách hàng chưa có địa chỉ"
              : "Chọn khách hàng trước"}
          </span>
        </div>
      )}

      {!loading && !error && hasData && (
        <div className="relative">
          <select
            value={selectedAddressId ?? ""}
            onChange={(e) => {
              const id = Number(e.target.value || 0);
              setSelectedAddressId(id);
              const addr = addresses.find((a) => Number(a.addressId) === id);
              if (addr) onAddressSelect?.({ ...addr, addressId: id });
            }}
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-all"
            disabled={disabled}
          >
            {!autoSelectFirst && (
              <option value="">Chọn địa chỉ giao hàng</option>
            )}
            {addresses.map((addr) => (
              <option key={addr.addressId} value={addr.addressId}>
                {labelOf(addr)}
              </option>
            ))}
          </select>

          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      )}

      <AddressDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onSubmit={handleDialogSubmit}
        loading={creatingAddress}
      />
    </div>
  );
};

export default CustomerAddress;
