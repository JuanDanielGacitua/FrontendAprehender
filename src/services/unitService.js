// src/services/unitService.js

import api from "./api";

const unitService = {
  getAllUnits: async () => {
    const response = await api.get("/units");
    return response.data;
  },

  createUnit: async (unitData) => {
    const response = await api.post("/units", unitData);
    return response.data;
  },
};

export default unitService;
