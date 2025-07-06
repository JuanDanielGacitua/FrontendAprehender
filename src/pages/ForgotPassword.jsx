import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/ForgotPassword.css";
import logo from "../assets/logo.png";
import sideImage from "../assets/fondoLogin.jpeg";
import authService from "../services/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      Swal.fire({
        icon: "warning",
        title: "Campo requerido",
        text: "Por favor ingresa tu correo electrónico.",
      });
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: "warning",
        title: "Email inválido",
        text: "Por favor ingresa un correo electrónico válido.",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Mostrar alerta de carga
      Swal.fire({
        title: "Enviando solicitud...",
        text: "Por favor espera mientras procesamos tu solicitud",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Llamada al backend
      await authService.forgotPassword(email);

      Swal.close();
      
      // Mostrar mensaje de éxito
      Swal.fire({
        icon: "success",
        title: "Solicitud enviada",
        html: `
          <p>Se ha enviado un enlace de restablecimiento a:</p>
          <strong>${email}</strong>
          <br><br>
          <p>Revisa tu bandeja de entrada y sigue las instrucciones.</p>
        `,
        confirmButtonText: "Entendido",
      });

      setEmail("");
    } catch (error) {
      console.error("Error al enviar solicitud:", error);
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Error al enviar solicitud",
        text: "No se pudo enviar la solicitud. Por favor intenta nuevamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-bg">
      <div className="forgot-password-wrapper">
        <div className="forgot-password-left">
          <img src={sideImage} alt="Decoración visual" />
        </div>

        <div className="forgot-password-right">
          <div className="forgot-password-form">
            <img src={logo} alt="Logo" className="logo" />
            <h2>Recuperar Contraseña</h2>
            <p className="description">
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="email">Correo Electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isLoading}
              >
                {isLoading ? "Enviando..." : "Enviar Solicitud"}
              </button>
            </form>

            <div className="links">
              <Link to="/login" className="back-link">
                ← Volver al inicio de sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 