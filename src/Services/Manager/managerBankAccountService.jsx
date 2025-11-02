// /src/Services/Bank/managerBankAccountService.jsx
import api from "../../config/api";

const managerBankAccountService = {
  // ✅ Lấy danh sách tài khoản Proxy (isProxy=true, isRevenue=false)
  async getProxyAccounts() {
    try {
      const response = await api.get("/bankAccounts/filter", {
        params: { isProxy: true, isRevenue: false },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching proxy accounts:", error);
      throw error;
    }
  },

  // ✅ Lấy danh sách tài khoản Revenue (isProxy=false, isRevenue=true)
  async getRevenueAccounts() {
    try {
      const response = await api.get("/bankAccounts/filter", {
        params: { isProxy: false, isRevenue: true },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching revenue accounts:", error);
      throw error;
    }
  },
};

export default managerBankAccountService;
