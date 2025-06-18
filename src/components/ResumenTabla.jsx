import React, { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from "recharts";
import studentService from "../services/studentService";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0", "#FF69B4", "#FFD700"];

const ResumenTabla = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    studentService.getAll()
      .then((students) => {
        // Agrupar estudiantes por nivel
        const niveles = {};
        students.forEach(est => {
          const nivel = est.level || "Sin nivel";
          if (!niveles[nivel]) niveles[nivel] = 0;
          niveles[nivel]++;
        });
        // Convertir a array para el gráfico
        const dataNiveles = Object.entries(niveles).map(([nivel, cantidad]) => ({
          nombre: `Nivel ${nivel}`,
          estudiantes: cantidad
        }));
        setData(dataNiveles);
      });
  }, []);

  const renderCustomLabel = ({ name, value }) => `${name} (${value})`;

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>Distribución de Estudiantes por Nivel</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="estudiantes"
            nameKey="nombre"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={renderCustomLabel}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResumenTabla;
