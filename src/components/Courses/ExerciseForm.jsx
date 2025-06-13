import React, { useState } from "react";
import api from "../../services/api";

const ExerciseForm = ({ subjectUnitId }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("alternativas");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/exercises", {
        subjectUnitId,
        title,
        description,
        type,
        content: JSON.parse(content), // IMPORTANTE: debe ser un JSON válido
      });

      // Limpiar formulario
      setTitle("");
      setDescription("");
      setType("alternativas");
      setContent("");

      alert("✅ Ejercicio creado correctamente!");
    } catch (error) {
      console.error("Error al crear ejercicio:", error);
      alert("⚠️ Error al crear ejercicio. Verifica que el JSON sea válido.");
    }
  };

  return (
    <form className="activity-form" onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
      <label>
        Título del ejercicio:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>

      <label>
        Descripción:
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <label>
        Tipo de ejercicio:
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="alternativas">Alternativas</option>
          <option value="terminos_pareados">Términos pareados</option>
          {/* Puedes agregar más tipos si quieres */}
        </select>
      </label>

      <label>
        Contenido (JSON):
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder='{"enunciado": "...", "alternativas": [...]}' // Ejemplo
          rows={5}
          required
        ></textarea>
      </label>

      <button type="submit">Crear Ejercicio</button>
    </form>
  );
};

export default ExerciseForm;
