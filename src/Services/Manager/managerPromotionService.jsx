import api from "../../config/api.js";

const managerPromotionService = {
  createVoucher: async (data) => {
    const res = await api.post("/vouchers", data);
    return res.data;
  },
  getVouchers: async (page = 0, size = 10) => {
    const res = await api.get(`/vouchers/${page}/${size}/paging`);
    return res.data;
  },
  getVoucherById: async (id) => {
    const res = await api.get(`/vouchers/${id}`);
    return res.data;
  },

  deleteVoucher: async (id) => {
    const res = await api.delete(`/vouchers/${id}`);
    return res.status;
  },

  updateVoucher: async (id, data) => {
    const res = await api.put(`/vouchers/${id}`, data);
    return res.data;
  },
  getVouchersByCustomer: async (customerId) => {
    const res = await api.get(`/vouchers/customer/${customerId}`);
    return res.data;
  },
};

export default managerPromotionService;
