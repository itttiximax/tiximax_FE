import api from "../config/api";

const uploadImageService = {
  /**
   * Upload single image to server
   * @param {File} file - Image file to upload
   * @param {Object} options - Axios options (onUploadProgress, etc.)
   * @returns {Promise<Object>} Upload response
   */
  upload: async (file, options = {}) => {
    if (!file) {
      throw new Error("File is required");
    }

    const formData = new FormData();
    formData.append("image", file);

    const response = await api.post("/images/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      ...options,
    });

    return response.data;
  },

  /**
   * Upload multiple images to server
   * @param {File[]} files - Array of image files to upload
   * @param {Object} options - Axios options (onUploadProgress, etc.)
   * @returns {Promise<Object>} Upload response
   */
  uploadMultiple: async (files, options = {}) => {
    if (!files || files.length === 0) {
      throw new Error("At least one file is required");
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    const response = await api.post("/images/upload-multiple", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      ...options,
    });

    return response.data;
  },

  /**
   * Delete single image by ID
   * @param {string} imageId - Image ID to delete
   * @returns {Promise<Object>} Delete response
   */
  delete: async (imageId) => {
    if (!imageId) {
      throw new Error("Image ID is required");
    }

    const response = await api.delete(`/images/${imageId}`);
    return response.data;
  },

  /**
   * Delete single image by URL
   * @param {string} imageUrl - Full URL or path of the image to delete
   * @returns {Promise<Object>} Delete response
   */
  deleteByUrl: async (imageUrl) => {
    if (!imageUrl) {
      throw new Error("Image URL is required");
    }

    const response = await api.delete(`/images/delete-image`, {
      params: { filePath: imageUrl },
    });

    return response.data;
  },

  /**
   * Get image info by ID
   * @param {string} imageId - Image ID
   * @returns {Promise<Object>} Image information
   */
  getInfo: async (imageId) => {
    if (!imageId) {
      throw new Error("Image ID is required");
    }

    const response = await api.get(`/images/${imageId}`);
    return response.data;
  },

  /**
   * Get all images with pagination
   * @param {Object} params - Query parameters (page, limit, sort, etc.)
   * @returns {Promise<Object>} Paginated images response
   */
  getAll: async (params = {}) => {
    const response = await api.get("/images", { params });
    return response.data;
  },
};

export default uploadImageService;

// Backward compatibility exports
export const uploadSingleImage = uploadImageService.upload;
export const deleteImage = uploadImageService.delete;
export const deleteImageByUrl = uploadImageService.deleteByUrl;
