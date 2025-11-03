// src/Components/Manager/BankAccountList.jsx
import React, { useEffect, useMemo, useState } from "react";
import managerBankAccountService from "../../Services/Manager/managerBankAccountService";

const styles = {
  page: {
    padding: 16,
    maxWidth: 1100,
    margin: "0 auto",
    fontFamily: "Inter, system-ui, Arial, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: { fontSize: 22, fontWeight: 700, margin: 0 },
  toolbar: { display: "flex", gap: 8, flexWrap: "wrap" },
  btn: {
    background: "#f8f8f8",
    border: "1px solid #ddd",
    padding: "8px 12px",
    borderRadius: 8,
    cursor: "pointer",
  },
  btnPrimary: {
    background: "#0f62fe",
    color: "#fff",
    border: "1px solid #0f62fe",
    padding: "8px 12px",
    borderRadius: 8,
    cursor: "pointer",
  },
  btnDanger: {
    background: "#fff5f5",
    color: "#d11a2a",
    border: "1px solid #ffd5d9",
    padding: "6px 10px",
    borderRadius: 6,
    cursor: "pointer",
  },
  controls: {
    display: "grid",
    gridTemplateColumns: "1fr 200px 200px",
    gap: 8,
    marginBottom: 12,
  },
  input: {
    width: "100%",
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: "10px 12px",
    outline: "none",
  },
  select: {
    width: "100%",
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: "10px 12px",
    background: "#fff",
  },
  card: {
    border: "1px solid #eee",
    borderRadius: 12,
    boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
    overflow: "hidden",
    background: "#fff",
  },
  tableWrap: { overflowX: "auto" },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    fontSize: 14,
  },
  th: {
    background: "#fafafa",
    textAlign: "left",
    padding: "10px 12px",
    borderBottom: "1px solid #eee",
    position: "sticky",
    top: 0,
    zIndex: 1,
    cursor: "pointer",
    userSelect: "none",
  },
  td: {
    padding: "10px 12px",
    borderBottom: "1px solid #f0f0f0",
    verticalAlign: "middle",
  },
  badgeYes: {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 999,
    background: "#e7f5ff",
    color: "#1971c2",
    border: "1px solid #d0ebff",
    fontSize: 12,
  },
  badgeNo: {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 999,
    background: "#fff5f5",
    color: "#c92a2a",
    border: "1px solid #ffd5d9",
    fontSize: 12,
  },
  actions: { display: "flex", gap: 6, flexWrap: "wrap" },
  pagination: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  statusBar: {
    margin: "8px 0",
    fontSize: 13,
    padding: "8px 12px",
    borderRadius: 8,
    background: "#f6ffed",
    border: "1px solid #b7eb8f",
    color: "#389e0d",
  },
  statusBarError: {
    margin: "8px 0",
    fontSize: 13,
    padding: "8px 12px",
    borderRadius: 8,
    background: "#fff2f0",
    border: "1px solid #ffccc7",
    color: "#cf1322",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    zIndex: 50,
  },
  modal: {
    width: "100%",
    maxWidth: 560,
    background: "#fff",
    borderRadius: 12,
    border: "1px solid #eee",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    overflow: "hidden",
  },
  modalHd: {
    padding: "14px 16px",
    borderBottom: "1px solid #f0f0f0",
    fontWeight: 600,
  },
  modalBd: { padding: 16, display: "grid", gap: 12 },
  modalFt: {
    padding: 16,
    borderTop: "1px solid #f0f0f0",
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
  },
  formRow: { display: "grid", gap: 6 },
  label: { fontSize: 13, color: "#555" },
  checkboxRow: {
    display: "flex",
    gap: 16,
    alignItems: "center",
    flexWrap: "wrap",
  },
  small: { fontSize: 12, color: "#999" },
};

function BadgeYesNo({ value }) {
  return (
    <span style={value ? styles.badgeYes : styles.badgeNo}>
      {value ? "Yes" : "No"}
    </span>
  );
}

export default function BankAccountList() {
  // data + ui
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // search, filters, sort, pagination
  const [q, setQ] = useState("");
  const [fProxy, setFProxy] = useState("all");
  const [fRevenue, setFRevenue] = useState("all");
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
    if (fRevenue !== "all") {
      const v = fRevenue === "yes";
      data = data.filter((r) => Boolean(r.isRevenue) === v);
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
  }, [rows, q, fProxy, fRevenue, sortBy]);

  // pagination slice
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  useEffect(() => setPage(1), [q, fProxy, fRevenue]);

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
      setMessage({ type: "success", text: "Tạo tài khoản thành công." });
      fetchAll();
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Tạo tài khoản thất bại." });
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
        text: `Không lấy được dữ liệu chỉnh sửa #${id}.`,
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
      setMessage({ type: "success", text: "Cập nhật thành công." });
      fetchAll();
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Cập nhật thất bại." });
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
      setMessage({ type: "error", text: `Không lấy được chi tiết #${id}.` });
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
      setMessage({ type: "success", text: "Đã xóa tài khoản." });
      fetchAll();
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: `Xóa tài khoản #${deleteId} thất bại.`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2 style={styles.title}>Bank Accounts</h2>
        <div style={styles.toolbar}>
          <button
            style={styles.btn}
            onClick={() => fetchAll()}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
          <button style={styles.btnPrimary} onClick={openCreate}>
            New
          </button>
        </div>
      </div>

      {message && (
        <div
          style={
            message.type === "error" ? styles.statusBarError : styles.statusBar
          }
        >
          {message.text}
        </div>
      )}

      <div style={styles.controls}>
        <input
          style={styles.input}
          placeholder="Tìm theo ngân hàng / chủ TK / số TK..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          style={styles.select}
          value={fProxy}
          onChange={(e) => setFProxy(e.target.value)}
        >
          <option value="all">Proxy: All</option>
          <option value="yes">Proxy: Yes</option>
          <option value="no">Proxy: No</option>
        </select>
        <select
          style={styles.select}
          value={fRevenue}
          onChange={(e) => setFRevenue(e.target.value)}
        >
          <option value="all">Revenue: All</option>
          <option value="yes">Revenue: Yes</option>
          <option value="no">Revenue: No</option>
        </select>
      </div>

      <div style={styles.card}>
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th} onClick={() => changeSort("id")}>
                  #{" "}
                  {sortBy.key === "id"
                    ? sortBy.dir === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th style={styles.th} onClick={() => changeSort("bankName")}>
                  Bank{" "}
                  {sortBy.key === "bankName"
                    ? sortBy.dir === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th
                  style={styles.th}
                  onClick={() => changeSort("accountNumber")}
                >
                  Account No.{" "}
                  {sortBy.key === "accountNumber"
                    ? sortBy.dir === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th
                  style={styles.th}
                  onClick={() => changeSort("accountHolder")}
                >
                  Holder{" "}
                  {sortBy.key === "accountHolder"
                    ? sortBy.dir === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th style={styles.th}>Proxy</th>
                <th style={styles.th}>Revenue</th>
                <th style={{ ...styles.th, textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}>
                    <td style={styles.td} colSpan={7}>
                      Đang tải...
                    </td>
                  </tr>
                ))
              ) : pageData.length === 0 ? (
                <tr>
                  <td style={styles.td} colSpan={7}>
                    Chưa có dữ liệu. Hãy bấm <b>New</b> để tạo tài khoản đầu
                    tiên.
                  </td>
                </tr>
              ) : (
                pageData.map((r) => (
                  <tr key={r.id} style={{ transition: "background .15s" }}>
                    <td style={styles.td}>
                      <b>{r.id}</b>
                    </td>
                    <td style={styles.td}>{r.bankName}</td>
                    <td
                      style={{
                        ...styles.td,
                        fontFamily: "ui-monospace, Menlo, monospace",
                      }}
                    >
                      {r.accountNumber}
                    </td>
                    <td style={styles.td}>{r.accountHolder}</td>
                    <td style={styles.td}>
                      <BadgeYesNo value={r.isProxy} />
                    </td>
                    <td style={styles.td}>
                      <BadgeYesNo value={r.isRevenue} />
                    </td>
                    <td style={{ ...styles.td, textAlign: "right" }}>
                      <div style={styles.actions}>
                        <button
                          style={styles.btn}
                          onClick={() => openView(r.id)}
                        >
                          View
                        </button>
                        <button
                          style={styles.btn}
                          onClick={() => openEdit(r.id)}
                        >
                          Edit
                        </button>
                        <button
                          style={styles.btnDanger}
                          onClick={() => askDelete(r.id)}
                        >
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
        <div style={styles.pagination}>
          <div style={styles.small}>
            Page <b>{page}</b> of {totalPages} — {filtered.length} record(s)
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              style={styles.btn}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              ◀ Prev
            </button>
            <button
              style={styles.btn}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Next ▶
            </button>
          </div>
        </div>
      </div>

      {/* VIEW MODAL */}
      {showView && (
        <div style={styles.overlay} onClick={() => setShowView(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHd}>Account Detail</div>
            <div style={styles.modalBd}>
              <div>
                <span style={styles.label}>ID</span>
                <div>
                  <b>{form.id}</b>
                </div>
              </div>
              <div>
                <span style={styles.label}>Bank</span>
                <div>{form.bankName || "-"}</div>
              </div>
              <div>
                <span style={styles.label}>Account No.</span>
                <div style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
                  {form.accountNumber || "-"}
                </div>
              </div>
              <div>
                <span style={styles.label}>Holder</span>
                <div>{form.accountHolder || "-"}</div>
              </div>
              <div>
                <span style={styles.label}>Proxy</span>
                <div>
                  <BadgeYesNo value={form.isProxy} />
                </div>
              </div>
              <div>
                <span style={styles.label}>Revenue</span>
                <div>
                  <BadgeYesNo value={form.isRevenue} />
                </div>
              </div>
            </div>
            <div style={styles.modalFt}>
              <button style={styles.btn} onClick={() => setShowView(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      {showCreate && (
        <div style={styles.overlay} onClick={() => setShowCreate(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHd}>New Bank Account</div>
            <div style={styles.modalBd}>
              <div style={styles.formRow}>
                <label style={styles.label}>Bank name</label>
                <input
                  style={styles.input}
                  value={form.bankName}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, bankName: e.target.value }))
                  }
                  placeholder="ACB, Vietcombank..."
                />
              </div>
              <div style={styles.formRow}>
                <label style={styles.label}>Account holder</label>
                <input
                  style={styles.input}
                  value={form.accountHolder}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, accountHolder: e.target.value }))
                  }
                  placeholder="Nguyen Van A"
                />
              </div>
              <div style={styles.formRow}>
                <label style={styles.label}>Account number</label>
                <input
                  style={styles.input}
                  value={form.accountNumber}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, accountNumber: e.target.value }))
                  }
                  placeholder="123456789"
                />
              </div>
              <div style={styles.checkboxRow}>
                <label>
                  <input
                    type="checkbox"
                    checked={form.isProxy}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, isProxy: e.target.checked }))
                    }
                  />{" "}
                  isProxy
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={form.isRevenue}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, isRevenue: e.target.checked }))
                    }
                  />{" "}
                  isRevenue
                </label>
              </div>
              <div style={styles.small}>
                Tip: Bạn có thể sửa lại sau ở phần Edit.
              </div>
            </div>
            <div style={styles.modalFt}>
              <button style={styles.btn} onClick={() => setShowCreate(false)}>
                Cancel
              </button>
              <button
                style={styles.btnPrimary}
                onClick={doCreate}
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEdit && (
        <div style={styles.overlay} onClick={() => setShowEdit(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHd}>Edit Account #{form.id}</div>
            <div style={styles.modalBd}>
              <div style={styles.formRow}>
                <label style={styles.label}>Bank name</label>
                <input
                  style={styles.input}
                  value={form.bankName}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, bankName: e.target.value }))
                  }
                />
              </div>
              <div style={styles.formRow}>
                <label style={styles.label}>Account holder</label>
                <input
                  style={styles.input}
                  value={form.accountHolder}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, accountHolder: e.target.value }))
                  }
                />
              </div>
              <div style={styles.formRow}>
                <label style={styles.label}>Account number</label>
                <input
                  style={styles.input}
                  value={form.accountNumber}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, accountNumber: e.target.value }))
                  }
                />
              </div>
              <div style={styles.checkboxRow}>
                <label>
                  <input
                    type="checkbox"
                    checked={form.isProxy}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, isProxy: e.target.checked }))
                    }
                  />{" "}
                  isProxy
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={form.isRevenue}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, isRevenue: e.target.checked }))
                    }
                  />{" "}
                  isRevenue
                </label>
              </div>
            </div>
            <div style={styles.modalFt}>
              <button style={styles.btn} onClick={() => setShowEdit(false)}>
                Cancel
              </button>
              <button
                style={styles.btnPrimary}
                onClick={doEdit}
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteId != null && (
        <div style={styles.overlay} onClick={() => setDeleteId(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHd}>Xóa tài khoản?</div>
            <div style={styles.modalBd}>
              Bạn có chắc muốn xóa tài khoản ID <b>{deleteId}</b>?<br />
              <span style={styles.small}>
                Hành động này không thể hoàn tác.
              </span>
            </div>
            <div style={styles.modalFt}>
              <button style={styles.btn} onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button
                style={styles.btnDanger}
                onClick={doDelete}
                disabled={submitting}
              >
                {submitting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
