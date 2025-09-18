// src/Services/SharedService/websiteService.jsx
import api from "../../config/api.js";

const API_URL = "/website";

const websiteService = {
  // Lấy tất cả website
  getAllWebsite: async (token) => {
    try {
      const response = await api.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching websites:", error);
      throw error;
    }
  },

  // Lấy website theo ID
  getWebsiteById: async (id, token) => {
    if (!id) throw new Error("Website ID is required");
    try {
      const response = await api.get(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching website by ID:", error);
      throw error;
    }
  },

  // Tạo website mới
  createWebsite: async (data, token) => {
    try {
      const response = await api.post(API_URL, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating website:", error);
      throw error;
    }
  },

  // Cập nhật website theo ID
  updateWebsite: async (id, data, token) => {
    if (!id) throw new Error("Website ID is required for update");
    try {
      const response = await api.put(`${API_URL}/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating website:", error);
      throw error;
    }
  },

  // Xoá website theo ID
  deleteWebsite: async (id, token) => {
    if (!id) throw new Error("Website ID is required for delete");
    try {
      const response = await api.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting website:", error);
      throw error;
    }
  },
};

export default websiteService;
