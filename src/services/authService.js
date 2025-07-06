// src/services/authService.js

import api from "./api";

// Logueo: envía { nick, password } a /auth/login y guarda token + user en localStorage
const login = async ({ nick: username, password }) => {
  try {
    const response = await api.post("/auth/login", { 
        username, 
        password });
    console.log("Respuesta completa del login:", response.data);
    const { token, user } = response.data;

    // Guardamos en localStorage para que el interceptor lo anexe
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    return user;
  } catch (err) {
    console.error("Error en authService.login:", err); // 👈 esta línea la agregas
    throw err; // Propaga el error para que el AuthContext lo maneje
  }
};

// Logout: elimina ambos items
const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Solicitar restablecimiento de contraseña
const forgotPassword = async (email) => {
  try {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  } catch (err) {
    console.error("Error en authService.forgotPassword:", err);
    throw err;
  }
};

// Restablecer contraseña con token
const resetPassword = async (token, password) => {
  try {
    const response = await api.post("/auth/reset-password", { 
      token, 
      password 
    });
    return response.data;
  } catch (err) {
    console.error("Error en authService.resetPassword:", err);
    throw err;
  }
};

// Verificar token de restablecimiento
const verifyResetToken = async (token) => {
  try {
    const response = await api.get(`/auth/verify-reset-token/${token}`);
    return response.data;
  } catch (err) {
    console.error("Error en authService.verifyResetToken:", err);
    throw err;
  }
};

const authService = {
  login,
  logout,
  forgotPassword,
  resetPassword,
  verifyResetToken,
};

export default authService;
