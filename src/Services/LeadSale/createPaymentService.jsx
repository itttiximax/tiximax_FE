import axios from "axios";

const BASE_URL = "https://t-6cn5.onrender.com";

const createPaymentService = async (orderCode, paymentData = null) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token found. Please login again.");
    }

    const response = await axios.post(
      `${BASE_URL}/payments/${orderCode}`,
      paymentData || "",
      {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating payment:", error.response || error);
    throw error;
  }
};

export default createPaymentService;
