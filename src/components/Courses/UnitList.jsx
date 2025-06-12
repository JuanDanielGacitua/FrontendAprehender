import React, { useEffect, useState } from "react";

const UnitList = ({ courseId }) => {
  const [units, setUnits] = useState([]);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await fetch("https://aprehender-backendapi.fly.dev/api/units");
        const data = await response.json();
        const unitsFiltradas = data.filter((u) => u.courseId === courseId);
        setUnits(unitsFiltradas);
      } catch (error) {
        console.error("Error cargando unidades:", error);
      }
    };

    fetchUnits();
  }, [courseId]);

  const handleDelete = async (unitId) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta unidad?")) return;

    try {
      const response = await fetch(`https://aprehender-backendapi.fly.dev/api/units/${unitId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("✅ Unidad eliminada correctamente.");
        // Actualizamos lista de unidades
        setUnits((prev) => prev.filter((u) => u.id !== unitId));
      } else {
        const errorData = await response.json();
        alert(`❌ ${errorData.error || "Error al eliminar unidad."}`);
      }
    } catch (error) {
      console.error("Error al eliminar unidad:", error);
      alert("❌ Error de conexión.");
    }
  };

  return (
    <div className="unit-list">
      <h3>Listado de Unidades</h3>
      {units.length === 0 ? (
        <p>No hay unidades registradas.</p>
      ) : (
        <ul>
          {units.map((unit) => (
            <li key={unit.id} style={{ marginBottom: "0.5rem" }}>
              <strong>
                {unit.order}. {unit.title}
              </strong>{" "}
              – {unit.description}{" "}
              <button
                onClick={() => handleDelete(unit.id)}
                style={{
                  marginLeft: "1rem",
                  color: "white",
                  backgroundColor: "red",
                  border: "none",
                  borderRadius: "4px",
                  padding: "4px 8px",
                  cursor: "pointer",
                }}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UnitList;
