// /src/Components/Bank/BankOrderList.jsx
import React, { useEffect, useState, useMemo } from "react";
import managerBankAccountService from "../../Services/Manager/managerBankAccountService";

const BankOrderList = ({
  disabled = false,
  value = null,
  onChange,
  className = "",
  label = "Chọn tài khoản thanh toán đơn hàng (Proxy)",
  onLoadingChange,
  onAccountsChange,
}) => {
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState("");

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      onLoadingChange?.(true);
      setError("");

      // ✅ Đảo ngược: lấy tài khoản Proxy (isProxy=true, isRevenue=false)
      const data = await managerBankAccountService.getProxyAccounts();
      const arr = Array.isArray(data) ? data : [];
      setAccounts(arr);
      onAccountsChange?.(arr);
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
    onChange?.(raw === "" ? null : raw); // giữ dạng string để an toàn
  };

  const id = useMemo(() => "bank-order-select", []);

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
        {loading && (
          <span className="ml-2 animate-pulse text-xs text-gray-500">
            Đang tải…
          </span>
        )}
      </label>

      {error && (
        <div
          role="alert"
          className="mb-2 text-sm text-red-700 bg-red-50 p-2 rounded border border-red-200 flex items-start justify-between"
        >
          <span>⚠️ {error}</span>
          <button
            type="button"
            onClick={fetchAccounts}
            className="underline text-red-700 ml-3"
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
          <option value="">-- Chưa chọn tài khoản Proxy --</option>
          {accounts.map((acc) => {
            const optionValue = String(acc.id);
            const bank = (acc.bankName || "").toUpperCase();
            const holder = acc.accountHolder || "Chưa rõ người thụ hưởng";
            const number = acc.accountNumber || "—";
            const flags =
              (acc.isProxy ? "Proxy" : "Non-Proxy") +
              " • " +
              (acc.isRevenue ? "Revenue" : "Non-Revenue");

            return (
              <option key={optionValue} value={optionValue}>
                {bank} • {number} — {holder} • {flags}
              </option>
            );
          })}
        </select>
      )}

      {value && accounts.length > 0 && (
        <p className="mt-1 text-xs text-gray-600">
          Đã chọn:{" "}
          {accounts.find((a) => String(a.id) === String(value))?.accountNumber}{" "}
          (
          {accounts
            .find((a) => String(a.id) === String(value))
            ?.bankName?.toUpperCase()}
          )
        </p>
      )}
    </div>
  );
};

export default BankOrderList;
