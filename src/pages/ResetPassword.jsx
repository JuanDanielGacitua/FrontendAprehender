import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/ResetPassword.css";
import logo from "../assets/logo.png";
import sideImage from "../assets/fondoLogin.jpeg";
import authService from "../services/authService";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (!tokenFromUrl) {
      Swal.fire({
        icon: "error",
        title: "Enlace inválido",
        text: "El enlace de restablecimiento no es válido.",
      }).then(() => {
        navigate("/forgot-password");
      });
      return;
    }
    
    // Verificar que el token sea válido
    const verifyToken = async () => {
      try {
        await authService.verifyResetToken(tokenFromUrl);
        setToken(tokenFromUrl);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Token inválido o expirado",
          text: "El enlace de restablecimiento no es válido o ha expirado.",
        }).then(() => {
          navigate("/forgot-password");
        });
      }
    };
    
    verifyToken();
  }, [searchParams, navigate]);

  const validatePassword = (password) => {
    const minLength = 6;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumbers = /\d/.test(password);

    return {
      isValid: password.length >= minLength && hasLetter && hasNumbers,
      errors: {
        length: password.length < minLength,
        letter: !hasLetter,
        numbers: !hasNumbers,
      }
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Contraseñas no coinciden",
        text: "Las contraseñas ingresadas no son iguales.",
      });
      return;
    }

    // Validar fortaleza de la contraseña
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      Swal.fire({
        icon: "warning",
        title: "Contraseña débil",
        html: `
          <p>La contraseña debe cumplir con los siguientes requisitos:</p>
          <ul style="text-align: left; margin: 10px 0;">
            ${passwordValidation.errors.length ? '<li>Mínimo 6 caracteres</li>' : ''}
            ${passwordValidation.errors.letter ? '<li>Al menos una letra</li>' : ''}
            ${passwordValidation.errors.numbers ? '<li>Al menos un número</li>' : ''}
          </ul>
        `,
      });
      return;
    }

    setIsLoading(true);

    try {
      Swal.fire({
        title: "Restableciendo contraseña...",
        text: "Por favor espera",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Llamada al backend
      await authService.resetPassword(token, formData.password);

      Swal.close();
      
      Swal.fire({
        icon: "success",
        title: "¡Contraseña actualizada!",
        text: "Tu contraseña ha sido restablecida exitosamente.",
        confirmButtonText: "Ir al login",
      }).then(() => {
        navigate("/login");
      });

    } catch (error) {
      console.error("Error al restablecer contraseña:", error);
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Error al restablecer contraseña",
        text: "No se pudo restablecer la contraseña. El enlace puede haber expirado.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordValidation = validatePassword(formData.password);

  return (
    <div className="reset-password-bg">
      <div className="reset-password-wrapper">
        <div className="reset-password-left">
          <img src={sideImage} alt="Decoración visual" />
        </div>

        <div className="reset-password-right">
          <div className="reset-password-form">
            <img src={logo} alt="Logo" className="logo" />
            <h2>Nueva Contraseña</h2>
            <p className="description">
              Ingresa tu nueva contraseña. Asegúrate de que sea segura y fácil de recordar.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="password">Nueva Contraseña</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Ingresa tu nueva contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
                
                {/* Indicador de fortaleza de contraseña */}
                {formData.password && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div 
                        className={`strength-fill ${passwordValidation.isValid ? 'strong' : 'weak'}`}
                        style={{ width: `${Math.min(100, (formData.password.length / 6) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="strength-text">
                      {passwordValidation.isValid ? 'Contraseña fuerte' : 'Contraseña débil'}
                    </div>
                  </div>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirma tu nueva contraseña"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <span className="error-text">Las contraseñas no coinciden</span>
                )}
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isLoading || !passwordValidation.isValid || formData.password !== formData.confirmPassword}
              >
                {isLoading ? "Actualizando..." : "Actualizar Contraseña"}
              </button>
            </form>

            <div className="requirements">
              <h4>Requisitos de la contraseña:</h4>
              <ul>
                <li className={formData.password.length >= 6 ? 'valid' : 'invalid'}>
                  Mínimo 6 caracteres
                </li>
                <li className={/[a-zA-Z]/.test(formData.password) ? 'valid' : 'invalid'}>
                  Al menos una letra
                </li>
                <li className={/\d/.test(formData.password) ? 'valid' : 'invalid'}>
                  Al menos un número
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 