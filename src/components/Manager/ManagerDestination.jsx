import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import destinationService from "../../Services/LeadSale/destinationService";

const ManagerDestination = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    destinationName: "",
  });

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const data = await destinationService.getDestinations();
      setDestinations(data);
    } catch (err) {
      console.error("Error:", err);
      toast.error("Có lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loadingToast = toast.loading(
      editingId ? "Đang cập nhật..." : "Đang tạo mới..."
    );

    try {
      if (editingId) {
        // Optimistic update
        setDestinations((prev) =>
          prev.map((item) =>
            item.destinationId === editingId ? { ...item, ...formData } : item
          )
        );

        await destinationService.updateDestination(editingId, formData);
        toast.success("Cập nhật thành công!", { id: loadingToast });
      } else {
        const newItem = await destinationService.createDestination(formData);

        // Add to list immediately
        setDestinations((prev) => [...prev, newItem]);
        toast.success("Tạo mới thành công!", { id: loadingToast });
      }

      setFormData({ destinationName: "" });
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      console.error("Error:", err);
      toast.error("Có lỗi xảy ra!", { id: loadingToast });

      // Revert optimistic update if needed
      if (editingId) {
        fetchDestinations();
      }
    }
  };

  const handleEdit = (item) => {
    setFormData({
      destinationName: item.destinationName,
    });
    setEditingId(item.destinationId);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa điểm đến này?")) {
      const loadingToast = toast.loading("Đang xóa...");

      try {
        // Optimistic delete
        setDestinations((prev) =>
          prev.filter((item) => item.destinationId !== id)
        );

        await destinationService.deleteDestination(id);
        toast.success("Xóa thành công!", { id: loadingToast });
      } catch (err) {
        console.error("Error deleting:", err);
        toast.error("Có lỗi xảy ra khi xóa!", { id: loadingToast });

        // Revert optimistic delete
        fetchDestinations();
      }
    }
  };

  const handleCancel = () => {
    setFormData({ destinationName: "" });
    setShowForm(false);
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="p-4">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            style: {
              background: "#10b981",
            },
          },
          error: {
            style: {
              background: "#ef4444",
            },
          },
        }}
      />

      <h1 className="text-2xl font-bold mb-4">Quản lý Điểm Đến</h1>

      {/* Add button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        {showForm ? "Hủy" : "Thêm mới"}
      </button>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded mb-4">
          <h3 className="text-lg font-medium mb-3">
            {editingId ? "Sửa điểm đến" : "Thêm mới điểm đến"}
          </h3>

          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Tên điểm đến:
            </label>
            <input
              type="text"
              name="destinationName"
              value={formData.destinationName}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              {editingId ? "Cập nhật" : "Lưu"}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Tên điểm đến</th>
            <th className="border border-gray-300 px-4 py-2">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {destinations.map((item) => (
            <tr key={item.destinationId}>
              <td className="border border-gray-300 px-4 py-2">
                {item.destinationId}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {item.destinationName}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(item.destinationId)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Xóa
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagerDestination;
