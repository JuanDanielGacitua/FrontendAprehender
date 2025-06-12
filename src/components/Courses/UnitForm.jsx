import React, { useState } from "react";

const UnitForm = ({ courseId, onUnitCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    order: 1,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://aprehender-backendapi.fly.dev/api/units", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          order: parseInt(formData.order),
          courseId,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert("✅ Unidad creada exitosamente.");
        if (typeof onUnitCreated === "function") {
          onUnitCreated(result.unit);
        }
        setFormData({ title: "", description: "", order: 1 });
      } else {
        const errorData = await response.json();
        alert(`❌ ${errorData.error || "Error al crear unidad."}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error de conexión.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="unit-form">
      <h3>Crear Nueva Unidad</h3>

      <label>
        Título:
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
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Orden:
        <input
          type="number"
          name="order"
          value={formData.order}
          min="1"
          onChange={handleChange}
          required
        />
      </label>

      <button type="submit">Crear Unidad</button>
    </form>
  );
};

export default UnitForm;
