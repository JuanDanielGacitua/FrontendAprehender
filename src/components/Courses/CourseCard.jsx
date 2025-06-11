import React from "react";

const CourseCard = ({
  curso,
  obtenerNombreAsignatura,
  obtenerNombreProfesor,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="course-card">
      <h3>{curso.grade}</h3>

      <p>
        <strong>Asignatura:</strong> {obtenerNombreAsignatura(curso.subject)}
      </p>

      <p>
        <strong>Profesor:</strong> {obtenerNombreProfesor(curso.teacherId)}
      </p>

      <p>
        <strong>Fecha de creación:</strong>{" "}
        {new Date(curso.createdAt).toLocaleDateString()}
      </p>

      {curso.material && (
        <p>
          <strong>Material:</strong>{" "}
          <a href={curso.material} target="_blank" rel="noopener noreferrer">
            Ver Material
          </a>
        </p>
      )}

      {curso.evaluation && (
        <>
          <p>
            <strong>Evaluación:</strong> {curso.evaluation}
          </p>
          <div className="evaluation-button">
            <button
              onClick={() => alert("Redirigir a evaluación")}
              className="ver-evaluacion-btn"
            >
              Ver Evaluación
            </button>
          </div>
        </>
      )}

      <div className="card-buttons">
        <button onClick={() => onEdit(curso)} className="edit-btn">
          Editar
        </button>
        <button onClick={onDelete} className="delete-btn">
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
