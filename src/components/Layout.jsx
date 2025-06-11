import React from "react";
import { Outlet } from "react-router-dom";
import "../styles/Layout.css";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="layout">
      <Sidebar />

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

export default Layout;
