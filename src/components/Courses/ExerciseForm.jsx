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
  const [pares, setPares] = useState([
    { id: "1", termino: "", definicion: "" },
    { id: "2", termino: "", definicion: "" },
    { id: "3", termino: "", definicion: "" },
    { id: "4", termino: "", definicion: "" },
  ]);
  const [instruccion, setInstruccion] = useState("");

  const handleAlternativaChange = (index, field, value) => {
    const updated = [...alternativas];
    updated[index][field] = field === "esCorrecta" ? value === "true" : value;
    setAlternativas(updated);
  };

  const handleParChange = (index, field, value) => {
    const updated = [...pares];
    updated[index][field] = value;
    setPares(updated);
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
      let content;
      if (type === "alternativas") {
        content = { enunciado, alternativas };
      } else if (type === "terminos_pareados") {
        content = {
          terminosPareados: {
            pares,
            instruccion,
          },
        };
      }

      console.log("Enviando ejercicio:", {
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
      setPares([
        { id: "1", termino: "", definicion: "" },
        { id: "2", termino: "", definicion: "" },
        { id: "3", termino: "", definicion: "" },
        { id: "4", termino: "", definicion: "" },
      ]);
      setInstruccion("");

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
    <form className="activity-form exercise-form-columns" onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
      <div className="exercise-form-col-left">
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

        {type === "alternativas" && (
          <label>
            Enunciado:
            <input
              type="text"
              value={enunciado}
              onChange={(e) => setEnunciado(e.target.value)}
              required
            />
          </label>
        )}
        {type === "terminos_pareados" && (
          <label>
            Instrucción:
            <input
              type="text"
              value={instruccion}
              onChange={(e) => setInstruccion(e.target.value)}
              required
            />
          </label>
        )}
      </div>
      <div className="exercise-form-col-right">
        {type === "alternativas" && (
          <fieldset>
            <legend>Alternativas:</legend>
            {alternativas.map((alt, index) => (
              <div key={alt.id} className="alternativa-row-flex" style={{ marginBottom: "0.5rem", display: 'flex', gap: '0.7rem', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder={`Texto alternativa ${alt.id}`}
                  value={alt.texto}
                  onChange={(e) => handleAlternativaChange(index, "texto", e.target.value)}
                  required
                  style={{ flex: 1 }}
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginLeft: '0.7rem', fontWeight: 500 }}>
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
                    style={{ marginLeft: 0 }}
                  />
                </label>
              </div>
            ))}
          </fieldset>
        )}
        {type === "terminos_pareados" && (
          <fieldset>
            <legend>Pares:</legend>
            {pares.map((par, index) => (
              <div key={par.id} className="par-row-flex" style={{ marginBottom: "0.5rem", display: 'flex', gap: '0.7rem', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder={`Término ${par.id}`}
                  value={par.termino}
                  onChange={(e) => handleParChange(index, "termino", e.target.value)}
                  required
                  style={{ flex: 1 }}
                />
                <input
                  type="text"
                  placeholder={`Definición ${par.id}`}
                  value={par.definicion}
                  onChange={(e) => handleParChange(index, "definicion", e.target.value)}
                  required
                  style={{ flex: 1 }}
                />
              </div>
            ))}
          </fieldset>
        )}
        <button type="submit">Crear Ejercicio</button>
      </div>
    </form>
  );
};

export default ExerciseForm;