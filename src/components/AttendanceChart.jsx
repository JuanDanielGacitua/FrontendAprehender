import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

const AttendanceChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/data/dashboard.json")
      .then((res) => res.json())
      .then((json) => setData(json.asistenciaPorCurso));
  }, []);

  return (
    <div style={{ width: "100%", height: 300, marginTop: "2rem" }}>
      <h3>Asistencia por Curso (%)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="curso" />
          <YAxis unit="%" />
          <Tooltip />
          <Bar dataKey="porcentaje" fill="#007acc" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;
