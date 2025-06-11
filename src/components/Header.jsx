import React from "react";

const Header = () => {
  const fecha = new Date().toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="header">
      <h1>AsistenciaDocente</h1>
      <span className="fecha-header">{fecha}</span>
    </header>
  );
};

export default Header;