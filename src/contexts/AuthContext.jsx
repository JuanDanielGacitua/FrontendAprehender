// src/contexts/AuthContext.jsx

import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import api from "../services/api";
import Swal from "sweetalert2";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [error, setError] = useState(null);

  const login = async ({ username, password }) => {
    try {
      const loggedUser = await authService.login({ nick: username, password });

      // Guarda token (si tu authService.login ya guarda el token en localStorage, no hace falta repetir aquí)
      const token = localStorage.getItem("token");

      // 🚩 Hacer GET /users/{id} para obtener schoolId
      const response = await api.get(`/users/${loggedUser.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Construir el user completo
      const fullUser = {
        ...loggedUser,
        schoolId: response.data.schoolId, // aquí agregas el schoolId
      };

      console.log("Respuesta completa del login:", fullUser);

      // Guardar en localStorage
      localStorage.setItem("user", JSON.stringify(fullUser));

      // Actualizar state
      setUser(fullUser);
      setError(null);

      // Redirección según rol
      if (fullUser.role === "SUPERADMIN") {
        navigate("/superadmin/register-utp");
      } else if (fullUser.role === "UTP") {
        navigate("/utp/home");
      } else if (fullUser.role === "TEACHER") {
        navigate("/home");
      } else if (fullUser.role === "STUDENT") {
        // Mostrar alerta bonita con SweetAlert2 y esperar interacción
        await Swal.fire({
          icon: 'info',
          title: 'Acceso solo desde la app móvil',
          text: 'Los estudiantes deben ingresar solo desde la app móvil, no desde la web.',
          confirmButtonText: 'Entendido',
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        navigate("/login");
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.error("Error en login:", err);

      if (err.response && err.response.status === 401) {
        setError("Credenciales inválidas");
        throw new Error("Credenciales inválidas");
      } else {
        setError("Error de conexión o servidor");
        throw new Error("Error de conexión o servidor");
      }
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
