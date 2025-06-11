import React, { useEffect, useState } from "react";
import "../../styles/Students.css";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/students.json") // Reemplaza con Supabase cuando lo integres
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar estudiantes:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1>Listado de Estudiantes</h1>
      <p>Estos son los estudiantes registrados en el sistema.</p>

      {loading ? (
        <p>Cargando estudiantes...</p>
      ) : students.length === 0 ? (
        <p>No hay estudiantes registrados.</p>
      ) : (
        <table className="tabla-estudiantes">
          <thead>
            <tr>
              <th>Estudiante</th>
              <th>Nombre</th>
              <th>Curso</th>
              <th>Nivel</th>
              <th>Progreso</th>
              <th>Registrado</th>
            </tr>
          </thead>
          <tbody>
            {students.map((est) => (
              <tr key={est.id}>
                <td>
                  <img
                    src="/avatar.jpeg"
                    alt="perfil"
                    className="student-avatar"
                  />
                </td>
                <td>{est.name}</td>
                <td>{est.course}</td>
                <td>{est.levelCurrent}</td>
                <td>
                  <progress
                    value={est.experienceCurrent}
                    max={est.experienceNeeded}
                  ></progress>
                </td>
                <td>{new Date(est.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Students;
