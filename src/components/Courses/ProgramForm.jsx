import React, { useState, useEffect } from "react";

const CourseForm = ({
  onSubmit,
  onCancel,
  initialData = null,
  subjects = [],
  teachers = [],
}) => {
  const [grade, setGrade] = useState(initialData?.grade || "");
  const [subjectId, setSubjectId] = useState(initialData?.subject || "");
  const [teacherId, setTeacherId] = useState(initialData?.teacherId || "");
  const [material, setMaterial] = useState(initialData?.material || "");
  const [evaluation, setEvaluation] = useState(initialData?.evaluation || "");
  const [assignedStudents, setAssignedStudents] = useState([]);

  useEffect(() => {
    fetch("/data/students.json")
      .then((res) => res.json())
      .then((data) => {
        if (initialData?.id) {
          const filtered = data.filter((s) => s.courseId === initialData.id);
          setAssignedStudents(filtered);
        }
      })
      .catch((err) => console.error("Error cargando estudiantes:", err));
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!grade || !subjectId || !teacherId) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }

    const newCourse = {
      id: initialData?.id || crypto.randomUUID(),
      grade,
      subject: subjectId,
      teacherId,
      material,
      evaluation,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      schoolId: initialData?.schoolId || "1",
    };

    onSubmit(newCourse);
  };

  return (
    <div className="course-form-container">
      <h2>{initialData ? "Editar Curso" : "Crear Nuevo Curso"}</h2>
      <form onSubmit={handleSubmit} className="course-form">
        <label>
          Grado:
          <input
            type="text"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            required
          />
        </label>

        <label>
          Asignatura:
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            required
          >
            <option value="">Selecciona una asignatura</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Profesor:
          <select
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            required
          >
            <option value="">Selecciona un profesor</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Material de Estudio: <span className="opcional">(opcional)</span>
          <input
            type="text"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            placeholder="Ej: https://mimaterial.com"
          />
        </label>

        <label>
          Evaluación: <span className="opcional">(opcional)</span>
          <input
            type="text"
            value={evaluation}
            onChange={(e) => setEvaluation(e.target.value)}
            placeholder="Ej: Prueba de Linux - Módulo 1"
          />
        </label>

        {assignedStudents.length > 0 && (
          <div className="form-group">
            <label>Estudiantes asignados:</label>
            <ul>
              {assignedStudents.map((s) => (
                <li key={s.id}>{s.name}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="form-buttons">
          <button type="submit">{initialData ? "Guardar" : "Crear"}</button>
          <button type="button" onClick={onCancel} className="cancel-btn">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;
