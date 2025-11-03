// src/Components/Manager/BankAccountList.jsx
import React, { useEffect, useMemo, useState } from "react";
import managerBankAccountService from "../../Services/Manager/managerBankAccountService";
import {
  RefreshCw,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Building2,
  AlertCircle,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

function BadgeYesNo({ value }) {
  return value ? (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
      <Check className="w-3 h-3" />
      Yes
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold">
      <X className="w-3 h-3" />
      No
    </span>
  );
}

export default function ManagerBankAccountList() {
  // data + ui
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // search, filters, sort, pagination
  const [q, setQ] = useState("");
  const [fProxy, setFProxy] = useState("all");
  const [sortBy, setSortBy] = useState({ key: "id", dir: "asc" });
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // dialogs
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // forms
  const emptyForm = {
    id: 0,
    bankName: "",
    accountHolder: "",
    accountNumber: "",
    isProxy: false,
    isRevenue: false,
  };
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const data = await managerBankAccountService.getAll();
      setRows(Array.isArray(data) ? data : []);
      setMessage(null);
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: "Không tải được danh sách tài khoản ngân hàng.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // filter + search + sort
  const filtered = useMemo(() => {
    let data = [...rows];
    const kw = q.trim().toLowerCase();
    if (kw) {
      data = data.filter(
        (r) =>
          String(r.bankName ?? "")
            .toLowerCase()
            .includes(kw) ||
          String(r.accountHolder ?? "")
            .toLowerCase()
            .includes(kw) ||
          String(r.accountNumber ?? "")
            .toLowerCase()
            .includes(kw)
      );
    }
    if (fProxy !== "all") {
      const v = fProxy === "yes";
      data = data.filter((r) => Boolean(r.isProxy) === v);
    }

    // sort
    data.sort((a, b) => {
      const { key, dir } = sortBy;
      const va = a?.[key];
      const vb = b?.[key];
      if (va == null && vb == null) return 0;
      if (va == null) return dir === "asc" ? -1 : 1;
      if (vb == null) return dir === "asc" ? 1 : -1;
      if (typeof va === "number" && typeof vb === "number") {
        return dir === "asc" ? va - vb : vb - va;
      }
      return dir === "asc"
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });
    return data;
  }, [rows, q, fProxy, sortBy]);

  // pagination slice
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  useEffect(() => setPage(1), [q, fProxy]);

  const changeSort = (key) => {
    setSortBy((prev) => {
      if (prev.key === key)
        return { key, dir: prev.dir === "asc" ? "desc" : "asc" };
      return { key, dir: "asc" };
    });
  };

  // actions
  const openCreate = () => {
    setForm(emptyForm);
    setShowCreate(true);
  };

  const doCreate = async () => {
    try {
      setSubmitting(true);
      await managerBankAccountService.create({ ...form, id: 0 });
      setShowCreate(false);
      setMessage({ type: "success", text: "✓ Tạo tài khoản thành công." });
      fetchAll();
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "✗ Tạo tài khoản thất bại." });
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = async (id) => {
    try {
      setSubmitting(true);
      const data = await managerBankAccountService.getById(id);
      setForm({
        id: data.id,
        bankName: data.bankName ?? "",
        accountHolder: data.accountHolder ?? "",
        accountNumber: data.accountNumber ?? "",
        isProxy: !!data.isProxy,
        isRevenue: !!data.isRevenue,
      });
      setShowEdit(true);
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: `✗ Không lấy được dữ liệu chỉnh sửa #${id}.`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const doEdit = async () => {
    try {
      setSubmitting(true);
      const { id, ...rest } = form;
      await managerBankAccountService.update(id, { id, ...rest });
      setShowEdit(false);
      setMessage({ type: "success", text: "✓ Cập nhật thành công." });
      fetchAll();
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "✗ Cập nhật thất bại." });
    } finally {
      setSubmitting(false);
    }
  };

  const openView = async (id) => {
    try {
      setSubmitting(true);
      const data = await managerBankAccountService.getById(id);
      setForm({
        id: data.id,
        bankName: data.bankName ?? "",
        accountHolder: data.accountHolder ?? "",
        accountNumber: data.accountNumber ?? "",
        isProxy: !!data.isProxy,
        isRevenue: !!data.isRevenue,
      });
      setShowView(true);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: `✗ Không lấy được chi tiết #${id}.` });
    } finally {
      setSubmitting(false);
    }
  };

  const askDelete = (id) => setDeleteId(id);

  const doDelete = async () => {
    if (!deleteId) return;
    try {
      setSubmitting(true);
      await managerBankAccountService.delete(deleteId);
      setDeleteId(null);
      setMessage({ type: "success", text: "✓ Đã xóa tài khoản." });
      fetchAll();
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: `✗ Xóa tài khoản #${deleteId} thất bại.`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Auto-dismiss messages after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const SortIcon = ({ columnKey }) => {
    if (sortBy.key !== columnKey) return null;
    return sortBy.dir === "asc" ? (
      <ChevronUp className="inline w-3 h-3 ml-1" />
    ) : (
      <ChevronDown className="inline w-3 h-3 ml-1" />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br p-4 md:p-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3 text-white">
              <Building2 className="w-8 h-8" />
              <h1 className="text-2xl md:text-3xl font-bold">
                Bank Accounts Management
              </h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => fetchAll()}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/90 backdrop-blur text-gray-700 rounded-lg hover:bg-white transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                {loading ? "Refreshing..." : "Refresh"}
              </button>
              <button
                onClick={openCreate}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-600 font-semibold rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                Thêm tài khoản nhận
              </button>
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 animate-slide-in ${
              message.type === "error"
                ? "bg-red-50 border-2 border-red-200 text-red-700"
                : "bg-green-50 border-2 border-green-200 text-green-700"
            }`}
          >
            {message.type === "error" ? (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <Check className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm kiểm tài khoản ..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 outline-none"
            />
          </div>
          <select
            value={fProxy}
            onChange={(e) => setFProxy(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 outline-none bg-white cursor-pointer"
          >
            <option value="all"> Proxy: All</option>
            <option value="yes"> Proxy: Yes</option>
            <option value="no"> Proxy: No</option>
          </select>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th
                    onClick={() => changeSort("id")}
                    className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    ID <SortIcon columnKey="id" />
                  </th>
                  <th
                    onClick={() => changeSort("bankName")}
                    className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    Bank Name <SortIcon columnKey="bankName" />
                  </th>
                  <th
                    onClick={() => changeSort("accountNumber")}
                    className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    Account Number <SortIcon columnKey="accountNumber" />
                  </th>
                  <th
                    onClick={() => changeSort("accountHolder")}
                    className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    Account Holder <SortIcon columnKey="accountHolder" />
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Proxy
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="text-center px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  // Loading skeleton
                  [...Array(6)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-8"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-28"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 bg-gray-200 rounded-full w-12"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 bg-gray-200 rounded-full w-12"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <div className="h-8 bg-gray-200 rounded w-16"></div>
                          <div className="h-8 bg-gray-200 rounded w-16"></div>
                          <div className="h-8 bg-gray-200 rounded w-16"></div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : pageData.length === 0 ? (
                  // Empty state
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        No Bank Accounts Found
                      </h3>
                      <p className="text-gray-500 mb-6">
                        {filtered.length === 0 && rows.length > 0
                          ? "No accounts match your filter criteria."
                          : "Get started by creating your first bank account."}
                      </p>
                      {rows.length === 0 && (
                        <button
                          onClick={openCreate}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Create First Account
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  // Data rows
                  pageData.map((r) => (
                    <tr
                      key={r.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700 font-semibold text-sm">
                          #{r.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-800">
                          {r.bankName}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm bg-gray-50 px-2 py-1 rounded text-gray-600">
                          {r.accountNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {r.accountHolder}
                      </td>
                      <td className="px-6 py-4">
                        <BadgeYesNo value={r.isProxy} />
                      </td>
                      <td className="px-6 py-4">
                        <BadgeYesNo value={r.isRevenue} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openView(r.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium text-sm"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </button>
                          <button
                            onClick={() => openEdit(r.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors font-medium text-sm"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => askDelete(r.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{pageData.length}</span>{" "}
              of <span className="font-semibold">{filtered.length}</span>{" "}
              records
              {filtered.length < rows.length && (
                <span className="text-gray-400">
                  {" "}
                  (filtered from {rows.length} total)
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* VIEW MODAL */}
        {showView && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
            onClick={() => setShowView(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full animate-slide-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200 rounded-t-2xl">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  Chi tiết tài khoản
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Tên ngân hàng
                  </label>
                  <p className="mt-1 text-lg font-medium text-gray-800">
                    {form.bankName || "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Số tài khoản
                  </label>
                  <p className="mt-1 font-mono text-lg bg-gray-50 px-3 py-2 rounded-lg text-gray-700">
                    {form.accountNumber || "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Tên chủ thẻ
                  </label>
                  <p className="mt-1 text-lg text-gray-800">
                    {form.accountHolder || "-"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Nhận tiền hàng
                    </label>
                    <div className="mt-2">
                      <BadgeYesNo value={form.isProxy} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Nhận tiền vận chuyển
                    </label>
                    <div className="mt-2">
                      <BadgeYesNo value={form.isRevenue} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-2xl flex justify-end">
                <button
                  onClick={() => setShowView(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CREATE MODAL */}
        {showCreate && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
            onClick={() => setShowCreate(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full animate-slide-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4 border-b border-gray-200 rounded-t-2xl">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  Thêm tài khoản ngân hàng
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên ngân hàng *
                  </label>
                  <input
                    type="text"
                    value={form.bankName}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, bankName: e.target.value }))
                    }
                    placeholder="e.g. ACB, Vietcombank, Techcombank..."
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên tài khoản *
                  </label>
                  <input
                    type="text"
                    value={form.accountHolder}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, accountHolder: e.target.value }))
                    }
                    placeholder="e.g. Nguyen Van A"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số tài khoản *
                  </label>
                  <input
                    type="text"
                    value={form.accountNumber}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, accountNumber: e.target.value }))
                    }
                    placeholder="e.g. 23323667"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 outline-none"
                  />
                </div>
                <div className="flex gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isProxy}
                      onChange={(e) =>
                        setForm((s) => ({ ...s, isProxy: e.target.checked }))
                      }
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Nhận tiền hàng
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isRevenue}
                      onChange={(e) =>
                        setForm((s) => ({ ...s, isRevenue: e.target.checked }))
                      }
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Nhận tiền vận chuyển
                    </span>
                  </label>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-2xl flex justify-end gap-3">
                <button
                  onClick={() => setShowCreate(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Hủy
                </button>
                <button
                  onClick={doCreate}
                  disabled={submitting}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Creating..." : "Tạo"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT MODAL */}
        {showEdit && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
            onClick={() => setShowEdit(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full animate-slide-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 border-b border-gray-200 rounded-t-2xl">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  Chỉnh sửa
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên ngân hàng
                  </label>
                  <input
                    type="text"
                    value={form.bankName}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, bankName: e.target.value }))
                    }
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all duration-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên chủ thẻ
                  </label>
                  <input
                    type="text"
                    value={form.accountHolder}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, accountHolder: e.target.value }))
                    }
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all duration-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số tài khoản
                  </label>
                  <input
                    type="text"
                    value={form.accountNumber}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, accountNumber: e.target.value }))
                    }
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all duration-200 outline-none"
                  />
                </div>
                <div className="flex gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isProxy}
                      onChange={(e) =>
                        setForm((s) => ({ ...s, isProxy: e.target.checked }))
                      }
                      className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Nhận tiền hàng
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isRevenue}
                      onChange={(e) =>
                        setForm((s) => ({ ...s, isRevenue: e.target.checked }))
                      }
                      className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Nhận vận chuyển
                    </span>
                  </label>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-2xl flex justify-end gap-3">
                <button
                  onClick={() => setShowEdit(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Thoát
                </button>
                <button
                  onClick={doEdit}
                  disabled={submitting}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Saving..." : "Lưu thay đổi"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DELETE CONFIRM MODAL */}
        {deleteId != null && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
            onClick={() => setDeleteId(null)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-slide-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-4 border-b border-gray-200 rounded-t-2xl">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  Xác nhận xóa
                </h2>
              </div>
              <div className="p-6 text-center">
                <Trash2 className="w-16 h-16 text-red-200 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Xóa tài khoản
                </h3>
                <p className="text-gray-600 mb-1">
                  Hành động không thể hoàn tác.
                </p>
              </div>
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-2xl flex justify-end gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Thoát
                </button>
                <button
                  onClick={doDelete}
                  disabled={submitting}
                  className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Xóa..." : "Xóa tài khoản"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
