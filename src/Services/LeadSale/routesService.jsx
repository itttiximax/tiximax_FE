import axios from "axios";

const API_BASE_URL = "https://t-6cn5.onrender.com";

const routesService = {
  getRoutes: async (token) => {
    const res = await axios.get(`${API_BASE_URL}/routes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  getRouteById: async (token, id) => {
    const res = await axios.get(`${API_BASE_URL}/routes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  createRoute: async (token, data) => {
    const res = await axios.post(`${API_BASE_URL}/routes`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  },

  updateRoute: async (token, id, data) => {
    const res = await axios.put(`${API_BASE_URL}/routes/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  },

  deleteRoute: async (token, id) => {
    const res = await axios.delete(`${API_BASE_URL}/routes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};

export default routesService;
