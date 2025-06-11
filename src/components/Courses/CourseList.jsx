import React, { useEffect, useState } from "react";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    fetch("/data/courses.json")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error("Error cargando cursos:", err));

    fetch("/data/subjects.json")
      .then((res) => res.json())
      .then((data) => setSubjects(data))
      .catch((err) => console.error("Error cargando asignaturas:", err));

    fetch("/data/teachers.json")
      .then((res) => res.json())
      .then((data) => setTeachers(data))
      .catch((err) => console.error("Error cargando profesores:", err));
  }, []);

  const obtenerNombreAsignatura = (subjectId) => {
    const subject = subjects.find((s) => s.id === subjectId);
    return subject ? subject.name : "Asignatura no encontrada";
  };

  const obtenerNombreProfesor = (teacherId) => {
    const teacher = teachers.find((t) => t.id === teacherId);
    return teacher ? teacher.name : "Profesor no encontrado";
  };

  return (
    <div className="course-list">
      <h2>Listado de Cursos</h2>
      <p>Estos son los cursos registrados en el sistema:</p>
      {courses.map((curso) => (
        <div key={curso.id} className="course-card">
          <h3>{curso.grade}</h3>
          <p><strong>Asignatura:</strong> {obtenerNombreAsignatura(curso.subject)}</p>
          <p><strong>Profesor:</strong> {obtenerNombreProfesor(curso.teacherId)}</p>
          <p><strong>Fecha de creación:</strong> {new Date(curso.createdAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default CourseList;
