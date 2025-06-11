import React from 'react';

const MaterialForm = () => {
  return (
    <form className="material-form">
      <label>Nombre del material
        <input type="text" name="titulo" required />
      </label>
      <label>Tipo
        <select name="tipo">
          <option value="pdf">PDF</option>
          <option value="video">Video</option>
          <option value="link">Enlace</option>
        </select>
      </label>
      <label>Contenido
        <input type="text" name="contenido" placeholder="URL o archivo" />
      </label>
      <button type="submit">Guardar Material</button>
    </form>
  );
};

export default MaterialForm;
