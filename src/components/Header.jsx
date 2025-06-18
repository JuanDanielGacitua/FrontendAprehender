import React from "react";
import { getUserFromStorage } from "../utils/userUtils";

const Header = () => {
  const fecha = new Date().toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const user = getUserFromStorage();
  // Mostrar teacher.name si existe, luego nombre, name, username o email
  const nombreUsuario = user?.teacher?.name || user?.nombre || user?.name || user?.username || user?.email || "Usuario";

  return (
    <header className="header">
      <h1>Asistencia Docente</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginLeft: 'auto' }}>
        <span className="nombre-usuario">{nombreUsuario}</span>
        <span className="fecha-header">{fecha}</span>
      </div>
    </header>
  );
};

export default Header;