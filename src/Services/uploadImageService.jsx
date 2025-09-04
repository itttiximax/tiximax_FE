// src/services/uploadImageService.js
import api from "../config/api";

const uploadImageService = {
  /**
   * Upload single image to server
   * @param {File} file - Image file to upload
   * @param {Object} options - Axios options (onUploadProgress, etc.)
   * @returns {Promise<Object>} Upload response
   */
  upload: async (file, options = {}) => {
    try {
      if (!file) {
        throw new Error("File is required");
      }

      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post("/images/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        ...options, // Spread options để nhận onUploadProgress và các config khác
      });

      // Debug: Log response để xem cấu trúc
      console.log("=== SERVICE DEBUG ===");
      console.log("Raw axios response:", response);
      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);
      console.log("Response data:", response.data);
      console.log("Response data type:", typeof response.data);

      if (response.data) {
        console.log("Data keys:", Object.keys(response.data));
      }
      console.log("=====================");

      return response.data;
    } catch (error) {
      console.error("Error uploading image:", error.response || error);
      throw error;
    }
  },

  /**
   * Upload multiple images to server
   * @param {File[]} files - Array of image files to upload
   * @param {Object} options - Axios options (onUploadProgress, etc.)
   * @returns {Promise<Object>} Upload response
   */
  uploadMultiple: async (files, options = {}) => {
    try {
      if (!files || files.length === 0) {
        throw new Error("At least one file is required");
      }

      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images", file); // BE cần key `images[]` thì sửa lại
      });

      const response = await api.post("/images/upload-multiple", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        ...options, // Spread options để nhận onUploadProgress
      });

      return response.data;
    } catch (error) {
      console.error(
        "Error uploading multiple images:",
        error.response || error
      );
      throw error;
    }
  },
};

export default uploadImageService;

// Backward compatibility: export function riêng
export const uploadSingleImage = uploadImageService.upload;
