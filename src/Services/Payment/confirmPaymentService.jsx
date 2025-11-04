import api from "../../config/api.js";

const confirmPaymentService = {
  async confirmPayment(paymentId) {
    if (!paymentId && paymentId !== 0) {
      throw new Error("Payment ID is required");
    }
    const res = await api.put(
      `/payments/confirm/${encodeURIComponent(paymentId)}`,
      {}
    );
    return res.data;
  },

  async confirmShippingPayment(paymentCode) {
    if (!paymentCode || typeof paymentCode !== "string") {
      throw new Error("Valid paymentCode is required");
    }
    const res = await api.put(
      `/payments/confirm-shipping/${encodeURIComponent(paymentCode)}`,
      {}
    );
    return res.data;
  },
};

export default confirmPaymentService;
