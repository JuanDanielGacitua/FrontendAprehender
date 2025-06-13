// src/components/Courses/UnitForm.jsx

import React, { useState } from "react";
import Swal from "sweetalert2";
import unitService from "../../services/unitService";
import { getToken } from "../../utils/userUtils";

const UnitForm = ({ subjectId, onUnitCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    order: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.order || !subjectId) {
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

      const unitBody = {
        title: formData.title,
        description: formData.description,
        order: parseInt(formData.order, 10),
        subjectId,
      };

      await unitService.createUnit(unitBody, token);

      Swal.fire({
        icon: "success",
        title: "Unidad creada exitosamente",
      });

      setFormData({ title: "", description: "", order: "" });

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
      <button type="submit" className="crear-btn">Crear Unidad</button>
    </form>
  );
};

export default UnitForm;
