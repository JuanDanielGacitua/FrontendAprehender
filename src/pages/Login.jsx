// src/pages/Teacher/Login.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Login.css";
import logo from "../assets/logo.png";
import sideImage from "../assets/fondoLogin.jpeg";
import { useAuth } from "../contexts/AuthContext";
import Swal from "sweetalert2";

const LoginPage = () => {
  const { login, error } = useAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [localError, setLocalError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setLocalError("Debes ingresar usuario y contraseña.");
      return;
    }

    // Mostrar alerta de carga
    Swal.fire({
      title: "Iniciando sesión...",
      text: "Por favor espera",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await login(formData);
      Swal.close(); // Cierra el alert de carga si el login fue exitoso
    } catch (err) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Error de inicio de sesión",
        text: "Credenciales inválidas o error de conexión.",
      });
    }
  };

  return (
    <div className="login-bg">
      <div className="login-wrapper">
        <div className="login-left">
          <img src={sideImage} alt="Decoración visual" />
        </div>

        <div className="login-right">
          <form className="login-form" onSubmit={handleSubmit}>
            <img src={logo} alt="Logo" className="logo" />
            <h2>Iniciar Sesión</h2>

            <input
              type="text"
              name="username"
              placeholder="Usuario o Nick"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="submit">Ingresar</button>

            {(error || localError) && (
              <p className="login-error">
                {localError || error || "Credenciales inválidas o error de conexión."}
              </p>
            )}

            <div className="login-links">
              <Link to="/forgot-password" className="forgot-password-link">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
