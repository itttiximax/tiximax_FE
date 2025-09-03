import api from "../../config/api"; // ← THAY ĐỔI: import api thay vì axios

const routesService = {
  getRoutes: async () => {
    // ← THAY ĐỔI: bỏ token parameter
    const res = await api.get("/routes"); // ← THAY ĐỔI: bỏ headers (tự động thêm)
    return res.data;
  },

  getRouteById: async (id) => {
    // ← THAY ĐỔI: bỏ token parameter
    const res = await api.get(`/routes/${id}`); // ← THAY ĐỔI: bỏ headers
    return res.data;
  },

  createRoute: async (data) => {
    // ← THAY ĐỔI: bỏ token parameter
    const res = await api.post("/routes", data); // ← THAY ĐỔI: bỏ headers
    return res.data;
  },

  updateRoute: async (id, data) => {
    // ← THAY ĐỔI: bỏ token parameter
    const res = await api.put(`/routes/${id}`, data); // ← THAY ĐỔI: bỏ headers
    return res.data;
  },

  deleteRoute: async (id) => {
    // ← THAY ĐỔI: bỏ token parameter
    const res = await api.delete(`/routes/${id}`); // ← THAY ĐỔI: bỏ headers
    return res.data;
  },
};

export default routesService;
