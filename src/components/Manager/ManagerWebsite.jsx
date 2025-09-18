// src/AdminComponent/Website/ManagerWebsite.jsx
import React, { useEffect, useState } from "react";
import websiteService from "../../Services/SharedService/websiteService";

const ManagerWebsite = ({ token }) => {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingWebsite, setEditingWebsite] = useState(null);
  const [formData, setFormData] = useState({ websiteId: "", websiteName: "" });

  // Fetch website list
  const fetchWebsites = async () => {
    setLoading(true);
    try {
      const data = await websiteService.getAllWebsite(token);
      setWebsites(data);
    } catch (error) {
      console.error("Error fetching websites:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebsites();
  }, []);

  const handleOpen = (website = null) => {
    setEditingWebsite(website);
    setFormData(website || { websiteId: "", websiteName: "" });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingWebsite(null);
    setFormData({ websiteId: "", websiteName: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editingWebsite) {
        await websiteService.updateWebsite(
          editingWebsite.websiteId,
          formData,
          token
        );
      } else {
        await websiteService.createWebsite(formData, token);
      }
      fetchWebsites();
      handleClose();
    } catch (error) {
      console.error("Error saving website:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xoá website này?")) {
      try {
        await websiteService.deleteWebsite(id, token);
        fetchWebsites();
      } catch (error) {
        console.error("Error deleting website:", error);
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Quản Lý Website</h2>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
        onClick={() => handleOpen()}
      >
        Thêm Website
      </button>

      {loading ? (
        <div className="flex justify-center mt-6">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="overflow-x-auto mt-4">
          <table className="w-full border-collapse border border-gray-200 shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-200 px-4 py-2 text-left">
                  ID
                </th>
                <th className="border border-gray-200 px-4 py-2 text-left">
                  Tên Website
                </th>
                <th className="border border-gray-200 px-4 py-2 text-right">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {websites.length > 0 ? (
                websites.map((w) => (
                  <tr key={w.websiteId} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2">
                      {w.websiteId}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {w.websiteName}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-right">
                      <button
                        className="text-blue-600 hover:underline mr-3"
                        onClick={() => handleOpen(w)}
                      >
                        Sửa
                      </button>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => handleDelete(w.websiteId)}
                      >
                        Xoá
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center py-4 text-gray-500 italic"
                  >
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Dialog */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              {editingWebsite ? "Cập Nhật Website" : "Thêm Website"}
            </h3>

            <input
              type="text"
              name="websiteName"
              placeholder="Tên Website"
              value={formData.websiteName}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                onClick={handleClose}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleSubmit}
              >
                {editingWebsite ? "Cập Nhật" : "Thêm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerWebsite;
