import React, { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ResumenTabla = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/data/dashboard.json")
      .then((res) => res.json())
      .then((json) => setData(json.resumenCursos));
  }, []);

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>Distribución de Estudiantes por Curso</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="estudiantes"
            nameKey="nombre"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <table style={{ width: "100%", marginTop: "1rem", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Curso</th>
            <th>Estudiantes</th>
          </tr>
        </thead>
        <tbody>
          {data.map((curso, idx) => (
            <tr key={idx}>
              <td>{curso.nombre}</td>
              <td>{curso.estudiantes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResumenTabla;
