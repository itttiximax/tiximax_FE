import api from "../../config/api";

const routesService = {
  getRoutes: async () => {
    const res = await api.get("/routes");
    return res.data;
  },

  getRouteById: async (id) => {
    const res = await api.get(`/routes/${id}`);
    return res.data;
  },

  createRoute: async (data) => {
    const apiData = {
      name: data.name,
      shipTime: data.shipTime.toString(), // API expects string
      unitBuyingPrice: data.unitBuyingPrice || 0,
      unitDepositPrice: data.unitDepositPrice || 0,
      exchangeRate: data.exchangeRate || 0,
      note: data.note || "",
    };

    const res = await api.post("/routes", apiData);
    return res.data;
  },

  updateRoute: async (id, data) => {
    const apiData = {
      name: data.name,
      shipTime: data.shipTime.toString(), // API expects string
      unitBuyingPrice: data.unitBuyingPrice || 0,
      unitDepositPrice: data.unitDepositPrice || 0,
      exchangeRate: data.exchangeRate || 0,
      note: data.note || "",
    };

    const res = await api.put(`/routes/${id}`, apiData);
    return res.data;
  },

  deleteRoute: async (id) => {
    const res = await api.delete(`/routes/${id}`);
    return res.data;
  },

  updateExchangeRates: async () => {
    const res = await api.put("/routes/update-exchange-rates");
    return res.data;
  },
};

export default routesService;
