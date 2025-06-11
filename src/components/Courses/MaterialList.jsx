import React, { useEffect, useState } from "react";

const MaterialList = () => {
  const [materiales, setMateriales] = useState([]);

  useEffect(() => {
    fetch("/data/materiales.json")
      .then((res) => res.json())
      .then((data) => setMateriales(data))
      .catch((err) => console.error("Error cargando materiales:", err));
  }, []);

  return (
    <div className="material-list">
      <h3>Materiales de Estudio</h3>
      {materiales.length === 0 ? (
        <p>No hay materiales registrados.</p>
      ) : (
        <ul>
          {materiales.map((mat) => (
            <li key={mat.id}>
              <strong>{mat.titulo}</strong> –{" "}
              <a href={mat.contenido} target="_blank" rel="noopener noreferrer">
                Ver {mat.tipo}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MaterialList;
