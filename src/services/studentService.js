// src/services/studentService.js
import api from "./api";

const studentService = {
  getAll: async () => {
    const response = await api.get("/students");
    return response.data;
  },

  create: async ({ nombre, level, experience }) => {
    const response = await api.post("/students", { nombre, level, experience });
    return response.data;
  },

  remove: async (studentId) => {
    const response = await api.delete(`/students/${studentId}`);
    return response.data;
  },

  getStudentsWithProgress: async () => {
    const response = await api.get("/students/with-progress");
    return response.data;
  },

  getSubjectActivity: async (subjectId) => {
    const response = await api.get(`/session-logs/subject-activity?subjectId=${subjectId}`);
    return response.data;
  }
};

export default studentService;
