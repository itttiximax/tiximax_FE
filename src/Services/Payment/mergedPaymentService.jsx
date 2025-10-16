import api from "../../config/api.js";

const mergedPaymentService = {
  mergePayments: async (depositPercent, isUseBalance, paymentIds) => {
    const response = await api.post(
      `/payments/merged/${depositPercent}/${isUseBalance}`,
      paymentIds
    );
    return response.data;
  },
};

export default mergedPaymentService;
