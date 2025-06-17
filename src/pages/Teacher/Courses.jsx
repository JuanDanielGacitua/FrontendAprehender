// src/pages/Teacher/Courses.jsx

import React, { useEffect, useState, useCallback } from "react";
import "../../styles/Courses.css";
import UnitForm from "../../components/Courses/UnitForm";
import ExerciseForm from "../../components/Courses/ExerciseForm";
import unitService from "../../services/unitService";
import api from "../../services/api";
import Swal from "sweetalert2";
import { getUserFromStorage } from "../../utils/userUtils";

const Courses = () => {
  const user = getUserFromStorage();
  const subjectName = user?.subject?.name || "Asignatura";
  const subjectId = user?.subject?.id;

  const [units, setUnits] = useState([]);
  const [selectedUnitId, setSelectedUnitId] = useState("");
  const [subjectUnitMap, setSubjectUnitMap] = useState({}); // Mapea unitId => subjectUnitId
  const [showCreateUnit, setShowCreateUnit] = useState(true);

  // Obtener unidades por subjectId
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

  // Al crear unidad, refresca
  const handleUnitCreated = () => {
    fetchUnits();
  };

  const handleExerciseCreated = () => {
    console.log("✅ Ejercicio creado con éxito");
  };

  // Obtener subjectUnitId asociado a la unidad
  const fetchSubjectUnitId = async (unitId) => {
    const parsedUnitId = parseInt(unitId, 10);
  
    if (!subjectId || isNaN(parsedUnitId)) {
      console.warn("❌ subjectId o unitId inválidos:", { subjectId, unitId });
      return;
    }
  
    try {
      console.log(`📡 Llamando a: /subjects/${subjectId}/units/${parsedUnitId}`);
  
      const res = await api.get(`/subjects/${subjectId}/units/${parsedUnitId}`);
  
      const subjectUnitId = res.data.id;
  
      setSubjectUnitMap((prev) => ({
        ...prev,
        [unitId]: subjectUnitId,
      }));
  
      setSelectedUnitId(unitId);
    } catch (error) {
      console.error("❌ Error al obtener subjectUnitId:", error.response?.data || error.message);
    }
  };

  const handleActualizarMasivo = async () => {
    const confirm = await Swal.fire({
      title: "¿Actualizar progreso masivo?",
      text: "Esta acción asignará las asignaturas y ejercicios a todos los estudiantes según su curso.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, actualizar",
      cancelButtonText: "Cancelar",
    });
  
    if (!confirm.isConfirmed) return;
  
    try {
      Swal.fire({
        title: "Procesando...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });
  
      await api.post("/students/student-subject-progress", {
        actualizarMasivo: true,
      });
  
      Swal.fire({
        icon: "success",
        title: "¡Proceso masivo completado!",
        text: "Asignaciones y estados creados correctamente.",
      });
    } catch (error) {
      console.error("❌ Error al actualizar progreso masivo:", error.response?.data || error.message);
      Swal.fire({
        icon: "error",
        title: "Error al actualizar progreso",
        text: "Ocurrió un problema, intenta nuevamente.",
      });
    }
  };
  
  

  return (
    <div className="courses-container">
      <div className="courses-header-block">
        <h1 className="courses-title-centered">Asignatura: {subjectName}</h1>
        <p className="courses-subtitle-centered">Administra las unidades y ejercicios de tu asignatura.</p>
        <div className="formularios-contenedor header-formulario">
          <div className="formulario-container">
            <div className="formulario-campos">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <h2 style={{ margin: 0 }}>Crear Nueva Unidad</h2>
                <button
                  type="button"
                  className="toggle-create-unit-btn"
                  onClick={() => setShowCreateUnit((prev) => !prev)}
                  aria-label={showCreateUnit ? 'Ocultar formulario' : 'Mostrar formulario'}
                >
                  {showCreateUnit ? '▼' : '►'}
                </button>
              </div>
              {showCreateUnit && (
                <UnitForm subjectId={subjectId} onUnitCreated={handleUnitCreated} />
              )}
            </div>
          </div>
        </div>
      </div>
  
      {/* BOTÓN FLOTANTE LADO DERECHO */}
      <button
        onClick={handleActualizarMasivo}
        style={{
          position: "fixed",
          top: "120px",
          right: "30px",
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "5px",
          padding: "10px 14px",
          cursor: "pointer",
          fontSize: "0.85rem",
          zIndex: 1000,
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }}
      >
        Actualizar Progreso
      </button>
  
      {/* LISTADO DE UNIDADES */}
      <div className="listado-container">
        <h2>Listado de Unidades</h2>
        {units.length === 0 ? (
          <p>No hay unidades registradas.</p>
        ) : (
          <div className="units-list">
            {units.map((unit) => (
              <div key={unit.id} className="unit-title-row">
                <button
                  className={`unit-title-btn${selectedUnitId === unit.id ? ' active' : ''}`}
                  onClick={() => {
                    if (selectedUnitId === unit.id) {
                      setSelectedUnitId(""); // cerrar
                    } else {
                      fetchSubjectUnitId(unit.id); // abrir y buscar subjectUnitId
                    }
                  }}
                >
                  <span>{unit.title}</span>
                  {selectedUnitId !== unit.id && (
                    <span className="crear-ejercicio-hint">Crear ejercicio +</span>
                  )}
                </button>
                {selectedUnitId === unit.id && (
                  <div className="teacher-card expanded">
                    <div className="teacher-card-header">
                      <h3>{unit.title}</h3>
                    </div>
                    <div className="teacher-card-body">
                      <p>Descripción: {unit.description}</p>
                      <p>Orden: {unit.order}</p>
                      <button
                        className="crear-btn"
                        onClick={() => setSelectedUnitId("")}
                      >
                        Cancelar Crear Ejercicio
                      </button>
                      {/* FORMULARIO DE EJERCICIO */}
                      {subjectUnitMap[unit.id] && (
                        <div className="formulario-campos" style={{ marginTop: "1rem" }}>
                          <ExerciseForm
                            subjectUnitId={subjectUnitMap[unit.id]}
                            onExerciseCreated={handleExerciseCreated}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};  

export default Courses;
