import React, { useEffect, useState } from "react";
import "../../styles/Students.css";
import studentService from "../../services/studentService";
import { getUserFromStorage } from "../../utils/userUtils";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = getUserFromStorage();
  const subjectId = user?.subject?.id;

  useEffect(() => {
    studentService.getStudentsWithProgress()
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar estudiantes:", err);
        setLoading(false);
      });
  }, []);

  // Filtrar estudiantes por subjectId
  const filteredStudents = students.filter(est =>
    Array.isArray(est.subjectId) && est.subjectId.includes(subjectId)
  );

  return (
    <div>
      <h1>Listado de Estudiantes</h1>
      <p>Estos son los estudiantes registrados en el sistema.</p>

      {loading ? (
        <p>Cargando estudiantes...</p>
      ) : filteredStudents.length === 0 ? (
        <p>No hay estudiantes registrados para esta asignatura.</p>
      ) : (
        <table className="tabla-estudiantes">
          <thead>
            <tr>
              <th>Estudiante</th>
              <th>Nombre</th>
              <th>Curso</th>
              <th>Nivel</th>
              <th>Experiencia</th>
              <th>Progreso</th>
              <th>Ejercicios Respondidos</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((est) => (
              <tr key={est.id}>
                <td>
                  <img
                    src={est.profilePicture || "/avatar.jpeg"}
                    alt="perfil"
                    className="student-avatar"
                  />
                </td>
                <td>{est.nombre}</td>
                <td>{Array.isArray(est.cursos) ? est.cursos.join(", ") : est.cursos}</td>
                <td>{est.nivel}</td>
                <td>{est.experiencia}</td>
                <td>
                  <progress
                    value={est.progreso}
                    max={100}
                  ></progress>
                  <span style={{ marginLeft: 8 }}>{est.progreso}%</span>
                </td>
                <td>{est.respondidos} / {est.totalEjercicios}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Students;
