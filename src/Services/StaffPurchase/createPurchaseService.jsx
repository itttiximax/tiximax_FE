import axios from "axios";

const API_URL = "https://t-6cn5.onrender.com/purchases";

const createPurchaseService = {
  createPurchase: async (orderCode, data, token) => {
    try {
      const response = await axios.post(
        `${API_URL}/add?orderCode=${orderCode}`,
        data,
        {
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 30000,
          validateStatus: function (status) {
            return status < 500;
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      if (error.response) {
        const serverError = new Error(
          `Server Error ${error.response.status}: ${
            error.response.data?.message ||
            error.response.statusText ||
            "Unknown error"
          }`
        );
        serverError.status = error.response.status;
        serverError.data = error.response.data;
        throw serverError;
      } else if (error.request) {
        throw new Error(
          "Không nhận được phản hồi từ server. Kiểm tra kết nối mạng."
        );
      } else {
        throw error;
      }
    }
  },
};

export default createPurchaseService;
