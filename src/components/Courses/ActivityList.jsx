import React, { useEffect, useState } from "react";

const ActivityList = ({ evaluacionesAdicionales = [] }) => {
  const [evaluaciones, setEvaluaciones] = useState([]);

  useEffect(() => {
    fetch("/data/evaluaciones.json")
      .then((res) => res.json())
      .then((data) => setEvaluaciones(data))
      .catch((err) => console.error("Error cargando evaluaciones:", err));
  }, []);

  const evaluacionesTotales = [...evaluaciones, ...evaluacionesAdicionales];

  return (
    <div className="activity-list">
      <h3>Evaluaciones y Actividades</h3>
      {evaluacionesTotales.length === 0 ? (
        <p>No hay evaluaciones registradas.</p>
      ) : (
        <ul>
          {evaluacionesTotales.map((eva, index) => (
            <li key={eva.id || index}>
              <strong>{eva.title}</strong> – {eva.instructions}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivityList;
