import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/Attendance.css";


const Attendance = () => {
  const [attendances, setAttendances] = useState([]);

  useEffect(() => {
    console.log("useEffect ejecutado"); // ← DEBE aparecer
    api.get("/attendance/lista")
      .then((res) => {
        console.log("Datos recibidos:", res.data);
        setAttendances(res.data);
      })
      .catch((err) => console.error("Error al cargar asistencia:", err));
  }, []);

  return (
    <div>
      <h1>Control de Asistencias</h1>
      <p>Visualiza aquí los estudiantes que han registrado su asistencia.</p>

      <pre>{JSON.stringify(attendances, null, 2)}</pre> {/* Mostrar datos directamente */}

      <table className="tabla-asistencias">
        <thead>
          <tr>
            <th>Estudiante</th>
            <th>Curso</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {attendances.length > 0 ? (
            attendances.map((a, i) => (
              <tr key={i}>
                <td>{a.nombreEstudiante}</td>
                <td>{a.curso}</td>
                <td>{new Date(a.fecha).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">Cargando datos...</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Attendance;
