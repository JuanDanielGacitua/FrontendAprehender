// src/components/Courses/UnitForm.jsx

import Swal from "sweetalert2";
import unitService from "../../services/unitService";
import { getToken, getUserFromStorage } from "../../utils/userUtils";
import React, { useState, useEffect } from "react";
import api from "../../services/api";

const UnitForm = ({ onUnitCreated }) => {
  const user = getUserFromStorage();
  const subjectId = user?.subject?.id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    order: "",
    courseId: ""
  });

  const [courses, setCourses] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses");
        setCourses(res.data);
      } catch (error) {
        console.error("Error al cargar cursos:", error);
      }
    };
    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      isNaN(parseInt(formData.order)) ||
      !formData.courseId.trim() ||
      !subjectId
    ) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor completa todos los campos requeridos.",
      });
      return;
    }

    try {
      Swal.fire({
        title: "Creando Unidad...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const token = getToken();

      console.log("🧾 Enviando unidad:", {
        title: formData.title,
        description: formData.description,
        order: parseInt(formData.order, 10),
        courseId: formData.courseId,
        subjectId,
      });

      const unitBody = {
        title: formData.title,
        description: formData.description,
        order: parseInt(formData.order, 10),
        courseId: formData.courseId,
        subjectId,
      };

      await unitService.createUnit(unitBody, token);

      Swal.fire({
        icon: "success",
        title: "Unidad creada exitosamente",
      });

      setFormData({ title: "", description: "", order: "", courseId: "" });

      if (onUnitCreated) onUnitCreated();
    } catch (error) {
      console.error("Error al crear unidad:", error);
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Error al crear unidad",
        text: error.message || "Revisa los datos e intenta nuevamente.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="formulario-campos">
      <label>
        Título de la unidad:
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Descripción:
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </label>
      <label>
        Orden:
        <input
          type="number"
          name="order"
          value={formData.order}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Curso:
        <select
          name="courseId"
          value={formData.courseId}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona un curso</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" className="crear-btn">Crear Unidad</button>
    </form>
  );
};

export default UnitForm;
