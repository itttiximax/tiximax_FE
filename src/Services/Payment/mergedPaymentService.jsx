import api from "../../config/api.js";

const mergedPaymentService = {
  mergePayments: async (depositPercent, isUseBalance, bankId, paymentIds) => {
    const response = await api.post(
      `/payments/merged/${depositPercent}/${isUseBalance}/${bankId}`,
      paymentIds
    );
    return response.data;
  },
};

export default mergedPaymentService;
