// src/services/exerciseService.js

import api from "./api";

const exerciseService = {
  createExercise: async (exerciseData) => {
    const response = await api.post("/exercises", exerciseData);
    return response.data;
  },
};

export default exerciseService;
