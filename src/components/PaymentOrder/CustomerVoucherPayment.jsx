// src/Components/Payment/CustomerVoucherPayment.jsx
import React, { useEffect, useState } from "react";
import managerPromotionService from "../../Services/Manager/managerPromotionService";

const CustomerVoucherPayment = ({
  accountId,
  disabled = false,
  value = null, // Default là null thay vì undefined
  onChange,
  className = "",
  label = "Chọn voucher (không bắt buộc)",
  onLoadingChange,
  onVouchersChange,
}) => {
  const [loading, setLoading] = useState(false);
  const [vouchers, setVouchers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchVouchers = async () => {
      if (!accountId) {
        setVouchers([]);
        setError("");
        onVouchersChange?.([]);
        onLoadingChange?.(false);
        return;
      }

      try {
        setLoading(true);
        onLoadingChange?.(true);
        setError("");

        const data = await managerPromotionService.getVouchersByCustomer(
          accountId
        );

        if (!mounted) return;

        const arr = Array.isArray(data) ? data : [];
        setVouchers(arr);
        onVouchersChange?.(arr);
      } catch (e) {
        if (!mounted) return;

        setError(
          e?.response?.data?.message ||
            e?.message ||
            "Không thể tải danh sách voucher"
        );
        setVouchers([]);
        onVouchersChange?.([]);
      } finally {
        if (mounted) {
          setLoading(false);
          onLoadingChange?.(false);
        }
      }
    };

    fetchVouchers();

    return () => {
      mounted = false;
    };
  }, [accountId]);

  const handleSelect = (e) => {
    const raw = e.target.value;
    // Chuyển về null nếu không chọn, hoặc convert sang Number
    const selected = raw === "" ? null : Number(raw);
    onChange?.(selected);
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {!accountId ? (
        <div className="text-sm text-gray-500 italic">
          Chưa có thông tin tài khoản. Có thể tiếp tục thanh toán mà không sử
          dụng voucher.
        </div>
      ) : error ? (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
          ⚠️ {error}
        </div>
      ) : vouchers.length === 0 && !loading ? (
        <div className="text-sm text-gray-500 italic">
          Tài khoản này không có voucher khả dụng
        </div>
      ) : (
        <select
          value={value ?? ""} // Hiển thị "" nếu value là null/undefined
          onChange={handleSelect}
          disabled={disabled || loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <option>Đang tải danh sách voucher...</option>
          ) : (
            <>
              <option value="">-- Không sử dụng voucher --</option>
              {vouchers.map((cv) => (
                <option key={cv.customerVoucherId} value={cv.customerVoucherId}>
                  {cv?.voucher?.code || "Mã không rõ"} —{" "}
                  {cv?.voucher?.description || "Không có mô tả"}
                </option>
              ))}
            </>
          )}
        </select>
      )}
    </div>
  );
};

export default CustomerVoucherPayment;
