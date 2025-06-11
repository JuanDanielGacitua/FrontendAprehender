import React from "react";
import Layout from "../../components/Layout";
const Dashboard = () => {
  return (
    <Layout>
      <h2>Bienvenido, profesor</h2>
      <ul>
        <li>Total Cursos: 3</li>
        <li>Estudiantes activos: 45</li>
        <li>Asistencia promedio: 81.4%</li>
      </ul>
    </Layout>
  );
};

export default Dashboard;