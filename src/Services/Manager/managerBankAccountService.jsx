// /src/Services/Bank/managerBankAccountService.jsx
import api from "../../config/api";

const managerBankAccountService = {
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
  async getAll() {
    try {
      const res = await api.get("/bankAccounts");
      return res.data;
    } catch (err) {
      console.error("Error fetching bank accounts:", err);
      throw err;
    }
  },
  async delete(id) {
    try {
      const res = await api.delete(`/bankAccounts/${id}`);
      return res.data;
    } catch (err) {
      console.error(`Error deleting bank account ${id}:`, err);
      throw err;
    }
  },
  async getById(id) {
    try {
      const res = await api.get(`/bankAccounts/${id}`);
      return res.data;
    } catch (err) {
      console.error(`Error fetching bank account ${id}:`, err);
      throw err;
    }
  },
  async update(id, payload) {
    try {
      const res = await api.put(`/bankAccounts/${id}`, payload);
      return res.data;
    } catch (err) {
      console.error(`Error updating bank account ${id}:`, err);
      throw err;
    }
  },
  async create(payload) {
    try {
      const res = await api.post("/bankAccounts", payload);
      return res.data;
    } catch (err) {
      console.error("Error creating bank account:", err);
      throw err;
    }
  },
};

export default managerBankAccountService;
