// src/services/courseService.js

import api from "./api";

const getCourses = () => {
  return api.get("/courses");
};

const getCourseById = (id) => {
  return api.get(`/courses/${id}`);
};

const createCourse = (courseData) => {
  return api.post("/courses", courseData);
};

const updateCourse = (id, courseData) => {
  return api.put(`/courses/${id}`, courseData);
};

const deleteCourse = (id) => {
  return api.delete(`/courses/${id}`);
};

const enrollStudent = (courseId, studentId) => {
  return api.post("/enrollments", { courseId, studentId });
};

const courseService = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollStudent,
};

export default courseService;
