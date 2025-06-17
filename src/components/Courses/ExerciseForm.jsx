import React, { useState } from "react";
import Swal from "sweetalert2";
import api from "../../services/api";

const ExerciseForm = ({ subjectUnitId, onExerciseCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("alternativas");
  const [totalExperience, setTotalExperience] = useState(250);
  const [enunciado, setEnunciado] = useState("");
  const [alternativas, setAlternativas] = useState([
    { id: "1", texto: "", esCorrecta: false },
    { id: "2", texto: "", esCorrecta: false },
    { id: "3", texto: "", esCorrecta: false },
    { id: "4", texto: "", esCorrecta: false },
  ]);

  const handleAlternativaChange = (index, field, value) => {
    const updated = [...alternativas];
    updated[index][field] = field === "esCorrecta" ? value === "true" : value;
    setAlternativas(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirm = await Swal.fire({
      title: "¿Confirmar creación?",
      text: "¿Estás seguro de que quieres crear este ejercicio?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, crear",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    Swal.fire({
      title: "Creando ejercicio...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const content = { enunciado, alternativas };

      console.log("📤 Enviando ejercicio:", {
        subjectUnitId,
        title,
        description,
        type,
        totalExperience,
        content,
        difficulty: null,
      });

      await api.post("/exercises", {
        subjectUnitId,
        title,
        description,
        type,
        totalExperience: parseInt(totalExperience),
        content,
        difficulty: null,
      });

      Swal.fire({
        icon: "success",
        title: "Ejercicio creado correctamente!",
      });

      setTitle("");
      setDescription("");
      setType("alternativas");
      setTotalExperience(250);
      setEnunciado("");
      setAlternativas([
        { id: "1", texto: "", esCorrecta: false },
        { id: "2", texto: "", esCorrecta: false },
        { id: "3", texto: "", esCorrecta: false },
        { id: "4", texto: "", esCorrecta: false },
      ]);

      if (onExerciseCreated) onExerciseCreated();
    } catch (error) {
      console.error("❌ Error al crear ejercicio:", error.response?.data || error.message);
      Swal.fire({
        icon: "error",
        title: "Error al crear ejercicio",
        text: "Intenta nuevamente.",
      });
    }
  };

  return (
    <form className="activity-form" onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
      <label>
        Título del ejercicio:
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>

      <label>
        Descripción:
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>

      <label>
        Tipo de ejercicio:
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="alternativas">Alternativas</option>
          <option value="terminos_pareados">Términos pareados</option>
        </select>
      </label>

      <label>
        Experiencia total:
        <input
          type="number"
          value={totalExperience}
          onChange={(e) => setTotalExperience(e.target.value)}
          required
        />
      </label>

      <label>
        Enunciado:
        <input
          type="text"
          value={enunciado}
          onChange={(e) => setEnunciado(e.target.value)}
          required
        />
      </label>

      <fieldset>
        <legend>Alternativas:</legend>
        {alternativas.map((alt, index) => (
          <div key={alt.id} style={{ marginBottom: "0.5rem" }}>
            <input
              type="text"
              placeholder={`Texto alternativa ${alt.id}`}
              value={alt.texto}
              onChange={(e) => handleAlternativaChange(index, "texto", e.target.value)}
              required
            />
            <label style={{ marginLeft: "0.5rem" }}>
              Correcta:
              <input
                type="radio"
                name="correcta"
                value="true"
                checked={alt.esCorrecta}
                onChange={() =>
                  setAlternativas((prev) =>
                    prev.map((a, i) => ({ ...a, esCorrecta: i === index }))
                  )
                }
              />
            </label>
          </div>
        ))}
      </fieldset>

      <button type="submit">Crear Ejercicio</button>
    </form>
  );
};

export default ExerciseForm;