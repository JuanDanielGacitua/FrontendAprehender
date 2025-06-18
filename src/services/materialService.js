import api from "./api";

const materialService = {
  // Crear material de estudio para una asignatura
  createMaterial: (subjectId, data) =>
    api.post(`/subjects/${subjectId}/study-materials`, data),

  // Obtener materiales de estudio de un estudiante
  getMaterialsByStudent: (studentId) =>
    api.get(`/students/${studentId}/study-materials`),

  // Obtener materiales de estudio de una asignatura
  getMaterialsBySubject: (subjectId) =>
    api.get(`/subjects/${subjectId}/study-materials`),
};

export default materialService; 