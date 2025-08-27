import api from "../../config/api.js";
import { getToken } from "../../Services/Auth/authService.js";

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
