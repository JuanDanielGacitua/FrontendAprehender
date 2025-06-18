import React, { useEffect, useState } from "react";
import studentService from "../../services/studentService";
import { getUserFromStorage } from "../../utils/userUtils";
import "../../styles/Attendance.css";

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

function getLast7Days() {
  const days = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push({
      fecha: d.toISOString().slice(0, 10),
      nombre: diasSemana[d.getDay() === 0 ? 6 : d.getDay() - 1],
    });
  }
  return days;
}

const Attendance = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getUserFromStorage();
  const subjectId = user?.subject?.id;
  const last7Days = getLast7Days();

  useEffect(() => {
    if (!subjectId) return;
    studentService.getSubjectActivity(subjectId)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar asistencia:", err);
        setLoading(false);
      });
  }, [subjectId]);

  return (
    <div>
      <h1>Asistencia semanal</h1>
      <p>Visualiza la asistencia y actividad de tus estudiantes en la última semana.</p>
      {loading ? (
        <p>Cargando datos...</p>
      ) : (
        <table className="tabla-asistencias">
          <thead>
            <tr>
              <th>Estudiante</th>
              {last7Days.map((d) => (
                <th key={d.fecha}>
                  <div>{d.nombre}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>{d.fecha}</div>
                </th>
              ))}
              <th>Total Conexiones</th>
              <th>Minutos Totales</th>
            </tr>
          </thead>
          <tbody>
            {data.map((est) => {
              // Mapear días a actividad
              let totalLogs = 0;
              let totalMin = 0;
              return (
                <tr key={est.studentId}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <img
                      src={est.profilePicture || "/avatar.jpeg"}
                      alt="perfil"
                      className="student-avatar"
                      style={{ width: 36, height: 36, borderRadius: '50%' }}
                    />
                    <span>{est.nombre}</span>
                  </td>
                  {last7Days.map((d) => {
                    const dia = est.dias.find(x => x.fecha === d.fecha);
                    totalLogs += dia ? dia.cantidad : 0;
                    totalMin += dia ? Math.round((dia.duracion || 0) / 60) : 0;
                    return (
                      <td key={d.fecha} style={{ textAlign: 'center' }}>
                        {dia ? (
                          <>
                            <span style={{ color: '#22c55e', fontWeight: 700, fontSize: 18 }}>✔</span>
                            <div style={{ fontSize: 12, color: '#2563eb' }}>{dia.cantidad} logs</div>
                            <div style={{ fontSize: 12, color: '#555' }}>{Math.round((dia.duracion || 0) / 60)} min</div>
                          </>
                        ) : (
                          <span style={{ color: '#ef4444', fontWeight: 700, fontSize: 18 }}>✘</span>
                        )}
                      </td>
                    );
                  })}
                  <td style={{ fontWeight: 700 }}>{est.cantidadLogs}</td>
                  <td style={{ fontWeight: 700 }}>{Math.round((est.duracionTotal || 0) / 60)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Attendance;
