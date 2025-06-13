// src/pages/Teacher/Courses.jsx

import React, { useEffect, useState, useCallback } from "react";
import "../../styles/Courses.css";
import UnitForm from "../../components/Courses/UnitForm";
import ExerciseForm from "../../components/Courses/ExerciseForm";
import unitService from "../../services/unitService";
import { getUserFromStorage } from "../../utils/userUtils";

const Courses = () => {
  const user = getUserFromStorage();
  const subjectName = user?.subject?.name || "Asignatura";
  const subjectId = user?.subject?.id;

  const [units, setUnits] = useState([]);
  const [selectedUnitId, setSelectedUnitId] = useState("");

  const fetchUnits = useCallback(async () => {
    try {
      if (!subjectId) return;
      const response = await unitService.getUnits(subjectId);
      setUnits(response);
    } catch (error) {
      console.error("Error cargando unidades:", error);
    }
  }, [subjectId]);

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  const handleUnitCreated = () => {
    fetchUnits();
  };

  const handleExerciseCreated = () => {
    console.log("✅ Ejercicio creado con éxito");
  };

  return (
    <div className="courses-container">
      <h1 className="courses-title">Asignatura: {subjectName}</h1>
      <p>Administra las unidades y ejercicios de tu asignatura.</p>

      {/* FORMULARIOS CON ESTILO */}
      <div className="formularios-contenedor">
        <div className="formulario-container">
          <div className="formulario-campos">
            <h2>Crear Nueva Unidad</h2>
            <UnitForm subjectId={subjectId} onUnitCreated={handleUnitCreated} />
          </div>
        </div>
      </div>

      {/* LISTADO DE UNIDADES */}
      <div className="listado-container">
        <h2>Listado de Unidades</h2>
        {units.length === 0 ? (
          <p>No hay unidades registradas.</p>
        ) : (
          <div className="cards-grid">
            {units.map((unit) => (
              <div key={unit.id} className="teacher-card">
                <div className="teacher-card-header">
                  <h3>{unit.title}</h3>
                </div>
                <div className="teacher-card-body">
                  <p>Descripción: {unit.description}</p>
                  <p>Orden: {unit.order}</p>
                  <button
                    className="crear-btn"
                    onClick={() =>
                      setSelectedUnitId((prev) => (prev === unit.id ? "" : unit.id))
                    }
                  >
                    {selectedUnitId === unit.id
                      ? "Cancelar Crear Ejercicio"
                      : "➕ Crear Ejercicio"}
                  </button>

                  {/* FORMULARIO DE EJERCICIO */}
                  {selectedUnitId === unit.id && (
                    <div className="formulario-campos" style={{ marginTop: "1rem" }}>
                      <ExerciseForm
                        unitId={unit.id}
                        subjectId={subjectId}
                        onExerciseCreated={handleExerciseCreated}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
