import React, { useState } from "react";

const ActivityForm = ({ onCrearEvaluacion }) => {
  const [titulo, setTitulo] = useState("");
  const [instruccion, setInstruccion] = useState("");
  const [preguntas, setPreguntas] = useState([
    { pregunta: "", opciones: ["", "", ""], respuestaCorrecta: 0 }
  ]);

  const handlePreguntaChange = (index, field, value) => {
    const nuevasPreguntas = [...preguntas];
    if (field === "pregunta") {
      nuevasPreguntas[index].pregunta = value;
    } else if (field === "respuestaCorrecta") {
      nuevasPreguntas[index].respuestaCorrecta = parseInt(value);
    }
    setPreguntas(nuevasPreguntas);
  };

  const handleOpcionChange = (index, opcionIndex, value) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[index].opciones[opcionIndex] = value;
    setPreguntas(nuevasPreguntas);
  };

  const agregarPregunta = () => {
    setPreguntas([
      ...preguntas,
      { pregunta: "", opciones: ["", "", ""], respuestaCorrecta: 0 }
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const evaluacion = {
      id: `eva-${Date.now()}`,
      title: titulo,
      instructions: instruccion,
      courseId: "curso-primero-basico",
      questions: preguntas.map((p) => ({
        enunciado: p.pregunta,
        opciones: p.opciones,
        respuestaCorrecta: p.respuestaCorrecta
      })),
      createdAt: new Date().toISOString()
    };

    // Descargar el JSON como archivo
    const blob = new Blob([JSON.stringify(evaluacion, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${evaluacion.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert("Evaluación guardada y descargada 🎉");

    // Notificar al componente padre
    if (typeof onCrearEvaluacion === "function") {
      onCrearEvaluacion(evaluacion);
    }

    // Limpiar formulario
    setTitulo("");
    setInstruccion("");
    setPreguntas([{ pregunta: "", opciones: ["", "", ""], respuestaCorrecta: 0 }]);
  };

  return (
    <form className="activity-form" onSubmit={handleSubmit}>
      <h3>Crear Evaluación Interactiva</h3>

      <label>
        Título de la actividad
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
      </label>

      <label>
        Instrucción general
        <input
          type="text"
          value={instruccion}
          onChange={(e) => setInstruccion(e.target.value)}
          required
        />
      </label>

      <h4>Preguntas</h4>
      {preguntas.map((pregunta, index) => (
        <div key={index} className="pregunta-block">
          <label>
            Enunciado de la pregunta
            <input
              type="text"
              value={pregunta.pregunta}
              onChange={(e) => handlePreguntaChange(index, "pregunta", e.target.value)}
              required
            />
          </label>

          {pregunta.opciones.map((op, i) => (
            <label key={i}>
              Opción {i + 1}
              <input
                type="text"
                value={op}
                onChange={(e) => handleOpcionChange(index, i, e.target.value)}
                required
              />
            </label>
          ))}

          <label>
            Respuesta correcta (0-2)
            <input
              type="number"
              min="0"
              max="2"
              value={pregunta.respuestaCorrecta}
              onChange={(e) =>
                handlePreguntaChange(index, "respuestaCorrecta", e.target.value)
              }
              required
            />
          </label>
          <hr />
        </div>
      ))}

      <button type="button" onClick={agregarPregunta}>
        + Agregar otra pregunta
      </button>
      <br />
      <br />
      <button type="submit">Guardar Evaluación</button>
    </form>
  );
};

export default ActivityForm;
