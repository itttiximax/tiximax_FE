// src/Services/Warehouse/warehouseService.js
import api from "../../config/api";

const warehouseService = {
  /**
   * Get ready warehouses with pagination
   * @param {number} page - Page number (default: 0)
   * @param {number} size - Page size (default: 20)
   * @returns {Promise<any>}
   */
  getReadyWarehouses: async (page = 0, size = 20) => {
    try {
      const response = await api.get(
        `/warehouse/${page}/${size}/ready-warehouses?size=${size}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching ready warehouses:",
        error?.response || error
      );
      throw error;
    }
  },

  /**
   * Update/confirm a warehouse package by its code (PUT method)
   * (JWT tự gắn qua axios interceptor)
   * @param {string} code - e.g. "C123456"
   * @param {{length:number, width:number, height:number, weight:number, image?:string}} body
   * @returns {Promise<any>}
   */
  updateWarehousePackage: async (code, body) => {
    try {
      if (!code || typeof code !== "string") {
        throw new Error("Warehouse code is required (string).");
      }
      if (!body || typeof body !== "object") {
        throw new Error("Body is required (object).");
      }
      const { length, width, height, weight } = body;
      if (
        [length, width, height, weight].some(
          (v) => v === undefined || v === null || isNaN(Number(v))
        )
      ) {
        throw new Error("length, width, height, weight are required numbers.");
      }
      const response = await api.put(
        `/warehouse/${encodeURIComponent(code)}`,
        {
          length: Number(length),
          width: Number(width),
          height: Number(height),
          weight: Number(weight),
          image: body.image ?? "",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error updating warehouse package:",
        error?.response || error
      );
      throw error;
    }
  },

  /**
   * Patch/update a warehouse package by its code (PATCH method)
   * @param {string} code - e.g. "XYZ123"
   * @param {{length?:number, width?:number, height?:number, weight?:number, image?:string, imageCheck?:string}} body
   * @returns {Promise<any>}
   */
  patchWarehousePackage: async (code, body) => {
    try {
      if (!code || typeof code !== "string") {
        throw new Error("Warehouse code is required (string).");
      }
      if (!body || typeof body !== "object") {
        throw new Error("Body is required (object).");
      }

      // Validate và convert số nếu có
      const payload = {};
      if (body.length !== undefined) payload.length = Number(body.length);
      if (body.width !== undefined) payload.width = Number(body.width);
      if (body.height !== undefined) payload.height = Number(body.height);
      if (body.weight !== undefined) payload.weight = Number(body.weight);
      if (body.image !== undefined) payload.image = body.image;
      if (body.imageCheck !== undefined) payload.imageCheck = body.imageCheck;

      const response = await api.patch(
        `/warehouse/${encodeURIComponent(code)}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error patching warehouse package:",
        error?.response || error
      );
      throw error;
    }
  },

  checkNetWeight: async (code) => {
    try {
      if (!code || typeof code !== "string") {
        throw new Error("Warehouse code is required (string).");
      }
      const response = await api.get(
        `/warehouse/check-netweight/${encodeURIComponent(code)}`
      );
      // API trả về true/false
      return response.data; // true = đã cân ký, false = chưa cân ký
    } catch (error) {
      console.error("Error checking net weight:", error?.response || error);
      throw error;
    }
  },

  getWarehouseById: async (warehouseId) => {
    try {
      if (warehouseId === undefined || warehouseId === null) {
        throw new Error("warehouseId is required.");
      }
      const response = await api.get(
        `/warehouse/${encodeURIComponent(warehouseId)}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching warehouse by ID (${warehouseId}):`,
        error?.response || error
      );
      throw error;
    }
  },
};

export default warehouseService;
