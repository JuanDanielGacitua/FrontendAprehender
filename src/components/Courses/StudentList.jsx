import React, { useEffect, useState } from "react";

const StudentList = ({ courseId }) => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch("/data/students.json")
      .then((res) => res.json())
      .then((data) => {
        const filtrados = data.filter((s) => s.courseId === courseId);
        setStudents(filtrados);
      })
      .catch((err) => console.error("Error cargando estudiantes:", err));
  }, [courseId]);

  return (
    <div className="course-card">
      <h3>Estudiantes Asignados</h3>
      {students.length > 0 ? (
        <ul>
          {students.map((s) => (
            <li key={s.id}>{s.name}</li>
          ))}
        </ul>
      ) : (
        <p>No hay estudiantes asignados.</p>
      )}
    </div>
  );
};

export default StudentList;
