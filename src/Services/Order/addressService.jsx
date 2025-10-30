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
      if (!customerCode || !customerCode.trim()) {
        throw new Error("Customer code is required");
      }
      if (!address || typeof address !== "string" || !address.trim()) {
        throw new Error("Address must be a valid non-empty string");
      }

      // ✅ ĐÚNG: Gửi object có field addressName
      const response = await api.post(
        `/addresses/${customerCode}`,
        { addressName: address.trim() }, // ← Object, không phải string
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
        error.response?.data || error.message || error
      );
      throw error;
    }
  },
};

export default addressService;
