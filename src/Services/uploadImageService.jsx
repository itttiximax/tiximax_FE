// src/services/uploadImageService.js
import api from "../config/api";

const uploadImageService = {
  // Upload 1 ảnh
  upload: async (file) => {
    try {
      if (!file) {
        throw new Error("File is required");
      }

      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post("/images/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;
    } catch (error) {
      console.error("Error uploading image:", error.response || error);
      throw error;
    }
  },

  // Nếu sau này có thể upload nhiều ảnh 1 lúc
  uploadMultiple: async (files) => {
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
