import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  getAllProductTypes,
  createProductType,
  updateProductType,
  deleteProductType,
} from "../../Services/LeadSale/productTypeService";

const ManagerProductType = () => {
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    productTypeName: "",
    fee: false,
  });

  useEffect(() => {
    fetchProductTypes();
  }, []);

  const fetchProductTypes = async () => {
    try {
      setLoading(true);
      const data = await getAllProductTypes();
      setProductTypes(data);
    } catch (err) {
      console.error("Error:", err);
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
        const updatedData = {
          productTypeId: editingId,
          ...formData,
        };

        // Optimistic update
        setProductTypes((prev) =>
          prev.map((item) =>
            item.productTypeId === editingId ? { ...item, ...formData } : item
          )
        );

        await updateProductType(editingId, updatedData);
        toast.success("Cập nhật thành công!", { id: loadingToast });
      } else {
        const newItem = await createProductType(formData);

        // Add to list immediately
        setProductTypes((prev) => [...prev, newItem]);
        toast.success("Tạo mới thành công!", { id: loadingToast });
      }

      setFormData({ productTypeName: "", fee: false });
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      console.error("Error:", err);
      toast.error("Có lỗi xảy ra!", { id: loadingToast });

      // Revert optimistic update if needed
      if (editingId) {
        fetchProductTypes();
      }
    }
  };

  const handleEdit = (item) => {
    setFormData({
      productTypeName: item.productTypeName,
      fee: item.fee,
    });
    setEditingId(item.productTypeId);
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData({ productTypeName: "", fee: false });
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa loại sản phẩm này?")) {
      const loadingToast = toast.loading("Đang xóa...");

      try {
        // Optimistic delete - remove from UI immediately
        setProductTypes((prev) =>
          prev.filter((item) => item.productTypeId !== id)
        );

        await deleteProductType(id);
        toast.success("Xóa thành công!", { id: loadingToast });
      } catch (err) {
        console.error("Error deleting:", err);
        toast.error("Có lỗi xảy ra khi xóa!", { id: loadingToast });

        // Revert optimistic delete
        fetchProductTypes();
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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

      <h1 className="text-2xl font-bold mb-4">Quản lý loại sản phẩm</h1>

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
            {editingId ? "Sửa loại sản phẩm" : "Thêm mới loại sản phẩm"}
          </h3>

          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Tên loại sản phẩm:
            </label>
            <input
              type="text"
              name="productTypeName"
              value={formData.productTypeName}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="mb-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="fee"
                checked={formData.fee}
                onChange={handleInputChange}
                className="mr-2"
              />
              Có phí
            </label>
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
            <th className="border border-gray-300 px-4 py-2">Tên</th>
            <th className="border border-gray-300 px-4 py-2">Phí</th>
            <th className="border border-gray-300 px-4 py-2">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {productTypes.map((item) => (
            <tr key={item.productTypeId}>
              <td className="border border-gray-300 px-4 py-2">
                {item.productTypeId}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {item.productTypeName}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {item.fee ? "Có phí" : "Miễn phí"}
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
                    onClick={() => handleDelete(item.productTypeId)}
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

export default ManagerProductType;
