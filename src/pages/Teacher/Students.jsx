import React, { useEffect, useState } from "react";
import "../../styles/Students.css";
import studentService from "../../services/studentService";
import { getUserFromStorage } from "../../utils/userUtils";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  // Filtro por nombre
  const filteredByName = filteredStudents.filter(est =>
    est.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1>Listado de Estudiantes</h1>
      <p>Estos son los estudiantes registrados en el sistema.</p>
      <input
        type="text"
        placeholder="Buscar estudiante por nombre..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 18, padding: 10, borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: 16, width: 320 }}
      />
      {loading ? (
        <p>Cargando estudiantes...</p>
      ) : filteredByName.length === 0 ? (
        <p>No hay estudiantes registrados para esta asignatura.</p>
      ) : (
        <table className="tabla-asistencias">
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
            {filteredByName.map((est) => (
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
