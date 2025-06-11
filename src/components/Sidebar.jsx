import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/Sidebar.css"; 
import { useAuth } from "../contexts/AuthContext";

const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="nav-wrapper">
        <ul className="sidebar-nav">
          <li><Link to="/home">Inicio</Link></li>
          <li><Link to="/home/cursos">Cursos</Link></li>
          <li><Link to="/home/estudiantes">Estudiantes</Link></li>
          <li><Link to="/home/asistencias">Asistencias</Link></li>
          <li><Link to="/home/reportes">Reportes</Link></li>
          <li><Link to="/home/configuracion">Configuración</Link></li>
        </ul>
      </div>
      <div className="logout-container">
        <button onClick={logout} className="logout-btn">
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
