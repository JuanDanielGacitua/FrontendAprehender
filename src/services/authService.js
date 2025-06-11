// src/services/authService.js

import api from "./api";

// Logueo: envía { nick, password } a /auth/login y guarda token + user en localStorage
const login = async ({ nick, password }) => {
  try {
    const response = await api.post("/auth/login", { 
        username: nick, 
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

const authService = {
  login,
  logout,
};

export default authService;
