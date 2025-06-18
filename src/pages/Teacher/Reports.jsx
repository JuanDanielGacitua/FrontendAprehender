import React, { useState, useEffect } from "react";
// import Layout from "../../components/Layout"; // Eliminado para evitar duplicado
import studentService from "../../services/studentService";
import { getUserFromStorage } from "../../utils/userUtils";
import * as XLSX from "xlsx";
import "../../styles/Students.css";
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

const REPORT_TYPES = [
  { value: "attendance", label: "Reporte de Asistencia" },
  { value: "students", label: "Reporte de Estudiantes" },
  { value: "summary", label: "Reporte de Resumen General" },
];

const Reports = () => {
  const [reportType, setReportType] = useState("attendance");
  const [attendanceData, setAttendanceData] = useState([]);
  const [studentsData, setStudentsData] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = getUserFromStorage();
  const subjectId = user?.subject?.id;
  const last7Days = getLast7Days();

  // Cargar datos según el tipo de reporte
  useEffect(() => {
    setLoading(true);
    if (reportType === "attendance" && subjectId) {
      studentService.getSubjectActivity(subjectId)
        .then((res) => {
          setAttendanceData(res);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else if (reportType === "students") {
      studentService.getStudentsWithProgress()
        .then((res) => {
          setStudentsData(res);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else if (reportType === "summary" && subjectId) {
      // Resumen general mejorado: asistencia diaria de la última semana
      Promise.all([
        studentService.getStudentsWithProgress(),
        studentService.getSubjectActivity(subjectId),
      ]).then(([students, attendance]) => {
        const totalEstudiantes = students.filter(est => Array.isArray(est.subjectId) && est.subjectId.includes(subjectId)).length;
        // Calcular asistencia diaria para los últimos 7 días
        const last7DaysArr = getLast7Days();
        const asistenciaPorDia = last7DaysArr.map(dia => {
          let cantidad = 0;
          attendance.forEach(est => {
            const diaEst = est.dias.find(x => x.fecha === dia.fecha);
            if (diaEst && diaEst.cantidad > 0) cantidad++;
          });
          return { fecha: dia.fecha, nombre: dia.nombre, cantidad };
        });
        setSummaryData({
          totalEstudiantes,
          asistenciaPorDia,
        });
        setLoading(false);
      }).catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [reportType, subjectId]);

  // Exportar a Excel
  const handleExport = () => {
    let ws, wb, data = [];
    if (reportType === "attendance") {
      data = attendanceData.map(est => {
        const row = {
          Estudiante: est.nombre,
        };
        last7Days.forEach(d => {
          const dia = est.dias.find(x => x.fecha === d.fecha);
          row[`${d.nombre} (${d.fecha})`] = dia ? `✔ (${dia.cantidad} logs, ${Math.round((dia.duracion || 0) / 60)} min)` : "✘";
        });
        row["Total Conexiones"] = est.cantidadLogs;
        row["Minutos Totales"] = Math.round((est.duracionTotal || 0) / 60);
        return row;
      });
    } else if (reportType === "students") {
      // Filtrar estudiantes por subjectId también para el Excel
      const filteredStudents = studentsData.filter(est => Array.isArray(est.subjectId) && est.subjectId.includes(subjectId));
      data = filteredStudents.map(est => ({
        Nombre: est.nombre,
        Curso: Array.isArray(est.cursos) ? est.cursos.join(", ") : est.cursos,
        Nivel: est.nivel,
        Experiencia: est.experiencia,
        Progreso: `${est.progreso}%`,
        "Ejercicios Respondidos": `${est.respondidos} / ${est.totalEjercicios}`,
      }));
    } else if (reportType === "summary" && summaryData) {
      // Mostrar tabla de asistencia diaria de la última semana
      data = [
        { "Total Estudiantes": summaryData.totalEstudiantes },
        ...summaryData.asistenciaPorDia.map(dia => ({
          "Día": dia.nombre,
          "Fecha": dia.fecha,
          "Asistentes": dia.cantidad,
        })),
      ];
    }
    ws = XLSX.utils.json_to_sheet(data);
    wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reporte");
    XLSX.writeFile(wb, `reporte_${reportType}.xlsx`);
  };

  // Renderizado de tablas
  const renderTable = () => {
    if (loading) return <p>Cargando datos...</p>;
    if (reportType === "attendance") {
      return (
        <table className="tabla-asistencias">
          <thead>
            <tr>
              <th>Estudiante</th>
              {last7Days.map((d) => (
                <th key={d.fecha}>{d.nombre}<br /><span style={{ fontSize: 12, color: '#888' }}>{d.fecha}</span></th>
              ))}
              <th>Total Conexiones</th>
              <th>Minutos Totales</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((est) => (
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
            ))}
          </tbody>
        </table>
      );
    } else if (reportType === "students") {
      // Filtrar estudiantes por subjectId
      const filteredStudents = studentsData.filter(est => Array.isArray(est.subjectId) && est.subjectId.includes(subjectId));
      return (
        <table className="tabla-asistencias">
          <thead>
            <tr>
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
                <td>{est.nombre}</td>
                <td>{Array.isArray(est.cursos) ? est.cursos.join(", ") : est.cursos}</td>
                <td>{est.nivel}</td>
                <td>{est.experiencia}</td>
                <td>
                  <progress value={est.progreso} max={100}></progress>
                  <span style={{ marginLeft: 8 }}>{est.progreso}%</span>
                </td>
                <td>{est.respondidos} / {est.totalEjercicios}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else if (reportType === "summary" && summaryData) {
      // Mostrar tabla de asistencia diaria de la última semana
      return (
        <>
          <table className="tabla-asistencias" style={{ marginBottom: 24 }}>
            <thead>
              <tr>
                <th>Total Estudiantes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{summaryData.totalEstudiantes}</td>
              </tr>
            </tbody>
          </table>
          <table className="tabla-asistencias">
            <thead>
              <tr>
                <th>Día</th>
                <th>Fecha</th>
                <th>Asistentes</th>
              </tr>
            </thead>
            <tbody>
              {summaryData.asistenciaPorDia.map((dia, idx) => (
                <tr key={idx}>
                  <td>{dia.nombre}</td>
                  <td>{dia.fecha}</td>
                  <td>{dia.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      );
    } else {
      return <p>No hay datos para mostrar.</p>;
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginBottom: 8 }}>Reportes</h1>
      <p style={{ marginBottom: 24 }}>Visualiza o exporta los reportes de asistencia, estudiantes o resumen general.</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <select
          value={reportType}
          onChange={e => setReportType(e.target.value)}
          style={{
            padding: '10px 18px',
            borderRadius: 8,
            border: '1px solid #d1d5db',
            fontSize: 16,
            background: '#f9fafb',
            color: '#222',
            outline: 'none',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            transition: 'border 0.2s',
          }}
        >
          {REPORT_TYPES.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <button
          onClick={handleExport}
          style={{
            background: 'linear-gradient(90deg, #2563eb 0%, #1e40af 100%)',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '10px 24px',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(37,99,235,0.08)',
            transition: 'background 0.2s',
          }}
        >
          Exportar a Excel
        </button>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', padding: 24 }}>
        {renderTable()}
      </div>
    </div>
  );
};

export default Reports;