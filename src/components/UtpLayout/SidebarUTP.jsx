import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import "../../styles/SidebarUtp.css";
import { useAuth } from "../../contexts/AuthContext";

const SidebarUTP = () => {
  const { logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <nav>
        <ul className="sidebar-nav">
          <li><Link to="/utp/home">Inicio</Link></li>
          <li><Link to="/utp/courses">Cursos y Asignaturas</Link></li>
          <li><Link to="/utp/teachers">Docentes</Link></li>
          <li><Link to="/utp/students">Estudiantes</Link></li>
          <li><Link to="/configuracion">Configuración</Link></li>
        </ul>
      </nav>
      <div className="logout-container">
        <button onClick={logout} className="logout-btn">
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default SidebarUTP;
