import api from "../../config/api.js";
import { getToken } from "../Auth/authService.js";

export const getAllProductTypes = async () => {
  try {
    const token = getToken();
    const response = await api.get("/product-type", {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "*/*",
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Failed to fetch product types:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createProductType = async (productTypeData) => {
  try {
    const token = getToken();
    const response = await api.post("/product-type", productTypeData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        accept: "*/*",
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Failed to create product type:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getProductTypeById = async (id) => {
  try {
    const token = getToken();
    const response = await api.get(`/product-type/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "*/*",
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Failed to fetch product type by id:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateProductType = async (id, productTypeData) => {
  try {
    const token = getToken();
    const response = await api.put(`/product-type/${id}`, productTypeData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        accept: "*/*",
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Failed to update product type:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteProductType = async (id) => {
  try {
    const token = getToken();
    const response = await api.delete(`/product-type/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "*/*",
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Failed to delete product type:",
      error.response?.data || error.message
    );
    throw error;
  }
};
