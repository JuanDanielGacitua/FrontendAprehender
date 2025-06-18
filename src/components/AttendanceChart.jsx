import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";
import studentService from "../services/studentService";
import { getUserFromStorage } from "../utils/userUtils";

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

function getCurrentWeekDays() {
  const days = [];
  const today = new Date();
  const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay(); // 1 (lunes) a 7 (domingo)
  for (let i = 1; i <= dayOfWeek; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - (dayOfWeek - i));
    days.push({
      fecha: d.toISOString().slice(0, 10),
      nombre: diasSemana[d.getDay() === 0 ? 6 : d.getDay() - 1],
    });
  }
  return days;
}

const AttendanceChart = () => {
  const [data, setData] = useState([]);
  const user = getUserFromStorage();
  const subjectId = user?.subject?.id;
  const last7Days = getCurrentWeekDays();

  useEffect(() => {
    if (!subjectId) return;
    studentService.getSubjectActivity(subjectId)
      .then((res) => {
        // Para cada estudiante, calcular el % de asistencia acumulado hasta el día más reciente
        const chartData = res.map(est => {
          // Contar días con asistencia
          const diasConAsistencia = last7Days.filter(d => {
            const dia = est.dias.find(x => x.fecha === d.fecha);
            return dia && dia.cantidad > 0;
          }).length;
          const porcentaje = Math.round((diasConAsistencia / last7Days.length) * 100);
          return {
            estudiante: est.nombre,
            porcentaje
          };
        });
        setData(chartData);
      });
  }, [subjectId]);

  return (
    <div style={{ width: "100%", height: 300, marginTop: "2rem" }}>
      <h3>Asistencia por Estudiante (%)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="estudiante" />
          <YAxis unit="%" />
          <Tooltip />
          <Bar dataKey="porcentaje" fill="#007acc" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;
