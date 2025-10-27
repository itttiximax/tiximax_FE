import React, { useEffect, useState } from "react";
import addressService from "../../Services/Order/addressService";
import {
  ChevronDown,
  Plus,
  MapPin,
  Loader2,
  AlertCircle,
  Check,
  X,
} from "lucide-react";

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

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [creatingAddress, setCreatingAddress] = useState(false);

  const labelOf = (addr) =>
    String(addr?.addressName ?? "")
      .replace(/^["']|["']$/g, "")
      .trim() || `#${addr?.addressId}`;

  useEffect(() => {
    const code = (customerCode ?? "").trim();
    setError(null);
    setAddresses([]);
    setSelectedAddressId(null);
    setShowAddressForm(false);
    setNewAddress("");

    if (!code) return;

    const fetchAddresses = async () => {
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

    fetchAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerCode]);

  const handleCreateAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.trim()) {
      setError("Nhập địa chỉ");
      return;
    }

    try {
      setCreatingAddress(true);
      setError(null);

      await addressService.createCustomerAddress(
        customerCode.trim(),
        newAddress.trim()
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

      setNewAddress("");
      setShowAddressForm(false);
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

  // Status badge
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
      {/* Header - giống "Điểm đến" */}
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Địa chỉ giao hàng{" "}
          {required && <span className="text-red-500">*</span>}
        </label>

        <div className="flex items-center gap-2">
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

          {/* Add Button */}
          {canAddAddress && !loading && (
            <button
              type="button"
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Thêm địa chỉ mới"
              disabled={creatingAddress}
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Add Address Form */}
      {showAddressForm && canAddAddress && (
        <form
          onSubmit={handleCreateAddress}
          className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded space-y-2"
        >
          <input
            type="text"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            placeholder="Nhập địa chỉ giao hàng..."
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            disabled={creatingAddress}
            autoFocus
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={creatingAddress || !newAddress.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Lưu địa chỉ"
            >
              {creatingAddress ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Lưu</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddressForm(false);
                setNewAddress("");
                setError(null);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors flex items-center gap-2"
              disabled={creatingAddress}
              title="Hủy"
            >
              <X className="w-4 h-4" />
              <span>Hủy</span>
            </button>
          </div>
        </form>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-10 bg-gray-100 animate-pulse rounded" />
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {/* No Data */}
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

      {/* Select Address - GIỐNG ĐIỂM ĐẾN */}
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

          {/* Chevron icon */}
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerAddress;
