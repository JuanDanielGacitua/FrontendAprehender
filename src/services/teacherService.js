import api from "./api";

// Obtiene todos los docentes
const getAll = async () => {
  const response = await api.get("/teachers");
  return response.data;
};

// Crea un docente
const create = async ({ name, subjectId, schoolId }) => {
  const response = await api.post("/teachers", { name, subjectId, schoolId });
  return response.data;
};

// Elimina un docente
const remove = async (teacherId) => {
  const response = await api.delete(`/teachers/${teacherId}`);
  return response.data;
};

// ✅ Evita exportación anónima para cumplir con las reglas de ESLint
const teacherService = {
  getAll,
  create,
  remove,
};

export default teacherService;
