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
} from "lucide-react";
import toast from "react-hot-toast";

function BadgeYesNo({ value }) {
  return value ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-200 text-emerald-700 text-xs font-medium border border-emerald-200">
      <Check className="w-3 h-3" />
      Yes
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200 text-slate-500 text-xs font-medium border border-slate-200">
      <X className="w-3 h-3" />
      No
    </span>
  );
}

const getErrorMessage = (err, fallback) => {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    fallback
  );
};

export default function ManagerBankAccountList() {
  // data + ui
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

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
    } catch (err) {
      toast.error(getErrorMessage(err, "Không tải được danh sách tài khoản."));
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
      toast.success("Tạo tài khoản ngân hàng thành công.");
      fetchAll();
    } catch (err) {
      toast.error(getErrorMessage(err, "Tạo tài khoản thất bại."));
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
      toast.error(
        getErrorMessage(err, `Không lấy được dữ liệu chỉnh sửa #${id}.`)
      );
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
      toast.success("Cập nhật tài khoản thành công.");
      fetchAll();
    } catch (err) {
      toast.error(getErrorMessage(err, "Cập nhật thất bại."));
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
      toast.error(
        getErrorMessage(err, `Không lấy được chi tiết tài khoản #${id}.`)
      );
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
      toast.success("Đã xóa tài khoản ngân hàng.");
      fetchAll();
    } catch (err) {
      toast.error(
        getErrorMessage(err, `Xóa tài khoản #${deleteId} không thành công.`)
      );
    } finally {
      setSubmitting(false);
    }
  };

  const SortIcon = ({ columnKey }) => {
    if (sortBy.key !== columnKey) return null;
    return sortBy.dir === "asc" ? (
      <span className="ml-1 text-xs">▲</span>
    ) : (
      <span className="ml-1 text-xs">▼</span>
    );
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="border border-blue-400 bg-blue-600 text-white rounded-xl px-5 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-semibold">
                Bank Accounts Management
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={fetchAll}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border bg-blue-500 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              {loading ? "Đang tải..." : "Làm mới"}
            </button>

            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border bg-blue-500 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Thêm tài khoản
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm theo ngân hàng, số tài khoản, chủ tài khoản..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 bg-white"
            />
          </div>
          <div className="md:col-span-1">
            <select
              value={fProxy}
              onChange={(e) => setFProxy(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 bg-white"
            >
              <option value="all">Proxy: Tất cả</option>
              <option value="yes">Proxy: Yes</option>
              <option value="no">Proxy: No</option>
            </select>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {/* <th
                    onClick={() => changeSort("id")}
                    className="text-left px-4 py-3 font-semibold text-slate-600 cursor-pointer"
                  >
                    ID <SortIcon columnKey="id" />
                  </th> */}
                  <th
                    onClick={() => changeSort("bankName")}
                    className="text-left px-4 py-3 font-semibold text-slate-600 cursor-pointer"
                  >
                    Bank Name <SortIcon columnKey="bankName" />
                  </th>
                  <th
                    onClick={() => changeSort("accountNumber")}
                    className="text-left px-4 py-3 font-semibold text-slate-600 cursor-pointer"
                  >
                    Account Number <SortIcon columnKey="accountNumber" />
                  </th>
                  <th
                    onClick={() => changeSort("accountHolder")}
                    className="text-left px-4 py-3 font-semibold text-slate-600 cursor-pointer"
                  >
                    Account Holder <SortIcon columnKey="accountHolder" />
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">
                    Proxy
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">
                    Revenue
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 py-3">
                        <div className="h-4 bg-slate-100 rounded w-8" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-4 bg-slate-100 rounded w-24" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-4 bg-slate-100 rounded w-32" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-4 bg-slate-100 rounded w-28" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-5 bg-slate-100 rounded-full w-14" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-5 bg-slate-100 rounded-full w-14" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <div className="h-8 bg-slate-100 rounded w-14" />
                          <div className="h-8 bg-slate-100 rounded w-14" />
                          <div className="h-8 bg-slate-100 rounded w-14" />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : pageData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <Building2 className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                      <h3 className="text-sm font-medium text-slate-800 mb-1">
                        Không có tài khoản nào
                      </h3>
                      <p className="text-xs text-slate-500 mb-4">
                        {filtered.length === 0 && rows.length > 0
                          ? "Không có tài khoản nào khớp với bộ lọc hiện tại."
                          : "Thêm tài khoản ngân hàng đầu tiên để bắt đầu sử dụng."}
                      </p>
                      {rows.length === 0 && (
                        <button
                          onClick={openCreate}
                          className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                          <Plus className="w-4 h-4" />
                          Thêm tài khoản
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  pageData.map((r) => (
                    <tr
                      key={r.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      {/* <td className="px-4 py-3 align-middle">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                          #{r.id}
                        </span>
                      </td> */}
                      <td className="px-4 py-3 align-middle">
                        <span className="font-medium text-slate-900">
                          {r.bankName}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <span className="font-mono text-xs bg-slate-50 px-2 py-1 rounded border border-slate-100 text-slate-700">
                          {r.accountNumber}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-middle text-slate-700">
                        {r.accountHolder}
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <BadgeYesNo value={r.isProxy} />
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <BadgeYesNo value={r.isRevenue} />
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openView(r.id)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white hover:bg-slate-50"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </button>
                          <button
                            onClick={() => openEdit(r.id)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs border border-amber-200 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => askDelete(r.id)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs border border-red-200 rounded-lg bg-red-50 hover:bg-red-100 text-red-700"
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
          <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-slate-600">
            <div>
              Hiển thị <span className="font-semibold">{pageData.length}</span>{" "}
              / <span className="font-semibold">{filtered.length}</span> bản ghi
              {filtered.length < rows.length && (
                <span className="text-slate-400">
                  {" "}
                  (lọc từ {rows.length} tổng số)
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span>
                Trang {page} / {totalPages}
              </span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Trước
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50"
                >
                  Sau
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* VIEW MODAL */}
        {showView && (
          <div
            className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50"
            onClick={() => setShowView(false)}
          >
            <div
              className="bg-white rounded-xl shadow-xl max-w-lg w-full border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">
                  Chi tiết tài khoản
                </h2>
                <button
                  onClick={() => setShowView(false)}
                  className="p-1 rounded hover:bg-slate-100"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              <div className="p-5 space-y-4 text-sm">
                <div>
                  <div className="text-xs font-medium text-slate-500 mb-1">
                    Tên ngân hàng
                  </div>
                  <div className="text-base font-medium text-slate-900">
                    {form.bankName || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-500 mb-1">
                    Số tài khoản
                  </div>
                  <div className="font-mono text-sm bg-slate-50 px-3 py-2 rounded border border-slate-100 text-slate-800">
                    {form.accountNumber || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-500 mb-1">
                    Tên chủ thẻ
                  </div>
                  <div className="text-sm text-slate-900">
                    {form.accountHolder || "-"}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <div className="text-xs font-medium text-slate-500 mb-1">
                      Nhận tiền hàng
                    </div>
                    <BadgeYesNo value={form.isProxy} />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-500 mb-1">
                      Nhận tiền vận chuyển
                    </div>
                    <BadgeYesNo value={form.isRevenue} />
                  </div>
                </div>
              </div>
              <div className="px-5 py-3 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setShowView(false)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
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
            className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50"
            onClick={() => setShowCreate(false)}
          >
            <div
              className="bg-white rounded-xl shadow-xl max-w-lg w-full border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">
                  Thêm tài khoản ngân hàng
                </h2>
                <button
                  onClick={() => setShowCreate(false)}
                  className="p-1 rounded hover:bg-slate-100"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              <div className="p-5 space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Tên ngân hàng *
                  </label>
                  <input
                    type="text"
                    value={form.bankName}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, bankName: e.target.value }))
                    }
                    placeholder="ACB, Vietcombank, Techcombank..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Tên tài khoản *
                  </label>
                  <input
                    type="text"
                    value={form.accountHolder}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, accountHolder: e.target.value }))
                    }
                    placeholder="Nguyen Van A"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Số tài khoản *
                  </label>
                  <input
                    type="text"
                    value={form.accountNumber}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, accountNumber: e.target.value }))
                    }
                    placeholder="23323667"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
                  />
                </div>
                <div className="flex gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={form.isProxy}
                      onChange={(e) =>
                        setForm((s) => ({ ...s, isProxy: e.target.checked }))
                      }
                      className="w-4 h-4 text-indigo-600 border-slate-300 rounded"
                    />
                    Nhận tiền hàng
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={form.isRevenue}
                      onChange={(e) =>
                        setForm((s) => ({
                          ...s,
                          isRevenue: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 text-indigo-600 border-slate-300 rounded"
                    />
                    Nhận tiền vận chuyển
                  </label>
                </div>
              </div>
              <div className="px-5 py-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  onClick={() => setShowCreate(false)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  onClick={doCreate}
                  disabled={submitting}
                  className="px-4 py-1.5 text-xs rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  {submitting ? "Đang tạo..." : "Tạo"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT MODAL */}
        {showEdit && (
          <div
            className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50"
            onClick={() => setShowEdit(false)}
          >
            <div
              className="bg-white rounded-xl shadow-xl max-w-lg w-full border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">
                  Chỉnh sửa tài khoản
                </h2>
                <button
                  onClick={() => setShowEdit(false)}
                  className="p-1 rounded hover:bg-slate-100"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              <div className="p-5 space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Tên ngân hàng
                  </label>
                  <input
                    type="text"
                    value={form.bankName}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, bankName: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Tên chủ thẻ
                  </label>
                  <input
                    type="text"
                    value={form.accountHolder}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, accountHolder: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Số tài khoản
                  </label>
                  <input
                    type="text"
                    value={form.accountNumber}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, accountNumber: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
                  />
                </div>
                <div className="flex gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={form.isProxy}
                      onChange={(e) =>
                        setForm((s) => ({ ...s, isProxy: e.target.checked }))
                      }
                      className="w-4 h-4 text-amber-600 border-slate-300 rounded"
                    />
                    Nhận tiền hàng
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={form.isRevenue}
                      onChange={(e) =>
                        setForm((s) => ({
                          ...s,
                          isRevenue: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 text-amber-600 border-slate-300 rounded"
                    />
                    Nhận vận chuyển
                  </label>
                </div>
              </div>
              <div className="px-5 py-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  onClick={() => setShowEdit(false)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
                >
                  Thoát
                </button>
                <button
                  onClick={doEdit}
                  disabled={submitting}
                  className="px-4 py-1.5 text-xs rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                  {submitting ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DELETE CONFIRM MODAL */}
        {deleteId != null && (
          <div
            className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50"
            onClick={() => setDeleteId(null)}
          >
            <div
              className="bg-white rounded-xl shadow-xl max-w-sm w-full border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">
                  Xác nhận xóa
                </h2>
                <button
                  onClick={() => setDeleteId(null)}
                  className="p-1 rounded hover:bg-slate-100"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              <div className="p-5 text-center text-sm">
                <Trash2 className="w-10 h-10 text-red-200 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-slate-900 mb-1">
                  Xóa tài khoản ngân hàng
                </h3>
                <p className="text-xs text-slate-600">
                  Hành động này không thể hoàn tác. Bạn có chắc muốn xóa?
                </p>
              </div>
              <div className="px-5 py-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  onClick={doDelete}
                  disabled={submitting}
                  className="px-4 py-1.5 text-xs rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                >
                  {submitting ? "Đang xóa..." : "Xóa tài khoản"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
