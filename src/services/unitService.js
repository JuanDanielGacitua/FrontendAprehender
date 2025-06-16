import api from "./api";
import { getToken } from "../utils/userUtils"; // Asegúrate de importar esto

const unitService = {
  // Unidades por asignatura (autenticadas)
  getUnits: async (subjectId) => {
    const token = getToken(); // Recupera el token del localStorage
    const response = await api.get(`/units/subjects/${subjectId}/units`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Todas las unidades
  getAllUnits: async () => {
    const response = await api.get("/units");
    return response.data;
  },

  // Crear nueva unidad
  createUnit: async (unitData) => {
    const token = getToken(); // También es requerido aquí si tu backend lo necesita
    const response = await api.post("/units", unitData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

export default unitService;
