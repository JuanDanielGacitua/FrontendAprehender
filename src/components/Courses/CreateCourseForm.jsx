import React, { useState } from "react";

const CreateCourseForm = ({ onCourseCreated }) => {
  const [formData, setFormData] = useState({
    asignatura: "",
    grado: "",
    idDocente: "",
    idEscuela: ""
  });
  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica que todos los campos están completos
    const { asignatura, grado, idDocente, idEscuela } = formData;
    if (!asignatura || !grado || !idDocente || !idEscuela) {
      setResponseMessage("❌ ⚠️ Todos los campos son obligatorios.");
      return;
    }

    try {
      const response = await fetch("https://aprehender-backendapi.fly.dev/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherId: idDocente,
          schoolId: idEscuela,
          name: `${asignatura} - ${grado}`,
          subject: asignatura,
          grade: grado
        }),
      });

      if (response.ok) {
        const nuevoCurso = await response.json();
        setResponseMessage("✅ Curso creado exitosamente.");
        onCourseCreated(nuevoCurso); // Notifica al padre
        setFormData({ asignatura: "", grado: "", idDocente: "", idEscuela: "" });
      } else {
        const errorData = await response.json();
        setResponseMessage(`❌ ⚠️ ${errorData.error || "Error al crear curso."}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setResponseMessage("❌ Error de conexión.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Asignatura:<input type="text" name="asignatura" value={formData.asignatura} onChange={handleChange} /></label>
      <label>Grado:<input type="text" name="grado" value={formData.grado} onChange={handleChange} /></label>
      <label>ID Docente:<input type="text" name="idDocente" value={formData.idDocente} onChange={handleChange} /></label>
      <label>ID Escuela:<input type="text" name="idEscuela" value={formData.idEscuela} onChange={handleChange} /></label>
      <button type="submit">Crear Curso</button>
      {responseMessage && <p>{responseMessage}</p>}
    </form>
  );
};

export default CreateCourseForm;
