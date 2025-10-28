// src/Components/Payment/CustomerVoucherPayment.jsx
import React, { useEffect, useState } from "react";
import managerPromotionService from "../../Services/Manager/managerPromotionService";

const CustomerVoucherPayment = ({
  accountId,
  disabled = false,
  value, // customerVoucherId hiện tại (number | null | "")
  onChange, // (newCustomerVoucherId: number | null) => void
  className = "",
  label = "Chọn voucher (theo tài khoản)",
  showMeta = true, // hiển thị dòng mô tả accountId
}) => {
  const [loading, setLoading] = useState(false);
  const [vouchers, setVouchers] = useState([]); // [{customerVoucherId, voucher:{code, description, ...}}]
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchVouchers = async () => {
      if (!accountId) {
        setVouchers([]);
        setError("");
        return;
      }
      try {
        setLoading(true);
        setError("");
        const data = await managerPromotionService.getVouchersByCustomer(
          accountId
        );
        if (!mounted) return;
        setVouchers(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!mounted) return;
        setError(
          e?.response?.data?.message ||
            e?.message ||
            "Không thể tải voucher của tài khoản"
        );
        setVouchers([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchVouchers();
    return () => {
      mounted = false;
    };
  }, [accountId]);

  const handleSelect = (e) => {
    const raw = e.target.value;
    const selected = raw === "" || raw == null ? null : Number(raw);
    onChange?.(selected);
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {!accountId ? (
        <div className="text-sm text-gray-500">
          Không tìm thấy <span className="font-medium">accountId</span>. Bạn vẫn
          có thể tiếp tục mà không dùng voucher.
        </div>
      ) : loading ? (
        <div className="text-sm text-gray-500">Đang tải voucher…</div>
      ) : error ? (
        <div className="text-sm text-red-600">{error}</div>
      ) : vouchers.length === 0 ? (
        <div className="text-sm text-gray-500">
          Không có voucher khả dụng cho tài khoản này
        </div>
      ) : (
        <select
          value={value ?? ""} // null/undefined -> ""
          onChange={handleSelect}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">-- Không sử dụng voucher --</option>
          {vouchers.map((cv) => (
            <option key={cv.customerVoucherId} value={cv.customerVoucherId}>
              {(cv?.voucher?.code ?? "Mã không xác định") +
                " — " +
                (cv?.voucher?.description ?? "Không mô tả")}
            </option>
          ))}
        </select>
      )}

      {showMeta && (
        <p className="mt-1 text-xs text-gray-500">
          {accountId
            ? `Danh sách hiển thị theo accountId: ${accountId}`
            : "Không có accountId → không thể tải danh sách voucher."}
        </p>
      )}
    </div>
  );
};

export default CustomerVoucherPayment;
