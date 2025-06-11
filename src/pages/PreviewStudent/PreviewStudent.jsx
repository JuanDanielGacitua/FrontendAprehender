import React, { useEffect, useState } from "react";

const PreviewStudent = () => {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [evaluacionSeleccionada, setEvaluacionSeleccionada] = useState(null);
  const [respuestas, setRespuestas] = useState([]);
  const [resultado, setResultado] = useState(null);

  // Cargar todas las evaluaciones
  useEffect(() => {
    fetch("/data/evaluaciones.json")
      .then((res) => res.json())
      .then((data) => setEvaluaciones(data))
      .catch((err) => console.error("Error cargando evaluaciones:", err));
  }, []);

  const seleccionarEvaluacion = (id) => {
    const evaluacion = evaluaciones.find((e) => e.id === parseInt(id));
    if (evaluacion) {
      setEvaluacionSeleccionada(evaluacion);
      setRespuestas(new Array(evaluacion.preguntas.length).fill(null));
      setResultado(null);
    }
  };

  const manejarRespuesta = (indicePregunta, indiceOpcion) => {
    const nuevas = [...respuestas];
    nuevas[indicePregunta] = indiceOpcion;
    setRespuestas(nuevas);
  };

  const enviarRespuestas = () => {
    let correctas = 0;
    evaluacionSeleccionada.preguntas.forEach((preg, i) => {
      if (respuestas[i] === preg.respuestaCorrecta) correctas++;
    });
    setResultado(`Obtuviste ${correctas} de ${evaluacionSeleccionada.preguntas.length} respuestas correctas.`);
  };

  return (
    <div className="preview-student">
      <h2>Vista de Estudiante</h2>

      {/* Selector de evaluación */}
      <label>
        Selecciona una evaluación:
        <select onChange={(e) => seleccionarEvaluacion(e.target.value)} defaultValue="">
          <option value="" disabled>-- Elegir --</option>
          {evaluaciones.map((evalItem) => (
            <option key={evalItem.id} value={evalItem.id}>
              {evalItem.titulo}
            </option>
          ))}
        </select>
      </label>

      {evaluacionSeleccionada && (
        <>
          <h3>{evaluacionSeleccionada.titulo}</h3>
          <p>{evaluacionSeleccionada.instruccion}</p>

          {evaluacionSeleccionada.preguntas.map((pregunta, i) => (
            <div key={i} className="pregunta-student">
              <p><strong>{i + 1}. {pregunta.pregunta}</strong></p>
              {pregunta.opciones.map((opcion, j) => (
                <label key={j}>
                  <input
                    type="radio"
                    name={`pregunta-${i}`}
                    checked={respuestas[i] === j}
                    onChange={() => manejarRespuesta(i, j)}
                  />
                  {opcion}
                </label>
              ))}
              <hr />
            </div>
          ))}

          <button onClick={enviarRespuestas}>Enviar respuestas</button>
          {resultado && <p><strong>{resultado}</strong></p>}
        </>
      )}
    </div>
  );
};

export default PreviewStudent;
