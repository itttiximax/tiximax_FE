import api from "../../config/api.js";

const addressService = {
  getCustomerAddresses: async (customerCode) => {
    try {
      const response = await api.get(
        `/addresses/customer-addresses/${customerCode}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching customer addresses:", error);
      throw error;
    }
  },
  createCustomerAddress: async (customerCode, address) => {
    try {
      if (!customerCode) throw new Error("Customer code is required");
      if (!address || typeof address !== "string")
        throw new Error("Address must be a valid string");

      // Gửi chuỗi trực tiếp, không phải object
      const response = await api.post(
        `/addresses/${customerCode}`, // Đổi path
        `"${address}"`, // Gửi string có dấu ngoặc kép
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "Error creating customer address:",
        error.response || error
      );
      throw error;
    }
  },
};

export default addressService;
