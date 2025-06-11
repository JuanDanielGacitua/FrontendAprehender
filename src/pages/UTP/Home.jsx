// src/pages/UTP/Home.jsx

import React, { useState, useEffect } from "react";
import "../../styles/UTP/Home.css";
import studentService from "../../services/studentService";
import teacherService from "../../services/teacherService";
import api from "../../services/api";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28", "#FF6384", "#36A2EB"];

const UTPHome = () => {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    studentService
      .getAll()
      .then((students) => setStudents(students))
      .catch(console.error);

    teacherService
      .getAll()
      .then((teachers) => setTeachers(teachers))
      .catch(console.error);

    api
      .get("/subjects")
      .then((res) => setSubjects(res.data))
      .catch(console.error);
  }, []);

  // Mapeo subjectId -> subjectName
  const subjectNames = {};
  subjects.forEach((subject) => {
    subjectNames[subject.id] = subject.name;
  });
  subjectNames["Sin asignatura"] = "Sin asignatura";

  // Distribución por asignatura
  const subjectCounts = {};
  teachers.forEach((teacher) => {
    const subjectId = teacher.subjectId || "Sin asignatura";
    subjectCounts[subjectId] = (subjectCounts[subjectId] || 0) + 1;
  });

  const chartData = Object.keys(subjectCounts).map((subjectId) => ({
    name: subjectNames[subjectId] || subjectId,
    value: subjectCounts[subjectId],
  }));

  // Distribución de estudiantes por nivel
  const levelCounts = {};
  students.forEach((student) => {
    const level = student.level || "Sin nivel";
    levelCounts[level] = (levelCounts[level] || 0) + 1;
  });

  const studentLevelData = Object.keys(levelCounts).map((level) => ({
    name: `Nivel ${level}`,
    value: levelCounts[level],
  }));

  // Últimos 3 docentes
  const latestTeachers = teachers.slice(-3).reverse();

  // Últimos 3 estudiantes
  const latestStudents = students.slice(-3).reverse();

  return (
    <div className="home-container">
      <h1>Bienvenido(a), Jefe UTP</h1>
      <p className="subtitle">Resumen general de docentes y estudiantes.</p>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <h3>Total Docentes</h3>
          <p className="summary-value">{teachers.length}</p>
        </div>

        <div className="summary-card">
          <h3>Total Estudiantes</h3>
          <p className="summary-value">{students.length}</p>
        </div>
      </div>

      {/* Gráfico docentes */}
      <div className="chart-section">
        <h2>Distribución de Docentes por Asignatura</h2>
        {chartData.length > 0 ? (
          <PieChart width={400} height={300}>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        ) : (
          <p>No hay docentes registrados para mostrar gráfico.</p>
        )}
      </div>

      {/* Gráfico estudiantes */}
      <div className="chart-section">
        <h2>Distribución de Estudiantes por Nivel</h2>
        {studentLevelData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={studentLevelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>No hay estudiantes registrados para mostrar gráfico.</p>
        )}
      </div>

      {/* Últimas Novedades */}
      <div className="latest-section">
        <div className="latest-box">
          <h3>Últimos Docentes</h3>
          {latestTeachers.length > 0 ? (
            latestTeachers.map((teacher) => (
              <div key={teacher.id} className="latest-item">
                <strong>{teacher.name}</strong> —{" "}
                {subjectNames[teacher.subjectId] || teacher.subjectId}
              </div>
            ))
          ) : (
            <p>No hay novedades de docentes.</p>
          )}
        </div>

        <div className="latest-box">
          <h3>Últimos Estudiantes</h3>
          {latestStudents.length > 0 ? (
            latestStudents.map((student) => (
              <div key={student.id} className="latest-item">
                <strong>{student.nombre}</strong> — Nivel {student.level}
              </div>
            ))
          ) : (
            <p>No hay novedades de estudiantes.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UTPHome;
