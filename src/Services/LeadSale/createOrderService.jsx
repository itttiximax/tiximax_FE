import axios from "axios";

const API_BASE_URL = "https://t-6cn5.onrender.com";

const createOrderService = async (customerId, staffId, orderData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${API_BASE_URL}/orders/${customerId}/${staffId}`,
      orderData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("❌ Error creating order:", error.response || error.message);
    throw error;
  }
};

export default createOrderService;
