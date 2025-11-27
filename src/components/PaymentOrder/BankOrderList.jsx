// /src/Components/Bank/BankOrderList.jsx
import React, { useEffect, useState, useMemo } from "react";
import managerBankAccountService from "../../Services/Manager/managerBankAccountService";

const BankOrderList = ({
  disabled = false,
  value = null,
  onChange,
  className = "",
  label = "Chọn tài khoản thanh toán (Proxy)",
  onLoadingChange,
  onAccountsChange,
  autoSelectFirst = false,
  cachedAccounts = [], // ✅ THÊM: Nhận cached data từ parent
  initialLoading = false, // ✅ THÊM: Loading state từ parent
}) => {
  const [loading, setLoading] = useState(initialLoading);
  const [accounts, setAccounts] = useState(cachedAccounts);
  const [error, setError] = useState("");

  // ✅ THÊM: Sync với cached accounts từ parent
  useEffect(() => {
    if (cachedAccounts && cachedAccounts.length > 0) {
      setAccounts(cachedAccounts);
      onAccountsChange?.(cachedAccounts);

      // Auto-select nếu cần
      if (autoSelectFirst && !value) {
        onChange?.(String(cachedAccounts[0].id));
      }
    }
  }, [cachedAccounts]); // eslint-disable-line react-hooks/exhaustive-deps

  // ✅ THÊM: Sync loading state từ parent
  useEffect(() => {
    setLoading(initialLoading);
    onLoadingChange?.(initialLoading);
  }, [initialLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAccounts = async () => {
    // ✅ SỬA: Nếu đã có cached data, không cần fetch lại
    if (cachedAccounts && cachedAccounts.length > 0) {
      return;
    }

    try {
      setLoading(true);
      onLoadingChange?.(true);
      setError("");
      const data = await managerBankAccountService.getProxyAccounts();
      const arr = Array.isArray(data) ? data : [];
      setAccounts(arr);
      onAccountsChange?.(arr);

      if (autoSelectFirst && arr.length > 0 && !value) {
        onChange?.(String(arr[0].id));
      }
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Không thể tải danh sách tài khoản Proxy";
      setError(msg);
      setAccounts([]);
      onAccountsChange?.([]);
    } finally {
      setLoading(false);
      onLoadingChange?.(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (e) => {
    const raw = e.target.value;
    onChange?.(raw === "" ? null : raw);
  };

  const id = useMemo(() => "bank-order-select", []);

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {loading && (
          <span className="ml-2 text-xs text-gray-500">Đang tải…</span>
        )}
      </label>

      {error && (
        <div
          role="alert"
          className="mb-2 text-xs text-red-700 bg-red-50 p-2 rounded border border-red-200 flex items-center justify-between"
        >
          <span>⚠️ {error}</span>
          <button
            type="button"
            onClick={fetchAccounts}
            className="underline text-red-700 ml-2 shrink-0"
          >
            Thử lại
          </button>
        </div>
      )}

      {accounts.length === 0 && !loading && !error ? (
        <div className="text-sm text-gray-500 italic">
          Không có tài khoản Proxy khả dụng
        </div>
      ) : (
        <select
          id={id}
          value={value ?? ""}
          onChange={handleSelect}
          disabled={disabled || loading}
          aria-invalid={Boolean(error)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
        >
          <option value="">Chưa chọn tài khoản</option>
          {accounts.map((acc) => {
            const optionValue = String(acc.id);
            const holder = acc.accountHolder || "Chưa rõ tên";
            const number = acc.accountNumber || "—";
            return (
              <option key={optionValue} value={optionValue}>
                {holder} — {number}
              </option>
            );
          })}
        </select>
      )}
    </div>
  );
};

export default BankOrderList;
