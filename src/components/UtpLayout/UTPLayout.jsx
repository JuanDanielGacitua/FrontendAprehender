import React from "react";
import { Outlet } from "react-router-dom";
import SidebarUTP from "./SidebarUTP";
import Header from "../Header";
import "../../styles/Layout.css"; // Reutiliza estilos existentes

const UTPLayout = () => {
  return (
    <div className="layout">
      <SidebarUTP />

      <main className="main-content">
        <Header>
          <h1>AsistenciaDocente</h1>
        </Header>

        <section className="page-content">
          <Outlet />
        </section>

        <footer className="footer">
          <p>© 2025 Zorrecursos. Plataforma docente. Versión 1.0</p>
        </footer>
      </main>
    </div>
  );
};

export default UTPLayout;
